#!/usr/bin/env python3
"""
Send a routine-completion email via Resend.

Sourced by every -auto skill at end-of-run. Reads RESEND_API_KEY,
RESEND_FROM, RESEND_TO from ~/.claude/secrets.env.

Usage:
  send-routine-email.py \
    --status success \
    --skill comparison-content-auto \
    --site layer3labs.io \
    --summary "Published 3 new comparison pages" \
    --details-file /tmp/run-details.md \
    --commit-sha abc123 \
    --commit-url https://github.com/jht243/layer3/commit/abc123

  Or pass details inline: --details "raw markdown text"
  Status values: success | failure | no-op

Exit 0 = email sent, non-zero = email failed (does NOT fail the skill itself).
"""
from __future__ import annotations

import argparse
import html
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path


# Search order for the secrets file. Workspace-local first: cloud routines run
# inside the cloned repo and writing outside it (e.g. ~/.claude) triggers a
# permission prompt that hangs an unattended run. A repo-local .claude/secrets.env
# (gitignored) stays inside the workspace. Home path is the local-Mac fallback.
SECRETS_PATHS = [
    Path.cwd() / ".claude" / "routines.config",   # cloud: neutrally-named (no sensitive-file prompt)
    Path.cwd() / ".claude" / "secrets.env",        # back-compat
    Path.home() / ".claude" / "secrets.env",       # local Mac
]
RESEND_ENDPOINT = "https://api.resend.com/emails"

# Fleet-wide run log. Every routine posts its run record here so the midday
# /api/routine-digest can send ONE grouped email covering the last 24h instead
# of ~15 separate ones landing all morning. Best-effort: a failure here never
# fails the routine, and never suppresses the individual email (see main()).
DEFAULT_INGEST_URL = "https://layer3labs-web.onrender.com/api/routine-run"


SECRET_KEYS = (
    "RESEND_API_KEY",
    "RESEND_FROM",
    "RESEND_TO",
    # Digest wiring (all optional — unset = today's behavior, unchanged).
    "ROUTINE_INGEST_URL",
    "ROUTINE_INGEST_SECRET",
    "ROUTINE_DIGEST_MODE",
    "NURTURE_CRON_SECRET",   # fallback bearer, same as the endpoint's own fallback
)


def load_secrets() -> dict[str, str]:
    """Resolve secrets with env vars taking precedence over the local file.

    Cloud routines (claude.ai environments) inject RESEND_API_KEY etc. as
    environment variables and have no ~/.claude/secrets.env. Local runs on the
    Mac have the file and usually no env vars. We merge both: start from the
    file if present, then let any matching environment variable override.
    """
    out: dict[str, str] = {}

    # 1. File — workspace-local first, then home. Later wins among files. Both
    #    optional; in cloud the env vars (step 2) may be the only source.
    for path in SECRETS_PATHS:
        if not path.exists():
            continue
        for raw in path.read_text().splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            v = v.strip()
            if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                v = v[1:-1]
            out[k.strip()] = v

    # 2. Environment (cloud) — overrides the file for any key that's set.
    for key in SECRET_KEYS:
        env_val = os.environ.get(key)
        if env_val:
            out[key] = env_val

    return out


# Three visual states. GREEN is reserved for runs that actually shipped a commit
# (new/updated content). YELLOW = ran fine but committed nothing (a "no changes"
# run). RED = failed. See main(): a `success` with no commit is downgraded to
# `no-op` so green never implies content shipped when it didn't.
STATUS_THEME = {
    "success": {"label": "Success", "bg": "#10b981", "fg": "#ffffff", "emoji": "✅"},
    "failure": {"label": "Failure", "bg": "#ef4444", "fg": "#ffffff", "emoji": "❌"},
    "no-op":   {"label": "No changes", "bg": "#f59e0b", "fg": "#ffffff", "emoji": "🟡"},
    "no-changes": {"label": "No changes", "bg": "#f59e0b", "fg": "#ffffff", "emoji": "🟡"},
}

