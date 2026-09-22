#!/usr/bin/env python3
"""Internal-link audit for a content routine's Phase 6. Project-agnostic.

Answers the three questions Phase 6 has to answer with evidence rather than guesswork:
  1. How many inbound links does each new page actually have, and from where?
  2. Is any target reached by ONE repeated anchor phrase? (a machine footprint,
     and a wasted ranking signal)
  3. Which existing pages already discuss a new page's topic and do NOT link it?
     -- these are the only placements that will read naturally.

Counts links in ARTICLE PROSE only: navigation, footer, and "related articles"
rails are excluded, because a rail link is not an editorial link.

Usage:
  python3 link_audit.py --root . --new slug-a --new slug-b [--topic slug-a='regex']
  python3 link_audit.py --root . --new-file new-routes.txt --json out.json

Static-HTML projects work out of the box. For a JSX/MDX/data-store project pass
--ext .tsx --ext .mdx (etc); the anchor regex also matches <Link href="...">.
"""
import argparse, json, os, re, sys, collections

NON_PROSE = ('<nav', '<footer', '<header',
             'related-articles', 'related-posts', 'you-might-also-like',
             'share-section', 'newsletter', 'sub-menu', 'breadcrumb')

# Container CLASSES whose entire subtree is furniture, not editorial prose.
# A link inside one of these is a rail/card/pill, and must not count as an
# editorial inbound link (added 2026-09-22 after a Phase 6 review found the
# audit scoring tool-pill rails and index cards as prose).
FURNITURE_CLASSES = (
    'related-articles', 'related-posts', 'you-might-also-like', 'share-section',
    'related-grid', 'related-card', 'tool-pills', 'tool-pill', 'tools',
    'cta-section', 'card-grid', 'newsletter', 'breadcrumb', 'crumb',
    'pagination', 'toc', 'table-of-contents', 'sources',
    'gcard', 'ccard', 'rcard', 'tcard', 'card',
)

def _strip_furniture(body: str) -> str:
    """Remove the full subtree of any element whose class matches FURNITURE_CLASSES.

    Walks tags to find the matching close tag so the whole block goes, rather
    than truncating the document at the first marker (the old behaviour, which
    both over-cut and under-cut)."""
    pat = re.compile(r'(?is)<(section|div|aside|ul|ol|nav|a)\b[^>]*class="[^"]*\b(?:' +
                     '|'.join(re.escape(c) for c in FURNITURE_CLASSES) + r')\b[^"]*"[^>]*>')
    while True:
        m = pat.search(body)
        if not m:
            return body
        tag = m.group(1).lower()
        depth, pos = 1, m.end()
        tagpat = re.compile(r'(?is)<(/?)' + tag + r'\b[^>]*?(/?)>')
        while depth > 0:
            t2 = tagpat.search(body, pos)
            if not t2:
                # Unbalanced markup: no matching close tag. Drop only the opening
                # tag and keep the remainder, rather than truncating the document
                # to the end (which would silently under-count inbound links).
                return body[:m.start()] + ' ' + body[m.end():]
            pos = t2.end()
            if t2.group(1):
                depth -= 1
            elif not t2.group(2):
                depth += 1
        body = body[:m.start()] + ' ' + body[pos:]

def prose(html: str) -> str:
    m = re.search(r'<main[\s>]', html)
    e = html.find('</main>')
    body = html[m.end():e] if (m and e > 0) else html
    body = re.sub(r'(?is)<(script|style|nav|footer|header|svg)[^>]*>.*?</\1>', ' ', body)
    body = _strip_furniture(body)
    return body

def route_of(path: str, root: str) -> str:
    rel = os.path.relpath(path, root)
    for suffix in ('/index.html', 'index.html'):
        if rel.endswith(suffix):
            return rel[:-len(suffix)].strip('/')
    return os.path.splitext(rel)[0].strip('/')

def collect(root, exts, skip_dirs):
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames
                       if d not in skip_dirs and not d.startswith('.') and d != 'node_modules']
        for fn in filenames:
            if any(fn.endswith(x) for x in exts):
                out.append(os.path.join(dirpath, fn))
    return out

