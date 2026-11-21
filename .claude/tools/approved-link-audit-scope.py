"""Admit previously approved existing inbound-link sources to AUDIT only.

No editorial verdict, publication authority or review-budget exemption is created.
JSON-literal page entries only; unsupported source syntax fails closed.
"""
import json
import re


def check(root, h, old, phase, api, renderer):
    need = api.require
    need(phase in ('audit', None), 'Approved link dependency admission is AUDIT only')
    need(h['jobId'] == old['jobId'] and h['canonicalBase'] == old['canonicalBase'], 'Dependency job/site changed')
    need(h['reviewCounters'] == old['reviewCounters'] and h['findings'] == old['findings'], 'Dependency admission must preserve counters and findings exactly')
    proof = api.read(api.evidence_ref(root, h['approvedLinkDependencies']))
    need(proof.get('version') == 1 and proof.get('kind') == 'approved-existing-link-audit-dependencies' and
         proof.get('previousHandoff') == h['previous'], 'Dependency proof must bind exact predecessor')
    # Approval must already be present in canonical history, not supplied by this extension.
    refs = set(); candidate_refs = {}; candidates = []
    current = old
    while current:
        refs.update(r['sha256'] for r in current['candidates'] + current['sources'])
        for r in current['candidates']:
            candidate_refs.setdefault(r['sha256'], set()).add(current['producer'])
            candidates.append(r)
        current = api.read(api.evidence_ref(root, current['previous'])) if current.get('previous') else None
    plan_ref, review_ref = proof['approvedManifest'], proof['chartReview']
    need(plan_ref['sha256'] in candidate_refs and review_ref['sha256'] in refs, 'Plan/review not bound in predecessor history')
    plan = api.read(api.evidence_ref(root, plan_ref)); review = api.read(api.evidence_ref(root, review_ref))
    need(plan.get('jobId') == h['jobId'] and review.get('jobId') == h['jobId'] and
         review.get('verdict') == 'PASS' and review.get('manifestFileSha256', review.get('manifestSha256')) == plan_ref['sha256'], 'Missing exact approved plan/chart binding')
    need(isinstance(review.get('reviewer'), str) and bool(review['reviewer'].strip()) and
         review['reviewer'] not in candidate_refs[plan_ref['sha256']], 'Actual independent chart reviewer required')
    charts = [r for r in candidates if r.get('originPath', r['path']) == plan['chartPath']]
    need(bool(charts) and len({r['sha256'] for r in charts}) == 1, 'Approved chart must match original candidate link')
    api.evidence_ref(root, charts[0])
    rows = proof['dependencies']; added = set(h['routes']) - set(old['routes'])
    need(set(old['routes']) < set(h['routes']) and len(rows) == len(added) and
         {r['route'] for r in rows} == added, 'Every added dependency needs one exact proof')
    snapshot_ref = h['snapshot']
    need(snapshot_ref['sha256'] in {r['sha256'] for r in h['candidates']}, 'Capture must be a current candidate')
    snap = api.read(api.evidence_ref(root, snapshot_ref)); renderer.valid_snapshot(snap)
    need(snap['manifest']['jobId'] == h['jobId'] and snap['manifest']['canonicalBase'] == h['canonicalBase'] and
         {r['path'] for r in snap['routes']} == set(h['routes']), 'Complete same-job/site capture required')
    need(all(r.get('htmlFile') and r.get('textFile') for r in snap['routes']), 'Complete HTML/text capture required')
    boundary = api.read(api.evidence_ref(root, snap.get('correctionBoundary') or snap.get('reviewSourceArchive')))
    for row in rows:
        placements = [p for b in plan.get('newPageBriefs', []) for p in b.get('inboundLinks', {}).get('placements', [])
                      if p.get('source') == row['route'] and p.get('target') in old['routes'] and b.get('target') == p.get('target')]
        need(len(placements) == 1, 'Dependency absent or ambiguous in approved inbound plan')
        placement = placements[0]
        inspection = api.read(api.evidence_ref(root, placement['inspection']))
        inspected = [p for p in inspection.get('inbound', []) if all(p.get(k) == placement.get(k) for k in ['source', 'target', 'anchor', 'section'])]
        need(len(inspected) == 1, 'Missing exact original inbound inspection')
        baseline = api.evidence_ref(root, inspected[0]['sourceSnapshot']).read_text()
        before = json.JSONDecoder().raw_decode(baseline[baseline.index('{'):])[0]
        source_path = row['sourcePath']
        need(baseline.splitlines()[0] == 'SOURCE ' + source_path, 'Original inspected source identity changed')
        source = row['currentSource']; raw = api.evidence_ref(root, source).read_text()
        record = boundary['files'].get(source_path)
        need(record and record['sha256'] == source['sha256'] and record.get('artifact') == source,
             'Immutable source artifact not exactly bound to captured source identity')
        api.evidence_ref(root, record['artifact'])
        slug = row['route'].rsplit('/', 1)[-1]
        matches = list(re.finditer(r'"slug"\s*:\s*"' + re.escape(slug) + r'"', raw))
        need(len(matches) == 1, 'Existing source entry must be unique JSON literal')
        start = raw.rfind('{', 0, matches[0].start())
        after = json.JSONDecoder().raw_decode(raw[start:])[0]
        need(before.get('slug') == slug and after.get('slug') == slug, 'Dependency is not original existing entry')
        link = '[' + placement['anchor'] + '](' + placement['target'] + ')'
        changed = [0]
        def equal(a, b, path=()):
            if a == b: return
            if len(path) >= 3 and path[0] == 'sections' and path[2] == 'content':
                heading = before['sections'][int(path[1])].get('heading', '')
                need(bool(heading) and placement['section'].casefold().startswith(heading.casefold()), 'Link changed outside approved section')
            if isinstance(a, dict) and isinstance(b, dict):
                need(a.keys() == b.keys(), 'Link dependency changed page fields')
                for k in a: equal(a[k], b[k], path + (k,))
            elif isinstance(a, list) and isinstance(b, list):
                need(len(a) <= len(b), 'Link dependency removed body content')
                for i, item in enumerate(a): equal(item, b[i], path + (str(i),))
                for item in b[len(a):]:
                    need(len(path) == 3 and path[0] == 'sections' and path[-1] == 'content' and item in [prefix + link + '.' for prefix in ['Read ', 'Read the ', 'See ', 'Open ']], 'Only navigation-only approved link paragraph may be added')
                    changed[0] += 1
            elif isinstance(a, str) and isinstance(b, str):
                need(len(path) == 4 and path[0] == 'sections' and path[2] == 'content' and b.count(link) == 1, 'Only approved internal-link body edit allowed')
                plain = lambda s: re.sub(r'\[([^\]]+)\]\([^\s)]+\)', r'\1', s)
                need(plain(a) == plain(b) and b.replace(link, placement['anchor']) == plain(b), 'Reader claims or unrelated links changed')
                changed[0] += 1
            else: need(False, 'Body/meta/date changed outside approved link')
        equal(before, after)
        need(changed[0] == 1, 'Dependency needs exactly one declared link placement change')
