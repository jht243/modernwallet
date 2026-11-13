---
description: AUTONOMOUS daily "<Product> Alternatives" pages — up to 3 per America/Bogota day from the committed backlog, one pricing audit per page, publish, verify live, IndexNow. Cloud routine; no human gates.
---

# Daily alternatives pages — cloud routine

Owner rules, November 13, 2026 (Jonathan). These supersede the local-controller process in
`alternatives-daily.md` for every scheduled run on this site and on every fleet site.

## What the owner wants

- Up to **3 new "<Product> Alternatives" pages per America/Bogota calendar day**, fully automated.
- These pages **list alternatives to a product; they give no advice.** There is no deep or
  professional review. The ONE review per page checks **pricing and plan facts against each
  product's own website**, plus the title, link and CTA rules below.
- The purpose is inbound vendor inquiries: vendors find the page, ask to update their row or to be added.
- No vendor outreach, no emails, no messages to anyone from this routine.

## Page rules (every page)

1. **Title and H1** both start with `<Product> Alternatives`, then a qualifier the page supports:
   `<Product> Alternatives 2026: Pricing and Features Compared`, `<Product> Alternatives: Prices and Plans Compared`.
   Never "Tested" or any testing claim; nothing on these pages was tested.
2. **The only external link** on the whole rendered page is the subject product's official site
   (one link in the intro is enough). No links to the alternatives, sources, social sites or affiliates.
   Internal links to this site are fine.
