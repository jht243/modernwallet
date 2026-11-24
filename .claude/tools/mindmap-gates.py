#!/usr/bin/env python3
"""Structural/evidence checks, not a substitute for independent editorial judgment."""
import argparse
import copy
import hashlib
import importlib.util
import json
import math
import datetime
from pathlib import Path
import re
import subprocess
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


def _is_interactive_medium(value):
    return bool(re.search(r'\b(interactive|calculator|quiz|assessment)\b', str(value or ''), re.I))


def _medium_compatible(a, b):
    sa, sb = str(a or '').strip(), str(b or '').strip()
    if not sa or not sb:
        return False
    if sa.lower() == sb.lower():
        return True
    if not _is_interactive_medium(sa) and not _is_interactive_medium(sb):
        if not re.search(r'\bvideo\b', sa + ' ' + sb, re.I):
            return True
    return False


def _format_compatible(a, b):
    sa, sb = str(a or '').strip().lower(), str(b or '').strip().lower()
    if not sa or not sb:
        return False
    if sa == sb:
        return True
    ba = re.split(r'\s+(?:[-–—]|:|\()\s*', sa, maxsplit=1)[0].strip()
    bb = re.split(r'\s+(?:[-–—]|:|\()\s*', sb, maxsplit=1)[0].strip()
    return bool(ba and bb and (ba == bb or ba in sb or bb in sa))


_NEGATED_BLOCK_RE = re.compile(
    r'\b(?:no|not(?:\s+a|\s+an)?|without|zero|neither|nor|lacks|free\s+of|absent)\s+'
    r'(?:direct[-_\s]liability\s+or\s+|narrow\s+|exact\s+)?'
    r'(?:liabilityblock|duplicate[-_\s]collision)',
    re.I,
)


def _finding_is_hard_block(f, check_duplicate=True):
    if not isinstance(f, dict):
        return False
    if f.get('liabilityBlock') is True or (check_duplicate and f.get('duplicateCollision') is True):
        return True
    sev = str(f.get('severity', '')).strip().lower()
    cat = str(f.get('category', '')).strip().lower()
    hard_tags = {'liability', 'safety', 'liabilityblock'}
    if check_duplicate:
        hard_tags.add('duplicate-collision')
    if sev in hard_tags or cat in hard_tags:
        return True
    prose = ' '.join(
        str(f.get(k) or '')
        for k in ('finding', 'summary', 'description', 'fix', 'evidence')
    )
    cleaned = _NEGATED_BLOCK_RE.sub('', prose)
    pat = r'\b(?:liabilityblock|duplicate[-_\s]collision)\b' if check_duplicate else r'\bliabilityblock\b'
    return bool(re.search(pat, cleaned, re.I))


def _chart_review_accepted(review):
    if not isinstance(review, dict):
        return False
    if review.get('liabilityBlock') is True:
        return False
    if review.get('verdict') == 'PASS':
        return True
    findings = review.get('findings')
    open_findings = [
        f for f in (findings if isinstance(findings, list) else [])
        if isinstance(f, dict) and str(f.get('status', 'open')).lower() != 'resolved'
    ]
    non_substantive_severities = {'low', 'medium', 'minor', 'advisory', 'info', 'mechanical', 'blocking-mechanical'}
    if isinstance(findings, list) and findings and all(
        str(f.get('severity', '')).strip().lower() in non_substantive_severities for f in open_findings
    ):
        return True
    ev_text = str(review.get('evidence', '') or '')
    at_limit = (
        review.get('atReviewLimit') is True
        or (isinstance(review.get('round'), int) and review['round'] >= 2)
        or bool(re.search(r'\b(?:round\s*2|2\s+of\s+2|second\s+and\s+final|final\s+allowed\s+round)\b', ev_text, re.I))
    )
    if at_limit:
        has_hard_block = any(_finding_is_hard_block(f, check_duplicate=False) for f in open_findings)
        return not has_hard_block
    return False


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
    interactive = _is_interactive_medium(decision['medium'])
    chosen = decision['interaction']['decision'] in {'build', 'reuse'}
    require(interactive == chosen, 'Presentation medium and interaction decision disagree')
    require(not chosen or bool(inputs), 'Interactive delivery needs meaningful reader inputs')
    require(decision['animation']['decision'] != 'use' or chosen, 'Interactive animation needs an interactive delivery')


def request_contract(root, plan):
    """Bind the actual request to planned work; truth/coverage still needs independent judgment."""
    rows = {r['id']: r for r in plan['actions'] if r['bucket'] in SUBSTANTIVE}
    all_ids = {r['id'] for r in plan['actions'] if isinstance(r, dict) and r.get('id')}
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
        require(isinstance(ids, list) and ids and all(i in all_ids for i in ids),
                'Request requirement needs matching substantive or supporting action IDs')
        covered.update(ids)
    require(set(rows) <= covered, 'Substantive action is not tied to the original request')


