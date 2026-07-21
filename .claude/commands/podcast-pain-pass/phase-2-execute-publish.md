# Phase 2 — EXECUTE + PUBLISH (ModernWallet / Astro)

Input: the auto-approved `reports/podcast-pain-pass/run-$DATE/chart.md`. This phase writes real pages into ModernWallet's data-record content system, builds, deploys to `main`, verifies live, and pings IndexNow. It reuses the project's own content engine — **it does not invent a new one.**

## ‼️ BUILD THROUGHPUT + INCREMENTAL BACKLOG (BUILD_CAP = 15) — no approved page is ever stranded
1. **Incremental backlog checkpoint (the real safety net):** at the START of Phase 2, write EVERY approved row (deferred-backlog rows first, then newly-mined by descending SEMRUSH volume) into `reports/podcast-pain-pass/ledger.json` under `deferred_rows`. Build, then **after each page is built + pushed + 200-verified, remove it from `deferred_rows`.** If the session ends for ANY reason part-way, `deferred_rows` holds exactly the unbuilt remainder — Phase 1 drains it FIRST next run.
2. **Soft cap (BUILD_CAP = 15):** attempt up to 15 pages this run. Approved rows beyond 15 stay in `deferred_rows` for next run. Throughput ceiling, not a content cap. The 30-survivor circuit-breaker still guards the TOTAL approved count.

## Where each format lands (ModernWallet data records — append-only)
Insert each new record as a new object literal at the END of the matching array, **before the closing `];`**, matching the existing record shape exactly. **NEVER touch the `*-business.ts` files** (`guides-business.ts` / `comparisons-business.ts` / `roundups-business.ts` are the separate B2B compliance vertical). **NEVER regenerate or delete an existing record** — net-new routes only.

| Chart `format` | File + interface | Route |
|---|---|---|
| `guide` (article) | `src/data/guides.ts` → `Guide` (`GUIDES` array) | `/guides/<slug>/` |
| `comparison` | `src/data/comparisons.ts` → `ComparisonEntry` (`COMPARISONS` array) | `/compare/<slug>/` |
| `roundup` | `src/data/roundups.ts` → `RoundupEntry` (`ROUNDUPS` array) | `/roundup/<slug>/` |
| `calculator-spec` | `reports/podcast-pain-pass/specs/<slug>-spec.md` (NOT a page) | — (human builds the tool later) |

## Content standard — follow `CONTENT.md` verbatim (guided-write → adversarial-audit)
For every `guide`/`comparison`/`roundup` row:

| Step | Do | Reference |
|---|---|---|
| Write | One content-writer subagent per page (general-purpose + WebSearch/WebFetch). Research CURRENT facts from PRIMARY sources only (CFPB, Fed/FRED, IRS, FTC, SEC, Experian, BLS — verify every URL loads). SEO: primary keyword in title (≤60 chars), H1, first intro sentence, ≥1 FAQ. Meta description ≤160. AEO: first sentence of each section is a self-contained declarative answer; FAQ answers lead with the answer. ≥1 information-gain insight. Readability ~7th–8th grade, sentences <20 words. Internal links: up to the resolved hub, across to sibling spokes/calculators, with `[text](/path/)` markdown inside content strings. Populate `sources` with 1–3 verified primary sources. Parallelize writers; **append each returned record serially yourself** (the data files are append-only — concurrent writes collide). | `CONTENT.md`; for `comparison`/`roundup` you MAY reuse `.claude/commands/comparison-content-creator/phase-3-generate.md` + `phase-3b`/objectivity rules. |
| Objectivity | Comparison + roundup pages are NEUTRAL. **ModernWallet is NEVER a ranked option** (it is a calculator/education site, not a product in the field). Every ranked option must be real; never fabricate prices/rates (cite the vendor/regulator or label `pricing not public`); the ranking criteria are stated up front and applied consistently; no self-promotion section. | inline |
| Byline / dates | YMYL author byline is `[[Jonathan Velez]]`, rendered by the template (`Byline.astro` + `jsonld.ts`) from the record/site date fields — **never write a "reviewed by" / "updated on" / author line into any body prose field** (intro/sections/verdict/FAQ). Set structured date fields only. | `CONTENT.md`, `src/data/site.ts` |
| Audit | Adversarial review by an Explore subagent that did NOT write the page, against the BUILT HTML in `dist/<route>/index.html` per `CONTENT.md` HARD checks (title/desc length + keyword; valid JSON-LD incl. `Person`/`FAQPage` matching visible `<h3>`s; visible byline; internal links resolve; **every number matches the calculator engine ground truth** — compute figures via `src/lib/*`, never invent). Fix all findings. Max 2 rework attempts. | `CONTENT.md`, `.claude/commands/comparison-content-creator/phase-4-audit.md` |
| Audit-fail handling | `comparison`/`roundup` support `draft?: boolean` → set `draft: true` (ships noindex, auto-excluded from sitemap). `Guide` has NO draft field → **DROP the record** (remove the appended object) rather than ship a known-bad guide. | interfaces in the data files |
| Build gate | `npm run build` (Astro) must exit 0 — a single malformed record breaks the whole static export, so never skip the full build. (`npx astro check` for TS if available.) | — |
| Sitemap | **DO NOTHING MANUAL.** The sitemap is generated by `@astrojs/sitemap` at build from the live routes — a non-draft record is included automatically; a `draft: true` record is excluded. Never hand-edit sitemap XML (there is none to edit). | `astro.config.mjs` |
| Inbound links | Add a backlink FROM the resolved hub + the most relevant existing sibling pages TO each new page (additive, idempotent — skip if the link already exists). Never regenerate the target page; insert only the link. Bump the edited page's `updated`/`LAST_UPDATED` date the template renders, in the same change. | `CONTENT.md` date-bump rule |
| Push | Commit on the current ephemeral `claude/*` branch, then deploy to `main`: `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (retry the rebase up to 3×). On an unresolved conflict, push the ephemeral branch as-is and email a manual-merge note — **never force-push `main`, never open a PR, never `git checkout main`.** | orchestrator Git-model block |
| Verify | Wait ~3 min for the deploy, then curl every created URL on `https://www.themodernwallet.com`. **Any non-200 →** set that record `draft: true` (or drop it, for a guide), rebuild, re-push, and include a `## Live verification` section in the email listing every URL + status. All 200 → proceed. | fleet live-verify standard |
| IndexNow | POST ONLY the live (200-verified) URLs to `https://api.indexnow.org/indexnow` with key `dc557f6bfced447aa1a71771d8a0d24a` (key file `public/dc557f6bfced447aa1a71771d8a0d24a.txt` already present). Non-blocking: an IndexNow error is noted in the email, never fails the run. | orchestrator IndexNow block |

## After push + verify
1. Append every shipped slug to `reports/podcast-pain-pass/ledger.json` `shipped_slugs`, remove each built row from `deferred_rows`, and commit the ledger (so next week's dedup treats them as covered).
2. Send the `success` email via `.claude/scripts/send-routine-email.py --skill podcast-pain-pass-auto --site "https://www.themodernwallet.com"` with a details file.

   **‼️ The details file MUST list every new page — this is non-negotiable.** The helper's `clean_details` strips analytics/roster/table noise and keeps only "what changed" sections, so the new-page list must be under a surviving heading (`## New pages shipped`) with this EXACT shape — one `[Title](FULL-URL)` bullet per page, using the **full absolute URL** you just 200-verified (a markdown link's target is NOT host-resolved, so a bare `/route` renders as a broken relative link — always paste the complete `https://…` URL):

   ```markdown
   ## New pages shipped
   - [Example Guide Title](https://www.themodernwallet.com/guides/example-guide)
   - [Another Page Title](https://www.themodernwallet.com/compare/x-vs-y)
   ```

   - **List ALL of them** — one bullet per page shipped this run, never a truncated subset, never a count-only line ("1 new page"). If 15 shipped, all 15 bullets appear.
   - If the run also updated existing page bodies, add a `## Updated pages` section (this heading survives — `## Body updates` does NOT) with the same `[Title](FULL-URL)` bullets.
   - Any URL that failed 200 goes in an `⚠️ Not live` list. Deduped/skipped terms and the commit SHA are optional trailing context that may be filtered — the new-page list is what must always render.
