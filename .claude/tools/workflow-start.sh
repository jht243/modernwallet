#!/usr/bin/env bash
# Shared startup for local, isolated and cloud routine runs. No working-tree edits.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
if [ "${1:-}" = "--cloud" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "1" ] || [ "${CI:-}" = "true" ]; then
  python3 "$ROOT/.claude/tools/worktree-freshness.py" --root "$ROOT" --cloud
else
  SOURCE_ROOT=$(git -C "$ROOT" worktree list --porcelain | sed -n 's/^worktree //p' | head -1)
  GUARD="$SOURCE_ROOT/.claude/tools/worktree-freshness.py"
  [ -f "$GUARD" ] || { echo "FATAL: source freshness checker missing; do not continue with stale instructions." >&2; exit 1; }
  python3 "$GUARD" --root "$ROOT"
fi