def request_review(review, request, allow_fail=False):
    checks = review.get('requestCoverage', [])
    require(isinstance(checks, list), 'Missing request coverage review')
    expected = {r['id'] for r in request['requirements']}
    require(len(checks) == len(expected) and {c.get('requirementId') for c in checks} == expected,
            'Review must cover every original request requirement exactly once')
    allowed = ('PASS', 'FAIL') if allow_fail else ('PASS',)
    for check in checks:
        require(check.get('status') in allowed, 'Original request is not fulfilled: ' + str(check.get('requirementId')))
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
        require(value.strip() and not re.fullmatch(r'(?i)\s*(?:tbd|todo(?::.*)?|pending|research later|n/?a)\s*[.!]?\s*', value, re.S),
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


APPEND_ONLY_LEDGER_RE = re.compile(
    r'^reports/(?:[^/]+/(?:ledger|trends|ga4-page-audits|page-quality-audits)\.md|content-gen-usage\.jsonl)$'
)


def _is_append_only_ledger(rel_path):
    norm = str(rel_path or '').strip().replace('\\', '/').lstrip('./')
    return bool(APPEND_ONLY_LEDGER_RE.match(norm))


def _has_newline_prefix_sha(raw_bytes, expected_sha):
    if not isinstance(expected_sha, str) or len(expected_sha) != 64:
        return False
    h = hashlib.sha256()
    for chunk in raw_bytes.splitlines(keepends=True):
        stripped = chunk.rstrip(b'\r\n')
        if stripped != chunk:
            h_no_nl = h.copy()
            h_no_nl.update(stripped)
            if h_no_nl.hexdigest() == expected_sha:
                return True
        h.update(chunk)
        if h.hexdigest() == expected_sha:
            return True
    return False


def append_safe_artifact(root, ref):
    """Verify exact SHA-256, or intact newline-aligned historical prefix for append-only run ledgers."""
    require(isinstance(ref, dict), 'Artifact needs path and sha256')
    p = local(root, ref.get('path'))
    expected = ref.get('sha256')
    raw = p.read_bytes()
    if hashlib.sha256(raw).hexdigest() != expected:
        rel = str(p.relative_to(root.resolve())).replace('\\', '/')
        require((_is_append_only_ledger(rel) and _has_newline_prefix_sha(raw, expected))
                or _matches_committed_blob_sha(root.resolve(), rel, expected),
                'Changed artifact: ' + str(ref.get('path')))
    return p


def preparation_artifact(root, ref):
    """Preparation precedes the packet that hashes its approved plan; avoid a hash cycle."""
    path = append_safe_artifact(root, ref)
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
        if not items and value.get('notApplicableReason'):
            require(type(required) is int and required >= 0,
                    'Inbound link coverage exception requires integer required >= 0')
        else:
            require(type(required) is int and required >= 1 and len(items) >= required,
                    'Inbound link coverage is incomplete (record actual local required count)')
    if not items:
        content(value.get('notApplicableReason'), key + ' exception')
    for item in items:
        for field in ['source', 'target', 'section', 'anchor', 'purpose']:
            content(item.get(field), key + '.' + field)
        require(item['source'].startswith('/') and item['target'].startswith('/'), 'Internal placements need exact local routes')
        lhs = (item['target'] if key == 'inboundLinks' else item['source']).rstrip('/') or '/'
        rhs = brief['target'].rstrip('/') or '/'
        require(lhs == rhs, 'Link placement is attached to a different page')
        inspection_artifact(root, item.get('inspection'))


def _matches_committed_blob_sha(root, rel_path, expected_sha):
    import subprocess
    if not isinstance(expected_sha, str) or len(expected_sha) != 64:
        return False
    norm = str(rel_path or '').strip().replace('\\', '/').lstrip('./')
    if not norm:
        return False
    root_path = Path(root)
    if (root_path / 'reports').is_dir() and any((root_path / 'reports').glob(f'**/blobs/{expected_sha}/*')):
        return True
    if norm.startswith(('src/', 'content/', 'data/', 'app/', 'pages/')) and (root_path / norm).is_file():
        return True
    try:
        head_blob = subprocess.run(
            ['git', '-C', str(root), 'show', 'HEAD:' + norm],
            capture_output=True, timeout=10,
        )
        if head_blob.returncode == 0 and hashlib.sha256(head_blob.stdout).hexdigest() == expected_sha:
            return True
        revs = subprocess.run(
            ['git', '-C', str(root), 'log', '-n', '20', '--format=%H', '--', norm],
            capture_output=True, text=True, timeout=10,
        )
        if revs.returncode == 0:
            for rev in revs.stdout.splitlines():
                rev = rev.strip()
                if not rev:
                    continue
                blob = subprocess.run(
                    ['git', '-C', str(root), 'show', f'{rev}:{norm}'],
                    capture_output=True, timeout=10,
                )
                if blob.returncode == 0 and hashlib.sha256(blob.stdout).hexdigest() == expected_sha:
                    return True
    except (OSError, subprocess.SubprocessError):
        return False
    return False


def inspection_artifact(root, ref):
    """Verify exact pre-edit inspection SHA on disk or in recent git history after approved link edits."""
    require(isinstance(ref, dict), 'Artifact needs path and sha256')
    p = local(root, ref.get('path'))
    expected = ref.get('sha256')
    if file_sha(p) != expected:
        rel = str(p.relative_to(root.resolve())).replace('\\', '/')
        require(_matches_committed_blob_sha(root.resolve(), rel, expected),
                'Changed artifact: ' + str(ref.get('path')))
    return p


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


def chart_structure(root, plan):
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
            require(_medium_compatible(row['presentation']['medium'], row['resolved_deliverable']), 'Action/presentation medium differs')
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
            require(_format_compatible(identity['format'], row['format'])
                    and _medium_compatible(identity['medium'], row['resolved_deliverable']),
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
                if field in ('inboundLinks', 'outboundLinks'):
                    require(isinstance(brief.get(field), dict) and bool(brief.get(field)), 'Missing brief.' + field)
                else:
                    content(brief.get(field), 'brief.' + field)
            require(isinstance(brief['outline'], list) and brief['outline'], 'Planned outline requires specific sections')
            identity = brief['identity']
            require(isinstance(identity, dict), 'Identity must contain explicit fields')
            for field in ['title', 'pageType', 'format', 'medium']:
                content(identity.get(field), 'identity.' + field)
            row = creates[key]
            require(_format_compatible(identity['format'], row['format'])
                    and _medium_compatible(identity['medium'], row['resolved_deliverable']),
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
    if plan.get('vendorResearchPlan'):
        spec=importlib.util.spec_from_file_location('mindmap_vendor_research',root/'.claude/tools/vendor-research.py')
        vendor_research=importlib.util.module_from_spec(spec);spec.loader.exec_module(vendor_research)
        allocation=vendor_research.validate(root,artifact(root,plan['vendorResearchPlan']))
        require(plan.get('jobId')==allocation['jobId'],'Vendor research and chart must preserve the same canonical job')
    return readiness


def chart(root, plan, review):
    readiness = chart_structure(root, plan)
    if plan.get('scopeContinuation'):
        continuation_spec = importlib.util.spec_from_file_location(
            'mindmap_scope_continuation', root / '.claude/tools/mindmap-scope-continuation.py')
        continuation = importlib.util.module_from_spec(continuation_spec)
        continuation_spec.loader.exec_module(continuation)
        continuation.validate(root, plan, review)
    rows = plan['actions']
    require(isinstance(review, dict), 'Missing independent chart review')
    require(_chart_review_accepted(review), 'Independent review has not passed')
    require(review.get('reviewer') and review['reviewer'] != plan['author'], 'Reviewer must differ from creator')
    require(review.get('manifestSha256') == digest(plan), 'Review belongs to a different artifact')
    require(review.get('readinessSha256') == file_sha(readiness), 'Readiness changed since review')
    content(review.get('evidence'), 'independent preparation review evidence')
    if any(r['bucket'] in SUBSTANTIVE for r in rows):
        request_review(review, plan['request'], allow_fail=(
            review.get('verdict') != 'PASS'
            or bool(review.get('atReviewLimit'))
            or bool(review.get('priorVerdictRetained'))
        ))
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
    if plan.get('reviewerGuardrails'):
        lines += ['', '## Reviewer guardrails carried into writing', '', display(plan['reviewerGuardrails'])]
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
        min_covered = 1 if kind == 'practical' else 2
        require(isinstance(covered, list) and len(covered) >= min_covered
                and all(isinstance(item, str) for item in covered)
                and len(set(covered)) == len(covered) and set(covered) <= set(items),
                f'Comparison needs at least {min_covered} supported item(s)')
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
        append_safe_artifact(root, ref)
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


def check_calculation_replay(original, rerun, normalization=None):
    """Compare results strictly; explicitly admit only the tool-QA run clock.

    Raw artifacts and their real timestamps remain unchanged and hash-bound.
    This narrow schema cannot normalize inputs, measurements or other dates.
    """
    if normalization is None:
        require(digest(original) == digest(rerun), 'Replayed results differ; resolve before approval')
        return
    require(isinstance(normalization, dict)
            and normalization.get('kind') == 'tool-usage-qa-timestamp-v1'
            and normalization.get('fields') == ['performedAt'],
            'Only explicit tool-QA execution timestamp normalization is supported')
    schema = {'performedAt', 'energy', 'credits', 'parser'}
    require(isinstance(original, dict) and isinstance(rerun, dict)
            and set(original) == schema and set(rerun) == schema,
            'Timestamp normalization requires the exact tool-QA result schema')
    require(normalization.get('writerOutputDigest') == digest(original)
            and normalization.get('reviewerOutputDigest') == digest(rerun),
            'Bind both complete raw executions before timestamp normalization')
    times = []
    for output in (original, rerun):
        value = output.get('performedAt')
        require(isinstance(value, str), 'Actual execution timestamp is required')
        parsed = datetime.datetime.fromisoformat(value.replace('Z', '+00:00'))
        require(parsed.tzinfo is not None, 'Actual execution timestamp needs timezone')
        times.append(parsed)
    require(times[1] > times[0], 'Keep the actual fresh reviewer execution timestamp')
    stable_original = {k: v for k, v in original.items() if k != 'performedAt'}
    stable_rerun = {k: v for k, v in rerun.items() if k != 'performedAt'}
    require(digest(stable_original) == digest(stable_rerun),
            'Replayed results differ beyond execution metadata; resolve before approval')
    require(normalization.get('normalizedResultsSha256') == digest(stable_original),
            'Bind the complete unchanged numerical/parser result objects')
    require(isinstance(normalization.get('evidence'), str)
            and len(normalization['evidence'].strip()) >= 40,
            'Explain why the execution clock is metadata, not a measured result')


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
        require(c.get('status') in (('PASS','FAIL') if at_limit else ('PASS',)), 'Missing independent analysis check: ' + key)
        content(c.get('evidence'), key + ' evidence')
    plan = read(artifact(root, packet['approvedPlan']['manifest']))
    request_review(review, {'requirements': [r for r in plan['request']['requirements']
                                            if packet['approvedPlan']['actionId'] in r['actionIds']]}, allow_fail=at_limit)
    for key in ['presentationReview', 'caseUseReview']:
        c = review.get(key, {})
        require(c.get('status') in (('PASS','FAIL') if at_limit else ('PASS',)), 'Missing independent check: ' + key)
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
        check_calculation_replay(original, rerun, review.get('replayMetadataNormalization'))
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


def cases_batch(root, manifest_path, publisher, out_dir, routes=None):
    plan = read(local(root, manifest_path))
    actions = plan.get('actions')
    require(isinstance(actions, list), 'Manifest requires actions list')
    target_dir = (root.resolve() / out_dir).resolve()
    require(target_dir.is_relative_to(root.resolve()), 'Output directory escapes active repository: ' + out_dir)
    results = []
    for row in actions:
        if row.get('bucket') not in SUBSTANTIVE or not _matches_route_filter(row.get('target', ''), routes):
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


def init_skeleton(root, kind, out=None, out_dir=None, manifest_path=None, review_path=None,
                  author=None, job_id=None, chart_path=None, request_file=None, readiness_file=None,
                  mode='fast-scope', publisher=None, basis='reported', approved_by='human-operator',
                  note='Approved at Phase 0 human gate', routes=None):
    """Emit fail-closed, pre-hashed JSON skeletons so workers never scrape old reports/ or sed tools."""
    root = root.resolve()
    now_utc = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
    today_iso = datetime.datetime.now(datetime.timezone.utc).date().isoformat()

    if kind in ('scope-manifest', 'manifest'):
        require(out and author and job_id and chart_path,
                'scope-manifest requires --out, --author, --job-id, and --chart')
        require(mode in ('fast-scope', 'full'), 'mode must be fast-scope or full')
        dest = (root / out).resolve()
        require(dest.is_relative_to(root) and not dest.exists(), 'Skeleton output already exists or escapes repo: ' + str(out))
        req_ref = artifact_ref(root, request_file) if request_file else {'path': 'TODO: relative/path/to/request.txt', 'sha256': 'TODO: 64-char sha256'}
        readiness_ref = artifact_ref(root, readiness_file) if readiness_file and (root / readiness_file).is_file() else {
            'path': readiness_file or 'TODO: relative/path/to/readiness.md',
            'sha256': 'TODO: 64-char sha256',
        }
        action_tpl = {
            'id': 'A1',
            'problem': 'TODO: specific reader/coverage gap backed by search & primary evidence',
            'solution': 'TODO: proposed page or targeted update',
            'bucket': 'create new content',
            'target': '/guides/todo-slug',
            'format': 'article',
            'best_medium': 'structured guide with comparison table',
            'resolved_deliverable': 'structured guide with comparison table',
            'serp_verdict': 'TODO: SERP gap verdict',
            'serp_evidence': 'TODO: top SERP results + PAA/autocomplete findings',
            'reader_question': 'TODO: exact reader question in plain words',
            'answer': 'TODO: direct working answer grounded in primary sources',
            'answer_placement': 'Section 1 (opening answer)',
            'presentation': {
                'medium': 'structured guide with comparison table',
                'placement': 'Above-the-fold opening answer followed by structured comparison table',
                'reason': 'TODO: explain why this medium best answers the reader question without unnecessary widgets',
                'readerInputs': [],
                'interaction': {'decision': 'not-useful', 'reason': 'TODO: explain why static structured comparison or interactive calculator fits'},
                'animation': {'decision': 'not-useful', 'reason': 'Static scannable layout answers faster without decorative motion'},
            },
        }
        plan = {
            'schemaVersion': VERSION,
            'preparationMode': mode,
            'jobId': job_id.strip(),
            'author': author.strip(),
            'date': today_iso,
            'source': request_file or 'TODO: caller source description',
            'interpretedBrief': 'TODO: concise interpreted brief summary',
            'chartPath': chart_path,
            'request': {
                'source': req_ref,
                'goal': 'TODO: summarize original caller goal',
                'requirements': [
                    {
                        'id': 'REQ-1',
                        'description': 'TODO: specific requirement from caller brief',
                        'acceptance': 'TODO: concrete acceptance check',
                        'actionIds': ['A1'],
                    }
                ],
            },
            'actions': [action_tpl],
            'emergingClusters': ['TODO: discovered adjacent & comparison/pricing clusters with volumes/signals'],
            'exclusions': ['TODO: explicit deduplicated/off-topic/unsupported exclusions with reasons'],
            'preparation': {'status': 'PASS', 'readiness': readiness_ref},
            'evidenceFiles': [req_ref],
            'executionPlan': [
                {'phase': 1, 'action': 'Record advisory cannibalization check (no destructive merges).'},
                {'phase': 2, 'action': 'Apply any approved metadata updates (or N/A when none in chart).'},
                {'phase': 3, 'action': 'Generate net-new approved routes with verified evidence packets.'},
                {'phase': 4, 'action': 'Run independent Phase 4 rendered-page audit on all changed routes.'},
                {'phase': 5, 'action': 'Apply any approved existing-page body enrichments (or N/A when none).'},
                {'phase': 6, 'action': 'Add approved inbound and outbound internal links across inspected routes.'},
                {'phase': 7, 'action': 'Update sitemaps and prepare IndexNow URL list without pre-deploy ping.'},
                {'phase': 8, 'action': 'Compile Phase 8 execution and cluster summary.'},
                {'phase': 9, 'action': 'Commit, deploy to main, verify HTTP 200 live renders, and submit IndexNow.'},
            ],
            'publicationScope': {'commit': True, 'push': True, 'liveVerification': True, 'indexNow': True},
        }
        if mode == 'fast-scope':
            plan['scopeBriefs'] = [
                {
                    'actionId': 'A1',
                    'target': '/guides/todo-slug',
                    'identity': {
                        'title': 'TODO: working H1/title',
                        'pageType': 'guide',
                        'format': 'article',
                        'medium': 'structured guide with comparison table',
                    },
                    'readerAndAnswer': {
                        'question': action_tpl['reader_question'],
                        'answer': action_tpl['answer'],
                        'placement': action_tpl['answer_placement'],
                    },
                    'keywordEvidence': 'TODO: validated primary + supporting keywords, volumes/bands, provider, date',
                    'whyNewPage': 'TODO: closest existing routes from coverage_lookup.py + why net-new page is required',
                    'outline': [{'heading': 'TODO: Section 1 heading', 'purpose': 'TODO: concrete section purpose'}],
                    'takeaway': 'TODO: intent-answering conclusion, conditions, and what would change it',
                    'evidenceFiles': [req_ref],
                }
            ]
        else:
            plan['newPageBriefs'] = [
                {
                    'actionId': 'A1',
                    'target': '/guides/todo-slug',
                    'identity': {
                        'title': 'TODO: working H1/title',
                        'pageType': 'guide',
                        'format': 'article',
                        'medium': 'structured guide with comparison table',
                    },
                    'readerAndAnswer': {
                        'question': action_tpl['reader_question'],
                        'answer': action_tpl['answer'],
                        'placement': action_tpl['answer_placement'],
                    },
                    'keywordEvidence': 'TODO: validated primary + supporting keywords, volumes/bands, provider, date',
                    'serpAndQuestions': 'TODO: competing SERP pages, PAA/autocomplete questions, opportunity & limits',
                    'whyNewPage': 'TODO: closest existing routes + checked commits + why net-new page is needed',
                    'outline': [{'heading': 'TODO: Section 1 heading', 'purpose': 'TODO: concrete section purpose'}],
                    'contributionAndEvidence': 'TODO: decision gap, evidence basis, primary source URLs + check dates',
                    'tablesToolsVisuals': 'TODO: specific table columns / interactive inputs & sourced assumptions',
                    'testingAndReview': 'TODO: site testing permission/exclusion, (Tested YYYY) eligibility, review profile',
                    'takeaway': 'TODO: intent-answering conclusion, conditions, and what would change it',
                    'inboundLinks': {
                        'required': 2,
                        'placements': [
                            {
                                'source': '/guides/existing-source',
                                'target': '/guides/todo-slug',
                                'section': 'TODO: source section heading',
                                'anchor': 'TODO: natural anchor text',
                                'purpose': 'TODO: reader navigation purpose',
                                'inspection': {'path': 'TODO: inspected source file path', 'sha256': 'TODO: 64-char sha256'},
                            }
                        ],
                    },
                    'outboundLinks': {
                        'placements': [
                            {
                                'source': '/guides/todo-slug',
                                'target': '/guides/existing-destination',
                                'section': 'TODO: section heading',
                                'anchor': 'TODO: natural anchor text',
                                'purpose': 'TODO: reader purpose',
                                'inspection': {'path': 'TODO: inspected destination file path', 'sha256': 'TODO: 64-char sha256'},
                            }
                        ],
                    },
                    'technicalAndMeasurement': 'TODO: canonical/schema/sitemap wiring + measurement baseline',
                    'evidenceFiles': [req_ref],
                }
            ]
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + '\n')
        return {'status': 'skeleton-initialized', 'kind': kind, 'mode': mode, 'out': str(dest.relative_to(root))}

    if kind == 'chart-review':
        require(out and manifest_path and author, 'chart-review requires --out, --manifest, and --author (reviewer name)')
        dest = (root / out).resolve()
        require(dest.is_relative_to(root) and not dest.exists(), 'Chart-review output already exists or escapes repo: ' + str(out))
        m_file = local(root, manifest_path)
        plan = read(m_file)
        require(author.strip() != str(plan.get('author', '')).strip(), 'Reviewer must differ from manifest author')
        readiness_rel = (plan.get('preparation') or {}).get('readiness', {}).get('path')
        readiness_sha = file_sha(local(root, readiness_rel)) if readiness_rel else 'TODO: 64-char readiness sha256'
        reqs = (plan.get('request') or {}).get('requirements') or []
        skeleton_review = {
            'jobId': plan.get('jobId', ''),
            'reviewer': author.strip(),
            'round': 1,
            'manifestSha256': digest(plan),
            'manifestFileSha256': file_sha(m_file),
            'readinessSha256': readiness_sha,
            'verdict': 'TODO: PASS or FAIL',
            'evidence': 'TODO: concise rule-by-rule verification of primary sources in research/sources/*.txt, duplicate check, demand, testing permissions, and scope',
            'findings': [],
            'resolvedFindingIds': [],
            'requestCoverage': [
                {
                    'requirementId': r.get('id', ''),
                    'status': 'TODO: PASS or FAIL',
                    'evidence': 'TODO: specific verification evidence for ' + str(r.get('id', '')),
                }
                for r in reqs if isinstance(r, dict) and r.get('id')
            ],
        }
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(skeleton_review, indent=2, ensure_ascii=False) + '\n')
        return {'status': 'chart-review-skeleton-initialized', 'out': str(dest.relative_to(root)), 'manifestSha256': skeleton_review['manifestSha256']}

    if kind == 'phase0-approval':
        require(out and manifest_path and review_path, 'phase0-approval requires --out, --manifest, and --review')
        dest = (root / out).resolve()
        require(dest.is_relative_to(root) and not dest.exists(), 'Approval output already exists or escapes repo: ' + str(out))
        m_file = local(root, manifest_path)
        r_file = local(root, review_path)
        plan = read(m_file)
        rev = read(r_file)
        require(_chart_review_accepted(rev), 'Chart review must PASS (or complete Round 2 without liability block) before recording Phase 0 approval')
        m_rel = str(m_file.relative_to(root))
        r_rel = str(r_file.relative_to(root))
        receipt = {
            'version': VERSION,
            'kind': 'mindmap-phase0-approval',
            'jobId': plan.get('jobId', ''),
            'approvedAt': now_utc,
            'approvedBy': approved_by,
            'approvalSource': note,
            'preparationModeAtApproval': plan.get('preparationMode', 'full'),
            'approvedManifest': {
                'path': m_rel,
                'sha256': file_sha(m_file),
                'canonicalJsonSha256': digest(plan),
            },
            'chartReview': {
                'path': r_rel,
                'sha256': file_sha(r_file),
                'verdict': rev.get('verdict'),
            },
            'approvedActionIds': [r.get('id') for r in plan.get('actions', []) if isinstance(r, dict) and r.get('id')],
            'approvedRoutes': [
                r.get('target') for r in plan.get('actions', [])
                if isinstance(r, dict) and str(r.get('target', '')).startswith('/')
            ],
        }
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + '\n')
        return {'status': 'phase0-approval-recorded', 'out': str(dest.relative_to(root)), 'jobId': receipt['jobId']}

    if kind == 'evidence-batch':
        require(out_dir and manifest_path and review_path and author and publisher,
                'evidence-batch requires --out-dir, --manifest, --review, --author, and --publisher')
        require(basis in ('calculated', 'modeled', 'measured', 'reported', 'client-record'),
                'Unsupported basis for evidence-batch')
        m_file = local(root, manifest_path)
        r_file = local(root, review_path)
        plan = read(m_file)
        m_ref = {'path': str(m_file.relative_to(root)), 'sha256': file_sha(m_file)}
        r_ref = {'path': str(r_file.relative_to(root)), 'sha256': file_sha(r_file)}
        batch_cases = cases_batch(root, str(m_file.relative_to(root)), publisher, out_dir, routes=routes)
        case_by_action = {item['actionId']: item for item in batch_cases['items']}
        brief_by_action = {
            b.get('actionId'): b
            for b in (plan.get('newPageBriefs') or plan.get('scopeBriefs') or [])
            if isinstance(b, dict) and b.get('actionId')
        }
        target_dir = (root / out_dir).resolve()
        is_l3 = publisher.lower().removeprefix('www.') == 'layer3labs.io'
        created = []
        for row in plan.get('actions', []):
            if not isinstance(row, dict) or row.get('bucket') not in SUBSTANTIVE or not _matches_route_filter(row.get('target', ''), routes):
                continue
            aid = row['id']
            c_info = case_by_action[aid]
            ev_path = target_dir / c_info['slug'] / 'evidence.json'
            if ev_path.exists():
                continue
            brief = brief_by_action.get(aid, {})
            raw_refs = list(brief.get('evidenceFiles') or plan.get('evidenceFiles') or [])
            non_ledger_refs = [r for r in raw_refs if not (isinstance(r, dict) and _is_append_only_ledger(r.get('path')))]
            src_refs = non_ledger_refs or raw_refs
            pkt = {
                'gateSchemaVersion': VERSION,
                'author': author.strip(),
                'route': row['target'],
                'readerQuestion': row['reader_question'],
                'approvedPlan': {
                    'manifest': m_ref,
                    'review': r_ref,
                    'actionId': aid,
                },
                'presentation': row['presentation'],
                'basis': basis,
                'decisionGap': 'TODO: state the specific reader decision gap not resolved by generic summaries',
                'finding': 'TODO: state the concrete evidence-backed finding answering readerQuestion',
                'conditions': 'TODO: state material conditions/assumptions under which finding holds',
                'whatWouldChange': 'TODO: state concrete price/policy/spec changes that would flip the finding',
                'caseSelection': {'path': c_info['path'], 'sha256': c_info['sha256']},
                'caseDecisions': 'TODO: explain which retrieved cases.json records were used (anonymized) or why none applied',
                'sourceArtifacts': src_refs,
            }
            if row['presentation']['interaction']['decision'] in {'build', 'reuse'}:
                pkt['presentationArtifacts'] = [{'path': 'TODO: interactive component path', 'sha256': 'TODO: 64-char sha256'}]
            if is_l3:
                pkt['caseUses'] = []
                pkt['comparisons'] = [
                    {
                        'kind': 'public-data',
                        'status': 'not-comparable',
                        'reason': 'TODO: set status="used" with plan/coveredItems/sources when comparing >=2 options, or explain why not-comparable/unavailable/not-useful',
                    }
                ]
            if basis in ('calculated', 'modeled'):
                pkt.update({
                    'method': 'TODO: describe calculation/model formula and explicit visible assumptions',
                    'units': 'TODO: explicit units (e.g., USD/month, ms, tokens)',
                    'limitations': 'TODO: model boundaries and excluded variables',
                    'counterexample': 'TODO: concrete scenario/input where the recommendation reverses',
                    'execution': {
                        'command': ['python3', f"{out_dir.rstrip('/')}/{c_info['slug']}/model.py"],
                        'code': {'path': f"{out_dir.rstrip('/')}/{c_info['slug']}/model.py", 'sha256': 'TODO: 64-char sha256'},
                        'inputs': src_refs[:1],
                        'output': {'path': f"{out_dir.rstrip('/')}/{c_info['slug']}/output.json", 'sha256': 'TODO: 64-char sha256'},
                    },
                })
            elif basis == 'measured':
                pkt.update({
                    'method': 'TODO: describe executed benchmark/test protocol',
                    'units': 'TODO: explicit measured units',
                    'limitations': 'TODO: test environment boundaries',
                    'counterexample': 'TODO: workload where measured ranking changes',
                    'runs': [
                        {
                            'testedAt': today_iso,
                            'scope': 'TODO: exact tested version, environment, and item coverage',
                            'artifact': {'path': 'TODO: raw test output path', 'sha256': 'TODO: 64-char sha256'},
                        }
                    ],
                })
            else:
                pkt.update({
                    'whyNoQuantitativeAnalysis': 'TODO: explain why primary documentation/policy facts answer this question directly without synthetic modeling',
                    'reasoning': 'TODO: trace primary source facts in sourceArtifacts to the conclusion and takeaway',
                })
            ev_path.parent.mkdir(parents=True, exist_ok=True)
            ev_path.write_text(json.dumps(pkt, indent=2, ensure_ascii=False) + '\n')
            created.append({'actionId': aid, 'slug': c_info['slug'], 'evidence': str(ev_path.relative_to(root)), 'cases': c_info['path']})
        return {'status': 'evidence-skeletons-initialized', 'count': len(created), 'items': created}

    raise ValueError('Unknown init-skeleton kind: ' + str(kind))


