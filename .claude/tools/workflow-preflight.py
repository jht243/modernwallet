#!/usr/bin/env python3
"""Deliver complete workflow instructions in bounded chunks; verify delivery/freshness.

A delivery receipt is NOT proof of comprehension, review, or publication approval.
Only the independent reviewer can assess whether the recorded rules were applied.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import uuid

ROOT = Path(__file__).resolve().parents[2]
BASE = ['_decision-evidence.md', '_testing-labels.md', '_content-standard.md',
        '_anti-ai-language.md', '_experience.md', '_workflow-checkpoints.md']
OPTIONAL = ['_testing-labels.local.md', '_content-standard.local.md']
CHUNK = 9000  # characters, deliberately below ordinary tool-output truncation


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


def sources(root, phase, instructions):
    names = list(BASE)
    if phase == 'build':
        names.append('_keyword-demand-ladder.md')
    if phase == 'audit':
        names.append('_remediation-ladder.md')
    rels = ['.claude/commands/' + n for n in names]
    rels += ['.claude/commands/' + n for n in OPTIONAL if (root / '.claude/commands' / n).is_file()]
    rels += instructions
    return list(dict.fromkeys(rels))


def prepare(root, phase, instructions, directory, cloud=False):
    # Capture/check the exit code directly: no shell pipeline can turn failure into success.
    command = ['bash', str(root / '.claude/tools/workflow-start.sh')]
    if cloud:
        command.append('--cloud')
    subprocess.run(command, cwd=str(root), check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    files, parts = {}, []
    for rel in sources(root, phase, instructions):
        raw = inside(root, rel).read_bytes()
        files[rel] = digest(raw)
        content = raw.decode('utf-8')
        for offset in range(0, len(content), CHUNK):
            parts.append({'source': rel, 'offset': offset, 'text': content[offset:offset + CHUNK]})
    directory.mkdir(parents=True, exist_ok=False)
    manifest = {'version': 1, 'root': str(root.resolve()), 'phase': phase,
                'instructions': instructions, 'files': files, 'parts': [], 'delivered': []}
    for index, part in enumerate(parts, 1):
        text = '{} — characters {} onward\n\n{}'.format(part['source'], part['offset'], part['text'])
        name = 'part-{:03d}.txt'.format(index)
        (directory / name).write_text(text)
        manifest['parts'].append({'path': name, 'sha256': digest(text.encode())})
    save(directory / 'manifest.json', manifest)
    return manifest


def load(directory):
    return json.loads((directory / 'manifest.json').read_text())


def validate(root, directory, require_delivery=True):
    m = load(directory)
    if m['root'] != str(root.resolve()):
        raise ValueError('Receipt belongs to another repository')
    expected = sources(root, m['phase'], m['instructions'])
    if set(expected) != set(m['files']):
        raise ValueError('Required file set changed; prepare a fresh bundle')
    for rel, sha in m['files'].items():
        if digest(inside(root, rel).read_bytes()) != sha:
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
    for name in ['next', 'check']:
        b = sub.add_parser(name); b.add_argument('--run-dir', required=True)
        if name == 'next':
            b.add_argument('--part', type=int, help='Re-read an already delivered part if tool output was truncated')
    args = p.parse_args()
    directory = inside(ROOT, args.run_dir)
    try:
        if args.command == 'prepare':
            m = prepare(ROOT, args.phase, args.instruction, directory, args.cloud)
            print(json.dumps({'status': 'prepared-not-read', 'runDir': args.run_dir, 'parts': len(m['parts']),
                              'next': 'Run next once per tool call until every part is read, then run check.'}))
        elif args.command == 'next':
            emit(ROOT, directory, args.part)
        else:
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
