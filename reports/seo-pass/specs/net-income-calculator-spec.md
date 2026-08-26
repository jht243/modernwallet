# Asset Spec: Net Income (Take-Home Pay) Calculator

**Prepared:** 2026-08-26 · Google-Autocomplete keyword-gap pass (`autocomplete-pass-auto`) · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/net-worth/net-income-calculator/`

New `SpokeEntry` in `src/data/spokes-net-worth.ts` — `calculator: "net-worth"` (keeps it under the existing `/net-worth/` URL hub) with `islandId: "net-income"` set explicitly to override the hub's default `NetWorthCalculator` island (see §6). This route does not exist today and nothing else on the site computes payroll withholding — confirmed clear to build.

## 2. Recommended format + rationale

**Format: a new interactive calculator**, not an article. The query set (58 raw Autocomplete rows: "net income calculator hourly," "net income calculator salary," "net income calculator by state," "net income calculator by city," "net income calculator with tax") is entirely tool-seeking — visitors want to plug in a wage and see a dollar take-home figure, not read about withholding in the abstract.

Confirmed against `src/components/CalculatorIsland.tsx`'s import/`ISLANDS` list (36 registered islands as of this pass): nothing computes payroll tax withholding. The nearest neighbors are `NetWorthCalculator` (assets − liabilities, a balance-sheet snapshot — completely different math), `BudgetCalculator` (allocates an already-known income figure, does not derive it from gross pay), and `PtoCashoutCalculator` (estimates net-of-tax on a PTO payout specifically, using a flat supplemental-wage assumption, not a full marginal-bracket withholding engine). None can be repointed at this intent without being rebuilt from scratch — this genuinely needs a new calculation engine.

**Important framing note for whoever builds this:** "net income" here means *take-home pay after payroll withholding* — a completely different calculation from "net worth" (assets minus debts), which is what the rest of the `/net-worth/` hub computes. This page exists at `/net-worth/` only because real search demand for "net income calculator" surfaces as an accidental/adjacent autocomplete branch off "net worth calculator," not because the two concepts are related. See the disambiguation requirement in §3.

## 3. What the asset does — inputs → outputs, and the formula

**Inputs:**
- Pay type: annual salary, OR hourly wage + hours/week (calculator derives annualized gross as `hourly rate × hours/week × weeks worked/year`, default 52)
- Pay frequency: weekly / biweekly / semimonthly / monthly (drives the per-paycheck output)
- Filing status: single / married filing jointly / married filing separately / head of household
- Pre-tax deductions (optional): traditional 401(k)/403(b) contribution (% or $), health insurance premium ($), HSA/FSA contribution ($)
- State: dropdown, with an explicit "skip state tax" option (see note below)
- Additional voluntary withholding ($, optional — mirrors the extra-withholding line on a real W-4)

**Outputs:**
- Annual gross pay
- Federal income tax withheld (annual)
- Social Security tax (annual)
- Medicare tax, including Additional Medicare Tax where applicable (annual)
- State tax estimate (annual, if a state is selected)
- Total tax
- **Net annual pay** and **net pay per paycheck** (net annual ÷ number of pay periods for the selected frequency)

**Formula / logic:**

1. **Gross wages.** Annual gross = salary input directly, or `hourly × hours/week × weeks/year` for hourly entrants.

2. **Taxable-wage adjustments.** Traditional 401(k)/403(b) contributions reduce federal (and most states') taxable income but do **not** reduce Social Security/Medicare wages — FICA is calculated on gross wages before a traditional retirement deferral. Section 125 cafeteria-plan health premiums and payroll HSA/FSA contributions typically reduce both federal taxable income **and** FICA wages. This split matters and the engine must model it correctly, not lump all pre-tax deductions into one FICA-exempt bucket.

3. **Federal income tax.** Subtract the standard deduction for the selected filing status from federal taxable wages, then apply the current-year progressive marginal-bracket schedule (structurally seven brackets — 10%, 12%, 22%, 24%, 32%, 35%, 37% — a rate structure that has been stable since the 2018 TCJA) to get annual federal tax. **The dollar bracket thresholds and the standard-deduction amounts are inflation-adjusted by the IRS every year (via annual Revenue Procedure).** The build must pull the current tax year's actual published thresholds at build/update time — do not hardcode a set of numbers copied from any single year's table, since they go stale every January.

4. **Social Security tax.** `6.2% × min(FICA wages, annual Social Security wage base)`. The wage base is a dollar cap the SSA publishes each fall for the following year — pull it fresh at build time, do not hardcode a remembered figure.

5. **Medicare tax.** `1.45% × all FICA wages` (no cap), plus an **Additional Medicare Tax of 0.9%** on wages above $200,000 for a single filer ($250,000 MFJ / $125,000 MFS). Unlike the income-tax brackets and the SS wage base, this $200,000/$250,000/$125,000 threshold is fixed by statute (unchanged since it took effect in 2013) and is **not** inflation-indexed — safe to hardcode, but flag it as the one FICA number that doesn't need an annual refresh.

6. **State tax.** Because 50-state marginal-bracket engines are a large scope on their own (several states have no income tax, several are flat-rate, most are graduated with their own bracket tables), this spec recommends a **simplified state input** for v1: either "no state income tax" or a single flat-percentage field the visitor enters themselves (their own state's top marginal rate, as a rough approximation), clearly labeled as an estimate. A full per-state bracket engine is a larger, separate scope — flag it as a possible v2, not part of this spec.

7. **Net pay.** `Gross − federal tax − Social Security − Medicare − state tax − additional voluntary withholding`. Per-paycheck = net annual ÷ pay periods (52 weekly, 26 biweekly, 24 semimonthly, 12 monthly).

**Disambiguation requirement (not optional):** because this page sits under `/net-worth/`, the page must open with a short, explicit note that this is a *paycheck/take-home-pay* calculator, distinct from a *net worth* (assets − debts) calculator, plus a prominent link back to `/net-worth/` for any visitor who actually wanted the balance-sheet tool. This is a real UX/SEO risk (a stranded visitor, a confusing internal-link graph) that the page copy must resolve on first scroll, not bury in an FAQ.

## 4. Primary and secondary keywords

- **Primary:** "net income calculator"
- **Secondary (pulled from the chart's raw autocomplete cluster — 58 raw rows):** "net income calculator hourly," "net income calculator salary," "net income calculator by state," "net income calculator by city," "take home pay calculator," "paycheck calculator," "net income calculator with tax," "net pay calculator"

## 5. Word count / scope estimate

Roughly 900–1,100 words of surrounding copy — slightly above the typical ~700–900-word spoke baseline because this page carries two extra obligations most spokes don't: the net-worth/net-income disambiguation block near the top, and an explanation of the federal-vs-FICA-vs-state tax stack (a genuinely more layered "how it works" section than a single-formula calculator). Suggested shape: intro (with disambiguation + link back to `/net-worth/`) → how it's calculated (federal/FICA/state walkthrough) → worked example → 5–7 FAQs (e.g. "why is my paycheck less than my salary ÷ periods," "does this include state tax," "what's the Social Security wage base," "how is Medicare tax different from Social Security").

## 6. Technical dependencies

- `src/lib/net-income.ts` — new pure engine implementing the formula in §3. Must import/reference the current tax year's IRS bracket + standard-deduction table and the current SSA wage base as data (not inline literals) so an annual data refresh doesn't require touching the calculation logic.
- `src/components/NetIncomeCalculator.tsx` — new React island (does not exist).
- Register the new island in `src/components/CalculatorIsland.tsx`'s `ISLANDS` map, e.g. `"net-income": NetIncomeCalculator,` alongside the existing entries.
- New `SpokeEntry` in `src/data/spokes-net-worth.ts`: `calculator: "net-worth"`, `slug: "net-income-calculator"`, with `islandId: "net-income"` set explicitly (the `SpokeEntry.islandId` override field, already used elsewhere for a spoke that needs a different tool than its category's default — e.g. `affordability` under `/auto-loan/`) so the page renders the new engine instead of the hub's default `NetWorthCalculator`.
- **On `LIVE_IDS` in `src/data/registry.ts`:** verified by reading the file — `"net-worth"` is already present in `LIVE_IDS` (the hub is already live), and this spec adds a spoke *under* that existing hub via the `islandId` override mechanism above, not a new top-level calculator id. So no new `LIVE_IDS` entry is required for this route as designed. It would only need one if the builder instead chose to register `"net-income"` as a wholly new top-level `CalculatorDef` in `calculators.ts` rather than a `/net-worth/` spoke — flagging this so whoever builds it doesn't add a redundant entry, but also isn't caught out if they change the approach.

No stub page or placeholder component was created this pass — this spec file is the deliverable.
