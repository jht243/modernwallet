"""Append a link sentence to the end of a section's body/content in an existing page, and bump updated.
usage: addlink.py <file> <slug> <heading> <text-to-append>   (text appended verbatim, e.g. ' Sentence.' or '\\n\\nPara.')"""
import re, sys, json
path, slug, heading, add = sys.argv[1:5]
add = add.replace("\\n", "\n")
s = open(path).read()
si = re.search(r'"?slug"?: "%s"' % re.escape(slug), s).start()
start = max(s.rfind("\n  {\n", 0, si), s.rfind("\n{\n", 0, si)) + 1
end = min(x for x in (s.find("\n  },", si), s.find("\n},", si)) if x > 0)
blk = s[start:end]
h = blk.index('"%s"' % heading) if '"%s"' % heading in blk else None
assert h is not None, "heading not found"
k = re.compile(r'"?(?:body|content)"?:\s*\n?\s*"').search(blk, h)
q = k.end()
# find closing quote of JSON-ish string
i = q
while True:
    if blk[i] == "\\": i += 2; continue
    if blk[i] == '"': break
    i += 1
enc = json.dumps(add, ensure_ascii=False)[1:-1]
blk = blk[:i] + enc + blk[i:]
# bump/add updated
if re.search(r'^\s*"?updated"?: "[^"]*"', blk, re.M):
    blk = re.sub(r'("?updated"?: )"[^"]*"', r'\1"2026-10-10"', blk, count=1)
else:
    blk = blk.replace("{\n", '{\n    updated: "2026-10-10",\n', 1)
s = s[:start] + blk + s[end:]
open(path, "w").write(s)
print("ok", slug, "/", heading)
