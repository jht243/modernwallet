"""Builds the DATA-ONLY row prompts for the 2026-10-25 checklist pages (mindmap-pass Phase 3)."""
import json, pathlib
D = pathlib.Path(__file__).parent
C = json.load(open(D.parent / "evidence" / "counts.json"))

URLS = {
 "lead": "https://www.epa.gov/lead/real-estate-disclosure",
 "radon": "https://www.epa.gov/radon",
 "wells": "https://www.epa.gov/privatewells",
 "septic": "https://www.epa.gov/septic",
 "leadWater": "https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water",
 "asbestos": "https://www.epa.gov/asbestos/protect-your-family-exposures-asbestos",
 "aluminum": "https://www.cpsc.gov/s3fs-public/516.pdf",
 "flood": "https://msc.fema.gov/portal/home",
 "cd": "https://www.consumerfinance.gov/ask-cfpb/what-is-a-closing-disclosure-en-1983/",
 "le": "https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/",
 "credit": "https://www.annualcreditreport.com/",
 "usda": "https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do",
 "smoke": "https://www.nfpa.org/education-and-research/home-fire-safety/smoke-alarms",
 "co": "https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Carbon-Monoxide-Information-Center",
 "fha": "https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview",
 "fcra": "https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know",
 "scams": "https://consumer.ftc.gov/articles/rental-listing-scams",
 "tenantRights": "https://www.hud.gov/topics/rental_assistance/tenantrights",
 "p523": "https://www.irs.gov/publications/p523",
 "p527": "https://www.irs.gov/publications/p527",
 "ashi": "https://www.homeinspector.org/standards-of-practice",
 "wildfire": "https://www.ready.gov/wildfires",
 "hurricane": "https://www.ready.gov/hurricanes",
 "earthquake": "https://www.ready.gov/earthquakes",
 "winter": "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/winter-storm.html",
}
(D / "allowed-urls.txt").write_text("\n".join(URLS.values()) + "\n")

TOOL_COMMON = """## The tool (describe only what it does — the labels below are the real UI labels)
- It runs in the browser on this page. The reader answers a few questions; rules drop the items that do not apply; the list updates as they change answers.
- Location block (when shown): a "State" dropdown, an optional "City (for the printout)" field, and four "Local conditions" switches: "Winters reach freezing", "Hurricane-prone coast", "Wildfire area", "Earthquake area". Choosing a state pre-sets the four switches; the reader can change any of them to match their town. The presets are a starting point, not a statement about every town in the state.
- Each item has a checkbox. Some items carry a one-line note, a link to a related page on this site, or a link to the government or industry source behind it.
- A counter shows how many items are done, and how many items of the full list apply to the reader's answers.
- Buttons: "Print or save as PDF" (prints only the checklist as a worksheet with Name, Date and Property address lines; choosing "Save as PDF" in the print dialog saves it as a PDF) and "Clear" (clears ticks and notes).
- Ticks and notes are saved only in the reader's own browser. Nothing is sent anywhere. No signup.
- Under the tool, the page lists the complete checklist with an "Only if" tag on every conditional item, so the reader can see what the tool could add.
- The tool is a planning aid, not legal or professional advice."""

FACT_HEADER = "## CLOSED FACT LIST — every number, date, rule and claim the page may state. Anything not on this list, you do not know. Never invent a price, limit, deadline, statistic, percentage of buyers/renters, or URL; say it is set by state law or varies and tell the reader to verify. Do not say \"experts say\" or \"studies show\"."

PROV = "Provenance (basis: calculated + reported): we wrote one rule per checklist item from the published guidance listed below (EPA, CFPB, HUD, FTC, IRS, NFPA, CPSC, FEMA, ready.gov, the American Red Cross, ASHI), then ran the tool's own rules on example homes to count how many items each one keeps. Introduce the scenario counts as our internal comparison, e.g. \"In our internal comparison, we ran the checklist's rules for two example homes...\". The counts are outputs of the tool's rules, not a survey of real buyers or a product test."

