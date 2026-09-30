All three pages fail, but none needs regeneration. Each page's structure, answer placement and depth are sound. The failures are fact errors, unlinked organisation names, anti-AI tells and headline tells, and every one can be fixed in place. The Fidelity page has the most fact errors (about 15), plus no external links at all.

# PHASE 4 AUDIT: 2026-09-30-robinhood, 3 pages

**Method.**
- Loaded in full: the AUDITOR sections of `_content-standard.md` and `_anti-ai-language.md`, plus `_experience.md`, `mindmap-pass/phase-4-audit.md` and `_remediation-ladder.md`.
- Checked each page against its `prompts/<slug>.prompt.md` (fact list, Contested, DO NOT STATE, URL list), `allowed-urls.txt` and meta guards.
- Depth was measured from source with a script (link syntax stripped).
- Sentence rhythm was measured with a script.

**Depth:** 3 of 3 pass, 0 fail, median 2,448.

| Page | Words | Floor |
|---|---|---|
| Gold | 2,448 | 1,200 |
| Safe | 2,040 | 1,200 |
| vs Fidelity | 2,908 | 1,500 |

**Things that affect how fixes behave (not page failures):**
- **Robinhood links are rewritten.** `src/lib/richtext.ts` turns every bare "Robinhood" in body prose into a link. It also sends every robinhood.com link, including the support-article deep links these pages cite, to the referral URL `join.robinhood.com/jonatht93` with sponsored rel. So "Robinhood" never fails the links gate. But no Robinhood deep link on any page reaches the page it cites, which defeats the deep-link rule. This is a site-level issue for a human. `partners.ts` itself carries a compliance note about the personal referral link.
- **Footer text.** `AFFILIATE_DISCLOSURE` includes "This never affects our rankings or editorial coverage." That is a site-wide neutrality claim. Out of scope here; flagged for a human.
- **Disclaimer.** The site footer shows "For educational purposes — not financial advice." So `disclaimer-missing` does not apply.
- **Empty placeholder fields.** `metaTitle`, `subtitle`, `ctaTitle`, `ctaText`, `ctaButton` and `faqItems` (plus `optionAName`, `optionBName` and `relatedLinks` on the comparison) are not in the `Guide` or `ComparisonEntry` interfaces, and no template reads them. FIX (mechanical): delete them from all three entries rather than filling them.
- **Row records.** The chart row (`2026-09-30-robinhood.md`) has no explicit `register:` record for any of the three rows. The Gold row says "Operator voice" in its solution text, and the rows' `page type:` records are non-standard ("guide (guides.ts), worth-it verdict"). This is a chart-build process gap. I audited all three as operator register.
- **Load receipt.** The phase-3 receipt is present and its hashes (098897e9 / e4282612 / 31d70e56) match what I recomputed with `shasum`. The orchestrator must stage its own phase-4 receipt.
- **Internal link targets all exist.**
  - Gold, Safe and vs Fidelity are the new sibling slugs.
  - `robinhood-agentic-trading-explained` and `robinhood-24-hour-trading` are in `guides.ts`.
  - The compare targets `robinhood-vs-webull`, `sofi-invest-vs-robinhood`, `charles-schwab-vs-robinhood`, `fidelity-vs-schwab`, `vanguard-vs-fidelity` and `etrade-vs-fidelity` are in `comparisons.ts`.
  - The roundup targets `best-brokerage-accounts-for-interest-on-cash`, `best-investment-apps-for-beginners` and `best-robo-advisors` are in `roundups.ts`.
  - `roth-ira-calculator`, `high-yield-savings-calculator` and `investment-growth-calculator` are in `spokes-investing.ts`, and `/investing/` is a category page.
  - No link goes to a route outside the allowed list. Each internal link is used once.
- **External URLs.** Every external URL on the Gold and Safe pages is on its allowed list. The Fidelity page has none; the guard removed two homepage links.
- **Clean on all three:**
  - No em-dashes (the `--` hits are table separators).
  - No "honest".
  - No exclamation marks.
  - No byline or date sentences.
  - The self-serving-disclaimer grep finds nothing.
  - Titles are 60 characters or less and metas 160 or less.

---

## 1. is-robinhood-gold-worth-it: FAIL (FIX-IN-PLACE, 22 fixes)

**Guard numbers.** All eight flagged numbers are correct arithmetic, not fabrication:
- 1,000,000, 10,000,000 and 50,000,000 are the margin tier bounds.
- 1,388.89 = $50 / 3.6%.
- 36 = 3.6% of $1,000.
- 2.5 = $52.50 − $50.
- 200 = $500 − ($250 + $50).
- 120,000 is the correct Strategies break-even: 0.25% × B = $250 + $50 gives B = $120,000.

That last figure contradicts "over $100,000" elsewhere on the page (finding 1).

**(a) Answer first:** yes. introText sentence 1 gives the verdict and all four triggers, and section 1 carries the break-even table.
**(e) First person:** one licensed sentence ("At ModernWallet, we track financial products by running the cash math…"). It traces to `_experience.md` ("We show the math").
**(g) Lengths:** title 53, meta 142.

### Hard fails

