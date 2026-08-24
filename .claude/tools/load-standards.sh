#!/usr/bin/env bash
# THE sanctioned way to load the content standard. Prints all three canonical
# files in full AND appends a receipt to reports/standards-ledger.jsonl in the
# same action — so a routine cannot obtain the standard without leaving proof.
# Usage: bash .claude/tools/load-standards.sh "<routine>" "<phase>"
set -u
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/usr/local/bin:$PATH"
ROUTINE="${1:-unknown}"; PHASE="${2:-unknown}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
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
echo; echo "===== _content-standard.md ====="; cat "$C/_content-standard.md"
echo; echo "===== _anti-ai-language.md ====="; cat "$C/_anti-ai-language.md"
echo; echo "===== _experience.md ====="; cat "$C/_experience.md"
