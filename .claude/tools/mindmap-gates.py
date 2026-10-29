#!/usr/bin/env python3
"""Structural/evidence checks, not a substitute for independent editorial judgment."""
import argparse
import hashlib
import importlib.util
import json
import math
import datetime
from pathlib import Path
import re
import sys

VERSION = 1
BRIEFS = {
    'identity': 'Identity', 'readerAndAnswer': 'Reader and answer',
    'keywordEvidence': 'Keyword evidence', 'serpAndQuestions': 'SERP and questions',
    'whyNewPage': 'Why a new page', 'outline': 'Planned outline',
    'contributionAndEvidence': 'Contribution and evidence',
    'tablesToolsVisuals': 'Tables, tools or visuals', 'testingAndReview': 'Testing and review',
    'takeaway': 'Planned takeaway', 'inboundLinks': 'Inbound internal links',
    'outboundLinks': 'Outbound internal links',
    'technicalAndMeasurement': 'Technical and measurement scope',
}
COLUMNS = ['problem', 'solution', 'bucket', 'target', 'format', 'best_medium',
           'resolved_deliverable', 'serp_verdict', 'serp_evidence', 'reader_question',
           'answer', 'answer_placement', 'id']
HEADINGS = ['Problem', 'Solution', 'Bucket', 'Target (file or route)', 'Format', 'Best medium',
            'Resolved deliverable', 'SERP verdict', 'SERP evidence', 'Reader question',
            'Answer', 'Answer placement', 'ID']


def require(ok, message):
    if not ok:
        raise ValueError(message)


def read(path):
    def finite_float(value):
        number = float(value)
        require(math.isfinite(number), 'Non-finite JSON: ' + value)
        return number
    return json.loads(Path(path).read_text(), parse_float=finite_float,
                      parse_constant=lambda v: (_ for _ in ()).throw(ValueError('Non-finite JSON: ' + v)))


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False,
                                     separators=(',', ':')).encode()).hexdigest()


def file_sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def local(root, value):
    require(isinstance(value, str) and value, 'Missing artifact path')
    root = root.resolve()
    p = (root / value).resolve()
    require(p.is_relative_to(root), 'Artifact escapes active repository: ' + value)
    require(p.is_file(), 'Artifact missing: ' + value)
    return p


def content(value, label):
    if type(value) in (int, float, bool):
        require(not isinstance(value, float) or math.isfinite(value), 'Non-finite ' + label)
        return
    require(isinstance(value, (str, list, dict)) and bool(value), 'Missing ' + label)
    if isinstance(value, str):
        require(value.strip() and not re.fullmatch(r'(?i)\s*(?:tbd|todo|pending|research later|n/?a)\s*[.!]?\s*', value),
                'Unfinished or unexplained ' + label)
    elif isinstance(value, list):
        for n, item in enumerate(value):
            content(item, f'{label}[{n}]')
    else:
        for key, item in value.items():
            content(item, label + '.' + key)


def placements(root, brief, key):
    value = brief[key]
    require(isinstance(value, dict) and isinstance(value.get('placements'), list), key + ' requires actual inspected placements')
    items = value['placements']
    if key == 'inboundLinks':
        required = value.get('required')
        require(type(required) is int and required >= 1 and len(items) >= required,
                'Inbound link coverage is incomplete (record actual local required count)')
    if not items:
        content(value.get('notApplicableReason'), key + ' exception')
    for item in items:
        for field in ['source', 'target', 'section', 'anchor', 'purpose']:
            content(item.get(field), key + '.' + field)
        require(item['source'].startswith('/') and item['target'].startswith('/'), 'Internal placements need exact local routes')
        require(item['target'] == brief['target'] if key == 'inboundLinks' else item['source'] == brief['target'],
                'Link placement is attached to a different page')
        artifact(root, item.get('inspection'))


def artifact(root, ref):
    require(isinstance(ref, dict), 'Artifact needs path and sha256')
    p = local(root, ref.get('path'))
    require(file_sha(p) == ref.get('sha256'), 'Changed artifact: ' + str(ref.get('path')))
    return p


def independent(review, author, bound_key, expected):
    require(review.get('verdict') == 'PASS', 'Independent review has not passed')
    require(review.get('reviewer') and review['reviewer'] != author, 'Reviewer must differ from creator')
    require(review.get(bound_key) == expected, 'Review belongs to a different artifact')


