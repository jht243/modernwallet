---
description: Audit the current project against the latest Google core update and produce a Problem / Solution / Google-Change chart (with a "like you're 10" explainer per row). Read-only — never edits code. Self-contained and portable; auto-discovers project facts.
argument-hint: "[optional: a specific update name/date, e.g. 'March 2026 core update' — otherwise auto-detects the most recent]"
---

# /core-update-report — latest Google core update → site audit → Problem/Solution/Google-Change chart

> **‼️ RUN-WIDE RULES — READ FIRST.**
> 1. **READ-ONLY.** This command audits and reports. It must **never** edit, delete, redirect, or commit project files. The only file it writes is the report under `reports/core-update-report/`. If the user wants fixes applied, that is a separate, explicitly-requested follow-up.
> 2. **AUTONOMOUS.** Run end-to-end in one turn. Do **not** ask "should I continue?" between phases. The only acceptable stop is if Phase 0 cannot determine the site's base URL at all.
> 3. **HARDCODE NOTHING.** Every project fact (base URL, GSC project, page-type clusters, framework, report dir) is discovered at runtime. This command works on any project.

This file is the orchestrator. It owns ordering and rules. The heavy lifting (census → per-cluster audit → adversarial verify → **GSC reality-check that revises/removes findings** → synthesize the 3-column chart) lives in the workflow script `.claude/commands/core-update-report/audit.workflow.js`, which is **parameterized entirely through `args`** — you build `args` in Phases 0–R, then run the workflow.

## Execution graph

```
Phase 0 — DISCOVER project facts (base URL, GSC project, clusters, framework, report path)
Phase R — RESEARCH the latest Google core update → distill the rubric + ELI10 mapping
        ▼
Phase W — RUN the workflow with the assembled args:
            census → audit → adversarial verify → GSC reality-check → synthesize
        ▼
Phase P — PRESENT the chart to the user
```

**The GSC reality-check is mandatory and it REVISES the chart — it does not just annotate it.** Every project has GSC connected (via the Ahrefs MCP), so Phase 0 must resolve a `gscProjectId`. The workflow validates each confirmed finding against the cluster's **actual** live GSC trend (clicks/impressions/position) and then **removes, downgrades, or merges rows** accordingly before the chart is written. The final chart the user sees stays the same 3-column **Problem | Solution | Google Change** format — it is the post-review action list, so it can never recommend acting on a cluster the data shows is actually *gaining*.

---

## Phase 0 — Discover project facts (hardcode nothing; print what you find)

Inspect the repo + live site. Produce these values:

- **`baseUrl` / `site`** — from the live `sitemap.xml`, the canonical `<link rel="canonical">` logic, or JsonLd/SEO builders. `site` is the bare host. If you truly cannot determine it, STOP and ask the user for the domain (this is the only allowed stop).
- **`gscProjectId`** (required — the GSC reality-check depends on it) — load the Ahrefs MCP `management-projects` (via ToolSearch `select:mcp__*__management-projects` — the server id is the long uuid prefix) and find the project whose `url` matches `site`. Set `gscProjectId` to its id and set `gscToolHint` to a ToolSearch query that loads the GSC tools for that server (e.g. `select:mcp__<id>__gsc-performance-history,mcp__<id>__gsc-keywords,mcp__<id>__gsc-pages,mcp__<id>__gsc-page-history`). Every project should have GSC connected; if no project matches the domain, **say so in the manifest and pause** to let the user point you at the right project/domain rather than silently skipping the reality-check. Only fall back to `gscProjectId = null` (live-page analysis, no trend validation) if the user confirms there's genuinely no GSC.
- **`updateWindow`** — once Phase R has the rollout dates, pass them so the GSC check compares the right before/after windows (e.g. `"before: 4wk pre-2026-05-21; after: 2026-06-02 onward"`).
- **`clusters`** — enumerate the site's **page-type clusters** by path prefix, from `sitemap.xml` + the route/template source (Flask routes, Next.js app/pages dir, etc.). Group by template/generator, and for each cluster build `{ key, routes, hypothesis, dimension }` where:
  - `hypothesis` = why this cluster might be exposed (e.g. "programmatic pages templated from one data source").
  - `dimension` = the single update-pattern to test it against (scaled-content / derivative-vs-first-party / YMYL E-E-A-T / intent-format fit / task-completion).
  Identify which clusters are **programmatic/templated** (highest priority) vs hand-written. Aim for 4–10 clusters; don't over-split.
- **`framework` + deploy mode** — note it in `repoNote` so audit agents sample pages correctly, and append the literal reminder: *"This is a READ-ONLY audit — do NOT edit any file."*
- **`reportPath`** — `reports/core-update-report/<TODAY>.md` (use the real current date from context; create parent dirs in the workflow).

Print a short **manifest** of what you discovered (base URL, GSC project or "none", the cluster list with counts if known, report path) — then continue immediately to Phase R. Do not wait for approval.

## Phase R — Research the latest Google core update

The update changes over time, so detect it live (unless the user named one in `$ARGUMENTS` — then use that).

- WebSearch for the most recent broad **Google core update** (e.g. `"Google core update <current month year>"`, "latest google core update rolling out / complete"). Establish the **name/date, rollout window, and completion status**.
- WebFetch 2–3 substantive analyses (prefer independent SEO analysts + recovery playbooks, not press-release rewrites). Extract **what it rewarded vs punished** as concrete, checkable patterns.
- Distill into `updateName` and `updateRubric` — a compact rubric string covering the loss patterns (scaled/programmatic content, derivative/aggregator-over-first-party, thin near-duplicates, YMYL E-E-A-T gaps, intent/source-type mismatch, weak task-completion, "brand no longer a floor") and the gain patterns (canonical/first-party, task-complete destinations, named credentialed authors, specific POV, topical depth). Keep the source URLs — you'll cite them when presenting.

## Phase W — Run the audit workflow

Assemble `args` from Phases 0–R:

```
{
  site, baseUrl, gscProjectId, gscToolHint,
  updateName, updateRubric, updateWindow,
  clusters: [{ key, routes, hypothesis, dimension }, …],
  reportPath: "reports/core-update-report/<TODAY>.md",
  today: "<TODAY>",
  repoNote: "<framework + how to sample + READ-ONLY reminder>"
}
```

Then run the workflow (it fans out census + GSC-fit, audits each cluster, adversarially verifies every finding — including a backfire/collateral check — then **validates every confirmed finding against the cluster's live GSC trend**, and writes the chart report):

```
Workflow({
  scriptPath: ".claude/commands/core-update-report/audit.workflow.js",
  args: <the object above>
})
```

The workflow runs in the background and writes the report. When it completes, read the returned `report` (and the file at `reportPath`).

## Phase P — Present

Post the full report to the user: the 2–3 line intro, the complete **Problem | Solution | Google Change** chart — this is the **post-GSC-review** action list (rows the live data contradicted are removed; low-value/inconclusive ones downgraded or deferred), each Google-Change cell carrying the technical note **and** the 🧒 "Like you're 10" explainer — then the **🔧 Adjusted after GSC review** note (what was removed/downgraded and why) and the **⚠️ Do NOT touch** section. End with the source links from Phase R and the saved report path. State plainly that nothing was applied — this is a read-only audit, applying any fix is a separate explicitly-requested step, and any consolidation/redirect must clear the GSC live-impression check first (consolidating near-tied pages can backfire).
