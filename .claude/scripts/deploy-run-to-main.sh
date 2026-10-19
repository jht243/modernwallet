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
#   .claude/scripts/deploy-run-to-main.sh land   # same as push, but ships this run's commits to a
#                                                # claude/land/* branch and waits for the repo's
#                                                # "Land routine branch" workflow (.github/workflows/land.yml)
#                                                # to merge it into main (the publisher routines use this).
#
# GENERATED-FILE CONFLICTS
#   A conflict confined to the files listed in .claude/scripts/deploy-regenerable.txt (e.g.
#   public/search-index.json) is not a real overlap: the file is rebuilt from the merged
#   tree and the rebase continues. See the GENERATED FILES block below.
#
# EXIT CODES (push)
#   0  pushed to main
#   3  could not land cleanly (a conflict outside deploy-regenerable.txt, or a repeatedly-moving base) -> caller does the safe
#      ephemeral-branch fallback + manual-merge email. NEVER force-push main.
#   4  .claude/scripts/deploy-precheck.sh rejected the merged tree -> nothing pushed; fix the
#      reported file (or drop the bad row), commit, and run push again.
#   5  (land only) the claude/land/* branch is pushed but the workflow has not merged it within
#      LAND_DEADLINE seconds (default 600) -> check the repo's Actions tab; nothing is lost.
#
# EXIT CODES (verify)
#   0  every URL is live (200, needle present)
#   1  deadline passed and the host's latest build is NOT failed (slow build / propagation)
#   6  the host's latest build FAILED on a build gate or compile error. The gate's own output is
#      printed (file, line, cell). Fix THAT in this run, commit, land, verify again. Needs
#      RENDER_API_KEY and .claude/scripts/render-deploy-status.sh; without them verify can only
#      see a 404 and falls back to exit 1 (2026-10-19: 6 failed builds in a row were reported
#      as "host stalled" because nothing read the build log).
#   7  the host's latest build failed on infrastructure (clone/auth/registry); verify already
#      asked Render for a fresh build once and it failed again -> report it, nothing to fix in code.
#
set -uo pipefail

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)"
# Per-branch state file so concurrent routines on different branches never collide.
key="$(printf '%s' "$branch" | tr '/ :' '___')"
base_file="$(git rev-parse --git-dir)/run-base-${key}"

cmd="${1:-}"
# `land` is `push` with a different destination: a claude/land/* branch that GitHub merges.
target="main"
if [ "$cmd" = "land" ]; then cmd="push"; target="land"; fi

# GENERATED FILES — rebuilt from other tracked files, never hand-edited. Every content
# routine regenerates them, so two concurrent runs ALWAYS conflict on them even when
# their real changes don't overlap (2026-10-10 layer3labs x-trends: the only conflict was
# public/search-index.json, after another run had removed 34 pages on main). For these
# the correct merge is "regenerate from the merged tree", so a conflict confined to them
# is resolved automatically; a conflict on ANY other path still aborts (exit 3).
#
# Which files are generated differs per repo, so the list lives in THIS repo's
# .claude/scripts/deploy-regenerable.txt (this script is identical across the fleet). One rule per
# line, `glob|command`, in the order the commands must run (sitemaps before the search
# index that reads them). '#' starts a comment. No file -> no auto-resolve (old behavior).
#   public/search-index.json|node scripts/build_search_index.mjs
REGEN_FILE="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.claude/scripts/deploy-regenerable.txt"
REGEN_GLOBS=(); REGEN_CMDS=()
if [ -f "$REGEN_FILE" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%%#*}"; line="$(printf '%s' "$line" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g')"
    case "$line" in *"|"*) REGEN_GLOBS+=("${line%%|*}"); REGEN_CMDS+=("${line#*|}") ;; esac
  done < "$REGEN_FILE"
fi

is_regenerable() {
  local i
  for i in "${!REGEN_GLOBS[@]}"; do
    # shellcheck disable=SC2053
    [[ "$1" == ${REGEN_GLOBS[$i]} ]] && return 0
  done
  return 1
}

