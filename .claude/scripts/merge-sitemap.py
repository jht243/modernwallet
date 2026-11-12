#!/usr/bin/env python3
"""Merge independent sitemap changes by URL; reject conflicting edits to one URL."""
import argparse
from pathlib import Path
import re
import subprocess
import sys
import xml.etree.ElementTree as ET

NS = '{http://www.sitemaps.org/schemas/sitemap/0.9}'


def parse(text):
    root = ET.fromstring(text)
    if root.tag != NS + 'urlset' or root.attrib:
        raise ValueError('Only plain sitemap urlsets are supported')
    blocks = re.findall(r'<url(?:\s[^>]*)?>.*?</url>', text, re.S)
    if len(blocks) != len(root):
        raise ValueError('Unsupported sitemap formatting')
    entries = {}
    for child, block in zip(root, blocks):
        locs = child.findall(NS + 'loc')
        if child.tag != NS + 'url' or len(locs) != 1 or not locs[0].text:
            raise ValueError('Missing or ambiguous URL')
        loc = locs[0].text
        # Ignore indentation, but preserve every element, value and attribute.
        def value(node):
            return (node.tag, sorted(node.attrib.items()), (node.text or '').strip(),
                    tuple(value(c) for c in node))
        signature = value(child)
        if loc in entries and entries[loc][0] != signature:
            raise ValueError('Conflicting duplicate URL: ' + loc)
        entries[loc] = (signature, block)
    shell = re.sub(r'<url(?:\s[^>]*)?>.*?</url>', '', text, flags=re.S)
    # Do not silently discard comments, extensions or different declarations.
    shell = re.sub(r'\s+', '', shell)
    return entries, shell


def merge(base_text, ours_text, theirs_text):
    base, base_shell = parse(base_text)
    ours, ours_shell = parse(ours_text)
    theirs, theirs_shell = parse(theirs_text)
    if base_shell != ours_shell or base_shell != theirs_shell:
        raise ValueError('Sitemap envelope changed')
    selected = {}
    for loc in dict.fromkeys([*ours, *theirs, *base]):
        b, o, t = (entries.get(loc) for entries in (base, ours, theirs))
        signature = lambda item: item[0] if item else None
        if signature(o) == signature(t) or signature(t) == signature(b):
            chosen = o
        elif signature(o) == signature(b):
            chosen = t
        else:
            raise ValueError('Conflicting changes to URL: ' + loc)
        if chosen is not None:
            selected[loc] = chosen[1]
    # Keep the upstream envelope and each selected entry's original XML.
    first = re.search(r'<url(?:\s[^>]*)?>', ours_text)
    prefix = ours_text[:first.start()].rstrip() if first else ours_text[:ours_text.index('</urlset>')].rstrip()
    result = prefix + '\n' + ''.join('  ' + block + '\n' for block in selected.values()) + '</urlset>\n'
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
            if not re.fullmatch(r'public/sitemap[^/]*\.xml', path):
                raise ValueError('Not a public sitemap: ' + path)
            texts = [subprocess.check_output(['git', 'show', f':{stage}:{path}']).decode() for stage in (1, 2, 3)]
            pending[path] = merge(*texts)
    else:
        if not all((args.base, args.ours, args.theirs, args.output)):
            parser.error('Supply --index PATH... or --base/--ours/--theirs/--output')
        pending[args.output] = merge(*(Path(p).read_text() for p in (args.base, args.ours, args.theirs)))
    for path, result in pending.items():
        Path(path).write_text(result)
        print('Merged sitemap: ' + path)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, ET.ParseError, subprocess.CalledProcessError) as exc:
        print('Sitemap merge refused: ' + str(exc), file=sys.stderr)
        sys.exit(1)