def chart(root, plan, review):
    require(plan.get('schemaVersion') == VERSION, 'Unsupported chart schemaVersion')
    content(plan.get('author'), 'author')
    datetime.date.fromisoformat(plan.get('date', ''))
    content(plan.get('source'), 'chart source')
    content(plan.get('interpretedBrief'), 'interpreted brief')
    content(plan.get('chartPath'), 'actual chart path')
    rows = plan.get('actions')
    require(isinstance(rows, list), 'actions must be an array (empty only for no-addition)')
    ids, targets, creates = set(), set(), {}
    for row in rows:
        for key in COLUMNS:
            optional = ((key in ['format', 'best_medium', 'resolved_deliverable'] and row.get('bucket') != 'create new content')
                        or key in ['serp_verdict', 'serp_evidence', 'reader_question', 'answer', 'answer_placement']
                        and row.get('bucket') in ['consolidation advisory', 'update existing metadata', 'add internal links'])
            if optional and str(row.get(key, '')).strip().lower() in ['n/a', 'na']:
                continue
            content(row.get(key), 'action.' + key)
        require(row['id'] not in ids, 'Duplicate action id')
        ids.add(row['id'])
        require(row['bucket'] in ['consolidation advisory', 'update existing metadata', 'create new content',
                                  'update existing body text', 'add internal links'], 'Unknown action bucket')
        if row['bucket'] in ['create new content', 'update existing body text']:
            require(row['target'].startswith('/') and not row['target'].startswith('//'), 'Content actions need exact local route targets')
        if row['bucket'] == 'create new content':
            target = row['target'].rstrip('/') or '/'
            require(target not in targets, 'Duplicate new-page target')
            targets.add(target)
            creates[row['id']] = row
    briefs = plan.get('newPageBriefs', [])
    require(isinstance(briefs, list), 'newPageBriefs must be an array')
    seen = set()
    for brief in briefs:
        key = brief.get('actionId')
        require(key in creates and key not in seen, 'Brief lacks unique matching new-page action')
        seen.add(key)
        require(brief.get('target') == creates[key]['target'], 'Brief/action targets disagree')
        for field in BRIEFS:
            content(brief.get(field), 'brief.' + field)
        require(isinstance(brief['outline'], list) and brief['outline'], 'Planned outline requires specific sections')
        identity = brief['identity']
        require(isinstance(identity, dict), 'Identity must contain explicit fields')
        for field in ['title', 'pageType', 'format', 'medium']:
            content(identity.get(field), 'identity.' + field)
        row = creates[key]
        require(identity['format'] == row['format'] and identity['medium'] == row['resolved_deliverable'],
                'Action and brief format/resolved medium disagree')
        require(not re.search(r'\bvideo\b', identity['format'] + ' ' + identity['medium'], re.I),
                'Video is outside this workflow')
        answer = brief['readerAndAnswer']
        require(isinstance(answer, dict) and answer.get('question') == row['reader_question']
                and answer.get('answer') == row['answer'] and answer.get('placement') == row['answer_placement'],
                'Brief must preserve the approved reader question, answer and placement')
        for key in ['inboundLinks', 'outboundLinks']:
            placements(root, brief, key)
        require(brief.get('evidenceFiles'), 'Each brief requires its inspected evidence files')
        for ref in brief['evidenceFiles']:
            artifact(root, ref)
    require(seen == set(creates), 'Every new-page action needs its complete inline brief')
    prep = plan.get('preparation', {})
    require(prep.get('status') == 'PASS', 'Preparation incomplete: show a blocked report, not an approval chart')
    readiness = artifact(root, prep.get('readiness'))
    refs = plan.get('evidenceFiles')
    require(isinstance(refs, list) and refs, 'Missing preparation evidence files')
    for ref in refs:
        artifact(root, ref)
    require([p.get('phase') for p in plan.get('executionPlan', [])] == list(range(1, 10)),
            'Retain the full future execution plan, Phases 1–9')
    for p in plan['executionPlan']:
        content(p.get('action'), 'phase action')
    content(plan.get('emergingClusters'), 'emerging clusters')
    content(plan.get('exclusions'), 'exclusions')
    scope = plan.get('publicationScope', {})
    for key in ['commit', 'push', 'liveVerification', 'indexNow']:
        require(type(scope.get(key)) is bool, 'Explicit publicationScope boolean required: ' + key)
    require(not scope['push'] or (scope['commit'] and scope['liveVerification']), 'Push requires commit and live verification')
    require(not scope['indexNow'] or scope['push'], 'IndexNow cannot precede publication')
    independent(review, plan['author'], 'manifestSha256', digest(plan))
    require(review.get('readinessSha256') == file_sha(readiness), 'Readiness changed since review')
    content(review.get('evidence'), 'independent preparation review evidence')
    return plan


