# Phase 4 — independent audit (tool-usage pass 2026-10-14)

Auditor: independent read-only subagent that did not write any of the work. Round 1 report verbatim below, then the round 2 re-audit of the fixed rows.

---

## Round 1

# Phase 4 independent audit: tool-usage mindmap-pass, 2026-10-14 (themodernwallet.com)

**Result: FAIL.** Five of the 15 rows fail. Every failure has fix-in-place text below, and none needs a page rewrite.
- **Row 14:** one factual error in the prose. The engine itself is correct.
- **Rows 5 and 10:** one missing date bump in a file the run did not list.
- **Rows 13–15:** missing records on the chart, and some sentence-level problems under the content and anti-AI gates.

## How the audit was done
- I read `git diff --cached`, the phase-4 file, the AUDITOR sections of the content-standard and anti-AI files, `_experience.md`, the chart (rows 1–15, columns 10–12), the routine's guardrails, the three prompts and fact lists, the draft meta files, `rung0-repairs.txt` and the persona files.
- I recomputed every worked example in Node from the engine formulas. They all match:
  - Rows 1–6: $1,563.49; $1,639.33; 213 months and $99,233 saved; $3,531.32; $6,950.58; +$18,000 / −$38,000.
  - HYSA vs CD: $1,000 / $1,062.50; $937.42 / $125.08; tie rate 4.5006%; $25,525.72 − $260.59 = $25,265.14; HYSA $25,495.10.
  - Trump vs 529: $89,656.74 / $5,574.81 / $84,081.94 vs $86,144.21; non-college $79,436.26 vs $76,696.48; $182,979.63 / $215,360.51; $43,072.10.
  - Recast: $1,639.33 → $1,432.69; $34,471.26 saved; prepay 228 months and $109,002.12 saved.
- The shipped prose matches the drafts plus the six logged Rung-0 repairs.
- **Self-serving-neutrality grep** on the three new entries: 0 hits.
- **Em-dashes in the new prose:** 0. The two found are in TS code comments.
- **Entity auto-linker** (`data/entity-links.json`, applied by `scripts/entity_links.mjs`) holds no government bodies, so FDIC, FHA and VA need hand links. They are hand-linked in howItWorks, and the FAQs render after howItWorks. No other organisation is named.
- **Render order** in `src/pages/[category]/index.astro`: intro, then the `data-tool={calc.id}` section (line 123), then howItWorks, then FAQs. All three intros answer the reader question above the tool.
- **Ledger:** staged `via:"load-script"` entries exist for tool-usage-mindmap-auto, 2026-10-14, phases 3, 4 and 5. They carry cs=7a486edc, aa=ed445917, exp=31d70e56, which match my recomputed shasums. PASS.

## Row verdicts

Row 1 (AutoLoanCalculator.tsx APR field, /mortgage/payoff-calculator/ + /auto-loan/amortization-schedule/): PASS

Row 2 (AutoLoanCalculator.tsx "I already have this mortgage" mode, /mortgage/payoff-calculator/): PASS

