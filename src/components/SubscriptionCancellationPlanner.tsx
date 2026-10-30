import { useState } from "react";
import "./SubscriptionCancellationPlanner.css";

type Service = "unknown" | "gym" | "att-wireless" | "att-internet" | "adt-blue" | "netflix" | "streaming" | "other";
type Biller = "unknown" | "provider" | "apple" | "google-play" | "roku" | "partner";
type Place = "unknown" | "CA" | "CO" | "ME" | "NY" | "NYC";
type Outcome = "not-tried" | "blocked" | "waiting" | "charged";

type Props = { heading?: string; subheading?: string };
type Route = { label: string; url: string; note: string };

const URLS = {
  eighthCircuit: "https://ecf.ca8.uscourts.gov/opndir/25/07/243137P.pdf",
  ftcRule: "https://www.ftc.gov/legal-library/browse/rules/negative-option-rule",
  rosCa: "https://www.govinfo.gov/link/uscode/15/8403",
  ftcAdvice: "https://consumer.ftc.gov/articles/getting-and-out-free-trials-auto-renewals-and-negative-option-subscriptions",
  ftcReport: "https://reportfraud.ftc.gov/",
  fcc: "https://consumercomplaints.fcc.gov/hc/en-us",
  nyc: "https://www.nyc.gov/main/click-to-cancel",
  apple: "https://support.apple.com/en-us/118428",
  google: "https://support.google.com/googleplay/answer/7018481",
  roku: "https://support.roku.com/article/manage-or-cancel-subscriptions",
  netflix: "https://help.netflix.com/en/node/407",
  attWireless: "https://www.att.com/support/article/wireless/KM1008472/",
  attInternet: "https://www.att.com/support/article/my-account/KM1009500/",
  adt: "https://help.adt.com/article/blu-account-creation-faqs",
  crunch: "https://www.crunch.com/faq",
  california: "https://www.oag.ca.gov/news/press-releases/attorney-general-bonta-issues-consumer-alert-california%E2%80%99s-automatic-renewal-law",
  colorado: "https://www.leg.colorado.gov/bills/sb25-145",
  maine: "https://legislature.maine.gov/statutes/10/title10sec1210-C.html",
  ny527: "https://www.nysenate.gov/legislation/laws/GBS/527-A",
  ny624: "https://www.nysenate.gov/legislation/laws/GBS/624",
  nycRule: "https://www.nyc.gov/content/dam/nycgov/nyc-main/pdf/2026/Click-to-Cancel-Rule.pdf",
};

const SERVICES: Record<Service, string> = {
  unknown: "Choose a service",
  gym: "Gym or health club",
  "att-wireless": "AT&T wireless",
  "att-internet": "AT&T internet",
  "adt-blue": "Blue by ADT monitoring",
  netflix: "Netflix",
  streaming: "Another streaming service",
  other: "Another service or unsure",
};

const OUTCOMES: Record<Outcome, string> = {
  "not-tried": "I have not tried to cancel",
  blocked: "I was blocked or sent in circles",
  waiting: "I asked, but have no confirmation",
  charged: "I was charged after asking to cancel",
};
const BILLER_LABELS: Record<Biller, string> = {
  unknown: "I am not sure",
  provider: "The service provider",
  apple: "Apple",
  "google-play": "Google Play",
  roku: "Roku",
  partner: "A partner or another company",
};
const PLACE_LABELS: Record<Place, string> = {
  unknown: "Other or not sure",
  CA: "California",
  CO: "Colorado",
  ME: "Maine",
  NY: "New York State outside NYC",
  NYC: "New York City",
};

