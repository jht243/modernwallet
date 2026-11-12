#!/usr/bin/env python3
"""Deliver complete workflow instructions in bounded chunks; verify delivery/freshness.

A delivery receipt is NOT proof of comprehension, review, or publication approval.
Only the independent reviewer can assess whether the recorded rules were applied.
"""
import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
from types import SimpleNamespace
import uuid

ROOT = Path(__file__).resolve().parents[2]
BASE = ['_decision-evidence.md', '_testing-labels.md', '_content-standard.md',
        '_anti-ai-language.md', '_experience.md', '_workflow-checkpoints.md', '_rendered-page-audit.md',
        '_mindmap-execution.md']
BUILD_BASE = ['_decision-evidence.md', '_testing-labels.md', '_experience.md',
              '_workflow-checkpoints.md', '_mindmap-execution.md', '_keyword-demand-ladder.md']
MINDMAP_WRITE_BASE = ['_testing-labels.md', '_content-standard.md',
                      '_anti-ai-language.md', '_experience.md']
MINDMAP_AUDIT_BASE = ['_testing-labels.md', '_content-standard.md',
                      '_anti-ai-language.md', '_experience.md',
                      '_rendered-page-audit.md', '_remediation-ladder.md']
MINDMAP_PUBLISH_BASE = ['_testing-labels.md', '_experience.md',
                        '_workflow-checkpoints.md', '_rendered-page-audit.md']
OPTIONAL = ['_testing-labels.local.md', '_content-standard.local.md',
            '_layer3-evidence-sources.md']
CHUNK = 9000  # characters, deliberately below ordinary tool-output truncation

OBLIGATIONS_SOURCE = '.claude/commands/_mindmap-chart-obligations.generated.md'
CORE_OBLIGATION_FILES = [
    '.claude/commands/_content-standard.md',
    '.claude/commands/_anti-ai-language.md',
    '.claude/commands/_rendered-page-audit.md',
    '.claude/commands/mindmap-pass/phase-1-consolidation.md',
    '.claude/commands/mindmap-pass/phase-2-metadata.md',
    '.claude/commands/mindmap-pass/phase-3-new-content.md',
    '.claude/commands/mindmap-pass/phase-3c-tool-build.md',
    '.claude/commands/mindmap-pass/phase-4-audit.md',
    '.claude/commands/mindmap-pass/phase-5-body.md',
    '.claude/commands/mindmap-pass/phase-6-internal-linking.md',
    '.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md',
    '.claude/commands/mindmap-pass/phase-7b-humanize-intros.md',
    '.claude/commands/mindmap-pass/phase-8-summary.md',
    '.claude/commands/mindmap-pass/phase-9-commit-deliver.md',
]
BUILD_OMIT_EXTRAS = {
    '.claude/commands/_content-generation.md',
    '.claude/commands/_content-correction-scope.md',
}
WRITE_STRIP = {
    '.claude/commands/mindmap-pass.md',
    '.claude/commands/mindmap-pass/phase-build-brief.md',
    '.claude/commands/mindmap-pass/phase-0-discover.md',
    '.claude/commands/mindmap-pass/phase-1-consolidation.md',
    '.claude/commands/mindmap-pass/phase-4-audit.md',
    '.claude/commands/mindmap-pass/phase-8-summary.md',
    '.claude/commands/mindmap-pass/phase-9-commit-deliver.md',
    '.claude/commands/_keyword-demand-ladder.md',
}
AUDIT_STRIP = {
    '.claude/commands/mindmap-pass.md',
    '.claude/commands/mindmap-pass/phase-build-brief.md',
    '.claude/commands/mindmap-pass/phase-0-discover.md',
    '.claude/commands/mindmap-pass/phase-1-consolidation.md',
    '.claude/commands/mindmap-pass/phase-2-metadata.md',
    '.claude/commands/mindmap-pass/phase-3-new-content.md',
    '.claude/commands/mindmap-pass/phase-3c-tool-build.md',
    '.claude/commands/mindmap-pass/phase-5-body.md',
    '.claude/commands/mindmap-pass/phase-6-internal-linking.md',
    '.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md',
    '.claude/commands/mindmap-pass/phase-7b-humanize-intros.md',
    '.claude/commands/mindmap-pass/phase-8-summary.md',
    '.claude/commands/mindmap-pass/phase-9-commit-deliver.md',
    '.claude/commands/_keyword-demand-ladder.md',
}
PUBLISH_STRIP = {
    '.claude/commands/mindmap-pass.md',
    '.claude/commands/mindmap-pass/phase-build-brief.md',
    '.claude/commands/mindmap-pass/phase-0-discover.md',
    '.claude/commands/mindmap-pass/phase-1-consolidation.md',
    '.claude/commands/mindmap-pass/phase-2-metadata.md',
    '.claude/commands/mindmap-pass/phase-3-new-content.md',
    '.claude/commands/mindmap-pass/phase-3c-tool-build.md',
    '.claude/commands/mindmap-pass/phase-4-audit.md',
    '.claude/commands/mindmap-pass/phase-5-body.md',
    '.claude/commands/mindmap-pass/phase-6-internal-linking.md',
    '.claude/commands/mindmap-pass/phase-7b-humanize-intros.md',
    '.claude/commands/_keyword-demand-ladder.md',
}
OBLIGATION_BLOCK_RE = re.compile(
    r'<!--\s*chart-obligation:\s*([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->(.*?)<!--\s*/chart-obligation\s*-->',
    re.S,
)
OBLIGATION_ANY_TAG_RE = re.compile(r'<!--[^>-]*chart-obligation.*?-->', re.S | re.I)