FED = {
 "lead": "Homes built before 1978: federal rules require sellers and landlords to disclose known lead-based paint and give the EPA pamphlet \"Protect Your Family From Lead in Your Home\"; buyers get a 10-day opportunity to test for lead (they can waive it). A few exemptions apply. Source: EPA real estate disclosure page.",
 "radon": "EPA recommends testing all homes below the third floor for radon. Source: EPA radon page.",
 "le": "A lender must send the Loan Estimate within three business days of receiving a mortgage application. Source: CFPB.",
 "cd": "A lender must give the borrower the Closing Disclosure at least three business days before closing. Source: CFPB.",
 "flood": "FEMA's Flood Map Service Center shows an address's flood zone. Flood insurance is required on most mortgages for homes in high-risk flood zones. Standard homeowners and renters policies generally do not cover flood damage.",
 "p523": "IRS Publication 523: a seller can exclude up to $250,000 of gain ($500,000 for married filing jointly) on a main home if they owned it and lived in it at least 2 of the last 5 years.",
 "p527": "IRS Publication 527 covers rental income, expenses and depreciation for residential rental property.",
 "fha": "The Fair Housing Act prohibits housing discrimination based on race, color, national origin, religion, sex, familial status or disability. Assistance animals are a disability accommodation under fair housing rules, not pets. Source: HUD.",
 "fcra": "FTC: when a tenant-screening report plays any part in denying an applicant, requiring a co-signer, or charging a higher deposit or rent, the landlord must give an adverse action notice naming the screening company, and the applicant can get a free copy of the report and dispute errors. Landlords must securely dispose of reports when done.",
 "scams": "FTC rental scam warning signs: pressure to pay before seeing the unit, payment demanded by wire transfer, gift card or cryptocurrency, rent well below the local market, and excuses for not showing the unit. Protective steps: see the unit in person, search the address for duplicate listings, confirm the listing on the company's own site, and hold off on sharing a Social Security number until you have agreed to rent.",
 "tenantRights": "Security-deposit limits, deposit return deadlines and landlord entry-notice rules are set by state (and sometimes city) law and differ by state. HUD keeps a page of tenant rights, laws and protections by state. Some states require landlords to give tenants a written move-in condition checklist.",
 "smoke": "NFPA / USFA guidance: smoke alarms inside every bedroom, outside each sleeping area and on every level of the home; test them monthly; replace each alarm every 10 years.",
 "co": "CPSC: carbon monoxide alarms on each level of the home and outside sleeping areas.",
 "ashi": "Standard home inspection standards of practice (ASHI) exclude many items, such as radon, mold, the sewer line, wood-destroying insects and pools, unless added as separate services.",
 "wells": "EPA: private well owners are responsible for testing their own water; well water should be tested regularly, including for bacteria and nitrates.",
 "septic": "EPA: septic systems should be inspected regularly by a professional and pumped as needed.",
 "eras": "Build-era triggers used by the tool: lead-based paint in homes built before 1978; polybutylene supply pipe common in homes built from about 1978 to 1995; aluminum branch wiring in some homes built from the mid-1960s to the mid-1970s (CPSC); knob-and-tube wiring in older homes, mostly before 1950; lead pipes or lead solder common before 1986 (EPA); asbestos in some older insulation, tiles and ductwork (EPA says do not disturb suspect material).",
 "climate": "Climate items the switches add: freezing winters → pipes in unheated spaces, the main water shutoff, heating service (Red Cross winter guidance); hurricane coast → roof age and attachment, impact windows or shutters, the separate hurricane or wind deductible many coastal policies carry; wildfire area → defensible space, ember-resistant vents and roofing, insurance availability; earthquake area → water heater strapping, frame-to-foundation bolting on older houses, earthquake coverage is generally excluded from standard homeowners policies (ready.gov).",
 "usda": "USDA loans: the property must be in an eligible area; USDA publishes an eligibility map.",
 "va": "VA loans need a Certificate of Eligibility. FHA and VA appraisals check minimum property requirements, and required repairs must be fixed before closing.",
 "wire": "Closing wire fraud: call the title or escrow company at a number you already know to confirm wiring instructions before sending money.",
}

INTERNAL = "/checklists/ (hub), /checklists/home-buying-checklist/, /checklists/home-selling-checklist/, /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /mortgage/home-affordability-calculator/, /mortgage/down-payment-calculator/, /mortgage/closing-cost-calculator/, /compare/renting-vs-buying/, /guides/first-time-home-buyer-guide/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /real-estate/rental-income-calculator/, /real-estate/depreciation-calculator/, /real-estate/capital-gains-calculator/, /guides/rental-property-tax-deductions/, /budget/"

def sc(cid):
    s = C[cid]["scenarios"]; return C[cid]["library"], s

