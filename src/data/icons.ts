// Themed "infographic" icon tiles. Each card shows a concept icon (shape varies by the specific
// tool) on a soft gradient tile tinted by the calculator's category color, with a frosted chip
// behind the icon for depth. Inline SVG — no network, no licensing, instant, zero layout shift.

export interface CalcIcon {
  svg: string; // inner SVG markup (paths only)
  bg: string; // gradient start (light)
  bg2: string; // gradient end (deeper)
  fg: string; // icon stroke color
}

// Per-category color: cohesive within a calculator, distinct across calculators.
const STYLE: Record<string, { bg: string; bg2: string; fg: string }> = {
  "auto-loan": { bg: "#ECF7F2", bg2: "#D5EEE2", fg: "#0E7C66" },
  "mortgage": { bg: "#EAF1FB", bg2: "#D6E5F7", fg: "#2F6FB0" },
  "retirement": { bg: "#FBF3E3", bg2: "#F5E4C2", fg: "#B97D16" },
  "investing": { bg: "#EEEEFB", bg2: "#DEDEF7", fg: "#5050CC" },
  "portfolio": { bg: "#F5ECFA", bg2: "#EAD9F4", fg: "#8A4FBF" },
  "real-estate": { bg: "#E7F5F6", bg2: "#D2ECEF", fg: "#1B8090" },
  "net-worth": { bg: "#E9F6EE", bg2: "#D4EEDD", fg: "#128A4E" },
};
const DEFAULT_STYLE = { bg: "#EEF4F0", bg2: "#DFEAE5", fg: "#0E7C66" };

// Concept shape library (inner markup for a 24x24 stroke svg).
const SHAPE: Record<string, string> = {
  car: `<path d="M5 11l1.6-4.6A2 2 0 0 1 8.5 5h7a2 2 0 0 1 1.9 1.4L19 11"/><rect x="3" y="11" width="18" height="6" rx="2"/><circle cx="7.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/>`,
  house: `<path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><path d="M9.5 20v-5h5v5"/>`,
  sun: `<circle cx="12" cy="12" r="3.6"/><path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18"/>`,
  trending: `<path d="M4 18h16"/><path d="M5 15l4-5 4 3 6-8"/><path d="M15.5 5H19v3.5"/>`,
  pie: `<circle cx="12" cy="12" r="8.5"/><path d="M12 12V3.5"/><path d="M12 12l7.5 4.2"/>`,
  building: `<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15"/><path d="M10 21v-3h4v3"/>`,
  scale: `<path d="M12 4v16"/><path d="M7.5 20h9"/><path d="M4.5 8h15l-4.5-2-3 1-3-1z"/><path d="M4.5 8 2.5 12.5a2.5 2.5 0 0 0 4 0z"/><path d="M19.5 8l-2 4.5a2.5 2.5 0 0 0 4 0z"/>`,
  flag: `<path d="M6 21V4"/><path d="M6 5h11l-1.6 3.2L17 11.5H6"/>`,
  plus: `<circle cx="12" cy="12" r="8.5"/><path d="M12 8.2v7.6M8.2 12h7.6"/>`,
  fast: `<path d="M4 6l7 6-7 6V6z"/><path d="M13 6l7 6-7 6V6z"/>`,
  bars: `<path d="M4 20h16"/><path d="M6.8 20v-6M11 20V8M15.2 20v-9M19 20v-4"/>`,
  percent: `<circle cx="7.5" cy="7.5" r="2.2"/><circle cx="16.5" cy="16.5" r="2.2"/><path d="M18 6 6 18"/>`,
  coins: `<ellipse cx="12" cy="7" rx="6" ry="2.6"/><path d="M6 7v5c0 1.45 2.7 2.6 6 2.6s6-1.15 6-2.6V7"/><path d="M6 12v5c0 1.45 2.7 2.6 6 2.6s6-1.15 6-2.6v-5"/>`,
  waves: `<path d="M3 8c2.5-2 5-2 7.5 0s5 2 7.5 0"/><path d="M3 13c2.5-2 5-2 7.5 0s5 2 7.5 0"/><path d="M3 18c2.5-2 5-2 7.5 0s5 2 7.5 0"/>`,
  shield: `<path d="M12 3l7.5 3.2v5.3c0 4.6-3.2 7.7-7.5 9.2-4.3-1.5-7.5-4.6-7.5-9.2V6.2z"/>`,
  wallet: `<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="13.5" r="1.3"/>`,
  calendar: `<rect x="4" y="5" width="16" height="16" rx="2.2"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4"/>`,
  target: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>`,
  drop: `<path d="M12 3.5c4 4.8 6.2 8 6.2 11A6.2 6.2 0 0 1 5.8 14.5c0-3 2.2-6.2 6.2-11z"/>`,
  list: `<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>`,
  alert: `<path d="M12 4l9 15.5H3z"/><path d="M12 10v4.5M12 17.5h.01"/>`,
};

// Category default shape (for the hub/category cards).
const CATEGORY_SHAPE: Record<string, string> = {
  "auto-loan": "car", "mortgage": "house", "retirement": "sun", "investing": "trending",
  "portfolio": "pie", "real-estate": "building", "net-worth": "scale",
};

// Per-spoke concept shape so cards within a category still look different.
const SPOKE_SHAPE: Record<string, string> = {
  "auto-loan/payoff-calculator": "flag",
  "auto-loan/extra-payment-calculator": "plus",
  "auto-loan/early-payoff-calculator": "fast",
  "auto-loan/amortization-schedule": "bars",
  "auto-loan/interest-calculator": "percent",
  "mortgage/payoff-calculator": "flag",
  "mortgage/extra-payment-calculator": "plus",
  "mortgage/amortization-schedule": "bars",
  "mortgage/early-payoff-calculator": "fast",
  "retirement/401k-early-withdrawal-calculator": "alert",
  "retirement/401k-calculator": "trending",
  "retirement/retirement-savings-calculator": "wallet",
  "retirement/rmd-calculator": "calendar",
  "investing/compound-interest-calculator": "percent",
  "investing/investment-growth-calculator": "trending",
  "investing/high-yield-savings-calculator": "wallet",
  "investing/savings-goal-calculator": "target",
  "portfolio/asset-allocation-calculator": "pie",
  "portfolio/60-40-portfolio-calculator": "bars",
  "portfolio/expected-return-calculator": "trending",
  "portfolio/portfolio-risk-calculator": "shield",
  "real-estate/cash-flow-calculator": "waves",
  "real-estate/rental-income-calculator": "coins",
  "real-estate/cap-rate-calculator": "percent",
  "real-estate/cash-on-cash-return-calculator": "trending",
  "real-estate/roi-calculator": "target",
  "net-worth/how-to-calculate-net-worth": "list",
  "net-worth/net-worth-by-age-calculator": "bars",
  "net-worth/liquid-net-worth-calculator": "drop",
};

function styleFor(calcId: string) {
  return STYLE[calcId] ?? DEFAULT_STYLE;
}

export function iconForCalc(calcId: string): CalcIcon {
  const s = styleFor(calcId);
  const shape = SHAPE[CATEGORY_SHAPE[calcId] ?? "scale"] ?? SHAPE.scale;
  return { svg: shape, ...s };
}

export function iconForSpoke(calcId: string, slug: string): CalcIcon {
  const s = styleFor(calcId);
  const name = SPOKE_SHAPE[`${calcId}/${slug}`] ?? CATEGORY_SHAPE[calcId] ?? "scale";
  return { svg: SHAPE[name] ?? SHAPE.scale, ...s };
}
