#!/usr/bin/env python3
"""Build gate for ModernWallet "<Product> Alternatives" pages (owner rules 2026-11-13). Stdlib only.

Checks the content file + registry, then (unless --data-only) the built HTML in dist/:
  data   src/data/alternatives.json  <->  data/alternatives-pages.json
         - every page has exactly one registry row and every row has a page
         - title and H1 start "<Product> Alternatives"; no "tested"/testing claim anywhere
         - subject row + 5-8 alternatives; 3-5 FAQs; meta description <= 160 chars
         - every external link in the content points at a registry officialHost
  dist   dist/alternatives/<slug>/index.html
         - <title>/<h1> rule, canonical on the www host
         - every external <a> host is an officialHost (footer, header and body)
         - no Mediavine ad script, no rel="sponsored", no entity auto-links
         - "Update your listing" directly under the table; "Want to be added to this
           alternatives page?" band at the end of the second section; the two never adjacent
         - FAQPage JSON-LD; sitemap entry; search-index entry; /compare/ hub card

Usage:
  python3 scripts/alternatives_daily/check_built.py                 # data + dist (run after npm run build)
  python3 scripts/alternatives_daily/check_built.py --data-only     # before building
Exit 0 = pass. Prints a JSON report.
"""
import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

SITE = 'https://www.themodernwallet.com'
INTERNAL = {'www.themodernwallet.com', 'themodernwallet.com'}
CONTENT = Path('src/data/alternatives.json')
REGISTRY = Path('data/alternatives-pages.json')
UPDATE_TEXT = 'Update your listing'
ADD_TEXT = 'Want to be added to this alternatives page?'
TESTED_RE = re.compile(r'\btest(ed|ing)\b|\bhands-on\b|\bwe tried\b', re.I)
MD_LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)\s]+)\)')
SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs, self.rels, self.title, self.h1 = [], [], '', ''
        self._in = None
        self.canonical = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'a' and a.get('href'):
            self.hrefs.append(a['href'])
            self.rels.append((a.get('rel') or '').lower())
        if tag == 'link' and (a.get('rel') or '').lower() == 'canonical':
            self.canonical = a.get('href')
        if tag in ('title', 'h1'):
            self._in = tag

    def handle_endtag(self, tag):
        if tag == self._in:
            self._in = None

    def handle_data(self, data):
        if self._in == 'title':
            self.title += data
        elif self._in == 'h1':
            self.h1 += data


def texts(page):
    """Every reader-facing string in a content entry."""
    out = [page.get(k, '') for k in ('title', 'h1', 'metaDescription', 'intro', 'tableTitle', 'tableNote', 'verdict')]
    for row in page.get('rows', []):
        out += [row.get('product', ''), row.get('pricing', ''), row.get('bestFit', '')]
    for sec in [page.get('chooseSection') or {}, page.get('stillBetterFit') or {}] + list(page.get('alternatives', [])):
        out += [sec.get('heading', ''), sec.get('body', '')]
    for faq in page.get('faqs', []):
        out += [faq.get('question', ''), faq.get('answer', '')]
    return [t for t in out if t]


