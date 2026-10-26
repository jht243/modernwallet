# ROW PROMPT (data only) — first-apartment-checklist

route: /checklists/first-apartment-checklist/   page type: explainer / spoke (interactive checklist tool page; JSON keys per the output contract)
depth floor: 900 body words across introText + howItWorks + workedExample + commonMistakes + faqs
primary keyword: first apartment checklist
secondary keywords: apartment checklist, new apartment checklist, first college apartment checklist, apartment essentials checklist, first apartment checklist on a budget
intent: someone moving into their first apartment wants a list of what to buy, which items they need on day one, and a running total of what it will cost using their own prices, printable.
reader question: "What do I need to buy for my first apartment, and what will it cost?"
answer: Start with the day-one essentials (bed, kitchen basics, bathroom, cleaning, safety items) and the move-in money (deposit, first month, renters insurance, utility deposits), defer the rest, and total it against your budget — the tool lists what your unit and roommate setup need and adds up your own prices. Shape: list + figure.
answer placement: introText paragraph one gives the answer; the tool (section 1, "Your First Apartment Checklist and Budget") delivers the list and the total. The answering material goes before any background or definition.

## The tool (describe only what it does — the labels below are the real UI labels)
- It runs in the browser on this page. The reader answers a few questions; rules drop the items that do not apply; the list updates as they change answers.
- Location block (when shown): a "State" dropdown, an optional "City (for the printout)" field, and four "Local conditions" switches: "Winters reach freezing", "Hurricane-prone coast", "Wildfire area", "Earthquake area". Choosing a state pre-sets the four switches; the reader can change any of them to match their town. The presets are a starting point, not a statement about every town in the state.
- Each item has a checkbox. Some items carry a one-line note, a link to a related page on this site, or a link to the government or industry source behind it.
- A counter shows how many items are done, and how many items of the full list apply to the reader's answers.
- Buttons: "Print or save as PDF" (prints only the checklist as a worksheet with Name, Date and Property address lines; choosing "Save as PDF" in the print dialog saves it as a PDF) and "Clear" (clears ticks and notes).
- Ticks and notes are saved only in the reader's own browser. Nothing is sent anywhere. No signup.
- Under the tool, the page lists the complete checklist with an "Only if" tag on every conditional item, so the reader can see what the tool could add.
- The tool is a planning aid, not legal or professional advice.

## This checklist
Questions: Unit comes furnished; Sharing with roommates; Washer / dryer in unit; Bringing a pet; and a 'Show day-one items only' switch. No location block. Each item has a checkbox, a 'Day one' tag where it applies, and a price box the reader fills in. Three totals: Total of prices entered, Day-one items, Still to buy (unticked). Nothing is pre-filled: the tool contains no prices. Sections: Move-in money, Bedroom (unfurnished only), Kitchen, Bathroom, Living area (unfurnished only), Cleaning and laundry, Safety and tools, Pet (pet only).