3. **Two vendor CTAs, never next to each other** (the site template renders them for routes in the
   site's alternatives registry, see the site adapter):
   - "Are you one of these vendors? Update your listing" — a text line directly under the comparison table.
   - "Want to be added to this alternatives page? Contact us" — the full-width dark CTA band with a
     pill button at the end of the second section (the first body section after the table section).
4. **Facts:** every price, plan name, limit or feature comes from that product's own website as of
   today. If a vendor publishes no price, write "Quote-based; no public price" (a fact, not a deferral). Never estimate,
   round into a new number or carry a price from memory. Name the source in plain text where useful;
   keep the source URLs in `reports/alternatives-daily/<day>/<slug>-sources.json`, not as links.
   Read vendor pages with `python3 scripts/alternatives_daily/fetch_page.py <url> [--grep price]`
   (writer AND auditor): it renders JavaScript pages in a headless browser when a plain fetch is
   blocked or empty. A vendor page counts as unreadable only after this helper also fails.
5. **Full Mindmap SEO standard (owner rule 2026-11-14).** Every page follows this site's
   `.claude/commands/_content-standard.md` IN FULL (SEO, INTENT, DEPTH, QUALITY, STYLE, VOICE,
   COMPARISON, LINKS, ANCHOR, NEUTRALITY, AUDITOR, INTRO HUMANIZE) and `_anti-ai-language.md`,
   exactly as a /mindmap-pass page would. Run its PREFLIGHT load step and record its row records:
   `page type: comparison` (floor **1,500 body words**), `register: operator`, `medium: prose → prose`,
   and `reader question: "…"` with its evidence tag. Minimum shape:
   - SEO title 50–60 characters, H1 and title start "<Product> Alternatives"; Title Case headings;
     primary keyword in the title, H1, first paragraph, final next-action sentence and 2–3 headings;
     every acronym defined on first use; meta description with the keyword.
   - First body sentence answers "what should I use instead of <Product>?"; answer the top
     People-Also-Ask question in the opener; remaining on-topic PAA questions go in the FAQ.
   - Comparison table: subject + 5–8 real alternatives (product, billing unit and entry price,
     limits, best fit). Then one substantive H2 section PER alternative (what it is, pricing tiers
     from its own site, who it fits, where it falls short versus <Product>, a worked cost example
     where pricing allows), plus "How to Choose a <Product> Alternative" (decision criteria),
     "When <Product> Is Still the Better Fit", "Who This Is Not For", "What Would Change Our
     Answer", a short verdict and 4–6 FAQs (FAQ schema). Close on a concrete next action.
   - Depth comes from answering more of the query (sub-questions, failure modes, cost arithmetic),
     never padding. Table of contents when over 2,000 words.
   - LINKS: 3+ contextual internal links to related pages on this site (hub, related guides,
     comparisons) — internal links are encouraged. Owner override of the standard's link gate:
     the ONLY external link is the subject product's official site (rule 2); other companies are
     named in plain text.
   - Data cells never defer ("see vendor site" fails the standard's deferral gate): state the fact
     ("Quote-based; no public price", "Free plan; paid tiers from $X/month").
   - TESTED never applies (nothing on these pages was tested). Neutral wording: "fits teams that…".
6. **No ads, affiliate links, sponsored boxes or self-promotion** on these pages beyond the template's CTAs.

## Run steps

Run every subagent INLINE and BLOCKING. Never background anything and end the turn.

**0. Start.** The routine prompt has already run `bash .claude/tools/workflow-start.sh --cloud`
(exit 0). Run `.claude/scripts/deploy-run-to-main.sh mark` once. Read the SITE ADAPTER at the end
of this file. Day = America/Bogota date (`TZ=America/Bogota date +%F`).

**1. Backlog.** `python3 scripts/alternatives_daily/backlog.py status` then `... next`.
- `resume` rows were claimed on an earlier run: finish them first (check the row history for the
  last step; if the page is already live, go straight to step 6 for it).
- `new` rows are today's eligible picks. Fewer than `slotsLeftToday`? Qualify `pending` rows in
  priority order until enough are eligible (only as many as you need today):
  - find the exact product's official HTTPS URL (pricing page preferred) and the vendor name;
  - check this site does not already have an alternatives page or a page answering
    "<product> alternatives" (search the site's page data and sitemap). Already covered →
    `set --status duplicate`; name ambiguous between unrelated products → `set --status excluded`
    with the reason;
  - keep the intake demand estimate as `demand`, or get one with the site's keyword tool
    (SEMrush first, `scripts/lib/keyword_data.py` if present);
  - `set --id <id> --status eligible --note "qualified" --field officialUrl='"https://…"' --field vendor='"…"' --field product='"…"' --field demand='{…}'`.
- `discoveryAllowed: true` (nothing eligible or pending is left): discover up to 60 new products whose
  "<product> alternatives" search has real demand and that fit THIS site's audience (see adapter).
  Write them to `reports/alternatives-daily/<day>/discovery.json` as a list of
  `{vendor, product, officialUrl, targetQuery, demand, category, priority, source}` and run
  `backlog.py add --file …`. Never re-add a product already in the backlog (the helper refuses).
- Claim today's rows: `backlog.py claim --ids a,b,c`. The helper enforces 3 per day.
- Nothing new to do (cap reached or nothing qualifies) → skip to step 7b (upgrade pass), then step 8.

**1b.** The upgrade pass for older thin pages is step 7b. It runs on EVERY run, after
today's pages are published, and also when step 1 finds nothing new to publish.

**2. Research and write** each claimed page per the page rules and the site adapter. Read
`.claude/commands/_content-standard.md` and `_anti-ai-language.md` first and run the standard's
PREFLIGHT load step. Count body words before the audit; under 1,500 means research more of the
query, not pad. Record the
writer: `backlog.py set --id <id> --status in_progress --note "drafted" --field writer='"main"' --field slug='"<slug>"'`.

**3. Build gate** (site adapter). Fix failures before going on.

**4. One audit per page.** For each page start ONE blocking `general-purpose` subagent. Give it the
page content (the data entry and the locally rendered text if available), the sources file and these
instructions: open each product's own website (pricing page) and check every price, plan, limit and
named feature on the page; check the title/H1 rule, that the only external link is the subject's
official site, that both CTAs are present and apart, and that there is no testing claim or advice
framing. ALSO apply every hard-fail gate in the `## AUDITOR` section of
`.claude/commands/_content-standard.md` (Depth ≥ 1,500 body words, required page elements, title
length, headings, acronyms, reader question, anchor, neutrality, sentence rhythm, no deferral in
data cells), with the owner overrides in page rules 2 and 5 (only the subject is linked; TESTED
skipped). Return JSON only:
`{"reviewer":"audit-subagent","verdict":"PASS|FAIL","findings":[{"id":"F1","quote":"…","problem":"…","fix":"…","hard_blocker":true|false}]}`.
Save it to `reports/alternatives-daily/<day>/<slug>-audit.json` and record it:
`backlog.py audit --id <id> --file <that file>`. The helper refuses a second audit for a page.

**5. Fix.** Apply every finding as a targeted edit (same writer). A price that cannot be confirmed
becomes "Quote-based; no public price" (a fact, not a deferral). No second audit. If a hard blocker cannot be fixed
(e.g. the product no longer exists), `set --status held --note "<reason>"` and leave that page out
of the commit. A held page frees its slot: run `backlog.py next` again, claim a replacement
and produce it the same way, until 3 pages are published today or nothing eligible is left
(qualify or discover more if needed). Re-run the build gate.

**6. Publish.** Commit only this run's files, then `.claude/scripts/deploy-run-to-main.sh push`.
Exit 3 → push the branch, report the manual-merge note, stop. Then
`.claude/scripts/deploy-run-to-main.sh verify <each new URL>` in the foreground (Bash timeout
600000). For each live URL run
`python3 scripts/alternatives_daily/live_links.py <url> --allow <official host> [--allow <www twin>] --require "Update your listing" --require "Want to be added to this alternatives page?"`.
A failure here is a real defect: fix it, commit, push, verify again.

**7. Index and record.** Write the verified URLs to `reports/alternatives-daily/<day>/indexnow.txt`
and run `python3 .claude/scripts/indexnow-submit.py --urls-file <that file>` (only new pages; listing
pages that merely gained a card are not submitted). For each page:
`backlog.py set --id <id> --status published --note "live-verified" --field liveUrl='"<url>"' --field commit='"<sha>"' --field indexnow='"<result>"' --field seoUpgraded='"<day>"' --field bodyWords=<n>`
(new pages are written to page rule 5, so they never need the upgrade pass).
Commit `reports/alternatives-daily/` (backlog + receipts) and push with the deploy helper
(metadata only — no second live verify needed).

**7b. Upgrade pass (owner rule 2026-11-14) — ALWAYS run this step, including on a no-op day.**
Pages this routine published before the full SEO
standard existed may be thin. Take the `upgradeQueue` rows from `backlog.py next` (published, no `seoUpgraded`, oldest first, up to 3), and bring each
page up to page rule 5 in place (same URL, slug and title start; refresh prices from each
vendor's site). Give each upgraded page ONE audit as in step 4 and record it with
`backlog.py audit --id <id> --file <file> --upgrade`, fix the findings, publish and live-check as in
steps 6–7 (submit the upgraded URLs to IndexNow), then
`backlog.py set --id <id> --status published --note "seo upgrade" --field seoUpgraded='"<day>"' --field bodyWords=<n>`.
A row whose live page already has at least 1,500 body words and the page rule 5 sections only
gets marked with that `set` command (no rewrite, no audit). Commit and push the receipts as in step 7.
A vendor page that cannot be read during an upgrade (403, JavaScript-only, missing price) never
blocks the upgrade. Keep that product's facts exactly as the page already states them (they passed
the page's original audit; keep their check date in the sources file) and expand the rest of the
page. A cell that currently defers ("see vendor site") becomes the fact the vendor's site does show
(e.g. "Quote-based; no public price") or the product is swapped for an alternative whose site can
be read. Hold an upgrade only if the subject product itself no longer exists.

**8. Report** through the routine prompt's central reporting: pages published with links, rows
held/excluded and why, pages upgraded in step 7b (with body word counts), audit verdicts and how many findings were fixed, IndexNow result, backlog
counts, commit SHAs. Before reporting, run `backlog.py status`: if `upgradePending` still lists
rows that this run did not try in step 7b, go back and do step 7b for them first (up to 3 per run).
Before finishing, confirm this run's commits are on `origin/main`.

Never reset a row, delete history, or re-audit a page. A page is `published` only after the live
check passes.

---

## SITE ADAPTER — ModernWallet (www.themodernwallet.com, repo jht243/modernwallet, Astro)

- **Audience for discovery:** consumer and small-business money products that ModernWallet readers
  compare and sign up for (the site's calculators, guides and `/roundup/` pages cover these):
  banking and savings apps (checking, high-yield savings, money market, neobanks), budgeting,
  net-worth and subscription-tracking apps, payment and money-transfer apps, credit cards,
  personal / student / auto / mortgage lenders and refinance companies, investing and brokerage
  apps, robo-advisors and retirement-account providers (IRA, solo 401(k), small-business 401(k)),
  freelancer and small-business money tools (accounting, invoicing, mileage tracking, business bank
  accounts and cards, business lenders, invoice factoring), tax software and tax-relief companies,
  and online will / estate-planning services. A "product" is a company's app, account, card, loan
  or software with its own official website.
  **Out of scope:** individual securities, funds, ETFs and coins (an alternatives page for a
  security reads as investment advice), anything illegal or offered without a required licence,
  products that are discontinued, and names that are ambiguous between unrelated products.
  These pages LIST products and their published fees; they never recommend, rank for a reader's
  situation, or give financial advice ("fits people who…", never "you should…").
- **Review scope (owner, 2026-11-13):** there is no deep or professional review on these pages,
  including tax, legal and lender pages. The ONE audit (step 4) checks every fee, price, APY/APR
  range, plan name and limit against each product's own website, plus the title, link and CTA
  rules. A rate or fee that changes daily or by applicant is written as the vendor publishes it
  ("APY as published on <date>", "rates vary by applicant"); otherwise "Published plans; see vendor site".
- **Already covered?** Before qualifying a row, search the site for an existing answer:
  `grep -rli "<product> alternatives" src/data data` and `grep -rl "<product-slug>-alternatives" src/data`
  (existing examples: `/roundup/robinhood-agentic-trading-alternatives/`, `/roundup/dataannotation-alternatives/`,
  `/guides/bankruptcy-alternatives/`, `/guides/trump-account-alternatives/`), plus
  `src/data/alternatives.json`. A page that already answers "<product> alternatives" → `duplicate`.
- **Files to edit to add a page (nothing else):**
  1. `src/data/alternatives.json` — append one object to the array. Fields (types and comments in
     `src/data/alternatives.ts`): `slug` (`<product-slug>`, lowercase-hyphen), `product`,
     `officialUrl` (https, the subject's own site), `title` and `h1` (both start
     `<Product> Alternatives`, title ≤ 60 chars), `metaDescription` (50–160 chars), `published`
     (= day, yyyy-mm-dd), `intro` (answers "what should I use instead of <Product>?" in the first two
     sentences; contains the ONE external link `[<Product>](<officialUrl>)`), `tableTitle`,
     optional `tableNote` (e.g. "Fees and prices from each provider's own website, checked <Month D, YYYY>."),
     optional `tableColumns` (default `["Product", "Fees and pricing", "Best fit"]`), `rows`
     (`{product, pricing, bestFit}`; the subject row first with `"subject": true`, then 5–8
     alternatives), `chooseSection` `{heading, body}` (the second section, e.g. "How to choose a
     <Product> alternative"; the "Want to be added" band renders at its end), `alternatives`
     (one `{heading, body}` per alternative), `stillBetterFit` `{heading: "When <Product> is still
     the better fit", body}`, `verdict`, `faqs` (3–5 `{question, answer}`), optional `related`
     (internal `{label, href: "/path/"}` only). Body text: paragraphs separated by a blank line,
     `- ` lines for a list, links as `[text](/internal/)` or `[text](https://<official host>/…)`.
     No raw HTML, no other external links, no "tested"/"we tried" wording.
  2. `data/alternatives-pages.json` — append to `pages`:
     `{"route": "/alternatives/<slug>/", "vendorHost": "<apex host, e.g. chime.com>", "officialHosts": ["<every exact host the page links, e.g. www.chime.com>"]}`.
     Without this row the page does not render. The row turns on both CTAs, the outbound-link
     guard (other external links are rendered as plain text), `noAds` (no Mediavine), no
     entity/Robinhood referral auto-links, and a plain-text footer credit.
  URL: `https://www.themodernwallet.com/alternatives/<slug>/`. Breadcrumb: Compare.
- **Sitemap / search / hub:** automatic. `@astrojs/sitemap` lists the page (lastmod = `updated`
  or `published`, see `astro.config.mjs`), `scripts/build_search_index.mjs` (prebuild) adds it to
  `public/search-index.json`, and `/compare/` shows an "Alternatives" card for it. Do not edit
  sitemap or index files by hand.
- **CTAs (rendered by `src/pages/alternatives/[slug].astro`, never by hand):** "Are you one of
  these vendors? Update your listing" under the table → `/update-listing/?from=<route>`;
  "Want to be added to this alternatives page? Contact us" band at the end of the second
  section → `/sponsor/?from=<route>` (the site's Advertise With Us form). Both `rel="nofollow"`.
- **Build gate (Node 20+):** `npm ci`;
  `python3 scripts/alternatives_daily/check_built.py --data-only`;
  `npm run build` (prebuild search index, Astro build, entity links, unlink-pitched + check,
  vendor nofollow + check, sponsorship line, bundle-size gate — needs network for the public
  growth-sites-api pitched list, no secrets);
  `python3 scripts/alternatives_daily/check_built.py` (title/H1, canonical, only official hosts
  linked, no ads/sponsored/entity links, both CTAs in place and apart, FAQPage JSON-LD, sitemap,
  search index, /compare/ card). All must exit 0. Note: if the subject is on the outreach
  "pitched" list, `unlink_pitched.mjs` unwraps its link (owner rule 2026-10-15); the page then has
  no external link, which still passes. Do not work around it.
- **Publish:** Render auto-deploys `main`. `.claude/scripts/deploy-run-to-main.sh mark` at start,
  `.claude/scripts/deploy-run-to-main.sh push` to publish (its precheck runs
  `scripts/check_data_files.mjs` on changed `src/data/*.ts`). The repo also has
  `.github/workflows/land.yml`; if a direct push to main is refused, use
  `.claude/scripts/land-run.sh land` (same commits via a `claude/land/*` branch). Never force-push.
  Verify with `.claude/scripts/deploy-run-to-main.sh verify "https://www.themodernwallet.com/alternatives/<slug>/=<Product> Alternatives"`
  in the foreground, Bash timeout 600000 (it reads the Render build with
  `RENDER_API_KEY` from the routine prompt when present; without it, polls the URL), allowing up to
  10 minutes, then run `live_links.py` per page:
  `python3 scripts/alternatives_daily/live_links.py https://www.themodernwallet.com/alternatives/<slug>/ --allow <each officialHost> --require "Update your listing" --require "Want to be added to this alternatives page?" --require "<Product> Alternatives"`.
- **IndexNow:** `python3 .claude/scripts/indexnow-submit.py --urls-file reports/alternatives-daily/<day>/indexnow.txt`
  (key file `public/dc557f6bfced447aa1a71771d8a0d24a.txt`). Submit only the new page URLs.
- **Canonical host:** `https://www.themodernwallet.com` (the apex 301s to www). live_links.py
  treats www and apex as internal by default.
- **Keyword data (discovery only, optional):** SEMrush first via `scripts/lib/keyword_data.py`
  (`SEMRUSH_API_KEY`, then `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD`, passed inline by the routine
  prompt like the site's other routines). If no key works, use the intake estimate and continue.
