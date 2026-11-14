# Sources: /retirement/401k-loan-calculator/ (checked 2026-11-14)
- 26 U.S.C. 72(p)(1)-(3), https://www.law.cornell.edu/uscode/text/26/72 (HTTP 200, 2026-11-14; extracted in research/statute-extracts.md). (p)(2)(A) two-prong limit, (p)(2)(B) 5-year term with the principal-residence exception, (p)(2)(C) level amortization at least quarterly, (p)(1) deemed distribution, (p)(3) interest deduction denial for key employees.
- 26 U.S.C. 4975(c)(1)(B), 4975(d)(1)(A)-(E), 4975(f)(6)(A)-(B), https://www.law.cornell.edu/uscode/text/26/4975 (HTTP 200, 2026-11-14). Used only for the short solo 401(k) pointer.
- 26 U.S.C. 416(i)(1)(A), https://www.law.cornell.edu/uscode/text/26/416 (HTTP 200, 2026-11-14). A 5-percent owner is a key employee.
- IRS "Retirement plans FAQs regarding loans" returned HTTP 404 from the runner on 2026-11-14; not used. No plan-provider claims, no market-rate claims.
- Level-payment formula: payment = P x r / (1 - (1 + r)^-n), as used site-wide (src/lib/loan-payment.ts).
- APRs of 6, 8 and 10 percent are example inputs, not plan or market rates.