## CLOSED FACT LIST — every number, date, rule and claim the page may state. Anything not on this list, you do not know. Never invent a price, limit, deadline, statistic, percentage of buyers/renters, or URL; say it is set by state law or varies and tell the reader to verify. Do not say "experts say" or "studies show".
Provenance (basis: calculated + reported): we wrote one rule per checklist item from the published guidance listed below (EPA, CFPB, HUD, FTC, IRS, NFPA, CPSC, FEMA, ready.gov, the American Red Cross, ASHI), then ran the tool's own rules on example homes to count how many items each one keeps. Introduce the scenario counts as our internal comparison, e.g. "In our internal comparison, we ran the checklist's rules for two example homes...". The counts are outputs of the tool's rules, not a survey of real buyers or a product test.
Scenario counts (outputs of the tool's rules, file reports/mindmap-pass/2026-10-25/evidence/counts.json):
- The full list has 42 items. An unfurnished apartment shows 38 items, 26 of them tagged day one. A furnished apartment shared with roommates and with in-unit laundry shows 27 items, 21 of them day one, because it drops the bedroom, living-area and dish items and adds a step to agree with roommates on who brings which kitchen items.
Published guidance the rules use:
- FEMA's Flood Map Service Center shows an address's flood zone. Flood insurance is required on most mortgages for homes in high-risk flood zones. Standard homeowners and renters policies generally do not cover flood damage.
No other figures. Do not state any price, fee, deposit amount, deadline in days (other than the federal ones above), percentage or statistic.

## TOOL ITEM LIST (facts: the exact items the tool can show; the page may describe any of them)
Move-In Money:
- Security deposit (day one)
- First month's rent (day one)
- Application and move-in fees (day one)
- Pet deposit or fee (day one) [only if: Bringing a pet]
- Renters insurance (first payment) (day one)
- Utility and internet setup deposits or fees (day one)
- Moving truck or movers (day one)
Bedroom [only if: Unfurnished]:
- Bed frame and mattress (day one)
- Sheets, pillows and a blanket (day one)
- Hangers (day one)
- Dresser or storage (can wait)
- Bedside lamp (can wait)
- Curtains or blinds (day one)
Kitchen:
- One pot and one pan (day one)
- Plates, bowls, cups and utensils (day one) [only if: Unfurnished]
- Knife and cutting board (day one)
- Trash can and bags (day one)
- Dish soap, sponge, towels (day one)
- Basic groceries and pantry staples (day one)
- Food storage containers (can wait)
- Small appliances (coffee maker, toaster, microwave if none) (can wait)
- Agree with roommates on who brings which kitchen items (day one) [only if: Roommates]
Bathroom:
- Toilet paper (day one)
- Bath towels (day one)
- Shower curtain and liner (if no glass door) (day one)
- Plunger (day one)
- Bath mat (can wait)
Living Area [only if: Unfurnished]:
- Somewhere to sit (can wait)
- Table or desk (can wait)
- Floor lamp (many apartments have no living-room ceiling light) (can wait)
- TV or entertainment (can wait)
Cleaning and Laundry:
- All-purpose cleaner and paper towels (day one)
- Broom, dustpan or vacuum (can wait)
- Laundry basket and detergent (day one)
- Laundry card or quarters for shared machines (day one) [only if: No in-unit laundry]
Safety and Tools:
- First-aid kit (day one)
- Small fire extinguisher for the kitchen (can wait)
- Flashlight (day one)
- Screwdriver, hammer, tape measure (can wait)
- Extension cord / power strip (day one)
Pet [only if: Bringing a pet]:
- Food, bowls and bed (day one)
- Crate, litter box or puppy pads (day one)

## CLOSED URL LIST — only external hrefs allowed
https://msc.fema.gov/portal/home
Link one only where the sentence states that source's fact.

## Internal routes it may link (real routes only)
/checklists/ (hub), /checklists/home-buying-checklist/, /checklists/home-selling-checklist/, /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /mortgage/closing-cost-calculator/, /compare/renting-vs-buying/, /guides/first-time-home-buyer-guide/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /real-estate/rental-income-calculator/, /real-estate/depreciation-calculator/, /real-estate/capital-gains-calculator/, /guides/rental-property-tax-deductions/, /budget/
Must link at least: /budget/, /checklists/renting-checklist/, /checklists/move-in-move-out-checklist/.

## Coverage (howItWorks paragraphs, in order)
(1) the two kinds of cost: move-in money and things to buy; (2) day one vs can-wait and why the tool tags them; (3) how furnished, roommates, laundry and pets change the list, with the counts; (4) how the totals work with the reader's own prices, and why the tool has no built-in prices (they vary by store, city and taste); link /budget/; (5) the renter's side: link the rental checklist and the move-in condition form; (6) TAKEAWAY: price the day-one items first, keep the rest on the list, and buy as the budget allows. Never state a dollar figure for furnishing or any item.

## FAQ questions (verbatim, in this order)
1. What do I need for my first apartment?
2. Is $5000 enough to furnish an apartment?
3. What furniture should I buy for my first apartment?
4. What should I buy first for a new apartment?
5. What move-in costs should I budget for besides furniture?
6. What changes if the apartment comes furnished?
7. How do roommates change the list?
8. Can I print this first apartment checklist?
Q2: we publish no furnishing cost figure; it depends on what you already own, new vs used, and your city; enter your own prices and the tool totals them so you can see whether a budget like that covers your list. Do not say yes or no. Q5: deposit, first month, application and move-in fees, renters insurance, utility deposits, movers — no amounts; renters policies generally exclude flood.