# Inbox subject icon per status — 3 states so the icon alone tells you
# green=shipped-a-commit / yellow=ran-clean-but-no-commit / red=failed. Color
# emoji so it renders colored in the mail list (monochrome ✓/✕ render black).
STATUS_ICON = {"success": "✅", "failure": "❌", "no-op": "🟡", "no-changes": "🟡"}

# Repo name (basename of owner/repo, auto-detected from git) → (display project,
# plus-tag slug). The project becomes the email sender name so each site is
# distinguishable in the inbox; the slug tags the From address for filtering.
REPO_PROJECTS = {
    "layer3labs": ("Layer3Labs", "layer3labs"),
    "pipeflare-site": ("PipeFlare", "pipeflare"),
    "prayer-site": ("Find A Prayer", "prayer"),
    "modernwallet": ("ModernWallet", "modernwallet"),
    "humidor-atlas": ("Humidorist", "humidorist"),
    "metabolic_journal": ("The Metabolic Journal", "metabolic"),
    "psych_report": ("Mind Medicine Law", "mindmedicine"),
    "weaponization_fund": ("Lawfare Claims", "lawfare"),
    "banthebots": ("BanTheBots", "banthebots"),
    "cuban_insights": ("Cuban Insights", "cuban"),
    "getzen_nomads": ("getZEN", "getzen"),
    "ven_biz_network": ("Venezuela Network", "venezuela"),
    "vet_tools": ("Vet Tools", "vettools"),
    # Added 2026-08-15 — these five were falling through to the derived-from-host
    # fallback, which gave them an inconsistent display name and would have
    # grouped them under the wrong project heading in the midday digest.
    "longevitybenchmark": ("Longevity Benchmark", "longevity"),
    "thehoaguide": ("The HOA Guide", "hoaguide"),
    "drones_and_defense": ("Drone & Defense", "dronedefense"),
    "the_bot_scout": ("The Bot Scout", "botscout"),
    "private-blue-book": ("Private Blue Book", "privatebluebook"),
}

# Human-readable name of what ran, shown in the body's "What ran" row / header.
# Falls back to the raw --skill value for anything not listed.
SKILL_LABELS = {
    "comparison-content-auto": "Comparison content",
    "indexing-pass-auto": "Indexing pass",
    "autocomplete-pass-auto": "Autocomplete pass",
    "ahrefs-site-audit-auto": "Ahrefs site audit",
    "question-gap-pass-auto": "Follow-up question gaps",
    "competitor-monitor-auto": "Competitor publishing monitor",
    "podcast-pain-pass-auto": "Podcast pain mining",
    "amazon-gear-radar-auto": "Amazon best-seller deep dives",
}

# Short pass label for the SUBJECT line (kept tight so the outcome fits too).
SKILL_SHORT = {
    "ga4-top-pages-pass-auto": "GA4 top-pages",
    "trend-pass-auto": "Trend pass",
    "comparison-content-auto": "Comparison",
    "indexing-pass-auto": "Indexing",
    "autocomplete-pass-auto": "Autocomplete",
    "ahrefs-site-audit-auto": "Ahrefs audit",
    "question-gap-pass-auto": "Question gaps",
    "competitor-monitor-auto": "Competitor watch",
    "download-promise-audit-auto": "Download audit",
    "page-quality-pass-auto": "Page quality",
    "bing-webmaster-pass-auto": "Bing technical",
    "podcast-pain-pass-auto": "Podcast pain",
    "downloadable-asset-pass": "Asset build",
    "roundup-pass": "Roundup",
    "amazon-gear-radar-auto": "Amazon deep dives",
}


def _slugify(text: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]", "", (text or "").lower()) or "site"


def resolve_project(repo: str, site: str, override: str = ""):
    """Return (display_name, plus_tag_slug) for this run.

    Priority: explicit --project override, then the repo→project map (repo is
    auto-detected from git so it's stable across cloud runs), then a title-cased
    fallback from the site/repo so an unmapped project still gets a sane name.
    """
    if override:
        return override.strip(), _slugify(override)
    name = (repo or "").split("/")[-1].strip().lower()
    if name in REPO_PROJECTS:
        return REPO_PROJECTS[name]
    # Fallback: derive from site host (or repo name), strip scheme/www/path.
    base = (site or name or "").strip()
    base = base.split("//")[-1].split("/")[0]
    if base.startswith("www."):
        base = base[4:]
    label = base.split(".")[0] if "." in base else base
    label = label.replace("_", " ").replace("-", " ").strip()
    disp = " ".join(w.capitalize() for w in label.split()) or "Routines"
    return disp, _slugify(label)


