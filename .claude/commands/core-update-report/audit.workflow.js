export const meta = {
  name: 'core-update-report',
  description: 'Audit the current site against the latest Google core update; produce a Problem/Solution/Google-Change chart (read-only)',
  phases: [
    { title: 'Census' },
    { title: 'Audit' },
    { title: 'Verify' },
    { title: 'GSC Check' },
    { title: 'Synthesize' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Everything project-specific arrives via `args` (built by Phase 0 + Phase R of
// the /core-update-report orchestrator). Nothing here is hardcoded to a project.
//   args = {
//     site:        "example.com"                       // bare host, no scheme
//     baseUrl:     "https://example.com"               // canonical origin
//     gscProjectId: 12345 | null                       // Ahrefs GSC project id, or null
//     gscToolHint: "ToolSearch query string"           // how agents load GSC tools (or "")
//     updateName:  "May 2026 core update"              // the update being audited against
//     updateRubric: "…distilled what-it-rewarded/punished rubric with sources…"
//     clusters:    [{ key, routes, hypothesis, dimension }]   // discovered page-type clusters
//     reportPath:  "reports/core-update-report/2026-06-11.md"
//     today:       "2026-06-11"
//     repoNote:    "framework + how to sample pages + READ-ONLY reminder"
//   }
// ─────────────────────────────────────────────────────────────────────────────
const A = args || {}
const SITE = A.site || 'the site'
const BASE = A.baseUrl || `https://${SITE}`
const UPDATE = A.updateName || 'the latest Google core update'
const CRITERIA = A.updateRubric || ''
const CLUSTERS = Array.isArray(A.clusters) && A.clusters.length ? A.clusters : [
  { key: 'all-pages', routes: '(all indexable URLs)', hypothesis: 'general exposure', dimension: 'overall quality vs the update rubric' },
]
const REPORT_PATH = A.reportPath || `reports/core-update-report/${A.today || 'report'}.md`
const REPO_NOTE = A.repoNote ||
  `You are in the project's repo. Prefer reading live rendered pages via WebFetch on ${BASE}/... for sampling, and read the route/template source to understand the generator. This is a READ-ONLY audit — do NOT edit any file.`
const GSC_NOTE = A.gscProjectId
  ? `Live SEO data is available. Load GSC tools with ToolSearch: ${A.gscToolHint || 'search "gsc performance keywords pages"'} then call them with project_id=${A.gscProjectId}, date_from ~6 weeks back. GSC mirrors lag a few days — note the last complete date and say recovery may not be visible yet.`
  : `No connected GSC project was found, so live search data is unavailable. Infer intent/format fit from the live pages themselves and say clearly that click/impression trends could not be measured.`

// ─── Schemas ─────────────────────────────────────────────────────────────────
const FINDINGS_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    clusterRisk: { type: 'string', enum: ['high', 'medium', 'low'] },
    pageCount: { type: 'string', description: 'approx live pages in this cluster + how counted' },
    sampledUrls: { type: 'array', items: { type: 'string' } },
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          updatePattern: { type: 'string', description: 'which loss/gain pattern of THIS update it maps to' },
          evidence: { type: 'string', description: 'concrete evidence from sampled pages (quote/specifics)' },
          affectedScope: { type: 'string', description: 'how many pages / which template' },
          recommendation: { type: 'string', description: 'specific recommended change (NOT applied)' },
          effort: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        required: ['title', 'severity', 'updatePattern', 'evidence', 'affectedScope', 'recommendation', 'effort'],
      },
    },
  },
  required: ['clusterRisk', 'pageCount', 'sampledUrls', 'findings'],
}
const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    isReal: { type: 'boolean', description: 'true only if a genuine risk under THIS update, worth acting on' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    refinedSeverity: { type: 'string', enum: ['high', 'medium', 'low'] },
    reasoning: { type: 'string' },
    collateralRisk: { type: 'boolean', description: 'true if acting could backfire (e.g. consolidating near-tied pages, hard-to-reverse moves)' },
  },
  required: ['isReal', 'confidence', 'refinedSeverity', 'reasoning', 'collateralRisk'],
}
const CENSUS_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    totalIndexableEstimate: { type: 'string' },
    clusters: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          key: { type: 'string' }, count: { type: 'string' }, generator: { type: 'string' },
          programmatic: { type: 'boolean' }, sampleUrls: { type: 'array', items: { type: 'string' } },
        },
        required: ['key', 'count', 'generator', 'programmatic', 'sampleUrls'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['totalIndexableEstimate', 'clusters', 'notes'],
}
const GSC_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    topQueries: { type: 'array', items: { type: 'string' } },
    intentMismatches: { type: 'array', items: { type: 'string' } },
    clusterSignals: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'topQueries', 'intentMismatches', 'clusterSignals'],
}
const GSC_CHECK_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    cluster: { type: 'string' },
    direction: { type: 'string', enum: ['declining', 'flat', 'gaining', 'unknown'] },
    metrics: { type: 'string', description: 'the actual numbers: clicks/impressions/position for the two windows compared, with the date ranges' },
    verdict: { type: 'string', enum: ['corroborates', 'contradicts', 'inconclusive'], description: 'does the live GSC trend support the audit\'s risk claim for this cluster?' },
    note: { type: 'string', description: 'one concise line tying the trend to the finding; flag loudly if the cluster is GAINING despite being flagged at-risk (do-not-touch signal)' },
  },
  required: ['cluster', 'direction', 'metrics', 'verdict', 'note'],
}