1. **Internal contradiction: Strategies break-even.** The table says "$120,000 or more in managed assets", which is correct. Between $100k and $120k the fee cap saves less than $50. Three other places say "over $100,000":
   - intro: "or keeping over $100,000 in a Robinhood Strategies account" → "or keeping $120,000 or more in a Robinhood Strategies account"
   - FAQ 2: "or managing over $100,000 in a Robinhood Strategies account" → "or keeping $120,000 or more in a Robinhood Strategies account"
   - who-list: "Investors with over $100,000 in Robinhood Strategies seeking to cap their 0.25% management fees at $250 annually." → "Investors with $120,000 or more in Robinhood Strategies, where the $250 fee cap saves more than the $50 subscription."
   - The row's approved answer says "over $100,000". Flag that to the chart owner.
2. **Rate missing its as-of date and "variable" (DO NOT STATE item).**
   - Table: "| 3.6% Cash APY | $36 per $1,000 in cash annually |" → "| Variable 3.6% Cash APY (as of Sept 17, 2026) | $36 per $1,000 in cash a year |"
   - Table: "| $1,000 Interest-Free Margin | $52.50 annual interest savings |" → "| $1,000 Interest-Free Margin | $52.50 a year at the variable 5.25% rate (as of Sept 17, 2026) |"
   - Section 1: "With Robinhood's base margin rate sitting at 5.25% for balances up to $50,000 as of September 17, 2026," → "At Robinhood's variable 5.25% rate for balances up to $50,000 (as of September 17, 2026),"
   - metaDescription: "…on the 3% IRA match, 3.6% cash APY, and margin perks…" → "Robinhood Gold costs $50 a year. See the break-even math on the IRA match, cash interest and free margin to decide whether it pays for itself."
3. **Two different IRA fees conflated.** "Second, cancelling within 12 months of earning an IRA match triggers an early removal fee on the extra match money you received." → "Second, cancelling Gold within 1 year of your first Gold IRA match triggers Robinhood's Gold cancellation IRA match removal fee, which takes back the extra 2% match."
4. **Wrong fee type.** "Gold also lowers index option regulatory fees to $0.35 per contract and cuts futures commissions to $0.50 per contract." → "Gold also lists a discounted index options fee of $0.35 per contract and a futures commission of $0.50 per contract."
5. **Unsourced (fabricated).** "These reports provide analyst ratings, business overviews, and fair value estimates on thousands of publicly traded securities." → delete the sentence.
6. **Cortex described beyond its facts (DO NOT STATE: no Cortex features beyond Digests).** "these consist of AI-generated Asset Digests and Portfolio Digests that summarize earnings announcements and major news events in plain language." → "these are AI-generated Asset Digests and Portfolio Digests written in plain language."
7. **Mischaracterised feature.** "Deposits also settle faster with a Gold subscription." → "Gold also raises how much of a deposit you can use instantly."
8. **Overstated facts** (the sources say "can trigger" and "may sell").
   - "Withdrawing your retirement funds within 5 years also triggers an early removal penalty, which locks your capital into Robinhood longer than many beginners anticipate." → "Withdrawing matched funds within 5 years can trigger an early removal fee if your remaining balance falls below the matched deposit plus the match."
   - "and will liquidate your securities if your cash balance is insufficient" → "and may sell positions to cover the fee if you lack uninvested cash"
9. **Links gate: IRS named with no allowed URL; the source is Robinhood.** "For 2026, the Internal Revenue Service (IRS) contribution limit is $7,500 for individuals under age 50, and $8,600 for those age 50 and older." → "For 2026, Robinhood lists IRA contribution limits of $7,500 under age 50 and $8,600 at 50 and older."
10. **Links gate: Nasdaq and Morningstar unlinked on first mention.**
    - "Subscribers receive Level II Market Data powered by Nasdaq TotalView." → "Subscribers receive [Level II Market Data powered by Nasdaq TotalView](https://robinhood.com/us/en/support/articles/level-ii-market-data/)."
    - Then make "Robinhood's market data disclosures" plain text.
    - "company reports from Morningstar" → "company reports from [Morningstar](https://robinhood.com/us/en/newsroom/nasdaq-level-2-market-data-is-here/)"
    - Then make "June 2019" plain text.
11. **Links gate: SIPC unlinked (no allowed URL).** "If you want to review the platform's broader regulatory protections, Securities Investor Protection Corporation (SIPC) coverage, and operational history before upgrading, read our detailed evaluation on [whether Robinhood is safe](/guides/is-robinhood-safe/)." → "Before upgrading, our guide on [whether Robinhood is safe](/guides/is-robinhood-safe/) covers what protects the money in your account." This also removes the coy "the platform".
12. **Required element missing: "what would change our answer".** Append to the "Who Should Get…" section, before the last sentence: "The verdict changes if Robinhood lowers the Gold APY, changes the 3% IRA match, or raises the $50 price; rerun the four break-even points against the new figures."
13. **Meta-narration.** "The breakdown below details the exact math, the cancellation terms, and the specific limitations attached to each Gold perk." → delete.
14. **Coy abstraction.** "The easiest way to evaluate the service is to look at each major feature in isolation rather than trying to value the entire bundle at once." → "Each Gold perk can clear the $50 fee on its own, so the table tests them one at a time."
15. **Headline tells (three-item tricolons).**
    - "Robinhood Gold Cost, Billing Rules, and How Cancelling Works" → "Robinhood Gold Billing and Cancellation"
    - "High-Yield Cash, Margin Rates, and Instant Deposits" → "Cash Yield and Margin Perks"
    - "Research Tools, Market Data, and AI Features" → "Gold Research and AI Tools"
