# Cannibalization advisory — mindmap-pass 2026-09-30-robinhood (ADVISORY ONLY — no edits)

Chart: `reports/mindmap-pass/2026-09-30-robinhood.md`. The chart carries no `consolidate / canonicalize` rows. The pass checked each of the 6 new routes, plus the enriched explainer, against the existing pages that share their entity or topic. It found no pair that targets the same query cluster.

| New / changed route | Nearest existing page(s) | Shared query cluster? | Advisory |
|---|---|---|---|
| /guides/robinhood-24-hour-trading | none (0 extended-hours pages on site) | no | leave alone |
| /guides/is-robinhood-gold-worth-it | /compare/charles-schwab-vs-robinhood (FAQ on IRA match vs Gold), /compare/sofi-invest-vs-robinhood ("SoFi Plus vs Robinhood Gold" section) | no: those rank for "X vs Robinhood"; this page targets "is robinhood gold worth it" (4,400) | leave alone; link both ways (Phase 6) |
| /compare/robinhood-vs-fidelity | /compare/robinhood-vs-webull, /compare/fidelity-vs-schwab, /compare/etrade-vs-fidelity | no: different pairings, different exact-match queries | leave alone; cross-link as related comparisons |
| /guides/is-robinhood-safe | /compare/robinhood-vs-webull (FAQ mentions SIPC) | no: FAQ mention vs. a dedicated "is robinhood safe" (6,600) page | leave alone |
| /guides/wash-sale-rule-explained | /roundup/best-robo-advisors ("wash-sale trap" section), /guides/portfolio-rebalancing (FAQ) | no: in-body mentions only; neither targets "wash sale rule" (14,800) | leave alone; add a link from those sections (Phase 6) |
| /guides/pattern-day-trader-rule | none ("pattern day" = 0 occurrences in src/data) | no | leave alone |
| /guides/robinhood-agentic-trading-explained (enriched) | /roundup/robinhood-agentic-trading-alternatives, /guides/ai-stock-trading-explained | no: explainer vs. alternatives list vs. category pillar (distinct intents, set by the 2026-09-09 gate) | leave alone |

GSC impressions/clicks: the chart carries none for these routes. The explainer showed 0 impressions over the last 30 days (GSC, pulled 2026-09-30), so no dominance comparison applies. No near-tie pair exists, and nothing is recommended for consolidation.

No source files were changed by this phase.

## Addendum (Phase 1 reviewer): in-body overlaps. None changes a verdict; all feed Phase 6 as link sources
- Wash sale is also mentioned in /guides/tax-tips (guides.ts:1597), /guides/how-to-invest-100k-to-1-million (guides.ts:5011, 5030), /compare/robinhood-vs-webull (comparisons.ts:672) and /compare/betterment-vs-wealthfront (comparisons.ts:14004).
- Is Robinhood safe: the /compare/charles-schwab-vs-robinhood FAQ "Is my money safe at Robinhood or Schwab if the broker fails?" (comparisons.ts:12019), and the /compare/robinhood-vs-webull section "Cash Management and Account Safety" (comparisons.ts:655). These are sections, not dedicated pages, so leave alone and link.
- 24-hour trading: /compare/robinhood-vs-webull mentions extended hours in its body (comparisons.ts:672).
- Robinhood Gold is also discussed on /roundup/best-brokerage-accounts-for-interest-on-cash, /roundup/best-ai-investing-apps, /compare/robinhood-vs-webull and /roundup/best-investment-apps-for-beginners. These are passing mentions, so link.
- Query clusters for rows with no neighbour: 24-hour = "robinhood 24 hour trading / overnight trading / 24 hour market"; PDT = "pattern day trader rule / rule change".
