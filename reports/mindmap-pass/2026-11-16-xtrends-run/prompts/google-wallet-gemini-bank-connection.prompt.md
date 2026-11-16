# Approved Page Assignment: `/guides/google-wallet-gemini-bank-connection` (`google-wallet-gemini-bank-connection`)
- **Action ID:** `A6` (create new content)
- **Title:** Google Wallet in Gemini: Should You Connect Your Bank?
- **Page Type / Format / Medium:** guide | article - the reader needs a decision explainer with setup and removal steps | text
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Should I connect my bank accounts to Gemini through Google Wallet? [ac 7/37 on-intent question completions (what it does, how it works, is it safe, is it free, should it be used, does it work, not working); PAA unread - no DataForSEO key]
- **Working Answer (Col 11):** Connect only if you accept that Google and Plaid store your account details and transaction history while linked, and want conversational budgeting help: Google says Gemini can only read the data and cannot move or invest money, and you can disconnect it or unlink accounts, but you must also delete chats to remove what Gemini remembered; skip it if you use a work account or want transaction data kept out of an AI product.
- **Answer Placement (Col 12):** section 1: "Should You Connect Your Bank Accounts to Gemini?"

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent plus release news (Google blog Nov 13 2026). lookup: no match in repo, sitemap or past charts; /roundup/best-budgeting-apps is an app ranking (different reader goal). Autocomplete question sweep run on seed 'google wallet gemini' (37 suggestions, research/autocomplete-gemini-wallet.csv; not measured volume, no keyword key): demand inferred - launch, no tool volume yet; cited signal: blog.google launch, 9to5Google and Engadget coverage per brief. Commits: no prior commits touch this route.
- **Keyword Evidence:** "Primary: 'google wallet gemini'; supporting: 'connect bank accounts to gemini', 'gemini budgeting', 'gemini personal intelligence connected apps'. Demand: inferred - launch (blog.google Nov 13 2026), no tool volume; NOT measured. Free Google Autocomplete question sweep run 2026-11-16 (37 suggestions, seed 'google wallet gemini', research/autocomplete-gemini-wallet.csv). No keyword provider key in this worker."
- **Why New Page / Angle:** No existing route (lookup: none found in repo data, search index or sitemaps). /roundup/best-budgeting-apps ranks budgeting apps (different goal). No commits touch the route. Independent duplicate decision to be made by CHART-REVIEW.
- **Intent-Based Our Takeaway:** "Connect it only if you want conversational spending analysis and accept that Google and Plaid store your account details and transaction history while linked and that your chats with Gemini are saved while Keep Activity is on (Google describes Gemini's access as read-only, which limits actions, not data exposure); it applies to adults with a personal US account; skip or use a manual budget if you do not want financial data linked to an AI product. This changes if Google changes data-use terms or access (verify the Help page)."

