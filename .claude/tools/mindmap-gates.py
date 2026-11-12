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
SUBSTANTIVE = {'create new content', 'update existing body text'}


def presentation(decision):
    require(isinstance(decision, dict), 'Missing presentation decision')
    for key in ['medium', 'placement', 'reason']:
        prose(decision.get(key), 'presentation.' + key)
    require(not re.search(r'\bvideo\b', decision['medium'], re.I), 'Video is outside this workflow')
    inputs = decision.get('readerInputs')
    require(isinstance(inputs, list), 'presentation.readerInputs must list meaningful reader choices (or [])')
    for item in inputs:
        prose(item, 'reader input')
    for key, allowed in [('interaction', {'build', 'reuse', 'not-useful', 'unavailable'}),
                         ('animation', {'use', 'not-useful'})]:
        item = decision.get(key, {})
        require(isinstance(item, dict), 'Missing presentation.' + key)
        require(item.get('decision') in allowed, 'Missing presentation.' + key + ' decision')
        prose(item.get('reason'), 'presentation.' + key + ' reasoning')
    interactive = bool(re.search(r'\b(interactive|calculator|quiz|assessment)\b', decision['medium'], re.I))
    chosen = decision['interaction']['decision'] in {'build', 'reuse'}
    require(interactive == chosen, 'Presentation medium and interaction decision disagree')
    require(not chosen or bool(inputs), 'Interactive delivery needs meaningful reader inputs')
    require(decision['animation']['decision'] != 'use' or chosen, 'Interactive animation needs an interactive delivery')


def request_contract(root, plan):
    """Bind the actual request to planned work; truth/coverage still needs independent judgment."""
    rows = {r['id']: r for r in plan['actions'] if r['bucket'] in SUBSTANTIVE}
    if not rows:
        return
    request = plan.get('request', {})
    require(isinstance(request, dict), 'Missing original request')
    artifact(root, request.get('source'))
    prose(request.get('goal'), 'original request goal')
    requirements = request.get('requirements')
    require(isinstance(requirements, list) and requirements, 'Missing original request requirements')
    seen, covered = set(), set()
    for item in requirements:
        for key in ['id', 'description', 'acceptance']:
            prose(item.get(key), 'requirement.' + key)
        require(item['id'] not in seen, 'Duplicate request requirement')
        seen.add(item['id'])
        ids = item.get('actionIds')
        require(isinstance(ids, list) and ids and all(i in rows for i in ids),
                'Request requirement needs matching substantive action IDs')
        covered.update(ids)
    require(covered == set(rows), 'Substantive action is not tied to the original request')


def request_review(review, request):
    checks = review.get('requestCoverage', [])
    require(isinstance(checks, list), 'Missing request coverage review')
    expected = {r['id'] for r in request['requirements']}
    require(len(checks) == len(expected) and {c.get('requirementId') for c in checks} == expected,
            'Review must cover every original request requirement exactly once')
    for check in checks:
        require(check.get('status') == 'PASS', 'Original request is not fulfilled: ' + str(check.get('requirementId')))
        prose(check.get('evidence'), 'original request coverage evidence')


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


def prose(value, label):
    require(isinstance(value, str), 'Expected readable text for ' + label)
    content(value, label)


def preparation_artifact(root, ref):
    """Preparation precedes the packet that hashes its approved plan; avoid a hash cycle."""
    path = artifact(root, ref)
    if path.suffix == '.json':
        def check(value):
            if isinstance(value, dict):
                execution_packet = {'gateSchemaVersion', 'basis', 'route'} <= set(value)
                require(not (execution_packet and (value['basis'] != 'no-addition' or 'approvedPlan' in value)),
                        'Preparation must reference source inputs, not a final execution packet (circular plan binding)')
                for nested in value.values():
                    check(nested)
            elif isinstance(value, list):
                for nested in value:
                    check(nested)
        check(read(path))
    return path


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


SCOPE_BRIEFS = {
    'identity': 'Identity',
    'readerAndAnswer': 'Reader and answer',
    'keywordEvidence': 'Keyword evidence',
    'whyNewPage': 'Why a new page',
    'outline': 'Planned outline',
    'takeaway': 'Planned takeaway',
}
SUBLAUNCH_TOKENS = ('-mini', '-flash', '-haiku', '-nano', '-lite', '-hydrogen')


