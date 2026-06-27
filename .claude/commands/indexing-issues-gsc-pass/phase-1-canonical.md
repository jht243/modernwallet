# Phase 1 — Canonical / duplicate fixes

Act on every report row in the `fix canonical / duplicate` bucket. These are URLs the inspection returned as `Duplicate without user-selected canonical` or `Duplicate, Google chose different canonical than user` — i.e. the page's declared canonical and Google's chosen canonical disagree, or no canonical was declared.

## Worker
1. **Confirm the mismatch from the inspection JSON.** For each URL, read `google_canonical` vs `user_canonical` from `<date>.inspection.json`. State the exact disagreement before changing anything.
2. **Decide the correct canonical (conservative).** The canonical should point to the version you actually want indexed — almost always the live, higher-value, www, trailing-slash-consistent URL.
   - **HARD STOP — direction:** never canonicalize a higher-traffic / higher-value URL *into* a lower one. If the fix would do that, it's backwards — flag it `ambiguous — needs human`, do not execute.
   - If Google chose a different canonical than the user declared and Google's choice is the page you want indexed, the fix is usually to **make the user-declared canonical agree with Google's** (the site was fighting Google). If you want the user's original instead, the fix is to *strengthen* that signal (self-referential canonical + internal links + sitemap), not to fight Google with conflicting hints.
3. **Apply the fix ON THE AFFECTED PAGE ONLY — never at config / site-wide level.**
   - **‼️ HARD STOP — no config-level or site-wide changes in this automated workflow.** Do NOT edit the base-URL / site-URL config, a shared `canonical_site_url`/`_base_url()` helper, or any setting/template logic that changes the canonical for pages *other than* the specific URLs flagged in the report. Such a change has site-wide blast radius — one wrong value mis-canonicalizes every page in a single commit — which is exactly the kind of action this automated pass must not take unsupervised.
   - **Scope every change to the exact reported URL(s).** Set the canonical only for those specific pages, through the established per-page canonical-override path discovered in Phase 0 (e.g. a per-page `canonical` prop/front-matter/route field). Never hand-inject a second `<link rel="canonical">`, and never touch the mechanism that emits canonicals for unaffected pages.
   - **If the root cause is genuinely site-wide** (e.g. every page emits `http://` or non-`www` canonicals because of the base-URL config), do NOT fix it at the config level here. **Flag it `ambiguous — needs human`** with the diagnosis, so a person makes the high-blast-radius config change deliberately, outside this automated pass.
   - When a single reported defect spans N pages, apply N discrete per-page edits — not one shared change. If that's impractical without touching shared config, flag `ambiguous — needs human` rather than reaching for the config.
4. **Re-point internal links** that pointed at the non-canonical variant: grep the project's source/template directories for `<non-canonical-path>` and update them to the canonical URL with descriptive anchors.
5. `git add`. Do not commit.

## Reviewer checklist
- ☐ **NO config-level / site-wide change** — base-URL/site-URL config, shared canonical helpers, and any logic affecting unaffected pages are UNTOUCHED (auto-REJECT if a change alters canonicals for pages not in the report; site-wide root causes must be flagged `ambiguous — needs human`, not fixed here)
- ☐ every edit is **scoped to a specific reported URL** via the per-page canonical-override path — the diff touches only the flagged pages
- ☐ each change traces to a real `Duplicate*` row with the `google_canonical`/`user_canonical` evidence
- ☐ exactly one canonical per page, pointing to the intended indexable URL (exact host/protocol/trailing-slash)
- ☐ no hand-injected duplicate `<link rel="canonical">`
- ☐ direction is correct — no higher-value URL canonicalized into a lower one (else auto-REJECT)
- ☐ no internal link still points at the non-canonical variant
- ☐ no canonical loop introduced (A→B while B→A, or canonical → a redirecting/404 URL)

Reject with specifics; max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin Phase 2 in the SAME turn. Do NOT stop or ask. The `/indexing-issues-gsc-pass` run has EXACTLY TWO human stops — Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8 summary) — and this is neither. The reviewer gates are adversarial subagents, not human checkpoints; a passing gate means YOU proceed on your own.
