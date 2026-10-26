# ROW PROMPT (data only) — moving-checklist

route: /checklists/moving-checklist/   page type: explainer / spoke (interactive checklist tool page; JSON keys per the output contract)
depth floor: 900 body words across introText + howItWorks + workedExample + commonMistakes + faqs
primary keyword: moving checklist
secondary keywords: moving checklist printable, moving checklist pdf, moving out checklist, change of address checklist when moving, packing checklist for moving, moving into a new house checklist, moving out of state checklist, moving to another state checklist, moving timeline checklist, moving day checklist
intent: someone with a move coming up wants one list of everything to do, in order, from about two months out to the first weeks in the new home, matched to their situation, that they can tick off and print.
reader question: "What do I need to do before moving, and when?"
answer: A move runs on a countdown: about eight weeks out you set the budget and book movers or a truck, four to six weeks out you sort your belongings and gather records, two weeks out you change your address and schedule utilities, the last week you pack and confirm, then moving day, a first week of setup and a first month of license, voter and tax paperwork — and which tasks apply depends on whether you rent or own at each end, how far you're going, who does the moving and who is coming with you; the tool builds that list. Shape: list (timeline).
answer placement: introText paragraph one gives the answer; the tool (section 1, "Build your moving checklist") delivers the list. The answering material goes before any background or definition.
title guidance: the reader types "moving checklist" and often "printable"; lead the title with "Moving Checklist".

## The tool (describe only what it does — the labels below are the real UI labels; do not describe screen layout, colors or where controls sit)
- It runs in the browser on this page. The reader answers a few questions; rules drop the items that do not apply; the list updates as they change answers.
- Location: a "State" dropdown, an optional "City (for the printout)" field, and four "Local conditions" options: "Winters reach freezing", "Hurricane-prone coast", "Wildfire area", "Earthquake area". Choosing a state pre-sets the four; the reader can change any of them to match their town. The presets are a starting point, not a statement about every town in the state. Tell the reader to pick the state they are moving to and turn on any condition that applies at either home.
- Each item has a checkbox. Some items carry a one-line note, a link to a related checklist on this site, or a link to the government source behind it.
- A counter shows how many items are done, and how many items of the full list apply to the reader's answers.
- Buttons: "Print or save as PDF" (prints only the checklist as a worksheet with Name, Date and Property address lines; choosing "Save as PDF" in the print dialog saves it as a PDF) and "Clear" (clears ticks).
- Ticks are saved only in the reader's own browser. Nothing is sent anywhere. No signup.
- Under the tool, the page lists the complete checklist with an "Only if" tag on every conditional item, so the reader can see what the tool could add.
- The tool is a planning aid, not legal or professional advice.

## This checklist
Questions: Where you live now (Renting / I own it and I'm selling / I own it and I'm keeping it / With family or friends (not on a lease)); Where you're going (A rental / A home I'm buying / Moving in with family or friends); How far (Same city or area / Long-distance, same state / To another state); How you're moving (Hiring movers / Rental truck (doing it myself) / Portable storage container); Moving in (Spring or fall / Summer / Winter); Moving with kids; Moving with a pet; Bringing a car; plus the location block.
Sections: 1. Eight Weeks Out: Plan and Book; 2. Six to Four Weeks Out: Sort and Gather Records; 3. Two Weeks Out: Address, Utilities and Insurance; 4. Last Week: Pack and Confirm; 5. Moving Day; 6. First Week in the New Home; 7. First Month: Licenses, Voting and Taxes. Items that belong to another job link to that checklist instead of repeating it: selling (home selling checklist), buying (home buying checklist, final walkthrough checklist), renting the new place (rental checklist), the rental you leave and the one you enter (move-in / move-out checklist), keeping the old home as a rental (landlord checklist).

