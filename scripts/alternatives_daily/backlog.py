#!/usr/bin/env python3
"""Cloud-durable backlog for the daily alternatives routine (portable, stdlib only).

State is one JSON file committed to the repository (default
reports/alternatives-daily/backlog.json), so every cloud run sees the same
backlog through git. Owner rules (2026-11-13): at most 3 pages per
America/Bogota day, discovery of up to 60 new vendors only when nothing
eligible is left, exactly one content audit per page (recorded once, never
replaced), and a page is "published" only with its verified live URL.

Commands:
  status                         counts, today's claims, rows to resume
  next   [--max 3]               rows this run should work on (resume first)
  claim  --ids a,b,c             reserve today's slots (moves rows to in_progress)
  set    --id X --status S --note "why" [--field k=<json>]...
  audit  --id X --file audit.json    record the ONE audit (refused if one exists)
  add    --file new.json [--status eligible|pending]   discovery / intake
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import datetime as dt
import html
import json
import os
import re
import shutil
import socket
import ssl
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

DEFAULT = Path('reports/alternatives-daily/backlog.json')
STATUSES = {'pending', 'eligible', 'in_progress', 'published', 'held', 'excluded', 'duplicate', 'quarantined'}
TERMINAL = {'published', 'excluded', 'duplicate'}
DAILY_CAP = 3
DISCOVERY_MAX = 60
MAX_RESUME_ATTEMPTS = 2  # 1 initial claim + max 1 resume; stuck vendors auto-quarantine so siblings flow

_PRECHECK_UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
_BOT_GATE_RE = re.compile(
    r"making sure you['\u2019]?re not a bot|anubis could not load|please wait while your request is being verified|"
    r"verify you are human|attention required!\s*\|\s*cloudflare|just a moment\.\.\.\s*enable javascript",
    re.I,
)


def _visible_chars(markup: str) -> str:
    markup = re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>', ' ', markup)
    markup = re.sub(r'(?s)<[^>]+>', ' ', markup)
    return re.sub(r'\s+', ' ', html.unescape(markup)).strip()


def probe_vendor_url(url: str, timeout: int = 12) -> dict:
    """$0 pure-Python vendor reachability precheck (never bypasses CAPTCHAs/anti-bot gates)."""
    if not url or not url.startswith(('http://', 'https://')):
        return {'ok': False, 'disposition': 'held', 'reason': 'missing_url'}
    sp = urlsplit(url)
    origin = f'{sp.scheme}://{sp.netloc}'
    candidates = [url]
    if sp.path and sp.path not in ('/', ''):
        for alt in (f'{origin}/pricing', f'{origin}/'):
            if alt not in candidates:
                candidates.append(alt)

    last_code = 0
    saw_codes = []
    dns_dead = False
    bot_gated = False
    js_shell = False

    for target in candidates:
        code, body, hdrs = 0, '', {}
        req = urllib.request.Request(
            target,
            headers={
                'User-Agent': _PRECHECK_UA,
                'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        )
        try:
            ctx = ssl.create_default_context()
            with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
                code = resp.status
                hdrs = {k.lower(): v for k, v in resp.headers.items()}
                body = resp.read(262144).decode('utf-8', 'replace')
        except urllib.error.HTTPError as e:
            code = e.code
            hdrs = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
            try:
                body = e.read(65536).decode('utf-8', 'replace') if e.fp else ''
            except Exception:
                body = ''
        except urllib.error.URLError as e:
            if isinstance(getattr(e, 'reason', None), socket.gaierror):
                dns_dead = True
        except Exception:
            pass

        # Fallback to curl if urllib hit TLS/HTTP2 quirk (unless DNS NXDOMAIN)
        if code not in (200,) and not dns_dead and shutil.which('curl'):
            marker = '__PRECHECK_CODE__:'
            proc = subprocess.run(
                ['curl', '-sSL', '--compressed', '--max-time', str(timeout), '-A', _PRECHECK_UA,
                 '-w', f'\n{marker}%{{http_code}}', target],
                capture_output=True, text=True, errors='replace', timeout=timeout + 4, check=False,
            )
            if proc.returncode == 6:
                dns_dead = True
            elif marker in (proc.stdout or ''):
                raw_b, tail = proc.stdout.rsplit(marker, 1)
                try:
                    c_code = int(tail.strip().splitlines()[0])
                    if c_code:
                        code, body = c_code, raw_b[:262144]
                except (ValueError, IndexError):
                    pass

        if code:
            last_code = code
            saw_codes.append(code)
        vis = _visible_chars(body)
        if hdrs.get('cf-mitigated', '').lower() == 'challenge' or (len(vis) < 4000 and _BOT_GATE_RE.search(vis)):
            bot_gated = True
            continue
        if code == 200 and len(vis) >= 120:
            return {'ok': True, 'status': 200, 'checkedUrl': target, 'chars': len(vis), 'reason': 'readable'}
        if code == 200 and len(vis) < 120:
            js_shell = True

    if dns_dead and not saw_codes:
        return {'ok': False, 'disposition': 'excluded', 'status': 0, 'reason': 'dns_nxdomain'}
    if bot_gated:
        return {'ok': False, 'disposition': 'excluded', 'status': last_code, 'reason': 'anti_bot_gate'}
    if saw_codes and all(c in (404, 410) for c in saw_codes):
        return {'ok': False, 'disposition': 'excluded', 'status': last_code, 'reason': f'http_{last_code}_all_fallbacks'}
    if js_shell:
        return {'ok': False, 'disposition': 'held', 'status': 200, 'reason': 'unrendered_js_shell'}
    primary_code = saw_codes[0] if saw_codes else 0
    return {'ok': False, 'disposition': 'held', 'status': primary_code, 'reason': f'http_{primary_code or "timeout"}'}


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def today():
    return dt.datetime.now(ZoneInfo('America/Bogota')).date().isoformat()


def fail(message):
    print('ERROR: ' + message, file=sys.stderr)
    sys.exit(2)


def norm(text):
    return re.sub(r'[^a-z0-9]+', ' ', (text or '').casefold()).strip()


def identity(row):
    """One switching intent per official product URL (host + path)."""
    url = urlsplit(row.get('officialUrl') or '')
    if url.scheme != 'https' or not url.hostname:
        return None
    return (url.hostname.lower().removeprefix('www.') + url.path.rstrip('/')).casefold()


def load(path):
    if not path.exists():
        return {'version': 1, 'timezone': 'America/Bogota', 'dailyCap': DAILY_CAP, 'rows': []}
    return json.loads(path.read_text())


def save(path, state):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.tmp')
    tmp.write_text(json.dumps(state, indent=2, ensure_ascii=False) + '\n')
    tmp.replace(path)


def find(state, key):
    for row in state['rows']:
        if row['id'] == key:
            return row
    fail('unknown row ' + key)


def log(row, status, note, **extra):
    row.setdefault('history', []).append({'at': now(), 'status': status, 'note': note, **extra})
    row['status'] = status
    row['updatedAt'] = now()


def _write_quarantine_ticket(row, reason):
    q_dir = Path('reports/quarantine/alternatives-daily')
    q_dir.mkdir(parents=True, exist_ok=True)
    safe_id = re.sub(r'[^a-zA-Z0-9._-]+', '-', str(row.get('id') or 'item')).strip('-').lower() or 'item'
    ticket = {
        'version': 1,
        'status': 'quarantined',
        'skill': 'alternatives-daily',
        'site': '',
        'itemId': row['id'],
        'attempts': int(row.get('attempts') or 1),
        'maxRetries': 1,
        'reason': reason,
        'error': ((row.get('history') or [{}])[-1].get('note') or ''),
        'routes': [row['liveUrl']] if row.get('liveUrl') else [],
        'createdAt': now(),
        'updatedAt': now(),
        'details': {'vendor': row.get('vendor'), 'product': row.get('product'), 'targetQuery': row.get('targetQuery')},
    }
    p = q_dir / f'{safe_id}.json'
    tmp = p.with_suffix('.tmp')
    tmp.write_text(json.dumps(ticket, indent=2, sort_keys=True, ensure_ascii=False) + '\n')
    tmp.replace(p)
    return str(p)


def claimed_today(state):
    # A page held, excluded, or quarantined after claiming frees its slot: the cap is 3 pages
    # actually produced per day, so the run can claim a replacement immediately.
    return [r for r in state['rows'] if r.get('claimedOn') == today()
            and r['status'] not in ('held', 'excluded', 'duplicate', 'quarantined')]


def upgrade_queue(state):
    """Published rows not yet brought to the full SEO standard (step 7b), oldest first."""
    rows = [r for r in state['rows'] if r['status'] == 'published' and not r.get('seoUpgraded')]
    return [r['id'] for r in sorted(rows, key=lambda r: r.get('claimedOn') or r.get('createdAt') or '')]


WRITER_NOTE = (
    'OWNER RULE (2026-11-14, supersedes the 2026-11-13 trigger-prompt "no external writing API" sentence): '
    'run python3 scripts/lib/content_gen.py preflight first (content_gen.py self-bootstraps the site\'s '
    'Claude -> OpenAI -> Gemini waterfall keys automatically in cloud via fleet guard / Render relay) and '
    'generate ALL page prose via content_gen.py (--field writer=\'"content_gen"\'). ONLY if content_gen.py '
    'exits non-zero across all providers (preflight.log saved), fall back to in-session writing '
    '(--field writer=\'"in_context_fallback"\') rather than blocking the run. Pin every Step 4 / Step 7b '
    'audit subagent to model: "sonnet" (never opus). '
    'UNREADABLE VENDOR SCAN-THROUGH RULE: test each candidate\'s officialUrl with fetch_page.py; if fetch_page.py '
    'exits non-zero WITHOUT anti_bot_gate=true, try built-in WebFetch on officialUrl (and /pricing or /) before '
    'declaring it unreadable (never solve or bypass CAPTCHAs or anti_bot_gate=true). If a subject vendor\'s official '
    'site is still unreadable (403/404/JS-shell/anti_bot_gate) or defunct, IMMEDIATELY persist `backlog.py set --id <id> '
    '--status held --note "official site unreadable (<reason>)"` (or `excluded` if defunct/anti_bot_gate) — which frees '
    'its daily slot — and keep scanning `new` and `pendingCandidates` until `slotsLeftToday` readable vendors are claimed '
    'and published. NEVER abort with 0 pages while untested eligible or pending rows remain. '
    'RETRY & QUARANTINE RULE: if one vendor hits an unrecoverable gate/deploy blocker, quarantine ONLY that vendor '
    '(`backlog.py set --id <id> --status quarantined --note "<why>"`), ship all passing sibling vendors in the same run, '
    'and report `--status failure` naming the quarantined vendor so the Failure-Fixer AI picks it up.'
)


def cmd_status(state, _):
    counts = {}
    for row in state['rows']:
        counts[row['status']] = counts.get(row['status'], 0) + 1
    return {'day': today(), 'counts': counts, 'claimedToday': [r['id'] for r in claimed_today(state)],
            'resume': [r['id'] for r in state['rows'] if r['status'] == 'in_progress'],
            'quarantined': [r['id'] for r in state['rows'] if r['status'] == 'quarantined'],
            'eligible': sum(r['status'] == 'eligible' for r in state['rows']),
            'pending': sum(r['status'] == 'pending' for r in state['rows']),
            'upgradePending': upgrade_queue(state),
            'writerNote': WRITER_NOTE}


def cmd_next(state, args):
    auto_quarantined = []
    now_dt = dt.datetime.now(dt.timezone.utc)
    for r in list(state['rows']):
        if r['status'] != 'in_progress':
            continue
        attempts = int(r.get('attempts') or 1)
        last_seen_raw = r.get('lastNextAt') or r.get('updatedAt') or ''
        new_session = True
        if last_seen_raw:
            try:
                last_dt = dt.datetime.fromisoformat(last_seen_raw.replace('Z', '+00:00'))
                if last_dt.tzinfo is None:
                    last_dt = last_dt.replace(tzinfo=dt.timezone.utc)
                new_session = (now_dt - last_dt).total_seconds() >= 2700
            except ValueError:
                new_session = True
        if new_session:
            if attempts >= MAX_RESUME_ATTEMPTS:
                reason = f'Auto-quarantined after {attempts} unfinished attempts (max 1 resume); sidelined so new vendors flow.'
                t_path = _write_quarantine_ticket(r, reason)
                log(r, 'quarantined', reason, ticketPath=t_path)
                auto_quarantined.append({'id': r['id'], 'ticketPath': t_path})
                state['_dirty'] = True
                continue
            r['attempts'] = attempts + 1
            r['lastNextAt'] = now()
            state['_dirty'] = True
    resume = [r for r in state['rows'] if r['status'] == 'in_progress']
    room = max(0, min(args.max, DAILY_CAP) - len(claimed_today(state)))
    prechecked_out = []
    eligible_sorted = sorted((r for r in state['rows'] if r['status'] == 'eligible'),
                             key=lambda r: (r.get('priority', 999), r['id']))
    if getattr(args, 'precheck', False) and room > 0 and eligible_sorted:
        fresh = []
        idx = 0
        while len(fresh) < room and idx < len(eligible_sorted):
            batch = eligible_sorted[idx:idx + max(room * 2, 6)]
            idx += len(batch)
            with ThreadPoolExecutor(max_workers=min(6, len(batch))) as pool:
                verdicts = list(pool.map(lambda row: probe_vendor_url(row.get('officialUrl') or ''), batch))
            for r, v in zip(batch, verdicts):
                if v['ok']:
                    r['precheck'] = {'checkedAt': now(), 'checkedUrl': v['checkedUrl'], 'chars': v['chars']}
                    state['_dirty'] = True
                    if len(fresh) < room:
                        fresh.append(r)
                else:
                    disp = v['disposition']
                    reason = f"zero-cost precheck: official site unreadable ({v['reason']})"
                    log(r, disp, reason)
                    prechecked_out.append({'id': r['id'], 'status': disp, 'reason': v['reason']})
                    state['_dirty'] = True
    else:
        fresh = eligible_sorted[:room]

    pending_candidates = []
    if len(fresh) < room:
        pending_rows = sorted(
            (r for r in state['rows'] if r['status'] == 'pending'),
            key=lambda r: (r.get('priority', 999), r['id']),
        )[:20]
        if getattr(args, 'precheck', False) and pending_rows:
            has_url = [r for r in pending_rows if r.get('officialUrl')]
            url_verdicts = {}
            if has_url:
                with ThreadPoolExecutor(max_workers=min(6, len(has_url))) as pool:
                    for r, v in zip(has_url, pool.map(lambda row: probe_vendor_url(row.get('officialUrl') or ''), has_url)):
                        url_verdicts[r['id']] = v
            kept_pending = []
            for r in pending_rows:
                v = url_verdicts.get(r['id'])
                if v and not v['ok']:
                    disp = v['disposition']
                    log(r, disp, f"zero-cost precheck: official site unreadable ({v['reason']})")
                    prechecked_out.append({'id': r['id'], 'status': disp, 'reason': v['reason']})
                    state['_dirty'] = True
                    continue
                kept_pending.append((r, v))
                if len(kept_pending) >= 15:
                    break
            pending_candidates = [
                {
                    'id': r['id'],
                    'vendor': r.get('vendor'),
                    'product': r.get('product'),
                    'officialUrl': r.get('officialUrl'),
                    'priority': r.get('priority', 999),
                    **({'precheckReadable': True, 'checkedUrl': v['checkedUrl']} if v and v['ok'] else {}),
                }
                for r, v in kept_pending
            ]
        else:
            pending_candidates = [
                {
                    'id': r['id'],
                    'vendor': r.get('vendor'),
                    'product': r.get('product'),
                    'officialUrl': r.get('officialUrl'),
                    'priority': r.get('priority', 999),
                }
                for r in pending_rows[:15]
            ]
    discovery_allowed = (not resume and not fresh and room > 0 and
                         not any(r['status'] in ('eligible', 'pending') for r in state['rows']))
    upgrades = upgrade_queue(state)[:3]
    zero_work = not resume and not fresh and not pending_candidates and not discovery_allowed and not upgrades and not auto_quarantined
    return {'day': today(), 'resume': resume, 'new': fresh,
            'pendingCandidates': pending_candidates,
            'precheckedSidelined': prechecked_out,
            'slotsLeftToday': room,
            'autoQuarantined': auto_quarantined,
            'discoveryAllowed': discovery_allowed,
            'upgradeQueue': upgrades,
            'zeroWorkFastExit': zero_work,
            'upgradeNote': 'step 7b MUST upgrade every upgradeQueue row this run, after today\'s pages (also on a no-op day)',
            'writerNote': WRITER_NOTE}


def cmd_claim(state, args):
    ids = [i for i in args.ids.split(',') if i]
    if len(claimed_today(state)) + len(ids) > DAILY_CAP:
        fail('daily cap of %d pages per America/Bogota day' % DAILY_CAP)
    for key in ids:
        row = find(state, key)
        if row['status'] != 'eligible':
            fail(key + ' is ' + row['status'] + ', only eligible rows can be claimed')
        row['claimedOn'] = today()
        row['attempts'] = int(row.get('attempts') or 0) + 1
        row['lastNextAt'] = now()
        log(row, 'in_progress', 'claimed for ' + today())
    return {'claimed': ids}


def cmd_set(state, args):
    row = find(state, args.id)
    if args.status not in STATUSES:
        fail('unknown status ' + args.status)
    if row['status'] in TERMINAL and args.status != row['status'] and not (row['status'] == 'published' and args.status == 'held'):
        fail('%s is %s; terminal rows keep their status' % (args.id, row['status']))
    if not args.note:
        fail('--note is required')
    fields = {}
    for item in args.field or []:
        key, _, value = item.partition('=')
        try:
            fields[key] = json.loads(value)
        except json.JSONDecodeError:
            fields[key] = value
    if args.status == 'published':
        url = fields.get('liveUrl') or row.get('liveUrl')
        if not (isinstance(url, str) and url.startswith('https://')):
            fail('published needs --field liveUrl="https://..." (the verified live URL)')
        if not (fields.get('commit') or row.get('commit')):
            fail('published needs --field commit="<sha>"')
        if not row.get('audit'):
            fail('published needs the recorded content audit')
    if args.status == 'eligible' and row['status'] == 'pending':
        missing = [k for k in ('vendor', 'product', 'officialUrl', 'targetQuery', 'demand') if not (fields.get(k) or row.get(k))]
        if missing:
            fail('qualification needs ' + ', '.join(missing))
    if args.status == 'quarantined':
        t_path = _write_quarantine_ticket(row, args.note)
        fields['ticketPath'] = t_path
    row.update(fields)
    log(row, args.status, args.note, fields=sorted(fields))
    return {'id': args.id, 'status': args.status, **({'ticketPath': row['ticketPath']} if row.get('ticketPath') else {})}


def cmd_audit(state, args):
    row = find(state, args.id)
    if getattr(args, 'upgrade', False):
        # One audit per SEO upgrade of an already-published page (owner rule 2026-11-14).
        if row['status'] != 'published' or row.get('seoUpgraded'):
            fail('upgrade audits apply to published rows not yet upgraded')
        audit = json.loads(Path(args.file).read_text())
        if audit.get('verdict') not in ('PASS', 'FAIL') or not isinstance(audit.get('findings'), list) or not audit.get('reviewer'):
            fail('audit needs verdict PASS|FAIL, findings list and reviewer')
        if any(a.get('kind') == 'seo-upgrade' for a in row.get('upgradeAudits', [])):
            fail('one audit per upgrade: this row already has its upgrade audit')
        row.setdefault('upgradeAudits', []).append({**audit, 'kind': 'seo-upgrade', 'recordedAt': now()})
        row.setdefault('history', []).append({'at': now(), 'status': row['status'], 'note': 'upgrade audit ' + audit['verdict']})
        return {'id': args.id, 'upgradeVerdict': audit['verdict'], 'findings': len(audit['findings'])}
    if row.get('audit'):
        fail('one content audit per page: %s already has one (%s)' % (args.id, row['audit'].get('verdict')))
    audit = json.loads(Path(args.file).read_text())
    if audit.get('verdict') not in ('PASS', 'FAIL') or not isinstance(audit.get('findings'), list) or not audit.get('reviewer'):
        fail('audit needs verdict PASS|FAIL, findings list and reviewer')
    if audit['reviewer'] == row.get('writer'):
        fail('the auditor must not be the writer')
    row['audit'] = {**audit, 'recordedAt': now()}
    row.setdefault('history', []).append({'at': now(), 'status': row['status'], 'note': 'audit ' + audit['verdict']})
    return {'id': args.id, 'verdict': audit['verdict'], 'findings': len(audit['findings'])}


def cmd_add(state, args):
    new = json.loads(Path(args.file).read_text())
    if not isinstance(new, list) or len(new) > DISCOVERY_MAX:
        fail('add expects a JSON list of at most %d rows' % DISCOVERY_MAX)
    seen_ids = {identity(r) for r in state['rows'] if identity(r)}
    seen_queries = {norm(r.get('targetQuery')) for r in state['rows'] if r.get('targetQuery')}
    added, skipped = [], []
    for item in new:
        ident = identity(item)
        query = norm(item.get('targetQuery'))
        if not ident or not query or not item.get('vendor') or not item.get('product'):
            skipped.append({'row': item.get('product'), 'reason': 'needs vendor, product, https officialUrl, targetQuery'})
            continue
        if ident in seen_ids or query in seen_queries:
            skipped.append({'row': item.get('product'), 'reason': 'already in backlog'})
            continue
        status = args.status
        if status == 'eligible' and not item.get('demand'):
            status = 'pending'
        key = 'alt-' + re.sub(r'[^a-z0-9]+', '-', ident).strip('-')[:60]
        row = {**item, 'id': key, 'createdAt': now(), 'history': []}
        log(row, status, 'added: ' + (item.get('source') or 'discovery'))
        state['rows'].append(row)
        seen_ids.add(ident)
        seen_queries.add(query)
        added.append(key)
    return {'added': added, 'skipped': skipped}


def cmd_precheck(state, args):
    """Standalone $0 reachability precheck across eligible/pending rows with officialUrl."""
    targets = [r for r in sorted(state['rows'], key=lambda r: (r.get('priority', 999), r['id']))
               if r['status'] in ('eligible', 'pending') and r.get('officialUrl')][:args.max_scan]
    if not targets:
        return {'checked': 0, 'readable': 0, 'sidelined': []}
    with ThreadPoolExecutor(max_workers=min(8, len(targets))) as pool:
        verdicts = list(pool.map(lambda row: probe_vendor_url(row.get('officialUrl') or ''), targets))
    readable = 0
    sidelined = []
    for r, v in zip(targets, verdicts):
        if v['ok']:
            readable += 1
            r['precheck'] = {'checkedAt': now(), 'checkedUrl': v['checkedUrl'], 'chars': v['chars']}
            state['_dirty'] = True
        else:
            disp = v['disposition']
            log(r, disp, f"zero-cost precheck: official site unreadable ({v['reason']})")
            sidelined.append({'id': r['id'], 'status': disp, 'reason': v['reason']})
            state['_dirty'] = True
    return {'checked': len(targets), 'readable': readable, 'sidelined': sidelined}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--file-path', default=str(DEFAULT), help='backlog JSON (default %(default)s)')
    sub = parser.add_subparsers(dest='cmd', required=True)
    sub.add_parser('status')
    p = sub.add_parser('next'); p.add_argument('--max', type=int, default=DAILY_CAP)
    p.add_argument('--precheck', action='store_true', help='$0 HTTP reachability pre-screen before waking AI writers')
    p = sub.add_parser('precheck'); p.add_argument('--max-scan', type=int, default=30)
    p = sub.add_parser('claim'); p.add_argument('--ids', required=True)
    p = sub.add_parser('set'); p.add_argument('--id', required=True); p.add_argument('--status', required=True)
    p.add_argument('--note', required=True); p.add_argument('--field', action='append')
    p = sub.add_parser('audit'); p.add_argument('--id', required=True); p.add_argument('--file', required=True)
    p.add_argument('--upgrade', action='store_true', help='record the one audit for an SEO upgrade of a published page')
    p = sub.add_parser('add'); p.add_argument('--file', required=True)
    p.add_argument('--status', default='eligible', choices=['eligible', 'pending'])
    args = parser.parse_args()
    path = Path(args.file_path)
    state = load(path)
    handler = {'status': cmd_status, 'next': cmd_next, 'precheck': cmd_precheck, 'claim': cmd_claim, 'set': cmd_set,
               'audit': cmd_audit, 'add': cmd_add}[args.cmd]
    out = handler(state, args)
    dirty = state.pop('_dirty', False)
    if args.cmd not in ('status', 'next') or dirty:
        save(path, state)
    print(json.dumps(out, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
