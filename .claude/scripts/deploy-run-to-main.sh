#!/usr/bin/env bash
#
# deploy-run-to-main.sh — land ONLY the current run's commits onto latest origin/main.
#
# WHY THIS EXISTS
# ---------------
# The old deploy path was:
#     git fetch origin main && git rebase origin/main && git push origin HEAD:main
# `git rebase origin/main` replays EVERY commit on the current branch that is not yet on
# main. That is fine when the routine runs on a branch forked cleanly from main. But when
# a routine runs on a branch that already carries ANOTHER routine's commits (a shared or
# stale worktree branch — e.g. `worktree-agent-*`), the rebase drags those foreign commits
# along and collides with the unrelated work they touch on a concurrently-moving main.
# Result: 30+ spurious conflicts, the deploy aborts, and the run's content is stranded on
# an ephemeral branch needing a manual merge.
#   (See the 2026-07-20 comparison-content-auto failure: the branch also held that night's
#    podcast-pain-pass commits, forked ~30 commits behind current main.)
#
# THE FIX
# -------
# Pin the branch tip at run START (`mark`), then at deploy replay ONLY the commits this run
# added (RUN_BASE..HEAD) onto the LATEST origin/main via `git rebase --onto`. Any inherited
# / foreign commits below RUN_BASE are never touched — they are another routine's problem to
# ship from its own run. On a genuine content conflict we ABORT (never force-push main); the
# caller then falls back to pushing the ephemeral branch + emailing a manual-merge note.
#
# USAGE
# -----
#   .claude/scripts/deploy-run-to-main.sh mark   # call ONCE at run start, before any commit
#   .claude/scripts/deploy-run-to-main.sh push   # call at deploy time; lands this run's work
#
# EXIT CODES (push)
#   0  pushed to main
#   3  could not land cleanly (conflict or repeatedly-moving base) -> caller does the safe
#      ephemeral-branch fallback + manual-merge email. NEVER force-push main.
#
set -uo pipefail

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)"
# Per-branch state file so concurrent routines on different branches never collide.
key="$(printf '%s' "$branch" | tr '/ :' '___')"
base_file="$(git rev-parse --git-dir)/run-base-${key}"

cmd="${1:-}"

case "$cmd" in
  mark)
    # Record the tip we inherited. Everything committed after this is THIS run's work.
    git rev-parse HEAD > "$base_file"
    echo "[deploy] pinned RUN_BASE for '$branch' = $(cat "$base_file")"
    ;;

  push)
    if [ -f "$base_file" ]; then
      run_base="$(cat "$base_file")"
    else
      # Fallback when the caller never marked: use the merge-base with main. This is exactly
      # correct for a cleanly-forked branch. It is NOT sufficient to strip foreign commits on
      # a shared branch (that is what `mark` is for) — so warn loudly.
      git fetch origin main >/dev/null 2>&1 || true
      run_base="$(git merge-base HEAD origin/main 2>/dev/null || true)"
      echo "[deploy] WARN: no RUN_BASE mark found; falling back to merge-base ${run_base:-<none>}." >&2
      echo "[deploy] WARN: call 'deploy-run-to-main.sh mark' at run start to guarantee only this run ships." >&2
    fi

    if [ -z "${run_base:-}" ]; then
      echo "[deploy] ERROR: could not determine a base commit." >&2
      exit 3
    fi

    git fetch origin main || echo "[deploy] WARN: initial fetch failed, using local origin/main ref" >&2

    # Isolate this run's commits onto the latest main. A conflict here is a genuine
    # overlap with concurrent work -> abort and let the caller do the safe fallback.
    if ! git rebase --onto origin/main "$run_base" HEAD; then
      git rebase --abort 2>/dev/null || true
      echo "[deploy] CONFLICT: this run's commits overlap concurrent work on main." >&2
      exit 3
    fi
    # HEAD is now: latest-origin/main + only-this-run's-commits.

    # Push, retrying if the base moves again under us. After the initial --onto, every
    # commit below our run's commits is already on the remote, so a plain rebase now
    # replays ONLY our commits — it can never re-introduce foreign work.
    for attempt in 1 2 3; do
      if git push origin HEAD:main; then
        echo "[deploy] pushed $(git rev-parse --short HEAD) to main (attempt ${attempt})."
        rm -f "$base_file"
        exit 0
      fi
      echo "[deploy] push rejected (base moved); rebasing + retrying (${attempt}/3)." >&2
      git fetch origin main || true
      if ! git rebase origin/main; then
        git rebase --abort 2>/dev/null || true
        echo "[deploy] CONFLICT on retry rebase; aborting." >&2
        exit 3
      fi
    done

    echo "[deploy] FAILED: base kept moving; could not land on main after 3 attempts." >&2
    exit 3
    ;;

  *)
    echo "usage: deploy-run-to-main.sh {mark|push}" >&2
    exit 2
    ;;
esac
