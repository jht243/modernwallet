import type { SpokeEntry } from "./types";
import { AUTO_SPOKES } from "./spokes-auto";
import { MORTGAGE_SPOKES } from "./spokes-mortgage";
import { REAL_ESTATE_SPOKES } from "./spokes-real-estate";
import { RETIREMENT_SPOKES } from "./spokes-retirement";
import { INVESTING_SPOKES } from "./spokes-investing";
import { PORTFOLIO_SPOKES } from "./spokes-portfolio";
import { NET_WORTH_SPOKES } from "./spokes-net-worth";
import { BUDGET_SPOKES } from "./spokes-budget";
import { TAX_RESOLUTION_SPOKES } from "./spokes-tax-resolution";
import { ESTATE_PLANNING_SPOKES } from "./spokes-estate-planning";
import { PROBATE_SPOKES } from "./spokes-probate";

// Aggregator for all spoke pages across calculators. Phase 2 adds one spokes-*.ts file per
// calculator and spreads it here. Pillar 1 = tax-resolution; Pillar 2 = estate-planning;
// Pillar 3 = probate; elder-care follows.
export const SPOKES: SpokeEntry[] = [
  ...AUTO_SPOKES,
  ...MORTGAGE_SPOKES,
  ...REAL_ESTATE_SPOKES,
  ...RETIREMENT_SPOKES,
  ...INVESTING_SPOKES,
  ...PORTFOLIO_SPOKES,
  ...NET_WORTH_SPOKES,
  ...BUDGET_SPOKES,
  ...TAX_RESOLUTION_SPOKES,
  ...ESTATE_PLANNING_SPOKES,
  ...PROBATE_SPOKES,
];

export const SPOKE_BY_PATH: Record<string, SpokeEntry> = Object.fromEntries(
  SPOKES.map((s) => [`${s.calculator}/${s.slug}`, s]),
);
