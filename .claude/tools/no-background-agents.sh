#!/usr/bin/env bash
# PreToolUse guard for UNATTENDED routine runs (cloud routines fire this repo's skills with
# nobody watching). Wired in .claude/settings.json; synced fleet-wide from layer3.
#
# THE FAILURE IT PREVENTS (shavingschool autocomplete run, 2026-09-04): the orchestrator
# dispatched the Phase 4 audit through the Agent tool, which now BACKGROUNDS a subagent by
# default. It then polled with ListAgents, armed a `sleep 240` in the background, and ended
# its turn "waiting for the agent". Nothing ever wakes an unattended run, so the audit's
# result had nobody to return to: no verdict, no commit, no push, no email. The routine
# prompt already says "run every subagent INLINE and BLOCKING"; prose cannot beat a tool
# default, so this hook makes the default unreachable.
#
#   Agent  -> denied unless the call passes run_in_background: false explicitly.
#   Bash   -> denied when a `sleep`-led command is backgrounded (the polling idiom that
#             only exists to wait for a backgrounded agent).
#
# 2026-10-11 (layer3 podcast run cse_01TknZH3okXA5t7XFTT9odqL): a FOREGROUND Bash running the
# page writer (content_gen.py) passed the default 120 s timeout, the harness moved it to the
# background, the run armed a Monitor and ended its turn — never resumed, nothing shipped.
# In CLOUD runs only (CLAUDE_CODE_REMOTE / /home/user checkout) this guard now also:
#   Bash    -> denied when it backgrounds anything at all;
#   Bash    -> denied when a long job (writer, build, typecheck, deploy push, long sleep)
#              has no explicit timeout >= 600000 ms;
#   Monitor -> denied (it only exists to wait, and waiting ends an unattended run).
#
# Exit 2 + a stderr message is the portable "deny and tell the model why" contract for a
# PreToolUse hook; the model sees the reason and re-issues the call correctly.
input="$(cat)"
python3 - "$input" <<'PY'
import json, os, re, sys
try:
    d = json.loads(sys.argv[1])
except Exception:
    sys.exit(0)                       # unparseable -> never block on a guard bug
tool = d.get("tool_name") or ""
inp = d.get("tool_input") or {}
bg = inp.get("run_in_background")

if tool in ("Agent", "Task") and bg is not False:
    sys.stderr.write(
        "BLOCKED by .claude/tools/no-background-agents.sh: this run is unattended, and a "
        "backgrounded subagent is never waited for, so its work is lost and the phase never "
        "finishes. Re-issue this exact Agent call with run_in_background: false and wait for "
        "its result before continuing. Never poll for it, never end your turn to wait for it.\n")
    sys.exit(2)

cmd = (inp.get("command") or "").lstrip()
cloud = os.environ.get("CLAUDE_CODE_REMOTE", "").lower() in ("1", "true") \
    or (os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()).startswith("/home/user")
if cloud and tool == "Monitor":
    sys.stderr.write(
        "BLOCKED by .claude/tools/no-background-agents.sh: this run is unattended. A Monitor only "
        "waits for an event, and ending your turn to wait never resumes a cloud run. Run the "
        "command in the FOREGROUND instead, with timeout: 600000 (and an until-loop if you must "
        "wait for a file/condition), and continue in the same turn.\n")
    sys.exit(2)
if cloud and tool == "Bash" and bg is True:
    sys.stderr.write(
        "BLOCKED by .claude/tools/no-background-agents.sh: this run is unattended, so nothing ever "
        "returns to a backgrounded command. Re-issue it in the FOREGROUND with timeout: 600000 "
        "(split very long work into several foreground calls).\n")
    sys.exit(2)
LONG = re.compile(r"content_gen\.py|/gen(_all)?\.sh|\bgen\.sh\b|humanize_intro\.py|npm run build|next build|"
                  r"astro build|npx tsc|deploy-run-to-main\.sh push|\bsleep\s+(1[2-9]\d|[2-9]\d\d|\d{4,})")
if cloud and tool == "Bash" and LONG.search(cmd) and (inp.get("timeout") or 0) < 600000:
    sys.stderr.write(
        "BLOCKED by .claude/tools/no-background-agents.sh: this command can run past the default "
        "2-minute limit, and in an unattended run a command that overruns is moved to the "
        "background and its result is lost. Re-issue the SAME command with timeout: 600000.\n")
    sys.exit(2)
if tool == "Bash" and bg is True and cmd.startswith("sleep"):
    sys.stderr.write(
        "BLOCKED by .claude/tools/no-background-agents.sh: a backgrounded sleep is the "
        "'wait for a background agent' idiom, and this run is unattended, so ending your turn "
        "to wait never resumes. Run subagents with run_in_background: false and continue "
        "inline; if you truly need to pause, run the sleep in the foreground.\n")
    sys.exit(2)
sys.exit(0)
PY