def check_data(pages, rows, errors, warnings):
    by_route = {}
    for r in rows:
        route = r.get('route', '')
        if route in by_route:
            errors.append(f'registry: duplicate route {route}')
        by_route[route] = r
        if not r.get('officialHosts'):
            errors.append(f'registry {route}: officialHosts is empty')
        if not r.get('vendorHost'):
            errors.append(f'registry {route}: vendorHost is empty')
    slugs = set()
    for p in pages:
        slug = p.get('slug', '')
        where = f'page {slug or "?"}'
        if not SLUG_RE.match(slug):
            errors.append(f'{where}: bad slug')
        if slug in slugs:
            errors.append(f'{where}: duplicate slug')
        slugs.add(slug)
        route = f'/alternatives/{slug}/'
        reg = by_route.get(route)
        if not reg:
            errors.append(f'{where}: no registry row for {route} (the page will not render)')
            continue
        hosts = {h.lower() for h in reg.get('officialHosts', [])}
        product = p.get('product', '').strip()
        prefix = f'{product} Alternatives'
        for key in ('title', 'h1'):
            if not p.get(key, '').startswith(prefix):
                errors.append(f'{where}: {key} must start "{prefix}"')
        if len(p.get('title', '')) > 60:
            warnings.append(f'{where}: title is {len(p["title"])} chars (site standard <= 60)')
        if not 50 <= len(p.get('metaDescription', '')) <= 160:
            errors.append(f'{where}: metaDescription must be 50-160 chars')
        official = urlsplit(p.get('officialUrl', ''))
        if official.scheme != 'https' or (official.hostname or '').lower() not in hosts:
            errors.append(f'{where}: officialUrl must be https on an officialHost')
        if official.hostname and reg.get('vendorHost') and not (official.hostname.lower() == reg['vendorHost'].lower()
                                                                or official.hostname.lower().endswith('.' + reg['vendorHost'].lower())):
            errors.append(f'{where}: officialUrl host does not match vendorHost {reg["vendorHost"]}')
        for key in ('published',) + (('updated',) if p.get('updated') else ()):
            if not DATE_RE.match(p.get(key, '')):
                errors.append(f'{where}: {key} must be yyyy-mm-dd')
        table = p.get('rows', [])
        if sum(1 for r in table if r.get('subject')) != 1:
            errors.append(f'{where}: exactly one table row must have "subject": true')
        if not 6 <= len(table) <= 9:
            errors.append(f'{where}: table needs the subject + 5-8 alternatives (has {len(table)} rows)')
        for r in table:
            if not all(r.get(k, '').strip() for k in ('product', 'pricing', 'bestFit')):
                errors.append(f'{where}: table row {r.get("product", "?")} has an empty cell')
        if not p.get('alternatives'):
            errors.append(f'{where}: one section per alternative is required')
        for key in ('intro', 'tableTitle', 'verdict'):
            if not p.get(key, '').strip():
                errors.append(f'{where}: {key} is empty')
        for key in ('chooseSection', 'stillBetterFit'):
            if not (p.get(key) or {}).get('body', '').strip():
                errors.append(f'{where}: {key}.body is empty')
        if not (p.get('chooseSection') or {}).get('heading', '').strip():
            errors.append(f'{where}: chooseSection.heading is empty')
        if not 3 <= len(p.get('faqs', [])) <= 5:
            errors.append(f'{where}: 3-5 FAQs required')
        for t in texts(p):
            if TESTED_RE.search(t):
                errors.append(f'{where}: testing claim/wording not allowed: {TESTED_RE.search(t).group(0)!r}')
            for _text, url in MD_LINK_RE.findall(t):
                if url.startswith('/') and not url.startswith('//'):
                    continue
                host = (urlsplit(url).hostname or '').lower()
                if urlsplit(url).scheme != 'https' or host not in hosts:
                    errors.append(f'{where}: external link {url} is not on an officialHost')
            if re.search(r'<a\s', t, re.I):
                errors.append(f'{where}: raw <a> tags are not allowed; use [text](url)')
        for rel in p.get('related', []) or []:
            if not str(rel.get('href', '')).startswith('/'):
                errors.append(f'{where}: related links must be internal')
    for route in by_route:
        m = re.fullmatch(r'/alternatives/([a-z0-9-]+)/', route)
        if not m:
            errors.append(f'registry: route {route} must be /alternatives/<slug>/')
        elif m.group(1) not in slugs:
            errors.append(f'registry: {route} has no content entry')
    return by_route


