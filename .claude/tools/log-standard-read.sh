#!/usr/bin/env bash
# TRUE PING: fires whenever any routine READS a canonical standards file.
# Wired as a PostToolUse hook on Read in .claude/settings.json. Not inference,
# not self-reporting — the harness calls this because the file was opened.
# Appends one JSON line to reports/standards-ledger.jsonl.
set -u
payload=$(cat 2>/dev/null || true)
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
fp=$(printf '%s' "$payload" | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin); ti=d.get('tool_input') or {}
    print(ti.get('file_path') or ti.get('path') or '')
except Exception: print('')
" 2>/dev/null)
case "$fp" in
  *_content-standard.md|*_anti-ai-language.md|*_experience.md) ;;
  *) exit 0 ;;
esac
python3 - "$root" "$fp" <<'PY' 2>/dev/null
import sys,os,json,hashlib,datetime,pathlib
root,fp=sys.argv[1],sys.argv[2]
c=pathlib.Path(root)/".claude"/"commands"
def s8(p):
    try: return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()[:8]
    except Exception: return "MISSING"
exp=c/"_experience.md"; dom=""
try:
    t=exp.read_text(); dom=" ".join(t.split("\n## DOMAIN",1)[1].split("\n---",1)[0].split())[:60]
except Exception: pass
e={"ts":datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
   "routine":os.environ.get("CLAUDE_ROUTINE","claude-session"),
   "phase":"read:"+os.path.basename(fp),"via":"hook",
   "cs":s8(c/"_content-standard.md"),"aa":s8(c/"_anti-ai-language.md"),"exp":s8(exp),"domain":dom}
led=pathlib.Path(root)/"reports"/"standards-ledger.jsonl"
led.parent.mkdir(parents=True,exist_ok=True)
with led.open("a",encoding="utf-8") as f: f.write(json.dumps(e,ensure_ascii=False)+"\n")
PY
exit 0
