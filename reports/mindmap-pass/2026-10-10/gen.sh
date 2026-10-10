#!/bin/bash
# usage: gen.sh <slug> <floor> <guide|comparison>
cd "/Users/jonathanteplitsky/Desktop/Github Projects/Growth Sites/WealthFinance"
R=reports/mindmap-pass/2026-10-10; S=$1
python3 scripts/lib/content_gen.py write --system $R/prompts/system.$3.md --prompt $R/prompts/$S.prompt.md \
  --out $R/drafts/$S.json --slug $S --floor $2 --format json --schema $3 \
  --allowed-urls $R/prompts/allowed-urls.$S.txt --facts $R/prompts/$S.prompt.md > $R/drafts/$S.log 2>&1
echo "DONE $S exit=$?"
