"""Template an audited draft into src/data (guides.ts or comparisons.ts).

usage: python3 template.py <slug> [--check]
Inserts the page object at the top of GUIDES / COMPARISONS with the run marker comment.
Net-new only: refuses if the slug already exists in the store. --check prints the object only.
"""
import json, sys

RUN = "reports/mindmap-pass/2026-10-10"
DATE = "2026-10-10"
GUIDE_KEYS = ["slug", "title", "metaDescription", "h1", "cardBlurb", "introText", "sections", "tools", "faqs", "sources"]
COMP_KEYS = ["slug", "title", "metaDescription", "targetKeyword", "optionA", "optionB", "h1", "introText",
             "comparisonTable", "verdict", "sections", "faqs", "sources", "relatedComparisons", "calculatorLinks"]

slug = sys.argv[1]
d = json.load(open(f"{RUN}/drafts/{slug}.json"))
comp = "comparisonTable" in d
keys = COMP_KEYS if comp else GUIDE_KEYS
missing = [k for k in keys if k not in d or d[k] in ("", None, [])]
if missing:
    sys.exit(f"REFUSE {slug}: missing/empty required fields {missing}")
obj = {"updated": DATE}
for k in keys:
    obj[k] = d[k]
if comp:
    obj["segment"] = "Debt and bankruptcy"
assert obj["slug"] == slug
body = json.dumps(obj, indent=2, ensure_ascii=False)
block = "\n".join("  " + l for l in body.splitlines())
entry = f"  // ── mindmap-pass {DATE} (bankruptcy): {slug} ──\n{block},\n"

path = "src/data/comparisons.ts" if comp else "src/data/guides.ts"
anchor = "export const COMPARISONS: ComparisonEntry[] = [\n" if comp else "export const GUIDES: Guide[] = [\n"
s = open(path).read()
if f'"slug": "{slug}"' in s or f'slug: "{slug}"' in s:
    sys.exit(f"REFUSE {slug}: already in {path}")
if "--check" in sys.argv:
    print(entry[:1500]); sys.exit(0)
assert s.count(anchor) == 1
s = s.replace(anchor, anchor + entry, 1)
open(path, "w").write(s)
print(f"templated {slug} -> {path}")
