"""Portable canonical handoffs using the verified native validators and snapshot logic."""
import argparse,copy,datetime,hashlib,importlib.util,json,os,uuid
import re
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[2]
def require(ok,message):
    if not ok:raise ValueError(message)
def read(path):return json.loads(Path(path).read_bytes())
def sha(raw):return hashlib.sha256(raw).hexdigest()
def inside(root,rel):
    path=(root/rel).resolve()
    require(root.resolve() in path.parents,'Keep workflow artifacts inside the active repository')
    return path
def evidence_ref(root, ref):
    require(isinstance(ref, dict) and set(ref) >= {'path', 'sha256'}, 'Missing hash-bound artifact')
    path = inside(root, ref['path'])
    require(sha(path.read_bytes()) == ref['sha256'], 'Changed handoff evidence: ' + ref['path'])
    return path


def client_service_release_check(root, h, snapshot, renderer):
    """Owner two-attempt service release is separate from an editorial PASS."""
    release = read(evidence_ref(root, h['reviewRelease']))
    require(release.get('status') == 'client-review-release' and
            release.get('policy') == 'owner-client-correction-release-2026-11-05.1', 'unknown client-service release')
    contract = evidence_ref(root, release.get('policyContract'))
    require(contract == (root / '.claude/commands/_client-delivery-review.md').resolve() and
            'Client corrections — direct owner clarification, 2026-11-05' in contract.read_text(),
            'current owner client-correction policy required')
    rows = read(root / 'scripts/paid_placements/fix-queue.json')
    row = next((r for r in rows if h['jobId'] == 'service:' + str(r.get('id'))), None)
    require(row and row.get('kind') == 'factualCorrection' and row.get('serviceSla') and
            row.get('sourceMessageId') == release.get('sourceMessageId') and
            re.fullmatch(r'[a-f0-9]{16}', str(row.get('sourceMessageId', ''))) and
            row.get('threadId') and row.get('vendorEmail') and row.get('requestText'),
            'existing source-backed canonical client correction required')
    require(not any(row.get(k) for k in ('test', 'sourceHold', 'ownerReviewHold', 'customerReviewBeforePublish',
            'customerApprovalRequired', 'professionalReviewPending', 'optOut', 'suppression', 'cancelledAt')) and
            not (row.get('professionalReviewRequired') and row.get('professionalReviewStatus') not in ('approved', 'PASS')),
            'client-service release cannot override a protected dependency')
    require(release.get('dueAt') == row.get('dueAt') and h['reviewCounters']['reworks'] >= 2,
            'retain service deadline and actual capped rework history')
    refs = release.get('reviewHistory') or []
    require(len(refs) >= 2 and len({r.get('sha256') for r in refs}) == len(refs) and
            len(refs) == h['reviewCounters']['reviews'], 'retain actual independent review history')
    reports = [read(evidence_ref(root, ref)) for ref in refs]
    require(all(r.get('reviewer') and r.get('sourceMessageId') == row['sourceMessageId'] and
            r.get('verdict') in ('PASS', 'FAIL') for r in reports), 'actual source-specific independent verdicts required')
    latest = read(evidence_ref(root, h.get('review')))
    require(latest == reports[-1] and latest.get('verdict') == release.get('priorVerdictRetained'),
            'latest actual editorial verdict must remain honest')
    renderer.valid_snapshot(snapshot)
    paths = {r['path'] for r in snapshot['routes']}
    require(paths == set(h['routes']) == {r['path'] for r in latest['routes']} and
            release.get('latestCandidateSnapshotSha256') == snapshot['snapshotSha256'] and
            release.get('priorSnapshotSha256') == latest.get('snapshotSha256'), 'client service candidate/scope changed')
    required = {urlsplit(u).path.rstrip('/') for u in row.get('affectedPages', []) + [row.get('pageUrl', '')] if u}
    require(required <= paths, 'client service omitted an affected page')
    checks = release.get('latestCandidateChecks') or []
    require({r.get('path') for r in checks} == paths and len(checks) == len(paths) and
            all(r.get('status') == 200 and r.get('requiredText') and r.get('forbiddenTextAbsent') and
                r.get('unsupportedHumanReviewCreditAbsent') and
                r.get('fingerprint') == next(p['fingerprint'] for p in snapshot['routes'] if p['path'] == r['path'])
                for r in checks), 'retain exact mechanical/source/attribution checks for every released route')
    require(urlsplit(h['canonicalBase']).scheme == 'https' and h['canonicalBase'] == snapshot['manifest']['canonicalBase'],
            'service handoff must use its actual captured canonical origin')


