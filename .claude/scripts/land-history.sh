#!/usr/bin/env bash
# The native release verifier still runs unchanged after this history check.
set -euo pipefail
base=${1:?trusted main ref required}
branch=${2:?routine ref required}
# Optional third argument: the trusted remote routine ref (origin/claude/land/...) for push retries, where $2 is the local HEAD.
# It is only ever FETCHED; it is never substituted for $2, so every merge/conflict/receipt check still runs on the real local HEAD.
routine_ref=${3:-}
git rev-parse --verify "$base^{commit}" >/dev/null
git rev-parse --verify "$branch^{commit}" >/dev/null
if [ "$(git rev-parse --is-shallow-repository)" != true ]; then exit 0; fi
# Fast-forward scope is exact with a proven current-main ancestor. Diverged or
# older branches keep the original complete-history merge/conflict protections.
if git merge-base --is-ancestor "$base" "$branch"; then
  changed=$(git diff --name-only "$base" "$branch")
  if ! grep -Eq '/fulfillment-record\.json$' <<< "$changed"; then exit 0; fi
fi
# Saved fulfillment receipts inspect historical publication commits; preserve
# that verifier's complete ancestry rather than weakening it for a shallow clone.
# Complete history of ONLY the trusted main and this routine branch (explicit refspecs). A bare `git fetch --unshallow origin`
# downloads every remote branch (894 unrelated branches, ~173s on 2026-11-09); the verifier needs just these two ancestries.
case "$base:$branch" in
  origin/*:origin/*)
    main_name=${base#origin/}
    routine_name=${branch#origin/}
    git fetch --no-tags --unshallow origin \
      "+refs/heads/$main_name:refs/remotes/origin/$main_name" \
      "+refs/heads/$routine_name:refs/remotes/origin/$routine_name"
    ;;
  origin/*:HEAD)
    # Push retry: local HEAD is the merge result. Its ancestry is exactly trusted main plus the routine branch, so fetch only those two
    # complete refs, and only when the caller supplied the exact validated routine ref. Anything else keeps the complete-history fallback.
    routine_name=${routine_ref#origin/}
    main_name=${base#origin/}
    if [ -n "$routine_ref" ] && [ "$routine_ref" != "$routine_name" ] && [[ "$routine_name" == claude/land/* ]] \
       && git check-ref-format --branch "$routine_name" >/dev/null 2>&1 \
       && git check-ref-format --branch "$main_name" >/dev/null 2>&1 \
       && git rev-parse --verify "$routine_ref^{commit}" >/dev/null 2>&1; then
      git fetch --no-tags --unshallow origin \
        "+refs/heads/$main_name:refs/remotes/origin/$main_name" \
        "+refs/heads/$routine_name:refs/remotes/origin/$routine_name"
    else
      git fetch --no-tags --unshallow origin
    fi
    ;;
  *)
    # Unrecognised ref shapes keep the original complete-history behaviour.
    git fetch --no-tags --unshallow origin
    ;;
esac
git merge-base "$base" "$branch" >/dev/null
