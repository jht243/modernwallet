#!/usr/bin/env python3
"""Read a vendor's own page as visible text, for price checks (portable).

Tries a plain HTTP request first (curl with system CA/proxy, then urllib). If the
page returns a genuine client-rendered JavaScript shell with almost no text (and
not an anti-bot challenge), renders the page in headless Chromium via Playwright
(when installed) honoring container proxy settings and returns the rendered text.

Never solves, waits out, or bypasses CAPTCHAs, proof-of-work gates, or anti-bot
challenges: if an anti-bot challenge is detected, exits 1 immediately with
"anti_bot_gate": true in the JSON header.

Usage:
  python3 scripts/alternatives_daily/fetch_page.py URL [--grep WORD]... [--max 20000]
Prints a JSON header line ({"url", "method", "status", "chars", ...}) then the page text
(or lines matching --grep, falling back to a short preview when the page is readable
but 0 lines matched --grep). Exit 0 = readable page text found, 1 = unreadable.
"""
import argparse
import html
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
MIN_TEXT = 800  # fewer visible characters than this = treat as a JS shell

BOT_GATE_PATTERNS = (
    re.compile(r"making sure you['\u2019]?re not a bot", re.I),
    re.compile(r'anubis could not load its javascript', re.I),
    re.compile(r'please wait while your request is being verified', re.I),
    re.compile(r'verify you are human', re.I),
    re.compile(r'attention required!\s*\|\s*cloudflare', re.I),
    re.compile(r'just a moment\.\.\.\s*enable javascript and cookies to continue', re.I),
)


def visible_text(markup):
    markup = re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>', ' ', markup)
    markup = re.sub(r'(?s)<[^>]+>', '\n', markup)
    lines = [re.sub(r'\s+', ' ', html.unescape(x)).strip() for x in markup.split('\n')]
    return '\n'.join(x for x in lines if x)


def is_bot_gate(text):
    if not text or len(text) > 4000:
        return False
    return any(p.search(text) for p in BOT_GATE_PATTERNS)


def _ssl_context():
    for env_key in ('SSL_CERT_FILE', 'CURL_CA_BUNDLE', 'REQUESTS_CA_BUNDLE'):
        cafile = os.environ.get(env_key, '').strip()
        if cafile and os.path.isfile(cafile):
            return ssl.create_default_context(cafile=cafile)
    return ssl.create_default_context()


def _curl_plain(url):
    curl_bin = shutil.which('curl')
    if not curl_bin:
        raise RuntimeError('curl not installed')
    marker = '__FETCH_PAGE_HTTP_STATUS__:'
    cmd = [
        curl_bin, '-sSL', '--compressed', '--max-time', '30',
        '-A', UA,
        '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        '-H', 'Accept-Language: en-US,en;q=0.9',
        '-w', f'\n{marker}%{{http_code}}',
        url,
    ]
    out = subprocess.run(cmd, capture_output=True, text=True, errors='replace', timeout=35)
    body = out.stdout or ''
    status = 0
    if marker in body:
        body, tail = body.rsplit(marker, 1)
        try:
            status = int(tail.strip().splitlines()[0])
        except (ValueError, IndexError):
            status = 0
    if out.returncode != 0 and status == 0:
        raise RuntimeError(out.stderr.strip()[:240] or f'curl exit {out.returncode}')
    return status, visible_text(body)


def _urllib_plain(url):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': UA,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        },
    )
    with urllib.request.urlopen(req, timeout=30, context=_ssl_context()) as resp:
        return resp.status, visible_text(resp.read().decode('utf-8', 'replace'))


def plain(url):
    curl_err = None
    try:
        status, text = _curl_plain(url)
        if status > 0:
            return status, text
    except Exception as e:
        curl_err = e
    try:
        return _urllib_plain(url)
    except Exception as e:
        if curl_err is not None:
            raise RuntimeError(f'curl ({curl_err}); urllib ({e})') from e
        raise


def _playwright_proxy_from_env(env=None):
    env = os.environ if env is None else env
    raw = (
        env.get('HTTPS_PROXY')
        or env.get('https_proxy')
        or env.get('HTTP_PROXY')
        or env.get('http_proxy')
        or ''
    ).strip()
    if not raw:
        return None
    if '://' not in raw:
        raw = 'http://' + raw
    parsed = urllib.parse.urlsplit(raw)
    if not parsed.hostname:
        return None
    server = f'{parsed.scheme or "http"}://{parsed.hostname}'
    if parsed.port:
        server += f':{parsed.port}'
    proxy = {'server': server}
    if parsed.username:
        proxy['username'] = urllib.parse.unquote(parsed.username)
    if parsed.password:
        proxy['password'] = urllib.parse.unquote(parsed.password)
    return proxy