def preparation_scope_check(root, h, old, phase):
    """Reconcile researched targets before approval without resetting a job."""
    require(phase not in ['write', 'publish'], 'Route changes cannot begin writing or publication')
    for start in [h, old]:
        current = start
        while current:
            require(not any(current.get(k) for k in
                            ['publicationAuthority', 'phase0Approval', 'approval', 'reviewRelease', 'snapshot', 'review']),
                    'Approved or reviewed route scope is locked')
            for ref in current.get('sources', []) + current.get('candidates', []):
                require(not re.search(r'phase[-_]?0[-_]approval', Path(ref['path']).name, re.I),
                        'Approval evidence locks route scope')
                if not ref['path'].endswith('.json'):
                    continue
                artifact = evidence_ref(root, ref)
                try:
                    record = read(artifact)
                except (json.JSONDecodeError, UnicodeDecodeError):
                    continue
                require(not (isinstance(record, dict) and record.get('jobId') == h['jobId'] and
                             any(record.get(k) for k in ['approvedManifest', 'approvalSource'])),
                        'Approval evidence locks route scope')
            current = read(evidence_ref(root, current['previous'])) if current.get('previous') else None
    receipt = read(evidence_ref(root, h.get('preparationScopeChange')))
    before, after = set(old['routes']), set(h['routes'])
    require(receipt.get('version') == 1 and receipt.get('kind') == 'preparation-route-reconciliation' and
            receipt.get('jobId') == h['jobId'] and receipt.get('previousHandoff') == h['previous'],
            'Scope reconciliation must bind this exact canonical history')
    require(set(receipt.get('fromRoutes', [])) == before and set(receipt.get('toRoutes', [])) == after,
            'Scope reconciliation routes do not match')
    expected = {(r, 'add') for r in after - before} | {(r, 'remove') for r in before - after}
    changes = receipt.get('changes', [])
    require(isinstance(changes, list) and all(isinstance(c, dict) for c in changes) and
            len(changes) == len(expected) and
            {(c.get('route'), c.get('action')) for c in changes} == expected,
            'Every route addition and removal needs an explicit reconciliation')
    for change in changes:
        require(isinstance(change.get('reason'), str) and len(change['reason'].strip()) >= 30 and
                isinstance(change.get('evidence'), list) and change['evidence'],
                'Route reconciliation needs a concrete reason and inspected evidence')
        for ref in change['evidence']:
            evidence_ref(root, ref)


def handoff_check(root, path, actor=None, phase=None, visited=None):
    visited = set() if visited is None else set(visited)
    key = str(path.resolve())
    require(key not in visited, 'Circular handoff history')
    visited.add(key)
    h = read(path)
    origin=urlsplit(h.get('canonicalBase',''))
    require(h.get('version')==1 and h.get('siteId')==read(root/'.claude/content-review-policy.json')['siteId'],
            'Handoff belongs to another site or protocol')
    require(origin.scheme=='https' and origin.hostname and not origin.username and not origin.password
            and origin.port in (None,443) and not origin.path.strip('/') and not origin.query and not origin.fragment,
            'Use the actual canonical HTTPS origin')
    for name in ['jobId', 'producer', 'nextAction']:
        require(isinstance(h.get(name), str) and h[name].strip(), 'Missing handoff ' + name)
    require(h.get('routes') and len(h['routes']) == len(set(h['routes'])), 'Missing or duplicate handoff routes')
    require(h.get('candidates'), 'Handoff must identify the current candidate or preparation artifacts')
    for ref in h['candidates']:
        evidence_ref(root, ref)
    require(isinstance(h.get('sources'), list) and isinstance(h.get('findings'), list), 'Missing source/finding ledger')
    for source in h['sources']:
        evidence_ref(root, source)
        for field in ['checkedAt', 'refreshWhen', 'scope']:
            require(isinstance(source.get(field), str) and len(source[field].strip()) >= 8, 'Missing source freshness/scope')
    counters = h.get('reviewCounters', {})
    require(set(counters) == {'reviews', 'reworks'} and all(type(v) is int and v >= 0 for v in counters.values()),
            'Preserve the actual review/rework counters')
    ids = [f.get('id') for f in h['findings']]
    require(all(ids) and len(ids) == len(set(ids)), 'Findings need unique stable identities')
    for finding in h['findings']:
        require(finding.get('status') in ['open', 'resolved'] and len(finding.get('evidence', '').strip()) >= 30,
                'Findings must preserve status and concrete evidence')
    if h.get('previous'):
        old = handoff_check(root, evidence_ref(root, h['previous']), visited=visited)
        require(h['jobId'] == old['jobId'] and h['canonicalBase']==old['canonicalBase'], 'Canonical job identity changed')
        if set(h['routes']) != set(old['routes']):
            preparation_scope_check(root, h, old, phase)
        require(all(counters[k] >= old['reviewCounters'][k] for k in counters), 'Review counters cannot reset')
        require({f['id'] for f in old['findings']} <= set(ids), 'Prior findings cannot disappear')
    if phase == 'audit':
        require(actor != h['producer'], 'Independent reviewer cannot review their own handoff')
    if phase == 'publish':
        spec = importlib.util.spec_from_file_location('handoff_renderer', root / '.claude/tools/rendered-audit.py')
        renderer = importlib.util.module_from_spec(spec); spec.loader.exec_module(renderer)
        snapshot = read(evidence_ref(root, h.get('snapshot')))
        if h.get('reviewRelease'):
            release = read(evidence_ref(root, h['reviewRelease']))
            if release.get('kind') == 'source-approved-capped-paid-resume-v1':
                spec = importlib.util.spec_from_file_location('approved_paid_draft_release',
                    root / 'scripts/paid_placements/approved_draft_release.py')
                paid_resume = importlib.util.module_from_spec(spec); spec.loader.exec_module(paid_resume)
                paid_resume.publish_check(root, h, snapshot, renderer)
            else:
                client_service_release_check(root, h, snapshot, renderer)
        else:
            renderer.review_check(snapshot, read(evidence_ref(root, h.get('review'))))
    return h