def local_system(root):
    # Opt-in belongs to this repository. Shared helper copies alone never enable it.
    if not (root / '.claude/workflow-policy.local.json').is_file():
        return None
    path = Path(__file__).with_name('workflow-local.py')
    spec = importlib.util.spec_from_file_location('workflow_local', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def efficiency():
    path = Path(__file__).with_name('workflow-efficiency.py')
    if not path.is_file():
        return None
    spec = importlib.util.spec_from_file_location('fleet_instruction_delivery', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def efficiency_system(root):
    if local_system(root) is not None:
        return None
    if not (root / '.claude/commands/_workflow-efficiency.md').is_file():
        return None
    return efficiency()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def save(path, value):
    tmp = path.with_name(path.name + '.tmp-' + uuid.uuid4().hex)
    tmp.write_text(json.dumps(value, indent=2) + '\n')
    os.replace(str(tmp), str(path))


def inside(root, rel):
    path = (root / rel).resolve()
    if root.resolve() not in path.parents:
        raise ValueError('Path must be inside the active repository: ' + rel)
    return path


def is_mindmap_run(root, instructions=None):
    return (root / '.claude/commands/mindmap-pass/phase-build-brief.md').is_file()


def parse_obligation_blocks(text, rel, require_nonempty=False):
    blocks = OBLIGATION_BLOCK_RE.findall(text)
    if len(OBLIGATION_ANY_TAG_RE.findall(text)) != 2 * len(blocks):
        raise ValueError('Malformed or unclosed chart-obligation marker in ' + rel)
    if require_nonempty and not blocks:
        raise ValueError('Missing required chart-obligation block in ' + rel)
    parsed = []
    seen_in_file = set()
    for oid, body in blocks:
        if 'chart-obligation' in body.lower():
            raise ValueError('Nested chart-obligation marker in ' + rel)
        cleaned = body.strip()
        if len(cleaned) < 20:
            raise ValueError('Empty or trivial chart-obligation block ' + oid + ' in ' + rel)
        if oid in seen_in_file:
            raise ValueError('Duplicate chart-obligation id ' + oid + ' in ' + rel)
        seen_in_file.add(oid)
        parsed.append((oid, cleaned))
    return parsed


def extract_chart_obligations(root):
    """Compile verbatim downstream chart-planning obligations in the active checkout.

    Fails closed if any core omitted downstream file lacks a valid obligation block
    or contains an unclosed/malformed marker. Local *.local.md files may override
    matching obligation IDs or append additional site-specific obligations.
    """
    entries = []
    index_by_id = {}
    for rel in CORE_OBLIGATION_FILES:
        path = inside(root, rel)
        if not path.is_file():
            continue
        raw = path.read_bytes()
        file_sha = digest(raw)[:12]
        for oid, body in parse_obligation_blocks(raw.decode('utf-8'), rel, require_nonempty=True):
            if oid in index_by_id:
                raise ValueError('Duplicate chart-obligation id ' + oid + ' in ' + rel)
            index_by_id[oid] = len(entries)
            entries.append((oid, rel, file_sha, body))
    commands_dir = root / '.claude/commands'
    local_Excluded = {'_workflow-efficiency.local.md', '_workflow-dispatch.local.md'}
    extra_locals = sorted(
        str(p.relative_to(root))
        for p in commands_dir.glob('*.local.md')
        if p.is_file() and p.name not in local_Excluded
    ) if commands_dir.is_dir() else []
    for rel in list(sorted(BUILD_OMIT_EXTRAS)) + extra_locals:
        path = inside(root, rel)
        if not path.is_file():
            continue
        raw = path.read_bytes()
        file_sha = digest(raw)[:12]
        is_local = rel.endswith('.local.md')
        for oid, body in parse_obligation_blocks(raw.decode('utf-8'), rel, require_nonempty=False):
            if oid in index_by_id:
                if not is_local:
                    raise ValueError('Duplicate chart-obligation id ' + oid + ' in ' + rel)
                entries[index_by_id[oid]] = (oid, rel, file_sha, body)
            else:
                index_by_id[oid] = len(entries)
                entries.append((oid, rel, file_sha, body))
    if not entries:
        raise ValueError('No chart-obligation blocks found for Mindmap build bundle')
    header = (
        '# Mindmap Downstream Chart-Planning Obligations (Compiled Verbatim)\n\n'
        'These obligations are extracted verbatim from this repository\'s downstream '
        'writing, tool, audit, linking, sitemap, and publication contracts so BUILD and '
        'CHART-REVIEW enforce every planning constraint without loading execution-only '
        'procedures. Execution workers (WRITE, AUDIT, PUBLISH) still load their full phase '
        'and standard files.\n\n'
    )
    sections = [
        f'## [{oid}] ({rel} @ {file_sha})\n\n{body}\n'
        for oid, rel, file_sha, body in entries
    ]
    return (header + '\n'.join(sections)).encode('utf-8')


def source_bytes(root, rel):
    inside(root, rel)
    if rel == OBLIGATIONS_SOURCE:
        return extract_chart_obligations(root)
    return inside(root, rel).read_bytes()


def _filter_instructions(instructions, strip_set, fallback=None):
    filtered = [i for i in instructions if i not in strip_set]
    if filtered:
        return filtered
    if fallback:
        return [fallback]
    return list(instructions)


def sources(root, phase, instructions):
    if is_mindmap_run(root, instructions):
        if phase == 'build':
            rels = ['.claude/commands/' + n for n in BUILD_BASE]
            rels += ['.claude/commands/' + n for n in OPTIONAL if (root / '.claude/commands' / n).is_file()]
            review_policy = '.claude/commands/_content-review-policy.md'
            if (root / review_policy).is_file():
                rels.append(review_policy)
            omit = set(CORE_OBLIGATION_FILES) | BUILD_OMIT_EXTRAS
            kept = _filter_instructions(instructions, omit, '.claude/commands/mindmap-pass/phase-build-brief.md')
            rels += kept
            extract_chart_obligations(root)
            rels.append(OBLIGATIONS_SOURCE)
            return list(dict.fromkeys(rels))
        base_map = {
            'write': MINDMAP_WRITE_BASE,
            'audit': MINDMAP_AUDIT_BASE,
            'publish': MINDMAP_PUBLISH_BASE,
        }
        names = [n for n in base_map.get(phase, BASE) if (root / '.claude/commands' / n).is_file() or n in BASE]
        rels = ['.claude/commands/' + n for n in names]
        rels += ['.claude/commands/' + n for n in OPTIONAL if (root / '.claude/commands' / n).is_file()]
        if phase == 'audit':
            review_policy = '.claude/commands/_content-review-policy.md'
            if (root / review_policy).is_file():
                rels.append(review_policy)
        strip_map = {'write': WRITE_STRIP, 'audit': AUDIT_STRIP, 'publish': PUBLISH_STRIP}
        kept = _filter_instructions(instructions, strip_map.get(phase, set()))
        rels += kept
        return list(dict.fromkeys(rels))

    names = list(BASE)
    if phase == 'build':
        names.append('_keyword-demand-ladder.md')
    if phase == 'audit':
        names.append('_remediation-ladder.md')
    rels = ['.claude/commands/' + n for n in names]
    rels += ['.claude/commands/' + n for n in OPTIONAL if (root / '.claude/commands' / n).is_file()]
    rels += instructions
    return list(dict.fromkeys(rels))


def core_api():
    return SimpleNamespace(
        CHUNK=CHUNK,
        OBLIGATIONS_SOURCE=OBLIGATIONS_SOURCE,
        sources=sources,
        source_bytes=source_bytes,
        inside=inside,
        load=load,
        save=save,
    )


def prepare(root, phase, instructions, directory, cloud=False, reuse=None, actor="worker", run_id=None,
            context_id=None, context_epoch=None, handoff=None, reuse_application=None, context_packet=None, source=None,
            publication_preparation=None):
    # Capture/check the exit code directly: no shell pipeline can turn failure into success.
    command = ['bash', str(root / '.claude/tools/workflow-start.sh')]
    is_cloud = cloud or str(os.environ.get('CLAUDE_CODE_REMOTE', '')).strip().lower() in ('1', 'true', 'yes')
    if is_cloud:
        command.append('--cloud')
    if run_id:
        command.extend(['--run-id', run_id, '--pinned-to-run'])
    if source:
        command.extend(['--source', source])
    startup = subprocess.run(command, cwd=str(root), check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    local = local_system(root)
    if publication_preparation and (local is None or phase != 'publish'):
        raise ValueError('Native publication preparation only admits Layer3 PUBLISH instruction delivery')
    if local:
        return local.prepare(root, phase, instructions, directory, reuse, actor, run_id,
                             context_id, context_epoch, handoff, sources(root, phase, instructions), CHUNK, reuse_application,
                             context_packet, publication_preparation)
    eff = efficiency_system(root)
    if eff:
        if reuse_application:
            raise ValueError('--reuse-application requires the Layer3 current-context protocol')
        resolved_run = run_id
        if not resolved_run and getattr(startup, 'stdout', None):
            try:
                resolved_run = json.loads(startup.stdout).get('runId')
            except (ValueError, TypeError, AttributeError):
                resolved_run = None
        return eff.prepare(root, phase, instructions, directory, reuse, actor, resolved_run,
                           context_id, context_epoch, core_api(), handoff, context_packet)
    if context_packet:
        raise ValueError('--context-packet requires the Layer3 or portable efficiency policy')
    if reuse_application:
        raise ValueError('--reuse-application requires the Layer3 current-context protocol')
    previous = None
    if reuse is not None:
        previous = validate(root, reuse)
        if previous.get('actor') != actor:
            raise ValueError('Cannot reuse another actor’s instruction delivery')
    files, parts, reused = {}, [], []
    for rel in sources(root, phase, instructions):
        raw = source_bytes(root, rel)
        files[rel] = digest(raw)
        if previous is not None and previous['files'].get(rel) == files[rel]:
            reused.append(rel)
            continue
        content = raw.decode('utf-8')
        for offset in range(0, len(content), CHUNK):
            parts.append({'source': rel, 'offset': offset, 'text': content[offset:offset + CHUNK]})
    directory.mkdir(parents=True, exist_ok=False)
    manifest = {'version': 1, 'root': str(root.resolve()), 'phase': phase,
                'instructions': instructions, 'files': files, 'parts': [], 'delivered': [],
                'actor': actor, 'reused': reused,
                'reuse': {'directory': str(reuse.relative_to(root)), 'sha256': digest((reuse / 'manifest.json').read_bytes())} if reuse is not None else None}
    for index, part in enumerate(parts, 1):
        text = '{} — characters {} onward\n\n{}'.format(part['source'], part['offset'], part['text'])
        name = 'part-{:03d}.txt'.format(index)
        (directory / name).write_text(text)
        manifest['parts'].append({'path': name, 'sha256': digest(text.encode())})
    save(directory / 'manifest.json', manifest)
    return manifest


def load(directory):
    return json.loads((directory / 'manifest.json').read_text())


def validate(root, directory, require_delivery=True, visited=None):
    visited = set() if visited is None else set(visited)
    key = str(directory.resolve())
    if key in visited:
        raise ValueError('Circular instruction receipt reuse')
    visited.add(key)
    m = load(directory)
    if m.get('version') == 2:
        local = local_system(root)
        if local is None:
            raise ValueError('Local workflow policy removed; prepare a fresh bundle')
        return local.validate(root, directory, require_delivery, visited - {key})
    if m.get('version') == 3:
        eff = efficiency_system(root)
        if eff is None:
            raise ValueError('Portable workflow efficiency policy removed; prepare a fresh bundle')
        return eff.validate(root, directory, core_api(), require_delivery)
    if m['root'] != str(root.resolve()):
        raise ValueError('Receipt belongs to another repository')
    if m.get('reuse'):
        previous_dir = inside(root, m['reuse']['directory'])
        if digest((previous_dir / 'manifest.json').read_bytes()) != m['reuse']['sha256']:
            raise ValueError('Reused instruction receipt changed')
        previous = validate(root, previous_dir, visited=visited)
        if previous.get('actor') != m.get('actor'):
            raise ValueError('Cannot reuse another actor’s instruction delivery')
        if any(previous['files'].get(rel) != m['files'].get(rel) for rel in m.get('reused', [])):
            raise ValueError('Reused source hashes do not match')
    elif m.get('reused'):
        raise ValueError('Missing original receipt for reused files')
    expected = sources(root, m['phase'], m['instructions'])
    if set(expected) != set(m['files']):
        raise ValueError('Required file set changed; prepare a fresh bundle')
    for rel, sha in m['files'].items():
        if digest(source_bytes(root, rel)) != sha:
            raise ValueError('Instructions changed: ' + rel + '; prepare a fresh bundle')
    for part in m['parts']:
        if digest(inside(directory, part['path']).read_bytes()) != part['sha256']:
            raise ValueError('Instruction chunk changed; prepare a fresh bundle')
    if require_delivery and m['delivered'] != list(range(1, len(m['parts']) + 1)):
        raise ValueError('Incomplete instruction delivery: {}/{} parts'.format(len(m['delivered']), len(m['parts'])))
    return m


def emit(root, directory, part_number=None):
    m = validate(root, directory, require_delivery=False)
    number = part_number or len(m['delivered']) + 1
    if number < 1 or number > len(m['parts']):
        raise ValueError('No such unread part; run check when all parts are delivered')
    if number > len(m['delivered']) + 1:
        raise ValueError('Read sequentially; earlier parts are missing')
    part = m['parts'][number - 1]
    print('PART {}/{} — read in full; do not pipe or batch with other parts'.format(number, len(m['parts'])))
    print(inside(directory, part['path']).read_text())
    sys.stdout.flush()  # A broken output pipe must not create a delivery receipt.
    if number not in m['delivered']:
        m['delivered'].append(number)
        save(directory / 'manifest.json', m)
    print('\nEND PART {}. Delivery is not proof of understanding or an audit PASS.'.format(number))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest='command', required=True)
    a = sub.add_parser('prepare')
    a.add_argument('--phase', choices=['build', 'write', 'audit', 'publish'], required=True)
    a.add_argument('--instruction', action='append', required=True, help='Current repository-relative phase instructions; repeat for callers')
    a.add_argument('--run-dir', required=True, help='New unique project-relative directory for this actor and phase')
    a.add_argument('--cloud', action='store_true')
    a.add_argument('--source', help='Explicit source checkout, forwarded to the normal startup freshness check')
    a.add_argument('--actor', required=True, help='Current agent identity; independent reviewers use their own identity')
    a.add_argument('--run-id', help='Identifier returned by this routine’s verified startup')
    a.add_argument('--reuse', help='Completed bundle from this same actor and uninterrupted context; fresh startup/application remain required')
    a.add_argument('--reuse-application', help='Retained genuine application for an unrecorded prior local bundle; never edits that receipt')
    a.add_argument('--context-id', help='Current conversation identity; required by the Layer3 local policy')
    a.add_argument('--context-epoch', help='Change after compaction/context loss; never recover an old epoch')
    a.add_argument('--handoff', help='Hash-bound current job handoff JSON, inside this repository')
    a.add_argument('--context-packet', help='Validated focused task packet; keeps history out of the delivered instructions')
    a.add_argument('--publication-preparation', help='Verified native service or recorded ordinary-correction preparation; instruction delivery only, never publication authority')
    for name in ['next', 'check']:
        b = sub.add_parser(name); b.add_argument('--run-dir', required=True)
        if name == 'next':
            b.add_argument('--part', type=int, help='Re-read an already delivered part if tool output was truncated')
        else:
            b.add_argument('--application', help='Current-context rule recall and task application JSON')
    b = sub.add_parser('challenge')
    b.add_argument('--run-dir', required=True)
    args = p.parse_args()
    directory = inside(ROOT, args.run_dir)
    try:
        if args.command == 'prepare':
            m = prepare(ROOT, args.phase, args.instruction, directory, args.cloud,
                        inside(ROOT, args.reuse) if args.reuse else None, args.actor, args.run_id,
                        args.context_id, args.context_epoch, args.handoff,
                        inside(ROOT, args.reuse_application) if args.reuse_application else None, args.context_packet, args.source,
                        args.publication_preparation)
            print(json.dumps({'status': 'prepared-not-read', 'runDir': args.run_dir, 'parts': len(m['parts']), 'reusedFiles': len(m['reused']),
                              'next': 'Issue up to 10 SEPARATE workflow-delivery-serial.local.py Bash tool calls per turn (never a shell for-loop in one Bash call, which triggers >30KB output truncation) until every part is read, then run check.'}))
        elif args.command == 'next':
            emit(ROOT, directory, args.part)
        elif args.command == 'challenge':
            local = local_system(ROOT)
            if local is None:
                raise ValueError('No local comprehension protocol enabled')
            print(json.dumps(local.challenge(ROOT, directory), indent=2))
        else:
            if args.application:
                local = local_system(ROOT)
                if local is None:
                    raise ValueError('No local comprehension protocol enabled')
                local.record_application(ROOT, directory, inside(ROOT, args.application))
            m = validate(ROOT, directory)
            print(json.dumps({'status': 'delivery-complete-sources-current', 'parts': len(m['parts']),
                              'scope': 'Delivery/freshness only. Independent application audit still required.'}))
        return 0
    except (ValueError, OSError, KeyError, subprocess.CalledProcessError) as exc:
        # Never print captured startup output, which could contain credential-bearing remotes.
        detail = 'Startup freshness failed; run workflow-start.sh directly for diagnostics' if isinstance(exc, subprocess.CalledProcessError) else str(exc)
        print('BLOCKED: ' + detail, file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
