#!/usr/bin/env bash
# PreToolUse guard for /tool-usage-mindmap-auto — NO SHORTCUTS (USER RULE 2026-10-11).
# Active only while a tool-usage run is open (/tmp/tool-usage-run.json, written by
# `scripts/tool_usage/tool_usage_gate.py start`). Stamps live in the run dir as <STAGE>.ok.
#
# THE FAILURE IT PREVENTS (chalkbox pilot, 2026-10-11): the run edited five tools from source
# before doing the persona walkthrough, never saved a mindmap chart, skipped phases 0/1/2/5/6/8,
# and still deployed. Prose instructions did not stop it; these blocks do.
#
#   code / page edits (Edit, Write, or Bash writing outside reports/ and /tmp)  -> need PERSONA + CHART
#   scripts/lib/content_gen.py (page prose)                                     -> need PERSONA + CHART
#   deploy-run-to-main.sh push                                                  -> need FINAL
#   send-routine-email.py                                                       -> need LIVE
# Exit 2 + stderr = deny and tell the model why.
input="$(cat)"
python3 - "$input" <<'PY'
import json, os, re, sys
from pathlib import Path
try:
    d = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)
import subprocess
tool = d.get("tool_name") or ""
inp = d.get("tool_input") or {}
cmd = inp.get("command") or ""
target = inp.get("file_path") or inp.get("notebook_path") or ""

def deny(why, fix):
    sys.stderr.write(f"BLOCKED by .claude/tools/tool-usage-gates.sh: {why}\n"
                     f"Do this first: {fix}\nThere is no way around this gate; do the step.\n")
    sys.exit(2)

marker = Path("/tmp/tool-usage-run.json")
try:
    branch = subprocess.run(["git", "symbolic-ref", "--short", "HEAD"], capture_output=True, text=True, timeout=5).stdout.strip()
except Exception:
    branch = ""
on_routine_branch = branch.startswith("claude/tool-usage")

# Stamps and the marker are written ONLY by tool_usage_gate.py — never by hand.
if "tool_usage_gate.py" not in cmd:
    blob = cmd + " " + target
    if re.search(r"tool-usage-pass/[^ ]*\.ok\b|\b(PERSONA|CHART|BUILD|FINAL|LIVE)\.ok\b", blob) and \
            (tool in ("Edit", "Write", "MultiEdit", "NotebookEdit") or re.search(r"touch|>|write|cp |mv |echo", cmd)):
        deny("gate stamps (*.ok) are written only by tool_usage_gate.py.", "run the gate command for that stage.")
    if "tool-usage-run.json" in blob and (tool != "Bash" or re.search(r"\brm\b|>|mv |cp |write|truncate", cmd)):
        deny("the run marker /tmp/tool-usage-run.json is managed only by tool_usage_gate.py.", "leave it alone.")

if not marker.exists():
    if not on_routine_branch:
        sys.exit(0)                               # not a tool-usage run
    # The routine is running but never opened the gate: lock every write and the deploy/email.
    if tool == "Bash" and ("tool_usage_gate.py" in cmd or "site_tool_usage.py" in cmd):
        sys.exit(0)
    risky = (tool in ("Edit", "Write", "MultiEdit", "NotebookEdit") and not str(target).startswith(("/tmp", "reports/"))) or \
        "deploy-run-to-main.sh push" in cmd or ("send-routine-email.py" in cmd and not re.search(r"--status[\s=]+['\"]?(failure|no-op|no-changes)", cmd)) or re.search(r"content_gen\.py\s+(write|section)", cmd)
    if risky:
        deny("this tool-usage run never opened its gate.",
             "`python3 scripts/tool_usage/tool_usage_gate.py start --site <TOOL_SITE> --base-url <BASE_URL>` right after STEP 1.")
    sys.exit(0)
try:
    run = Path(json.loads(marker.read_text())["run_dir"])
except Exception:
    sys.exit(0)
has = lambda s: (run / f"{s}.ok").exists()