16. **Inflated words and unsayable sentences.**
    - "Two critical limitations govern cancellation." → "Two rules limit cancelling."
    - "The cash program and margin tiers make up the primary operational features for active brokerage accounts." → delete.
    - "Robinhood Gold delivers obvious mathematical value for specific investor profiles, while proving counterproductive for others." → "Robinhood Gold pays for itself for four kinds of Robinhood user and costs money for everyone else."
    - "On the artificial intelligence side, Gold unlocks Cortex Digests." → "Gold also includes Cortex Digests."
    - "are completely ineligible" → "are not eligible"
    - "Interest rates on cash and margin are completely variable." → "Cash and margin rates are variable."
17. **Placeholder noun and reader assumption.** "Comparing the subscription against other major brokerages can clarify where it belongs in your setup, such as in our…" → "For how Robinhood's terms compare with other brokers, see our…" (keep both links).
18. **Implies a non-Gold APY exists.** FAQ 6: "features like higher cash APY" → "features like the variable 3.6% cash APY (as of Sept 17, 2026)"
19. **Sentence rhythm.** Sentences 97 to 106 (the who-list bullets) are all long-band. This is partly a list artefact, but vary two bullets. Across the page 88 of 122 sentences are 15+ words.

### Advisory
- Opening sentence is 48 words. Its shape is prompt-mandated; after the fixes, delete "clean" from "four clean break-even points".
- "for at least 5 years from the contribution date": "from the contribution date" is not in the facts.

---

## 2. is-robinhood-safe: FAIL (FIX-IN-PLACE, 27 fixes; section 7 gets a supplied replacement)

**Guards:** no numbers flagged.
**(a) Answer first:** yes. Sentence 1 is the verdict plus its boundary, and section 1 is the protection table. The row's prescribed section-1 heading was not used; acceptable, since the H1 carries it.
**(g) Lengths:** title 43, meta 155.

### (i) Regulatory-history section: not neutral, not exact (hard fail)

Replace the three paragraphs of "Regulatory Fines and Past Trading Halts".

Heading → "Robinhood's Outage and Enforcement Record". "Trading Halts" is inaccurate: these were purchase restrictions.

**Paragraph 1** is currently "Robinhood has faced substantial regulatory enforcement actions…". The problems:
- "substantial" is editorialising;
- "sister clearing entity" is not in the facts;
- "registered with the SEC and FINRA across 53 states" is wrong. The fact is SEC, 1 SRO and 53 states/territories.

Replace with:
> Robinhood's two broker-dealers have settled several regulatory actions over order routing, outages, and clearing operations. The [FINRA BrokerCheck report for Robinhood Financial](https://files.brokercheck.finra.org/firm/firm_165998.pdf) lists 56 regulatory events and 12 arbitrations. Robinhood Securities is registered with the SEC, one self-regulatory organization, and 53 U.S. states and territories, and is not currently suspended with any regulator.

**Paragraph 2.** The problems:
- "volatile meme stocks" is editorialising;
- "ten-fold" is attributed to the SEC filing, but it comes from Robinhood's Jan 29, 2021 post;
- "forcing the platform" states Robinhood's attribution as fact;
- NSCC, GameStop and AMC are unlinked.

