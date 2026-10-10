#!/usr/bin/env python3
"""content_gen.py — the fleet's shared, model-agnostic page-prose generator (Phase 3 backend).

ONE generator for every routine that writes new pages. The MODEL is a config value, not a
code path, so swapping models fleet-wide is one env change:

    CONTENT_MODEL=gemini-3.8-flash          primary  (default)
    CONTENT_FALLBACK_MODEL=gpt-6.1-sol    used ONLY when the primary fails; always logged.
                                            A comma list is an ordered chain, e.g. growth sites:
                                            CONTENT_MODEL=claude-opus-5-5
                                            CONTENT_FALLBACK_MODEL=gemini-3.8-flash,gpt-6.1-sol
    CONTENT_ANTHROPIC_EFFORT=high           Claude effort (adaptive thinking); CONTENT_THINKING
                                            keeps governing the Gemini/OpenAI fallbacks
    CONTENT_ANTHROPIC_KEY / _KEY_2          Claude key POOL: key 2 takes over when key 1 is dry
    CONTENT_THINKING=high                   reasoning effort (gemini thinkingLevel / openai effort)
    CONTENT_SECTION_THINKING=high           ceiling for `section` enrichments (never above CONTENT_THINKING)
    CONTENT_MAX_TOKENS=40000                thinking tokens count against this on Gemini

Provider is inferred from the model name (gemini-* -> Google, gpt-*/o* -> OpenAI,
claude-* -> Anthropic). Standard library only, no dependencies, portable to every repo.

Contract (identical to the getopt generate.py it replaces):
    python3 scripts/lib/content_gen.py preflight
    python3 scripts/lib/content_gen.py write \
        --system reports/<run>/prompts/system.md \
        --prompt reports/<run>/prompts/<slug>.prompt.md \
        --out    reports/<run>/drafts/<slug>.json \
        --slug   <slug> --floor 900 --schema guide \
        [--allowed-urls urls.txt] [--facts facts.md]

Output: <out> = clean, strict JSON page object. <out>.meta.json = provenance: model actually
used, provider, fallback reason, tokens INCLUDING thinking, estimated cost, guard results.

Built-in verify stage = the remediation ladder applied to a returned draft. The Phase 4
adversarial audit still runs after this, unchanged. Never throws a page away for a one-line fix:
  * Rung 0 — REPAIRED IN PLACE and logged in meta.guards.repairs: code fence stripped, JSON
    salvaged from surrounding text, control chars + house style normalised, slug set to the
    expected one, a missing `relatedLinks` inserted (undefined crashes `next build`), any
    external link off the --allowed-urls list stripped (sentence kept, claim flagged).
  * Rung 1 — a missing content field gets an empty placeholder and a FLAG in
    meta.guards.flags for the auditor; untraceable numbers (--facts) are listed there too.
  * Rung 2 — regeneration only for what nobody can repair: a page cut off at MAX_TOKENS
    (the same model is first retried once at double the cap), or output that is not a
    parseable page object (raw text saved beside the draft first).
  * house style on every string: em/en dashes -> commas ("$20–30" -> "$20 to 30"), curly
    quotes -> ASCII. Lifted from humanize_intro.py, so this step supersedes it for pages
    generated here end-to-end.

Claim check (any write/section that carries --facts; CONTENT_FACTCHECK=0 disables): a GROUNDING
block rides on the row prompt, then a verifier call lists every sentence/cell the fact list does
not support with a replacement that only restates it (or "" = delete), spliced in by exact string
replace. A second, final pass DELETES whatever is still unsupported (a table cell becomes "Not
published"; titles, headings, frontmatter and disclosures are never deleted), so the loop ends
without an unchecked rewrite; a first pass that finds >= CONTENT_FACTCHECK_ADAPT (12) claims buys
one extra full read. A replacement carrying a number, link or proper noun that is not in SOURCE
is refused mechanically. It never adds a fact. Logged in meta.guards.claim_check; the unchecked
draft is kept as <out>.precheck. Cost (2026-10-08, gemini-3.8-flash): ~$0.05-0.10 per page; up
to ~$0.23 on a heavily padded draft (thin fact list + low-thinking writer).
Knobs: CONTENT_FACTCHECK_THINKING (medium), CONTENT_FACTCHECK_FINAL_THINKING (low),
CONTENT_FACTCHECK_PASSES (2), CONTENT_FACTCHECK_ADAPT (12; 0 = off), CONTENT_FACT_BUDGET_RATIO.

    python3 scripts/lib/content_gen.py fix --draft <draft> --findings <auditor-findings.txt> \
        --facts <row prompt> [--floor N] [--allowed-urls urls.txt]

`fix` = the remediation ladder's FIX-IN-PLACE rung for Phase 4 findings (claims AND tells): the
model writes each replacement, it is spliced in, then one claim-check pass deletes anything the
replacements left unsupported; backup <draft>.pre-fix-N; findings that need new substance are
listed "NOT FIXABLE IN PLACE" (then Rung 2: source the facts, then regenerate).

Keys: GEMINI_API_KEY | GEMINI_ACCESS_TOKEN | GOOGLE_API_KEY ; OPENAI_API_KEY (or a
per-site OPENAI_API_KEY_<SITE>) ; ANTHROPIC_API_KEY. Read from env, then $CONTENT_SECRETS,
./.env, ~/.claude/secrets.env. Cloud routines export keys from their inline prompt block.

Exit codes: 0 ok; 2 config/credential; 3 API failure (after fallback); 4 draft rejected.
"""
from __future__ import annotations

import argparse
import atexit
import json
import os
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request

# ───────────────────────────── config ─────────────────────────────
# Reasoning effort is HIGH for every writer model (Gemini thinkingLevel, OpenAI reasoning
# effort, Anthropic extended thinking). Standard set 2026-09-06. An empty or unrecognised
# value falls back to "high" rather than silently omitting reasoning; a numeric value is a
# Gemini token budget for deliberate experiments only.
# Per-SITE tier (2026-09-12): a repo may carry `.claude/content-gen.env` (plain KEY=VALUE, no
# secrets) — e.g. CONTENT_THINKING=medium on growing sites while major sites keep "high". Loaded
# here, before the defaults below, with the environment winning over the file. Shipped per repo
# by scripts/sync-content-gen.sh from its MAJOR/growing tier list.
def _load_repo_config() -> None:
    d = pathlib.Path.cwd().resolve()
    for c in [d] + list(d.parents):
        f = c / ".claude" / "content-gen.env"
        if f.exists():
            for line in f.read_text(errors="ignore").splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1); os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
            return
        if (c / ".git").exists():
            return
_load_repo_config()
# OPUS-PRIMARY (2026-10-09): read AFTER the repo file loads — read before it, a CONTENT_MODEL line in
# .claude/content-gen.env was silently ignored.
MODEL = os.environ.get("CONTENT_MODEL", "gemini-3.8-flash")
FALLBACK = os.environ.get("CONTENT_FALLBACK_MODEL", "gpt-6.1-sol")
ANTHROPIC_EFFORT = os.environ.get("CONTENT_ANTHROPIC_EFFORT", "high").strip().lower()
if ANTHROPIC_EFFORT not in ("low", "medium", "high", "xhigh", "max"):
    ANTHROPIC_EFFORT = "high"


def _fallbacks() -> list:
    """FALLBACK as an ordered list (a comma list is a chain), primary and repeats removed."""
    out = []
    for m in (FALLBACK or "").split(","):
        m = m.strip()
        if m and m != MODEL and m not in out:
            out.append(m)
    return out


def _chain() -> list:
    return [MODEL] + _fallbacks()
_t = os.environ.get("CONTENT_THINKING", "high").strip().lower()
THINKING = _t if (_t in ("low", "medium", "high") or _t.lstrip("-").isdigit()) else "high"
if _t and THINKING != _t:
    print(f"[content_gen] WARNING: CONTENT_THINKING={_t!r} not recognised — using 'high'", file=sys.stderr)
# Enrichments (`section`) are short — a median of ~150 output tokens — yet at "high" each one
# spent ~9k thinking tokens: 919 such calls cost as much as 564 whole pages (2026-09-13..30).
# They get their own ceiling; the lower of the two levels wins, so a low-tier site stays low.
# Default "high" = no change; low-tier repos set it in .claude/content-gen.env.
_LEVELS = ("low", "medium", "high")
_st = os.environ.get("CONTENT_SECTION_THINKING", "high").strip().lower()
SECTION_THINKING = _st if _st in _LEVELS else "high"
MAX_TOKENS = int(os.environ.get("CONTENT_MAX_TOKENS", "40000"))
RETRIES = int(os.environ.get("CONTENT_RETRIES", "6"))
BACKOFF_CAP = int(os.environ.get("CONTENT_BACKOFF_CAP", "20"))
FORCE_FALLBACK = os.environ.get("CONTENT_FORCE_FALLBACK") == "1"   # test hook
GEMINI_MODE = os.environ.get("GEMINI_API_MODE", "aistudio").lower()
GEMINI_PROJECT = os.environ.get("GEMINI_PROJECT", "")
GEMINI_LOCATION = os.environ.get("GEMINI_LOCATION", "global")
JSON_MODE = False   # set by complete(json_mode=True): ask the provider for a JSON object
CMD = "complete"    # write | section | complete — recorded in the usage ledger
SCOPE_ON = True     # writer_scope() on the system prompt; complete(writer_scope=False) for non-writer callers (auditors)
TEMPERATURE = 0.7   # Gemini sampling temperature; the claim checker lowers it for its own calls

# USD per 1M tokens (input, output). Thinking bills as output. Override per run with
# CONTENT_RATE_IN / CONTENT_RATE_OUT. Gemini 3.8 Flash intro rate doubles 2027-01-01.
RATES = {
    "gemini-3.8-flash": (0.75, 3.75),
    "gemini-3.5-flash-lite": (0.30, 2.50),
    "gemini-3.1-flash-lite": (0.25, 1.50),
    "gpt-6.1-sol": (2.00, 10.00),
    "gpt-6-sol": (2.00, 10.00),
    "claude-opus-5-5": (4.00, 20.00),
    "claude-sonnet-5-5": (2.00, 10.00),
}
# Cached-input share of the input rate where it differs from CACHED_RATE (Claude cache reads
# bill $0.20 vs $4.00 on Opus 5.5 = 0.05).
CACHED_RATES = {"claude-opus-5-5": 0.05, "claude-sonnet-5-5": 0.10}
# Explicit context caching (2026-09-12): the system prompt is byte-identical for every page in a
# run (~25k tokens), so it is cached ONCE per run and referenced per call. Cached input bills at
# a fraction of the input rate (CONTENT_RATE_CACHED, default 0.10 of input — Google's published
# cached rate for 3.8 Flash, $0.075 vs $0.75, checked 2026-09-30) plus a negligible
# hourly storage fee. CONTENT_CACHE=0 disables; CONTENT_CACHE_MIN_TOKENS is the size floor.
CACHE_ON = os.environ.get("CONTENT_CACHE", "1") != "0"
CACHE_MIN_TOKENS = int(os.environ.get("CONTENT_CACHE_MIN_TOKENS", "4096"))
CACHE_TTL_S = int(os.environ.get("CONTENT_CACHE_TTL", "3600"))
CACHED_RATE = float(os.environ.get("CONTENT_RATE_CACHED", "0.10"))

SECRET_FILES = [os.environ.get("CONTENT_SECRETS", ""), ".env",
                os.path.expanduser("~/.claude/secrets.env")]

SCHEMAS = {
    "guide": ["slug", "metaTitle", "metaDescription", "h1", "subtitle", "introText",
              "sections", "ctaTitle", "ctaText", "ctaButton", "faqItems"],
    "comparison": ["slug", "metaTitle", "metaDescription", "h1", "subtitle", "optionAName",
                   "optionBName", "introText", "comparisonTable", "sections", "verdict",
                   "ctaTitle", "ctaText", "ctaButton", "faqItems", "relatedLinks"],
    "none": [],
}


def die(code: int, msg: str) -> None:
    print(f"[content_gen] ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def log(msg: str) -> None:
    print(f"[content_gen] {msg}", file=sys.stderr)


# ───────────────────────────── usage ledger ─────────────────────────────
# Every billable call is recorded, whatever the entry point (write / section / complete). The
# cron path used to go through complete(), which wrote no meta.json, so radar spend was
# invisible and $16.76 of one day's bill could not be attributed (2026-09-07). Recording at
# generate() — the single choke point — fixes that for every caller at once.
#
#   CONTENT_CALLER      what to attribute the call to (routine/cron name). Crons MUST set it.
#   CONTENT_USAGE_LOG   ledger path; default <repo>/reports/content-gen-usage.jsonl,
#                       else ~/.claude/content-gen-usage.jsonl
#
# TOKENS are the ground truth here; `cost` is null when no rate is known for the model, so a
# missing rate never hides the usage. Discarded attempts (a truncated call whose output we throw
# away, then retry) are recorded too — they bill, and they were the expensive invisible ones.
CALLER = os.environ.get("CONTENT_CALLER", "").strip() or None
_RUN = {"calls": 0, "in": 0, "out": 0, "think": 0, "cost": 0.0, "billable_no_rate": 0}


def _repo_root():
    d = pathlib.Path.cwd().resolve()
    for c in [d] + list(d.parents):
        if (c / ".git").exists():
            return c
    return None


def usage_log_path() -> pathlib.Path:
    p = os.environ.get("CONTENT_USAGE_LOG", "").strip()
    if p:
        return pathlib.Path(p).expanduser()
    root = _repo_root()
    if root and (root / "reports").is_dir():
        return root / "reports" / "content-gen-usage.jsonl"
    return pathlib.Path.home() / ".claude" / "content-gen-usage.jsonl"


def record(r: dict, *, kind: str, discarded: bool = False, note: str = None) -> None:
    """Append one billable call to the ledger. Never raises — accounting must not break a run."""
    try:
        it, ot, tt = r.get("input_tokens"), r.get("output_tokens"), r.get("thinking_tokens")
        ct = r.get("cached_tokens") or 0
        cost = est_cost(r.get("model", "?"), it, ot, tt, ct)
        _RUN["calls"] += 1
        _RUN["in"] += it or 0; _RUN["out"] += ot or 0; _RUN["think"] += tt or 0
        if cost is None and (it or ot):
            _RUN["billable_no_rate"] += 1
        else:
            _RUN["cost"] += cost or 0.0
        row = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),   # UTC, so --since filters match Google's day buckets
            "caller": CALLER, "kind": kind, "model": r.get("model"),
            "provider": r.get("provider"), "input_tokens": it, "output_tokens": ot,
            "thinking_tokens": tt, "cached_tokens": ct, "cost_usd": cost, "thinking": THINKING,
            "cmd": CMD,
            "fallback_used": bool(r.get("fallback_used")), "finish": r.get("finish"),
            "discarded": discarded, "note": note, "repo": (_repo_root().name if _repo_root() else None),
            "response_id": r.get("response_id"),
        }
        p = usage_log_path()
        p.parent.mkdir(parents=True, exist_ok=True)
        with open(p, "a") as f:
            f.write(json.dumps(row) + "\n")
        # Stage it: a routine commits with `git add <paths>; git commit`, so a file that is already
        # staged rides along in that commit without the routine knowing about the ledger. Never
        # commits, never raises, no-op outside a repo or for a ledger outside the repo.
        root = _repo_root()
        if root and str(p.resolve()).startswith(str(root)) and os.environ.get("CONTENT_LEDGER_STAGE", "1") != "0":
            import subprocess
            subprocess.run(["git", "-C", str(root), "add", "--", str(p.resolve())],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=20)
    except Exception as e:  # noqa: BLE001
        print(f"[content_gen] usage ledger unavailable ({type(e).__name__}) — call still ran", file=sys.stderr)


