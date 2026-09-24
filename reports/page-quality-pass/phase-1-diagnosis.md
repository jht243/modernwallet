# Page Quality Pass — Phase 1 Diagnosis — 2026-09-24

Window: 2026-08-28..2026-09-24 (28d), GA4 property 543459487. 25 pages pulled.

## Traffic floor (≥50 sessions) — below floor, excluded
/guides/250th-anniversary-coins/ (49), /roundup/best-401k-providers-for-small-business/ (47),
/compare/hysa-vs-money-market/ (44), /guides/high-yield-savings-account-for-kids-and-teens/ (38),
/portfolio/portfolio-risk-calculator/ (35), /mortgage/payoff-calculator/ (37), /net-worth/ (31),
/compare/utma-vs-ugma/ (36)

## Archetype medians (within pulled set, ≥50-session pages)
- guide (n=7): dwell 79.0s, eng_rate 0.5391, bounce 0.4609, scroll 0.0935
- tool (n=4): dwell 77.5s, eng_rate 0.7987, bounce 0.2013, scroll 0.1556
- roundup (n=3, <4 → fallback to all-content median), comparison (n=2, <4 → fallback)
- all-content fallback (n=16): dwell 87.15s, eng_rate 0.5676, bounce 0.4325, scroll 0.1014

## Flagged pages (≥2 flags)

| route | archetype | flags | dwell | eng_rate | bounce | scroll |
|---|---|---|---|---|---|---|
| / | conversion/nav | DWELL, BOUNCE | 13.1 | 0.3812 | 0.6188 | 0.0686 |
| /compare/custodial-roth-ira-vs-brokerage-account/ | comparison (fallback) | ENG_RATE, BOUNCE | 76.2 | 0.2632 | 0.7368 | 0.0833 |

**/ (home)** → conversion/nav, never body-edited. Flagged for the human. No action.

## Cooldown + buffer filter

**/compare/custodial-roth-ira-vs-brokerage-account/**
- Own ledger: last treated 2026-09-07 (17 days ago) — outside 7-day cooldown. Survives.
- GA4-pass buffer: last audited 2026-09-19 (5 days ago) — outside 48h buffer. Survives.
- → Candidate for tonight.

All other flagged pages: none (only the two above cleared ≥2 flags).

## GSC evidence — /compare/custodial-roth-ira-vs-brokerage-account/
- 30d totals: 0 impressions, 0 clicks, no-data verdict, `rewrite_recommended: true`.
- No GSC-visible organic query data (metadata lane closed — no evidence to gate a title/description rewrite). Everything else stays open.
- Note: GA4 channel_split for this page shows Organic Search: 54 of 57 sessions — GSC and GA4 disagree on channel attribution for this page; treat GSC as authoritative for query-level intent evidence only, not as a traffic-source contradiction to investigate here.

## Diagnosis

**/compare/custodial-roth-ira-vs-brokerage-account/** — dwell (76.2s) is near/above the comparison-archetype fallback median (87.15s is close, and this page's dwell isn't DWELL-flagged), but ENG_RATE + BOUNCE are both weak → **DEAD_END** (they read, then have nowhere to go).

This is a **repeat finding**: same diagnosis, same page, previously treated 2026-09-07 with ADD_LINKS (2 links: /guides/utma-custodial-account-explained/, /compare/custodial-account-vs-savings-account/). Improvement report (step 7) below shows partial improvement but the underlying problem persists — Phase 2 should check whether the existing links are being used/visible before just adding more.

## Improvement report (pages treated ≥14 days ago)

| route | treated | metric | before | now (28d window) |
|---|---|---|---|---|
| /compare/custodial-roth-ira-vs-brokerage-account/ | 2026-09-07 (17d ago) | sessions | 53 | 57 |
| | | avg_eng_s | 102.2 | 76.2 (↓) |
| | | eng_rate | 0.1132 | 0.2632 (↑ +132%) |
| | | bounce | 0.8868 | 0.7368 (↓ 15pts) |

Verdict: meaningfully improved but still below archetype benchmark — DEAD_END persists, second-round action warranted. No other ledger rows cross the 14-day mark this cycle (/roundup/best-index-funds/ treated 2026-08-27 = 28d ago but fell out of GA4 organic ranking checks — not in this pull's top-25 with recent data beyond what's shown above; already flagged clean this run so no separate row needed).

## Output → Phase 2
One candidate: /compare/custodial-roth-ira-vs-brokerage-account/, diagnosis DEAD_END, GSC no-data (metadata lane closed).