## CLOSED FACT LIST — every number, date, rule and claim the page may state. Anything not on this list, you do not know. Never invent a price, cost, deadline, statistic, percentage of movers, or URL; say the state sets it or it varies and tell the reader to verify. Do not say "experts say" or "studies show". Do not say how far ahead most people book, how long moves take, or what moves cost.
Provenance (basis: calculated + reported): we wrote one rule per checklist item from the published federal guidance listed below (USPS, USA.gov, IRS, FMCSA, Vote.gov, HUD, NFPA, ready.gov), then ran the tool's own rules on example moves to count how many items each one keeps. Introduce the scenario counts as our internal comparison, e.g. "In our internal comparison, we ran the checklist's rules for two example moves...". The counts are outputs of the tool's rules, not a survey of movers or a product test.
Scenario counts (outputs of the tool's rules, file reports/mindmap-pass/2026-10-26-moving/evidence/counts.json):
- The full library has 88 items in 7 stages; 26 apply to every move and 62 appear only when an answer switches them on.
- Scenario A — a renter moving across town in Chicago, Illinois to another rental, hiring movers, in summer, no kids or pets: 46 of 88 items. It adds the lease notice, the move-out walkthrough and forwarding address, the deposit follow-up, renters insurance, recording the new rental's condition, checking the state's rules for in-state movers, and the summer items (book early, carry heat-sensitive items); it drops every interstate-mover, license-transfer, truck and kids or pet item.
- Scenario B — a homeowner selling in Ohio and buying in Arizona, hiring interstate movers, in winter, with kids and a dog: 63 of 88 items. It adds the FMCSA registration lookup, the federal booklet, the liability choice, the nine-month claim window, the home sale and purchase hand-offs, the new-state driver's license, car registration and part-year tax question, school and pet items, and the winter freezing items; it drops the rental items and the summer items.
Published rules the items use:
- USPS: file a change of address on the official USPS site. USA.gov's change-of-address page warns that look-alike sites charge far more than the official service, and lists who to update: USPS, the IRS, Social Security, Veterans Affairs (for veterans benefits), USCIS (immigration), the state motor vehicle agency (driver's license and vehicle registration), and the state election office (voter registration, through vote.gov).
- Name expansions: USDOT number = U.S. Department of Transportation number; MC number = Motor Carrier number; USCIS = U.S. Citizenship and Immigration Services.
- IRS: Form 8822 is the form for changing your address with the IRS.
- IRS Topic 455: the federal deduction for moving expenses is limited to members of the Armed Forces on active duty who move because of a military order (permanent change of station); from 2026, certain intelligence community employees and new appointees may be treated the same way.
- FMCSA (interstate moves only): an interstate move is one where your belongings cross a state line. Federal rules require interstate movers to give you the "Your Rights and Responsibilities When You Move" booklet and the "Ready to Move" brochure. Interstate movers and brokers must be registered with FMCSA; you can look a company up by name, USDOT number or MC number to see its registration and complaint history. A broker is not a mover: it books your move with a moving company and does not have trucks.
- FMCSA red flags: an estimate given by phone or online without seeing your belongings; no written estimate; a demand for cash or a large deposit before the move; asking you to sign blank documents; not giving you the federal booklet; a website with no local address or registration information.
- FMCSA liability: interstate movers must offer two options. Full Value Protection (the mover is responsible for the replacement value of lost or damaged goods) applies unless you choose Released Value; it costs more and the price varies by mover. Released Value costs nothing extra but covers no more than 60 cents per pound per article, and you must sign a statement on the bill of lading to choose it. Packing hazardous materials without telling the mover can limit the mover's liability. You have nine months from delivery to file a written claim with an interstate mover. Moves within one state follow that state's rules.
- Lease notice periods come from the lease and state law. Security-deposit return deadlines are set by state (and sometimes city) law. HUD keeps a page of tenant rights, laws and protections by state.
- Driver's license and vehicle registration deadlines after moving to a new state are set by each state; check the new state's motor vehicle agency.
- NFPA: smoke alarms inside every bedroom, outside each sleeping area and on every level; test them monthly.
- Renters insurance policies generally don't cover flood; that's a separate policy.
- ready.gov hazard pages (hurricanes, wildfires, earthquakes) back the climate items: evacuation zones and routes, emergency alerts, securing tall furniture and the water heater.
No other figures. The only numbers the page may state are: 8 weeks, six to four weeks, two weeks, the stage count 7, the scenario counts above, 60 cents per pound per article, nine months, 2026 (IRS), and three estimates.

