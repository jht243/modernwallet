#!/usr/bin/env python3
"""Fleet-wide item-level quarantine & retry-cap helper (stdlib only).

When an individual item, route, vendor, or queue row hits its retry limit or a
non-transient gate bug, routines sideline ONLY that item into
`reports/quarantine/<skill>/<safe_id>.json`, optionally push the work branch to
`origin/claude/quarantine/...` so finished drafts are preserved, allow sibling
items and future runs to keep flowing, and report `--status failure` so the
Failure-Fixer AI picks up the inbox alert + committed quarantine ticket.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path


def _now_utc() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def _iso(ts: dt.datetime) -> str:
    return ts.isoformat(timespec='seconds').replace('+00:00', 'Z')


def _safe_slug(value: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9._-]+', '-', (value or '').strip()).strip('-')
    if not cleaned:
        cleaned = 'item'
    if len(cleaned) > 72:
        digest = hashlib.sha256(value.encode('utf-8')).hexdigest()[:12]
        cleaned = f'{cleaned[:56]}-{digest}'
    return cleaned.lower()


def quarantine_dir(root: Path, skill: str) -> Path:
    return root / 'reports' / 'quarantine' / _safe_slug(skill)


def ticket_path(root: Path, skill: str, item_id: str) -> Path:
    return quarantine_dir(root, skill) / f'{_safe_slug(item_id)}.json'


def _git_out(root: Path, *args: str) -> str:
    res = subprocess.run(['git', *args], cwd=root, capture_output=True, text=True)
    return res.stdout.strip() if res.returncode == 0 else ''


def _save_quarantine_branch(root: Path, skill: str, item_id: str) -> tuple[str | None, str | None]:
    head = _git_out(root, 'rev-parse', 'HEAD')
    if not head:
        return None, None
    stamp = _now_utc().strftime('%Y%m%d-%H%M%S')
    branch = f'claude/quarantine/{_safe_slug(skill)}-{_safe_slug(item_id)[:32]}-{stamp}'
    push = subprocess.run(
        ['git', 'push', '-q', 'origin', f'HEAD:refs/heads/{branch}'],
        cwd=root,
        capture_output=True,
        text=True,
        timeout=45,
    )
    if push.returncode == 0:
        return branch, head
    return None, head


def load_active_tickets(root: Path, skill: str | None = None) -> list[dict]:
    base = root / 'reports' / 'quarantine'
    if not base.is_dir():
        return []
    dirs = [quarantine_dir(root, skill)] if skill else [d for d in sorted(base.iterdir()) if d.is_dir()]
    now = _now_utc()
    out: list[dict] = []
    for d in dirs:
        if not d.is_dir():
            continue
        for f in sorted(d.glob('*.json')):
            try:
                doc = json.loads(f.read_text(encoding='utf-8'))
            except Exception:
                continue
            if not isinstance(doc, dict) or doc.get('status') != 'quarantined':
                continue
            exp = doc.get('expiresAt')
            if isinstance(exp, str) and exp:
                try:
                    exp_dt = dt.datetime.fromisoformat(exp.replace('Z', '+00:00'))
                    if exp_dt <= now:
                        continue
                except ValueError:
                    pass
            doc['_ticketPath'] = str(f.relative_to(root))
            out.append(doc)
    return out


def is_quarantined(root: Path, skill: str, item_id: str | None = None, route: str | None = None) -> dict | None:
    norm_route = (route or '').rstrip('/') or None
    if item_id:
        p = ticket_path(root, skill, item_id)
        if p.is_file():
            for t in load_active_tickets(root, skill):
                if t.get('_ticketPath') == str(p.relative_to(root)):
                    return t
    for t in load_active_tickets(root, skill):
        if item_id and str(t.get('itemId') or '') == item_id:
            return t
        if norm_route:
            t_routes = {(str(r).rstrip('/') or '/') for r in (t.get('routes') or []) if r}
            if norm_route in t_routes:
                return t
    return None


def record_ticket(
    root: Path,
    *,
    skill: str,
    item_id: str,
    reason: str,
    site: str = '',
    attempts: int = 1,
    max_retries: int = 0,
    error: str = '',
    routes: list[str] | None = None,
    cooldown_days: int = 0,
    save_branch: bool = False,
    extra: dict | None = None,
) -> dict:
    p = ticket_path(root, skill, item_id)
    p.parent.mkdir(parents=True, exist_ok=True)
    prior = {}
    if p.is_file():
        try:
            prior = json.loads(p.read_text(encoding='utf-8'))
        except Exception:
            prior = {}
    now = _now_utc()
    saved_branch, saved_commit = (None, None)
    if save_branch:
        try:
            saved_branch, saved_commit = _save_quarantine_branch(root, skill, item_id)
        except Exception:
            saved_branch, saved_commit = (None, _git_out(root, 'rev-parse', 'HEAD') or None)
    else:
        saved_commit = _git_out(root, 'rev-parse', 'HEAD') or None

    total_attempts = max(int(attempts), int(prior.get('attempts') or 0) + (1 if prior else 0))
    doc = {
        'version': 1,
        'status': 'quarantined',
        'skill': skill,
        'site': site or prior.get('site') or '',
        'itemId': item_id,
        'attempts': total_attempts,
        'maxRetries': int(max_retries),
        'reason': reason.strip(),
        'error': (error or '').strip()[:4000],
        'routes': sorted({(r.rstrip('/') or '/') for r in (routes or prior.get('routes') or []) if r}),
        'savedBranch': saved_branch or prior.get('savedBranch'),
        'savedCommit': saved_commit or prior.get('savedCommit'),
        'createdAt': prior.get('createdAt') or _iso(now),
        'updatedAt': _iso(now),
        'expiresAt': _iso(now + dt.timedelta(days=cooldown_days)) if cooldown_days and cooldown_days > 0 else None,
    }
    if extra:
        doc['details'] = extra
    tmp = p.with_suffix('.tmp')
    tmp.write_text(json.dumps(doc, indent=2, sort_keys=True, ensure_ascii=False) + '\n', encoding='utf-8')
    tmp.replace(p)
    doc['ticketPath'] = str(p.relative_to(root))
    return doc


def resolve_ticket(root: Path, *, skill: str, item_id: str, note: str = '') -> dict:
    p = ticket_path(root, skill, item_id)
    if not p.is_file():
        raise SystemExit(f'ERROR: quarantine ticket not found: {p}')
    doc = json.loads(p.read_text(encoding='utf-8'))
    doc['status'] = 'resolved'
    doc['resolvedAt'] = _iso(_now_utc())
    if note:
        doc['resolutionNote'] = note.strip()
    tmp = p.with_suffix('.tmp')
    tmp.write_text(json.dumps(doc, indent=2, sort_keys=True, ensure_ascii=False) + '\n', encoding='utf-8')
    tmp.replace(p)
    doc['ticketPath'] = str(p.relative_to(root))
    return doc


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description='Fleet item-level quarantine & retry-cap manager')
    ap.add_argument('--root', default='.', help='Repository root')
    sub = ap.add_subparsers(dest='cmd', required=True)

    p_rec = sub.add_parser('record', help='Quarantine one stuck item so siblings/future runs keep flowing')
    p_rec.add_argument('--skill', required=True)
    p_rec.add_argument('--id', required=True, dest='item_id')
    p_rec.add_argument('--reason', required=True)
    p_rec.add_argument('--site', default='')
    p_rec.add_argument('--attempts', type=int, default=1)
    p_rec.add_argument('--max-retries', type=int, default=0)
    p_rec.add_argument('--error', default='')
    p_rec.add_argument('--route', action='append', default=[])
    p_rec.add_argument('--cooldown-days', type=int, default=0)
    p_rec.add_argument('--save-branch', action='store_true')

    p_chk = sub.add_parser('check', help='Check if an item or route is currently quarantined')
    p_chk.add_argument('--skill', required=True)
    p_chk.add_argument('--id', default=None, dest='item_id')
    p_chk.add_argument('--route', default=None)

    p_lst = sub.add_parser('list', help='List active quarantine tickets')
    p_lst.add_argument('--skill', default=None)

    p_res = sub.add_parser('resolve', help='Mark a quarantine ticket resolved after fixing')
    p_res.add_argument('--skill', required=True)
    p_res.add_argument('--id', required=True, dest='item_id')
    p_res.add_argument('--note', default='')

    args = ap.parse_args(argv)
    root = Path(args.root).resolve()

    if args.cmd == 'record':
        doc = record_ticket(
            root,
            skill=args.skill,
            item_id=args.item_id,
            reason=args.reason,
            site=args.site,
            attempts=args.attempts,
            max_retries=args.max_retries,
            error=args.error,
            routes=args.route,
            cooldown_days=args.cooldown_days,
            save_branch=args.save_branch,
        )
        print(json.dumps(doc, ensure_ascii=False))
        return 0

    if args.cmd == 'check':
        hit = is_quarantined(root, args.skill, item_id=args.item_id, route=args.route)
        print(json.dumps({'quarantined': hit is not None, 'ticket': hit}, ensure_ascii=False))
        return 0

    if args.cmd == 'list':
        rows = load_active_tickets(root, args.skill)
        print(json.dumps({'count': len(rows), 'tickets': rows}, ensure_ascii=False))
        return 0

    if args.cmd == 'resolve':
        doc = resolve_ticket(root, skill=args.skill, item_id=args.item_id, note=args.note)
        print(json.dumps(doc, ensure_ascii=False))
        return 0

    return 1


if __name__ == '__main__':
    raise SystemExit(main())
