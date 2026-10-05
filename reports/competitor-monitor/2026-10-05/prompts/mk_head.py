import textwrap
FLOOR=1200
rows=[]
def row(slug,kw,secondary,intent,rq,ans,place,facts,urls,internal,sections,faqs,cf_title,cf_outline,comp,anchor):
    t=f"""# Row: {slug}

route: /guides/{slug}/
slug: {slug}
page type: explainer
medium: text -> text
register: operator
depth floor: {FLOOR} body words
primary keyword: {kw}
secondary keywords: {secondary}
intent: {intent}
reader question: "{rq}"
answer: {ans}
answer placement: {place}

## CLOSED FACT LIST
Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the named source. Arithmetic shown on the page must use only the worked-example numbers below (labelled hypothetical where marked).

""" + "\n".join("- "+f for f in facts) + """

## CLOSED URL LIST (only these external URLs; also written to allowed-urls.txt)
""" + "\n".join("- "+u for u in urls) + """

## Internal links available (use real routes only)
""" + "\n".join("- "+i for i in internal) + """

## Section-by-section coverage (write ORIGINAL prose, do not restate outline wording)
""" + "\n".join(f"{n}. {s}" for n,s in enumerate(sections,1)) + """

## FAQ questions (answer each with a direct lead sentence)
""" + "\n".join("- "+q for q in faqs) + f"""

## Anchor
{anchor}

---

COVERAGE FLOOR — a competitor ({comp}) published a page on this topic:
  Title: {cf_title}
  Section outline (H2/H3): {cf_outline}
Your page MUST cover every topic in this outline and beat its depth and usefulness.
Treat this outline only as a checklist of topics to exceed.
Write 100% ORIGINAL prose. Do NOT copy, paraphrase sentence-by-sentence, or mirror
the competitor's wording. Add information gain they do not have (a first-hand operational
detail, a failure mode, a non-obvious tradeoff, or a decision criterion).
Never reference or name the competitor on the page.
"""
    open(f"{slug}.prompt.md","w").write(t)
    open(f"{slug}.allowed-urls.txt","w").write("\n".join(urls)+"\n")

ANCH="Use only the general editorial framing licensed by _experience.md (calculators-and-guides publisher; no client volume, no named-client claims, no advisory practice). If no honest first-hand observation fits, use `anchor-exempt:` and anchor instead on the decision criterion named in the sections list as the page's original substance."

