---
source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated
interpreted_brief: >
  This week's 38 episodes (7 finance podcasts, transcript-mined) skew heavily toward two
  anxieties: "how much can I actually spend" across retirement, budgeting, and portfolio
  withdrawals, and "am I doing this the right way" — Social Security timing, mortgage payoff
  vs. investing, pension math, and net-worth/probate mechanics.
status: ready-for-execution
semrush_note: SEMRUSH_API_KEY present but account balance is $0 (API UNITS BALANCE IS ZERO,
  HTTP 403 confirmed via direct curl test). Ahrefs key also absent. Ladder degraded to
  public-source (Google Autocomplete) volume estimates per _keyword-demand-ladder.md — every
  volume figure below is an ESTIMATED BAND, not a measured SEMRUSH/Ahrefs number, and is
  labeled accordingly. Run was NOT blocked (estimate rung is a valid non-dry outcome).
---

# Podcast Pain Pass — Chart — 2026-08-21

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable |
|---|---|---|---|---|---|---|
| **Lens 2 (adjacent-demand):** "index funds vs etf" cluster — repeated autocomplete completion "index funds vs etf for roth ira" (est. 75/mo, autocomplete-exact-match evidence). The existing `/compare/index-fund-vs-etf/` page only dismisses the Roth angle in one line ("tax-efficiency edge mostly disappears inside a 401(k) or IRA") with no substantive treatment of which wrapper to actually pick, trading behavior, or dividend-reinvestment inside a Roth IRA. Podcast pain hook: Ready For Retirement / How to Money listeners repeatedly frame "how much can I spend / how should this be invested" around tax-advantaged accounts. | Add a new section to the existing comparison page answering the Roth-IRA-specific angle: since tax-efficiency is moot inside a Roth, what actually matters (fractional-share trading, auto-reinvestment, minimums, expense-ratio parity) and a plain "pick either, here's when one edges out the other" verdict. | update existing body text | `src/data/comparisons.ts` → `index-fund-vs-etf` entry (renders at `/compare/index-fund-vs-etf/`) | comparison enrichment (new FAQ + body section) | text | text |
| **Lens 1 (direct intent):** "how to start investing" (est. 50–500/mo, scored 275, autocomplete evidence) — a beginner step-by-step narrative is missing. Existing content only covers investing a specific lump sum (`$100k`/`$200k` guides) or app listicles (`best-investment-apps-for-beginners`), not "I have never invested, what do I do first." Podcast pain hook: How to Money's "Achieving Financial Independence as a Late Starter" and Catching Up to FI's teen-investor episodes both open with total beginners asking where to start. | New beginner guide: open a brokerage/retirement account → pick a low-cost index fund → automate contributions → avoid common first-year mistakes. Links to the site's existing index-fund-vs-etf, Roth-vs-Traditional, and portfolio-rebalancing content rather than re-explaining them. | create new content | `/guides/how-to-start-investing/` | article/guide | text | text |
| **Lens 1 (direct intent):** "tax deductions checklist" (est. 50–500/mo, scored 275, autocomplete evidence) — no consolidated list exists; deductions are mentioned one at a time inside unrelated guides (mortgage-interest in one guide, retirement-account deductions in a roundup). Podcast pain hook: Suze Orman and Catching Up to FI episodes on year-end tax moves and "why am I paying so much tax" prompted the seed. | New checklist-format guide covering the common individual tax deductions (standard vs. itemized, mortgage interest, retirement contributions, HSA, student loan interest, charitable giving) grounded in current-year IRS figures, sourced to IRS.gov — YMYL guardrail: cite the primary source for every dollar figure, drop any figure that can't be sourced this way. | create new content | `/guides/tax-deductions-checklist/` | checklist/article | text | text |

## Emerging search patterns (clusters)

