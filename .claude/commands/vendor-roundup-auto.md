---
description: AUTONOMOUS daily vendor-roundup driver for ModernWallet / themodernwallet.com (port of the themetabolicjournal / thehoaguide / layer3labs /vertical-roundup-auto lane). Discovers the companies that rank for each personal- and small-business-finance buying category (banks, brokers, robo-advisors, lenders, card issuers, budgeting and money apps, estate-planning services, tax relief, business finance, freelancer tools), lists every qualified one as a row in that category's ONE comparison table, builds a new roundup once a category has 4+ verified vendors, then flags each listed vendor for the correction-note outreach sent by growth-sites-api. NO human gates. Emails a digest via Resend. Designed for scheduled cloud runs.
---

<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
<!-- /workflow-source-freshness-v1 -->


# /vendor-roundup-auto — discovered companies → living ModernWallet roundups → correction outreach

**‼️ UNBREAKABLE INVARIANT — writer output is never final without its audit.** Nothing this run
writes may be committed as final until the Phase 6 audit has run on that exact output and passed.
See `.claude/commands/_content-standard.md`.

**‼️ OBJECTIVITY + YMYL (money).** These rows rank real third-party financial companies. ModernWallet is
NEVER a listed option. Facts only from each company's own pages (rate, fee, minimum, eligibility,
availability); no individualized financial, tax, legal or investment advice; no promise of returns,
approval, savings or debt reduction in any cell or in our voice ("guaranteed approval", "beat the
market", "settle for pennies on the dollar"). Rates and APYs move: quote the figure on the vendor's own
page with "as of <Mon YYYY>" when it is a variable rate. Nothing in a cell may be fabricated.

**‼️ EXCLUSIONS: BLOCK ONLY WHAT IS ILLEGAL (owner rule, fleet-wide).** A company in a legal or regulatory
dispute stays in; state facts in the cells, never editorialize. The `excluded` list in
`data/placement-verticals.json` is the whole list — cut (category 1) ONLY:
- lenders, debt-relief or credit-repair sellers operating illegally in the US (unlicensed where a license
  is required, advance-fee loan or advance-fee debt-relief schemes);
- unregistered investment sellers (offering securities or advice with no SEC/state registration or FINRA
  membership where one is required);
- not vendors: directories, marketplaces, comparison/review sites, publishers, affiliate blogs, lead-gen
  sites (no product of their own; this is not a risk rule);
- closed or unverifiable companies (factual accuracy).
Never cut a vendor for anything not on this list (a lawsuit, a CFPB or state action, a settlement, high
fees, a bad rating). Those are facts for the cells when they are material and on the record.

**‼️ KILLSWITCH IS A CLIENT (same rule as Opt Health on The Metabolic Journal).** Killswitch
(killswitch.rip) is ranked on merit like any vendor, **never pinned, never Featured, never emailed as a
prospect**. NO "partner"/"sponsor" label, NO badge, NO special styling, NO disclosure line. Its table row
is an ordinary editorial row (the renderer links it with the client's UTM URL — `src/lib/vendorTable.ts`
OWN_LINKS; never change that URL). It must never sit in, or look like, the Featured slot. killswitch.rip
is blocklisted in `scripts/placement/serp_roster_discovery.py` and in growth-sites-api; never flag it.
**Robinhood** rows link through the site's referral URL (`src/data/partners.ts`, also OWN_LINKS) — leave
it; do not add another Robinhood link.

**Never claim the site takes no payment for placement.** No "no paid placement", "rankings are not
paid", "we don't accept payment to be listed". The site sells sponsored placements; that claim is false.

**‼️ NO VENDOR GETS A DOFOLLOW LINK IN A ROUNDUP TABLE.** `src/lib/vendorTable.ts` renders every table
company link `nofollow noopener` ("sponsored nofollow" for paid domains and the client/referral links);
`scripts/vendor_nofollow.mjs` makes every link to a PAID domain "sponsored nofollow" site-wide and fails
the build otherwise. Prose links outside the tables are left as they are. Never touch
`data/paid-placements.json` (hand-edited / publisher routine, only after a confirmed payment).

## Why this routine exists

Naming real companies and linking to them produces inbound: they write in to correct their entry,
and that thread is a warm sales conversation (layer3labs: the cold "buy a placement" pitch got 0
replies in 108 sends; the correction note is what gets answers). The unit of work is a **row on a
living category page**, not a page per vendor — a new vendor has no search volume of its own.

## The moving parts (know which part owns what)

| Part | Where | When |
|---|---|---|
| Vendor discovery (SERP roster of every published category + Show HN launches) | growth-sites-api `/api/placement-radar` — the `fleet-placement-radar` Render cron (reads this site's live `/placement-verticals.json`) | 12:00 UTC daily |
| Discovery for a category added TODAY | this routine, Phase 1c — `scripts/placement/serp_roster_discovery.py --verticals <id> --upsert` | when Phase 1c adds one |
| Enrich (emails) + classify (vendor/publisher) | growth-sites-api `/api/placement-radar` — called by this routine in Phase 1b AND by the cron | 12:00 UTC daily + Phase 1b |
| Rows on the roundup pages | this routine, Phases 2–8 | daily |
| Flag listed vendors for outreach | this routine, Phase 9 — `scripts/placement/flag_vendors.mts` | after the push is live |
| "Confirm {Vendor} Pricing" note, ONE per tick | growth-sites-api `/api/placement-tick` — `fleet-placement-drip` cron, only for sites in `PLACEMENT_SEND_SITES` | |
| Owner digest of who was emailed | growth-sites-api `/api/placement-digest` — `fleet-placement-digest` cron | |

State lives in Supabase `fleet_placement_prospects` (CubanInsights project), one row per
(site='themodernwallet.com', domain). Categories and their roundup pages: `data/placement-verticals.json`.

**Where the pages live (this site).** Every roundup is a `RoundupEntry` object in
`src/data/roundups.ts` (also `roundups-business.ts`, `roundups-self-employed.ts`, spread into `ROUNDUPS`),
rendered at `/roundup/<slug>/` by `src/pages/roundup/[slug].astro`. The page has ONE comparison table
(`entry.comparisonTable`: `headers` + the editorial `rows`). The vendor lane lives beside it in
`data/roundup-vendors.json`:
- `pages[<slug>].domains` — editorial row name (exact) → company domain. Gives the row its
  `data-vendor-domain` / `data-vendor-name` and a nofollow link to the company.
- `pages[<slug>].added` — the vendors this routine appends under the editorial rows, each
  `{name, domain, url, values[]}` with ONE value per `comparisonTable.headers` entry, in order.
The Featured slot (empty placeholder until someone buys it) and the "Update your listing" link render
automatically on every page that has a vertical. **So adding vendors = edit the JSON + git push (Render
deploys).** Never add a second vendor table, a hand-written `<table>` of vendors in a section, or a
"vendors we track" list — one honest comparison of one category. The `data-vendor-*` attributes are what
the outreach reads off the live page: never rename them.

Pages with no vertical (fund/ETF lists, account types, a single issuer's cards, calculator roundups) are
not vendor categories: leave them alone.

## Inclusion bar — LOOSE BY DESIGN inside the YMYL fence (owner's instruction, ported from layer3)

Every row is a nofollow link to a company that may pay for a sponsored spot. The bar is: **does this
domain sell a LAWFUL product or service a reader could sign up for in this category, and is it outside the
exclusions?** If yes, it is IN.

- **Horizontal and adjacent providers are IN** — a bank whose savings account fits the savings page, a
  payroll company with a 401(k) product, an accounting suite with invoicing. Say plainly what it is.
- **Small and new are IN.** No minimum size, age or AUM. Credit unions are IN when membership is open
  enough to say who can join.
- **Regulated categories (banks, lenders, brokers, advisors, cards):** cells quote the company's own
  published figure — APY/APR range, fee, minimum, credit score floor, loan amounts — or "Not published".
  Say who can apply when the site restricts it (states, membership, business age/revenue).
  FDIC/NCUA/SIPC status only when the company states it.
- **Values**: open the vendor's own rates/pricing page and put the real figure in the cell for EVERY
  header of that page (the cells must answer the same columns the editorial rows answer). If a column
  does not apply, write "N/A"; if the figure is not published, write "Not published".
  NEVER "see vendor site" — `apply_vendor_rows.mts` rejects it.

**CUT only these** (each goes in `cut[]` with the category number; `apply_vendor_rows.mts` marks it
`status='dead'` so it never comes back):
1. No product of its own — a comparison/review site, a blog, a publisher, a government page, a
   directory, an association, a marketplace/lead-gen site; OR anything on the exclusions list (illegal
   only — see the top of this file).
2. Dead, parked, or redirects to an unrelated site.
3. Sells only something outside this site's scope (not personal or small-business finance).
4. Wrong category for this page with no fit at all. A vendor that fits a DIFFERENT vertical stays —
   note it in the digest.

Rows whose `site_kind` is `unknown` are normal: the classifier's signals are SaaS signals and many banks
and lenders score `unknown`. You review each on its homepage anyway (you need it for the cells).

## Scope per run — NO CAP

Every qualified vendor not yet on its page is a company that cannot find us. Add every missing row and
build every page that clears the floor (>= 4 verified vendors), in one run. The audit is never sampled.

## Execution

### Phase 0 — Preflight
1. `git status --porcelain` must be clean, else STOP and email `failure`.
2. `.claude/scripts/deploy-run-to-main.sh mark` before any commit.
3. `npm ci` (Node 20+). Confirm `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` resolve, else STOP, email `no-op`.
   The TypeScript placement scripts run with `npx -y tsx scripts/placement/<name>.mts`.

### Phase 1 — Supply (already refreshed by the 12:00 UTC radar cron)
The `fleet-placement-radar` cron already ran today's discovery for every category in the live
`/placement-verticals.json`. Do NOT re-run the full `serp_roster_discovery.py` sweep (duplicate spend).
Only categories Phase 1c adds today need their own sweep (`--verticals <id>`).

### Phase 1b — Enrich + classify anything still unchecked (`discover=0`: the cron already discovered)
```bash
curl -fsS -m 300 -H "Authorization: Bearer $PLACEMENT_CRON_SECRET" \
  "https://growth-sites-api.onrender.com/api/placement-radar?site=themodernwallet.com&digest=0&discover=0&limit=200&budget=270"
```
Repeat (max 3 times) while the JSON's `remaining` > 0. A failure here is not a blocker — record it under
`## Blocker` and continue with what is classified.

### Phase 1c — New categories (fleet owner rule 2026-10-11: never limited to the pages we have)
```bash
python3 scripts/placement/category_candidates.py --min-volume 30     # DATAFORSEO_B64 inline
```
It lists (a) vendors earlier runs cut as "fits a different category" and (b) buyer searches that contain
the site's `expansionSeeds` and that no existing category's keywords cover, grouped, by volume. A
candidate becomes a **NEW category** when ALL hold:
- it is a category of companies a reader would sign up with — not one brand, one fund/ETF, an account
  TYPE (Roth IRA, HSA), a tax rule, a place, a nonprofit/government program, or a navigational query;
- no existing category or live roundup already covers it (check `data/placement-verticals.json`
  — synonyms count as covered);
- real demand: the group's combined volume >= 100/month, OR >= 3 vendors were cut into it;
- it is personal or small-business finance and not on the excluded list.
"Covered" means an existing ROUNDUP; a guide or calculator does NOT cover it (the new roundup links to it).
A candidate that passes is added THIS run (max 3, highest demand first): add a vertical with `id`,
`label`, `topic`, `roundupSlug`: null, `keywords` = 4-8 real buyer queries from its candidate group; then
`python3 scripts/placement/serp_roster_discovery.py --verticals <id> --upsert` and re-run the Phase 1b
radar call. Then research and fill it now (Phase 4b, STEP 1). When you cut a vendor because it fits
another category, name it: `"why": "category 4 — fits <category> category"`. Report each under
`## Categories added (N)` in the email; for every candidate with volume >= 100 you reject, name the rule.

### Phase 2 + 3 — Pool + route (ONE command)
```bash
npx -y tsx scripts/placement/roundup_pool.mts       # SUPABASE_* inline
```
Writes `reports/vendor-roundup/pool.json`: per vertical ENRICH / BUILD / ACCRUE and its `missing[]`
vendors. Do not re-derive this by hand. A vertical with `roundupSlug: null` that already has a verified
research file `reports/vendor-roundup/research/<id>.json` with >= 4 vendors routes **BUILD** even if the
pool count is lower (run `add_research_vendors.py <id>` first so the pool sees them).

### Phase 4a — Add rows to existing roundups (ALL missing vendors)
For each ENRICH vertical, read the page's `comparisonTable.headers` (the columns every row must answer),
open every `missing` vendor's homepage and rates/pricing page (WebFetch), then write
`reports/vendor-roundup/rows/<vertical>.json`:
```json
{ "slug": "best-high-yield-savings-accounts",
  "rows": [ { "name": "Bask Bank", "domain": "baskbank.com", "url": "https://www.baskbank.com/",
              "values": ["$0", "$0", "None", "Interest Savings account; FDIC insured through Texas Capital Bank"] } ],
  "cut": [ { "domain": "…", "why": "category 1 — comparison site, no product of its own" } ] }
```
Cell rules: `name` = the company's own brand name (not the SERP title); `url` = its homepage (or the
product page for a single product) on `domain`; each value <= 15 words, a figure or fact from the
vendor's own site, or "Not published" / "N/A"; the last free-text column (Best For, Notable Feature,
Standout Feature…) is ONE plain clause on who it suits or what it actually offers. These are data cells,
written in-context (the `_content-generation.md` exemption), from the vendor's own pages only, and
`_anti-ai-language.md` applies. Never invent a rate, fee, rating or customer count. Then:
```bash
npx -y tsx scripts/placement/apply_vendor_rows.mts <vertical>     # SUPABASE_* inline (marks cuts dead)
```
It appends the rows to `data/roundup-vendors.json` `pages[<slug>].added` (skipping a domain already in the
table) and retires the cuts. Idempotent. **Never edit the rows by hand; never edit the editorial
`comparisonTable.rows` or the ranked `options` to add a discovered vendor.**

### Phase 4b — Build new roundups (verticals that cleared the floor)

**‼️ STEP 1 OF EVERY NEW ROUNDUP — RESEARCH AND FILL IT (owner rule 2026-10-11).** Before any prose:
1. **Research the field**, not just the pool: the category's SERP roster, WebSearch for "best
   <category>", "<category> companies/providers", and the incumbents named on the pages that rank
   (NerdWallet/Bankrate-style lists are LEADS only — never list them), plus every vendor cut into this
   category earlier. Open each candidate's own site (WebFetch): it must offer this, and its facts come
   from its own pages. Apply the exclusions (illegal-only list).
2. **Fill**: target **8+ verified vendors** (minimum 4 — below 4 the category keeps accruing and NO page
   ships). Record every verified vendor in `reports/vendor-roundup/research/<vertical>.json` and run
   `python3 scripts/placement/add_research_vendors.py <vertical>` (SUPABASE_* inline) so each one enters the
   pool and the outreach queue; re-run the Phase 1b radar so their emails are found this run.
3. **Then** write the page around the table — the comparison table is the core of the page. A new page
   never ships with only the Featured placeholder or a thin table.

**STEP 2 — Chart it the mindmap way (owner rule 2026-10-11).** Write
`reports/mindmap-pass/<TODAY>-vendor-roundup-<vertical>.md` — NEVER the bare `<TODAY>.md` — in the exact
chart format `.claude/commands/mindmap-pass/phase-build-brief.md` produces: frontmatter
`mindmap_pass_date: <TODAY>` and `status: ready-for-execution`, ONE `create new content` row (format
`roundup`, the category's head keyword + 2-4 secondary keywords from its vertical, demand per
`_keyword-demand-ladder.md`, slug `best-<category>`, route `/roundup/<slug>/`, the reader question), and
the clusters block `No emerging clusters detected this run.` Run mindmap's duplicate check against the live
sitemap + `ROUNDUPS` first: an existing roundup means ENRICH (Phase 4a), not a new page.

**STEP 3 — Execute the mindmap phases, autonomously** (no Phase 0 manifest gate). Read each file and
follow it; do not paraphrase:
- `.claude/commands/mindmap-pass/phase-3-new-content.md` — the page prose through
  `scripts/lib/content_gen.py`, with the research file + the vendors' own pages as the closed fact list and
  `_roundup-blend.md` (if present) as the format brief. The new page is a `RoundupEntry` object inserted at
  the TOP of the `ROUNDUPS` array in `src/data/roundups.ts` under a `// ── vendor-roundup <TODAY>: <slug> ──`
  comment, modelled on an existing entry (`best-high-yield-savings-accounts`): `updated`, `slug`, `title`,
  `metaDescription`, `targetKeyword`, `category`, `angle`, `h1`, `introText`, `rankingCriteria`, `options`
  (the 4-8 editorial picks, ranked on merit), `comparisonTable` (headers = the 4-6 facts a buyer compares
  in this category; rows = the editorial picks only), `verdict`, `sections`, `faqs`, `sources`,
  `relatedComparisons`/`calculatorLinks` where they fit. Then add every editorial row's domain to
  `data/roundup-vendors.json` `pages[<slug>].domains` (name exactly as in the row), and the remaining
  verified vendors through `reports/vendor-roundup/rows/<vertical>.json` + `apply_vendor_rows.mts`.
  Commit the writer's `.meta.json`.
- `.claude/commands/mindmap-pass/phase-4-audit.md` — adversarial audit of the page AND every table row
  (Phase 6's checks apply too). Max 2 reworks; still failing → the page does not ship (set it
  `draft: true`), the category stays BUILD for tomorrow, and the digest says why.
- `.claude/commands/mindmap-pass/phase-6-internal-linking.md` — link the new roundup from 2-4 related
  guides / calculators / sibling roundups (additive links only).
- `.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md` — the sitemap is generated at build; its
  IndexNow submit happens in this routine's Phase 8, AFTER the page verifies live.
Do NOT run mindmap phase 2 (metadata), 8 or 9: this routine's Phases 7-8 do the one commit, the deploy, the
live 200 + content verification, IndexNow, and Phase 10 the email.

**STEP 4 — Register it:** set the vertical's `roundupSlug` in `data/placement-verticals.json` so the page
renders its vendor table attributes and Phase 9 flags its vendors for outreach.

### Phase 5 — Link policy (BLOCKING)
`node -e "JSON.parse(require('fs').readFileSync('data/roundup-vendors.json'))"` must pass, every `added`
row's `url` must be on its `domain`, and every `domains` key must match an editorial row name on that page
exactly. Never touch `data/paid-placements.json`.

### Phase 6 — Audit (NOT optional)
Run `comparison-content-creator/phase-4-audit.md` on every new page, plus on every row:
- ModernWallet is not a listed option; Killswitch appears only as its ordinary editorial row (ranked on
  merit, no label, never Featured, never called a partner or sponsor).
- No individualized financial advice and no promise of returns, approval or savings in any cell or in our
  voice; variable rates carry "as of <Mon YYYY>".
- Every listed domain offers something lawful a reader could sign up for in this category, and nothing on
  the exclusions list. Do NOT cut a row for being horizontal, small, new, quote-only, or in a legal or
  regulatory dispute.
- Every figure in a cell is on the vendor's own site. A "Not published" cell where the vendor DOES publish
  the figure is a defect too. Every row has one value per header.
Max 2 reworks; a failing row is removed from the rows file (and re-applied) rather than shipped.

### Phase 7 — Stage and verify
```bash
npm run build      # Astro build + entity links + paid-link nofollow pass and --check + bundle gate
```
Must pass. Then confirm every changed roundup's `dist/roundup/<slug>/index.html` contains
`data-vendor-domain="<each domain this run added>"` and exactly ONE `data-vendor-topic`. Commit once:
`vendor-roundup <date>: +N vendors across M pages (+P new pages)`.

### Phase 8 — Push decision (first match wins)
| Condition | Action |
|---|---|
| build or nofollow check failed | no push, email `failure` |
| Phase 6 drafted every new page and no rows survived | no push, email `failure` |
| nothing to enrich and nothing to build | no push, email `no-changes` |
| >= 1 audited change | `.claude/scripts/deploy-run-to-main.sh push` |

PUBLISHING: this site deploys from main; the push to main is the intended deploy.
After the push: wait ~4 min, then for each changed page `curl -s https://www.themodernwallet.com/roundup/<slug>/`
until it returns 200 AND contains `data-vendor-domain="<one domain this run added>"` (poll every 30 s, up
to 10 min). Submit only the verified URLs to IndexNow (key `dc557f6bfced447aa1a71771d8a0d24a`,
`.claude/scripts/indexnow-submit.py`).

### Phase 9 — Flag the outreach lane
For each vertical whose page verified live:
```bash
npx -y tsx scripts/placement/flag_vendors.mts <vertical> --register     # SUPABASE_* inline
```
`--register` first inserts any listed company with no prospect row (editorial rows that discovery never
found) so it gets an email lookup too; then it flags only vendors whose row is in the LIVE HTML. Never flag
by hand, never for a page that is not live, never killswitch.rip. Non-zero exit = list it under `## Blocker`.

### Phase 10 — Email
Write `/tmp/vendor-roundup-auto-<YYYY-MM-DD>.md`. The email script keeps ONLY sections whose heading
names a concrete change and STRIPS markdown tables, so use bullet lists under exactly these headings:
```
## Vendors added (N)
- **<Vendor>** (<domain>) → [/roundup/<slug>/](https://www.themodernwallet.com/roundup/<slug>/) — <one sentence: what it offers>
…EVERY vendor added, grouped by page…

## Pages built (N)
- [/roundup/<slug>/](<url>) — <category>, <N> vendors: <names>

## Vendors cut (N)
- <domain> — category <1-4> — <why>
```
Then `## Categories added (N)`, `## Outreach queue` (vendors flagged today: with an email / without),
`## Verticals accruing`, `## Live verification`, `## Blocker`. No tables. Then:
```bash
python3 .claude/scripts/send-routine-email.py --status success|failure|no-changes \
  --skill vendor-roundup-auto --site themodernwallet.com --repo modernwallet \
  --summary "<N> vendors added across <M> pages (+<P> new pages)" \
  --details-file /tmp/vendor-roundup-auto-<date>.md --commit-sha <sha> --commit-url <url>
```
Best-effort — a mail failure never fails the routine.

## Hard blockers (STOP and report)
- Working tree dirty at Phase 0.
- A vertical's roundup returns non-200 live, or its slug is missing from `ROUNDUPS`.
- `data/roundup-vendors.json` is invalid JSON after the run.