ROWS = []
lib, s = sc("home-buying")
ROWS.append(dict(slug="home-buying-checklist", cid="home-buying",
 kw="home buying checklist", also="home buying process checklist, first time home buyer checklist, printable home buying checklist, home buying checklist pdf, what to look for when buying a house",
 intent="a buyer wants the full list of steps and checks for buying a house, matched to their loan, property type and location, that they can print.",
 rq="What do I need to do and check before buying a house?",
 ans="Buying a house is six stages — budget and credit, pre-approval, house hunting, offer and contingencies, inspection and appraisal, insurance and closing — and which tasks apply depends on your loan type, the property type and where you are buying; the tool builds that list for you. Shape: list.",
 place='introText paragraph one gives the answer; the tool itself (section 1, "Build Your Home Buying Checklist") delivers the list.',
 tool="Questions: Type of home (Single-family house, Townhouse (with HOA), Condo (with HOA), Duplex / 2-4 units, Manufactured home); When was it built? (Not sure, Before 1950, 1950 to 1977, 1978 to 1999, 2000 or later, Brand-new / under construction); How are you paying? (Conventional mortgage, FHA loan, VA loan, USDA loan, Cash); First-time buyer; Private well; Septic system; Pool; plus the location block. Sections: 1. Budget and credit, 2. Mortgage pre-approval (hidden when paying cash), 3. House hunting, 4. Offer and contract, 5. Inspection and appraisal, 6. Insurance and closing, 7. First week in the house. The inspection step links to the home inspection checklist and the closing step links to the final walkthrough checklist rather than repeating them.",
 facts=["lead","radon","le","cd","flood","usda","va","wire","climate"],
 counts=f"The full library has {lib} items. Scenario A: an FHA buyer of a condo built after 2000 in Miami, Florida (state preset: no hard freeze, hurricane coast on) keeps {s['miami-condo-fha']['count']} of {lib} items; compared with scenario B the list adds FHA mortgage insurance, condo project approval for FHA/VA, the FHA/VA minimum property requirement repairs, HOA dues and documents, a first-time buyer program step, the roof/wind-resistance check and the hurricane deductible check, and it has no frozen-pipe or water-shutoff item. Scenario B: a repeat buyer using a conventional mortgage for a single-family house built in 1962 in Minneapolis, Minnesota (freezing winters on) keeps {s['minneapolis-1962-house-conventional']['count']} of {lib} items, adding the lead-paint disclosure and 10-day test window, a sewer-line camera scope, and the frozen-pipe and water-shutoff checks.",
 cover="(1) the six stages and what each covers, naming the internal calculators for budget, down payment and closing costs; (2) how the loan question changes the list (FHA, VA, USDA, cash) using only the facts; (3) how property type and build era change it (HOA documents, manufactured-home label, new construction warranty, pre-1978 lead disclosure); (4) how the location switches change it, with the Miami vs. frozen-pipe example from the brief; (5) the Loan Estimate and Closing Disclosure timing and the wire-fraud call; (6) TAKEAWAY: the next step is to answer the questions, print the list and work it stage by stage; it is a planning aid, not legal advice, and state-specific rules (disclosure forms, closing customs) still need checking with your agent, lender or attorney.",
 faqs=["What are things first time home buyers should know?","What should I look for when buying a house?","What are the steps in the home buying process?","When do I get the Closing Disclosure?","How does the checklist change for a condo?","Do I need flood insurance?","What changes on the checklist if I pay cash?","Can I save this checklist as a PDF?"],
 faqnotes="Q1: answer with budget, pre-approval, contingencies, inspection and closing timing from the fact list; link /guides/first-time-home-buyer-guide/. Q2: house-hunting checks (water stains, system ages, flood map, property taxes, HOA rules) and link the home inspection checklist. Q6: only the flood facts and the FEMA map link. Q8: say yes, Print or save as PDF, choose Save as PDF in the print dialog.",
 links="Must link at least: /mortgage/home-affordability-calculator/, /mortgage/closing-cost-calculator/, /checklists/home-inspection-checklist/, /checklists/final-walkthrough-checklist/, /guides/first-time-home-buyer-guide/."))

