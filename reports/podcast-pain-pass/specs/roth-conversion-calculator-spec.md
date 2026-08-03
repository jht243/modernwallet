# Asset spec — Roth Conversion Calculator

**Status:** spec only. A human builds the tool. This routine ships no page for it.
**Source:** podcast-pain-pass run 2026-08-03, chart row 18.

## Demand
| term | volume/mo | KD |
|---|---|---|
| `roth conversion calculator` | 6,600 | 36 |
| `roth conversion tax calculator` | 1,300 | 27 |

Highest-volume genuinely-uncovered term in the run. Autocomplete also returns
`roth conversion breakeven calculator`, `roth conversion ladder calculator`,
`roth conversion irmaa calculator`, `roth conversion decision calculator`,
`roth conversion strategy calculator`, `roth conversion calculator over time`.

## Podcast hook
"When you do that, you get a very clear visual of where do opportunities exist of should I be
doing Roth conversions this year, or is this actually gonna cost me?" — retirement vertical,
week of 2026-08-03. The listener wants the tax cost of converting THIS year, not an explainer.

## Route
`/retirement/roth-conversion-calculator/` — a new spoke in `src/data/spokes-retirement.ts`
under the existing live `retirement` hub. Engine in `src/lib/`, island registered in
`src/components/islands.ts` and added to `LIVE_IDS` handling as the existing spokes are.

## Inputs
- Filing status (single / MFJ / MFS / HoH)
- Current-year ordinary income before conversion
- Traditional IRA balance (pretax)
- Total after-tax basis across all traditional/SEP/SIMPLE IRAs (drives pro-rata)
- Amount to convert
- Current age (for the RMD-year check and the 5-year clock note)
- Expected retirement tax rate (optional, for the break-even view)
- State (optional — flag state tax as out of scope if not modeled)

## Outputs
1. **Taxable portion of the conversion** after the pro-rata rule
   (nontaxable = converted x basis / (total IRA value + conversion), per Form 8606 Part I).
2. **Federal tax owed on the conversion** this year, marginal and effective.
3. **Bracket-fill headroom** — dollars left in the current bracket before the next one, and how
   much of the conversion spills into it. This is the number the tool exists to produce.
4. **Break-even view** — conversion cost today vs projected tax on the same dollars later at the
   entered retirement rate.
5. **Warnings:** RMD-year restriction (RMD must be taken first and cannot be converted);
   conversions are irreversible (TCJA ended recharacterization of conversions); the per-conversion
   5-year clock; IRMAA and taxable-Social-Security thresholds may be crossed.

## Dependencies
- Federal bracket + standard deduction tables for the tax year. There is currently **no shared
  bracket table in `src/lib/`** — check before building; one may need to be added and dated.
- Pro-rata math follows Form 8606 Part I line order exactly.
- Every figure the page renders must come from this engine, per `CONTENT.md`.

## Primary sources
- IRS Form 8606 + instructions: https://www.irs.gov/instructions/i8606
- IRS Pub 590-A (conversions, recharacterization ban, RMD restriction): https://www.irs.gov/publications/p590a
- IRS Pub 590-B (ordering rules, 5-year clocks): https://www.irs.gov/publications/p590b
- Rev. Proc. 2025-32 (2026 brackets + standard deduction): https://www.irs.gov/pub/irs-drop/rp-25-32.pdf

## Related pages shipped this run
`/guides/roth-conversion-rules/` and `/guides/roth-conversion-ladder/` — link the tool from both
once built, and link back.

## Note flagged by the audit
`/guides/roth-conversion-rules/` states RMDs begin at 73, which matches current Pub 590-A text.
SECURE 2.0 sec. 107 sets the applicable age at 75 for anyone attaining age 74 after 2032-12-31
(born 1960 or later). The engine should handle both ages, since the conversion "gap years" this
tool models are two years longer for that cohort.
