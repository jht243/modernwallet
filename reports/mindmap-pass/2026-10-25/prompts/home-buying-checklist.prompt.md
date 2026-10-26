# ROW PROMPT (data only) — home-buying-checklist

route: /checklists/home-buying-checklist/   page type: explainer / spoke (interactive checklist tool page; JSON keys per the output contract)
depth floor: 900 body words across introText + howItWorks + workedExample + commonMistakes + faqs
primary keyword: home buying checklist
secondary keywords: home buying process checklist, first time home buyer checklist, printable home buying checklist, home buying checklist pdf, what to look for when buying a house
intent: a buyer wants the full list of steps and checks for buying a house, matched to their loan, property type and location, that they can print.
reader question: "What do I need to do and check before buying a house?"
answer: Buying a house is six stages — budget and credit, pre-approval, house hunting, offer and contingencies, inspection and appraisal, insurance and closing — and which tasks apply depends on your loan type, the property type and where you are buying; the tool builds that list for you. Shape: list.
answer placement: introText paragraph one gives the answer; the tool itself (section 1, "Build Your Home Buying Checklist") delivers the list. The answering material goes before any background or definition.

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
Questions: Type of home (Single-family house, Townhouse (with HOA), Condo (with HOA), Duplex / 2-4 units, Manufactured home); When was it built? (Not sure, Before 1950, 1950 to 1977, 1978 to 1999, 2000 or later, Brand-new / under construction); How are you paying? (Conventional mortgage, FHA loan, VA loan, USDA loan, Cash); First-time buyer; Private well; Septic system; Pool; plus the location block. Sections: 1. Budget and credit, 2. Mortgage pre-approval (hidden when paying cash), 3. House hunting, 4. Offer and contract, 5. Inspection and appraisal, 6. Insurance and closing, 7. First week in the house. The inspection step links to the home inspection checklist and the closing step links to the final walkthrough checklist rather than repeating them.

