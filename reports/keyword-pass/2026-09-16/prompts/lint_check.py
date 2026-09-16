import json, re, sys

files = [
    "reports/keyword-pass/2026-09-16/drafts/state-mileage-reimbursement-law-california-texas-michigan.json",
    "reports/keyword-pass/2026-09-16/drafts/mileage-reimbursement-rates-uk-canada-ireland-nz.json",
    "reports/keyword-pass/2026-09-16/drafts/lemon-law-mileage-offset-calculator-explained.json",
]

BANNED = ['crucial','vital','essential','pivotal','paramount','powerful','profound','remarkable',
    'notable','significant','game-changer','cutting-edge','revolutionary','breakthrough','robust',
    'holistic','delve','realm','landscape','testament','unlock','harness','supercharge','foster',
    'utilize','facilitate','empower','streamline','multifaceted','meticulous','intricate','embark',
    'elevate','transformative','leverage','myriad','plethora','tapestry','beacon']

for f in files:
    d = json.load(open(f))
    text = json.dumps(d)
    print("===", f, "===")
    print(" em-dash:", text.count("—") + text.count("--"))
    print(" 'honest' hits:", len(re.findall(r"\bhonest", text, re.I)))
    hits = []
    for w in BANNED:
        n = len(re.findall(r"\b" + re.escape(w) + r"\b", text, re.I))
        if n:
            hits.append((w, n))
    print(" banned words:", hits)
    print(" death metaphor:", len(re.findall(r"\bdied\b|\bis dead\b|\bkilled\b|life support|flatlined", text, re.I)))
    print(" coy abstraction:", len(re.findall(r"\bthe vendor\b|\bthe platform\b|\bthis provider\b", text, re.I)))
    print(" 'here is'/'the truth is' signpost:", len(re.findall(r"\bhere is the\b|\bthe truth is\b|\bhere's the thing\b", text, re.I)))
    print(" in conclusion/ultimately/overall:", len(re.findall(r"\bin conclusion\b|\bultimately\b|\boverall,", text, re.I)))
    print(" semicolons in prose:", text.count(";"))
    print(" 'as you know'/'now that you have':", len(re.findall(r"as you know|now that you have", text, re.I)))
    # word count check
    strings = []
    def walk(x):
        if isinstance(x, str):
            strings.append(x)
        elif isinstance(x, list):
            for i in x: walk(i)
        elif isinstance(x, dict):
            for v in x.values(): walk(v)
    walk(d)
    body_fields = []
    def walk2(x, key=None):
        if isinstance(x, dict):
            for k,v in x.items():
                walk2(v, k)
        elif isinstance(x, list):
            for i in x: walk2(i, key)
        elif isinstance(x, str) and key in ("introText","body","answer"):
            body_fields.append(x)
    walk2(d)
    words = sum(len(s.split()) for s in body_fields)
    print(" body word count (intro+sections+faq):", words)
    print()