def model_launch_check(root, plan, creates):
    """Enforce docs/model-launch-page-family.md Lean Launch Set when present."""
    family_doc = root / 'docs/model-launch-page-family.md'
    if not family_doc.is_file() or 'Lean Launch Set' not in family_doc.read_text(errors='ignore'):
        return
    slugs = [row['target'].rstrip('/').split('/')[-1] for row in creates.values()]
    launch = plan.get('modelLaunch')
    inferred_slug = None
    if launch is not None:
        require(isinstance(launch, dict), 'modelLaunch must be an object when present')
        level = launch.get('level')
        require(level in ('small', 'mid', 'frontier'), 'modelLaunch.level must be small, mid or frontier')
        prose(launch.get('modelSlug'), 'modelLaunch.modelSlug')
        inferred_slug = launch['modelSlug'].strip().strip('/')
    else:
        explained = {s[:-len('-explained')] for s in slugs if s.endswith('-explained')}
        pricing = {s[:-len('-pricing')] for s in slugs if s.endswith('-pricing')}
        both = sorted(explained & pricing)
        if len(both) == 1:
            inferred_slug = both[0]
            level = 'small' if any(inferred_slug.endswith(tok) or (tok + '-') in inferred_slug for tok in SUBLAUNCH_TOKENS) else None
        else:
            level = None
    if not inferred_slug:
        return
    forbidden = [s for s in slugs if s.endswith('-alternatives') or s.endswith('-for-business')]
    require(
        not forbidden,
        'Lean Launch Set (docs/model-launch-page-family.md) forbids -alternatives and -for-business on model launches: '
        + ', '.join(forbidden),
    )
    if level == 'small':
        require(
            len(creates) <= 3,
            f'Lean Launch Set (docs/model-launch-page-family.md) caps small/sub-tier model launches ({inferred_slug}) at 3 new pages max '
            '({model}-explained, {model}-pricing, {model}-vs-{prev}); fold how-to, free-tier, limits and benchmarks into sections of those 3 pages',
        )
    elif level == 'mid':
        require(
            len(creates) <= 10,
            f'Lean Launch Set (docs/model-launch-page-family.md) caps mid-tier model launches ({inferred_slug}) at 10 new pages max',
        )


