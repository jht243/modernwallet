#!/usr/bin/env python3
"""Routine-scoped deterministic Zero-Work Fast Exit helper (stdlib only).

CRITICAL DESIGN BOUNDARY (owner rule 2026-11-14):
- ONLY fast-exits when a routine's raw upstream input is deterministically empty
  (0 visitor searches, 0 new scraped items/episodes/scout emails + 0 open intakes,
  0 actionable paid/fix/upsell queue items, or 100% of pulled GA4 pages on active
  cooldown / below the engagement-flagging floor).
- NEVER attempts semantic duplicate removal in Python and NEVER skips Mindmap
  (`BUILD` + `CHART-REVIEW`) when >= 1 raw candidate exists.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import importlib.util
import json
import os
import re
import subprocess
import sys
from pathlib import Path


def _load_quarantine(root: Path):
    q_path = root / '.claude/tools/quarantine.py'
    if not q_path.is_file():
        q_path = Path(__file__).with_name('quarantine.py')
    spec = importlib.util.spec_from_file_location('fleet_quarantine', q_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _repo_slug(root: Path) -> str:
    res = subprocess.run(['git', 'remote', 'get-url', 'origin'], cwd=root, capture_output=True, text=True)
    url = res.stdout.strip()
    m = re.search(r'[:/]([^/:]+/[^/]+?)(?:\.git)?$', url)
    return m.group(1) if m else ''


def _send_noop(root: Path, skill: str, site: str, summary: str, status: str = 'no-op') -> int:
    sender = root / '.claude/scripts/send-routine-email.py'
    if not sender.is_file():
        return 0
    cmd = [
        sys.executable,
        str(sender),
        '--status', status,
        '--skill', skill,
        '--site', site,
        '--summary', summary,
        '--details', f'# {skill} fast check\n\n{summary}\n',
    ]
    repo = _repo_slug(root)
    if repo:
        cmd.extend(['--repo', repo])
    res = subprocess.run(cmd, cwd=root, capture_output=True, text=True)
    return res.returncode


def check_json_candidates(
    root: Path,
    *,
    skill: str,
    site: str,
    input_path: Path,
    key: str = 'candidates',
    id_field: str = 'id',
    open_intake_dir: Path | None = None,
    send_email: bool = False,
) -> dict:
    q = _load_quarantine(root)
    if open_intake_dir and open_intake_dir.is_dir():
        for f in sorted(open_intake_dir.glob('*.json')):
            if len(f.stem) == 64 and not f.with_suffix('.done').exists() and not f.with_suffix('.done.json').exists():
                if not q.is_quarantined(root, skill, item_id=f.stem):
                    return {'fastExit': False, 'reason': f'open_intake:{f.name}', 'actionableCount': 1}

    if not input_path.is_file():
        return {'fastExit': False, 'reason': 'missing_input_file', 'actionableCount': 0}

    doc = json.loads(input_path.read_text(encoding='utf-8'))
    items = doc if isinstance(doc, list) else (doc.get(key) or [])
    if not isinstance(items, list):
        return {'fastExit': False, 'reason': 'non_list_candidates', 'actionableCount': 1}

    actionable = []
    quarantined_ids = []
    for item in items:
        if isinstance(item, dict):
            cid = str(item.get(id_field) or item.get('slug') or item.get('url') or item.get('name') or item.get('term') or '')
            route = str(item.get('route') or item.get('path') or '') or None
        else:
            cid = str(item)
            route = None
        if cid and q.is_quarantined(root, skill, item_id=cid, route=route):
            quarantined_ids.append(cid)
            continue
        actionable.append(item)

    if actionable:
        return {
            'fastExit': False,
            'reason': 'candidates_present_requires_mindmap_dedup',
            'actionableCount': len(actionable),
            'quarantinedSkipped': quarantined_ids,
        }

    summary = f'Verified 0 actionable {skill} candidates ({len(quarantined_ids)} quarantined skipped); nothing to send to Mindmap.'
    if send_email:
        # Delete untracked pull file if inside reports/ so session-end hook leaves branch clean
        try:
            if input_path.resolve().is_relative_to((root / 'reports').resolve()):
                tracked = subprocess.run(
                    ['git', 'ls-files', '--error-unmatch', str(input_path)],
                    cwd=root, capture_output=True,
                )
                if tracked.returncode != 0:
                    input_path.unlink(missing_ok=True)
        except Exception:
            pass
        _send_noop(root, skill, site, summary)
    return {
        'fastExit': True,
        'reason': 'zero_actionable_candidates',
        'actionableCount': 0,
        'quarantinedSkipped': quarantined_ids,
        'summary': summary,
    }


def check_paid_publisher(root: Path, *, site: str = 'https://www.layer3labs.io', send_email: bool = False) -> dict:
    q = _load_quarantine(root)
    pp_dir = root / 'scripts' / 'paid_placements'
    actionable_orders = []
    actionable_fixes = []
    actionable_upsells = []
    hosted_ready = []
    active_ids: set[str] = set()

    ledger_p = pp_dir / 'ledger.json'
    if ledger_p.is_file():
        ledger = json.loads(ledger_p.read_text(encoding='utf-8'))
        rows = ledger.get('queued', []) if isinstance(ledger, dict) else (ledger if isinstance(ledger, list) else [])
        for r in rows:
            if not isinstance(r, dict):
                continue
            rid = str(r.get('id') or r.get('orderId') or r.get('invoiceId') or r.get('brand') or '')
            if r.get('status') in ('completed', 'cancelled', 'quarantined_needs_fix'):
                continue
            # Publish-first rows already live with ownerDelivery sent wait on partner payment, not publisher
            if r.get('liveAt') and (r.get('unpaidPublishFirst') or (r.get('ownerDelivery') or {}).get('sentAt') or r.get('emailSentAt')):
                continue
            if rid:
                active_ids.add(rid)
            if rid and q.is_quarantined(root, 'paid-placement-publish', item_id=f'order:{rid}'):
                continue
            actionable_orders.append(rid or 'order')

    fix_p = pp_dir / 'fix-queue.json'
    if fix_p.is_file():
        fixes = json.loads(fix_p.read_text(encoding='utf-8'))
        rows = fixes.get('rows', fixes.get('queued', [])) if isinstance(fixes, dict) else (fixes if isinstance(fixes, list) else [])
        for r in rows:
            if not isinstance(r, dict) or r.get('status') != 'queued':
                continue
            if r.get('disposition') == 'superseded':
                continue
            rid = str(r.get('id') or r.get('fixId') or r.get('brand') or '')
            if rid and q.is_quarantined(root, 'paid-placement-publish', item_id=f'fix:{rid}'):
                continue
            actionable_fixes.append(rid or 'fix')

    upsell_p = pp_dir / 'upsell-queue.json'
    if upsell_p.is_file():
        ups = json.loads(upsell_p.read_text(encoding='utf-8'))
        rows = ups.get('rows', ups.get('queued', [])) if isinstance(ups, dict) else (ups if isinstance(ups, list) else [])
        for r in rows:
            if not isinstance(r, dict):
                continue
            rid = str(r.get('id') or r.get('sessionId') or r.get('brand') or '')
            if r.get('status') in ('queued', 'building') and rid:
                active_ids.add(rid)
            if r.get('status') != 'queued':
                continue
            if rid and q.is_quarantined(root, 'paid-placement-publish', item_id=f'upsell:{rid}'):
                continue
            actionable_upsells.append(rid or 'upsell')

    reports_dir = root / 'reports'
    if reports_dir.is_dir():
        for hf in reports_dir.glob('**/hosted/*.json'):
            try:
                hdoc = json.loads(hf.read_text(encoding='utf-8'))
                if not (isinstance(hdoc, dict) and hdoc.get('completedSpecs') and not hdoc.get('integratedAt')):
                    continue
                ident = hdoc.get('orderIdentity') if isinstance(hdoc.get('orderIdentity'), dict) else {}
                job_id = str(hdoc.get('jobId') or '')
                job_row_id = job_id.split(':', 1)[1] if ':' in job_id else ''
                target_id = str(hdoc.get('rowId') or ident.get('rowId') or job_row_id or '')
                if target_id and target_id not in active_ids:
                    continue
                hosted_ready.append(str(hf.relative_to(root)))
            except Exception:
                continue

    # In remote cloud containers (CLAUDE_CODE_REMOTE), customer-PII upsell queue scripts
    # are restricted by platform privacy guardrails and Q2b upsell builds are executed by
    # GitHub Actions publisher-failover.yml. Never attempt to bypass privacy guardrails.
    is_cloud_remote = os.environ.get('CLAUDE_CODE_REMOTE', '').strip().lower() in ('1', 'true', 'yes')
    hosted_runnable = [] if is_cloud_remote else hosted_ready
    upsells_runnable = bool(hosted_runnable)
    if actionable_upsells and not upsells_runnable and not is_cloud_remote:
        cg = root / 'scripts/lib/content_gen.py'
        if cg.is_file():
            pf = subprocess.run([sys.executable, str(cg), 'preflight'], cwd=root, capture_output=True, text=True, timeout=20)
            upsells_runnable = pf.returncode == 0

    # Standing hash + live dry-run check so Q2c runs whenever sponsorship standing changes
    standing_hasher = hashlib.sha256()
    for cand in sorted(pp_dir.glob('*standing*.json')) + sorted(pp_dir.glob('*sponsorship*.json')):
        if cand.is_file():
            standing_hasher.update(cand.name.encode('utf-8'))
            standing_hasher.update(cand.read_bytes())
    standing_sha = standing_hasher.hexdigest()
    state_file = root / '.git' / 'routine-fast-exit-publisher.json'
    standing_changed = False
    if state_file.is_file():
        try:
            prev = json.loads(state_file.read_text(encoding='utf-8'))
            standing_changed = prev.get('standingSha256') != standing_sha
        except Exception:
            standing_changed = True
    if not standing_changed and not actionable_orders and not actionable_fixes:
        standing_script = pp_dir / 'sponsor_standing.py'
        if standing_script.is_file():
            repo_candidates = []
            home_user = Path('/home/user')
            if home_user.is_dir():
                repo_candidates = [str(p) for p in sorted(home_user.iterdir()) if (p / 'data/category-sponsors.json').is_file()]
            if not repo_candidates and (root / 'data/category-sponsors.json').is_file():
                repo_candidates = [str(root)]
            if repo_candidates:
                try:
                    sp = subprocess.run(
                        [sys.executable, str(standing_script), *repo_candidates],
                        cwd=root, capture_output=True, text=True, timeout=15,
                    )
                    if sp.returncode == 0 and 'Sponsor standing: no changes' not in (sp.stdout or ''):
                        standing_changed = True
                except Exception:
                    pass

    has_work = bool(actionable_orders or actionable_fixes or (actionable_upsells and upsells_runnable) or hosted_runnable or standing_changed)
    if has_work:
        return {
            'fastExit': False,
            'orders': actionable_orders,
            'fixes': actionable_fixes,
            'upsells': actionable_upsells if upsells_runnable else [],
            'hostedReady': hosted_runnable,
            'standingChanged': standing_changed,
        }

    try:
        state_file.write_text(json.dumps({'standingSha256': standing_sha, 'checkedAt': dt.datetime.now(dt.timezone.utc).isoformat()}) + '\n')
    except Exception:
        pass
    upsell_note = (
        f'{len(actionable_upsells)} upsells delegated to GitHub Actions publisher-failover'
        if (is_cloud_remote and actionable_upsells)
        else f'{len(actionable_upsells)} upsells deferred/unrunnable'
    )
    summary = (
        f'Quiet paid publisher hour: 0 actionable orders, 0 actionable fixes, '
        f'{upsell_note}, standing unchanged.'
    )
    if send_email:
        _send_noop(root, 'paid-placement-publish', site, summary)
    return {'fastExit': True, 'summary': summary}


def _parse_ledger_dates(ledger_path: Path) -> dict[str, dt.date]:
    if not ledger_path.is_file():
        return {}
    out: dict[str, dt.date] = {}
    date_re = re.compile(r'\b(20\d{2}-\d{2}-\d{2})\b')
    path_re = re.compile(r'(/[A-Za-z0-9._/-]*)')
    for line in ledger_path.read_text(encoding='utf-8', errors='replace').splitlines():
        if '|' not in line:
            continue
        dm = date_re.search(line)
        pm = path_re.search(line)
        if dm and pm:
            try:
                d = dt.date.fromisoformat(dm.group(1))
                p = pm.group(1).rstrip('/') or '/'
                if p not in out or d > out[p]:
                    out[p] = d
            except ValueError:
                pass
    return out


def check_ga4_cooldown(
    root: Path,
    *,
    skill: str,
    site: str,
    pages_json: Path,
    ledger_path: Path,
    cooldown_days: int = 7,
    send_email: bool = False,
) -> dict:
    q = _load_quarantine(root)
    if not pages_json.is_file():
        return {'fastExit': False, 'reason': 'missing_pages_json'}
    doc = json.loads(pages_json.read_text(encoding='utf-8'))
    rows = doc.get('pages') or doc.get('rows') or (doc if isinstance(doc, list) else [])
    if not isinstance(rows, list):
        return {'fastExit': False, 'reason': 'invalid_pages_shape'}

    # Never fast-exit if ledger explicitly holds DEFERRED work ready to drain
    if ledger_path.is_file() and 'DEFERRED' in ledger_path.read_text(encoding='utf-8', errors='replace'):
        return {'fastExit': False, 'reason': 'deferred_items_present'}

    seen_dates = _parse_ledger_dates(ledger_path)
    today = dt.datetime.now(dt.timezone.utc).date()
    eligible = []
    for r in rows:
        if not isinstance(r, dict):
            continue
        p = str(r.get('path') or r.get('pagePath') or r.get('route') or '').rstrip('/') or '/'
        if q.is_quarantined(root, skill, item_id=p, route=p):
            continue
        last_d = seen_dates.get(p)
        if last_d and (today - last_d).days < cooldown_days:
            continue
        eligible.append(p)

    if eligible:
        return {'fastExit': False, 'eligibleRoutes': eligible, 'eligibleCount': len(eligible)}

    summary = f'All {len(rows)} pulled top pages are within their {cooldown_days}-day audit/quarantine cooldown; nothing to do.'
    if send_email:
        try:
            if pages_json.resolve().is_relative_to((root / 'reports').resolve()):
                pages_json.unlink(missing_ok=True)
        except Exception:
            pass
        _send_noop(root, skill, site, summary, status='no-changes')
    return {'fastExit': True, 'summary': summary, 'eligibleCount': 0}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description='Routine-scoped deterministic zero-work fast-exit helper')
    ap.add_argument('--root', default='.')
    sub = ap.add_subparsers(dest='cmd', required=True)

    p_cand = sub.add_parser('json-candidates')
    p_cand.add_argument('--skill', required=True)
    p_cand.add_argument('--site', required=True)
    p_cand.add_argument('--input', required=True, type=Path)
    p_cand.add_argument('--key', default='candidates')
    p_cand.add_argument('--id-field', default='id')
    p_cand.add_argument('--open-intake-dir', type=Path, default=None)
    p_cand.add_argument('--send-email', action='store_true')

    p_pub = sub.add_parser('paid-publisher')
    p_pub.add_argument('--site', default='https://www.layer3labs.io')
    p_pub.add_argument('--send-email', action='store_true')

    p_ga4 = sub.add_parser('ga4-cooldown')
    p_ga4.add_argument('--skill', required=True)
    p_ga4.add_argument('--site', required=True)
    p_ga4.add_argument('--pages-json', required=True, type=Path)
    p_ga4.add_argument('--ledger', required=True, type=Path)
    p_ga4.add_argument('--cooldown-days', type=int, default=7)
    p_ga4.add_argument('--send-email', action='store_true')

    args = ap.parse_args(argv)
    root = Path(args.root).resolve()

    if args.cmd == 'json-candidates':
        in_p = args.input if args.input.is_absolute() else (root / args.input)
        intake_d = (args.open_intake_dir if args.open_intake_dir.is_absolute() else (root / args.open_intake_dir)) if args.open_intake_dir else None
        res = check_json_candidates(
            root,
            skill=args.skill,
            site=args.site,
            input_path=in_p,
            key=args.key,
            id_field=args.id_field,
            open_intake_dir=intake_d,
            send_email=args.send_email,
        )
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'paid-publisher':
        res = check_paid_publisher(root, site=args.site, send_email=args.send_email)
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'ga4-cooldown':
        pj = args.pages_json if args.pages_json.is_absolute() else (root / args.pages_json)
        lg = args.ledger if args.ledger.is_absolute() else (root / args.ledger)
        res = check_ga4_cooldown(
            root,
            skill=args.skill,
            site=args.site,
            pages_json=pj,
            ledger_path=lg,
            cooldown_days=args.cooldown_days,
            send_email=args.send_email,
        )
        print(json.dumps(res, ensure_ascii=False))
        return 0

    return 1


if __name__ == '__main__':
    raise SystemExit(main())