def build_from(base_from: str, project_disp: str, slug: str) -> str:
    """Build a per-project From header: `{Project} <local+slug@domain>`.

    The sender display name is just the project (e.g. "PipeFlare"), NOT
    "PipeFlare Routines" — the user wants the bare project name in the inbox.
    The sending domain (verified for SPF/DKIM) is preserved from base_from; only
    the display name and a `+slug` sub-address tag are applied. The tag is ignored
    for delivery but makes each project a distinct sender the inbox can filter on.
    """
    import re
    m = re.search(r"<([^>]+)>", base_from or "")
    addr = (m.group(1) if m else (base_from or "")).strip()
    local, _, domain = addr.partition("@")
    if not domain:
        local, domain = "notifications", "intake.layer3labs.io"
    local = local.split("+")[0]  # drop any existing tag before re-tagging
    return f"{project_disp} <{local}+{slug}@{domain}>"


LINK_STYLE = "color:#2563eb;text-decoration:underline;"


def _normalize_base(site: str) -> str:
    """Return an absolute origin (scheme + host, no trailing slash) for `site`."""
    s = (site or "").strip().rstrip("/")
    if not s:
        return ""
    if not s.startswith(("http://", "https://")):
        s = "https://" + s
    return s


def _resolve_url(text: str, base: str):
    """Turn a link-like token into an absolute, clickable URL, or None.

    - Full http(s) URLs pass through.
    - `www.`-prefixed hosts get https://.
    - Site-relative routes (`/foo/`) resolve against `base` — unless they look
      like a source/asset file path (has a code/asset extension), which stay code.
    """
    import re
    t = (text or "").strip()
    if not t:
        return None
    if t.startswith(("http://", "https://")):
        return t
    if t.startswith("www.") and "." in t:
        return "https://" + t
    if t.startswith("/") and base:
        core = t.split("#", 1)[0].split("?", 1)[0].rstrip("/")
        if re.search(
            r"\.(ts|tsx|js|jsx|mjs|cjs|astro|vue|svelte|py|rb|go|rs|json|md|mdx|"
            r"css|scss|html?|txt|ya?ml|toml|svg|png|jpe?g|gif|webp|ico|xml|csv|lock)$",
            core, re.I,
        ):
            return None
        return base + t
    return None


