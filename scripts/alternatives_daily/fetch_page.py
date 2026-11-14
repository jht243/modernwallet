#!/usr/bin/env python3
"""Read a vendor's own page as visible text, for price checks (portable).

Tries a plain request with a browser user agent first. If that fails (403/404/timeout)
or returns a JavaScript shell with almost no text, it renders the page in headless
Chromium via Playwright (when installed) and returns the rendered text.

Usage:
  python3 scripts/alternatives_daily/fetch_page.py URL [--grep WORD]... [--max 20000]
Prints a JSON header line ({"url", "method", "status", "chars"}) then the page text
(or only the lines matching --grep). Exit 0 = text found, 1 = nothing readable.
"""
import argparse
import html
import json
import re
import sys
import urllib.request

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
MIN_TEXT = 800  # fewer visible characters than this = treat as a JS shell


def visible_text(markup):
    markup = re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>', ' ', markup)
    markup = re.sub(r'(?s)<[^>]+>', '\n', markup)
    lines = [re.sub(r'\s+', ' ', html.unescape(x)).strip() for x in markup.split('\n')]
    return '\n'.join(x for x in lines if x)


def plain(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, visible_text(resp.read().decode('utf-8', 'replace'))


NODE_JS = r"""
const {chromium} = require('playwright');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({userAgent: process.env.UA, locale: 'en-US'});
  const p = await c.newPage();
  const r = await p.goto(process.argv[2], {waitUntil: 'domcontentloaded', timeout: 45000});
  try { await p.waitForLoadState('networkidle', {timeout: 15000}); } catch (e) {}
  const t = await p.innerText('body');
  process.stdout.write(JSON.stringify({status: r ? r.status() : 0, text: t}));
  await b.close();
})().catch(e => { process.stderr.write(String(e)); process.exit(1); });
"""


def node_browser(url):
    """Node Playwright fallback (cloud images often ship it without the Python package)."""
    import os
    import subprocess
    import tempfile
    root = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True, timeout=30).stdout.strip()
    env = dict(os.environ, UA=UA, NODE_PATH=os.pathsep.join(x for x in (root, os.environ.get('NODE_PATH', '')) if x))
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(NODE_JS)
    try:
        out = subprocess.run(['node', f.name, url], capture_output=True, text=True, timeout=120, env=env)
    finally:
        os.unlink(f.name)
    if out.returncode != 0:
        raise RuntimeError(out.stderr.strip()[:300] or 'node playwright failed')
    data = json.loads(out.stdout)
    return data['status'], data['text']


def browser(url):
    try:
        from playwright.sync_api import sync_playwright  # noqa: import only when needed
    except ImportError:
        return node_browser(url)
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(user_agent=UA, locale='en-US')
        resp = page.goto(url, wait_until='domcontentloaded', timeout=45000)
        try:
            page.wait_for_load_state('networkidle', timeout=15000)
        except Exception:
            pass
        text = page.inner_text('body')
        status = resp.status if resp else 0
        b.close()
    return status, text


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('url')
    ap.add_argument('--grep', action='append', default=[], help='only print lines containing this (case-insensitive)')
    ap.add_argument('--max', type=int, default=20000)
    a = ap.parse_args()
    method, status, text, errors = 'plain', 0, '', []
    try:
        status, text = plain(a.url)
    except Exception as e:  # 403, 404, timeouts
        errors.append('plain: %s' % e)
    if len(text) < MIN_TEXT or status >= 400:
        try:
            status, text = browser(a.url)
            method = 'browser'
        except Exception as e:
            errors.append('browser: %s' % e)
    if a.grep:
        keys = [g.lower() for g in a.grep]
        text = '\n'.join(l for l in text.split('\n') if any(k in l.lower() for k in keys))
    ok = bool(text.strip()) and status < 400
    print(json.dumps({'url': a.url, 'method': method, 'status': status, 'chars': len(text), 'errors': errors}))
    print(text[:a.max])
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
