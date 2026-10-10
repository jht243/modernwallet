"""Apply reviewer-supplied Rung-1 replacements to a draft. usage: fixapply.py <slug> <fixes.json>
fixes.json: [[old, new], ...]  — exact substring replace anywhere in the page object; each old must match exactly once."""
import json, sys
slug, fx = sys.argv[1], sys.argv[2]
p = f"drafts/{slug}.json"
raw = open(p).read(); d = json.loads(raw)
s = json.dumps(d, ensure_ascii=False)
bad = []
for old, new in json.load(open(fx)):
    o = json.dumps(old, ensure_ascii=False)[1:-1]; n = json.dumps(new, ensure_ascii=False)[1:-1]
    c = s.count(o)
    if c != 1: bad.append((c, old[:90])); continue
    s = s.replace(o, n)
json.loads(s)
if bad:
    for b in bad: print("NO-MATCH", b)
    sys.exit(1)
import shutil, os
n = 1
while os.path.exists(f"{p}.pre-fix-{n}"): n += 1
shutil.copy(p, f"{p}.pre-fix-{n}")
open(p, "w").write(json.dumps(json.loads(s), indent=2, ensure_ascii=False))
print("applied", len(json.load(open(fx))), "fixes; backup", f"{p}.pre-fix-{n}")