ALLOWED = ("reports/", "/tmp/", ".claude/", "/root/", "/home/user/.cache")
def is_code_path(p):
    p = str(p)
    if not p:
        return False
    rel = os.path.relpath(p, os.getcwd()) if os.path.isabs(p) else p
    return not (rel.startswith(ALLOWED) or p.startswith(ALLOWED) or rel.startswith(".."))

need_edit = lambda: deny("code/page edits are locked until the persona walkthroughs AND the full mindmap chart are on file.",
                         "STEP 3 persona files + screenshots -> `python3 scripts/tool_usage/tool_usage_gate.py persona`; "
                         "then mindmap phase-build-brief + Phase 0 -> `python3 scripts/tool_usage/tool_usage_gate.py chart`.")

if tool in ("Edit", "Write", "NotebookEdit", "MultiEdit"):
    if is_code_path(inp.get("file_path") or inp.get("notebook_path") or "") and not (has("PERSONA") and has("CHART")):
        need_edit()
    sys.exit(0)

if tool != "Bash":
    sys.exit(0)

if "deploy-run-to-main.sh push" in cmd and not has("FINAL"):
    deny("deploy is locked until every pre-deploy check passes.",
         "`python3 scripts/tool_usage/tool_usage_gate.py build` then `... final` and fix what it lists.")
if "send-routine-email.py" in cmd and not has("LIVE") and not re.search(r"--status[\s=]+['\"]?(failure|no-op|no-changes)", cmd):
    deny("the owner email is locked until the live check passes.",
         "`python3 scripts/tool_usage/tool_usage_gate.py live` (after deploy), then put its live.md in the email.")
if re.search(r"content_gen\.py\s+(write|section)", cmd) and not (has("PERSONA") and has("CHART")):
    need_edit()
if "tool_usage_gate.py" in cmd:
    sys.exit(0)

# Bash that writes into the site's code (heredoc redirects, sed -i, python open(..,'w'), cp/mv, tee).
# Heredoc BODIES are stripped first: a script's own `x > 0` or `=>` is not a file write.
CODE_DIRS = ("src", "app", "templates", "server", "pages", "public", "static", "content", "data",
             "components", "lib", "layouts", "styles", "api", "routes")
def strip_heredocs(c):
    out, lines, i = [], c.split("\n"), 0
    while i < len(lines):
        out.append(lines[i])
        m = re.search(r"<<-?\s*['\"]?(\w+)['\"]?", lines[i])
        if m:
            end = m.group(1); i += 1
            while i < len(lines) and lines[i].strip() != end:
                i += 1
        i += 1
    return "\n".join(out)
def code_target(w):
    w = w.strip("'\"")
    if not w or w.startswith(("$", "/dev/", "&", "/tmp", "-")):
        return False
    rel = os.path.relpath(w, os.getcwd()) if os.path.isabs(w) else w
    if rel.startswith(".."):
        return False
    return rel.split("/")[0] in CODE_DIRS or rel.endswith((".astro", ".tsx", ".jsx", ".vue", ".svelte"))
if not (has("PERSONA") and has("CHART")):
    body = strip_heredocs(cmd)
    writes = re.findall(r"(?:^|[^<>=\-0-9])>>?\s*([^\s;&|<>]+)", body)
    writes += re.findall(r"tee\s+(?:-a\s+)?([^\s;&|]+)", body)
    writes += re.findall(r"sed\s+-i\S*\s+(?:'[^']*'|\"[^\"]*\"|\S+)\s+([^\s;&|]+)", body)
    writes += re.findall(r"\b(?:cp|mv|install)\s+(?:-\w+\s+)*\S+\s+([^\s;&|]+)", body)
    py_edit = re.search(r"open\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"][wa]", cmd)
    py_targets = re.findall(r"open\(\s*['\"]([^'\"]+)['\"]\s*,\s*['\"][wa]", cmd)
    py_targets += re.findall(r"Path\(\s*['\"]([^'\"]+)['\"]\s*\)\.write_text", cmd)
    py_targets += [m for m in re.findall(r"['\"]((?:%s)/[^'\"]+)['\"]" % "|".join(CODE_DIRS), cmd)
                   if re.search(r"\.write\(|write_text\(", cmd)]
    if any(code_target(w) for w in writes + py_targets):
        need_edit()
sys.exit(0)
PY
