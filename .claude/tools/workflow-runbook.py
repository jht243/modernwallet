#!/usr/bin/env python3
"""Emit a dynamic, repository-detected CLI runbook for the active Mindmap stage.

Contains zero editorial verdicts, content rules, or site-specific prose; all
commands are derived live from the repository's installed helpers so updates to
mindmap-pass or shared tools never drift across fleet sites.
"""
import argparse
import json
from pathlib import Path


def render_runbook(root: Path, directory: Path = None, phase: str = None) -> str:
    root = root.resolve()
    manifest = {}
    rel_dir = '<PREFLIGHT_DIR>'
    if directory is not None and (directory / 'manifest.json').is_file():
        manifest = json.loads((directory / 'manifest.json').read_text())
        phase = phase or manifest.get('phase')
        try:
            rel_dir = str(directory.resolve().relative_to(root))
        except ValueError:
            rel_dir = str(directory)
    phase = phase or 'build'
    actor = manifest.get('actor') or '<ACTOR>'
    run_id = manifest.get('runId') or '<RUN_ID>'
    is_local = (root / '.claude/workflow-policy.local.json').is_file()

    policy_cfg = {}
    policy_path = root / '.claude/content-review-policy.json'
    if policy_path.is_file():
        try:
            policy_cfg = json.loads(policy_path.read_text())
        except ValueError:
            policy_cfg = {}
    site_id = policy_cfg.get('siteId', '<SITE_ID>')
    hosts = policy_cfg.get('canonicalHosts') or []
    canonical_base = None
    renderer_path = root / '.claude/tools/rendered-audit.py'
    if renderer_path.is_file():
        import importlib.util
        spec_r = importlib.util.spec_from_file_location('runbook_canonical_probe', renderer_path)
        mod_r = importlib.util.module_from_spec(spec_r)
        spec_r.loader.exec_module(mod_r)
        if hasattr(mod_r, 'detect_rendered_canonical_base'):
            canonical_base = mod_r.detect_rendered_canonical_base(root)
    if not canonical_base:
        canonical_base = f"https://{hosts[-1] if len(hosts) > 1 and hosts[-1].startswith('www.') else (hosts[0] if hosts else '<CANONICAL_HOST>')}"

    has_hype_check = (root / 'scripts/hype_radar/check_chart.py').is_file()
    has_fresh_preview = (root / '.claude/tools/fresh-preview.local.py').is_file() and is_local
    lint_cmd = (
        'npx tsx scripts/content_lint.mts'
        if (root / 'scripts/content_lint.mts').is_file()
        else ('python3 scripts/content_lint.py' if (root / 'scripts/content_lint.py').is_file() else None)
    )

    lines = [
        f'=== DYNAMIC STAGE CLI RUNBOOK (phase={phase}, site={site_id}) ===',
        'No --help / grep / sed on .claude/tools/*.py needed; use these exact verified commands:',
    ]
    if is_local:
        bundle_id = manifest.get('bundleId') or '<BUNDLE_ID>'
        ctx_id = manifest.get('contextId') or '<CONTEXT_ID>'
        ctx_epoch = manifest.get('contextEpoch') or '<CONTEXT_EPOCH>'
        req_sources = list(manifest.get('files') or {})
        reused_sources = set(manifest.get('reused') or [])
        if manifest.get('reuse') and (root / '.claude/tools/instruction-understanding.py').is_file():
            fresh_sources = [s for s in req_sources if s not in reused_sources or s in {manifest.get('handoff'), manifest.get('contextPacket')} or s.startswith('reports/')]
            fresh_tpl = json.dumps([
                {
                    'source': s,
                    'quote': '<EXACT >=30-char contiguous raw substring sliced from this source>',
                    'meaning': '<>=50-char unique explanation in your own words>',
                    'application': '<>=50-char specific application to this current task>',
                }
                for s in fresh_sources
            ])
            lines.extend([
                f'1. Complete --reuse preflight in 1 turn (carry unchanged explanations without rewriting unchanged sources; never grep docs):',
                f'   Run: python3 .claude/tools/instruction-understanding.py challenge --run-dir {rel_dir} '
                f'&& write {rel_dir}/confirmation.json && python3 .claude/tools/instruction-understanding.py record --run-dir {rel_dir} --confirmation {rel_dir}/confirmation.json --out {rel_dir}/application.json',
                f'   Blank confirmation.json layout (identity keys MUST be flat top-level, never nested under "identity"; set booleans true ONLY if genuinely true):',
                f'   {{"version": "retained-understanding-2026-11-08.1", "bundleId": "{bundle_id}", "actor": "{actor}", "runId": "{run_id}", "contextId": "{ctx_id}", "contextEpoch": "{ctx_epoch}", "previousBundleId": "<previousBundleId from challenge>", '
                f'"currentContextAvailable": <true|false>, "rulesUnderstood": <true|false>, "contextRetained": <true|false>, "unchangedApplicationsStillApply": <true|false>, "recallStillUnderstood": <true|false>, "reuseEligibleSources": <true|false>, '
                f'"task": "<>=60 chars concrete current task>", "accessEvidence": "<>=60 chars genuine current-context retention statement>", "currentApplication": "<>=60 chars changed-focus/current application>", "freshUnderstanding": {fresh_tpl}}}',
            ])
        else:
            src_preview = json.dumps(req_sources) if req_sources else '["<each path in manifest[\'files\']>"]'
            lines.extend([
                f'1. Complete preflight in 1 turn (no --help or doc grepping needed; answer from what you just read):',
                f'   Run: python3 .claude/tools/workflow-preflight.py challenge --run-dir {rel_dir} '
                f'&& write {rel_dir}/application.json '
                f'&& python3 .claude/tools/workflow-preflight.py check --run-dir {rel_dir} --application {rel_dir}/application.json',
                f'   Blank application.json layout (fill every field genuinely; slice quote verbatim from raw file bytes — note `.claude/commands/_mindmap-chart-obligations.generated.md` is virtual, so slice its quote from `{rel_dir}/part-*.txt`, not disk):',
                f'   {{"bundleId": "{bundle_id}", "actor": "{actor}", "runId": "{run_id}", "contextId": "{ctx_id}", "contextEpoch": "{ctx_epoch}", '
                f'"currentContextAvailable": <true|false>, "rulesUnderstood": <true|false>, "task": "<>=40 chars concrete current stage task>", '
                f'"scenarios": {{"lostContext": "<reread|reuse|ignore>", "changedRules": "<reread|reuse|ignore>", "writerAsFinalReviewer": "<independent-reviewer|writer|self>", "calculationIsProductTest": "<yes|no>", "higherRiskClaim": "<light|standard|high>", "lightSeo": "<none|partial|full>"}}, '
                f'"understanding": [{{"source": "<one entry for EACH path in {src_preview}>", "quote": "<EXACT >=30-char contiguous raw substring>", "meaning": "<>=50-char unique explanation in your own words (no duplicates)>", "application": "<>=50-char specific application to this task>"}}]}}',
            ])
    else:
        lines.append(
            f'1. Complete preflight: python3 .claude/tools/workflow-preflight.py check --run-dir {rel_dir}'
        )

    if phase == 'build':
        lines.extend([
            '2. Exact CLI JSON Output Schemas (never guess keys or crash inline Python; always single-quote heredocs `python3 - <<\'PY\'` in zsh): '
            '`keyword_data.py volumes|expand` -> `{"rows": [{"keyword","volume","volume_low","volume_high","kd","cpc","source","confidence","autocomplete":{"completions","corroborates"}}], "notes": [...]}` (library `volumes()` returns `dict[lowercase_phrase, row]`; `expand()` returns `list[row]`); '
            '`autocomplete.py` -> `{"seed", "mode", "suggestions": [{"query", "via"}]}`; '
            '`python3 scripts/lib/serp.py read --keyword "<kw>"` (or `batch --keywords-file <FILE> --out <OUT>`) -> `{"keyword", "verdict", "top10_domains", "paa", "forum_dominated", "ai_overview_present", "ai_overview_cited_domains"}` (whereas raw DataForSEO HTTP JSON uses `body["tasks"][0]["result"][0]["items"]`).',
            '2b. Full-Verbatim Primary-Source & Coverage Capture Once (zero downstream Browser re-scraping): on FIRST visit to any vendor/help/policy URL, save the COMPLETE verbatim page text + canonical URL + UTC retrieval timestamp to `<RUN_DIR>/research/sources/<source-slug>.txt`, save `coverage_lookup.py` output to `<RUN_DIR>/research/coverage-lookup.txt`, and reference them in `evidenceFiles` so `CHART-REVIEW`, `WRITE`, and `AUDIT` read from disk without re-opening Browser/WebFetch.',
            '2c. 1-Command Schema Skeletons (never inspect old `reports/` folders or `sed` tools): '
            'init manifest -> `python3 .claude/tools/mindmap-gates.py init-skeleton --kind scope-manifest --mode <fast-scope|full> --job-id <JOB_ID> --author ' + actor + ' --chart <CHART_PATH> --request-file <BRIEF_TXT> --out <RUN_DIR>/approval-manifest.json`; '
            'init chart-review -> `python3 .claude/tools/mindmap-gates.py init-skeleton --kind chart-review --manifest <RUN_DIR>/approval-manifest.json --author <REVIEWER_ACTOR> --out <RUN_DIR>/chart-review.json`; '
            'after human Phase 0 approval -> `python3 .claude/tools/mindmap-gates.py init-skeleton --kind phase0-approval --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json --out <RUN_DIR>/phase0-approval-v1.json`.',
            '2d. Manual interactive /mindmap-pass pre-Phase-0 scope chart (never unattended *-auto): set "preparationMode": "fast-scope" and "scopeBriefs": '
            '[{"actionId", "target", "identity": {"title","pageType","format","medium"}, "readerAndAnswer": {"question","answer","placement"}, '
            '"keywordEvidence", "whyNewPage", "outline": [{"heading","purpose"}], "takeaway", "evidenceFiles": [{"path","sha256"}]}] '
            '(name real concrete candidate products/entities + verified brand-page figures upfront so Round 1 passes; add "modelLaunch": {"level": "small"|"mid"|"frontier", "modelSlug": "<slug>"} on AI model launches when docs/model-launch-page-family.md exists).',
            '2e. Mandatory Pre-Review Draft Seal in BUILD (catches 100% of hash, medium, format & requirement-mapping errors in <0.1s BEFORE handing off to CHART-REVIEW): '
            'python3 .claude/tools/mindmap-gates.py seal-draft --manifest <RUN_DIR>/approval-manifest.json --out <RUN_DIR>/draft-chart.md'
            + (
                ' && python3 .claude/tools/workflow-dispatch.local.py freeze-preparation --input <RUN_DIR>/approval-manifest.json --out <RUN_DIR>/frozen-manifest-v1.json (ensure --out is a NEW non-existent path; never grep/sed workflow-dispatch.local.py)'
                if is_local
                else ''
            ),
            '3. Batch case lookup (full preparation mode; skipped during manual pre-Phase-0 fast-scope): '
            f'python3 .claude/tools/mindmap-gates.py cases-batch --manifest <RUN_DIR>/approval-manifest.json --publisher {canonical_base.replace("https://", "")} --out-dir <RUN_DIR>/evidence',
            '4. Chart Reviewer ONLY (never self-approve in BUILD; read `<RUN_DIR>/research/sources/*.txt` from disk FIRST before WebFetch): scaffold `<RUN_DIR>/chart-review.json` via `init-skeleton --kind chart-review`, populate real `verdict`, `evidence`, `requestCoverage`, `findings`, `resolvedFindingIds`, then on PASS run: '
            'python3 .claude/tools/mindmap-gates.py render-chart --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json --out <CHART_PATH> '
            '&& python3 .claude/tools/mindmap-gates.py validate-chart --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json',
            '4b. MAIN Automatic Guardrail Carryover / Mechanical Rebind (on unattended `*-auto` Round-1 non-liability/non-duplicate FAIL, pass `--carry-round1-guardrails` so 100% of Round-1 findings carry into `reviewerGuardrails` for WRITE + Phase 4 AUDIT without a R2 chart loop; manual `/mindmap-pass` uses up to 2 chart-review rounds): '
            'python3 .claude/tools/mindmap-gates.py rebind-mechanical --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json --out <CHART_PATH> [--carry-round1-guardrails] '
            '&& python3 .claude/tools/mindmap-gates.py validate-chart --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json',
            '5. MAIN sub-batch planner (>3 new pages or >8 routes -> disjoint 2-3 page WRITE/AUDIT sub-batches) & 1-command WRITE handoff seal: '
            'python3 .claude/tools/mindmap-gates.py plan-batches --manifest <RUN_DIR>/approval-manifest.json --out <RUN_DIR>/batch-plan.json && '
            + (
                'python3 .claude/tools/workflow-handoff.py auto-seal --phase write --manifest <RUN_DIR>/approval-manifest.json --producer <BUILDER_ACTOR> --out <RUN_DIR>/handoff-write.json --pack-out <RUN_DIR>/packet-write.json'
                if is_local
                else 'python3 .claude/tools/workflow-handoff.py auto-seal --phase write --manifest <RUN_DIR>/approval-manifest.json --producer <BUILDER_ACTOR> --out <RUN_DIR>/handoff-write.json'
            ),
        ])
        if has_hype_check:
            lines.append(
                '6. Hype angle gate (when a frozen hype intake exists): '
                'python3 scripts/hype_radar/check_chart.py --pull <FROZEN_INTAKE> --chart <CHART_PATH>'
            )
    elif phase == 'write':
        if (root / '.claude/tools/load-standards.sh').is_file():
            lines.append(
                f'2. Standards ledger (no 140KB dump): WORKFLOW_RUN_ID={run_id} bash .claude/tools/load-standards.sh "<routine>" "write" --run-id {run_id} --ledger-only'
            )
        lines.append(
            '2b. Primary-source disk reuse (0 redundant Browser scrapes): read `<RUN_DIR>/research/sources/*.txt` from disk FIRST; NEVER re-open Browser/WebFetch on URLs already captured in `research/sources/` (fetch live ONLY for a newly needed URL absent from `research/sources/`).'
        )
        lines.append(
            f'3. 1-command cases + analysis-packet skeletons (_experience.md + _approved-cases.json + exact pre-hashed approvedPlan/presentation/caseSelection — never inspect old reports/ or sed content_gen.py): '
            f'python3 .claude/tools/mindmap-gates.py init-skeleton --kind evidence-batch --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json --author {actor} --publisher {canonical_base.replace("https://", "")} --basis <reported|calculated|modeled|measured|client-record> --out-dir <RUN_DIR>/evidence'
        )
        if (root / 'scripts/reader-surveys/research.mts').is_file():
            lines.append(
                '3b. Durable reader-survey evidence (include verified poll/survey facts when matched; never fabricate respondents): '
                'npx tsx scripts/reader-surveys/research.mts catalog && npx tsx scripts/reader-surveys/research.mts facts --slug <SURVEY_SLUG>'
            )
        lines.append(
            '3c. Personalized analysis packet, 1-command prompt/allowed-URL packet builder & pre-splice draft precheck (_decision-evidence.md + _mindmap-execution.md + _testing-labels.md): '
            'populate <RUN_DIR>/evidence/<slug>/evidence.json (calculated|modeled execution + visible assumptions + counterexample, measured runs:[{testedAt}] for (Tested YYYY) eligibility, or reported|client-record + caseUses), '
            'run `python3 .claude/tools/mindmap-gates.py prepare-write-packets --manifest <RUN_DIR>/approval-manifest.json --evidence-dir <RUN_DIR>/evidence --out-dir <RUN_DIR>/prompts` (emits reusable `system.md`, `<slug>.prompt.md`, and `<slug>.allowed-urls.txt` in 1 command), '
            'invoke parallel `content_gen.py` calls (`--system-file <RUN_DIR>/prompts/system.md --prompt-file <RUN_DIR>/prompts/<slug>.prompt.md --allowed-urls-file <RUN_DIR>/prompts/<slug>.allowed-urls.txt --mindmap-manifest <RUN_DIR>/approval-manifest.json --mindmap-review <RUN_DIR>/chart-review.json --analysis-packet <RUN_DIR>/evidence/<slug>/evidence.json`), '
            'and run `python3 .claude/tools/mindmap-gates.py precheck-drafts --manifest <RUN_DIR>/approval-manifest.json --drafts-dir <RUN_DIR>/drafts --prompts-dir <RUN_DIR>/prompts --fix-pipe-tables && python3 .claude/tools/mindmap-gates.py check-write-scope --manifest <RUN_DIR>/approval-manifest.json` BEFORE splicing/building.'
        )
        if lint_cmd:
            lines.append(f'4. Content lint (single batch pass): {lint_cmd}')
        if has_fresh_preview:
            lines.append(
                f'5. Build & capture rendered preview in 1 command (auto-verifies write scope & generates render manifest; on Round 2+ rework add `--only-rework-from <PRIOR_REVIEW_JSON>` so ONLY rework-eligible FAIL routes are captured & re-audited): '
                f'python3 .claude/tools/fresh-preview.local.py --auto-manifest <RUN_DIR>/approval-manifest.json --author {actor} --manifest <RUN_DIR>/audit/capture-manifest.json --run-id {run_id} --out <RUN_DIR>/audit/preview-snapshot.json'
            )
            lines.append(
                f'6. MAIN dispatcher 1-command AUDIT handoff seal: '
                f'python3 .claude/tools/workflow-handoff.py auto-seal --phase audit --manifest <RUN_DIR>/approval-manifest.json --previous <RUN_DIR>/handoff-write.json --snapshot <RUN_DIR>/audit/preview-snapshot.json --producer {actor} --actor <AUDITOR_ACTOR> --out <RUN_DIR>/handoff-audit.json --pack-out <RUN_DIR>/packet-audit.json'
            )
        else:
            lines.append(
                f'5. Build & capture rendered preview in 1 command (auto-verifies write scope, generates capture-manifest.json, handles Node/Astro/WSGI, starts & stops preview; on Round 2+ rework add `--only-rework-from <PRIOR_REVIEW_JSON>` to capture ONLY rework-eligible FAIL routes): '
                f'python3 .claude/tools/rendered-audit.py capture-local --auto-manifest <RUN_DIR>/approval-manifest.json --author {actor} --manifest <RUN_DIR>/audit/capture-manifest.json --run-id {run_id} --out <RUN_DIR>/audit/preview-snapshot.json --build'
            )
            lines.append(
                f'6. MAIN dispatcher 1-command AUDIT handoff seal: '
                f'python3 .claude/tools/workflow-handoff.py auto-seal --phase audit --manifest <RUN_DIR>/approval-manifest.json --previous <RUN_DIR>/handoff-write.json --snapshot <RUN_DIR>/audit/preview-snapshot.json --producer {actor} --actor <AUDITOR_ACTOR> --out <RUN_DIR>/handoff-audit.json'
            )
    elif phase == 'audit':
        is_routine_control = str(rel_dir).replace('\\', '/').startswith('reports/routine-control/preflight/')
        if is_routine_control:
            lines.extend([
                '2. ROUTINE-CONTROL READ-ONLY REVIEWER MODE (shell helpers inspect-pack / reserve-batch / finalize-review / record are intentionally disabled in reviewer Bash — MAIN runs them before/after your turn; NEVER emit a procedural FAIL because Bash denied them):',
                '3. Use Read to inspect <SNAPSHOT_JSON>, any pre-built <RUN_DIR>/audit/review-skeleton.json (or prior review JSON), the captured HTML/txt files, and raw primary sources.',
                '4. Populate real PASS/FAIL verdicts + >=40-char riskAssessment.rationale (and >=40-char reason on every incidentalMentions/consequentialClaims item) + >=40-char factualReview + >=20-char checks evidence in the review JSON object, and Write ONLY your assigned reports/routine-control/receipts/<tid>.json receipt including candidates:[...] AND native_receipts:[{"path":"<declared REVIEW_RECEIPT path>","content":<complete review JSON object>}].',
                '5. After SubagentStop exports native_receipts, MAIN binds your real agent_id + preflight + admissions and records in 1 turn: '
                'python3 .claude/tools/audit-batch.py finalize-review --snapshot <SNAPSHOT_JSON> --review <REVIEW_RECEIPT_JSON> --job-id <JOB_ID> '
                f'--reviewer {actor} --preflight {rel_dir} '
                + ('--writer-preflight <RUN_DIR>/preflight-write ' if is_local else '')
                + '--out-dir <RUN_DIR>/audit/admissions '
                '&& python3 .claude/tools/content-review-policy.py record --review <REVIEW_RECEIPT_JSON> '
                '&& python3 .claude/tools/rendered-audit.py check --snapshot <SNAPSHOT_JSON> --review <REVIEW_RECEIPT_JSON>',
            ])
        else:
            lines.extend([
                '2. Mechanical surface & risk pack across all routes in 1 turn: '
                'python3 .claude/tools/rendered-audit.py inspect-pack --snapshot <SNAPSHOT_JSON>',
                '2b. Primary-source disk verification first: read `<RUN_DIR>/research/sources/*.txt` + `<SNAPSHOT_DIR>` from disk FIRST; spot-check live URLs only when a saved source snapshot appears truncated, stale, or disputed.',
                f'3. Reserve all routes & emit pre-bound review skeleton + pre-hashed `<RUN_DIR>/audit/analysis-reviews/<slug>.json` skeletons in 1 turn (never hand-roll hashes): '
                f'python3 .claude/tools/audit-batch.py reserve-batch --snapshot <SNAPSHOT_JSON> --job-id <JOB_ID> '
                f'--reviewer {actor} --preflight {rel_dir} '
                + ('--writer-preflight <RUN_DIR>/preflight-write ' if is_local else '')
                + '--out-dir <RUN_DIR>/audit/admissions --skeleton <RUN_DIR>/audit/review.json',
                '4. Populate real PASS/FAIL verdicts + >=40-char riskAssessment.rationale (and >=40-char reason on every incidentalMentions/consequentialClaims item; allowed `categories` values: `ordinary|product|pricing|capability|medical|legal|investment|financial|security-critical|safety-critical`) + >=40-char factualReview + >=20-char checks evidence in <RUN_DIR>/audit/review.json (plus verdict/evidence/findings in <RUN_DIR>/audit/analysis-reviews/<slug>.json when evidence packets exist; verifying _decision-evidence.md visible internal-testing, visible modeling assumptions + counterexample, anonymized/approved client caseUseReview, reader-survey attribution, intent Our Takeaway, and _testing-labels.md (Tested YYYY) year/coverage), then finalize, record, check & replay in 1 single turn (never grep mindmap-gates.py or content-review-policy.py): '
                'python3 .claude/tools/audit-batch.py finish-audit --snapshot <SNAPSHOT_JSON> --review <RUN_DIR>/audit/review.json',
                '5. If a subset of routes PASS and others FAIL below ceiling, project passing subset mechanically: '
                'python3 .claude/tools/content-review-policy.py project --snapshot <SNAPSHOT_JSON> --review <RUN_DIR>/audit/review.json --route <PASS_ROUTE> --out-snapshot <RUN_DIR>/audit/approved-snapshot.json --out-review <RUN_DIR>/audit/approved-review.json',
            ])
    elif phase == 'publish':
        has_land = (root / '.github/workflows/land.yml').is_file() and (root / '.claude/scripts/land-run.sh').is_file()
        deploy_cmd = (
            'bash .claude/scripts/deploy-run-to-main.sh push '
            '(falls back to `bash .claude/scripts/land-run.sh land` only if direct push to main is refused or PUBLISHER_RELEASE_DIR is set)'
            if has_land
            else 'bash .claude/scripts/deploy-run-to-main.sh push'
        )
        dep_tool = '.claude/tools/deployment-evidence.local.py' if (root / '.claude/tools/deployment-evidence.local.py').is_file() and is_local else '.claude/tools/deployment-evidence.py'
        lines.extend([
            f'2. Land commits onto main (run directly from MAIN, never inside a subagent): {deploy_cmd}',
            '3. Bounded 1-turn live URL verification (accepts capture-manifest.json OR approval-manifest.json directly; never spin manual curl/sleep turns): '
            'python3 .claude/tools/verify-live-urls.py --manifest <CAPTURE_OR_APPROVAL_MANIFEST> --timeout 180 --out <RUN_DIR>/audit/live-urls.json',
            f'4. Host commit provenance (1 foreground call): '
            f'python3 {dep_tool} --expected-commit <FULL_40_CHAR_SHA> --out <RUN_DIR>/audit/host-proof.json',
            '5. Live capture, compare & journal close (supports both single-pair handoffs and multi-pair `reviewPairs` from Round-2 pass-locking or sub-batching in 1 command): '
            'python3 .claude/tools/rendered-audit.py record-pairs --handoff <PUBLISH_HANDOFF_JSON> --base-url ' + canonical_base + ' --out-dir <RUN_DIR>/audit/live --commit <FULL_SHA> --deployment-evidence <RUN_DIR>/audit/host-proof.json --ledger <RUN_DIR>/audit/deployment-ledger.json',
        ])
    lines.append('=== END STAGE CLI RUNBOOK ===')
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase', choices=['build', 'write', 'audit', 'publish'])
    parser.add_argument('--run-dir')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    directory = (root / args.run_dir).resolve() if args.run_dir else None
    print(render_runbook(root, directory, args.phase))


if __name__ == '__main__':
    main()