// ─── Phase 1: Census + live GSC fit (parallel) ───────────────────────────────
phase('Census')
const [census, gsc] = await parallel([
  () => agent(
    `${REPO_NOTE}\nCensus this site's indexable URL space by cluster. For each cluster give an accurate live page count + how counted, the generator (route + data source), whether it's programmatic/templated, and 3-5 representative live sample URLs.\nClusters: ${CLUSTERS.map(c => `${c.key} (${c.routes})`).join('; ')}.\nUse the live sitemap ${BASE}/sitemap.xml and the route/template source. Be precise about counts — this scales the risk.`,
    { schema: CENSUS_SCHEMA, phase: 'Census', label: 'census' }
  ),
  () => agent(
    `${GSC_NOTE}\nProfile this site's search performance for the audit. Identify: (1) overall click/impression/position trend through last complete data; (2) the top ~15 queries; (3) any query where the page that ranks is the WRONG format/source-type for the intent, per this rubric:\n${CRITERIA}\n(4) which URL clusters are gaining vs losing impressions (map page URLs to clusters by path prefix). If no live data is available, base intent/format judgments on the live pages and say so.`,
    { schema: GSC_SCHEMA, phase: 'Census', label: 'gsc-fit' }
  ),
])

// ─── Phase 2+3: per-cluster audit → adversarial verify (pipeline, no barrier) ─
const censusBlob = JSON.stringify(census)
const audited = await pipeline(
  CLUSTERS,
  (c) => agent(
    `${REPO_NOTE}\nAudit the "${c.key}" cluster (${c.routes}) against ${UPDATE}.\nRisk hypothesis: ${c.hypothesis}. Primary dimension to test: ${c.dimension}.\nRUBRIC (what this update rewarded/punished):\n${CRITERIA}\nCensus context: ${censusBlob}\nMethod: sample 3-5 representative LIVE pages via WebFetch on ${BASE}/..., and read the generating route/template. For each real risk, give concrete evidence (quote the thin/derivative/templated content you actually see), the affected scope (how many pages share the template), and a specific recommended change that does NOT delete content wholesale. Only flag genuine risks tied to a named pattern of THIS update — do not pad. If the cluster is genuinely fine, say so with low clusterRisk and few/no findings.`,
    { schema: FINDINGS_SCHEMA, phase: 'Audit', label: `audit:${c.key}` }
  ),
  (result, c) => parallel(((result && result.findings) || []).map((finding) => () =>
    agent(
      `Adversarially verify this proposed ${UPDATE} risk for the ${c.key} cluster on ${SITE}. Be skeptical — default to isReal=false unless the evidence clearly maps to a real loss/gain pattern of this update from this rubric:\n${CRITERIA}\nFINDING: ${JSON.stringify(finding)}\nCheck: (a) genuine ranking risk under THIS update, or a generic SEO nitpick? (b) is the evidence real and specific? (c) CRITICALLY — would acting on the recommendation risk backfiring? Set collateralRisk=true for anything reversible-only-with-difficulty: consolidating/redirecting near-tied pages, hard 301s, mass-deletion. Refine severity honestly.`,
      { schema: VERDICT_SCHEMA, phase: 'Verify', label: `verify:${c.key}` }
    ).then((v) => ({ ...finding, cluster: c.key, verdict: v }))
  )),
)
const allFindings = audited.flat().filter(Boolean)
const confirmed = allFindings.filter((f) => f.verdict && f.verdict.isReal)