lib, s = sc("home-selling")
ROWS.append(dict(slug="home-selling-checklist", cid="home-selling",
 kw="home selling checklist", also="checklist for selling a house, selling a house checklist, home selling checklist pdf, checklist for selling your home, for sale by owner checklist, home staging checklist",
 intent="a seller wants the complete list of what to do to get a house ready and sold, matched to agent vs. for sale by owner, who lives there and the property type, printable.",
 rq="What do I need to do to get my house ready to sell?",
 ans="Selling runs in stages — know your net proceeds, fix what buyers and inspectors will flag, complete your state's disclosures, stage and photograph, then manage showings, offers and closing — and the tool adds the for-sale-by-owner, HOA, vacant, tenant-occupied and state items that apply to your sale. Shape: list.",
 place='introText paragraph one gives the answer; the tool (section 1, "Build Your Home Selling Checklist") delivers the list.',
 tool="Questions: Type of home (Single-family house, Townhouse (with HOA), Condo (with HOA), Duplex / 2-4 units, Manufactured home); When was it built?; Selling with (A real estate agent / No agent (for sale by owner)); Who lives there now? (I do / Nobody (vacant) / A tenant); Mortgage still owed; Septic system; Pool; plus the location block. Sections: 1. Plan the sale, 2. Repairs and prep, 3. Disclosures and documents, 4. Listing and showings, 5. Offers and contract, 6. Under contract, 7. Closing and move-out.",
 facts=["lead","p523","p527","septic","tenantRights","wire","climate"],
 counts=f"The full library has {lib} items. Scenario A: an owner-occupied single-family house built after 2000 in Columbus, Ohio, sold with an agent keeps {s['agent-owner-occupied-2005-house']['count']} of {lib} items. Scenario B: a vacant house built in 1965 in Chicago, Illinois, sold by owner (freezing winters on) keeps {s['fsbo-vacant-1965-house-freeze']['count']} of {lib} items; it drops the agent interviews, decluttering and securing valuables, and adds the for-sale-by-owner planning, showing-safety and contract-review steps, the vacant-home insurance check, keeping the heat on or winterizing while empty, and the pre-1978 lead disclosure.",
 cover="(1) the seven stages; (2) net proceeds and taxes: link the closing cost calculator, state the Publication 523 exclusion, and the rental case (capital gains calculator, Publication 527); (3) repairs: fix what an inspector will flag, get a quote before a big remodel, consider a pre-listing inspection — no payback percentages; (4) disclosures: state form varies, federal lead rule, HOA resale documents take time; (5) how agent vs FSBO, vacant and tenant-occupied change the list, plus climate prep; (6) TAKEAWAY: answer, print, and start with net proceeds and repairs; disclosure rules are state law, so confirm with your agent or a real estate attorney.",
 faqs=["What not to fix before selling your home?","What are things to avoid when selling your house?","What documents do I need to sell my house?","Do I have to pay tax when I sell my house?","What disclosures does a seller have to make?","What changes if I sell without an agent?","What if the house is vacant or rented out?","Can I print this home selling checklist?"],
 faqnotes="Q1: no data on which repairs pay back exists in the fact list; say fix safety and function items an inspector will flag, get quotes before large cosmetic remodels, and that buyers often price in condition — do not state any return figure. Q2: pricing from list prices instead of comparable sales, skipping disclosures, leaving valuables out at showings, comparing offers on price alone. Q4: Publication 523 facts only. Q5: state form varies + federal lead rule.",
 links="Must link at least: /mortgage/closing-cost-calculator/, /real-estate/capital-gains-calculator/, /guides/how-to-buy-and-sell-a-house-at-the-same-time/, /checklists/final-walkthrough-checklist/."))

lib, s = sc("renting")
ROWS.append(dict(slug="renting-checklist", cid="renting",
 kw="rental checklist", also="what to look for when renting an apartment, questions to ask when renting an apartment, questions to ask when renting a house, renting a house checklist, apartment tour checklist, apartment hunting checklist",
 intent="a renter wants to know everything to check, ask and read before renting, with the list changing for a house vs an apartment vs a room and for their location, printable.",
 rq="What should I check before renting a house or apartment?",
 ans="Check four things before you sign — the unit itself (condition, pests, water, noise, safety), the lease (fees, deposit, repair and break-lease terms), the real move-in cost, and who is responsible for what — and a house adds yard, utility and maintenance duties an apartment usually doesn't; the tool lists only the checks your rental needs. Shape: list.",
 place='introText paragraph one gives the answer; the tool (section 1, "Your Rental Checklist (house or apartment)") delivers the list.',
 tool="Questions: What are you renting? (Apartment in a large building or complex, Apartment from a small landlord, Condo or townhouse (owner rents it out), A whole house, A room in a shared home); When was it built?; Bringing a pet; Need parking; plus the location block. Sections: 1. Before you apply, 2. On the tour, 3. Questions to ask the landlord, 4. Reading the lease, 5. Applying, 6. Move-in. Move-in links to the move-in / move-out condition checklist.",
 facts=["scams","lead","tenantRights","fcra","flood","smoke","climate"],
 counts=f"The full library has {lib} items. Scenario A: an apartment in a large complex built after 2000 in Miami, Florida (no hard freeze, hurricane coast on) keeps {s['miami-complex-apartment']['count']} of {lib} items, including management-company reviews, building noise, trash and package handling, and knowing your evacuation zone, and no frozen-pipe question. Scenario B: a whole house built in 1970 in Denver, Colorado, with a pet (freezing winters and wildfire area on) keeps {s['denver-house-1970-pet']['count']} of {lib} items, adding yard, garage and maintenance duties, who pays for lawn care, snow, pests and filters, the winter heat setting and who pays if a pipe freezes, pet deposit and pet addendum terms, the lead-paint disclosure, putting utilities in your name, finding the water shutoff, and learning two ways out of the neighborhood.",
 cover="(1) the six sections and what each catches; (2) the tour checks; (3) the questions to ask and the lease terms to read, with deposit rules being state law (HUD link); (4) house vs apartment vs room — what changes (this is the brief's core ask); (5) location switches with the Miami vs Denver example and scam warning signs (FTC link); (6) TAKEAWAY: answer, print it, bring it on the tour, and get every promise in writing; state rules decide deposits and entry, so check yours.",
 faqs=["What are the key things to check before renting a house?","What do I need when looking at an apartment?","What are red flags in a lease?","What questions should I ask when renting?","What documents do you need to rent a house?","How do I avoid a rental scam?","How is renting a house different from renting an apartment?","Can I print this rental checklist?"],
 faqnotes="Q3: red flags = fees not explained, verbal promises not in writing, unclear repair responsibility, deposit terms missing, pressure to pay before seeing the unit — no statistics. Q5: photo ID, recent pay stubs or offer letter, landlord references; check your own credit report first. Q6: FTC facts only and link the FTC page.",
 links="Must link at least: /checklists/move-in-move-out-checklist/, /checklists/first-apartment-checklist/, /compare/renting-vs-buying/, /budget/."))