function providerRoute(service: Service, biller: Biller): Route | undefined {
  if (biller === "apple") return { label: "Apple subscription instructions", url: URLS.apple, note: "Use this only when Apple is the company billing you." };
  if (biller === "google-play") return { label: "Google Play cancellation instructions", url: URLS.google, note: "Use this only when Google Play is the company billing you; deleting an app does not cancel it." };
  if (biller === "roku") return { label: "Roku subscription instructions", url: URLS.roku, note: "Use this only when Roku is the company billing you." };
  if (service === "att-wireless") return { label: "AT&T wireless cancellation help", url: URLS.attWireless, note: "AT&T publishes a separate route for wireless service. Account ownership and any device steps can matter." };
  if (service === "att-internet") return { label: "AT&T internet cancellation help", url: URLS.attInternet, note: "AT&T publishes a separate route for internet service, including equipment-return steps." };
  if (service === "adt-blue") return { label: "Blue by ADT help", url: URLS.adt, note: "This page is for Blue by ADT. Deleting its app account does not itself cancel monitoring; product and contract terms determine cancellation." };
  if (service === "netflix") return { label: "Netflix billing and cancellation help", url: URLS.netflix, note: "Netflix distinguishes direct billing from partner billing. Use the partner's route if that partner bills you." };
  if (service === "gym") return { label: "Crunch FAQ (one gym example)", url: URLS.crunch, note: "Crunch is one example only. Clubs and franchises vary; your club's membership terms determine its cancellation route." };
  if (biller === "partner") return service === "netflix" ? { label: "Netflix billing and cancellation help", url: URLS.netflix, note: "Netflix distinguishes direct billing from partner billing. Use the partner's official route if it bills you." } : undefined;
  return undefined;
}

function jurisdictionNote(place: Place, service: Service): { text: string; links: Route[] } {
  switch (place) {
    case "CA": return { text: "California's automatic-renewal amendments took effect July 1, 2025. Covered offers have consent and cancellation requirements, including online cancellation where covered enrollment was online. Coverage and exceptions depend on the offer.", links: [{ label: "California Attorney General consumer alert", url: URLS.california, note: "" }] };
    case "CO": return { text: "Colorado SB 25-145 sets channel-specific cancellation requirements for covered offers and renewals beginning February 16, 2026. Applicability depends on how and when the contract was offered or renewed.", links: [{ label: "Colorado SB 25-145", url: URLS.colorado, note: "" }] };
    case "ME": return { text: "Maine's law covers listed automatic renewals for online media players, mobile apps, online software and health-club memberships. Covered sellers must accept cancellation using the same method and manner as signup; definitions and exclusions control.", links: [{ label: "Maine 10 M.R.S. § 1210-C", url: URLS.maine, note: "" }] };
    case "NY": {
      const alarmNote = service === "adt-blue" ? " That exemption may apply to an alarm-monitoring provider, so do not assume this rule covers your ADT contract." : "";
      const clubNote = service === "gym" ? " GBL § 624 gives health-club members cancellation rights in specific circumstances, including a three-business-day right in covered contracts; it is not an unlimited right to cancel at any time." : "";
      return { text: `New York GBL § 527-a has cancellation rules for covered renewal offers and exempts licensed security-system alarm operators and some other businesses.${alarmNote}${clubNote}`, links: [{ label: "New York GBL § 527-a", url: URLS.ny527, note: "" }, ...(service === "gym" ? [{ label: "New York GBL § 624", url: URLS.ny624, note: "" }] : [])] };
    }
    case "NYC": {
      const alarmNote = service === "adt-blue" ? "; the state renewal law also exempts licensed security-system alarm operators, and contract terms determine the cancellation process" : "";
      const clubNote = service === "gym" ? " New York's health-club law also gives cancellation rights in specific circumstances, including a three-business-day right in covered contracts." : "";
      const links: Route[] = [
        { label: "NYC Click-to-Cancel rule", url: URLS.nycRule, note: "" },
        { label: "NYC DCWP summary and complaint route", url: URLS.nyc, note: "A complaint does not guarantee an individual resolution." },
        ...(service === "gym" ? [{ label: "New York GBL § 624", url: URLS.ny624, note: "" }] : []),
        ...(service === "adt-blue" ? [{ label: "New York GBL § 527-a", url: URLS.ny527, note: "" }] : []),
      ];
      return { text: `NYC's Click-to-Cancel rule took effect October 1, 2026. It requires same-medium cancellation for covered offers and bars obstruction or unreasonable delay. Licensed alarm operators and other listed categories are exempt${alarmNote}.${clubNote}`, links };
    }
    default: return { text: "No state or city example is selected. The laws above are selected examples, not a 50-state survey. Coverage depends on location, offer date and the specific law.", links: [] };
  }
}

