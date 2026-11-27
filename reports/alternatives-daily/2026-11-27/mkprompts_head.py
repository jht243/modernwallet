D="2026-11-27"; P=f"reports/alternatives-daily/{D}/prompts/"
def build(slug, prod, url, kw, rq, answer, alts, facts, links, compnote, subjfacts, cost, extra=""):
    names=", ".join(alts)
    t=f"""# DATA ONLY prompt: {prod} Alternatives (route /alternatives/{slug}/)

route: /alternatives/{slug}/
slug: {slug}
product: {prod}
officialUrl: {url}
page type: comparison (floor 1,500 body words)
register: operator
medium: prose -> prose
primary keyword: {prod} alternatives
secondary keywords: {kw}
published/updated: {D}
reader question: "{rq}" [verb-only, no PAA, no completions]
answer: {answer}
answer placement: section 1 (intro), first two sentences
TESTED: never. Nothing on this page was tested. Use "fits people who..." wording; no advice, no "you should".
Link rule: the ONLY external link is [{prod}]({url}) once in the intro. All other companies in plain text. Internal links (use at least 4): {links}
Required sections: comparison table ({prod} subject row first, then {len(alts)} alternatives: {names}), chooseSection "How to Choose a {prod} Alternative", one H2 per alternative (heading like "<Name> Pricing, Plans and Fit"), stillBetterFit "When {prod} Is Still the Better Fit" with "Who This Is Not For" and "What Would Change Our Answer" as sections/paragraphs, verdict, 4-6 FAQs, closing concrete next action. Define acronyms on first use.
tableNote suggestion: "Prices from each provider's own website, checked November 27, 2026. Prices are in US dollars."
tableColumns: ["Product", "Fees and pricing", "Best fit"]
Do not write {prod}'s name as a stand-in ("the platform", "the vendor", "the app" alone). Do not mention products not on this list. {compnote}
Never give financial advice; list published prices only. Promotional prices may be named as promotions with their stated end dates, never as the regular price.
Worked cost examples allowed (arithmetic only on these figures): {cost}

## CLOSED FACT LIST (use ONLY these facts; checked November 27, 2026 on each vendor's own site)

{subjfacts}

""" + "\n\n".join(facts) + "\n\nAnything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the vendor page.\n"
    open(P+slug+".prompt.md","w").write(t)
    open(P+slug+"-allowed-urls.txt","w").write(url+"\n/\n")

