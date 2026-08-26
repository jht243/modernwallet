# Asset Spec: College Net Price Calculator (Estimate)

**Prepared:** 2026-08-26 · Google-Autocomplete keyword-gap pass (`autocomplete-pass-auto`) · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

`/net-worth/net-price-calculator-college/`

New `SpokeEntry` in `src/data/spokes-net-worth.ts` — `calculator: "net-worth"` (keeps it under the existing `/net-worth/` URL hub) with `islandId: "net-price-college"` set explicitly to override the hub's default `NetWorthCalculator` island (see §6). This route does not exist today.

## 2. Recommended format + rationale

**Format: a new interactive estimator**, not an article. The query set (57 raw Autocomplete rows: "net price calculator college," "net price calculator FAFSA," "net price calculator [university name]") is tool-seeking — visitors want to enter their own numbers and get an estimated dollar figure, not read a definition of "net price."

Confirmed against `src/components/CalculatorIsland.tsx`'s `ISLANDS` map: nothing on the site estimates college cost-after-aid. `CollegeSavings529Calculator` is the closest neighbor but solves a different problem (projecting a 529 balance forward to a college start date and comparing it to an inflated cost target) — it does not estimate financial-aid-adjusted net price from family income. This genuinely needs a new engine.

**Important framing note for whoever builds this:** just like the net-income-calculator spec, this page exists at `/net-worth/` only because "net worth calculator" autocomplete surfaces real adjacent demand for college net price — the two concepts (a household balance sheet vs. an estimated college cost) are unrelated. The page must open with a short, explicit disambiguation note plus a prominent link back to `/net-worth/`.

## 3. What the asset does — inputs → outputs, and the formula

**Inputs:**
- Sticker price components: tuition & fees, and room & board (or a single "total cost of attendance" field if the visitor prefers one number)
- School type: public in-state / public out-of-state / private (affects the realistic sticker-price range shown as a default/placeholder, not a hardcoded per-school number)
- Family adjusted gross income (AGI) bracket
- Family size
- Number of family members currently in college simultaneously

**Outputs:**
- An estimated Student Aid Index (SAI) — the federal methodology's current name for what was called the Expected Family Contribution (EFC) before the FAFSA Simplification Act took effect for the 2024–25 award year
- Estimated grant/scholarship aid
- **Estimated net price** = sticker price (cost of attendance) − estimated grant/scholarship aid

**Formula / logic:**

1. **This tool cannot replicate the real federal SAI/EFC formula exactly**, and the spec should say so plainly rather than implying precision it doesn't have. The actual federal methodology uses non-public-in-one-place tables (an Income Protection Allowance that varies by family size, an Employment Expense Allowance, asset-protection allowances, etc.) published annually by the Department of Education, plus school-specific "institutional methodology" formulas that vary further for financial-aid purposes at many private colleges. The build should implement a **rough, clearly-labeled approximation**, not present its output as authoritative.

2. **Simplified available income.** `AGI − estimated federal/state tax − Income Protection Allowance (by family size)`. The Income Protection Allowance table is published annually by the Dept. of Education and must be pulled fresh at build/update time, not hardcoded from a remembered year.

3. **Contribution from income.** The real federal formula applies a graduated schedule (roughly 22%–47% of discretionary income under the pre-2024 EFC methodology) to that available income. A simplified version can apply a single rough sliding percentage by income bracket, clearly labeled in the UI as an approximation — not the precise government bracket table.

4. **Number-in-college adjustment — flag this explicitly for accuracy.** Historically the EFC formula divided the parent contribution by the number of family members simultaneously in college. The FAFSA Simplification Act changed this for the SAI era (2024–25 award year onward): the sibling-in-college discount was removed for most families' SAI calculation (with a narrower carve-out tied to Pell eligibility). This is a real, checkable statutory change, but exactly how it nets out can still shift with further Dept. of Ed. guidance — whoever builds this should verify the current award year's actual rule rather than assume either the old or new behavior by default, and the tool should say which convention it's using.

