# Phase 4 audit: the 2026-09-30-robinhood guides (24-hour trading, wash sale, pattern day trader)

All three pages FAIL as written. Every finding has an exact replacement below, so none of them needs regenerating (FIX-IN-PLACE, not REWORK). After applying the fixes, re-measure sentence rhythm on the 24-hour and wash-sale pages.

## What passed on all three pages
- **Content:** each `src/data/guides.ts` entry matches its draft JSON, apart from the wash-sale meta you mentioned.
- **Depth**, measured from source with a script over intro, section bodies and FAQ answers:
  - 24-hour: 1,958 words.
  - Wash sale: 2,578 words.
  - Pattern day trader: 1,709 words (1,819 with the table).
  - Result: 3 of 3 pass the 1,200 floor, median 1,958.
- **Checks with zero hits:**
  - em-dashes (the 3 in the pattern-day-trader page are the table's `:---` separator)
  - "honest"
  - exclamation marks
  - neutrality claims (the grep had no hits)
  - byline or date sentences in the body
- **Disclaimer:** the footer says "not financial advice" on every page, so the missing-disclaimer gate does not trigger.
- **Internal links:** every route exists (`robinhood-vs-webull` and `best-investment-apps-for-beginners` checked, `/investing/` included). Each internal link appears once.
- **Load receipt:** `standards-ledger.jsonl` has a `via:"load-script"` mindmap-pass entry for 2026-09-30, and the hashes 098897e9, e4282612 and 31d70e56 match the files.
- **Guard flags:** the "missing metaTitle/subtitle/cta*/faqItems" flags are false alarms. The `Guide` interface has none of those fields and the guides.ts entries carry no empty keys.

## Run-level findings
- **HARD, row records:** chart rows 3, 7 and 8 in `reports/mindmap-pass/2026-09-30-robinhood.md` have medium (text → text) and page type, but no `register:` record. Fix: add `register: operator` to all three rows.
- **HARD but unresolvable within the closed URL lists (Links gate):** several organisations are named on first mention with no allowed URL to link:
  - Bruce ATS, 24X, Nasdaq, NYSE Arca (24-hour)
  - House Ways and Means (wash sale)
  - NYSE, NASD (pattern day trader)

  Either record a links exemption the way the 2026-09-21 run did (`2026-09-21.links-exemption.md`), or cut the names where my fixes below already do.
- **ADVISORY, affects verification:** `src/lib/richtext.ts` rewrites every `robinhood.com` link to the referral URL (`join.robinhood.com/jonatht93`). As a result, every deep link to a Robinhood support or newsroom page used as a source points readers to the referral page, not the article they need to check.

---

## 1. robinhood-24-hour-trading: FAIL

**Gate results**
- **(a) Answer first:** the intro's first sentence gives the yes plus the hours, and section 1 gives the hours, session choice and GFD/GTC. Pass, apart from the "gap" error below.
- **(g) Lengths:** title 57, meta 150. OK.
- **(i) Dollar illustration:** not acceptable. The row prompt says "a concrete illustration in words (no invented numbers)". $99.99, $100.00, $97.00, $103.00 and $100.50 are invented prices, and a 6% overnight spread on a top-traded stock is a misleading magnitude.
- **Rhythm (HARD):** sentences 38–48 (sections 3–4) are all long (15+ words). Band counts: short 2, medium 14, long 63. The fixes below shorten several of them; re-measure.

**Findings**
- **HARD, headline tell (colon splice plus three-item title), title:**
  - FIX title: "Robinhood 24 Hour Trading: Hours, Risks, and How It Works" → "Robinhood 24 Hour Trading Hours and Overnight Risks"
  - FIX h1: "Robinhood 24 Hour Trading: Hours, Limits, and Risks" → "Robinhood 24 Hour Trading Hours and Overnight Order Rules"
- **HARD, experience claim not licensed by `_experience.md`** (the site does not monitor order routing):
  - FIX introText: "At ModernWallet, we track how retail brokerages route orders outside regular hours so you can make informed choices with your money." → "At ModernWallet, every guide we write starts from the rule you will hit first, and overnight that rule is the order type."
- **HARD, meaning bar (vague wording; nominalized instruction "Understanding … can keep you"):**
  - FIX introText paragraph 2 (all three sentences) → "Overnight trading lets you act on evening earnings reports or overseas news before the 9:30 a.m. ET open. Fewer buyers and sellers trade at night, so the gap between the bid and the ask is wider and your order is less likely to fill."
- **HARD, contradicted fact.** The disclosure says a 24 Hour Market order can execute from 12 a.m. to 8 p.m. ET, so there is no 4–7 a.m. gap:
  - FIX section 1: "Overnight hours run from 8:00 p.m. to 4:00 a.m. ET, followed by a gap before the pre-market session opens at 7:00 a.m. ET." → "Robinhood calls 8:00 p.m. to 4:00 a.m. ET the overnight hours; a 24 Hour Market order stays executable after 4:00 a.m., and the standard pre-market session opens at 7:00 a.m. ET."
- **ADVISORY, history inside section 1 plus the unsourced word "nationwide":**
  - FIX: "In March 2022, Robinhood formally expanded its [pre-market and after-hours windows](…) to widen access before rolling out overnight trading nationwide." → "In March 2022, Robinhood moved its [pre-market open](https://robinhood.com/us/en/newsroom/the-future-of-investing-is-24-7/) to 7:00 a.m. ET from 9:00 a.m. and extended after-hours to 8:00 p.m. ET."
- **HARD, contested item stated as settled.** "Across all account types" appears only in the HOOD Summit post; the support page is silent, and "individual" and "identical ticker access" are invented:
  - FIX section 2: "In its [HOOD Summit 2026 announcement](…), Robinhood confirmed that this curated catalog spans all individual account types, giving self-directed investors identical ticker access regardless of their portfolio tier." → "Robinhood's [HOOD Summit 2026 announcement](https://robinhood.com/us/en/newsroom/hood-summit-2026/) describes the list as available "across all account types," though the 24 Hour Market support page does not say which accounts qualify."
- **HARD, overloaded sentence:**
  - FIX: "Robinhood launched this feature in May 2023 with 43 initial assets, expanded the list to 95 symbols by autumn 2023, and later surpassed [ten billion dollars in cumulative volume](…)." → "Robinhood launched the 24 Hour Market in May 2023 with 43 stocks and ETFs and had 95 by September 2023. By March 2024, customers had traded more than [$10 billion overnight](https://robinhood.com/us/en/newsroom/robinhood-24-hour-market-reaches-10b-in-total-volume-traded-overnight/)."
- **HARD, wrong tense for a future fact.** Today is Sept 30 and the change starts in October; the facts also say "options", not "equity options":
  - FIX section 2: "starting in October 2026, Robinhood expanded equity options hours to run from 7:30 a.m. to 4:15 p.m. ET." → "from October 2026, Robinhood options trading runs from 7:30 a.m. to 4:15 p.m. ET."
  - FIX FAQ[3]: "Starting in October 2026, Robinhood expanded equity options trading hours to run between 7:30 a.m. and 4:15 p.m. ET, which remains separate from its overnight equity market." → "From October 2026, Robinhood options trading runs from 7:30 a.m. to 4:15 p.m. ET, separate from the 24 Hour Market."
- **HARD, facts outside the list, plus NYSE named without a link:**
  - FIX section 3: "Robinhood Securities routes your order away from primary public exchanges like the New York Stock Exchange. Instead, orders route directly to specialized overnight market makers." → "Robinhood Securities routes it to what its disclosure calls "24H Market Makers.""
  - FIX: "Robinhood routes 24 Hour Market volume through Bruce ATS, an alternative trading system designed to clear overnight retail volume." → "Robinhood's HOOD Summit 2026 post names Bruce ATS as the alternative trading system that powers the 24 Hour Market."
- **HARD, overstated certainty and invented jargon.** The fact list says orders "may not be price protected"; "national market system regulations" and "unlinked institutional matching network" are not in it:
  - FIX the three sentences from "Unlike primary public exchanges…" through "…elsewhere." → "Overnight ATSs are not required to display their prices publicly. Robinhood's disclosure says 24 Hour Market orders may not be price protected, so your order can fill at a worse price than another venue shows at the same moment."
- **HARD, false claim** (these risks apply to all extended hours):
  - FIX section 4: "Trading equities in the middle of the night exposes your capital to structural market risks that do not exist during daytime hours." → "Overnight orders carry the risks Robinhood lists for all extended-hours trading."
- **HARD, unsourced ("small fraction of global market participants", "dramatically"):**
  - FIX: "Because only a small fraction … fewer buyers and sellers matching orders." → "Fewer buyers and sellers are active between 8:00 p.m. and 4:00 a.m. ET, which is what the disclosure means by lower liquidity."
  - FIX: "This thin participation causes the bid-ask spread, the price difference between what buyers will pay and what sellers will accept, to widen dramatically." → "With fewer orders on each side, the bid-ask spread (the gap between what buyers will pay and what sellers will accept) gets wider."
- **HARD, invented dollar illustration (guard numbers 100.5, 103, 97, 99.99; item i):**
  - FIX: "Consider a stock that closed at $100.00 … capped your ticket at $100.50." → "Picture a stock whose buyers and sellers sat a penny apart at the 4:00 p.m. close. At 2:00 a.m. ET, the lowest ask on the ATS can sit well above that close. A limit order fills only at your price or better, so if the ask is above your limit, your order waits instead of paying it."
- **HARD, invented suspension triggers; the risk is raised and never resolved:**
  - FIX: "If a company issues an unexpected corporate filing or macro conditions prompt extreme imbalances, trading can halt abruptly." → "If trading stops, an open overnight order may not fill, so check its status when the pre-market session opens at 7:00 a.m. ET."
- **HARD, link used twice.** The disclosure PDF is linked in both section 1 and section 4:
  - FIX section 4: "In its [extended-hours trading risk disclosures](https://cdn.robinhood.com/assets/robinhood/legal/ExtendedHoursTradingDisclosure.pdf)," → "In its extended-hours trading risk disclosures,"
- **HARD, synonym cycling** (tools / agent / algorithm / models), a placeholder opener, a nested conditional, and "monitoring watchlists" (not in the fact list):
  - FIX section 5, paragraph 1, first two sentences → "Robinhood's AI agents follow the same overnight order rules you do. At its HOOD Summit in late September 2026, Robinhood launched AI agents that can place trades while you sleep."
  - Then: "When an automated agent acts overnight" → "When an agent trades overnight"
  - Then: "An automated agent cannot circumvent" → "An agent cannot skip"
  - FIX: "If an agent triggers a purchase order following an overnight corporate earnings surprise, thin order books mean the trade may fill slowly or miss execution entirely if the stock runs past your limit price. To understand how these models analyze market data and submit tickets, read our [guide…](/guides/robinhood-agentic-trading-explained/)." → "Say an agent places a buy order after a company reports earnings at night. If the stock moves past your limit price, the order will not fill. Our [guide to Robinhood agentic trading](/guides/robinhood-agentic-trading-explained/) explains how the agents work and place orders."
  - FIX paragraph 3 (all of it) → "Every overnight order an agent places pays the same wide spread yours would. Our [explainer on AI stock trading](/guides/ai-stock-trading-explained/) covers how other trading software handles orders."
- **HARD, unsourced forecast, a banned word ("significant"), and "transform…mirroring" in section 6:**
  - FIX: "If approved, weekend sessions would transform retail equity investing from a five-day cycle into genuine seven-day trading, mirroring cryptocurrency market accessibility." → "If regulators approve it, Robinhood customers could trade stocks on weekends, as they already can with crypto."
  - FIX: "Regulators have already cleared significant milestones toward nationwide overnight stock exchanges." → "The SEC has cleared one exchange to run an overnight session, starting in 2027."
  - FIX: "The current operational status of those exchange initiatives remains unverified, yet the general trend signals that extended overnight liquidity will continue growing." → "Markets Media reported those plans in July 2025, and their status in September 2026 is unverified."
- **HARD, contradicted by the sibling fact list.** Robinhood removed day-trade restrictions on June 4, 2026, and FINRA is named without a link:
  - FIX section 7: "If you trade frequently, monitor your frequency against the FINRA rules outlined in our [guide to the pattern day trader rule](/guides/pattern-day-trader-rule/) to avoid margin restrictions." → "If you trade often on margin, our [guide to the pattern day trader rule](/guides/pattern-day-trader-rule/) explains the 2026 change to day-trading margin rules."
- **HARD, item (e): an "In our … analysis, we evaluate" line plus an invented claim ("deeper order routing networks"):**
  - FIX: "In our [Robinhood vs. Fidelity analysis](/compare/robinhood-vs-fidelity/), we evaluate how extended trading windows stack up against the deeper order routing networks of traditional brokerage firms." → "Our [Robinhood vs. Fidelity comparison](/compare/robinhood-vs-fidelity/) sets Robinhood's trading hours against Fidelity's."
- **HARD, assumes the reader already trades overnight:**
  - FIX: "Before placing your next late-night order, open the Robinhood order ticket and verify that your limit price accurately reflects the asset's current bid-ask spread." → "Before you place an overnight order, compare your limit price with the current bid and ask on the Robinhood order ticket."
- **HARD, inaccurate FAQ answers:**
  - FIX FAQ[0] sentence 2 (extended-hours trades can be fractional and are not all routed to ATSs) → "Overnight trades must be whole-share limit orders, which Robinhood routes to 24H market makers and alternative trading systems."
  - FIX FAQ[1] (whole answer; "matching", "like Robinhood" and an unlinked NYSE/Nasdaq) → "Yes. Robinhood offers 24-hour weekday trading in a curated list of stocks and ETFs, routing overnight orders to market makers and alternative trading systems. The SEC has also granted the 24X National Exchange temporary relief to run an overnight session starting January 24, 2027."
- **ADVISORY:**
  - The sources entry for Markets Media has a trailing slash that the allowed list does not. FIX: "…advances/" → "https://www.marketsmedia.com/24-hour-u-s-equities-trading-advances"
  - The crypto line leaves out "with exceptions such as scheduled maintenance".
  - Low information gain in "Practical Rules for Trading Overnight".

---

## 2. wash-sale-rule-explained: FAIL

**Gate results**
- **(a) Answer first:** the intro answers "30 before and 30 after, 61 as arithmetic" and section 1 repeats it. Pass. The top PAA question is answered in the opener. The 61-day figure is correctly presented as arithmetic.
- **(g) Lengths:** title 40, guides.ts meta 157. OK.
- **Rhythm (HARD):** long-sentence runs at sentences 1–10 (intro), 52–62 and 80–93, with five consecutive sentences within 3 words at 6–10 (lengths [25, 25, 28, 26, 28]). The fixes below break most of these runs; re-measure.
- **Guard numbers:**
  - "15" is an invented dollar amount, $15, in a DRIP illustration. The row says "Do not invent any dollar illustration beyond the Pub 550 example", and DRIP is not in the fact list, so it must be omitted.
  - "32" is an inconsistent day count: "31 full days", "calendar day 32", "at least 32 days" and "31-day cooling-off" all appear.
  - The June 15 / August 14 window for a July 15 sale is correct derived arithmetic.

**Findings**
- **HARD, headline tell (colon splice) in title and meta:**
  - FIX title: "Wash Sale Rule Explained: 30 or 60 Days?" → "Wash Sale Rule Window Is 30 Days Before and After a Sale"
  - FIX meta: "…How the disallowed loss moves into your new basis, and why bots and AI agents can trigger it." → "The wash sale rule covers 30 days before and after a loss sale. The disallowed loss is added to your new shares' basis. Bots and AI agents can trigger it." (154 characters)
- **HARD, tee-up gate.** Sentence 2 finishes the 30-versus-60 answer, and there is no tee-up and no exemption note. The "At ModernWallet, we find that what readers get wrong most often…" line is licensed by `_experience.md`, but it sits in paragraph 2. FIX (row note): add `teeup-exempt: sentence 2 must finish the 30-vs-60 answer; the ModernWallet line serves as the anchor in paragraph 2`.
- **HARD, DRIP and sweeps are outside the fact list, the "growing challenge" trend is unsourced, and the intro is monotone:**
  - FIX introText paragraph 2, sentences 2–3 → "Buying replacement shares two weeks before you sell a losing lot disallows the loss just as buying them two weeks after does. Trading bots and AI agents make this easy to miss, because they can buy the stock back in a separate account without asking you."
- **ADVISORY:**
  - FIX: "Publication 550 illustrates this mechanism through a clear dated example." → "Publication 550's Example 1 shows the math." (Example 1 has no dates.)
- **HARD, overloaded 49-word sentence:**
  - FIX: "Similarly, preferred stock or corporate bonds … tied directly to the underlying common stock." → "Bonds or preferred stock are not ordinarily substantially identical to the same company's common stock. Convertible bonds or convertible preferred stock can be, depending on their relative values, price changes and other circumstances."
- **HARD, goes beyond the contested fact** (only Pub 550 was checked):
  - FIX: "The IRS has not issued definitive public rulings stating whether two funds tracking identical or overlapping market indexes, such as two separate funds tracking the S&P 500 from competing fund managers, qualify as substantially identical." → "Publication 550 does not say whether two funds that track the same index, such as two S&P 500 funds from different managers, are substantially identical."
- **HARD, weasel attribution:**
  - FIX: "Because no official safe-harbor list exists for fund pairs, conservative investors frequently choose replacement funds benchmarked to completely different market segments or asset classes when executing a [portfolio rebalancing](/guides/portfolio-rebalancing/) plan." → "Because no safe-harbor list exists for fund pairs, a replacement fund that tracks a different market segment carries less doubt; our [portfolio rebalancing](/guides/portfolio-rebalancing/) guide covers choosing one."
- **HARD, banned word plus unsourced reasoning:**
  - FIX: "A severe trap emerges if you purchase replacement shares inside an individual retirement account or a Roth IRA." → "The rule is harsher if you buy the replacement shares in an IRA or a Roth IRA."
  - FIX: "Crucially, the individual's basis in the IRA is not increased. Because retirement accounts do not track cost basis on internal holdings under regular capital gain rules, the disallowed loss disappears permanently rather than being deferred." → "The individual's basis in the IRA is not increased. Because that basis does not go up, you never recover the disallowed loss."
  - Split the 50-word Revenue Ruling sentence: "Revenue Ruling 2008-5, published in Internal Revenue Bulletin 2008-3, covers this case. If you sell stock at a loss and have your IRA or Roth IRA buy substantially identical stock within 30 days before or after the sale, the loss is disallowed under Section 1091." (Keep the existing link on "Revenue Ruling 2008-5".)
  - FIX heading: "Partial Share Matching and the Permanent IRA Penalty" → "Partial Share Matching and the IRA Trap" (the rule is a disallowance, not a penalty).
- **HARD, organisation named without a link (the CUSIP committee) and a 46-word overstatement:**
  - FIX: "sharing the exact same Committee on Uniform Securities Identification Procedures (CUSIP) number" → "sharing the same CUSIP number"
  - FIX: "If you sell a stock at a loss at one brokerage firm and buy it back within 20 days at another firm, your 1099-B tax statements will show zero disallowed losses, yet federal tax law still obligates you to disallow that loss on your tax return." → "If you sell a stock at a loss at one brokerage and buy it back two weeks later at another, your Form 1099-B may show no disallowed loss. Publication 550 says you still cannot deduct it."
- **HARD, section 5 paragraphs 2–3.** Problems: synonym cycling, a vague opener ("poses fresh operational friction"), the unsourced trend "retail investors increasingly…", DRIP, a meaningless 24-hour link, and "high-performing" hype.
  - FIX paragraph 2 → "The same gap applies when software buys for you. As explained in our breakdown of [Robinhood agentic trading](/guides/robinhood-agentic-trading-explained/), an AI agent can trade in its own account. If that agent buys a stock you sold at a loss in your main account within 30 days, you have a wash sale that neither account's Form 1099-B may flag."
  - FIX paragraph 3, first two sentences → "An agent trading in the [Robinhood 24 Hour Market](/guides/robinhood-24-hour-trading/) can make that purchase overnight, before you check your account. Robo-advisors that harvest tax losses raise the same question, and our [best robo-advisors roundup](/roundup/best-robo-advisors/) covers how each handles tax-loss harvesting." (Keep the "You remain personally responsible…" sentence.)
- **HARD, unparseable invented claim:**
  - FIX: delete "If you earned proceeds that were partly offset by unwashed positions, box 1g isolates only the disallowed segment."
  - FIX: "is incorrect due to split trades across unlinked accounts," → "is incorrect because the repurchase happened in another account,"
  - FIX: "Reviewing our general [tax tips guide](/guides/tax-tips/) can assist with recordkeeping organization before filing." → "Our [tax tips guide](/guides/tax-tips/) covers the records to keep before you file."
- **HARD, contradicts the fact list** (the bill excludes qualified stablecoins):
  - FIX: "Pending federal legislation could alter this framework for all digital assets." → "Pending federal legislation could extend the rule to most digital assets."
- **HARD, section 8: a rhetorical opener that sits badly with the "day traders are not exempt" item, hype, an unlisted fact, and banned words:**
  - FIX: "Active day traders often wonder if high transaction volume exempts them from the complexity of wash sales. Under [IRS Topic 429](…), retail day traders are fully subject…" → "Day traders are subject to the wash sale rule unless they make a mark-to-market election. [IRS Topic 429](https://www.irs.gov/taxtopics/tc429) says traders without that election remain subject to both the capital loss limits and the wash sale rules."
  - FIX: "Managing numerous intraday round trips … even if their net trading account balance fell." → "If you trade the same stock in and out many times, disallowed losses keep rolling into your newest shares, so your return can show taxable gains in a year your account balance fell."
  - FIX: delete "Under mark-to-market accounting, all positions open at the close … rather than capital gains." It is accurate per Topic 429 but not in the closed fact list. Keep it only if the orchestrator verifies it against tc429 and adds it to the list.
  - FIX: "Securing trader tax status requires meeting stringent IRS tests regarding trading frequency, intent, and market consistency, beyond retail thresholds like the [pattern day trader rule](/guides/pattern-day-trader-rule/)." → "Trader tax status is a separate question from the [pattern day trader rule](/guides/pattern-day-trader-rule/), which is a margin rule at your broker."
  - FIX: "registered dealers" → "dealers"
  - FIX: "Because qualifying for a Section 475(f) election carries severe procedural deadlines and long-term tax consequences, consulting a qualified tax professional is essential before electing this status." → "Talk to a tax professional before you make a Section 475(f) election."
- **HARD, section 9: day-count contradiction (guard "32"), an unsourced claim that a fund is not substantially identical (DO NOT STATE: no bright-line test), the invented $15 DRIP illustration (guard "15"), and "utilizing":**
  - FIX paragraph 1 → "The simplest way to stay clear is to wait until the 31st day after the sale to buy back; for a July 15 sale, that is August 15. Also make no purchase of the same stock in the 30 days before the sale. If you want to stay invested in the meantime, you can buy a different holding, such as a broad fund. Publication 550 gives no test for funds, so the facts-and-circumstances standard decides whether a replacement is substantially identical."
  - FIX paragraph 2 → "Automatic purchases count as purchases. If a recurring buy purchases more shares of the stock within 30 days of your loss sale, the matching rule disallows the loss on that many shares, so pause recurring buys of that stock around the sale."
  - FIX paragraph 3 → "If you run a trading bot or an AI agent, tell it not to buy any ticker you plan to sell at a loss, from 30 days before the sale until the 31st day after it. Once that window passes, check your trade log before you let it trade the ticker again."
- **HARD, DO NOT STATE-adjacent** (leaves out the retroactive date):
  - FIX FAQ crypto, last sentence → "However, tokenized securities are covered, and H.R. 10357, a bill approved by a House committee, would apply the rule to most digital assets sold after September 14, 2026, if enacted."
- **HARD, implies IRAs are excluded:**
  - FIX FAQ accounts: "Yes, the wash sale rule applies across every taxable account you own, as well as accounts owned by your spouse or a corporation you control." → "Yes. The wash sale rule applies across all your accounts, including IRAs, and to purchases by your spouse or a corporation you control."
- **ADVISORY:**
  - House Ways and Means has no allowed URL (see run-level Links note).
  - "citing Notice 2014-21" is attributed to the IRS digital-assets page, but the fact list attributes it to Pub 550.
  - The "ten months" holding-period illustration is correct derived logic and is not a dollar figure, so it is acceptable.

---

## 3. pattern-day-trader-rule: FAIL

**Gate results**
- **(a) Answer first:** the verdict is in intro sentence 1 but without the dates the answer placement asked for. Section 1 carries the timeline and a table. The $2,000 part of the answer only arrives in section 7 (advisory).
- **(g) Lengths:** title 47, meta 157. OK.
- **Rhythm:** passes.
- **Guards:** no untraced numbers flagged. The $2,000 figure is correctly described as the old Rule 4210(b) minimum.

**Findings**
- **HARD, headline tell (colon splice):**
  - FIX title: "Pattern Day Trader Rule: The 2026 FINRA Changes" → "Pattern Day Trader Rule Changes in 2026"
- **ADVISORY, answer placement:**
  - FIX introText sentence 1 → "The pattern day trader rule ended on June 4, 2026, at brokers that have switched to [FINRA's new intraday margin standards](https://www.finra.org/compliance-tools/weekly-archive/04152026), and other brokers have until October 20, 2027, to switch."
  - This also clears the HARD Links finding for FINRA's first mention being unlinked. For the SEC's first mention, link "Securities and Exchange Commission" in intro sentence 3 to `https://www.sec.gov/files/rules/sro/finra/2026/34-104572.pdf` and remove that link from section 1.
- **HARD, experience claim not licensed plus a sentence nobody would say aloud:**
  - FIX: "At ModernWallet, we track retail trading rules so self-directed investors understand exactly how regulatory shifts change their daily execution limits." → "At ModernWallet, every guide we write starts from the rule you will actually hit, and for day traders that rule now depends on when your broker switches."
- **HARD, Title Case ("under" is not a minor word):**
  - FIX: "Requirements under the Former Day Trading Margin Framework" → "Requirements Under the Former Day Trading Margin Framework"
  - FIX: "The New Intraday Margin Standard under Rule 4210" → "The New Intraday Margin Standard Under Rule 4210"
- **HARD, contradicted fact.** The rule cut buying power from 4x to 2x, not to "two times maintenance margin", and the 90-day limit ended early if the call was met:
  - FIX: "the broker reduced day-trading buying power to two times maintenance margin and issued a day-trading margin call." → "the broker cut day-trading buying power from four times to two times for equity securities and issued a day-trading margin call."
  - FIX: "Failing to meet the call forced the broker to restrict the account to trading strictly on a cash-available basis for 90 days." → "A customer who missed the call could trade only on a cash-available basis for 90 days or until the call was met."
- **ADVISORY, not in the fact list:**
  - FIX: "If equity dipped below $25,000, day trading buying power was restricted." → "If equity fell below $25,000, the customer had to deposit enough to restore it before day trading again."
- **HARD, banned word:**
  - FIX section 3: "Crucially, Regulatory Notice 26-10 includes" → "Regulatory Notice 26-10 includes"
- **ADVISORY, invented expansion of "IML":**
  - FIX: "on each day an intraday-margin-reducing transaction occurs" → "on each day with what the rule calls an "IML-reducing transaction""
- **HARD, generic stand-in for Robinhood's name, plus "day trade counters" (not in the facts):**
  - FIX: "confirms that the platform removed day trade counters, day trade restrictions, and existing pattern day trader flags on June 4, 2026." → "says Robinhood removed day trade restrictions, day trade calls and existing pattern day trader flags on June 4, 2026."
- **HARD, overloaded sentence:**
  - FIX: "E*TRADE computes day-trading access using real-time intraday margin excess, mandates that intraday margin deficits be satisfied within five days, and notes that three violations within a rolling 12-month period can trigger a 90-day trading restriction." → "E*TRADE bases intraday buying power on real-time intraday margin excess. An intraday margin deficit there is due five days after issuance, and three violations in a rolling 12 months may bring a 90-day restriction."
- **HARD, stated with too much certainty** (the fact list says only "might continue"), plus a dangling modifier:
  - FIX: "When evaluating choices like [Robinhood vs. Fidelity](…) or [Robinhood vs. Webull](…), check each broker's specific margin agreement directly in your account portal. Firms that have not yet converted internal systems still flag accounts…until their technical rollout concludes." → "If you are comparing brokers, as in [Robinhood vs. Fidelity](/compare/robinhood-vs-fidelity/) or [Robinhood vs. Webull](/compare/robinhood-vs-webull/), ask each one whether it has switched. A broker that has not switched may still designate you a pattern day trader after four or more day trades in five business days (if they exceed 6% of your trades) and require $25,000 in equity to keep day trading."
- **HARD, misstates the freeze and invents a violations rule:**
  - FIX: "Freeriding violates Regulation T and obligates the brokerage to freeze the account for 90 days, during which time the investor must hold settled cash before initiating any buy order." → "Freeriding violates Regulation T and may require the broker to freeze the account for 90 days; during the freeze you can still buy, but you must pay in full on the trade date."
  - FIX: delete "Accumulating multiple settlement violations leads to automated restrictions on cash trading, regardless of account balance."
  - FIX: "remains governed by Federal Reserve Regulation T" → "remains governed by Regulation T" (the Federal Reserve is named without a link and is not in the fact list).
- **ADVISORY:** "Consequently, the replacement of Rule 4210 day trading margin rules applies solely to margin accounts." restates the section's first sentence; delete it.
- **HARD, section 6.** Problems: "significant"; the "What matters is" cleft construction; synonym cycling (tools / script / systems / routing); "retired 2001 standard", which contradicts the transition period; "account freezing after the fourth trade", which is wrong because the fourth trade triggered the designation, not a freeze; and "freely", which edges toward the DO NOT STATE item about unlimited day trading.
  - FIX paragraph 1 → "Dropping the day-trade count matters most for trading bots and AI agents, which can make many round trips in a day. Under the old rule, a bot's fourth day trade within five business days (if day trades were over 6% of the account's trades) made the account a pattern day trader, and below $25,000 in equity it could not keep day trading."
  - FIX paragraph 2 → "At a broker that has switched, the number of trades no longer triggers anything. The new standard asks whether the positions an agent opens during the day leave an intraday margin deficit, and Robinhood says it monitors accounts in real time to stop activity that would create or increase one. Our guide to [Robinhood agentic trading](/guides/robinhood-agentic-trading-explained/) explains how the agents place trades. If an agent also trades in the [Robinhood 24 Hour Market](/guides/robinhood-24-hour-trading/), its orders land in thinner overnight trading, so leave room in your margin equity for a price move."
- **HARD, banned words plus "statutory"** (Rule 4210 is a FINRA rule, not a statute):
  - FIX: "While FINRA eliminated trade counting, several critical trading rules remain untouched. Most notably, the statutory $2,000 minimum equity requirement for any margin account still applies." → "Several rules did not change. The $2,000 minimum equity for any margin account still applies."
- **HARD, sentence does not follow from the one before:**
  - FIX: "Investors comparing [ordinary income vs. capital gains tax](…) must track every executed order." → "Our [ordinary income vs. capital gains tax](/compare/ordinary-income-vs-capital-gains-tax/) comparison shows the rate difference."
- **ADVISORY:** the tax-rate claim is not in the fact list but the row licenses it.
- **HARD, vague closing sentence, a verify instruction with no link, and "your next trade" assumes the reader trades:**
  - FIX final paragraph → "Day trading on margin can lose money quickly, and the new standard does not change that. Robinhood's rules are on its [pattern day trading support page](https://robinhood.com/us/en/support/articles/pattern-day-trading/)."
  - If you use this fix, drop that link from section 4 so it appears only once, or make this one plain text.
- **HARD, FAQ answers:**
  - FIX FAQ Robinhood: "Robinhood removed its pattern day trading flags, trade counting tools, and day trade restrictions on June 4, 2026." → "Robinhood says it removed day trade restrictions, day trade calls and existing pattern day trader flags from margin accounts on June 4, 2026."
  - ADVISORY, FIX FAQ cash: "Cash accounts remain governed by Regulation T settlement rules, which prohibit freeriding and good faith violations." → "Regulation T prohibits freeriding in a cash account, and FINRA warns that selling a security bought with unsettled funds can cause a good faith violation."
- **ADVISORY:** NYSE and NASD are named without a link and have no allowed URL (see run-level Links note).

---

## Summary
- robinhood-24-hour-trading: FIX-IN-PLACE (25). Unlicensed "we track" claim, invented dollar spread, a 4–7 AM "gap" that contradicts the disclosure, contested "all account types" stated as settled, synonym cycling in the agents section, duplicate disclosure link, outdated PDT advice; re-measure rhythm.
- wash-sale-rule-explained: FIX-IN-PLACE (27). Invented $15 DRIP example and DRIP not in the fact list, 31/32-day contradiction, an unsourced "fund is not substantially identical" claim, "Crucially/utilizing/essential/severe/massive", an unlisted mark-to-market sentence, headline tells in title and meta; re-measure rhythm.
- pattern-day-trader-rule: FIX-IN-PLACE (21). Wrong "two times maintenance margin", invented violations and freeze rules, "the platform" in place of Robinhood, the "What matters is" construction and synonym cycling in section 6, "Crucially/critical/notably/statutory", Title Case "under" on two headings, FINRA and SEC first mentions unlinked.
- Run level: add `register: operator` to chart rows 3, 7 and 8, and decide on a links exemption for the organisations that have no allowed URL.