## Approved Section Outline
1. **Should You Connect Your Bank Accounts to Gemini?** — Opening answer with the conditions that change it
2. **What Gemini Can See Through Google Wallet and Plaid** — Transaction data from linked accounts, rewards and passes; example prompts Google lists
3. **What Gemini Cannot Do With Your Money** — Google says Gemini can only read the data and cannot move, manage, invest, update or delete linked accounts; stated as Google's description of the connected app, not as a guarantee of safety
4. **What Google and Plaid Store While Your Accounts Are Linked** — Google Pay Help: both store account or card number, routing number, transaction history, balance, name, address, phone and email while linked; Gemini Connected Apps help lists Wallet data as payment methods, receipts, Wallet data and linked financial account info; Keep Activity must be on, so Gemini Apps Activity is part of the trade-off
5. **Who Can Use It Today** — US, 18+, personal Google Account, English, mobile app and web, Keep Activity on, not in Gems or Gemini Live; note blog vs Help page wording on rollout
6. **How to Turn Off Google Wallet in Gemini and Delete Your Data** — Two steps per Gemini help: delete chats containing the info from Gemini Apps Activity AND disconnect the app (disconnecting alone can leave info in past chats); turning off Personal Intelligence does not stop chats being saved; unlink accounts in Google Wallet settings (Google then deletes that account's transaction history); Plaid Portal can delete data from Plaid systems; Plaid keeps data for non-Google links until removed there
7. **Privacy Trade-Offs for Budgeting** — What sharing buys (spending review, subscription and price-increase flags, holiday budget) vs. what it costs; alternatives such as a manual budget; plainly lists what Google's and Plaid's pages do not answer: how long Gemini keeps chat content that contains account details, and how Plaid treats data after you unlink inside Google Wallet (we did not read Google's separate Gemini data-handling page)
8. **Common Questions About Gemini and Google Wallet** — FAQ on safety, cost, disconnecting, work accounts

## Approved Internal Outbound Links
- {"source": "/guides/google-wallet-gemini-bank-connection", "target": "/roundup/best-budgeting-apps", "section": "Privacy Trade-Offs for Budgeting", "anchor": "best budgeting apps", "purpose": "Alternatives to bank-linked AI", "inspection": {"path": "src/data/roundups.ts", "sha256": "294e7a21d885d2c4edddd75d51f848e563c13071d18b7701e18fed54f45f7d8b"}}
- {"source": "/guides/google-wallet-gemini-bank-connection", "target": "/budget/monthly-budget-calculator", "section": "Privacy Trade-Offs for Budgeting", "anchor": "monthly budget calculator", "purpose": "Manual budgeting alternative", "inspection": {"path": "src/data/spokes-budget.ts", "sha256": "d8b17e7f2f6a7ffe6e6733a47f76f524efe20d9b5380fef69215b3b6d40d2d13"}}


## Writer rules specific to this run (read with the system contract)
- Operator register, page type guide. Sentence 1 of `introText` is the direct answer. The brand first-"we" rule: the first company claim reads "At ModernWallet, we ...". The brand name is ModernWallet.
- Evidence basis and visible attribution are fixed below under PROVENANCE. Use exactly the attribution the basis supports. Do not claim any product test, hands-on trial, client conversation or survey. No TESTED labels, no "How We Tested" section, no "we tested".
- Anything not on the CLOSED FACT LIST, you do not know. Never invent a number, date, price, limit, benchmark or URL. If a fact is unpublished or not answered by the sources, say so plainly instead of guessing.
- External links come only from the CLOSED URL LIST (markdown links, first mention of each organization). Internal links come only from the INTERNAL LINKS list.
- Do not mention these workflow notes, reviewer notes, run files or internal evidence labels in the page.
- Never write about the page itself ("this guide", "this page"). Zero em-dashes. Number ranges use "to".

## HARD CONSTRAINTS FROM THE INDEPENDENT CHART REVIEW (non-negotiable)
1. Never say or imply that Plaid deletes your data after you unlink an account inside Google Wallet. Google's Help page says only that Google deletes that account's transaction history, and that Plaid keeps data for accounts linked through a non-Google service. How Plaid treats data after an unlink inside Google Wallet is NOT answered by the pages we read. Say that plainly.
2. "Read-only" limits what Gemini can DO with your accounts (it cannot move, manage or invest money). It does not limit what is stored or how long chat content is kept. State this distinction. Never present read-only as a safety guarantee. Attribute it as Google's description of the connected app.
3. Disclose what Google's and Plaid's pages do not answer: (a) how long Gemini keeps chat content that contains account details; (b) how Plaid treats data after you unlink inside Google Wallet; (c) we did not read Google's separate page on how data is handled when Gemini works with Connected Apps. Put this in "Privacy Trade-Offs for Budgeting" and mention it in the takeaway.
4. No retention duration, no deletion claim beyond the sources below. We did not test Gemini, Google Wallet or Plaid; every claim is attributed ("Google says", "Google's Help page states", "Plaid says").
5. Do not call the Help page and the blog contradictory. Say the blog describes a rollout to all Gemini app users in the U.S., and the Help page says Google is making the feature available gradually, so it may not show for you yet.

## PROVENANCE (visible attribution)
- Basis: reported. Every claim comes from Google's or Plaid's own published pages (named and linked at first mention). We did not test any of it. Where we compare or advise, we say so as our reading of those pages ("In our reading of Google's Help pages, ..."), never as a test.
- Counterexample to state beside the safety question: Google's read-only statement limits actions, not storage.

## PLANNED TAKEAWAY (place at the end of "Privacy Trade-Offs for Budgeting" or as the last body paragraph before the FAQ; do not repeat the opening verbatim)
- Connect only if you want conversational spending analysis and accept that Google and Plaid store your account details and transaction history while accounts are linked, and that your Gemini chats are saved while Keep Activity is on. Applies to adults in the U.S. with a personal Google Account. Skip it, or use a manual budget, if you do not want financial data linked to an AI product or if you sign in with a work or school account. Changes if Google changes data-use terms or access; verify on the linked Help page.
- Who this is not for: anyone who wants transaction data kept out of an AI product, anyone on a work, school or supervised account (not eligible), anyone outside the U.S. or under 18.
- What would change our answer: Google publishing how long Gemini keeps chat content that contains account details, Plaid stating how it treats data after an unlink inside Google Wallet, or a change to the read-only access.
- Final body sentence: a concrete next action (for example, read the linked Help page before connecting, or try a manual budget in the monthly budget calculator first) that carries the phrase "Google Wallet in Gemini".

## CLOSED FACT LIST (every claim the page may state)
Anything not on this list, you do not know.

Release (Google blog, Nov. 13, 2026, "Connect Google Wallet to Gemini for personal finance insights"; Plaid blog, Nov. 13, 2026)
- Google added Google Wallet to the list of connected apps in Personal Intelligence in Gemini on Nov. 13, 2026. Google's blog says it is "rolling out today for all Gemini app users in the U.S." on web and mobile, on Android and iOS.
- You connect Wallet under Connected Apps in Personal Intelligence settings. You can also link financial accounts from credit cards and banks to Wallet through Plaid "to unlock deeper insights". Plaid's blog says people can link bank accounts, credit cards, loans and investment accounts to Google Wallet through Plaid.
- To use it, tag @Google Wallet in Gemini and ask about personal finance and budgeting. If Gemini does not use the app, mention "Google Wallet" or add @Google Wallet to the prompt (Gemini Apps Help).
- Google's example prompts: "can we review my spending from last quarter so I can save $1,000 over the next three months?" (Gemini generates dynamic charts tracking cash flow, asset allocation and budgets in chat); "what subscriptions am I still paying for, and did any of them go up in price this year?" (Gemini finds recurring charges across linked accounts and flags price increases); "how much did I spend on gifts and travel last year? Use that to help me set a holiday budget for this year" (Gemini looks at transactions from the last year and suggests a budget).
- Gemini Apps Help lists three things the connected app can do: provide insights from transaction data from financial accounts linked through services like Plaid; summarize expense activity and give budgeting tips; check and summarize available rewards and special offers based on cards and passes in Google Wallet. Its example prompts include "How much did I spend on groceries last month?", a boarding pass lookup and airline loyalty numbers.
- What the Wallet connected app covers (Gemini Apps Help, Connect your Google apps): "your payment methods, receipts, data from Google services saved in Wallet, and financial account info linked with services such as Plaid", in the U.S. only.

What Gemini cannot do
- Google's blog: if you connect Wallet, "Gemini can only read information from your accounts; it can't move, manage, or invest your money." You decide whether to opt in and can turn the connection on or off at any time. Plaid's blog: Gemini has read-only access and cannot move, manage or invest money.
- Gemini Apps Help: Gemini cannot make transactions using payment methods in Google Wallet, and cannot update or delete connected financial accounts. You do those in Google Wallet settings.
- Counterexample (our reading): the read-only statement describes actions. It does not say anything about what Google or Plaid store, or how long Gemini keeps chat content.

What Google and Plaid store while accounts are linked (Google Pay Help, "Manage your accounts linked with Plaid (US only)")
- Google Wallet works with Plaid, a third-party service, to obtain transaction and balance info. Plaid collects and uses your financial institution login info and accesses your account.
- Both Plaid and Google store this while your account is linked: credit card or bank account number; bank routing number, if applicable; account transaction history; account balance; basic identity information (name, address, phone number, email address). Plaid's Privacy Policy details how Plaid handles your data.
- Gemini Apps Help: Google Wallet connection requires Keep Activity on; Gemini Apps cannot connect to Google Wallet when that setting is off. Gemini Apps Activity is therefore part of the trade-off: chats are saved while Keep Activity is on. (Do not state how long chats are kept.)
- Plaid's consumer page: Plaid says it does not share your financial institution username and password with apps, transfers data through its application programming interface (API), uses AES-256 and TLS encryption, and does not charge you for connecting accounts (the app pays a fee). You can disconnect accounts from apps or delete your data from Plaid's systems in Plaid Portal.
- Gemini Apps Help: Gemini can still use public information from certain Google services such as Google Search and YouTube even if an app is disconnected.

Who can use it today (Gemini Apps Help, "Get info & personalized insights from Google Wallet with Gemini Apps", and "Connect your Google apps")
- You must be 18 or over and in the U.S.; sign in to Gemini Apps with a personal Google Account (not available with a work, school or supervised Google Account); have Keep Activity on.
- For now it is only available in English, only in the Gemini mobile app and the Gemini web app at gemini.google.com, and not in certain features such as Gems or Gemini Live.
- Google says it is "gradually making this feature available, so it might not be available to you just yet." (Help). The blog says rolling out today for all Gemini app users in the U.S. Present both as two descriptions of the same rollout.
- The saved pages do not state a price for the Wallet connection. Plaid says it does not charge you for connecting accounts.

How to turn it off and delete your data
1. Disconnect Wallet in Gemini: in the Gemini mobile app tap Menu, then your Profile picture or initial, then Personal Intelligence, then Connected Apps, and turn Google Wallet off. In the Gemini web app at gemini.google.com open Menu, Settings, Personal Intelligence, Connected Apps, then More options and Disconnect.
2. Delete what Gemini remembered (Gemini Apps Help): delete all chats containing the info from Gemini Apps Activity or Recent chats, AND disconnect the app. You must do both: if you only disconnect, Gemini might still use the info if it is in a past chat; if you only delete the chats, Gemini might still find the info in the connected app.
3. Turning Personal Intelligence off for one chat does not stop that chat from being saved to Gemini Apps Activity or used to personalize a response in another chat. To chat without saving activity to your Google Account, use a temporary chat.
4. Unlink bank accounts (Google Pay Help): on the Google Wallet website, click Settings, then Accounts linked with Plaid, select the account, click Unlink and confirm. Gemini Apps Help also says you can unlink accounts any time in Google Wallet settings.
5. When you remove an account from Google Wallet, Google deletes the transaction history associated with that account (Google Pay Help). If you have accounts linked through Plaid with a non-Google service, Plaid continues to store your data. To manage those, contact Plaid, and you can delete accounts from Plaid's portal. DO NOT say Plaid deletes data after you unlink in Google Wallet: the pages do not say so.
6. Memory Summary (Google blog): open Profile, then Personal Intelligence, then Memory Summary to view, refine or remove details Gemini saved about your preferences, interests and goals.
7. If a linked account disconnects (Google Pay Help): reasons include a bank interrupting the connection for security maintenance, changed credentials, an account that is not found or an expired linked card, and multi-factor authentication (MFA) that Google does not support. Reconnect from Settings, Accounts linked with Plaid, then Reconnect. Transactions can take several minutes to appear after linking or reconnecting.

NOT ANSWERED by the sources (state this plainly; never fill the gap)
- How long Gemini keeps chat content that contains your account details.
- How Plaid treats your data after you unlink an account inside Google Wallet.
- Google's separate page on how data is handled when Gemini works with Connected Apps was not read by us.

Vendor-reported statistic (optional, attribute to Plaid): Plaid's State of Intelligent Finance report found 55% of people used AI for a money-related task in the past year, and 86% of those users say it helps them understand money. Use at most once, clearly as Plaid's own figure, or omit.

## CLOSED URL LIST (first mention of each, markdown links)
- https://blog.google/innovation-and-ai/products/gemini-app/google-wallet-gemini-app/  (Google blog post, Nov. 13, 2026; link first mention of Google)
- https://support.google.com/gemini/answer/18112192  (Gemini Apps Help: Google Wallet)
- https://support.google.com/gemini/answer/16598406?hl=en  (Gemini Apps Help: Connect your Google apps, Connected Apps)
- https://support.google.com/googlepay/answer/10193349?hl=en  (Google Pay Help: accounts linked with Plaid)
- https://plaid.com/how-it-works-for-consumers/  (Plaid for consumers; link first mention of Plaid)
- https://plaid.com/blog/google-wallet-gemini-plaid/  (Plaid blog, Nov. 13, 2026)

## INTERNAL LINKS
- /roundup/best-budgeting-apps/  anchor "best budgeting apps" (in Privacy Trade-Offs for Budgeting, alternatives to bank-linked AI)
- /budget/monthly-budget-calculator/  anchor "monthly budget calculator" (manual budgeting alternative, and the final next action)

## FAQ SPEC (4 to 6 questions, sentence case, direct answer first)
- Is Google Wallet in Gemini safe? (Google's read-only description; stored data; unanswered retention; this is not a safety guarantee)
- Is Google Wallet in Gemini free? (the saved pages state no price; Plaid says it does not charge you for connecting accounts)
- How do I turn off Google Wallet in Gemini? (two-step deletion; disconnect)
- Can Gemini move money or pay bills from Google Wallet? (No: Google says it can only read and cannot move, manage or invest money, and cannot make transactions with Wallet payment methods)
- Does Google Wallet in Gemini work with a work account? (No: personal Google Account only; also 18 or over, U.S., English)
- Why is Google Wallet in Gemini not working for me? (eligibility list; Keep Activity off; gradual availability; linked account needs reconnecting)

## SECTION COVERAGE
Follow the approved outline exactly (headings above, Title Case). Section 1 ("Should You Connect Your Bank Accounts to Gemini?") opens with the working answer and the conditions that change it. The "What Gemini Cannot Do With Your Money" section holds a GFM table in `body` with columns Capability | What Gemini does or cannot do | Source, rows for: reads transaction data from linked accounts, summarizes spending and budgeting tips, summarizes rewards and offers from cards and passes, moves or invests money (cannot), makes transactions with Wallet payment methods (cannot), updates or deletes linked accounts (cannot; done in Google Wallet settings). The "How to Turn Off Google Wallet in Gemini and Delete Your Data" section uses a numbered list of the steps above. `title`: Google Wallet in Gemini: Should You Connect Your Bank?  Heading "How to Turn Off Google Wallet in Gemini and Delete Your Data" must keep that exact wording.


## ROUND 2 ADDITION: CLOSED FACTS FROM Google's Connected Apps data page (saved verbatim at research/sources/gemini-connected-apps-data.txt)
- URL https://support.google.com/gemini/answer/16836988 (Gemini Apps Help, data used with Connected Apps).
- Google says: "When connected to Gemini, a subset of Connected Apps data processed by Gemini is reviewed by human reviewers (including trained service providers) to debug our services, help keep them safe, and improve them."
- The subset reviewed by human reviewers includes "Interactions, summaries, excerpts, and inferences from your Google Wallet and payment services information."
- Google says: "Gemini Apps activity, which includes data from apps you connect, is used to improve Google services for everyone, including by training generative AI models, if your Keep Activity setting is on."
- Google also says Gemini does not train generative AI models directly on your Google Wallet and payments services.
- Google says if you disconnect a connected app or delete data in that app, it does not delete data from Gemini Apps Activity, which can still be used for product improvement unless you delete that activity; deleted activity cannot be withheld from use if it has already been reviewed by trained reviewers.
- Google's page asks people not to connect apps containing confidential information they would not want a reviewer to see.
