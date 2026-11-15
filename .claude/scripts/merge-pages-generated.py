#!/usr/bin/env python3
"""Merge independent data/pages.generated.ts additions by path; reject conflicting edits to one path."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

HEADER_RE = re.compile(r'^(.*?export\s+const\s+\w+\s*(?::[^=]+)?=\s*\[)(.*)(\];\s*)$', re.S)


def _scan_top_level_objects(body: str):
    """Extract top-level `{ ... }` object blocks (with any preceding whitespace/comments) from TS array body."""
    entries = []
    i = 0
    n = len(body)
    chunk_start = 0
    while i < n:
        # Skip whitespace and comments before `{`
        while i < n:
            ch = body[i]
            if ch in ' \t\r\n,':
                i += 1
            elif body.startswith('//', i):
                nl = body.find('\n', i + 2)
                i = n if nl < 0 else nl + 1
            elif body.startswith('/*', i):
                end = body.find('*/', i + 2)
                if end < 0:
                    raise ValueError('Unterminated block comment in pages.generated.ts')
                i = end + 2
            else:
                break
        if i >= n:
            break
        if body[i] != '{':
            raise ValueError(f'Unsupported expression in pages.generated.ts near offset {i}: {body[i:i+32]!r}')
        obj_start = i
        depth = 0
        in_str = None
        escape = False
        while i < n:
            c = body[i]
            if in_str:
                if escape:
                    escape = False
                elif c == '\\':
                    escape = True
                elif c == in_str:
                    in_str = None
                i += 1
                continue
            if c in ('"', "'", '`'):
                if c == '`':
                    raise ValueError('Template literals are not supported in pages.generated.ts merge')
                in_str = c
                i += 1
                continue
            if body.startswith('//', i):
                nl = body.find('\n', i + 2)
                i = n if nl < 0 else nl + 1
                continue
            if body.startswith('/*', i):
                end = body.find('*/', i + 2)
                if end < 0:
                    raise ValueError('Unterminated block comment inside entry')
                i = end + 2
                continue
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    i += 1
                    break
            i += 1
        if depth != 0:
            raise ValueError('Unbalanced braces in pages.generated.ts')
        obj_end = i
        # Consume optional trailing comma on same line
        j = obj_end
        while j < n and body[j] in ' \t':
            j += 1
        if j < n and body[j] == ',':
            j += 1
        raw_block = body[chunk_start:j].lstrip('\r\n')
        raw_obj = body[obj_start:obj_end]
        chunk_start = j
        i = j
        entries.append((raw_obj, raw_block))
    return entries


def _parse_entry_json(raw_obj: str):
    """Parse a JSON-compatible TS object literal (allowing trailing commas before } or ])."""
    # Strip // and /* */ comments outside strings, and trailing commas before } or ]
    out = []
    i = 0
    n = len(raw_obj)
    in_str = None
    escape = False
    while i < n:
        c = raw_obj[i]
        if in_str:
            out.append(c)
            if escape:
                escape = False
            elif c == '\\':
                escape = True
            elif c == in_str:
                in_str = None
            i += 1
            continue
        if c == '"':
            in_str = '"'
            out.append(c)
            i += 1
            continue
        if raw_obj.startswith('//', i):
            nl = raw_obj.find('\n', i + 2)
            i = n if nl < 0 else nl
            continue
        if raw_obj.startswith('/*', i):
            end = raw_obj.find('*/', i + 2)
            if end < 0:
                raise ValueError('Unterminated block comment')
            i = end + 2
            continue
        out.append(c)
        i += 1
    cleaned = re.sub(r',(\s*[}\]])', r'\1', ''.join(out))
    val = json.loads(cleaned)
    if not isinstance(val, dict):
        raise ValueError('Entry is not an object')
    return val


def parse(text: str):
    m = HEADER_RE.match(text)
    if not m:
        raise ValueError('Unsupported pages.generated.ts envelope')
    prefix, body, suffix = m.group(1), m.group(2), m.group(3)
    shell = re.sub(r'\s+', '', prefix + suffix)
    entries = {}
    for raw_obj, raw_block in _scan_top_level_objects(body):
        val = _parse_entry_json(raw_obj)
        key = val.get('path') or val.get('slug')
        if not isinstance(key, str) or not key.strip():
            raise ValueError('Entry missing string path/slug key')
        sig = json.dumps(val, sort_keys=True, ensure_ascii=False, separators=(',', ':'))
        if key in entries and entries[key][0] != sig:
            raise ValueError('Conflicting duplicate path in single file: ' + key)
        block = raw_block.rstrip()
        if not block.endswith(','):
            block += ','
        entries[key] = (sig, block)
    return entries, shell, prefix, suffix


def merge(base_text: str, ours_text: str, theirs_text: str) -> str:
    base, base_shell, _, _ = parse(base_text)
    ours, ours_shell, prefix, suffix = parse(ours_text)
    theirs, theirs_shell, _, _ = parse(theirs_text)
    if base_shell != ours_shell or base_shell != theirs_shell:
        raise ValueError('pages.generated.ts envelope changed')
    selected = {}
    for key in dict.fromkeys([*ours, *theirs, *base]):
        b, o, t = (d.get(key) for d in (base, ours, theirs))
        sig = lambda item: item[0] if item else None
        if sig(o) == sig(t) or sig(t) == sig(b):
            chosen = o
        elif sig(o) == sig(b):
            chosen = t
        else:
            raise ValueError('Conflicting changes to path: ' + key)
        if chosen is not None:
            selected[key] = chosen[1]
    result = prefix.rstrip() + '\n' + ''.join(block + '\n' for block in selected.values()) + suffix.lstrip('\r\n')
    if not result.endswith('\n'):
        result += '\n'
    parse(result)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--index', nargs='+', metavar='PATH')
    parser.add_argument('--base')
    parser.add_argument('--ours')
    parser.add_argument('--theirs')
    parser.add_argument('--output')
    args = parser.parse_args()
    pending = {}
    if args.index:
        for path in args.index:
            if path != 'data/pages.generated.ts':
                raise ValueError('Not data/pages.generated.ts: ' + path)
            texts = [subprocess.check_output(['git', 'show', f':{stage}:{path}']).decode() for stage in (1, 2, 3)]
            pending[path] = merge(*texts)
    else:
        if not all((args.base, args.ours, args.theirs, args.output)):
            parser.error('Supply --index PATH... or --base/--ours/--theirs/--output')
        pending[args.output] = merge(*(Path(p).read_text() for p in (args.base, args.ours, args.theirs)))
    for path, result in pending.items():
        Path(path).write_text(result)
        print('Merged pages.generated.ts: ' + path)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, json.JSONDecodeError, subprocess.CalledProcessError) as exc:
        print('pages.generated.ts merge refused: ' + str(exc), file=sys.stderr)
        sys.exit(1)
