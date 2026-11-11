"""Lossless instruction compilation for the existing fleet preflight."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re

VERSION = 3
CONTRACT = '.claude/commands/_workflow-efficiency.md'
PUBLISH_PROSE_MANUALS = {
    '.claude/commands/_content-standard.md',
    '.claude/commands/_anti-ai-language.md',
}


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def require(ok, message):
    if not ok:
        raise ValueError(message)


def compiled(texts, reused, scope_references=False):
    seen = {}
    output = []
    for name, text in texts.items():
        if name in reused:
            continue
        blocks = [b for b in re.findall(r'.*?(?:(?:\r?\n){2}|\Z)', text, re.S) if b]
        require(''.join(blocks) == text, 'Lossless instruction segmentation failed')
        new = []
        for number, block in enumerate(blocks, 1):
            digest = sha(block.encode())
            if digest not in seen or (scope_references and name.startswith('reports/')):
                new.append(block)
                seen.setdefault(digest, (name, number))
            elif scope_references:
                original, index = seen[digest]
                reference = ('[Repeated passage at this position: ' + original + ', paragraph '
                             + str(index) + '. Use its exact text under this source/section context.]\n\n')
                new.append(reference if len(reference) < len(block) else block)
        if new or scope_references:
            output.append('[Source: ' + name + ']\n' + ''.join(new) + '\n')
    return ''.join(output)


def _read_source_bytes(core, root, name):
    reader = getattr(core, 'source_bytes', None)
    if reader is not None:
        return reader(root, name)
    return core.inside(root, name).read_bytes()


def expected_sources(root, phase, instructions, core, has_handoff=False):
    rels = list(dict.fromkeys(core.sources(root, phase, instructions) + [CONTRACT]))
    if phase == 'publish' and has_handoff:
        rels = [r for r in rels if r not in PUBLISH_PROSE_MANUALS]
    return rels


def historical(root, directory, core, visited=None, require_delivery=True):
    visited = set() if visited is None else set(visited)
    key = str(directory.resolve())
    require(key not in visited, 'Circular retained instruction history')
    visited.add(key)
    m = core.load(directory)
    require(m['version'] == VERSION and m['root'] == str(root.resolve()), 'Different repository or receipt protocol')
    require(m.get('phase') in ('build', 'write', 'audit', 'publish'), 'Unknown original instruction phase')
    texts = m['sourceTexts']
    require(set(texts) == set(m['files']), 'Missing original rule coverage')
    for name, text in texts.items():
        core.inside(root, name)
        require(sha(text.encode()) == m['files'][name], 'Original instruction bytes changed')
    reused = m['reused']
    require(len(set(reused)) == len(reused) and set(reused) <= set(texts), 'Invalid retained sources')
    if m.get('reuse'):
        ref = m['reuse']
        old_dir = core.inside(root, ref['directory'])
        require(sha((old_dir / 'manifest.json').read_bytes()) == ref['sha256'], 'Original reading receipt changed')
        old = historical(root, old_dir, core, visited)
        require(all(m.get(k) and old.get(k) == m.get(k) for k in ('actor', 'contextId', 'contextEpoch')),
                'Lost or different actor, role, conversation or context epoch; reread current rules')
        require(all(old['files'].get(k) == m['files'][k] for k in reused), 'Retained instruction hashes changed')
    else:
        require(not reused, 'Missing original reading receipt')
    require(m.get('compiler') in (None, 'scoped-passages-v1'), 'Unknown instruction compilation protocol')
    text = compiled(texts, reused, scope_references=m.get('compiler') == 'scoped-passages-v1')
    parts = [text[i:i + core.CHUNK] for i in range(0, len(text), core.CHUNK)]
    require(m['deliveryCharacters'] == len(text) and len(m['parts']) == len(parts), 'Instruction coverage changed')
    for ref, part in zip(m['parts'], parts):
        raw = core.inside(directory, ref['path']).read_bytes()
        require(raw == part.encode() and sha(raw) == ref['sha256'], 'Incomplete or altered instruction delivery')
    if require_delivery:
        require(m['delivered'] == list(range(1, len(parts) + 1)), 'Incomplete instruction reading')
    return m


def current_task(root, path, phase, actor):
    spec = importlib.util.spec_from_file_location('current_workflow_handoff', Path(__file__).with_name('workflow-handoff.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.focused(root, path, phase, actor)


def prepare(root, phase, instructions, directory, reuse, actor, run_id, context_id, context_epoch, core, handoff=None, context_packet=None):
    require(run_id, 'Use the actual verified startup run ID')
    require(phase == 'build' or handoff, 'WRITE/AUDIT/PUBLISH require the current canonical handoff')
    context_id = context_id or os.environ.get('CLAUDE_CODE_SESSION_ID') or os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID')
    require(context_id and context_epoch,
            'Supply the actual --context-id and --context-epoch before preparing any reading. '
            'For --reuse, repair missing identity flags and confirm current access/understanding; '
            'do not drop --reuse or change epoch merely because a task/handoff changed. '
            'A new epoch and full reading are required after real context loss.')
    rels = expected_sources(root, phase, instructions, core, has_handoff=bool(handoff))
    texts = {name: _read_source_bytes(core, root, name).decode('utf-8') for name in rels}
    files = {name: sha(text.encode()) for name, text in texts.items()}
    task = None
    if handoff:
        handoff_path = core.inside(root, handoff)
        task = current_task(root, handoff_path, phase, actor)
        task_path = core.inside(root, context_packet) if context_packet else directory / 'task.json'
        if context_packet:
            require(json.loads(task_path.read_bytes()) == task, 'Task packet changed or omitted current scope')
        else:
            directory.mkdir(parents=True, exist_ok=False)
            core.save(task_path, task)
        name = str(task_path.resolve().relative_to(root.resolve()))
        texts[name] = task_path.read_bytes().decode('utf-8')
        files[name] = sha(texts[name].encode())
    reused = []
    ref = None
    if reuse:
        old = historical(root, reuse, core)
        require(context_id and context_epoch and all(old.get(k) == v for k, v in
                {'actor': actor, 'contextId': context_id, 'contextEpoch': context_epoch}.items()),
                'Retain only this role’s actual uninterrupted context; otherwise reread without --reuse')
        reused = [name for name, value in files.items() if old['files'].get(name) == value]
        ref = {'directory': str(reuse.resolve().relative_to(root.resolve())), 'sha256': sha((reuse / 'manifest.json').read_bytes())}
    text = compiled(texts, reused, scope_references=True)
    if not task or context_packet:
        directory.mkdir(parents=True, exist_ok=False)
    m = dict(version=VERSION, compiler='scoped-passages-v1', root=str(root.resolve()), phase=phase, instructions=instructions,
             actor=actor, runId=run_id, contextId=context_id, contextEpoch=context_epoch,
             files=files, sourceTexts=texts, reused=reused, reuse=ref, parts=[], delivered=[],
             deliveryCharacters=len(text), sourceCharacters=sum(map(len, texts.values())),
             handoff=task['handoff'] if task else None, taskPath=str(task_path.resolve().relative_to(root.resolve())) if task else None)
    for i, offset in enumerate(range(0, len(text), core.CHUNK), 1):
        part = text[offset:offset + core.CHUNK]
        name = 'part-%03d.txt' % i
        (directory / name).write_text(part)
        m['parts'].append({'path': name, 'sha256': sha(part.encode())})
    core.save(directory / 'manifest.json', m)
    return m


def validate(root, directory, core, require_delivery=True):
    m = core.load(directory)
    expected = set(expected_sources(root, m['phase'], m['instructions'], core, has_handoff=bool(m.get('handoff'))))
    require(m['phase'] == 'build' or m.get('handoff'), 'Missing canonical handoff')
    if m.get('handoff'):
        ref = m['handoff']
        path = core.inside(root, ref['path'])
        require(sha(path.read_bytes()) == ref['sha256'], 'Canonical handoff changed')
        task = current_task(root, path, m['phase'], m['actor'])
        require(json.loads(core.inside(root, m['taskPath']).read_bytes()) == task, 'Task packet omitted current scope, findings or counters')
        expected.add(m['taskPath'])
    require(expected == set(m['files']), 'Applicable instruction set changed; prepare current reading')
    for name, digest in m['files'].items():
        require(sha(_read_source_bytes(core, root, name)) == digest, 'Instructions changed: ' + name)
    delivered = m['delivered']
    count = len(m['parts'])
    require(delivered == list(range(1, len(delivered) + 1)) and len(delivered) <= count, 'Invalid delivery order')
    historical(root, directory, core, require_delivery=require_delivery)
    return m
