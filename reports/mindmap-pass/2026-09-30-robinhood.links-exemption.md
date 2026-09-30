# Run-level decision: first-mention link rule vs the closed URL list (mindmap-pass 2026-09-30-robinhood)

**Raised by:** the Phase 4 adversarial auditor (`2026-09-30-robinhood/audit-phase4-A.md`, "Run-level findings"), as a run-level (Rung 2 policy) finding, not a per-page fail.

**The conflict.** `_content-standard.md` GATE (Links) makes an unlinked first mention of a named organisation a hard fail. `_content-generation.md` requires every external link to come from the run's closed URL list (`2026-09-30-robinhood/prompts/<slug>.allowed-urls.txt`). The organisations below are named on the new or updated pages with no URL for them on that list, so the writer could not satisfy both rules.

**Decision: documented exemption, `links-exempt: closed URL list`.** The closed URL lists stand, and no homepages were added.

## Organisations named without their own first-mention link

| Organisation | Page | Reason no link |
|---|---|---|
| Bruce ATS | /guides/robinhood-24-hour-trading | No Bruce ATS URL is on the allowed list. The page attributes the name to Robinhood's HOOD Summit 2026 post, which is linked in section 2 and is the verification path for the claim. |
| 24X National Exchange | /guides/robinhood-24-hour-trading | No 24X homepage is on the allowed list. The claim about 24X (the SEC exemptive relief, its hours and dates) is linked to the SEC order itself (Release 34-106061) in the same sentence, so the primary source is linked but the organisation's own site is not. |
| Nasdaq | /guides/robinhood-24-hour-trading | No Nasdaq URL is on the allowed list. The claim is attributed to the linked Markets Media report. Note: `data/entity-links.json` has a `Nasdaq` entry, so the post-build `scripts/entity_links.mjs` pass autolinks its first mention to nasdaq.com anyway. |
| NYSE Arca / New York Stock Exchange (parent company) | /guides/robinhood-24-hour-trading | No NYSE URL is on the allowed list. Named only as the subject of the linked Markets Media report's plans. The audit fixes removed the other two NYSE mentions (section 3 routing sentence and FAQ 2). |
| House Ways and Means Committee | /guides/wash-sale-rule-explained | No house.gov URL is on the allowed list. The committee vote is linked to the Unchained report and the Forvis Mazars analysis, which are the sources for the claim. |
| New York Stock Exchange (NYSE) | /guides/pattern-day-trader-rule | Historical mention only (the 2001 rule origin). No NYSE URL is on the allowed list; the history is covered by the linked Investor.gov glossary and FINRA Rule 4210 pages. |
| National Association of Securities Dealers (NASD) | /guides/pattern-day-trader-rule | NASD no longer exists (it merged into FINRA in 2007), so there is no current official site to link. FINRA's own pages are linked on the page. |
| Cursor | /guides/robinhood-agentic-trading-explained (FAQ) | Named only as one of several MCP clients Robinhood lists. No Cursor URL is on the allowed list, and a homepage link would add nothing to verify. |

Other names on these pages are covered: Fidelity, Webull and E*TRADE are autolinked post-build by `data/entity-links.json`, and E*TRADE's first body mention is already linked to its pattern-day-trading page. FINRA and the SEC are linked on first mention in the pattern-day-trader intro after the audit fixes. The Federal Reserve and the CUSIP committee mentions were cut by the audit fixes.

**Post-build autolinking.** `data/entity-links.json` (read by `scripts/entity_links.mjs` after the Astro build) autolinks the first mention of OpenAI, Anthropic, Nasdaq, Unusual Whales, Visual Crossing, Bitstamp and Grok wherever they appear in this run's pages. Those names do not need a manual link in the page data.

**What this does NOT excuse.** If a future page makes a claim about one of these organisations (a price, a product, a rating), it must link that organisation's official page, and the URL has to be added to that run's allowed list first.

**Carried into the Phase 8 summary** so the exemption is visible with the run, as the auditor asked.
