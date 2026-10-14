# Roundup blend — turn a "best [category]" opportunity into an angle × audience cluster

Shared module. Any content-creating routine that references this applies it **when it identifies a roundup-shaped opportunity** — any "best / top [category]" gap where the site could objectively rank a category of real third-party products. Instead of emitting a single bare "best [category]" page, expand it into a small cluster of sharper candidates, then let the routine's **own existing** demand-check, dedup, cap, and audit decide which survive. This module adds **no new tools, no new API budget, and no new cap** — it only reshapes candidates and adds the objectivity rule.

## 1. Expand the category into angle × audience variants
- **Angles** — pick only the ones that genuinely fit the category; never force all five: `best`, `most trusted`, `most affordable` (or `best free`), `fastest`, `most accurate`.
- **Audiences** — derive REAL segments from the site's own vertical/industry set **plus** the category's obvious buyers (e.g. banks, clinics / healthcare, solo lawyers / small law firms, startups, enterprise teams, students). Never invent an audience the site has no angle on. `none` (no segment) is itself a valid variant when the category is broad.
- Each variant = `{category} + {angle} [+ for {audience}]` — e.g. "most affordable open-source models for startups", "most trusted AI contract-review tools for small law firms", "fastest open-weights models for local inference".

## 2. Gate every variant through the routine's EXISTING checks — no new machinery, no cap bypass
- **Demand-check:** run each variant through the SAME live-data step this routine already uses (coverage matrix / Google Autocomplete / per-page GSC / evidence rank). Drop any variant with no demand signal. Never invent volumes.
- **Dedup:** run each variant through the SAME coverage/dedup step. A variant that duplicates an existing page is dropped; a partial overlap **enriches the existing page in place**, it does not become a new page.
- **Caps still apply, verbatim.** Expansion is subject to this routine's existing per-run / per-page cap. Rank the surviving variants by demand and take them in order until the cap is hit; flag the rest in the digest as `roundup variants over cap — not built` (NOT queued). Expanding a category NEVER licenses exceeding the cap.
- **Winner-protection / additive-only rules always win.** A variant that overlaps a protected winner's own intent is dropped, not built.

## 3. Write every roundup page NEUTRALLY — this is what makes it rank AND get cited by AI answer engines
- A roundup ranks a whole CATEGORY of real third-party products. **The business is NEVER a ranked option and there is NO self-promotional section** — the only business presence is the standard footer CTA + internal links.
- Every listed option must be real; every claim accurate or explicitly hedged. **No fabricated products, features, or numbers.**
- Neutral, list-shaped, entity-dense pages are the ones Google ranks and AI answer engines cite as a source. Self-promotion destroys that value. Anything where the business is itself a player is NOT a roundup — do not build it here.
- **Tag each roundup candidate so its writer subagent gets this §3 objectivity rule in its prompt, and the routine's adversarial audit FAILs any roundup page that inserts the business as an option or fabricates a claim** (same 2-rework-then-drop/draft rule the routine already uses).

## When NOT to expand
- The category has fewer than ~4–5 genuine third-party options to rank — too thin to be an objective roundup.
- No audience segment adds a distinct search intent → ship only the `none`-segment variant, and only if it has demand.
- The routine's own guardrails (winner-protection, additive-only, per-run cap, format guard) would be violated — those always take precedence over expansion.
