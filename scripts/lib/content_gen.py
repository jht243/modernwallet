#!/usr/bin/env python3
"""content_gen.py — the fleet's shared, model-agnostic page-prose generator (Phase 3 backend).

ONE generator for every routine that writes new pages. The MODEL is a config value, not a
code path, so swapping models fleet-wide is one env change:

    CONTENT_MODEL=gemini-3.8-flash          primary  (default)
    CONTENT_FALLBACK_MODEL=gpt-5.6-sol      used ONLY when the primary fails; always logged
    CONTENT_THINKING=high                   reasoning effort (gemini thinkingLevel / openai effort)
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
MODEL = os.environ.get("CONTENT_MODEL", "gemini-3.8-flash")
FALLBACK = os.environ.get("CONTENT_FALLBACK_MODEL", "gpt-5.6-sol")
# Reasoning effort is HIGH for every writer model (Gemini thinkingLevel, OpenAI reasoning
# effort, Anthropic extended thinking). Standard set 2026-09-06. An empty or unrecognised
# value falls back to "high" rather than silently omitting reasoning; a numeric value is a
# Gemini token budget for deliberate experiments only.
_t = os.environ.get("CONTENT_THINKING", "high").strip().lower()
THINKING = _t if (_t in ("low", "medium", "high") or _t.lstrip("-").isdigit()) else "high"
if _t and THINKING != _t:
    print(f"[content_gen] WARNING: CONTENT_THINKING={_t!r} not recognised — using 'high'", file=sys.stderr)
MAX_TOKENS = int(os.environ.get("CONTENT_MAX_TOKENS", "40000"))
RETRIES = int(os.environ.get("CONTENT_RETRIES", "6"))
BACKOFF_CAP = int(os.environ.get("CONTENT_BACKOFF_CAP", "20"))
FORCE_FALLBACK = os.environ.get("CONTENT_FORCE_FALLBACK") == "1"   # test hook
GEMINI_MODE = os.environ.get("GEMINI_API_MODE", "aistudio").lower()
GEMINI_PROJECT = os.environ.get("GEMINI_PROJECT", "")
GEMINI_LOCATION = os.environ.get("GEMINI_LOCATION", "global")
JSON_MODE = False   # set by complete(json_mode=True): ask the provider for a JSON object

# USD per 1M tokens (input, output). Thinking bills as output. Override per run with
# CONTENT_RATE_IN / CONTENT_RATE_OUT. Gemini 3.8 Flash intro rate doubles 2027-01-01.
RATES = {
    "gemini-3.8-flash": (0.75, 3.75),
}

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
        cost = est_cost(r.get("model", "?"), it, ot, tt)
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
            "thinking_tokens": tt, "cost_usd": cost, "thinking": THINKING,
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
        "anthropic": ("ANTHROPIC_API_KEY",),
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
    gen = {"temperature": 0.7, "maxOutputTokens": max_tokens}
    if JSON_MODE:
        gen["responseMimeType"] = "application/json"
    if thinking in ("low", "medium", "high"):
        gen["thinkingConfig"] = {"thinkingLevel": thinking}
    elif thinking.lstrip("-").isdigit():
        gen["thinkingConfig"] = {"thinkingBudget": int(thinking)}
    payload = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
               "generationConfig": gen}
    if system.strip():
        payload["systemInstruction"] = {"parts": [{"text": system}]}
    resp = _post(url, headers, payload)
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


def call_anthropic(model: str, system: str, prompt: str, max_tokens: int, thinking: str) -> dict:
    name, key = resolve_key("anthropic")
    payload = {"model": model, "max_tokens": min(max_tokens, 64000), "system": system,
               "messages": [{"role": "user", "content": prompt}]}
    # extended thinking: "high" ≈ a large budget; low/medium scale down. Budget must be < max_tokens.
    if thinking in ("low", "medium", "high"):
        budget = {"low": 2048, "medium": 8192, "high": 16384}[thinking]
        payload["thinking"] = {"type": "enabled", "budget_tokens": min(budget, payload["max_tokens"] - 4096)}
    resp = _post("https://api.anthropic.com/v1/messages",
                 {"x-api-key": key, "anthropic-version": "2023-06-01",
                  "Content-Type": "application/json"}, payload)
    text = "\n".join(b.get("text", "") for b in resp.get("content", []) if b.get("type") == "text")
    u = resp.get("usage") or {}
    finish = "MAX_TOKENS" if resp.get("stop_reason") == "max_tokens" else "STOP"
    return {"text": text, "finish": finish, "key_source": name, "model": resp.get("model", model),
            "provider": "anthropic", "input_tokens": u.get("input_tokens"),
            "output_tokens": u.get("output_tokens"), "thinking_tokens": None,
            "response_id": resp.get("id")}


CALLERS = {"gemini": call_gemini, "openai": call_openai, "anthropic": call_anthropic}


def generate(system: str, prompt: str) -> dict:
    """Primary model, then the fallback. Truncation/empty count as failures worth falling back on."""
    chain = [MODEL] + ([FALLBACK] if FALLBACK and FALLBACK != MODEL else [])
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
        if r["finish"] == "MAX_TOKENS":
            # Cheapest rung first: the SAME model with double the cap, once, before falling back.
            cap = {"gemini": 65536, "openai": 128000, "anthropic": 64000}[provider_for(model)]
            retry_tokens = min(MAX_TOKENS * 2, cap)
            log(f"{model}: truncated at MAX_TOKENS={MAX_TOKENS} — retrying once with {retry_tokens} (provider ceiling {cap})")
            record(r, kind="truncated-discarded", discarded=True,
                   note=f"output thrown away; retried at {retry_tokens}")
            try:
                r = CALLERS[provider_for(model)](model, system, prompt, retry_tokens, THINKING)
            except Exception as e:  # noqa: BLE001
                errors.append(f"{model}: retry failed: {str(e)[:160]}"); continue
            if r["finish"] == "MAX_TOKENS" or not r["text"].strip():
                errors.append(f"{model}: still truncated at {retry_tokens}")
                continue
            r["retried_for_truncation"] = True
        if not r["text"].strip():
            errors.append(f"{model}: empty response (finish={r['finish']})")
            continue
        r["fallback_used"] = i > 0
        r["fallback_reason"] = "; ".join(errors) if i > 0 else None
        # Always log a successful generation: a silent success is invisible in cron logs, and
        # "did this run actually use Gemini?" must be answerable from the log alone.
        log(f"ok model={r['model']} in={r.get('input_tokens')} out={r.get('output_tokens')} "
            f"think={r.get('thinking_tokens')} cost≈${est_cost(r['model'], r.get('input_tokens'), r.get('output_tokens'), r.get('thinking_tokens'))}"
            f"{' FALLBACK' if i > 0 else ''}")
        record(r, kind=os.environ.get("CONTENT_KIND", "generate"))
        return r
    raise RuntimeError("all models failed: " + " | ".join(errors))


# ───────────────────────────── in-process API (for crons / radars) ─────────────────────────────
def complete(system: str, prompt: str, *, model: str = None, max_tokens: int = None,
             thinking: str = None, fallback: str = None, json_mode: bool = False) -> str:
    """One-call text completion for Python pipelines (the Render radar crons).

    Same chain as `write`: primary model then the fallback (logged to stderr), truncation retried
    once at double the cap. Returns the raw text; the caller keeps its own parsing/templating.
    Model/effort default to the CONTENT_* env config so a cron switches models by env alone:

        from lib.content_gen import complete           # after sys.path.insert(0, "scripts")
        text = complete(system_prompt, user_prompt)    # was: _llm(...) -> OpenAI directly
    """
    global MODEL, FALLBACK, MAX_TOKENS, THINKING, JSON_MODE
    saved = (MODEL, FALLBACK, MAX_TOKENS, THINKING, JSON_MODE)
    try:
        JSON_MODE = bool(json_mode)
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
                if FALLBACK and FALLBACK != MODEL:
                    log(f"complete(): still not JSON — trying fallback {FALLBACK}")
                    m0 = MODEL; MODEL = FALLBACK
                    try:
                        r3 = generate(system or "", prompt); t3 = strip_fences(r3["text"])
                    finally:
                        MODEL = m0
                    if _ok(t3): return t3
                log("complete(): returning non-JSON text after all attempts (caller must handle)")
        return text
    finally:
        MODEL, FALLBACK, MAX_TOKENS, THINKING, JSON_MODE = saved


# ───────────────────────────── verify stage ─────────────────────────────
_NUM = re.compile(r"(?<![\w.])\d[\d,]*(?:\.\d+)?%?")
_EXT = re.compile(r"https?://[^\s)\"'<>\]]+")


def strip_fences(t: str) -> str:
    t = t.strip()
    if t.startswith("```"):
        t = re.sub(r"^```[a-zA-Z0-9]*\s*", "", t)
        t = re.sub(r"\s*```$", "", t)
    return t.strip()


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
    page = walk(page, lambda s: house_style(re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", " ", s)))

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


# ───────────────────────────── commands ─────────────────────────────
def est_cost(model: str, it, ot, tt) -> float | None:
    rin = os.environ.get("CONTENT_RATE_IN"); rout = os.environ.get("CONTENT_RATE_OUT")
    rate = (float(rin), float(rout)) if rin and rout else RATES.get(model.lower())
    if not rate or it is None or ot is None:
        return None
    return round((it * rate[0] + (ot + (tt or 0)) * rate[1]) / 1_000_000, 4)


def cmd_preflight(a) -> int:
    chain = [MODEL] + ([FALLBACK] if FALLBACK else [])
    print(f"[content_gen] primary   : {MODEL} ({provider_for(MODEL)})")
    print(f"[content_gen] fallback  : {FALLBACK or 'none'}")
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
    # house style outside fenced code blocks only
    parts = re.split(r"(```.*?```)", text, flags=re.S)
    text = "".join(p if p.startswith("```") else house_style(p) for p in parts)
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
    global CALLER
    if not CALLER:
        # Routines write under reports/<routine>/<date>/drafts/… — the routine name IS the caller.
        parts = pathlib.Path(a.out).resolve().parts
        if "reports" in parts and parts.index("reports") + 1 < len(parts):
            CALLER = parts[parts.index("reports") + 1]
    system = pathlib.Path(a.system).read_text()
    prompt = pathlib.Path(a.prompt).read_text()
    # Send the WRITER only what a writer can use (files on disk untouched; see writer_scope).
    system, scope = writer_scope(system)
    if scope["dropped_sections"] or scope["html_comments_dropped"]:
        log(f"writer scope: dropped ≈{scope['tokens_dropped_est']:,} tokens from the system prompt "
            f"({', '.join(scope['dropped_sections'])[:160]}); ≈{scope['tokens_sent_est']:,} sent")
    t0 = time.time()
    try:
        r = generate(system, prompt)
    except RuntimeError as e:
        die(3, str(e))
    if r["fallback_used"]:
        log(f"FALLBACK USED for {a.slug}: {r['model']} — {r['fallback_reason']}")

    out = pathlib.Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if a.format == "markdown":
        page, report = verify_markdown(r["text"], a)
        out.write_text(page)
    else:
        page, report = verify(r["text"], a)
        out.write_text(json.dumps(page, ensure_ascii=False, indent=2))
    meta = {
        "slug": a.slug, "schema": a.schema, "kind": a.cmd,
        "model": r["model"], "provider": r["provider"], "requested_model": MODEL,
        "fallback_used": r["fallback_used"], "fallback_reason": r["fallback_reason"],
        "retried_for_truncation": r.get("retried_for_truncation", False),
        "thinking": THINKING, "key_source": r["key_source"],
        "finish_reason": r["finish"], "words": report["words"], "floor": a.floor,
        "input_tokens": r["input_tokens"], "output_tokens": r["output_tokens"],
        "thinking_tokens": r["thinking_tokens"],
        "est_cost_usd": est_cost(r["model"], r["input_tokens"], r["output_tokens"], r["thinking_tokens"]),
        "guards": {**report, "writer_scope": scope}, "seconds": round(time.time() - t0, 1),
        "response_id": r["response_id"],
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    out.with_suffix(out.suffix + ".meta.json").write_text(json.dumps(meta, indent=1))
    log(f"wrote {out} ({report['words']} words, {meta['seconds']}s, model={meta['model']}"
        f"{' FALLBACK' if r['fallback_used'] else ''}, cost≈${meta['est_cost_usd']})")
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
    a = ap.parse_args(argv)
    if a.cmd == "section":
        a.format, a.schema = "markdown", "none"
    return {"preflight": cmd_preflight, "write": cmd_write, "section": cmd_write,
            "usage": cmd_usage, "system": cmd_system}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
