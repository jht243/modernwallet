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
import tempfile

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


def _split_body_and_tail(base_norm: str, side_text: str) -> tuple[str, str] | None:
    """Split side_text into (body_corresponding_to_base, appended_tail_after_base)."""
    base_slugs = _extract_slugs(base_norm)
    if not base_slugs:
        return None
    last_slug = base_slugs[-1]
    m = re.search(rf'["\']?slug["\']?\s*:\s*["\']{re.escape(last_slug)}["\']', side_text)
    if not m:
        return None
    # Check if last_slug sits inside aconst array `];` or an `_entries.push({...});`
    push_pos = side_text.rfind('_entries.push(', 0, m.start())
    arr_end_in_base = base_norm.rstrip().endswith('];')
    if push_pos >= 0 and not arr_end_in_base:
        # Advance from '(' of _entries.push( to its matching ')' + optional ';' + optional '// ... END' line
        i = push_pos + len('_entries.push')
        paren = 0
        in_str = None
        esc = False
        n = len(side_text)
        while i < n:
            c = side_text[i]
            if in_str:
                if esc:
                    esc = False
                elif c == '\\':
                    esc = True
                elif c == in_str:
                    in_str = None
                i += 1
                continue
            if c in ('"', "'", '`'):
                in_str = c
                i += 1
                continue
            if side_text.startswith('//', i):
                nl = side_text.find('\n', i + 2)
                i = n if nl < 0 else nl + 1
                continue
            if c == '(':
                paren += 1
            elif c == ')':
                paren -= 1
                if paren == 0:
                    i += 1
                    while i < n and side_text[i] in ' \t;':
                        i += 1
                    # Include trailing '// ... END' comment if base_norm also ended with one
                    if base_norm.splitlines()[-1].lstrip().startswith('//'):
                        nl = side_text.find('\n', i)
                        next_ln_end = side_text.find('\n', nl + 1) if nl >= 0 else -1
                        cand_ln = side_text[nl + 1:(next_ln_end if next_ln_end >= 0 else n)] if nl >= 0 else ''
                        if cand_ln.lstrip().startswith('//') and 'END' in cand_ln:
                            i = next_ln_end if next_ln_end >= 0 else n
                    return side_text[:i].rstrip('\r\n'), side_text[i:].lstrip('\r\n').rstrip()
            i += 1
        return None
    if arr_end_in_base:
        close_idx = side_text.find('\n];', m.end())
        if close_idx >= 0:
            end_i = close_idx + len('\n];')
            return side_text[:end_i].rstrip('\r\n'), side_text[end_i:].lstrip('\r\n').rstrip()
    return None


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

    # Case 3: both sides made non-overlapping mid-file edits (e.g. inbound links on different
    # existing guides) AND zero, one, or both sides appended disjoint new slugs at the tail.
    o_split = _split_body_and_tail(base_norm, ours_text)
    t_split = _split_body_and_tail(base_norm, theirs_text)
    if o_split is not None and t_split is not None:
        ours_body, ours_tail = o_split
        theirs_body, theirs_tail = t_split
        ours_slugs = _validate_append_tail(ours_tail, 'ours')
        theirs_slugs = _validate_append_tail(theirs_tail, 'theirs')
        overlap = sorted(ours_slugs & theirs_slugs)
        if overlap:
            raise ValueError('Conflicting duplicate appended slug(s): ' + ', '.join(overlap))
        if sorted(ours_slugs & set(_extract_slugs(theirs_body))) or sorted(theirs_slugs & set(_extract_slugs(ours_body))):
            raise ValueError('Appended slug(s) already exist in body')
        with tempfile.TemporaryDirectory() as td:
            td_p = Path(td)
            p_o, p_b, p_t = td_p / 'o.ts', td_p / 'b.ts', td_p / 't.ts'
            p_o.write_text(ours_body + '\n', encoding='utf-8')
            p_b.write_text(base_norm + '\n', encoding='utf-8')
            p_t.write_text(theirs_body + '\n', encoding='utf-8')
            res = subprocess.run(['git', 'merge-file', '-p', str(p_o), str(p_b), str(p_t)], capture_output=True, text=True)
        if res.returncode == 0:
            parts = [res.stdout.rstrip('\r\n')]
            if ours_tail:
                parts.append(ours_tail)
            if theirs_tail:
                parts.append(theirs_tail)
            return '\n\n'.join(parts) + '\n'

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