5. **Estimated grant/scholarship aid.** There is no single public formula for how much grant aid a given school awards at a given income level — this varies enormously by an individual school's endowment and financial-aid generosity (a well-funded private university can meet 100% of demonstrated need; a public school or thinly-endowed private one may meet much less). The build should use **rough, clearly-labeled illustrative tiers** by income bracket and school type (e.g., "lower-income families at public in-state schools often see most demonstrated need met; awards at other school types vary widely") rather than asserting a single industry-wide aid percentage. This is exactly the kind of number that must be described qualitatively, not with false precision.

6. **Net price definition — get this right.** By the federal (IPEDS/College Scorecard) definition, "net price" = cost of attendance **minus grants and scholarships only**. Loans and work-study are **not** subtracted — a net-price figure is not the same as "how much cash will I need to borrow." The tool's output and copy must use this same definition and must not silently net out loans, or it will produce a number that doesn't match the federal figures visitors will see elsewhere (and will look wrong next to a school's own official calculator).

**Honesty/liability requirement (not optional):** the U.S. Department of Education requires every Title IV-participating college to publish its **own official net price calculator** on its website (a requirement stemming from the Higher Education Opportunity Act of 2008, in effect since 2011) — this is a real, checkable requirement, not a marketing claim. Because school-specific aid policy varies so much, this page's estimate can be meaningfully off from what an actual applicant would receive at a specific school. The page must frame itself clearly as a **quick, rough estimate for comparison purposes**, and must prominently and repeatedly direct the reader to run the specific college's own official net price calculator for a real, actionable number — this is not a replacement for that tool, and the copy should say so in plain language near the calculator itself, not only in a buried disclaimer.

## 4. Primary and secondary keywords

- **Primary:** "net price calculator college"
- **Secondary (pulled from the chart's raw autocomplete cluster — 57 raw rows, FAFSA/by-university variants):** "college net price calculator," "net price calculator FAFSA," "net price calculator estimate," "college cost after financial aid calculator," "expected family contribution calculator," "student aid index calculator"

## 5. Word count / scope estimate

Roughly 1,000–1,200 words — above the typical ~700–900-word spoke baseline because this page carries three extra obligations: the net-worth/net-price disambiguation block, the "this is a rough estimate, go use the school's own official calculator" honesty framing (needs real prominence, not one buried line), and enough plain-language explanation of what SAI/EFC and "net price" actually mean for a reader who has likely never seen either term. Suggested shape: intro (disambiguation + link back to `/net-worth/` + upfront "this is an estimate" framing) → how it's calculated (SAI/EFC approximation walkthrough, explicitly caveated) → worked example → "why your real number may differ + how to find your target school's official calculator" section → 5–7 FAQs (e.g. "what is SAI/EFC," "does net price include loans," "why is my estimate different from a school's actual number," "what counts as sticker price").

## 6. Technical dependencies

- `src/lib/net-price-college.ts` — new pure engine implementing the approximation in §3. Should reference the current award year's Income Protection Allowance table and bracket assumptions as data, clearly commented as an approximation of, not a replication of, the federal SAI methodology.
- `src/components/NetPriceCollegeCalculator.tsx` — new React island (does not exist).
- Register the new island in `src/components/CalculatorIsland.tsx`'s `ISLANDS` map, e.g. `"net-price-college": NetPriceCollegeCalculator,`.
- New `SpokeEntry` in `src/data/spokes-net-worth.ts`: `calculator: "net-worth"`, `slug: "net-price-calculator-college"`, with `islandId: "net-price-college"` set explicitly via the `SpokeEntry.islandId` override field (same mechanism as `affordability` under `/auto-loan/`) so the page renders the new engine instead of the hub's default `NetWorthCalculator`.
- **On `LIVE_IDS` in `src/data/registry.ts`:** verified by reading the file — `"net-worth"` is already present, and this route is a spoke under that existing hub via the `islandId` override, so no new `LIVE_IDS` entry is required as designed. It would only be needed if the builder instead registers this as a new top-level `CalculatorDef` rather than a `/net-worth/` spoke.

No stub page or placeholder component was created this pass — this spec file is the deliverable.
