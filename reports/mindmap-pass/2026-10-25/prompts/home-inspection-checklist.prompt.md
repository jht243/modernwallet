# ROW PROMPT (data only) — home-inspection-checklist

route: /checklists/home-inspection-checklist/   page type: explainer / spoke (interactive checklist tool page; JSON keys per the output contract)
depth floor: 900 body words across introText + howItWorks + workedExample + commonMistakes + faqs
primary keyword: home inspection checklist
secondary keywords: what to look for in a home inspection, what do they check in a home inspection, home buying inspection checklist, buying a home inspection checklist
intent: a buyer wants to know what a home inspector checks and what to watch for, matched to the home's age, foundation, utilities and climate, printable to carry at the inspection.
reader question: "What do they look for in a home inspection?"
answer: The inspector works system by system — roof, structure and foundation, water and drainage, electrical, plumbing, HVAC, attic and insulation, interior, exterior and grading — and which items matter most depends on the home's age, foundation and climate; the tool lists them for your home and flags the findings that are red flags. Shape: list.
answer placement: introText paragraph one gives the answer; the tool (section 1, "Your Home Inspection Checklist (built for your home)") delivers the list. The answering material goes before any background or definition.

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
Questions: Type of home; When was it built?; Foundation (Not sure, Slab, Crawlspace, Basement); Private well; Septic system; Pool; plus the location block. Sections: Before the inspection, Roof and exterior, Structure and foundation, Attic and insulation (these three hidden for a condo), Plumbing, Electrical, Heating and cooling, Interior, Condo-specific (condo only), Add-on tests, After the report. Several items carry a 'Red flag:' note.

