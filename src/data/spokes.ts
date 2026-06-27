import type { SpokeEntry } from "./types";
import { AUTO_SPOKES } from "./spokes-auto";
import { MORTGAGE_SPOKES } from "./spokes-mortgage";
import { REAL_ESTATE_SPOKES } from "./spokes-real-estate";
import { RETIREMENT_SPOKES } from "./spokes-retirement";
import { INVESTING_SPOKES } from "./spokes-investing";
import { PORTFOLIO_SPOKES } from "./spokes-portfolio";
import { NET_WORTH_SPOKES } from "./spokes-net-worth";

// Aggregator for all spoke pages across calculators. Phase 2 adds one spokes-*.ts file per
// calculator and spreads it here.
export const SPOKES: SpokeEntry[] = [
  ...AUTO_SPOKES,
  ...MORTGAGE_SPOKES,
  ...REAL_ESTATE_SPOKES,
  ...RETIREMENT_SPOKES,
  ...INVESTING_SPOKES,
  ...PORTFOLIO_SPOKES,
  ...NET_WORTH_SPOKES,
];

export const SPOKE_BY_PATH: Record<string, SpokeEntry> = Object.fromEntries(
  SPOKES.map((s) => [`${s.calculator}/${s.slug}`, s]),
);
