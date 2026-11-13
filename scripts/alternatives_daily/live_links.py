#!/usr/bin/env python3
"""Live publication check for one alternatives page (portable, stdlib only).

Fetches the live URL and fails unless:
  - it returns HTTP 200,
  - every external <a href> on the rendered page points at an allowed host
    (the page subject's official site; the site's own hosts are internal),
  - each --require text is present (e.g. both vendor CTAs and the H1).

Usage:
  python3 scripts/alternatives_daily/live_links.py URL --allow www.voiceflow.com \
      [--allow voiceflow.com] [--internal www.example.com] [--require "Update your listing"]...
Exit 0 = pass. Prints a JSON report either way.
"""
import argparse
import json
import sys
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href')
            if href:
                self.hrefs.append(href)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('url')
    parser.add_argument('--allow', action='append', default=[], help='allowed external host (subject product)')
    parser.add_argument('--internal', action='append', default=[], help='extra internal host (default: the URL host and its www/apex twin)')
    parser.add_argument('--require', action='append', default=[], help='text that must appear in the HTML')
    args = parser.parse_args()

    request = urllib.request.Request(args.url, headers={'User-Agent': 'alternatives-live-check/1.0'})
    with urllib.request.urlopen(request, timeout=60) as response:
        status = response.status
        html = response.read().decode('utf-8', 'replace')

    own = (urlsplit(args.url).hostname or '').lower()
    internal = {own, own.removeprefix('www.'), 'www.' + own.removeprefix('www.')} | {h.lower() for h in args.internal}
    allowed = {h.lower() for h in args.allow}
    parser_ = Links()
    parser_.feed(html)
    external, forbidden = set(), set()
    for href in parser_.hrefs:
        target = urlsplit(urljoin(args.url, href))
        if target.scheme not in ('http', 'https'):
            continue
        host = (target.hostname or '').lower()
        if host in internal:
            continue
        external.add(host)
        if host not in allowed:
            forbidden.add(host)
    missing = [text for text in args.require if text not in html]
    report = {'url': args.url, 'status': status, 'externalHosts': sorted(external),
              'forbiddenHosts': sorted(forbidden), 'missingText': missing,
              'pass': status == 200 and not forbidden and not missing}
    print(json.dumps(report, indent=2))
    sys.exit(0 if report['pass'] else 1)


if __name__ == '__main__':
    main()