function nextAction(outcome: Outcome, service: Service, biller: Biller): string {
  const route = providerRoute(service, biller);
  const first = route ? `Open the route above${biller === "unknown" ? " when that company is the one billing you" : ""}.` : "A recent statement, receipt or account page usually identifies the company that bills you; use that company's cancellation route.";
  if (outcome === "blocked") return `Save a screenshot or note of the barrier. ${first} Then send the written request below and ask for the effective date and confirmation.`;
  if (outcome === "waiting") return `Follow up with the biller in writing. ${first} Ask whether cancellation is recorded, the effective date, any final balance and whether equipment must be returned.`;
  if (outcome === "charged") return `Match the charge to the company on your statement and send that biller your dated cancellation request and proof. ${first} If the biller does not address it, use only an escalation link that fits the service and location.`;
  return `${first} Send a dated request and keep the confirmation, effective date, any final balance and equipment-return instructions.`;
}

function cancellationScript(service: Service): string {
  const name = service === "unknown" || service === "other" ? "[service]" : SERVICES[service];
  return `I am canceling my ${name} under account [account number], effective [requested date]. Please confirm in writing the cancellation, its effective date, any final balance, and whether I need to return equipment.`;
}

export default function SubscriptionCancellationPlanner({ heading, subheading }: Props) {
  const [service, setService] = useState<Service>("unknown");
  const [biller, setBiller] = useState<Biller>("unknown");
  const [place, setPlace] = useState<Place>("unknown");
  const [outcome, setOutcome] = useState<Outcome>("not-tried");
  const [copyMessage, setCopyMessage] = useState("");

  const route = providerRoute(service, biller);
  const law = jurisdictionNote(place, service);
  const action = nextAction(outcome, service, biller);
  const script = cancellationScript(service);
  const savedPlan = `Cancellation plan\nService: ${SERVICES[service]}\nBiller/signup path: ${BILLER_LABELS[biller]}\nLocation: ${PLACE_LABELS[place]}\nWhat happened: ${OUTCOMES[outcome]}\n\nNext step: ${action}\n\nScript:\n${script}`;
  const escalations = [
    ...(service === "att-wireless" || service === "att-internet" ? [{ label: "FCC communications complaint portal", url: URLS.fcc, note: "For communications-service issues within FCC scope; jurisdiction varies." }] : []),
    { label: "FTC ReportFraud", url: URLS.ftcReport, note: "For suspected deceptive or unfair business practices. A report does not decide a private contract or guarantee a refund." },
    ...(place === "NYC" ? [{ label: "NYC DCWP Click-to-Cancel", url: URLS.nyc, note: "NYC's consumer summary and complaint route; a complaint does not guarantee an individual resolution." }] : []),
  ];

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(savedPlan);
      setCopyMessage("Plan copied. Add your account details only in your own message to the biller.");
    } catch {
      const field = document.createElement("textarea");
      field.value = savedPlan;
      field.setAttribute("readonly", "");
      field.className = "scp-copy-fallback";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      setCopyMessage(copied ? "Plan copied. Add your account details only in your own message to the biller." : "Copy was blocked by your browser. Select the script text and copy it manually.");
    }
  }

  return (
    <div className="scp">
      <header className="scp-heading">
        <h2>{heading ?? "Build Your Cancellation Plan"}</h2>
        <p>{subheading ?? "Choose the service, who bills you, your state or city, and what happened when you tried to cancel."}</p>
      </header>

      <div className="scp-fields">
        <div className="scp-field">
          <label htmlFor="scp-service">What service are you canceling?</label>
          <select id="scp-service" value={service} onChange={(e) => setService(e.target.value as Service)}>
            {Object.entries(SERVICES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="scp-field">
          <label htmlFor="scp-biller">Who bills you or handled signup?</label>
          <select id="scp-biller" value={biller} onChange={(e) => setBiller(e.target.value as Biller)}>
            <option value="unknown">I am not sure</option>
            <option value="provider">The service provider</option>
            <option value="apple">Apple</option>
            <option value="google-play">Google Play</option>
            <option value="roku">Roku</option>
            <option value="partner">A partner or another company</option>
          </select>
        </div>
        <div className="scp-field">
          <label htmlFor="scp-place">Where do you live?</label>
          <select id="scp-place" value={place} onChange={(e) => setPlace(e.target.value as Place)}>
            <option value="unknown">Other or not sure</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="ME">Maine</option>
            <option value="NY">New York State outside NYC</option>
            <option value="NYC">New York City</option>
          </select>
        </div>
        <div className="scp-field">
          <label htmlFor="scp-outcome">What happened when you tried?</label>
          <select id="scp-outcome" value={outcome} onChange={(e) => setOutcome(e.target.value as Outcome)}>
            {Object.entries(OUTCOMES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>

      <section className="scp-result" aria-labelledby="scp-next-step">
        <h3 id="scp-next-step">Your Next Step</h3>
        <p aria-live="polite">{action}</p>
        {route && <p className="scp-route"><a href={route.url} target="_blank" rel="noopener noreferrer">{route.label} ↗</a><span>{route.note}</span></p>}
        {!route && service === "gym" && biller === "unknown" && <p className="scp-route"><a href={URLS.crunch} target="_blank" rel="noopener noreferrer">Crunch FAQ (one gym example) ↗</a><span>Club policies vary. The biller and home-club terms determine the cancellation route.</span></p>}
        <div className="scp-legal-note">
          <h4>Federal baseline</h4>
          <p>For covered internet transactions with a negative-option feature, ROSCA requires material-term disclosure, express informed consent and a simple way to stop recurring charges. It does not promise one-click cancellation for every subscription. <a href={URLS.rosCa} target="_blank" rel="noopener noreferrer">Read 15 U.S.C. § 8403 ↗</a></p>
          <p>The FTC's 2024 rule amendments were vacated on procedural grounds; that did not abolish the entire federal framework. Its March 2026 advance notice is not binding law. <a href={URLS.eighthCircuit} target="_blank" rel="noopener noreferrer">Read the Eighth Circuit opinion ↗</a> · <a href={URLS.ftcRule} target="_blank" rel="noopener noreferrer">FTC rule status ↗</a> · <a href={URLS.ftcAdvice} target="_blank" rel="noopener noreferrer">FTC subscription advice ↗</a></p>
        </div>
        <div className="scp-legal-note">
          <h4>{place === "NYC" ? "New York City example" : place === "unknown" ? "Selected state and city examples" : `${place === "NY" ? "New York State" : place} example`}</h4>
          <p>{law.text} This is a pointer to selected law, not a decision that your contract is covered.</p>
          {law.links.map((link) => <p className="scp-link" key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>{link.note && <span>{link.note}</span>}</p>)}
        </div>
        <div className="scp-script">
          <h4>Copy and edit this request</h4>
          <p>{script}</p>
        </div>
        <div className="scp-bottom-grid">
          <div>
            <h4>Keep proof</h4>
            <ul>
              <li>Save the dated request, screenshot, email or chat transcript.</li>
              <li>Write down call dates, the representative's name and any confirmation number.</li>
              <li>Keep the stated effective date, final balance and equipment-return receipt.</li>
            </ul>
          </div>
          <div>
            <h4>If charges continue</h4>
            <ul>{escalations.map((item) => <li key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer">{item.label} ↗</a> — {item.note}</li>)}</ul>
          </div>
        </div>
        <button className="scp-copy" type="button" onClick={copyPlan}>Copy your plan</button>
        <p className="scp-copy-status" role="status">{copyMessage}</p>
        <p className="scp-privacy">Your selections stay in this browser tab. The planner does not ask for or send account or payment details.</p>
      </section>
    </div>
  );
}