def display(value):
    if isinstance(value, str):
        return value
    if type(value) in (int, float, bool):
        return str(value)
    if isinstance(value, list):
        return '\n'.join('- ' + display(v) for v in value)
    return '\n'.join('**' + str(k) + ':** ' + display(v) for k, v in value.items())


def render(plan):
    lines = ['---', 'mindmap_pass_date: ' + plan['date'], 'source: ' + json.dumps(plan['source'], ensure_ascii=False),
             'interpreted_brief: ' + json.dumps(plan['interpretedBrief'], ensure_ascii=False),
             'status: ready-for-approval', '---', '', '# Content approval plan', '', '## Action chart', '',
             '| ' + ' | '.join(HEADINGS) + ' |', '| ' + ' | '.join(['---'] * len(COLUMNS)) + ' |']
    for row in plan['actions']:
        lines.append('| ' + ' | '.join(str(row[k]).replace('|', '\\|').replace('\n', '<br>') for k in COLUMNS) + ' |')
    lines += ['', '## Emerging search patterns (clusters)', '', display(plan['emergingClusters']), '', '## Exclusions', '', display(plan['exclusions']), '', '## New-page briefs']
    for brief in plan.get('newPageBriefs', []):
        lines += ['', f"### {brief['actionId']} — {brief['target']}"]
        for key, label in BRIEFS.items():
            lines += ['', '**' + label + '**', '', display(brief[key])]
    lines += ['', '## Execution plan', '']
    for item in plan['executionPlan']:
        lines.append(f"{item['phase']}. {item['action']}")
    lines += ['', 'Publication scope: ' + ', '.join(f'{k}: {v}' for k, v in plan['publicationScope'].items()),
              '', '## Preparation check', '', '| Check | Result | Evidence |', '|---|---|---|',
              '| Preparation check | ✅ Passed | [Full readiness report](' + plan['preparation']['readiness']['path'] + ') |',
              '', 'Approve this plan to start the listed content work?' if plan['actions'] else 'No content changes are proposed; the no-addition branch is terminal.', '']
    return '\n'.join(lines)


def saved_chart(root, plan):
    require(local(root, plan['chartPath']).read_text() == render(plan),
            'Actual saved chart differs from the complete reviewed manifest; render it again')


def analysis(root, packet):
    require(packet.get('gateSchemaVersion') == VERSION, 'Missing current analysis gate packet')
    for field in ['author', 'route', 'readerQuestion']:
        content(packet.get(field), 'analysis.' + field)
    basis = packet.get('basis')
    require(basis in ['calculated', 'modeled', 'measured', 'reported', 'client-record', 'no-addition'], 'Unknown analysis basis')
    if basis == 'no-addition':
        content(packet.get('whyNoAddition'), 'terminal no-addition rationale')
        artifact(root, packet.get('existingAnswer'))
        return packet
    for field in ['decisionGap', 'finding', 'conditions', 'whatWouldChange']:
        content(packet.get(field), 'analysis.' + field)
    selected = read(artifact(root, packet.get('caseSelection')))
    require(selected.get('bankSha256') == file_sha(local(root, '.claude/commands/_approved-cases.json')),
            'Case bank changed; rerun retrieval')
    require(selected.get('experienceSha256') == file_sha(local(root, '.claude/commands/_experience.md')),
            'Local experience permission changed; rerun retrieval')
    require(isinstance(selected.get('publisher'), str) and re.fullmatch(r'[a-z0-9.-]+\.[a-z]{2,}', selected['publisher']),
            'Case retrieval requires the active publisher domain')
    require(selected == cases(root, packet['readerQuestion'], selected['publisher']),
            'Case receipt is incomplete, altered or belongs to another reader question')
    content(packet.get('caseDecisions'), 'case selection/rejection reasoning')
    refs = packet.get('sourceArtifacts')
    require(isinstance(refs, list) and refs, 'Missing sourced inputs/reasoning records')
    for ref in refs:
        artifact(root, ref)
    if basis in ['calculated', 'modeled', 'measured']:
        for key in ['method', 'units', 'limitations', 'counterexample']:
            content(packet.get(key), 'analysis.' + key)
    if basis in ['calculated', 'modeled']:
        execution = packet.get('execution', {})
        command = execution.get('command')
        require(isinstance(command, list) and command and all(isinstance(v, str) for v in command)
                and command[0].strip(), 'Execution command must be an executable/arguments array')
        artifact(root, execution.get('code'))
        require(execution.get('inputs'), 'Missing execution input records')
        for ref in execution['inputs']:
            artifact(root, ref)
        output = artifact(root, execution.get('output'))
        require(isinstance(read(output), (dict, list)), 'Numerical outputs must be structured JSON')
    elif basis == 'measured':
        require(packet.get('runs'), 'Measured findings need actual recorded runs')
        for run in packet['runs']:
            content(run.get('testedAt'), 'actual run date')
            datetime.date.fromisoformat(run['testedAt'])
            content(run.get('scope'), 'actual test scope')
            artifact(root, run.get('artifact'))
    else:
        content(packet.get('whyNoQuantitativeAnalysis'), 'relevance-based non-quantitative rationale')
        content(packet.get('reasoning'), 'source-to-conclusion reasoning')
    return packet


