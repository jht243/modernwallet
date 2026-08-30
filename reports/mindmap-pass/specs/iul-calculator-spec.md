# Asset Spec: IUL Calculator (`/iul-calculator/`)

Mindmap pass, Phase 3. Row format = `calculator`, so Phase 3 does NOT build this asset. This file is the build brief.

Status: SPEC ONLY. No file under `src/` was touched while writing it.

## 1. Target route and registry id

| Field | Value |
| --- | --- |
| Route | `/iul-calculator/` |
| Registry id (`CalculatorDef.id`) | `iul-calculator` |
| Island key (`CalculatorDef.islandId`) | `iul-calculator` |
| Page type | Standalone calculator hub (explainer / spoke), no spokes required at launch |
| Register | Operator |
| Medium | interactive tool to interactive tool |

The route is produced by the existing dynamic hub route `src/pages/[category]/index.astro`, whose `getStaticPaths()` maps every `CALCULATORS.filter(isLive)` entry to `params: { category: calc.id }`. Adding the id to `LIVE_IDS` plus a `CalculatorDef` is what creates the URL. This is the same standalone-hub pattern used by `taxable-vs-tax-deferred`, `pto-cashout`, `credit-card-payoff`, and `coast-fire`: a hub id with no `SpokeEntry` rows under it. Nav and footer pick it up automatically through `liveCalculators()` in `src/components/SiteHeader.astro` and `src/components/SiteFooter.astro`, and the sitemap picks it up from the built route.

## 2. Recommended format and rationale

Format: interactive calculator with an on-page explainer, not a prose explainer.

Why:

- Two comparison pages built in this same pass, `/compare/iul-vs-401k/` (2,400/mo, KD 6) and `/compare/iul-vs-roth-ira/` (880/mo, KD 4), have forum-dominated SERPs. Reddit ranks #1 on the first and #3 on the second. The live SERP tool's recommended shape for both was "experience-led / operator-voice or interactive tool - a vendor explainer will not outrank first-person community answers." This calculator is the asset those two pages point at to beat Reddit: it gives an operator-voice page something a forum thread structurally cannot have, a working model of the reader's own policy.
- Page one for "iul calculator" (1,300/mo, KD 24) is behavioralwealth.org, insurancegeek.com, then carriers: allstate, nationwide, allianzlife, mutualofomaha, nationallife, locallifeagents, plus nerdwallet. No general-purpose personal-finance calculator ranks. Every carrier result has a structural conflict of interest: it illustrates upside.
- The site has 24 live calculator engines (`LIVE_IDS` in `src/data/registry.ts`) and none for life-insurance cash value. This is a clean gap, not a duplicate.

## 3. What the asset does: inputs to outputs

### Inputs

Policy side:

