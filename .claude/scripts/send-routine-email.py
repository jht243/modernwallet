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


SECRET_KEYS = ("RESEND_API_KEY", "RESEND_FROM", "RESEND_TO")


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


STATUS_THEME = {
    "success": {"label": "Success", "bg": "#10b981", "fg": "#ffffff", "emoji": "✓"},
    "failure": {"label": "Failure", "bg": "#ef4444", "fg": "#ffffff", "emoji": "✕"},
    "no-op":   {"label": "Success Without Changes", "bg": "#10b981", "fg": "#ffffff", "emoji": "✓"},
    "no-changes": {"label": "Success Without Changes", "bg": "#10b981", "fg": "#ffffff", "emoji": "✓"},
}

# Human-readable name of what ran, shown in the header band. Falls back to the
# raw --skill value for anything not listed.
SKILL_LABELS = {
    "comparison-content-auto": "Comparison content",
    "indexing-pass-auto": "Indexing pass",
    "autocomplete-pass-auto": "Autocomplete pass",
    "ahrefs-site-audit-auto": "Ahrefs site audit",
}


def markdown_to_html(md: str) -> str:
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
        s = html.escape(s)
        import re
        s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" style="color:#2563eb;text-decoration:none;">\1</a>', s)
        s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
        s = re.sub(r"`([^`]+)`", r'<code style="background:#f3f4f6;padding:1px 5px;border-radius:3px;font-size:13px;">\1</code>', s)
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


def build_html(args: argparse.Namespace, details_html: str) -> str:
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

    return f"""<!doctype html>
<html><body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
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
    <div style="margin-top:14px;font-size:11px;color:#9ca3af;">Layer3 Routines · automated SEO maintenance</div>
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

    secrets = load_secrets()
    api_key = secrets.get("RESEND_API_KEY", "").strip()
    if not api_key:
        print("[send-routine-email] RESEND_API_KEY missing in secrets.env", file=sys.stderr)
        return 2
    sender = secrets.get("RESEND_FROM", "Layer3 Routines <notifications@intake.layer3labs.io>")
    recipient = secrets.get("RESEND_TO", "jonathan@pipelinemarketing.io")

    details_md = args.details
    if args.details_file:
        try:
            details_md = Path(args.details_file).read_text()
        except OSError as e:
            print(f"[send-routine-email] could not read --details-file: {e}", file=sys.stderr)

    details_html = markdown_to_html(details_md) if details_md else ""
    body_html = build_html(args, details_html)

    # Inbox subject mirrors the header BLUF: status · what ran · project — result
    subject_emoji = STATUS_THEME[args.status]["emoji"]
    status_word = {"success": "SUCCESS", "failure": "FAILED", "no-op": "SUCCESS WITHOUT CHANGES", "no-changes": "SUCCESS WITHOUT CHANGES"}.get(args.status, "DONE")
    pass_label = SKILL_LABELS.get(args.skill, args.skill)
    subject = f"{subject_emoji} {status_word} · {pass_label} · {args.site}"
    if args.summary:
        subject += f" — {args.summary[:70]}"

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