lib, s = sc("landlord")
ROWS.append(dict(slug="landlord-checklist", cid="landlord",
 kw="landlord checklist", also="first time landlord checklist, rental property checklist, landlord checklist for new tenant, new tenant checklist for landlords, tenant screening checklist, becoming a landlord checklist",
 intent="a first-time or small landlord wants everything to do before and after renting out a property, matched to property type, build era, rental type and state, printable.",
 rq="What do I need to do before renting out my property?",
 ans="Before the first tenant moves in: insure and register the property, make it safe and legally rentable (alarms, lead disclosure if built before 1978, local rules), price it, screen consistently under fair housing rules, sign a lease with a deposit that fits your state's rules, and document move-in condition — the tool adds the items your property type and state require. Shape: list.",
 place='introText paragraph one gives the answer; the tool (section 1, "Your Landlord Checklist (built for your rental)") delivers the list.',
 tool="Questions: What are you renting out? (Single-family house, Condo or townhouse (with HOA), Duplex / small multifamily, A room, ADU or part of my home); When was it built?; Rental type (Long-term lease / Furnished, short or mid-term); Managed by (Me / A property manager); Mortgage on the property; Pool; plus the location block. Sections: 1. Set up the rental, 2. Make it rent-ready and safe, 3. Price and list, 4. Screen tenants, 5. Lease and deposit, 6. Move-in day, 7. Ongoing.",
 facts=["lead","fha","fcra","tenantRights","smoke","co","p527","climate"],
 counts=f"The full library has {lib} items. Scenario A: a condo built after 2000 in Austin, Texas, on a long-term lease, self-managed (state preset: freezing winters and hurricane coast on) keeps {s['condo-long-term-self']['count']} of {lib} items, including the HOA rental rules and storm planning, and no gutter-cleaning item. Scenario B: a single-family house built in 1960 in Buffalo, New York, rented furnished, self-managed (freezing winters on) keeps {s['1960-house-furnished-freeze']['count']} of {lib} items, adding local rules and taxes for short stays, an inventory of furnishings, the lead-paint disclosure, the utilities and maintenance split, gutters, and pre-freeze winterizing.",
 cover="(1) setting up: landlord insurance (a homeowners policy may not cover a rental — ask your insurer), mortgage occupancy terms, HOA rental rules, local licensing, records for Publication 527 and the depreciation calculator; (2) safety: smoke and CO alarm placement, the federal lead rule; (3) pricing with the rental income calculator; (4) screening: written criteria applied equally, Fair Housing Act classes, FCRA adverse action notices; (5) lease and deposit: state law sets limits and deadlines (HUD link), move-in condition report; (6) TAKEAWAY: answer, print, and do the setup and safety sections before listing; confirm state deposit and notice rules, and talk to an attorney about entity and lease questions.",
 faqs=["Is there a checklist for landlords?","How do I become a landlord for the first time?","What background check do landlords use?","What does a landlord have to disclose?","How much security deposit can a landlord charge?","Do I need landlord insurance?","What changes for a furnished or short-term rental?","Can I print this landlord checklist?"],
 faqnotes="Q3: do not name screening companies or claim what most landlords use; explain tenant-screening reports are consumer reports under the FCRA and the adverse action duty. Q4: federal lead disclosure for pre-1978 housing; other disclosures depend on state and city. Q5: set by state law; no number. Q6: a standard homeowners policy may not cover a rental; ask your insurer; require tenants to carry renters insurance.",
 links="Must link at least: /real-estate/rental-income-calculator/, /real-estate/depreciation-calculator/, /guides/rental-property-tax-deductions/, /checklists/move-in-move-out-checklist/."))