def markdown_to_html(md: str, base_url: str = "") -> str:
    """Tiny, deliberately-limited markdown renderer.

    Supports: headings (# / ## / ###), bullet lists (- / *), code blocks (``` fenced),
    inline code (`x`), bold (**x**), and links ([text](url)). Anything else is
    rendered as escaped paragraph text. We do NOT use a full markdown library to
    keep this script zero-dependency.
    """
    lines = md.splitlines()
    out: list[str] = []
    in_code = False
    in_list = False
    code_buf: list[str] = []
    para_buf: list[str] = []

    def flush_para():
        nonlocal para_buf
        if para_buf:
            text = " ".join(para_buf).strip()
            if text:
                out.append(f'<p style="margin:0 0 12px;color:#374151;line-height:1.55;">{inline(text)}</p>')
            para_buf = []

    def flush_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False

    def inline(s: str) -> str:
        import re
        # Render inline markdown so every page in a routine email is a real
        # clickable link you can open and verify — never a bare path or mapping.
        # Named links / code spans / bare URLs / bare site routes are each
        # rendered and stashed as placeholders first (visible text = the full
        # absolute URL for anything that resolves to a page), then the remaining
        # prose is escaped and bolded. Order matters: a later pass must never see
        # the innards of an already-linked span.
        stash: list[str] = []

        def _stash(frag: str) -> str:
            stash.append(frag)
            return f"\x00{len(stash) - 1}\x00"

        def _link(url: str, text: str) -> str:
            return _stash(f'<a href="{html.escape(url, quote=True)}" style="{LINK_STYLE}">{html.escape(text)}</a>')

        def _md_link(m):
            return _link(m.group(2).strip(), m.group(1))

        def _code(m):
            inner = m.group(1)
            url = _resolve_url(inner, base_url)
            if url:
                return _link(url, url)
            return _stash(f'<code style="background:#f3f4f6;padding:1px 5px;border-radius:3px;font-size:13px;">{html.escape(inner)}</code>')

        def _route(m):
            url = _resolve_url(m.group(0), base_url)
            return _link(url, url) if url else m.group(0)

        s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", _md_link, s)
        s = re.sub(r"`([^`]+)`", _code, s)
        s = re.sub(r"(?<![\w@])https?://[^\s<>()\[\]`\"']+", lambda m: _link(m.group(0), m.group(0)), s)
        s = re.sub(r"(?<![\w@/])/[A-Za-z0-9][\w\-./]*", _route, s)
        s = html.escape(s)
        s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
        s = re.sub(r"\x00(\d+)\x00", lambda m: stash[int(m.group(1))], s)
        return s

    for raw in lines:
        if raw.strip().startswith("```"):
            if in_code:
                out.append(
                    '<pre style="background:#0f172a;color:#e2e8f0;padding:14px 16px;border-radius:6px;'
                    'overflow-x:auto;font-size:12.5px;line-height:1.5;margin:0 0 12px;">'
                    + html.escape("\n".join(code_buf))
                    + "</pre>"
                )
                code_buf = []
                in_code = False
            else:
                flush_para()
                flush_list()
                in_code = True
            continue
        if in_code:
            code_buf.append(raw)
            continue

        stripped = raw.strip()
        if not stripped:
            flush_para()
            flush_list()
            continue

        if stripped.startswith("### "):
            flush_para()
            flush_list()
            out.append(f'<h3 style="margin:18px 0 8px;font-size:14px;color:#111827;">{inline(stripped[4:])}</h3>')
        elif stripped.startswith("## "):
            flush_para()
            flush_list()
            out.append(f'<h2 style="margin:22px 0 10px;font-size:16px;color:#111827;">{inline(stripped[3:])}</h2>')
        elif stripped.startswith("# "):
            flush_para()
            flush_list()
            out.append(f'<h1 style="margin:24px 0 12px;font-size:18px;color:#111827;">{inline(stripped[2:])}</h1>')
        elif stripped.startswith(("- ", "* ")):
            flush_para()
            if not in_list:
                out.append('<ul style="margin:0 0 12px;padding-left:20px;color:#374151;line-height:1.55;">')
                in_list = True
            out.append(f"<li>{inline(stripped[2:])}</li>")
        else:
            flush_list()
            para_buf.append(stripped)

    flush_para()
    flush_list()
    return "\n".join(out)


# --- Routine-email content policy -------------------------------------------
# Every routine email answers exactly four things and nothing else:
#   1) what ran      -> the colored band + "What ran" row (the --skill)
#   2) when it ran   -> the "When" row
#   3) success/error -> the colored band (green/red/yellow) + Blocker on failure
#   4) what changed  -> the --summary line + this filtered "What changed" block
# The details a skill passes in are filtered HARD to (4): only sections that
# describe a CONCRETE change survive. Analytics/verdict/engagement tables,
# per-page rosters, skipped/deferred/flagged/ledger/audit/IndexNow logs, and any
# markdown table are stripped. Enforced centrally so no single skill can put the
# "word garbage" back into an email — unknown sections fail-closed (dropped), and
# the --summary still answers "what changed" when nothing survives.
_CHANGE_HEADINGS = (
    "shipped", "published", "new content", "new page", "created", "rewrite",
    "enrich", "links added", "next-step link", "internal link", "tool",
    "metadata rewrite", "metadata fix", "fix", "consolidat", "redirect",
    "asset", "treatment", "what changed", "changes made", "updated", "blocker",
    "verif",
)
_NOISE_HEADINGS = (
    "table", "verdict", "engagement", "per-page", "per page", "skipped",
    "deferred", "flagged", "ledger", "audit", "indexnow", "index now",
    "improvement report", "roster", "run info", "source", "overview",
    "pulled pages", "metrics", "diagnos",
)