NODE_JS = r"""
const {chromium} = require('playwright');
(async () => {
  const launchOpts = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  };
  if (process.env.PW_PROXY_JSON) {
    launchOpts.proxy = JSON.parse(process.env.PW_PROXY_JSON);
  }
  const b = await chromium.launch(launchOpts);
  const c = await b.newContext({
    userAgent: process.env.UA,
    locale: 'en-US',
    ignoreHTTPSErrors: Boolean(process.env.PW_PROXY_JSON)
  });
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
    npm_root = ''
    try:
        npm_root = subprocess.run(
            ['npm', 'root', '-g'], capture_output=True, text=True, timeout=15
        ).stdout.strip()
    except Exception:
        pass
    candidates = [
        npm_root,
        '/usr/lib/node_modules',
        '/usr/local/lib/node_modules',
        '/opt/node_modules',
        os.environ.get('NODE_PATH', ''),
    ]
    node_path = os.pathsep.join(x for x in candidates if x)
    proxy = _playwright_proxy_from_env()
    env = dict(os.environ, UA=UA, NODE_PATH=node_path)
    if proxy:
        env['PW_PROXY_JSON'] = json.dumps(proxy)
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(NODE_JS)
    try:
        out = subprocess.run(['node', f.name, url], capture_output=True, text=True, timeout=90, env=env)
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
    proxy = _playwright_proxy_from_env()
    launch_kwargs = {
        'headless': True,
        'args': ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    }
    if proxy:
        launch_kwargs['proxy'] = proxy
    with sync_playwright() as p:
        b = p.chromium.launch(**launch_kwargs)
        page = b.new_page(
            user_agent=UA,
            locale='en-US',
            ignore_https_errors=bool(proxy),
        )
        resp = page.goto(url, wait_until='domcontentloaded', timeout=45000)
        try:
            page.wait_for_load_state('networkidle', timeout=15000)
        except Exception:
            pass
        text = page.inner_text('body')
        status = resp.status if resp else 0
        b.close()
    return status, text


def fetch_readable(url):
    method, status, raw_text, errors = 'plain', 0, '', []
    bot_gated = False
    try:
        status, raw_text = plain(url)
        if is_bot_gate(raw_text):
            bot_gated = True
            errors.append('plain: anti_bot_gate')
            raw_text = ''
    except Exception as e:
        errors.append('plain: %s' % e)
    # Only render genuine JS shells in headless browser; never attempt to solve/wait out bot gates.
    if not bot_gated and status != 404 and (len(raw_text) < MIN_TEXT or status == 0 or status >= 400):
        try:
            b_status, b_text = browser(url)
            if is_bot_gate(b_text):
                bot_gated = True
                errors.append('browser: anti_bot_gate')
            elif b_text and (len(b_text) > len(raw_text) or status >= 400 or status == 0):
                status, raw_text = b_status, b_text
                method = 'browser'
        except Exception as e:
            errors.append('browser: %s' % e)
    return {
        'method': method,
        'status': status,
        'raw_text': raw_text,
        'errors': errors,
        'anti_bot_gate': bot_gated,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('url')
    ap.add_argument('--grep', action='append', default=[], help='only print lines containing this (case-insensitive)')
    ap.add_argument('--max', type=int, default=20000)
    a = ap.parse_args()

    res = fetch_readable(a.url)
    raw_text = res['raw_text']
    status = res['status']
    bot_gated = res['anti_bot_gate']
    ok = bool(raw_text.strip()) and not bot_gated and 0 < status < 400

    out_text = raw_text
    grep_matches = None
    if a.grep and raw_text:
        keys = [g.lower() for g in a.grep]
        matched_lines = [l for l in raw_text.split('\n') if any(k in l.lower() for k in keys)]
        grep_matches = len(matched_lines)
        if matched_lines:
            out_text = '\n'.join(matched_lines)
        else:
            out_text = '[no lines matched --grep; showing page preview]\n' + raw_text[:min(a.max, 2000)]

    header = {
        'url': a.url,
        'method': res['method'],
        'status': status,
        'chars': len(raw_text),
        'errors': res['errors'],
    }
    if bot_gated:
        header['anti_bot_gate'] = True
    if grep_matches is not None:
        header['grep_matches'] = grep_matches

    print(json.dumps(header))
    if ok:
        print(out_text[:a.max])
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