def _run_total() -> None:
    if not _RUN["calls"]:
        return
    unknown = f" ({_RUN['billable_no_rate']} call(s) with no known rate)" if _RUN["billable_no_rate"] else ""
    log(f"RUN TOTAL caller={CALLER or '-'} calls={_RUN['calls']} in={_RUN['in']:,} "
        f"out={_RUN['out']:,} think={_RUN['think']:,} cost≈${_RUN['cost']:.4f}{unknown}")


atexit.register(_run_total)


def load_secrets() -> None:
    for p in SECRET_FILES:
        if not p or not os.path.exists(p):
            continue
        for line in open(p, errors="ignore"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip().removeprefix("export ").strip(),
                                  v.strip().strip('"').strip("'"))


def provider_for(model: str) -> str:
    m = model.lower()
    if m.startswith("gemini"):
        return "gemini"
    if m.startswith("claude"):
        return "anthropic"
    return "openai"


def resolve_key(provider: str) -> tuple[str, str]:
    load_secrets()
    names = {
        "gemini": ("GEMINI_API_KEY", "GEMINI_ACCESS_TOKEN", "GOOGLE_API_KEY"),
        # Site-scoped key first, then the repo default. NEVER a client-scoped key by default
        # (billing attribution is per site — memory: openai-cost-attribution-split).
        "openai": ("CONTENT_OPENAI_KEY", "OPENAI_API_KEY"),
        # Dedicated content keys only (a pool: _KEY_2 takes over when _KEY is out of credit).
        "anthropic": ("CONTENT_ANTHROPIC_KEY", "CONTENT_ANTHROPIC_KEY_2"),
    }[provider]
    for n in names:
        v = os.environ.get(n, "").strip()
        if v:
            return n, v
    raise KeyError(f"no {provider} key; set one of {', '.join(names)}")


# ───────────────────────────── HTTP ─────────────────────────────
def _post(url: str, headers: dict, payload: dict, timeout: int = 900) -> dict:
    body = json.dumps(payload, ensure_ascii=True).encode("utf-8")
    last = None
    for attempt in range(1, RETRIES + 1):
        req = urllib.request.Request(url, data=body, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:600]
            last = f"HTTP {e.code}: {detail}"
            if e.code not in (429, 500, 502, 503, 504) and 400 <= e.code < 500:
                raise RuntimeError(last)
        except Exception as e:  # noqa: BLE001
            last = f"{type(e).__name__}: {e}"
        if attempt < RETRIES:
            wait = min(2 ** attempt, BACKOFF_CAP)
            log(f"retry {attempt}/{RETRIES - 1} in {wait}s ({last[:110]})")
            time.sleep(wait)
    raise RuntimeError(f"all {RETRIES} attempts failed. Last: {last}")


# ───────────────────────────── providers ─────────────────────────────

def _cache_key(model: str, system: str) -> str:
    import hashlib
    return hashlib.sha256((model + "\n" + system).encode()).hexdigest()[:16]


def _cache_file(model: str, system: str) -> pathlib.Path:
    import tempfile
    d = pathlib.Path(tempfile.gettempdir()) / "content_gen_cache"; d.mkdir(parents=True, exist_ok=True)
    return d / (_cache_key(model, system) + ".json")


def _cache_forget(model: str, system: str) -> None:
    try: _cache_file(model, system).unlink()
    except Exception: pass


def _gemini_cache(model: str, system: str, headers: dict):
    """Name of a cachedContents entry holding this system prompt, creating it once per run
    (cross-process: the name lives in a temp file keyed by model+system). None = send inline."""
    if not CACHE_ON or len(system) // 4 < CACHE_MIN_TOKENS:
        return None
    f = _cache_file(model, system)
    try:
        if f.exists():
            d = json.loads(f.read_text())
            if d.get("expires", 0) > time.time() + 90:
                return d["name"]
        body = {"model": f"models/{model}", "systemInstruction": {"parts": [{"text": system}]},
                "ttl": f"{CACHE_TTL_S}s", "displayName": f"content_gen {_cache_key(model, system)}"}
        r = _post("https://generativelanguage.googleapis.com/v1beta/cachedContents", headers, body, timeout=120)
        name = r.get("name")
        if not name:
            return None
        f.write_text(json.dumps({"name": name, "expires": time.time() + CACHE_TTL_S,
                                 "tokens": (r.get("usageMetadata") or {}).get("totalTokenCount")}))
        log(f"cache created {name} (≈{len(system)//4:,} tok system prompt, ttl {CACHE_TTL_S}s) — later pages in this run bill it at {int(CACHED_RATE*100)}%")
        return name
    except Exception as e:  # noqa: BLE001
        log(f"cache unavailable ({type(e).__name__}: {str(e)[:100]}) — sending system prompt inline")
        return None


def call_gemini(model: str, system: str, prompt: str, max_tokens: int, thinking: str) -> dict:
    name, key = resolve_key("gemini")
    if GEMINI_MODE == "vertex":
        host = ("aiplatform.googleapis.com" if GEMINI_LOCATION == "global"
                else f"{GEMINI_LOCATION}-aiplatform.googleapis.com")
        url = (f"https://{host}/v1/projects/{GEMINI_PROJECT}/locations/{GEMINI_LOCATION}"
               f"/publishers/google/models/{model}:generateContent")
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    else:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        headers = {"x-goog-api-key": key, "Content-Type": "application/json"}
    gen = {"temperature": TEMPERATURE, "maxOutputTokens": max_tokens}
    if JSON_MODE:
        gen["responseMimeType"] = "application/json"
    if thinking in ("low", "medium", "high"):
        gen["thinkingConfig"] = {"thinkingLevel": thinking}
    elif thinking.lstrip("-").isdigit():
        gen["thinkingConfig"] = {"thinkingBudget": int(thinking)}
    payload = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
               "generationConfig": gen}
    cache_name = None
    if system.strip():
        cache_name = _gemini_cache(model, system, headers) if GEMINI_MODE != "vertex" else None
        if cache_name:
            payload["cachedContent"] = cache_name
        else:
            payload["systemInstruction"] = {"parts": [{"text": system}]}
    try:
        resp = _post(url, headers, payload)
    except Exception as e:  # noqa: BLE001 — a stale/expired cache must never fail a page
        if cache_name:
            log(f"cache {cache_name} rejected ({str(e)[:80]}) — resending inline, cache dropped")
            _cache_forget(model, system)
            payload.pop("cachedContent", None); payload["systemInstruction"] = {"parts": [{"text": system}]}
            resp = _post(url, headers, payload)
        else:
            raise
    cands = resp.get("candidates") or []
    if not cands:
        raise RuntimeError(f"no candidates; promptFeedback={json.dumps(resp.get('promptFeedback', {}))[:200]}")
    c = cands[0]
    parts = (c.get("content") or {}).get("parts") or []
    text = "\n".join(p["text"] for p in parts if isinstance(p.get("text"), str))
    u = resp.get("usageMetadata") or {}
    return {"text": text, "finish": c.get("finishReason", ""), "key_source": name,
            "model": resp.get("modelVersion", model), "provider": "gemini",
            "input_tokens": u.get("promptTokenCount"),
            "output_tokens": u.get("candidatesTokenCount"),
            "thinking_tokens": u.get("thoughtsTokenCount"),
            "cached_tokens": u.get("cachedContentTokenCount") or 0,
            "response_id": resp.get("responseId")}


def call_openai(model: str, system: str, prompt: str, max_tokens: int, thinking: str) -> dict:
    name, key = resolve_key("openai")
    payload = {"model": model, "instructions": system, "input": prompt,
               "max_output_tokens": max_tokens}
    if thinking in ("low", "medium", "high"):
        payload["reasoning"] = {"effort": thinking}
    if JSON_MODE:
        payload["text"] = {"format": {"type": "json_object"}}
    resp = _post("https://api.openai.com/v1/responses",
                 {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}, payload)
    text = resp.get("output_text") or ""
    if not text:
        chunks = []
        for item in resp.get("output", []) or []:
            for c in item.get("content", []) or []:
                if c.get("type") in ("output_text", "text") and c.get("text"):
                    chunks.append(c["text"])
        text = "\n".join(chunks)
    u = resp.get("usage") or {}
    det = u.get("output_tokens_details") or {}
    finish = "MAX_TOKENS" if (resp.get("incomplete_details") or {}).get("reason") == "max_output_tokens" else "STOP"
    return {"text": text, "finish": finish, "key_source": name,
            "model": resp.get("model", model), "provider": "openai",
            "input_tokens": u.get("input_tokens"), "output_tokens": u.get("output_tokens"),
            "thinking_tokens": det.get("reasoning_tokens"), "response_id": resp.get("id")}


# OPUS-PRIMARY (2026-10-09) — Claude as a writer. Opus 5.5 rejects budget_tokens and disabled thinking (400):
# thinking is adaptive and depth is output_config.effort (CONTENT_ANTHROPIC_EFFORT, default
# high; its API default is medium). Streamed so a long page never hits an idle HTTP timeout.
# The system prompt (~21k tokens, identical across a run) is cached: reads bill at 5% of input.
_ANTH_DRY = set()   # key names that came back out-of-credit / unauthorised this process


def _anthropic_keys() -> list:
    load_secrets()
    keys = []
    # Content keys ONLY — never ANTHROPIC_API_KEY, which may be another account's CLI key.
    for n in ("CONTENT_ANTHROPIC_KEY", "CONTENT_ANTHROPIC_KEY_2"):
        v = os.environ.get(n, "").strip()
        if v and n not in _ANTH_DRY and v not in [k for _, k in keys]:
            keys.append((n, v))
    if not keys:
        raise KeyError("no usable anthropic key; set CONTENT_ANTHROPIC_KEY (and _KEY_2)"
                       + (f" — dry: {', '.join(sorted(_ANTH_DRY))}" if _ANTH_DRY else ""))
    return keys


def _post_stream_anthropic(key: str, payload: dict, timeout: int = 900) -> dict:
    """POST /v1/messages with stream=true; returns a message-shaped dict (text, usage, stop)."""
    body = json.dumps(dict(payload, stream=True), ensure_ascii=True).encode("utf-8")
    headers = {"x-api-key": key, "anthropic-version": "2023-06-01",
               "Content-Type": "application/json", "accept": "text/event-stream"}
    last = None
    for attempt in range(1, RETRIES + 1):
        req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body, headers=headers)
        try:
            msg = {"id": None, "model": payload["model"], "stop_reason": None, "stop_details": None,
                   "usage": {}, "text": []}
            with urllib.request.urlopen(req, timeout=timeout) as r:
                event = None
                for raw in r:
                    line = raw.decode("utf-8", "replace").rstrip("\r\n")
                    if line.startswith("event:"):
                        event = line[6:].strip()
                        continue
                    if not line.startswith("data:"):
                        continue
                    d = json.loads(line[5:].strip() or "{}")
                    t = d.get("type") or event
                    if t == "message_start":
                        m = d.get("message") or {}
                        msg["id"] = m.get("id"); msg["model"] = m.get("model", msg["model"])
                        msg["usage"].update(m.get("usage") or {})
                    elif t == "content_block_delta":
                        delta = d.get("delta") or {}
                        if delta.get("type") == "text_delta":
                            msg["text"].append(delta.get("text", ""))
                    elif t == "message_delta":
                        delta = d.get("delta") or {}
                        msg["stop_reason"] = delta.get("stop_reason") or msg["stop_reason"]
                        msg["stop_details"] = delta.get("stop_details") or msg["stop_details"]
                        msg["usage"].update({k: v for k, v in (d.get("usage") or {}).items() if v is not None})
                    elif t == "error":
                        err = d.get("error") or {}
                        raise RuntimeError(f"stream error {err.get('type')}: {str(err.get('message'))[:300]}")
            if msg["stop_reason"] is None:
                raise RuntimeError("stream ended without message_delta (connection cut)")
            msg["text"] = "".join(msg["text"])
            return msg
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:600]
            last = f"HTTP {e.code}: {detail}"
            if e.code not in (429, 500, 502, 503, 504, 529) and 400 <= e.code < 500:
                raise RuntimeError(last)
        except RuntimeError as e:
            last = str(e)
            if "overloaded" not in last and "api_error" not in last and "connection cut" not in last:
                raise
        except Exception as e:  # noqa: BLE001
            last = f"{type(e).__name__}: {e}"
        if attempt < RETRIES:
            wait = min(2 ** attempt, BACKOFF_CAP)
            log(f"retry {attempt}/{RETRIES - 1} in {wait}s ({last[:110]})")
            time.sleep(wait)
    raise RuntimeError(f"all {RETRIES} attempts failed. Last: {last}")


