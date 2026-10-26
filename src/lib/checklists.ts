// Checklist engine (mindmap-pass 2026-10-25). Eight checklists — buying, selling, renting (tenant),
// landlord, home inspection, final walkthrough, move-in/move-out condition report, first apartment —
// share one profile shape and one rule format: every item lists the conditions under which it applies,
// and the island shows only the items whose conditions match the reader's answers.
//
// Editorial rules for this file:
// - Every legal or safety statement is federal (lead-paint disclosure, Fair Housing Act, FCRA,
//   Closing Disclosure timing, IRS home-sale exclusion) or a published agency recommendation (EPA,
//   USFA/NFPA, CPSC, ready.gov), and carries `src` pointing at SOURCES below.
// - State law (security-deposit caps and return deadlines, seller-disclosure forms, entry-notice rules)
//   differs by state and changes, so it is NEVER stated as a number here. Those items tell the reader
//   to check their state's rule.
// - Climate flags are pre-set from the state as a convenience (CLIMATE_DEFAULTS) and the reader can
//   flip each one; the defaults are a starting point, not a claim about every town in the state.

export type ChecklistId =
  | "home-buying"
  | "home-selling"
  | "renting"
  | "landlord"
  | "home-inspection"
  | "final-walkthrough"
  | "move-in-move-out"
  | "first-apartment";

export interface Profile {
  state: string; // USPS code, "" = not chosen
  city: string; // printout label only
  freeze: boolean;
  hurricane: boolean;
  wildfire: boolean;
  earthquake: boolean;
  // property
  propertyType: string; // per-checklist option values (see QUESTIONS)
  era: "pre1950" | "1950-1977" | "1978-1999" | "2000+" | "new" | "unknown";
  foundation: "slab" | "crawlspace" | "basement" | "unknown";
  well: boolean;
  septic: boolean;
  pool: boolean;
  // buyer
  firstTime: boolean;
  loan: "conventional" | "fha" | "va" | "usda" | "cash";
  // seller
  agent: "agent" | "fsbo";
  occupancy: "owner" | "vacant" | "tenant";
  mortgage: boolean;
  // renter
  pets: boolean;
  car: boolean;
  // landlord
  term: "long" | "furnished";
  manager: "self" | "pm";
  // final walkthrough
  repairs: boolean;
  sellerOut: boolean;
  // move-in / move-out + first apartment
  role: "tenant" | "landlord";
  bedrooms: number;
  bathrooms: number;
  yard: boolean;
  garage: boolean;
  balcony: boolean;
  laundry: boolean;
  dishwasher: boolean;
  furnished: boolean;
  roommates: boolean;
}

export const DEFAULT_PROFILE: Profile = {
  state: "",
  city: "",
  freeze: true,
  hurricane: false,
  wildfire: false,
  earthquake: false,
  propertyType: "single-family",
  era: "unknown",
  foundation: "unknown",
  well: false,
  septic: false,
  pool: false,
  firstTime: true,
  loan: "conventional",
  agent: "agent",
  occupancy: "owner",
  mortgage: true,
  pets: false,
  car: true,
  term: "long",
  manager: "self",
  repairs: true,
  sellerOut: true,
  role: "tenant",
  bedrooms: 1,
  bathrooms: 1,
  yard: false,
  garage: false,
  balcony: false,
  laundry: false,
  dishwasher: false,
  furnished: false,
  roommates: false,
};

// ---- Climate defaults by state -------------------------------------------------------------------
// Convenience presets only; the reader can change every flag. Sets chosen conservatively:
// - Freeze OFF only where hard freezes are rare statewide (FL, HI) — everywhere else a pipe-freeze
//   item is worth seeing.
// - Hurricane ON for Gulf/South Atlantic coast states and HI (NOAA's most-hit coastline); other Atlantic
//   states can switch it on.
// - Wildfire ON for the western states where wildfire is a routine planning risk (ready.gov/wildfires).
// - Earthquake ON for the states with the highest USGS hazard (west coast, AK, HI, NV, UT).
const NO_HARD_FREEZE = new Set(["FL", "HI"]);
const HURRICANE = new Set(["TX", "LA", "MS", "AL", "FL", "GA", "SC", "NC", "HI"]);
const WILDFIRE = new Set(["CA", "OR", "WA", "ID", "MT", "NV", "AZ", "NM", "CO", "UT", "WY"]);
const EARTHQUAKE = new Set(["CA", "AK", "WA", "OR", "NV", "UT", "HI"]);

export function climateDefaults(usps: string): Pick<Profile, "freeze" | "hurricane" | "wildfire" | "earthquake"> {
  return {
    freeze: !NO_HARD_FREEZE.has(usps),
    hurricane: HURRICANE.has(usps),
    wildfire: WILDFIRE.has(usps),
    earthquake: EARTHQUAKE.has(usps),
  };
}

