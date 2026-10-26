# ROW PROMPT (data only) — home-selling-checklist

route: /checklists/home-selling-checklist/   page type: explainer / spoke (interactive checklist tool page; JSON keys per the output contract)
depth floor: 900 body words across introText + howItWorks + workedExample + commonMistakes + faqs
primary keyword: home selling checklist
secondary keywords: checklist for selling a house, selling a house checklist, home selling checklist pdf, checklist for selling your home, for sale by owner checklist, home staging checklist
intent: a seller wants the complete list of what to do to get a house ready and sold, matched to agent vs. for sale by owner, who lives there and the property type, printable.
reader question: "What do I need to do to get my house ready to sell?"
answer: Selling runs in stages — know your net proceeds, fix what buyers and inspectors will flag, complete your state's disclosures, stage and photograph, then manage showings, offers and closing — and the tool adds the for-sale-by-owner, HOA, vacant, tenant-occupied and state items that apply to your sale. Shape: list.
answer placement: introText paragraph one gives the answer; the tool (section 1, "Build Your Home Selling Checklist") delivers the list. The answering material goes before any background or definition.

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
Questions: Type of home (Single-family house, Townhouse (with HOA), Condo (with HOA), Duplex / 2-4 units, Manufactured home); When was it built?; Selling with (A real estate agent / No agent (for sale by owner)); Who lives there now? (I do / Nobody (vacant) / A tenant); Mortgage still owed; Septic system; Pool; plus the location block. Sections: 1. Plan the sale, 2. Repairs and prep, 3. Disclosures and documents, 4. Listing and showings, 5. Offers and contract, 6. Under contract, 7. Closing and move-out.

## CLOSED FACT LIST — every number, date, rule and claim the page may state. Anything not on this list, you do not know. Never invent a price, limit, deadline, statistic, percentage of buyers/renters, or URL; say it is set by state law or varies and tell the reader to verify. Do not say "experts say" or "studies show".
Provenance (basis: calculated + reported): we wrote one rule per checklist item from the published guidance listed below (EPA, CFPB, HUD, FTC, IRS, NFPA, CPSC, FEMA, ready.gov, the American Red Cross, ASHI), then ran the tool's own rules on example homes to count how many items each one keeps. Introduce the scenario counts as our internal comparison, e.g. "In our internal comparison, we ran the checklist's rules for two example homes...". The counts are outputs of the tool's rules, not a survey of real buyers or a product test.
Scenario counts (outputs of the tool's rules, file reports/mindmap-pass/2026-10-25/evidence/counts.json):
- The full library has 44 items. Scenario A: an owner-occupied single-family house built after 2000 in Columbus, Ohio, sold with an agent keeps 30 of 44 items. Scenario B: a vacant house built in 1965 in Chicago, Illinois, sold by owner (freezing winters on) keeps 33 of 44 items; it drops the agent interviews, decluttering and securing valuables, and adds the for-sale-by-owner planning, showing-safety and contract-review steps, the vacant-home insurance check, keeping the heat on or winterizing while empty, and the pre-1978 lead disclosure.
Published guidance the rules use:
- Homes built before 1978: federal rules require sellers and landlords to disclose known lead-based paint and give the EPA pamphlet "Protect Your Family From Lead in Your Home"; buyers get a 10-day opportunity to test for lead (they can waive it). A few exemptions apply. Source: EPA real estate disclosure page.
- IRS Publication 523: a seller can exclude up to $250,000 of gain ($500,000 for married filing jointly) on a main home if they owned it and lived in it at least 2 of the last 5 years.
- IRS Publication 527 covers rental income, expenses and depreciation for residential rental property.
- EPA: septic systems should be inspected regularly by a professional and pumped as needed.
- Security-deposit limits, deposit return deadlines and landlord entry-notice rules are set by state (and sometimes city) law and differ by state. HUD keeps a page of tenant rights, laws and protections by state. Some states require landlords to give tenants a written move-in condition checklist.
- Closing wire fraud: call the title or escrow company at a number you already know to confirm wiring instructions before sending money.
- Climate items the switches add: freezing winters → pipes in unheated spaces, the main water shutoff, heating service (Red Cross winter guidance); hurricane coast → roof age and attachment, impact windows or shutters, the separate hurricane or wind deductible many coastal policies carry; wildfire area → defensible space, ember-resistant vents and roofing, insurance availability; earthquake area → water heater strapping, frame-to-foundation bolting on older houses, earthquake coverage is generally excluded from standard homeowners policies (ready.gov).
No other figures. Do not state any price, fee, deposit amount, deadline in days (other than the federal ones above), percentage or statistic.

## TOOL ITEM LIST (facts: the exact items the tool can show; the page may describe any of them)
1. Plan the Sale:
- Request a payoff statement from your mortgage servicer [only if: Mortgage still owed]
- Estimate your net proceeds after commission, closing costs and payoff
- Check whether you qualify for the home-sale exclusion (up to $250,000 of gain, $500,000 married filing jointly, if you owned and lived there 2 of the last 5 years) [only if: Your own home]
- A rental property: plan for capital gains tax and depreciation recapture [only if: Tenant-occupied rental]
- Decide where you are moving and whether you need to buy before you sell
- Interview at least two agents and compare their pricing plan, marketing and commission [only if: Selling with an agent]
- Decide how buyers will find the listing, who will handle the contract, and which title or escrow company will close [only if: For sale by owner]
2. Repairs and Prep:
- Declutter, depersonalize and deep-clean every room [only if: You live there]
- Fix what an inspector will flag: leaks, broken fixtures, missing GFCI outlets, doors that stick
- Get a quote before any big remodel; buyers often discount for condition rather than pay for your finishes
- Consider a pre-listing inspection so repairs aren't a surprise during the buyer's inspection
- Service the furnace and AC and keep the receipt
- Gather permits, warranties, utility bills and repair receipts for buyers
- Pump and inspect the septic system and keep the report [only if: Septic system]
- Clean the pool and confirm the equipment and safety fencing work [only if: Pool]
- Trim landscaping, clean gutters and touch up the front entry [only if: House, townhouse, duplex or manufactured home]
- Tell your insurer the house is vacant and read the policy's vacancy clause (Many policies limit coverage after a home sits empty for a set period.) [only if: Vacant]
- Keep the heat on or have the plumbing winterized while it is empty [only if: Vacant, freezing winters]
- Clear dead vegetation and debris near the house [only if: Wildfire area]
- If listing in hurricane season, know how you will secure the house and who handles it while you are away [only if: Hurricane-prone coast]
3. Disclosures and Documents:
- Complete your state's seller disclosure form honestly (Required forms and what must be disclosed differ by state; ask your agent or a real estate attorney.)
- Built before 1978: give buyers the federal lead-paint disclosure, the EPA pamphlet, and a 10-day chance to test [only if: Built before 1978 (or not sure)]
- Order the HOA resale certificate / documents package early (It can take days or weeks and many states give buyers time to review it.) [only if: Condo or townhouse]
- Gather the lease, deposit records and rent history for the buyer [only if: Tenant-occupied]
4. Listing and Showings:
- Price from recent comparable sales, not from list prices or what you need to net
- Get professional photos after the house is staged
- Stage the main rooms: clear counters, open blinds, replace burnt-out bulbs
- Lock away valuables, medications and documents before showings [only if: You live there]
- Give your tenant the notice their lease and your state require before every showing [only if: Tenant-occupied]
- Ask showing visitors for ID or proof of pre-approval, and don't show the house alone [only if: For sale by owner]
5. Offers and Contract:
- Compare offers on net proceeds, contingencies and closing date, not just price
- Ask for the buyer's pre-approval letter or proof of funds
- Have a real estate attorney or the title company prepare or review the purchase contract [only if: For sale by owner]
- Put every contingency deadline on a calendar
6. Under Contract:
- Respond to the buyer's repair requests in writing, with receipts for completed work
- Give the appraiser access and a list of upgrades with dates
- Keep the house in the same condition through closing
- Schedule utility shutoff or transfer for closing day and forward your mail
- Keep homeowners insurance in force until the sale closes
7. Closing and Move-Out:
- Leave every item the contract includes (appliances, fixtures, window coverings)
- Remove your belongings and trash before the buyer's final walkthrough [only if: You live there or it's vacant]
- Leave keys, garage remotes, codes and appliance manuals
- Confirm your payout wiring instructions by phone with the closing agent
- Keep your closing statement for your tax return

