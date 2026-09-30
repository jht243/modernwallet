route: /compare/401k-vs-brokerage-account/
slug: 401k-vs-brokerage-account--faq-early-retirement
page type: comparison
medium: text -> text
reader question: "401k vs brokerage account for retiring early?" [autocomplete-confirmed sub-intents for this page's head term: "401k vs brokerage account fire", "fire 401k vs brokerage account", "401k vs brokerage early retirement", "401k vs brokerage for retirement early". The page covers the 59½ penalty and liquidity generally but never addresses the early-retirement case or the ways around the penalty.]

TASK: Write ONE new FAQ entry (question + answer only, no heading) to append to this page's `faqs` array. The question is: "Is a brokerage account or a 401(k) better if I want to retire before 59½?"

Answer directly: use both, in the order the page already recommends, and treat the brokerage account as the bridge that funds the years before penalty-free 401(k) access. Then give the mechanism using ONLY the closed fact list: the 401(k) still comes first up to the full match; money withdrawn from a 401(k) before 59½ normally carries the 10% additional tax on top of ordinary income tax; a brokerage account has no age restriction or penalty and long-term gains there are taxed at 0%, 15% or 20%, with the 0% bracket topping out at $49,450 for single filers and $98,900 for married couples filing jointly in 2026; the IRS lists exceptions to the 10% additional tax, including the rule-of-55 exception (distributions after you leave the employer, in or after the year you turn 55, from that employer's plan only) and substantially equal periodic payments. Say the exceptions have conditions and to confirm the plan's rules. Link the IRS page once and end with a pointer to the funding-order section or /retirement/early-retirement-calculator/.

CLOSED FACT LIST — the only claims this answer may state:
- Fund the 401(k) first up to the full employer match; that order is this page's default.
- Withdrawals from a 401(k) before age 59½ normally carry a 10% additional tax on top of ordinary income tax.
- A taxable brokerage account has no age restriction and no early-withdrawal penalty; you owe tax on dividends, interest and gains as they occur.
- 2026 long-term capital gains rates are 0%, 15% or 20%; the 0% bracket tops out at $49,450 for single filers and $98,900 for married couples filing jointly.
- IRS Topic 558 lists exceptions to the 10% additional tax on early distributions from employer plans. Two of them: (1) separation from service in or after the year you turn 55, which applies to the plan of the employer you left and not to IRAs or plans of earlier employers; (2) a series of substantially equal periodic payments.
- Each exception has conditions, and plan rules can be stricter, so the reader should confirm details with the IRS page and the plan administrator.
Anything not on this list, you do not know. Do NOT state a withdrawal rate, a required savings amount, the length of the equal-payment schedule, a retirement-age target, or any statistic not listed.

CLOSED URL LIST: https://www.irs.gov/taxtopics/tc558 (use once, as a markdown link with anchor text "IRS Topic 558").
Internal links allowed (markdown, real routes only): [early retirement calculator](/retirement/early-retirement-calculator/). At most once.

Output: a single FAQ answer, 4-5 sentences, in the page's existing FAQ-answer voice (direct answer first, then mechanism, then next step). Do not repeat the wording of the existing FAQs.
```json
{
  "question": "...",
  "answer": "..."
}
```

# CORRECTIONS FROM THE PHASE 4 AUDIT (regeneration 1)
- Defect: two overloaded sentences (~45-50 words each, 3+ ideas). Rule: every sentence under 30 words, one idea each, no semicolons. Split the brokerage sentence into: tax on dividends, interest and gains as they occur; the 0/15/20% long-term rates; the 0% bracket thresholds. Split the IRS sentence into: the IRS Topic 558 link naming that exceptions exist; the two exceptions (age-55 separation applies to that employer's plan only; substantially equal periodic payments); "each has conditions and plan rules can be stricter." Do not add a separate unlinked "confirm with IRS guidance" sentence. Drop the repeated "no age restrictions" clause so the answer stays within 6 short sentences.
