# Approved Page Assignment: `/compare/bonds-vs-bond-funds` (`bonds-vs-bond-funds`)
- **Action ID:** `A1` (create new content)
- **Title:** Bonds vs Bond Funds: Which Fits Your Money and Goal
- **Page Type / Format / Medium:** comparison | comparison table/database - head-to-head comparison with finite rows, no sourced inputs for a calculator | text + comparison table
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Should I buy individual bonds or a bond fund? [PAA 0/4 on-topic; 4/4 off-topic: yield, FD, Buffett, 60/40; ac 7/29 question completions: should i buy bonds or bond funds, which is better bonds or bond funds (pick pattern)]
- **Working Answer (Col 11):** Pick: individual bonds fit a known date and a hold-to-maturity plan because you get par back at maturity unless the issuer defaults; a bond fund fits small, diversified, ongoing buying because it has no maturity date and its price moves with rates. Shape: pick with boundary.
- **Answer Placement (Col 12):** Section 1: Bonds vs Bond Funds at a Glance

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent (brief candidate). 'bonds vs bond funds': 480/mo KD 6 (DataForSEO 2026-11-23, us). lookup: no same-intent page; Closest existing: /compare/stocks-vs-bonds (asset-class question), /compare/i-bonds-vs-tips (two specific bond types), /guides/what-is-an-index-fund. SERP: Page one: advisors.vanguard.com, schwab.com, bogleheads.org, fidelity.com, ssga.com, with YouTube and justanswer; AI Overview present citing brokers and Reddit. No regulator-sourced neutral comparison table.
- **Keyword Evidence:** "Primary 'bonds vs bond funds': 480/mo KD 6 (DataForSEO 2026-11-23, us). Provider: DataForSEO (SEMRUSH HTTP 403), source=dataforseo, kd_source=dataforseo (modeled KD, hint only), checked 2026-11-23, us. Autocomplete corroborated. Raw: research/keyword-volumes.json."
- **Why New Page / Angle:** Closest existing: /compare/stocks-vs-bonds (asset-class question), /compare/i-bonds-vs-tips (two specific bond types), /guides/what-is-an-index-fund. None answers bond-vs-fund structure. No commits name the topic. Same-run overlap with dropped candidate 4 is only a lexical 0.5.
- **Intent-Based Our Takeaway:** "Choose individual bonds when you need a specific amount on a specific date and can hold to maturity; choose a bond fund for diversified, flexible, small-increment exposure and accept no maturity date. Condition that changes it: holding a fund longer than its duration or buying bonds of a single weak issuer."

## Approved Section Outline
1. **Bonds vs Bond Funds at a Glance** — Direct pick and the break-even condition in the opener, plus the comparison table
2. **How Individual Bonds Work** — Par value, coupon, maturity, credit and call risk, sourced to investor.gov and FINRA
3. **How Bond Funds Work** — Pooled portfolio, no maturity date, NAV and fees, per SEC mutual fund guidance
4. **What Happens When Interest Rates Rise** — Price falls for both; bond holder can wait to maturity, fund holder has no such date
5. **Costs, Minimums and Diversification** — Fund expense ratio vs dealer markups, reported only as the sources state
6. **Who Should Choose Each Option** — Who this is not for; what would change our answer
7. **FAQs** — Only on-topic questions; off-topic PAA excluded

## Approved Internal Outbound Links
- {"source": "/compare/bonds-vs-bond-funds", "target": "/compare/stocks-vs-bonds", "section": "Who Should Choose Each Option", "anchor": "stocks vs bonds", "purpose": "Next decision after choosing bonds", "inspection": {"path": "src/data/comparisons.ts", "sha256": "5fbfddf76c7e6113bc68a502f95238e4533005b3c528ca1454730da13235ea0c"}}
- {"source": "/compare/bonds-vs-bond-funds", "target": "/guides/what-is-an-index-fund", "section": "How Bond Funds Work", "anchor": "what an index fund is", "purpose": "Fund mechanics background", "inspection": {"path": "src/data/guides.ts", "sha256": "3638adebd451ee9633720fca87a1ca10118dbc942f64d4139677d001c173d76f"}}

