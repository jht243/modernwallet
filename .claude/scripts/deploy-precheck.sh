#!/usr/bin/env bash
# Repo-specific pre-push gate, called by deploy-run-to-main.sh push with the files this
# run changed vs origin/main. Non-zero = the push is refused (exit 4).
# Every TS data record must parse and have no duplicate keys — one entry pasted inside
# another fails the build (or silently corrupts both pages). See scripts/check_data_files.mjs.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 0
files=()
for f in "$@"; do
  case "$f" in data/*.ts|src/data/*.ts) [ -f "$f" ] && files+=("$f") ;; esac
done
[ ${#files[@]} -eq 0 ] && exit 0
node scripts/check_data_files.mjs "${files[@]}" | grep -v '^OK '
exit "${PIPESTATUS[0]}"