def chart(root, plan, review):
    require(plan.get('schemaVersion') == VERSION, 'Unsupported chart schemaVersion')
    mode = plan.get('preparationMode', 'full')
    require(mode in ('full', 'fast-scope'), 'Unsupported preparationMode: must be full or fast-scope')
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
            optional = ((key in ['format', 'best_medium', 'resolved_deliverable'] and row.get('bucket') not in SUBSTANTIVE)
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
            presentation(row.get('presentation'))
            require(row['presentation']['medium'] == row['resolved_deliverable'], 'Action/presentation medium differs')
        if row['bucket'] == 'create new content':
            target = row['target'].rstrip('/') or '/'
            require(target not in targets, 'Duplicate new-page target')
            targets.add(target)
            creates[row['id']] = row
    model_launch_check(root, plan, creates)
    request_contract(root, plan)
    if mode == 'fast-scope':
        scope_briefs = plan.get('scopeBriefs') if 'scopeBriefs' in plan else plan.get('newPageBriefs', [])
        require(isinstance(scope_briefs, list), 'scopeBriefs must be an array in fast-scope mode')
        seen = set()
        for brief in scope_briefs:
            key = brief.get('actionId')
            require(key in creates and key not in seen, 'Scope brief lacks unique matching new-page action')
            seen.add(key)
            require(brief.get('target') == creates[key]['target'], 'Scope brief/action targets disagree')
            for field in SCOPE_BRIEFS:
                content(brief.get(field), 'scopeBrief.' + field)
            require(isinstance(brief['outline'], list) and brief['outline'], 'Planned outline requires specific sections')
            identity = brief['identity']
            require(isinstance(identity, dict), 'Identity must contain explicit fields')
            for field in ['title', 'pageType', 'format', 'medium']:
                content(identity.get(field), 'identity.' + field)
            row = creates[key]
            require(identity['format'] == row['format'] and identity['medium'] == row['resolved_deliverable'],
                    'Action and scope brief format/resolved medium disagree')
            require(not re.search(r'\bvideo\b', identity['format'] + ' ' + identity['medium'], re.I),
                    'Video is outside this workflow')
            answer = brief['readerAndAnswer']
            require(isinstance(answer, dict) and answer.get('question') == row['reader_question']
                    and answer.get('answer') == row['answer'] and answer.get('placement') == row['answer_placement'],
                    'Scope brief must preserve the approved reader question, answer and placement')
            require(brief.get('evidenceFiles'), 'Each scope brief requires its inspected evidence files')
            for ref in brief['evidenceFiles']:
                preparation_artifact(root, ref)
        require(seen == set(creates), 'Every new-page action needs its scope brief in fast-scope mode')
    else:
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
                preparation_artifact(root, ref)
        require(seen == set(creates), 'Every new-page action needs its complete inline brief')
    prep = plan.get('preparation', {})
    require(prep.get('status') == 'PASS', 'Preparation incomplete: show a blocked report, not an approval chart')
    readiness = preparation_artifact(root, prep.get('readiness'))
    refs = plan.get('evidenceFiles')
    require(isinstance(refs, list) and refs, 'Missing preparation evidence files')
    for ref in refs:
        preparation_artifact(root, ref)
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
    if any(r['bucket'] in SUBSTANTIVE for r in rows):
        request_review(review, plan['request'])
    if plan.get('vendorResearchPlan'):
        spec=importlib.util.spec_from_file_location('mindmap_vendor_research',root/'.claude/tools/vendor-research.py')
        vendor_research=importlib.util.module_from_spec(spec);spec.loader.exec_module(vendor_research)
        allocation=vendor_research.validate(root,artifact(root,plan['vendorResearchPlan']))
        require(plan.get('jobId')==allocation['jobId'],'Vendor research and chart must preserve the same canonical job')
    return plan


def complete_news_chart(root, plan, review):
    path = root/'scripts/news_radar/news_intake.py'
    if path.is_file() and any(ref.get('path','').startswith('reports/news-radar/intakes/') for ref in plan.get('evidenceFiles', [])):
        require(plan.get('preparationMode', 'full') == 'full',
                'Automated news-radar intakes require full chart preparation (preparationMode="full")')
        spec=importlib.util.spec_from_file_location('news_intake_receipt',path)
        news=importlib.util.module_from_spec(spec);spec.loader.exec_module(news)
        news.after_saved_chart(root,plan,review)


def complete_hype_chart(root, plan, review):
    hype = root/'scripts/hype_radar/handoff.py'
    if hype.is_file() and ((root/'.claude/workflow-policy.local.json').is_file() or (root/'.claude/tools/workflow-efficiency.py').is_file()) and (root/'reports/hype-radar/intakes').is_dir():
        spec=importlib.util.spec_from_file_location('hype_chart_handoff',hype)
        handoff=importlib.util.module_from_spec(spec);spec.loader.exec_module(handoff)
        if plan.get('preparationMode', 'full') != 'full':
            directory = root/'reports/hype-radar/intakes'
            matched = [directory/(ref['sha256']+'.json') for ref in plan.get('evidenceFiles', []) if (directory/(ref.get('sha256', '')+'.json')).is_file()]
            require(not matched and handoff.active_pull(root, {}) is None,
                    'Automated hype-radar intakes require full chart preparation (preparationMode="full")')
            return
        handoff.after_chart(root,plan,review)


def complete_competitor_chart(root, plan, review):
    path = root/'.claude/tools/competitor-handoff.py'
    if path.is_file():
        spec=importlib.util.spec_from_file_location('competitor_chart_handoff',path)
        module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
        if plan.get('preparationMode', 'full') != 'full':
            active_intake = module.active(root)
            require(active_intake is None or module.completed(root, active_intake),
                    'Automated competitor-monitor intakes require full chart preparation (preparationMode="full")')
            return
        module.after_chart(root,plan,review)


def display(value):
    if isinstance(value, str):
        return value
    if type(value) in (int, float, bool):
        return str(value)
    if isinstance(value, list):
        return '\n'.join('- ' + display(v) for v in value)
    return '\n'.join('**' + str(k) + ':** ' + display(v) for k, v in value.items())


def render(plan):
    prep_mode = plan.get('preparationMode', 'full')
    frontmatter = ['---', 'mindmap_pass_date: ' + plan['date'], 'source: ' + json.dumps(plan['source'], ensure_ascii=False),
                   'interpreted_brief: ' + json.dumps(plan['interpretedBrief'], ensure_ascii=False)]
    if prep_mode == 'fast-scope':
        frontmatter.append('preparation_mode: fast-scope')
    frontmatter += ['status: ready-for-approval', '---', '', '# Content approval plan', '', '## Action chart', '',
                    '| ' + ' | '.join(HEADINGS) + ' |', '| ' + ' | '.join(['---'] * len(COLUMNS)) + ' |']
    lines = frontmatter
    for row in plan['actions']:
        lines.append('| ' + ' | '.join(str(row[k]).replace('|', '\\|').replace('\n', '<br>') for k in COLUMNS) + ' |')
    if plan.get('request'):
        lines += ['', '## Original request and acceptance', '', display(plan['request']['goal']), '',
                  display(plan['request']['requirements'])]
    for row in plan['actions']:
        if row.get('presentation'):
            lines += ['', '### Presentation — ' + row['id'], '', display(row['presentation'])]
    if prep_mode == 'fast-scope':
        lines += ['', '## Emerging search patterns (clusters)', '', display(plan['emergingClusters']), '',
                  '## Exclusions', '', display(plan['exclusions']), '',
                  '## Scope briefs (fast-scope — full briefs & link inspections run after Phase 0 approval)']
        for brief in plan.get('scopeBriefs', []):
            lines += ['', f"### {brief['actionId']} — {brief['target']}"]
            for key, label in SCOPE_BRIEFS.items():
                lines += ['', '**' + label + '**', '', display(brief[key])]
    else:
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


def layer3_comparisons(root, packet):
    """Optional comparison records inside the existing packet; not editorial approval."""
    comparisons = packet.get('comparisons', [])
    require(isinstance(comparisons, list), 'comparisons must be an array')
    for comparison in comparisons:
        require(isinstance(comparison, dict), 'Invalid comparison record')
        kind = comparison.get('kind')
        require(kind in ['public-data', 'practical'], 'Unknown comparison kind')
        status = comparison.get('status')
        require(status in ['used', 'unavailable', 'not-comparable', 'not-useful'], 'Unknown comparison status')
        content(comparison.get('reason'), 'comparison selection/fallback reason')
        # A skipped optional method never demands a numerical packet or a new task.
        if status != 'used':
            for ref in comparison.get('artifacts', []):
                artifact(root, ref)
            continue
        content(comparison.get('scope'), 'comparison scope and limits')
        plan = read(artifact(root, comparison.get('plan')))
        require(plan.get('kind') == kind and plan.get('readerQuestion') == packet['readerQuestion'],
                'Comparison plan belongs to another method or reader question')
        items = plan.get('items')
        require(isinstance(items, list) and len(items) >= 2
                and all(isinstance(item, str) and item.strip() for item in items)
                and len(set(items)) == len(items), 'Comparison needs distinct planned items')
        covered = comparison.get('coveredItems')
        require(isinstance(covered, list) and len(covered) >= 2
                and all(isinstance(item, str) for item in covered)
                and len(set(covered)) == len(covered) and set(covered) <= set(items),
                'Comparison needs at least two supported items')
        excluded = comparison.get('excludedItems', {})
        require(isinstance(excluded, dict) and set(excluded) == set(items) - set(covered),
                'Explain every unobserved/excluded comparison item')
        for reason in excluded.values():
            content(reason, 'excluded comparison item reason')
        for key in ['decision', 'conditions', 'dimensions']:
            content(plan.get(key), 'comparison plan.' + key)
        if kind == 'public-data':
            require(comparison.get('basis') in ['calculated', 'modeled', 'reported'],
                    'Public-data comparison is not our product testing')
            for key in ['normalization', 'unknowns', 'sourceRefreshTrigger']:
                content(plan.get(key), 'public comparison.' + key)
            sources = comparison.get('sources')
            require(isinstance(sources, list) and sources, 'Missing public source snapshots')
            seen = set()
            for source in sources:
                require(isinstance(source, dict) and source.get('item') in covered,
                        'Public source is outside compared items')
                seen.add(source['item'])
                require(isinstance(source.get('url'), str) and re.match(r'^https?://[^/\s]+', source['url']),
                        'Public source needs its actual URL')
                checked = datetime.datetime.fromisoformat(source.get('checkedAt', '').replace('Z', '+00:00'))
                require(checked.tzinfo is not None, 'Public source check needs timezone')
                artifact(root, source.get('snapshot'))
                content(source.get('extractedFacts'), 'source facts with exact supporting location')
            require(seen == set(covered), 'Public comparison lacks a source for every compared item')
        else:
            require(comparison.get('basis') == 'measured', 'Practical comparison needs actual measured work')
            task = plan.get('task', {})
            input_path = artifact(root, task.get('input'))
            expected_path = artifact(root, task.get('expected'))
            content(task.get('successCriterion'), 'objective task success criterion')
            repetitions = task.get('repetitions')
            require(type(repetitions) is int and repetitions >= 1, 'Actual planned repetitions required')
            runs = comparison.get('runs')
            require(isinstance(runs, list) and runs, 'Practical comparison lacks actual runs')
            seen = set()
            for run in runs:
                item, repetition = run.get('item'), run.get('repetition')
                require(item in covered and type(repetition) is int and 1 <= repetition <= repetitions,
                        'Practical run is outside the planned comparison')
                require((item, repetition) not in seen, 'Duplicate practical run')
                seen.add((item, repetition))
                require(run.get('inputSha256') == file_sha(input_path)
                        and run.get('expectedSha256') == file_sha(expected_path),
                        'Practical options must use the same planned input and expected result')
                performed = datetime.datetime.fromisoformat(run.get('performedAt', '').replace('Z', '+00:00'))
                require(performed.tzinfo is not None, 'Actual run time needs timezone')
                for key in ['version', 'environment', 'conditions']:
                    content(run.get(key), 'practical run.' + key)
                for key in ['rawOutput', 'scoring']:
                    artifact(root, run.get(key))
            require(seen == {(item, n) for item in covered for n in range(1, repetitions + 1)},
                    'Incomplete practical item/repetition coverage')


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
    bound = packet.get('approvedPlan', {})
    plan = read(artifact(root, bound.get('manifest')))
    require(plan.get('preparationMode', 'full') == 'full',
            'Fast-scope chart requires post-approval full brief and link-inspection expansion before Phase 3 analysis or writing')
    chart(root, plan, read(artifact(root, bound.get('review'))))
    rows = [r for r in plan['actions'] if r['id'] == bound.get('actionId') and r['bucket'] in SUBSTANTIVE]
    require(len(rows) == 1 and rows[0]['target'].rstrip('/') == packet['route'].rstrip('/'),
            'Analysis is not bound to its approved action')
    require(rows[0]['reader_question'] == packet['readerQuestion'], 'Analysis differs from approved intent')
    presentation(packet.get('presentation'))
    require(packet['presentation'] == rows[0]['presentation'], 'Presentation changed; revalidate the affected plan')
    if packet['presentation']['interaction']['decision'] in {'build', 'reuse'}:
        refs = packet.get('presentationArtifacts')
        require(isinstance(refs, list) and refs, 'Interactive contribution needs its actual implementation artifacts')
        for ref in refs:
            artifact(root, ref)
    for field in ['decisionGap', 'finding', 'conditions', 'whatWouldChange']:
        content(packet.get(field), 'analysis.' + field)
    selected = read(artifact(root, packet.get('caseSelection')))
    require(selected.get('bankSha256') == file_sha(local(root, '.claude/commands/_approved-cases.json')),
            'Case bank changed; rerun retrieval')
    require(selected.get('experienceSha256') == file_sha(local(root, '.claude/commands/_experience.md')),
            'Local experience permission changed; rerun retrieval')
    require(isinstance(selected.get('publisher'), str) and re.fullmatch(r'[a-z0-9.-]+\.[a-z]{2,}', selected['publisher']),
            'Case retrieval requires the active publisher domain')
    require(selected == cases(root, packet['readerQuestion'], selected['publisher'], packet.get('caseSearchContext', [])),
            'Case receipt is incomplete, altered or belongs to another reader question')
    content(packet.get('caseDecisions'), 'case selection/rejection reasoning')
    if selected['publisher'].removeprefix('www.') == 'layer3labs.io':
        uses = packet.get('caseUses')
        require(isinstance(uses, list), 'List actual case uses (or [] when no case is used)')
        candidates = {c['record']['id']: c['record'] for c in selected['candidates']}
        for use in uses:
            require(use.get('recordId') in candidates, 'Selected case was not retrieved')
            require(use.get('use') in {'context', 'implementation', 'outcome'}, 'Unknown case use')
            require(use.get('publicDescription') == candidates[use['recordId']]['publicDescription'],
                    'Use the approved anonymous case description')
            for key in ['claim', 'limits']:
                prose(use.get(key), 'case use ' + key)
            require(use.get('sourceArtifacts'), 'Case claim needs inspected supporting records')
            for ref in use['sourceArtifacts']:
                artifact(root, ref)
    refs = packet.get('sourceArtifacts')
    require(isinstance(refs, list) and refs, 'Missing sourced inputs/reasoning records')
    for ref in refs:
        artifact(root, ref)
    if selected['publisher'].removeprefix('www.') == 'layer3labs.io':
        layer3_comparisons(root, packet)
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
    require(plan.get('preparationMode', 'full') == 'full',
            'Fast-scope chart requires post-approval full brief and link-inspection expansion before Phase 3 analysis or writing')
    chart(root, plan, review)
    saved_chart(root, plan)
    complete_news_chart(root, plan, review)
    complete_hype_chart(root, plan, review)
    complete_competitor_chart(root, plan, review)
    analysis(root, packet)
    require(packet['basis'] != 'no-addition', 'No-addition is terminal; do not call the writer')
    require(digest(read(artifact(root, packet['approvedPlan']['manifest']))) == digest(plan),
            'Writer and analysis refer to different approved plans')
    target = packet['route']
    rows = [r for r in plan['actions'] if r['target'].rstrip('/') == target.rstrip('/') and r['bucket'] in
            ['create new content', 'update existing body text']]
    require(rows, 'Writer target is outside approved substantive actions')
    require(any(r['reader_question'] == packet['readerQuestion'] for r in rows), 'Analysis reader question differs from approved intent')
    expected = target.rstrip('/').split('/')[-1]
    require(slug == expected or (section and slug.startswith(expected + '--')), 'Writer slug differs from analysis route')


def native_customer_service_analysis(root, snapshot, rendered):
    """Recognize an existing delivered-order edit, never a caller's label alone.

    The native renderer still validates the independent whole-page review. Such
    service work retains its service history rather than acquiring a second,
    unrelated editorial Mindmap budget at analysis closure.
    """
    manifest = snapshot.get('manifest', {})
    if manifest.get('workflowKind') != 'client-service-correction':
        return False
    service_id = manifest.get('nativeServiceId')
    require(service_id and manifest.get('jobId') == 'service:' + service_id,
            'Native customer service identity required')
    rows = read(local(root, 'scripts/paid_placements/fix-queue.json'))
    row = next((r for r in rows if r.get('id') == service_id), None)
    require(row and row.get('kind') == 'customerEdit' and row.get('serviceSla') is True,
            'Existing canonical delivered-customer edit required')
    require(not any(row.get(k) for k in ('sourceHold', 'ownerReviewHold', 'customerReviewBeforePublish',
            'customerApprovalRequired', 'professionalReviewPending', 'optOut', 'suppression', 'cancelledAt'))
            and not (row.get('professionalReviewRequired') and row.get('professionalReviewStatus') not in ('approved', 'PASS')),
            'Native customer service cannot override a protected dependency')
    from urllib.parse import urlsplit
    route = urlsplit(row.get('pageUrl', '')).path.rstrip('/') or '/'
    require({r.get('path', '').rstrip('/') or '/' for r in snapshot.get('routes', [])} == {route}
            and all(r.get('verdict') == 'PASS' for r in rendered.get('routes', [])),
            'Native customer service requires its exact existing route and actual PASS')
    spec = importlib.util.spec_from_file_location('analysis_service_queue', local(root, 'scripts/paid_placements/service_queue.py'))
    service = importlib.util.module_from_spec(spec); spec.loader.exec_module(service)
    from datetime import datetime, timezone
    source = {'messageId': row.get('sourceMessageId'), 'threadId': row.get('threadId'),
              'from': row.get('vendorEmail'), 'at': row.get('requestedAt'), 'text': row.get('requestText')}
    actual = service.intake({'source': source, 'sourcePaymentId': row.get('sourcePaymentId'),
                             'pageUrl': row.get('pageUrl'), 'serviceOwner': row.get('serviceOwner'),
                             'requestItems': row.get('requestItems')},
                            read(local(root, 'scripts/paid_placements/ledger.json')), rows,
                            datetime.now(timezone.utc))
    require(actual is row, 'Retain the original canonical service and deadline')
    return True


def analysis_render_pair(root, packet, review):
    snapshot_ref = review.get('renderedSnapshot')
    snapshot = read(artifact(root, snapshot_ref))
    rendered = read(artifact(root, review.get('renderedReview')))
    rows = rendered.get('routes', [])
    route = packet['route'].rstrip('/') or '/'
    matches = [r for r in rows if (r['path'].rstrip('/') or '/') == route]
    if (rendered.get('approvalProjection') or len(matches) != 1 or not matches[0].get('reviewBudget')
            or not any(not r.get('reviewBudget') for r in rows)
            or not (root/'.claude/content-review-policy.json').is_file()):
        return snapshot, rendered
    # A mixed render can contain a budgeted article and link-only sibling checks.
    # Bind this article's analysis to its actual journal record, without changing
    # the signed analysis, its underlying full capture or any sibling's verdict.
    row = matches[0]
    require(rendered.get('snapshotSha256') == snapshot.get('snapshotSha256')
            and rendered.get('reviewer') == review.get('reviewer'), 'Mixed review identity changed')
    spec = importlib.util.spec_from_file_location('analysis_budget', root/'.claude/tools/content-review-policy.py')
    policy = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(policy)
    admission = read(policy.artifact(root, row['reviewBudget']))
    with policy.Journal(root, snapshot['manifest']['canonicalBase'], row['path']) as journal:
        cycle = next((c for c in journal.cycles if c['cycleId'] == admission['cycleId']), None)
        require(cycle and cycle['rounds'], 'Missing original review cycle')
        final = cycle['rounds'][-1]
        require(final['status'] == 'complete' and final['admission'] == row['reviewBudget']
                and final.get('report'), 'Only the latest recorded route judgment can be projected')
        authority_ref = final['report']
        authority = read(policy.artifact(root, authority_ref))
        require(final['reportObjectSha256'] == policy.digest(authority)
                and authority.get('reviewer') == rendered.get('reviewer')
                and authority.get('snapshotSha256') == rendered.get('snapshotSha256')
                and [item for item in authority['routes'] if item['path'] == row['path']] == [row],
                'Combined route evidence differs from the original recorded independent review')
    scoped, result = policy.copy_subset(snapshot, authority, {row['path']}, policy.capped_release(root, snapshot))
    result['approvalProjection'] = {'snapshot': snapshot_ref, 'review': authority_ref}
    return scoped, result


def audit_analysis(root, packet, review, replay):
    analysis(root, packet)
    at_limit = False
    if packet['basis'] != 'no-addition' and review.get('renderedReview'):
        result = read(artifact(root, review['renderedReview']))
        row = next((item for item in result.get('routes', []) if item.get('path', '').rstrip('/') == packet['route'].rstrip('/')), {})
        if row.get('verdict') == 'FAIL':
            snapshot, result = analysis_render_pair(root, packet, review)
            spec = importlib.util.spec_from_file_location('mindmap_release_renderer', local(root, '.claude/tools/rendered-audit.py'))
            renderer = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(renderer)
            policy = renderer.content_review_policy()
            require(policy and policy.capped_release(root,snapshot) and snapshot.get('contentReviewPolicy'), 'Capped release needs current Mindmap review evidence')
            # This also checks the real last round, page, candidate and independent check results.
            renderer.review_check(snapshot, result)
            require(review.get('reviewer') == result['reviewer'] != packet['author'] and review.get('packetSha256') == digest(packet)
                    and review.get('verdict') in ('PASS','FAIL'), 'Bind the analysis decision to the independently reviewed candidate')
            at_limit = True
    if not at_limit:
        independent(review, packet['author'], 'packetSha256', digest(packet))
    if packet['basis'] == 'no-addition':
        decision = review.get('noAddition', {})
        require(decision.get('status') == 'PASS', 'Missing independent no-addition decision')
        content(decision.get('evidence'), 'no-addition evidence')
        return True
    for key in ['usefulness', 'sourceAndAssumptions', 'conditionsAndCounterexample', 'renderedConsistency', 'localExclusions']:
        c = review.get(key, {})
        require(c.get('status') in (('PASS','FAIL') if at_limit and key!='localExclusions' else ('PASS',)), 'Missing independent analysis check: ' + key)
        content(c.get('evidence'), key + ' evidence')
    plan = read(artifact(root, packet['approvedPlan']['manifest']))
    request_review(review, {'requirements': [r for r in plan['request']['requirements']
                                            if packet['approvedPlan']['actionId'] in r['actionIds']]})
    for key in ['presentationReview', 'caseUseReview']:
        c = review.get(key, {})
        require(c.get('status') == 'PASS', 'Missing independent check: ' + key)
        prose(c.get('evidence'), key + ' evidence')
    snapshot, rendered = analysis_render_pair(root, packet, review)
    module_path = local(root, '.claude/tools/rendered-audit.py')
    spec = importlib.util.spec_from_file_location('mindmap_rendered_audit', module_path)
    renderer = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(renderer)
    renderer.review_check(snapshot, rendered)
    # Every substantive Mindmap action uses the portable budget, even if an
    # older caller forgot to mark its render manifest. No-addition stays above.
    native_service = native_customer_service_analysis(root, snapshot, rendered)
    if (root/'.claude/content-review-policy.json').is_file() and not native_service:
        policy_spec=importlib.util.spec_from_file_location('mindmap_content_review_policy',root/'.claude/tools/content-review-policy.py')
        review_policy=importlib.util.module_from_spec(policy_spec);policy_spec.loader.exec_module(review_policy)
        review_policy.check_rendered(root,snapshot,rendered,force=True)
    require(rendered.get('reviewer') == review['reviewer'], 'Bind the analysis decision to its independent final rendered reviewer')
    require(rendered.get('snapshotSha256') == snapshot.get('snapshotSha256') and snapshot.get('snapshotSha256'),
            'Rendered review and snapshot disagree')
    require(any(r.get('path', '').rstrip('/') == packet['route'].rstrip('/') and r.get('verdict') in (('PASS','FAIL') if at_limit else ('PASS',))
                for r in rendered.get('routes', [])), 'Analysis route lacks its verified release verdict')
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


def clean_reader_question(query):
    """Question-evidence annotations belong in the record, never in source search terms."""
    clean = query.strip()
    while True:
        trimmed = re.sub(r'\s*\[(?:verb-only|PAA)\b[^\]]*\]\s*$', '', clean, flags=re.I).strip()
        if trimmed == clean:
            return clean
        clean = trimmed


def case_terms(text):
    # Discovery aliases only: a match never establishes the claimed work or outcome.
    aliases = {'customer': 'client', 'customers': 'client', 'clients': 'client',
               'editors': 'editor', 'commenters': 'commenter', 'permissions': 'permission',
               'workflows': 'workflow', 'invoices': 'invoice', 'onboarding': 'intake'}
    stop = {'the', 'and', 'for', 'from', 'with', 'this', 'that', 'what', 'when', 'where',
            'which', 'how', 'our', 'your', 'are', 'can', 'does', 'should', 'using', 'use',
            'only', 'also', 'much', 'versus'}
    return {aliases.get(w, w) for w in re.findall(r'[a-z0-9]{3,}', text.lower()) if w not in stop}


def layer3_cases(root, query, publisher, bank, experience, context_queries=None):
    """Layer3-only discovery material; not automatic claim or testing approval."""
    catalog_path = local(root, '.claude/commands/_layer3-experience-catalog.json')
    catalog = read(catalog_path)
    require(catalog.get('schemaVersion') == VERSION and catalog.get('publisher') == 'layer3labs.io',
            'Invalid Layer3 experience catalog')
    records = catalog.get('records')
    require(isinstance(records, list), 'Layer3 experience catalog requires records')
    public_fields = {'id', 'publicDescription', 'relationship', 'topic', 'workSummary',
                     'possibleUses', 'evidenceStatus', 'limits', 'outcomeLeads',
                     'privateTestimonialRecords', 'verification'}
    seen = set()
    for record in records:
        require(isinstance(record, dict) and set(record) <= public_fields,
                'Layer3 catalog contains unexpected/private fields; use the anonymized export')
        for field in public_fields - {'outcomeLeads', 'privateTestimonialRecords'}:
            require(isinstance(record.get(field), str), 'Experience catalog text must be a scalar: ' + field)
            content(record.get(field), 'experience catalog.' + field)
        require(record['id'] not in seen, 'Duplicate experience catalog record id')
        seen.add(record['id'])
        count = record.get('privateTestimonialRecords', 0)
        require(type(count) is int and count >= 0, 'Invalid private testimonial count')
        leads = record.get('outcomeLeads', [])
        require(isinstance(leads, list), 'Outcome leads must be an array')
        for lead in leads:
            require(isinstance(lead, dict) and set(lead) == {'metric', 'periods', 'values', 'basis'},
                    'Outcome lead contains unexpected/private fields')
            require(all(isinstance(lead[k], str) and lead[k].strip() for k in ['metric', 'basis']),
                    'Outcome lead descriptions must be scalar text')
            periods, values = lead['periods'], lead['values']
            require(isinstance(periods, list) and periods and
                    all(isinstance(v, str) and v.strip() for v in periods),
                    'Outcome periods must be text labels')
            require(isinstance(values, list) and len(values) == len(periods) and
                    all(type(v) in (int, float) and math.isfinite(v) for v in values),
                    'Outcome values must be finite numbers matching the periods')
    search_query = clean_reader_question(query)
    content(search_query, 'clean case search question')
    context_queries = context_queries or []
    require(isinstance(context_queries, list) and all(isinstance(q, str) and q.strip() for q in context_queries),
            'Case context queries must be nonempty text')
    contexts = [clean_reader_question(q) for q in context_queries]
    for context in contexts:
        content(context, 'clean case context')
    words = case_terms(search_query)
    context_words = set().union(*(case_terms(q) for q in contexts))
    candidates = []
    for record in records:
        searchable = {k: record.get(k, '') for k in
                      ['publicDescription', 'topic', 'workSummary', 'possibleUses']}
        terms = case_terms(' '.join(searchable.values()))
        direct, contextual = words & terms, context_words & terms
        matches = sorted(direct | contextual)
        if matches:
            candidates.append({'record': record, 'topicMatches': matches,
                               'matchSources': {'question': sorted(direct), 'context': sorted(contextual)},
                               'attribution': 'Use the anonymous public description for clients. '
                               'Verify the specific claim and its basis before adding it to writer facts; '
                               'a discovered project is not an observed outcome or product test.'})
    return {'schemaVersion': VERSION, 'query': query, 'searchQuery': search_query,
            'contextQueries': context_queries, 'publisher': publisher,
            'bankSha256': file_sha(bank), 'experienceSha256': file_sha(experience),
            'localExperience': 'Read .claude/commands/_experience.md as internal permission context; '
                               'its named client examples are private and superseded by the local anonymity rule.',
            'experienceCatalog': {'path': str(catalog_path.relative_to(root.resolve())),
                                  'sha256': file_sha(catalog_path), 'recordsSearched': len(records)},
            'sourcePolicy': artifact_ref(root, '.claude/commands/_layer3-evidence-sources.md'),
            'candidates': sorted(candidates, key=lambda r: (-len(r['topicMatches']), r['record']['id'])),
            'privateClientContext': [],
            'instruction': 'This catalog is one optional source, not the sole source or a source-count target. '
                           'Combine as many relevant sources as needed: experience, internal modeling/calculations, '
                           'actual survey records, primary documents, external research and executed tasks. '
                           'Verify each claim, retain its own evidence basis and record actual sources in sourceArtifacts. '
                           'No relevant case means use other supported sources, not force a case or stop. '
                           'Never publish client identities or searchable testimonial text; preserve local exclusions '
                           'and the terminal no-addition branch.'}


def artifact_ref(root, relative):
    path = local(root, relative)
    return {'path': relative, 'sha256': file_sha(path)}


def cases(root, query, publisher, context_queries=None):
    bank = root / '.claude/commands/_approved-cases.json'
    experience = local(root, '.claude/commands/_experience.md')
    # Other publishers keep their existing behavior. No global/fleet rollout is implied.
    if (publisher.lower().removeprefix('www.') == 'layer3labs.io' and
            any((root / '.claude/commands' / name).exists() for name in
                ['_layer3-experience-catalog.json', '_layer3-evidence-sources.md'])):
        return layer3_cases(root.resolve(), query, publisher, bank, experience, context_queries)
    require(not context_queries, 'Context query expansion is currently Layer3-only')
    words = set(re.findall(r'[a-z0-9]{3,}', clean_reader_question(query).lower()))
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


def cases_batch(root, manifest_path, publisher, out_dir):
    plan = read(local(root, manifest_path))
    actions = plan.get('actions')
    require(isinstance(actions, list), 'Manifest requires actions list')
    target_dir = (root.resolve() / out_dir).resolve()
    require(target_dir.is_relative_to(root.resolve()), 'Output directory escapes active repository: ' + out_dir)
    results = []
    for row in actions:
        if row.get('bucket') not in SUBSTANTIVE:
            continue
        target = str(row.get('target', '')).strip()
        question = str(row.get('reader_question', '')).strip()
        require(target and question, f"Substantive action {row.get('id')} missing target or reader_question")
        slug = target.strip('/').rsplit('/', 1)[-1] or 'index'
        slug = re.sub(r'[^a-zA-Z0-9._-]+', '-', slug).strip('-') or 'index'
        dest = target_dir / slug / 'cases.json'
        dest.parent.mkdir(parents=True, exist_ok=True)
        payload = cases(root, question, publisher)
        dest.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n')
        results.append({
            'actionId': row.get('id'),
            'target': target,
            'slug': slug,
            'path': str(dest.relative_to(root.resolve())),
            'sha256': file_sha(dest),
            'candidates': len(payload['candidates']),
        })
    return {'status': 'retrieved-not-approved', 'count': len(results), 'items': results}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', default='.')
    s = p.add_subparsers(dest='command', required=True)
    for name in ['validate-chart', 'render-chart', 'generation-check']:
        q = s.add_parser(name)
        q.add_argument('--manifest', required=True)
        q.add_argument('--review', required=True)
        if name == 'validate-chart':
            q.add_argument('--chart', help='Optional expected rendered chart path')
        if name == 'render-chart':
            q.add_argument('--out', required=True)
        if name == 'generation-check':
            q.add_argument('--packet', required=True)
            q.add_argument('--slug', required=True)
            q.add_argument('--section', action='store_true')
    q = s.add_parser('validate-analysis')
    q.add_argument('--packet', required=True)
    q = s.add_parser('audit-analysis')
    q.add_argument('--packet', required=True)
    q.add_argument('--review', required=True)
    q.add_argument('--replay-output')
    q = s.add_parser('cases')
    q.add_argument('--query', required=True)
    q.add_argument('--context-query', action='append', default=[], help='Layer3: relevant workflow/problem query; repeat as needed')
    q.add_argument('--publisher', '--site-host', dest='publisher', required=True)
    q.add_argument('--out', required=True)
    q = s.add_parser('cases-batch')
    q.add_argument('--manifest', required=True)
    q.add_argument('--publisher', '--site-host', dest='publisher', required=True)
    q.add_argument('--out-dir', required=True)
    q = s.add_parser('hash')
    q.add_argument('--file', required=True)
    a = p.parse_args()
    root = Path(a.root).resolve()
    if a.command == 'hash':
        path = local(root, a.file)
        print(json.dumps({'sha256': file_sha(path), 'canonicalJsonSha256': digest(read(path))}))
        return
    if a.command == 'cases':
        result = cases(root, a.query, a.publisher, a.context_query)
        Path(a.out).write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
        print(json.dumps({'status': 'retrieved-not-approved', 'candidates': len(result['candidates'])}))
        return
    if a.command == 'cases-batch':
        print(json.dumps(cases_batch(root, a.manifest, a.publisher, a.out_dir), indent=2))
        return
    if a.command == 'validate-analysis':
        analysis(root, read(a.packet))
    elif a.command == 'audit-analysis':
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
            if a.command == 'validate-chart' and getattr(a, 'chart', None):
                require(Path(a.chart).resolve() == (root / plan['chartPath']).resolve(),
                        'Specified --chart path differs from manifest chartPath')
            saved_chart(root, plan)
            complete_news_chart(root, plan, review)
            complete_hype_chart(root, plan, review)
            complete_competitor_chart(root, plan, review)
    print(json.dumps({'status': 'PASS', 'scope': 'Structural/artifact checks only; independent judgment and existing approval/rendered-publication gates remain required.'}))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError, TypeError, json.JSONDecodeError) as e:
        print(json.dumps({'status': 'FAIL', 'error': str(e)}), file=sys.stderr)
        sys.exit(1)