## CLOSED FACT LIST — every number, date, rule and claim the page may state. Anything not on this list, you do not know. Never invent a price, limit, deadline, statistic, percentage of buyers/renters, or URL; say it is set by state law or varies and tell the reader to verify. Do not say "experts say" or "studies show".
Provenance (basis: calculated + reported): we wrote one rule per checklist item from the published guidance listed below (EPA, CFPB, HUD, FTC, IRS, NFPA, CPSC, FEMA, ready.gov, the American Red Cross, ASHI), then ran the tool's own rules on example homes to count how many items each one keeps. Introduce the scenario counts as our internal comparison, e.g. "In our internal comparison, we ran the checklist's rules for two example homes...". The counts are outputs of the tool's rules, not a survey of real buyers or a product test.
Scenario counts (outputs of the tool's rules, file reports/mindmap-pass/2026-10-25/evidence/counts.json):
- The full library has 62 items. Scenario A: a slab-foundation house built after 2000 in Phoenix, Arizona (state preset: freezing winters and wildfire area on) keeps 43 of 62 items. Scenario B: a house built before 1950 with a basement in Boston, Massachusetts (freezing winters on) keeps 48 of 62 items, adding the build-era checks: knob-and-tube wiring, galvanized or lead pipes and lead solder, suspect asbestos, peeling paint that may contain lead, and a sewer-line camera scope.
Published guidance the rules use:
- Standard home inspection standards of practice (ASHI) exclude many items, such as radon, mold, the sewer line, wood-destroying insects and pools, unless added as separate services.
- EPA recommends testing all homes below the third floor for radon. Source: EPA radon page.
- Build-era triggers used by the tool: lead-based paint in homes built before 1978; polybutylene supply pipe common in homes built from about 1978 to 1995; aluminum branch wiring in some homes built from the mid-1960s to the mid-1970s (CPSC); knob-and-tube wiring in older homes, mostly before 1950; lead pipes or lead solder common before 1986 (EPA); asbestos in some older insulation, tiles and ductwork (EPA says do not disturb suspect material).
- Homes built before 1978: federal rules require sellers and landlords to disclose known lead-based paint and give the EPA pamphlet "Protect Your Family From Lead in Your Home"; buyers get a 10-day opportunity to test for lead (they can waive it). A few exemptions apply. Source: EPA real estate disclosure page.
- EPA: private well owners are responsible for testing their own water; well water should be tested regularly, including for bacteria and nitrates.
- EPA: septic systems should be inspected regularly by a professional and pumped as needed.
- NFPA / USFA guidance: smoke alarms inside every bedroom, outside each sleeping area and on every level of the home; test them monthly; replace each alarm every 10 years.
- CPSC: carbon monoxide alarms on each level of the home and outside sleeping areas.
- Climate items the switches add: freezing winters → pipes in unheated spaces, the main water shutoff, heating service (Red Cross winter guidance); hurricane coast → roof age and attachment, impact windows or shutters, the separate hurricane or wind deductible many coastal policies carry; wildfire area → defensible space, ember-resistant vents and roofing, insurance availability; earthquake area → water heater strapping, frame-to-foundation bolting on older houses, earthquake coverage is generally excluded from standard homeowners policies (ready.gov).
No other figures. Do not state any price, fee, deposit amount, deadline in days (other than the federal ones above), percentage or statistic.

## TOOL ITEM LIST (facts: the exact items the tool can show; the page may describe any of them)
Before the Inspection:
- Hire a licensed or certified inspector, ask for a sample report, and plan to attend
- Ask what the standard inspection excludes (radon, mold, sewer line, pests, pool) and book add-ons
- Confirm the utilities will be on and the attic, crawlspace and panel are reachable
Roof and Exterior [only if: Not a condo]:
- Roof: age, missing or curling shingles, flashing at chimneys and walls (Red flag: active leaks or a roof at the end of its life.)
- Gutters and downspouts carry water away from the foundation
- Soil slopes away from the house on every side (Red flag: soil sloping toward the walls.)
- Siding, trim and caulking: rot, gaps, peeling paint
- Window and door frames: rot, failed seals
- Decks and stairs: solid posts, ledger attached to the house, railings secure
- Chimney: cracks, leaning, cap present
- Ask the roof's age and how it is attached (straps or clips), and whether the windows are impact-rated or have shutters (Insurers in hurricane areas price and sometimes refuse coverage on roof age; some give discounts for documented wind-resistant features.) [only if: Hurricane-prone coast]
- Defensible space, vents that resist embers, and the roof's fire rating [only if: Wildfire area]
Structure and Foundation [only if: Not a condo]:
- Foundation cracks: note width, direction and whether they are stair-step or horizontal (Red flag: horizontal cracks, wide or growing cracks, walls bowing in.)
- Sagging rooflines or floors, doors that won't latch
- Basement: water lines, efflorescence (white residue), sump pump working [only if: Basement (or not sure)]
- Crawlspace: standing water, vapor barrier, insulation, pests, wood rot [only if: Crawlspace (or not sure)]
- Slab: cracks in tile or floors, plumbing leaks under the slab [only if: Slab]
- Frame bolted to the foundation [only if: Earthquake area, built before 1978]
- Manufactured home: piers, tie-downs, skirting and the HUD label [only if: Manufactured home]
Attic and Insulation [only if: Not a condo]:
- Stains on roof sheathing or rafters (past or current leaks)
- Ventilation and insulation depth; no bath fans venting into the attic
- Signs of rodents, birds or insects
Plumbing:
- Water pressure and drainage at every fixture; run two at once
- Leaks under sinks, around toilets and at the water heater
- Water heater: age, pressure-relief valve and discharge pipe, venting
- Polybutylene (gray plastic) supply pipe, common in homes from about 1978 to 1995 (Many insurers ask about it.) [only if: Built 1978 to 1999 (or not sure)]
- Galvanized steel or lead supply pipes and the service line [only if: Built before 1978]
- Ask about lead in pipes or solder (common before 1986) and test the water if unsure [only if: Built before 2000 (or not sure)]
- Book a sewer-line camera scope (Tree roots and broken clay or cast-iron lines are costly and not part of a standard inspection.) [only if: City sewer, built before 1978 (or not sure)]
- Well: water test (bacteria, nitrates), pump and pressure tank [only if: Private well]
- Septic: separate inspection, tank pumping records, drain field soggy spots [only if: Septic system]
- Look for pipes in exterior walls, crawlspaces, attics or garages, and ask how they are insulated or heat-taped (Unheated spaces are where pipes freeze and burst.) [only if: Freezing winters]
- Find the main water shutoff and confirm it turns (You need it in seconds if a pipe bursts.) [only if: Freezing winters]
Electrical:
- Panel: capacity, labeling, signs of overheating or corrosion
- GFCI protection near water: kitchen, bathrooms, garage, exterior
- Outlets grounded and working; no warm switches or flickering
- Aluminum branch wiring (used in some homes from the mid-1960s to the mid-1970s) [only if: Built 1950 to 1977 (or not sure)]
- Knob-and-tube wiring (Some insurers won't cover it.) [only if: Built before 1950 (or not sure)]
Heating and Cooling:
- Furnace / heat pump and AC: age, last service, filter condition
- Heat and cooling both reach every room
- Ducts: disconnected runs, rust, signs of mold
- Gas appliances vent properly and CO alarms are present
- Confirm the heating system's age, fuel type and last service date [only if: Freezing winters]
Interior:
- Ceiling and wall stains, fresh paint patches, cracks over doors
- Soft spots, sloping floors, damaged subfloor around toilets
- Windows open, close and lock; no fogged double panes
- Doors swing and latch
- Appliances run; no leaks under the dishwasher
- Bathroom fans vent outside; caulk and grout intact
- Smoke alarms in bedrooms, hallways and on each level
- Suspect asbestos materials in old insulation, tiles or ductwork; don't disturb them [only if: Built before 1978]
- Peeling or chipping paint (built before 1978: may contain lead) [only if: Built before 1978 (or not sure)]
Condo-Specific [only if: Condo]:
- Ask which systems the HOA maintains (roof, exterior, plumbing risers) and what the unit owner covers
- Look for water stains from units above and around windows
- Read the HOA reserve study and recent minutes for planned major repairs
Add-On Tests:
- Radon test (EPA recommends testing all homes below the third floor.)
- Termite / wood-destroying insect inspection
- Pool and equipment inspection [only if: Pool]
- Mold evaluation if the inspector finds active moisture
After the Report:
- Sort findings into safety, major systems, and cosmetic
- Get contractor quotes for the big items before you negotiate
- Ask the seller for repairs or a credit in writing before your contingency deadline

## CLOSED URL LIST — only external hrefs allowed
https://www.cpsc.gov/s3fs-public/516.pdf (CPSC: aluminum branch wiring)
https://www.homeinspector.org/standards-of-practice
https://www.epa.gov/radon
https://www.epa.gov/lead/real-estate-disclosure
https://www.epa.gov/privatewells
https://www.epa.gov/septic
https://www.nfpa.org/education-and-research/home-fire-safety/smoke-alarms
https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Carbon-Monoxide-Information-Center
Link one only where the sentence states that source's fact.

## Internal routes it may link (real routes only)
/checklists/ (hub), /checklists/home-buying-checklist/, /checklists/home-selling-checklist/, /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /mortgage/closing-cost-calculator/, /compare/renting-vs-buying/, /guides/first-time-home-buyer-guide/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /real-estate/rental-income-calculator/, /real-estate/depreciation-calculator/, /real-estate/capital-gains-calculator/, /guides/rental-property-tax-deductions/, /budget/
Must link at least: /checklists/home-buying-checklist/, /checklists/final-walkthrough-checklist/, /checklists/home-selling-checklist/.

## Coverage (howItWorks paragraphs, in order)
(1) what a standard inspection covers system by system, and the red flags noted in the tool (horizontal or wide foundation cracks, active roof leaks, soil sloping toward the house); (2) what it excludes per ASHI and the add-ons (radon per EPA, sewer scope, termite, well, septic, pool, mold); (3) build-era triggers; (4) foundation type and condo differences; (5) climate switches; (6) TAKEAWAY: attend, bring the printed list, sort findings into safety, major systems and cosmetic, get contractor quotes before negotiating within your contingency deadline. Do not state inspection prices or durations.

## FAQ questions (verbatim, in this order)
1. What things do they look for in a home inspection?
2. What's the worst thing a home inspector can find?
3. What is not included in a standard home inspection?
4. Should I go to the home inspection?
5. Do I need a radon test?
6. What extra checks does an older house need?
7. How do I use the inspection report to negotiate?
8. Can I print this home inspection checklist?
Q2: name the red flags in the fact list (structural/foundation problems, active roof leaks, water intrusion, unsafe wiring such as knob-and-tube or aluminum branch wiring) without ranking costs. Q5: EPA below-third-floor recommendation.