def _anth_key_dead(err: str) -> bool:
    e = err.lower()
    return ("credit balance" in e or "billing" in e or "HTTP 401" in err or "HTTP 403" in err
            or "authentication_error" in e or "permission_error" in e)


def call_anthropic(model: str, system: str, prompt: str, max_tokens: int, thinking: str) -> dict:
    effort = "low" if CMD == "preflight" else ANTHROPIC_EFFORT
    payload = {"model": model, "max_tokens": min(max_tokens, 128000),
               "system": [{"type": "text", "text": system or " ",
                           **({"cache_control": {"type": "ephemeral"}} if CACHE_ON and len(system or "") >= 8000 else {})}],
               "messages": [{"role": "user", "content": prompt}],
               "thinking": {"type": "adaptive"},
               "output_config": {"effort": effort}}
    errors = []
    for name, key in _anthropic_keys():
        try:
            resp = _post_stream_anthropic(key, payload)
        except RuntimeError as e:
            if _anth_key_dead(str(e)):
                _ANTH_DRY.add(name)
                log(f"anthropic key {name} unusable ({str(e)[:120]}) — trying the next key in the pool")
                errors.append(f"{name}: {str(e)[:160]}")
                continue
            raise
        if resp["stop_reason"] == "refusal":
            cat = (resp.get("stop_details") or {}).get("category")
            raise RuntimeError(f"refusal (category={cat}) — handing the call to the next model")
        u = resp["usage"]
        cached = u.get("cache_read_input_tokens") or 0
        total_in = (u.get("input_tokens") or 0) + cached + (u.get("cache_creation_input_tokens") or 0)
        finish = "MAX_TOKENS" if resp["stop_reason"] == "max_tokens" else "STOP"
        return {"text": resp["text"], "finish": finish, "key_source": name, "model": resp.get("model") or model,
                "provider": "anthropic", "input_tokens": total_in, "cached_tokens": cached,
                "output_tokens": u.get("output_tokens"), "thinking_tokens": None,   # output includes thinking
                "effort": effort, "response_id": resp.get("id")}
    raise RuntimeError("every anthropic key in the pool failed: " + " | ".join(errors))


CALLERS = {"gemini": call_gemini, "openai": call_openai, "anthropic": call_anthropic}


# ───────────────────────────── raw-HTML → markdown (writer output) ─────────────────────────────
# Page prose renders through renderSectionContent/renderInline, which parse MARKDOWN and never
# use dangerouslySetInnerHTML. An <a href> or <table> the model writes is therefore escaped by
# React and the reader sees the markup — and the entity autolinker then linkifies company names
# inside that visible tag soup. This shipped live on 5 pages (2026-09-22) before anything caught
# it, so the writer's output is normalised here, for every routine and every repo on the fleet.
#
# Applied to the raw completion text, which is why both quote forms are handled: JSON mode emits
# <a href=\"…\" > inside a string literal, markdown mode emits <a href="…">.
_A_TAG = re.compile(r'<a\s[^>]*?href=(\\?["\'])(.*?)\1[^>]*?>(.*?)</a\s*>', re.I | re.S)
_STRONG = re.compile(r'</?(?:strong|b)(?:\s[^>]*)?>', re.I)
_EM = re.compile(r'</?(?:em|i)(?:\s[^>]*)?>', re.I)
_BREAK = re.compile(r'<(?:br|hr)(?:\s[^>]*)?/?>', re.I)
_OTHER_TAG = re.compile(r'</?(?:p|div|span|u)(?:\s[^>]*)?/?>', re.I)


def _strip_tags(s: str) -> tuple[str, int]:
    """Emphasis is preserved as markdown (renderInline parses ** and *); the rest is dropped."""
    n = 0
    s, k = _STRONG.subn("**", s); n += k
    s, k = _EM.subn("*", s); n += k
    s, k = _BREAK.subn(" ", s); n += k
    s, k = _OTHER_TAG.subn("", s); n += k
    return re.sub(r"[ \t]{2,}", " ", s), n


def _md_url(u: str) -> str:
    """INLINE_LINK in sectionContent.tsx matches [^)\\s]+, so a paren or space truncates the URL."""
    return u.replace("(", "%28").replace(")", "%29").replace(" ", "%20")


def dehtml_links(text: str) -> tuple[str, int]:
    """Rewrite raw anchors as markdown links and drop inline formatting tags.

    Returns (text, count). Tables are NOT rewritten here — a GFM table has to become one
    pipe-row per content[] element, which is a structural change this text-level pass cannot
    make safely. They are reported by the caller and fail the build gate instead.
    """
    n = 0

    def sub(m):
        nonlocal n
        url, label = m.group(2), m.group(3)
        label = _strip_tags(label)[0].strip()
        if not label or "]" in label or "[" in label:
            return label                      # markdown-unsafe label -> plain text
        n += 1
        return f"[{label}]({_md_url(url)})"

    out = _A_TAG.sub(sub, text)
    out, k = _strip_tags(out)
    return out, n + k


LAST_SCOPE = {}   # what writer_scope dropped on the most recent generate() — read by cmd_write for meta


# ───────────────────────────── truncation detection ─────────────────────────────
# The provider's finish reason is NOT enough. Gemini returns finishReason="STOP" on
# output that stops mid-sentence, so the MAX_TOKENS retry below never fired and the
# clipped page went to the audit, which refused it. 15 of 45 pages were lost that way
# on the Opus 5.5 launch (2026-09-22) — every core Tier 0 page and all 9 comparisons.
# So we also LOOK at the text: unparseable JSON, or a prose field that just stops.

# A prose string that ends without terminal punctuation is the tell. Headings, labels,
# slugs and table rows legitimately end bare, so only long free-text is judged, and the
# bar is deliberately high — a false positive costs one retry, a false negative costs
# the page.
# Terminal punctuation, including the non-Latin marks the fleet's localized pages use.
_ENDS_CLEAN = re.compile(r'[.!?:;"\'\)\]}»”’…|\-。！？；：、؟।۔]\s*$')
# A markdown table row, with or without the leading pipe — the generator emits both.
_TABLE_ROW = re.compile(r'^\s*\|.*\|\s*$|(?:[^|\n]*\|){2,}')
_PROSE_MIN = 60
# WHITELIST, not a blacklist. Only fields that hold running prose are judged: a bullet,
# a table cell, a heading or a label ends without a full stop by design. Measured against
# all 2,438 published pages, a blacklist flagged 33% of them; this flags none.
_PROSE_KEYS = {
    "introtext", "content", "answer", "callout", "verdict", "summary",
    "body", "intro", "excerpt", "whatsnew", "takeaway",
    # NOT "description": relatedLinks[].description is a link blurb, deliberately clipped.
}