// ─── Phase 3.5: GSC reality-check — validate the report against live GSC trends ─
// For every cluster that has a confirmed finding, pull the ACTUAL GSC trend and
// decide whether the data corroborates or CONTRADICTS the audit's risk claim. A
// cluster flagged at-risk but actually gaining is a do-not-touch signal.
phase('GSC Check')
const checkClusters = [...new Set(confirmed.map((f) => f.cluster))]
  .map((key) => CLUSTERS.find((c) => c.key === key) || { key, routes: '' })
const gscChecks = A.gscProjectId
  ? (await parallel(checkClusters.map((c) => () =>
      agent(
        `Reality-check the audit's risk claim for the "${c.key}" cluster (URL routes: ${c.routes}) against LIVE Google Search Console data for ${SITE}.\n${GSC_NOTE}\nUpdate window: ${A.updateWindow || 'use the rollout dates of ' + UPDATE + ' if known; otherwise compare the most recent complete 4 weeks vs the prior 4 weeks'}.\nPull this cluster's pages (filter GSC pages/page-history by the URL path prefix for this cluster) and compare clicks, impressions, and average position across the two windows. Then decide: does the trend CORROBORATE the audit's claim that this cluster is at risk (declining/flat under the update), or CONTRADICT it (the cluster is gaining)? Report the actual numbers and date ranges. If the cluster is GAINING despite being flagged at-risk, say so loudly — that's a do-not-touch signal (acting on a winner is how a prior consolidation backfired). If GSC has no/scant data for these URLs, return direction=unknown, verdict=inconclusive and say the data was insufficient.`,
        { schema: GSC_CHECK_SCHEMA, phase: 'GSC Check', label: `gsc-check:${c.key}` }
      ))) ).filter(Boolean)
  : []
const gscByCluster = {}
for (const g of gscChecks) { if (g && g.cluster) gscByCluster[g.cluster] = g }
// Best-effort: also key by the audit's cluster keys in case the agent renamed them.
checkClusters.forEach((c, i) => { if (gscChecks[i] && !gscByCluster[c.key]) gscByCluster[c.key] = gscChecks[i] })
const gscCheckBlob = JSON.stringify(gscByCluster)

