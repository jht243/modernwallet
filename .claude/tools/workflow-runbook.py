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
            '2. Manual interactive /mindmap-pass pre-Phase-0 scope chart (never unattended *-auto): set "preparationMode": "fast-scope" and "scopeBriefs": '
            '[{"actionId", "target", "identity": {"title","pageType","format","medium"}, "readerAndAnswer": {"question","answer","placement"}, '
            '"keywordEvidence", "whyNewPage", "outline": [{"heading","purpose"}], "takeaway", "evidenceFiles": [{"path","sha256"}]}] '
            '(plus "modelLaunch": {"level": "small"|"mid"|"frontier", "modelSlug": "<slug>"} on AI model launches when docs/model-launch-page-family.md exists).',
            '3. Batch case lookup (full preparation mode; skipped during manual pre-Phase-0 fast-scope): '
            f'python3 .claude/tools/mindmap-gates.py cases-batch --manifest <RUN_DIR>/approval-manifest.json --publisher {canonical_base.replace("https://", "")} --out-dir <RUN_DIR>/evidence',
            '4. Chart Reviewer ONLY (never self-approve in BUILD): write <RUN_DIR>/chart-review.json '
            '(keys: jobId, reviewer, manifestSha256, readinessSha256, verdict ["PASS"|"FAIL"], evidence, requestCoverage, findings, resolvedFindingIds), then on PASS run: '
            'python3 .claude/tools/mindmap-gates.py render-chart --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json --out <CHART_PATH> '
            '&& python3 .claude/tools/mindmap-gates.py validate-chart --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json',
            '5. MAIN dispatcher 1-command WRITE handoff seal (after full chart PASS & authorization): '
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
            f'3. Batch cases (if needed): python3 .claude/tools/mindmap-gates.py cases-batch --manifest <RUN_DIR>/approval-manifest.json --publisher {canonical_base.replace("https://", "")} --out-dir <RUN_DIR>/evidence'
        )
        if lint_cmd:
            lines.append(f'4. Content lint (single batch pass): {lint_cmd}')
        if has_fresh_preview:
            lines.append(
                f'5. Build & capture rendered preview in 1 command (auto-generates render manifest & installs deps if missing): '
                f'python3 .claude/tools/fresh-preview.local.py --auto-manifest <RUN_DIR>/approval-manifest.json --author {actor} --manifest <RUN_DIR>/audit/capture-manifest.json --run-id {run_id} --out <RUN_DIR>/audit/preview-snapshot.json'
            )
            lines.append(
                f'6. MAIN dispatcher 1-command AUDIT handoff seal: '
                f'python3 .claude/tools/workflow-handoff.py auto-seal --phase audit --manifest <RUN_DIR>/approval-manifest.json --previous <RUN_DIR>/handoff-write.json --snapshot <RUN_DIR>/audit/preview-snapshot.json --producer {actor} --actor <AUDITOR_ACTOR> --out <RUN_DIR>/handoff-audit.json --pack-out <RUN_DIR>/packet-audit.json'
            )
        else:
            lines.append(
                f'5. Build & capture rendered preview in 1 command (auto-generates capture-manifest.json, handles Node/Astro/WSGI, starts & stops preview): '
                f'python3 .claude/tools/rendered-audit.py capture-local --auto-manifest <RUN_DIR>/approval-manifest.json --author {actor} --manifest <RUN_DIR>/audit/capture-manifest.json --run-id {run_id} --out <RUN_DIR>/audit/preview-snapshot.json --build'
            )
            lines.append(
                f'6. MAIN dispatcher 1-command AUDIT handoff seal: '
                f'python3 .claude/tools/workflow-handoff.py auto-seal --phase audit --manifest <RUN_DIR>/approval-manifest.json --previous <RUN_DIR>/handoff-write.json --snapshot <RUN_DIR>/audit/preview-snapshot.json --producer {actor} --actor <AUDITOR_ACTOR> --out <RUN_DIR>/handoff-audit.json'
            )
    elif phase == 'audit':
        lines.extend([
            '2. Mechanical surface & risk pack across all routes in 1 turn: '
            'python3 .claude/tools/rendered-audit.py inspect-pack --snapshot <SNAPSHOT_JSON>',
            f'3. Reserve all routes & emit pre-bound review skeleton in 1 turn (never hand-roll hashes): '
            f'python3 .claude/tools/audit-batch.py reserve-batch --snapshot <SNAPSHOT_JSON> --job-id <JOB_ID> '
            f'--reviewer {actor} --preflight {rel_dir} '
            + ('--writer-preflight <RUN_DIR>/preflight-write ' if is_local else '')
            + '--out-dir <RUN_DIR>/audit/admissions --skeleton <RUN_DIR>/audit/review.json',
            '4. Populate real PASS/FAIL verdicts + >=40-char riskAssessment.rationale (and >=40-char reason on every incidentalMentions/consequentialClaims item) + >=40-char factualReview + >=20-char checks evidence in <RUN_DIR>/audit/review.json, then sync profile/keys & record in 1 turn: '
            'python3 .claude/tools/audit-batch.py finalize-review --snapshot <SNAPSHOT_JSON> --review <RUN_DIR>/audit/review.json '
            '&& python3 .claude/tools/content-review-policy.py record --review <RUN_DIR>/audit/review.json '
            '&& python3 .claude/tools/rendered-audit.py check --snapshot <SNAPSHOT_JSON> --review <RUN_DIR>/audit/review.json',
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
            '3. Bounded 1-turn live URL verification (never spin manual curl/sleep turns): '
            'python3 .claude/tools/verify-live-urls.py --manifest <CAPTURE_MANIFEST> --timeout 180 --out <RUN_DIR>/audit/live-urls.json',
            f'4. Host commit provenance (1 foreground call): '
            f'python3 {dep_tool} --expected-commit <FULL_40_CHAR_SHA> --out <RUN_DIR>/audit/host-proof.json',
            '5. Live capture, compare & journal close: '
            'python3 .claude/tools/rendered-audit.py capture --manifest <CAPTURE_MANIFEST> --base-url ' + canonical_base + ' --out <RUN_DIR>/audit/live-snapshot.json '
            '&& python3 .claude/tools/rendered-audit.py compare --approved <APPROVED_SNAPSHOT> --live <RUN_DIR>/audit/live-snapshot.json --review <APPROVED_REVIEW> '
            '&& python3 .claude/tools/rendered-audit.py record-deployment --snapshot <LIVE_SNAPSHOT> --approved <APPROVED_SNAPSHOT> --review <APPROVED_REVIEW> --commit <FULL_SHA> --deployment-evidence <RUN_DIR>/audit/host-proof.json --ledger <RUN_DIR>/audit/deployment-ledger.json',
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