## CLOSED FACT LIST — every number, date, rule and claim the page may state. Anything not on this list, you do not know. Never invent a price, limit, deadline, statistic, percentage of buyers/renters, or URL; say it is set by state law or varies and tell the reader to verify. Do not say "experts say" or "studies show".
Provenance (basis: calculated + reported): we wrote one rule per checklist item from the published guidance listed below (EPA, CFPB, HUD, FTC, IRS, NFPA, CPSC, FEMA, ready.gov, the American Red Cross, ASHI), then ran the tool's own rules on example homes to count how many items each one keeps. Introduce the scenario counts as our internal comparison, e.g. "In our internal comparison, we ran the checklist's rules for two example homes...". The counts are outputs of the tool's rules, not a survey of real buyers or a product test.
Scenario counts (outputs of the tool's rules, file reports/mindmap-pass/2026-10-25/evidence/counts.json):
- The full library has 59 items. Scenario A: an FHA buyer of a condo built after 2000 in Miami, Florida (state preset: no hard freeze, hurricane coast on) keeps 41 of 59 items; compared with scenario B the list adds FHA mortgage insurance, condo project approval for FHA/VA, the FHA/VA minimum property requirement repairs, HOA dues and documents, a first-time buyer program step, the roof/wind-resistance check and the hurricane deductible check, and it has no frozen-pipe or water-shutoff item. Scenario B: a repeat buyer using a conventional mortgage for a single-family house built in 1962 in Minneapolis, Minnesota (freezing winters on) keeps 37 of 59 items, adding the lead-paint disclosure and 10-day test window, a sewer-line camera scope, and the frozen-pipe and water-shutoff checks.
Published guidance the rules use:
- Homes built before 1978: federal rules require sellers and landlords to disclose known lead-based paint and give the EPA pamphlet "Protect Your Family From Lead in Your Home"; buyers get a 10-day opportunity to test for lead (they can waive it). A few exemptions apply. Source: EPA real estate disclosure page.
- EPA recommends testing all homes below the third floor for radon. Source: EPA radon page.
- A lender must send the Loan Estimate within three business days of receiving a mortgage application. Source: CFPB.
- A lender must give the borrower the Closing Disclosure at least three business days before closing. Source: CFPB.
- FEMA's Flood Map Service Center shows an address's flood zone. Flood insurance is required on most mortgages for homes in high-risk flood zones. Standard homeowners and renters policies generally do not cover flood damage.
- USDA loans: the property must be in an eligible area; USDA publishes an eligibility map.
- VA loans need a Certificate of Eligibility. FHA and VA appraisals check minimum property requirements, and required repairs must be fixed before closing.
- Closing wire fraud: call the title or escrow company at a number you already know to confirm wiring instructions before sending money.
- Climate items the switches add: freezing winters → pipes in unheated spaces, the main water shutoff, heating service (Red Cross winter guidance); hurricane coast → roof age and attachment, impact windows or shutters, the separate hurricane or wind deductible many coastal policies carry; wildfire area → defensible space, ember-resistant vents and roofing, insurance availability; earthquake area → water heater strapping, frame-to-foundation bolting on older houses, earthquake coverage is generally excluded from standard homeowners policies (ready.gov).
No other figures. Do not state any price, fee, deposit amount, deadline in days (other than the federal ones above), percentage or statistic.

## TOOL ITEM LIST (facts: the exact items the tool can show; the page may describe any of them)
1. Budget and Credit:
- Pull your credit reports from all three bureaus and dispute any errors
- Set a monthly budget that includes principal, interest, property tax, insurance and any HOA dues
- Decide your down payment and how much cash stays in savings after closing
- Budget for closing costs on top of the down payment
- Look up first-time buyer programs from your state housing finance agency and city [only if: First-time buyer with a mortgage]
- Get a proof-of-funds letter from the bank holding the cash [only if: Paying cash]
2. Mortgage Pre-Approval [only if: Buying with a mortgage]:
- Apply with two or three lenders within a few days of each other and compare their Loan Estimates line by line (A lender must send the Loan Estimate within three business days of your application.)
- Get a written pre-approval letter to send with offers
- FHA: confirm the upfront and annual mortgage insurance in the quote [only if: FHA loan]
- VA: request your Certificate of Eligibility [only if: VA loan]
- USDA: check the address on the USDA eligibility map before you make an offer [only if: USDA loan]
- FHA or VA on a condo: confirm the condo project is approved for your loan type [only if: Condo with an FHA or VA loan]
- Avoid new credit cards, car loans or large purchases until closing
3. House Hunting:
- Write down your must-haves and deal-breakers before the first showing
- Visit the neighborhood on a weekday evening and a weekend, and drive your commute at rush hour
- Look up the address on the FEMA flood map (A high-risk flood zone means required flood insurance on most mortgages.)
- Check the property tax bill and whether a reassessment after sale will raise it
- On each tour, look for water stains, musty smells, soft floors and fresh paint on one patch of ceiling
- Ask the age of the roof, furnace, AC and water heater
- Ask the HOA dues, what they cover, recent special assessments and the rental and pet rules [only if: Condo or townhouse]
- Check the HUD certification label and data plate, and whether the land is owned or leased [only if: Manufactured home]
- Research the builder, what is standard vs. an upgrade, and the warranty terms in the contract [only if: New Construction]
- Get the current leases, rent roll and security deposits held for each unit [only if: Duplex or 2-4 units]
- Look for pipes in exterior walls, crawlspaces, attics or garages, and ask how they are insulated or heat-taped (Unheated spaces are where pipes freeze and burst.) [only if: Freezing winters]
- Check the defensible space around the house (cleared vegetation near walls) and whether vents and roofing resist embers [only if: Wildfire area]
- Confirm homeowners insurance is available and affordable before you commit (Coverage has become harder to buy in some wildfire areas.) [only if: Wildfire area]
- Ask the roof's age and how it is attached (straps or clips), and whether the windows are impact-rated or have shutters (Insurers in hurricane areas price and sometimes refuse coverage on roof age; some give discounts for documented wind-resistant features.) [only if: Hurricane-prone coast]
- Check that the water heater is strapped and, for an older house, whether the frame is bolted to the foundation [only if: Earthquake area]
4. Offer and Contract:
- Review recent comparable sales before choosing a price
- Confirm the earnest money amount, who holds it, and when you can get it back
- Choose your contingencies: inspection, financing and appraisal, and their deadlines [only if: Buying with a mortgage]
- Keep an inspection contingency even when paying cash [only if: Paying cash]
- Read the seller's disclosure form for known defects
- Built before 1978: get the federal lead-paint disclosure and pamphlet, and decide whether to use your 10-day window to test [only if: Built before 1978 (or not sure)]
- Read the HOA budget, reserve study, minutes and rules during the review period [only if: Condo or townhouse]
5. Inspection and Appraisal:
- Book a licensed home inspector and attend the inspection
- Add a radon test (EPA recommends testing all homes below the third floor.)
- Add a sewer-line camera scope [only if: Built before 1978 (or not sure), on city sewer]
- Test the well water [only if: Private well]
- Order a septic inspection [only if: Septic system]
- Have the pool and equipment inspected [only if: Pool]
- Ask whether your lender or area calls for a termite (wood-destroying insect) inspection
- Decide which findings to ask the seller to repair or credit, in writing
- Review the appraisal; if it comes in low, renegotiate, cover the gap, or use your contingency [only if: Buying with a mortgage]
- FHA/VA: the appraisal checks minimum property requirements, and required repairs must be fixed before closing [only if: FHA or VA loan]
6. Insurance and Closing:
- Buy homeowners insurance (or HO-6 for a condo) and send the binder to your lender
- If the home is in a high-risk flood zone, buy flood insurance
- Get a homeowners insurance quote early and read the hurricane or wind deductible (Many coastal policies carry a separate, larger percentage deductible for named storms.) [only if: Hurricane-prone coast]
- Price earthquake coverage separately (Standard homeowners policies generally exclude earthquake damage.) [only if: Earthquake area]
- Confirm title search and choose whether to buy an owner's title insurance policy
- Compare the Closing Disclosure with your Loan Estimate (Your lender must give it to you at least three business days before closing.) [only if: Buying with a mortgage]
- Call your title or escrow company at a number you already know to confirm wiring instructions before sending money (Wire fraud by email is a common closing scam.)
- Do the final walkthrough
- Bring photo ID and your funds as the closing agent instructs
7. First Week in the House:
- Change or rekey the locks and reset garage and alarm codes
- Test smoke and carbon monoxide alarms, and add them where they are missing
- Put utilities in your name and forward your mail
- Find the main water shutoff and confirm it turns (You need it in seconds if a pipe bursts.) [only if: Freezing winters]
- File your closing documents; you will need them for taxes and when you sell

## CLOSED URL LIST — only external hrefs allowed
https://www.epa.gov/lead/real-estate-disclosure
https://www.epa.gov/radon
https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/
https://www.consumerfinance.gov/ask-cfpb/what-is-a-closing-disclosure-en-1983/
https://msc.fema.gov/portal/home
https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do
https://www.hud.gov/helping-americans/loans (HUD: FHA-insured loans; link the first mention of the Federal Housing Administration)
https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/ (VA: how to request a Certificate of Eligibility; link the first mention of VA)
Link one only where the sentence states that source's fact.

## Internal routes it may link (real routes only)
/checklists/ (hub), /checklists/home-buying-checklist/, /checklists/home-selling-checklist/, /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /mortgage/closing-cost-calculator/, /compare/renting-vs-buying/, /guides/first-time-home-buyer-guide/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /real-estate/rental-income-calculator/, /real-estate/depreciation-calculator/, /real-estate/capital-gains-calculator/, /guides/rental-property-tax-deductions/, /budget/
Must link at least: /mortgage/home-affordability-calculator/, /mortgage/closing-cost-calculator/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /guides/first-time-home-buyer-guide/.

## Coverage (howItWorks paragraphs, in order)
(1) the six stages and what each covers, naming the internal calculators for budget, down payment and closing costs; (2) how the loan question changes the list (FHA, VA, USDA, cash) using only the facts; (3) how property type and build era change it (HOA documents, manufactured-home label, new construction warranty, pre-1978 lead disclosure); (4) how the location switches change it, with the Miami vs. frozen-pipe example from the brief; (5) the Loan Estimate and Closing Disclosure timing and the wire-fraud call; (6) TAKEAWAY: the next step is to answer the questions, print the list and work it stage by stage; it is a planning aid, not legal advice, and state-specific rules (disclosure forms, closing customs) still need checking with your agent, lender or attorney.

## FAQ questions (verbatim, in this order)
1. What are things first time home buyers should know?
2. What should I look for when buying a house?
3. What are the steps in the home buying process?
4. When do I get the Closing Disclosure?
5. How does the checklist change for a condo?
6. Do I need flood insurance?
7. What changes on the checklist if I pay cash?
8. Can I save this checklist as a PDF?
Q1: answer with budget, pre-approval, contingencies, inspection and closing timing from the fact list; link /guides/first-time-home-buyer-guide/. Q2: house-hunting checks (water stains, system ages, flood map, property taxes, HOA rules) and link the home inspection checklist. Q6: only the flood facts and the FEMA map link. Q8: say yes, Print or save as PDF, choose Save as PDF in the print dialog.
