## Evidence
- GSC: not queried (no credentials in cloud env); intent from H1 "IRS Mileage Rate 2026: Two Rates, One Year".
- STEP 1 numbers (30d): 77 people, 77 uses, 1762 views, use_rate 0.044, people_7d 14.

## Persona
Freelance delivery driver, 38, phone in the car between stops; searched "IRS mileage rate 2026" for the rate, not a calculator. "Done" = the rate for their miles and a rough tax saving.

## Walkthrough
Desktop 1366: typed 4,200 and 5,100 business miles; result $6,921 deduction, tax saved $1,808 (income tax $831 + SE tax $978), per-half math correct (4,200 x 72.5c = $3,045; 5,100 x 76c = $3,876). Phone 390: the tool starts ~747px down (after a long intro), rate buttons and checkbox are 6 controls under 36px tall, no overflow, no console errors.

## Friction
- low use (4.4%): a rate-seeking visitor reads the answer in the intro and never scrolls to the tool; the tool sits below ~750px on a phone.
- Tax-rate buttons and checkbox are under 36px high on phone (small tap targets).
- Reading only the intro, the visitor has no pointer to "try your miles" near the rate answer.

## Monetization
Verdict: no-fit (no new row: the book picks below are already live and were re-verified in this walkthrough; the gate only accepts fit|no-fit|blocked, so "already shipped" is recorded as no-fit)
Already shipped: Nolo/Fishman business-vehicle books under the result (YMYL books rule). No change.

Ranked product types:
1. Business vehicle deduction book (Deduct It!, Nolo)
2. Small-business tax strategy book (Tax Savvy, Nolo)
3. Self-employed recordkeeping/tax-guide book