## Reviewer Guardrails (Must Respect)
- CR1-A3-QTAG (substantive): Run autocomplete.py --mode questions for 'ssdi vs ssi' and 'difference between ssdi and ssi', retag as '[PAA 0/0; ac n/m question completions: what is ssdi and ssi difference ...]' (difference/pick pattern), keep action.reader_question and brief readerAndAnswer.question identical, and rerun cases-batch retrieval with the exact new string. Same sweep for A1 and A2 so 'ac corroborated' means the question sweep.
- CR1-OVERDEFER (substantive): Not a blocker for this run (unattended, no BUILD round 2). Keep the defers but reword the exclusions to say capturable statute/regulation primaries exist and the candidates carry forward with those URLs; 8 and 10 are next-run candidates with 1,000 and 390 per month demand.
- CR1-A1-BONDFUND-SOURCES (substantive): WRITE must restrict fund-side claims to what ig-mutual-funds.txt (bond fund definition sentence, NAV, fees) and finra-bonds.txt (bonds and bond funds diversify, prices fluctuate) literally state, or capture the FINRA bond-funds page (HTTP 200 at finra.org/investors/learn-to-invest/types-investments/bonds/bond-funds) before drafting. State that interest-rate price falls apply to both.
- CR1-A1-COUNTEREXAMPLE (substantive): Phrase 'most bond funds have no set maturity date', add call risk and secondary-market markup to the opener or table, and keep unsupported fund specifics out of the first answer. Also all PAA were off-topic (0/4), a keyword-intent flag: keep the FAQ to sourced on-topic questions only.
- CR1-A2-BASIS-OVERSTATE (substantive): Condition the opener, table and takeaway: spouse versus non-spouse, contribution rule, community-property exception under 1014(b)(6) only if sourced. Do not present either form as the tax winner.
- CR1-A2-STATE-LAW (substantive): Cite the Florida edition date, label Florida as one state's example, drop or flag as state-specific any creditor, partition, mortgage or property-tax claim without a captured source, include the tenancy-by-the-entirety note that 689.15 itself states, and keep the not-legal-advice disclaimer at the bottom only.
- CR1-A3-UNIVERSAL-NEGATIVE (substantive): Phrase as 'the SSDI eligibility rules in 20 CFR 404.315 and 404.130 contain no resource limit' or capture a sourced statement; support concurrent benefits with a captured section (for example 20 CFR 416.2 or 416.1100 context) or hedge it. Note SSA.gov was inaccessible and tell readers to confirm amounts with SSA. Keep dollar amounts limited to the linked existing pages.
- REQ-1 (requestCoverage): All 11 candidates are dispositioned with DataForSEO volume/KD in readiness.md and manifest exclusions; the 2 duplicate drops (3,4) and 3 weak-demand drops (5,7,11) verified legitimate. Defers 1, 8, 10 are not sound: capturable primaries exist (see CR1-OVERDEFER), so disposition is incomplete rather than wrong in direction.
- CR1-A3-QTAG: Question-evidence tag misstates the evidence: '[verb-only - no PAA, no completions]' while saved data shows 10 and 7 autocomplete completions and a question sweep returns on-intent completions.
- CR1-OVERDEFER: Deferrals of Visa vs Mastercard, Medicare Part A vs B and fixed vs variable student loans rest on failed vendor/agency URLs, while capturable primaries exist (LII 42 CFR 406/407, 20 USC 1087e, 34 CFR 685.202; federalreserve.gov Reg II, 12 CFR 1005.6/226.12, justice.gov Visa case).
- CR1-A1-BONDFUND-SOURCES: Bond-fund side has no real primary capture (glossary shell, bulletin 404, SEC 403, FINRA 404); readiness claims investor.gov and FINRA primaries inspected for the fund side.
- CR1-A1-COUNTEREXAMPLE: Opener states bond funds have no maturity date and bonds return par at maturity unless default; omits defined-maturity funds, call risk and dealer markup/liquidity, which finra-bonds.txt does state.
- CR1-A2-BASIS-OVERSTATE: Top answer says federal basis at death 'differs' between the two forms without conditions; for spouses 2040(b) includes one-half either way and 1014 steps up that half, so the difference mainly concerns non-spouse co-owners and contribution tracing (Pub 551 John and Jim example).
- CR1-A2-STATE-LAW: Florida 689.15 is captured from the 2024 edition and supports only the survivorship default; the section 'Selling, Borrowing and Creditors' and PAA 'Who pays taxes on joint tenancy?' have no captured source (CA 683 and NY RPP 240 returned 403, also on Justia).
- CR1-A3-UNIVERSAL-NEGATIVE: 'SSDI has no resource test' and 'can qualify for both' are stated from source silence; 20 CFR 404 text captured does not itself say there is no resource test, and concurrent eligibility is not in the captured sections. Resource limit table captured ends at Jan. 1, 1989 row ($2,000/$3,000).
- CR1-READINESS-ACCURACY: Readiness and A1 evidenceFiles list inspected sources that were failed captures (ig-bond-funds-*, sec-ib-bondfunds, finra-bond-funds) or omit them, and say 'primaries captured' for the fund side.

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"reported"` (no executed calculation/model/test in `evidence.json`): attribute all figures strictly to their published vendor/benchmark primary sources. NEVER write `"In our internal cost modeling"`, `"In our internal testing"`, `"we modeled"`, or `"we tested"` on a `"reported"` basis packet (only cite anonymized approved client `caseUses` or durable reader-survey facts when explicitly populated below).
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-write",
  "route": "/compare/bonds-vs-bond-funds",
  "readerQuestion": "Should I buy individual bonds or a bond fund? [PAA 0/4 on-topic; 4/4 off-topic: yield, FD, Buffett, 60/40; ac 7/29 question completions: should i buy bonds or bond funds, which is better bonds or bond funds (pick pattern)]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/approval-manifest.json",
      "sha256": "742964215dddbcd4f15c21e1a45ee47aba86954b4c200f5a277badd9b1cfb2b7"
    },
    "review": {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/chart-review.json",
      "sha256": "49cd0e187872eaea82e7107ba5e17320b8eb87b69d4b54de03083f7ad38a65ff"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "Opening answer in section 1, comparison table directly after",
    "reason": "The reader needs a side-by-side on finite, sourced dimensions; a table lets them compare without interaction",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "Sourced facts are finite and state/year specific; no defensible adjustable-input model, so a static table answers faster"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static scannable layout answers faster without decorative motion"
    }
  },
  "basis": "reported",
  "decisionGap": "Top results are broker or forum pages. A reader cannot find a neutral side-by-side that says what each choice does at maturity, under rising rates, on cost and on diversification, tied to Investor.gov and FINRA text.",
  "finding": "Individual bonds fit a known date: if held to maturity the holder gets face value plus interest unless the issuer defaults or calls the bond. Most bond funds have no set maturity date, so a fund holder has no such date to wait for, and both lose price when interest rates rise. A bond fund fits small, diversified, ongoing buying; individual bonds fit a fixed date and a hold-to-maturity plan.",
  "conditions": "Individual bonds: return of face value at maturity requires holding to maturity and issuer paying (credit risk) and not calling the bond early (call risk); selling early can return more or less than face value; most bond purchases through a broker include a markup or markdown. Funds: price per share moves with the value of the holdings; fund fees and expenses vary widely; funds are not FDIC-insured and can lose money; check the fund's prospectus for its own terms.",
  "whatWouldChange": "Needing the money before a bond matures (price risk applies to the bond too); a fund's fees being high versus the dealer markup on a small bond purchase; owning one weak issuer's bonds instead of a diversified pool; a fund with its own stated end date in its prospectus.",
  "caseSelection": {
    "path": "reports/mindmap-pass/runs/2026-11-23-comparison/evidence/bonds-vs-bond-funds/cases.json",
    "sha256": "5f5996a5bce8baddf1e5dee76136ba2952f7f58b2010c9e1cd24be1ba5a473ed"
  },
  "caseDecisions": "Retrieved 8 (A2/A3) and 0 (A1) approved records via mindmap-gates cases with the exact approved reader_question. All retrieved records are other-business client/owned-property records (DIY repair, indoor air, bowling, blockchain, HOA boards, law-firm intake, Cuba briefings) with no honest topical overlap with this personal-finance/benefits/estate comparison; all rejected, none used. No client or experience claim is made on this page (anchor-exempt: source-only reported comparison, no honestly fitting proprietary record).",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/brief.md",
      "sha256": "93324e15e4df9c9c78137d371103cff8463eecba7702e674a4c8cca9221b8ac5"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/coverage-lookup.txt",
      "sha256": "be22c192a76f7f2114553495b537d81627904d206567bea7b4ec64118bd0a8dd"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/keyword-volumes.json",
      "sha256": "4f70395595f0341b4a880d938eca5e207e14ce2f5a695efa5a5eb0eb7e64780c"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/serp.json",
      "sha256": "c61106da76e5a9a44cb5fcfa9f5a7d33e5f17be49159d2a5fb196ca3f8e3cf66"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/kw-status.json",
      "sha256": "6ae183adb299df5fb3997cc3655d76db9cdb915668491376346adae263b9abee"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ig-bonds.txt",
      "sha256": "3f222fde33ab5a84bfe36bce3b5909b73741807a6ad6e9c438ff605edc333d9e"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ig-mutual-funds.txt",
      "sha256": "7545b2b45ac4c9a9d9983d272a708fe683adf227a8f0235e4922b5c9610b9658"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/finra-bonds.txt",
      "sha256": "4fb37fddb9d10dd833c628ef03edf911d3862bab7fa0d33cb4d3177a2360c83a"
    }
  ],
  "whyNoQuantitativeAnalysis": "The decision is a rules-and-structure comparison on finite attributes. The primary texts answer it directly and there are no defensible sourced inputs for a model (state, year and personal-facts dependent). Arbitrary arithmetic would not add value, so the source-only reported branch applies.",
  "reasoning": "Investor.gov states a bond is repaid at par at maturity, and 'If bonds are held to maturity the investor will receive the face value, plus interest. If sold before maturity, the bond may be worth more or less than the face value.' It also lists credit, interest rate, inflation, liquidity and call risk. FINRA says the vast majority of bonds have a maturity date set at issue, defines a bond fund as a mutual fund or ETF that invests in bonds, says funds charge fees that 'can vary widely', and says 'when you invest in bonds and bond funds, you face the risk that you might lose money'. Investor.gov says mutual fund shares are redeemed at the next calculated net asset value (NAV) and are not FDIC-insured. A fund holder's exit is therefore a sale at NAV, not repayment of par on a date: this is why 'most bond funds have no set maturity date' (reviewer-approved wording; FINRA's 'average maturity' definition describes the average time for a fund's holdings, not a date the fund repays you). FINRA's brokerage-compensation text supports markup and markdown on bond trades. Together these support the pick: individual bonds for a known date and hold-to-maturity plan; a bond fund for small, diversified, ongoing buying; both fall in price when rates rise.",
  "counterexample": "A bond fund can beat individual bonds for a small saver: Treasury bonds and notes are sold from $100 denominations and savings bonds from $25 (FINRA), yet corporate and municipal bonds trade through broker-dealers that may add a markup, and agency securities generally need $10,000 minimum, so a small diversified portfolio of individual bonds may be impractical. Conversely, a fund holder cannot lock in return of par on a date, and a single-issuer bond holder carries concentrated credit risk. Call risk and dealer markup mean 'hold to maturity gets par back' is conditional.",
  "unknowns": [
    "Specific fund expense ratios, current yields, durations and defined-maturity fund terms are not in the captured sources and must not be stated.",
    "The FINRA Bonds page was captured at its investment-products URL; the finra.org bond-funds URL returns the same Bonds page, so no extra FINRA facts exist.",
    "Investor.gov bond-fund glossary and bulletin captures contain no usable text (empty glossary body, 404 bulletin); SEC bond-fund PDF returned 403. None of these may be cited."
  ],
  "selectedMedium": "text + comparison table (resolved from approved presentation: interaction not-useful, animation not-useful)",
  "method": "Reported: read Investor.gov Bonds FAQs, Investor.gov Mutual Funds page and FINRA Bonds page (captured 2026-11-23 UTC), extract verbatim statements, and map each to a comparison row.",
  "findings": [
    {
      "label": "reported",
      "text": "Held to maturity, a bond returns face value plus interest; sold early it may be worth more or less (Investor.gov Bonds FAQs)."
    },
    {
      "label": "reported",
      "text": "A bond fund is a mutual fund or ETF that invests in bonds and charges fees and expenses that vary widely (FINRA)."
    },
    {
      "label": "reported",
      "text": "Rising rates push bond prices down for every bond, and bonds and bond funds can lose money (FINRA)."
    },
    {
      "label": "reported",
      "text": "Bond buys through a broker-dealer may carry a markup or markdown; fund purchases carry fees paid indirectly through NAV (FINRA; Investor.gov)."
    },
    {
      "label": "unknown",
      "text": "Whether a given fund has a defined end date, its fees or its duration: read its prospectus."
    }
  ],
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [
      "research/sources/ig-bonds.txt",
      "research/sources/ig-mutual-funds.txt",
      "research/sources/finra-bonds.txt"
    ],
    "scopeAndLimits": "Statements are limited to what Investor.gov and FINRA text literally say; 'most bond funds have no set maturity date' is a reviewer-approved inference from NAV redemption plus FINRA's average-maturity definition, stated with the prospectus caveat.",
    "publicMethod": "Each table cell and paragraph names Investor.gov or FINRA beside the finding with a deep link.",
    "placement": "Opening answer, table cells, and takeaway"
  },
  "takeaway": {
    "conclusion": "Choose individual bonds when you need a specific amount on a specific date and can hold to maturity; choose a bond fund for diversified, small-increment, ongoing buying and accept that most funds have no set maturity date.",
    "appliesTo": "Savers deciding the vehicle after choosing to hold bonds; not personalized advice.",
    "basis": "reported (Investor.gov, FINRA)",
    "changesIf": "You may need the money before maturity, the issuer is a single weak credit, a callable bond is called early, or the fund's fees exceed the markup on your purchase."
  },
  "closedFacts": [
    {
      "id": "IGB-1",
      "source": "Investor.gov Bonds FAQs",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds",
      "text": "A bond is a debt security, like an IOU. When you buy a bond, you are lending to the issuer, which may be a government, municipality, or corporation. In return, the issuer promises to pay you a specified rate of interest during the life of the bond and to repay the principal, also known as face value or par value of the bond, when it 'matures,' or comes due after a set period of time."
    },
    {
      "id": "IGB-2",
      "source": "Investor.gov Bonds FAQs",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds",
      "text": "If the bonds are held to maturity bondholders get back the entire principal, so bonds are a way to preserve capital while investing. Bonds typically pay interest on a regular schedule, such as every six months."
    },
    {
      "id": "IGB-3",
      "source": "Investor.gov Bonds FAQs",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds",
      "text": "Interest rate risk: Interest rate changes can affect a bond's value. If bonds are held to maturity the investor will receive the face value, plus interest. If sold before maturity, the bond may be worth more or less than the face value. Rising interest rates will make newly issued bonds more appealing because the newer bonds will have a higher rate of interest than older ones. To sell an older bond with a lower interest rate, you might have to sell it at a discount."
    },
    {
      "id": "IGB-4",
      "source": "Investor.gov Bonds FAQs",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds",
      "text": "Credit risk: The issuer may fail to timely make interest or principal payments and thus default on its bonds. Call risk: The possibility that a bond issuer retires a bond before its maturity date, something an issuer might do if interest rates decline, much like a homeowner might refinance a mortgage. Liquidity risk: the risk that investors won't find a market for the bond, potentially preventing them from buying or selling when they want. Inflation risk: inflation reduces purchasing power, a risk for investors receiving a fixed rate of interest."
    },
    {
      "id": "IGB-5",
      "source": "Investor.gov Bonds FAQs",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds",
      "text": "U.S. Treasuries are issued by the U.S. Department of the Treasury and carry the full faith and credit of the U.S. government. Municipal bond interest generally is exempt from federal income tax and also may be exempt from state and local taxes for residents of the issuing state."
    },
    {
      "id": "FIN-1",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "Bonds and bond funds can help diversify your portfolio. Bond prices fluctuate, although they tend to be less volatile than stocks. When interest rates rise, bond prices tend to fall, and vice versa."
    },
    {
      "id": "FIN-2",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "The vast majority of bonds have a maturity date that's set when the bond is issued. On a bond's maturity date, the borrower fulfills its debt obligation by paying bond holders the final interest payment and the bond's face value, called par value. Not all bonds reach maturity. Callable bonds, which allow the issuer to retire a bond before it matures, are common."
    },
    {
      "id": "FIN-3",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "A bond fund is a mutual fund or exchange-traded fund that invests in bonds. These funds can contain all of one type of bond (municipal bonds, for instance) or a combination of bond types. Each bond fund is managed to achieve a stated investment objective. Like most investments, bond funds charge fees and expenses that are paid by investors. These costs can vary widely from fund to fund and across share classes."
    },
    {
      "id": "FIN-4",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "In the majority of bond transactions, a brokerage firm acts as principal, selling you a bond it already owns. When a brokerage firm sells you a bond in a principal capacity, it may increase or mark up the price you pay over the price the firm paid to acquire the bond. If you sell a bond, the firm may offer you a price that includes a markdown. The markup or markdown is the brokerage firm's compensation. If the firm acts as agent, you may be charged a commission, which will appear on your trading confirmation."
    },
    {
      "id": "FIN-5",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "Treasury bonds can be bought in denominations of $100 through an account at a brokerage firm or commercial bank, or directly from the U.S. government through auctions. Savings bonds (EE and I bonds) can be purchased electronically for as little as $25 through TreasuryDirect. Corporate and municipal bonds can be purchased through full-service, discount or online brokerage firms and through investment and commercial banks. Most agency bonds are sold in a variety of increments, generally requiring a minimum initial investment of $10,000."
    },
    {
      "id": "FIN-6",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "Bond funds can be bought and sold through an investment professional, your brokerage firm's website or app, or the fund directly. If you work with an investment professional, the choice of bond funds is limited to those the brokerage firm allows its professionals to sell."
    },
    {
      "id": "FIN-7",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "Selling Before the Maturity Date: If you sell a bond before it matures, you may not receive the full principal amount of the bond and won't receive any remaining interest payments. The price you receive will depend on where the bond is currently trading on the secondary market, which may be more or less than the principal and remaining interest the issuer would be required to pay you if you held to maturity."
    },
    {
      "id": "FIN-8",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "Risks: when you invest in bonds and bond funds, you face the risk that you might lose money. Interest Rate Risk: changes in interest rates may reduce, or increase, the market value of a bond you hold. Call Risk: the risk that a bond may be redeemed by an issuer when interest rates are falling; investors can avoid call risk by purchasing non-callable bonds. Credit Risk: most bonds other than U.S. Treasury securities face some degree of credit risk, often indicated by a credit rating. Duration Risk: duration, stated in years, signals how much the price of your bond investment is likely to fluctuate when interest rates move; the higher the duration number, the more sensitive the investment."
    },
    {
      "id": "FIN-9",
      "source": "FINRA Bonds (key terms)",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "Average maturity is the average time that a mutual fund's bond holdings will take to be fully payable. Interest rate fluctuations have a greater impact on the price per share of funds holding bonds with longer average lives."
    },
    {
      "id": "FIN-10",
      "source": "FINRA Bonds",
      "url": "https://www.finra.org/investors/investing/investment-products/bonds",
      "text": "The tax rules that apply to bonds are complicated. Whether or not you will need to pay taxes on a bond's interest income (coupons) or a bond fund's dividends often depends on the entity that issued the bond. You might want to check with your tax advisor about the tax consequences before you invest."
    },
    {
      "id": "IGM-1",
      "source": "Investor.gov Mutual Funds",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1",
      "text": "A mutual fund is an SEC-registered open-end investment company that pools money from many investors. Each mutual fund share represents an investor's part ownership of the mutual fund's portfolio and the gains and losses the portfolio generates. Bond funds or income funds invest primarily in bonds or other types of debt securities. A bond fund may concentrate its investments in a particular type of bond or debt security or a mixture of types. The securities that bond funds hold will vary in terms of risk, return, duration, volatility and other features."
    },
    {
      "id": "IGM-2",
      "source": "Investor.gov Mutual Funds",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1",
      "text": "Diversification: Mutual funds may invest in a range of companies and industries rather than investing in one specific stock or bond. This helps to lower your risk if one company fails. Low Minimum Investment: many mutual funds set a relatively low dollar amount for initial investment and subsequent purchases. Liquidity: mutual fund investors can readily sell their shares back to the fund at the next calculated net asset value (NAV) on any business day, minus any redemption fees."
    },
    {
      "id": "IGM-3",
      "source": "Investor.gov Mutual Funds",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1",
      "text": "Dividend payments: a fund may earn income from its portfolio, for example interest on bonds. The fund then pays the shareholders nearly all the income, less expenses, as a dividend payment. Dividends or interest payments may also change as market conditions change."
    },
    {
      "id": "IGM-4",
      "source": "Investor.gov Mutual Funds",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1",
      "text": "Mutual funds are not guaranteed or insured by the FDIC or any other government agency. They all carry some level of risk. You may lose some or all of the money you invest because the investments held by a fund can go down in value."
    },
    {
      "id": "IGM-5",
      "source": "Investor.gov Mutual Funds",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1",
      "text": "Funds pass along their costs to investors by deducting fees and expenses from NAV, so you pay the fees and expenses indirectly. Even small differences in fees can mean large differences in returns over time. A fund with high costs must perform better than a low-cost fund to generate the same returns for you."
    },
    {
      "id": "IGM-6",
      "source": "Investor.gov Mutual Funds",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1",
      "text": "Before investing in a mutual fund, you should carefully read the fund's available information, including its prospectus and most recent shareholder report, which are available on the SEC's website and the fund's website, free of charge."
    },
    {
      "id": "INF-1",
      "source": "Reviewer-approved inference (CR1-A1-COUNTEREXAMPLE)",
      "url": null,
      "text": "Most bond funds have no set maturity date. Basis: fund shares are redeemed at NAV (IGM-2), not repaid at par on a date, and FINRA defines only an 'average maturity' of a fund's holdings (FIN-9). Present as: 'Most bond funds have no set maturity date' and send the reader to the fund's prospectus (IGM-6) for that fund's own terms. Do not name any fund or give any fund statistic."
    }
  ],
  "internalLinksAllowed": [
    "/compare/stocks-vs-bonds/",
    "/guides/what-is-an-index-fund/",
    "/compare/i-bonds-vs-tips/"
  ],
  "faqPlan": [
    "What is the difference between a bond and a bond fund?",
    "Do bonds or bond funds lose value when interest rates rise?",
    "Do bond funds charge fees?",
    "Which is easier to buy in small amounts?",
    "Do you get your money back at maturity with a bond fund?",
    "Can you lose money in individual bonds?"
  ],
  "faqNote": "PAA were 0/4 on-topic (off-topic: yield, FD, Buffett, 60/40): FAQ uses only the sourced questions above; do not answer yield, fixed deposit, Buffett or 60/40 questions.",
  "caseUses": [],
  "exclusions": [
    "_experience.md section G excludes financial, legal and professional services from any 'we tested' claim: TESTED format disabled, no testing/howWeTested/tested schema or byline.",
    "Basis is reported: never write 'In our internal testing/modeling/analysis', 'we tested' or 'we modeled'. Attribute each finding to the named primary source ('Investor.gov says...', 'Section 689.15 provides...').",
    "Disclaimer (general information, not legal/tax/investment advice) goes at the bottom only. No named-reviewer or professional-review claim."
  ],
  "growth": {
    "path": "reports/mindmap-pass/runs/2026-11-23-comparison/evidence/bonds-vs-bond-funds/growth.json"
  }
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/runs/2026-11-23-comparison/brief.md`
```
Source: comparison candidate miner for https://www.themodernwallet.com. Each item is an X-vs-Y, alternatives, successor-vs-predecessor or objective roundup candidate mined from entities this site already covers, and already checked against the site's pages: NEW = no page covers it; PARTIAL = an existing page covers it in passing (enrich that page, never a duplicate). Comparison rows use the `comparison table/database` format; roundups are objective and the business is never a ranked option (`.claude/commands/_roundup-blend.md` §3).
Unattended run: save the chart to `reports/mindmap-pass/2026-11-23-comparison.md` (this exact name, so it never collides with another mindmap run today), treat the Phase 0 manifest as approved, and continue to Phase 9 without stopping.
Topic-selection priority: realistic organic-click growth; do not infer a lead-generation goal.
Cache: candidates in reports/comparison-content-creator/cache.json (dropped/published) were excluded before this list; do not re-add them. Chime vs SoFi, Acorns vs Robinhood, Webull vs Fidelity etc. are cached.

Candidates (format / A / B / segment / primary keyword / proposed slug / coverage):
1. versus | Visa | Mastercard | general | visa vs mastercard | visa-vs-mastercard | NEW
2. versus | SSDI | SSI | benefits | ssdi vs ssi | ssdi-vs-ssi | NEW (SSDI/SSI named only in passing in src/data/guides.ts)
3. versus | Fidelity | Robinhood | general | fidelity vs robinhood | fidelity-vs-robinhood | NEW (robinhood-vs-webull, charles-schwab-vs-robinhood, sofi-invest-vs-robinhood exist)
4. versus | Money market fund | Money market account | general | money market fund vs money market account | money-market-fund-vs-money-market-account | PARTIAL (mentioned in guides.ts/roundups.ts/comparisons.ts hysa-vs-money-market, not head-to-head)
5. versus | Payday loan | Personal loan | general | payday loan vs personal loan | payday-loan-vs-personal-loan | PARTIAL (payday loans mentioned in src/data/guides.ts)
6. versus | Tenants in common | Joint tenancy | estate planning | tenants in common vs joint tenancy | tenants-in-common-vs-joint-tenancy | NEW
7. versus | YNAB | Copilot Money | budgeting | ynab vs copilot | ynab-vs-copilot | NEW (ynab-vs-monarch is cached)
8. versus | Medicare Part A | Medicare Part B | health | medicare part a vs part b | medicare-part-a-vs-part-b | NEW (medicare-vs-medicare-advantage, medicare-vs-medicaid, medicare-advantage-vs-medigap exist)
9. versus | Bonds | Bond funds | investing | bonds vs bond funds | bonds-vs-bond-funds | NEW
10. versus | Fixed-rate student loan | Variable-rate student loan | student loans | fixed vs variable rate student loans | fixed-vs-variable-rate-student-loans | NEW (federal-vs-private-student-loans is cached)
11. versus | Treasury bills | High-yield savings account | general | t-bills vs high yield savings | treasury-bills-vs-hysa | PARTIAL (cd-vs-treasury-bill, hysa-vs-cd exist)

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/coverage-lookup.txt`
```
coverage_lookup: 11 candidate(s) vs 875 repo pages / 891 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1244 past-chart lines

### /guides/visa-vs-mastercard  — row - · create new content
keyword: visa vs mastercard
reader question (new page intent): Which is better, Visa or Mastercard?
lookup terms: visa mastercard   format cues: vs

Possible existing homes: none found in the repo page data, the search index or the sitemaps.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms: none
Commits naming the topic: none
Same run overlap: none

### /guides/ssdi-vs-ssi  — row - · create new content
keyword: ssdi vs ssi
reader question (new page intent): What is the difference between SSDI and SSI?
lookup terms: ssdi ssi   format cues: vs

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /guides/ssi-and-inheritance  [in sitemap · src/data/guides.ts · topic match 0.5 on ssi]
    title: Will an Inheritance Affect Your SSI Benefits in 2026?
    desc:  Find out how SSI and inheritance rules interact in 2026: the resource limit, the 10-day reporting rule, special needs trusts, and ABLE accounts explained.
- /guides/2027-ssdi-cola  [in sitemap · src/data/guides.ts · topic match 0.5 on ssdi]
    title: Social Security COLA 2027 for Disability: SSDI Up 3.6%
    desc:  The Social Security COLA 2027 for disability is a 3.6% cost-of-living adjustment. The average disabled-worker check rises from $1,642 to $1,701 in January.
- /guides/ssi-increase-2027  [in sitemap · src/data/guides.ts · topic match 0.5 on ssi]
    title: SSI Increase 2027 Sets the Federal Maximum at $1,029
    desc:  The SSI increase 2027 raises the Supplemental Security Income maximum to $1,029 a month. Couples get $1,544, starting December 31, 2026.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-10-14.md [table] | Lens 2, cluster "2027 Social Security changes (beyond the COLA)". Phrases: `social security changes 2027` 3,600/mo; `social security changes for 2027` 210; `social security earnings limit 2027` 210 KD 28; `social secur
