#!/usr/bin/env bash
# Shared startup for local, isolated and cloud routine runs. No working-tree edits.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || (cd "$(dirname "$0")/../.." && pwd))"
CLOUD_ARG=false
for argument in "$@"; do [ "$argument" != "--cloud" ] || CLOUD_ARG=true; done
if [ "$CLOUD_ARG" = true ] || [ -n "${RENDER_GIT_COMMIT:-}" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "1" ] || [ "${CI:-}" = "true" ]; then
  python3 "$ROOT/.claude/tools/worktree-freshness.py" --root "$ROOT" --cloud "$@"
else
  SOURCE_ROOT=$(git -C "$ROOT" worktree list --porcelain | sed -n 's/^worktree //p' | head -1)
  GUARD="$SOURCE_ROOT/.claude/tools/worktree-freshness.py"
  [ -f "$GUARD" ] || { echo "FATAL: source freshness checker missing; do not continue with stale instructions." >&2; exit 1; }
  python3 "$GUARD" --root "$ROOT" "$@"
fi
