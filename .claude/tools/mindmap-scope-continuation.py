"""Admit same-intake preparation omitted by a carried first-review guardrail.

This is WRITE admission, never an independent verdict or publication authority.
Existing content reviews, their budgets and all ordinary release checks remain.
"""
import argparse
import copy
import hashlib
import importlib.util
import json
from pathlib import Path

KIND = 'mindmap-guardrail-continuation-v1'


def require(value, message):
    if not value:
        raise ValueError(message)


def read(path):
    return json.loads(path.read_text())


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False,
                                     separators=(',', ':')).encode()).hexdigest()


def reference(root, path):
    path = path.resolve()
    require(root.resolve() in path.parents, 'Continuation evidence escapes repository')
    return {'path': str(path.relative_to(root.resolve())),
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


def artifact(root, ref):
    require(isinstance(ref, dict) and ref.get('path') and ref.get('sha256'),
            'Missing hash-bound continuation evidence')
    path = (root / ref['path']).resolve()
    require(root.resolve() in path.parents and path.is_file(), 'Missing continuation evidence')
    require(reference(root, path)['sha256'] == ref['sha256'], 'Stale continuation evidence')
    return path


def module(root, name):
    spec = importlib.util.spec_from_file_location('continuation_' + name.replace('-', '_'),
                                                root / '.claude/tools' / (name + '.py'))
    obj = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(obj)
    return obj


def normalized(value):
    if isinstance(value, dict):
        if value.get('path') and value.get('sha256'):
            return {'sha256': value['sha256']}
        return {k: normalized(v) for k, v in value.items()}
    if isinstance(value, list):
        return [normalized(v) for v in value]
    return value


def payload(plan):
    value = copy.deepcopy(plan)
    value.get('scopeContinuation', {}).pop('admission', None)
    return digest(value)


def _refs(root, value):
    if isinstance(value, dict):
        if value.get('path') and value.get('sha256'):
            artifact(root, value)
        for item in value.values():
            _refs(root, item)
    elif isinstance(value, list):
        for item in value:
            _refs(root, item)


def proposal_check(root, plan, finding_id, preflight, run_id):
    scope = plan.get('scopeContinuation', {})
    require(scope.get('kind') == 'original-guardrail-preparation-continuation',
            'Unknown substantive continuation kind')
    base = read(artifact(root, scope.get('originalManifest')))
    review = read(artifact(root, scope.get('originalReview')))
    handoff_path = artifact(root, scope.get('originalHandoff'))
    handoff = read(handoff_path)
    require(plan.get('jobId') and plan['jobId'] == base.get('jobId') == review.get('jobId') == handoff.get('jobId'),
            'Continuation cannot change canonical job')
    require(review.get('verdict') == 'FAIL' and review.get('round') == 1
            and str(review.get('reviewCompletionStatus', '')).startswith('complete')
            and review.get('completedAt') and review.get('reviewer') != base.get('author'),
            'Need the actual completed independent first FAIL, never a fabricated PASS/reset')
    gates = module(root, 'mindmap-gates')
    gates.chart(root, base, review)
    require(review.get('liabilityBlock') is not True, 'A liability block cannot admit scope')
    finding = next((f for f in review.get('findings', []) if f.get('id') == finding_id), None)
    require(finding and finding.get('status', 'open') != 'resolved'
            and len(str(finding.get('requiredChange', ''))) >= 40
            and not gates._finding_is_hard_block(finding, check_duplicate=True),
            'Need an actual open carried non-liability/non-duplicate guardrail')
    handoff_api = module(root, 'workflow-handoff')
    handoff_api.handoff_check(root, handoff_path)
    bound = {r.get('sha256') for r in handoff.get('candidates', []) + handoff.get('sources', [])}
    require(scope['originalManifest']['sha256'] in bound and scope['originalReview']['sha256'] in bound,
            'Original reviewed plan/review must belong to the retained canonical handoff')
    pf = module(root, 'workflow-preflight').validate(root, preflight, require_delivery=True)
    if isinstance(pf, tuple):
        pf = pf[0]
    require(pf.get('phase') == 'build' and pf.get('actor') == plan.get('author')
            and pf.get('runId') == run_id, 'Need the actual current author BUILD application/run')
    old = {r['id']: r for r in base['actions']}
    new = {r['id']: r for r in plan['actions']}
    added = set(new) - set(old)
    require(added and added == set(scope.get('newActionIds', [])) and set(old) <= set(new),
            'Name every added action; preserve existing actions')
    for aid, row in old.items():
        require(normalized(row) == normalized(new[aid]), 'Existing approved action changed')
    pruned = {a for c in base.get('candidateDispositions', []) for a in c.get('prunedActionIds', [])}
    require(not added & pruned, 'A pruned action cannot be resurrected')
    old_briefs = {b['actionId']: b for b in base.get('newPageBriefs', [])}
    new_briefs = {b['actionId']: b for b in plan.get('newPageBriefs', [])}
    require(set(new_briefs) == set(old_briefs) | added, 'Missing or extra continuation briefs')
    for aid, brief in old_briefs.items():
        require(normalized(brief) == normalized(new_briefs[aid]), 'Existing generated brief changed')
    allowed = {'actions', 'newPageBriefs', 'preparation', 'evidenceFiles', 'reviewerGuardrails',
               'candidateDispositions', 'request', 'emergingClusters', 'scopeContinuation', 'chartPath'}
    require(all(normalized(base.get(k)) == normalized(plan.get(k)) for k in set(base) | set(plan)
                if k not in allowed), 'Unrelated preparation scope changed')
    old_req, new_req = base['request'], plan['request']
    require(normalized({k: v for k, v in old_req.items() if k != 'requirements'}) ==
            normalized({k: v for k, v in new_req.items() if k != 'requirements'}), 'Original request changed')
    require(len(old_req['requirements']) == len(new_req['requirements']), 'Request requirements changed')
    for a, b in zip(old_req['requirements'], new_req['requirements']):
        require({k: v for k, v in a.items() if k != 'actionIds'} ==
                {k: v for k, v in b.items() if k != 'actionIds'}
                and set(a['actionIds']) <= set(b['actionIds']) <= set(a['actionIds']) | added,
                'Only named continuation actions may extend existing requirement mappings')
    old_dispositions = {c['candidate']: c for c in base.get('candidateDispositions', [])}
    new_dispositions = {c['candidate']: c for c in plan.get('candidateDispositions', [])}
    require(old_dispositions.keys() == new_dispositions.keys(), 'Original intake candidate identities changed')
    mapped = set()
    for cid, a in old_dispositions.items():
        b = new_dispositions[cid]
        a_ids, b_ids = set(a.get('actionIds', [])), set(b.get('actionIds', []))
        require(a_ids <= b_ids <= a_ids | added, 'Candidate action history changed')
        mapped |= b_ids - a_ids
        if b_ids == a_ids:
            require(normalized(a) == normalized(b), 'Unrelated candidate disposition changed')
        else:
            require(b.get('preContinuationReason') == a.get('reason')
                    and all(a.get(k) == b.get(k) for k in a if k not in ('reason', 'actionIds')),
                    'Preserve original candidate reason/prune/history')
    require(mapped == added, 'Every added action must belong to an original candidate')
    require(set(base.get('reviewerGuardrails', [])) <= set(plan.get('reviewerGuardrails', [])),
            'Existing findings/guardrails cannot disappear')
    require(normalized(plan.get('emergingClusters', [])[:len(base.get('emergingClusters', []))]) ==
            normalized(base.get('emergingClusters', [])), 'Original cluster accounting changed')
    _refs(root, plan)
    require({r['sha256'] for r in base.get('evidenceFiles', [])} <=
            {r['sha256'] for r in plan.get('evidenceFiles', [])}, 'Original intake/source evidence dropped')
    gates.chart_structure(root, plan)
    return base, review, handoff, sorted(added), pf


def validate(root, plan, review=None):
    scope = plan.get('scopeContinuation')
    if not scope:
        return None
    receipt = read(artifact(root, scope.get('admission')))
    require(receipt.get('version') == 1 and receipt.get('kind') == KIND
            and receipt.get('status') == 'admitted-to-write-pending-independent-phase4'
            and receipt.get('newIndependentVerdict') is None
            and receipt.get('newReviewRounds') == 0 and receipt.get('contentReviewRequired') is True,
            'Continuation is not an independent PASS or publication authority')
    require(receipt.get('candidatePayloadSha256') == payload(plan), 'Continuation candidate changed')
    pf_path = artifact(root, receipt.get('authorPreflight')).parent
    base, original, h, added, pf = proposal_check(root, plan, receipt.get('guardrailFindingId'),
                                                pf_path, receipt.get('runId'))
    require(receipt.get('jobId') == plan['jobId'] and receipt.get('addedActionIds') == added
            and receipt.get('originalReview') == scope['originalReview']
            and receipt.get('originalManifest') == scope['originalManifest']
            and receipt.get('originalReviewCounters') == h['reviewCounters']
            and receipt.get('independentVerdictRetained') == original['verdict'],
            'Continuation authority/counters changed')
    if review is not None:
        for key in ('jobId', 'reviewer', 'round', 'verdict', 'findings', 'resolvedFindingIds'):
            require(review.get(key) == original.get(key), 'Original independent judgment changed')
        require(review.get('scopeContinuationAdmission') == scope['admission'],
                'Review binding lacks authenticated continuation')
    return receipt


def admit(root, candidate, finding_id, preflight, run_id, manifest_out, review_out, receipt_out, chart_out):
    for path in (manifest_out, review_out, receipt_out, chart_out):
        require(not path.exists(), 'Continuation outputs are immutable; choose new paths')
    plan = read(candidate)
    base, original, handoff, added, pf = proposal_check(root, plan, finding_id, preflight, run_id)
    plan['chartPath'] = str(chart_out.relative_to(root))
    plan['scopeContinuation']['coverageStatus'] = 'admitted-to-write-pending-independent-phase4'
    receipt = {'version': 1, 'kind': KIND, 'status': 'admitted-to-write-pending-independent-phase4',
               'jobId': plan['jobId'], 'runId': run_id, 'guardrailFindingId': finding_id,
               'originalManifest': plan['scopeContinuation']['originalManifest'],
               'originalReview': plan['scopeContinuation']['originalReview'],
               'originalReviewCounters': handoff['reviewCounters'],
               'authorPreflight': reference(root, preflight / 'manifest.json'),
               'addedActionIds': added, 'independentVerdictRetained': original['verdict'],
               'newIndependentVerdict': None, 'newReviewRounds': 0, 'contentReviewRequired': True,
               'candidatePayloadSha256': payload(plan)}
    receipt_out.parent.mkdir(parents=True, exist_ok=True)
    receipt_out.write_text(json.dumps(receipt, indent=2) + '\n')
    plan['scopeContinuation']['admission'] = reference(root, receipt_out)
    review = copy.deepcopy(original)
    gates = module(root, 'mindmap-gates')
    review.update(manifestSha256=gates.digest(plan), manifestFileSha256=None,
                  readinessSha256=reference(root, gates.chart_structure(root, plan))['sha256'],
                  scopeContinuationAdmission=plan['scopeContinuation']['admission'])
    validate(root, plan, review)
    manifest_out.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + '\n')
    review['manifestFileSha256'] = reference(root, manifest_out)['sha256']
    review_out.write_text(json.dumps(review, indent=2, ensure_ascii=False) + '\n')
    chart_out.parent.mkdir(parents=True, exist_ok=True)
    chart_out.write_text(gates.render(plan))
    gates.chart(root, plan, review)
    return receipt


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('candidate', 'finding-id', 'preflight', 'run-id', 'out-manifest',
                 'out-review', 'out-admission', 'out-chart'):
        parser.add_argument('--' + name, required=True)
    args = parser.parse_args()
    root = Path.cwd().resolve()
    print(json.dumps(admit(root, (root / args.candidate).resolve(), args.finding_id,
                           (root / args.preflight).resolve(), args.run_id,
                           (root / args.out_manifest).resolve(), (root / args.out_review).resolve(),
                           (root / args.out_admission).resolve(), (root / args.out_chart).resolve()), indent=2))