- Annual premium (dollars)
- Years funded (how many years premium is actually paid)
- Current age (drives the cost-of-insurance curve and the projection horizon)
- Death benefit target or face amount (drives net amount at risk, which drives COI)
- Index cap rate, percent (the ceiling on credited interest in a good year)
- Participation rate, percent (share of index gain credited before the cap applies)
- Floor, percent, default 0
- Assumed gross index return, percent (the index's own return before cap, participation, and floor)
- Return pattern toggle: level assumed return vs. a variable sequence, so the cap can actually bite in an above-cap year
- Cost-of-insurance assumption: a user-set starting annual COI rate per $1,000 of net amount at risk plus an annual escalation percentage. User-supplied, labeled as an assumption, never a carrier table (see section 8)
- Policy expense / premium load, percent, and any flat monthly administrative charge
- Surrender-charge schedule: starting percentage of cash value plus number of years it grades to zero (a simple straight-line or user-entered per-year grade)

Baseline side:

- Baseline choice: 401(k) with employer match, taxable brokerage, or both shown at once
- Employer match percent of pay and pay, or a flat match dollar cap
- Baseline expected annual return, percent
- Baseline expense ratio, percent
- Tax rate, percent (for the taxable and tax-deferred baselines)

### Outputs

- Year-by-year table and chart for the policy: premium paid, credited interest after cap/participation/floor, COI charged, expense charges, ending cash value, surrender value (cash value minus that year's surrender charge), and death benefit.
- The same year-by-year series for the baseline: 401(k) balance including employer match, and/or the taxable brokerage after-tax balance.
- Crossover year: the first year, if any, in which the IUL surrender value exceeds the baseline balance. When there is none inside the horizon, say so explicitly rather than leaving it blank.
- Totals: cumulative premium, cumulative cost of insurance, cumulative policy expenses, and total dollars of index gain given up to the cap.
- Cap-drag detail: for each year where the raw index return exceeds cap divided by participation rate, show the credited rate against the uncapped rate and the dollar difference. Sum it across the horizon.
- Lapse scenario: for a minimally funded policy, the year in which rising COI plus expenses exhaust the cash value, with a plain statement of what lapse means (coverage ends and, if the policy has gain, a taxable event can follow).

### The single most important output

The tool must show what the CAP and the RISING COST OF INSURANCE actually cost the saver over 20 to 30 years, and it must show the lapse scenario for a minimally funded policy. That is the information gain over every page-one result. Carrier calculators illustrate the upside. None of the page-one results show the drag. Concretely, the headline result block should be a single sentence of the form: over N years, the cap gave up $X of index gain and the cost of insurance consumed $Y, leaving the surrender value $Z below/above the baseline. Everything else on the page supports that sentence.

## 4. Keywords

Primary: **iul calculator** - 1,300/mo, KD 24. Use as `targetKeyword`.

Secondary:

- cash value life insurance calculator - 480/mo, KD 25
- indexed universal life insurance cost - 110/mo, KD 32, CPC $14.64
- infinite banking calculator - 110/mo, KD 0
- index universal life insurance cost calculator (Autocomplete)
- index universal life insurance cost per month (Autocomplete)

Placement: primary in `metaTitle`, `h1`, and the first sentence of `intro`. "cash value life insurance calculator" and the cost phrases belong in `howItWorks` and FAQ questions. "infinite banking calculator" is KD 0 and deserves its own FAQ that answers the question honestly (borrowing against cash value is a loan against your own policy that accrues interest and reduces the death benefit if unpaid).

## 5. Word count and scope for the accompanying copy

Site explainer floor is 1,200 body words. Target 1,400 to 1,700 body words across the `CalculatorDef` fields:

| Field | Target |
| --- | --- |
| `intro` | 120-180 words, opening with a complete self-contained sentence defining what an IUL calculator does (AEO requirement noted in `src/data/types.ts`), then one worked example using real engine output |
| `howItWorks` | 500-700 words, 4-6 paragraphs separated by `\n\n` (the hub route splits on `\n\n`): how index crediting works with cap, participation, and floor; how COI is charged against the net amount at risk and why it rises with age; how surrender charges work; how the baseline comparison is constructed |
| `faqs` | 8-10 entries, 60-110 words each. Must include: is an IUL a good investment; what does an IUL actually cost per month; what happens if I stop paying premiums (lapse); can the carrier lower my cap; what is infinite banking; IUL vs 401(k); IUL vs Roth IRA; what is the 0% floor really protecting |
| `sources` | 5-7 primary sources. Candidates: NAIC (Index Universal Life illustration model regulation AG 49-A), FINRA investor alerts on indexed products, SEC investor bulletins, IRS Publication 525 and section 7702 material on life insurance taxation, and a state insurance department consumer guide. No carrier marketing pages |

Internal links inside `howItWorks` and FAQ answers (rendered through `linkify` in `src/lib/richtext.ts`, markdown link syntax): `/compare/iul-vs-401k/`, `/compare/iul-vs-roth-ira/`, `/taxable-vs-tax-deferred/`, `/retirement/`, `/investing/`.

## 6. Technical dependencies: exact files to create and edit

### Create

1. `src/lib/iul.ts` - the engine. Follow the shape of `src/lib/taxable-vs-tax-deferred.ts` exactly: a pure module with an exported input interface, an exported result interface, an `EMPTY` constant of all-null results, one exported compute function, and a local `round2` helper. No React, no formatting, no I/O.

   ```ts
   export interface IulInput { /* fields from section 3 */ }
   export interface IulYearRow {
     year: number; age: number; premiumPaid: number; creditedRatePct: number;
     uncappedRatePct: number; capGivenUp: number; costOfInsurance: number;
     expenses: number; cashValue: number; surrenderValue: number; deathBenefit: number;
     baselineBalance: number;
   }
   export interface IulResult {
     rows: IulYearRow[] | null;
     totalPremium: number | null;
     totalCostOfInsurance: number | null;
     totalExpenses: number | null;
     totalCapGivenUp: number | null;
     finalCashValue: number | null;
     finalSurrenderValue: number | null;
     finalBaselineBalance: number | null;
     crossoverYear: number | null;   // null = never inside the horizon
     lapseYear: number | null;       // null = does not lapse
   }
   export function computeIul(input: IulInput): IulResult
   ```

   Year loop, not a closed form, so every step is hand-checkable. That is the stated convention in the header comment of `src/lib/taxable-vs-tax-deferred.ts` and it matters here because the whole value of the page is auditability.

2. `src/components/IulCalculator.tsx` - the island. Model on `src/components/TaxableVsTaxDeferredCalculator.tsx`. Real observed contract:

   ```tsx
   interface Props {
     initialData?: Partial<IulInput>;
     heading?: string;
     subheading?: string;
   }
   const DEFAULTS: IulInput = { /* ... */ };
   export default function IulCalculator({ initialData, heading, subheading }: Props) {
     const [input, setInput] = useState<IulInput>({ ...DEFAULTS, ...initialData });
     const result = useMemo(() => computeIul(input), [input]);
     ...
   }
   ```

   Inline style objects in a local `S` const, no CSS modules, formatting via `fmtUSD` / `fmtPct` / `fmtNum` from `src/lib/format.ts`. Standalone, no host coupling. Because this tool has a year-by-year table, keep the table in a scrollable container and collapse it behind a toggle so the headline drag numbers are what a reader sees first.

3. `reports/mindmap-pass/specs/iul-calculator-ground-truth.md` (or a scratch `.mjs` run) - the computed figures handed to the writer. See section 7.

### Edit

4. `src/data/registry.ts` - add `"iul-calculator"` to the `LIVE_IDS` set, with a one-line comment matching the existing style (`// Mindmap pass (2026-08-30): "iul-calculator" ...`). Nothing builds without this: `isLive()` in `src/data/calculators.ts` tests `LIVE_IDS.has(c.islandId)`.

5. `src/components/CalculatorIsland.tsx` - import `IulCalculator` and add `"iul-calculator": IulCalculator,` to the `ISLANDS: Record<string, React.ComponentType<any>>` map, with a comment in the existing style. Note the file's own header: Astro imports `CalculatorIsland` literally for `client:only`, and the specific calculator is picked here on the client. There is no `src/components/islands.ts`; some older comments in the repo reference that path and it does not exist. The island registry is `ISLANDS` inside `CalculatorIsland.tsx`.

6. `src/data/calculators.ts` - append a `CalculatorDef` to the `CALCULATORS` array before the `MCA_HUB, FACTORING_HUB, LOC_HUB` entries. Required fields, from `src/data/types.ts`: `id`, `islandId`, `label`, `navOrder`, `metaTitle` (60 chars or fewer), `metaDescription` (160 chars or fewer), `targetKeyword`, `h1`, `intro`, `howItWorks`, `faqs`, `sources`, `defaultPreset`. Use `navOrder: 21` (current personal-finance max is 20; the three business-financing hubs sit at 30-33). `defaultPreset` is `Record<string, unknown>` and is passed straight through the hub route as `initialData`, so its keys must match `IulInput` field names exactly.

7. `src/data/cross-links.ts` - add an `"iul-calculator"` key to `CROSS_LINKS` pointing at `/retirement/`, `/investing/`, `/taxable-vs-tax-deferred/`, and the two comparison pages. Also add a link back to `/iul-calculator/` from the `"retirement"` and `"investing"` entries.

8. `src/data/comparisons.ts` - in the `/compare/iul-vs-401k/` and `/compare/iul-vs-roth-ira/` entries, add `calculatorLinks: [{ label: "Run your own IUL projection", href: "/iul-calculator/" }]`. Confirmed shape: `ComparisonEntry.calculatorLinks?: Array<{ label: string; href: string }>`, rendered at `src/pages/compare/[slug].astro:132`. The compare route does NOT render a calculator island, so "embed" here means a prominent linked CTA block, not an inline tool. If a real inline tool is wanted on those two pages, that is a separate change to `src/pages/compare/[slug].astro` to render `<CalculatorIsland client:only="react" calculatorId={...} />`, and it should be scoped and approved on its own rather than smuggled into this build.

9. `src/data/icons.ts` - optional. Add an `"iul-calculator"` entry to `STYLE` and a suitable shape to `SHAPE`; otherwise the card falls back to `DEFAULT_STYLE`.

### Not required

No new route file. No `astro.config.mjs` change: the sitemap integration filters on `isNoindexedPath` and picks up the new page automatically. No `SpokeEntry` rows at launch.

## 7. Ground-truth math rule

From `CONTENT.md`, item 2: any numeric figure on the page MUST come from the calculator's real engine output, computed ahead of time and handed to the writer. Writers must not invent or recompute figures. Compute with the `src/lib/*` engine directly - Node 25 runs the `.ts` file, so a small `.mjs` script importing `src/lib/iul.ts` by absolute path produces the numbers.

For this page that means: build `src/lib/iul.ts` FIRST, run it against `defaultPreset`, and write the intro example, the `howItWorks` walkthrough, and every FAQ number from that output. This page's whole claim is that it shows the drag honestly, so a single invented figure discredits the asset more than it would on any other page on the site. The audit checks number accuracy against engine ground truth.

## 8. Modelling cautions the builder must honor

1. Never present an illustrated rate as a promise. Every projection is a what-if driven by user-entered assumptions. Label the output as an illustration of the assumptions entered, not a prediction, in the UI itself and not only in the disclaimer.
2. Carriers can lower a cap rate on an in-force policy. The cap is not contractually locked at the illustrated level in typical products; only the guaranteed minimum floor and guaranteed maximum charges are. Say this on the page, and consider a "what if the cap drops to X in year 10" input.
3. The 0% floor protects against index loss, not against policy charges. In a 0% credited year the cash value still falls, because COI and expenses are still deducted. This is the single most misunderstood mechanic in the category and the tool must show it in the year-by-year table.
4. Do not hard-code any carrier's actual cap rate, COI table, or pricing. This site must not publish a fabricated carrier figure. Every policy input is user-supplied. Defaults must be clearly labeled as illustrative assumptions and sourced to a neutral authority (NAIC AG 49-A, a state insurance department consumer guide, or a FINRA/SEC investor bulletin), never to a carrier's marketing illustration.
5. Do not name or rank carriers, and do not imply the page can tell any individual whether to buy a policy. Operator register, not advice register: show the math, name the mechanics, let the reader draw the conclusion.
6. Tax treatment is deliberately out of scope for the engine beyond the baseline's tax rate. Do not model MEC status, section 7702 limits, or policy-loan taxation numerically; address them in FAQ prose with primary sources.
