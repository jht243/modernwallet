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
        lines.append(
            f'1. Complete preflight: python3 .claude/tools/workflow-preflight.py challenge --run-dir {rel_dir} '
            f'&& write application.json (verbatim >=30-char quotes sliced from manifest["files"]) '
            f'&& python3 .claude/tools/workflow-preflight.py check --run-dir {rel_dir} --application {rel_dir}/application.json'
        )
    else:
        lines.append(
            f'1. Complete preflight: python3 .claude/tools/workflow-preflight.py check --run-dir {rel_dir}'
        )

    if phase == 'build':
        lines.extend([
            '2. Batch case lookup (if BUILD writes approval-manifest.json): '
            f'python3 .claude/tools/mindmap-gates.py cases-batch --manifest <RUN_DIR>/approval-manifest.json --site-host {canonical_base.replace("https://", "")} --out-dir <RUN_DIR>/evidence',
            '3. Chart Reviewer ONLY (never self-approve in BUILD): write <RUN_DIR>/chart-review.json '
            '(keys: jobId, reviewer, manifestSha256, verdict ["PASS"|"FAIL"], findings, resolvedFindingIds), then on PASS run: '
            'python3 .claude/tools/mindmap-gates.py render-chart --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json --out <CHART_PATH> '
            '&& python3 .claude/tools/mindmap-gates.py validate-chart --manifest <RUN_DIR>/approval-manifest.json --review <RUN_DIR>/chart-review.json --chart <CHART_PATH>',
        ])
        if has_hype_check:
            lines.append(
                '4. Hype angle gate (when a frozen hype intake exists): '
                'python3 scripts/hype_radar/check_chart.py --pull <FROZEN_INTAKE> --chart <CHART_PATH>'
            )
    elif phase == 'write':
        if (root / '.claude/tools/load-standards.sh').is_file():
            lines.append(
                f'2. Standards ledger (no 140KB dump): WORKFLOW_RUN_ID={run_id} bash .claude/tools/load-standards.sh "<routine>" "write" --run-id {run_id} --ledger-only'
            )
        lines.append(
            f'3. Batch cases (if needed): python3 .claude/tools/mindmap-gates.py cases-batch --manifest <RUN_DIR>/approval-manifest.json --site-host {canonical_base.replace("https://", "")} --out-dir <RUN_DIR>/evidence'
        )
        if lint_cmd:
            lines.append(f'4. Content lint (single batch pass): {lint_cmd}')
        if has_fresh_preview:
            lines.append('5. Build & capture rendered preview (1-shot): python3 .claude/tools/fresh-preview.local.py ...')
        else:
            lines.append(
                f'5. Build & capture rendered preview in 1 turn (starts & stops preview automatically): '
                f'write <RUN_DIR>/audit/capture-manifest.json ({{"workflowKind":"mindmap-pass","author":"{actor}","canonicalBase":"{canonical_base}","routes":[{{"path":"/route/","claimCategories":["capability"]}}]}}) '
                f'&& python3 .claude/tools/rendered-audit.py capture-local --manifest <RUN_DIR>/audit/capture-manifest.json --run-id {run_id} --out <RUN_DIR>/audit/preview-snapshot.json --build'
            )
    elif phase == 'audit':
        lines.extend([
            '2. Mechanical surface & risk pack across all routes in 1 turn: '
            'python3 .claude/tools/rendered-audit.py inspect-pack --snapshot <SNAPSHOT_JSON>',
            f'3. Reserve all routes & emit pre-bound review skeleton in 1 turn (never hand-roll hashes): '
            f'python3 .claude/tools/audit-batch.py reserve-batch --snapshot <SNAPSHOT_JSON> --job-id <JOB_ID> '
            f'--reviewer {actor} --preflight {rel_dir} --out-dir <RUN_DIR>/audit/admissions --skeleton <RUN_DIR>/audit/review.json',
            '4. After genuine full-text, primary-source & layout audit, populate real PASS/FAIL verdicts + >=40-char factualReview & >=20-char checks evidence in <RUN_DIR>/audit/review.json, then run: '
            'python3 .claude/tools/content-review-policy.py record --review <RUN_DIR>/audit/review.json '
            '&& python3 .claude/tools/rendered-audit.py check --snapshot <SNAPSHOT_JSON> --review <RUN_DIR>/audit/review.json',
            '5. If a subset of routes PASS and others FAIL below ceiling, project passing subset mechanically: '
            'python3 .claude/tools/content-review-policy.py project --snapshot <SNAPSHOT_JSON> --review <RUN_DIR>/audit/review.json --route <PASS_ROUTE> --out-snapshot <RUN_DIR>/audit/approved-snapshot.json --out-review <RUN_DIR>/audit/approved-review.json',
        ])
    elif phase == 'publish':
        lines.extend([
            '2. Host commit provenance (1 foreground call): '
            'python3 .claude/tools/deployment-evidence.py --expected-commit <FULL_40_CHAR_SHA> --out <RUN_DIR>/audit/host-proof.json',
            '3. Live capture, compare & journal close: '
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
