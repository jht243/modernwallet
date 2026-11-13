#!/usr/bin/env bash
# Shared startup for local, isolated and cloud routine runs. No working-tree edits.
set -euo pipefail
# Parse the explicit source before locating this target. Separate source Git
# metadata must never redirect the target's own rev-parse/worktree operations.
SOURCE_ROOT="${WORKFLOW_SOURCE_ROOT:-}"
SOURCE_GIT_DIR="${WORKFLOW_SOURCE_GIT_DIR:-}"
EXPECT_SOURCE=false
EXPECT_METADATA=false
for argument in "$@"; do
  if [ "$EXPECT_SOURCE" = true ]; then SOURCE_ROOT="$argument"; EXPECT_SOURCE=false
  elif [ "$EXPECT_METADATA" = true ]; then SOURCE_GIT_DIR="$argument"; EXPECT_METADATA=false
  elif [ "$argument" = "--source" ]; then EXPECT_SOURCE=true
  elif [ "$argument" = "--source-git-dir" ]; then EXPECT_METADATA=true
  elif [[ "$argument" == --source=* ]]; then SOURCE_ROOT="${argument#--source=}"
  elif [[ "$argument" == --source-git-dir=* ]]; then SOURCE_GIT_DIR="${argument#--source-git-dir=}"
  fi
done
if [ -n "$SOURCE_GIT_DIR" ]; then
  export WORKFLOW_SOURCE_ROOT="$SOURCE_ROOT" WORKFLOW_SOURCE_GIT_DIR="$SOURCE_GIT_DIR"
  unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR
fi
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || (cd "$(dirname "$0")/../.." && pwd))"
CLOUD_ARG=false
PIN_ARGS=()
for argument in "$@"; do
  [ "$argument" != "--cloud" ] || CLOUD_ARG=true
  if [ "$argument" = "--run-id" ] || [[ "$argument" == --run-id=* ]]; then
    PIN_ARGS=(--pinned-to-run)
  fi
done
if [ "$CLOUD_ARG" = true ] || [ -n "${RENDER_GIT_COMMIT:-}" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "1" ] || [ "${CI:-}" = "true" ]; then
  python3 "$ROOT/.claude/tools/worktree-freshness.py" --root "$ROOT" --cloud "${PIN_ARGS[@]+"${PIN_ARGS[@]}"}" "$@"
else
  # The checker already accepts an explicit source checkout. Use that same
  # source to locate it when a caller uses separate Git metadata/indexes.
  if [ -z "$SOURCE_ROOT" ]; then
  # Drain the complete inventory. Under pipefail, `sed | head -1` can exit
  # with SIGPIPE (141) as the number of worktrees grows, randomly blocking startup.
  SOURCE_ROOT=$(git -C "$ROOT" worktree list --porcelain | python3 -c 'import sys; lines=sys.stdin.read().splitlines(); print(next(line[len("worktree "):] for line in lines if line.startswith("worktree ")))')
  fi
  GUARD="$SOURCE_ROOT/.claude/tools/worktree-freshness.py"
  if [ "$SOURCE_ROOT" != "$ROOT" ] && [ -f "$ROOT/.claude/tools/worktree-freshness.py" ] && {
    { grep -q -- '--auto-worktree' "$ROOT/.claude/tools/worktree-freshness.py" 2>/dev/null && ! grep -q -- '--auto-worktree' "$GUARD" 2>/dev/null; } ||
    { grep -q -- '--pinned-to-run' "$ROOT/.claude/tools/worktree-freshness.py" 2>/dev/null && ! grep -q -- '--pinned-to-run' "$GUARD" 2>/dev/null; }
  }; then
    GUARD="$ROOT/.claude/tools/worktree-freshness.py"
  fi
  [ -f "$GUARD" ] || { echo "FATAL: source freshness checker missing; do not continue with stale instructions." >&2; exit 1; }
  python3 "$GUARD" --root "$ROOT" "${PIN_ARGS[@]+"${PIN_ARGS[@]}"}" "$@"
fi
# Sales completion Stop hook: a cloud session rooted above the repo does not load repo-level hooks, so install it into the
# session root's settings (idempotent, keeps other hooks; the hook itself is a no-op unless a sales run marked this session).
if [ "$CLOUD_ARG" = true ] || [ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "1" ]; then
  python3 "$ROOT/.claude/tools/sales-completion-stop.py" install-runtime >/dev/null 2>&1 || true
fi