lib, s = sc("home-inspection")
ROWS.append(dict(slug="home-inspection-checklist", cid="home-inspection",
 kw="home inspection checklist", also="what to look for in a home inspection, what do they check in a home inspection, home buying inspection checklist, buying a home inspection checklist",
 intent="a buyer wants to know what a home inspector checks and what to watch for, matched to the home's age, foundation, utilities and climate, printable to carry at the inspection.",
 rq="What do they look for in a home inspection?",
 ans="The inspector works system by system — roof, structure and foundation, water and drainage, electrical, plumbing, HVAC, attic and insulation, interior, exterior and grading — and which items matter most depends on the home's age, foundation and climate; the tool lists them for your home and flags the findings that are red flags. Shape: list.",
 place='introText paragraph one gives the answer; the tool (section 1, "Your Home Inspection Checklist (built for your home)") delivers the list.',
 tool="Questions: Type of home; When was it built?; Foundation (Not sure, Slab, Crawlspace, Basement); Private well; Septic system; Pool; plus the location block. Sections: Before the inspection, Roof and exterior, Structure and foundation, Attic and insulation (these three hidden for a condo), Plumbing, Electrical, Heating and cooling, Interior, Condo-specific (condo only), Add-on tests, After the report. Several items carry a 'Red flag:' note.",
 facts=["ashi","radon","eras","lead","wells","septic","smoke","co","climate"],
 counts=f"The full library has {lib} items. Scenario A: a slab-foundation house built after 2000 in Phoenix, Arizona (state preset: freezing winters and wildfire area on) keeps {s['2005-slab-house-phoenix']['count']} of {lib} items. Scenario B: a house built before 1950 with a basement in Boston, Massachusetts (freezing winters on) keeps {s['1940-basement-house-boston']['count']} of {lib} items, adding the build-era checks: knob-and-tube wiring, galvanized or lead pipes and lead solder, suspect asbestos, peeling paint that may contain lead, and a sewer-line camera scope.",
 cover="(1) what a standard inspection covers system by system, and the red flags noted in the tool (horizontal or wide foundation cracks, active roof leaks, soil sloping toward the house); (2) what it excludes per ASHI and the add-ons (radon per EPA, sewer scope, termite, well, septic, pool, mold); (3) build-era triggers; (4) foundation type and condo differences; (5) climate switches; (6) TAKEAWAY: attend, bring the printed list, sort findings into safety, major systems and cosmetic, get contractor quotes before negotiating within your contingency deadline. Do not state inspection prices or durations.",
 faqs=["What things do they look for in a home inspection?","What's the worst thing a home inspector can find?","What is not included in a standard home inspection?","Should I go to the home inspection?","Do I need a radon test?","What extra checks does an older house need?","How do I use the inspection report to negotiate?","Can I print this home inspection checklist?"],
 faqnotes="Q2: name the red flags in the fact list (structural/foundation problems, active roof leaks, water intrusion, unsafe wiring such as knob-and-tube or aluminum branch wiring) without ranking costs. Q5: EPA below-third-floor recommendation.",
 links="Must link at least: /checklists/home-buying-checklist/, /checklists/final-walkthrough-checklist/, /checklists/home-selling-checklist/."))

lib, s = sc("final-walkthrough")
ROWS.append(dict(slug="final-walkthrough-checklist", cid="final-walkthrough",
 kw="final walkthrough checklist", also="final walk through checklist before closing, what to check during a final walk through, final walk thru checklist",
 intent="a buyer about to close wants to know exactly what to check in the final walkthrough, for a resale or new-construction home, printable to carry.",
 rq="What do you check during a final walkthrough?",
 ans="Confirm the house is in the condition your contract promised: negotiated repairs are done with receipts, included items are still there, nothing new is damaged, and every system and appliance works — and raise any problem before you sign at closing; the tool builds the walkthrough for your home. Shape: list.",
 place='introText paragraph one gives the answer; the tool (section 1, "Your Final Walkthrough Checklist") delivers the list.',
 tool="Questions: Type of purchase (Existing (resale) home / Existing condo / townhouse / New construction); Seller agreed to repairs; Seller already moved out; Private well; Septic system; Pool. No location block. Sections: Bring with you, Agreed repairs (only if repairs were agreed), New construction (only for new construction: punch list, certificate of occupancy, builder warranty, grading, utility meters), Room by room, Systems and appliances, Handover.",
 facts=["smoke","wells","septic"],
 counts=f"The full library has {lib} items. Scenario A: a resale house where the seller agreed to repairs and has moved out keeps {s['resale-repairs-moved-out']['count']} of {lib} items. Scenario B: a new-construction house with no negotiated repairs keeps {s['new-construction']['count']} of {lib} items, swapping the repair-receipt checks and the seller-cleanout check for the punch list, certificate of occupancy, builder warranty, grading and utility-meter checks.",
 cover="(1) what the walkthrough is for: confirming condition against the contract, not a second inspection; (2) agreed repairs and documentation; (3) room-by-room and systems checks; (4) new construction differences; (5) the handover items and what to do if something is wrong (tell your agent before signing; options are a repair, a credit, money held in escrow or a delayed closing, depending on the contract); (6) TAKEAWAY: bring the contract and the printed list, test everything, and resolve problems before you sign. Do not state when the walkthrough must happen or how long it takes; say the contract and your agent set the timing.",
 faqs=["What do you check during a final walk through?","Can a buyer walk away at final walkthrough?","When does the final walkthrough happen?","What if the seller didn't finish the repairs?","Is a final walk through necessary?","What should I check in a new construction walkthrough?","What should the seller leave behind?","Can I print this final walkthrough checklist?"],
 faqnotes="Q2: depends on the contract terms; ask your agent or a real estate attorney; no legal conclusion. Q3: usually shortly before closing, timing set by the contract and agents — no hour count. Q5: it is your last chance to confirm condition before you own the problems; do not claim it is legally required.",
 links="Must link at least: /checklists/home-buying-checklist/, /checklists/home-inspection-checklist/, /mortgage/closing-cost-calculator/."))

