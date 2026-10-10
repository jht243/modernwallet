# Coverage-scoring brief (question-gap pass, Phases 2-3)

Site: themodernwallet.com (repo /home/user/modernwallet, Astro; YMYL finance, informational only). DO NOT edit any site source file. You only write analysis JSON files.

For EACH page assigned to you, read `reports/question-gap-pass/pages/<slug>.page.md` (current full text dumped from its data file). Real Google People-Also-Ask are in `reports/question-gap-pass/serp.json` and `serp2.json` (keyed by route, field `paa`; pages with none -> questions are source "generated"). Whole-site route/H1 index for the "answered elsewhere" check: `reports/question-gap-pass/site-index.tsv` (route<TAB>H1); grep it, read a candidate page's data (src/data/*.ts) only if unsure.

Procedure per page:
1. Build 20-30 distinct follow-up questions a visitor asks next: PAA first (source "paa"), then generated ones (source "generated") from intent buckets: cost, time, comparison/decision, process, risk, maintenance/after, eligibility/fit, proof. Specific to the topic; no near-duplicates (PAA wording wins over a restated generated one). Drop celebrity/opinion-bait or off-topic PAA ("what does Dave Ramsey say", "Warren Buffett") -> "Skip — off-topic".
2. Coverage vs the page's ACTUAL text: clear / partial / missing. Strict ("mentioned in passing" = partial; clear = visitor would not need to search again). Cite the section.
3. Dedup: for missing/partial, does another site page already answer it? (grep site-index.tsv; read if unsure.) If yes -> action "Link" with target route (must exist in site-index.tsv, not the page itself; if the page already links there say "already linked").
4. Value High/Med/Low (High = gates a real decision: cost, fit/eligibility, what can go wrong, tax consequences, age/limits/access, timing).
5. Action (first match): clear -> Skip — already clear; answered elsewhere -> Link; missing/weak-partial + High + not elsewhere -> Add (prefer appending to the page's FAQ array; else a short section); partial + High + not elsewhere -> Strengthen; else Skip — low value. PAA outranks generated at equal value; a missing question whose answer Google's AI Overview cites from a competitor (`ai_overview_cited_domains` in serp json) is High. If `forum_dominated`, the answer should read practical, not vendor-speak.
6. YMYL GROUNDING (hard): every Add/Strengthen needs a `fact_basis`: the exact figures/facts the answer may state, each traceable to text already on THAT page (quote it) or to an official primary source (irs.gov, ssa.gov, cfpb.gov, consumerfinance.gov, investor.gov, sec.gov, finra.org, va.gov, studentaid.gov, federalreserve.gov, fdic.gov, defense.gov ...) that you actually fetched (WebFetch/WebSearch) — give the URL. Never invent rates, fees, prices, limits, dates. Cannot ground -> "Skip — ungrounded". An answer with no figures can use fact_basis "none needed (no figures)".
7. Cap: max 3 Add+Strengthen per page (the best). These pages are already rich (10-20 FAQs); many legitimately yield 0-2. Do not pad.
8. If `reports/question-gap-pass/cache.json` exists, drop anything already added.

Output one file per page: `reports/question-gap-pass/chart/<slug>.json` (mkdir -p):
{"route","slug","file","kind","clicks","impressions","serp_verdict","ai_overview_cited_domains","forum_dominated",
 "questions":[{"q","source","coverage","where","elsewhere"(route|null),"value","action","reason"}],
 "actions":[{"action":"Add|Strengthen|Link","q","target":"faq | section:<heading to insert after> | <existing FAQ question to strengthen> | link-from:<where>","link_to"(Link only),"fact_basis":[{"fact","source"}],"allowed_urls":[official URLs only],"task":"one-line instruction for the prose writer incl. placement & shape"}]}
(file/kind/clicks/impressions are in reports/question-gap-pass/pages.json.) Finish with a SHORT summary: per page counts of Add/Strengthen/Link/Skip. Be efficient; don't narrate.