def generation(root, plan, review, packet, slug, section=False):
    chart(root, plan, review)
    saved_chart(root, plan)
    analysis(root, packet)
    require(packet['basis'] != 'no-addition', 'No-addition is terminal; do not call the writer')
    target = packet['route']
    rows = [r for r in plan['actions'] if r['target'].rstrip('/') == target.rstrip('/') and r['bucket'] in
            ['create new content', 'update existing body text']]
    require(rows, 'Writer target is outside approved substantive actions')
    require(any(r['reader_question'] == packet['readerQuestion'] for r in rows), 'Analysis reader question differs from approved intent')
    expected = target.rstrip('/').split('/')[-1]
    require(slug == expected or (section and slug.startswith(expected + '--')), 'Writer slug differs from analysis route')


def audit_analysis(root, packet, review, replay):
    analysis(root, packet)
    independent(review, packet['author'], 'packetSha256', digest(packet))
    if packet['basis'] == 'no-addition':
        decision = review.get('noAddition', {})
        require(decision.get('status') == 'PASS', 'Missing independent no-addition decision')
        content(decision.get('evidence'), 'no-addition evidence')
        return True
    for key in ['usefulness', 'sourceAndAssumptions', 'conditionsAndCounterexample', 'renderedConsistency', 'localExclusions']:
        c = review.get(key, {})
        require(c.get('status') == 'PASS', 'Missing independent analysis check: ' + key)
        content(c.get('evidence'), key + ' evidence')
    snapshot = read(artifact(root, review.get('renderedSnapshot')))
    rendered = read(artifact(root, review.get('renderedReview')))
    module_path = local(root, '.claude/tools/rendered-audit.py')
    spec = importlib.util.spec_from_file_location('mindmap_rendered_audit', module_path)
    renderer = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(renderer)
    renderer.review_check(snapshot, rendered)
    require(rendered.get('reviewer') == review['reviewer'], 'Bind the analysis decision to its independent final rendered reviewer')
    require(rendered.get('snapshotSha256') == snapshot.get('snapshotSha256') and snapshot.get('snapshotSha256'),
            'Rendered review and snapshot disagree')
    require(any(r.get('path', '').rstrip('/') == packet['route'].rstrip('/') and r.get('verdict') == 'PASS'
                for r in rendered.get('routes', [])), 'Analysis route lacks a final rendered PASS')
    if packet['basis'] in ['calculated', 'modeled']:
        require(replay, 'Reviewer must supply a fresh independently replayed output')
        original_path = artifact(root, packet['execution']['output'])
        replay_path = local(root, replay)
        require(not original_path.samefile(replay_path), 'Replay must be a distinct independently generated artifact')
        original = read(original_path)
        rerun = read(replay_path)
        require(digest(original) == digest(rerun), 'Replayed results differ; resolve before approval')
        require(review.get('replaySha256') == digest(rerun), 'Review is not bound to replayed results')
    return True