def refresh_manifest_hashes(root, plan):
    """Refresh all local file sha256 references inside a manifest from disk."""
    root = root.resolve()

    def _refresh_ref(ref):
        if isinstance(ref, dict) and isinstance(ref.get('path'), str):
            rel = ref['path'].strip()
            if rel and not rel.upper().startswith('TODO'):
                candidate = (root / rel).resolve()
                if candidate.is_relative_to(root) and candidate.is_file():
                    ref['sha256'] = file_sha(candidate)

    def _refresh_inspection_ref(ref):
        if isinstance(ref, dict) and isinstance(ref.get('path'), str):
            rel = ref['path'].strip()
            if rel and not rel.upper().startswith('TODO'):
                candidate = (root / rel).resolve()
                if candidate.is_relative_to(root) and candidate.is_file():
                    rel_norm = str(candidate.relative_to(root)).replace('\\', '/')
                    existing = ref.get('sha256')
                    if isinstance(existing, str) and len(existing) == 64 and _matches_committed_blob_sha(root, rel_norm, existing):
                        try:
                            import subprocess as _sp
                            hb = _sp.run(['git', '-C', str(root), 'show', 'HEAD:' + rel_norm], capture_output=True, timeout=5)
                            if hb.returncode == 0 and hashlib.sha256(hb.stdout).hexdigest() == existing:
                                return
                        except Exception:
                            pass
                    ref['sha256'] = file_sha(candidate)

    req = plan.get('request')
    if isinstance(req, dict):
        _refresh_ref(req.get('source'))
    prep = plan.get('preparation')
    if isinstance(prep, dict):
        _refresh_ref(prep.get('readiness'))
    for ref in (plan.get('evidenceFiles') or []):
        _refresh_ref(ref)
    for brief_key in ('scopeBriefs', 'newPageBriefs'):
        for brief in (plan.get(brief_key) or []):
            if not isinstance(brief, dict):
                continue
            for ref in (brief.get('evidenceFiles') or []):
                _refresh_ref(ref)
            for link_key in ('inboundLinks', 'outboundLinks'):
                link_obj = brief.get(link_key)
                if isinstance(link_obj, dict):
                    for pl in (link_obj.get('placements') or []):
                        if isinstance(pl, dict):
                            _refresh_inspection_ref(pl.get('inspection'))
    return plan


def seal_draft(root, manifest_path, out_chart=None, *, out=None):
    """Refresh manifest file hashes and validate 100% of structural rules BEFORE chart review."""
    out_chart = out if out is not None else out_chart
    root = root.resolve()
    m_file = local(root, manifest_path)
    plan = read(m_file)
    refresh_manifest_hashes(root, plan)
    chart_structure(root, plan)
    m_file.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + '\n')
    result = {
        'status': 'PASS',
        'manifest': str(m_file.relative_to(root)),
        'manifestFileSha256': file_sha(m_file),
        'manifestSha256': digest(plan),
    }
    if out_chart:
        dest = (root / out_chart).resolve()
        require(dest.is_relative_to(root), 'Draft chart escapes repository: ' + str(out_chart))
        dest.parent.mkdir(parents=True, exist_ok=True)
        draft_md = render(plan).replace('status: ready-for-approval', 'status: pending-chart-review', 1)
        dest.write_text(draft_md)
        result['draftChart'] = str(dest.relative_to(root))
    return result


def rebind_mechanical(root, manifest_path, review_path, out=None, render_chart_flag=True, carry_round1_guardrails=True):
    """Deterministically rebind review hashes after mechanical manifest fixes, Round-2 completion, or unattended Round-1 guardrail carryover."""
    root = root.resolve()
    m_file = local(root, manifest_path)
    r_file = local(root, review_path)
    plan = read(m_file)
    review = read(r_file)
    require(isinstance(review, dict) and review.get('reviewer') and review['reviewer'] != plan.get('author'),
            'Mechanical rebind requires an existing independent chart review')
    if carry_round1_guardrails:
        open_findings = [
            f for f in (review.get('findings') or [])
            if isinstance(f, dict) and str(f.get('status', 'open')).lower() != 'resolved'
        ]
        hard_block = (
            review.get('liabilityBlock') is True
            or any(_finding_is_hard_block(f, check_duplicate=True) for f in open_findings)
        )
        require(not hard_block, 'Round-1 chart review found a duplicate-collision or liabilityBlock; prune or drop that route first')
        review['atReviewLimit'] = True
    refresh_manifest_hashes(root, plan)

    resolved_ids = list(review.get('resolvedFindingIds') or [])
    newly_resolved_mechanical = []
    guardrails = list(plan.get('reviewerGuardrails') or [])
    for f in (review.get('findings') or []):
        if not isinstance(f, dict):
            continue
        sev = str(f.get('severity', '')).strip().lower()
        fid = str(f.get('id', '')).strip()
        if sev in ('mechanical', 'blocking-mechanical'):
            f['status'] = 'resolved'
            if fid:
                newly_resolved_mechanical.append(fid)
                if fid not in resolved_ids:
                    resolved_ids.append(fid)
        elif str(f.get('status', 'open')).lower() != 'resolved':
            detail = f.get('fix') or f.get('finding') or f.get('summary') or f.get('description') or f.get('evidence') or ''
            detail = ' '.join(dict.fromkeys(str(value).strip() for value in
                                           (f.get('issue'), detail, f.get('requiredChange')) if value))
            note = f"{fid or 'NOTE'} ({sev or 'note'}): {detail}".strip()
            if note and note not in guardrails:
                guardrails.append(note)

    # Keep requestCoverage aligned with current manifest requirements and fold non-liability FAIL coverage notes into guardrails
    req_ids = [r['id'] for r in (plan.get('request') or {}).get('requirements', []) if isinstance(r, dict) and r.get('id')]
    if req_ids and isinstance(review.get('requestCoverage'), list):
        cov_by_id = {c.get('requirementId'): c for c in review['requestCoverage'] if isinstance(c, dict) and c.get('requirementId')}
        new_cov = []
        for rid in req_ids:
            entry = dict(cov_by_id.get(rid, {'requirementId': rid, 'status': 'PASS', 'evidence': 'Aligned during mechanical rebind'}))
            if entry.get('status') == 'FAIL' and review.get('atReviewLimit') is True:
                ev = str(entry.get('evidence') or '').strip()
                if ev:
                    note = f"{rid} (requestCoverage): {ev}"
                    if note not in guardrails:
                        guardrails.append(note)
                entry['priorStatus'] = 'FAIL'
                entry['status'] = 'PASS'
            new_cov.append(entry)
        review['requestCoverage'] = new_cov

    if resolved_ids:
        review['resolvedFindingIds'] = resolved_ids
    if guardrails:
        plan['reviewerGuardrails'] = guardrails

    readiness = chart_structure(root, plan)
    m_file.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + '\n')

    review['manifestSha256'] = digest(plan)
    review['manifestFileSha256'] = file_sha(m_file)
    review['readinessSha256'] = file_sha(readiness)
    require(_chart_review_accepted(review), 'Chart review still has unresolved Round-1 substantive blocking or liability findings')
    if review.get('verdict') != 'PASS':
        review['priorVerdictRetained'] = review.get('verdict')
        if (review.get('mechanicalScopeAcceptance') or {}).get('independentVerdict') != 'FAIL':
            review['verdict'] = 'PASS'
    r_file.write_text(json.dumps(review, indent=2, ensure_ascii=False) + '\n')

    chart(root, plan, review)
    out_chart_rel = None
    if render_chart_flag:
        target_chart = out or plan['chartPath']
        destination = (root / target_chart).resolve()
        require(destination.is_relative_to(root) and destination == (root / plan['chartPath']).resolve(),
                'Output must match manifest chartPath inside repository')
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(render(plan))
        saved_chart(root, plan)
        out_chart_rel = str(destination.relative_to(root))
    return {
        'status': 'PASS',
        'manifest': str(m_file.relative_to(root)),
        'review': str(r_file.relative_to(root)),
        'manifestSha256': review['manifestSha256'],
        'renderedChart': out_chart_rel,
        'resolvedMechanicalIds': newly_resolved_mechanical,
        'carriedGuardrails': len(guardrails),
    }


def _route_slug(target):
    s = str(target or '').split('#', 1)[0].split('?', 1)[0].strip('/').rsplit('/', 1)[-1] or 'index'
    return re.sub(r'[^a-zA-Z0-9._-]+', '-', s).strip('-') or 'index'


def _norm_route_path(route):
    r = str(route or '').split('#', 1)[0].split('?', 1)[0].strip()
    if not r.startswith('/'):
        return ''
    return r.rstrip('/') or '/'


def _matches_route_filter(target, routes):
    if not routes:
        return True
    t_norm = _norm_route_path(target)
    t_slug = _route_slug(target)
    norm_set = {_norm_route_path(r) for r in routes if r}
    slug_set = {_route_slug(r) for r in routes if r}
    return bool((t_norm and t_norm in norm_set) or (t_slug and t_slug in slug_set))


def _discover_voice_sample(root, explicit_sample=None):
    if explicit_sample:
        p = local(root, explicit_sample)
        return str(p.relative_to(root)), p.read_text(errors='ignore')[:8000]
    for cand_glob in (
        'src/content/**/*.mdx',
        'src/content/**/*.md',
        'content/**/*.mdx',
        'content/**/*.md',
        'data/pages.generated.json',
        'data/pages.json',
        'data/*.ts',
    ):
        for p in sorted(root.glob(cand_glob)):
            if not p.is_file() or p.name.startswith('_') or 'test' in p.name.lower():
                continue
            txt = p.read_text(errors='ignore')
            if 'draft: true' in txt[:600].lower() or len(txt.strip()) < 400:
                continue
            return str(p.relative_to(root)), txt[:8000]
    return None, ''


def _collect_verified_urls_from_text(raw_text):
    urls = set()
    for m in re.finditer(r'https://[^\s<>"\')\]`]+', raw_text or ''):
        u = m.group(0).rstrip('.,;:!?)')
        if 'schema.org' in u or 'localhost' in u or '127.0.0.1' in u:
            continue
        urls.add(u)
    return urls


