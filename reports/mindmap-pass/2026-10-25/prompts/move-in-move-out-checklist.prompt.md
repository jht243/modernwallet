# ROW PROMPT (data only) — move-in-move-out-checklist

route: /checklists/move-in-move-out-checklist/   page type: explainer / spoke (interactive checklist tool page; JSON keys per the output contract)
depth floor: 900 body words across introText + howItWorks + workedExample + commonMistakes + faqs
primary keyword: move in checklist
secondary keywords: rental inspection checklist, move out checklist, apartment move in checklist, move in inspection checklist, rental property inspection checklist, landlord inspection checklist, landlord move out checklist
intent: a tenant or landlord wants a room-by-room move-in condition form they can fill in, compare at move-out, print and sign.
reader question: "What should I write down on a move-in checklist?"
answer: Walk every room on move-in day and record the condition of each surface, fixture and appliance (with photos), have both sides sign, then repeat the same form at move-out — that comparison is what decides deposit deductions; the tool builds the form for your unit's rooms. Shape: list.
answer placement: introText paragraph one gives the answer; the tool (section 1, "Your Move-In / Move-Out Condition Checklist") delivers the form. The answering material goes before any background or definition.

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
Questions: I am the (Tenant / Landlord / property manager); Rental (Apartment / condo, House / townhouse); Bedrooms (0 = studio); Bathrooms; Washer / dryer in unit; Dishwasher; Balcony or patio; Garage; Yard; Furnished; plus the location block. Output: a short tips box, then one table per room (Entry and hallways, Living room or Main room (studio), Kitchen, Bedroom 1..n, Bathroom 1..n, and Laundry, Balcony / patio, Garage, Exterior (houses), Yard, Systems, Furnishings when they apply) with columns Item, Move-in condition, Move-out condition. The reader can type each condition on screen. The printout adds Tenant and Landlord signature and date lines.