// ---- Sources -------------------------------------------------------------------------------------
export const SOURCES: Record<string, { label: string; url: string }> = {
  lead: { label: "EPA: Real estate disclosures about lead-based paint", url: "https://www.epa.gov/lead/real-estate-disclosure" },
  radon: { label: "EPA: Radon", url: "https://www.epa.gov/radon" },
  wells: { label: "EPA: Private drinking water wells", url: "https://www.epa.gov/privatewells" },
  septic: { label: "EPA: Septic systems", url: "https://www.epa.gov/septic" },
  leadWater: { label: "EPA: Lead in drinking water", url: "https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" },
  asbestos: { label: "EPA: Protect your family from asbestos", url: "https://www.epa.gov/asbestos/protect-your-family-exposures-asbestos" },
  aluminum: { label: "CPSC: Repairing aluminum wiring", url: "https://www.cpsc.gov/s3fs-public/516.pdf" },
  flood: { label: "FEMA Flood Map Service Center", url: "https://msc.fema.gov/portal/home" },
  cd: { label: "CFPB: What is a Closing Disclosure?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-closing-disclosure-en-1983/" },
  le: { label: "CFPB: What is a Loan Estimate?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/" },
  credit: { label: "AnnualCreditReport.com", url: "https://www.annualcreditreport.com/" },
  usda: { label: "USDA: Property eligibility map", url: "https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do" },
  smoke: { label: "NFPA: Smoke alarms", url: "https://www.nfpa.org/education-and-research/home-fire-safety/smoke-alarms" },
  co: { label: "CPSC: Carbon monoxide information center", url: "https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Carbon-Monoxide-Information-Center" },
  fha: { label: "HUD: Fair Housing Act overview", url: "https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview" },
  fcra: { label: "FTC: Using consumer reports: what landlords need to know", url: "https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know" },
  scams: { label: "FTC: Rental listing scams", url: "https://consumer.ftc.gov/articles/rental-listing-scams" },
  tenantRights: { label: "HUD: Tenant rights, laws and protections by state", url: "https://www.hud.gov/topics/rental_assistance/tenantrights" },
  p523: { label: "IRS: Publication 523, Selling Your Home", url: "https://www.irs.gov/publications/p523" },
  p527: { label: "IRS: Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
  ashi: { label: "ASHI: Standard of Practice for home inspections", url: "https://www.homeinspector.org/standards-of-practice" },
  wildfire: { label: "Ready.gov: Wildfires", url: "https://www.ready.gov/wildfires" },
  hurricane: { label: "Ready.gov: Hurricanes", url: "https://www.ready.gov/hurricanes" },
  earthquake: { label: "Ready.gov: Earthquakes", url: "https://www.ready.gov/earthquakes" },
  winter: { label: "American Red Cross: Winter storm safety", url: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/winter-storm.html" },
  mail: { label: "USPS: Change of address", url: "https://www.usps.com/manage/forward.htm" },
};

// ---- Item format ---------------------------------------------------------------------------------
export interface Item {
  id: string;
  text: string;
  /** Optional one-line "what to look for / why". */
  note?: string;
  /** Applies only when this returns true. Omit = always applies. */
  when?: (p: Profile) => boolean;
  src?: keyof typeof SOURCES;
  /** Internal page with more on this step. */
  link?: { href: string; label: string };
}

export interface Section {
  id: string;
  title: string;
  when?: (p: Profile) => boolean;
  items: Item[];
}

// Small predicates reused across checklists.
const pre1978 = (p: Profile) => p.era === "pre1950" || p.era === "1950-1977";
const pre1978OrUnsure = (p: Profile) => pre1978(p) || p.era === "unknown";
const pre1986 = (p: Profile) => pre1978(p) || p.era === "1978-1999" || p.era === "unknown";
const oldHome = (p: Profile) => p.era === "pre1950" || p.era === "1950-1977";
const hasHoa = (p: Profile) => p.propertyType === "condo" || p.propertyType === "townhouse";
const isHouse = (p: Profile) => p.propertyType === "single-family" || p.propertyType === "townhouse" || p.propertyType === "multi-family" || p.propertyType === "manufactured";
const isNew = (p: Profile) => p.era === "new" || p.propertyType === "new-construction";
const financed = (p: Profile) => p.loan !== "cash";

// ---- Questions each checklist asks -----------------------------------------------------------------
export type Question =
  | { key: keyof Profile; label: string; type: "select"; options: { value: string; label: string }[] }
  | { key: keyof Profile; label: string; type: "toggle" }
  | { key: keyof Profile; label: string; type: "number"; min: number; max: number };

const Q_ERA: Question = {
  key: "era",
  label: "When was it built?",
  type: "select",
  options: [
    { value: "unknown", label: "Not sure" },
    { value: "pre1950", label: "Before 1950" },
    { value: "1950-1977", label: "1950 to 1977" },
    { value: "1978-1999", label: "1978 to 1999" },
    { value: "2000+", label: "2000 or later" },
    { value: "new", label: "Brand-new / under construction" },
  ],
};
const Q_FOUNDATION: Question = {
  key: "foundation",
  label: "Foundation",
  type: "select",
  options: [
    { value: "unknown", label: "Not sure" },
    { value: "slab", label: "Slab" },
    { value: "crawlspace", label: "Crawlspace" },
    { value: "basement", label: "Basement" },
  ],
};
const Q_HOME_TYPE: Question = {
  key: "propertyType",
  label: "Type of home",
  type: "select",
  options: [
    { value: "single-family", label: "Single-family house" },
    { value: "townhouse", label: "Townhouse (with HOA)" },
    { value: "condo", label: "Condo (with HOA)" },
    { value: "multi-family", label: "Duplex / 2-4 units" },
    { value: "manufactured", label: "Manufactured home" },
  ],
};

export const QUESTIONS: Record<ChecklistId, Question[]> = {
  "home-buying": [
    Q_HOME_TYPE,
    Q_ERA,
    {
      key: "loan",
      label: "How are you paying?",
      type: "select",
      options: [
        { value: "conventional", label: "Conventional mortgage" },
        { value: "fha", label: "FHA loan" },
        { value: "va", label: "VA loan" },
        { value: "usda", label: "USDA loan" },
        { value: "cash", label: "Cash" },
      ],
    },
    { key: "firstTime", label: "First-time buyer", type: "toggle" },
    { key: "well", label: "Private well", type: "toggle" },
    { key: "septic", label: "Septic system", type: "toggle" },
    { key: "pool", label: "Pool", type: "toggle" },
  ],
  "home-selling": [
    Q_HOME_TYPE,
    Q_ERA,
    { key: "agent", label: "Selling with", type: "select", options: [{ value: "agent", label: "A real estate agent" }, { value: "fsbo", label: "No agent (for sale by owner)" }] },
    { key: "occupancy", label: "Who lives there now?", type: "select", options: [{ value: "owner", label: "I do" }, { value: "vacant", label: "Nobody (vacant)" }, { value: "tenant", label: "A tenant" }] },
    { key: "mortgage", label: "Mortgage still owed", type: "toggle" },
    { key: "septic", label: "Septic system", type: "toggle" },
    { key: "pool", label: "Pool", type: "toggle" },
  ],
  renting: [
    {
      key: "propertyType",
      label: "What are you renting?",
      type: "select",
      options: [
        { value: "apartment", label: "Apartment in a large building or complex" },
        { value: "apartment-small", label: "Apartment from a small landlord" },
        { value: "condo", label: "Condo or townhouse (owner rents it out)" },
        { value: "single-family", label: "A whole house" },
        { value: "room", label: "A room in a shared home" },
      ],
    },
    Q_ERA,
    { key: "pets", label: "Bringing a pet", type: "toggle" },
    { key: "car", label: "Need parking", type: "toggle" },
  ],
  landlord: [
    {
      key: "propertyType",
      label: "What are you renting out?",
      type: "select",
      options: [
        { value: "single-family", label: "Single-family house" },
        { value: "condo", label: "Condo or townhouse (with HOA)" },
        { value: "multi-family", label: "Duplex / small multifamily" },
        { value: "room", label: "A room, ADU or part of my home" },
      ],
    },
    Q_ERA,
    { key: "term", label: "Rental type", type: "select", options: [{ value: "long", label: "Long-term lease (12 months, month-to-month)" }, { value: "furnished", label: "Furnished / short or mid-term" }] },
    { key: "manager", label: "Managed by", type: "select", options: [{ value: "self", label: "Me" }, { value: "pm", label: "A property manager" }] },
    { key: "mortgage", label: "Mortgage on the property", type: "toggle" },
    { key: "pool", label: "Pool", type: "toggle" },
  ],
  "home-inspection": [
    Q_HOME_TYPE,
    Q_ERA,
    Q_FOUNDATION,
    { key: "well", label: "Private well", type: "toggle" },
    { key: "septic", label: "Septic system", type: "toggle" },
    { key: "pool", label: "Pool", type: "toggle" },
  ],
  "final-walkthrough": [
    { key: "propertyType", label: "Type of purchase", type: "select", options: [{ value: "single-family", label: "Existing (resale) home" }, { value: "condo", label: "Existing condo / townhouse" }, { value: "new-construction", label: "New Construction" }] },
    { key: "repairs", label: "Seller agreed to repairs", type: "toggle" },
    { key: "sellerOut", label: "Seller already moved out", type: "toggle" },
    { key: "well", label: "Private well", type: "toggle" },
    { key: "septic", label: "Septic system", type: "toggle" },
    { key: "pool", label: "Pool", type: "toggle" },
  ],
  "move-in-move-out": [
    { key: "role", label: "I am the", type: "select", options: [{ value: "tenant", label: "Tenant" }, { value: "landlord", label: "Landlord / property manager" }] },
    { key: "propertyType", label: "Rental", type: "select", options: [{ value: "apartment", label: "Apartment / condo" }, { value: "single-family", label: "House / townhouse" }] },
    { key: "bedrooms", label: "Bedrooms (0 = studio)", type: "number", min: 0, max: 6 },
    { key: "bathrooms", label: "Bathrooms", type: "number", min: 1, max: 5 },
    { key: "laundry", label: "Washer / dryer in unit", type: "toggle" },
    { key: "dishwasher", label: "Dishwasher", type: "toggle" },
    { key: "balcony", label: "Balcony or patio", type: "toggle" },
    { key: "garage", label: "Garage", type: "toggle" },
    { key: "yard", label: "Yard", type: "toggle" },
    { key: "furnished", label: "Furnished", type: "toggle" },
  ],
  "first-apartment": [
    { key: "furnished", label: "Unit comes furnished", type: "toggle" },
    { key: "roommates", label: "Sharing with roommates", type: "toggle" },
    { key: "laundry", label: "Washer / dryer in unit", type: "toggle" },
    { key: "pets", label: "Bringing a pet", type: "toggle" },
  ],
};

/** Which checklists show the state + climate block. */
export const USES_LOCATION: Record<ChecklistId, boolean> = {
  "home-buying": true,
  "home-selling": true,
  renting: true,
  landlord: true,
  "home-inspection": true,
  "final-walkthrough": false,
  "move-in-move-out": true,
  "first-apartment": false,
};

/** Per-checklist starting answers (merged over DEFAULT_PROFILE). */
export const PRESETS: Record<ChecklistId, Partial<Profile>> = {
  "home-buying": { propertyType: "single-family" },
  "home-selling": { propertyType: "single-family" },
  renting: { propertyType: "apartment" },
  landlord: { propertyType: "single-family" },
  "home-inspection": { propertyType: "single-family" },
  "final-walkthrough": { propertyType: "single-family" },
  "move-in-move-out": { propertyType: "apartment", bedrooms: 1, bathrooms: 1 },
  "first-apartment": {},
};

export const TITLES: Record<ChecklistId, string> = {
  "home-buying": "Home Buying Checklist",
  "home-selling": "Home Selling Checklist",
  renting: "Rental Checklist for Renters",
  landlord: "Landlord Checklist",
  "home-inspection": "Home Inspection Checklist",
  "final-walkthrough": "Final Walkthrough Checklist",
  "move-in-move-out": "Move-In / Move-Out Condition Checklist",
  "first-apartment": "First Apartment Checklist",
};

export const ROUTES: Record<ChecklistId, string> = {
  "home-buying": "/checklists/home-buying-checklist/",
  "home-selling": "/checklists/home-selling-checklist/",
  renting: "/checklists/renting-checklist/",
  landlord: "/checklists/landlord-checklist/",
  "home-inspection": "/checklists/home-inspection-checklist/",
  "final-walkthrough": "/checklists/final-walkthrough-checklist/",
  "move-in-move-out": "/checklists/move-in-move-out-checklist/",
  "first-apartment": "/checklists/first-apartment-checklist/",
};

// ---- Shared climate items (used by several checklists with different wording) -----------------------
const freezeHouse: Item[] = [
  { id: "frz-pipes", text: "Look for pipes in exterior walls, crawlspaces, attics or garages, and ask how they are insulated or heat-taped", note: "Unheated spaces are where pipes freeze and burst.", when: (p) => p.freeze, src: "winter" },
  { id: "frz-shutoff", text: "Find the main water shutoff and confirm it turns", note: "You need it in seconds if a pipe bursts.", when: (p) => p.freeze },
  { id: "frz-heat", text: "Confirm the heating system's age, fuel type and last service date", when: (p) => p.freeze },
];
const hurricaneHouse: Item[] = [
  { id: "hur-roof", text: "Ask the roof's age and how it is attached (straps or clips), and whether the windows are impact-rated or have shutters", note: "Insurers in hurricane areas price and sometimes refuse coverage on roof age; some give discounts for documented wind-resistant features.", when: (p) => p.hurricane, src: "hurricane" },
  { id: "hur-wind", text: "Get a homeowners insurance quote early and read the hurricane or wind deductible", note: "Many coastal policies carry a separate, larger percentage deductible for named storms.", when: (p) => p.hurricane },
];
const wildfireHouse: Item[] = [
  { id: "wf-zone", text: "Check the defensible space around the house (cleared vegetation near walls) and whether vents and roofing resist embers", when: (p) => p.wildfire, src: "wildfire" },
  { id: "wf-ins", text: "Confirm homeowners insurance is available and affordable before you commit", note: "Coverage has become harder to buy in some wildfire areas.", when: (p) => p.wildfire },
];
const earthquakeHouse: Item[] = [
  { id: "eq-strap", text: "Check that the water heater is strapped and, for an older house, whether the frame is bolted to the foundation", when: (p) => p.earthquake, src: "earthquake" },
  { id: "eq-ins", text: "Price earthquake coverage separately", note: "Standard homeowners policies generally exclude earthquake damage.", when: (p) => p.earthquake },
];

// ---- 1. Home buying -------------------------------------------------------------------------------
const HOME_BUYING: Section[] = [
  {
    id: "money",
    title: "1. Budget and Credit",
    items: [
      { id: "b-credit", text: "Pull your credit reports from all three bureaus and dispute any errors", src: "credit" },
      { id: "b-budget", text: "Set a monthly budget that includes principal, interest, property tax, insurance and any HOA dues", link: { href: "/mortgage/home-affordability-calculator/", label: "Home affordability calculator" } },
      { id: "b-down", text: "Decide your down payment and how much cash stays in savings after closing", link: { href: "/mortgage/down-payment-calculator/", label: "Down payment calculator" } },
      { id: "b-closing", text: "Budget for closing costs on top of the down payment", link: { href: "/mortgage/closing-cost-calculator/", label: "Closing cost calculator" } },
      { id: "b-programs", text: "Look up first-time buyer programs from your state housing finance agency and city", when: (p) => p.firstTime && financed(p) },
      { id: "b-cash", text: "Get a proof-of-funds letter from the bank holding the cash", when: (p) => p.loan === "cash" },
    ],
  },
  {
    id: "loan",
    title: "2. Mortgage Pre-Approval",
    when: financed,
    items: [
      { id: "b-lenders", text: "Apply with two or three lenders within a few days of each other and compare their Loan Estimates line by line", note: "A lender must send the Loan Estimate within three business days of your application.", src: "le" },
      { id: "b-preapproval", text: "Get a written pre-approval letter to send with offers" },
      { id: "b-fha", text: "FHA: confirm the upfront and annual mortgage insurance in the quote", when: (p) => p.loan === "fha" },
      { id: "b-va", text: "VA: request your Certificate of Eligibility", when: (p) => p.loan === "va" },
      { id: "b-usda", text: "USDA: check the address on the USDA eligibility map before you make an offer", when: (p) => p.loan === "usda", src: "usda" },
      { id: "b-condo-approval", text: "FHA or VA on a condo: confirm the condo project is approved for your loan type", when: (p) => p.propertyType === "condo" && (p.loan === "fha" || p.loan === "va") },
      { id: "b-freeze-credit", text: "Avoid new credit cards, car loans or large purchases until closing" },
    ],
  },
  {
    id: "hunting",
    title: "3. House Hunting",
    items: [
      { id: "b-wants", text: "Write down your must-haves and deal-breakers before the first showing" },
      { id: "b-visit", text: "Visit the neighborhood on a weekday evening and a weekend, and drive your commute at rush hour" },
      { id: "b-flood", text: "Look up the address on the FEMA flood map", note: "A high-risk flood zone means required flood insurance on most mortgages.", src: "flood" },
      { id: "b-taxes", text: "Check the property tax bill and whether a reassessment after sale will raise it" },
      { id: "b-water", text: "On each tour, look for water stains, musty smells, soft floors and fresh paint on one patch of ceiling" },
      { id: "b-systems", text: "Ask the age of the roof, furnace, AC and water heater" },
      { id: "b-hoa", text: "Ask the HOA dues, what they cover, recent special assessments and the rental and pet rules", when: hasHoa },
      { id: "b-mh", text: "Check the HUD certification label and data plate, and whether the land is owned or leased", when: (p) => p.propertyType === "manufactured" },
      { id: "b-builder", text: "Research the builder, what is standard vs. an upgrade, and the warranty terms in the contract", when: isNew },
      { id: "b-multi", text: "Get the current leases, rent roll and security deposits held for each unit", when: (p) => p.propertyType === "multi-family" },
      ...freezeHouse.slice(0, 1),
      ...wildfireHouse,
      ...hurricaneHouse.slice(0, 1),
      ...earthquakeHouse.slice(0, 1),
    ],
  },
  {
    id: "offer",
    title: "4. Offer and Contract",
    items: [
      { id: "b-comps", text: "Review recent comparable sales before choosing a price" },
      { id: "b-earnest", text: "Confirm the earnest money amount, who holds it, and when you can get it back" },
      { id: "b-contingencies", text: "Choose your contingencies: inspection, financing and appraisal, and their deadlines", when: financed },
      { id: "b-contingencies-cash", text: "Keep an inspection contingency even when paying cash", when: (p) => p.loan === "cash" },
      { id: "b-disclosures", text: "Read the seller's disclosure form for known defects" },
      { id: "b-lead", text: "Built before 1978: get the federal lead-paint disclosure and pamphlet, and decide whether to use your 10-day window to test", src: "lead", when: pre1978OrUnsure },
      { id: "b-hoa-docs", text: "Read the HOA budget, reserve study, minutes and rules during the review period", when: hasHoa },
    ],
  },
  {
    id: "inspect",
    title: "5. Inspection and Appraisal",
    items: [
      { id: "b-inspect", text: "Book a licensed home inspector and attend the inspection", link: { href: "/checklists/home-inspection-checklist/", label: "Home inspection checklist" } },
      { id: "b-radon", text: "Add a radon test", note: "EPA recommends testing all homes below the third floor.", src: "radon" },
      { id: "b-sewer", text: "Add a sewer-line camera scope", when: (p) => (oldHome(p) || p.era === "unknown") && !p.septic },
      { id: "b-well", text: "Test the well water", src: "wells", when: (p) => p.well },
      { id: "b-septic", text: "Order a septic inspection", src: "septic", when: (p) => p.septic },
      { id: "b-pool", text: "Have the pool and equipment inspected", when: (p) => p.pool },
      { id: "b-wdi", text: "Ask whether your lender or area calls for a termite (wood-destroying insect) inspection" },
      { id: "b-negotiate", text: "Decide which findings to ask the seller to repair or credit, in writing" },
      { id: "b-appraisal", text: "Review the appraisal; if it comes in low, renegotiate, cover the gap, or use your contingency", when: financed },
      { id: "b-mpr", text: "FHA/VA: the appraisal checks minimum property requirements, and required repairs must be fixed before closing", when: (p) => p.loan === "fha" || p.loan === "va" },
    ],
  },
  {
    id: "close",
    title: "6. Insurance and Closing",
    items: [
      { id: "b-insurance", text: "Buy homeowners insurance (or HO-6 for a condo) and send the binder to your lender" },
      { id: "b-flood-ins", text: "If the home is in a high-risk flood zone, buy flood insurance", src: "flood" },
      ...hurricaneHouse.slice(1),
      ...earthquakeHouse.slice(1),
      { id: "b-title", text: "Confirm title search and choose whether to buy an owner's title insurance policy" },
      { id: "b-cd", text: "Compare the Closing Disclosure with your Loan Estimate", note: "Your lender must give it to you at least three business days before closing.", src: "cd", when: financed },
      { id: "b-wire", text: "Call your title or escrow company at a number you already know to confirm wiring instructions before sending money", note: "Wire fraud by email is a common closing scam." },
      { id: "b-walk", text: "Do the final walkthrough", link: { href: "/checklists/final-walkthrough-checklist/", label: "Final walkthrough checklist" } },
      { id: "b-id", text: "Bring photo ID and your funds as the closing agent instructs" },
    ],
  },
  {
    id: "after",
    title: "7. First Week in the House",
    items: [
      { id: "b-locks", text: "Change or rekey the locks and reset garage and alarm codes" },
      { id: "b-alarms", text: "Test smoke and carbon monoxide alarms, and add them where they are missing", src: "smoke" },
      { id: "b-utilities", text: "Put utilities in your name and forward your mail", src: "mail" },
      ...freezeHouse.slice(1, 2),
      { id: "b-records", text: "File your closing documents; you will need them for taxes and when you sell" },
    ],
  },
];

// ---- 2. Home selling ------------------------------------------------------------------------------
const HOME_SELLING: Section[] = [
  {
    id: "plan",
    title: "1. Plan the Sale",
    items: [
      { id: "s-payoff", text: "Request a payoff statement from your mortgage servicer", when: (p) => p.mortgage },
      { id: "s-net", text: "Estimate your net proceeds after commission, closing costs and payoff", link: { href: "/mortgage/closing-cost-calculator/", label: "Closing cost calculator" } },
      { id: "s-tax", text: "Check whether you qualify for the home-sale exclusion (up to $250,000 of gain, $500,000 married filing jointly, if you owned and lived there 2 of the last 5 years)", src: "p523", when: (p) => p.occupancy !== "tenant" },
      { id: "s-tax-rental", text: "A rental property: plan for capital gains tax and depreciation recapture", src: "p527", when: (p) => p.occupancy === "tenant", link: { href: "/real-estate/capital-gains-calculator/", label: "Capital gains calculator" } },
      { id: "s-next", text: "Decide where you are moving and whether you need to buy before you sell", link: { href: "/guides/how-to-buy-and-sell-a-house-at-the-same-time/", label: "Buying and selling at the same time" } },
      { id: "s-agents", text: "Interview at least two agents and compare their pricing plan, marketing and commission", when: (p) => p.agent === "agent" },
      { id: "s-fsbo-plan", text: "Decide how buyers will find the listing, who will handle the contract, and which title or escrow company will close", when: (p) => p.agent === "fsbo" },
    ],
  },
  {
    id: "prep",
    title: "2. Repairs and Prep",
    items: [
      { id: "s-declutter", text: "Declutter, depersonalize and deep-clean every room", when: (p) => p.occupancy === "owner" },
      { id: "s-fix", text: "Fix what an inspector will flag: leaks, broken fixtures, missing GFCI outlets, doors that stick" },
      { id: "s-skip", text: "Get a quote before any big remodel; buyers often discount for condition rather than pay for your finishes" },
      { id: "s-preinspect", text: "Consider a pre-listing inspection so repairs aren't a surprise during the buyer's inspection" },
      { id: "s-service", text: "Service the furnace and AC and keep the receipt" },
      { id: "s-records", text: "Gather permits, warranties, utility bills and repair receipts for buyers" },
      { id: "s-septic", text: "Pump and inspect the septic system and keep the report", src: "septic", when: (p) => p.septic },
      { id: "s-pool", text: "Clean the pool and confirm the equipment and safety fencing work", when: (p) => p.pool },
      { id: "s-curb", text: "Trim landscaping, clean gutters and touch up the front entry", when: isHouse },
      { id: "s-vacant-ins", text: "Tell your insurer the house is vacant and read the policy's vacancy clause", note: "Many policies limit coverage after a home sits empty for a set period.", when: (p) => p.occupancy === "vacant" },
      { id: "s-vacant-frz", text: "Keep the heat on or have the plumbing winterized while it is empty", when: (p) => p.occupancy === "vacant" && p.freeze, src: "winter" },
      { id: "s-wf", text: "Clear dead vegetation and debris near the house", when: (p) => p.wildfire, src: "wildfire" },
      { id: "s-hur", text: "If listing in hurricane season, know how you will secure the house and who handles it while you are away", when: (p) => p.hurricane, src: "hurricane" },
    ],
  },
  {
    id: "disclose",
    title: "3. Disclosures and Documents",
    items: [
      { id: "s-state-disc", text: "Complete your state's seller disclosure form honestly", note: "Required forms and what must be disclosed differ by state; ask your agent or a real estate attorney." },
      { id: "s-lead", text: "Built before 1978: give buyers the federal lead-paint disclosure, the EPA pamphlet, and a 10-day chance to test", src: "lead", when: pre1978OrUnsure },
      { id: "s-hoa", text: "Order the HOA resale certificate / documents package early", note: "It can take days or weeks and many states give buyers time to review it.", when: hasHoa },
      { id: "s-lease", text: "Gather the lease, deposit records and rent history for the buyer", when: (p) => p.occupancy === "tenant" },
    ],
  },
  {
    id: "list",
    title: "4. Listing and Showings",
    items: [
      { id: "s-price", text: "Price from recent comparable sales, not from list prices or what you need to net" },
      { id: "s-photos", text: "Get professional photos after the house is staged" },
      { id: "s-stage", text: "Stage the main rooms: clear counters, open blinds, replace burnt-out bulbs" },
      { id: "s-secure", text: "Lock away valuables, medications and documents before showings", when: (p) => p.occupancy === "owner" },
      { id: "s-tenant-notice", text: "Give your tenant the notice their lease and your state require before every showing", src: "tenantRights", when: (p) => p.occupancy === "tenant" },
      { id: "s-fsbo-show", text: "Ask showing visitors for ID or proof of pre-approval, and don't show the house alone", when: (p) => p.agent === "fsbo" },
    ],
  },
  {
    id: "offers",
    title: "5. Offers and Contract",
    items: [
      { id: "s-compare", text: "Compare offers on net proceeds, contingencies and closing date, not just price" },
      { id: "s-verify", text: "Ask for the buyer's pre-approval letter or proof of funds" },
      { id: "s-fsbo-contract", text: "Have a real estate attorney or the title company prepare or review the purchase contract", when: (p) => p.agent === "fsbo" },
      { id: "s-deadlines", text: "Put every contingency deadline on a calendar" },
    ],
  },
  {
    id: "contract",
    title: "6. Under Contract",
    items: [
      { id: "s-repairs", text: "Respond to the buyer's repair requests in writing, with receipts for completed work" },
      { id: "s-appraisal", text: "Give the appraiser access and a list of upgrades with dates" },
      { id: "s-maintain", text: "Keep the house in the same condition through closing" },
      { id: "s-utilities", text: "Schedule utility shutoff or transfer for closing day and forward your mail", src: "mail" },
      { id: "s-insure", text: "Keep homeowners insurance in force until the sale closes" },
    ],
  },
  {
    id: "closing",
    title: "7. Closing and Move-Out",
    items: [
      { id: "s-leave", text: "Leave every item the contract includes (appliances, fixtures, window coverings)" },
      { id: "s-clean", text: "Remove your belongings and trash before the buyer's final walkthrough", when: (p) => p.occupancy !== "tenant" },
      { id: "s-keys", text: "Leave keys, garage remotes, codes and appliance manuals" },
      { id: "s-wire", text: "Confirm your payout wiring instructions by phone with the closing agent" },
      { id: "s-docs", text: "Keep your closing statement for your tax return", src: "p523" },
    ],
  },
];

// ---- 3. Renting (tenant) ---------------------------------------------------------------------------
const isRentHouse = (p: Profile) => p.propertyType === "single-family";
const isComplex = (p: Profile) => p.propertyType === "apartment";
const isRoom = (p: Profile) => p.propertyType === "room";

const RENTING: Section[] = [
  {
    id: "search",
    title: "1. Before You Apply",
    items: [
      { id: "r-budget", text: "Set your rent limit including utilities, parking, pet rent and renters insurance", link: { href: "/budget/", label: "Budget calculator" } },
      { id: "r-scam", text: "Confirm the listing is real: see the unit in person, search the address for duplicate listings, and never pay by wire, gift card or crypto", src: "scams" },
      { id: "r-owner", text: "Confirm the person renting it owns or manages it (county property records or the management company's own site)", when: (p) => !isComplex(p) },
      { id: "r-reviews", text: "Read recent reviews of the management company, especially about repairs and deposits", when: isComplex },
      { id: "r-commute", text: "Test the commute at the hours you'd actually travel" },
      { id: "r-flood", text: "Look up the address on the FEMA flood map", src: "flood" },
    ],
  },
  {
    id: "tour",
    title: "2. On the Tour",
    items: [
      { id: "r-water", text: "Run the shower and kitchen tap: pressure, how long hot water takes, any leaks under sinks" },
      { id: "r-pests", text: "Look in cabinets, under sinks and along baseboards for droppings, roaches or bedbug signs" },
      { id: "r-mold", text: "Look for stains, peeling paint or musty smells on ceilings, around windows and in bathrooms" },
      { id: "r-locks", text: "Test every door and window lock, including sliding doors" },
      { id: "r-alarms", text: "Find the smoke and carbon monoxide alarms", src: "smoke" },
      { id: "r-outlets", text: "Count outlets in each room and check cell signal" },
      { id: "r-hvac", text: "Turn on the heat and AC, and ask the system's age and who services it" },
      { id: "r-appliances", text: "Open the fridge, oven and dishwasher; ask which appliances the landlord repairs" },
      { id: "r-noise", text: "Listen for street, neighbor and building noise; come back at night if you can", when: (p) => !isRentHouse(p) },
      { id: "r-laundry", text: "Check where laundry is and what it costs" },
      { id: "r-parking", text: "Confirm parking: assigned spot, permit, fee and guest rules", when: (p) => p.car },
      { id: "r-trash", text: "Ask how trash, recycling and package delivery work", when: (p) => !isRentHouse(p) },
      { id: "r-house-yard", text: "Walk the yard, gutters, driveway and exterior; ask who handles lawn care", when: isRentHouse },
      { id: "r-house-garage", text: "Check the garage, basement or attic for water, pests and storage", when: isRentHouse },
      { id: "r-room-shared", text: "Ask which spaces are shared, how bills are split and what the house rules are", when: isRoom },
      { id: "r-room-who", text: "Ask whether you'll sign a lease with the owner or sublet from another tenant", when: isRoom },
      { id: "r-lead", text: "Built before 1978: expect the federal lead-paint disclosure and pamphlet before you sign", src: "lead", when: pre1978OrUnsure },
    ],
  },
  {
    id: "questions",
    title: "3. Questions to Ask the Landlord",
    items: [
      { id: "r-q-total", text: "What is the total due at move-in (first month, deposit, fees)?" },
      { id: "r-q-utils", text: "Which utilities are included, and what have past bills averaged?" },
      { id: "r-q-repair", text: "How do I request repairs, and what counts as an emergency?" },
      { id: "r-q-increase", text: "How much has rent gone up at renewal in the past?" },
      { id: "r-q-break", text: "What happens if I need to break the lease?" },
      { id: "r-q-entry", text: "How much notice do you give before entering?" },
      { id: "r-q-pet", text: "What are the pet deposit, monthly pet rent and breed or weight limits?", when: (p) => p.pets },
      { id: "r-q-house", text: "Who pays for lawn care, snow removal, pest control and HVAC filters?", when: isRentHouse },
      { id: "r-q-freeze", text: "What heat setting do you require in winter, and who pays if a pipe freezes?", when: (p) => p.freeze && !isComplex(p), src: "winter" },
      { id: "r-q-storm", text: "Are there storm shutters, and who puts them up before a hurricane?", when: (p) => p.hurricane && !isComplex(p), src: "hurricane" },
    ],
  },
  {
    id: "lease",
    title: "4. Reading the Lease",
    items: [
      { id: "r-l-rent", text: "Rent, due date, grace period and late fee" },
      { id: "r-l-deposit", text: "Deposit amount, where it is held and the conditions and deadline for its return", note: "Limits and return deadlines are set by state law.", src: "tenantRights" },
      { id: "r-l-term", text: "Lease length, renewal terms and how much notice you must give to leave" },
      { id: "r-l-fees", text: "Every fee: application, admin, amenity, parking, trash, early termination" },
      { id: "r-l-subletting", text: "Guest, roommate and subletting rules" },
      { id: "r-l-promises", text: "Get any verbal promise (repairs, paint, new appliances) written into the lease" },
      { id: "r-l-pets", text: "Pet addendum terms", when: (p) => p.pets },
      { id: "r-l-house", text: "Exactly which maintenance jobs are yours (yard, snow, gutters, filters, pest control)", when: isRentHouse },
    ],
  },
  {
    id: "apply",
    title: "5. Applying",
    items: [
      { id: "r-a-docs", text: "Have photo ID, recent pay stubs or offer letter, and landlord references ready" },
      { id: "r-a-credit", text: "Check your own credit report first so nothing surprises you", src: "credit" },
      { id: "r-a-fee", text: "Ask what the application fee covers and whether it is refundable" },
      { id: "r-a-denied", text: "If you're denied because of a screening report, you're entitled to the name of the screening company and a free copy", src: "fcra" },
    ],
  },
  {
    id: "movein",
    title: "6. Move-In",
    items: [
      { id: "r-m-report", text: "Fill out a room-by-room move-in condition report with photos and have the landlord sign it", link: { href: "/checklists/move-in-move-out-checklist/", label: "Move-in / move-out checklist" } },
      { id: "r-m-insurance", text: "Buy renters insurance", note: "Renters policies generally don't cover flood; that's a separate policy.", },
      { id: "r-m-utils", text: "Set up the utilities in your name and forward your mail", src: "mail", when: (p) => !isComplex(p) },
      { id: "r-m-mail", text: "Forward your mail", src: "mail", when: isComplex },
      { id: "r-m-shutoff", text: "Find the water shutoff and breaker panel", when: (p) => !isComplex(p) || p.freeze },
      { id: "r-m-wildfire", text: "Learn two ways out of the neighborhood and sign up for local emergency alerts", when: (p) => p.wildfire, src: "wildfire" },
      { id: "r-m-quake", text: "Secure tall furniture to the wall and ask whether the landlord allows it", when: (p) => p.earthquake, src: "earthquake" },
      { id: "r-m-hur", text: "Know your evacuation zone and where you'd go", when: (p) => p.hurricane, src: "hurricane" },
    ],
  },
];

// ---- 4. Landlord ----------------------------------------------------------------------------------
const LANDLORD: Section[] = [
  {
    id: "setup",
    title: "1. Set Up the Rental",
    items: [
      { id: "l-insurance", text: "Switch to a landlord (dwelling) policy and require tenants to carry renters insurance", note: "A standard homeowners policy may not cover a home you rent out; ask your insurer." },
      { id: "l-mortgage", text: "Read your mortgage for owner-occupancy terms before renting it out", when: (p) => p.mortgage },
      { id: "l-hoa", text: "Read the HOA rules on rentals: minimum lease length, caps and registration", when: (p) => p.propertyType === "condo" },
      { id: "l-license", text: "Check whether your city or county requires a rental license, registration or inspection" },
      { id: "l-str", text: "Check local rules and taxes for furnished or short stays; many cities regulate short-term rentals", when: (p) => p.term === "furnished" },
      { id: "l-entity", text: "Decide whether to hold the property in your name or an LLC (ask an attorney and your lender)" },
      { id: "l-account", text: "Open a separate bank account for rent and deposits" },
      { id: "l-pm", text: "Read the management agreement: fees, leasing fee, repair approval limit and how to end it", when: (p) => p.manager === "pm" },
      { id: "l-tax", text: "Set up records for rental income, expenses and depreciation", src: "p527", link: { href: "/real-estate/depreciation-calculator/", label: "Depreciation calculator" } },
    ],
  },
  {
    id: "ready",
    title: "2. Make It Rent-Ready and Safe",
    items: [
      { id: "l-smoke", text: "Install and test smoke alarms in every bedroom, outside sleeping areas and on every level", src: "smoke" },
      { id: "l-co", text: "Install carbon monoxide alarms outside sleeping areas and on each level if there is any fuel-burning appliance or attached garage", src: "co" },
      { id: "l-lead", text: "Built before 1978: prepare the federal lead-paint disclosure and the EPA pamphlet for every lease", src: "lead", when: pre1978OrUnsure },
      { id: "l-locks", text: "Rekey the locks between tenants" },
      { id: "l-systems", text: "Service HVAC, water heater and appliances; fix leaks and broken fixtures" },
      { id: "l-pool", text: "Confirm pool fencing, gates and alarms meet local code", when: (p) => p.pool },
      { id: "l-furnish", text: "Inventory every furnished item with photos", when: (p) => p.term === "furnished" },
      { id: "l-multi", text: "Check common-area lighting, stair railings and exits", when: (p) => p.propertyType === "multi-family" },
      ...freezeHouse.slice(0, 2),
      { id: "l-hur", text: "Plan who installs storm protection and checks the property after a storm", when: (p) => p.hurricane, src: "hurricane" },
      { id: "l-wf", text: "Clear defensible space around the building", when: (p) => p.wildfire, src: "wildfire" },
      { id: "l-eq", text: "Strap the water heater", when: (p) => p.earthquake, src: "earthquake" },
    ],
  },
  {
    id: "price",
    title: "3. Price and List",
    items: [
      { id: "l-comps", text: "Price from comparable rentals listed nearby" },
      { id: "l-numbers", text: "Run the numbers: rent vs. mortgage, taxes, insurance, repairs and vacancy", link: { href: "/real-estate/rental-income-calculator/", label: "Rental income calculator" } },
      { id: "l-listing", text: "Write a listing with the rent, deposit, move-in date, pet policy and the screening criteria" },
    ],
  },
  {
    id: "screen",
    title: "4. Screen Tenants",
    items: [
      { id: "l-criteria", text: "Write your screening criteria (income, credit, rental history) and apply them to every applicant the same way" },
      { id: "l-fair", text: "Follow the Fair Housing Act: no decisions based on race, color, national origin, religion, sex, familial status or disability", src: "fha" },
      { id: "l-assist", text: "Treat assistance animals as a disability accommodation, not as pets", when: (p) => p.propertyType !== "room", src: "fha" },
      { id: "l-verify", text: "Verify income and call previous landlords" },
      { id: "l-adverse", text: "If a screening report plays any part in denying or adding conditions, send an adverse action notice", src: "fcra" },
      { id: "l-dispose", text: "Store and later securely destroy applicants' reports and ID copies", src: "fcra" },
    ],
  },
  {
    id: "lease",
    title: "5. Lease and Deposit",
    items: [
      { id: "l-lease", text: "Use a lease written for your state, covering rent, late fees, repairs, entry notice, pets and termination" },
      { id: "l-deposit", text: "Set the deposit within your state's limit and note your state's return deadline", note: "Both are set by state law.", src: "tenantRights" },
      { id: "l-utilities", text: "Spell out which utilities and maintenance jobs are the tenant's", when: (p) => p.propertyType === "single-family" },
      { id: "l-room", text: "For a room or ADU, set house rules and shared-space terms in writing", when: (p) => p.propertyType === "room" },
      { id: "l-collect", text: "Collect the first month and deposit by a traceable method before handing over keys" },
    ],
  },
  {
    id: "movein",
    title: "6. Move-In Day",
    items: [
      { id: "l-report", text: "Walk the unit with the tenant and both sign a move-in condition report with photos", link: { href: "/checklists/move-in-move-out-checklist/", label: "Move-in / move-out checklist" } },
      { id: "l-keys", text: "Hand over keys and record how many" },
      { id: "l-contact", text: "Give the tenant your repair-request process and emergency contact" },
    ],
  },
  {
    id: "ongoing",
    title: "7. Ongoing",
    items: [
      { id: "l-alarms", text: "Test smoke and CO alarms at each turnover and replace smoke alarms at 10 years", src: "smoke" },
      { id: "l-hvac", text: "Service HVAC once a year" },
      { id: "l-gutters", text: "Clean gutters and check the roof each fall", when: (p) => p.propertyType !== "condo" },
      { id: "l-winter", text: "Before the first freeze: disconnect hoses, shut exterior faucets, insulate exposed pipes", when: (p) => p.freeze, src: "winter" },
      { id: "l-entry", text: "Give the notice your lease and state require before entering" },
      { id: "l-moveout", text: "At move-out, compare against the move-in report and return the deposit with an itemized list by your state's deadline", src: "tenantRights" },
    ],
  },
];

// ---- 5. Home inspection ---------------------------------------------------------------------------
const HOME_INSPECTION: Section[] = [
  {
    id: "before",
    title: "Before the Inspection",
    items: [
      { id: "i-hire", text: "Hire a licensed or certified inspector, ask for a sample report, and plan to attend", src: "ashi" },
      { id: "i-scope", text: "Ask what the standard inspection excludes (radon, mold, sewer line, pests, pool) and book add-ons", src: "ashi" },
      { id: "i-utilities", text: "Confirm the utilities will be on and the attic, crawlspace and panel are reachable" },
    ],
  },
  {
    id: "exterior",
    title: "Roof and Exterior",
    when: (p) => p.propertyType !== "condo",
    items: [
      { id: "i-roof", text: "Roof: age, missing or curling shingles, flashing at chimneys and walls", note: "Red flag: active leaks or a roof at the end of its life." },
      { id: "i-gutters", text: "Gutters and downspouts carry water away from the foundation" },
      { id: "i-grading", text: "Soil slopes away from the house on every side", note: "Red flag: soil sloping toward the walls." },
      { id: "i-siding", text: "Siding, trim and caulking: rot, gaps, peeling paint" },
      { id: "i-windows-ext", text: "Window and door frames: rot, failed seals" },
      { id: "i-deck", text: "Decks and stairs: solid posts, ledger attached to the house, railings secure" },
      { id: "i-chimney", text: "Chimney: cracks, leaning, cap present" },
      ...hurricaneHouse.slice(0, 1),
      { id: "i-wildfire", text: "Defensible space, vents that resist embers, and the roof's fire rating", when: (p) => p.wildfire, src: "wildfire" },
    ],
  },
  {
    id: "structure",
    title: "Structure and Foundation",
    when: (p) => p.propertyType !== "condo",
    items: [
      { id: "i-cracks", text: "Foundation cracks: note width, direction and whether they are stair-step or horizontal", note: "Red flag: horizontal cracks, wide or growing cracks, walls bowing in." },
      { id: "i-sag", text: "Sagging rooflines or floors, doors that won't latch" },
      { id: "i-basement", text: "Basement: water lines, efflorescence (white residue), sump pump working", when: (p) => p.foundation === "basement" || p.foundation === "unknown" },
      { id: "i-crawl", text: "Crawlspace: standing water, vapor barrier, insulation, pests, wood rot", when: (p) => p.foundation === "crawlspace" || p.foundation === "unknown" },
      { id: "i-slab", text: "Slab: cracks in tile or floors, plumbing leaks under the slab", when: (p) => p.foundation === "slab" },
      { id: "i-bolt", text: "Frame bolted to the foundation", when: (p) => p.earthquake && oldHome(p), src: "earthquake" },
      { id: "i-mh", text: "Manufactured home: piers, tie-downs, skirting and the HUD label", when: (p) => p.propertyType === "manufactured" },
    ],
  },
  {
    id: "attic",
    title: "Attic and Insulation",
    when: (p) => p.propertyType !== "condo",
    items: [
      { id: "i-attic-leak", text: "Stains on roof sheathing or rafters (past or current leaks)" },
      { id: "i-attic-vent", text: "Ventilation and insulation depth; no bath fans venting into the attic" },
      { id: "i-attic-pest", text: "Signs of rodents, birds or insects" },
    ],
  },
  {
    id: "plumbing",
    title: "Plumbing",
    items: [
      { id: "i-pressure", text: "Water pressure and drainage at every fixture; run two at once" },
      { id: "i-leaks", text: "Leaks under sinks, around toilets and at the water heater" },
      { id: "i-wh", text: "Water heater: age, pressure-relief valve and discharge pipe, venting" },
      { id: "i-pb", text: "Polybutylene (gray plastic) supply pipe, common in homes from about 1978 to 1995", note: "Many insurers ask about it.", when: (p) => p.era === "1978-1999" || p.era === "unknown" },
      { id: "i-galv", text: "Galvanized steel or lead supply pipes and the service line", when: oldHome, src: "leadWater" },
      { id: "i-lead-solder", text: "Ask about lead in pipes or solder (common before 1986) and test the water if unsure", when: pre1986, src: "leadWater" },
      { id: "i-sewer", text: "Book a sewer-line camera scope", note: "Tree roots and broken clay or cast-iron lines are costly and not part of a standard inspection.", when: (p) => !p.septic && (oldHome(p) || p.era === "unknown") },
      { id: "i-well", text: "Well: water test (bacteria, nitrates), pump and pressure tank", when: (p) => p.well, src: "wells" },
      { id: "i-septic", text: "Septic: separate inspection, tank pumping records, drain field soggy spots", when: (p) => p.septic, src: "septic" },
      ...freezeHouse.slice(0, 2),
    ],
  },
  {
    id: "electrical",
    title: "Electrical",
    items: [
      { id: "i-panel", text: "Panel: capacity, labeling, signs of overheating or corrosion" },
      { id: "i-gfci", text: "GFCI protection near water: kitchen, bathrooms, garage, exterior" },
      { id: "i-outlets", text: "Outlets grounded and working; no warm switches or flickering" },
      { id: "i-alu", text: "Aluminum branch wiring (used in some homes from the mid-1960s to the mid-1970s)", when: (p) => p.era === "1950-1977" || p.era === "unknown", src: "aluminum" },
      { id: "i-kt", text: "Knob-and-tube wiring", note: "Some insurers won't cover it.", when: (p) => p.era === "pre1950" || p.era === "unknown" },
    ],
  },
  {
    id: "hvac",
    title: "Heating and Cooling",
    items: [
      { id: "i-hvac-age", text: "Furnace / heat pump and AC: age, last service, filter condition" },
      { id: "i-hvac-run", text: "Heat and cooling both reach every room" },
      { id: "i-ducts", text: "Ducts: disconnected runs, rust, signs of mold" },
      { id: "i-co", text: "Gas appliances vent properly and CO alarms are present", src: "co" },
      ...freezeHouse.slice(2),
    ],
  },
  {
    id: "interior",
    title: "Interior",
    items: [
      { id: "i-ceilings", text: "Ceiling and wall stains, fresh paint patches, cracks over doors" },
      { id: "i-floors", text: "Soft spots, sloping floors, damaged subfloor around toilets" },
      { id: "i-windows", text: "Windows open, close and lock; no fogged double panes" },
      { id: "i-doors", text: "Doors swing and latch" },
      { id: "i-kitchen", text: "Appliances run; no leaks under the dishwasher" },
      { id: "i-bath", text: "Bathroom fans vent outside; caulk and grout intact" },
      { id: "i-smoke", text: "Smoke alarms in bedrooms, hallways and on each level", src: "smoke" },
      { id: "i-asbestos", text: "Suspect asbestos materials in old insulation, tiles or ductwork; don't disturb them", when: oldHome, src: "asbestos" },
      { id: "i-leadpaint", text: "Peeling or chipping paint (built before 1978: may contain lead)", when: pre1978OrUnsure, src: "lead" },
    ],
  },
  {
    id: "condo",
    title: "Condo-Specific",
    when: (p) => p.propertyType === "condo",
    items: [
      { id: "i-condo-hoa", text: "Ask which systems the HOA maintains (roof, exterior, plumbing risers) and what the unit owner covers" },
      { id: "i-condo-leaks", text: "Look for water stains from units above and around windows" },
      { id: "i-condo-reserve", text: "Read the HOA reserve study and recent minutes for planned major repairs" },
    ],
  },
  {
    id: "addons",
    title: "Add-On Tests",
    items: [
      { id: "i-radon", text: "Radon test", note: "EPA recommends testing all homes below the third floor.", src: "radon" },
      { id: "i-wdi", text: "Termite / wood-destroying insect inspection" },
      { id: "i-pool", text: "Pool and equipment inspection", when: (p) => p.pool },
      { id: "i-mold", text: "Mold evaluation if the inspector finds active moisture" },
    ],
  },
  {
    id: "after",
    title: "After the Report",
    items: [
      { id: "i-sort", text: "Sort findings into safety, major systems, and cosmetic" },
      { id: "i-quotes", text: "Get contractor quotes for the big items before you negotiate" },
      { id: "i-ask", text: "Ask the seller for repairs or a credit in writing before your contingency deadline" },
    ],
  },
];

// ---- 6. Final walkthrough -------------------------------------------------------------------------
const FINAL_WALKTHROUGH: Section[] = [
  {
    id: "bring",
    title: "Bring with You",
    items: [
      { id: "f-contract", text: "The purchase contract and the list of included items" },
      { id: "f-repairs-list", text: "The signed repair agreement", when: (p) => p.repairs },
      { id: "f-charger", text: "A phone charger or small lamp to test outlets, and your phone for photos" },
    ],
  },
  {
    id: "repairs",
    title: "Agreed Repairs",
    when: (p) => p.repairs,
    items: [
      { id: "f-done", text: "Each agreed repair is finished" },
      { id: "f-receipts", text: "Receipts, permits and any transferable warranties for the repair work" },
    ],
  },
  {
    id: "new",
    title: "New Construction",
    when: isNew,
    items: [
      { id: "f-punch", text: "Every punch-list item is fixed" },
      { id: "f-co", text: "Certificate of occupancy or final inspection is issued" },
      { id: "f-warranty", text: "Builder warranty documents and who to call for claims" },
      { id: "f-grade", text: "Final grading slopes away from the house; landscaping and driveway match the contract" },
      { id: "f-meters", text: "Utility meters are installed and accounts set up" },
    ],
  },
  {
    id: "rooms",
    title: "Room by Room",
    items: [
      { id: "f-damage", text: "No new damage to walls, floors or doors from the move-out", when: (p) => p.sellerOut || !isNew(p) },
      { id: "f-included", text: "Included items are still there: appliances, fixtures, window coverings, mounted items" },
      { id: "f-empty", text: "Seller's belongings, trash and paint cans are gone", when: (p) => p.sellerOut && !isNew(p) },
      { id: "f-occupied", text: "Agree in writing when the seller will be out and what condition they'll leave it in", when: (p) => !p.sellerOut && !isNew(p) },
      { id: "f-windows", text: "Windows and doors open, close and lock" },
      { id: "f-stains", text: "No new water stains on ceilings or under sinks" },
      { id: "f-pests", text: "No signs of pests in cabinets or closets that were hidden by furniture" },
    ],
  },
  {
    id: "systems",
    title: "Systems and Appliances",
    items: [
      { id: "f-faucets", text: "Run every faucet and shower; flush every toilet" },
      { id: "f-hvac", text: "Heat and AC both turn on and blow the right temperature" },
      { id: "f-wh", text: "Hot water reaches the far bathroom" },
      { id: "f-appliances", text: "Run the dishwasher, washer, dryer, oven, burners and disposal" },
      { id: "f-lights", text: "Lights, ceiling fans and outlets work" },
      { id: "f-garage", text: "Garage door opener and its safety reverse work", when: (p) => p.propertyType !== "condo" },
      { id: "f-alarms", text: "Smoke and CO alarms are present and test", src: "smoke" },
      { id: "f-pool", text: "Pool equipment runs and the water is clear", when: (p) => p.pool },
      { id: "f-well", text: "Well pump runs and you have the latest water test", when: (p) => p.well, src: "wells" },
      { id: "f-septic", text: "You have the septic inspection and pumping records", when: (p) => p.septic, src: "septic" },
    ],
  },
  {
    id: "handover",
    title: "Handover",
    items: [
      { id: "f-keys", text: "Keys, mailbox key, garage remotes, gate and alarm codes" },
      { id: "f-manuals", text: "Appliance manuals and warranty paperwork" },
      { id: "f-problem", text: "If something is wrong, tell your agent before you sign: ask for a repair, a credit, money held in escrow, or a delayed closing" },
    ],
  },
];

// ---- 7. Move-in / move-out condition report ---------------------------------------------------------
// Rendered as a table (item × move-in condition × move-out condition), one block per room.
export interface Room { id: string; title: string; items: string[] }

const ROOM_BASE = ["Walls and paint", "Ceiling", "Floor / carpet", "Windows, screens and blinds", "Doors, locks and handles", "Lights and switches", "Outlets", "Closet / storage"];

export function roomsFor(p: Profile): Room[] {
  const rooms: Room[] = [
    { id: "entry", title: "Entry and Hallways", items: ["Front door, lock and deadbolt", "Walls and paint", "Floor", "Lights and switches", "Smoke alarm (test it)", "Carbon monoxide alarm (if present)"] },
    { id: "living", title: "Living Room", items: ROOM_BASE },
    {
      id: "kitchen",
      title: "Kitchen",
      items: ["Walls, ceiling and floor", "Cabinets and drawers", "Countertops", "Sink, faucet and drain (look underneath)", "Refrigerator and freezer (inside and seals)", "Stove / oven, burners and hood fan", "Microwave", ...(p.dishwasher ? ["Dishwasher (run it)"] : []), "Garbage disposal", "Lights and outlets"],
    },
  ];
  if (p.bedrooms === 0) rooms[1] = { id: "living", title: "Main Room (Studio)", items: ROOM_BASE };
  for (let i = 1; i <= p.bedrooms; i++) rooms.push({ id: `bed${i}`, title: `Bedroom ${i}`, items: [...ROOM_BASE, "Smoke alarm (test it)"] });
  for (let i = 1; i <= p.bathrooms; i++) {
    rooms.push({ id: `bath${i}`, title: `Bathroom ${i}`, items: ["Walls, ceiling and floor", "Toilet (flush, base, seat)", "Sink, faucet and drain", "Tub / shower, tile and caulk", "Mirror and medicine cabinet", "Exhaust fan", "Towel bars and fixtures", "Signs of mold or leaks"] });
  }
  if (p.laundry) rooms.push({ id: "laundry", title: "Laundry", items: ["Washer (run a cycle)", "Dryer and vent", "Floor and hookups"] });
  if (p.balcony) rooms.push({ id: "balcony", title: "Balcony / Patio", items: ["Surface", "Railings", "Door and lock"] });
  if (p.garage) rooms.push({ id: "garage", title: "Garage", items: ["Door and opener (test safety reverse)", "Floor", "Walls", "Remotes provided"] });
  const house = p.propertyType === "single-family";
  if (house) rooms.push({ id: "exterior", title: "Exterior", items: ["Siding and trim", "Gutters", "Driveway and walkways", "Exterior lights", "Outdoor faucets"] });
  if (p.yard) rooms.push({ id: "yard", title: "Yard", items: ["Lawn and landscaping", "Fence and gates", "Trees and shrubs"] });
  rooms.push({ id: "systems", title: "Systems", items: ["Heating (turn it on)", "Air conditioning (turn it on)", "Water heater (hot water at every tap)", "Thermostat", ...(house ? ["Breaker panel accessible", "Water shutoff located"] : []), "Number of keys / fobs / remotes received"] });
  if (p.furnished) rooms.push({ id: "furnishings", title: "Furnishings", items: ["Sofa and chairs", "Tables", "Beds and mattresses", "Dressers", "Lamps", "Kitchenware and small appliances", "Linens"] });
  return rooms;
}

export const MOVE_IN_TIPS: Item[] = [
  { id: "m-photos", text: "Take date-stamped photos or video of every item, especially existing damage" },
  { id: "m-sign", text: "Both tenant and landlord sign and date the report; each keeps a copy" },
  { id: "m-deposit", text: "At move-out, the same form is the record for deposit deductions; your state sets the return deadline", src: "tenantRights" },
  { id: "m-landlord", text: "Landlord: return the deposit with an itemized list of deductions", when: (p) => p.role === "landlord", src: "tenantRights" },
  { id: "m-tenant", text: "Tenant: send the landlord your forwarding address in writing at move-out", when: (p) => p.role === "tenant" },
  { id: "m-freeze", text: "Note the heat setting and where the water shutoff is", when: (p) => p.freeze && p.propertyType === "single-family", src: "winter" },
];

// ---- 8. First apartment (shopping list + budget) -----------------------------------------------------
export interface BuyItem extends Item { dayOne: boolean }
export interface BuySection { id: string; title: string; when?: (p: Profile) => boolean; items: BuyItem[] }

const unfurnished = (p: Profile) => !p.furnished;
export const FIRST_APARTMENT: BuySection[] = [
  {
    id: "money",
    title: "Move-In Money",
    items: [
      { id: "a-deposit", text: "Security deposit", dayOne: true },
      { id: "a-first", text: "First month's rent", dayOne: true },
      { id: "a-fees", text: "Application and move-in fees", dayOne: true },
      { id: "a-pet", text: "Pet deposit or fee", dayOne: true, when: (p) => p.pets },
      { id: "a-renters", text: "Renters insurance (first payment)", dayOne: true },
      { id: "a-utils", text: "Utility and internet setup deposits or fees", dayOne: true },
      { id: "a-movers", text: "Moving truck or movers", dayOne: true },
    ],
  },
  {
    id: "bedroom",
    title: "Bedroom",
    when: unfurnished,
    items: [
      { id: "a-bed", text: "Bed frame and mattress", dayOne: true },
      { id: "a-sheets", text: "Sheets, pillows and a blanket", dayOne: true },
      { id: "a-hangers", text: "Hangers", dayOne: true },
      { id: "a-dresser", text: "Dresser or storage", dayOne: false },
      { id: "a-lamp", text: "Bedside lamp", dayOne: false },
      { id: "a-curtains", text: "Curtains or blinds", dayOne: true },
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen",
    items: [
      { id: "a-pans", text: "One pot and one pan", dayOne: true },
      { id: "a-dishes", text: "Plates, bowls, cups and utensils", dayOne: true, when: (p) => !p.furnished },
      { id: "a-knife", text: "Knife and cutting board", dayOne: true },
      { id: "a-trash", text: "Trash can and bags", dayOne: true },
      { id: "a-sponge", text: "Dish soap, sponge, towels", dayOne: true },
      { id: "a-food", text: "Basic groceries and pantry staples", dayOne: true },
      { id: "a-storage", text: "Food storage containers", dayOne: false },
      { id: "a-small", text: "Small appliances (coffee maker, toaster, microwave if none)", dayOne: false },
      { id: "a-shared-kitchen", text: "Agree with roommates on who brings which kitchen items", dayOne: true, when: (p) => p.roommates },
    ],
  },
  {
    id: "bath",
    title: "Bathroom",
    items: [
      { id: "a-tp", text: "Toilet paper", dayOne: true },
      { id: "a-towels", text: "Bath towels", dayOne: true },
      { id: "a-curtain", text: "Shower curtain and liner (if no glass door)", dayOne: true },
      { id: "a-plunger", text: "Plunger", dayOne: true },
      { id: "a-mat", text: "Bath mat", dayOne: false },
    ],
  },
  {
    id: "living",
    title: "Living Area",
    when: unfurnished,
    items: [
      { id: "a-seat", text: "Somewhere to sit", dayOne: false },
      { id: "a-table", text: "Table or desk", dayOne: false },
      { id: "a-light", text: "Floor lamp (many apartments have no living-room ceiling light)", dayOne: false },
      { id: "a-tv", text: "TV or entertainment", dayOne: false },
    ],
  },
  {
    id: "cleaning",
    title: "Cleaning and Laundry",
    items: [
      { id: "a-cleaner", text: "All-purpose cleaner and paper towels", dayOne: true },
      { id: "a-broom", text: "Broom, dustpan or vacuum", dayOne: false },
      { id: "a-hamper", text: "Laundry basket and detergent", dayOne: true },
      { id: "a-quarters", text: "Laundry card or quarters for shared machines", dayOne: true, when: (p) => !p.laundry },
    ],
  },
  {
    id: "safety",
    title: "Safety and Tools",
    items: [
      { id: "a-kit", text: "First-aid kit", dayOne: true },
      { id: "a-ext", text: "Small fire extinguisher for the kitchen", dayOne: false },
      { id: "a-flash", text: "Flashlight", dayOne: true },
      { id: "a-tools", text: "Screwdriver, hammer, tape measure", dayOne: false },
      { id: "a-strip", text: "Extension cord / power strip", dayOne: true },
    ],
  },
  {
    id: "pet",
    title: "Pet",
    when: (p) => p.pets,
    items: [
      { id: "a-pet-bowl", text: "Food, bowls and bed", dayOne: true },
      { id: "a-pet-crate", text: "Crate, litter box or puppy pads", dayOne: true },
    ],
  },
];

// ---- Readable conditions (for the server-rendered full list on each page) ------------------------
// Mirrors each `when` rule above in words. Keep in step when a rule changes.
export const ONLY: Record<string, string> = {
  "frz-pipes": "Freezing winters",
  "frz-shutoff": "Freezing winters",
  "frz-heat": "Freezing winters",
  "hur-roof": "Hurricane-prone coast",
  "hur-wind": "Hurricane-prone coast",
  "wf-zone": "Wildfire area",
  "wf-ins": "Wildfire area",
  "eq-strap": "Earthquake area",
  "eq-ins": "Earthquake area",
  "b-programs": "First-time buyer with a mortgage",
  "b-cash": "Paying cash",
  "b-fha": "FHA loan",
  "b-va": "VA loan",
  "b-usda": "USDA loan",
  "b-condo-approval": "Condo with an FHA or VA loan",
  "b-hoa": "Condo or townhouse",
  "b-mh": "Manufactured home",
  "b-builder": "New Construction",
  "b-multi": "Duplex or 2-4 units",
  "b-contingencies": "Buying with a mortgage",
  "b-contingencies-cash": "Paying cash",
  "b-lead": "Built before 1978 (or not sure)",
  "b-hoa-docs": "Condo or townhouse",
  "b-sewer": "Built before 1978 (or not sure), on city sewer",
  "b-well": "Private well",
  "b-septic": "Septic system",
  "b-pool": "Pool",
  "b-appraisal": "Buying with a mortgage",
  "b-mpr": "FHA or VA loan",
  "b-cd": "Buying with a mortgage",
  "s-payoff": "Mortgage still owed",
  "s-tax": "Your own home",
  "s-tax-rental": "Tenant-occupied rental",
  "s-agents": "Selling with an agent",
  "s-fsbo-plan": "For sale by owner",
  "s-declutter": "You live there",
  "s-septic": "Septic system",
  "s-pool": "Pool",
  "s-curb": "House, townhouse, duplex or manufactured home",
  "s-vacant-ins": "Vacant",
  "s-vacant-frz": "Vacant, freezing winters",
  "s-wf": "Wildfire area",
  "s-hur": "Hurricane-prone coast",
  "s-lead": "Built before 1978 (or not sure)",
  "s-hoa": "Condo or townhouse",
  "s-lease": "Tenant-occupied",
  "s-secure": "You live there",
  "s-tenant-notice": "Tenant-occupied",
  "s-fsbo-show": "For sale by owner",
  "s-fsbo-contract": "For sale by owner",
  "s-clean": "You live there or it's vacant",
  "r-owner": "Small landlord, condo, house or room",
  "r-reviews": "Large building or complex",
  "r-noise": "Apartment, condo or room",
  "r-parking": "Need parking",
  "r-trash": "Apartment, condo or room",
  "r-house-yard": "Whole house",
  "r-house-garage": "Whole house",
  "r-room-shared": "Room in a shared home",
  "r-room-who": "Room in a shared home",
  "r-lead": "Built before 1978 (or not sure)",
  "r-q-pet": "Bringing a pet",
  "r-q-house": "Whole house",
  "r-q-freeze": "Freezing winters, not a large complex",
  "r-q-storm": "Hurricane-prone coast, not a large complex",
  "r-l-pets": "Bringing a pet",
  "r-l-house": "Whole house",
  "r-m-utils": "Not a large complex",
  "r-m-mail": "Large building or complex",
  "r-m-shutoff": "Not a large complex, or freezing winters",
  "r-m-wildfire": "Wildfire area",
  "r-m-quake": "Earthquake area",
  "r-m-hur": "Hurricane-prone coast",
  "l-mortgage": "Mortgage on the property",
  "l-hoa": "Condo or townhouse",
  "l-str": "Furnished / short or mid-term",
  "l-pm": "Property manager",
  "l-lead": "Built before 1978 (or not sure)",
  "l-pool": "Pool",
  "l-furnish": "Furnished / short or mid-term",
  "l-multi": "Duplex / small multifamily",
  "l-hur": "Hurricane-prone coast",
  "l-wf": "Wildfire area",
  "l-eq": "Earthquake area",
  "l-assist": "Not a room in your own home",
  "l-utilities": "Single-family house",
  "l-room": "Room or ADU",
  "l-gutters": "Not a condo",
  "l-winter": "Freezing winters",
  "i-wildfire": "Wildfire area",
  "i-basement": "Basement (or not sure)",
  "i-crawl": "Crawlspace (or not sure)",
  "i-slab": "Slab",
  "i-bolt": "Earthquake area, built before 1978",
  "i-mh": "Manufactured home",
  "i-pb": "Built 1978 to 1999 (or not sure)",
  "i-galv": "Built before 1978",
  "i-lead-solder": "Built before 2000 (or not sure)",
  "i-sewer": "City sewer, built before 1978 (or not sure)",
  "i-well": "Private well",
  "i-septic": "Septic system",
  "i-alu": "Built 1950 to 1977 (or not sure)",
  "i-kt": "Built before 1950 (or not sure)",
  "i-asbestos": "Built before 1978",
  "i-leadpaint": "Built before 1978 (or not sure)",
  "i-pool": "Pool",
  "f-repairs-list": "Seller agreed to repairs",
  "f-damage": "Seller moved out, or a resale home",
  "f-empty": "Resale, seller moved out",
  "f-occupied": "Resale, seller still living there",
  "f-garage": "Not a condo",
  "f-pool": "Pool",
  "f-well": "Private well",
  "f-septic": "Septic system",
  "m-landlord": "Landlord",
  "m-tenant": "Tenant",
  "m-freeze": "House, freezing winters",
  "a-pet": "Bringing a pet",
  "a-dishes": "Unfurnished",
  "a-shared-kitchen": "Roommates",
  "a-quarters": "No in-unit laundry"
  };
export const SECTION_ONLY: Record<string, string> = {"loan": "Buying with a mortgage", "structure": "Not a condo", "exterior": "Not a condo", "attic": "Not a condo", "condo": "Condo", "repairs": "Seller agreed to repairs", "new": "New Construction", "bedroom": "Unfurnished", "living": "Unfurnished", "pet": "Bringing a pet"};

// ---- Registry --------------------------------------------------------------------------------------
export const SECTIONS: Partial<Record<ChecklistId, Section[]>> = {
  "home-buying": HOME_BUYING,
  "home-selling": HOME_SELLING,
  renting: RENTING,
  landlord: LANDLORD,
  "home-inspection": HOME_INSPECTION,
  "final-walkthrough": FINAL_WALKTHROUGH,
};

/** Apply the rules: returns only sections/items whose conditions match. */
export function buildChecklist(id: ChecklistId, p: Profile): Section[] {
  const secs = SECTIONS[id] ?? [];
  return secs
    .filter((s) => !s.when || s.when(p))
    .map((s) => ({ ...s, items: s.items.filter((it) => !it.when || it.when(p)) }))
    .filter((s) => s.items.length > 0);
}

export function buildShopping(p: Profile): BuySection[] {
  return FIRST_APARTMENT.filter((s) => !s.when || s.when(p))
    .map((s) => ({ ...s, items: s.items.filter((it) => !it.when || it.when(p)) }))
    .filter((s) => s.items.length > 0);
}

/** Total applicable items vs. the full library, used by the page's "how it works" figures. */
export function countItems(id: ChecklistId, p: Profile): number {
  if (id === "move-in-move-out") return roomsFor(p).reduce((n, r) => n + r.items.length, 0);
  if (id === "first-apartment") return buildShopping(p).reduce((n, s) => n + s.items.length, 0);
  return buildChecklist(id, p).reduce((n, s) => n + s.items.length, 0);
}
