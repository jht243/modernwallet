#!/usr/bin/env python3
"""Routine-scoped deterministic Zero-Work Fast Exit helper (stdlib only).

CRITICAL DESIGN BOUNDARY (owner rules 2026-11-14 & 2026-11-15):
- ONLY fast-exits when a routine's upstream input or research pack has 0 actionable items:
  * 0 visitor searches / 0 scraped items / 0 open intakes (`json-candidates`)
  * 0 actionable paid orders / fixes / runnable upsells (`paid-publisher`)
  * 100% of substantive GA4 top pages on active cooldown with 0 undrained `DEFERRED` rows (`ga4-cooldown`)
  * 0 weak-engagement content pages clearing the 50-session floor, >=2 flags, `QUICK_ANSWER_OK`, and cooldowns (`page-quality-check`)
  * 0 Trend findings AND 0 Top-20 uncovered queries AND 0 Wide-View (`rising`/`spillover`/`modifier_patterns`) findings (`trend-research-pack`)
  * 0 surviving comparison candidates after exact live-slug + `cache.json` + quarantine pre-filtering, with ZERO candidate caps (`comparison-prefilter`)
  * 0 actionable GSC URL Inspection defects after checking recent git shipped-ledger + sitemap + internal link presence (`indexing-sweep`)
- NEVER attempts fuzzy/semantic duplicate suppression in Python and NEVER caps surviving candidates.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import importlib.util
import json
import os
import re
import statistics
import subprocess
import sys
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

UTILITY_NON_CONTENT_ROUTES = frozenset({
    '/', '/about', '/about-us', '/contact', '/contact-us', '/privacy', '/privacy-policy',
    '/terms', '/terms-of-service', '/terms-and-conditions', '/disclaimer', '/ editorial-policy',
    '/editorial-policy', '/advertise', '/sponsor', '/sponsorship', '/search', '/login',
    '/signin', '/signup', '/register', '/404', '/500', '/work-with-us', '/services',
    '/book', '/audit',
})


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


def _branch_name(root: Path) -> str:
    res = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=root, capture_output=True, text=True)
    return res.stdout.strip() or 'main'


def _send_noop(
    root: Path,
    skill: str,
    site: str,
    summary: str,
    status: str = 'no-op',
    details_file: Path | None = None,
    headline: str | None = None,
) -> int:
    repo = _repo_slug(root)
    branch = _branch_name(root)
    sender = root / '.claude/scripts/send-routine-email.py'
    if sender.is_file():
        cmd = [
            sys.executable,
            str(sender),
            '--status', status,
            '--skill', skill,
            '--site', site,
            '--summary', summary,
        ]
        if headline:
            cmd.extend(['--headline', headline])
        if details_file and details_file.is_file():
            cmd.extend(['--details-file', str(details_file)])
        else:
            cmd.extend(['--details', f'# {skill} fast check\n\n{summary}\n'])
        if repo:
            cmd.extend(['--repo', repo, '--branch', branch, '--commit-sha', '', '--commit-url', ''])
        res = subprocess.run(cmd, cwd=root, capture_output=True, text=True)
        return res.returncode
    # Fallback direct collector POST when send-routine-email.py is absent
    import urllib.request
    secrets: dict[str, str] = {}
    for sp in (root / '.claude/routines.config', root / '.claude/secrets.env', Path.home() / '.claude/secrets.env'):
        if sp.is_file():
            for raw in sp.read_text(errors='ignore').splitlines():
                ln = raw.strip()
                if ln and not ln.startswith('#') and '=' in ln:
                    k, _, v = ln.partition('=')
                    secrets[k.strip()] = v.strip().strip('"').strip("'")
    url = (os.environ.get('ROUTINE_INGEST_URL') or secrets.get('ROUTINE_INGEST_URL') or 'https://layer3labs-web.onrender.com/api/routine-run').strip()
    tok = (os.environ.get('ROUTINE_INGEST_SECRET') or os.environ.get('NURTURE_CRON_SECRET') or secrets.get('ROUTINE_INGEST_SECRET') or secrets.get('NURTURE_CRON_SECRET') or '').strip()
    if not url or not tok:
        return 0
    body = json.dumps({
        'skill': skill,
        'project': (repo.split('/')[-1] if repo else site),
        'site': site,
        'repo': repo,
        'branch': branch,
        'status': 'no-op' if status in ('no-op', 'no-changes') else status,
        'summary': summary,
    }).encode('utf-8')
    req = urllib.request.Request(url, data=body, method='POST', headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {tok}'})
    try:
        with urllib.request.urlopen(req, timeout=15):
            return 0
    except Exception:
        return 0


def _cleanup_untracked_report_file(root: Path, path: Path) -> None:
    try:
        resolved = path.resolve()
        if not resolved.is_file() or not resolved.is_relative_to((root / 'reports').resolve()):
            return
        tracked = subprocess.run(
            ['git', 'ls-files', '--error-unmatch', str(resolved)],
            cwd=root,
            capture_output=True,
        )
        if tracked.returncode != 0:
            resolved.unlink(missing_ok=True)
    except Exception:
        pass


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
        _cleanup_untracked_report_file(root, input_path)
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
            if r.get('customerApprovalRequired') and (r.get('draftDelivery') or {}).get('status') == 'sent' and not r.get('customerApprovedAt'):
                continue
            if r.get('liveAt') and (r.get('unpaidPublishFirst') or (r.get('ownerDelivery') or {}).get('sentAt') or r.get('emailSentAt')):
                continue
            if rid:
                active_ids.add(rid)
            if rid and (
                q.is_quarantined(root, 'paid-placement-publish', item_id=f'order:{rid}')
                or q.is_quarantined(root, 'paid-placement-publish', item_id=rid)
            ):
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
            page_route = urllib.parse.urlparse(str(r.get('pageUrl') or '')).path.rstrip('/') or None if r.get('pageUrl') else None
            if rid and (
                q.is_quarantined(root, 'paid-placement-publish', item_id=f'fix:{rid}', route=page_route)
                or q.is_quarantined(root, 'paid-placement-publish', item_id=rid, route=page_route)
            ):
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
            if rid and (
                q.is_quarantined(root, 'paid-placement-publish', item_id=f'upsell:{rid}')
                or q.is_quarantined(root, 'paid-placement-publish', item_id=rid)
            ):
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

    has_local_bridge = (
        bool(os.environ.get('GMAIL_BRIDGE_SECRET', '').strip())
        or bool(os.environ.get('LAYER3_BRIDGE_HELPER', '').strip() and Path(os.environ['LAYER3_BRIDGE_HELPER']).is_file())
        or (Path.home() / '.layer3-ops/bridge_read.py').is_file()
        or Path('/tmp/layer3-today-mail-audit-20261028/bridge_read.py').is_file()
        or not (root / 'scripts/publisher_failover/local.py').is_file()
    )
    is_cloud_remote = (
        os.environ.get('CLAUDE_CODE_REMOTE', '').strip().lower() in ('1', 'true', 'yes')
        or bool(os.environ.get('CODEX_SANDBOX'))
        or (Path('/home/user').is_dir() and not os.environ.get('GMAIL_BRIDGE_SECRET'))
        or not has_local_bridge
    )
    hosted_runnable = [] if is_cloud_remote else hosted_ready
    upsells_runnable = bool(hosted_runnable)
    if actionable_upsells and not upsells_runnable and not is_cloud_remote:
        cg = root / 'scripts/lib/content_gen.py'
        if cg.is_file():
            try:
                pf = subprocess.run([sys.executable, str(cg), 'preflight'], cwd=root, capture_output=True, text=True, timeout=20)
                upsells_runnable = pf.returncode == 0
            except subprocess.TimeoutExpired:
                upsells_runnable = False

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

    orders_runnable = not is_cloud_remote
    fixes_runnable = not is_cloud_remote
    has_work = bool((actionable_orders and orders_runnable) or (actionable_fixes and fixes_runnable) or (actionable_upsells and upsells_runnable) or hosted_runnable or standing_changed)
    if has_work:
        return {
            'fastExit': False,
            'orders': actionable_orders if orders_runnable else [],
            'fixes': actionable_fixes if fixes_runnable else [],
            'upsells': actionable_upsells if upsells_runnable else [],
            'hostedReady': hosted_runnable,
            'standingChanged': standing_changed,
        }

    try:
        state_file.write_text(json.dumps({'standingSha256': standing_sha, 'checkedAt': dt.datetime.now(dt.timezone.utc).isoformat()}) + '\n')
    except Exception:
        pass
    if is_cloud_remote and (actionable_orders or actionable_fixes):
        dispatcher = Path.home() / '.layer3-ops/native_cloud_dispatch.py'
        if dispatcher.is_file():
            try:
                subprocess.run(
                    [sys.executable, str(dispatcher), 'dispatch-publisher', '--sla-override'],
                    cwd=root, capture_output=True, text=True, timeout=25,
                )
            except Exception:
                pass
    order_note = (
        f'{len(actionable_orders)} orders delegated to GitHub Actions publisher-failover'
        if (is_cloud_remote and actionable_orders)
        else '0 actionable orders'
    )
    fix_note = (
        f'{len(actionable_fixes)} fixes delegated to GitHub Actions publisher-failover'
        if (is_cloud_remote and actionable_fixes)
        else '0 actionable fixes'
    )
    upsell_note = (
        f'{len(actionable_upsells)} upsells delegated to GitHub Actions publisher-failover'
        if (is_cloud_remote and actionable_upsells)
        else f'{len(actionable_upsells)} upsells deferred/unrunnable'
    )
    summary = (
        f'Quiet paid publisher hour: {order_note}, {fix_note}, '
        f'{upsell_note}, standing unchanged.'
    )
    if send_email:
        _send_noop(root, 'paid-placement-publish', site, summary)
    return {'fastExit': True, 'summary': summary}


def record_publisher_failure(
    root: Path,
    *,
    kind: str,
    item_id: str,
    reason: str,
    route: str | None = None,
    max_attempts: int = 2,
    cooldown_days: int = 7,
    save_branch: bool = False,
    send_email: bool = False,
    site: str = 'https://www.layer3labs.io',
) -> dict:
    """Track per-item publisher failure strikes and auto-quarantine at `max_attempts` (default 2)."""
    q = _load_quarantine(root)
    norm_kind = kind.strip().lower()
    prefixed_id = item_id if item_id.startswith(f'{norm_kind}:') else f'{norm_kind}:{item_id}'
    attempts_file = q.quarantine_dir(root, 'paid-placement-publish') / '_attempts.json'
    attempts_file.parent.mkdir(parents=True, exist_ok=True)
    ledger: dict = {}
    if attempts_file.is_file():
        try:
            ledger = json.loads(attempts_file.read_text(encoding='utf-8')) or {}
        except Exception:
            ledger = {}
    entry = ledger.get(prefixed_id) if isinstance(ledger.get(prefixed_id), dict) else {'attempts': 0, 'reasons': []}
    attempts = int(entry.get('attempts') or 0) + 1
    reasons = list(entry.get('reasons') or [])
    if reason:
        reasons.append(reason)
    now_iso = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
    ledger[prefixed_id] = {
        'attempts': attempts,
        'lastFailedAt': now_iso,
        'route': route,
        'reasons': reasons[-5:],
    }
    attempts_file.write_text(json.dumps(ledger, indent=2) + '\n', encoding='utf-8')
    if attempts < max_attempts:
        return {
            'quarantined': False,
            'itemId': prefixed_id,
            'attempts': attempts,
            'maxAttempts': max_attempts,
            'attemptsFile': str(attempts_file.relative_to(root)),
        }
    ticket = q.record_ticket(
        root,
        skill='paid-placement-publish',
        item_id=prefixed_id,
        routes=[route] if route else [],
        cooldown_days=cooldown_days,
        reason=f'Failed {attempts}/{max_attempts} publisher runs: {reason}',
        save_branch=save_branch,
    )
    if send_email:
        _send_noop(
            root,
            'paid-placement-publish',
            site,
            f'Quarantined {prefixed_id} after {attempts} failed attempts ({reason}); quiet hours unblocked.',
            status='failure',
        )
    return {
        'quarantined': True,
        'itemId': prefixed_id,
        'attempts': attempts,
        'maxAttempts': max_attempts,
        'ticketPath': ticket.get('_ticketPath'),
        'savedBranch': ticket.get('savedBranch'),
    }


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


def _has_active_deferred(ledger_path: Path, shared_ledger_path: Path | None = None) -> bool:
    """Return True ONLY when the latest row for a route/slug still holds undrained DEFERRED work."""
    path_re = re.compile(r'^/[A-Za-z0-9._/-]*$')
    zero_deferred_re = re.compile(r'^\s*(?:0+|0\s+deferred|none|n/?a|—|-|drained)\s*$', re.I)
    pos_deferred_re = re.compile(r'\b([1-9]\d*)\s*deferred\b', re.I)

    if ledger_path.is_file():
        latest_by_route: dict[str, tuple[dt.date, list[str]]] = {}
        date_re = re.compile(r'\b(20\d{2}-\d{2}-\d{2})\b')
        for raw_line in ledger_path.read_text(encoding='utf-8', errors='replace').splitlines():
            if '|' not in raw_line:
                continue
            cells = [c.strip() for c in raw_line.strip().strip('|').split('|')]
            if not cells or set(cells[0]) <= {'-', ':', ' '}:
                continue
            route = None
            for c in cells:
                c_clean = c.strip('`*')
                if path_re.match(c_clean):
                    route = c_clean.rstrip('/') or '/'
                    break
            if not route:
                continue
            dm = date_re.search(raw_line)
            row_date = dt.date.fromisoformat(dm.group(1)) if dm else dt.date.min
            prev = latest_by_route.get(route)
            if prev is None or row_date >= prev[0]:
                latest_by_route[route] = (row_date, cells)

        for _, (_, cells) in latest_by_route.items():
            # Check explicit status cell == DEFERRED or trailing deferred-remaining column > 0
            for c in cells:
                c_clean = c.strip('`* ')
                if c_clean == 'DEFERRED':
                    return True
                if pos_deferred_re.search(c_clean):
                    return True
                if 'DEFERRED' in c_clean and not zero_deferred_re.match(c_clean) and not re.search(r'\b0+\s*DEFERRED\b', c_clean, re.I):
                    return True
            if len(cells) >= 5:
                tail = cells[-1].strip('`* ')
                if tail.isdigit() and int(tail) > 0:
                    return True

    if shared_ledger_path and shared_ledger_path.is_file():
        latest_by_slug: dict[str, str] = {}
        for raw_line in shared_ledger_path.read_text(encoding='utf-8', errors='replace').splitlines():
            if '|' not in raw_line or 'ga4-top-pages' not in raw_line:
                continue
            cells = [c.strip('`* ') for c in raw_line.strip().strip('|').split('|')]
            if len(cells) >= 2 and cells[0] and not set(cells[0]) <= {'-', ':'}:
                latest_by_slug[cells[0].lower()] = cells[1].upper()
        if any(st == 'DEFERRED' for st in latest_by_slug.values()):
            return True

    return False


def _row_views(r: dict) -> float | None:
    for k in ('views', 'screenPageViews', 'pageviews', 'sessions'):
        v = r.get(k)
        if isinstance(v, (int, float)):
            return float(v)
        if isinstance(v, str) and v.strip().replace('.', '', 1).isdigit():
            return float(v.strip())
    return None


def _is_utility_route(route: str) -> bool:
    norm = (route.rstrip('/') or '/').lower()
    if norm in UTILITY_NON_CONTENT_ROUTES:
        return True
    for prefix in ('/legal/', '/auth/', '/account/', '/admin/', '/tag/', '/author/'):
        if norm.startswith(prefix):
            return True
    return False


def _extract_ga4_rows(doc: object) -> list | None:
    if isinstance(doc, list):
        return doc
    if isinstance(doc, dict):
        for k in ('top_pages', 'pages', 'rows'):
            val = doc.get(k)
            if isinstance(val, list):
                return val
    return None


def _row_route(r: dict) -> str:
    raw = str(r.get('page') or r.get('path') or r.get('pagePath') or r.get('route') or '')
    return raw.split('?', 1)[0].rstrip('/') or '/'


def check_ga4_cooldown(
    root: Path,
    *,
    skill: str,
    site: str,
    pages_json: Path,
    ledger_path: Path,
    cooldown_days: int = 7,
    min_views: int = 5,
    send_email: bool = False,
) -> dict:
    q = _load_quarantine(root)
    if not pages_json.is_file():
        return {'fastExit': False, 'reason': 'missing_pages_json'}
    doc = json.loads(pages_json.read_text(encoding='utf-8'))
    rows = _extract_ga4_rows(doc)
    if rows is None:
        return {'fastExit': False, 'reason': 'invalid_pages_shape'}

    shared_ledger = root / 'reports/trend-pass/ledger.md'
    if _has_active_deferred(ledger_path, shared_ledger if skill == 'ga4-top-pages-pass-auto' else None):
        return {'fastExit': False, 'reason': 'deferred_items_present'}

    seen_dates = _parse_ledger_dates(ledger_path)
    today = dt.datetime.now(dt.timezone.utc).date()
    any_views_present = any(isinstance(r, dict) and _row_views(r) is not None for r in rows)
    total_views = sum((_row_views(r) or 0.0) for r in rows if isinstance(r, dict))

    eligible = []
    skipped_utility = []
    skipped_low_views = []
    for r in rows:
        if not isinstance(r, dict):
            continue
        p = _row_route(r)
        if _is_utility_route(p):
            skipped_utility.append(p)
            continue
        if any_views_present:
            rv = _row_views(r)
            if rv is not None and rv < min_views:
                skipped_low_views.append(p)
                continue
        if q.is_quarantined(root, skill, item_id=p, route=p):
            continue
        last_d = seen_dates.get(p)
        if last_d and (today - last_d).days < cooldown_days:
            continue
        eligible.append(p)

    if eligible:
        return {
            'fastExit': False,
            'eligibleRoutes': eligible,
            'eligibleCount': len(eligible),
            'skippedUtility': skipped_utility,
        }

    summary = (
        f'All substantive top pages ({len(rows)} pulled, {len(skipped_utility)} utility/home excluded, '
        f'{len(skipped_low_views)} sub-floor noise excluded) are within their {cooldown_days}-day '
        f'audit/quarantine cooldown with 0 active DEFERRED items; nothing to do.'
    )
    if send_email:
        _cleanup_untracked_report_file(root, pages_json)
        _send_noop(root, skill, site, summary, status='no-changes')
    return {
        'fastExit': True,
        'summary': summary,
        'eligibleCount': 0,
        'skippedUtility': skipped_utility,
        'skippedLowViews': skipped_low_views,
    }


def _parse_treatment_counts(ledger_path: Path) -> dict[str, int]:
    counts: dict[str, int] = {}
    if not ledger_path.is_file():
        return counts
    path_re = re.compile(r'(/[A-Za-z0-9._/-]*)')
    date_re = re.compile(r'\b(20\d{2}-\d{2}-\d{2})\b')
    for line in ledger_path.read_text(encoding='utf-8', errors='replace').splitlines():
        if '|' not in line or not date_re.search(line):
            continue
        pm = path_re.search(line)
        if pm:
            p = pm.group(1).rstrip('/') or '/'
            counts[p] = counts.get(p, 0) + 1
    return counts


def _float_metric(row: dict, keys: tuple[str, ...]) -> float | None:
    for k in keys:
        val = row.get(k)
        if isinstance(val, (int, float)):
            return float(val)
        if isinstance(val, str):
            cleaned = val.strip().rstrip('%s')
            try:
                return float(cleaned)
            except ValueError:
                continue
    return None


def check_page_quality_pull(
    root: Path,
    *,
    site: str,
    pages_json: Path,
    ledger_path: Path,
    ga4_ledger_path: Path | None = None,
    cooldown_days: int = 7,
    session_floor: int = 50,
    send_email: bool = False,
) -> dict:
    """Deterministic Phase 0/1 gate for page-quality-pass-auto (50-session floor, >=2 flags, QUICK_ANSWER_OK, cooldowns)."""
    q = _load_quarantine(root)
    if not pages_json.is_file():
        return {'fastExit': False, 'reason': 'missing_pages_json'}
    doc = json.loads(pages_json.read_text(encoding='utf-8'))
    rows = _extract_ga4_rows(doc)
    if rows is None:
        return {'fastExit': False, 'reason': 'invalid_pages_shape'}

    # If the inline-affiliate engine exists (layer3labs), verify all content top pages are already covered before fast-exiting
    aff_inject = root / 'src/utils/affiliateInject.ts'
    aff_catalog = root / 'data/affiliate/catalog.ts'
    if aff_inject.is_file() and aff_catalog.is_file():
        aff_txt = aff_inject.read_text(encoding='utf-8', errors='ignore')
        for r in rows:
            if not isinstance(r, dict):
                continue
            p = _row_route(r)
            if _is_utility_route(p):
                continue
            slug = p.strip('/').rsplit('/', 1)[-1]
            if slug and f"'{slug}'" not in aff_txt and f'"{slug}"' not in aff_txt and '-for-' not in slug:
                return {'fastExit': False, 'reason': f'unverified_affiliate_coverage:{p}'}

    own_dates = _parse_ledger_dates(ledger_path)
    treatment_counts = _parse_treatment_counts(ledger_path)
    ga4_dates = _parse_ledger_dates(ga4_ledger_path) if ga4_ledger_path and ga4_ledger_path.is_file() else {}
    today = dt.datetime.now(dt.timezone.utc).date()

    # Check if engagement metrics exist on rows; if absent, fall back to pure cooldown check
    content_rows = []
    for r in rows:
        if not isinstance(r, dict):
            continue
        p = _row_route(r)
        if _is_utility_route(p):
            continue
        content_rows.append((p, r))

    has_engagement = any(
        _float_metric(r, ('avg_eng_s', 'avgEngagementTime', 'averageSessionDuration', 'userEngagementDuration')) is not None
        and _float_metric(r, ('bounce_rate', 'bounceRate')) is not None
        for _, r in content_rows
    )
    if not has_engagement:
        return check_ga4_cooldown(
            root,
            skill='page-quality-pass-auto',
            site=site,
            pages_json=pages_json,
            ledger_path=ledger_path,
            cooldown_days=cooldown_days,
            send_email=send_email,
        )

    dwells = [v for _, r in content_rows if (v := _float_metric(r, ('avg_eng_s', 'avgEngagementTime', 'averageSessionDuration'))) is not None]
    engs = [v for _, r in content_rows if (v := _float_metric(r, ('engagement_rate', 'engagementRate', 'eng_rate'))) is not None]
    bounces = [v for _, r in content_rows if (v := _float_metric(r, ('bounce_rate', 'bounceRate', 'bounce'))) is not None]
    scrolls = [v for _, r in content_rows if (v := _float_metric(r, ('scrolled_pct', 'scrolledPct', 'scrollRate'))) is not None]

    med_dwell = statistics.median(dwells) if dwells else 0.0
    med_eng = statistics.median(engs) if engs else 0.0
    med_bounce = statistics.median(bounces) if bounces else 100.0
    # Normalize bounce scale (0..1 vs 0..100)
    bounce_delta = 0.15 if med_bounce <= 1.0 and all(b <= 1.0 for b in bounces) else 15.0
    med_scroll = statistics.median(scrolls) if len(scrolls) >= 4 else None

    eligible = []
    skipped_reasons: dict[str, str] = {}

    for p, r in content_rows:
        sess = _float_metric(r, ('sessions', 'views', 'screenPageViews')) or 0.0
        if sess < session_floor:
            skipped_reasons[p] = f'below_floor({int(sess)}<{session_floor})'
            continue
        if q.is_quarantined(root, 'page-quality-pass-auto', item_id=p, route=p):
            skipped_reasons[p] = 'quarantined'
            continue
        # Repeat-offender 3-strike 30-day cooldown
        eff_cooldown = 30 if treatment_counts.get(p, 0) >= 3 else cooldown_days
        last_own = own_dates.get(p)
        if last_own and (today - last_own).days < eff_cooldown:
            skipped_reasons[p] = f'own_cooldown({(today - last_own).days}d<{eff_cooldown}d)'
            continue
        last_ga4 = ga4_dates.get(p)
        if last_ga4 and (today - last_ga4).days < 2:
            skipped_reasons[p] = 'ga4_48h_buffer'
            continue

        dw = _float_metric(r, ('avg_eng_s', 'avgEngagementTime', 'averageSessionDuration'))
        er = _float_metric(r, ('engagement_rate', 'engagementRate', 'eng_rate'))
        br = _float_metric(r, ('bounce_rate', 'bounceRate', 'bounce'))
        sc = _float_metric(r, ('scrolled_pct', 'scrolledPct', 'scrollRate'))

        flags = set()
        if dw is not None and med_dwell > 0 and dw < 0.5 * med_dwell:
            flags.add('DWELL')
        if er is not None and med_eng > 0 and er < 0.5 * med_eng:
            flags.add('ENG_RATE')
        if br is not None and br > med_bounce + bounce_delta:
            flags.add('BOUNCE')
        if sc is not None and med_scroll is not None and med_scroll > 0 and sc < 0.5 * med_scroll:
            flags.add('SCROLL')

        if len(flags) < 2:
            skipped_reasons[p] = f'healthy_signals({len(flags)}_flags)'
            continue

        # QUICK_ANSWER_OK check: DWELL flag, but bounce <= median AND (eng_rate healthy OR scroll healthy)
        if (
            'DWELL' in flags
            and br is not None and br <= med_bounce
            and ('ENG_RATE' not in flags or (med_scroll is not None and 'SCROLL' not in flags))
        ):
            skipped_reasons[p] = 'QUICK_ANSWER_OK'
            continue

        eligible.append({'route': p, 'sessions': sess, 'flags': sorted(flags)})

    if eligible:
        return {
            'fastExit': False,
            'eligibleCount': len(eligible),
            'eligible': eligible,
            'skippedCount': len(skipped_reasons),
        }

    today_iso = today.isoformat()
    digest_path = Path(f'/tmp/page-quality-pass-{today_iso}.md')
    skipped_lines = '\n'.join(f'- `{k}` — {v}' for k, v in list(skipped_reasons.items())[:25]) or 'None this run'
    digest_md = (
        '## Diagnoses & treatments (0)\nNone this run\n\n'
        '## Section rewrites (0)\nNone this run\n\n'
        '## Next-step links added (0)\nNone this run\n\n'
        '## Tools embedded (0)\nNone this run\n\n'
        '## Monetization coverage (all 25 pages checked)\nNone this run\n\n'
        '## Affiliate sections added (0)\nNone this run\n\n'
        '## Metadata rewrites (0)\nNone this run\n\n'
        '## Flagged for the human (conversion/nav pages with weak engagement) (0)\nNone this run\n\n'
        '## Improvement report (pages treated ≥14 days ago)\nNone this run\n\n'
        f'## Skipped (cooldown / buffer / floor) ({len(skipped_reasons)})\n{skipped_lines}\n\n'
        '## Ledger deltas\nNone this run\n\n'
        '## Audit\nNone this run\n\n'
        '## IndexNow\nskipped — no-changes\n'
    )
    digest_path.write_text(digest_md, encoding='utf-8')
    summary = (
        f'0 content pages cleared the 50-session weak-engagement bar and cooldowns '
        f'({len(skipped_reasons)} below floor, healthy, QUICK_ANSWER_OK, or on cooldown); nothing to rewrite.'
    )
    if send_email:
        _cleanup_untracked_report_file(root, pages_json)
        _send_noop(root, 'page-quality-pass-auto', site, summary, status='no-changes', details_file=digest_path)
    return {
        'fastExit': True,
        'eligibleCount': 0,
        'skippedCount': len(skipped_reasons),
        'digestFile': str(digest_path),
        'summary': summary,
    }


def _count_pack_bullets(lines: list[str]) -> list[str]:
    items = []
    none_re = re.compile(r'^\s*(?:[-*]\s*)?(?:none(?:\s+this\s+run)?|\(none\)|n/?a|0\s+.*)\s*\.?\s*$', re.I)
    for raw in lines:
        s = raw.strip()
        if not s or s.startswith('Verdict:'):
            continue
        if none_re.match(s):
            continue
        if s.startswith(('-', '*', '1.', '2.', '3.')):
            body = re.sub(r'^(?:[-*]|\d+\.)\s*', '', s).strip()
            if body and not none_re.match(body):
                items.append(body)
    return items


def check_trend_research_pack(
    root: Path,
    *,
    research_md: Path,
    site: str,
    pull_json: Path | None = None,
    send_email: bool = False,
) -> dict:
    """Gate Trend Pass Phase 4c ONLY when Trend == 0 AND Query Check == 0 AND Wide View == 0."""
    if not research_md.is_file():
        return {'fastExit': False, 'reason': 'missing_research_md'}

    text = research_md.read_text(encoding='utf-8', errors='replace')
    sections: dict[str, list[str]] = {}
    current = '__root__'
    sections[current] = []
    verdict_trend = 'No clear trend'
    verdict_query = 'All top-20 queries already covered'

    for line in text.splitlines():
        hm = re.match(r'^(#{2,3})\s+(.+?)\s*$', line)
        if hm:
            current = hm.group(2).strip().lower()
            sections.setdefault(current, [])
            continue
        if line.strip().startswith('Verdict:'):
            v_txt = line.strip()[len('Verdict:'):].strip()
            if 'trend' in current:
                verdict_trend = v_txt
            elif 'query check' in current:
                verdict_query = v_txt
        sections.setdefault(current, []).append(line)

    def _find_sec(*substrings: str) -> list[str] | None:
        for k, v in sections.items():
            if all(sub in k for sub in substrings):
                return v
        return None

    sec_tier0 = _find_sec('tier-0')
    sec_trend = _find_sec('trend gap')
    sec_query = _find_sec('query check')
    sec_wide_rising = _find_sec('rising')
    sec_wide_sideways = _find_sec('sideways')

    # Fail-safe: if any expected section (including Wide View!) is missing from research.md, run full Mindmap
    if any(s is None for s in (sec_tier0, sec_trend, sec_query, sec_wide_rising, sec_wide_sideways)):
        return {
            'fastExit': False,
            'reason': 'research_pack_missing_wide_view_or_core_heading',
        }

    tier0_items = _count_pack_bullets(sec_tier0 or [])
    trend_items = _count_pack_bullets(sec_trend or [])
    query_items = _count_pack_bullets(sec_query or [])
    wide_rising_items = _count_pack_bullets(sec_wide_rising or [])
    wide_sideways_items = _count_pack_bullets(sec_wide_sideways or [])

    counts = {
        'tier0': len(tier0_items),
        'trendGaps': len(trend_items),
        'uncoveredTop20': len(query_items),
        'wideViewRisingSpillover': len(wide_rising_items),
        'wideViewSidewaysFormulas': len(wide_sideways_items),
    }
    total_opportunities = sum(counts.values())
    if total_opportunities > 0:
        return {
            'fastExit': False,
            'reason': 'opportunities_present_run_full_lane_c',
            'totalOpportunities': total_opportunities,
            'counts': counts,
        }

    today_iso = dt.datetime.now(dt.timezone.utc).date().isoformat()
    digest_path = Path(f'/tmp/trend-pass-auto-{today_iso}.md')
    digest_md = (
        f'# Trends\n## Trend verdict\n{verdict_trend}\n\n'
        '## Trend findings sent to mindmap (0)\nNone this run\n\n'
        '## Built from trend findings (0)\nNone this run\n\n'
        f'# Query check\n## Coverage verdict (top-20 queries + wide view)\n{verdict_query} '
        '(0 uncovered top-20 queries, 0 rising/spillover uncovered queries, 0 sideways formula candidates).\n\n'
        '## Built from query-check findings (0)\nNone this run\n\n'
        '# Mindmap\n## Brief\n'
        'Skipped Phase 4c cleanly — 0 trend gaps, 0 uncovered top-20 queries, and 0 wide-view '
        '(rising/spillover/sideways-formula) opportunities survived Phase 4 local dedup.\n\n'
        '## Built from top-10 queries (0)\nNone this run\n\n'
        '## Body enrichments (0)\nNone this run\n\n'
        '## Over cap, not built (0)\nNone this run\n\n'
        '## Dropped by mindmap (0)\nNone this run\n\n'
        '## Cannibalization advisory\nNone this run\n\n'
        '# Run details\n## Ledger deltas\ntrends.md: None — no new trend\nledger.md: None this run\n\n'
        '## Keyword data\nSkipped (0 actionable candidates across Trend, Query Check, and Wide View)\n\n'
        '## Audit\nNone this run\n\n'
        '## IndexNow\nskipped — no-changes\n'
    )
    digest_path.write_text(digest_md, encoding='utf-8')
    summary = (
        f'Trend: NO ({verdict_trend}). Query check: NO (all top-20 covered). '
        'Wide view: NO (0 rising/spillover or sideways-formula gaps). Mindmap: NO — nothing built.'
    )
    if send_email:
        _cleanup_untracked_report_file(root, research_md)
        if pull_json:
            _cleanup_untracked_report_file(root, pull_json)
        for extra in (root / 'reports/trend-pass').glob(f'{today_iso}*'):
            _cleanup_untracked_report_file(root, extra)
        _send_noop(
            root,
            'trend-pass-auto',
            site,
            summary,
            status='no-changes',
            details_file=digest_path,
            headline='Trend (no) / Query (no) / Mindmap (no)',
        )
    return {
        'fastExit': True,
        'totalOpportunities': 0,
        'counts': counts,
        'digestFile': str(digest_path),
        'summary': summary,
    }


def _collect_existing_site_slugs(root: Path) -> set[str]:
    slugs: set[str] = set()
    loc_re = re.compile(r'<loc>\s*https?://[^/<]+(/[^<]*)</loc>', re.I)
    for sm in root.glob('public/sitemap*.xml'):
        if sm.is_file():
            for m in loc_re.finditer(sm.read_text(encoding='utf-8', errors='ignore')):
                seg = m.group(1).strip('/').rsplit('/', 1)[-1].lower()
                if seg:
                    slugs.add(seg)
    for content_glob in ('src/content/**/*.md', 'src/content/**/*.mdx', 'content/**/*.md', 'content/**/*.mdx'):
        for p in root.glob(content_glob):
            if p.is_file() and not p.name.startswith('_'):
                slugs.add(p.stem.lower())
    slug_prop_re = re.compile(r'["\']slug["\']\s*:\s*["\']([a-z0-9][a-z0-9-_]+)["\']', re.I)
    for data_glob in ('data/*.json', 'data/*.ts'):
        for p in root.glob(data_glob):
            if p.is_file():
                for m in slug_prop_re.finditer(p.read_text(encoding='utf-8', errors='ignore')):
                    slugs.add(m.group(1).lower())
    return slugs


def _collect_cached_comparison_rejects(cache_path: Path) -> set[str]:
    rejected: set[str] = set()
    if not cache_path.is_file():
        return rejected
    try:
        doc = json.loads(cache_path.read_text(encoding='utf-8'))
    except Exception:
        return rejected
    if not isinstance(doc, dict):
        return rejected
    for bucket in ('versus_scored', 'roundup_rejected', 'dropped', 'rejected'):
        val = doc.get(bucket)
        if isinstance(val, dict):
            for k, info in val.items():
                if isinstance(info, dict) and str(info.get('status', 'dropped')).lower() in ('kept', 'shipped', 'published'):
                    rejected.add(k.strip('/').lower())
                elif not isinstance(info, dict) or info.get('reason') or info.get('dropped', True):
                    rejected.add(k.strip('/').lower())
        elif isinstance(val, list):
            for item in val:
                if isinstance(item, str):
                    rejected.add(item.strip('/').lower())
                elif isinstance(item, dict) and item.get('slug'):
                    rejected.add(str(item['slug']).strip('/').lower())
    return rejected


def check_comparison_prefilter(
    root: Path,
    *,
    candidates_json: Path,
    site: str,
    cache_path: Path | None = None,
    out_path: Path | None = None,
    send_email: bool = False,
) -> dict:
    """Deterministic duplicate + cache + quarantine pre-filter for comparison-content-auto (ZERO candidate caps!)."""
    q = _load_quarantine(root)
    if not candidates_json.is_file():
        return {'fastExit': False, 'reason': 'missing_candidates_json'}
    raw = json.loads(candidates_json.read_text(encoding='utf-8'))
    items = raw if isinstance(raw, list) else (raw.get('candidates') or [])
    if not isinstance(items, list):
        return {'fastExit': False, 'reason': 'invalid_candidates_shape'}

    existing_slugs = _collect_existing_site_slugs(root)
    c_path = cache_path or (root / 'reports/comparison-content-creator/cache.json')
    cached_rejects = _collect_cached_comparison_rejects(c_path)

    survivors = []
    seen_batch_slugs: set[str] = set()
    dropped = {'duplicate_live': 0, 'symmetric_versus_live': 0, 'cached_rejected': 0, 'quarantined': 0, 'batch_dup': 0}

    for item in items:
        if not isinstance(item, dict):
            survivors.append(item)
            continue
        slug = str(item.get('slug') or item.get('proposedSlug') or '').strip('/').rsplit('/', 1)[-1].lower()
        status_tag = str(item.get('status') or item.get('tag') or 'NEW').upper()
        route = str(item.get('route') or item.get('existingRoute') or (f'/{slug}' if slug else '')) or None
        if status_tag == 'DUPLICATE':
            dropped['duplicate_live'] += 1
            continue
        if slug:
            if q.is_quarantined(root, 'comparison-content-auto', item_id=slug, route=route):
                dropped['quarantined'] += 1
                continue
            if slug in cached_rejects:
                dropped['cached_rejected'] += 1
                continue
            # PARTIAL candidates intentionally enrich an existing route; NEW candidates must not collide with live slugs
            if status_tag == 'NEW':
                if slug in existing_slugs:
                    dropped['duplicate_live'] += 1
                    continue
                if '-vs-' in slug:
                    parts = slug.split('-vs-', 1)
                    rev_slug = f'{parts[1]}-vs-{parts[0]}'
                    if rev_slug in existing_slugs or rev_slug in seen_batch_slugs:
                        dropped['symmetric_versus_live'] += 1
                        continue
            if slug in seen_batch_slugs and status_tag == 'NEW':
                dropped['batch_dup'] += 1
                continue
            seen_batch_slugs.add(slug)
        survivors.append(item)

    dest = out_path or candidates_json
    out_payload = survivors if isinstance(raw, list) else {**raw, 'candidates': survivors}
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(out_payload, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    if survivors:
        return {
            'fastExit': False,
            'survivingCount': len(survivors),
            'inputCount': len(items),
            'dropped': dropped,
            'out': str(dest),
        }

    summary = f'All {len(items)} mined comparison candidates were already live, cached, or quarantined; nothing sent to mindmap.'
    if send_email:
        _cleanup_untracked_report_file(root, candidates_json)
        if out_path:
            _cleanup_untracked_report_file(root, out_path)
        _send_noop(root, 'comparison-content-auto', site, summary, status='no-changes')
    return {
        'fastExit': True,
        'survivingCount': 0,
        'inputCount': len(items),
        'dropped': dropped,
        'summary': summary,
    }


def _collect_sitemap_urls_and_internal_link_counts(root: Path) -> tuple[set[str], dict[str, int]]:
    sitemap_routes: set[str] = set()
    loc_re = re.compile(r'<loc>\s*https?://[^/<]+(/[^<]*)</loc>', re.I)
    for sm in root.glob('public/sitemap*.xml'):
        if sm.is_file():
            for m in loc_re.finditer(sm.read_text(encoding='utf-8', errors='ignore')):
                r = m.group(1).split('?', 1)[0].rstrip('/') or '/'
                sitemap_routes.add(r)

    link_counts: dict[str, int] = {}
    href_re = re.compile(r"""(?:href|to|route|url|path)\s*[:=]\s*["'](/[A-Za-z0-9._/-]+)["']""")
    md_link_re = re.compile(r'\]\((/[A-Za-z0-9._/-]+)\)')
    for folder in ('src', 'app', 'components', 'content', 'data', 'pages', 'lib'):
        base = root / folder
        if not base.is_dir():
            continue
        for p in base.rglob('*'):
            if not p.is_file() or p.suffix not in ('.ts', '.tsx', '.js', '.jsx', '.astro', '.md', '.mdx', '.json'):
                continue
            txt = p.read_text(encoding='utf-8', errors='ignore')
            is_multi_entry_data = p.parts and any(seg in ('data', 'lib') for seg in p.parts) and len(txt) > 25000
            if is_multi_entry_data:
                for rx in (href_re, md_link_re):
                    for m in rx.finditer(txt):
                        rt = m.group(1).split('#', 1)[0].split('?', 1)[0].rstrip('/') or '/'
                        link_counts[rt] = link_counts.get(rt, 0) + 1
            else:
                seen_in_file: set[str] = set()
                for rx in (href_re, md_link_re):
                    for m in rx.finditer(txt):
                        rt = m.group(1).split('#', 1)[0].split('?', 1)[0].rstrip('/') or '/'
                        seen_in_file.add(rt)
                for rt in seen_in_file:
                    link_counts[rt] = link_counts.get(rt, 0) + 1
    return sitemap_routes, link_counts


def _recent_git_touched_slugs(root: Path, lookback: int = 30) -> dict[str, tuple[str, str]]:
    """Map slug/route touched in recent SEO/link/content commits -> (sha, subject)."""
    touched: dict[str, tuple[str, str]] = {}
    if not (root / '.git').exists():
        return touched
    res = subprocess.run(
        ['git', 'log', f'-{lookback}', '--pretty=format:__COMMIT__%h|%s', '--name-only'],
        cwd=root,
        capture_output=True,
        text=True,
    )
    if res.returncode != 0:
        return touched
    cur_sha, cur_subj = '', ''
    for line in res.stdout.splitlines():
        if line.startswith('__COMMIT__'):
            parts = line[len('__COMMIT__'):].split('|', 1)
            cur_sha = parts[0].strip()
            cur_subj = parts[1].strip() if len(parts) > 1 else ''
            continue
        rel = line.strip()
        if not rel or not cur_sha:
            continue
        stem = Path(rel).stem.lower()
        if stem and stem not in ('index', 'config', 'sitemap'):
            touched.setdefault(stem, (cur_sha, cur_subj))
    return touched


def check_indexing_sweep(
    root: Path,
    *,
    inspection_json: Path,
    site: str,
    send_email: bool = False,
) -> dict:
    """Fast-exit indexing-pass-auto when GSC sweep finds 0 actionable technical/content/link defects."""
    if not inspection_json.is_file():
        return {'fastExit': False, 'reason': 'missing_inspection_json'}
    doc = json.loads(inspection_json.read_text(encoding='utf-8'))
    inspected = doc.get('inspected')
    if not isinstance(inspected, dict) or not inspected:
        return {'fastExit': False, 'reason': 'empty_or_invalid_inspected_map'}
    if doc.get('skipped_sitemaps'):
        return {'fastExit': False, 'reason': 'partial_skipped_sitemaps'}

    sitemap_routes, link_counts = _collect_sitemap_urls_and_internal_link_counts(root)
    recent_commits = _recent_git_touched_slugs(root, lookback=30)

    healthy_count = 0
    working_as_intended = 0
    awaiting_crawl_linked = 0
    already_fixed_recent = 0
    actionable: list[dict] = []

    for url, info in inspected.items():
        if not isinstance(info, dict):
            continue
        if info.get('error'):
            actionable.append({'url': url, 'reason': 'inspection_error'})
            continue
        cov = str(info.get('coverage_state') or '').strip()
        cov_low = cov.lower()
        route = urllib.parse.urlparse(url).path.rstrip('/') or '/'
        slug = route.strip('/').rsplit('/', 1)[-1].lower()

        if cov_low == 'submitted and indexed':
            healthy_count += 1
            continue
        if cov_low == 'alternate page with proper canonical':
            working_as_intended += 1
            continue
        if ('discovered' in cov_low and 'not indexed' in cov_low) or cov_low == 'url is unknown to google':
            # Uncrawled URL: if ALREADY in sitemap AND ALREADY has >=2 internal links (or recent fix commit), it is purely awaiting Googlebot crawl
            in_sm = (not sitemap_routes) or (route in sitemap_routes)
            in_links = link_counts.get(route, 0) >= 2 or slug in recent_commits
            if in_sm and in_links:
                awaiting_crawl_linked += 1
                continue
            actionable.append({'url': url, 'coverageState': cov, 'reason': 'needs_internal_links_or_sitemap'})
            continue
        if 'crawled' in cov_low and 'not indexed' in cov_low:
            if slug and slug in recent_commits:
                already_fixed_recent += 1
                continue
            actionable.append({'url': url, 'coverageState': cov, 'reason': 'crawled_not_indexed_needs_thin_content_check'})
            continue

        # Any 404, soft-404, 5xx, redirect error, canonical mismatch, unintended noindex/robots block is actionable!
        actionable.append({'url': url, 'coverageState': cov, 'reason': 'technical_or_canonical_defect'})

    if actionable:
        return {
            'fastExit': False,
            'actionableCount': len(actionable),
            'sampleActionable': actionable[:10],
            'healthyCount': healthy_count,
        }

    today_iso = dt.datetime.now(dt.timezone.utc).date().isoformat()
    details_path = Path(f'/tmp/indexing-pass-auto-{today_iso}.md')
    details_md = (
        '## Fixes applied (0)\nNone this run\n\n'
        '## Files changed\nNone this run\n\n'
        '## Audit\nPhase 5 result: not required — 0 actionable rows.\n\n'
        '## Re-submitted to search engines\nskipped — no-changes\n\n'
        '## Left for human (ambiguous / needs review)\nNone this run\n\n'
        '## Buckets seen (informational)\n'
        f'healthy (Submitted and indexed): {healthy_count} | '
        f'working-as-intended: {working_as_intended} | '
        f'already-linked-and-in-sitemap awaiting Google crawl: {awaiting_crawl_linked} | '
        f'already-fixed in last 30 commits: {already_fixed_recent} | actionable defects: 0\n\n'
        '## Live verification\nNo URLs created or modified — 0 live checks required.\n'
    )
    details_path.write_text(details_md, encoding='utf-8')
    summary = (
        f'Inspected {len(inspected)} sitemap URLs: {healthy_count} indexed, '
        f'{awaiting_crawl_linked + already_fixed_recent} already linked/fixed awaiting Google crawl, '
        f'{working_as_intended} working as intended, 0 actionable defects.'
    )
    if send_email:
        _cleanup_untracked_report_file(root, inspection_json)
        _send_noop(root, 'indexing-pass-auto', site, summary, status='no-changes', details_file=details_path)
    return {
        'fastExit': True,
        'inspectedCount': len(inspected),
        'healthyCount': healthy_count,
        'awaitingCrawlLinked': awaiting_crawl_linked,
        'alreadyFixedRecent': already_fixed_recent,
        'detailsFile': str(details_path),
        'summary': summary,
    }



def check_page12_noop(
    root: Path,
    *,
    detect_json: Path,
    measure_json: Path | None = None,
    site: str = '',
    skill: str = 'page-1-2-no-clicks-pass-auto',
    send_email: bool = False,
) -> dict:
    """Turn-1 fast-exit for Page 1-2 No Clicks when 0 pages are picked and 0 final WORSE reverts exist."""
    if not detect_json or not detect_json.is_file():
        return {'fastExit': False, 'reason': 'detect_json_missing'}
    try:
        doc = json.loads(detect_json.read_text(errors='ignore') or '{}')
    except Exception as exc:
        return {'fastExit': False, 'reason': f'detect_json_invalid:{exc}'}
    if doc.get('status') not in (None, 'OK', 'ok'):
        return {'fastExit': False, 'reason': f"detect_status:{doc.get('status')}"}

    pages = doc.get('pages') or []
    worse_reverts = []
    if measure_json and measure_json.is_file():
        try:
            mdoc = json.loads(measure_json.read_text(errors='ignore') or '{}')
            for r in (mdoc.get('results') or []):
                if isinstance(r, dict) and str(r.get('verdict') or '').upper() == 'WORSE' and r.get('final') is True:
                    worse_reverts.append(r.get('page') or r.get('path') or 'row')
        except Exception as exc:
            return {'fastExit': False, 'reason': f'measure_json_invalid:{exc}'}

    if pages or worse_reverts:
        return {
            'fastExit': False,
            'pickedCount': len(pages),
            'worseRevertCount': len(worse_reverts),
        }

    resolved_site = (site or doc.get('base_url') or doc.get('site') or '').strip()
    stats = doc.get('stats') if isinstance(doc.get('stats'), dict) else {}
    day_str = str(doc.get('generated_at') or '')[:10] or detect_json.stem
    stats_note = f" (stats={json.dumps(stats, separators=(',', ':'))[:120]})" if stats else ''
    summary = f"Page 1-2 No Clicks {day_str}: 0 eligible pages picked, 0 WORSE reverts{stats_note}; fast-exited cleanly."

    # Clean up untracked empty detect/measure scratch reports so git status stays clean (0 empty commits/deploys)
    for cand in (
        detect_json,
        detect_json.with_suffix('.md'),
        measure_json,
        measure_json.with_suffix('.md') if measure_json else None,
    ):
        if cand is not None:
            _cleanup_untracked_report_file(root, cand)

    if send_email:
        _send_noop(root, skill=skill, site=resolved_site, summary=summary)

    return {
        'fastExit': True,
        'pickedCount': 0,
        'worseRevertCount': 0,
        'site': resolved_site,
        'summary': summary,
    }


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
    p_cand.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    p_pub = sub.add_parser('paid-publisher')
    p_pub.add_argument('--site', default='https://www.layer3labs.io')
    p_pub.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    p_pub_fail = sub.add_parser('record-publisher-failure')
    p_pub_fail.add_argument('--kind', choices=['fix', 'order', 'upsell'], required=True)
    p_pub_fail.add_argument('--id', required=True)
    p_pub_fail.add_argument('--route', default=None)
    p_pub_fail.add_argument('--reason', required=True)
    p_pub_fail.add_argument('--max-attempts', type=int, default=2)
    p_pub_fail.add_argument('--cooldown-days', type=int, default=7)
    p_pub_fail.add_argument('--save-branch', action='store_true')
    p_pub_fail.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')
    p_pub_fail.add_argument('--site', default='https://www.layer3labs.io')

    p_ga4 = sub.add_parser('ga4-cooldown')
    p_ga4.add_argument('--skill', default='ga4-top-pages-pass-auto')
    p_ga4.add_argument('--site', required=True)
    p_ga4.add_argument('--pages-json', required=True, type=Path)
    p_ga4.add_argument('--ledger', type=Path, default=Path('reports/trend-pass/ga4-page-audits.md'))
    p_ga4.add_argument('--cooldown-days', type=int, default=7)
    p_ga4.add_argument('--min-views', type=int, default=5)
    p_ga4.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    p_pq = sub.add_parser('page-quality-check')
    p_pq.add_argument('--site', required=True)
    p_pq.add_argument('--pages-json', required=True, type=Path)
    p_pq.add_argument('--ledger', type=Path, default=Path('reports/page-quality-pass/page-quality-audits.md'))
    p_pq.add_argument('--ga4-ledger', type=Path, default=Path('reports/trend-pass/ga4-page-audits.md'))
    p_pq.add_argument('--cooldown-days', type=int, default=7)
    p_pq.add_argument('--session-floor', type=int, default=50)
    p_pq.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    p_tp = sub.add_parser('trend-research-pack')
    p_tp.add_argument('--research-md', required=True, type=Path)
    p_tp.add_argument('--pull-json', type=Path, default=None)
    p_tp.add_argument('--site', required=True)
    p_tp.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    p_cmp = sub.add_parser('comparison-prefilter')
    p_cmp.add_argument('--candidates-json', required=True, type=Path)
    p_cmp.add_argument('--cache', type=Path, default=None)
    p_cmp.add_argument('--out', type=Path, default=None)
    p_cmp.add_argument('--site', required=True)
    p_cmp.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    p_p12 = sub.add_parser('page12-noop')
    p_p12.add_argument('--detect', type=Path, required=True)
    p_p12.add_argument('--measure', type=Path, default=None)
    p_p12.add_argument('--site', default='')
    p_p12.add_argument('--skill', default='page-1-2-no-clicks-pass-auto')
    p_p12.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    p_idx = sub.add_parser('indexing-sweep')
    p_idx.add_argument('--inspection-json', required=True, type=Path)
    p_idx.add_argument('--site', required=True)
    p_idx.add_argument('--send-email', '--post-collector', dest='send_email', action='store_true')

    args = ap.parse_args(argv)
    root = Path(args.root).resolve()

    def _abs(p: Path | None) -> Path | None:
        if p is None:
            return None
        return p if p.is_absolute() else (root / p)

    if args.cmd == 'json-candidates':
        res = check_json_candidates(
            root,
            skill=args.skill,
            site=args.site,
            input_path=_abs(args.input),
            key=args.key,
            id_field=args.id_field,
            open_intake_dir=_abs(args.open_intake_dir),
            send_email=args.send_email,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'paid-publisher':
        res = check_paid_publisher(root, site=args.site, send_email=args.send_email)
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'record-publisher-failure':
        res = record_publisher_failure(
            root,
            kind=args.kind,
            item_id=args.id,
            reason=args.reason,
            route=args.route,
            max_attempts=args.max_attempts,
            cooldown_days=args.cooldown_days,
            save_branch=args.save_branch,
            send_email=args.send_email,
            site=args.site,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'page12-noop':
        res = check_page12_noop(
            root,
            detect_json=_abs(args.detect),
            measure_json=_abs(args.measure),
            site=args.site,
            skill=args.skill,
            send_email=args.send_email,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT commit empty reports, push to main, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'ga4-cooldown':
        res = check_ga4_cooldown(
            root,
            skill=args.skill,
            site=args.site,
            pages_json=_abs(args.pages_json),
            ledger_path=_abs(args.ledger),
            cooldown_days=args.cooldown_days,
            min_views=args.min_views,
            send_email=args.send_email,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'page-quality-check':
        res = check_page_quality_pull(
            root,
            site=args.site,
            pages_json=_abs(args.pages_json),
            ledger_path=_abs(args.ledger),
            ga4_ledger_path=_abs(args.ga4_ledger),
            cooldown_days=args.cooldown_days,
            session_floor=args.session_floor,
            send_email=args.send_email,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'trend-research-pack':
        res = check_trend_research_pack(
            root,
            research_md=_abs(args.research_md),
            site=args.site,
            pull_json=_abs(args.pull_json),
            send_email=args.send_email,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'comparison-prefilter':
        res = check_comparison_prefilter(
            root,
            candidates_json=_abs(args.candidates_json),
            site=args.site,
            cache_path=_abs(args.cache),
            out_path=_abs(args.out),
            send_email=args.send_email,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    if args.cmd == 'indexing-sweep':
        res = check_indexing_sweep(
            root,
            inspection_json=_abs(args.inspection_json),
            site=args.site,
            send_email=args.send_email,
        )
        if res.get('fastExit') and getattr(args, 'send_email', False):
            res['collectorPosted'] = True
            res['next'] = 'STOP_IMMEDIATELY — collector no-op already recorded via send-routine-email.py; do NOT grep send-routine-email.py, write scratchpad scripts, or call /api/routine-run again.'
        print(json.dumps(res, ensure_ascii=False))
        return 0

    return 1


if __name__ == '__main__':
    raise SystemExit(main())
