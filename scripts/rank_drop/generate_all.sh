#!/usr/bin/env bash
# Generate every planned piece of prose in parallel — content_gen calls are independent API calls.
#   add_section → content_gen section  → <slug>/section.md
#   rewrite     → content_gen write    → <slug>/page.json   (L5 retries only — the REWRITE_TASK subagents
#                 generate L5 pages themselves through mindmap-pass Phase 3; this re-runs a failed one with
#                 the same mindmap system.md recorded in plan.json)
# Pages that already have their output are skipped, so re-running retries only the failures.
# Usage: GEMINI_API_KEY=… scripts/rank_drop/generate_all.sh reports/rank-drop/<date>/packets [parallel=6]
set -uo pipefail
P="$1"; N="${2:-6}"
gen() {
  d="$1"; slug=$(basename "$d")
  read -r act sys sid schema floor < <(python3 - "$d" <<'PY'
import json, sys
d = sys.argv[1]
plan, pk = json.load(open(f"{d}/plan.json")), json.load(open(f"{d}/packet.json"))
print(plan.get("action"), plan.get("system") or pk["system"], plan.get("section_id", "fix"), plan.get("schema", "guide"),
      plan.get("floor", 1200))
PY
)
  if [ "$act" = "add_section" ]; then
    [ -s "$d/section.md" ] && { echo "SKIP $slug (done)"; return; }
    python3 scripts/lib/content_gen.py section --system "$sys" --prompt "$d/section.prompt.md" \
      --out "$d/section.md" --slug "$slug--$sid" --page "$d/page.md" \
      --allowed-urls "$d/allowed-urls.txt" --facts "$d/section.prompt.md" > "$d/generate.log" 2>&1
  elif [ "$act" = "rewrite" ]; then
    [ -s "$d/page.json" ] && { echo "SKIP $slug (done)"; return; }
    python3 scripts/lib/content_gen.py write --system "$sys" --prompt "$d/page.prompt.md" \
      --out "$d/page.json" --slug "$slug" --floor "$floor" --schema "$schema" --format json \
      --allowed-urls "$d/allowed-urls.txt" --facts "$d/page.prompt.md" > "$d/generate.log" 2>&1
  else
    return
  fi && echo "OK $act $slug" || echo "FAIL $act $slug (see $d/generate.log)"
}
export -f gen
for d in "$P"/*/; do [ -f "$d/plan.json" ] && echo "${d%/}"; done | xargs -P "$N" -I{} bash -c 'gen "$@"' _ {}
