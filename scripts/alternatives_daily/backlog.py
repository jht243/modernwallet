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
import datetime as dt
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

DEFAULT = Path('reports/alternatives-daily/backlog.json')
STATUSES = {'pending', 'eligible', 'in_progress', 'published', 'held', 'excluded', 'duplicate'}
TERMINAL = {'published', 'excluded', 'duplicate'}
DAILY_CAP = 3
DISCOVERY_MAX = 60


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


def claimed_today(state):
    # A page held or excluded after claiming frees its slot: the cap is 3 pages
    # actually produced per day, so the run can claim a replacement.
    return [r for r in state['rows'] if r.get('claimedOn') == today()
            and r['status'] not in ('held', 'excluded', 'duplicate')]


def cmd_status(state, _):
    counts = {}
    for row in state['rows']:
        counts[row['status']] = counts.get(row['status'], 0) + 1
    return {'day': today(), 'counts': counts, 'claimedToday': [r['id'] for r in claimed_today(state)],
            'resume': [r['id'] for r in state['rows'] if r['status'] == 'in_progress'],
            'eligible': sum(r['status'] == 'eligible' for r in state['rows']),
            'pending': sum(r['status'] == 'pending' for r in state['rows'])}


def cmd_next(state, args):
    resume = [r for r in state['rows'] if r['status'] == 'in_progress']
    room = max(0, min(args.max, DAILY_CAP) - len(claimed_today(state)))
    fresh = sorted((r for r in state['rows'] if r['status'] == 'eligible'),
                   key=lambda r: (r.get('priority', 999), r['id']))[:room]
    return {'day': today(), 'resume': resume, 'new': fresh, 'slotsLeftToday': room,
            'discoveryAllowed': not resume and not fresh and room > 0 and
            not any(r['status'] in ('eligible', 'pending') for r in state['rows'])}


def cmd_claim(state, args):
    ids = [i for i in args.ids.split(',') if i]
    if len(claimed_today(state)) + len(ids) > DAILY_CAP:
        fail('daily cap of %d pages per America/Bogota day' % DAILY_CAP)
    for key in ids:
        row = find(state, key)
        if row['status'] != 'eligible':
            fail(key + ' is ' + row['status'] + ', only eligible rows can be claimed')
        row['claimedOn'] = today()
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
        fields[key] = json.loads(value)
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
    row.update(fields)
    log(row, args.status, args.note, fields=sorted(fields))
    return {'id': args.id, 'status': args.status}


def cmd_audit(state, args):
    row = find(state, args.id)
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


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--file-path', default=str(DEFAULT), help='backlog JSON (default %(default)s)')
    sub = parser.add_subparsers(dest='cmd', required=True)
    sub.add_parser('status')
    p = sub.add_parser('next'); p.add_argument('--max', type=int, default=DAILY_CAP)
    p = sub.add_parser('claim'); p.add_argument('--ids', required=True)
    p = sub.add_parser('set'); p.add_argument('--id', required=True); p.add_argument('--status', required=True)
    p.add_argument('--note', required=True); p.add_argument('--field', action='append')
    p = sub.add_parser('audit'); p.add_argument('--id', required=True); p.add_argument('--file', required=True)
    p = sub.add_parser('add'); p.add_argument('--file', required=True)
    p.add_argument('--status', default='eligible', choices=['eligible', 'pending'])
    args = parser.parse_args()
    path = Path(args.file_path)
    state = load(path)
    handler = {'status': cmd_status, 'next': cmd_next, 'claim': cmd_claim, 'set': cmd_set,
               'audit': cmd_audit, 'add': cmd_add}[args.cmd]
    out = handler(state, args)
    if args.cmd not in ('status', 'next'):
        save(path, state)
    print(json.dumps(out, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
