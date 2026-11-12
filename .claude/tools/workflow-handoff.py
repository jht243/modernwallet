"""Portable canonical handoffs using the verified native validators and snapshot logic."""
import argparse, copy, datetime, hashlib, importlib.util, json, os, re, uuid
from pathlib import Path
from types import SimpleNamespace
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]


def require(ok, message):
    if not ok:
        raise ValueError(message)


def read(path):
    return json.loads(Path(path).read_bytes())


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def inside(root, rel):
    path = (root / rel).resolve()
    require(root.resolve() in path.parents, 'Keep workflow artifacts inside the active repository')
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
    origin = urlsplit(h.get('canonicalBase', ''))
    require(h.get('version') == 1 and h.get('siteId') == read(root / '.claude/content-review-policy.json')['siteId'],
            'Handoff belongs to another site or protocol')
    require(origin.scheme == 'https' and origin.hostname and not origin.username and not origin.password
            and origin.port in (None, 443) and not origin.path.strip('/') and not origin.query and not origin.fragment,
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
        require(h['jobId'] == old['jobId'] and h['canonicalBase'] == old['canonicalBase'], 'Canonical job identity changed')
        if set(h['routes']) != set(old['routes']):
            preparation_scope_check(root, h, old, phase)
        require(all(counters[k] >= old['reviewCounters'][k] for k in counters), 'Review counters cannot reset')
        require({f['id'] for f in old['findings']} <= set(ids), 'Prior findings cannot disappear')
    if phase == 'audit':
        require(actor != h['producer'], 'Independent reviewer cannot review their own handoff')
    if phase == 'publish':
        spec = importlib.util.spec_from_file_location('handoff_renderer', root / '.claude/tools/rendered-audit.py')
        renderer = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(renderer)
        snapshot = read(evidence_ref(root, h.get('snapshot')))
        if h.get('reviewRelease'):
            release = read(evidence_ref(root, h['reviewRelease']))
            if release.get('kind') == 'source-approved-capped-paid-resume-v1':
                spec = importlib.util.spec_from_file_location('approved_paid_draft_release',
                                                              root / 'scripts/paid_placements/approved_draft_release.py')
                paid_resume = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(paid_resume)
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
    return SimpleNamespace(
        require=require,
        read=read,
        sha=sha,
        inside=inside,
        evidence_ref=evidence_ref,
        handoff_check=handoff_check,
        object_sha=lambda value: sha(json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()),
    )


def focused(root, path, stage, actor=None):
    h = handoff_check(root, path, actor=actor, phase=stage)
    return {k: v for k, v in h.items() if k not in ('previous', 'findings')} | {
        'findings': [f for f in h['findings'] if f['status'] == 'open'],
        'resolvedFindingIds': [f['id'] for f in h['findings'] if f['status'] == 'resolved'],
        'handoff': {'path': str(path.resolve().relative_to(root.resolve())), 'sha256': sha(path.read_bytes())},
    }


def _resolve_site_origin(root, snapshot_obj=None, previous_obj=None):
    site_id = None
    crp_path = root / '.claude/content-review-policy.json'
    crp_cfg = read(crp_path) if crp_path.is_file() else {}
    if isinstance(crp_cfg.get('siteId'), str) and crp_cfg['siteId'].strip():
        site_id = crp_cfg['siteId'].strip()
    if previous_obj and previous_obj.get('canonicalBase'):
        return site_id, previous_obj['canonicalBase']
    if snapshot_obj and isinstance(snapshot_obj.get('manifest'), dict) and snapshot_obj['manifest'].get('canonicalBase'):
        return site_id, snapshot_obj['manifest']['canonicalBase']
    local_path = root / '.claude/workflow-policy.local.json'
    if local_path.is_file():
        local_cfg = read(local_path)
        if isinstance(local_cfg.get('canonicalBase'), str) and local_cfg['canonicalBase'].startswith('https://'):
            return site_id, local_cfg['canonicalBase']
    hosts = crp_cfg.get('canonicalHosts') or []
    if hosts:
        non_www = [h for h in hosts if isinstance(h, str) and not h.startswith('www.')]
        chosen = non_www[0] if non_www else hosts[0]
        return site_id, 'https://' + chosen
    raise ValueError('Cannot determine canonicalBase; configure .claude/content-review-policy.json canonicalHosts')


def _extract_routes(manifest_obj, snapshot_obj=None, explicit_routes=()):
    if explicit_routes:
        routes = [r.strip() for r in explicit_routes if r and r.strip()]
    else:
        routes = []
        for act in manifest_obj.get('actions', []):
            if not isinstance(act, dict) or act.get('bucket') == 'consolidation advisory':
                continue
            target = str(act.get('target') or '').strip()
            if target.startswith('/'):
                clean_route = target.split('#', 1)[0].split('?', 1)[0]
                if clean_route:
                    routes.append(clean_route)
        for brief in manifest_obj.get('newPageBriefs', []):
            if isinstance(brief, dict):
                target = str(brief.get('target') or '').strip()
                if target.startswith('/'):
                    routes.append(target.split('#', 1)[0].split('?', 1)[0])
        if snapshot_obj and isinstance(snapshot_obj.get('routes'), list):
            for r in snapshot_obj['routes']:
                if isinstance(r, dict) and str(r.get('path') or '').startswith('/'):
                    routes.append(r['path'])
    deduped = list(dict.fromkeys(routes))
    require(bool(deduped), 'No route paths starting with "/" found in approval manifest; pass --route /actual-route explicitly')
    return deduped


def auto_seal(root, phase, manifest_path, producer, out_path, job_id=None, previous_path=None,
              snapshot_path=None, review_path=None, chart_review_path=None, readiness_path=None,
              extra_candidates=(), extra_sources=(), explicit_routes=(), next_action=None,
              actor=None, pack_out=None, rework=False):
    """Build, validate, and seal a canonical stage handoff (plus optional focused packet) in 1 command."""
    require(not out_path.exists(), 'Handoffs are immutable; use a new output path: ' + str(out_path))
    manifest_obj = read(manifest_path)
    prev_obj = read(previous_path) if previous_path else None
    snap_obj = read(snapshot_path) if snapshot_path else None
    rev_obj = read(review_path) if review_path else None

    site_id, canonical_base = _resolve_site_origin(root, snap_obj, prev_obj)
    resolved_job = (job_id or (prev_obj or {}).get('jobId') or manifest_obj.get('jobId') or '').strip()
    require(bool(resolved_job), 'Missing jobId in approval-manifest.json; pass --job-id explicitly')
    require(isinstance(producer, str) and producer.strip(), 'Provide a non-empty --producer identity')

    routes = list(prev_obj['routes']) if prev_obj else _extract_routes(manifest_obj, snap_obj, explicit_routes)
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    def make_ref(p):
        resolved = p.resolve()
        require(resolved.is_file() and root.resolve() in resolved.parents, 'Artifact must exist inside repository: ' + str(p))
        return {'path': str(resolved.relative_to(root.resolve())), 'sha256': sha(resolved.read_bytes())}

    cand_paths = [manifest_path.resolve()]
    chart_rel = manifest_obj.get('chartPath')
    if isinstance(chart_rel, str) and chart_rel.strip():
        cp = (root / chart_rel).resolve()
        if cp.is_file() and root.resolve() in cp.parents:
            cand_paths.append(cp)
    for extra in extra_candidates:
        cand_paths.append(extra.resolve())
    if snapshot_path:
        cand_paths.append(snapshot_path.resolve())
    candidates = [make_ref(p) for p in dict.fromkeys(cand_paths)]

    sources_by_path = {}
    if prev_obj:
        for s in prev_obj.get('sources', []):
            sp = inside(root, s['path'])
            if sp.is_file() and sha(sp.read_bytes()) == s.get('sha256'):
                sources_by_path[str(sp)] = dict(s)

    def add_source(p, scope_desc):
        if p is None:
            return
        rp = p.resolve()
        if not rp.is_file() or root.resolve() not in rp.parents or str(rp) in sources_by_path:
            return
        sources_by_path[str(rp)] = {
            **make_ref(rp),
            'checkedAt': now_iso,
            'refreshWhen': 'Whenever primary evidence or approved plan changes',
            'scope': scope_desc,
        }

    if readiness_path:
        add_source(readiness_path, 'Preparation readiness checklist and evidence verification')
    else:
        prep_ref = (manifest_obj.get('preparation') or {}).get('readiness')
        if isinstance(prep_ref, dict) and prep_ref.get('path'):
            add_source(inside(root, prep_ref['path']), 'Preparation readiness checklist and evidence verification')
        elif (manifest_path.parent / 'readiness.md').is_file():
            add_source(manifest_path.parent / 'readiness.md', 'Preparation readiness checklist and evidence verification')

    if chart_review_path:
        add_source(chart_review_path, 'Independent chart review approval and obligation verification')
    elif (manifest_path.parent / 'chart-review.json').is_file():
        add_source(manifest_path.parent / 'chart-review.json', 'Independent chart review approval and obligation verification')

    req_ref = (manifest_obj.get('request') or {}).get('source')
    if isinstance(req_ref, dict) and req_ref.get('path'):
        add_source(inside(root, req_ref['path']), 'Original intake brief and candidate scope record')

    for ev in manifest_obj.get('evidenceFiles', []):
        if isinstance(ev, dict) and ev.get('path'):
            add_source(inside(root, ev['path']), 'Inspected primary-source and preparation evidence')
    for s_extra in extra_sources:
        add_source(s_extra, 'Supplementary verified stage evidence artifact')

    counters = copy.deepcopy(prev_obj['reviewCounters']) if prev_obj else {'reviews': 0, 'reworks': 0}
    findings = copy.deepcopy(prev_obj['findings']) if prev_obj else []
    known_ids = {f['id'] for f in findings}

    if rev_obj is not None:
        add_source(review_path, 'Recorded independent Phase 4 rendered-page audit report')
        if phase in ('write', 'publish'):
            prev_rev_sha = (prev_obj or {}).get('review', {}).get('sha256') if prev_obj else None
            cur_rev_sha = sha(review_path.read_bytes())
            if prev_rev_sha != cur_rev_sha:
                counters['reviews'] += 1
        if phase == 'write':
            for r_idx, r_item in enumerate(rev_obj.get('routes', []), 1):
                for f_idx, f_item in enumerate(r_item.get('findings', []), 1):
                    if isinstance(f_item, dict):
                        fid = str(f_item.get('id') or f'R{counters["reviews"]}-{r_idx}-F{f_idx}')
                        raw_ev = str(f_item.get('evidence') or f_item.get('description') or f_item.get('fix') or json.dumps(f_item))
                    else:
                        fid = f'R{counters["reviews"]}-{r_idx}-F{f_idx}'
                        raw_ev = str(f_item)
                    if len(raw_ev.strip()) < 30:
                        raw_ev = f'Route {r_item.get("path", "/")} audit finding: {raw_ev.strip()} (requires targeted fix)'
                    if fid not in known_ids:
                        findings.append({'id': fid, 'status': 'open', 'evidence': raw_ev})
                        known_ids.add(fid)
                for group_name in ('checks', 'factualReview'):
                    group = r_item.get(group_name)
                    if not isinstance(group, dict):
                        continue
                    for ck, cv in group.items():
                        if isinstance(cv, dict) and cv.get('status') == 'FAIL':
                            fid = f'R{counters["reviews"]}-{r_idx}-{group_name}-{ck}'
                            raw_ev = str(cv.get('evidence') or f'{group_name}.{ck} failed independent audit')
                            if len(raw_ev.strip()) < 30:
                                raw_ev = f'Route {r_item.get("path", "/")} {group_name}.{ck} FAIL: {raw_ev.strip()}'
                            if fid not in known_ids:
                                findings.append({'id': fid, 'status': 'open', 'evidence': raw_ev})
                                known_ids.add(fid)

    if phase == 'audit' and rework:
        counters['reworks'] += 1

    default_actions = {
        'write': 'Execute approved Mindmap write actions, lint, and capture local rendered preview.',
        'audit': 'Independently audit captured rendered Mindmap routes against primary sources and editorial standards.',
        'publish': 'Publish exact independently reviewed Mindmap output to main and verify live.',
    }
    draft = {
        'version': 1,
        'canonicalBase': canonical_base,
        'jobId': resolved_job,
        'producer': producer.strip(),
        'routes': routes,
        'nextAction': (next_action or default_actions[phase]).strip(),
        'candidates': candidates,
        'sources': list(sources_by_path.values()),
        'findings': findings,
        'reviewCounters': counters,
    }
    if site_id:
        draft['siteId'] = site_id
    if previous_path:
        draft['previous'] = make_ref(previous_path)
    if snapshot_path:
        draft['snapshot'] = make_ref(snapshot_path)
    if review_path and phase == 'publish':
        draft['review'] = make_ref(review_path)

    is_layer3_local = False
    local_cfg_path = root / '.claude/workflow-policy.local.json'
    if local_cfg_path.is_file() and (root / '.claude/tools/workflow-dispatch.local.py').is_file():
        try:
            is_layer3_local = read(local_cfg_path).get('site') == 'layer3labs'
        except ValueError:
            is_layer3_local = False

    pending_draft = out_path.with_name(out_path.name + '.autodraft-' + uuid.uuid4().hex + '.json')
    try:
        if is_layer3_local:
            spec_l = importlib.util.spec_from_file_location('auto_local', root / '.claude/tools/workflow-local.py')
            local_mod = importlib.util.module_from_spec(spec_l); spec_l.loader.exec_module(local_mod)
            spec_d = importlib.util.spec_from_file_location('auto_dispatch', root / '.claude/tools/workflow-dispatch.local.py')
            disp_mod = importlib.util.module_from_spec(spec_d); spec_d.loader.exec_module(disp_mod)
            write_json(pending_draft, draft, local_mod)
            sealed = disp_mod.seal(root, pending_draft, out_path, local_mod, actor=actor, phase=phase)
            if pack_out:
                spec_c = importlib.util.spec_from_file_location('auto_ctx', root / '.claude/tools/workflow-context.py')
                ctx_mod = importlib.util.module_from_spec(spec_c); spec_c.loader.exec_module(ctx_mod)
                pkt = ctx_mod.projection(root, out_path, phase, local_mod)
                write_json(pack_out, pkt, local_mod)
                ctx_mod.check(root, pack_out, out_path, phase, local_mod)
        else:
            helper_api = api()
            write_json(pending_draft, draft, helper_api)
            sealed = seal(root, pending_draft, out_path, helper_api, actor=actor, phase=phase)
            if pack_out:
                pkt = focused(root, out_path, phase, actor)
                write_json(pack_out, pkt, helper_api)
    finally:
        if pending_draft.exists():
            pending_draft.unlink()

    res = {
        'status': 'sealed',
        'phase': phase,
        'jobId': resolved_job,
        'handoff': str(out_path.resolve().relative_to(root.resolve())),
        'routes': routes,
        'reviewCounters': sealed['reviewCounters'],
        'openFindings': sum(1 for f in sealed['findings'] if f.get('status') == 'open'),
    }
    if pack_out:
        res['contextPacket'] = str(pack_out.resolve().relative_to(root.resolve()))
    return res


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    q = sub.add_parser('seal'); q.add_argument('--draft', required=True); q.add_argument('--out', required=True)
    q = sub.add_parser('auto-seal')
    q.add_argument('--phase', choices=['write', 'audit', 'publish'], required=True)
    q.add_argument('--manifest', required=True, help='Path to approval-manifest.json')
    q.add_argument('--producer', required=True, help='Actor identity sealing this handoff')
    q.add_argument('--out', required=True, help='Immutable output handoff JSON path')
    q.add_argument('--job-id', help='Explicit jobId (defaults to approval-manifest.json jobId)')
    q.add_argument('--previous', help='Previous sealed handoff JSON path')
    q.add_argument('--snapshot', help='Captured rendered snapshot JSON path')
    q.add_argument('--review', help='Recorded Phase 4 review JSON path')
    q.add_argument('--chart-review', help='Independent chart-review.json path')
    q.add_argument('--readiness', help='Preparation readiness.md path')
    q.add_argument('--candidate', action='append', default=[], help='Additional candidate file path (repeatable)')
    q.add_argument('--source', action='append', default=[], help='Additional source evidence file path (repeatable)')
    q.add_argument('--route', action='append', default=[], help='Explicit route override when manifest targets are file paths')
    q.add_argument('--next-action', help='Custom nextAction summary')
    q.add_argument('--actor', help='Target stage actor for immediate independence check')
    q.add_argument('--pack-out', help='Optional focused context-packet JSON output path')
    q.add_argument('--rework', action='store_true', help='Increment rework counter for a Round-2+ rework handoff')
    q = sub.add_parser('check'); q.add_argument('--handoff', required=True)
    q = sub.add_parser('reconcile-findings'); q.add_argument('--handoff', required=True); q.add_argument('--review', required=True); q.add_argument('--out', required=True)
    q = sub.add_parser('snapshot'); q.add_argument('--file', required=True); q.add_argument('--directory', required=True)
    args = parser.parse_args(argv)
    if args.command == 'seal':
        seal(ROOT, inside(ROOT, args.draft), inside(ROOT, args.out), api())
    elif args.command == 'auto-seal':
        res = auto_seal(
            ROOT, args.phase, inside(ROOT, args.manifest), args.producer, inside(ROOT, args.out),
            job_id=args.job_id,
            previous_path=inside(ROOT, args.previous) if args.previous else None,
            snapshot_path=inside(ROOT, args.snapshot) if args.snapshot else None,
            review_path=inside(ROOT, args.review) if args.review else None,
            chart_review_path=inside(ROOT, args.chart_review) if args.chart_review else None,
            readiness_path=inside(ROOT, args.readiness) if args.readiness else None,
            extra_candidates=[inside(ROOT, c) for c in args.candidate],
            extra_sources=[inside(ROOT, s) for s in args.source],
            explicit_routes=args.route,
            next_action=args.next_action,
            actor=args.actor,
            pack_out=inside(ROOT, args.pack_out) if args.pack_out else None,
            rework=args.rework,
        )
        print(json.dumps(res, indent=2))
    elif args.command == 'check':
        h = handoff_check(ROOT, inside(ROOT, args.handoff))
        print(json.dumps({'jobId': h['jobId'], 'status': 'evidence-current-not-an-approval'}))
    elif args.command == 'snapshot':
        print(json.dumps(snapshot(ROOT, inside(ROOT, args.file), inside(ROOT, args.directory), api())))
    else:
        reconcile_findings(ROOT, inside(ROOT, args.handoff), inside(ROOT, args.review), inside(ROOT, args.out), api())


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError) as exc:
        import sys
        print('BLOCKED: ' + str(exc), file=sys.stderr)
        sys.exit(1)
