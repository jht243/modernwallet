#!/usr/bin/env bash
# render-deploy-status.sh — what the host is doing with this repo's main.
#
#   .claude/scripts/render-deploy-status.sh status [repo-dir]   # latest deploy + why it failed
#   .claude/scripts/render-deploy-status.sh retry  [repo-dir]   # start a fresh build of main
#
# WHY: a page that is on main but 404 live has two very different causes, and polling the URL
# cannot tell them apart. On 2026-10-19 one table cell tripped scripts/check_table_deferrals.mjs,
# every Render build of layer3labs failed for 2 hours, and the publisher routine reported the host
# as "stalled" and stopped building. The build log had named the file, line and cell the whole time.
# This script reads that log so the routine can fix the cell and land again inside the same run.
#
# Needs RENDER_API_KEY (the owner's key, passed by the routine prompt). The service is resolved
# from the repo's origin URL: a `.claude/scripts/render-service-id` file pins it; otherwise the
# non-suspended static_site for that repo, then its web_service (cron jobs never count).
#
# First output line is machine-readable:  STATUS=<render status> COMMIT=<sha7> DEPLOY=<id> SERVICE=<id>
# then, for a failed build, the log excerpt with the error. Exit codes:
#   0  latest deploy is live or still building
#   2  no RENDER_API_KEY / no service for this repo (caller keeps its old URL-polling behavior)
#   6  latest deploy FAILED on a repo gate or compile error -> the excerpt names it; fix and land again
#   7  latest deploy FAILED on infrastructure (clone/auth/registry/timeout) -> `retry` starts a new build
set -uo pipefail
cmd="${1:-status}"
dir="${2:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
[ -n "${RENDER_API_KEY:-}" ] || { echo "STATUS=unknown (no RENDER_API_KEY)"; exit 2; }
API="https://api.render.com/v1"
auth=(-H "Authorization: Bearer $RENDER_API_KEY" -H "Accept: application/json")

repo_url="$(git -C "$dir" remote get-url origin 2>/dev/null | sed -E 's#^git@github\.com:#https://github.com/#; s#\.git$##; s#^https://[^@]*@#https://#')"
pin="$dir/.claude/scripts/render-service-id"
if [ -f "$pin" ]; then
  svc="$(tr -d '[:space:]' < "$pin")"
else
  # The services list is paginated (100 per page, `cursor` continues it); walk every page.
  svc="$( { cursor=""; for _ in 1 2 3 4 5 6 7 8; do
             page="$(curl -sS --max-time 30 "${auth[@]}" "$API/services?limit=100${cursor:+&cursor=$cursor}")"
             printf '%s\n' "$page"
             cursor="$(printf '%s' "$page" | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[-1]["cursor"] if len(r)==100 else "")' 2>/dev/null)"
             [ -n "$cursor" ] || break
           done; } | python3 -c '
import json, sys
want = sys.argv[1].lower()
best = None
rows = []
for line in sys.stdin:
    line = line.strip()
    if line: rows += json.loads(line)
for row in rows:
    s = row["service"]
    repo = (s.get("repo") or "").lower().rstrip("/")
    if repo.endswith(".git"): repo = repo[:-4]
    if repo != want or s.get("suspended") == "suspended" or s["type"] == "cron_job": continue
    rank = {"static_site": 0, "web_service": 1}.get(s["type"], 2)
    if best is None or rank < best[0]: best = (rank, s["id"])
print(best[1] if best else "")' "$repo_url" 2>/dev/null)"
fi
[ -n "$svc" ] || { echo "STATUS=unknown (no Render service for $repo_url)"; exit 2; }

if [ "$cmd" = "retry" ]; then
  out="$(curl -sS --max-time 30 "${auth[@]}" -H "Content-Type: application/json" -X POST \
        "$API/services/$svc/deploys" -d '{"clearCache":"do_not_clear"}')"
  id="$(printf '%s' "$out" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("id",""))' 2>/dev/null)"
  [ -n "$id" ] && { echo "RETRY=$id SERVICE=$svc"; exit 0; }
  echo "RETRY=failed SERVICE=$svc $out" >&2; exit 1
fi

# RENDER_DEPLOY_ID=<dep-id> inspects one specific deploy instead of the latest (testing / post-mortems).
if [ -n "${RENDER_DEPLOY_ID:-}" ]; then dep_url="$API/services/$svc/deploys/$RENDER_DEPLOY_ID"; else dep_url="$API/services/$svc/deploys?limit=1"; fi
dep="$(curl -sS --max-time 30 "${auth[@]}" "$dep_url" | python3 -c '
import json, sys
rows = json.load(sys.stdin)
d = (rows[0]["deploy"] if rows else {}) if isinstance(rows, list) else rows
c = d.get("commit") or {}
print(d.get("status",""), (c.get("id") or "")[:7], d.get("id",""), d.get("createdAt",""), d.get("finishedAt") or d.get("updatedAt") or "")' 2>/dev/null)"
read -r status commit deploy created finished <<<"$dep"
echo "STATUS=${status:-unknown} COMMIT=${commit:-?} DEPLOY=${deploy:-?} SERVICE=$svc"
case "$status" in
  live|created|queued|build_in_progress|update_in_progress|pre_deploy_in_progress) exit 0 ;;
  "") exit 2 ;;
esac

# Failed: pull the build log for that deploy's window and show the error.
owner="$(curl -sS --max-time 30 "${auth[@]}" "$API/services/$svc" | python3 -c 'import json,sys; print(json.load(sys.stdin)["ownerId"])' 2>/dev/null)"
end="$(python3 -c 'import sys,datetime as d; t=d.datetime.fromisoformat(sys.argv[1].replace("Z","+00:00")); print((t+d.timedelta(seconds=90)).strftime("%Y-%m-%dT%H:%M:%SZ"))' "${finished:-$created}" 2>/dev/null || date -u +%Y-%m-%dT%H:%M:%SZ)"
log="$(curl -sS --max-time 60 -G "${auth[@]}" "$API/logs" --data-urlencode "ownerId=$owner" --data-urlencode "resource=$svc" \
      --data-urlencode "type=build" --data-urlencode "startTime=$created" --data-urlencode "endTime=$end" \
      --data-urlencode "limit=400" --data-urlencode "direction=backward" | python3 -c '
import json, re, sys
rows = sorted(json.load(sys.stdin).get("logs", []), key=lambda r: r.get("timestamp", ""))
ansi = re.compile(r"\x1b\[[0-9;]*[A-Za-z]|\x1b\(B|\(B")
lines = [ansi.sub("", r.get("message", "")).rstrip() for r in rows]
# Keep the tail from the last command Render ran, which is where the failing step prints.
start = 0
for i, l in enumerate(lines):
    if l.startswith("$ ") or "Running build command" in l: start = i
tail = [l for l in lines[start:] if l.strip()]
print("\n".join(tail[-60:]))' 2>/dev/null)"
echo "--- build log (deploy $deploy, $status) ---"
printf '%s\n' "$log"
echo "--- end build log ---"
if printf '%s' "$log" | grep -qiE "could not read Username|unable to access|Authentication failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|registry\.(yarnpkg|npmjs)\.(com|org).*(error|failed|timed out)|Downloading cache.*failed|Timed out|Build timed out|internal server error"; then
  echo "VERDICT=infrastructure: not caused by the code; run \`$0 retry\` to start a fresh build."
  exit 7
fi
echo "VERDICT=gate: this commit fails a build gate or compile step named above; fix it and land again."
exit 6
