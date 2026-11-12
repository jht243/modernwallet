#!/usr/bin/env bash
# THE sanctioned way to load the content standard. Prints all three canonical
# files in full AND appends a receipt to reports/standards-ledger.jsonl in the
# same action — so a routine cannot obtain the standard without leaving proof.
# When an active completed workflow-preflight bundle in this run has already
# delivered the exact current SHA-256 bytes of all three canonical files,
# appends the verified load-script ledger receipt without re-dumping 140 KB.
# Usage: bash .claude/tools/load-standards.sh "<routine>" "<phase>" [--ledger-only] [--cloud] [--run-id <id>]
set -u
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin:$PATH"
ROUTINE="unknown"; PHASE="unknown"; POSITIONAL=0
START_ARGS=()
RUN_ID="${WORKFLOW_RUN_ID:-}"
EXPECT_RUN_ID=false
for arg in "$@"; do
  if [ "$EXPECT_RUN_ID" = true ]; then
    RUN_ID="$arg"; START_ARGS+=("--run-id" "$arg"); EXPECT_RUN_ID=false
  elif [ "$arg" = "--ledger-only" ]; then
    :
  elif [ "$arg" = "--cloud" ]; then
    START_ARGS+=("--cloud")
  elif [ "$arg" = "--run-id" ]; then
    EXPECT_RUN_ID=true
  elif [[ "$arg" == --run-id=* ]]; then
    RUN_ID="${arg#--run-id=}"; START_ARGS+=("$arg")
  elif [ "$POSITIONAL" -eq 0 ]; then
    ROUTINE="$arg"; POSITIONAL=1
  elif [ "$POSITIONAL" -eq 1 ]; then
    PHASE="$arg"; POSITIONAL=2
  fi
done
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
if [ "${CLAUDE_CODE_REMOTE:-}" = "1" ] || [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  HAS_CLOUD=false
  for a in "${START_ARGS[@]:-}"; do
    [ "$a" = "--cloud" ] && HAS_CLOUD=true
  done
  [ "$HAS_CLOUD" = false ] && START_ARGS+=("--cloud")
fi
if [ "${#START_ARGS[@]}" -gt 0 ]; then
  bash "$ROOT/.claude/tools/workflow-start.sh" "${START_ARGS[@]}" || exit $?
else
  bash "$ROOT/.claude/tools/workflow-start.sh" || exit $?
fi
C="$ROOT/.claude/commands"
for f in _content-standard.md _anti-ai-language.md _experience.md; do
  [ -f "$C/$f" ] || { echo "FATAL: canonical file missing: $C/$f — STOP, do not proceed from memory." >&2; exit 1; }
done
s8(){ shasum -a 256 "$1" | cut -c1-8; }
CS=$(s8 "$C/_content-standard.md"); AA=$(s8 "$C/_anti-ai-language.md"); EX=$(s8 "$C/_experience.md")
DOM=$(awk '/^## DOMAIN/{f=1;next}/^---/{if(f)exit}f&&NF' "$C/_experience.md" | head -1 | cut -c1-60)
TS=$(date -u +%Y-%m-%dT%H:%M:%S+00:00)
mkdir -p "$ROOT/reports"
printf '{"ts":"%s","routine":"%s","phase":"%s","via":"load-script","cs":"%s","aa":"%s","exp":"%s","domain":"%s"}\n' \
  "$TS" "$ROUTINE" "$PHASE" "$CS" "$AA" "$EX" "$(printf '%s' "$DOM" | sed 's/"/\\"/g')" >> "$ROOT/reports/standards-ledger.jsonl"
echo "standard-loaded: cs=$CS aa=$AA exp=$EX domain=\"$DOM\" (receipt appended to reports/standards-ledger.jsonl — git add it with the run)"
if python3 - "$ROOT" "$RUN_ID" <<'PY'
import hashlib, json, pathlib, sys, time
root = pathlib.Path(sys.argv[1])
run_id = sys.argv[2].strip()
req = [
    ".claude/commands/_content-standard.md",
    ".claude/commands/_anti-ai-language.md",
    ".claude/commands/_experience.md",
]
hashes = {r: hashlib.sha256((root / r).read_bytes()).hexdigest() for r in req}
reports = root / "reports"
if not reports.is_dir():
    sys.exit(1)
now = time.time()
for mp in reports.rglob("manifest.json"):
    try:
        if not run_id and (now - mp.stat().st_mtime) > 21600:
            continue
        m = json.loads(mp.read_text())
    except Exception:
        continue
    if not isinstance(m, dict):
        continue
    if run_id and m.get("runId") != run_id:
        continue
    parts = m.get("parts")
    delivered = m.get("delivered")
    files = m.get("files")
    if not isinstance(parts, list) or not isinstance(delivered, list) or not isinstance(files, dict):
        continue
    if delivered != list(range(1, len(parts) + 1)):
        continue
    if all(files.get(r) == hashes[r] for r in req):
        print(f"preflight-verified: canonical standards already delivered byte-identically in {mp.parent.relative_to(root)} (skipping duplicate stdout dump)")
        sys.exit(0)
sys.exit(1)
PY
then
  exit 0
fi
echo; echo "===== _content-standard.md ====="; cat "$C/_content-standard.md"
echo; echo "===== _anti-ai-language.md ====="; cat "$C/_anti-ai-language.md"
echo; echo "===== _experience.md ====="; cat "$C/_experience.md"
