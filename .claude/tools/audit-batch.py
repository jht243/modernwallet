#!/usr/bin/env python3
"""Batch route reservation and fail-closed audit skeleton builder.

Calls the active repository's own content-review-policy.py without modifying
policy-hashed files, preserving recorded admissions across Layer3Labs and fleet sites.
"""
import argparse
import importlib.util
import inspect
import json
import os
from pathlib import Path
import sys


def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def reserve_batch(root, snapshot_path, job, reviewer, out_dir, skeleton_path,
                  routes=(), prior_reports=(), preflight=None, writer_preflight=None):
    """Reserve all target routes in one turn and emit an unreviewed schema-exact skeleton.

    Never populates a verdict, rationale, or evidence text: every judgment field
    starts empty/UNREVIEWED and fails closed until the independent auditor records
    real findings and >=40-char factual evidence.
    """
    root = Path(root).resolve()
    prev_cwd = Path.cwd()
    os.chdir(str(root))
    try:
        return _reserve_batch_in_root(
            root, snapshot_path, job, reviewer, out_dir, skeleton_path,
            routes=routes, prior_reports=prior_reports, preflight=preflight, writer_preflight=writer_preflight,
        )
    finally:
        os.chdir(str(prev_cwd))


def _reserve_batch_in_root(root, snapshot_path, job, reviewer, out_dir, skeleton_path,
                           routes=(), prior_reports=(), preflight=None, writer_preflight=None):
    crp = _load('repo_crp', root / '.claude/tools/content-review-policy.py')
    renderer = _load('repo_renderer', root / '.claude/tools/rendered-audit.py')
    crp.policy(root)
    snapshot = crp.read(snapshot_path)
    renderer.valid_snapshot(snapshot)

    wanted = [r.rstrip('/') or '/' for r in routes] if routes else None
    selected_pages = [
        p for p in snapshot['routes']
        if wanted is None or (p['path'].rstrip('/') or '/') in wanted
    ]
    crp.require(bool(selected_pages), 'No matching routes in snapshot for reserve-batch')
    out_dir.mkdir(parents=True, exist_ok=True)

    layer = None
    if hasattr(crp, 'local_module'):
        layer = crp.local_module(root, snapshot)
    elif (root / '.claude/workflow-policy.local.json').is_file() and (root / '.claude/tools/workflow-local.py').is_file():
        layer = _load('repo_local', root / '.claude/tools/workflow-local.py')
    has_local = layer is not None or (root / '.claude/workflow-policy.local.json').is_file()

    accepts_preflight = 'preflight' in inspect.signature(crp.reserve).parameters
    checks_keys = sorted(renderer.CHECKS)
    skeleton_routes = []
    summaries = []

    for idx, page in enumerate(selected_pages, 1):
        _, spec = crp.route_in(snapshot, page['path'])
        adm_path = out_dir / f'admission-{idx}.json'
        if accepts_preflight:
            adm = crp.reserve(root, snapshot_path, page['path'], job, reviewer, adm_path, prior_reports, preflight)
        else:
            adm = crp.reserve(root, snapshot_path, page['path'], job, reviewer, adm_path, prior_reports)
        text = crp.claim_text(page['semantic'])
        text_sha = crp.sha(text.encode())
        mentions = crp.flags(text)
        prov = adm.get('provisionalProfile') or crp.profile(
            root, page['semantic'], spec.get('claimCategories', []), spec.get('reviewProfile')
        )
        fact_keys = list(crp.FACTS[prov]) + ['riskClassification', 'seoQuality']
        if has_local:
            fact_keys.append('instructionUnderstanding')
        skeleton_routes.append({
            'path': page['path'],
            'fingerprint': page['fingerprint'],
            'reviewProfile': prov,
            'reviewBudget': adm['admissionArtifact'],
            'verdict': 'UNREVIEWED',
            'riskAssessment': {
                'textSha256': text_sha,
                'rationale': '',
                'consequentialClaims': [],
                'incidentalMentions': [{'quote': m['quote'], 'reason': ''} for m in mentions],
            },
            'checks': {k: {'status': 'UNREVIEWED', 'evidence': ''} for k in checks_keys},
            'factualReview': {k: {'status': 'UNREVIEWED', 'evidence': ''} for k in fact_keys},
            'findings': [],
        })
        summaries.append({
            'route': page['path'],
            'round': adm['number'],
            'maximumRounds': adm['maximumRounds'],
            'provisionalProfile': prov,
            'riskPassageCount': len(mentions),
            'admission': adm['admissionArtifact'],
        })

    skeleton = {
        'reviewer': reviewer,
        'snapshotSha256': snapshot['snapshotSha256'],
        'routes': skeleton_routes,
    }
    if layer is not None:
        skeleton['workflowPolicySha256'] = layer.policy_hash(root)
        apps = []
        if writer_preflight is not None:
            apps.append(crp.reference(root, writer_preflight / 'manifest.json'))
        if preflight is not None:
            apps.append(crp.reference(root, preflight / 'manifest.json'))
        if apps:
            skeleton['instructionApplications'] = apps

    crp.save_exact(skeleton_path, skeleton)
    return {
        'status': 'reserved-unreviewed-skeleton',
        'jobId': job,
        'reviewer': reviewer,
        'snapshotSha256': snapshot['snapshotSha256'],
        'skeleton': str(skeleton_path.resolve().relative_to(root)),
        'routes': summaries,
        'note': 'Populate real PASS/FAIL verdicts, >=40-char riskAssessment.rationale & factualReview evidence, and >=20-char checks evidence before running content-review-policy.py record.',
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', default=str(Path(__file__).resolve().parents[2]))
    sub = parser.add_subparsers(dest='command', required=True)
    p = sub.add_parser('reserve-batch')
    for name in ('snapshot', 'job-id', 'reviewer', 'out-dir', 'skeleton'):
        p.add_argument('--' + name, required=True)
    p.add_argument('--route', action='append', default=[])
    p.add_argument('--prior-review', action='append', default=[])
    p.add_argument('--preflight', help='Completed AUDIT preflight directory (bound automatically when supported)')
    p.add_argument('--writer-preflight', help='Optional WRITE preflight directory for Layer3 local application binding')
    args = parser.parse_args(argv)
    root = Path(args.root).resolve()
    crp = _load('repo_crp_cli', root / '.claude/tools/content-review-policy.py')
    result = reserve_batch(
        root,
        crp.inside(root, args.snapshot),
        args.job_id,
        args.reviewer,
        crp.inside(root, args.out_dir),
        crp.inside(root, args.skeleton),
        args.route,
        [crp.inside(root, r) for r in args.prior_review],
        crp.inside(root, args.preflight) if args.preflight else None,
        crp.inside(root, args.writer_preflight) if args.writer_preflight else None,
    )
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError) as error:
        print('BLOCKED: ' + str(error), file=sys.stderr)
        sys.exit(1)