# Resolve a stopped rebase when every conflicted path is regenerable: take main's copy of
# each (so a generator that reads its own output never sees conflict markers), run every
# rule's command in file order on the merged tree, stage all generated outputs, continue.
# Loops because the rebase can stop again on a later commit. Non-zero = caller aborts.
resolve_generated() {
  local conflicted f i ran n=0
  [ ${#REGEN_GLOBS[@]} -gt 0 ] || return 1
  while [ -d "$(git rev-parse --git-path rebase-merge)" ] || [ -d "$(git rev-parse --git-path rebase-apply)" ]; do
    n=$((n + 1)); [ "$n" -le 50 ] || { echo "[deploy] rebase still stopped after 50 resolve rounds" >&2; return 1; }
    conflicted="$(git diff --name-only --diff-filter=U)"
    if [ -z "$conflicted" ]; then
      # Stopped with nothing unmerged (e.g. a regenerated commit came out empty).
      GIT_EDITOR=true git rebase --continue >/dev/null 2>&1 || GIT_EDITOR=true git rebase --skip || return 1
      continue
    fi
    for f in $conflicted; do
      is_regenerable "$f" || { echo "[deploy] non-generated conflict: $f" >&2; return 1; }
    done
    for f in $conflicted; do
      # In a rebase, --ours is the upstream side (latest main + already-replayed commits).
      git checkout --ours -- "$f" 2>/dev/null || git checkout --theirs -- "$f" 2>/dev/null || true
      echo "[deploy] regenerating conflicted generated file: $f" >&2
    done
    ran=" "
    for i in "${!REGEN_CMDS[@]}"; do
      case "$ran" in *" $i "*) continue ;; esac
      # Same command listed for several globs runs once.
      for j in "${!REGEN_CMDS[@]}"; do [ "${REGEN_CMDS[$j]}" = "${REGEN_CMDS[$i]}" ] && ran="$ran$j "; done
      bash -c "${REGEN_CMDS[$i]}" >&2 || { echo "[deploy] regen failed: ${REGEN_CMDS[$i]}" >&2; return 1; }
    done
    # Stage every generated output (incl. new files, e.g. a new sitemap-*.xml) so a
    # leftover unstaged diff never blocks `rebase --continue`.
    for i in "${!REGEN_GLOBS[@]}"; do
      git add -A -- ":(glob)${REGEN_GLOBS[$i]}" 2>/dev/null || true
    done
    # Drop any other tracked file a generator touched as a side effect (e.g. robots.txt):
    # mid-rebase the worktree holds no user edits (autoStash parked them), only regen output.
    git checkout -- . 2>/dev/null || true
    GIT_EDITOR=true git rebase --continue || true
  done
  return 0
}

# Run `git rebase <args>`; on conflict try resolve_generated, else abort. 0 = landed.
rebase_or_regen() {
  if git -c rebase.autoStash=true rebase "$@"; then return 0; fi
  if resolve_generated; then return 0; fi
  git rebase --abort 2>/dev/null || true
  return 1
}

# PRE-PUSH PRECHECK — a repo-specific gate run on the merged tree right before every push.
# If .claude/scripts/deploy-precheck.sh exists it gets the files this run changed vs
# origin/main as args; non-zero = nothing is pushed (exit 4). Catches a data-file break
# BEFORE it reaches main, where it would fail every build for every routine (2026-10-12
# layer3labs: a merged-entry duplicate-key break blocked all deploys 05:05-12:08 UTC).
PRECHECK="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.claude/scripts/deploy-precheck.sh"
run_precheck() {
  [ -f "$PRECHECK" ] || return 0
  local changed
  changed="$(git diff --name-only --diff-filter=ACMR origin/main HEAD)"
  [ -n "$changed" ] || return 0
  # shellcheck disable=SC2086
  bash "$PRECHECK" $changed
}

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
    # rebase.autoStash: a routine's working tree is often still dirty at deploy time
    # (generated ledgers, rebuilt dist/, lockfiles the run never staged). Without this,
    # git refuses with "cannot rebase: You have unstaged changes" and the whole run is
    # thrown away as a phantom "conflict". Autostash parks those files, replays our
    # commits, then restores them.
    # Rebase the BRANCH, not a literal HEAD: `rebase --onto X base HEAD` leaves the repo on
    # a DETACHED HEAD, so the local branch never moves and the next run's per-branch state
    # key collapses to "HEAD" (ported from the_bot_scout).
    if [ "$branch" != "HEAD" ]; then rebase_target="$branch"; else rebase_target="HEAD"; fi
    # Conflicts confined to .claude/scripts/deploy-regenerable.txt files are rebuilt automatically.
    if ! rebase_or_regen --onto origin/main "$run_base" "$rebase_target"; then
      echo "[deploy] CONFLICT: could not replay this run's commits onto latest main (see git error above)." >&2
      exit 3
    fi
    # HEAD is now: latest-origin/main + only-this-run's-commits.

    # Push, retrying if the base moves again under us. After the initial --onto, every
    # commit below our run's commits is already on the remote, so a plain rebase now
    # replays ONLY our commits — it can never re-introduce foreign work.
    for attempt in 1 2 3; do
      if ! run_precheck; then
        echo "[deploy] PRECHECK FAILED: this run's changes would break the build; NOT pushed (see errors above)." >&2
        exit 4
      fi
      if [ "$target" = "land" ]; then
        land_branch="claude/land/${key}-$(date +%s)"
        if ! git push origin "HEAD:refs/heads/${land_branch}"; then
          echo "[deploy] FAILED: could not push ${land_branch}." >&2
          exit 3
        fi
        head_sha="$(git rev-parse HEAD)"
        echo "[deploy] pushed $(git rev-parse --short "$head_sha") to ${land_branch}; waiting for the land workflow to merge it into main."
        rm -f "$base_file"
        land_deadline=$(( $(date +%s) + ${LAND_DEADLINE:-600} ))
        while :; do
          git fetch -q origin main 2>/dev/null || true
          if git merge-base --is-ancestor "$head_sha" origin/main 2>/dev/null; then
            echo "[deploy] landed: origin/main ($(git rev-parse --short origin/main)) now contains $(git rev-parse --short "$head_sha")."
            exit 0
          fi
          if [ "$(date +%s)" -ge "$land_deadline" ]; then
            echo "[deploy] NOT LANDED after ${LAND_DEADLINE:-600}s: ${land_branch} is on the remote but the land workflow has not merged it (see the repo's Actions tab). Nothing is lost." >&2
            exit 5
          fi
          sleep 15
        done
      fi
      if git push origin HEAD:main; then
        echo "[deploy] pushed $(git rev-parse --short HEAD) to main (attempt ${attempt})."
        rm -f "$base_file"
        # Never leave the checkout detached: the next run must start on a real branch.
        if [ "$(git rev-parse --abbrev-ref HEAD)" = "HEAD" ]; then
          git checkout -B main >/dev/null 2>&1 \
            && echo "[deploy] reattached to main at $(git rev-parse --short HEAD)." \
            || echo "[deploy] WARN: still detached; run 'git checkout -B main' by hand." >&2
        fi
        exit 0
      fi
      echo "[deploy] push rejected (base moved); rebasing + retrying (${attempt}/3)." >&2
      git fetch origin main || true
      if ! rebase_or_regen origin/main; then
        echo "[deploy] CONFLICT on retry rebase; aborting." >&2
        exit 3
      fi
    done

    echo "[deploy] FAILED: base kept moving; could not land on main after 3 attempts." >&2
    exit 3
    ;;

  verify)
    # verify URL[=needle]...  — poll (up to VERIFY_DEADLINE s, default 420) until every URL
    # is 200 AND, when a needle is given, its body contains that text. The needle is what
    # makes this meaningful for an ENRICHED page: an existing page is 200 long before the
    # new deploy lands, so "200" alone proves nothing there — pass URL=NewVendorName.
    shift
    [ $# -eq 0 ] && { echo "usage: deploy-run-to-main.sh verify URL[=needle]..." >&2; exit 2; }
    start=$(date +%s)
    deadline=$(( start + ${VERIFY_DEADLINE:-420} ))
    nudge_at=$(( start + ${VERIFY_DEADLINE:-420} / 2 ))
    nudged=""
    pending=("$@")
    # HOST CHECK — with RENDER_API_KEY, ask the host what it did with main every ~30s. A FAILED
    # build ends the wait at once with its log (exit 6 gate / 7 infra after one retry) instead of
    # polling a 404 for the whole deadline and then nudging a tree that cannot build.
    HOSTCHK="$(dirname "$0")/render-deploy-status.sh"
    host_last=0; host_retried=""; host_status=""; host_commit=""
    host_check() {
      [ -n "${RENDER_API_KEY:-}" ] && [ -x "$HOSTCHK" ] || return 0
      [ $(( $(date +%s) - host_last )) -ge 30 ] || return 0
      host_last=$(date +%s)
      local out rc
      out="$("$HOSTCHK" status 2>&1)"; rc=$?
      host_status="$(printf '%s' "$out" | sed -n '1s/.*STATUS=\([^ ]*\).*/\1/p')"
      host_commit="$(printf '%s' "$out" | sed -n '1s/.*COMMIT=\([^ ]*\).*/\1/p')"
      case $rc in
        6) echo "[verify] HOST BUILD FAILED on a build gate; the page cannot go live until it is fixed:" >&2
           printf '%s\n' "$out" >&2
           exit 6 ;;
        7) if [ -z "$host_retried" ]; then
             host_retried=1
             echo "[verify] host build failed on infrastructure; asking for a fresh build." >&2
             "$HOSTCHK" retry >&2 || true
             deadline=$(( deadline + ${VERIFY_NUDGE_EXTRA:-300} ))
           else
             echo "[verify] host build failed on infrastructure twice:" >&2
             printf '%s\n' "$out" >&2
             exit 7
           fi ;;
      esac
      return 0
    }
    while [ ${#pending[@]} -gt 0 ]; do
      host_check
      still=()
      for spec in "${pending[@]}"; do
        u="${spec%%=*}"; needle=""; [ "$spec" != "$u" ] && needle="${spec#*=}"
        # Cache-bust: the CDN caches a 404 for minutes after the page goes live (s-maxage=300),
        # so without a unique query the poll can keep seeing the stale miss past the deadline.
        case "$u" in *\?*) bust="${u}&v=$(date +%s)" ;; *) bust="${u}?v=$(date +%s)" ;; esac
        body="$(curl -sL --max-time 20 -w '\n%{http_code}' "$bust" || echo 000)"
        code="${body##*$'\n'}"
        if [ "$code" = "200" ] && { [ -z "$needle" ] || printf '%s' "$body" | grep -qF -- "$needle"; }; then
          echo "200 $u${needle:+ (contains: $needle)}"
        else
          still+=("$spec")
        fi
      done
      pending=("${still[@]+"${still[@]}"}")
      [ ${#pending[@]} -eq 0 ] && { echo "[verify] all URLs live (200${1:+, content present})"; exit 0; }
      if [ "$(date +%s)" -ge "$deadline" ]; then
        for spec in "${pending[@]}"; do u="${spec%%=*}"; echo "FAIL $(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 "$u" || echo 000) $spec"; done
        echo "[verify] deadline passed with ${#pending[@]} URL(s) not live" >&2; exit 1
      fi
      # NUDGE — still not live halfway through: push ONE empty commit to main so the host
      # starts a fresh build. A Render build can die before it starts (2026-10-12 ec60750:
      # "could not read Username for 'https://github.com'" on clone, a transient GitHub-auth
      # blip) and Render never retries it, so the change sits unpublished until some other
      # routine happens to push. The empty commit is built on origin/main's tree, so it never
      # touches the working tree or ships anything new. VERIFY_NUDGE=0 turns it off.
      # With the host check available, nudge only when the host never saw the push (its latest
      # deploy is live for an older commit); a build in progress just needs more time.
      case "$host_status" in
        build_in_progress|update_in_progress|pre_deploy_in_progress|created|queued) nudge_ok="" ;;
        live) git fetch -q origin main 2>/dev/null || true
              [ "$host_commit" != "$(git rev-parse --short=7 origin/main 2>/dev/null)" ] && nudge_ok=1 || nudge_ok="" ;;
        *) nudge_ok=1 ;;
      esac
      if [ -z "$nudged" ] && [ -n "$nudge_ok" ] && [ "${VERIFY_NUDGE:-1}" != "0" ] && [ "$(date +%s)" -ge "$nudge_at" ]; then
        nudged=1
        for _ in 1 2 3; do
          git fetch -q origin main || continue
          c="$(git commit-tree 'origin/main^{tree}' -p origin/main -m "redeploy: not live after $(( $(date +%s) - start ))s; retrigger host build [skip-content]")" || break
          if git push -q origin "$c:main"; then
            echo "[verify] not live yet -> pushed empty redeploy commit $(git rev-parse --short "$c") to main" >&2
            deadline=$(( deadline + ${VERIFY_NUDGE_EXTRA:-300} ))
            break
          fi
        done
      fi
      sleep 10
    done
    ;;

  *)
    echo "usage: deploy-run-to-main.sh {mark|push|land|verify URL[=needle]...}" >&2
    exit 2
    ;;
esac