// ─── Phase 4: Synthesize the chart (writes ONE report file; no code changes) ──
phase('Synthesize')
const report = await agent(
  `${REPO_NOTE}\nWrite the audit report to ${REPORT_PATH} (create it + any parent dirs; this is the ONLY file you may write).\nContext:\n- Audits ${SITE} against ${UPDATE}.\n- Census: ${censusBlob}\n- Live GSC findings: ${JSON.stringify(gsc)}\n- CONFIRMED findings (already adversarially verified, isReal=true): ${JSON.stringify(confirmed)}\n- GSC REALITY-CHECK per cluster (live data validating or contradicting each finding), keyed by cluster: ${gscCheckBlob}\n- Raw findings considered: ${allFindings.length}; confirmed: ${confirmed.length}.\n- Update rubric used: ${CRITERIA}\n\nSTEP 1 — REVISE THE FINDINGS USING THE GSC REALITY-CHECK (this is the whole point; do it before writing the chart). For each confirmed finding, look up its cluster in the GSC reality-check data and decide:\n- GSC CONTRADICTS it (cluster is GAINING / a clear winner): **REMOVE the row from the action chart** and list it under "Do NOT touch" instead — never recommend acting on a winner.\n- GSC shows the cluster is INERT / NEGLIGIBLE (≈0 clicks, tiny impressions) or the evidence is immaterial: **DROP the row, or revise the Solution to "deprioritize / defer"** — do not present low-value busywork as a priority.\n- GSC is INCONCLUSIVE due to a data gap (outage, or the mirror lags mid-rollout): **KEEP it but revise the Solution** to say re-measure after fresh data before acting.\n- GSC CORROBORATES it (real impressions, poor/declining positions): **KEEP and rank it higher** — highest-confidence action.\n- MERGE findings in the same cluster that GSC treats as one signal.\nThe chart the user sees is this POST-REVISION action list — NOT the raw findings.\n\nSTEP 2 — WRITE THE CHART. THE CORE OF THE REPORT IS A SINGLE 3-COLUMN MARKDOWN CHART with EXACTLY these columns:\n| Problem | Solution | Google Change (${UPDATE}) |\nRules for the chart:\n- One row per SURVIVING (post-GSC-revision) finding, ordered by GSC-validated priority (corroborated + high impact first).\n- Column 1 "Problem": the issue in plain terms, naming the affected cluster + approx page count + a leading severity tag (and a ✅ RESOLVED tag if already fixed). e.g. "Sanctions pages (~120): thin aggregator of a government list".\n- Column 2 "Solution": the specific recommended change **as revised by the GSC review** (advisory — NOT applied; no wholesale deletion). Where GSC drove the change, reflect it in the wording (e.g. "additive only — GSC shows this cluster is winning, do not consolidate"; "defer until a post-reindex baseline exists").\n- Column 3 "Google Change (${UPDATE})": state WHICH specific shift in THIS update makes the fix matter (rubric pattern: scaled content / derivative-vs-first-party / YMYL E-E-A-T / intent-format fit / task-completion / brand-no-longer-a-floor, etc.). THEN, on a new line inside the same cell, add a plain-language explainer prefixed exactly with "<br><br>🧒 **Like you're 10:** " — a concrete, friendly analogy a 10-year-old would understand. Both parts are required in every row.\n- Keep cells scannable; use <br> for line breaks, no giant paragraphs.\n\nAround the chart, keep it minimal:\n- 2-3 line intro: overall exposure + the single highest-leverage move + one line on how well the live GSC data backs the audit.\n- One line: all solutions advisory / read-only (note any already-shipped fixes).\n- The chart (the main deliverable — the revised action list).\n- A short "🔧 Adjusted after GSC review" note: which findings were REMOVED or DOWNGRADED because the live data didn't support them, and why (so the revision is transparent). Note how current the GSC data is (mirrors lag a few days).\n- A "⚠️ Do NOT touch" list: anything collateralRisk=true OR contradicted by GSC (gaining clusters), plus the standing warning that consolidating near-tied pages can backfire, prefer reversible canonical over hard 301, and no mass-deletion.\n- One line: re-measure GSC after the update fully completes + fresh data.\nAfter writing the file, return the FULL report markdown (intro + the 3-column revised chart + the "Adjusted after GSC review" note + the Do-NOT-touch section) as plain text, plus the report path on the last line.`,
  { phase: 'Synthesize', label: 'report' }
)

return {
  reportPath: REPORT_PATH,
  update: UPDATE,
  clustersAudited: CLUSTERS.length,
  rawFindings: allFindings.length,
  confirmedFindings: confirmed.length,
  report,
}