m = C["move-in-move-out"]
ROWS.append(dict(slug="move-in-move-out-checklist", cid="move-in-move-out",
 kw="move in checklist", also="rental inspection checklist, move out checklist, apartment move in checklist, move in inspection checklist, rental property inspection checklist, landlord inspection checklist, landlord move out checklist",
 intent="a tenant or landlord wants a room-by-room move-in condition form they can fill in, compare at move-out, print and sign.",
 rq="What should I write down on a move-in checklist?",
 ans="Walk every room on move-in day and record the condition of each surface, fixture and appliance (with photos), have both sides sign, then repeat the same form at move-out — that comparison is what decides deposit deductions; the tool builds the form for your unit's rooms. Shape: list.",
 place='introText paragraph one gives the answer; the tool (section 1, "Your Move-In / Move-Out Condition Checklist") delivers the form.',
 tool="Questions: I am the (Tenant / Landlord / property manager); Rental (Apartment / condo, House / townhouse); Bedrooms (0 = studio); Bathrooms; Washer / dryer in unit; Dishwasher; Balcony or patio; Garage; Yard; Furnished; plus the location block. Output: a short tips box, then one table per room (Entry and hallways, Living room or Main room (studio), Kitchen, Bedroom 1..n, Bathroom 1..n, and Laundry, Balcony / patio, Garage, Exterior (houses), Yard, Systems, Furnishings when they apply) with columns Item, Move-in condition, Move-out condition. The reader can type each condition on screen. The printout adds Tenant and Landlord signature and date lines.",
 facts=["tenantRights","smoke","co"],
 counts=f"A studio apartment produces {m['studioApartment']['rooms']} rooms and {m['studioApartment']['items']} items to record. A 3-bedroom, 2-bathroom house with laundry, dishwasher, garage and yard produces {m['threeBedHouseAllFeatures']['rooms']} rooms and {m['threeBedHouseAllFeatures']['items']} items.",
 cover="(1) what the form is and why both sides use the same one; (2) how to fill it in: describe condition plainly (good, scuff by door), photograph existing damage with dates, test appliances and alarms; (3) how the form is built from the rooms and features the reader picks, with the studio vs 3-bedroom counts; (4) move-out: same form, compare side by side; deposit deductions and the return deadline are set by state law, some states require a written move-in checklist (HUD link); (5) tenant vs landlord tips; (6) TAKEAWAY: fill it in on day one, both sign, each keep a copy, and repeat at move-out. No deposit amounts, deadlines or percentages.",
 faqs=["What to write on a move-in checklist?","Is a move-in checklist required?","What should I check in an apartment before moving in?","Should I take photos at move-in?","How does the move-out checklist affect my deposit?","What if I find damage after I move in?","Can the landlord and tenant use the same form?","Can I print or save this as a PDF?"],
 faqnotes="Q2: some states require landlords to give a written move-in checklist; rules vary — check your state (HUD page). Q6: report it to the landlord in writing with photos as soon as you find it and keep a copy; no deadline numbers.",
 links="Must link at least: /checklists/renting-checklist/, /checklists/landlord-checklist/, /checklists/first-apartment-checklist/."))