Replace with:
> FINRA's [2021 order](https://www.finra.org/sites/default/files/2021-06/robinhood-financial-awc-063021.pdf) records that Robinhood's website and mobile apps shut down on March 2 and 3, 2020, with a second significant outage on March 9, 2020. Beginning January 28, 2021, Robinhood Securities temporarily restricted or limited purchases of certain securities, including [GameStop Corp. and AMC Entertainment Holdings, Inc.](https://www.sec.gov/Archives/edgar/data/1783879/000178387925000145/hood-20250331.htm) Robinhood's SEC filing attributes the restrictions to increased deposit requirements imposed by its clearinghouse. On January 29, 2021, Robinhood [said](https://robinhood.com/us/en/newsroom/what-happened-this-week/) its clearinghouse-mandated equities deposit requirements had "increased ten-fold" that week.

**Paragraph 3.** The problems:
- "caused $34.1 million in customer execution price harm" pins the harm on the statements, but the SEC tied it to inferior prices;
- "plus interest" is missing;
- the 2025 SEC charges omit Reg S-P and S-ID, which are customer-data rules and matter on a safety page;
- "issued a $45 million penalty" should be "agreed to pay".

Replace with:
> On December 17, 2020, the [SEC announced](https://www.sec.gov/newsroom/press-releases/2020-321) that Robinhood Financial agreed to pay $65 million to settle charges that it misled customers about payment for order flow from 2015 to late 2018 and failed to seek best execution. The SEC found that inferior execution prices cost customers $34.1 million in aggregate, even after commission savings. In June 2021, FINRA fined Robinhood Financial $57 million and ordered restitution of $12,598,445.16 plus interest over systems outages, false or misleading information, and options approvals. On January 13, 2025, Robinhood Securities ($33.5 million) and Robinhood Financial ($11.5 million) [agreed to pay $45 million combined](https://www.sec.gov/newsroom/press-releases/2025-5) over charges including Regulation SHO, Regulation S-P Rule 30(a), Regulation S-ID Rule 201, and recordkeeping and reporting violations. On March 7, 2025, [FINRA fined both firms $26 million and ordered $3.75 million in restitution](https://www.finra.org/media-center/newsreleases/2025/finra-orders-robinhood-financial-pay-375-million-restitution), $29.75 million in total. The issues included market-order "collaring" disclosures, anti-money-laundering failures, customer identification, clearing-system supervision in January 2021, and influencer communications.

The page claims no admission of wrongdoing, which is correct.

### Other hard fails

1. **Section 7 is built on unsourced legal claims** (the prompt said "general, non-numeric guidance" unless the fact list covers it). The unsourced claims are:
   - "USA PATRIOT Act and FINRA customer identification rules, obligate brokerages…";
   - "Under federal banking regulations, ACH debits require customer authorization";
   - "Robinhood cannot arbitrarily pull funds from your checking account…";
   - "the platform requests banking credentials".

   Replace the section body with:
   > Robinhood asks for your Social Security number (SSN) and identity details when you open an account, as US brokerages do to verify who you are. Robinhood says it protects that data with BCrypt password hashing, TLS encryption, and encrypted storage. Its 2021 incident exposed email addresses and names, and Robinhood said no Social Security, bank account, or debit card numbers were exposed.
   >
   > Linking a bank account lets you move money between that bank and Robinhood. Robinhood may ask for bank verification at login or when account details change, which makes it harder for someone else to redirect your transfers. If money moves through unauthorized activity, Robinhood's security guarantee covers direct losses for eligible customers, except where the customer's own actions made it possible. Compare how other brokers handle funding in our [Robinhood vs. Webull](/compare/robinhood-vs-webull/) and [Robinhood vs. Fidelity](/compare/robinhood-vs-fidelity/) reviews.

   If the orchestrator won't take a section-level replacement, this is REWORK of section 7 only.
2. **FAQ answers with unsourced legal claims.**
   - SSN FAQ, replace the answer with: "Robinhood asks for your SSN to open an account, as US brokerages do to verify identity, and says it stores sensitive data encrypted. Its 2021 incident exposed email addresses and names; Robinhood said no Social Security, bank account, or debit card numbers were exposed."
   - Bank FAQ, replace the answer with: "Linking a bank lets Robinhood move the deposits and withdrawals you request, and Robinhood may require bank verification when account details change. If money moves through unauthorized activity, Robinhood's security guarantee reimburses direct losses for eligible customers, excluding cases the customer's own actions facilitated."
3. **Contested fact misstated.** The source says "people", not customers, and debit cards, not payment cards.
   - "the intruder accessed approximately 5 million email addresses and about 2 million customer names" → "the attacker obtained email addresses for about 5 million people and full names for a different group of about 2 million people"
   - "payment card numbers" → "debit card numbers"
   - "Security protocols were tested on November 3, 2021, when an unauthorized attacker" → "Late on November 3, 2021, an unauthorized party"
4. **Unsourced figure.** "These caps apply across the entire program bank network, subject to each individual bank's standard $250,000 deposit limit." → delete. Also: "pass-through FDIC insurance" → "FDIC insurance".
5. **DO NOT STATE: FDIC must be "through program banks".**
   - Intro: "Swept cash can receive Federal Deposit Insurance Corporation (FDIC) coverage through partner banks." → "Swept cash can receive [FDIC coverage through program banks](https://robinhood.com/us/en/support/articles/deposit-sweep-program/)."
   - Then make "Robinhood deposit sweep program" in section 3 plain text.
   - FAQ 1 has "through partner banks" too; it is replaced in finding 15.
6. **Table accuracy.**
   - Swept Cash "What Is Not Covered", "Direct Robinhood entity insolvency" → "Amounts above the limits; no SIPC once swept".
   - Crypto "Market drops, fraud, entity failure" → "Market drops and Robinhood Crypto failure".
   - Futures "None | $0 | Product losses and market swings" → "Not SIPC-protected | n/a | Market losses".
   - AI Agent Trades row → "| AI Agent Trades | Your risk under Robinhood's terms | None for trade outcomes | Losses from any trade an agent places |". The current "None / $0" wrongly implies the agentic account's holdings lose custody protection.
7. **Links gate: SEC, FINRA and SIPC are named unlinked in the intro.** Replace intro sentences 2 and 3 with:
   > Robinhood Financial LLC and Robinhood Securities, LLC are [SEC-registered](https://files.brokercheck.finra.org/firm/firm_287900.pdf) broker-dealers and members of the [Securities Investor Protection Corporation](https://www.sipc.org/for-investors/what-sipc-protects) (SIPC), which protects customer assets up to $500,000, including $250,000 of cash, if the firm fails.

   Then in section 2, change "protected by the [Securities Investor Protection Corporation](…)" → "protected by SIPC". FINRA's first linked mention is then the BrokerCheck link in the new section 6 paragraph 1.
8. **Links gate: Lloyd's and the program banks.**
   - Table cell "Lloyd's of London Policy" → "[Lloyd's of London policy](https://robinhood.com/us/en/support/articles/how-youre-protected/)"
   - "As of July 1, 2026, this sweep network includes 15 FDIC-insured institutions, such as Goldman Sachs Bank USA, Wells Fargo, Citibank, U.S. Bank, and Truist Bank." → "As of July 1, 2026, the sweep network has 15 FDIC-insured program banks."
9. **Lloyd's limit misstated.** The limits are combined, not additive. "with an individual customer limit of $50 million in securities and up to $1.9 million in cash" → "with a combined per-customer limit of $50 million, including up to $1.9 million in uninvested cash"
10. **"Derivatives" overstated** (only futures are in the facts; options are securities). "Derivatives and futures contracts held through Robinhood Derivatives are likewise excluded from SIPC coverage." → "Futures held through Robinhood Derivatives are not SIPC-protected either."
11. **Coy abstractions.**
    - "the firm introduced Robinhood Agents" → "Robinhood announced Robinhood Agents (newsroom post dated September 29, 2026)"
    - "Platform legal terms stipulate that" → "Robinhood's disclosure says"
    - "The company rolled out two-factor authentication (2FA) in September 2016" → "Robinhood added two-factor authentication (2FA) in September 2016"
    - AI FAQ: "AI agents on the platform" → "AI agents at Robinhood"
12. **Overstated.**
    - "You remain solely responsible for any orders your automated agent submits or fills." → "Robinhood says you are 'ultimately responsible for the trades your AI agent places in your account.'"
    - "Robinhood states it will reimburse direct losses" → "Robinhood states that, if you are eligible, it will reimburse direct losses"
    - "three-point video selfies" → "a three-point selfie"
13. **Inflated words, colon drama, meta-narration.**
    - "It is essential to recognize that SIPC does not protect" → "SIPC does not protect"
    - "A critical custody rule applies to swept funds: once your cash moves" → "Once your cash moves"
    - "This breakdown reveals that traditional brokerage holdings enjoy standard federal safeguards. In contrast, cryptocurrency and experimental execution tools operate without statutory safety nets." → "SIPC and the Lloyd's policy cover stocks, funds, and uninvested cash if Robinhood fails; crypto, futures, and the outcome of AI agent trades have no such coverage."
    - "Algorithmic and automated trading introduces another major liability boundary." → delete.
14. **Nominalisation and a wrong claim (nothing covers outages).** "Knowing which entity holds your balance determines which federal or private program protects it if an outage, fraud, or liquidation takes place." → "Which Robinhood entity holds a balance decides what covers it if that entity fails."
15. **Weasel attribution, unsourced claim, reader-assumption advice.**
    - "Retail accounts are most frequently compromised through credential stuffing, phishing, or poor password hygiene rather than direct broker database intrusions." → delete.
    - Checklist item 4 → "Size any crypto you hold through Robinhood Crypto knowing it has no SIPC or FDIC coverage."
    - Checklist item 5 → "Read your Robinhood statements and report any trade or transfer you did not make."
    - Checklist item 3 → "Leave agent trade approvals on (Robinhood turns them on by default)."
    - "Evaluating platform stability helps clarify whether Robinhood fits your portfolio objectives." → delete.
    - FAQ 1, replace the answer with: "Robinhood's coverage protects against the broker failing, not against losses. SIPC covers up to $500,000 per customer, including $250,000 of cash, and Robinhood's Lloyd's of London excess policy has a combined per-customer limit of $50 million, including up to $1.9 million in cash. Swept cash is FDIC-eligible through program banks up to $2.5 million for individual accounts. None of it covers market declines, and crypto has neither SIPC nor FDIC protection."
    - Crypto FAQ, replace the answer with: "No. Robinhood says crypto held through Robinhood Crypto is not SIPC- or FDIC-protected, so neither program covers a price collapse or a Robinhood Crypto failure."
16. **Neutrality (trust-our-motives)** on a page that auto-links a Robinhood referral. "At ModernWallet, we evaluate trading platforms by looking at legal custody safeguards and regulatory histories rather than brand marketing." → "At ModernWallet, we judge a broker's safety by its custody protections and its regulatory record."
17. **Opening sentence is a clause stack (34 words).** → "Robinhood is safe against the broker itself failing, up to SIPC and excess-insurance limits. Nothing covers market losses, crypto has neither SIPC nor FDIC protection, and Robinhood puts the risk of AI agent trades on you."
18. **Heading case.** "Account Protections across Robinhood Asset Types" → "Account Protections Across Robinhood Asset Types"
19. **Meta description** says regulatory history "protects your assets", and "the real risks" is a headline tell. → "Robinhood is SIPC-protected against broker failure up to $500,000, but not against market losses, crypto, or AI agent trades. See every limit and gap." (150 characters)
20. **Sentence rhythm.** Sentences 49 to 58 (end of section 5 into section 6) are all long-band, and 5 in a row sit within 3 words of each other (22/22/24/21/21). The section 6 replacements above break most of this. Across the page 72 of 101 sentences are 15+ words.

### Advisory
- The "who this is not for" / "what would change" framing is thin for a verdict page. Suggest: "Anyone who wants protection against investment losses, or insured crypto, will not get it from Robinhood or any SIPC member."
- cardBlurb "A complete breakdown…": "complete" is filler.
- **(c) checks:** no "7 million", no hardware keys, no admission of wrongdoing, FDIC never above $2.5M/$5M, and swept cash is never called SIPC-protected. All pass.

---

## 3. robinhood-vs-fidelity: FAIL (FIX-IN-PLACE, about 35 fixes; very close to REWORK)

**Guards:** "25" traces to "$25,000,000" market cap (Robinhood fractional) and "$25,000" (Fidelity Go). Not fabricated.
**Objectivity:** there are rows favouring each side.
- Robinhood: IRA match, cash yield, hours, margin, equity options.
- Fidelity: account types, mutual funds, transfer-out, service, managed-under-$25k, excess securities coverage.

The verdict names deciding conditions and a "flips if" line.
**(a) Answer first:** partly. The intro difference and the section-1 pick are present, but beginners (half the reader question) are only answered in the FAQ.
**(c) checks:**
- Pass: the index-options fee is correctly scoped, there is no "Fidelity has no IRA match", and there is no coin count.
- Near misses: the Agents tense (finding 6) and the non-Gold APY implication (finding 17).

**(g) Lengths:** title 49, meta 145.

### Hard fails: facts

1. **Strategies fee inverted** (Gold pays the fee only on the first $100k).
   - Table: "Gold covers fee on first $100,000" → "Gold members pay the fee on only the first $100,000"
   - Section 7: "For Robinhood Gold members, the 0.25% management fee is waived on the first $100,000 in assets." → "Robinhood Gold members pay that fee on only the first $100,000 of assets, so it tops out at $250 a year."
2. **SOL is not in the Robinhood coin list.** "Robinhood Crypto supports coins including BTC, ETH, DOGE, and SOL" → "Robinhood Crypto lists coins including BTC, ETH, DOGE, and LINK"
   - Fidelity crypto cell: "crypto IRAs and spot ETPs available" → "crypto IRAs, and crypto ETPs (FBTC, FETH, FSOL)"
3. **Fabricated Fidelity AI tools.** Table cell "Automated screeners, technical pattern recognition, and virtual assistant support" → "Not covered on the Fidelity pages reviewed"
4. **Fabricated Fidelity research claims.**
   - Table cell "StarMine Equity Summary Score combining 10 to 12 third-party research reports, screeners, and active trader software" → "[Equity Summary Score from StarMine](https://fidelity.com/quick-content/etf/help/research/learn_er_opinions.shtml), combining ratings from independent research providers (historically 10 to 12)"
   - Section 6: "Fidelity also provides detailed thematic stock screeners, advanced fixed-income tools, and downloadable trading platforms suited for seasoned market analysts." → delete.
   - Section 6: "which consolidates sentiment ratings from 10 to 12 independent third-party research firms" → "which combines ratings from independent research providers, historically between 10 and 12"
5. **"Thousands" of funds is unsupported** (the fact says "hundreds of other funds").
   - Table: "Thousands available, including four Fidelity ZERO expense ratio index funds and no-transaction-fee funds" → "Fidelity funds plus hundreds of other no-transaction-fee funds, including four ZERO index funds with a 0% expense ratio"
   - Section 5: "Fidelity is an industry giant in mutual funds, offering thousands of options with no transaction fees. Most notably, Fidelity provides four proprietary ZERO index mutual funds" → "Fidelity funds and hundreds of other funds trade with no transaction fee at Fidelity, which also runs four ZERO index mutual funds"
6. **Robinhood Agents described as live.** "Trades execute exclusively inside dedicated agentic trading accounts with manual trade approval enabled by default." → "Robinhood says Agents will use only the funds in a dedicated agentic trading account, with manual trade approval on by default."
7. **Lloyd's attributed to Fidelity** (the facts give only Robinhood's underwriter).
   - "Both companies supplement statutory insurance with private excess-of-SIPC policies underwritten through Lloyd's of London." → "Both firms add excess-of-SIPC coverage. Robinhood's policy is underwritten by [Lloyd's of London](https://robinhood.com/us/en/support/articles/how-youre-protected)."
   - "$50 million in securities and $1.9 million in uninvested cash" → "$50 million in securities, including $1.9 million in uninvested cash"
8. **Unsourced legal claim about Fidelity crypto.** "Cryptocurrency held through Robinhood Crypto or Fidelity Digital Assets, as well as futures contracts at Robinhood Derivatives, are not securities and receive no SIPC protection." → "Robinhood says crypto held through Robinhood Crypto and futures held through Robinhood Derivatives are not SIPC-protected."
9. **Redemption fee misapplied to the ZERO funds.** "Holding these funds inside a taxable account requires care, because selling them within 60 days of purchase can trigger a $49.95 short-term redemption fee on certain funds." → "Separately, Fidelity charges $49.95 when certain mutual funds are redeemed after being held less than 60 days."
10. **Not on this page's closed list.**
    - "Cash enrolled in this sweep program receives pass-through FDIC insurance across Robinhood's network of receiving banks." → delete.
    - "Because SPAXX is a money market mutual fund, it is backed by government securities rather than Federal Deposit Insurance Corporation (FDIC) coverage." → "SPAXX is a money market fund, and [money market funds are not FDIC-insured](https://fidelity.com/go/manage-cash-rising-costs)."
    - "Furthermore, overnight trading volume is significantly lower than daytime market volume, which can lead to wider bid-ask spreads and sudden price changes." → delete.
11. **Section 9 and the transfer FAQ are unsourced procedure.** The unsourced claims are "handled through ACATS without requiring you to liquidate", "initiate … through Fidelity's transfer portal", "fractional shares will be liquidated", "crypto cannot be transferred…" and "equally straightforward".

    Replace the section 9 body with:
    > Moving from Robinhood to Fidelity costs $100: Robinhood charges that for each partial or full ACATS transfer out, taking it from your Robinhood cash or, if there is not enough, from the receiving account. Robinhood's [transfer-out article](https://robinhood.com/us/en/support/articles/transfer-your-assets-out) sets the fee. Moving the other way costs nothing at the Fidelity end, since Fidelity's [pricing page](https://www.fidelity.com/why-fidelity/pricing-fees) lists no account transfer-out fees and no IRA closeout fees.
    >
    > For a Robinhood IRA, the match terms matter more than the fee. Matched money has to stay in the Robinhood IRA for at least 5 years to avoid a possible withdrawal fee, and keeping a Gold match needs 1 year of Gold after the first match. Estimate what the moved balance grows to with our [investment growth calculator](/investing/investment-growth-calculator/).

    Replace the transfer FAQ answer with:
    > Yes. Robinhood charges $100 for each partial or full ACATS transfer out, taken from your Robinhood cash or, if that falls short, from the receiving account. Fidelity charges no transfer-out fee if you later move back. Matched Robinhood IRA money moved within 5 years can trigger a withdrawal fee.

12. **Unsupported and imprecise claims.**
    - "Fidelity's rate decreases to 7.75% only when borrowing exceeds $1 million" → "Fidelity's effective rate is 7.75% for balances of $1 million or more"
    - "competitive margin rates that undercut traditional discount brokers by several percentage points" → "margin rates below Fidelity's at the published tiers (5.25% vs 12.075% under $25,000, as of Sept 17 and Sept 18, 2026; both variable)"
    - "whole-share trading around the clock" → "whole-share trading from Sunday 8 p.m. to Friday 8 p.m. ET"
    - "joint investing accounts with rights of survivorship" → "joint investing accounts for two co-owners"
    - "Robinhood Cortex is legally restricted from giving direct buy or sell advice." → "Robinhood says Cortex 'cannot give buy or sell recommendations.'"
    - "Legend gives users multi-monitor workspaces, real-time depth charting, custom watchlists, and technical analysis indicators. It bridges the gap between Robinhood's historically basic mobile design and professional charting applications." → "Legend gives users real-time charts, technical indicators, and customizable multi-monitor layouts."
    - "Investors maintaining $25,000 or more also receive access to one-on-one financial coaching sessions." → "Financial coaching requires $25,000 or more in an eligible account."
    - Table "Account minimum", Robinhood cell "$0 to open; $2,000 minimum for margin trading" → "$0 to open; margin needs $2,000 or 100% of the purchase price, whichever is less (a FINRA rule)"
    - Verdict: "If you frequently trade OTC penny stocks, bonds, or require direct branch access, Robinhood falls short." → "If you want mutual funds, individual bonds, or an in-person Investor Center, Robinhood falls short." Robinhood does support certain OTC equities.
    - Roth FAQ: "provided the funds remain in the account for five years" → "provided the match stays in the IRA for five years and you keep Gold for one year after your first Gold match"; and "zero-fee index mutual funds" → "zero-expense-ratio index mutual funds"
13. **Overnight wording (DO NOT STATE).** 24-hour FAQ: "No, Fidelity does not offer an overnight 24-hour stock trading market on its published trading schedules." → "Not on the pages Fidelity publishes: its order FAQ lists premarket and after-hours sessions and describes no overnight session."

### Hard fails: links, objectivity, tells

14. **Links gate: zero external links on the page.**
    - Fidelity is unlinked on first mention: intro "Fidelity offers…" → "[Fidelity](https://about.fidelity.com/) offers…"
    - StarMine (finding 4) and Lloyd's (finding 7) are handled above.
    - SIPC first mention (section 8) → "[SIPC](https://www.fidelity.com/why-fidelity/safeguarding-your-accounts)"
    - Table futures cell "plus $0.02 NFA fee" → "plus a [$0.02 NFA fee](https://robinhood.com/us/en/support/articles/before-trading-a-futures-contract)"
    - Fidelity Digital Assets is removed by finding 8.
15. **Unlinked directive.** Verdict: "Check your target account types and verify current margin schedules before moving your cash." → "Confirm current terms on [Robinhood's margin rates](https://robinhood.com/us/en/support/articles/margin-rates) and [Fidelity's margin rates](https://www.fidelity.com/trading/commissions-margin-rates) before moving cash."
16. **Objectivity rule: tie row.** Row "Stock and ETF commissions" ($0 / $0) is not a trade-off → delete it. The fact already sits in the intro, and 17 rows remain. The prompt listed this dimension, so note that for the chart owner.
17. **Intro: inflated words, a clause-stack opener, an unsupported claim, and a vague first-person line.** The problems:
    - "ecosystem", "comprehensive" and "streamlined";
    - "215 physical branches" (the source says Investor Centers);
    - "full banking features" (unsupported);
    - "protect their capital while avoiding friction".

    Replace introText paragraph 1 with:
    > [Fidelity](https://about.fidelity.com/) suits investors who want more account types, mutual funds, and 215 Investor Centers. Robinhood suits investors who want a 3% IRA match with Gold, lower margin rates, and overnight trading through its 24 Hour Market. At ModernWallet, we compare brokers on the fees, cash yields, and account types each one publishes.

    Replace paragraph 2 with:
    > Both charge $0 for online US stock and ETF trades. The costs split once you trade options, hold cash, borrow on margin, or move your account.
18. **Section 1 opener: overloaded, unsupported "in-depth fundamental research", nominalisation.** "Fidelity is the stronger overall broker … overnight trading. Deciding between Robinhood vs Fidelity comes down to…" → "Fidelity is the better all-round home for retirement and long-term investing, with more account types, mutual funds, and Investor Centers. Robinhood is the better fit for active traders who want lower margin rates, a 3% IRA match with Gold, and overnight trading. For a beginner, Robinhood's app and $1 fractional shares make a first purchase simple, while Fidelity adds free Fidelity Go management under $25,000 and phone support at any hour." This also closes the beginner gap.
19. **Anti-AI tells.**
    - "Mutual funds highlight an absolute operational divide between the two brokerages." → delete.
    - "Fidelity provides far more account variety than Robinhood, making it capable of serving a family's complete financial lifecycle from birth to estate planning." → "Fidelity lists more account types than Robinhood, from Youth Accounts and Roth IRAs for Kids to Estate Accounts."
    - "Artificial intelligence represents Robinhood's fastest-moving product frontier." → delete.
    - "Customer service channels differ substantially in accessibility." → delete.
    - "Fidelity leads in institutional equity research and screening tools, whereas Robinhood has concentrated on proprietary charting and newly unveiled artificial intelligence features." → "Fidelity's research edge is its Equity Summary Score; Robinhood's tools are Legend charting and AI features."
    - "Neither broker works as a universal solution for every investor." → delete.
    - FAQ 1: "Neither brokerage is universally better because each serves different investor needs." (hedged non-conclusion) → delete, and start the answer at "Fidelity is better for…"
    - "Robinhood requires an active Gold subscription to unlock its highest sweep yields" → "Robinhood pays its variable 3.6% APY (as of Sept 17, 2026) only to Gold members"
    - "However, unlocking this yield requires paying" → "Earning that rate requires paying"
20. **Headline tells.**
    - Title "Robinhood vs Fidelity: Which Broker Wins in 2026?" (curiosity gap, and implies a winner) → "Robinhood vs Fidelity: Costs and Account Types Compared" (55 characters)
    - Tricolon headings:
      - "Trading Costs, Options Contracts, and Transfer Fees" → "Trading and Transfer Fees"
      - "Cash Sweep Programs, Mutual Funds, and Margin Borrowing" → "Cash Yield and Margin Rates"
      - "Research Platforms, Active Tools, and Artificial Intelligence" → "Research and AI Tools"
      - "Broker Safety, Asset Protection, and Customer Support" → "Account Protection and Customer Support"
21. **Sentence rhythm.** Sentences 4 to 15 (intro into section 1) are all long-band (26, 35, 41, 30, 20, 21, 30, 19, 22, 23, 22, 22). The finding 17 and 18 replacements fix this span. Across the page 102 of 150 sentences are 15+ words.

### Advisory
- "Robinhood operates without brick-and-mortar locations" and "no branches" are not on the closed list, though almost certainly true.
- "Our recommendation flips toward Fidelity if you decide to transfer your portfolio out" reads oddly. Suggest: "The $100 Robinhood transfer-out fee, against $0 at Fidelity, favours Fidelity if you expect to change brokers later."
- "Robinhood does not support HSAs, 529 plans, or employer 401(k) plans" → "Robinhood's account-opening page does not list HSAs, 529 plans, or 401(k)s"
- The meta description does not state the answer. Optional: "Fidelity has more account types, mutual funds and 215 Investor Centers. Robinhood has a 3% IRA match with Gold, lower margin rates and overnight trading." (153 characters)

---

## Summary
- is-robinhood-gold-worth-it: FIX-IN-PLACE (22). The math is sound; fix the Strategies break-even contradiction, the undated rates in the table and meta, the conflated IRA fee, the "regulatory" index fee, the fabricated Morningstar line, the unlinked Nasdaq/Morningstar/IRS/SIPC mentions, the missing "what would change" line, three tricolon headings, and the tells.
- is-robinhood-safe: FIX-IN-PLACE (27). The regulatory-history section is not neutral or exact and gets full replacement text; section 7 and two FAQs make unsourced legal claims (replacements supplied, or REWORK section 7 only); also fix the breach "customer names" wording, the fabricated $250k-per-bank limit, the SEC/FINRA/SIPC links in the intro, the table rows, the neutrality phrase "rather than brand marketing", and the tells.
- robinhood-vs-fidelity: FIX-IN-PLACE (about 35), on the edge of REWORK 1/2. There are about 15 fact errors, the worst being the inverted Strategies fee, SOL, invented Fidelity AI and research tools, Lloyd's credited to Fidelity, "thousands" of funds, Agents described as live, and an unsourced transfer section. The page has no external links, plus a tie table row, a winner-framed title and four tricolon headings. Structure, table breadth and verdict logic are sound, so regeneration is not needed if all the fixes are applied.