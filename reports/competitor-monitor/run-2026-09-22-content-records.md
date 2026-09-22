# Phase 3/4 content records — 2026-09-22 run

standard-loaded: cs=99c49d6f aa=71a2ad6a exp=31d70e56 domain="The Modern Wallet (themodernwallet.com) is a personal-financ"
(receipt: `reports/standards-ledger.jsonl`, routine=competitor-monitor-auto, phase=phase-3-generate)

## Scope decision

Phase 1 scraping surfaced 6,728 raw candidates (inflated by a 6,432-item `pending-retry`
backlog accumulated across prior runs — flagged separately in the email, not addressed here).
After filtering ephemeral daily-news snapshots, off-niche health calculators, and single-vendor
reviews/vendor-branded roundups (too fact-verification-heavy for reliable sourcing in one run),
Phase 2 dedup left 9 NEW candidates (1 DUPLICATE dropped: NerdWallet's general "Best Business
Credit Cards" duplicates this site's own `/roundup/best-business-credit-cards/`).

Of the 9 NEW candidates, this run generated and published **2**: `best-same-day-business-loans`
and `best-business-bank-accounts`. The other 7 (card-fee-angle roundups: no-annual-fee,
cash-back, sole-proprietorship, startup-no-credit, no-credit-check, 0%-APR business cards, and
bad-credit business loans) require per-card fact verification (APR, fee, credit-tier claims for
5+ named products each) that two issuer pages (Amex, Chase) refused to serve to WebFetch this
run. Rather than publish under-verified YMYL financial-product claims, they were left `pending`
in the ledger to resurface and be researched properly on a future run.

## Pages generated

| Slug | File | medium | register | page type | body words | floor |
|---|---|---|---|---|---|---|
| best-same-day-business-loans | roundups-business.ts | text → text | operator | review | ~2,069 | 1,500 |
| best-business-bank-accounts | roundups-business.ts | text → text | operator | review | ~2,515 | 1,500 |

Both generated via `scripts/lib/content_gen.py write --schema none --format json` (model
gemini-3.8-flash, see `.meta.json` beside each draft in
`reports/competitor-monitor/2026-09-22/drafts/`). Facts came from primary-source WebFetch/
WebSearch of each named lender/bank's own site (OnDeck, Credibly, Fundbox, National Funding;
Bluevine, Mercury, NBKC, Axos), fetched 2026-09-22, closed into the row prompts before
generation.

## Phase 4 audit — findings and fixes

A direct read-through audit ran against both drafts per `_content-standard.md` AUDITOR +
`_anti-ai-language.md` AUDITOR, immediately after generation, before staging. Findings and
fixes:

**best-same-day-business-loans**
- Fabricated credit-score figure ("620") in the verdict, not on the closed fact list → replaced
  with the two real sourced thresholds (OnDeck 625, Credibly 500).
- Named an unverified third-party service ("Plaid") the lenders were never confirmed to use →
  genericized to "an automated bank-account connection."
- Invented a "20 percent equity" personal-guarantee threshold not sourced to any of the 4
  lenders → softened to a general, unquantified statement.
- Invented a "40% to 75% APR corridor" extrapolated beyond the two real disclosed figures →
  rewritten to cite only OnDeck's actual disclosed averages (53.2% / 59.8%).
- Invented a "24 to 72 hours" disbursement figure for Fundbox (which publishes none) → replaced
  with the real, sourced National Funding figure and an explicit "not published" for Fundbox.
- Coy-abstraction ("The company") on two options after the subject was already named → replaced
  with the real names (OnDeck, National Funding).
- LINKS gate: first mentions of OnDeck/Credibly fell in `introText` (unlinked) while the linked
  mentions were in section 1 (not first) → added links at the true first mention; added missing
  links for First Electronic Bank, Lead Bank, and Federal Reserve (named but never linked).
- Two headline tells: "actually" as the insight word in two section headings → removed, headings
  restated as direct claims.
- Missing brand-naming at first "we" claim → added "At ModernWallet, we…" as required by VOICE.
- Sentence-rhythm gate: both the intro and 3 of 4 sections ran 10+ consecutive long sentences →
  rewritten throughout for genuine short/medium/long variation (see word-count script; no
  remaining monotone runs or 5-in-a-row tight-length runs).
- A JSON-escaping bug introduced during the fix pass (unescaped double quotes) broke the draft;
  caught by `python3 -m json.tool` validation and corrected before staging.

**best-business-bank-accounts**
- Brand name error: "The Modern Wallet" (wrong) → "ModernWallet" (SITE.name).
- Self-asserted neutrality: "unbiased recommendations" → NEUTRALITY gate hard-fail → removed.
- Fabricated/unverified claims that turned out to be independently confirmable via further
  research (Bluevine's Green Dot cash-deposit network and its $4.95 fee; NBKC/Axos cash deposits
  via MoneyPass/Allpoint ATMs) → re-verified via WebSearch against the providers' own support
  pages, then corrected to state the real, now-sourced figures instead of the vague "confirm on
  site" / "select ATMs" language the draft had used for unsourced claims.
- Deferral-in-cell hard fail: the comparison table's Bluevine outgoing-wire cell read "Confirm on
  site" → researched and replaced with the real figure ($15, confirmed on
  bluevine.com/business-checking/payments).
- Bluevine's own outgoing domestic wire fee ($15) was never in the original closed fact list
  (a real gap in Phase-3 research) → sourced and added to the pricing field, limitations, verdict
  consistency, and the FAQ that compares wire fees across all four accounts.
- "unlock" (banned hype verb) → replaced.
- Coy-abstraction ("The platform") twice after Mercury was already named → replaced with
  "Mercury."
- LINKS gate: Mastercard, Green Dot, Choice Financial Group, Column N.A., MoneyPass, QuickBooks,
  Allpoint, and Xero were all named without a link at first mention → added real official links
  for all eight.
- One headline tell: "Fintech Account or Chartered Bank: Understanding Sweep Insurance Networks"
  used the banned two-clause colon-splice formula → rewritten as one clause ("Why Fintech
  Accounts Advertise Millions in FDIC Coverage").
- Sentence-rhythm gate: the intro, verdict, and all 4 sections ran long monotone stretches
  (up to 10+ long sentences in a row) → rewritten throughout; one remaining 10-run required a
  second pass (splitting one 35-word sentence). No remaining monotone runs or tight-length runs
  after the fix.

No plagiarism: neither page copies or paraphrases sentence-by-sentence from NerdWallet's
outline (used only as a topic-coverage floor, per the launcher's rule); the competitor is never
named on either page. Both pages exceed NerdWallet's likely coverage with dedicated sections
("How Same-Day Funding Works" / "Why Fintech Accounts Advertise Millions in FDIC Coverage") that
surface information most competitor roundups omit (OnDeck's disclosed average APR; the
partner-bank sweep-insurance mechanism).

Both pages cleared audit after this single rework round. Neither required `draft: true`.