- **"index funds vs etf ___ roth ira"** — a repeated Lens-2 autocomplete completion under the broad "index funds vs etf" seed, distinct from the base comparison (which the site already owns) because it asks which wrapper to pick once the tax-efficiency argument is neutralized by the account type. Actioned above as an enrichment row.

No other actionable clusters detected this run — the Lens-2 mining on the remaining 8 top seeds (50/30/20 rule, coast fire calculator, mortgage payoff calculator, dividend investing strategy, emergency fund amount, how does probate work, roth vs traditional ira, trust vs will) surfaced only gross/net-tax, 401(k)-inclusion, extra-payment, and jurisdiction-variant completions that are already substantively answered on the site (see exclusions below) — none rose to a genuinely under-served cluster.

## Exclusions (dedup verdicts — DROP)

Two independent read-only Explore subagents (not involved in building this chart) checked all 20 Lens-1 + Lens-2 candidate angles against the live site (`src/data/*.ts`) and `ledger.json` `shipped_slugs`. 17 of 20 were DROP — same core intent already substantively covered:

- **50/30/20 rule** — gross-vs-net (`spokes-budget.ts:19,23`) and 401(k)-inclusion (`spokes-budget.ts:35` FAQ) both already answered.
- **Coast FIRE calculator** — live at `/coast-fire/` (`guides.ts:1726`, `registry.ts` LIVE_IDS, `calculators.ts:734`).
- **Mortgage payoff calculator / extra payments** — `spokes-mortgage.ts` already ships a dedicated extra-payment-calculator with an "how much can extra payments save me?" FAQ.
- **Roth vs Traditional IRA contribution/income limits** — `comparisons.ts:2801-2848` states current 2025/2026 limits and income phase-outs.
- **Trust vs Will cost** — `comparisons.ts:1247-1264` has an explicit online-cost vs attorney-cost comparison row.
- **Emergency fund ideal amount** — `guides.ts:2495-2518` and `spokes-net-worth.ts:121` both give the 3–6 month (6–12 for self-employed) figure.
- **How does probate work** — `spokes-probate.ts` / `guides.ts:577-644` is a full general probate-process explainer.
- **Dividend investing strategy** — `guides.ts:3877-3902` (`how-to-build-a-dividend-portfolio`) is a strategy explainer, same core intent as the mined seed.
- **When to take Social Security** — `spokes-retirement.ts:753-802` (claiming-age calculator) covers 62 vs FRA vs 70 and break-even age.
- **How to calculate net worth / average net worth by age / net worth milestones** — `spokes-net-worth.ts:11-12, 53-84, 312-362` cover the formula, SCF-benchmark-by-age table, and the $500k/$1M milestone framing.
- **Rental property ROI** — `spokes-real-estate.ts:93-126, 173-206` (cap-rate + full ROI calculator with cash flow, appreciation, loan paydown, tax benefits).
- **Should I refinance** — `spokes-mortgage.ts:417-476` refinance-calculator with a break-even FAQ.
- **Closing costs explained** — `spokes-mortgage.ts:758-785` closing-cost-calculator.
- **Estate planning basics** — `guides.ts:490-503` (`first-time-estate-planning`).
- **How to make a budget / debt payoff strategy / portfolio rebalancing** — exact or near-exact matches already in `ledger.json` `shipped_slugs` (`debt-snowball-vs-avalanche`, `pay-off-debt-or-invest`, `portfolio-rebalancing`) or covered by the existing budget hub.

Entities named in this week's episodes (Coast FI, HELOC, Dave Ramsey method, Trump Accounts, Roth/Traditional IRA) were all confirmed already covered by existing guides/comparisons/spokes on Lens-3 spot checks — no new vs/alternatives/pricing page warranted this run. The CFP-exam and "16-year-old passed the CFP exam" episode angle is a human-interest story, not a search-demand entity fit for this site's niche, and was excluded from Lens 3 mining.

## Deferred backlog
`ledger.json` `deferred_rows` was empty at the start of this run — nothing to drain.