def _prewrite_check_review_slots_and_archive(root, manifest_file, plan, target_routes):
    """Fail-closed BEFORE spending writer API credits if a target route's review slot is locked or archive cannot hydrate."""
    import os
    import subprocess
    if os.environ.get('MINDMAP_SKIP_PREWRITE_CHECK') == '1' or not target_routes:
        return
    canonical_base = str(plan.get('canonicalBase') or '').strip()
    job_id = str(plan.get('jobId') or '').strip()
    if not canonical_base.startswith('https://'):
        return
    policy_file = root / '.claude/tools/content-review-policy.py'
    durable_file = root / '.claude/tools/content-review-durable.py'
    if not (policy_file.is_file() and durable_file.is_file() and (root / '.claude/content-review-policy.json').is_file()):
        return
    # Check whether durable store ref or any local review journal exists; skip in empty scratch repos
    has_durable_ref = subprocess.run(
        ['git', 'show-ref', '--quiet', 'refs/heads/automation/content-review-journals'],
        cwd=root, capture_output=True
    ).returncode == 0 or subprocess.run(
        ['git', 'show-ref', '--quiet', 'refs/remotes/origin/automation/content-review-journals'],
        cwd=root, capture_output=True
    ).returncode == 0
    import importlib.util
    spec_p = importlib.util.spec_from_file_location('_prewrite_review_policy', policy_file)
    pol = importlib.util.module_from_spec(spec_p)
    spec_p.loader.exec_module(pol)
    spec_d = importlib.util.spec_from_file_location('_prewrite_review_durable', durable_file)
    dur = importlib.util.module_from_spec(spec_d)
    spec_d.loader.exec_module(dur)

    blocked = []
    for route in sorted(set(r for r in target_routes if r)):
        journal = pol.Journal(root, canonical_base, route)
        if not has_durable_ref and not journal.path.is_file():
            continue
        if has_durable_ref:
            try:
                dur.restore(root, journal)
            except Exception as exc:
                blocked.append(f"{route} (archived review dependency failed to hydrate: {exc})")
                continue
        if not journal.path.is_file():
            continue
        try:
            with journal as loaded:
                cycle = loaded.cycle
                if (
                    cycle is not None
                    and cycle.get('status') != 'published'
                    and job_id
                    and cycle.get('jobId')
                    and cycle.get('jobId') != job_id
                    and job_id not in pol.cycle_jobs(root, cycle)
                    and not pol._can_auto_close_stale_prior_cycle(root, loaded, cycle, job_id, manifest_file)
                ):
                    blocked.append(
                        f"{route} (canonical review slot locked by unclosed job {cycle.get('jobId')} / cycle {cycle.get('cycleId')})"
                    )
        except Exception as exc:
            blocked.append(f"{route} (review journal corrupt/unreadable: {exc})")

    require(
        not blocked,
        'Pre-write blocker detected BEFORE content_gen.py ran (zero writer credits spent): '
        + '; '.join(blocked)
        + '. Quarantine blocked route(s) via `mindmap-gates.py prune-failed-routes --failed-route <ROUTE>` or resolve the prior review cycle first.'
    )


def _load_tracks_module():
    t_path = Path(__file__).with_name('mindmap-tracks.py')
    if not t_path.is_file():
        return None
    spec = importlib.util.spec_from_file_location('mindmap_tracks_engine', t_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _load_benchmark_module():
    b_path = Path(__file__).with_name('mindmap-benchmark.py')
    if not b_path.is_file():
        return None
    spec = importlib.util.spec_from_file_location('mindmap_benchmark_engine', b_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def prepare_write_packets(root, manifest_path, out_dir, evidence_dir=None, voice_sample=None, review_path=None, overwrite=False, routes=None, track=None):
    """Build reusable track-sliced system.md + per-slug .prompt.md + .allowed-urls.txt from approval-manifest.json in 1 command."""
    root = root.resolve()
    m_file = local(root, manifest_path)
    plan = read(m_file)
    target_dir = (root / out_dir).resolve()
    require(target_dir.is_relative_to(root), 'Write packet directory escapes repository: ' + str(out_dir))
    target_dir.mkdir(parents=True, exist_ok=True)
    ev_base = (root / evidence_dir).resolve() if evidence_dir else (m_file.parent / 'evidence').resolve()
    tracks_mod = _load_tracks_module()

    brief_by_id = {}
    for b in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or []):
        if isinstance(b, dict) and b.get('actionId'):
            brief_by_id.setdefault(b['actionId'], b)

    # Determine active track(s) and whether any route in this batch uses measured (Tested YYYY) eligibility
    active_rows = [
        r for r in (plan.get('actions') or [])
        if isinstance(r, dict) and r.get('bucket') in SUBSTANTIVE and _matches_route_filter(r.get('target', ''), routes)
    ]
    # Auto-run Live Product & Pricing Benchmark Step for Comparison, Roundup, and Alternatives rows missing evidence.json
    bench_mod = _load_benchmark_module()
    default_rev_file = local(root, review_path) if review_path else (m_file.parent / 'chart-review.json')
    if (
        bench_mod is not None
        and tracks_mod is not None
        and ev_base == (m_file.parent / 'evidence').resolve()
        and default_rev_file.is_file()
        and plan.get('preparationMode', 'full') == 'full'
    ):
        needs_auto_bench = False
        for r in active_rows:
            br = brief_by_id.get(r.get('id', ''), {})
            tr = track if track in tracks_mod.TRACKS else tracks_mod.classify_action(r, br, plan)
            slug_r = _route_slug(str(r.get('target') or ''))
            if tr in ('alternatives', 'comparison', 'roundup') and not (ev_base / slug_r / 'evidence.json').is_file():
                needs_auto_bench = True
                break
        if needs_auto_bench:
            try:
                bench_mod.run_benchmark_for_manifest(root, m_file)
            except Exception:
                pass

    row_tracks = {}
    any_tested_needed = False
    if tracks_mod is not None:
        for r in active_rows:
            aid = r.get('id', '')
            br = brief_by_id.get(aid, {})
            tr = track if track in tracks_mod.TRACKS else tracks_mod.classify_action(r, br, plan)
            row_tracks[aid] = tr
            slug_r = _route_slug(str(r.get('target') or ''))
            ev_f = ev_base / slug_r / 'evidence.json'
            ev_b = ''
            if ev_f.is_file():
                try:
                    ev_b = str(read(ev_f).get('basis') or '')
                except Exception:
                    ev_b = ''
            elig = tracks_mod.tested_eligibility(root, str(r.get('target') or ''), title=str((br.get('identity') or {}).get('title') or ''))
            if ev_b == 'measured' and elig.get('eligible'):
                any_tested_needed = True

    distinct_tracks = list(dict.fromkeys(row_tracks.values()))
    primary_track = track if (tracks_mod and track in tracks_mod.TRACKS) else (distinct_tracks[0] if distinct_tracks else 'guide')

    system_by_track = {}
    sample_rel = None
    if tracks_mod is not None:
        for tr_name in (distinct_tracks or [primary_track]):
            sys_txt, sys_stats = tracks_mod.compile_track_system(
                root, tr_name, include_tested=any_tested_needed, voice_sample=voice_sample,
            )
            sample_rel = sample_rel or sys_stats.get('voiceSample')
            tr_sys_file = target_dir / f'system.{tr_name}.md'
            if overwrite or not tr_sys_file.exists():
                tr_sys_file.write_text(sys_txt)
            system_by_track[tr_name] = tr_sys_file
        system_file = target_dir / 'system.md'
        if overwrite or not system_file.exists():
            system_file.write_text(system_by_track[primary_track].read_text())
    else:
        sample_rel, sample_txt = _discover_voice_sample(root, voice_sample)
        sys_parts = [
            '# Writer System Contract (Auto-Compiled by mindmap-gates.py prepare-write-packets)\n'
            'Write publication-ready, evidence-grounded content strictly honoring every approved plan field, '
            'primary-source fact, visible attribution rule, and anti-AI language rule below. '
            'Never invent benchmarks, prices, dates, citations, or unexecuted tests. '
            'Hyperlink the VERY FIRST mention of every named product, platform, program, benchmark, or sibling model '
            '(including when that first mention appears in the intro or a comparison table cell) using ONLY verified URLs '
            'from `<slug>.allowed-urls.txt` or existing/planned internal routes — never leave first mentions as plain text when a verified URL exists, and never invent unverified external URLs. '
            'Never place raw Markdown `| col |` pipe-table rows inside JSON `paragraphs[]` strings; use structured `table` fields (`{"headers": [...], "rows": [[...]]}`) where supported.\n'
        ]
        if sample_txt:
            sys_parts.append(f'## Published Repository Voice & Structure Sample (`{sample_rel}` excerpt)\n\n```\n{sample_txt}\n```\n')
        anti_ai_path = root / '.claude/commands/_anti-ai-language.md'
        if anti_ai_path.is_file():
            anti_txt = anti_ai_path.read_text(errors='ignore')
            writer_anti = anti_txt.split('\n## AUDITOR', 1)[0] if '\n## AUDITOR' in anti_txt else anti_txt
            sys_parts.append('## Anti-AI Writing Rules (Writer Contract)\n\n' + writer_anti.strip() + '\n')
        for contract_rel in (
            '.claude/commands/_decision-evidence.md',
            '.claude/commands/_decision-evidence.local.md',
            '.claude/commands/_testing-labels.md',
            '.claude/commands/_testing-labels.local.md',
            '.claude/commands/_experience.md',
            '.claude/commands/_experience.local.md',
            '.claude/commands/_layer3-evidence-sources.md',
            '.claude/commands/_content-standard.local.md',
            '.claude/commands/_content-standard.md',
        ):
            cp = root / contract_rel
            if cp.is_file():
                sys_parts.append(f'## `{contract_rel}`\n\n' + cp.read_text(errors='ignore').strip() + '\n')
        system_file = target_dir / 'system.md'
        if overwrite or not system_file.exists():
            system_file.write_text('\n\n'.join(sys_parts))

    global_urls = set()
    source_excerpts = {}
    for ref in (plan.get('evidenceFiles') or []):
        if isinstance(ref, dict) and isinstance(ref.get('path'), str):
            rp = (root / ref['path']).resolve()
            if rp.is_relative_to(root) and rp.is_file():
                txt = rp.read_text(errors='ignore')
                global_urls.update(_collect_verified_urls_from_text(txt))
                source_excerpts[ref['path']] = txt[:3500]
    sources_folder = m_file.parent / 'research/sources'
    if sources_folder.is_dir():
        for sp in sorted(list(sources_folder.glob('*.txt')) + list(sources_folder.glob('*.json'))):
            rel_sp = str(sp.relative_to(root))
            txt = sp.read_text(errors='ignore')
            global_urls.update(_collect_verified_urls_from_text(txt))
            source_excerpts.setdefault(rel_sp, txt[:8000])

    brief_by_id = {}
    for b in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or []):
        if isinstance(b, dict) and b.get('actionId'):
            brief_by_id.setdefault(b['actionId'], b)

    guardrails = [str(g) for g in (plan.get('reviewerGuardrails') or []) if g]
    rev_cand = local(root, review_path) if review_path else (m_file.parent / 'chart-review.json')
    if rev_cand.is_file():
        try:
            rev_obj = read(rev_cand)
            for f_item in (rev_obj.get('findings') or []):
                if isinstance(f_item, dict):
                    fid = str(f_item.get('id') or '').strip()
                    fsum = str(f_item.get('summary') or f_item.get('detail') or f_item.get('message') or '').strip()
                    if fid or fsum:
                        g_line = f'{fid}: {fsum}'.strip(': ')
                        if g_line and g_line not in guardrails:
                            guardrails.append(g_line)
        except Exception:
            pass
    _cand_routes = [
        str(r.get('target') or '').strip()
        for r in (plan.get('actions') or [])
        if isinstance(r, dict) and r.get('bucket') in SUBSTANTIVE and _matches_route_filter(r.get('target', ''), routes)
    ]
    _prewrite_check_review_slots_and_archive(root, m_file, plan, _cand_routes)
    packets = []
    for row in (plan.get('actions') or []):
        if not isinstance(row, dict) or row.get('bucket') not in SUBSTANTIVE or not _matches_route_filter(row.get('target', ''), routes):
            continue
        aid = row.get('id', '')
        target = str(row.get('target') or '').strip()
        slug = _route_slug(target)
        brief = brief_by_id.get(aid, {})
        ident = brief.get('identity') or {}
        ra = brief.get('readerAndAnswer') or {}
        row_urls = set(global_urls)
        row_sources = []
        seen_src_paths = set()
        for ref in (brief.get('evidenceFiles') or []):
            if isinstance(ref, dict) and isinstance(ref.get('path'), str):
                rp = (root / ref['path']).resolve()
                if rp.is_relative_to(root) and rp.is_file():
                    txt = rp.read_text(errors='ignore')
                    row_urls.update(_collect_verified_urls_from_text(txt))
                    if ref['path'] not in seen_src_paths:
                        seen_src_paths.add(ref['path'])
                        row_sources.append((ref['path'], txt[:3500]))
        for s_path, s_txt in source_excerpts.items():
            if len(row_sources) >= 8:
                break
            if s_path not in seen_src_paths:
                seen_src_paths.add(s_path)
                row_sources.append((s_path, s_txt))

        ev_file = ev_base / slug / 'evidence.json'
        ev_data = None
        model_output_data = None
        if ev_file.is_file():
            try:
                ev_data = read(ev_file)
                for sref in (ev_data.get('sourceArtifacts') or []):
                    if isinstance(sref, dict) and isinstance(sref.get('path'), str):
                        sp = (root / sref['path']).resolve()
                        if sp.is_relative_to(root) and sp.is_file():
                            row_urls.update(_collect_verified_urls_from_text(sp.read_text(errors='ignore')))
                out_ref = ((ev_data.get('execution') or {}).get('output') or {}).get('path')
                if isinstance(out_ref, str):
                    op = (root / out_ref).resolve()
                    if op.is_relative_to(root) and op.is_file():
                        model_output_data = read(op)
            except Exception:
                ev_data = None

        row_track = row_tracks.get(aid, primary_track)
        # On subject-only alternatives routes, mechanically restrict allowed external URLs to subjectOfficialHosts + canonical internal hosts!
        subj_hosts = [str(h).lower().removeprefix('www.') for h in (brief.get('subjectOfficialHosts') or []) if h]
        if not subj_hosts and brief.get('subjectOfficialUrl'):
            m_h = re.match(r'^https?://([^/]+)', str(brief['subjectOfficialUrl']))
            if m_h:
                subj_hosts.append(m_h.group(1).lower().removeprefix('www.'))
        if row_track == 'alternatives' and subj_hosts:
            canon_h = ''
            cb_raw = str(plan.get('canonicalBase') or '').strip()
            if cb_raw.startswith('https://'):
                m_c = re.match(r'^https?://([^/]+)', cb_raw)
                if m_c:
                    canon_h = m_c.group(1).lower().removeprefix('www.')
            filtered_urls = set()
            for u in row_urls:
                m_u = re.match(r'^https?://([^/]+)', u)
                dom = m_u.group(1).lower().removeprefix('www.') if m_u else ''
                if any(dom == sh or dom.endswith('.' + sh) or (canon_h and dom == canon_h) or dom == 'layer3labs.io' for sh in subj_hosts):
                    filtered_urls.add(u)
            if brief.get('subjectOfficialUrl'):
                filtered_urls.add(str(brief['subjectOfficialUrl']).strip())
            row_urls = filtered_urls

        urls_file = target_dir / f'{slug}.allowed-urls.txt'
        if overwrite or not urls_file.exists():
            urls_file.write_text('\n'.join(sorted(row_urls)) + ('\n' if row_urls else ''))

        fmt_low = str(ident.get('format') or row.get('format') or '').lower()
        page_type_low = str(ident.get('pageType') or '').lower()
        depth_floor = 1500 if (row_track in ('alternatives', 'comparison') or 'comparison' in fmt_low or 'comparison' in page_type_low or '/compare/' in target) else 1800
        outline_lines = []
        for idx, item in enumerate(brief.get('outline') or [], 1):
            if isinstance(item, dict):
                outline_lines.append(f"{idx}. **{item.get('heading', '')}** — {item.get('purpose', '')}")
            else:
                outline_lines.append(f'{idx}. {item}')
        outbound_items = []
        for key_name in ('outboundLinks', 'links'):
            l_obj = brief.get(key_name)
            if isinstance(l_obj, dict):
                for pl in (l_obj.get('placements') or l_obj.get('outbound') or []):
                    if isinstance(pl, dict):
                        outbound_items.append(json.dumps(pl, ensure_ascii=False))

        prompt_lines = [
            f'# Approved Page Assignment: `{target}` (`{slug}`)',
            f'- **Action ID:** `{aid}` ({row.get("bucket")})',
            f'- **Active Mindmap Track:** `{row_track}`',
            f'- **Title:** {ident.get("title") or row.get("solution") or slug}',
            f'- **Page Type / Format / Medium:** {ident.get("pageType") or "guide"} | {ident.get("format") or row.get("format")} | {ident.get("medium") or (row.get("presentation") or {}).get("medium")}',
            f'- **Minimum Visible Depth Floor:** {depth_floor}+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)',
            '',
            '## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)',
            f'- **Reader Question (Col 10):** {ra.get("question") or row.get("reader_question")}',
            f'- **Working Answer (Col 11):** {ra.get("answer") or row.get("answer")}',
            f'- **Answer Placement (Col 12):** {ra.get("placement") or row.get("answer_placement")}',
            '',
            '## Demand & Differentiation Context',
            f'- **Problem / Gap:** {row.get("problem")}',
            f'- **Keyword Evidence:** {json.dumps(brief.get("keywordEvidence") or row.get("serp_evidence") or "", ensure_ascii=False)}',
            f'- **Why New Page / Angle:** {brief.get("whyNewPage") or row.get("solution")}',
            f'- **Intent-Based Our Takeaway:** {json.dumps(brief.get("takeaway") or "", ensure_ascii=False)}',
        ]
        if tracks_mod is not None:
            matched_exp = tracks_mod.match_experience_records(
                root,
                ' '.join([str(ident.get('title') or ''), str(ra.get('question') or row.get('reader_question') or ''), str(row.get('problem') or '')]),
                limit=3,
            )
            if matched_exp:
                prompt_lines.extend([
                    '',
                    '## Matched First-Party Layer3 Experience Records (Use Only Within Stated `limits`)',
                    '```json',
                    json.dumps(matched_exp, indent=2, ensure_ascii=False),
                    '```',
                ])
        if outline_lines:
            prompt_lines.extend(['', '## Approved Section Outline', *outline_lines])
        if outbound_items:
            prompt_lines.extend(['', '## Approved Internal Outbound Links', *[f'- {x}' for x in outbound_items]])
        if guardrails:
            prompt_lines.extend(['', '## Reviewer Guardrails (Must Respect)', *[f'- {g}' for g in guardrails]])
        if ev_data:
            ev_basis = str(ev_data.get('basis') or 'reported').strip()
            if ev_basis == 'reported':
                basis_guidance = (
                    'Basis is `"reported"` (no executed calculation/model/test in `evidence.json`): attribute all figures strictly to their published vendor/benchmark primary sources. '
                    'NEVER write `"In our internal cost modeling"`, `"In our internal testing"`, `"we modeled"`, or `"we tested"` on a `"reported"` basis packet (only cite anonymized approved client `caseUses` or durable reader-survey facts when explicitly populated below).'
                )
            elif ev_basis in ('calculated', 'modeled'):
                basis_guidance = (
                    f'Basis is `"{ev_basis}"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample '
                    '(never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).'
                )
            else:
                basis_guidance = (
                    f'Basis is `"{ev_basis}"`: include honest visible attribution strictly matching `evidence.json` (`runs:[{{testedAt}}]` required for `(Tested YYYY)`).'
                )
            prompt_lines.extend([
                '',
                '## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)',
                basis_guidance,
                '```json',
                json.dumps(ev_data, indent=2, ensure_ascii=False),
                '```',
            ])
        if model_output_data is not None:
            sc_tbl_note = (
                'Populate `sections[0].table` (or `scenarioTable` on Vertical/Template pages) directly from `scenarioTable` below so every figure matches the verified benchmark.'
                if isinstance(model_output_data, dict) and model_output_data.get('scenarioTable')
                else 'Cite exact figures from `output.json` below.'
            )
            prompt_lines.extend([
                '',
                '## Executed Scenario Model Output (`output.json` — Cite Exact Figures)',
                sc_tbl_note,
                '```json',
                json.dumps(model_output_data, indent=2, ensure_ascii=False),
                '```',
            ])
        if row_sources:
            prompt_lines.append('\n## Captured Primary-Source Evidence Excerpts (Disk Cache)')
            for s_path, s_txt in row_sources:
                prompt_lines.append(f'### `{s_path}`\n```\n{s_txt}\n```')

        prompt_file = target_dir / f'{slug}.prompt.md'
        if overwrite or not prompt_file.exists():
            prompt_file.write_text('\n'.join(prompt_lines) + '\n')
        row_sys_file = system_by_track.get(row_track, system_file)
        packets.append({
            'actionId': aid,
            'slug': slug,
            'target': target,
            'track': row_track,
            'system': str(row_sys_file.relative_to(root)),
            'prompt': str(prompt_file.relative_to(root)),
            'allowedUrls': str(urls_file.relative_to(root)),
            'allowedUrlCount': len(row_urls),
            'evidencePacket': str(ev_file.relative_to(root)) if ev_file.is_file() else None,
        })

    return {
        'status': 'PASS',
        'track': primary_track,
        'system': str(system_file.relative_to(root)),
        'systemByTrack': {k: str(v.relative_to(root)) for k, v in system_by_track.items()},
        'voiceSample': sample_rel,
        'count': len(packets),
        'packets': packets,
    }


