# DATA — zakat FAQ addition: debts, mortgage, and retirement accounts

target page: /zakat/ (src/data/calculators.ts, id: "zakat")
task: add ONE new FAQ Q/A to the zakat hub's `faqs` array. Output is a single FAQ answer, no
heading.

question (verbatim): "How do a mortgage, other debt, or a 401(k) I can't access yet affect my zakat calculation?"

register: operator
page type: hub / section index

## Why this FAQ (context, not for the reader)
5 search variants (with loan, with 401k, with debt, with home loan, on property) show demand for
resolving a question the existing "Am I eligible" FAQ flags but never answers.

## CLOSED FACT LIST
Anything not on this list, you do not know. This is a genuine scholarly discussion point on the
retirement-account question — represent it honestly, do not assert a single answer as settled.
1. This site's calculator already applies the net-wealth principle for ordinary debt (restate as
   established internal fact — already on the page): only debts and bills due NOW (short-term,
   currently payable) are subtracted from zakatable wealth. A long-term obligation that is not yet
   due does not reduce the zakatable total.
2. **Mortgage principal specifically**: only the mortgage PAYMENT actually due now (e.g., this
   month's installment) counts as a deductible debt — the full remaining mortgage balance
   stretching years into the future is not subtracted from zakatable wealth. This mirrors the
   reasoning cited by Joe Bradford (a Hanbali-trained scholar with an Islamic-law graduate degree
   from the University of Medina): "The full remaining balance of a mortgage... does not reduce
   zakatable wealth, because these are future obligations." Source:
   https://joebradford.substack.com/p/how-to-calculate-your-zakat
3. **Restricted retirement accounts (401(k)s, traditional IRAs, pensions with an early-withdrawal
   penalty) — a genuinely contested point, present as such**: one well-sourced position (Bradford,
   applying the classical principle of complete ownership, al-milk al-tamm) holds that no zakat is
   due on a restricted retirement account during the years it is inaccessible without penalty,
   because the holder does not have full, unrestricted ownership of it yet — "zakat is not owed on
   wealth you do not fully own." Under this view, once the account becomes fully accessible without
   penalty (e.g., at the applicable retirement age), the full balance enters the zakatable wealth
   going forward. Other scholars take a more inclusive view and count the account (or its estimated
   after-penalty, after-tax net value) as zakatable each year regardless of the access restriction.
   Do not present one of these views as the single correct answer — say plainly that this is a
   real point of ongoing scholarly disagreement. Source: https://joebradford.substack.com/p/zakat-on-retirement-accounts-a-complete
4. This site's calculator does not have a dedicated retirement-account input field or an
   automatic restricted-access adjustment — restate as established internal fact, no citation
   needed.

## CLOSED URL LIST (external — the ONLY hrefs this FAQ may use)
- https://joebradford.substack.com/p/how-to-calculate-your-zakat
- https://joebradford.substack.com/p/zakat-on-retirement-accounts-a-complete

## Task
Write a 3-5 sentence FAQ answer. Lead with the direct answer on ordinary debt/mortgage treatment
(fact 1-2). Then address the retirement-account question as a genuinely open scholarly question
(fact 3), without picking a winner, and tell the reader to bring their specific numbers to a
qualified scholar if the restricted-account question applies to them. Do not invent a percentage,
age threshold, or dollar figure beyond what the facts state.
