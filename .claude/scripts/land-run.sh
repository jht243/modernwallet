#!/usr/bin/env bash
# land-run.sh — ship this run's commits through the repo's landing workflow.
#
#   .claude/scripts/land-run.sh mark                 # at run start, before any commit
#   .claude/scripts/land-run.sh land                 # at deploy: rebase this run's commits onto latest
#                                                    # origin/main, push them to a claude/land/* branch,
#                                                    # and wait until .github/workflows/land.yml has
#                                                    # merged them into main (exit 0 = on main)
#   .claude/scripts/land-run.sh verify URL[=needle]  # poll until live
#
# Everything is deploy-run-to-main.sh underneath (same RUN_BASE pinning, same precheck, same
# regenerable-file handling); `push` is mapped to `land` so a routine using this wrapper always
# goes through the workflow. Exit codes: 0 landed, 3 conflict, 4 precheck failed, 5 not merged in time.
cmd="${1:-}"; shift || true
[ "$cmd" = "push" ] && cmd="land"
exec "$(dirname "$0")/deploy-run-to-main.sh" "$cmd" "$@"