fa = C["first-apartment"]
ROWS.append(dict(slug="first-apartment-checklist", cid="first-apartment",
 kw="first apartment checklist", also="apartment checklist, new apartment checklist, first college apartment checklist, apartment essentials checklist, first apartment checklist on a budget",
 intent="someone moving into their first apartment wants a list of what to buy, which items they need on day one, and a running total of what it will cost using their own prices, printable.",
 rq="What do I need to buy for my first apartment, and what will it cost?",
 ans="Start with the day-one essentials (bed, kitchen basics, bathroom, cleaning, safety items) and the move-in money (deposit, first month, renters insurance, utility deposits), defer the rest, and total it against your budget — the tool lists what your unit and roommate setup need and adds up your own prices. Shape: list + figure.",
 place='introText paragraph one gives the answer; the tool (section 1, "Your First Apartment Checklist and Budget") delivers the list and the total.',
 tool="Questions: Bedrooms (0 = studio); Unit comes furnished; Sharing with roommates; Washer / dryer in unit; Bringing a pet; and a 'Show day-one items only' switch. No location block. Each item has a checkbox, a 'Day one' tag where it applies, and a price box the reader fills in. Three totals: Total of prices entered, Day-one items, Still to buy (unticked). Nothing is pre-filled: the tool contains no prices. Sections: Move-in money, Bedroom (unfurnished only), Kitchen, Bathroom, Living area (unfurnished only), Cleaning and laundry, Safety and tools, Pet (pet only).",
 facts=["flood"],
 counts=f"The full list has {fa['library']} items. An unfurnished one-bedroom shows {fa['unfurnishedOneBed']['items']} items, {fa['unfurnishedOneBed']['dayOne']} of them tagged day one. A furnished studio shared with roommates and with in-unit laundry shows {fa['furnishedStudioRoommates']['items']} items, {fa['furnishedStudioRoommates']['dayOne']} of them day one, because it drops the bedroom, living-area and dish items and adds a step to agree with roommates on who brings which kitchen items.",
 cover="(1) the two kinds of cost: move-in money and things to buy; (2) day one vs can-wait and why the tool tags them; (3) how furnished, roommates, laundry and pets change the list, with the counts; (4) how the totals work with the reader's own prices, and why the tool has no built-in prices (they vary by store, city and taste); link /budget/; (5) the renter's side: link the rental checklist and the move-in condition form; (6) TAKEAWAY: price the day-one items first, keep the rest on the list, and buy as the budget allows. Never state a dollar figure for furnishing or any item.",
 faqs=["What do I need for my first apartment?","Is $5000 enough to furnish an apartment?","What furniture should I buy for my first apartment?","What should I buy first for a new apartment?","What move-in costs should I budget for besides furniture?","What changes if the apartment comes furnished?","How do roommates change the list?","Can I print this first apartment checklist?"],
 faqnotes="Q2: we publish no furnishing cost figure; it depends on what you already own, new vs used, and your city; enter your own prices and the tool totals them so you can see whether a budget like that covers your list. Do not say yes or no. Q5: deposit, first month, application and move-in fees, renters insurance, utility deposits, movers — no amounts; renters policies generally exclude flood.",
 links="Must link at least: /budget/, /checklists/renting-checklist/, /checklists/move-in-move-out-checklist/."))

for r in ROWS:
    facts = "\n".join(f"- {FED[k]}" for k in r["facts"])
    body = f"""# ROW PROMPT (data only) — {r['slug']}

route: /checklists/{r['slug']}/   page type: explainer / spoke (interactive checklist tool page; JSON keys per the output contract)
depth floor: 900 body words across introText + howItWorks + workedExample + commonMistakes + faqs
primary keyword: {r['kw']}
secondary keywords: {r['also']}
intent: {r['intent']}
reader question: "{r['rq']}"
answer: {r['ans']}
answer placement: {r['place']} The answering material goes before any background or definition.

{TOOL_COMMON}

## This checklist
{r['tool']}

{FACT_HEADER}
{PROV}
Scenario counts (outputs of the tool's rules, file reports/mindmap-pass/2026-10-25/evidence/counts.json):
- {r['counts']}
Published guidance the rules use:
{facts}
No other figures. Do not state any price, fee, deposit amount, deadline in days (other than the federal ones above), percentage or statistic.

## CLOSED URL LIST — only external hrefs allowed
{chr(10).join(URLS[k] for k in r['facts'] if k in URLS) or '(none — use internal links only)'}
Link one only where the sentence states that source's fact.

## Internal routes it may link (real routes only)
{INTERNAL}
{r['links']}

## Coverage (howItWorks paragraphs, in order)
{r['cover']}

## FAQ questions (verbatim, in this order)
{chr(10).join(f'{i+1}. {q}' for i, q in enumerate(r['faqs']))}
{r['faqnotes']}
"""
    (D / f"{r['slug']}.prompt.md").write_text(body)
    print("wrote", r["slug"], len(body.split()))
json.dump([{k: r[k] for k in ("slug", "cid", "kw", "rq")} for r in ROWS], open(D / "rows.json", "w"), indent=1)