def _is_change_heading(heading: str) -> bool:
    hl = heading.lower()
    if any(n in hl for n in _NOISE_HEADINGS):
        return False
    return any(k in hl for k in _CHANGE_HEADINGS)


def _strip_tables_and_empties(body_lines: list[str]) -> list[str]:
    out: list[str] = []
    for raw in body_lines:
        s = raw.strip()
        if not s:
            out.append("")
            continue
        if s.startswith("|"):                       # markdown table row
            continue
        if s.startswith("(") and s.endswith(")"):   # legend / caption line
            continue
        if s.lower() in ("none this run", "none", "n/a", "—", "-", "none."):
            continue
        out.append(raw)
    return out


def clean_details(md: str) -> str:
    """Reduce a skill's raw digest to only its concrete 'what changed' content.

    - No headings at all -> keep the prose, minus tables (covers short/free-form
      success or failure notes).
    - Otherwise -> keep only CHANGE sections (see _is_change_heading); drop every
      table, legend line, and empty/"None this run" section. Unknown headings are
      dropped so new skills fail toward a minimal email rather than leaking noise.
    """
    text = (md or "").strip()
    if not text:
        return ""

    lines = text.splitlines()
    if not any(l.lstrip().startswith("#") for l in lines):
        kept = _strip_tables_and_empties(lines)
        return "\n".join(kept).strip()

    sections: list[tuple[str, list[str]]] = []
    cur_head: str | None = None
    cur_body: list[str] = []
    for raw in lines:
        if raw.lstrip().startswith("#"):
            if cur_head is not None:
                sections.append((cur_head, cur_body))
            cur_head = raw.lstrip().lstrip("#").strip()
            cur_body = []
        elif cur_head is not None:
            cur_body.append(raw)
    if cur_head is not None:
        sections.append((cur_head, cur_body))

    out: list[str] = []
    for head, body in sections:
        if not _is_change_heading(head):
            continue
        clean_body = _strip_tables_and_empties(body)
        if any(x.strip() for x in clean_body):
            out.append(f"## {head}")
            out.extend(clean_body)
            out.append("")
    return "\n".join(out).strip()


