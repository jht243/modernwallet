#!/usr/bin/env python3
"""Fail-closed three-way merger for append-only TypeScript content lists (e.g. data/guides-new.ts, data/comparisons-new.ts).

Merges independent tail additions (disjoint slugs appended via `_entries.push({...});` or array entries)
and rejects overlapping slug edits or conflicting mid-file edits by raising ValueError (exit 1).
"""
import argparse
from pathlib import Path
import re
import subprocess
import sys

SLUG_RE = re.compile(r'(?:^|[{,\s])["\']?slug["\']?\s*:\s*["\']([a-z0-9][a-z0-9-]*)["\']', re.M)
ALLOWED_PATH_RE = re.compile(r'^data/(?:[a-z0-9_-]+-new|comparisons-alternatives-[a-z0-9_-]+)\.ts$')


def _extract_slugs(text: str) -> list[str]:
    return SLUG_RE.findall(text)


def _check_balanced_tail(tail: str) -> None:
    """Verify appended TS chunk has balanced braces and parens outside string literals and comments."""
    brace = 0
    paren = 0
    in_str = None
    escape = False
    i = 0
    n = len(tail)
    while i < n:
        c = tail[i]
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
            in_str = c
            i += 1
            continue
        if tail.startswith('//', i):
            nl = tail.find('\n', i + 2)
            i = n if nl < 0 else nl + 1
            continue
        if tail.startswith('/*', i):
            end = tail.find('*/', i + 2)
            if end < 0:
                raise ValueError('Unterminated block comment in appended TS tail')
            i = end + 2
            continue
        if c == '{':
            brace += 1
        elif c == '}':
            brace -= 1
            if brace < 0:
                raise ValueError('Unbalanced closing brace in appended TS tail')
        elif c == '(':
            paren += 1
        elif c == ')':
            paren -= 1
            if paren < 0:
                raise ValueError('Unbalanced closing paren in appended TS tail')
        i += 1
    if in_str is not None or brace != 0 or paren != 0:
        raise ValueError(f'Unbalanced TS tail (in_str={in_str!r}, brace={brace}, paren={paren})')


def _validate_append_tail(tail: str, label: str) -> set[str]:
    stripped = tail.strip()
    if not stripped:
        return set()
    _check_balanced_tail(stripped)
    if '_entries.push(' not in stripped and not stripped.startswith('{'):
        raise ValueError(f'{label} tail is not a recognized _entries.push / object append block')
    slugs = _extract_slugs(stripped)
    if not slugs:
        raise ValueError(f'{label} tail contains no recognizable slug entry')
    if len(slugs) != len(set(slugs)):
        raise ValueError(f'{label} tail contains duplicate slugs within one side')
    return set(slugs)


def merge(base_text: str, ours_text: str, theirs_text: str) -> str:
    if ours_text == theirs_text:
        return ours_text
    if ours_text == base_text:
        return theirs_text
    if theirs_text == base_text:
        return ours_text

    base_norm = base_text.rstrip('\r\n')
    ours_is_append = bool(base_norm) and ours_text.startswith(base_norm)
    theirs_is_append = bool(base_norm) and theirs_text.startswith(base_norm)

    if ours_is_append and theirs_is_append:
        ours_tail = ours_text[len(base_norm):].lstrip('\r\n').rstrip()
        theirs_tail = theirs_text[len(base_norm):].lstrip('\r\n').rstrip()
        ours_slugs = _validate_append_tail(ours_tail, 'ours')
        theirs_slugs = _validate_append_tail(theirs_tail, 'theirs')
        overlap = sorted(ours_slugs & theirs_slugs)
        if overlap:
            raise ValueError('Conflicting duplicate appended slug(s): ' + ', '.join(overlap))
        parts = [base_norm]
        if ours_tail:
            parts.append(ours_tail)
        if theirs_tail:
            parts.append(theirs_tail)
        return '\n\n'.join(parts) + '\n'

    # Case 2: one side strictly appended disjoint new slugs at the tail while the other side
    # updated earlier existing entries in base (never touching the appended slugs).
    if theirs_is_append and not ours_is_append:
        theirs_tail = theirs_text[len(base_norm):].lstrip('\r\n').rstrip()
        theirs_slugs = _validate_append_tail(theirs_tail, 'theirs')
        ours_all_slugs = set(_extract_slugs(ours_text))
        overlap = sorted(theirs_slugs & ours_all_slugs)
        if overlap:
            raise ValueError('Appended slug(s) already exist in upstream side: ' + ', '.join(overlap))
        return ours_text.rstrip('\r\n') + '\n\n' + theirs_tail + '\n'

    if ours_is_append and not theirs_is_append:
        ours_tail = ours_text[len(base_norm):].lstrip('\r\n').rstrip()
        ours_slugs = _validate_append_tail(ours_tail, 'ours')
        theirs_all_slugs = set(_extract_slugs(theirs_text))
        overlap = sorted(ours_slugs & theirs_all_slugs)
        if overlap:
            raise ValueError('Upstream appended slug(s) already exist in branch side: ' + ', '.join(overlap))
        return theirs_text.rstrip('\r\n') + '\n\n' + ours_tail + '\n'

    raise ValueError('Both sides modified non-append regions of TS data file; manual merge required')


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
            if not ALLOWED_PATH_RE.fullmatch(path):
                raise ValueError('Unsupported TS append-merge target: ' + path)
            texts = [subprocess.check_output(['git', 'show', f':{stage}:{path}']).decode('utf-8') for stage in (1, 2, 3)]
            pending[path] = merge(*texts)
        for path, merged in pending.items():
            Path(path).write_text(merged, encoding='utf-8')
        return
    if not (args.base and args.ours and args.theirs):
        parser.error('Provide --index PATH... or --base --ours --theirs')
    merged = merge(
        Path(args.base).read_text(encoding='utf-8'),
        Path(args.ours).read_text(encoding='utf-8'),
        Path(args.theirs).read_text(encoding='utf-8'),
    )
    if args.output:
        Path(args.output).write_text(merged, encoding='utf-8')
    else:
        sys.stdout.write(merged)


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'merge-ts-entries: {exc}', file=sys.stderr)
        sys.exit(1)
