import type { StateContext } from "./types";

// 50-state reference table used by the state-subpage route (`/[category]/[slug]/[state]/`) and by
// state-aware calculator engines. `lawContext`, `costFactor`, and `notes` are per-spoke concerns:
// they live on the spoke's own state overrides — this file only owns the identity fields
// (slug + name + USPS). Keep alphabetical for stable diffs.

export const STATES: StateContext[] = [
  { slug: "alabama", name: "Alabama", usps: "AL" },
  { slug: "alaska", name: "Alaska", usps: "AK" },
  { slug: "arizona", name: "Arizona", usps: "AZ" },
  { slug: "arkansas", name: "Arkansas", usps: "AR" },
  { slug: "california", name: "California", usps: "CA" },
  { slug: "colorado", name: "Colorado", usps: "CO" },
  { slug: "connecticut", name: "Connecticut", usps: "CT" },
  { slug: "delaware", name: "Delaware", usps: "DE" },
  { slug: "florida", name: "Florida", usps: "FL" },
  { slug: "georgia", name: "Georgia", usps: "GA" },
  { slug: "hawaii", name: "Hawaii", usps: "HI" },
  { slug: "idaho", name: "Idaho", usps: "ID" },
  { slug: "illinois", name: "Illinois", usps: "IL" },
  { slug: "indiana", name: "Indiana", usps: "IN" },
  { slug: "iowa", name: "Iowa", usps: "IA" },
  { slug: "kansas", name: "Kansas", usps: "KS" },
  { slug: "kentucky", name: "Kentucky", usps: "KY" },
  { slug: "louisiana", name: "Louisiana", usps: "LA" },
  { slug: "maine", name: "Maine", usps: "ME" },
  { slug: "maryland", name: "Maryland", usps: "MD" },
  { slug: "massachusetts", name: "Massachusetts", usps: "MA" },
  { slug: "michigan", name: "Michigan", usps: "MI" },
  { slug: "minnesota", name: "Minnesota", usps: "MN" },
  { slug: "mississippi", name: "Mississippi", usps: "MS" },
  { slug: "missouri", name: "Missouri", usps: "MO" },
  { slug: "montana", name: "Montana", usps: "MT" },
  { slug: "nebraska", name: "Nebraska", usps: "NE" },
  { slug: "nevada", name: "Nevada", usps: "NV" },
  { slug: "new-hampshire", name: "New Hampshire", usps: "NH" },
  { slug: "new-jersey", name: "New Jersey", usps: "NJ" },
  { slug: "new-mexico", name: "New Mexico", usps: "NM" },
  { slug: "new-york", name: "New York", usps: "NY" },
  { slug: "north-carolina", name: "North Carolina", usps: "NC" },
  { slug: "north-dakota", name: "North Dakota", usps: "ND" },
  { slug: "ohio", name: "Ohio", usps: "OH" },
  { slug: "oklahoma", name: "Oklahoma", usps: "OK" },
  { slug: "oregon", name: "Oregon", usps: "OR" },
  { slug: "pennsylvania", name: "Pennsylvania", usps: "PA" },
  { slug: "rhode-island", name: "Rhode Island", usps: "RI" },
  { slug: "south-carolina", name: "South Carolina", usps: "SC" },
  { slug: "south-dakota", name: "South Dakota", usps: "SD" },
  { slug: "tennessee", name: "Tennessee", usps: "TN" },
  { slug: "texas", name: "Texas", usps: "TX" },
  { slug: "utah", name: "Utah", usps: "UT" },
  { slug: "vermont", name: "Vermont", usps: "VT" },
  { slug: "virginia", name: "Virginia", usps: "VA" },
  { slug: "washington", name: "Washington", usps: "WA" },
  { slug: "west-virginia", name: "West Virginia", usps: "WV" },
  { slug: "wisconsin", name: "Wisconsin", usps: "WI" },
  { slug: "wyoming", name: "Wyoming", usps: "WY" },
];

export const STATE_BY_SLUG: Record<string, StateContext> = Object.fromEntries(
  STATES.map((s) => [s.slug, s]),
);