## TOOL ITEM LIST (facts: the exact items the tool can show; the page may describe any of them)
1. Eight Weeks Out: Plan and Book:
- Set a moving budget: movers or truck, packing supplies, travel, and any overlap in rent or mortgage between the two homes [links: Budget calculator]
- Pick the moving date and check it against your lease end or closing date
- Get written estimates from at least three movers, each based on seeing your belongings in person or on video (note: FMCSA lists a sight-unseen estimate given by phone or online as a red flag.) [only if: Hiring movers]
- Look up each interstate mover by its USDOT or MC number in FMCSA's search tool to check its registration and complaint history (note: Ask whether the company is the mover or a broker. A broker books your move with another company.) [only if: Movers, to another state]
- Check how your state licenses in-state movers and look the company up (note: Moves inside one state follow that state's rules, not FMCSA's.) [only if: Movers, same state]
- Reserve the rental truck plus a dolly, furniture pads and straps [only if: Rental truck]
- Ask your auto insurer and card issuer whether they cover a rental truck, then decide on the rental company's damage coverage [only if: Rental truck]
- Reserve the portable container and decide where it will sit at each home (note: A container parked on the street may need a city permit.) [only if: Portable container]
- Moving in summer: book movers or the truck as soon as your date is set [only if: Summer move]
- Give your landlord written notice by the date your lease requires (note: Notice periods come from your lease and state law.) [only if: Renting now]
- Line up the sale of your home with the moving date [only if: Selling the home you're leaving] [links: Home selling checklist]
- Decide whether the home you're leaving will be rented out or sit empty, and tell your insurer [only if: Keeping the home you're leaving] [links: Landlord checklist]
- Line up your closing date with your move-out date, and plan where your belongings go if the dates don't match [only if: Buying the new home] [links: Home buying checklist]
- Sign the new lease and confirm the move-in date, key pickup and total due at move-in [only if: Renting the new home] [links: Rental checklist]
- Ask the new school district how to enroll and what proof of address and records it needs [only if: Moving with kids]
2. Six to Four Weeks Out: Sort and Gather Records:
- Go room by room and sort everything into keep, sell, donate and toss before you pack
- Make a home inventory with photos of furniture, electronics and valuables
- Collect boxes, tape, markers and padding
- Pull together the documents you'll carry yourself: IDs, passports, birth certificates, tax returns, and lease or closing papers
- Get copies of medical and dental records and arrange prescription refills or transfers
- Request your children's school records [only if: Moving with kids]
- Get your pet's vet records and refill any medications [only if: Moving with a pet]
- Ask your vet what the new state requires for your pet, such as a health certificate or rabies record [only if: Moving with a pet, to another state]
- Use up or safely dispose of paint, propane, cleaning chemicals and other hazardous items (note: If you hire movers, packing hazardous items without telling them can limit the mover's liability.)
- Get the "Your Rights and Responsibilities When You Move" booklet and the "Ready to Move" brochure from your mover (note: Federal rules require interstate movers to give you both.) [only if: Movers, to another state]
- Choose your mover's liability option in writing: Full Value Protection, or Released Value (no more than 60 cents per pound per article) (note: Full Value Protection applies unless you sign for Released Value, which costs nothing extra but pays little.) [only if: Movers, to another state]
- Ask how the mover covers loss or damage, and get the answer in writing [only if: Movers, same state]
- Decide whether you'll drive your car to the new home or ship it [only if: Bringing a car, long-distance]
3. Two Weeks Out: Address, Utilities and Insurance:
- File your change of address with USPS on its official site (note: USA.gov warns that look-alike sites charge far more than the official service.)
- Update your address with the IRS (Form 8822)
- Update your address with your bank, credit cards, employer payroll, insurers and subscriptions
- If you receive Social Security or VA benefits, update your address with that agency
- Schedule electricity, gas, water and trash to stop at the old address after moving day [only if: Leaving your own home or rental]
- Schedule utilities to start at the new address by move-in day [only if: Moving into your own home or rental]
- Book internet installation at the new address [only if: Moving into your own home or rental]
- Start renters insurance on your move-in date (note: Renters policies generally don't cover flood; that's a separate policy.) [only if: Renting the new home]
- Confirm homeowners insurance on the new home starts by closing [only if: Buying the new home]
- Keep homeowners insurance on the old home until the sale closes [only if: Selling the home you're leaving]
- If either building has an elevator, a loading dock or set moving hours, reserve your time slot
- Check whether the truck or container needs a parking permit on your street [only if: Rental truck or container]
- Arrange childcare for moving day [only if: Moving with kids]
- Arrange a sitter or a closed-off quiet room for your pet on moving day [only if: Moving with a pet]
4. Last Week: Pack and Confirm:
- Confirm the date, arrival window and both addresses with your mover, truck rental or container company
- Label every box with its room and contents
- Pack an essentials box: medications, documents, chargers, toiletries, a change of clothes, bedding and basic tools
- Keep jewelry, cash, documents and medications with you, not on the truck
- Empty, defrost and clean the refrigerator and freezer
- Confirm how and when you'll pay the mover (note: FMCSA lists a demand for cash or a large deposit before the move as a red flag.) [only if: Hiring movers]
- Clean the rental and fix the small damage you're responsible for before the move-out inspection [only if: Renting now] [links: Move-in / move-out checklist]
- Pack a bag for each child with favorite things that rides with them [only if: Moving with kids]
- Pack your pet's food, bowls, leash or litter, and medication to travel with you [only if: Moving with a pet]
- Plan to carry heat-sensitive items such as medications and electronics in your car [only if: Summer move]
- Keep liquids, paint and houseplants that could freeze out of an unheated truck or container [only if: Winter move, freezing winters]
- Moving in hurricane season: pick a backup date and learn the evacuation routes near both homes [only if: Hurricane-prone coast, spring to fall move]
- Watch fire and smoke conditions near both homes in the days before the move [only if: Wildfire area, spring to fall move]
5. Moving Day:
- Photograph the utility meter readings at both homes
- Walk through every room, closet and cabinet before you leave
- Read the mover's inventory and bill of lading before you sign, and never sign blank documents [only if: Hiring movers]
- Get the driver's phone number and the delivery window, and plan to be at the new home when the shipment arrives [only if: Movers, long-distance]
- Load heavy items first against the front wall of the truck and strap each layer [only if: Rental truck or container]
- Clear snow and ice from walkways and steps at both homes [only if: Winter move, freezing winters]
- Do the move-out walkthrough with your landlord and give your forwarding address in writing (note: Your state sets the deadline for returning the deposit.) [only if: Renting now] [links: Move-in / move-out checklist]
- Do the final walkthrough before closing [only if: Buying the new home] [links: Final walkthrough checklist]
- Record the new rental's condition with photos before you unpack [only if: Renting the new home] [links: Move-in / move-out checklist]
- Lock up and hand over keys, garage remotes and fobs for the home you're leaving [only if: Leaving your own home or rental]
6. First Week in the New Home:
- Test the smoke and carbon monoxide alarms
- Find the main water shutoff and the breaker panel
- Change or rekey the locks [only if: Buying the new home]
- Unpack and check for damage, then file any claim with the mover in writing (note: On an interstate move you have nine months from delivery to file a written claim.) [only if: Movers, to another state]
- Unpack and check for damage, and report any to the mover in writing right away [only if: Movers, same state]
- Return the truck on time with the fuel level the contract requires [only if: Rental truck]
- Schedule the container pickup once it's empty [only if: Portable container]
- Check that forwarded mail is arriving at the new address
- Finish school enrollment [only if: Moving with kids]
- Update your pet's microchip record and tag with the new address [only if: Moving with a pet]
- Strap tall furniture and the water heater to the wall [only if: Earthquake area]
- Learn your evacuation zone at the new address [only if: Hurricane-prone coast]
- Sign up for local emergency alerts and learn two ways out of the neighborhood [only if: Wildfire area]
7. First Month: Licenses, Voting and Taxes:
- Get a driver's license in your new state (note: Each state sets its own deadline; check the state's motor vehicle agency.) [only if: To another state]
- Register and insure your car in the new state (note: The new state sets the deadline.) [only if: To another state, bringing a car]
- Update the address on your driver's license and vehicle registration under your state's rules [only if: Same state]
- Update your voter registration
- Ask a tax preparer whether you'll file part-year returns in both states [only if: To another state]
- Keep your moving receipts; a federal deduction for moving expenses is limited to active-duty military moving under orders (and, from 2026, certain intelligence community employees)
- Find a new doctor, dentist and pharmacy [only if: Long-distance]
- Find a new vet and check the local pet license rules [only if: Moving with a pet, long-distance]
- Follow up if your deposit or an itemized list of deductions hasn't arrived by your state's deadline [only if: Renting now]
- File the moving receipts, your lease or closing papers and the mover's paperwork together

## CLOSED URL LIST — only external hrefs allowed
https://www.usps.com/manage/forward.htm
https://www.usa.gov/change-address
https://www.irs.gov/forms-pubs/about-form-8822
https://www.irs.gov/taxtopics/tc455
https://vote.gov/
https://www.fmcsa.dot.gov/protect-your-move
https://www.fmcsa.dot.gov/protect-your-move/faq
https://www.fmcsa.dot.gov/protect-your-move/red-flags
https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/are-you-moving/liability-protection
https://www.hud.gov/topics/rental_assistance/tenantrights
https://www.nfpa.org/education-and-research/home-fire-safety/smoke-alarms
https://www.ready.gov/hurricanes
https://www.ready.gov/wildfires
https://www.ready.gov/earthquakes
Link one only where the sentence states that source's fact.

## Internal routes it may link (real routes only)
/checklists/ (hub), /checklists/home-buying-checklist/, /checklists/home-selling-checklist/, /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /budget/, /budget/monthly-budget-calculator/, /compare/renting-vs-buying/, /guides/first-time-home-buyer-guide/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /emergency-fund-calculator/
Must link at least: /checklists/move-in-move-out-checklist/, /checklists/home-buying-checklist/, /checklists/renting-checklist/, /checklists/first-apartment-checklist/.

## Coverage (howItWorks paragraphs, in order)
(1) the countdown: what each of the 7 stages is for, from eight weeks out to the first month; (2) the two answers that reshape the list most — renting or owning at each end (which hands off to the rental, move-in / move-out, home selling, home buying, final walkthrough and landlord checklists) and how you're moving (movers vs rental truck vs portable container); (3) distance: same area vs long-distance in-state vs to another state — the FMCSA items (registration lookup by USDOT or MC number, mover vs broker, the federal booklet, Full Value Protection vs Released Value at 60 cents per pound per article, the nine-month claim window) apply only to interstate moves, and a new state brings a new driver's license, car registration and a part-year tax question with state-set deadlines; (4) address changes and records: USPS on its official site, the IRS (Form 8822), Social Security or VA benefits, voter registration, banks and payroll — and that the federal moving-expense deduction is limited to active-duty military under orders (plus certain intelligence community employees from 2026); (5) kids, pets, season and the local-conditions options (winter freezing items, summer heat items, hurricane, wildfire, earthquake); (6) TAKEAWAY: build the list as soon as you have a moving date, print it, and work it stage by stage — and for an interstate move with hired movers, check the company's FMCSA registration and choose your liability option in writing before anything else. No prices, costs or state deadlines.

## FAQ questions (verbatim, in this order)
1. What should be on a moving checklist?
2. How far in advance should I start planning a move?
3. Who do I need to notify when I move?
4. How do I check if an interstate moving company is legitimate?
5. What is the difference between Full Value Protection and Released Value?
6. What do I need to do after moving to a new state?
7. Are moving expenses tax deductible?
8. Can I print this moving checklist or save it as a PDF?
Q2: the tool's countdown starts eight weeks out; say starting earlier gives more choice of dates and movers only if phrased as advice, with no statistic. Q3: the USA.gov list (USPS, IRS, Social Security, VA, USCIS, motor vehicle agency, election office) plus banks, employer payroll and insurers. Q4: FMCSA lookup by USDOT or MC number, mover vs broker, and the red flags. Q6: driver's license and registration under the new state's deadlines, voter registration, part-year tax question; no deadline numbers. Q7: only the IRS Topic 455 facts. Q8: yes, Print or save as PDF, choose Save as PDF in the print dialog.
