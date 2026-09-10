# Run results — Cybercab / gig-economy mindmap pass

- Commit: `070eaa6` (rebased onto `f2dc594`), pushed to `origin/main` 2026-09-10
- Live verification: 8/8 URLs returned HTTP 200
- IndexNow: HTTP 200, 8 URLs submitted with key `dc557f6bfced447aa1a71771d8a0d24a` (key file verified 200)
- Audit: 3 adversarial passes, 39 findings, all remediated, final gate PASS
- Ground truth corrected mid-run: SE tax $1,478.35 (not $1,478.37) — the first run rounded Schedule C profit before the 92.35% step

## Live
| URL | Status |
|---|---|
| /guides/how-much-do-uber-drivers-make/ | 200 (new) |
| /guides/can-you-buy-a-cybercab/ | 200 (new) |
| /guides/cybercab-cost-of-ownership/ | 200 (new) |
| /compare/cybercab-vs-uber/ | 200 (new) |
| /compare/cybercab-vs-waymo/ | 200 (new) |
| /guides/passive-income-ideas/ | 200 (enriched + metadata) |
| /guides/side-hustle-ideas/ | 200 (inbound links) |
| /self-employment-tax/uber-driver-taxes/ | 200 (inbound link) |

## Not shipped
- `/cybercab-fleet-income/` calculator — spec only, at `reports/mindmap-pass/specs/cybercab-fleet-income-spec.md`. Phase 3 writes asset specs and does not build interactive assets.
- `/guides/will-robotaxis-replace-uber-drivers` — dropped by the duplicate-suppression gate as unsupported (zero measured volume on every member phrase); its financial-planning payload was folded into the Uber earnings guide.
