route: /guides/is-social-security-taxable/
slug: is-social-security-taxable--faq-2026
page type: guide (existing page — one new FAQ)
medium: text -> text
reader question: "Will Social Security be taxed in 2026?" [evidence: Google Autocomplete — will social security taxed in 2026; is social security taxable in 2026; will social security tax stop.]
TASK: Write ONE new FAQ answer (no heading) for the question "Will Social Security be taxed in 2026?". 3 sentences: (1) yes, the same combined-income rules apply in 2026; (2) the new senior deduction of up to $6,000 per person 65+ (2025 through 2028, phasing out above $75,000 / $150,000 MAGI) lowers taxable income but does not change how much of the benefit is taxable; (3) for many middle-income retirees that can reduce or erase the tax actually owed. No links.
Output exactly:
```json
{"question":"Will Social Security be taxed in 2026?","answer":"..."}
```
CLOSED FACT LIST:
- Enhanced deduction for seniors: $6,000 per eligible individual; $12,000 for a married couple if both qualify; tax years 2025 through 2028. [IRS OBBB newsroom page; IRS "check your eligibility" page]
- Phases out for MAGI over $75,000 ($150,000 for joint filers). [same]
- Phase-out math (Schedule 1-A Part V): MAGI minus $75,000 ($150,000 MFJ), times 6%, subtracted from $6,000; not below zero. [Schedule 1-A PDF]
- Worked arithmetic allowed: single filer with $100,000 MAGI → $25,000 over × 6% = $1,500 reduction → $4,500 deduction. (Arithmetic from the IRS formula.)
- Claimed on Schedule 1-A; flows to Form 1040/1040-SR line 13b. [Schedule 1-A; IRS Schedule 1-A newsroom page]
- Available whether you take the standard deduction or itemize. [OBBB page; Pub 554]
- If married, you must file jointly to claim it. [OBBB page; Schedule 1-A; Pub 554]
- Requires a valid SSN (valid for employment, issued before the return due date including extensions). [Pub 554]
- Age: must be 65 by the last day of the tax year (IRS: born before January 2, 1961 for 2025). [OBBB page; Pub 554]
- It is in addition to the existing additional standard deduction for age 65 or older. [OBBB page; Pub 554]
- Existing additional standard deduction for 2026: $1,650 per qualifying person, or $2,050 if unmarried and not a surviving spouse. [Rev. Proc. 2025-32]
- 2026 basic standard deduction: $16,100 single/MFS, $32,200 MFJ, $24,150 head of household. [IRS 2026 inflation adjustments release]
- MAGI for this deduction = AGI (Form 1040 line 11b) plus certain excluded foreign/territory income; Social Security counts only to the extent it is in AGI. [Schedule 1-A Part I]
- The IRS pages do NOT say the deduction makes Social Security tax-free. The taxation of benefits rules (Pub 915) are unchanged; the deduction reduces taxable income, it does not change how much of the benefit is included. (State it as: the law did not change the benefit-taxation rules.)
- Social Security taxation (Pub 915): compare one-half of benefits plus all other income including tax-exempt interest against the base amount: $25,000 single/HOH/qualifying surviving spouse (and MFS living apart all year); $32,000 MFJ; $0 MFS if lived with spouse any time in the year.
- Up to 50% of benefits taxable generally; up to 85% if one-half of benefits plus other income exceeds $34,000 ($44,000 MFJ), or if MFS and lived with spouse.
- Never more than 85% of benefits is taxable.
- Form W-4V: withholding of 7%, 10%, 12%, or 22% of each Social Security payment, no other percentage.
- DO NOT USE: the income where the deduction reaches zero; whether thresholds are inflation-indexed; any statute section numbers.
Anything not on this list, you do not know.
CLOSED URL LIST: none.