Row 3 (RetirementCalculator.tsx today's-dollars line, /retirement/social-security-retirement-calculator/): PASS

Row 4 (InvestmentCalculator.tsx federal bracket line, /investing/high-yield-savings-calculator/): PASS

Row 5 (MileageDeductionCalculator.tsx who-qualifies note, /mileage-deduction/irs-mileage-rate-2026/): FAIL — stale date on a page whose render changed. The new note and picks render on every page that mounts `MileageDeductionCalculator`, including the `/mileage-deduction/` hub. That hub is defined in `src/data/se-hubs.ts` (MILEAGE_DEDUCTION_HUB), not in calculators.ts, and the run did not bump it. `src/data/se-hubs.ts` line 106: `updated: "2026-09-05",` → `updated: "2026-10-14",`

Row 6 (PortfolioCalculator.tsx 60/40 gap line, /portfolio/60-40-portfolio-calculator/): PASS

Row 7 (AutoLoanCalculator.tsx mortgage picks, /mortgage/payoff-calculator/): PASS

Row 8 (RetirementCalculator.tsx picks): PASS

Row 9 (InvestmentCalculator.tsx picks): PASS

Row 10 (MileageDeductionCalculator.tsx picks): FAIL — same stale hub date as Row 5. The picks also render on `/mileage-deduction/`. `src/data/se-hubs.ts` line 106: `updated: "2026-09-05",` → `updated: "2026-10-14",` (one edit clears both rows).

Row 11 (PortfolioCalculator.tsx picks): PASS

Row 12 (TrumpAccountCalculator.tsx picks, /trump-account/): PASS

Row 13 (/hysa-vs-cd-calculator/): FAIL
- Overloaded sentence (howItWorks ¶1): "APY already includes compounding, so the deposit grows by (1 + APY) each year, and the tool applies that monthly as (1 + APY)^(1/12)." → "APY already includes compounding, so the deposit grows by (1 + APY) each year. The calculator applies that monthly as (1 + APY)^(1/12)." This also clears the coy "the tool".
- Overloaded sentence (howItWorks ¶2): "A CD rate stays fixed for the term, but a HYSA rate can change at any time, so the calculator takes an optional later HYSA APY and the month it starts." → "A CD rate stays fixed for the term, but a HYSA rate can change at any time. The calculator takes an optional later HYSA APY and the month it starts."
- Overloaded sentence (howItWorks ¶3): "An early-withdrawal penalty is a number of months of interest at the CD rate on the deposit, and each bank sets its own, so copy the figure from the CD's terms." → "An early-withdrawal penalty is a number of months of interest at the CD rate on the deposit. Each bank sets its own penalty, so copy the figure from the CD's terms."
- Semicolon splice (howItWorks ¶4): "A CD fits money with a fixed date that you will not touch until it matures; see the [CD calculator](/cd-calculator/)." → "A CD fits money with a fixed date that you will not touch until it matures. The [CD calculator](/cd-calculator/) projects one CD on its own."
- No tee-up and no `teeup-exempt:` record (GATE Tee-up). Append the record line given under Row 15.

Row 14 (/trump-account-vs-529-calculator/): FAIL
- **Factual error (YMYL).** The prose credits the Trump Account's non-college edge to family contributions coming out untaxed. A non-qualified 529 withdrawal also returns contributions untaxed and taxes only the earnings plus 10%. The whole edge is the $1,000 seed. I confirmed this numerically: without the seed, both accounts leave exactly $76,696.48. Most children old enough to use this tool were born before 2025 and get no seed. The engine (`src/lib/trump-vs-529.ts`) is correct: contributions are basis; seed plus growth are taxed as ordinary income; the 10% is waived for college use under §72(t)(2)(E); 529 college use is tax-free and non-qualified earnings are taxed plus 10%.
  - howItWorks ¶2: "When the money is cashed out at 18 for something other than college, the Trump Account comes out ahead. Its family contributions come out untaxed, so only the seed and the growth are taxed: $5,574.81 of income tax plus $4,645.67 of additional tax." → "When the money is cashed out at 18 for something other than college, the Trump Account comes out ahead in the example. The difference comes from the $1,000 seed. Both accounts return family contributions untaxed and tax the growth at your rate plus a 10% additional tax. Only the Trump Account also holds the seed and the seed's growth. The Trump Account owes $5,574.81 of income tax plus $4,645.67 of additional tax."
  - Same paragraph: "That leaves $79,436.26 in the Trump Account and $76,696.48 in the 529, a gap of $2,739.78." → "That leaves $79,436.26 in the Trump Account and $76,696.48 in the 529, a gap of $2,739.78. Without the seed, and at $5,000 a year or less, both accounts leave the same amount for a non-college use."
  - FAQ 3: "Its family contributions come out untaxed, while the 529 taxes its earnings plus a 10% additional tax on those earnings." → "The $1,000 seed makes the difference, because both accounts return family contributions untaxed and tax the growth plus a 10% additional tax."
  - The first of these edits also breaks the rhythm-gate failure: howItWorks sentences 1–10 (16 to 26 words) all sit in the long band.
- Overloaded sentence (howItWorks ¶5, 37 words; also uses "the tool"): "State tax breaks on 529 contributions and financial aid are left out, and the tool cashes both accounts out at 18, while a Trump Account can stay invested after 18 under traditional individual retirement account (IRA) rules." → "State tax breaks on 529 contributions and financial aid are left out. The calculator cashes both accounts out at 18, while a Trump Account can stay invested after 18 under traditional individual retirement account (IRA) rules."
- Semicolon splice (howItWorks ¶4): "To project one account on its own, use the [Trump Account calculator](/trump-account/) or the [529 savings calculator](/529-savings-calculator/); if the money is for college only, the 529 savings calculator is the simpler tool." → "To project one account on its own, use the [Trump Account calculator](/trump-account/) or the [529 savings calculator](/529-savings-calculator/). If the money is for college only, the 529 savings calculator is the simpler one to use."
- No tee-up and no `teeup-exempt:` record. Append the record line given under Row 15.

Row 15 (/mortgage-recast-calculator/): FAIL
- Rhythm gate: howItWorks sentences of 22/22/20/19/22 words (five in a row within 3 words). "Your servicer sets the recast fee and the minimum lump sum, and it decides whether a loan can be recast at all." → "Your servicer sets the recast fee and the minimum lump sum. The servicer also decides whether a loan can be recast at all."
- Dead-end problem (FAQ 6 leaves an FHA/VA borrower with nowhere to go): "Many servicers do not recast government-backed loans such as FHA and VA loans. The calculator also assumes a fixed-rate loan." → "Many servicers do not recast government-backed loans such as FHA and VA loans. If your servicer will not recast the loan, you can still put the lump sum toward principal, and the calculator's prepay result shows the interest that saves. The calculator also assumes a fixed-rate loan."
- No tee-up and no `teeup-exempt:` record. Append this line to `reports/mindmap-pass/2026-10-14-tool-usage.md` under the "Walked, no friction" line:

  `Rows 13–15 records: register: operator · medium: interactive tool → interactive tool · page type: calculator hub entry (depth matches sibling calculator entries; article floors n/a) · teeup-exempt: calculator intro renders directly above the tool and _experience.md licenses only general framing, so a "we" line here reads bolted-on (the generator's claim check already removed one as unsupported) · anchor: original figures computed by the tool (HYSA tie rate 4.50%; Trump Account seed-driven gap; recast $34,471.26 vs prepay $109,002.12)`

## What passed on the built tools (rows 13–15)
- **Hand-worked inputs:** three per tool, all matching the code.
- **Edge inputs:** zero or empty deposit, balance, term or months left returns null and shows a prompt. A lump sum at or above the balance is clamped. A zero rate is handled. Huge rates overflow to Infinity, but `fmtUSD`/`fmtPct` print "—", so NaN is never visible.
- **Wiring:** mirrors the existing pattern (CalculatorIsland map, LIVE_IDS, calculators.ts, cross-links). The `data-tool` slug equals the route.
- **Client-side only:** no new dependencies, no API calls.
- **Prose matches the code:** labels, defaults, cap warning and tie-rate box all match.

## What passed on tool fixes and picks (rows 1–12)
- **Guardrails hold:** no input, output or mode was removed (down payment and term are hidden only while the new opt-in checkbox is ticked); no URL, title, meta or H1 changed; no `.astro` file or `data-tool` root touched; no `package.json` change.
- **Date bumps** are present on every page listed in the brief.
- **Link sentences** added to spokes (HYSA, payoff, early-payoff) are clean under the anti-AI rules.
- **ToolPicks:** renders only inside the result panel, below the answer, and changes with the result tier exactly as the chart says; wrapped in `data-tool-picks="<slug>"`; links `https://www.amazon.com/dp/<ASIN>?tag=soulcircle01-20` with `target="_blank"` and `rel="sponsored nofollow noopener noreferrer"` (tag matches `.claude/tool-usage.site.json`); disclosure directly under the picks; no price, rating, stars, stock or deal claims; books only; never inside a buy/sell or diagnosis answer.
- **ASINs:** all 18 appear in the persona tables. No wrong author attribution found.

## Advisory notes (non-blocking)
1. Picks for an existing loan (Row 7): with "I already have this mortgage" ticked and no extra payment, picks fall to the new-purchase tier. Suggested `hasExtra || isExisting`.
2. APR-field dates (Row 1): the APR fix changes typing behaviour on every AutoLoanCalculator page but not rendered content; only the two row targets were bumped. Defensible.
3. Portfolio wording (Row 6): "(the $X in real estate and cash can cover part of a bond shortfall)" shows even when bonds are over target; suggested "(the $X in real estate and cash counts toward the total but sits outside both targets)".
4. Retirement code (Row 3): the today's-dollars line hard-codes `0.04` instead of the engine's `SAFE_WITHDRAWAL_RATE`; "SSA" not spelled out in tool copy.
5. HYSA vs CD engine: tie-rate box appears by default; type comment says null when no change modelled. Align comment or condition.
6. Trump vs 529 seed checkbox can be ticked at any age.
7. Sources: new entries carry no `sources` array.
8. Unresolved limitations: "taxes on interest" (HYSA) and "state tax breaks on 529 contributions" left without a route.
9. Page-type mismatch: prompts record "explainer / spoke" while the draft meta uses a 600-word floor; word counts 873 / 962 / 774; article floors do not apply.
10. Meta titles: colon pattern matches sibling calculator titles. Not failed.
11. Not run: build and ASIN re-resolve (read-only audit). BUILD.ok present.

VERDICT (round 1): FAIL

---

## Fixes applied after round 1
- Rows 5/10: `src/data/se-hubs.ts` MILEAGE_DEDUCTION_HUB `updated: "2026-10-14"`.
- Rows 13–15: findings run through `scripts/lib/content_gen.py fix` (findings files in `reports/mindmap-pass/2026-10-14-tool-usage/audit/`), FDIC/FHA/VA first-mention links re-applied mechanically (rung0-repairs.txt), pages re-templated; "Rows 13–15 records" line added to the chart.
- Advisories applied: 1 (existing-loan picks), 3 (portfolio wording), 5 (comment aligned).
- New chart row 16 (decimal-safe inputs on 15 more calculators) added and the chart gate re-run.

## Round 2

# Phase 4 re-audit (changed items only): tool-usage pass, 2026-10-14

**Result: PASS.** Every fix from the first round is in place, and the three new pages pass every gate on their current text. The row 16 decimal fix passes all five checks in all 15 components.

Row 5 (`src/data/se-hubs.ts` MILEAGE_DEDUCTION_HUB, the `/mileage-deduction/` hub): PASS. The date is now `updated: "2026-10-14"`.

Row 6 (advisory only, PortfolioCalculator.tsx): PASS. The note now reads "(the $X in real estate and cash counts toward the total but sits outside both targets)". The gap math is unchanged.

Row 7 (advisory only, AutoLoanCalculator.tsx): PASS. Both `heading` and `picks` use `hasExtra || isExisting`, so an existing-mortgage reader sees the payoff books; the new-purchase tier is unchanged.

Row 10 (`/mileage-deduction/` hub date): PASS. The Row 5 edit clears it.

Row 13 (/hysa-vs-cd-calculator/): PASS — all four sentence fixes in; FDIC first-mention link restored and listed in allowed-urls.txt; no em-dashes, semicolons, banned words or "the tool"; no failing rhythm runs; 874 words; the chart's "Rows 13–15 records" line clears the tee-up and anchor gates.

Row 14 (/trump-account-vs-529-calculator/): PASS — the non-college reasoning now puts the whole difference on the $1,000 seed in howItWorks and FAQ 3, matching the engine and the new fact-list line (both accounts leave $76,696.48 without the seed); the 37-word and semicolon sentences are split; "the tool" gone; the 10-long-sentence run is broken. One leftover 5-sentence run (14/12/11/12/13) crosses from FAQ 4 into FAQ 5, which render as separate collapsed items — advisory, same treatment as round 1. 1,014 words.

Row 15 (/mortgage-recast-calculator/): PASS — servicer sentence split, rhythm clear; FAQ 6 now routes the reader to the prepay result; FHA and VA first-mention links restored; 802 words.

Row 16 (useDraft decimal fix in 15 components): PASS
1. Only input value/onChange/onBlur (+ placeholder "0") changed; no label, input or math changed.
2. Old parsers (strip non-digits, floor at 0) match useDraft; on malformed text like "1.2.3" the old inline versions could produce NaN while useDraft returns 1.2 — an improvement.
3. Money fields (IUL, S-Corp) keep the toLocaleString formatter.
4. Merchant cash advance 0 to 3 clamp kept: `set({ factorRate: Math.min(3, Math.max(0, v)) })`.
5. Rules of hooks hold: every useDraft is top-level in its component; none conditional or in a loop.

Date bumps for row 16: agree with not bumping — rendered content unchanged, only typing behaviour; bumping would be date churn.

## Advisory (non-blocking)
- AutoRefinance `PctInput` still declares an unused `num` prop in its type; harmless.
- Merchant cash advance: typing "3.5" shows 3.5 until blur while the value used is already clamped to 3; after blur it shows 3.
- Percent fields that showed "0" now show empty with a "0" placeholder.
- Three 28 to 32-word sentences remain on the new pages; each is one spoken thought, pass as in round 1.
- Rows 1–4, 8, 9, 11, 12 not re-audited per the remediation ladder; build not run (read-only audit).

VERDICT: PASS

## Row index — chart target → final verdict (from the two rounds above)

| Row | Target (exact chart text) | Format | Final verdict |
|---|---|---|---|
| 1 | src/components/AutoLoanCalculator.tsx (/mortgage/payoff-calculator/, /auto-loan/amortization-schedule/) | tool fix | PASS (round 1) |
| 2 | src/components/AutoLoanCalculator.tsx (/mortgage/payoff-calculator/) | tool fix | PASS (round 1) |
| 3 | src/components/RetirementCalculator.tsx (/retirement/social-security-retirement-calculator/) | tool fix | PASS (round 1) |
| 4 | src/components/InvestmentCalculator.tsx (/investing/high-yield-savings-calculator/) | tool fix | PASS (round 1) |
| 5 | src/components/MileageDeductionCalculator.tsx (/mileage-deduction/irs-mileage-rate-2026/) | tool fix | FAIL round 1 → PASS round 2 |
| 6 | src/components/PortfolioCalculator.tsx (/portfolio/60-40-portfolio-calculator/) | tool fix | PASS (round 1) |
| 7 | src/components/AutoLoanCalculator.tsx (/mortgage/payoff-calculator/) | tool monetize | PASS (round 1) |
| 8 | src/components/RetirementCalculator.tsx (/retirement/social-security-retirement-calculator/) | tool monetize | PASS (round 1) |
| 9 | src/components/InvestmentCalculator.tsx (/investing/high-yield-savings-calculator/) | tool monetize | PASS (round 1) |
| 10 | src/components/MileageDeductionCalculator.tsx (/mileage-deduction/irs-mileage-rate-2026/) | tool monetize | FAIL round 1 → PASS round 2 |
| 11 | src/components/PortfolioCalculator.tsx (/portfolio/60-40-portfolio-calculator/) | tool monetize | PASS (round 1) |
| 12 | src/components/TrumpAccountCalculator.tsx (/trump-account/) | tool monetize | PASS (round 1) |
| 13 | /hysa-vs-cd-calculator/ | calculator | FAIL round 1 → PASS round 2 |
| 14 | /trump-account-vs-529-calculator/ | calculator | FAIL round 1 → PASS round 2 |
| 15 | /mortgage-recast-calculator/ | calculator | FAIL round 1 → PASS round 2 |
| 16 | src/components/{CoastFire,CollegeSavings529,BusinessLoanPayoff,PersonalLoan,Rental,CreditCardPayoff,InterestPerDay,InvoiceFactoring,BusinessLineOfCredit,MerchantCashAdvance,AutoRefinance,Iul,PtoCashout,TaxableVsTaxDeferred,SCorpTax}Calculator.tsx | tool fix | PASS (round 2) |
| Cluster (theme) | Lever | Target | PASS (round 1) |
| --- | --- | --- | PASS (round 1) |
| HYSA vs CD (personal answer) | create new content | /hysa-vs-cd-calculator/ | PASS (round 1) |
| Trump Account vs 529 (personal answer) | create new content | /trump-account-vs-529-calculator/ | PASS (round 1) |
| Mortgage recast | create new content | /mortgage-recast-calculator/ | PASS (round 1) |
| Existing-loan payoff | update existing body text | src/components/AutoLoanCalculator.tsx (/mortgage/payoff-calculator/) | PASS (round 1) |

VERDICT: PASS