## CLOSED FACT LIST — every number, date, rule and claim the page may state. Anything not on this list, you do not know. Never invent a price, limit, deadline, statistic, percentage of buyers/renters, or URL; say it is set by state law or varies and tell the reader to verify. Do not say "experts say" or "studies show".
Provenance (basis: calculated + reported): we wrote one rule per checklist item from the published guidance listed below (EPA, CFPB, HUD, FTC, IRS, NFPA, CPSC, FEMA, ready.gov, the American Red Cross, ASHI), then ran the tool's own rules on example homes to count how many items each one keeps. Introduce the scenario counts as our internal comparison, e.g. "In our internal comparison, we ran the checklist's rules for two example homes...". The counts are outputs of the tool's rules, not a survey of real buyers or a product test.
Scenario counts (outputs of the tool's rules, file reports/mindmap-pass/2026-10-25/evidence/counts.json):
- A studio apartment produces 5 rooms and 36 items to record. A 3-bedroom, 2-bathroom house with laundry, dishwasher, garage and yard produces 13 rooms and 89 items.
Published guidance the rules use:
- Security-deposit limits, deposit return deadlines and landlord entry-notice rules are set by state (and sometimes city) law and differ by state. HUD keeps a page of tenant rights, laws and protections by state. Some states require landlords to give tenants a written move-in condition checklist.
- NFPA / USFA guidance: smoke alarms inside every bedroom, outside each sleeping area and on every level of the home; test them monthly; replace each alarm every 10 years.
- CPSC: carbon monoxide alarms on each level of the home and outside sleeping areas.
No other figures. Do not state any price, fee, deposit amount, deadline in days (other than the federal ones above), percentage or statistic.

## TOOL ITEM LIST (facts: the exact items the tool can show; the page may describe any of them)
Tips box:
- Take date-stamped photos or video of every item, especially existing damage
- Both tenant and landlord sign and date the report; each keeps a copy
- At move-out, the same form is the record for deposit deductions; your state sets the return deadline
- Landlord: return the deposit with an itemized list of deductions [only if: Landlord]
- Tenant: send the landlord your forwarding address in writing at move-out [only if: Tenant]
- Note the heat setting and where the water shutoff is [only if: House, freezing winters]
Rooms (garage, yard, balcony, laundry, furnishings appear only when switched on; Exterior only for a house; bedrooms and bathrooms repeat per count):
Entry and Hallways: Front door, lock and deadbolt; Walls and paint; Floor; Lights and switches; Smoke alarm (test it); Carbon monoxide alarm (if present)
Living Room: Walls and paint; Ceiling; Floor / carpet; Windows, screens and blinds; Doors, locks and handles; Lights and switches; Outlets; Closet / storage
Kitchen: Walls, ceiling and floor; Cabinets and drawers; Countertops; Sink, faucet and drain (look underneath); Refrigerator and freezer (inside and seals); Stove / oven, burners and hood fan; Microwave; Dishwasher (run it); Garbage disposal; Lights and outlets
Bedroom 1: Walls and paint; Ceiling; Floor / carpet; Windows, screens and blinds; Doors, locks and handles; Lights and switches; Outlets; Closet / storage; Smoke alarm (test it)
Bathroom 1: Walls, ceiling and floor; Toilet (flush, base, seat); Sink, faucet and drain; Tub / shower, tile and caulk; Mirror and medicine cabinet; Exhaust fan; Towel bars and fixtures; Signs of mold or leaks
Laundry: Washer (run a cycle); Dryer and vent; Floor and hookups
Balcony / Patio: Surface; Railings; Door and lock
Garage: Door and opener (test safety reverse); Floor; Walls; Remotes provided
Exterior: Siding and trim; Gutters; Driveway and walkways; Exterior lights; Outdoor faucets
Yard: Lawn and landscaping; Fence and gates; Trees and shrubs
Systems: Heating (turn it on); Air conditioning (turn it on); Water heater (hot water at every tap); Thermostat; Breaker panel accessible; Water shutoff located; Number of keys / fobs / remotes received
Furnishings: Sofa and chairs; Tables; Beds and mattresses; Dressers; Lamps; Kitchenware and small appliances; Linens

## CLOSED URL LIST — only external hrefs allowed
https://www.hud.gov/topics/rental_assistance/tenantrights
https://www.nfpa.org/education-and-research/home-fire-safety/smoke-alarms
https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Carbon-Monoxide-Information-Center
Link one only where the sentence states that source's fact.

## Internal routes it may link (real routes only)
/checklists/ (hub), /checklists/home-buying-checklist/, /checklists/home-selling-checklist/, /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /mortgage/closing-cost-calculator/, /compare/renting-vs-buying/, /guides/first-time-home-buyer-guide/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /real-estate/rental-income-calculator/, /real-estate/depreciation-calculator/, /real-estate/capital-gains-calculator/, /guides/rental-property-tax-deductions/, /budget/
Must link at least: /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/first-apartment-checklist/.

## Coverage (howItWorks paragraphs, in order)
(1) what the form is and why both sides use the same one; (2) how to fill it in: describe condition plainly (good, scuff by door), photograph existing damage with dates, test appliances and alarms; (3) how the form is built from the rooms and features the reader picks, with the studio vs 3-bedroom counts; (4) move-out: same form, compare side by side; deposit deductions and the return deadline are set by state law, some states require a written move-in checklist (HUD link); (5) tenant vs landlord tips; (6) TAKEAWAY: fill it in on day one, both sign, each keep a copy, and repeat at move-out. No deposit amounts, deadlines or percentages.

## FAQ questions (verbatim, in this order)
1. What to write on a move-in checklist?
2. Is a move-in checklist required?
3. What should I check in an apartment before moving in?
4. Should I take photos at move-in?
5. How does the move-out checklist affect my deposit?
6. What if I find damage after I move in?
7. Can the landlord and tenant use the same form?
8. Can I print or save this as a PDF?
Q2: some states require landlords to give a written move-in checklist; rules vary — check your state (HUD page). Q6: report it to the landlord in writing with photos as soon as you find it and keep a copy; no deadline numbers.