def post_run_record(
    secrets: dict[str, str],
    args: argparse.Namespace,
    details_md: str,
    details_html: str,
    project_disp: str,
) -> bool:
    """Record this run in the fleet-wide log that feeds the midday digest.

    Posts to /api/routine-run (bearer-authed), which writes the Supabase
    `routine_runs` row. We send the ALREADY-CLEANED markdown and the ALREADY-
    RENDERED html fragment, so the digest shows byte-identical content to the
    individual email — clean_details() / markdown_to_html() / relative-route
    linking all run exactly once, here, where they already live.

    Returns True only on a confirmed 2xx. Every failure mode (no secret,
    network, non-2xx, timeout, anything thrown) returns False and is swallowed:
    this must NEVER fail a routine, and False makes main() fall back to sending
    the individual email so a run can't vanish silently.
    """
    url = (secrets.get("ROUTINE_INGEST_URL") or DEFAULT_INGEST_URL).strip()
    token = (secrets.get("ROUTINE_INGEST_SECRET") or secrets.get("NURTURE_CRON_SECRET") or "").strip()
    if not url or not token:
        return False

    payload = json.dumps({
        "skill": args.skill,
        "skill_label": SKILL_LABELS.get(args.skill, args.skill),
        "project": project_disp,
        "site": args.site,
        "repo": args.repo,
        "branch": args.branch,
        "status": args.status,
        "summary": args.summary,
        "details_md": details_md,
        "details_html": details_html,
        "commit_sha": args.commit_sha,
        "commit_url": args.commit_url,
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "layer3-routines/1.0 (+https://layer3labs.io)",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            ok = 200 <= resp.status < 300
            print(f"[send-routine-email] ingest {resp.status}")
            return ok
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:200] if e.fp else ""
        print(f"[send-routine-email] ingest HTTP {e.code} {body}", file=sys.stderr)
        return False
    except Exception as e:  # network, DNS, timeout, anything — never fatal
        print(f"[send-routine-email] ingest failed: {e}", file=sys.stderr)
        return False


def build_html(args: argparse.Namespace, details_html: str, preheader: str = "", project_disp: str = "") -> str:
    theme = STATUS_THEME.get(args.status, STATUS_THEME["no-op"])
    now = datetime.now().strftime("%Y-%m-%d %H:%M %Z").strip() or datetime.now().strftime("%Y-%m-%d %H:%M")

    commit_block = ""
    if args.commit_sha:
        short = args.commit_sha[:7]
        if args.commit_url:
            commit_block = (
                f'<a href="{html.escape(args.commit_url)}" '
                f'style="color:#2563eb;text-decoration:none;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">'
                f"{html.escape(short)}</a>"
            )
        else:
            commit_block = (
                f'<span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">{html.escape(short)}</span>'
            )

    summary = html.escape(args.summary or "")
    skill = html.escape(args.skill)
    site = html.escape(args.site)

    # Bottom-line-up-front headline: STATUS — WHAT RAN, with the project beneath.
    status_word = {"success": "SUCCESS", "failure": "FAILED", "no-op": "SUCCESS WITHOUT CHANGES", "no-changes": "SUCCESS WITHOUT CHANGES"}.get(args.status, "DONE")
    pass_label = SKILL_LABELS.get(args.skill, args.skill)
    headline = f"{status_word} &mdash; {html.escape(pass_label)}"

    # Labeled metadata rows — always present so the email answers
    # what ran / which repo / which branch / which commit, every time.
    def meta_row(label: str, value_html: str) -> str:
        return (
            '<tr>'
            f'<td style="padding:6px 0;width:120px;font-size:13px;color:#6b7280;vertical-align:top;">{label}</td>'
            f'<td style="padding:6px 0;font-size:13px;color:#111827;vertical-align:top;">{value_html}</td>'
            '</tr>'
        )

    rows = []
    rows.append(meta_row("What ran", f"<strong>{skill}</strong>"))
    rows.append(meta_row("Repository", html.escape(args.repo) if args.repo else f'<span style="color:#9ca3af;">{site}</span>'))
    if args.branch:
        rows.append(meta_row("Branch", f'<code style="background:#f3f4f6;padding:1px 6px;border-radius:3px;">{html.escape(args.branch)}</code>'))
    rows.append(meta_row("Commit", commit_block or '<span style="color:#9ca3af;">none (no changes pushed)</span>'))
    rows.append(meta_row("When", html.escape(now)))
    meta_table = "".join(rows)

    # Hidden preheader — the gray preview text the inbox shows next to the
    # subject. Without this the client scrapes the header band ("✅ …") and the
    # preview just duplicates the subject. The trailing zero-width spacer stops
    # real body text from bleeding into the preview window.
    pre = html.escape(preheader or summary or "")
    preheader_block = (
        '<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;'
        'opacity:0;color:transparent;height:0;width:0;font-size:1px;line-height:1px;">'
        f'{pre}</div>'
        '<div style="display:none;max-height:0;overflow:hidden;">'
        + ("&zwnj;&nbsp;" * 60) + "</div>"
    )
    footer_project = html.escape(project_disp) if project_disp else "Layer3 Routines"

    return f"""<!doctype html>
<html><body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
{preheader_block}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,0.06);overflow:hidden;">

      <!-- BLUF: a colored band — status + what ran (big), project (beneath) -->
      <tr><td style="background:{theme['bg']};padding:22px 28px;">
        <div style="color:{theme['fg']};font-size:24px;font-weight:800;letter-spacing:-0.01em;">{theme['emoji']} &nbsp;{headline}</div>
        <div style="color:{theme['fg']};opacity:0.85;font-size:15px;font-weight:600;margin-top:4px;">{site}</div>
      </td></tr>

      <!-- The reason / result, immediately under the headline -->
      <tr><td style="padding:20px 28px 4px;">
        <p style="margin:0;color:#111827;font-size:16px;line-height:1.55;font-weight:600;">{summary or '<span style="color:#9ca3af;font-weight:400;">(no summary provided)</span>'}</p>
      </td></tr>

      <!-- WHAT CHANGED — the important detail, right up top -->
      <tr><td style="padding:18px 28px 24px;">
        <div style="font-size:14px;">
          {details_html or '<p style="margin:0;color:#9ca3af;font-style:italic;">No further detail reported.</p>'}
        </div>
      </td></tr>

      <!-- Technical metadata — at the BOTTOM, muted -->
      <tr><td style="padding:0 28px 22px;">
        <div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#9ca3af;font-weight:600;margin-bottom:6px;">Run info</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;">
          {meta_table}
        </table>
      </td></tr>

    </table>
    <div style="margin-top:14px;font-size:11px;color:#9ca3af;">{footer_project} Routines · automated SEO maintenance</div>
  </td></tr>
</table>
</body></html>"""


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--status", required=True, choices=["success", "failure", "no-op", "no-changes"])
    p.add_argument("--skill", required=True, help="e.g. comparison-content-auto")
    p.add_argument("--site", required=True, help="e.g. layer3labs.io")
    p.add_argument("--summary", default="", help="One-line RESULT: what was created/changed, or what failed and why")
    p.add_argument("--repo", default="", help="e.g. jht243/layer3labs")
    p.add_argument("--branch", default="", help="git branch the work was committed/pushed to")
    p.add_argument("--details", default="", help="Inline markdown details (use --details-file for large content)")
    p.add_argument("--details-file", default="", help="Path to a markdown file with the run report")
    p.add_argument("--commit-sha", default="")
    p.add_argument("--commit-url", default="")
    p.add_argument("--project", default="", help="Override project display name (else derived from repo)")
    p.add_argument("--headline", default="", help="Tight outcome phrase for the subject (else from summary)")
    p.add_argument("--preheader", default="", help="Inbox preview text (else from summary + commit)")
    p.add_argument("--dry-run", action="store_true", help="Print From/Subject/preheader and skip the send")
    args = p.parse_args()

    # Auto-detect git facts from the current repo when not explicitly passed, so
    # the email ALWAYS shows the real commit + branch (even on "no-op" runs that
    # still committed a report artifact). Best-effort; ignores any git errors.
    def _git(*a):
        try:
            return subprocess.run(["git", *a], capture_output=True, text=True, timeout=10).stdout.strip()
        except Exception:
            return ""
    if not args.repo:
        url = _git("remote", "get-url", "origin")
        import re as _re
        m = _re.search(r"[:/]([^/:]+/[^/]+?)(?:\.git)?$", url)
        if m:
            args.repo = m.group(1)
    if not args.branch:
        args.branch = _git("rev-parse", "--abbrev-ref", "HEAD")
    if not args.commit_sha:
        # Only fill if HEAD actually moved past origin's default branch base —
        # i.e. this run produced a commit. If nothing was committed, leave blank.
        head = _git("rev-parse", "HEAD")
        # Heuristic: show the commit if the current branch is an ephemeral claude/* work branch
        # (routines always commit onto it) or if HEAD differs from origin/main.
        base = _git("rev-parse", "origin/main")
        if head and (args.branch.startswith("claude/") or (base and head != base)):
            args.commit_sha = head
    if args.commit_sha and not args.commit_url and args.repo:
        args.commit_url = f"https://github.com/{args.repo}/commit/{args.commit_sha}"

    # Reserve the GREEN "success" band/icon for runs that actually produced a
    # commit (new or updated content). A run that reports success but committed
    # nothing didn't ship anything — render it YELLOW ("no changes"), never green,
    # so the inbox color never implies content was published when it wasn't.
    if args.status == "success" and not args.commit_sha:
        args.status = "no-op"

    secrets = load_secrets()
    api_key = secrets.get("RESEND_API_KEY", "").strip()
    if not api_key and not args.dry_run:
        print("[send-routine-email] RESEND_API_KEY missing in secrets.env", file=sys.stderr)
        return 2
    base_sender = secrets.get("RESEND_FROM", "Layer3 Routines <notifications@intake.layer3labs.io>")
    recipient = secrets.get("RESEND_TO", "jonathan@pipelinemarketing.io")

    # Per-project sender: "{Project} Routines <notifications+slug@domain>".
    project_disp, project_slug = resolve_project(args.repo, args.site, args.project)
    sender = build_from(base_sender, project_disp, project_slug)

    details_md = args.details
    if args.details_file:
        try:
            details_md = Path(args.details_file).read_text()
        except OSError as e:
            print(f"[send-routine-email] could not read --details-file: {e}", file=sys.stderr)

    # Inbox subject: the icon carries success/fail/changed and the From carries
    # the project, so the subject spends its width on the pass + the outcome.
    # → "{icon} {short pass} · {outcome}"
    icon = STATUS_ICON.get(args.status, "•")
    short_pass = SKILL_SHORT.get(args.skill, SKILL_LABELS.get(args.skill, args.skill))
    outcome = (args.headline or args.summary or "").strip()
    if not outcome:
        outcome = {"success": "done", "failure": "failed",
                   "no-op": "no changes", "no-changes": "no changes"}.get(args.status, "done")
    subject = f"{icon} {short_pass} · {outcome[:64]}"

    # Inbox preview: the specifics that don't fit the subject (+ the commit).
    preheader = (args.preheader or args.summary or "").strip()
    if args.commit_sha:
        tail = f"commit {args.commit_sha[:7]}"
        preheader = f"{preheader} · {tail}" if preheader else tail

    # Enforce the 4-things-only email policy: strip everything from the passed
    # details except concrete "what changed" content (no tables, no analytics).
    details_md = clean_details(details_md)
    details_html = markdown_to_html(details_md, _normalize_base(args.site)) if details_md else ""
    body_html = build_html(args, details_html, preheader, project_disp)

    # Record the run in the fleet-wide log (feeds the midday digest), then decide
    # whether this run ALSO emails on its own.
    #
    #   ROUTINE_DIGEST_MODE = all      -> email every run (DEFAULT — unchanged behavior)
    #                         failures -> email only hard failures; the rest live in the digest
    #                         off      -> never email; the digest is the only report
    #
    # `all` is the default on purpose: this shipped alongside the existing
    # per-routine emails so the digest can be checked for parity against them
    # first. Flipping the whole 17-repo fleet to `failures` later is one env
    # value in the shared cloud environment — no code change, no per-repo pass.
    #
    # The `not ingested` clause is load-bearing: if the ingest endpoint is down
    # or unconfigured, the run emails regardless of mode. A run must never be
    # silently lost between "didn't email" and "isn't in the digest either".
    digest_mode = (secrets.get("ROUTINE_DIGEST_MODE") or "all").strip().lower()
    ingested = False if args.dry_run else post_run_record(
        secrets, args, details_md, details_html, project_disp
    )
    send_individual = (
        digest_mode not in ("failures", "off")
        or (digest_mode == "failures" and args.status == "failure")
        or not ingested
    )

    if args.dry_run:
        print("From:      " + sender)
        print("To:        " + recipient)
        print("Subject:   " + subject)
        print("Preheader: " + preheader)
        print(f"Digest:    mode={digest_mode} (dry-run: no ingest posted)")
        return 0

    if not send_individual:
        print(f"[send-routine-email] recorded for digest; individual email suppressed (mode={digest_mode})")
        return 0

    payload = json.dumps({
        "from": sender,
        "to": [recipient],
        "subject": subject,
        "html": body_html,
    }).encode("utf-8")

    req = urllib.request.Request(
        RESEND_ENDPOINT,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            # Cloudflare in front of api.resend.com blocks the default
            # Python-urllib/x.y User-Agent with a 403 / cf error 1010. A
            # normal UA string passes through.
            "User-Agent": "layer3-routines/1.0 (+https://layer3labs.io)",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            print(f"[send-routine-email] OK {resp.status} {body}")
            return 0
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        print(f"[send-routine-email] HTTP {e.code} {body}", file=sys.stderr)
        return 1
    except urllib.error.URLError as e:
        print(f"[send-routine-email] network error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