- 2026-10-14.md [table] | COLA for SSDI | social security cola 2027 disability (3,600, KD 7); ssdi cola 2027 (320); ssdi increase 2027 (210); PAA: How much will my disability go up in 2027? | coverage gap at theme level | none | create new cont
- 2026-10-14.md [table] | SSI 2027 increase | ssi increase 2027 (1,300); ssi cola 2027 (1,000); how much will ssi checks be in 2027 (390) | coverage gap; separate program and payment date | none | create new content | /guides/ssi-increase-2027/
- 2026-10-14.md [exclusions] - **social security payment schedule 2027 (110/mo), ssi payment schedule 2027 (70):** HOLD. Low demand, and the SSA 2027 calendar was not read this run. Do not publish dates from memory.
- 2026-10-14.md [exclusions] - **fers cola 2026, va cola 2026, ssi increase 2026, social security cola 2026:** DROP. They are previous-year terms, and the 2027 rows above take their place.
- 2026-10-14.md [exclusions] - **Lens 3 (comparison / alternatives / pricing):** the brief's entities are federal benefit programs (Social Security, SSI, SSDI, FERS/CSRS, military retired pay, VA compensation), with no vendor, plan price or rival pr
Commits naming the topic: none
Same run overlap: none

### /comparisons/fidelity-vs-robinhood  — row - · create new content
keyword
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/keyword-volumes.json`
```
{
 "rows": [
  {
   "keyword": "bond funds vs individual bonds",
   "volume": 320,
   "volume_low": 320,
   "volume_high": 320,
   "kd": 4,
   "cpc": 3.07,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "bonds vs bond funds",
   "volume": 480,
   "volume_low": 480,
   "volume_high": 480,
   "kd": 6,
   "cpc": 4.19,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "copilot money vs ynab",
   "volume": 90,
   "volume_low": 90,
   "volume_high": 90,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 6,
    "corroborates": true
   }
  },
  {
   "keyword": "difference between ssdi and ssi",
   "volume": 4400,
   "volume_low": 4400,
   "volume_high": 4400,
   "kd": 14,
   "cpc": 3.4,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 7,
    "corroborates": true
   }
  },
  {
   "keyword": "fidelity vs robinhood",
   "volume": 5400,
   "volume_low": 5400,
   "volume_high": 5400,
   "kd": 0,
   "cpc": 22.07,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "fixed vs variable rate student loans",
   "volume": 390,
   "volume_low": 390,
   "volume_high": 390,
   "kd": 17,
   "cpc": 61.02,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 6,
    "corroborates": true
   }
  },
  {
   "keyword": "fixed vs variable student loan",
   "volume": 390,
   "volume_low": 390,
   "volume_high": 390,
   "kd": 17,
   "cpc": 61.02,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "medicare part a vs part b",
   "volume": 1000,
   "volume_low": 1000,
   "volume_high": 1000,
   "kd": 33,
   "cpc": 2.93,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "money market account vs money market fund",
   "volume": 880,
   "volume_low": 880,
   "volume_high": 880,
   "kd": 8,
   "cpc": 10.59,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 7,
    "corroborates": true
   }
  },
  {
   "keyword": "money market fund vs money market account",
   "volume": 880,
   "volume_low": 880,
   "volume_high": 880,
   "kd": 14,
   "cpc": 10.59,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 6,
    "corroborates": true
   }
  },
  {
   "keyword": "payday loan vs personal loan",
   "volume": 110,
   "volume_low": 110,
   "volume_high": 110,
   "kd": 0,
   "cpc": 3.86,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 4,
    "corroborates": true
   }
  },
  {
   "keyword": "ssdi vs ssi",
   "volume": 18100,
   "volume_low": 18100,
   "volume_high": 18100,
   "kd": 6,
   "cpc": 4.03,
   "source": 
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/serp.json`
```
{
 "rows": [
  {
   "keyword": "visa vs mastercard",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.reddit.com",
    "creditcards.wellsfargo.com",
    "www.investopedia.com",
    "www.cnbc.com",
    "www.experian.com",
    "www.youtube.com",
    "www.revolut.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "diff.wiki",
    "joingerald.com",
    "businessupturn.com",
    "diff.wiki",
    "fazilpay.com",
    "www.bild.de",
    "joingerald.com",
    "www.instagram.com"
   ],
   "major_domains": [],
   "forum_domains": [],
   "serp_feature_mix": {
    "ai_overview": 1,
    "organic": 9,
    "people_also_ask": 1,
    "related_searches": 1
   },
   "paa": [
    "Which is most used, Visa or Mastercard?",
    "Which card is powerful, Visa or Mastercard?",
    "Who owns Visa and Mastercard?",
    "How do Visa and Mastercard make money?",
    "Who is better, Visa or Mastercard?",
    "Why is everyone switching from Mastercard to Visa?"
   ],
   "related_searches": [
    "Visa vs mastercard credit card",
    "Visa vs mastercard cost"
   ],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "AI Overview present, cites www.reddit.com, creditcards.wellsfargo.com, www.investopedia.com, www.cnbc.com",
   "se_results_count": 79
  },
  {
   "keyword": "ssdi vs ssi",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": false,
   "ai_overview_cited_domains": [],
   "featured_snippet": null,
   "top10_domains": [
    "www.hcplaw.com",
    "www.rite4justice.com",
    "www.niperlaw.com",
    "ginsburglawgroup.com",
    "blossomsca.com",
    "retirable.com",
    "jandils.com",
    "www.brockandstout.com"
   ],
   "major_domains": [],
   "forum_domains": [],
   "serp_feature_mix": {
    "images": 1,
    "organic": 9
   },
   "paa": [],
   "related_searches": [],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "no entrenched incumbents or SERP features detected",
   "se_results_count": 72
  },
  {
   "keyword": "fidelity vs robinhood",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.reddit.com",
    "www.investopedia.com",
    "www.youtube.com",
    "www.grifin.com",
    "wise.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "financialwolves.com",
    "investingbrokers.com",
    "www.reddit.com",
    "www.brokeragecomparison.com",
    "www.youtube.com",
    "marketrealist.com",
    "www.topconsumerreviews.com",
    "rockwellforbes.com"
   ],
   "major_domains": [],
   "forum_domains": [
    "www.reddit.com",
    "www.youtube.com"
   ],
   "serp_feature_mix": {
    "ai_overview": 1,
    "organic": 8,
    "people_also_ask": 1,
    "perspectives": 1
   },
   "paa": [
    "What are the top 3 brokerage accounts?",
    "Why stay away from Robinhood?",
    "What is the 4% rule for Fidelity?",
    "What is the downside to Fidelity?",
    "Is Fidelity safer than Robinhood?",
    "What does Dave Ramsey say about Fidelity?"
   ],
   "related_searches": [],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "AI Overview present, cites www.reddit.com, www.investopedia.com, www.youtube.com, www.grifin.com",
   "se_results_count": 84
  },
  {
   "keyword": "money market fund vs money market account",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": 
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/kw-status.json`
```
{
 "dataforseo": "ok (balance $40.25663799999995)",
 "semrush": "unavailable: HTTP 403",
 "ahrefs": "off: excluded by KEYWORD_PROVIDERS",
 "autocomplete": "ok",
 "selected": {
  "volume": "dataforseo",
  "kd": "dataforseo",
  "expand": "dataforseo"
 }
}

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ig-bonds.txt`
```
URL: https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds
Retrieved (UTC): 2026-11-23T08:06:55Z
HTTP: 200

Bonds - FAQs | Investor.gov
 Skip to main content
 The .gov means it’s official.
 Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you’re on a federal government site.
 The site is secure.
 The
 https://
 ensures that you are connecting to the official website and that any information you provide is encrypted and transmitted securely.
 Investor.gov
 U.S. Securities and Exchange Commission
 Search Investor.gov
 Bonds - FAQs
 What are bonds?
A bond is a debt security, like an IOU. Borrowers issue bonds to raise money from investors willing to lend them money for a certain amount of time.
When you buy a bond, you are lending to the issuer, which may be a government, municipality, or corporation. In return, the issuer promises to pay you a specified rate of interest during the life of the bond and to repay the principal, also known as face value or par value of the bond, when it "matures," or comes due after a set period of time.
Why are bonds bought and sold?What types of bonds are there?What are the benefits and risks of bonds?Avoiding fraudAdditional information
Why are bonds bought and sold?
Investors buy bonds because:
They provide a predictable income stream. Typically, bonds pay interest on a regular schedule, such as every six months.
If the bonds are held to maturity, bondholders get back the entire principal, so bonds are a way to preserve capital while investing.
Bonds can help offset exposure to more volatile stock holdings.
Companies, governments and municipalities issue bonds to get money for various things, which may include:
Providing operating cash flow
Financing debt
Funding capital investments in schools, highways, hospitals, and other projects
What types of bonds are there?
There are three main types of bonds:
1. Corporate bonds are debt securities issued by private and public corporations. Some common types of corporate bonds include:
Investment-grade.  These bonds have a higher credit rating, implying less credit risk, than high-yield corporate bonds.
High-yield.  These bonds have a lower credit rating, implying higher credit risk, than investment-grade bonds and, therefore, offer higher interest rates in return for the increased risk.
2. Municipal bonds, called “munis,” are debt securities issued by states, cities, counties and other government entities. Types of “munis” include:
General obligation bonds. Refers to bonds issued by a state or local government that are payable from either an issuer’s general fund or specific taxes (usually property tax). The precise source and priority of payment for general obligation bonds may vary among issuers depending on applicable state and local laws. General obligation bonds issued by local governments are often payable only from property taxes while general obligation bonds issued by states are often said to entail the full faith and credit (and in many cases the full taxing power) of the issuer.
Revenue bonds. Instead of taxes, these bonds are backed by revenues from a specific project or source, such as highway tolls or lease fees.  Some revenue bonds are “non-recourse,” meaning that if the revenue stream dries up, the bondholders do not have a claim on the underlying revenue source.
Conduit bonds. Governments sometimes issue municipal bonds on beha
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ig-mutual-funds.txt`
```
URL: https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1
Retrieved (UTC): 2026-11-23T08:07:16Z
HTTP: 200

Mutual Funds | Investor.gov
 Skip to main content
 The .gov means it’s official.
 Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you’re on a federal government site.
 The site is secure.
 The
 https://
 ensures that you are connecting to the official website and that any information you provide is encrypted and transmitted securely.
 Investor.gov
 U.S. Securities and Exchange Commission
 Search Investor.gov
 Mutual Funds
 What are mutual funds?
A mutual fund is an SEC-registered open-end investment company that pools money from many investors. It invests the money in stocks, bonds, short-term money-market instruments, other securities or assets, or some combination of these investments. The combined holdings the mutual fund owns are known as its portfolio, which is managed by an SEC-registered investment adviser. Each mutual fund share represents an investor’s part ownership of the mutual fund’s portfolio and the gains and losses the portfolio generates. Investors in mutual funds buy their shares from, and sell/redeem their shares to, the mutual funds themselves or through investment professionals like brokers or investment advisers.
Why do people buy mutual funds?
Mutual funds are a popular choice among investors because they generally offer the following features:
 Professional Management. Mutual funds are managed by investment advisers who are registered with the SEC.
 Diversification. Mutual funds may invest in a range of companies and industries rather than investing in one specific stock or bond. This helps to lower your risk if one company fails.
 Low Minimum Investment. Many mutual funds set a relatively low dollar amount for initial investment and subsequent purchases.
 Liquidity. Mutual fund investors can readily sell their shares back to the fund at the next calculated net asset value (NAV) – on any business day – minus any redemption fees.
How do I earn money from mutual funds?
Investors can make money from their mutual fund investments in three ways:
 Dividend Payments. A fund may earn income from its portfolio –  for example, dividends on stock or interest on bonds. The fund then pays the shareholders nearly all the income, less expenses, as a dividend payment.
 Capital Gains Distributions. The price of the securities a fund owns may increase. When a fund sells a security that has increased in price, the fund has a capital gain. At the end of the year, the fund distributes these capital gains, minus any capital losses, to investors.
 Increased Net Asset Value (NAV). If the market value of a fund’s portfolio increases, after deducting expenses and liabilities, then the NAV of the fund and its shares increases. With respect to dividend payments and capital gains distributions, mutual funds usually will give investors a choice. The mutual fund can transfer the amount to the investor, or the investor can have the dividends or distributions reinvested in the mutual fund to buy more shares.
What are the risks of investing in mutual funds?
Mutual funds are not guaranteed or insured by the FDIC or any other government agency. They therefore all carry some level of risk. You may lose some or all of the money you invest because the investments held by a fund can go down in value. Dividends or interest payme
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/finra-bonds.txt`
```
URL: https://www.finra.org/investors/investing/investment-products/bonds
Retrieved (UTC): 2026-11-23T08:08:07Z
HTTP: 200

Bonds | FINRA.org
 Skip to main content
 EXPLORE THIS SECTION
 FINRA Main Navigation
 Investor Insights
 Tools & Calculators
 Investing
 Investing Basics
 Investment Accounts
 Investment Products
 Investment Strategies
 Working With an Investment Professional
 Protect Your Money
 Check Registration
 Avoid Fraud
 Watch for Red Flags
 Safeguard Your Identity
 Financial Industry Investor Resources
 For the Military
 Need Help?
 Investment Products
 Bonds
 Overview
 Types
 Buying and Selling
 Risks
 Key Terms
 Learn More
 ESSENTIALS
Bonds and bond funds can help diversify your portfolio.
Bond prices fluctuate, although they tend to be less volatile than stocks.
Some bonds, particularly U.S. Treasury securities, come with relatively lower risks and can help preserve capital and potentially generate income.
When interest rates rise, bond prices tend to fall, and vice versa.
FINRA’s Fixed Income Data offers an easy way to find bond facts, including real-time data on corporate and agency bonds and important educational information.
Debt securities, also known as fixed income securities, are financial instruments that have defined terms between a borrower (the issuer) and a lender (the investor). Bonds, issued by a corporation, government, federal agency or other organization to raise capital, are a common type of debt security in which the borrower agrees to pay interest in exchange for the capital raised.
The vast majority of bonds have a maturity date that’s set when the bond is issued. On a bond’s maturity date, the borrower fulfills its debt obligation by paying bond holders the final interest payment and the bond’s face value, called par value.
Generally, a bond that matures in one to three years is referred to as a short-term bond. Medium- or intermediate-term bonds are generally those that mature in four to 10 years, and long-term bonds are those with maturities greater than 10 years. Not all bonds reach maturity. Callable bonds, which allow the issuer to retire a bond before it matures, are common.
A bond’s coupon—or annual interest—is generally paid out semiannually. The coupon is set at issuance and tied to a bond's face or par value. It’s quoted as a percentage of par. For instance, a bond with a par value of $1,000 and an annual interest rate of 4.5 percent has a coupon rate of 4.5 percent ($45). An investor in a bond with a $45 annual coupon that pays interest semiannually can expect to receive a $22.50 interest payment twice per year.
Bottom Line
Bonds and bond funds can be an important component of a diversified investment portfolio. They can be helpful for anyone concerned about capital preservation and income generation and can help partially offset the risks that come with equity investing. But like all investments, they also carry an element of risk.
Performing due diligence can help you assess the many characteristics that are associated with these fixed-income securities and evaluate overall suitability with your investing needs.
 Bonds are issued by many different entities, from the U.S. government, cities and corporations to international bodies. Some bonds, such as mortgage-backed securities (MBSs), can be issued by financial institutions. Thousands of bonds are issued each year and, even though bonds may share the same issuer, it’s a pretty good bet that each bond is unique. Most bonds are fixed inco
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ig-bond-funds-glossary.txt`
```
URL: https://www.investor.gov/introduction-investing/investing-basics/glossary/bond-funds
Retrieved (UTC): 2026-11-23T08:07:17Z
HTTP: 200

Glossary | Investor.gov
 Skip to main content
 The .gov means it’s official.
 Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you’re on a federal government site.
 The site is secure.
 The
 https://
 ensures that you are connecting to the official website and that any information you provide is encrypted and transmitted securely.
 Investor.gov
 U.S. Securities and Exchange Commission
 Search Investor.gov
 Glossary: BOND-FUNDS
 Never stop learning about investing!
Stay up to date with Investor Alerts & Bulletins, Quizzes, and more. 
Get Email Updates from Investor.gov
Sign up for Investor Updates Enter Email Address 
 Return to Top

```

## WRITER TASK ADDENDUM (data only; copied from the approved plan, reviewer guardrails and evidence packet)
- register: operator. page type: comparison (body floor 1,500 words; table cells, title, meta, headings do not count). medium: text + comparison table. teeup-exempt: source-only reported comparison, no honest first-hand experience to tee up. anchor-exempt: no approved case record fits (all 8 retrieved records rejected).
- Reader question (plain text, NO bracket tag on the page): "Should I buy individual bonds or a bond fund?"
- Basis is reported. Name the primary source beside every finding ("Investor.gov says...", "Section ... provides...") with a deep markdown link on its first mention. Never write 'we tested', 'in our testing', 'we modeled' or 'our analysis' as if we ran something. No client or experience claim.
- Output ONE JSON object, comparison schema. Keys: slug "bonds-vs-bond-funds", title (50 to 60 characters, carries "bonds vs bond funds", ONE clause: no colon or comma splice, no 'and why'), metaDescription (150 to 160 characters, no 'We tested'), targetKeyword "bonds vs bond funds", optionA "Individual Bonds", optionB "Bond Funds", segment "Investing", h1 (Title Case, one clause, keyword inside), introText (direct answer first, short sentence 1; paragraphs separated by blank lines; second paragraph may state the condition that changes the answer), comparisonTable.rows (7 to 9 objects {dimension, a, b}; each cell a sourced fact with a markdown link on the first mention of the source, no 'check the site' cells, no raw HTML; if a fact is not in the closed list put 'Not covered by the sources here' instead of a guess), tableHeading "Bonds vs Bond Funds at a Glance", verdictHeading (Title Case, e.g. 'Our Takeaway for Individual Bonds vs Bond Funds'), verdict (fuller takeaway: answer, evidence basis named, the exception, then ends with a concrete next-action sentence carrying the primary keyword), disclaimerText (ONE sentence, general information not advice, bottom-of-page slot), sections (see below), faqs, sources, relatedComparisons ["stocks-vs-bonds", "i-bonds-vs-tips", "treasury-bills-vs-notes-vs-bonds", "etf-vs-mutual-fund"], calculatorLinks [].
- Layout rule: because disclaimerText is set, sections[0].heading MUST equal tableHeading exactly; sections[0].content is the opening-answer section that renders above the table (it must add facts the introText did not say, not restate it). sections[1..] follow the approved outline order below. verdict renders after the sections. FAQs: sentence-case questions from faqPlan, each answer opens with the direct answer.
- Approved outline headings (Title Case exactly): see 'Approved Section Outline' above. Table rows to cover: maturity date and what you get back; interest-rate risk; credit risk and call risk; diversification; minimum purchase; ongoing costs (fund expenses via NAV vs broker markup or markdown); how income is paid (interest vs fund dividends); how you sell.
- Internal links allowed (markdown with trailing slash, only these): /compare/stocks-vs-bonds/ (anchor 'stocks vs bonds', in 'Who Should Choose Each Option'); /guides/what-is-an-index-fund/ (anchor 'what an index fund is', in 'How Bond Funds Work'). No other internal links except the related list.
- External links: ONLY the closed URL list for this page; first mention of every organisation linked: Investor.gov (U.S. Securities and Exchange Commission, SEC), Financial Industry Regulatory Authority (FINRA).
- Who this is not for: someone who needs the money within a short time and cannot absorb a price drop (price risk applies to both); someone who wants a personalized portfolio recommendation. Say what such readers should do: compare the sourced risks and read the fund's prospectus or bond's issuer disclosures; do not give personalized advice. Also include 'What would change our answer' using the evidence packet whatWouldChange.
- Reviewer guardrails specific to this page:
  - CR1-A1-BONDFUND-SOURCES: every fund-side claim must be one of the closed facts IGM-1 to IGM-6, FIN-3, FIN-6, FIN-8, FIN-9 or INF-1. State that interest-rate price falls apply to both bonds and bond funds (FIN-1, FIN-8, IGB-3).
  - CR1-A1-COUNTEREXAMPLE: put 'Most bond funds have no set maturity date' (INF-1) in the opening answer, and put call risk (IGB-4, FIN-8) and the broker markup or markdown on bond purchases (FIN-4) in the opening answer or the first table. Keep every fund detail beyond the closed facts out of the first answer. Do not invent defined-maturity fund facts: say a fund's prospectus states its own terms (IGM-6).
  - FAQ only the sourced questions in faqPlan. No yield, fixed deposit, Buffett or 60/40 answers.
  - Do not name any specific fund, fund company, ETF ticker, yield or expense ratio. Do not state any number not in the closed facts (the $100, $25 and $10,000 minimums and six-month interest cadence are allowed).
- Depth: 1,500+ body words by answering the sub-questions in the evidence packet (conditions, counterexample, unknowns), not by padding. Headings Title Case; every acronym defined on first use; no em dashes; no Conclusion or Summary heading; no 'honest', no 'the vendor/platform/tool'.
- sources: one object per source actually used: {"label","url"} using ONLY the closed URL list.
- Anything not on the evidence packet's closedFacts list, you do not know. Never invent a price, limit, statute, date, number or URL; leave it out.
