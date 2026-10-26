<!-- site-audit-autofix-v1 — canonical copy lives in layer3 .claude/commands/_site-audit-autofix.md; synced fleet-wide by scripts/sync-ai-discoverability.py. Edit there, not here. -->
# Site-audit auto-fix policy (used by /ahrefs-site-audit-auto) — NOTHING is flagged for the owner

**USER RULE 2026-10-26:** the owner does not want audit issues flagged to them.
Anything that is safe to fix is fixed in this run. "Safe" means: the fix is made
from facts in the repo or on the live web, and it passes the verification gate in
its row plus the build. A fix that fails its gate is reverted and **retried on the
next run** — it is never turned into a question or a to-do for the owner.

This file **overrides** every "flag for human" / "NO" row in STEP 4's table, the
"Flagged for human" email headings, and the "What this skill MUST NOT do" lines
about canonicals, redirects, robots.txt and body content, to the extent below.

## Fixes for the rows that used to be flagged

| Issue kind | Fix | Verify (revert if it fails) |
|---|---|---|
| `canonical_to_redirect` | Follow the redirect chain of the canonical target (`curl -sIL`). Set the canonical to the **final** URL if it returns 200, is indexable and is on our host. | Canonical URL returns 200 in one request, no redirect. |
| `canonical_to_4xx` | 1) If a repo redirect map / route config maps the dead URL to a new path → canonical = that path. 2) Else, if the page itself is 200, indexable and no other page shares its title + H1 → self-canonical. 3) Else retry next run. | Canonical returns 200; no two pages left canonicalising to each other. |
| `redirect_chain` | Rewrite every internal `href`, sitemap entry and canonical that points at a hop to the **final** URL. If the chain lives in a repo redirect file (`_redirects`, `next.config.*`, `vercel.json`, `render.yaml`, `astro.config.*`, Flask routes), point the first hop straight at the final URL. Rules that live only in a hosting dashboard: the internal-link rewrite still ships. | `curl -sIL` on each changed source: one hop to a 200. |
| `redirect_loop` | Find the rules forming the loop in the repo's redirect config. If one URL in the loop is a real page in the build, delete the rule that redirects **away** from it. | The URL returns 200; build output still contains the page. |
| `lang_missing` | Add `lang` to `<html>` in the root layout, using the site's content language (config / content locale; `en` for English-only sites). | Every built page has `<html lang=…>`. |
| `hreflang_*` | Remove hreflang entries that point at non-200 or non-canonical URLs; add the missing return link when both pages exist; make `x-default` point at a 200 page. | Every hreflang target returns 200 and links back. |
| `broken_external_link` | 1) Old URL redirects → use the final 200 URL. 2) Same page moved on the same domain (find it via that domain's sitemap or site search) → new URL. 3) Else remove the `<a>` and keep the anchor text. Never change the sentence. | New href returns 200, or no link remains. |
| `low_word_count` / `low_text_html_ratio` | Already auto-fixed by `/indexing-pass-auto` (thin-content phase). Note "handled by indexing-pass" in the report; do not edit here. | — |
| Anything else | Fix it if the fix is mechanical and you can verify it (fetch, parse or build proves it). | Same proof, after deploy. |

## Content-quality rows (AI Discoverability lane)

**Mandatory in this run.** A content-quality row (similar AI content, high AI
content level) is done in the same run that pulled it — "needs fact-locking /
an audit" is the procedure below, not a reason to defer. The only allowed
outcomes per page are: rewritten + audited + live, or reverted because its audit
FAILED (name the failing check). Deferring without running the audit is a run
defect. Do the rewrites BEFORE the commit so they ship with the schema fixes.

**YMYL pages are included** (money, property, health, legal, immigration). The
fact-lock below is what makes a YMYL rewrite safe: every figure, rate, threshold,
date, source and legal statement stays byte-identical, and the rewrite only
changes the wording around them. A repo's YMYL / editorial hard rule is a reason
to fact-lock strictly, never a reason to skip.

Rewrites must not drift facts (see the 2026-09 humanize claim-drift incident):

1. **Fact-lock first.** Before editing, list every number, price, date, name,
   quote and claim in the section. The rewrite must keep every item unchanged
   and add none.
2. Rewrite per `.claude/commands/_content-standard.md` and
   `.claude/commands/_anti-ai-language.md` (where the repo has them). Only
   content-archetype pages (guides, comparisons, explainers, roundups) get body
   rewrites. Hubs, home, service, booking and legal pages keep their body copy,
   and so does any page a repo's CLAUDE.md protects.
3. Run the adversarial audit `.claude/commands/seo-gsc-pass/phase-4-audit.md`
   (or the repo's equivalent phase-4-audit) on every rewritten section, then diff
   the fact list. Audit FAIL or any fact changed → revert that section and retry
   next run.

## Email

- **Send the email LAST** — after the push, the deploy check, the live 200
  check and the IndexNow submission have all finished, so every line in it is
  already true. Never send it and then keep working.
- Rename the heading `## Flagged for human (not auto-fixed)` to
  `## Not fixed this run (auto-retried next run)`. Each line: issue, URL, the
  gate that failed or why no repo-side fix exists. Write it as a status line,
  never as a request to the owner.
- Drop the `## Flagged-for-human count` heading. Use `## Not-fixed count` instead.
- Only problems with **no fix in the repo at all** (hosting speed, a CDN/WAF
  rule, a hosting-dashboard-only redirect) go under
  `## Not fixable in code`, with the evidence. That is information, not a task.