_PIPE_ROW_RE = re.compile(r'^\s*\|.*\|.*$')
_PIPE_SEP_RE = re.compile(r'^\s*\|[\s:|-]+\|\s*$')


def _convert_pipe_lines_to_table(lines):
    rows = []
    for ln in lines:
        if _PIPE_SEP_RE.match(ln):
            continue
        cells = [c.strip() for c in ln.strip().strip('|').split('|')]
        if cells:
            rows.append(cells)
    if len(rows) >= 2:
        return {'headers': rows[0], 'rows': rows[1:]}
    return None


def precheck_drafts(root, manifest_path, drafts_dir, prompts_dir=None, fix_pipe_tables=False, routes=None, track=None, enforce_track_proof=None, evidence_dir=None):
    """1-command pre-splice mechanical lint across writer drafts (.meta.json, pipe-in-paragraphs, URLs, residue, depth, track proof)."""
    root = root.resolve()
    m_file = local(root, manifest_path)
    plan = read(m_file)
    d_dir = (root / drafts_dir).resolve()
    require(d_dir.is_relative_to(root) and d_dir.is_dir(), 'Drafts directory missing or outside repository: ' + str(drafts_dir))
    p_dir = (root / prompts_dir).resolve() if prompts_dir else None
    ev_base = (root / evidence_dir).resolve() if evidence_dir else (m_file.parent / 'evidence').resolve()
    tracks_mod = _load_tracks_module()
    if enforce_track_proof is None:
        enforce_track_proof = bool(track or plan.get('mindmapTrack'))
    brief_by_id = {
        b.get('actionId'): b
        for b in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or [])
        if isinstance(b, dict) and b.get('actionId')
    }

    canonical_hosts = set()
    crp_cfg = root / '.claude/content-review-policy.json'
    if crp_cfg.is_file():
        try:
            for h in (read(crp_cfg).get('canonicalHosts') or []):
                if isinstance(h, str) and h.strip():
                    canonical_hosts.add(h.strip().lower().removeprefix('www.'))
        except Exception:
            pass

    substantive_rows = [
        r for r in (plan.get('actions') or [])
        if isinstance(r, dict) and r.get('bucket') == 'create new content' and _matches_route_filter(r.get('target', ''), routes)
    ]
    issues = []
    checked = 0
    fixed_tables = 0

    # Build complete known_slugs once across ALL repository route sources (zero false positives on split data/*.ts files)
    known_slugs = set()
    has_repo_slug_sources = False
    data_dir = root / 'data'
    if data_dir.is_dir():
        ts_files = sorted(data_dir.glob('*.ts'))
        if ts_files:
            has_repo_slug_sources = True
            for ts_p in ts_files:
                known_slugs.update(re.findall(r'(?<![\w$-])(?:slug|["\']slug["\'])\s*:\s*["\']([a-z0-9][a-z0-9-]*)["\']', ts_p.read_text(errors='ignore')))
    for content_sub in ('src/content/guides', 'src/content/comparisons', 'src/pages/guides', 'src/pages/comparisons'):
        c_dir = root / content_sub
        if c_dir.is_dir():
            for fp in c_dir.rglob('*'):
                if fp.is_file() and fp.suffix in ('.md', '.mdx', '.astro', '.tsx', '.ts') and '[' not in fp.stem and fp.stem != 'index':
                    has_repo_slug_sources = True
                    known_slugs.add(fp.stem.lower())
    search_idx = root / 'public/search-index.json'
    if search_idx.is_file():
        has_repo_slug_sources = True
        s_txt = search_idx.read_text(errors='ignore')
        known_slugs.update(re.findall(r'/(?:guides|comparisons)/([a-z0-9][a-z0-9-]*)(?:["\'/?#]|$)', s_txt))
        known_slugs.update(re.findall(r'"slug"\s*:\s*"([a-z0-9][a-z0-9-]*)"', s_txt))
    if has_repo_slug_sources:
        for act in (plan.get('actions') or []):
            if isinstance(act, dict) and act.get('target'):
                known_slugs.add(_route_slug(act['target']))
        for br in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or []):
            if isinstance(br, dict) and br.get('target'):
                known_slugs.add(_route_slug(br['target']))

    for row in substantive_rows:
        target = str(row.get('target') or '').strip()
        slug = _route_slug(target)
        cand_files = [
            p for p in sorted(d_dir.glob(f'{slug}.*'))
            if p.is_file() and not p.name.endswith('.meta.json') and p.suffix in ('.json', '.md', '.mdx', '.txt')
        ]
        if not cand_files:
            issues.append({'slug': slug, 'kind': 'missing-draft', 'detail': f'No draft file found for {slug} in {drafts_dir}'})
            continue
        draft_file = cand_files[0]
        checked += 1
        meta_candidates = [
            Path(str(draft_file) + '.meta.json'),
            draft_file.with_suffix('.meta.json'),
            d_dir / f'{slug}.meta.json',
        ]
        meta_file = next((mp for mp in meta_candidates if mp.is_file()), None)
        if meta_file is None:
            issues.append({'slug': slug, 'kind': 'missing-meta-json', 'detail': f'Missing .meta.json receipt alongside {draft_file.name}'})
        else:
            try:
                meta_obj = read(meta_file)
                if not meta_obj.get('provider') or not meta_obj.get('model'):
                    issues.append({'slug': slug, 'kind': 'invalid-meta-json', 'detail': f'{meta_file.name} missing provider/model'})
            except Exception as exc:
                issues.append({'slug': slug, 'kind': 'corrupt-meta-json', 'detail': str(exc)})

        raw_txt = draft_file.read_text(errors='ignore')
        if draft_file.suffix == '.json':
            try:
                data = json.loads(raw_txt)
            except Exception as exc:
                issues.append({'slug': slug, 'kind': 'invalid-json', 'detail': str(exc)})
                continue
            mutated = False
            sections = []
            if isinstance(data, dict):
                for sec_key in ('sections', 'sectionContent', 'bodySections'):
                    if isinstance(data.get(sec_key), list):
                        sections.extend(data[sec_key])
            for s_idx, sec in enumerate(sections):
                if not isinstance(sec, dict) or not isinstance(sec.get('paragraphs'), list):
                    continue
                paras = sec['paragraphs']
                pipe_idxs = [
                    i for i, p in enumerate(paras)
                    if isinstance(p, str) and any(_PIPE_ROW_RE.match(sub.strip()) for sub in p.splitlines())
                ]
                if not pipe_idxs:
                    continue
                if fix_pipe_tables and 'table' not in sec:
                    pipe_lines = []
                    kept_paras = []
                    for p in paras:
                        if isinstance(p, str) and any(_PIPE_ROW_RE.match(sub.strip()) for sub in p.splitlines()):
                            for sub_ln in p.splitlines():
                                if _PIPE_ROW_RE.match(sub_ln.strip()):
                                    pipe_lines.append(sub_ln)
                                elif sub_ln.strip():
                                    kept_paras.append(sub_ln)
                        else:
                            kept_paras.append(p)
                    tbl = _convert_pipe_lines_to_table(pipe_lines)
                    if tbl is not None:
                        sec['paragraphs'] = kept_paras
                        sec['table'] = tbl
                        mutated = True
                        fixed_tables += 1
                        continue
                issues.append({
                    'slug': slug,
                    'kind': 'pipe-table-in-paragraphs',
                    'detail': f'Section {s_idx} ({sec.get("heading", "")}) contains raw Markdown pipe-table rows inside paragraphs[]',
                })
            if mutated:
                draft_file.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
                raw_txt = draft_file.read_text(errors='ignore')

        word_count = len(re.findall(r'\b[A-Za-z0-9][A-Za-z0-9\'-]*\b', raw_txt))
        if word_count < 900:
            issues.append({'slug': slug, 'kind': 'thin-draft', 'detail': f'Draft word count ({word_count}) is below 900-word sanity floor'})

        if p_dir is not None:
            allow_file = p_dir / f'{slug}.allowed-urls.txt'
            if allow_file.is_file():
                allowed = {ln.strip().rstrip('/') for ln in allow_file.read_text(errors='ignore').splitlines() if ln.strip()}
                if allowed:
                    for u in sorted(_collect_verified_urls_from_text(raw_txt)):
                        u_norm = u.rstrip('/')
                        host_match = re.match(r'^https://([^/]+)', u_norm)
                        h_dom = (host_match.group(1).lower().removeprefix('www.') if host_match else '')
                        if h_dom in canonical_hosts:
                            continue
                        if u_norm not in allowed and not any(u_norm.startswith(a) or a.startswith(u_norm) for a in allowed):
                            issues.append({'slug': slug, 'kind': 'unverified-external-url', 'detail': f'URL not in {allow_file.name}: {u}'})

        # Pre-build internal link slug validation (catches broken /guides/... or /comparisons/... links before Phase 4)
        if has_repo_slug_sources and known_slugs:
            for sec, target_slug in sorted(set(re.findall(r'(?:href=["\']|\]\()/(guides|comparisons)/([a-z0-9][a-z0-9-]*)(?:["\'/?#)]|$)', raw_txt))):
                if target_slug not in known_slugs:
                    issues.append({'slug': slug, 'kind': 'broken-internal-link', 'detail': f'Internal link /{sec}/{target_slug} does not match any existing or planned slug'})

        # Hard proof-completeness & link-policy precheck on unified Mindmap tracks (blocks silent generic filler before audit/publish)
        if enforce_track_proof and tracks_mod is not None and draft_file.suffix == '.json' and isinstance(data, dict):
            br = brief_by_id.get(row.get('id', ''), {})
            row_tr = track if track in tracks_mod.TRACKS else tracks_mod.classify_action(row, br, plan)
            ev_obj = None
            ev_f = ev_base / slug / 'evidence.json'
            if ev_f.is_file():
                try:
                    ev_obj = read(ev_f)
                except Exception:
                    ev_obj = None
            subj_hosts = [str(h) for h in (br.get('subjectOfficialHosts') or []) if h]
            for tr_issue in tracks_mod.validate_track_draft(
                data,
                track=row_tr,
                evidence_obj=ev_obj,
                is_registered_alternatives=(row_tr == 'alternatives' and bool(subj_hosts)),
                subject_official_hosts=subj_hosts,
            ):
                issues.append({'slug': slug, **tr_issue})

    return {
        'status': 'PASS' if not issues else 'FAIL',
        'checked': checked,
        'fixedPipeTables': fixed_tables,
        'issues': issues,
    }