def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='.')
    ap.add_argument('--new', action='append', default=[], help='route/slug created this run')
    ap.add_argument('--new-file', help='file with one new route per line')
    ap.add_argument('--topic', action='append', default=[],
                    help="slug='regex' — what counts as discussing this page's topic")
    ap.add_argument('--ext', action='append', default=[])
    ap.add_argument('--skip', action='append', default=['reports', 'dist', 'build', '.git'])
    ap.add_argument('--min-mentions', type=int, default=3)
    ap.add_argument('--target-inbound', type=int, default=3)
    ap.add_argument('--json')
    a = ap.parse_args(argv)

    exts = a.ext or ['.html']
    new = list(a.new)
    if a.new_file:
        new += [l.strip().strip('/') for l in open(a.new_file) if l.strip()]
    new = [n.strip('/') for n in new]
    if not new:
        ap.error('give at least one --new route')
    topics = {}
    for t in a.topic:
        k, _, v = t.partition('=')
        topics[k.strip().strip('/')] = re.compile(v.strip().strip('\'"'), re.I)

    files = collect(a.root, exts, set(a.skip))
    inbound = collections.defaultdict(list)
    mentions = collections.defaultdict(list)

    for f in files:
        src = route_of(f, a.root)
        if src in new and not topics:
            pass
        try:
            raw = open(f, encoding='utf-8', errors='replace').read()
        except OSError:
            continue
        body = prose(raw)
        text = re.sub(r'<[^>]+>', ' ', body)
        for n in new:
            if src == n:
                continue
            pat = re.compile(r'<(?:a|Link)[^>]+(?:href|to)="/' + re.escape(n) + r'/?"[^>]*>(.*?)</(?:a|Link)>', re.S)
            hits = [re.sub(r'<[^>]+>', '', m.group(1)).strip() for m in pat.finditer(body)]
            for anchor in hits:
                inbound[n].append({'from': src, 'anchor': anchor})
            if not hits and n in topics:
                c = len(topics[n].findall(text))
                if c >= a.min_mentions:
                    mentions[n].append({'page': src, 'mentions': c})

    report = {'new_pages': {}, 'target_inbound': a.target_inbound}
    for n in new:
        links = inbound[n]
        anchors = [l['anchor'] for l in links]
        distinct = len({x.lower() for x in anchors})
        opp = sorted(mentions[n], key=lambda x: -x['mentions'])
        report['new_pages'][n] = {
            'inbound': len(links), 'distinct_anchors': distinct,
            'orphan': len(links) == 0,
            'below_target': len(links) < a.target_inbound,
            'single_anchor': len(links) >= 3 and distinct == 1,
            'siblings_linking_in': sorted({l['from'] for l in links if l['from'] in new}),
            'links': links, 'unlinked_mentions': opp[:12],
        }

    if a.json:
        json.dump(report, open(a.json, 'w'), indent=1)

    print(f"{'page':40s} {'in':>3} {'anchors':>7}  flags")
    problems = 0
    for n in new:
        r = report['new_pages'][n]
        flags = []
        if r['orphan']: flags.append('ORPHAN')
        elif r['below_target']: flags.append(f"below target ({r['inbound']}/{a.target_inbound})")
        if r['single_anchor']: flags.append('SINGLE ANCHOR')
        if len(new) >= 2 and not r['siblings_linking_in']: flags.append('no sibling links')
        if flags: problems += 1
        print(f"{n:40s} {r['inbound']:>3} {r['distinct_anchors']:>7}  {', '.join(flags) or 'ok'}")

    for n in new:
        opp = report['new_pages'][n]['unlinked_mentions']
        if opp:
            print(f"\n  /{n}/ — pages that discuss it and do NOT link it:")
            for o in opp:
                print(f"      {o['mentions']:>3} mentions   {o['page']}")

    print(f"\n{problems}/{len(new)} pages with findings")
    return 1 if problems else 0

if __name__ == '__main__':
    sys.exit(main())