def cases(root, query, publisher):
    bank = root / '.claude/commands/_approved-cases.json'
    experience = local(root, '.claude/commands/_experience.md')
    words = set(re.findall(r'[a-z0-9]{3,}', query.lower()))
    candidates = []
    for record in read(bank)['records']:
        searchable = {k: record[k] for k in ['entity', 'approvedFacts', 'quotes']}
        terms = set(re.findall(r'[a-z0-9]{3,}', json.dumps(searchable, ensure_ascii=False).lower()))
        score = len(words & terms)
        if score:
            candidates.append({'record': record, 'topicMatches': sorted(words & terms),
                               'attribution': 'first-person only within local experience permission' if publisher in record['firstPartyPublishers'] else 'attribute to ' + record['owner'] + '; do not claim this as this site\u2019s own engagement'})
    private_context = []
    registry = root / 'scripts/client_weekly/clients.json'
    if publisher == 'layer3labs.io' and registry.is_file():
        data = read(registry)
        for key, value in data.items():
            if isinstance(value, dict) and value.get('name') and words & set(re.findall(r'[a-z0-9]{3,}', value['name'].lower())):
                private_context.append({'recordId': key, 'entity': value['name'], 'source': 'scripts/client_weekly/clients.json',
                                        'sourceSha256': file_sha(registry),
                                        'scope': 'Private relationship lookup context only. Retrieve approved case detail before using an outcome/quote. This registry is not public-use approval or testing evidence.'})
    return {'schemaVersion': VERSION, 'query': query, 'publisher': publisher,
            'bankSha256': file_sha(bank), 'experienceSha256': file_sha(experience),
            'localExperience': experience.read_text(),
            'candidates': sorted(candidates, key=lambda r: -len(r['topicMatches']))[:8],
            'privateClientContext': private_context,
            'instruction': 'Select only relevant approved facts/quotes; save selection/rejection reasons in the existing evidence packet. Local exclusions and public-use scope still govern. No result is an automatic testing permission.'}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', default='.')
    s = p.add_subparsers(dest='command', required=True)
    for name in ['validate-chart', 'render-chart', 'generation-check']:
        q = s.add_parser(name)
        q.add_argument('--manifest', required=True)
        q.add_argument('--review', required=True)
        if name == 'render-chart':
            q.add_argument('--out', required=True)
        if name == 'generation-check':
            q.add_argument('--packet', required=True)
            q.add_argument('--slug', required=True)
            q.add_argument('--section', action='store_true')
    q = s.add_parser('audit-analysis')
    q.add_argument('--packet', required=True)
    q.add_argument('--review', required=True)
    q.add_argument('--replay-output')
    q = s.add_parser('cases')
    q.add_argument('--query', required=True)
    q.add_argument('--publisher', required=True)
    q.add_argument('--out', required=True)
    q = s.add_parser('hash')
    q.add_argument('--file', required=True)
    a = p.parse_args()
    root = Path(a.root).resolve()
    if a.command == 'hash':
        path = local(root, a.file)
        print(json.dumps({'sha256': file_sha(path), 'canonicalJsonSha256': digest(read(path))}))
        return
    if a.command == 'cases':
        result = cases(root, a.query, a.publisher)
        Path(a.out).write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
        print(json.dumps({'status': 'retrieved-not-approved', 'candidates': len(result['candidates'])}))
        return
    if a.command == 'audit-analysis':
        audit_analysis(root, read(a.packet), read(a.review), a.replay_output)
    else:
        plan, review = read(a.manifest), read(a.review)
        chart(root, plan, review)
        if a.command == 'generation-check':
            generation(root, plan, review, read(a.packet), a.slug, a.section)
        if a.command == 'render-chart':
            destination = (root / plan['chartPath']).resolve()
            require(destination.is_relative_to(root) and destination == Path(a.out).resolve(), 'Output must be the manifest\u2019s actual chartPath inside the repository')
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(render(plan))
        else:
            saved_chart(root, plan)
    print(json.dumps({'status': 'PASS', 'scope': 'Structural/artifact checks only; independent judgment and existing approval/rendered-publication gates remain required.'}))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError, TypeError, json.JSONDecodeError) as e:
        print(json.dumps({'status': 'FAIL', 'error': str(e)}), file=sys.stderr)
        sys.exit(1)