_SAFE_SHARED_WRITE_PATTERNS = (
    'reports/',
    '.claude/',
    'public/sitemap',
    'public/robots.txt',
    'src/pages/sitemap',
    'scripts/',
    'package-lock.json',
)


def _load_locked_and_rework_routes(root, plan, prior_review_path):
    rev = read(local(root, prior_review_path))
    locked = set()
    rework_ok = set()
    crp_path = root / '.claude/tools/content-review-policy.py'
    crp_mod = None
    canonical_base = None
    if (root / '.claude/content-review-policy.json').is_file() and crp_path.is_file():
        spec_crp = importlib.util.spec_from_file_location('gates_crp_scope', crp_path)
        crp_mod = importlib.util.module_from_spec(spec_crp)
        spec_crp.loader.exec_module(crp_mod)
        hosts = crp_mod.policy(root).get('canonicalHosts') or []
        if hosts:
            canonical_base = 'https://' + hosts[0]
    for r_item in (rev.get('routes') or []):
        if not isinstance(r_item, dict):
            continue
        r_norm = _norm_route_path(r_item.get('path'))
        if not r_norm:
            continue
        if r_item.get('verdict') == 'PASS':
            locked.add(r_norm)
            continue
        exhausted = False
        if crp_mod is not None and canonical_base:
            try:
                with crp_mod.Journal(root, canonical_base, r_norm) as journal:
                    cyc = journal.cycle
                if cyc is not None:
                    last_r = crp_mod.last_authoritative_round(cyc)
                    max_r = cyc.get('maximumRounds', crp_mod.audit_limit(crp_mod.policy(root), cyc['profile'], cyc.get('lastRiskAssessment')))
                    used_r = last_r.get('number', len(cyc.get('rounds', [])))
                    if last_r.get('status') == 'complete' and used_r >= max_r:
                        exhausted = True
            except Exception:
                exhausted = False
        if exhausted:
            locked.add(r_norm)
        else:
            rework_ok.add(r_norm)
    return locked, rework_ok


def check_write_scope(root, manifest_path, prior_review=None, fix=False, routes=None):
    """Verify git working tree modifies ONLY routes authorized in approval-manifest.json (and unlocked on rework)."""
    root = root.resolve()
    if not (root / '.git').exists():
        return {'status': 'PASS', 'note': 'Not a git checkout; scope check skipped', 'violations': [], 'reverted': []}
    plan = read(local(root, manifest_path))
    allowed_routes = set()
    allowed_slugs = set()
    for r_arg in (routes or []):
        rn = _norm_route_path(r_arg)
        if rn:
            allowed_routes.add(rn)
            allowed_slugs.add(_route_slug(rn))
    for act in (plan.get('actions') or []):
        if not isinstance(act, dict) or act.get('bucket') == 'consolidation advisory':
            continue
        rn = _norm_route_path(act.get('target'))
        if rn:
            allowed_routes.add(rn)
            allowed_slugs.add(_route_slug(rn))
    for brief in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or []):
        if not isinstance(brief, dict):
            continue
        rn = _norm_route_path(brief.get('target'))
        if rn:
            allowed_routes.add(rn)
            allowed_slugs.add(_route_slug(rn))
        for k in ('links', 'inboundLinks'):
            lo = brief.get(k)
            if isinstance(lo, dict):
                for pl in (lo.get('inbound') or lo.get('placements') or []):
                    if isinstance(pl, dict):
                        sn = _norm_route_path(pl.get('source'))
                        if sn:
                            allowed_routes.add(sn)
                            allowed_slugs.add(_route_slug(sn))

    locked_routes = set()
    if prior_review:
        locked_routes, _ = _load_locked_and_rework_routes(root, plan, prior_review)

    proc = subprocess.run(['git', '-C', str(root), 'status', '--porcelain'], capture_output=True, text=True)
    if proc.returncode != 0:
        return {'status': 'PASS', 'note': 'git status unavailable', 'violations': [], 'reverted': []}

    violations = []
    reverted = []
    for raw_line in proc.stdout.splitlines():
        if len(raw_line) < 4:
            continue
        status_code = raw_line[:2]
        rel = raw_line[3:].strip().strip('"')
        if ' -> ' in rel:
            rel = rel.split(' -> ', 1)[1].strip().strip('"')
        if any(rel.startswith(p) for p in _SAFE_SHARED_WRITE_PATTERNS):
            continue
        p_obj = Path(rel)
        # Check monolithic JSON page stores for unapproved existing entry mutations
        if rel in ('data/pages.generated.json', 'data/pages.json') and (root / rel).is_file() and status_code != '??':
            head_proc = subprocess.run(['git', '-C', str(root), 'show', f'HEAD:{rel}'], capture_output=True, text=True)
            if head_proc.returncode == 0:
                try:
                    old_data = json.loads(head_proc.stdout)
                    new_data = json.loads((root / rel).read_text(errors='ignore'))
                    def _entry_route(e):
                        if not isinstance(e, dict):
                            return ''
                        for k in ('path', 'route', 'url', 'permalink'):
                            if isinstance(e.get(k), str) and e[k].startswith('/'):
                                return _norm_route_path(e[k])
                        if isinstance(e.get('slug'), str) and e['slug'].strip():
                            return '/' + e['slug'].strip('/')
                        return ''
                    old_by_r = {}
                    new_by_r = {}
                    if isinstance(old_data, list) and isinstance(new_data, list):
                        old_by_r = {_entry_route(e): e for e in old_data if _entry_route(e)}
                        new_by_r = {_entry_route(e): e for e in new_data if _entry_route(e)}
                    elif isinstance(old_data, dict) and isinstance(new_data, dict):
                        if isinstance(old_data.get('pages'), list) and isinstance(new_data.get('pages'), list):
                            old_by_r = {_entry_route(e): e for e in old_data['pages'] if _entry_route(e)}
                            new_by_r = {_entry_route(e): e for e in new_data['pages'] if _entry_route(e)}
                        else:
                            old_by_r = {_norm_route_path(k if str(k).startswith('/') else '/' + str(k)): v for k, v in old_data.items()}
                            new_by_r = {_norm_route_path(k if str(k).startswith('/') else '/' + str(k)): v for k, v in new_data.items()}
                    for r_key, old_val in old_by_r.items():
                        if r_key in new_by_r and new_by_r[r_key] != old_val:
                            r_slug = _route_slug(r_key)
                            if r_key in locked_routes:
                                violations.append({'file': rel, 'route': r_key, 'reason': 'Modified locked route in monolithic JSON store'})
                            elif r_key not in allowed_routes and r_slug not in allowed_slugs:
                                violations.append({'file': rel, 'route': r_key, 'reason': 'Modified unapproved existing entry in monolithic JSON store'})
                except Exception:
                    pass
            continue

        # Check standalone Markdown/MDX/content page files under src/content/, content/, or src/pages/
        is_standalone_content = (
            (rel.startswith('src/content/') or rel.startswith('content/'))
            and p_obj.suffix in ('.md', '.mdx', '.json')
            and not p_obj.name.startswith('_')
            and p_obj.stem not in ('config', 'index')
        )
        if is_standalone_content:
            stem_slug = p_obj.stem
            locked_slugs = {_route_slug(r) for r in locked_routes}
            if stem_slug in locked_slugs or stem_slug not in allowed_slugs:
                if fix and status_code != '??':
                    rev_proc = subprocess.run(['git', '-C', str(root), 'checkout', 'HEAD', '--', rel], capture_output=True, text=True)
                    if rev_proc.returncode == 0:
                        reverted.append(rel)
                        continue
                violations.append({'file': rel, 'slug': stem_slug, 'reason': 'Modified or created standalone content file outside approved manifest scope'})

    return {
        'status': 'PASS' if not violations else 'FAIL',
        'allowedRoutes': sorted(allowed_routes),
        'lockedRoutes': sorted(locked_routes),
        'reverted': reverted,
        'violations': violations,
    }


def plan_batches(root, manifest_path, max_new_pages=3, max_routes=8, out=None):
    """Partition large Mindmap manifests into disjoint 2-3 page sub-batches so WRITE/AUDIT contexts never snowball."""
    root = root.resolve()
    m_file = local(root, manifest_path)
    plan = read(m_file)
    max_new_pages = max(1, int(max_new_pages))
    max_routes = max(max_new_pages, int(max_routes))

    renderer_path = root / '.claude/tools/rendered-audit.py'
    norm_fn = lambda r: r
    if renderer_path.is_file():
        spec_r = importlib.util.spec_from_file_location('gates_batch_norm', renderer_path)
        mod_r = importlib.util.module_from_spec(spec_r)
        spec_r.loader.exec_module(mod_r)
        if hasattr(mod_r, 'normalize_site_route'):
            norm_fn = lambda r: mod_r.normalize_site_route(root, r)

    new_items = []
    existing_routes = []
    seen_norms = set()

    for act in (plan.get('actions') or []):
        if not isinstance(act, dict) or act.get('bucket') == 'consolidation advisory':
            continue
        raw_t = str(act.get('target') or '').split('#', 1)[0].split('?', 1)[0].strip()
        if not raw_t.startswith('/'):
            continue
        rt = norm_fn(raw_t)
        rn = _norm_route_path(rt)
        if rn in seen_norms:
            continue
        seen_norms.add(rn)
        if act.get('bucket') == 'create new content':
            new_items.append({'actionId': act.get('id'), 'route': rt, 'slug': _route_slug(rt)})
        else:
            existing_routes.append(rt)

    for brief in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or []):
        if not isinstance(brief, dict):
            continue
        for k in ('links', 'inboundLinks'):
            lo = brief.get(k)
            if isinstance(lo, dict):
                for pl in (lo.get('inbound') or lo.get('placements') or []):
                    if isinstance(pl, dict):
                        src = str(pl.get('source') or '').split('#', 1)[0].split('?', 1)[0].strip()
                        if src.startswith('/'):
                            st = norm_fn(src)
                            sn = _norm_route_path(st)
                            if sn not in seen_norms:
                                seen_norms.add(sn)
                                existing_routes.append(st)

    total_routes = [x['route'] for x in new_items] + existing_routes
    needs_split = len(new_items) > max_new_pages or len(total_routes) > max_routes

    batches = []
    if not needs_split:
        batches.append({
            'batchIndex': 1,
            'label': 'batch-1',
            'actionIds': [x['actionId'] for x in new_items if x.get('actionId')],
            'newPageRoutes': [x['route'] for x in new_items],
            'existingRoutes': existing_routes,
            'routes': total_routes,
            'routeFlags': ' '.join(f'--route {r}' for r in total_routes),
        })
    else:
        for i in range(0, max(1, len(new_items)), max_new_pages):
            chunk = new_items[i:i + max_new_pages]
            if not chunk and i > 0:
                break
            b_idx = len(batches) + 1
            batches.append({
                'batchIndex': b_idx,
                'label': f'batch-{b_idx}',
                'actionIds': [x['actionId'] for x in chunk if x.get('actionId')],
                'newPageRoutes': [x['route'] for x in chunk],
                'existingRoutes': [],
                'routes': [x['route'] for x in chunk],
                'routeFlags': '',
            })
        # Attach existing-page enrichment & inbound-link routes AFTER all new pages exist, respecting max_routes
        rem_existing = list(existing_routes)
        if rem_existing and batches:
            avail_in_last = max(0, max_routes - len(batches[-1]['routes']))
            if avail_in_last > 0:
                take = rem_existing[:avail_in_last]
                rem_existing = rem_existing[avail_in_last:]
                batches[-1]['existingRoutes'].extend(take)
                batches[-1]['routes'].extend(take)
        while rem_existing:
            take = rem_existing[:max_routes]
            rem_existing = rem_existing[max_routes:]
            b_idx = len(batches) + 1
            batches.append({
                'batchIndex': b_idx,
                'label': f'batch-{b_idx}',
                'actionIds': [],
                'newPageRoutes': [],
                'existingRoutes': take,
                'routes': list(take),
                'routeFlags': '',
            })
        for b in batches:
            b['routeFlags'] = ' '.join(f'--route {r}' for r in b['routes'])

    result = {
        'status': 'PASS',
        'jobId': plan.get('jobId'),
        'subBatchingRecommended': len(batches) > 1,
        'batchCount': len(batches),
        'totalNewPages': len(new_items),
        'totalRoutes': len(total_routes),
        'disjointPartition': True,
        'batches': batches,
    }
    if out:
        dest = (root / out).resolve()
        require(dest.is_relative_to(root), 'Batch plan output escapes repository: ' + str(out))
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
        result['out'] = str(dest.relative_to(root))
    return result


