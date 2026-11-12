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
        'note': 'Populate real PASS/FAIL verdicts, >=40-char riskAssessment.rationale (plus >=40-char reason on every incidentalMentions/consequentialClaims item) & factualReview evidence, and >=20-char checks evidence, then run audit-batch.py finalize-review before content-review-policy.py record.',
    }


def finalize_review(root, snapshot_path, review_path, out_path=None):
    """Dry-validate an auditor-completed review.json and sync reviewProfile + factualReview keys.

    Never writes a verdict, rationale, or evidence string. Reports ALL per-field
    schema/length/profile issues in a single pass so `content-review-policy.py record`
    and `rendered-audit.py check` succeed on Attempt 1 without trial-and-error turns.
    """
    root = Path(root).resolve()
    prev_cwd = Path.cwd()
    os.chdir(str(root))
    try:
        return _finalize_review_in_root(root, snapshot_path, review_path, out_path or review_path)
    finally:
        os.chdir(str(prev_cwd))


def _finalize_review_in_root(root, snapshot_path, review_path, target_path):
    import copy
    import uuid

    crp = _load('repo_crp_fin', root / '.claude/tools/content-review-policy.py')
    renderer = _load('repo_renderer_fin', root / '.claude/tools/rendered-audit.py')
    cfg = crp.policy(root)
    snapshot = crp.read(snapshot_path)
    renderer.valid_snapshot(snapshot)
    report = copy.deepcopy(crp.read(review_path))

    layer = crp.local_module(root, snapshot) if hasattr(crp, 'local_module') else None
    has_local = layer is not None or (root / '.claude/workflow-policy.local.json').is_file()

    errors = []
    reviewer = report.get('reviewer')
    if not isinstance(reviewer, str) or not reviewer.strip() or reviewer == snapshot['manifest'].get('author'):
        errors.append('Top-level reviewer must be a non-empty independent identity distinct from snapshot manifest.author')
    if report.get('snapshotSha256') != snapshot.get('snapshotSha256'):
        errors.append('Top-level snapshotSha256 does not match the target snapshot')

    routes = report.get('routes')
    if not isinstance(routes, list) or not routes:
        raise ValueError('review.json must contain a non-empty routes list')
    if len({r.get('path') for r in routes if isinstance(r, dict)}) != len(routes):
        errors.append('Duplicate route path in review.json routes')

    checks_required = set(renderer.CHECKS)
    synced_profiles = []

    for rr in routes:
        rpath = rr.get('path', '<missing-path>')
        try:
            page, spec = crp.route_in(snapshot, rpath)
        except ValueError as exc:
            errors.append(f'[{rpath}] {exc}')
            continue

        if rr.get('fingerprint') != page.get('fingerprint'):
            errors.append(f'[{rpath}] fingerprint mismatch against snapshot route')

        verdict = rr.get('verdict')
        if verdict not in ('PASS', 'FAIL'):
            errors.append(f'[{rpath}] verdict is {verdict!r}; must be "PASS" or "FAIL"')

        admission = None
        adm_ref = rr.get('reviewBudget')
        try:
            admission = crp.read(crp.artifact(root, adm_ref))
        except (ValueError, KeyError, OSError) as exc:
            errors.append(f'[{rpath}] reviewBudget invalid: {exc}')

        ra = rr.get('riskAssessment')
        text = crp.claim_text(page['semantic'])
        expected_text_sha = crp.sha(text.encode())
        selected = None
        if not isinstance(ra, dict):
            errors.append(f'[{rpath}] missing riskAssessment object')
        else:
            if not ra.get('textSha256'):
                ra['textSha256'] = expected_text_sha
            elif ra.get('textSha256') != expected_text_sha:
                errors.append(f'[{rpath}] riskAssessment.textSha256 does not match claim_text SHA ({expected_text_sha})')
            rat_len = len(str(ra.get('rationale') or '').strip())
            if rat_len < 40:
                errors.append(f'[{rpath}] riskAssessment.rationale is {rat_len} chars; needs >=40 chars')
            for list_key in ('consequentialClaims', 'incidentalMentions'):
                items = ra.get(list_key)
                if not isinstance(items, list):
                    errors.append(f'[{rpath}] riskAssessment.{list_key} must be a list')
                    continue
                for idx, item in enumerate(items):
                    if not isinstance(item, dict):
                        errors.append(f'[{rpath}] riskAssessment.{list_key}[{idx}] must be an object')
                        continue
                    q = str(item.get('quote') or '')
                    r_len = len(str(item.get('reason') or '').strip())
                    if len(q.strip()) < 8 or q not in text:
                        errors.append(f'[{rpath}] riskAssessment.{list_key}[{idx}].quote must be an exact >=8-char substring of page claim_text')
                    if r_len < 40:
                        errors.append(f'[{rpath}] riskAssessment.{list_key}[{idx}].reason is {r_len} chars; needs >=40 chars')
                    if list_key == 'consequentialClaims' and item.get('category') not in crp.CONSEQUENTIAL:
                        errors.append(f'[{rpath}] riskAssessment.consequentialClaims[{idx}].category must be one of {sorted(crp.CONSEQUENTIAL)}')

            if not any(e.startswith(f'[{rpath}] riskAssessment') for e in errors):
                try:
                    selected = crp.profile(
                        root, page['semantic'], spec.get('claimCategories', []), spec.get('reviewProfile'), ra,
                    )
                except ValueError as exc:
                    errors.append(f'[{rpath}] risk profile validation failed: {exc}')

        if selected is not None and admission is not None:
            try:
                with crp.Journal(root, admission['identity']['canonicalBase'], rpath) as journal:
                    cycle = journal.cycle
                    if cycle and any(x.get('status') == 'complete' and not x.get('legacyImport') for x in cycle.get('rounds', [])):
                        selected = max([selected, cycle['profile']], key=crp.LEVELS.index)
            except (ValueError, KeyError, OSError):
                pass
            old_prof = rr.get('reviewProfile')
            rr['reviewProfile'] = selected
            synced_profiles.append({'route': rpath, 'fromProfile': old_prof, 'toProfile': selected})

        eff_prof = selected or rr.get('reviewProfile') or cfg['defaultProfile']
        ceiling = crp.audit_limit(cfg, eff_prof, ra if isinstance(ra, dict) else None)
        final_fail = (
            verdict == 'FAIL'
            and crp.capped_release(root, snapshot)
            and admission is not None
            and admission.get('number', 0) >= ceiling
        )

        supplied_checks = rr.get('checks')
        if not isinstance(supplied_checks, dict) or set(supplied_checks) != checks_required:
            missing_c = sorted(checks_required - set(supplied_checks or {}))
            extra_c = sorted(set(supplied_checks or {}) - checks_required)
            errors.append(f'[{rpath}] checks key mismatch (missing={missing_c}, extra={extra_c})')
        else:
            if verdict == 'PASS' or final_fail:
                try:
                    renderer.testing_attribution_check(page['semantic'], supplied_checks)
                except ValueError as exc:
                    errors.append(f'[{rpath}] testingAndAttribution check failed: {exc}')
            for ck, cv in supplied_checks.items():
                if not isinstance(cv, dict):
                    errors.append(f'[{rpath}] checks.{ck} must be an object')
                    continue
                st = cv.get('status')
                ev_len = len(str(cv.get('evidence') or '').strip())
                if verdict == 'PASS' or final_fail:
                    allowed = ['PASS', 'NA'] if ck in ('testingAndAttribution', 'scopeAndExclusions') else ['PASS']
                    if final_fail and ck not in ('testingAndAttribution', 'scopeAndExclusions'):
                        allowed = allowed + ['FAIL']
                    if st not in allowed:
                        errors.append(f'[{rpath}] checks.{ck}.status is {st!r}; allowed={allowed}')
                    if ev_len < 20:
                        errors.append(f'[{rpath}] checks.{ck}.evidence is {ev_len} chars; needs >=20 chars')
                else:
                    if st == 'UNREVIEWED' or ev_len < 20:
                        errors.append(f'[{rpath}] checks.{ck} must have status PASS/FAIL/NA and >=20-char evidence (got {st!r}, {ev_len} chars)')

        req_facts = list(crp.FACTS[eff_prof]) + ['riskClassification', 'seoQuality']
        if has_local:
            req_facts.append('instructionUnderstanding')
        facts = rr.get('factualReview')
        if not isinstance(facts, dict):
            errors.append(f'[{rpath}] missing factualReview object')
        else:
            if selected is not None:
                for fk in req_facts:
                    if fk not in facts or not isinstance(facts[fk], dict):
                        facts[fk] = {'status': 'UNREVIEWED', 'evidence': ''}
                rr['factualReview'] = {k: facts[k] for k in req_facts}
            missing_f = [k for k in req_facts if k not in facts]
            if missing_f:
                errors.append(f'[{rpath}] factualReview missing required keys for profile {eff_prof!r}: {missing_f}')
            else:
                for fk in req_facts:
                    fv = facts[fk]
                    if not isinstance(fv, dict):
                        errors.append(f'[{rpath}] factualReview.{fk} must be an object')
                        continue
                    fst = fv.get('status')
                    fev_len = len(str(fv.get('evidence') or '').strip())
                    if verdict == 'PASS' or final_fail:
                        allowed_f = ['PASS', 'NA'] if (fk == 'professionalReview' and not spec.get('professionalReviewRequired')) else ['PASS']
                        if final_fail and not (fk == 'professionalReview' and spec.get('professionalReviewRequired')):
                            allowed_f = allowed_f + ['FAIL']
                        if fst not in allowed_f:
                            errors.append(f'[{rpath}] factualReview.{fk}.status is {fst!r}; allowed={allowed_f}')
                        if fev_len < 40:
                            errors.append(f'[{rpath}] factualReview.{fk}.evidence is {fev_len} chars; needs >=40 chars')
                    else:
                        if fst == 'UNREVIEWED' or fev_len < 40:
                            errors.append(f'[{rpath}] factualReview.{fk} must have status PASS/FAIL/NA and >=40-char evidence (got {fst!r}, {fev_len} chars)')

        if verdict == 'FAIL':
            r_findings = rr.get('findings')
            if not isinstance(r_findings, list) or not r_findings:
                errors.append(f'[{rpath}] FAIL verdict requires at least one concrete entry in route findings[]')

    if layer is not None and any(r.get('verdict') == 'PASS' for r in routes):
        if not report.get('workflowPolicySha256'):
            report['workflowPolicySha256'] = layer.policy_hash(root)
        try:
            crp.verify_current_applications(root, snapshot, report.get('reviewer'), report, layer)
        except ValueError as exc:
            errors.append(f'[Layer3 instructionApplications] {exc}')

    raw = crp.canonical(report) + b'\n'
    target_path.parent.mkdir(parents=True, exist_ok=True)
    tmp = target_path.with_name(target_path.name + '.fin-' + uuid.uuid4().hex)
    tmp.write_bytes(raw)
    os.replace(str(tmp), str(target_path))

    if errors:
        raise ValueError('Review validation failed (' + str(len(errors)) + ' issue(s)):\n  - ' + '\n  - '.join(errors))

    return {
        'status': 'ready-to-record',
        'review': str(target_path.resolve().relative_to(root)),
        'syncedProfiles': synced_profiles,
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
    f = sub.add_parser('finalize-review')
    f.add_argument('--snapshot', required=True)
    f.add_argument('--review', required=True)
    f.add_argument('--out', help='Optional output path (defaults to updating --review in place before recording)')
    args = parser.parse_args(argv)
    root = Path(args.root).resolve()
    crp = _load('repo_crp_cli', root / '.claude/tools/content-review-policy.py')
    if args.command == 'reserve-batch':
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
    else:
        result = finalize_review(
            root,
            crp.inside(root, args.snapshot),
            crp.inside(root, args.review),
            crp.inside(root, args.out) if args.out else None,
        )
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError) as error:
        print('BLOCKED: ' + str(error), file=sys.stderr)
        sys.exit(1)