def _clipped_strings(node, out=None, where=""):
    out = [] if out is None else out
    if isinstance(node, dict):
        for k, v in node.items():
            _clipped_strings(v, out, f"{where}.{k}" if where else k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            _clipped_strings(v, out, f"{where}[{i}]")
    elif isinstance(node, str):
        s = node.strip()
        key = re.sub(r"\[\d+\]", "", where).split(".")[-1].lower()
        if key not in _PROSE_KEYS:
            return out
        if (len(s) >= _PROSE_MIN and len(s.split()) >= 10
                and not _TABLE_ROW.match(s) and not _ENDS_CLEAN.search(s)
                and not re.search(r'https?://\S+$', s)):
            out.append((where or "(root)", s[-60:]))
    return out


def looks_truncated(text: str, json_mode: bool) -> str:
    """Return a reason string when the output is clipped, else ""."""
    t = (text or "").strip()
    if not t:
        return "empty"
    if json_mode:
        # JSON mode is the strong case: a response cut mid-string cannot parse.
        try:
            # strict=False like every parser downstream: a literal newline inside a string (a
            # table row, an echoed quote) is not a cut-off response and must not cost a re-run
            data = json.loads(t, strict=False)
        except Exception:  # noqa: BLE001
            return "unparseable JSON (cut mid-structure)"
        bad = _clipped_strings(data)
        if bad:
            where, tail = bad[0]
            return f"{len(bad)} field(s) stop mid-sentence, e.g. {where}: ...{tail!r}"
        return ""
    # prose/markdown mode: judge the last substantive line
    lines = [l for l in t.split("\n") if l.strip()]
    last = lines[-1].strip() if lines else ""
    if last.startswith("```") or _TABLE_ROW.match(last) or last.startswith("#") or last.startswith("|"):
        return ""
    if len(last) >= _PROSE_MIN and len(last.split()) >= 10 and not _ENDS_CLEAN.search(last):
        return f"last line stops mid-sentence: ...{last[-60:]!r}"
    return ""


def generate(system: str, prompt: str) -> dict:
    """Primary model, then the fallback. Truncation/empty count as failures worth falling back on."""
    global LAST_SCOPE
    # Every caller — write, section, complete() from crons, the client bridges — sends the
    # writer only what a writer can use. Files on disk are never touched.
    if SCOPE_ON:
        system, LAST_SCOPE = writer_scope(system or "")
    else:   # an AUDITOR call: its "Hard fails"/AUDITOR sections are the whole point — send them intact
        system, LAST_SCOPE = system or "", {"dropped_sections": [], "html_comments_dropped": 0,
                                            "tokens_dropped_est": 0, "tokens_sent_est": len(system or "") // 4}
    if LAST_SCOPE["dropped_sections"] or LAST_SCOPE["html_comments_dropped"]:
        log(f"writer scope: dropped ≈{LAST_SCOPE['tokens_dropped_est']:,} tokens from the system prompt "
            f"({', '.join(LAST_SCOPE['dropped_sections'])[:160]}); ≈{LAST_SCOPE['tokens_sent_est']:,} sent")
    chain = _chain()
    errors = []
    for i, model in enumerate(chain):
        if i == 0 and FORCE_FALLBACK:
            errors.append(f"{model}: CONTENT_FORCE_FALLBACK=1 (test hook)")
            continue
        try:
            r = CALLERS[provider_for(model)](model, system, prompt, MAX_TOKENS, THINKING)
        except Exception as e:  # noqa: BLE001
            errors.append(f"{model}: {type(e).__name__}: {str(e)[:200]}")
            log(f"{model} failed -> {errors[-1][:160]}")
            continue
        # Truncated = the provider SAID so, or the text itself stops mid-sentence.
        # The second half is the one that matters: Gemini reports STOP on clipped output.
        why = "provider reported MAX_TOKENS" if r["finish"] == "MAX_TOKENS" else looks_truncated(r["text"], JSON_MODE)
        if why:
            # Cheapest rung first: the SAME model with double the cap, once, before falling back.
            cap = {"gemini": 65536, "openai": 128000, "anthropic": 128000}[provider_for(model)]
            retry_tokens = min(MAX_TOKENS * 2, cap)
            log(f"{model}: truncated ({why}) at MAX_TOKENS={MAX_TOKENS} — retrying once "
                f"with {retry_tokens} (provider ceiling {cap})")
            record(r, kind="truncated-discarded", discarded=True,
                   note=f"{why}; output thrown away; retried at {retry_tokens}")
            try:
                r = CALLERS[provider_for(model)](model, system, prompt, retry_tokens, THINKING)
            except Exception as e:  # noqa: BLE001
                errors.append(f"{model}: retry failed: {str(e)[:160]}"); continue
            why2 = ("provider reported MAX_TOKENS" if r["finish"] == "MAX_TOKENS"
                    else looks_truncated(r["text"], JSON_MODE))
            if why2:
                # Still clipped at double the cap -> fall through to the next model in the
                # chain rather than publishing half a page.
                errors.append(f"{model}: still truncated at {retry_tokens} ({why2})")
                continue
            r["retried_for_truncation"] = True
        if not r["text"].strip():
            errors.append(f"{model}: empty response (finish={r['finish']})")
            continue
        # Normalise raw HTML the model wrote into prose before any caller sees it.
        cleaned, n_html = dehtml_links(r["text"])
        if n_html:
            log(f"normalised {n_html} raw HTML tag(s) in writer output -> markdown")
            r["text"] = cleaned
        if re.search(r"<(table|thead|tbody|tr|t[hd])[ >]", r["text"], re.I):
            log("WARNING: writer emitted a raw HTML <table>; it must become a GFM table "
                "(one pipe-row per content[] element) or the build gate will reject it")
        r["fallback_used"] = i > 0
        r["fallback_reason"] = "; ".join(errors) if i > 0 else None
        # Always log a successful generation: a silent success is invisible in cron logs, and
        # "did this run actually use Gemini?" must be answerable from the log alone.
        log(f"ok model={r['model']} in={r.get('input_tokens')} out={r.get('output_tokens')} "
            f"think={r.get('thinking_tokens')} cached={r.get('cached_tokens') or 0} cost≈${est_cost(r['model'], r.get('input_tokens'), r.get('output_tokens'), r.get('thinking_tokens'), r.get('cached_tokens') or 0)}"
            f"{' FALLBACK' if i > 0 else ''}")
        record(r, kind=os.environ.get("CONTENT_KIND", "generate"))
        return r
    raise RuntimeError("all models failed: " + " | ".join(errors))


# ───────────────────────────── in-process API (for crons / radars) ─────────────────────────────
def complete(system: str, prompt: str, *, model: str = None, max_tokens: int = None,
             thinking: str = None, fallback: str = None, json_mode: bool = False,
             writer_scope: bool = True) -> str:
    """One-call text completion for Python pipelines (the Render radar crons).

    Same chain as `write`: primary model then the fallback (logged to stderr), truncation retried
    once at double the cap. Returns the raw text; the caller keeps its own parsing/templating.
    Model/effort default to the CONTENT_* env config so a cron switches models by env alone:

        from lib.content_gen import complete           # after sys.path.insert(0, "scripts")
        text = complete(system_prompt, user_prompt)    # was: _llm(...) -> OpenAI directly
    """
    global MODEL, FALLBACK, MAX_TOKENS, THINKING, JSON_MODE, SCOPE_ON
    saved = (MODEL, FALLBACK, MAX_TOKENS, THINKING, JSON_MODE, SCOPE_ON)
    try:
        JSON_MODE = bool(json_mode)
        SCOPE_ON = bool(writer_scope)
        if model: MODEL = model
        if fallback is not None: FALLBACK = fallback
        if max_tokens: MAX_TOKENS = int(max_tokens)
        if json_mode:
            MAX_TOKENS = max(MAX_TOKENS, 8000)   # a thinking model spends its cap before writing
        if thinking: THINKING = thinking
        r = generate(system or "", prompt)
        if r.get("fallback_used"):
            log(f"complete(): FALLBACK USED -> {r['model']} ({r['fallback_reason']})")
        text = strip_fences(r["text"])
        if json_mode:
            # JSON mode must never hand a caller non-JSON: validate; regenerate once on the
            # same model; then force the fallback model; only then return unparsed (logged).
            def _ok(s):
                try: json.loads(s, strict=False); return True
                except Exception: return False
            if not _ok(text):
                log(f"complete(): json_mode output not parseable from {r['model']} — regenerating once")
                r2 = generate(system or "", prompt); t2 = strip_fences(r2["text"])
                if _ok(t2): return t2
                if _fallbacks():
                    fb = _fallbacks()[0]
                    log(f"complete(): still not JSON — trying fallback {fb}")
                    m0 = MODEL; MODEL = fb
                    try:
                        r3 = generate(system or "", prompt); t3 = strip_fences(r3["text"])
                    finally:
                        MODEL = m0
                    if _ok(t3): return t3
                log("complete(): returning non-JSON text after all attempts (caller must handle)")
        return text
    finally:
        MODEL, FALLBACK, MAX_TOKENS, THINKING, JSON_MODE, SCOPE_ON = saved


# ───────────────────────────── verify stage ─────────────────────────────
_NUM = re.compile(r"(?<![\w.])\d[\d,]*(?:\.\d+)?%?")
_EXT = re.compile(r"https?://[^\s)\"'<>\]]+")


def strip_fences(t: str) -> str:
    t = t.strip()
    if t.startswith("```"):
        t = re.sub(r"^```[a-zA-Z0-9]*\s*", "", t)
        t = re.sub(r"\s*```$", "", t)
    return t.strip()


def fix_table_separators(s: str) -> str:
    """A GFM separator row whose column count differs from its header row renders as plain text
    (seen 2026-10-08: a 4-column header over a 5-column separator). Re-cut it to the header."""
    if "|" not in s or "-" not in s:
        return s
    ls = s.split("\n")
    for i in range(1, len(ls)):
        sep, head = ls[i].strip(), ls[i - 1].strip()
        if re.fullmatch(r"\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?|\|?(\s*:?-{3,}:?\s*\|)+", sep) and head.count("|") >= 2:
            n_head = len([c for c in head.strip("|").split("|")])
            cells = [c.strip() for c in sep.strip("|").split("|") if c.strip()]
            if cells and len(cells) != n_head:
                cells = (cells + [cells[-1]] * n_head)[:n_head]
                ls[i] = "| " + " | ".join(cells) + " |"
    return "\n".join(ls)


def house_style(s: str) -> str:
    s = (s.replace("’", "'").replace("‘", "'").replace("“", '"')
          .replace("”", '"').replace("…", "..."))
    s = re.sub(r"(\d+:\d+)\s*[–—]\s*(\d+)", r"\1-\2", s)            # verse refs keep hyphen
    s = re.sub(r"(\d%?)\s*[–—]\s*([$£€]?\d)", r"\1 to \2", s)  # numeric range -> to
    s = re.sub(r"(?<=[A-Za-z0-9])–(?=[A-Za-z0-9])", "-", s)                # tight en dash = compound
    s = re.sub(r"\s*[–—]\s*", ", ", s)                                # clause dash -> comma
    s = re.sub(r",\s*,", ",", s); s = re.sub(r"\s+,", ",", s); s = re.sub(r",\s*\.", ".", s)
    return re.sub(r"[ \t]{2,}", " ", s).strip()


def walk(o, fn):
    if isinstance(o, str):
        return fn(o)
    if isinstance(o, list):
        return [walk(x, fn) for x in o]
    if isinstance(o, dict):
        return {k: walk(v, fn) for k, v in o.items()}
    return o


def all_strings(o, acc=None):
    acc = [] if acc is None else acc
    if isinstance(o, str):
        acc.append(o)
    elif isinstance(o, list):
        for x in o:
            all_strings(x, acc)
    elif isinstance(o, dict):
        for v in o.values():
            all_strings(v, acc)
    return acc


def verify(text: str, a) -> tuple[dict, dict]:
    """Return (page_dict, guard_report). Hard failures call die(4)."""
    # The remediation ladder, applied to a returned draft:
    #   Rung 0 — REPAIR IN PLACE and log it (fence, slug, a missing build-critical key, a bad link)
    #   Rung 1 — insert an empty placeholder and FLAG it for the auditor (draft is still saved)
    #   Rung 2 — regenerate ONLY what nobody can repair: unparseable output (raw text saved first)
    # Never throw a whole page away for a one-line fix.
    report = {"repairs": [], "flags": []}
    raw = text
    text = strip_fences(text)
    if text != raw.strip():
        report["repairs"].append("stripped markdown code fence")
    page = None
    try:
        page = json.loads(text, strict=False)   # tolerate literal control chars in strings
    except json.JSONDecodeError:
        i, j = text.find("{"), text.rfind("}")
        if i != -1 and j > i:
            try:
                page = json.loads(text[i:j + 1], strict=False)
                report["repairs"].append("salvaged the JSON object from surrounding text")
            except json.JSONDecodeError:
                page = None
    if not isinstance(page, dict):
        rawp = pathlib.Path(a.out).with_suffix(".raw.txt")
        rawp.parent.mkdir(parents=True, exist_ok=True)
        rawp.write_text(raw)
        die(4, f"{a.slug}: output is not a parseable page object — raw text saved to {rawp}. "
               f"This is the one case that needs a regeneration (Rung 2).")
    # house style + control-char normalisation on every string value (Rung 0)
    page = walk(page, lambda s: fix_table_separators(house_style(re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", " ", s))))

    # slug: always the expected one (Rung 0)
    if page.get("slug") != a.slug:
        report["repairs"].append(f"slug {page.get('slug')!r} -> {a.slug!r}")
        page["slug"] = a.slug

    # required keys: build-critical ones repaired, content ones placeholder + FLAG (Rung 0/1)
    DEFAULTS = {"relatedLinks": [], "faqItems": [], "verdict": [], "sections": [], "introText": [],
                "comparisonTable": []}
    for k in SCHEMAS.get(a.schema, []):
        if k not in page:
            page[k] = DEFAULTS.get(k, "")
            if k == "relatedLinks":
                report["repairs"].append("added relatedLinks: [] (undefined crashes next build)")
            else:
                report["flags"].append(f"missing '{k}' — inserted empty placeholder; auditor must fill or send back")
    if a.schema == "comparison" and not isinstance(page.get("relatedLinks"), list):
        page["relatedLinks"] = []
        report["repairs"].append("relatedLinks was not a list -> []")

    # disallowed external links: strip the link, keep the sentence, flag the claim (Rung 0 + flag)
    if a.allowed_urls:
        allowed = [u.strip() for u in pathlib.Path(a.allowed_urls).read_text().splitlines() if u.strip()]
        ok = lambda u: any(u.startswith(x) for x in allowed)  # noqa: E731
        removed = []

        def strip_links(s: str) -> str:
            def md(m):
                if ok(m.group(2)):
                    return m.group(0)
                removed.append(m.group(2)); return m.group(1)
            s = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", md, s)
            for u in _EXT.findall(s):
                if not ok(u):
                    removed.append(u); s = s.replace(u, "").replace("()", "")
            return s
        page = walk(page, strip_links)
        # drop `sources` entries pointing off-list
        for sec in page.get("sections", []) or []:
            if isinstance(sec, dict) and isinstance(sec.get("sources"), list):
                keep = [x for x in sec["sources"] if ok(str(x.get("href", "")))]
                if len(keep) != len(sec["sources"]):
                    removed += [str(x.get("href")) for x in sec["sources"] if x not in keep]
                    sec["sources"] = keep
        removed = sorted({u for u in removed if u})
        report["disallowed_urls_removed"] = removed
        if removed:
            report["repairs"].append(f"removed {len(removed)} off-list link(s), kept the text")
            report["flags"].append(f"auditor: verify the sentences that cited {removed[:3]} are still supported")

    body = " ".join(all_strings(page))
    words = len(body.split())
    report["words"] = words
    if a.floor and words < a.floor:
        report["flags"].append(f"{words} words < depth floor {a.floor}")
        log(f"WARNING: {words} words < floor {a.floor} for {a.slug} — Phase 4 depth gate will reject")

    # numbers not in the closed fact list + prompt = soft flag for the auditor
    if a.facts:
        src = pathlib.Path(a.facts).read_text() + "\n" + pathlib.Path(a.prompt).read_text()

        def norm(n: str) -> str:  # "0.80" == "0.8", "1,000" == "1000", "75.4%" == "75.4"
            n = n.replace(",", "").rstrip("%")
            return n.rstrip("0").rstrip(".") if "." in n else n

        allowed_nums = {norm(n) for n in _NUM.findall(src)}
        found = {norm(n) for n in _NUM.findall(body)}
        suspicious = sorted(n for n in found - allowed_nums
                            if (len(n.rstrip("%").replace(".", "")) >= 2 and n not in {"10", "20", "50", "100"}))
        report["numbers_not_in_facts"] = suspicious
        if suspicious:
            log(f"NOTE {a.slug}: {len(suspicious)} number(s) not traceable to the fact list -> auditor: {suspicious[:8]}")
    return page, report


# ───────────────────────────── grounding + claim check (FIX-IN-PLACE for facts) ─────────────────────────────
# WHY (2026-10-07). In one week 8 content routines across the fleet shipped NOTHING: 19 of 19 drafts
# failed the Phase 4 fact audit. The audit was right every time (invented brand facts, a competitor
# price table, unhedged legal claims, "inference" about use). What killed the runs was the repair
# path, not the bar:
#   * a writer handed a short closed fact list and a 1,400-1,500 word floor fills the gap with
#     unlisted claims (the RingCentral draft ran 2,664 words on a ~350-word fact list), and
#   * every "unsupported claim" finding was routed to a WHOLE-PAGE regeneration, which re-rolls
#     every sentence, so round 2 failed on NEW invented claims (readnext round 2: 8 of 8 findings
#     were new; humidor's corrections block grew to ~60 banned phrases) — two rounds, page dropped.
# The fix keeps the audit bar identical and changes where unsupported claims are removed:
#   1. GROUNDING — a fixed block appended to every row prompt that carries --facts (rows stay
#      DATA ONLY; this is the generator's standing rule, so no orchestrator can forget it).
#   2. CLAIM CHECK — after every write/section, a verifier call lists each sentence/table cell the
#      fact list does not support and supplies an API-written replacement that only restates the
#      list (or deletes the sentence). Applied by exact string replacement, re-checked once, logged
#      in meta.guards.claim_check, and the pre-check draft is kept beside the draft.
#   3. `fix` — the same machinery for the Phase 4 auditor's findings: the remediation ladder's
#      FIX-IN-PLACE rung for claims and tells, with the replacement text still model-generated.
# The checker never adds a fact: a replacement may only restate SOURCE or say a thing is not
# published. If removing claims drops a page under its floor, it is FLAGGED — the cure is a larger
# sourced fact list (Rung 2 with research), never padding and never a looser audit.
GROUNDING = """

# GROUNDING (appended by content_gen.py to every row that carries a closed fact list; applies to every sentence)
- A sentence that states something about the world (a product, company, person, court, law, price, number, date, feature, what people or vendors usually do, how something works, why something happens) must restate a line of the CLOSED FACT LIST or the row data above. If no line supports it, leave it out. A shorter true sentence beats a longer guessed one.
- Always allowed: instructions to the reader, choices built only from listed facts ("pick X if you want <listed attribute>"), arithmetic on listed numbers with the inputs shown, and the plain statement that something is not published ("RingCentral does not publish a cap on concurrent calls").
- Never tell the reader to check, verify, confirm or consult something unless that same sentence links the exact page from the CLOSED URL LIST (or an internal route you were given). With no such link, state the gap as a fact instead.
- No inference past the list: no use cases, audiences, causes, reputations, counts, rankings, typical behaviour, quality judgements or comparisons the list does not state. No number that is not on the list, except arithmetic shown on listed numbers.
- Reach the depth floor by covering MORE of the listed facts and more of the reader's decision (what to compare, what to ask, what to do first, what each listed fact means for that decision), never by adding claims the list does not hold.
"""

CLAIMCHECK_ON = os.environ.get("CONTENT_FACTCHECK", "1") != "0"
CLAIMCHECK_PASSES = max(1, int(os.environ.get("CONTENT_FACTCHECK_PASSES", "2")))
# Measured 2026-10-07/08 on two failed pages (humidor partagas-vs-cohiba, layer3 RingCentral):
#   high   one check 36-38k thinking tokens, ~4 min, ~$0.15 — and clipped at the 40k cap
#   medium 9-19k thinking, $0.04-0.08 per check; found 18+4 / 2+5 claims over 2 passes
#   low    ~1k thinking, ~$0.005 per check; found only 7+3 / 1+1 — misses too much for the full read
# So the full read (pass 1) runs at medium and the final delete-only pass at low: ~$0.05-0.09/page.
_fct = os.environ.get("CONTENT_FACTCHECK_THINKING", "medium").strip().lower()
CLAIMCHECK_THINKING = _fct if _fct in _LEVELS else "medium"
# A first pass that finds this many claims means a padded draft: one extra full read (adaptive, max 1).
CLAIMCHECK_ADAPT = int(os.environ.get("CONTENT_FACTCHECK_ADAPT", "12"))
_fcf = os.environ.get("CONTENT_FACTCHECK_FINAL_THINKING", "low").strip().lower()
CLAIMCHECK_FINAL_THINKING = _fcf if _fcf in _LEVELS else "low"
CLAIMCHECK_MAX_TOKENS = int(os.environ.get("CONTENT_FACTCHECK_MAX_TOKENS", "64000"))   # thinking counts against it
# A thin closed fact list is the upstream cause of padded claims. Below this ratio of fact-list
# words to the page's floor, the draft is FLAGGED (meta.guards.flags + stderr) so the orchestrator
# expands the list with sourced facts BEFORE spending a regeneration. Calibrated on the 2026-10
# failures (pro se 0.06, banthebots minimal, RingCentral 0.25) vs pages that passed first time.
FACT_BUDGET_RATIO = float(os.environ.get("CONTENT_FACT_BUDGET_RATIO", "0.30"))

_SKIP_KEYS = {"slug", "href", "buttonHref", "category", "publishedDate", "updatedDate", "id",
              "ctaButton", "buttonLabel", "image", "imageAlt", "icon", "schema", "type", "date",
              "lastUpdated", "updated", "published"}

_SKIP_ROOTS = {"ctaTitle", "ctaText", "ctaButton", "inlineCta", "cta", "relatedLinks", "schema", "sources"}

CLAIMCHECK_SYSTEM = """You are the fact checker for a web page draft, working BEFORE the human-grade audit. The audit fails any page that states something its closed fact list does not support. Your job is to find every such statement and supply the in-place fix, so the page reaches the audit clean.

You receive:
- SOURCE: the closed fact list and row data the writer was given. It is the ONLY knowledge the page may state. Instruction blocks inside SOURCE (CORRECTIONS, COVER, NOTES, FAQ specs, GROUNDING) are rules, not facts: they never support a claim, and a CLAIM they forbid is a finding. Style, format, length and title-framing rules are NOT your job (another gate checks them) — never flag a sentence, title or heading for style.
- UNITS: the page text, one unit per line as `<id> ::: <text>`.

METHOD. Walk the units in order and report EVERY unit — none may be skipped. Inside a unit, test each clause: it is SUPPORTED only if a SOURCE line states it (faithful paraphrase and synonyms count). Anything else that describes the world is a finding. Writers pad thin fact lists with exactly these, so look for them in every unit:
- descriptive or evaluative words SOURCE does not use for that thing: quality, reputation, prestige, fame, reliability, consistency, texture, smoothness, "balanced", "refined", "polished", "traditional", "flagship", "established", "well-known", "popular", "affordable", "accessible", "oily", "rich" — unless SOURCE says it of that same thing;
- purposes, audiences, occasions and use cases SOURCE does not state ("designed for", "ideal for", "for gifting", "for beginners", "for everyday rotation", "for compliance teams");
- market, retail, availability and price claims SOURCE does not state (what shops carry, samplers, discounts, why prices vary, what something is "marketed as");
- causes and consequences SOURCE does not state ("because", "which means", "making it", "so that");
- laws, regulators, rules or authorities SOURCE does not name;
- comparisons, rankings and degree words SOURCE does not state ("more", "far more", "the sharpest", "best", "most", "significantly");
- what people, buyers, smokers, vendors or companies typically do, feel, prefer or need;
- a fact SOURCE states about one thing, written about another (brand A's fact given to brand B; a Cuban fact given to the non-Cuban product);
- a number, date, name or feature SOURCE does not list, or wrong arithmetic on SOURCE numbers;
- a sentence sending the reader to an OUTSIDE source to check / verify / confirm a fact (the vendor's page, a regulator, documentation, a professional) with no markdown link in that same sentence;
- a first-person claim by the site ("At <Brand>, we ...", "we tested", "we help ...") that the SITE SELF-DESCRIPTION block does not support.
NOT findings: required boilerplate the page contract dictates (an affiliate or commission disclosure, a CTA line); instructions telling the reader what to do, test, try, compare or ask in their OWN evaluation (a trial checklist, "test X", "make sure your CRM receives Y") as long as they assert no fact about the world; conditional picks built only from SOURCE facts ("pick X if you want <listed attribute>"); conditional or hypothetical statements about what would change the page's answer ("our answer would change if the vendor published Y"); correct arithmetic on SOURCE numbers; "X is not published / not stated"; the site's own first-person sentences that the SITE SELF-DESCRIPTION supports; headings and labels that only name a topic; internal links; questions; neutral connective wording.

For each finding supply `replacement`:
- the closest statement SOURCE does support that keeps the sentence's job in its paragraph (usually the same sentence with the unsupported words removed), or
- "" (empty string) to delete it, when nothing in SOURCE can carry it.
The replacement is spliced in by exact string replacement, so it must read naturally between the text before and after the quote. It must not introduce any fact, number, name or link that is not in SOURCE, must keep any markdown link that was valid, and must keep table pipes intact: in a table row quote only the cell text and never empty a cell (write "Not published" instead).

`quote` must be copied character for character from that unit (usually one whole sentence; a cell's text for a table). One finding per sentence.

Return ONLY JSON, every unit once, in order:
{"units":[{"id":"<unit id>","findings":[{"quote":"<exact text>","type":"unsupported|contradicted|inference|unlinked-directive","why":"<what SOURCE lacks or says instead, max 15 words>","replacement":"<text or empty string>"}]}]}
A clean unit is {"id":"<unit id>","findings":[]}."""

FIX_SYSTEM = """You repair a web page draft in place for the findings of an adversarial audit, without rewriting the page.

You receive SOURCE (the closed fact list and row data — the ONLY knowledge the page may state; instruction blocks inside it are rules, not facts), AUDIT FINDINGS (the reviewer's report), and UNITS (the page text, one unit per line as `<id> ::: <text>`).

For EVERY audit finding that points at text on the page, return the unit id, the exact offending text, and its replacement:
- a fact finding (unsupported / invented / contradicted / inference): replace with the closest statement SOURCE supports that keeps the sentence's job, or "" to delete it;
- a wording finding (an AI tell, a banned word, a heading or title rule, a length limit, a directive with no link): rewrite only the quoted text so the defect is gone and the same supported meaning remains.
Never add a fact, number, name or link that is not in SOURCE. Keep table pipes intact and never empty a table cell (write "Not published"). If a finding can only be fixed by adding a NEW fact, a new section or restructuring the page, return it with "replacement": null and why "needs new substance" — it is not fixable in place.

`quote` must be copied character for character from that unit. If one finding covers several sentences, return one entry per sentence.

Return ONLY JSON: {"findings":[{"id":"<unit id>","quote":"<exact text>","finding":"<which audit finding, short>","why":"<max 20 words>","replacement":"<text, empty string, or null>"}]}"""


def _source_text(a) -> str:
    """SOURCE for the checker: the facts file + the row prompt (deduplicated), never the system.
    The repo's _experience.md rides along as the licence for the site's OWN first-person claims
    (without it the checker deletes every "At <Brand>, we ..." line, which the standard requires)."""
    parts, seen = [], set()
    for f in (getattr(a, "facts", ""), getattr(a, "prompt", "")):
        if f and f not in seen and pathlib.Path(f).exists():
            seen.add(f); parts.append(pathlib.Path(f).read_text())
    root = _repo_root()
    exp = root / ".claude" / "commands" / "_experience.md" if root else None
    if exp and exp.exists():
        parts.append("## SITE SELF-DESCRIPTION (licenses ONLY the site's own first-person / \"we\" claims; "
                     "never a fact about anything else)\n" + re.sub(r"<!--.*?-->", "", exp.read_text(), flags=re.S).strip())
    return "\n\n".join(parts)


def fact_budget(a) -> dict | None:
    """Words in the closed fact list(s) vs the page floor. None when there is nothing to measure."""
    if not getattr(a, "facts", "") or not getattr(a, "floor", 0):
        return None
    words = 0; found = False
    for f in {a.facts, getattr(a, "prompt", "") or a.facts}:
        if not f or not pathlib.Path(f).exists():
            continue
        in_f = False
        for line in pathlib.Path(f).read_text().splitlines():
            if re.match(r"^#{1,6}\s", line):
                up = line.upper()
                if "FACT" in up:
                    in_f = found = True
                elif in_f and re.search(r"URL|LINK|COVER|CORRECTION|FAQ|NOTE|ROUTE|ROW DATA|STANDING|SECTION|CONTRACT|OUTPUT", up):
                    in_f = False
                continue
            if in_f and line.strip():
                words += len(line.split())
    if not found:   # a dedicated facts file with no FACT heading: the whole file is the list
        if a.facts != getattr(a, "prompt", None) and pathlib.Path(a.facts).exists():
            words = len(pathlib.Path(a.facts).read_text().split())
        else:
            return None
    ratio = round(words / a.floor, 2)
    return {"fact_words": words, "floor": a.floor, "ratio": ratio, "thin": ratio < FACT_BUDGET_RATIO}


def _units(page, fmt: str):
    """[(id, text, setter)] for every reader-facing prose string."""
    out = []
    if fmt == "markdown":
        lines = page.split("\n"); in_code = False
        for i, l in enumerate(lines):
            if l.strip().startswith("```"):
                in_code = not in_code; continue
            if in_code or l.strip() in ("---", "") or len(l.split()) < 3:
                continue
            out.append((f"L{i + 1}", l, ("line", i)))
        return out

    def rec(o, path, parent, key):
        if isinstance(o, str):
            leaf = path.rsplit(".", 1)[-1].split("[", 1)[0]
            # short strings still count when they can carry a claim: a number, or a table cell
            if path.split(".", 1)[0].split("[", 1)[0] in _SKIP_ROOTS:
                return
            if leaf not in _SKIP_KEYS and (len(o.split()) >= 3 or re.search(r"\d", o)
                                           or "table" in path.lower()):
                out.append((path, o, (parent, key)))
        elif isinstance(o, list):
            for i, x in enumerate(o):
                rec(x, f"{path}[{i}]", o, i)
        elif isinstance(o, dict):
            for k, v in o.items():
                rec(v, f"{path}.{k}" if path else k, o, k)
    rec(page, "", None, None)
    return out


def _tidy(s: str) -> str:
    # leading indentation is structure (YAML frontmatter, nested bullets) — never touch it
    lead, body = re.match(r"^([ \t]*)(.*)$", s, re.S).groups()
    body = re.sub(r"[ \t]{2,}", " ", body)
    body = re.sub(r"[ \t]+([,.;:!?])(?=\s|$)", r"\1", body)
    body = re.sub(r"([,;])[ \t]*([.!?])(?=\s|$)", r"\2", body)
    body = re.sub(r"\([ \t]*\)", "", body)
    body = re.sub(r"(?<!\.)\.\.(?!\.)", ".", body)          # "A.. B" left by a deleted clause; "..." kept
    body = re.sub(r"^[,;:][ \t]*", "", body)
    return lead + body.rstrip()


def _norm_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s.replace("’", "'").replace("“", '"').replace("”", '"')).strip()


def _new_tokens(rep: str, allowed_text: str) -> list:
    """Numbers, links and mid-sentence proper nouns in `rep` that `allowed_text` does not contain.
    The mechanical half of "the checker never adds a fact": a replacement that brings in any of
    these is refused, whatever the model said about it."""
    def n(x):
        x = x.replace(",", "").rstrip("%")
        return x.rstrip("0").rstrip(".") if "." in x else x
    low = allowed_text.lower()
    nums = {n(x) for x in _NUM.findall(allowed_text)}
    bad = [x for x in _NUM.findall(rep) if n(x) not in nums]
    bad += [u for u in _EXT.findall(rep) if u.rstrip(".,;") not in allowed_text]
    bad += [m.group(0) for m in re.finditer(r"/[a-z0-9][a-z0-9/_-]+", rep)
            if "](" + m.group(0) in rep and m.group(0).rstrip("/") not in allowed_text]
    words = re.findall(r"[A-Za-z][\w'-]*", rep)
    if rep.lstrip().startswith("#") or (len(words) >= 2 and sum(w[0].isupper() for w in words) >= 0.6 * len(words)):
        return bad   # a heading or Title Case label: capitals there are style, not proper nouns
    for sent in re.split(r"(?<=[.!?:;])\s+|\|", re.sub(r"\]\([^)]*\)", "]", rep)):
        for w in re.findall(r"(?<=[\s\[(\"'])[A-Z][\w'&.-]*", " " + sent.strip())[1:]:
            w = w.rstrip(".'")
            if w.lower() not in low:
                bad.append(w)
    return bad


# a sentence boundary: terminal punctuation + space + a capital, not after an initial ("U.S. Market")
_SENT_END = re.compile(r"(?<!\b[A-Z])[.!?]\s+(?=[A-Z\"\[*(])")
_LIMITERS = {"not", "no", "never", "only", "without", "except", "unless", "nor", "cannot", "can't", "don't",
             "doesn't", "isn't", "aren't", "won't", "neither", "none", "illegal", "unavailable"}


_DISCLOSURE = re.compile(r"\b(commission|affiliate|sponsored|paid partnership|disclosure)\b", re.I)
_PROTECTED_KEYS = {"metaTitle", "metaDescription", "h1", "title", "subtitle", "heading", "question",
                   "optionAName", "optionBName", "label", "name"}


def _is_closed_rewrite(quote: str, rep: str, src: str) -> bool:
    """True when every word of `rep` already occurs in the quote or in SOURCE, its negations and
    limiters are exactly the quote's, and it carries no new number/link/name. Such a rewrite can
    only rearrange what the page and the fact list already say, so the delete-only pass may keep it."""
    norm = lambda w: re.sub(r"[^\w$%'-]", "", w.lower())  # noqa: E731
    vocab = {norm(w) for w in (quote + " " + src).split()}
    rw = [norm(w) for w in rep.split() if norm(w)]
    lim = lambda ws: sorted(w for w in ws if w in _LIMITERS)  # noqa: E731
    return bool(rw) and all(w in vocab for w in rw) and lim(rw) == lim(norm(w) for w in quote.split()) \
        and not _new_tokens(rep, src + "\n" + quote)


def _is_word_removal(quote: str, rep: str) -> bool:
    """True when `rep` is `quote` with some words taken out and none of them a negation/limiter —
    the one rewrite that cannot add a claim or flip one, so the delete-only pass may keep it."""
    q, r = quote.split(), rep.split()
    if not r or len(r) >= len(q):
        return False
    norm = lambda w: re.sub(r"[^\w$%'-]", "", w.lower())  # noqa: E731
    i, removed = 0, []
    for w in q:
        if i < len(r) and norm(w) == norm(r[i]):
            i += 1
        else:
            removed.append(norm(w))
    return i == len(r) and not (set(removed) & _LIMITERS)


def _sentence_span(cur: str, exact: str) -> str:
    """The whole sentence of `cur` that contains `exact` (a forced delete never leaves a clause
    stub whose meaning flipped, e.g. a dropped "only" or "not")."""
    i = cur.find(exact)
    if i < 0:
        return exact
    starts = [m.end() for m in _SENT_END.finditer(cur[:i + 1])]
    st = starts[-1] if starts else 0
    m = re.search(r"(?<!\b[A-Z])[.!?](?=\s|$)", cur[i + len(exact) - 1:])
    en = i + len(exact) - 1 + m.end() if m else len(cur)
    span = cur[st:en]
    lead = re.match(r"^\s*(?:[-*]\s+|\d+\.\s+)?(?:\*\*[^*]+\*\*:?\s*)?", span).group(0)
    return span[len(lead):] if span[len(lead):].strip() else exact


def apply_findings(page, fmt: str, findings: list, src: str = "", on_new: str = "delete",
                   delete_all: bool = False) -> tuple:
    """Exact-string FIX-IN-PLACE. Returns (page, applied, unapplied). Never raises on a bad finding.
    A replacement carrying a number, link or proper noun found neither in SOURCE nor in the text it
    replaces is refused: on_new="delete" (claim check: the quote was unsupported anyway) removes
    the quote instead; on_new="skip" (fix: wording findings) leaves it and reports it.
    delete_all=True (the final claim-check pass, which nothing re-checks) keeps a replacement only
    when it merely removes words (no negation/limiter among them) or is a rewrite built from the
    quote's own words + SOURCE vocabulary; otherwise it deletes the quote's whole sentence (a table
    cell becomes "Not published"). Titles, headings and frontmatter are never deleted."""
    units = _units(page, fmt)
    by_id = {u[0]: u for u in units}
    applied, unapplied, drop = [], [], []
    lines = page.split("\n") if fmt == "markdown" else None
    fm_end = 0
    if lines and lines[0].strip() == "---":
        fm_end = next((i + 1 for i, l in enumerate(lines[1:], 1) if l.strip() == "---"), 0)
    for f in findings:
        if not isinstance(f, dict):
            continue
        q, rep = f.get("quote") or "", f.get("replacement")
        if not q or rep is None:
            unapplied.append({**f, "reason": "no quote" if not q else "not fixable in place"}); continue
        rep = "" if delete_all else (house_style(str(rep)) if rep else "")
        cands = [by_id[f.get("id")]] if f.get("id") in by_id else []
        # a quote found in some OTHER unit than the one named must be long enough to be unambiguous
        cands += [u for u in units if u not in cands and len(q.split()) >= 4]
        hit = None
        for uid, text, where in cands:
            cur = lines[where[1]] if fmt == "markdown" else where[0][where[1]]
            if q in cur:
                hit = (uid, cur, where, q); break
            nq = _norm_ws(q)
            if nq and nq in _norm_ws(cur):
                # tolerate quote/whitespace drift: rebuild the exact span from the normalised match
                m = re.search(re.escape(nq).replace(r"\ ", r"\s+").replace("'", "['’]").replace('"', '["“”]'), cur)
                if m:
                    hit = (uid, cur, where, m.group(0)); break
        if not hit:
            unapplied.append({**f, "reason": "quote not found on the page"}); continue
        uid, cur, where, exact = hit
        is_cell = (cur.lstrip().startswith("|") and cur.count("|") >= 2) or \
            (fmt == "json" and "table" in uid.lower())
        # titles, headings, metadata and frontmatter are page STRUCTURE: they may be reworded, never
        # deleted (a dropped `title:` breaks the build; a dropped heading orphans its section)
        if fmt == "markdown":
            fm_key = re.match(r"^([A-Za-z_][\w-]*):\s", cur) if where[1] < fm_end else None
            protected = cur.lstrip().startswith("#") or where[1] < fm_end
        else:
            fm_key = None
            protected = uid.rsplit(".", 1)[-1].split("[", 1)[0] in _PROTECTED_KEYS
        # an affiliate/commission disclosure is required boilerplate (FTC), never a claim to cut
        protected = protected or bool(_DISCLOSURE.search(exact))
        cand = house_style(str(f.get("replacement") or ""))
        if delete_all and cand and not is_cell and (
                _is_word_removal(exact, cand) or _is_closed_rewrite(exact, cand, src)):
            rep = cand   # a rewrite from the quote's own words + SOURCE vocabulary, limiters unchanged
        if rep:
            added = _new_tokens(rep, src + "\n" + cur)
            if added:
                if on_new != "delete" or protected:
                    unapplied.append({**f, "reason": f"replacement adds {added[:4]} not in SOURCE"}); continue
                log(f"claim check: replacement refused (adds {added[:4]} not in SOURCE) — quote deleted instead")
                rep = ""
        if protected and not rep:
            unapplied.append({**f, "reason": "title/heading/metadata: never deleted, needs a reworded replacement"}); continue
        if is_cell and not rep:
            rep = "Not published"
        elif delete_all and not rep and "|" not in exact:
            if _SENT_END.search(exact.strip()):
                unapplied.append({**f, "reason": "delete pass: quote spans several sentences; left for the auditor"}); continue
            exact = _sentence_span(cur, exact)
        if exact.count("|") != rep.count("|"):
            unapplied.append({**f, "reason": "replacement would change the table's columns"}); continue
        k = cur.find(exact)
        head, tail = cur[:k], cur[k + len(exact):]
        if not rep and tail.lstrip()[:1].islower() and (not head.strip() or re.search(r"[.!?:]\s*$", head)
                                                        or re.fullmatch(r"\s*(?:[-*]|\d+\.)\s*", head)):
            j = len(tail) - len(tail.lstrip())   # a cut at a sentence start leaves the next word capitalised
            tail = tail[:j] + tail[j].upper() + tail[j + 1:]
        new = _tidy(head + rep + tail)
        if fm_key and not new.startswith(fm_key.group(0)):
            unapplied.append({**f, "reason": f"would break the frontmatter key {fm_key.group(1)!r}"}); continue
        if fmt == "markdown":
            lines[where[1]] = new
        else:
            where[0][where[1]] = new
        applied.append({"id": uid, "quote": exact, "replacement": rep,
                        "type": f.get("type") or f.get("finding"), "why": f.get("why")})
        if not re.sub(r"[\W_]+", "", new) or re.fullmatch(r"\s*(?:[-*]|\d+\.)?\s*\*\*[^*]+\*\*:?\s*", new):
            drop.append(where)   # nothing left, or only a bullet's bold label
        if re.fullmatch(r"\s*(?:[-*]|\d+\.)?\s*\*\*[^*]+\*\*:?\s*", new) and fmt == "json":
            where[0][where[1]] = ""
        units = _units("\n".join(lines) if fmt == "markdown" else page, fmt)
        by_id = {u[0]: u for u in units}
    if fmt == "markdown":
        drop_lines = {w[1] for w in drop}
        return "\n".join(l for i, l in enumerate(lines) if i not in drop_lines), applied, unapplied
    # emptied strings: list items are removed; dict values stay "" (flagged by the caller)
    for parent, key in sorted((w for w in drop if isinstance(w[0], list)), key=lambda w: -w[1]):
        try:
            if not re.sub(r"[\W_]+", "", parent[key]):
                parent.pop(key)
        except Exception:  # noqa: BLE001
            pass
    return page, applied, unapplied


def _checker_call(system: str, prompt: str, thinking: str = None) -> list | None:
    """One JSON verifier call through the normal chain (usage recorded as kind=claim-check)."""
    global TEMPERATURE
    saved_kind, saved_t = os.environ.get("CONTENT_KIND"), TEMPERATURE
    os.environ["CONTENT_KIND"] = "claim-check"; TEMPERATURE = 0.2
    try:
        text = complete(system, prompt, json_mode=True, writer_scope=False, thinking=thinking or CLAIMCHECK_THINKING,
                        max_tokens=CLAIMCHECK_MAX_TOKENS)
    except Exception as e:  # noqa: BLE001
        log(f"claim check unavailable ({type(e).__name__}: {str(e)[:140]})"); return None
    finally:
        TEMPERATURE = saved_t
        if saved_kind is None: os.environ.pop("CONTENT_KIND", None)
        else: os.environ["CONTENT_KIND"] = saved_kind
    try:
        d = json.loads(strip_fences(text), strict=False)
    except Exception:  # noqa: BLE001
        i, j = text.find("{"), text.rfind("}")
        try: d = json.loads(text[i:j + 1], strict=False)
        except Exception: log("claim check returned unparseable JSON — skipped"); return None  # noqa: E701
    items = (d.get("units") or d.get("findings") or []) if isinstance(d, dict) else d
    if not isinstance(items, list):
        return []
    out = []
    for it in items:
        if not isinstance(it, dict):
            continue
        if isinstance(it.get("findings"), list):   # the per-unit walk, whatever key the model wrapped it in
            out += [{**x, "id": x.get("id") or it.get("id")} for x in it["findings"] if isinstance(x, dict)]
        elif "quote" in it or "replacement" in it:   # a finding (fix: may carry replacement null)
            out.append(it)
    return out


def _units_block(page, fmt: str) -> str:
    # one unit per line: a multi-line string (a JSON table) is shown on one line; quotes copied
    # from it still match via apply_findings' whitespace-tolerant fallback
    nl = re.compile(r"\s*\n\s*")
    return "\n".join(uid + " ::: " + nl.sub(" ", text) for uid, text, _ in _units(page, fmt))


def claim_check(page, fmt: str, a, passes: int = None, delete_from: int = None) -> tuple:
    """Find claims SOURCE does not support and fix them in place. Returns (page, report).
    Passes before `delete_from` splice the checker's replacements; from `delete_from` on, every
    finding is deleted instead (default: the last pass when there are 2+, so nothing written by
    the checker goes unchecked and the loop ends without a separate confirm call)."""
    src = _source_text(a)
    total = passes or CLAIMCHECK_PASSES
    if delete_from is None:
        delete_from = total - 1 if total > 1 else total
    rep = {"passes": 0, "found": [], "applied": [], "deleted_final": 0, "unapplied": [], "remaining": [],
           "thinking": CLAIMCHECK_THINKING, "final_thinking": CLAIMCHECK_FINAL_THINKING, "extra_pass": False}
    n = -1
    while n + 1 < total:
        n += 1
        final = n >= delete_from
        prompt = f"SOURCE\n======\n{src}\n\nUNITS\n=====\n{_units_block(page, fmt)}\n"
        # the first full read gets the deeper reasoning; a later delete-only sweep is the cheap one
        found = _checker_call(CLAIMCHECK_SYSTEM, prompt,
                              CLAIMCHECK_FINAL_THINKING if (final and n > 0) else CLAIMCHECK_THINKING)
        if found is None:
            rep["error"] = "checker unavailable"; break
        rep["passes"] = n + 1; rep["found"].append(len(found))
        if not found:
            break
        n_units = len(_units(page, fmt))
        if final and len(found) > max(8, n_units // 3):
            # a delete-only sweep that condemns a third of the page is a checker malfunction, not a
            # page to gut: apply nothing and hand every finding to the auditor instead
            rep["remaining"] = [{"id": f.get("id"), "quote": f.get("quote"), "type": f.get("type"),
                                 "reason": "final pass over-flagged; not applied"} for f in found]
            log(f"claim check pass {n + 1}: {len(found)} finding(s) on {n_units} units — over-flagged, "
                f"nothing deleted; listed for the auditor")
            break
        page, ok, bad = apply_findings(page, fmt, found, src=src, on_new="delete", delete_all=final)
        rep["applied"] += ok; rep["unapplied"] += bad
        if final:
            rep["deleted_final"] += len(ok)
        elif len(found) >= CLAIMCHECK_ADAPT > 0 and not rep["extra_pass"]:
            # a heavily padded draft: one pass rarely catches all of it, so read it in full once
            # more (replacing) before the delete-only sweep. Bounded: at most one extra call.
            rep["extra_pass"] = True; total += 1; delete_from += 1
        rep["remaining"] = [{"id": f.get("id"), "quote": f.get("quote"), "type": f.get("type"),
                             "reason": f.get("reason")} for f in bad]
        log(f"claim check pass {n + 1}: {len(found)} unsupported claim(s), {len(ok)} "
            f"{'deleted' if final else 'fixed in place'}{f', {len(bad)} not applied' if bad else ''}")
    return page, rep


def _finish_guards(page, fmt: str, a, report: dict, cc: dict) -> tuple:
    """Re-run the mechanical guards on the checked page and fold the claim-check result in."""
    if fmt == "markdown":
        page, rep2 = verify_markdown(page, a)
    else:
        page, rep2 = verify(json.dumps(page, ensure_ascii=False), a)
    for k in ("words", "numbers_not_in_facts"):
        if k in rep2: report[k] = rep2[k]
    report["flags"] = [x for x in report.get("flags", []) if "< depth floor" not in x]
    report["flags"] += [x for x in rep2.get("flags", []) if "< depth floor" in x]
    report["claim_check"] = cc
    emptied = []
    if fmt == "json":
        for sec in page.get("sections", []) or []:
            if isinstance(sec, dict) and not any(isinstance(x, str) and x.strip() for x in (sec.get("content") or [])) \
                    and not (sec.get("bullets") or []):
                emptied.append(sec.get("heading") or sec.get("id") or "?")
        for q in page.get("faqItems", []) or []:
            if isinstance(q, dict) and not str(q.get("answer", "")).strip():
                emptied.append("FAQ: " + str(q.get("question", "?")))
    else:
        ls = [l for l in page.split("\n")]
        for i, l in enumerate(ls):
            if re.match(r"^#{2,6}\s", l):
                nxt = next((x for x in ls[i + 1:] if x.strip()), "")
                if not nxt or re.match(r"^#{1,6}\s", nxt) and len(re.match(r"^(#+)", nxt).group(1)) <= len(re.match(r"^(#+)", l).group(1)):
                    emptied.append(l.strip("# ").strip())
    if emptied and cc.get("applied"):
        report["flags"].append(f"emptied by the claim check (nothing in the fact list could carry it): {emptied[:5]} — "
                               f"source facts for it and regenerate, or drop the section; never refill it unsourced")
    if cc.get("remaining"):
        qs = "; ".join(repr((r.get("quote") or "")[:80]) for r in cc["remaining"][:4])
        report["flags"].append(f"claim check: {len(cc['remaining'])} claim(s) still unsupported after "
                               f"{cc['passes']} pass(es) — auditor must cut or source: {qs}")
    if a.floor and report.get("words", 0) < a.floor and cc.get("applied"):
        report["flags"].append(
            f"{report['words']} words < floor {a.floor} after removing unsupported claims: the fact list is "
            f"too thin for this page. Expand it with SOURCED facts, then regenerate (Rung 2). Never pad.")
    return page, report


# ───────────────────────────── commands ─────────────────────────────
def est_cost(model: str, it, ot, tt, ct=0) -> float | None:
    rin = os.environ.get("CONTENT_RATE_IN"); rout = os.environ.get("CONTENT_RATE_OUT")
    rate = (float(rin), float(rout)) if rin and rout else RATES.get(model.lower())
    if not rate or it is None or ot is None:
        return None
    ct = min(ct or 0, it)   # cached tokens are part of promptTokenCount, billed at the cached rate
    cr = CACHED_RATES.get(model.lower(), CACHED_RATE)
    return round(((it - ct) * rate[0] + ct * rate[0] * cr + (ot + (tt or 0)) * rate[1]) / 1_000_000, 4)


def cmd_preflight(a) -> int:
    global CMD
    CMD = "preflight"
    chain = _chain()
    print(f"[content_gen] primary   : {MODEL} ({provider_for(MODEL)})")
    print(f"[content_gen] fallback  : {' -> '.join(_fallbacks()) or 'none'}")
    if provider_for(MODEL) == "anthropic":
        print(f"[content_gen] claude effort: {ANTHROPIC_EFFORT} (adaptive thinking)")
    print(f"[content_gen] thinking  : {THINKING}   max_tokens: {MAX_TOKENS}")
    # "Never block a routine on a dry key": the run may proceed if the PRIMARY answers, or —
    # failing that — the FALLBACK does (write() then falls back, loudly). A cloud sandbox that
    # has only the OpenAI key (Gemini key not yet injected) keeps producing pages via the
    # fallback, and every page's meta + the run email say so. Only a chain with NO usable
    # model stops the phase.
    usable = []
    for m in chain:
        p = provider_for(m)
        try:
            name, key = resolve_key(p)
        except KeyError as e:
            print(f"[content_gen] {m:22} KEY MISSING — {e}"); continue
        try:
            # tiny ping, no thinking, so a thinking model can't eat the cap
            r = CALLERS[p](m, "Reply with exactly: OK", "ping", 256, "0" if p == "gemini" else "low")
            if not r["text"].strip():
                raise RuntimeError(f"empty reply (finish={r['finish']}) — model id/mode wrong or output starved")
            print(f"[content_gen] {m:22} OK  key={name}(…{key[-4:]}) replied={r['text'].strip()[:12]!r}")
            record(r, kind="preflight")   # a real billable call on every routine run — never invisible
            usable.append(m)
        except Exception as e:  # noqa: BLE001
            print(f"[content_gen] {m:22} FAIL — {str(e)[:160]}")
    if not usable:
        die(2, "preflight failed: no usable model in the chain")
    if usable[0] != MODEL:
        print(f"[content_gen] WARNING: primary {MODEL} unusable — this run will write via the "
              f"FALLBACK ({usable[0]}). Every page will be marked fallback_used in its meta.")
    print("[content_gen] preflight OK")
    return 0


def verify_markdown(text: str, a) -> tuple[str, dict]:
    """Same ladder for a MARKDOWN page (Astro/markdown/MDX stores): no JSON parsing.
    Rung 0: fence stripped, control chars + house style normalised (code blocks left alone),
    off-list links stripped with the text kept. Rung 1: flags for the auditor."""
    report = {"repairs": [], "flags": []}
    text = text.strip()
    # Unwrap an OUTER ```markdown fence only. A page body may legitimately contain code
    # blocks, so never blindly cut the last ``` in the file: drop the first line if it is a
    # bare/markdown fence, then drop the trailing ``` only if the remaining fences are odd
    # (i.e. that trailing one is the unmatched outer closer).
    lines = text.split("\n")
    if lines and re.match(r"^```(markdown|md)?\s*$", lines[0]):
        body = lines[1:]
        if body and body[-1].strip() == "```" and sum(1 for l in body if l.strip().startswith("```")) % 2 == 1:
            body = body[:-1]
        text = "\n".join(body).strip()
        report["repairs"].append("stripped outer markdown code fence")
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", " ", text)
    # frontmatter must be line 1: drop a stray preamble (e.g. an agent "standard-loaded:" receipt
    # the writer echoed from the standards) sitting above a frontmatter block
    ls = text.split("\n")
    k = next((i for i, l in enumerate(ls[:6]) if l.strip() == "---"), None)
    if k and len(ls) > k + 1 and re.match(r"^[A-Za-z_][\w-]*:\s", ls[k + 1]):
        report["repairs"].append(f"dropped {k} line(s) above the frontmatter: {ls[0][:60]!r}")
        text = "\n".join(ls[k:])
    # house style outside fenced code blocks only
    parts = re.split(r"(```.*?```)", text, flags=re.S)
    text = "".join(p if p.startswith("```") else fix_table_separators(house_style(p)) for p in parts)
    if a.allowed_urls:
        allowed = [u.strip() for u in pathlib.Path(a.allowed_urls).read_text().splitlines() if u.strip()]
        ok = lambda u: any(u.startswith(x) for x in allowed)  # noqa: E731
        removed = []

        def md(m):
            if ok(m.group(2)):
                return m.group(0)
            removed.append(m.group(2)); return m.group(1)
        text = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", md, text)
        for u in _EXT.findall(text):
            if not ok(u):
                removed.append(u); text = text.replace(u, "")
        removed = sorted({u for u in removed if u})
        report["disallowed_urls_removed"] = removed
        if removed:
            report["repairs"].append(f"removed {len(removed)} off-list link(s), kept the text")
            report["flags"].append(f"auditor: verify the sentences that cited {removed[:3]} are still supported")
    if getattr(a, "cmd", "") == "section":
        # A SECTION is spliced into an existing page: it never carries the page's H1, and it
        # must not re-create a heading the page already has (the agent would then have two).
        h1 = [l for l in text.split("\n") if re.match(r"^#\s", l)]
        if h1:
            text = "\n".join(l for l in text.split("\n") if not re.match(r"^#\s", l)).strip()
            report["repairs"].append(f"dropped {len(h1)} H1 line(s) — a section has no page title")
        if getattr(a, "page", ""):
            page_heads = {re.sub(r"^#+\s*", "", l).strip().lower()
                          for l in pathlib.Path(a.page).read_text().split("\n") if re.match(r"^#{2,}\s", l)}
            dup = [l for l in text.split("\n") if re.match(r"^#{2,}\s", l)
                   and re.sub(r"^#+\s*", "", l).strip().lower() in page_heads]
            if dup:
                report["flags"].append(f"auditor: section repeats existing page heading(s) {dup[:3]} — merge, do not duplicate")
    words = len(text.split()); report["words"] = words
    if a.floor and words < a.floor:
        report["flags"].append(f"{words} words < depth floor {a.floor}")
    if a.facts:
        src = pathlib.Path(a.facts).read_text() + "\n" + pathlib.Path(a.prompt).read_text()

        def norm(n):
            n = n.replace(",", "").rstrip("%")
            return n.rstrip("0").rstrip(".") if "." in n else n
        allowed_nums = {norm(n) for n in _NUM.findall(src)}
        found = {norm(n) for n in _NUM.findall(text)}
        report["numbers_not_in_facts"] = sorted(n for n in found - allowed_nums
                                                if len(n.rstrip("%").replace(".", "")) >= 2 and n not in {"10", "20", "50", "100"})
    return text, report


# ───────────────────────────── writer scope (what the WRITER is sent) ─────────────────────────────
# The standards files are the source of truth for writers, auditors AND orchestrators, so they carry
# sections the WRITER can do nothing with: the auditor's pass/fail checklists, the preflight, the
# retired intro-humanize step, defend-lock, scope notes, sync banners. Measured 2026-09-07: those were
# 10.6k of a 28–32k-token system prompt (~35% of input) on runs that pasted the files whole.
# NOTHING is changed on disk — this only decides what goes into the model call. Every dropped
# section is named in meta.guards.writer_scope so the omission is visible, never silent.
WRITER_SKIP_HEADINGS = (
    "AUDITOR",                          # both files: the reviewer's checklist (anti-AI dupe; standard's hard fails)
    "Hard fails", "Advisory notes",     # standard → AUDITOR children (in case they appear alone)
    "INTRO HUMANIZE",                   # retired for API-written pages; instructs the orchestrator
    "PREFLIGHT",                        # routine setup checks
    "DEFEND-LOCK",                      # "check before you EDIT an existing page"
    "SCOPE",                            # who must read the file
    "Step 4 — read it back before hand-off",   # hand-off instruction to the agent
)
_HEAD = re.compile(r"^(#{1,6})\s+(.*)$")


def writer_scope(text: str) -> tuple[str, dict]:
    """Return the system text with writer-useless sections and HTML comment banners removed."""
    lines = text.split("\n"); out = []; dropped = []; skip_level = None; skip_name = None; dropped_tokens = 0
    for l in lines:
        m = _HEAD.match(l)
        if m:
            level, title = len(m.group(1)), m.group(2).strip()
            if skip_level is not None and level <= skip_level:
                skip_level = skip_name = None           # left the skipped section
            if skip_level is None and any(title.startswith(h) or title.upper().startswith(h.upper()) for h in WRITER_SKIP_HEADINGS):
                skip_level, skip_name = level, title
                dropped.append(title[:60]); continue
        if skip_level is not None:
            dropped_tokens += len(l) // 4; continue
        out.append(l)
    body = "\n".join(out)
    # HTML comment banners (sync/source-of-truth notes) — never instructions for a writer
    comments = re.findall(r"<!--.*?-->", body, flags=re.S)
    if comments:
        dropped_tokens += sum(len(c) // 4 for c in comments)
        body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    # the retired intro-humanize step is also described in a bold paragraph inside the WRITER rules
    carve = re.findall(r"^\*\*THE INTRO HUMANIZE CARVE-OUT\.\*\*.*?(?=\n\s*\n|\Z)", body, flags=re.S | re.M)
    if carve:
        dropped_tokens += sum(len(c) // 4 for c in carve); dropped.append("INTRO HUMANIZE carve-out paragraph")
        body = re.sub(r"^\*\*THE INTRO HUMANIZE CARVE-OUT\.\*\*.*?(?=\n\s*\n|\Z)", "", body, flags=re.S | re.M)
    body = re.sub(r"\n{4,}", "\n\n\n", body)
    return body, {"dropped_sections": dropped, "html_comments_dropped": len(comments),
                  "tokens_dropped_est": dropped_tokens, "tokens_sent_est": len(body) // 4}


def cmd_system(a) -> int:
    """Build system.md deterministically from the standards (files untouched), writer-scoped."""
    root = _repo_root() or pathlib.Path.cwd()
    C = root / ".claude" / "commands"
    parts = []
    if a.voice:
        parts.append("## VOICE SAMPLE — imitate this page (same site, same page type)\n\n" + pathlib.Path(a.voice).read_text().strip())
    if a.contract:
        parts.append("## OUTPUT CONTRACT\n\n" + pathlib.Path(a.contract).read_text().strip())
    anti = C / "_anti-ai-language.md"
    if anti.exists():
        parts.append("## RULES THAT OUTRANK EVERYTHING BELOW (anti-AI language, WRITER section)\n\n" + anti.read_text().strip())
    exp = C / "_experience.md"
    if exp.exists():
        parts.append("## DOMAIN — who \"we\" are (the only source for any first-person claim)\n\n" + exp.read_text().strip())
    local = C / "_content-standard.local.md"
    if local.exists():
        parts.append("## LOCAL STANDARD (this site)\n\n" + local.read_text().strip())
    std = C / "_content-standard.md"
    if std.exists():
        parts.append("## STRUCTURE, SEO, DEPTH, SOURCING, STYLE RULES (content standard)\n\n" + std.read_text().strip())
    text, rep = writer_scope("\n\n".join(parts))
    out = pathlib.Path(a.out); out.parent.mkdir(parents=True, exist_ok=True); out.write_text(text)
    log(f"system.md built: ≈{rep['tokens_sent_est']:,} tokens sent; dropped ≈{rep['tokens_dropped_est']:,} "
        f"({len(rep['dropped_sections'])} sections, {rep['html_comments_dropped']} comment banners) — files untouched")
    for s in rep["dropped_sections"]: log(f"   - {s}")
    return 0


def cmd_write(a) -> int:
    global CALLER, JSON_MODE, THINKING, CMD
    CMD = a.cmd
    if a.cmd == "section" and THINKING in _LEVELS and _LEVELS.index(SECTION_THINKING) < _LEVELS.index(THINKING):
        log(f"section: thinking {THINKING} -> {SECTION_THINKING} (CONTENT_SECTION_THINKING)")
        THINKING = SECTION_THINKING
    if not CALLER:
        # Routines write under reports/<routine>/<date>/drafts/… — the routine name IS the caller.
        parts = pathlib.Path(a.out).resolve().parts
        if "reports" in parts and parts.index("reports") + 1 < len(parts):
            CALLER = parts[parts.index("reports") + 1]
    system = pathlib.Path(a.system).read_text()
    prompt = pathlib.Path(a.prompt).read_text()
    if a.facts and "# GROUNDING (appended by content_gen.py" not in prompt:
        prompt = prompt.rstrip() + "\n" + GROUNDING   # the standing fact rule rides on every fact-listed row
    budget = fact_budget(a)
    if budget and budget["thin"]:
        log(f"WARNING {a.slug}: closed fact list ≈{budget['fact_words']} words for a {a.floor}-word floor "
            f"(ratio {budget['ratio']} < {FACT_BUDGET_RATIO}) — a writer fills that gap with unlisted claims. "
            f"Expand the list with SOURCED facts before spending a regeneration.")
    # --format json (the default, and every TS/JSON-store page) needs the provider's actual
    # JSON mode, or the model is free to answer in plain prose — see call_gemini/call_openai's
    # JSON_MODE checks. `section`/markdown output never wants this.
    JSON_MODE = (a.format == "json")
    t0 = time.time()   # writer scoping happens inside generate(), for every caller
    try:
        r = generate(system, prompt)
    except RuntimeError as e:
        die(3, str(e))
    if r["fallback_used"]:
        log(f"FALLBACK USED for {a.slug}: {r['model']} — {r['fallback_reason']}")

    out = pathlib.Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    fmt = "markdown" if a.format == "markdown" else "json"
    if fmt == "markdown":
        page, report = verify_markdown(r["text"], a)
    else:
        page, report = verify(r["text"], a)
    if budget:
        report["fact_budget"] = budget
        if budget["thin"]:
            report["flags"].append(f"thin fact list: ≈{budget['fact_words']} fact words for a {a.floor}-word floor "
                                   f"(ratio {budget['ratio']}); expand it with sourced facts before any regeneration")
    if a.facts and CLAIMCHECK_ON:
        # Rung 1 for claims, before any reviewer reads a word: unsupported sentences are replaced by
        # what the fact list supports (or deleted). The unchecked draft is kept beside the draft.
        pre = out.with_suffix(out.suffix + ".precheck")
        pre.write_text(page if fmt == "markdown" else json.dumps(page, ensure_ascii=False, indent=2))
        words_before = report.get("words")
        page, cc = claim_check(page, fmt, a)
        cc["words_before"] = words_before
        page, report = _finish_guards(page, fmt, a, report, cc)
    out.write_text(page if fmt == "markdown" else json.dumps(page, ensure_ascii=False, indent=2))
    meta = {
        "slug": a.slug, "schema": a.schema, "kind": a.cmd,
        "model": r["model"], "provider": r["provider"], "requested_model": MODEL,
        "fallback_used": r["fallback_used"], "fallback_reason": r["fallback_reason"],
        "retried_for_truncation": r.get("retried_for_truncation", False),
        "thinking": THINKING, "key_source": r["key_source"],
        "finish_reason": r["finish"], "words": report["words"], "floor": a.floor,
        "input_tokens": r["input_tokens"], "output_tokens": r["output_tokens"],
        "thinking_tokens": r["thinking_tokens"], "cached_tokens": r.get("cached_tokens") or 0,
        "est_cost_usd": est_cost(r["model"], r["input_tokens"], r["output_tokens"], r["thinking_tokens"], r.get("cached_tokens") or 0),
        "guards": {**report, "writer_scope": LAST_SCOPE}, "seconds": round(time.time() - t0, 1),
        "response_id": r["response_id"],
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    out.with_suffix(out.suffix + ".meta.json").write_text(json.dumps(meta, indent=1))
    log(f"wrote {out} ({report['words']} words, {meta['seconds']}s, model={meta['model']}"
        f"{' FALLBACK' if r['fallback_used'] else ''}, cost≈${meta['est_cost_usd']})")
    return 0


def cmd_fix(a) -> int:
    """FIX-IN-PLACE for Phase 4 findings: model-written replacements, exact-string splices, re-checked."""
    global CMD, CALLER
    CMD = "fix"
    draft = pathlib.Path(a.draft)
    fmt = a.format or ("json" if draft.suffix == ".json" else "markdown")
    if not CALLER:
        parts = draft.resolve().parts
        if "reports" in parts and parts.index("reports") + 1 < len(parts):
            CALLER = parts[parts.index("reports") + 1]
    a.prompt = a.prompt or a.facts
    a.out = str(draft)
    raw = draft.read_text()
    page = json.loads(raw, strict=False) if fmt == "json" else raw
    # the page's own slug wins: verify() would otherwise "repair" it to the file name
    a.slug = a.slug or (page.get("slug") if isinstance(page, dict) else "") or draft.name.split(".")[0]
    findings_text = pathlib.Path(a.findings).read_text().strip()
    if not findings_text:
        log("fix: findings file is empty — nothing to do"); return 0
    prompt = (f"SOURCE\n======\n{_source_text(a)}\n\nAUDIT FINDINGS\n==============\n{findings_text}\n\n"
              f"UNITS\n=====\n{_units_block(page, fmt)}\n")
    found = _checker_call(FIX_SYSTEM, prompt)
    if found is None:
        die(3, "fix: the model call failed — nothing was changed")
    n = len(list(draft.parent.glob(draft.name + ".pre-fix-*"))) + 1
    draft.with_name(f"{draft.name}.pre-fix-{n}").write_text(raw)
    page, ok, bad = apply_findings(page, fmt, found, src=_source_text(a), on_new="skip")
    cc = {"passes": 0, "found": [], "applied": [], "unapplied": [], "remaining": []}
    if a.facts and CLAIMCHECK_ON:
        # a replacement must not smuggle in a new claim: one pass, and what it finds is deleted
        page, cc = claim_check(page, fmt, a, passes=1, delete_from=0)
    report = {"repairs": [], "flags": []}
    page, report = _finish_guards(page, fmt, a, report, cc)
    draft.write_text(page if fmt == "markdown" else json.dumps(page, ensure_ascii=False, indent=2))
    mp = draft.with_suffix(draft.suffix + ".meta.json")
    meta = json.loads(mp.read_text()) if mp.exists() else {"slug": a.slug}
    g = meta.setdefault("guards", {})
    g.setdefault("fixes", []).append({
        "round": n, "at": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "findings_file": str(a.findings),
        "applied": ok, "not_fixable_in_place": bad, "claim_check": cc,
        "words": report.get("words"), "flags": report.get("flags")})
    meta["words"] = report.get("words", meta.get("words"))
    g["flags"] = report.get("flags", [])
    g["numbers_not_in_facts"] = report.get("numbers_not_in_facts", g.get("numbers_not_in_facts"))
    mp.write_text(json.dumps(meta, indent=1))
    log(f"fix round {n} on {draft}: {len(ok)} finding(s) fixed in place, {len(bad)} not fixable in place, "
        f"{len(cc.get('applied', []))} further unsupported claim(s) deleted by the re-check; "
        f"{report.get('words')} words (floor {a.floor or '-'}); backup {draft.name}.pre-fix-{n}")
    for b in bad:
        log(f"   NOT FIXABLE IN PLACE ({b.get('reason')}): {str(b.get('quote') or b.get('finding'))[:120]!r}")
    for fl in report.get("flags", []):
        log(f"   FLAG: {fl[:200]}")
    return 0


def cmd_usage(a) -> int:
    """The chart: what each caller actually spent, from the ledger."""
    p = pathlib.Path(a.log).expanduser() if a.log else usage_log_path()
    if not p.exists():
        print(f"[content_gen] no ledger at {p} — nothing has been recorded yet"); return 0
    rows = []
    for line in p.read_text().splitlines():
        try: d = json.loads(line)
        except Exception: continue
        if a.since and (d.get("ts") or "") < a.since: continue
        rows.append(d)
    if not rows:
        print(f"[content_gen] ledger {p}: no rows{' since ' + a.since if a.since else ''}"); return 0
    key = (lambda d: d.get(a.by) or "-")
    agg = {}
    for d in rows:
        k = key(d)
        s = agg.setdefault(k, {"calls": 0, "in": 0, "out": 0, "think": 0, "cost": 0.0,
                               "norate": 0, "disc": 0, "fb": 0})
        s["calls"] += 1
        s["in"] += d.get("input_tokens") or 0
        s["out"] += d.get("output_tokens") or 0
        s["think"] += d.get("thinking_tokens") or 0
        if d.get("cost_usd") is None: s["norate"] += 1
        else: s["cost"] += d["cost_usd"]
        if d.get("discarded"): s["disc"] += 1
        if d.get("fallback_used"): s["fb"] += 1
    w = max(len(str(k)) for k in agg) + 1
    print(f"ledger: {p}")
    print(f"{a.by.upper():{w}} {'calls':>6} {'discard':>8} {'fallbk':>7} {'input':>12} {'output':>10} {'thinking':>10} {'cost $':>9}")
    tot = {"calls": 0, "in": 0, "out": 0, "think": 0, "cost": 0.0, "norate": 0, "disc": 0, "fb": 0}
    for k, s in sorted(agg.items(), key=lambda kv: -kv[1]["cost"]):
        print(f"{k:{w}} {s['calls']:6} {s['disc']:8} {s['fb']:7} {s['in']:12,} {s['out']:10,} {s['think']:10,} {s['cost']:9.3f}")
        for f in tot: tot[f] += s[f]
    print(f"{'TOTAL':{w}} {tot['calls']:6} {tot['disc']:8} {tot['fb']:7} {tot['in']:12,} {tot['out']:10,} {tot['think']:10,} {tot['cost']:9.3f}")
    if tot["think"]:
        print(f"\nthinking is {tot['think']/max(tot['out']+tot['think'],1)*100:.0f}% of billed output "
              f"(≈${tot['think']*3.75/1e6:.2f} at the gemini-3.8-flash rate)")
    if tot["norate"]:
        print(f"{tot['norate']} call(s) have no rate for their model — tokens are recorded, cost is not.")
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("preflight")
    u = sub.add_parser("usage", help="per-caller spend from the usage ledger")
    u.add_argument("--log", default="", help="ledger path (default: the run's own)")
    u.add_argument("--since", default="", help="ISO date prefix, e.g. 2026-09-07")
    u.add_argument("--by", default="caller", choices=["caller", "model", "kind", "repo", "ts"])
    w = sub.add_parser("write")
    w.add_argument("--system", required=True)
    w.add_argument("--prompt", required=True)
    w.add_argument("--out", required=True)
    w.add_argument("--slug", required=True)
    w.add_argument("--floor", type=int, default=0)
    w.add_argument("--schema", default="guide", choices=sorted(SCHEMAS))
    w.add_argument("--format", default="json", choices=["json", "markdown"],
                   help="json = a page object (TS/JSON stores); markdown = a whole page file (Astro/markdown/MDX stores)")
    w.add_argument("--allowed-urls", dest="allowed_urls", default="")
    w.add_argument("--facts", default="")
    # section: an ENRICHMENT of an existing page (FAQ answer, new section, body paragraphs, an
    # answer block, a rewritten section). Same models, same ladder, same meta.json; output is
    # always markdown prose the agent splices in (for TS/JSON stores it maps paragraphs to the
    # page's content[] strings). --page is the CURRENT page text: sent by the agent inside the
    # prompt as context, and used here to catch a duplicated heading.
    s = sub.add_parser("section", help="generate a section/paragraphs to add to an EXISTING page")
    s.add_argument("--system", required=True)
    s.add_argument("--prompt", required=True)
    s.add_argument("--out", required=True)
    s.add_argument("--slug", required=True, help="<page-slug>--<section-id>")
    s.add_argument("--page", default="", help="file holding the page's current text (heading dedup)")
    s.add_argument("--floor", type=int, default=0)
    s.add_argument("--allowed-urls", dest="allowed_urls", default="")
    s.add_argument("--facts", default="")
    sy = sub.add_parser("system", help="build a writer-scoped system.md from the standards (files untouched)")
    sy.add_argument("--voice", default="", help="file with the real page to imitate (JSON or markdown)")
    sy.add_argument("--contract", default="", help="file with the output contract for this page shape")
    sy.add_argument("--out", required=True)
    fx = sub.add_parser("fix", help="FIX-IN-PLACE a draft for Phase 4 findings (model-written replacements, re-checked)")
    fx.add_argument("--draft", required=True, help="the draft file (.json page object or markdown); edited in place, backup kept")
    fx.add_argument("--findings", required=True, help="text file with the auditor's findings for THIS page (quotes + defects)")
    fx.add_argument("--facts", default="", help="the closed fact list (usually the row prompt)")
    fx.add_argument("--prompt", default="", help="the row prompt, if separate from --facts")
    fx.add_argument("--allowed-urls", dest="allowed_urls", default="")
    fx.add_argument("--slug", default="")
    fx.add_argument("--floor", type=int, default=0)
    fx.add_argument("--schema", default="none", choices=sorted(SCHEMAS))
    fx.add_argument("--format", default="", choices=["", "json", "markdown"])
    a = ap.parse_args(argv)
    if a.cmd == "section":
        a.format, a.schema = "markdown", "none"
    return {"preflight": cmd_preflight, "write": cmd_write, "section": cmd_write,
            "usage": cmd_usage, "system": cmd_system, "fix": cmd_fix}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
