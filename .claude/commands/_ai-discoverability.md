<!-- ai-discoverability-v1 — canonical copy lives in layer3 .claude/commands/_ai-discoverability.md; synced fleet-wide by scripts/sync-ai-discoverability.py. Edit there, not here. -->
# AI Discoverability lane — Ahrefs Site Audit (used by /ahrefs-site-audit-auto)

Ahrefs Site Audit has an **AI Discoverability** category (Beta, 2026-10): checks
for whether AI search crawlers (ChatGPT / OAI-SearchBot, Perplexity, Claude,
Gemini) can reach, read and classify our pages. Every fleet site lives on AI
citations, so these issues are **fixed, not just reported**.

## 1. Get the data (Ahrefs rung only)

1. `site-audit-issues` (already called in STEP 3) returns these rows with
   `"category": "AI Discoverability"`. Keep every row with `crawled > 0`.
   Rows carry a human **`name`** and an **`issue_id`** — not a slug. Key the fix
   table below on `name`.
2. For each such row, pull the affected URLs:
   `site-audit-page-explorer` with `project_id`, `issue_id=<the row's issue_id>`,
   `select=url,http_code,jsonld_schema_types`, `limit=1000`.
   Read `doc` for `site-audit-page-explorer` once per session first. One call per
   issue (~50 units each), so a site with 3 live AI issues costs ~150 units.
3. Also pick up the Content-category row **"Pages have high AI content levels"**
   the same way (it goes to the flag list, see table).

**DataForSEO rung:** these checks did not run. List them under
`unavailable_on_this_source` and say so in the email. **Never report them as
clean.** Exception — two are cheap to check yourself, so do it: fetch
`<BASE_URL>/robots.txt` and test the AI search bots in §3 row "blocked from …
AI search bots"; and grep the homepage's JSON-LD for a complete `Organization`.

## 2. Verify before you fix — Ahrefs misclassifies page types

Ahrefs guesses page type. On 2026-10-26 it flagged five Colombia Desk **hub**
pages (`/buying/`, `/visas/` …) as "Article page missing Article schema"; they
were collection pages that already carried `ItemList`. So for every URL:

- Open the page source (template + data) and decide what the page **actually** is:
  article/guide, hub/category listing, FAQ, product, tool, homepage.
- Fix to the **true** type, not Ahrefs' guess. A hub never gets `Article`.
- Fix at the **template/layout layer** whenever the URL belongs to a page family
  (every guide uses one layout): one edit fixes every page of that kind, including
  ones Ahrefs has not crawled yet. Only spot-edit a page that is truly one-off.
- Only emit schema for facts **visible on the page or in the repo's data**. Never
  invent ratings, reviews, prices, sameAs profiles, authors or dates.

## 3. Fix table

| Ahrefs issue `name` | Fix? | How |
|---|---|---|
| Article page missing Article schema | YES | **True article/guide:** add `Article` (or `BlogPosting` for blog posts) JSON-LD in the article layout: `headline` (= H1), `description` (= meta description), `author` (the site's author per fleet author rules — Jonathan West unless the site has its own named author), `publisher` (→ the site `Organization`), `datePublished` / `dateModified` from the page's real data fields, `mainEntityOfPage` (canonical URL), `image` if the page has one. **Hub/listing misread as article:** add `CollectionPage` with `mainEntity` = the page's existing `ItemList` (or `WebPage` if no list) — that is the type signal Ahrefs and AI crawlers are missing. |
| Organization schema missing or incomplete | YES | One `Organization` block in the site-wide layout (or homepage): `name`, `url` (canonical origin), `logo` (absolute URL of a real logo/favicon file that returns 200), `description`. Add `sameAs` ONLY for profiles already linked from the site or listed in repo config. Every `publisher` / `author.worksFor` should reference it by `@id` (`<origin>/#organization`). |
| Category page missing ItemList schema | YES | `ItemList` of the links the page actually lists (`position`, `url`, `name`), wrapped in `CollectionPage`. Generate from the same data the page renders, never a hand list. |
| FAQ page missing FAQPage schema | YES | `FAQPage` built from the Q&A pairs visibly on the page (same data source as the rendered FAQ). Never add questions that are not on the page. |
| Product page missing Product schema | YES if the repo holds real product data (name, price, availability) | `Product` + `Offer` from that data. No `aggregateRating` / `review` unless real reviews are on the page. No product data → flag. |
| Changed pages not submitted to IndexNow | YES | Write the page-explorer URLs that return `http_code` 200 to `reports/site-audit/<TODAY>.indexnow.txt` (one per line, canonical host) and run `python3 .claude/scripts/indexnow-submit.py --urls-file reports/site-audit/<TODAY>.indexnow.txt`. Put the `INDEXNOW` summary line in the email. If the count is large (>50), also note in the email which routine publishes without pinging IndexNow, if you can tell from git log — that is the root cause. |
| Indexable page blocked from some AI search bots / Indexable page blocked from all AI search bots | YES — robots.txt only, AI **search** bots only | Find the rule that blocks them (robots.txt file or the generator that writes it). Make sure these user-agents are allowed on indexable pages: `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`, `Googlebot`, `Bingbot`. Change nothing about training bots (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot` …) and keep every existing `Disallow` for private paths. If the block is not in robots.txt (WAF / Cloudflare bot rules / host firewall) → flag for human with the evidence. |
| Inconsistent AI training bot policy | NO — flag for human | Training-bot policy is a business decision. Report which bots are allowed vs blocked. |
| Main content requires JavaScript rendering | NO — flag for human | Architecture change (SSR/SSG). Name the route and the component that renders client-side. |
| Page size exceeds 2 MB crawl limit | NO — flag for human | Usually an inlined data blob or bundle; name the page and the biggest asset. |
| Slow server response for AI crawlers | NO — flag for human | Hosting/infra. Include the URLs. |
| Similar AI-generated content | NO — flag for human | Consolidation is a content decision; list the URL groups. |
| Pages have high AI content levels (Content category) | NO — flag for human | List the URLs; they are candidates for the next humanize / page-quality pass. |
| Any other AI Discoverability row Ahrefs adds later | flag for human | Name it so this table can be extended. |

## 4. Gates (in addition to the skill's build/typecheck)

- **JSON-LD must parse.** After the build, extract every
  `<script type="application/ld+json">` from each changed page's built HTML
  (or the live page after deploy) and `json.loads` it. Any failure → revert that
  change and flag it.
- **No duplicate types.** A page must not end up with two `Organization` or two
  `Article` blocks — if the layout already emits one, complete it instead of
  adding a second.
- **robots.txt diff check.** If you touched robots.txt, the diff may only add or
  widen `Allow` lines for the AI search bots above. Any other line changed →
  revert and flag.
- After deploy, 200-verify the changed URLs, then IndexNow them with the same
  script (the schema fixes count as changed pages).

## 5. Email

Add one section to the run's details file:

```markdown
## AI Discoverability (Ahrefs)
- <issue name> — <N> URLs — fixed via <file/layout> | flagged (<why>)
- IndexNow: <INDEXNOW summary line>
```

On the DataForSEO rung write `AI Discoverability: not checked (Ahrefs <reason>)`
plus the results of the two self-checks.