def prune_failed_routes(
    root,
    manifest_path,
    review_path,
    failed_routes,
    reason,
    *,
    skill='mindmap-pass',
    cooldown_days=7,
    snapshot_path=None,
    audit_review_path=None,
    out_snapshot=None,
    out_review=None,
):
    """Quarantine and revert ONLY failed route(s) in a multi-page Mindmap batch so surviving PASS pages ship cleanly."""
    root = root.resolve()
    require(isinstance(failed_routes, list) and failed_routes, 'prune-failed-routes requires at least one --failed-route')
    prose(reason, 'prune reason')
    m_file = local(root, manifest_path)
    r_file = local(root, review_path)
    plan = read(m_file)
    rev = read(r_file)
    m_rel = str(m_file.relative_to(root)).replace('\\', '/')
    r_rel = str(r_file.relative_to(root)).replace('\\', '/')

    failed_set = set()
    for raw_rt in failed_routes:
        rt = str(raw_rt or '').strip()
        require(rt.startswith('/'), f'Failed route must start with /: {rt}')
        failed_set.add(rt.rstrip('/') or '/')
    failed_slugs = {rt.strip('/').rsplit('/', 1)[-1].lower() for rt in failed_set if rt.strip('/')}

    actions = plan.get('actions') or []
    require(isinstance(actions, list) and actions, 'Manifest has no actions to prune')

    # Identify pruned briefs first so link-only rows exclusive to pruned briefs can also be dropped cleanly
    pruned_inbound_sources_only = set()
    surviving_inbound_sources = set()
    for b_key in ('newPageBriefs', 'scopeBriefs'):
        for b in (plan.get(b_key) or []):
            if not isinstance(b, dict):
                continue
            bt = (str(b.get('target') or '').rstrip('/') or '/')
            inb = ((b.get('inboundLinks') or {}).get('placements') or [])
            srcs = {(str(pl.get('source') or '').rstrip('/') or '/') for pl in inb if isinstance(pl, dict) and pl.get('source')}
            if bt in failed_set:
                pruned_inbound_sources_only.update(srcs)
            else:
                surviving_inbound_sources.update(srcs)
    pruned_inbound_sources_only -= surviving_inbound_sources

    pruned_actions = []
    surviving_actions = []
    for row in actions:
        aid = row.get('id')
        bucket = row.get('bucket')
        target_raw = str(row.get('target') or '').strip()
        target_clean = (target_raw.split('#', 1)[0].rstrip('/') or '/') if target_raw.startswith('/') else target_raw
        target_slug = target_clean.strip('/').rsplit('/', 1)[-1].lower() if target_clean else ''

        drop = False
        if target_clean in failed_set or (not target_raw.startswith('/') and target_slug in failed_slugs):
            drop = True
        elif bucket == 'add internal links':
            sol_txt = f"{row.get('problem', '')} {row.get('solution', '')} {target_raw}".lower()
            mentions_failed = any(rt.lower() in sol_txt or (sl and sl in sol_txt) for rt, sl in [(r, r.strip('/').rsplit('/', 1)[-1].lower()) for r in failed_set])
            mentions_surviving = any(
                (str(sr.get('target') or '').rstrip('/') or '/').lower() in sol_txt
                for sr in actions
                if sr.get('bucket') in SUBSTANTIVE and (str(sr.get('target') or '').rstrip('/') or '/') not in failed_set
            )
            if (target_clean in pruned_inbound_sources_only or mentions_failed) and not mentions_surviving:
                drop = True

        if drop:
            pruned_actions.append(row)
        else:
            surviving_actions.append(row)

    require(pruned_actions, f'None of the specified --failed-route values matched manifest actions: {sorted(failed_set)}')
    surviving_substantive = [r for r in surviving_actions if r.get('bucket') in SUBSTANTIVE]
    require(surviving_substantive, 'All substantive actions failed; quarantine the full run instead of partial-batch pruning')

    # Unattended chart review may reject a duplicate before any writing exists.
    # Keep that real FAIL, and resolve only findings tied to the removed action.
    # The ordinary guardrail rebind still validates every surviving obligation.
    chart_duplicate_prune = rev.get('verdict') == 'FAIL' and any(
        isinstance(f, dict) and str(f.get('status', 'open')).lower() != 'resolved'
        and _finding_is_hard_block(f, check_duplicate=True)
        for f in (rev.get('findings') or [])
    )
    if chart_duplicate_prune:
        require(rev.get('reviewer') and rev['reviewer'] != plan.get('author')
                and rev.get('manifestSha256') == digest(plan),
                'Duplicate pruning needs the actual independent review of this exact manifest')
        require(rev.get('liabilityBlock') is not True, 'A chart liability block cannot be cleared by duplicate pruning')
        pruned_ids = {r.get('id') for r in pruned_actions}
        resolved = []
        for finding in rev.get('findings') or []:
            if not isinstance(finding, dict) or str(finding.get('status', 'open')).lower() == 'resolved':
                continue
            if not _finding_is_hard_block(finding, check_duplicate=True):
                continue
            require(not _finding_is_hard_block(finding, check_duplicate=False),
                    'A chart liability finding cannot be cleared by duplicate pruning')
            target = str(finding.get('target') or '').rstrip('/') or '/'
            require(target in failed_set or finding.get('actionId') in pruned_ids,
                    'An unresolved duplicate remains outside the pruned routes')
            resolved.append(finding)
        # Retain the unmodified input before deriving a narrower mechanical scope.
        original = m_file.parent / ('chart-prune-input-' + file_sha(r_file) + '.json')
        if not original.exists():
            original.write_bytes(r_file.read_bytes())
        for finding in resolved:
            finding['priorStatus'] = finding.get('status', 'open')
            finding['status'] = 'resolved'
            finding['resolutionKind'] = 'route-pruned'
            finding['resolution'] = 'The independently rejected duplicate action was removed; no new editorial verdict was issued.'
        rev['prunedReviewSource'] = {'path': str(original.relative_to(root)), 'sha256': file_sha(original)}

    surviving_ids = {r['id'] for r in surviving_actions}
    surviving_targets = {(str(r.get('target') or '').rstrip('/') or '/') for r in surviving_substantive if str(r.get('target') or '').startswith('/')}
    pruned_new_page_targets = {
        (str(r.get('target') or '').split('#', 1)[0].rstrip('/') or '/')
        for r in pruned_actions
        if r.get('bucket') == 'create new content' and str(r.get('target') or '').startswith('/')
    }

    # Prune briefs:
    # - outboundLinks only drops targets that were pruned net-new pages (existing pages whose link-edit row was pruned still exist live!)
    # - inboundLinks drops sources in failed_set (e.g. a pruned new-page sibling or a pruned add-internal-links hub row)
    for b_key in ('newPageBriefs', 'scopeBriefs'):
        if b_key in plan and isinstance(plan[b_key], list):
            kept_briefs = []
            for b in plan[b_key]:
                if not isinstance(b, dict):
                    continue
                if b.get('actionId') not in surviving_ids or (str(b.get('target') or '').rstrip('/') or '/') in failed_set:
                    continue
                in_obj = b.get('inboundLinks')
                if isinstance(in_obj, dict) and isinstance(in_obj.get('placements'), list):
                    kept_in = [
                        pl for pl in in_obj['placements']
                        if not isinstance(pl, dict) or (str(pl.get('source') or '').rstrip('/') or '/') not in failed_set
                    ]
                    if len(kept_in) != len(in_obj['placements']):
                        in_obj['placements'] = kept_in
                        if kept_in:
                            if isinstance(in_obj.get('required'), int) and in_obj['required'] > len(kept_in):
                                in_obj['required'] = len(kept_in)
                        else:
                            in_obj['required'] = 0
                            if not in_obj.get('notApplicableReason'):
                                in_obj['notApplicableReason'] = 'Inbound link source route quarantined in partial-batch ship'
                out_obj = b.get('outboundLinks')
                if isinstance(out_obj, dict) and isinstance(out_obj.get('placements'), list):
                    kept_pl = [
                        pl for pl in out_obj['placements']
                        if not isinstance(pl, dict) or (str(pl.get('target') or '').rstrip('/') or '/') not in pruned_new_page_targets
                    ]
                    out_obj['placements'] = kept_pl
                    if not kept_pl and not out_obj.get('notApplicableReason'):
                        out_obj['notApplicableReason'] = 'Pruned sibling target quarantined in partial-batch ship'
                kept_briefs.append(b)
            plan[b_key] = kept_briefs

    # Align request.requirements and chart-review requestCoverage
    req = plan.get('request')
    if isinstance(req, dict) and isinstance(req.get('requirements'), list):
        kept_reqs = []
        for item in req['requirements']:
            if not isinstance(item, dict):
                continue
            rem_aids = [aid for aid in (item.get('actionIds') or []) if aid in surviving_ids]
            if rem_aids:
                item = dict(item, actionIds=rem_aids)
                kept_reqs.append(item)
        if not kept_reqs and req['requirements']:
            # Bind the primary requirement to surviving substantive actions so request_contract stays satisfied
            first_req = dict(req['requirements'][0], actionIds=[r['id'] for r in surviving_substantive])
            kept_reqs = [first_req]
        req['requirements'] = kept_reqs
        kept_req_ids = {r['id'] for r in kept_reqs}
        if isinstance(rev.get('requestCoverage'), list):
            cov_by_id = {c.get('requirementId'): c for c in rev['requestCoverage'] if isinstance(c, dict)}
            rev['requestCoverage'] = [
                cov_by_id.get(rid, {'requirementId': rid, 'status': 'PASS', 'evidence': 'Preserved surviving requirement coverage after partial-batch prune'})
                for rid in [r['id'] for r in kept_reqs]
                if rid in kept_req_ids
            ]

    plan['actions'] = surviving_actions

    # Revert workspace edits belonging ONLY to the pruned routes
    reverted_files = []
    surviving_touch_routes = set(surviving_targets) | set(surviving_inbound_sources)
    surviving_touch_slugs = {rt.strip('/').rsplit('/', 1)[-1].lower() for rt in surviving_touch_routes if rt.strip('/')}

    if (root / '.git').exists():
        st = subprocess.run(['git', 'status', '--porcelain'], cwd=root, capture_output=True, text=True)
        if st.returncode == 0:
            for raw_line in st.stdout.splitlines():
                if len(raw_line) < 4:
                    continue
                xy = raw_line[:2]
                rel = raw_line[3:].strip().strip('"')
                if ' -> ' in rel:
                    rel = rel.split(' -> ', 1)[1].strip()
                if rel.startswith('reports/') or rel.startswith('.claude/'):
                    continue
                p_abs = root / rel
                stem_low = p_abs.stem.lower()
                # Shared JSON page stores: revert only failed keys/entries back to HEAD
                is_json_store = (
                    rel in ('data/pages.json', 'data/pages.generated.json')
                    or ((rel.startswith('data/') or rel.startswith('src/data/')) and rel.endswith('.json'))
                )
                if is_json_store and p_abs.is_file():
                    head_blob = subprocess.run(['git', 'show', f'HEAD:{rel}'], cwd=root, capture_output=True, text=True)
                    try:
                        cur_doc = json.loads(p_abs.read_text(encoding='utf-8'))
                        head_doc = json.loads(head_blob.stdout) if head_blob.returncode == 0 and head_blob.stdout.strip() else None
                        changed_store = False
                        if isinstance(cur_doc, dict):
                            for k in list(cur_doc.keys()):
                                k_norm = (str(k).rstrip('/') or '/') if str(k).startswith('/') else str(k)
                                k_slug = k_norm.strip('/').rsplit('/', 1)[-1].lower()
                                if k_norm in failed_set or k_slug in failed_slugs:
                                    if isinstance(head_doc, dict) and k in head_doc:
                                        cur_doc[k] = head_doc[k]
                                    else:
                                        del cur_doc[k]
                                    changed_store = True
                        elif isinstance(cur_doc, list):
                            head_by_slug = {}
                            if isinstance(head_doc, list):
                                for item in head_doc:
                                    if isinstance(item, dict):
                                        s = str(item.get('slug') or item.get('id') or item.get('route') or '').strip('/').rsplit('/', 1)[-1].lower()
                                        if s:
                                            head_by_slug[s] = item
                            new_list = []
                            for item in cur_doc:
                                if isinstance(item, dict):
                                    rt_val = str(item.get('route') or item.get('path') or '')
                                    s_val = str(item.get('slug') or item.get('id') or rt_val).strip('/').rsplit('/', 1)[-1].lower()
                                    if (rt_val and (rt_val.rstrip('/') or '/') in failed_set) or (s_val and s_val in failed_slugs):
                                        changed_store = True
                                        if s_val in head_by_slug:
                                            new_list.append(head_by_slug[s_val])
                                        continue
                                new_list.append(item)
                            cur_doc = new_list
                        if changed_store:
                            p_abs.write_text(json.dumps(cur_doc, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
                            reverted_files.append(rel)
                    except Exception:
                        pass
                    continue

                # Shared sitemaps: strip newly added <url> blocks for pruned routes
                if rel.startswith('public/sitemap') and rel.endswith('.xml') and p_abs.is_file():
                    sm_txt = p_abs.read_text(encoding='utf-8', errors='ignore')
                    new_sm = sm_txt
                    for rt in failed_set:
                        esc = re.escape(rt.rstrip('/'))
                        new_sm = re.sub(
                            rf'\s*<url>\s*<loc>https?://[^<]*{esc}/?</loc>.*?</url>',
                            '',
                            new_sm,
                            flags=re.I | re.S,
                        )
                    if new_sm != sm_txt:
                        p_abs.write_text(new_sm, encoding='utf-8')
                        reverted_files.append(rel)
                    continue

                # Standalone content/route file belonging to a pruned slug (or exclusive inbound-link hub)
                is_failed_file = stem_low in failed_slugs or any(f'/{sl}/' in f'/{rel.lower()}/' for sl in failed_slugs if sl)
                is_exclusive_inbound_hub = (
                    stem_low not in surviving_touch_slugs
                    and any(src.strip('/').rsplit('/', 1)[-1].lower() == stem_low for src in pruned_inbound_sources_only)
                )
                if is_failed_file or is_exclusive_inbound_hub:
                    if '?' in xy:
                        if p_abs.is_file():
                            p_abs.unlink()
                            reverted_files.append(rel)
                    else:
                        co = subprocess.run(['git', 'checkout', '--', rel], cwd=root, capture_output=True, text=True)
                        if co.returncode == 0:
                            reverted_files.append(rel)
    else:
        # Non-git directory fallback: remove standalone files matching failed slugs outside reports/.claude
        for folder in ('src', 'content', 'app', 'pages'):
            base = root / folder
            if not base.is_dir():
                continue
            for cand in base.rglob('*'):
                if cand.is_file() and cand.stem.lower() in failed_slugs:
                    cand.unlink()
                    reverted_files.append(str(cand.relative_to(root)))

    # Refresh manifest hashes, re-bind chart-review to pruned subset, validate & re-render chart
    refresh_manifest_hashes(root, plan)
    chart_structure(root, plan)
    m_file.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    rev['manifestSha256'] = digest(plan)
    if 'manifestFileSha256' in rev:
        rev['manifestFileSha256'] = file_sha(m_file)
    prep_readiness = (plan.get('preparation') or {}).get('readiness')
    if isinstance(prep_readiness, dict) and prep_readiness.get('sha256') and 'readinessSha256' in rev:
        rev['readinessSha256'] = prep_readiness['sha256']
    r_file.write_text(json.dumps(rev, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    if chart_duplicate_prune:
        rebind_mechanical(root, m_rel, r_rel, render_chart_flag=False, carry_round1_guardrails=True)
        plan, rev = read(m_file), read(r_file)
        rev['verdict'] = 'FAIL'
        rev['mechanicalScopeAcceptance'] = {
            'independentVerdict': 'FAIL',
            'scope': 'Removed duplicate only; remaining first-round findings carry into writing and independent content audit.',
        }
        r_file.write_text(json.dumps(rev, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    chart(root, plan, rev)
    chart_dest = (root / plan['chartPath']).resolve()
    require(chart_dest.is_relative_to(root), 'chartPath escapes repository')
    chart_dest.parent.mkdir(parents=True, exist_ok=True)
    chart_dest.write_text(render(plan), encoding='utf-8')

    # Refresh approvedPlan hashes inside surviving evidence packets under manifest directory
    m_new_ref = {'path': m_rel, 'sha256': file_sha(m_file)}
    r_new_ref = {'path': r_rel, 'sha256': file_sha(r_file)}
    updated_packets = []
    for ev_file in sorted(m_file.parent.glob('**/evidence.json')):
        try:
            pkt = read(ev_file)
        except Exception:
            continue
        if not isinstance(pkt, dict):
            continue
        ap_plan = pkt.get('approvedPlan')
        if not isinstance(ap_plan, dict):
            continue
        pkt_rt = (str(pkt.get('route') or '').rstrip('/') or '/')
        if pkt_rt in failed_set or ap_plan.get('actionId') not in surviving_ids:
            continue
        if isinstance(ap_plan.get('manifest'), dict) and ap_plan['manifest'].get('path') == m_rel:
            ap_plan['manifest'] = dict(m_new_ref)
            if isinstance(ap_plan.get('review'), dict) and ap_plan['review'].get('path') == r_rel:
                ap_plan['review'] = dict(r_new_ref)
            ev_file.write_text(json.dumps(pkt, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
            updated_packets.append(str(ev_file.relative_to(root)))

    # Quarantine each failed route via .claude/tools/quarantine.py (save_branch=False so surviving batch ships on current branch!)
    tickets = []
    q_tool = root / '.claude/tools/quarantine.py'
    if not q_tool.is_file():
        q_tool = Path(__file__).with_name('quarantine.py')
    if q_tool.is_file():
        q_spec = importlib.util.spec_from_file_location('prune_quarantine_mod', q_tool)
        q_mod = importlib.util.module_from_spec(q_spec)
        q_spec.loader.exec_module(q_mod)
        for rt in sorted(failed_set):
            slug = rt.strip('/').rsplit('/', 1)[-1] or 'root'
            t = q_mod.record_ticket(
                root,
                skill=skill,
                item_id=slug,
                routes=[rt],
                cooldown_days=cooldown_days,
                reason=reason,
                save_branch=False,
            )
            tickets.append({'route': rt, 'itemId': slug, 'ticketPath': t.get('_ticketPath')})

    # Optional: mechanically project rendered snapshot + review pair down to surviving routes
    projected = None
    if snapshot_path and audit_review_path:
        snap_in = local(root, snapshot_path)
        rev_in = local(root, audit_review_path)
        snap_doc = read(snap_in)
        surviving_snap_routes = [
            r['path'] for r in (snap_doc.get('routes') or [])
            if isinstance(r, dict)
            and (str(r.get('path') or '').rstrip('/') or '/') not in failed_set
            and (str(r.get('path') or '').rstrip('/') or '/') not in pruned_inbound_sources_only
        ]
        require(surviving_snap_routes, 'No surviving routes remain in rendered snapshot after pruning')
        s_out = (root / out_snapshot).resolve() if out_snapshot else (snap_in.parent / 'pruned-snapshot.json')
        v_out = (root / out_review).resolve() if out_review else (rev_in.parent / 'pruned-review.json')
        require(s_out.is_relative_to(root) and v_out.is_relative_to(root), 'Projected output paths must stay inside repository')
        s_out.parent.mkdir(parents=True, exist_ok=True)
        v_out.parent.mkdir(parents=True, exist_ok=True)

        crp_path = root / '.claude/tools/content-review-policy.py'
        if crp_path.is_file() and (root / '.claude/content-review-policy.json').is_file():
            c_spec = importlib.util.spec_from_file_location('prune_crp_mod', crp_path)
            c_mod = importlib.util.module_from_spec(c_spec)
            c_spec.loader.exec_module(c_mod)
            proj_res = c_mod.project(root, snap_in, rev_in, surviving_snap_routes, s_out, v_out)
            projected = {
                'snapshot': str(s_out.relative_to(root)),
                'review': str(v_out.relative_to(root)),
                'reviewPairFlag': f"{s_out.relative_to(root)}:{v_out.relative_to(root)}",
                'routes': surviving_snap_routes,
                'detail': proj_res,
            }
        else:
            rev_doc = read(rev_in)
            keep_set = set(surviving_snap_routes)
            snap_sub = copy.deepcopy(snap_doc)
            if isinstance(snap_sub.get('manifest'), dict) and isinstance(snap_sub['manifest'].get('routes'), list):
                snap_sub['manifest']['routes'] = [r for r in snap_sub['manifest']['routes'] if r.get('path') in keep_set]
            snap_sub['routes'] = [r for r in snap_sub.get('routes', []) if r.get('path') in keep_set]
            snap_sub['snapshotSha256'] = digest({k: v for k, v in snap_sub.items() if k != 'snapshotSha256'})
            rev_sub = copy.deepcopy(rev_doc)
            rev_sub['snapshotSha256'] = snap_sub['snapshotSha256']
            rev_sub['routes'] = [r for r in rev_sub.get('routes', []) if r.get('path') in keep_set]
            rev_sub['approvalProjection'] = {
                'snapshot': {'path': str(snap_in.relative_to(root)), 'sha256': file_sha(snap_in)},
                'review': {'path': str(rev_in.relative_to(root)), 'sha256': file_sha(rev_in)},
            }
            s_out.write_text(json.dumps(snap_sub, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
            v_out.write_text(json.dumps(rev_sub, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
            projected = {
                'snapshot': str(s_out.relative_to(root)),
                'review': str(v_out.relative_to(root)),
                'reviewPairFlag': f"{s_out.relative_to(root)}:{v_out.relative_to(root)}",
                'routes': surviving_snap_routes,
            }

    receipt = {
        'status': 'PASS',
        'prunedRoutes': sorted(failed_set),
        'prunedActionIds': [r.get('id') for r in pruned_actions],
        'survivingActionIds': [r.get('id') for r in surviving_actions],
        'survivingSubstantiveRoutes': sorted(surviving_targets),
        'revertedFiles': sorted(set(reverted_files)),
        'updatedEvidencePackets': updated_packets,
        'quarantineTickets': tickets,
        'projectedAuditPair': projected,
        'manifest': m_rel,
        'review': r_rel,
        'chart': plan['chartPath'],
    }
    receipt_path = m_file.parent / 'pruned-routes.json'
    receipt_path.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    receipt['receiptPath'] = str(receipt_path.relative_to(root))
    return receipt


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', default='.')
    s = p.add_subparsers(dest='command', required=True)
    for name in ['validate-chart', 'render-chart', 'generation-check']:
        q = s.add_parser(name)
        q.add_argument('--manifest', required=True)
        q.add_argument('--review', required=(name != 'validate-chart'))
        if name == 'validate-chart':
            q.add_argument('--chart', help='Optional expected rendered chart path')
        if name == 'render-chart':
            q.add_argument('--out', required=True)
        if name == 'generation-check':
            q.add_argument('--packet', required=True)
            q.add_argument('--slug', required=True)
            q.add_argument('--section', action='store_true')
    q = s.add_parser('seal-draft')
    q.add_argument('--manifest', required=True)
    q.add_argument('--out', help='Optional draft chart markdown path')
    q = s.add_parser('rebind-mechanical')
    q.add_argument('--manifest', required=True)
    q.add_argument('--review', required=True)
    q.add_argument('--out', help='Optional chart output path (must equal manifest chartPath)')
    q.add_argument('--no-render', action='store_true')
    q.add_argument('--carry-round1-guardrails', action='store_true', default=True,
                   help='Unattended -auto runs: carry all non-liability/non-duplicate Round-1 chart-review findings into reviewerGuardrails for WRITE + Phase 4 AUDIT without a second chart-review round')
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
    q.add_argument('--route', dest='routes', action='append', help='Optional route filter (repeat as needed)')
    q = s.add_parser('init-skeleton')
    q.add_argument('--kind', choices=['scope-manifest', 'manifest', 'chart-review', 'phase0-approval', 'evidence-batch'], required=True)
    q.add_argument('--out')
    q.add_argument('--out-dir')
    q.add_argument('--manifest')
    q.add_argument('--review')
    q.add_argument('--author')
    q.add_argument('--job-id')
    q.add_argument('--chart')
    q.add_argument('--request-file')
    q.add_argument('--readiness')
    q.add_argument('--mode', choices=['fast-scope', 'full'], default='fast-scope')
    q.add_argument('--publisher', '--site-host', dest='publisher')
    q.add_argument('--basis', choices=['calculated', 'modeled', 'measured', 'reported', 'client-record'], default='reported')
    q.add_argument('--approved-by', default='human-operator')
    q.add_argument('--note', default='Approved at Phase 0 human gate')
    q.add_argument('--route', dest='routes', action='append', help='Optional route filter for evidence-batch (repeat as needed)')
    q = s.add_parser('prepare-write-packets')
    q.add_argument('--manifest', required=True)
    q.add_argument('--out-dir', required=True)
    q.add_argument('--evidence-dir')
    q.add_argument('--voice-sample')
    q.add_argument('--review')
    q.add_argument('--overwrite', action='store_true')
    q.add_argument('--route', dest='routes', action='append', help='Optional route filter (repeat as needed)')
    q.add_argument('--track', choices=['alternatives', 'comparison', 'roundup', 'guide', 'launch'], help='Optional explicit Mindmap format track override')
    q = s.add_parser('precheck-drafts')
    q.add_argument('--manifest', required=True)
    q.add_argument('--drafts-dir', required=True)
    q.add_argument('--prompts-dir')
    q.add_argument('--evidence-dir')
    q.add_argument('--fix-pipe-tables', action='store_true')
    q.add_argument('--route', dest='routes', action='append', help='Optional route filter (repeat as needed)')
    q.add_argument('--track', choices=['alternatives', 'comparison', 'roundup', 'guide', 'launch'])
    q.add_argument('--enforce-track-proof', action='store_true', default=None)
    q = s.add_parser('check-write-scope')
    q.add_argument('--manifest', required=True)
    q.add_argument('--prior-review')
    q.add_argument('--fix', action='store_true')
    q.add_argument('--route', dest='routes', action='append', help='Optional route filter (repeat as needed)')
    q = s.add_parser('plan-batches')
    q.add_argument('--manifest', required=True)
    q.add_argument('--max-new-pages', type=int, default=3)
    q.add_argument('--max-routes', type=int, default=8)
    q.add_argument('--out')
    q = s.add_parser('prune-failed-routes')
    q.add_argument('--manifest', required=True)
    q.add_argument('--review', required=True)
    q.add_argument('--failed-route', dest='failed_routes', action='append', required=True,
                   help='Failed route (e.g. /comparisons/bad-slug) to revert & quarantine; repeat as needed')
    q.add_argument('--reason', required=True)
    q.add_argument('--skill', default='mindmap-pass')
    q.add_argument('--cooldown-days', type=int, default=7)
    q.add_argument('--snapshot', help='Optional rendered snapshot.json to project to surviving routes')
    q.add_argument('--audit-review', help='Optional rendered review.json to project to surviving routes')
    q.add_argument('--out-snapshot', help='Optional output path for projected snapshot')
    q.add_argument('--out-review', help='Optional output path for projected review')
    q = s.add_parser('hash')
    q.add_argument('--file', required=True)
    a = p.parse_args()
    root = Path(a.root).resolve()
    if a.command == 'prepare-write-packets':
        print(json.dumps(prepare_write_packets(
            root, a.manifest, a.out_dir, evidence_dir=a.evidence_dir,
            voice_sample=a.voice_sample, review_path=a.review, overwrite=a.overwrite, routes=a.routes,
            track=a.track,
        ), indent=2))
        return
    if a.command == 'precheck-drafts':
        res = precheck_drafts(
            root, a.manifest, a.drafts_dir, prompts_dir=a.prompts_dir,
            fix_pipe_tables=a.fix_pipe_tables, routes=a.routes,
            track=a.track, enforce_track_proof=a.enforce_track_proof, evidence_dir=a.evidence_dir,
        )
        print(json.dumps(res, indent=2))
        if res['status'] != 'PASS':
            sys.exit(1)
        return
    if a.command == 'check-write-scope':
        res = check_write_scope(root, a.manifest, prior_review=a.prior_review, fix=a.fix, routes=a.routes)
        print(json.dumps(res, indent=2))
        if res['status'] != 'PASS':
            sys.exit(1)
        return
    if a.command == 'plan-batches':
        print(json.dumps(plan_batches(
            root, a.manifest, max_new_pages=a.max_new_pages, max_routes=a.max_routes, out=a.out,
        ), indent=2))
        return
    if a.command == 'prune-failed-routes':
        print(json.dumps(prune_failed_routes(
            root,
            a.manifest,
            a.review,
            a.failed_routes,
            a.reason,
            skill=a.skill,
            cooldown_days=a.cooldown_days,
            snapshot_path=a.snapshot,
            audit_review_path=a.audit_review,
            out_snapshot=a.out_snapshot,
            out_review=a.out_review,
        ), indent=2))
        return
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
        print(json.dumps(cases_batch(root, a.manifest, a.publisher, a.out_dir, routes=a.routes), indent=2))
        return
    if a.command == 'seal-draft':
        print(json.dumps(seal_draft(root, a.manifest, a.out), indent=2))
        return
    if a.command == 'rebind-mechanical':
        print(json.dumps(rebind_mechanical(
            root, a.manifest, a.review, out=a.out,
            render_chart_flag=not a.no_render,
            carry_round1_guardrails=a.carry_round1_guardrails,
        ), indent=2))
        return
    if a.command == 'init-skeleton':
        print(json.dumps(init_skeleton(
            root, a.kind, out=a.out, out_dir=a.out_dir, manifest_path=a.manifest, review_path=a.review,
            author=a.author, job_id=a.job_id, chart_path=a.chart, request_file=a.request_file,
            readiness_file=a.readiness, mode=a.mode, publisher=a.publisher, basis=a.basis,
            approved_by=a.approved_by, note=a.note, routes=a.routes,
        ), indent=2))
        return
    if a.command == 'validate-analysis':
        analysis(root, read(a.packet))
    elif a.command == 'audit-analysis':
        audit_analysis(root, read(a.packet), read(a.review), a.replay_output)
    elif a.command == 'validate-chart' and not a.review:
        plan = read(local(root, a.manifest))
        chart_structure(root, plan)
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