def check_dist(pages, by_route, dist, errors):
    sitemap = ''.join(p.read_text() for p in dist.glob('sitemap-*.xml') if p.name != 'sitemap-index.xml')
    index_file = dist / 'search-index.json'
    search = {e.get('u') for e in json.loads(index_file.read_text())} if index_file.exists() else set()
    hub = (dist / 'compare' / 'index.html').read_text() if (dist / 'compare' / 'index.html').exists() else ''
    for p in pages:
        slug = p.get('slug', '')
        route = f'/alternatives/{slug}/'
        reg = by_route.get(route)
        if not reg:
            continue
        where = f'dist {route}'
        f = dist / 'alternatives' / slug / 'index.html'
        if not f.exists():
            errors.append(f'{where}: not built')
            continue
        html = f.read_text()
        doc = Page()
        doc.feed(html)
        prefix = f'{p["product"]} Alternatives'
        if not doc.title.strip().startswith(prefix):
            errors.append(f'{where}: <title> does not start "{prefix}"')
        if not doc.h1.strip().startswith(prefix):
            errors.append(f'{where}: <h1> does not start "{prefix}"')
        if doc.canonical != SITE + route:
            errors.append(f'{where}: canonical is {doc.canonical}, expected {SITE + route}')
        allowed = {h.lower() for h in reg['officialHosts']}
        for href in doc.hrefs:
            target = urlsplit(urljoin(SITE + route, href))
            if target.scheme not in ('http', 'https'):
                continue
            host = (target.hostname or '').lower()
            if host not in INTERNAL and host not in allowed:
                errors.append(f'{where}: external link to {host} ({href})')
        if any('sponsored' in r for r in doc.rels):
            errors.append(f'{where}: rel="sponsored" link present')
        if 'scriptwrapper.com' in html:
            errors.append(f'{where}: Mediavine ad script present')
        if 'data-entity-link' in html.replace('data-no-entity-link', ''):
            errors.append(f'{where}: entity auto-link present')
        i_table = html.find('</table>')
        i_update = html.find(UPDATE_TEXT)
        i_choose = html.find('id="choose"')
        i_add = html.find(ADD_TEXT)
        if min(i_table, i_update, i_choose, i_add) < 0:
            errors.append(f'{where}: table, "{UPDATE_TEXT}", second section or "{ADD_TEXT}" missing')
        else:
            between_table_update = html[i_table:i_update]
            if '<section' in between_table_update or '<h2' in between_table_update or '<p' in between_table_update.replace('<p class="alt-update"', ''):
                errors.append(f'{where}: "{UPDATE_TEXT}" is not directly under the table')
            if not i_update < i_choose < i_add:
                errors.append(f'{where}: CTA order wrong (update line, then second section, then add band)')
            gap = html[i_update:i_add]
            body = html[i_choose:i_add]
            if '<h2' not in gap or not re.search(r'<(p|ul)\b', body) or len(re.sub(r'<[^>]+>', '', body)) < 80:
                errors.append(f'{where}: the two vendor CTAs are adjacent')
            rest = html[i_add:]
            if rest.find('</section>') < 0 or ('<h2' in rest[:rest.find('</section>')]):
                errors.append(f'{where}: "{ADD_TEXT}" band is not at the end of the second section')
            for text, target in ((UPDATE_TEXT, '/update-listing/'), ('Contact us', '/sponsor/')):
                if not re.search(r'<a rel="nofollow" href="' + re.escape(target) + r'\?from=[^"]*"[^>]*>' + re.escape(text), html):
                    errors.append(f'{where}: "{text}" does not link {target}')
        if '"@type":"FAQPage"' not in html:
            errors.append(f'{where}: FAQPage JSON-LD missing')
        if f'<loc>{SITE}{route}</loc>' not in sitemap:
            errors.append(f'{where}: not in the sitemap')
        if route.rstrip('/') not in search:
            errors.append(f'{where}: not in public/search-index.json')
        if f'href="{route}"' not in hub:
            errors.append(f'{where}: no card on /compare/')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--dist', default='dist')
    ap.add_argument('--data-only', action='store_true')
    args = ap.parse_args()
    errors, warnings = [], []
    pages = json.loads(CONTENT.read_text())
    rows = json.loads(REGISTRY.read_text()).get('pages', [])
    by_route = check_data(pages, rows, errors, warnings)
    if not args.data_only:
        dist = Path(args.dist)
        if not dist.is_dir():
            errors.append(f'{dist} not found: run npm run build first')
        else:
            check_dist(pages, by_route, dist, errors)
    report = {'pages': len(pages), 'registry': len(rows), 'errors': errors, 'warnings': warnings,
              'pass': not errors}
    print(json.dumps(report, indent=2))
    sys.exit(0 if not errors else 1)


if __name__ == '__main__':
    main()