## CLOSED URL LIST — only external hrefs allowed
https://www.epa.gov/lead/real-estate-disclosure
https://www.irs.gov/publications/p523
https://www.irs.gov/publications/p527
https://www.epa.gov/septic
https://www.hud.gov/topics/rental_assistance/tenantrights
Link one only where the sentence states that source's fact.

## Internal routes it may link (real routes only)
/checklists/ (hub), /checklists/home-buying-checklist/, /checklists/home-selling-checklist/, /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /mortgage/closing-cost-calculator/, /compare/renting-vs-buying/, /guides/first-time-home-buyer-guide/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /real-estate/rental-income-calculator/, /real-estate/depreciation-calculator/, /real-estate/capital-gains-calculator/, /guides/rental-property-tax-deductions/, /budget/
Must link at least: /mortgage/closing-cost-calculator/, /real-estate/capital-gains-calculator/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /checklists/final-walkthrough-checklist/.

## Coverage (howItWorks paragraphs, in order)
(1) the seven stages; (2) net proceeds and taxes: link the closing cost calculator, state the Publication 523 exclusion, and the rental case (capital gains calculator, Publication 527); (3) repairs: fix what an inspector will flag, get a quote before a big remodel, consider a pre-listing inspection — no payback percentages; (4) disclosures: state form varies, federal lead rule, HOA resale documents take time; (5) how agent vs FSBO, vacant and tenant-occupied change the list, plus climate prep; (6) TAKEAWAY: answer, print, and start with net proceeds and repairs; disclosure rules are state law, so confirm with your agent or a real estate attorney.

## FAQ questions (verbatim, in this order)
1. What not to fix before selling your home?
2. What are things to avoid when selling your house?
3. What documents do I need to sell my house?
4. Do I have to pay tax when I sell my house?
5. What disclosures does a seller have to make?
6. What changes if I sell without an agent?
7. What if the house is vacant or rented out?
8. Can I print this home selling checklist?
Q1: no data on which repairs pay back exists in the fact list; say fix safety and function items an inspector will flag, get quotes before large cosmetic remodels, and that buyers often price in condition — do not state any return figure. Q2: pricing from list prices instead of comparable sales, skipping disclosures, leaving valuables out at showings, comparing offers on price alone. Q4: Publication 523 facts only. Q5: state form varies + federal lead rule.
