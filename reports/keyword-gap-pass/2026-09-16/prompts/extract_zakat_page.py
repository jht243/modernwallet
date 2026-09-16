import re, json

text = open("src/data/calculators.ts").read()
start = text.index('id: "zakat",')
# back up to the opening brace of this object (the "{" right before start, after previous "},")
brace_start = text.rindex("{", 0, start)
depth = 0
i = brace_start
while True:
    if text[i] == "{":
        depth += 1
    elif text[i] == "}":
        depth -= 1
        if depth == 0:
            break
    i += 1
obj_text = text[brace_start:i+1]
open("/tmp/zakat_entry_raw.ts", "w").write(obj_text)
print("extracted", len(obj_text), "chars")

# Pull out the human-readable fields via regex (TS, not strict JSON, has unquoted keys)
def grab_field(name, s):
    m = re.search(rf'{name}:\s*\n?\s*"((?:[^"\\]|\\.)*)"', s)
    if m:
        return m.group(1).encode().decode("unicode_escape")
    return None

h1 = grab_field("h1", obj_text)
intro = grab_field("introText", obj_text)
how = grab_field("howItWorks", obj_text)
print("h1:", h1)
print("intro found:", bool(intro))
print("how found:", bool(how))

faqs = re.findall(r'question:\s*"((?:[^"\\]|\\.)*)"\s*,\s*answer:\s*\n?\s*"((?:[^"\\]|\\.)*)"', obj_text)
print("faqs found:", len(faqs))

out = []
out.append(f"# {h1}\n")
out.append("## Intro\n" + (intro or "") + "\n")
out.append("## How It Works\n" + (how or "") + "\n")
out.append("## FAQs\n")
for q, a in faqs:
    qd = q.encode().decode("unicode_escape")
    ad = a.encode().decode("unicode_escape")
    out.append(f"### {qd}\n{ad}\n")

open("reports/keyword-gap-pass/2026-09-16/prompts/zakat.page.md", "w").write("\n".join(out))
print("wrote page.md")