def exclusive(path, raw, local):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('xb') as stream:
        stream.write(raw)
    local.require(path.read_bytes() == raw, 'Artifact write did not preserve exact bytes')


def snapshot(root, path, directory, local, expected=None):
    raw = path.read_bytes()
    digest = local.sha(raw)
    local.require(expected is None or digest == expected, 'Changed input; never rebind a stale evidence hash: ' + str(path))
    target = directory / 'blobs' / digest / path.name
    if target.exists():
        local.require(target.read_bytes() == raw, 'Immutable snapshot was changed')
    else:
        try:
            exclusive(target, raw, local)
        except FileExistsError:
            local.require(target.read_bytes() == raw, 'Concurrent snapshot collision')
    return {'path': str(target.resolve().relative_to(root.resolve())), 'sha256': digest,
            'originPath': str(path.resolve().relative_to(root.resolve()))}


def write_json(path, value, local):
    exclusive(path, (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode(), local)


def seal(root, draft, out, local, actor=None, phase=None):
    local.require(not out.exists() and draft != out, 'Handoffs are immutable; use a new output path')
    # Validate BEFORE reading/snapshotting refs. A stale old hash is never repaired
    # by silently substituting today's file. Previous chains must already be valid.
    local.handoff_check(root, draft, actor=actor, phase=phase)
    value = copy.deepcopy(local.read(draft))
    for collection in ('candidates', 'sources'):
        value[collection] = [{**ref, **snapshot(root, local.evidence_ref(root, ref), out.parent, local, ref['sha256']),
                              'originPath': ref.get('originPath', ref['path'])}
                             for ref in value[collection]]
    for field in ('previous', 'snapshot', 'review', 'reviewRelease'):
        if value.get(field):
            ref = value[field]
            value[field] = {**ref, **snapshot(root, local.evidence_ref(root, ref), out.parent, local, ref['sha256']),
                            'originPath': ref.get('originPath', ref['path'])}
    # Validate the complete snapshotted chain before a final filename is visible.
    # Link is atomic and refuses to overwrite a competing worker's output.
    pending = out.with_name(out.name + '.pending-' + uuid.uuid4().hex)
    try:
        write_json(pending, value, local)
        local.handoff_check(root, pending, actor=actor, phase=phase)
        os.link(pending, out)
    finally:
        if pending.exists():
            pending.unlink()
    return value


def reconcile_findings(root, current, authority, out, local):
    """Apply only an independent review's explicit resolutions; grants no approval."""
    local.require(current != out and not out.exists(), 'Keep the current handoff immutable; choose a new output')
    raw = current.read_bytes()
    local.handoff_check(root, current)
    local.require(current.read_bytes() == raw, 'Handoff changed during reconciliation')
    value = copy.deepcopy(json.loads(raw))
    review_raw = authority.read_bytes()
    review = json.loads(review_raw)
    local.require(isinstance(review, dict), 'Resolution authority must be a review object')
    local.require(review.get('verdict') == 'PASS' and isinstance(review.get('reviewer'), str)
                  and review['reviewer'].strip() and review['reviewer'] != value['producer'],
                  'Actual independent PASS authority is required; producer cannot resolve its own findings')
    local.require(review.get('jobId') == value['jobId'], 'Resolution authority belongs to another canonical job')
    # Mindmap gate reviews bind the canonical parsed-JSON digest; handoff refs
    # separately bind raw file bytes. They are deliberately different hashes.
    matched = []
    for candidate_ref in value['candidates']:
        try:
            candidate = local.read(local.evidence_ref(root, candidate_ref))
        except (ValueError, UnicodeError):
            continue
        if (isinstance(candidate, dict) and isinstance(candidate.get('actions'), list)
                and isinstance(candidate.get('preparation'), dict)
                and local.object_sha(candidate) == review.get('manifestSha256')):
            matched.append(candidate)
    local.require(bool(matched), 'Resolution authority must bind the exact current canonical preparation manifest')
    local.require(matched[0].get('jobId') in (None, value['jobId']), 'Preparation manifest belongs to another job')
    local.require(review['reviewer'] != matched[0].get('author'), 'Manifest author cannot resolve its own findings')
    ids = review.get('resolvedFindingIds')
    local.require(isinstance(ids, list) and ids and all(isinstance(i, str) and i for i in ids)
                  and len(ids) == len(set(ids)), 'Review must explicitly list unique resolved finding IDs; PASS alone resolves nothing')
    known = {finding['id'] for finding in value['findings']}
    local.require(set(ids) <= known, 'Resolution authority names unknown findings')
    review_findings = review.get('findings', [])
    local.require(isinstance(review_findings, list) and all(isinstance(f, dict) for f in review_findings),
                  'Review findings must be a list of objects')
    for finding in review_findings:
        if finding.get('id') in ids:
            local.require(finding.get('status') == 'resolved', 'Review declares a contradictory finding status')
    ref = snapshot(root, authority, out.parent, local, local.sha(review_raw))
    previous = snapshot(root, current, out.parent, local, local.sha(raw))
    value['previous'] = previous
    value['sources'].append({**ref, 'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                             'refreshWhen': 'If the independently reviewed candidate changes',
                             'scope': 'Independent preparation review and explicit finding resolutions'})
    for finding in value['findings']:
        if finding['id'] in ids:
            finding['status'] = 'resolved'
            finding['resolutionAuthority'] = ref
            finding['evidence'] += ' | Resolved by independent review: ' + ref['path'] + ' (' + ref['sha256'] + ')'
    pending = out.with_name(out.name + '.resolution-draft-' + uuid.uuid4().hex)
    try:
        write_json(pending, value, local)
        seal(root, pending, out, local)
    finally:
        if pending.exists():
            pending.unlink()
    return {'handoff': str(out.relative_to(root)), 'resolvedFindingIds': ids,
            'approval': 'none; synchronized explicit independent review metadata only'}


def api():
    return SimpleNamespace(require=require,read=read,sha=sha,inside=inside,evidence_ref=evidence_ref,handoff_check=handoff_check,object_sha=lambda value:sha(json.dumps(value,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()))

def focused(root,path,stage,actor=None):
    h=handoff_check(root,path,actor=actor,phase=stage)
    return {k:v for k,v in h.items() if k not in ('previous','findings')} | {
        'findings':[f for f in h['findings'] if f['status']=='open'],
        'resolvedFindingIds':[f['id'] for f in h['findings'] if f['status']=='resolved'],
        'handoff':{'path':str(path.relative_to(root)),'sha256':sha(path.read_bytes())}}

def main():
    parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='command',required=True)
    q=sub.add_parser('seal');q.add_argument('--draft',required=True);q.add_argument('--out',required=True)
    q=sub.add_parser('check');q.add_argument('--handoff',required=True)
    q=sub.add_parser('reconcile-findings');q.add_argument('--handoff',required=True);q.add_argument('--review',required=True);q.add_argument('--out',required=True)
    q=sub.add_parser('snapshot');q.add_argument('--file',required=True);q.add_argument('--directory',required=True)
    args=parser.parse_args()
    if args.command=='seal':seal(ROOT,inside(ROOT,args.draft),inside(ROOT,args.out),api())
    elif args.command=='check':
        h=handoff_check(ROOT,inside(ROOT,args.handoff));print(json.dumps({'jobId':h['jobId'],'status':'evidence-current-not-an-approval'}))
    elif args.command=='snapshot':print(json.dumps(snapshot(ROOT,inside(ROOT,args.file),inside(ROOT,args.directory),api())))
    else:reconcile_findings(ROOT,inside(ROOT,args.handoff),inside(ROOT,args.review),inside(ROOT,args.out),api())
if __name__=='__main__':main()
