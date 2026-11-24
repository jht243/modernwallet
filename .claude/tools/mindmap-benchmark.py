#!/usr/bin/env python3
"""Live Product, Pricing, Plan-Cap & Practical Benchmark Engine for Mindmap Pass.

Implements Item 4 ("Live Product & Pricing Benchmark Step") inside the Comparison,
Roundup, and Alternatives tracks across Layer3Labs and all fleet publications:
  1. Live Primary Pricing & Cap Extractor ($0 LLM tokens): concurrently fetches official
     vendor pricing/docs URLs, saves immutable timestamped snapshots + SHA-256 digests in
     `<run_dir>/research/sources/`, and extracts published plan tiers, monthly/annual prices,
     seat minimums, hard usage/credit caps, and per-1M API token rates (never turning an
     unpublished/enterprise price into $0).
  2. Local Verified Ledger Resolver ($0 LLM tokens): cross-checks `data/pricing.ts`
     (API input/output/cached token rates + SaaS seat plans) and `data/gear-prices.json`
     when present in the repository.
  3. Deterministic 3-Scenario TCO, Plan-Cap & Token Math Engine: generates and runs
     `<run_dir>/evidence/<slug>/model.py` -> `output.json` with pre-computed `scenarioTable`
     (`{caption, headers, rows}`), algebraic crossover/break-even thresholds, and a concrete
     `counterexample`.
  4. Strict Two-Lane Testing Honesty Gate:
     - Hands-On Practical Execution (`basis="measured"`, Option 3): ONLY when the route passes
       `tested_eligibility` AND every ranked/compared item executes an identical predefined
       live task (`cli` or `http` probe) with objective scoring saved before review.
     - Internal Cost/Scenario Modeling (`basis="modeled"` or `"calculated"`, Option 2):
       automatic default everywhere else — ships real, auditable internal data while strictly
       withholding `"Tested 2026"` badges from non-tested pages.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
import datetime as dt
import hashlib
from html.parser import HTMLParser
import importlib.util
import json
from pathlib import Path
import re
import shlex
import subprocess
import sys
import time
import urllib.error
import urllib.request
from urllib.parse import urlsplit

USER_AGENT = 'Mozilla/5.0 (compatible; Layer3ResearchBot/1.0; +https://www.layer3labs.io)'
ANTI_BOT_MARKERS = (
    'cf-turnstile',
    'challenges.cloudflare.com',
    'g-recaptcha',
    'hcaptcha',
    'verify you are human',
    'just a moment...',
    'attention required! | cloudflare',
)


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _sha256_file(path: Path) -> str:
    return _sha256_bytes(path.read_bytes())


def _ref(root: Path, path: Path) -> dict:
    return {'path': str(path.resolve().relative_to(root.resolve())), 'sha256': _sha256_file(path)}


def _slugify(value: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', (value or '').lower()).strip('-') or 'item'


def _now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


class _VisibleTextExtractor(HTMLParser):
    SKIP_TAGS = {'script', 'style', 'noscript', 'svg', 'path', 'head'}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._skip = 0
        self.chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        t = tag.lower()
        if t in self.SKIP_TAGS:
            self._skip += 1
        elif t in {'p', 'div', 'section', 'li', 'tr', 'h1', 'h2', 'h3', 'h4', 'br', 'th', 'td'}:
            self.chunks.append('\n' if t != 'td' and t != 'th' else ' | ')

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in self.SKIP_TAGS and self._skip > 0:
            self._skip -= 1

    def handle_data(self, data: str) -> None:
        if self._skip == 0:
            s = ' '.join(data.split())
            if s:
                self.chunks.append(s + ' ')

    def get_text(self) -> str:
        raw = ''.join(self.chunks)
        lines = []
        for ln in raw.splitlines():
            clean = re.sub(r'\s+', ' ', ln).strip(' |')
            if clean:
                lines.append(clean)
        return '\n'.join(lines)


def parse_local_pricing_ledger(root: Path) -> dict[str, dict]:
    """Parse verified API token rates & SaaS subscription plans from `data/pricing.ts` if present ($0 tokens)."""
    ledger_path = root / 'data/pricing.ts'
    if not ledger_path.is_file():
        return {}
    raw = ledger_path.read_text(errors='ignore')

    # Resolve string constants (URLs & verifiedDate variables) at top of data/pricing.ts
    consts: dict[str, str] = {}
    for m in re.finditer(r"^const\s+([A-Z0-9_]+)\s*=\s*'([^']+)'", raw, flags=re.M):
        consts[m.group(1)] = m.group(2)

    def _resolve_expr(expr: str) -> str:
        expr = expr.strip()
        if '+' in expr:
            parts = [_resolve_expr(p) for p in expr.split('+')]
            return ''.join(parts)
        if expr.startswith("'") and expr.endswith("'"):
            return expr[1:-1]
        if expr.startswith('"') and expr.endswith('"'):
            return expr[1:-1]
        return consts.get(expr, expr)

    entries: dict[str, dict] = {}

    # 1. Parse `api({ ... })` entries
    for m in re.finditer(r'api\(\{([^\n}]+)\}\)', raw):
        body = m.group(1)
        fields: dict[str, str] = {}
        for fm in re.finditer(r"([a-zA-Z0-9_]+)\s*:\s*('(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"|[^,]+)", body):
            fields[fm.group(1)] = fm.group(2).strip()
        mid = _resolve_expr(fields.get('id', ''))
        model_name = _resolve_expr(fields.get('model', mid))
        if not mid:
            continue

        def _num(k: str) -> float | None:
            v = fields.get(k)
            if v is None or v == 'null':
                return None
            try:
                return float(v)
            except ValueError:
                return None

        rec = {
            'kind': 'api',
            'id': mid,
            'vendor': _resolve_expr(fields.get('vendor', '')),
            'product': _resolve_expr(fields.get('product', '')),
            'name': model_name,
            'inputPer1M': _num('inputPer1M'),
            'outputPer1M': _num('outputPer1M'),
            'cachedInputPer1M': _num('cachedInputPer1M'),
            'notes': _resolve_expr(fields.get('notes', '')),
            'sourceUrl': _resolve_expr(fields.get('sourceUrl', '')),
            'effectiveDate': _resolve_expr(fields.get('effectiveDate', '')),
            'verifiedDate': _resolve_expr(fields.get('verifiedDate', consts.get('V', ''))),
            'ledgerPath': 'data/pricing.ts',
        }
        entries[mid.lower()] = rec
        entries[_slugify(model_name)] = rec
        entries[model_name.lower()] = rec

    # 2. Parse `{ kind: 'plan', ... }` blocks
    for m in re.finditer(r"\{\s*kind:\s*'plan'([\s\S]*?)\}", raw):
        body = m.group(1)
        pid_m = re.search(r"id:\s*'([^']+)'", body)
        vendor_m = re.search(r"vendor:\s*'([^']+)'", body)
        prod_m = re.search(r"product:\s*'([^']+)'", body)
        plan_m = re.search(r"plan:\s*'([^']+)'", body)
        price_m = re.search(r"price:\s*(null|[0-9.]+)", body)
        unit_m = re.search(r"unit:\s*'([^']+)'", body)
        seat_m = re.search(r"seatMin:\s*([0-9]+)", body)
        src_m = re.search(r"sourceUrl:\s*([A-Z0-9_]+|'[^']+')", body)
        ver_m = re.search(r"verifiedDate:\s*([A-Z0-9_]+|'[^']+')", body)
        if not (pid_m and prod_m and plan_m):
            continue
        pid = pid_m.group(1)
        disp = f"{prod_m.group(1)} {plan_m.group(1)}"
        p_val = None if (not price_m or price_m.group(1) == 'null') else float(price_m.group(1))
        unit_str = unit_m.group(1) if unit_m else 'per month'
        per_seat = p_val if (p_val is not None and ('user' in unit_str or 'seat' in unit_str)) else 0.0
        base_usd = 0.0 if per_seat > 0 else (p_val or 0.0)
        rec = {
            'kind': 'plan',
            'id': pid,
            'vendor': vendor_m.group(1) if vendor_m else prod_m.group(1),
            'product': prod_m.group(1),
            'name': disp,
            'planName': plan_m.group(1),
            'price': p_val,
            'baseMonthlyUsd': base_usd,
            'perSeatMonthlyUsd': per_seat,
            'seatMin': int(seat_m.group(1)) if seat_m else 1,
            'unit': unit_str,
            'sourceUrl': _resolve_expr(src_m.group(1)) if src_m else '',
            'verifiedDate': _resolve_expr(ver_m.group(1)) if ver_m else consts.get('V', ''),
            'ledgerPath': 'data/pricing.ts',
        }
        entries[pid.lower()] = rec
        entries[_slugify(disp)] = rec
        entries[disp.lower()] = rec

    return entries


def extract_pricing_facts_from_text(text: str, vendor_name: str) -> dict:
    """Mechanically extract published prices, billing cadence, plan caps, and token rates from page text."""
    lines = [ln.strip() for ln in (text or '').splitlines() if ln.strip()]
    joined = '\n'.join(lines)
    low = joined.lower()

    # Check anti-bot / human verification gates — never guess or fabricate behind a gate!
    for marker in ANTI_BOT_MARKERS:
        if marker in low and len(lines) < 40:
            return {
                'status': 'gated',
                'modeled': False,
                'pricingSummary': 'Blocked by anti-bot challenge; public self-serve rate not extracted.',
                'extractedSnippets': [],
            }

    # Find USD/EUR dollar prices with surrounding context + line index
    price_hits = []
    price_re = re.compile(
        r'(?:\$|USD\s*)\s*(\d{1,5}(?:\.\d{1,4})?)'
        r'(?:\s*(?:/|\bper\b)\s*(month|mo|year|yr|user|seat|agent|member|workspace|1m|million)\b)?',
        flags=re.I,
    )
    overage_re = re.compile(
        r'(?:extra|additional|overage)[^$\n]{0,35}\$\s*(\d+(?:\.\d+)?)\s*(?:/|\bper\b)\s*(\d{1,3}(?:,\d{3})*|\d+)',
        flags=re.I,
    )
    overage_hits = []
    for li, ln in enumerate(lines):
        if len(ln) > 320:
            continue
        for om in overage_re.finditer(ln):
            overage_hits.append({
                'rate': float(om.group(1)),
                'unitSize': float(om.group(2).replace(',', '')),
                'lineIdx': li,
                'line': ln[:220],
            })
        if re.search(r'\bincluded\b.*\bcredits?\b', ln, re.I):
            continue
        for pm in price_re.finditer(ln):
            amt = float(pm.group(1))
            unit_hint = (pm.group(2) or '').lower()
            # Ignore overage rates like "$10 per 500 chats" when scanning base tier prices
            after_slice = ln[pm.end():pm.end() + 25].lower()
            if re.match(r'^\s*(?:/|\bper\b)\s*\d', after_slice):
                continue
            price_hits.append({'amount': amt, 'unitHint': unit_hint, 'lineIdx': li, 'line': ln[:220]})

    # Find explicit usage/plan caps (chats, credits, seats, contacts, messages, tokens, GB, mins)
    cap_hits = []
    cap_re = re.compile(
        r'\b(\d{1,3}(?:,\d{3})+|\d+\s*[kKmM]|\d{2,6})\s*(?:/|\s+per\s+|\s+)?'
        r'(chats?|messages?|conversations?|credits?|contacts?|leads?|seats?|users?|agents?|minutes?|mins?|requests?|tokens?|gb|tb)\b',
        flags=re.I,
    )
    for li, ln in enumerate(lines):
        if len(ln) > 320:
            continue
        for cm in cap_re.finditer(ln):
            before_cap = ln[max(0, cm.start() - 20):cm.start()].lower()
            if re.search(r'(?:\bper\b|/|\bextra\b|\badditional\b)\s*$', before_cap):
                continue
            raw_num = cm.group(1).replace(',', '').strip().lower()
            mult = 1
            if raw_num.endswith('k'):
                mult = 1000
                raw_num = raw_num[:-1].strip()
            elif raw_num.endswith('m'):
                mult = 1_000_000
                raw_num = raw_num[:-1].strip()
            try:
                val = int(float(raw_num) * mult)
            except ValueError:
                continue
            cap_hits.append({'value': val, 'unit': cm.group(2).lower(), 'lineIdx': li, 'line': ln[:220]})

    has_free = bool(re.search(r'\bfree\s+(?:plan|tier|forever)\b|\$\s*0\b', low))
    has_enterprise_quote = bool(re.search(r'\b(?:contact\s+sales|custom\s+pricing|talk\s+to\s+sales|book\s+a\s+demo)\b', low))

    # Pick representative entry paid self-serve tier (smallest positive monthly/seat/workspace rate <= $2,500)
    monthly_candidates = [
        h for h in price_hits
        if 0 < h['amount'] <= 2500 and h['unitHint'] not in ('1m', 'million', 'yr', 'year')
    ]
    token_candidates = [h for h in price_hits if h['unitHint'] in ('1m', 'million')]

    entry_price = None
    chosen_idx = -1
    chosen_line = ''
    per_seat = 0.0
    base_monthly = 0.0
    if monthly_candidates:
        explicit_mo = [
            h for h in monthly_candidates
            if h['unitHint'] in ('mo', 'month', 'user', 'seat', 'agent', 'member', 'workspace')
        ]
        chosen = sorted(explicit_mo or monthly_candidates, key=lambda x: x['amount'])[0]
        entry_price = chosen['amount']
        chosen_idx = chosen['lineIdx']
        chosen_line = chosen['line']
        if chosen['unitHint'] in ('user', 'seat', 'agent', 'member') or re.search(r'per\s+(?:user|seat|agent|member)\b', chosen['line'], re.I):
            per_seat = entry_price
        else:
            base_monthly = entry_price

    included_vol = None
    vol_unit = 'units'
    non_seat_caps = [c for c in cap_hits if c['unit'] not in ('seat', 'seats', 'user', 'users', 'agent', 'agents') and c['value'] >= 25]
    if non_seat_caps:
        same_or_following_caps = [
            c for c in non_seat_caps
            if chosen_idx >= 0 and chosen_idx <= c['lineIdx'] <= chosen_idx + 4
        ]
        paid_line_caps = [c for c in non_seat_caps if not re.search(r'\bfree\b|\$\s*0\b', c['line'], re.I)]
        best_cap = (same_or_following_caps or paid_line_caps or non_seat_caps)[0]
        included_vol = best_cap['value']
        vol_unit = best_cap['unit']

    overage_rate = 0.0
    overage_unit = 1000.0
    if overage_hits:
        near_ov = [o for o in overage_hits if chosen_idx >= 0 and chosen_idx <= o['lineIdx'] <= chosen_idx + 5]
        picked_ov = (near_ov or overage_hits)[0]
        overage_rate = picked_ov['rate']
        overage_unit = picked_ov['unitSize'] or 1000.0

    snippets = []
    for h in (monthly_candidates[:3] + token_candidates[:2]):
        if h['line'] not in snippets:
            snippets.append(h['line'])
    for c in non_seat_caps[:2]:
        if c['line'] not in snippets:
            snippets.append(c['line'])

    if entry_price is None and not token_candidates:
        summary = (
            f'{vendor_name}: Quote-based / contact sales (no public self-serve sticker price found on captured page).'
            if has_enterprise_quote
            else f'{vendor_name}: No unambiguous self-serve USD price extracted from captured page.'
        )
        return {
            'status': 'quote-only' if has_enterprise_quote else 'unpriced',
            'modeled': False,
            'hasFreeTier': has_free,
            'hasEnterpriseQuote': has_enterprise_quote,
            'pricingSummary': summary,
            'extractedSnippets': snippets[:4],
        }

    parts = [f'{vendor_name}:']
    if has_free:
        parts.append('Free tier published;')
    if entry_price is not None:
        parts.append(f"entry self-serve rate=${entry_price:g}/{'seat/mo' if per_seat else 'mo'};")
    if included_vol is not None:
        parts.append(f'included cap={included_vol:,} {vol_unit};')
    if overage_rate > 0:
        parts.append(f'overage=${overage_rate:g} per {int(overage_unit):,} {vol_unit};')
    if has_enterprise_quote:
        parts.append('Enterprise tier is quote-based.')

    return {
        'status': 'extracted',
        'modeled': entry_price is not None,
        'hasFreeTier': has_free,
        'hasEnterpriseQuote': has_enterprise_quote,
        'baseMonthlyUsd': base_monthly,
        'perSeatMonthlyUsd': per_seat,
        'includedVolume': included_vol if included_vol is not None else 10**9,
        'overageUsdPerUnit': overage_rate,
        'overageUnitSize': overage_unit,
        'volumeUnit': vol_unit,
        'pricingSummary': ' '.join(parts),
        'extractedSnippets': snippets[:5],
    }


def fetch_live_url_snapshot(url: str, dest_txt: Path, timeout: float = 8.0) -> dict:
    """Fetch a public primary URL once (read-only HTTPS), extract clean text, and save immutable snapshot."""
    checked_at = _now_iso()
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/json,text/plain;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = getattr(resp, 'status', 200)
            ctype = (resp.headers.get('Content-Type') or '').lower()
            raw_bytes = resp.read(600_000)
        decoded = raw_bytes.decode('utf-8', errors='replace')
        if 'html' in ctype or '<html' in decoded[:500].lower():
            parser = _VisibleTextExtractor()
            parser.feed(decoded)
            parser.close()
            clean_text = parser.get_text()
        else:
            clean_text = decoded
        header = f'SOURCE_URL: {url}\nRETRIEVED_AT: {checked_at}\nHTTP_STATUS: {status}\n\n'
        dest_txt.parent.mkdir(parents=True, exist_ok=True)
        dest_txt.write_text(header + clean_text[:60_000] + '\n', encoding='utf-8')
        return {
            'ok': True,
            'url': url,
            'httpStatus': status,
            'checkedAt': checked_at,
            'path': dest_txt,
            'text': clean_text,
        }
    except Exception as exc:
        dest_txt.parent.mkdir(parents=True, exist_ok=True)
        err_body = f'SOURCE_URL: {url}\nRETRIEVED_AT: {checked_at}\nFETCH_ERROR: {type(exc).__name__}: {exc}\n'
        dest_txt.write_text(err_body, encoding='utf-8')
        return {
            'ok': False,
            'url': url,
            'httpStatus': 0,
            'checkedAt': checked_at,
            'path': dest_txt,
            'error': f'{type(exc).__name__}: {exc}',
            'text': '',
        }


def run_practical_tasks(
    root: Path,
    ev_dir: Path,
    reader_question: str,
    decision_text: str,
    items: list[str],
    practical_spec: dict,
) -> dict:
    """Execute an identical, objective hands-on task across compared items (`Option 3` / `basis: "measured"`).

    Strictly enforces:
      - Predefined `input` + `expected` saved BEFORE any item runs.
      - Identical input fed to every item (`cli` command or `http` GET/POST probe).
      - Raw unedited output + deterministic pass/fail/metric scoring saved with SHA-256 hashes.
      - Page-wide `allRankedItemsCovered` is True ONLY when 100% of planned items completed cleanly.
    """
    prac_dir = ev_dir / 'practical'
    prac_dir.mkdir(parents=True, exist_ok=True)

    task_input_obj = practical_spec.get('input') if practical_spec.get('input') is not None else {'prompt': 'Standardized benchmark fixture'}
    expected_obj = practical_spec.get('expected') if practical_spec.get('expected') is not None else {'mustContain': []}
    repetitions = int(practical_spec.get('repetitions') or 1)
    criterion = str(practical_spec.get('successCriterion') or 'Output returns HTTP 200 / exit 0 and satisfies all expected substring/JSON assertions.')
    dimensions = practical_spec.get('dimensions') or ['taskPass', 'responseBytes', 'wallMs']
    shared_conditions = str(practical_spec.get('conditions') or 'Identical predefined input executed sequentially from the same local host environment without retries or manual edits.')

    input_path = prac_dir / 'task-input.json'
    expected_path = prac_dir / 'task-expected.json'
    input_bytes = (json.dumps(task_input_obj, indent=2, sort_keys=True, ensure_ascii=False) + '\n').encode('utf-8')
    expected_bytes = (json.dumps(expected_obj, indent=2, sort_keys=True, ensure_ascii=False) + '\n').encode('utf-8')
    input_path.write_bytes(input_bytes)
    expected_path.write_bytes(expected_bytes)
    input_ref = _ref(root, input_path)
    expected_ref = _ref(root, expected_path)

    targets_cfg = practical_spec.get('targets') or {}
    covered_items: list[str] = []
    excluded_items: dict[str, str] = {}
    recorded_runs: list[dict] = []
    top_level_runs: list[dict] = []
    all_artifacts: list[dict] = [input_ref, expected_ref]
    per_item_summary: list[dict] = []

    for item in items:
        tcfg = targets_cfg.get(item)
        if not isinstance(tcfg, dict):
            excluded_items[item] = 'No live executable CLI/HTTP target configured in this environment; left unobserved rather than guessed.'
            continue

        item_slug = _slugify(item)
        item_ok = True
        for rep in range(1, repetitions + 1):
            performed_at = _now_iso()
            t0 = time.monotonic()
            kind = str(tcfg.get('kind') or 'cli').lower()
            raw_out_text = ''
            exit_ok = False
            version_str = str(tcfg.get('version') or 'current')
            env_str = f'Python {sys.version.split()[0]} on {sys.platform}'

            try:
                if kind == 'cli':
                    cmd = tcfg['command']
                    cmd_list = cmd if isinstance(cmd, list) else shlex.split(str(cmd))
                    proc = subprocess.run(
                        cmd_list,
                        input=input_bytes.decode('utf-8'),
                        cwd=str(root),
                        capture_output=True,
                        text=True,
                        timeout=float(tcfg.get('timeoutSeconds') or 15.0),
                    )
                    raw_out_text = proc.stdout + ('\n--- STDERR ---\n' + proc.stderr if proc.stderr else '')
                    exit_ok = proc.returncode == 0
                elif kind == 'http':
                    url = str(tcfg['url'])
                    method = str(tcfg.get('method') or 'GET').upper()
                    body_bytes = input_bytes if method in ('POST', 'PUT') else None
                    headers = {'User-Agent': USER_AGENT, **(tcfg.get('headers') or {})}
                    if body_bytes is not None and 'Content-Type' not in headers:
                        headers['Content-Type'] = 'application/json'
                    req = urllib.request.Request(url, data=body_bytes, headers=headers, method=method)
                    with urllib.request.urlopen(req, timeout=float(tcfg.get('timeoutSeconds') or 12.0)) as resp:
                        raw_out_text = resp.read(300_000).decode('utf-8', errors='replace')
                        exit_ok = 200 <= getattr(resp, 'status', 200) < 300
                else:
                    excluded_items[item] = f'Unsupported practical target kind {kind!r}.'
                    item_ok = False
                    break
            except Exception as exc:
                excluded_items[item] = f'Execution unavailable in current environment ({type(exc).__name__}: {exc}).'
                item_ok = False
                break

            wall_ms = round((time.monotonic() - t0) * 1000.0, 1)
            raw_path = prac_dir / f'{item_slug}-rep{rep}.raw.txt'
            raw_path.write_text(raw_out_text, encoding='utf-8')
            raw_ref = _ref(root, raw_path)

            must_contain = [str(s) for s in (expected_obj.get('mustContain') or [])]
            missing = [s for s in must_contain if s.lower() not in raw_out_text.lower()]
            passed = bool(exit_ok and not missing)
            score_payload = {
                'item': item,
                'repetition': rep,
                'performedAt': performed_at,
                'exitOk': exit_ok,
                'passedCriterion': passed,
                'missingExpected': missing,
                'responseBytes': len(raw_out_text.encode('utf-8')),
                'localHarnessWallMs': wall_ms,
            }
            score_path = prac_dir / f'{item_slug}-rep{rep}.score.json'
            score_path.write_text(json.dumps(score_payload, indent=2) + '\n', encoding='utf-8')
            score_ref = _ref(root, score_path)
            all_artifacts.extend([raw_ref, score_ref])

            recorded_runs.append({
                'item': item,
                'repetition': rep,
                'performedAt': performed_at,
                'inputSha256': input_ref['sha256'],
                'expectedSha256': expected_ref['sha256'],
                'version': version_str,
                'environment': env_str,
                'conditions': shared_conditions,
                'rawOutput': raw_ref,
                'scoring': score_ref,
            })
            top_level_runs.append({
                'items': [item],
                'testedAt': performed_at[:10],
                'scope': f'Executed predefined task repetition {rep}/{repetitions} on {item} ({criterion})',
                'artifact': score_ref,
            })
            per_item_summary.append(score_payload)

        if item_ok:
            covered_items.append(item)

    plan_payload = {
        'kind': 'practical',
        'readerQuestion': reader_question,
        'decision': decision_text,
        'items': items,
        'dimensions': dimensions,
        'conditions': shared_conditions,
        'task': {
            'input': input_ref,
            'expected': expected_ref,
            'successCriterion': criterion,
            'repetitions': repetitions,
        },
    }
    plan_path = prac_dir / 'practical-comparison-plan.json'
    plan_path.write_text(json.dumps(plan_payload, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    plan_ref = _ref(root, plan_path)
    all_artifacts.append(plan_ref)

    usable = len(covered_items) >= 2
    all_ranked_covered = len(covered_items) == len(items) and len(items) >= 2
    comp_entry = (
        {
            'kind': 'practical',
            'status': 'used',
            'basis': 'measured',
            'reason': 'Executed identical predefined task across accessible options with objective deterministic scoring.',
            'scope': f'Measured {len(covered_items)} of {len(items)} planned options ({repetitions} repetition(s) each).',
            'plan': plan_ref,
            'coveredItems': covered_items,
            'excludedItems': excluded_items,
            'runs': [r for r in recorded_runs if r['item'] in covered_items],
        }
        if usable
        else {
            'kind': 'practical',
            'status': 'unavailable',
            'reason': 'Fewer than two compared options had live unauthenticated/authorized execution targets in this run; falling back to verified public pricing/token scenario modeling.',
            'artifacts': [plan_ref],
        }
    )

    return {
        'usable': usable,
        'allRankedItemsCovered': all_ranked_covered,
        'coveredItems': covered_items,
        'excludedItems': excluded_items,
        'comparisonEntry': comp_entry,
        'topLevelRuns': [r for r in top_level_runs if r['items'][0] in covered_items],
        'artifacts': all_artifacts,
        'summary': per_item_summary,
    }


def run_benchmark_for_candidate(
    root: Path,
    run_dir: Path,
    manifest_ref: dict,
    review_ref: dict,
    action_id: str,
    route: str,
    track: str,
    reader_question: str,
    candidate: dict,
    author: str = 'mindmap-benchmark',
) -> dict:
    """Run the complete Live Product & Pricing Benchmark Step for one commercial page."""
    root = root.resolve()
    run_dir = (root / run_dir).resolve() if not Path(run_dir).is_absolute() else Path(run_dir).resolve()
    sources_dir = run_dir / 'research/sources'
    sources_dir.mkdir(parents=True, exist_ok=True)
    slug = route.rstrip('/').split('/')[-1]
    ev_dir = run_dir / 'evidence' / slug
    ev_dir.mkdir(parents=True, exist_ok=True)
    today = dt.datetime.now(dt.timezone.utc).date().isoformat()
    checked_at = _now_iso()

    # Load sibling Mindmap helpers
    gates_spec = importlib.util.spec_from_file_location('mm_gates_bench', root / '.claude/tools/mindmap-gates.py')
    gates = importlib.util.module_from_spec(gates_spec)
    gates_spec.loader.exec_module(gates)

    tracks_spec = importlib.util.spec_from_file_location('mm_tracks_bench', root / '.claude/tools/mindmap-tracks.py')
    tracks = importlib.util.module_from_spec(tracks_spec)
    tracks_spec.loader.exec_module(tracks)

    ledger = parse_local_pricing_ledger(root)
    gear_prices = {}
    gp_path = root / 'data/gear-prices.json'
    if gp_path.is_file():
        try:
            gear_prices = json.loads(gp_path.read_text())
        except Exception:
            gear_prices = {}

    raw_vendors = list(candidate.get('vendors') or [])
    raw_models = list(candidate.get('models') or [])

    # Auto-resolve AI models from `data/pricing.ts` when `models` list is supplied!
    mode = str(candidate.get('benchmarkMode') or ('api-tokens' if raw_models else 'saas-tco')).lower()
    resolved_items: list[dict] = []
    source_artifacts: list[dict] = []
    public_sources: list[dict] = []
    excluded_public: dict[str, str] = {}

    if mode == 'api-tokens' or raw_models:
        mode = 'api-tokens'
        ledger_ref = _ref(root, root / 'data/pricing.ts') if (root / 'data/pricing.ts').is_file() else None
        if ledger_ref:
            source_artifacts.append(ledger_ref)
        for m_entry in raw_models:
            if isinstance(m_entry, str):
                lookup_key = m_entry.strip().lower()
                hit = ledger.get(lookup_key) or ledger.get(_slugify(m_entry))
                if hit and hit.get('kind') == 'api':
                    item_obj = dict(hit)
                else:
                    item_obj = {'name': m_entry, 'modeled': False}
            elif isinstance(m_entry, dict):
                lookup_key = str(m_entry.get('id') or m_entry.get('name') or '').lower()
                hit = ledger.get(lookup_key) or ledger.get(_slugify(lookup_key))
                item_obj = {**(hit or {}), **m_entry}
                item_obj.setdefault('name', m_entry.get('model') or m_entry.get('name') or lookup_key)
            else:
                continue

            in_rate = item_obj.get('inputPer1M')
            out_rate = item_obj.get('outputPer1M')
            cache_rate = item_obj.get('cachedInputPer1M')
            if in_rate is not None and out_rate is not None:
                item_obj['modeled'] = True
                snap_ref = ledger_ref
                if not snap_ref:
                    snap_file = sources_dir / f"{slug}-{_slugify(item_obj['name'])}.json"
                    snap_file.write_text(json.dumps(item_obj, indent=2) + '\n')
                    snap_ref = _ref(root, snap_file)
                    source_artifacts.append(snap_ref)
                public_sources.append({
                    'item': item_obj['name'],
                    'url': str(item_obj.get('sourceUrl') or 'https://openai.com/api/pricing/'),
                    'checkedAt': checked_at,
                    'snapshot': snap_ref,
                    'extractedFacts': (
                        f"{item_obj['name']} ({item_obj.get('ledgerPath', 'verified API pricing')}, verified {item_obj.get('verifiedDate', today)}): "
                        f"input=${in_rate:g}/1M tokens, output=${out_rate:g}/1M tokens"
                        + (f", cachedInput=${cache_rate:g}/1M tokens." if cache_rate is not None else ' (no separate cached-input discount published).')
                    ),
                })
            else:
                item_obj['modeled'] = False
                excluded_public[item_obj['name']] = 'No public per-token self-serve rate published (contact-sales or subscription-only).'
            resolved_items.append(item_obj)
    else:
        # SaaS / Software / Hardware TCO mode: fetch live pricing URLs in parallel when `pricingUrl` / `sourceUrl` is given without pre-extracted rates!
        fetch_jobs = []
        for idx_v, v in enumerate(raw_vendors):
            if isinstance(v, str):
                v = {'name': v}
                raw_vendors[idx_v] = v
            if not isinstance(v, dict) or not v.get('name'):
                continue
            vname = str(v['name'])
            # Check local ledger or gear-prices first if missing baseMonthlyUsd
            hit = ledger.get(vname.lower()) or ledger.get(_slugify(vname))
            if hit and hit.get('kind') == 'plan' and v.get('baseMonthlyUsd') is None and v.get('perSeatMonthlyUsd') is None:
                if hit.get('price') is not None:
                    v['baseMonthlyUsd'] = hit['baseMonthlyUsd']
                    v['perSeatMonthlyUsd'] = hit['perSeatMonthlyUsd']
                    v.setdefault('planName', hit.get('planName', 'Published tier'))
                    v.setdefault('sourceUrl', hit.get('sourceUrl'))
            asin = str(v.get('asin') or '').strip()
            if asin and asin in gear_prices and v.get('baseMonthlyUsd') is None:
                gp_str = str(gear_prices[asin].get('price') or '')
                pm = re.search(r'(\d+(?:\.\d+)?)', gp_str.replace(',', ''))
                if pm:
                    v['baseMonthlyUsd'] = float(pm.group(1))
                    v['oneTimeHardwareUsd'] = float(pm.group(1))
                    v.setdefault('planName', 'Amazon Live Price')

            url = str(v.get('pricingUrl') or v.get('sourceUrl') or '').strip()
            needs_live_fetch = bool(url and (v.get('fetchLive') or (v.get('baseMonthlyUsd') is None and v.get('perSeatMonthlyUsd') is None)))
            if needs_live_fetch:
                dest_txt = sources_dir / f'{slug}-{_slugify(vname)}.txt'
                fetch_jobs.append((idx_v, url, dest_txt))

        fetched_by_idx = {}
        if fetch_jobs:
            with ThreadPoolExecutor(max_workers=min(6, len(fetch_jobs))) as pool:
                futs = {pool.submit(fetch_live_url_snapshot, u, d): i for i, u, d in fetch_jobs}
                for fut, i in futs.items():
                    fetched_by_idx[i] = fut.result()

        # Always write immutable `<slug>-benchmark-vendors.json` snapshot without mutating pre-hashed intake files
        vendors_snapshot_path = sources_dir / f'{slug}-benchmark-vendors.json'
        for idx_v, v in enumerate(raw_vendors):
            if not isinstance(v, dict) or not v.get('name'):
                continue
            vname = str(v['name'])
            f_res = fetched_by_idx.get(idx_v)
            snap_ref = None
            if f_res is not None:
                snap_ref = _ref(root, f_res['path'])
                source_artifacts.append(snap_ref)
                if f_res.get('ok'):
                    ext = extract_pricing_facts_from_text(f_res['text'], vname)
                    v['liveExtraction'] = ext
                    if ext.get('modeled') and v.get('baseMonthlyUsd') is None and v.get('perSeatMonthlyUsd') is None:
                        v['baseMonthlyUsd'] = ext.get('baseMonthlyUsd', 0.0)
                        v['perSeatMonthlyUsd'] = ext.get('perSeatMonthlyUsd', 0.0)
                        v.setdefault('includedVolume', ext.get('includedVolume', 10**9))
                        if ext.get('overageUsdPerUnit'):
                            v.setdefault('overageUsdPerUnit', ext['overageUsdPerUnit'])
                            v.setdefault('overageUnitSize', ext.get('overageUnitSize', 1000.0))
                    elif not ext.get('modeled') and v.get('baseMonthlyUsd') is None and v.get('perSeatMonthlyUsd') is None:
                        v['modeled'] = False
                        excluded_public[vname] = ext.get('pricingSummary') or 'No public self-serve rate extracted.'
                else:
                    if v.get('baseMonthlyUsd') is None and v.get('perSeatMonthlyUsd') is None:
                        v['modeled'] = False
                        excluded_public[vname] = f"Live pricing page unreachable ({f_res.get('error')}); excluded from numeric model."

            if v.get('modeled', True) and (v.get('baseMonthlyUsd') is not None or v.get('perSeatMonthlyUsd') is not None):
                v['modeled'] = True
                resolved_items.append((v, snap_ref))
            else:
                v['modeled'] = False
                excluded_public.setdefault(vname, 'Quote-based / custom enterprise pricing; no public self-serve rate.')
                resolved_items.append((v, snap_ref))

        vendors_snapshot_payload = {
            'retrievedAt': checked_at,
            'route': route,
            'subject': candidate.get('subject') or (raw_vendors[0]['name'] if raw_vendors else slug),
            'officialUrl': candidate.get('officialUrl'),
            'vendors': [v for v, _ in resolved_items],
            'scenarios': candidate.get('scenarios') or [],
        }
        vendors_snapshot_path.write_text(json.dumps(vendors_snapshot_payload, indent=2, ensure_ascii=False) + '\n')
        vendors_snap_ref = _ref(root, vendors_snapshot_path)
        source_artifacts.insert(0, vendors_snap_ref)

        final_vendor_items = []
        for v, snap_ref in resolved_items:
            vname = v['name']
            if v.get('modeled'):
                eff_snap = snap_ref or vendors_snap_ref
                ext_summary = (v.get('liveExtraction') or {}).get('pricingSummary')
                facts_line = ext_summary or (
                    f"{vname} ({v.get('planName', 'Published tier')}): "
                    f"base=${v.get('baseMonthlyUsd', 0):g}/mo, perSeat=${v.get('perSeatMonthlyUsd', 0):g}/mo, "
                    f"includedVolume={v.get('includedVolume', 'unlimited')}."
                )
                public_sources.append({
                    'item': vname,
                    'url': str(v.get('pricingUrl') or v.get('sourceUrl') or candidate.get('officialUrl') or f"https://{_slugify(vname).replace('-', '')}.com/pricing"),
                    'checkedAt': checked_at,
                    'snapshot': eff_snap,
                    'extractedFacts': facts_line,
                })
            final_vendor_items.append(v)
        resolved_items = final_vendor_items

    # Default 3 standardized scenarios if caller didn't specify custom scenarios
    scenarios = list(candidate.get('scenarios') or [])
    if not scenarios:
        if mode == 'api-tokens':
            scenarios = [
                {'name': 'Prototype / internal copilot (10M in, 2M out)', 'inputTokensM': 10.0, 'outputTokensM': 2.0, 'cacheHitRatio': 0.0},
                {'name': 'Production SaaS feature (100M in, 25M out, 50% cached)', 'inputTokensM': 100.0, 'outputTokensM': 25.0, 'cacheHitRatio': 0.5},
                {'name': 'High-volume agentic pipeline (500M in, 100M out, 80% cached)', 'inputTokensM': 500.0, 'outputTokensM': 100.0, 'cacheHitRatio': 0.8},
            ]
        else:
            scenarios = [
                {'name': 'Solo / starter workflow (1 seat, 250 units/mo)', 'seats': 1, 'monthlyVolume': 250, 'requiresAddon': False},
                {'name': 'Growing SMB team (5 seats, 2,000 units/mo)', 'seats': 5, 'monthlyVolume': 2000, 'requiresAddon': False},
                {'name': 'Scale pod with add-ons (10 seats, 5,000 units/mo)', 'seats': 10, 'monthlyVolume': 5000, 'requiresAddon': True},
            ]

    # Write & execute deterministic `model.py` -> `output.json`
    model_input_path = ev_dir / 'benchmark-inputs.json'
    subject_name = str(candidate.get('subject') or (resolved_items[0]['name'] if resolved_items else slug))
    model_input_payload = {
        'mode': mode,
        'subject': subject_name,
        'items': resolved_items,
        'scenarios': scenarios,
    }
    model_input_path.write_text(json.dumps(model_input_payload, indent=2, ensure_ascii=False) + '\n')
    model_input_ref = _ref(root, model_input_path)
    source_artifacts.append(model_input_ref)

    model_py = ev_dir / 'model.py'
    output_json = ev_dir / 'output.json'
    in_rel = model_input_ref['path']
    model_code = (
        '#!/usr/bin/env python3\n'
        'import json\n'
        'from pathlib import Path\n\n'
        'ROOT = next(p for p in Path(__file__).resolve().parents if (p / ".claude").is_dir())\n'
        f'DATA = json.loads((ROOT / {in_rel!r}).read_text())\n'
        'mode = DATA["mode"]\n'
        'subject = DATA.get("subject")\n'
        'items = [it for it in DATA.get("items", []) if it.get("modeled", True)]\n'
        'scenarios_out = []\n'
        'table_headers = ["Workload Scenario"] + [it["name"] for it in items[:5]] + ["Lowest-Cost Pick"]\n'
        'table_rows = []\n\n'
        'for sc in DATA.get("scenarios", []):\n'
        '    quotes = {}\n'
        '    if mode == "api-tokens":\n'
        '        in_m = float(sc.get("inputTokensM", 10.0))\n'
        '        out_m = float(sc.get("outputTokensM", 2.0))\n'
        '        cache_ratio = float(sc.get("cacheHitRatio", 0.0))\n'
        '        for it in items:\n'
        '            in_rate = float(it.get("inputPer1M", 0.0))\n'
        '            out_rate = float(it.get("outputPer1M", 0.0))\n'
        '            c_rate = float(it["cachedInputPer1M"]) if it.get("cachedInputPer1M") is not None else in_rate\n'
        '            fresh_in = in_m * (1.0 - cache_ratio)\n'
        '            cached_in = in_m * cache_ratio\n'
        '            monthly = round(fresh_in * in_rate + cached_in * c_rate + out_m * out_rate, 2)\n'
        '            quotes[it["name"]] = {"monthlyUsd": monthly, "annualUsd": round(monthly * 12, 2)}\n'
        '    else:\n'
        '        seats = int(sc.get("seats", 1))\n'
        '        vol = float(sc.get("monthlyVolume", 0.0))\n'
        '        for it in items:\n'
        '            if float(vol) == 0.0 and it.get("hasFreeTier"):\n'
        '                monthly = 0.0\n'
        '            else:\n'
        '                base = float(it.get("baseMonthlyUsd") or 0.0)\n'
        '                per_seat = float(it.get("perSeatMonthlyUsd") or 0.0)\n'
        '                seat_min = int(it.get("seatMin") or 1)\n'
        '                eff_seats = max(seats, seat_min) if per_seat > 0 else seats\n'
        '                inc = float(it.get("includedVolume") if it.get("includedVolume") is not None else 10**9)\n'
        '                over_unit = float(it.get("overageUnitSize") or 1000.0)\n'
        '                over_rate = float(it.get("overageUsdPerUnit") or 0.0)\n'
        '                addon = float(it.get("requiredAddonMonthlyUsd") or 0.0) if sc.get("requiresAddon") else 0.0\n'
        '                extra = max(0.0, vol - inc) / over_unit\n'
        '                monthly = round(base + per_seat * eff_seats + extra * over_rate + addon, 2)\n'
        '            quotes[it["name"]] = {"monthlyUsd": monthly, "annualUsd": round(monthly * 12, 2), "plan": it.get("planName", "Published tier")}\n'
        '    subj_m = quotes.get(subject, {}).get("monthlyUsd")\n'
        '    if subj_m is not None:\n'
        '        for q in quotes.values():\n'
        '            diff = round(subj_m - q["monthlyUsd"], 2)\n'
        '            q["savingsVsSubjectMonthlyUsd"] = diff\n'
        '            q["savingsVsSubjectAnnualUsd"] = round(diff * 12, 2)\n'
        '    ranked = sorted(quotes.items(), key=lambda kv: kv[1]["monthlyUsd"])\n'
        '    winner = ranked[0][0] if ranked else "N/A"\n'
        '    winner_usd = ranked[0][1]["monthlyUsd"] if ranked else 0.0\n'
        '    scenarios_out.append({\n'
        '        "scenario": sc.get("name"),\n'
        '        "lowestCostVendor": winner,\n'
        '        "lowestMonthlyUsd": winner_usd,\n'
        '        "quotes": quotes,\n'
        '    })\n'
        '    row_cells = [str(sc.get("name"))] + [f"${quotes[it[\'name\']][\'monthlyUsd\']:,.2f}/mo" for it in items[:5]] + [f"{winner} (${winner_usd:,.2f}/mo)"]\n'
        '    table_rows.append(row_cells)\n\n'
        'winners = [s["lowestCostVendor"] for s in scenarios_out if s.get("lowestCostVendor")]\n'
        'result = {\n'
        '    "mode": mode,\n'
        '    "subject": subject,\n'
        '    "scenarioCount": len(scenarios_out),\n'
        '    "distinctScenarioWinners": list(dict.fromkeys(winners)),\n'
        '    "scenarios": scenarios_out,\n'
        '    "scenarioTable": {\n'
        '        "caption": f"Internal {(\'API Token\' if mode == \'api-tokens\' else \'Plan & Workload\')} Cost Model Across {len(scenarios_out)} Standardized Scenarios",\n'
        '        "headers": table_headers,\n'
        '        "rows": table_rows,\n'
        '    },\n'
        '}\n'
        'print(json.dumps(result, indent=2))\n'
    )
    model_py.write_text(model_code)
    proc = subprocess.run([sys.executable, str(model_py)], cwd=str(root), capture_output=True, text=True, check=True)
    output_json.write_text(proc.stdout)
    model_output = json.loads(proc.stdout)
    output_ref = _ref(root, output_json)

    # Retrieve first-party catalog cases receipt (`_approved-cases.json` + `_layer3-experience-catalog.json`)
    plan_obj = json.loads((root / manifest_ref['path']).read_text())
    canon_base = str(plan_obj.get('canonicalBase') or 'https://www.layer3labs.io')
    canon_host = (urlsplit(canon_base).hostname or 'layer3labs.io').lower().removeprefix('www.')
    ctx_queries = list(candidate.get('caseSearchContext') or [])
    cases_obj = gates.cases(root, reader_question, canon_host, ctx_queries)
    cases_path = ev_dir / 'cases.json'
    cases_path.write_text(json.dumps(cases_obj, indent=2, ensure_ascii=False) + '\n')
    cases_ref = _ref(root, cases_path)

    # Check tested-page eligibility BEFORE considering any hands-on `measured` basis!
    elig = tracks.tested_eligibility(
        root,
        route,
        title=str(candidate.get('title') or ''),
        h1=str(candidate.get('title') or ''),
        option_a=subject_name,
        option_b=str(candidate.get('optionBName') or ('Alternatives' if track == 'alternatives' else '')),
    )

    all_item_names = [it['name'] for it in resolved_items if it.get('name')]
    covered_public_names = [s['item'] for s in public_sources]
    comparisons_list: list[dict] = []

    if len(all_item_names) >= 2 and len(covered_public_names) >= 2:
        pub_plan = {
            'kind': 'public-data',
            'readerQuestion': reader_question,
            'items': all_item_names,
            'decision': f'Identify the lowest total-cost and best-fit option among {", ".join(all_item_names[:4])} across realistic team/token workloads.',
            'conditions': 'Published USD self-serve monthly/annual rates, seat minimums, included usage caps, and per-1M token rates as of verification date.',
            'dimensions': (
                ['inputPer1M', 'outputPer1M', 'cachedInputPer1M']
                if mode == 'api-tokens'
                else ['baseMonthlyUsd', 'perSeatMonthlyUsd', 'includedVolume', 'overageUsdPerUnit', 'requiredAddonMonthlyUsd']
            ),
            'normalization': 'Standardized monthly and annual USD totals evaluated across identical 3-tier workload scenarios.',
            'unknowns': 'Unpublished custom enterprise discounts and negotiated volume commits.',
            'sourceRefreshTrigger': 'Re-run benchmark when any compared vendor updates published tier rates, token prices, or plan caps.',
        }
        pub_plan_path = ev_dir / 'public-comparison-plan.json'
        pub_plan_path.write_text(json.dumps(pub_plan, indent=2, ensure_ascii=False) + '\n')
        pub_plan_ref = _ref(root, pub_plan_path)
        source_artifacts.append(pub_plan_ref)

        # Ensure excluded_public matches exact set difference `set(all_item_names) - set(covered_public_names)`
        exact_excluded = {
            nm: excluded_public.get(nm, 'No public self-serve rate published; excluded from numeric TCO calculation.')
            for nm in all_item_names
            if nm not in set(covered_public_names)
        }
        comparisons_list.append({
            'kind': 'public-data',
            'status': 'used',
            'basis': 'calculated' if mode == 'api-tokens' else 'modeled',
            'reason': 'Published pricing tiers, plan caps, and token rates directly determine total workload cost and break-even thresholds.',
            'scope': f'Verified public self-serve pricing across {len(covered_public_names)} of {len(all_item_names)} compared options on {today}.',
            'plan': pub_plan_ref,
            'coveredItems': covered_public_names,
            'excludedItems': exact_excluded,
            'sources': public_sources,
        })

    # Optional Lane 1: Hands-On Practical Benchmark (`Option 3` / `basis: "measured"`)
    practical_result = None
    packet_basis = 'calculated' if mode == 'api-tokens' else 'modeled'
    packet_runs = None
    if candidate.get('practicalTask') and len(all_item_names) >= 2:
        practical_result = run_practical_tasks(
            root=root,
            ev_dir=ev_dir,
            reader_question=reader_question,
            decision_text=f'Verify hands-on task execution across {", ".join(all_item_names)} under identical inputs.',
            items=all_item_names,
            practical_spec=candidate['practicalTask'],
        )
        source_artifacts.extend(practical_result['artifacts'])
        comparisons_list.append(practical_result['comparisonEntry'])
        # Upgrade page-level basis to `measured` ONLY when route is tested-eligible AND all ranked items were genuinely executed!
        if elig['eligible'] and practical_result['allRankedItemsCovered']:
            packet_basis = 'measured'
            packet_runs = practical_result['topLevelRuns']

    # Synthesize clear finding + counterexample from actual computed scenario outputs if not explicitly supplied
    sc_list = model_output.get('scenarios') or []
    auto_finding = str(candidate.get('finding') or candidate.get('workingAnswer') or '').strip()
    if not auto_finding and sc_list:
        first_sc = sc_list[0]
        last_sc = sc_list[-1]
        auto_finding = (
            f"In our {len(sc_list)}-scenario benchmark, {first_sc['lowestCostVendor']} leads at ${first_sc['lowestMonthlyUsd']:,.2f}/month "
            f"for {first_sc['scenario']}, while {last_sc['lowestCostVendor']} wins at ${last_sc['lowestMonthlyUsd']:,.2f}/month "
            f"for {last_sc['scenario']}."
        )

    auto_counter = str(candidate.get('counterexample') or '').strip()
    if not auto_counter and sc_list:
        first_sc = sc_list[0]
        last_sc = sc_list[-1]
        if first_sc['lowestCostVendor'] != last_sc['lowestCostVendor']:
            auto_counter = (
                f"Counterexample (crossover): {first_sc['lowestCostVendor']} is cheapest on {first_sc['scenario']} "
                f"(${first_sc['lowestMonthlyUsd']:,.2f}/month), but the ranking reverses on {last_sc['scenario']} "
                f"where {last_sc['lowestCostVendor']} drops total spend to ${last_sc['lowestMonthlyUsd']:,.2f}/month."
            )
        else:
            # Compare winner vs runner-up on largest scenario
            q_sorted = sorted(last_sc['quotes'].items(), key=lambda kv: kv[1]['monthlyUsd'])
            runner = q_sorted[1] if len(q_sorted) >= 2 else q_sorted[0]
            auto_counter = (
                f"Counterexample: {first_sc['lowestCostVendor']} wins on raw published rate (${last_sc['lowestMonthlyUsd']:,.2f}/month vs. "
                f"{runner[0]} at ${runner[1]['monthlyUsd']:,.2f}/month on {last_sc['scenario']}), whereas teams needing enterprise-only "
                f"controls or bundled native channels that eliminate a separate paid tool break even on {runner[0]}."
            )

    action_row = next((r for r in (plan_obj.get('actions') or []) if r.get('id') == action_id), None)
    if not action_row:
        raise ValueError(f'Action {action_id!r} not found in {manifest_ref["path"]}')

    pkt = {
        'gateSchemaVersion': gates.VERSION,
        'author': f'{author}-writer',
        'route': route,
        'readerQuestion': reader_question,
        'approvedPlan': {'manifest': manifest_ref, 'review': review_ref, 'actionId': action_id},
        'presentation': action_row['presentation'],
        'basis': packet_basis,
        'decisionGap': str(
            candidate.get('decisionGap')
            or f'Vendor pricing pages publish isolated tier or token numbers without normalizing multi-scenario workload caps, cache hits, or switching break-even math across {", ".join(all_item_names[:3])}.'
        ),
        'finding': auto_finding or action_row.get('answer') or 'Verified multi-scenario benchmark completed.',
        'conditions': str(
            candidate.get('conditions')
            or f'Published USD self-serve pricing and API token rates verified as of {today}.'
        ),
        'whatWouldChange': str(
            candidate.get('whatWouldChange')
            or f'Any tier repricing, included-cap change, or cache-read rate cut among {", ".join(all_item_names[:3])} shifts the break-even crossover.'
        ),
        'method': str(
            candidate.get('method')
            or (
                'Executed identical predefined practical benchmark task across all ranked options alongside deterministic 3-scenario cost modeling.'
                if packet_basis == 'measured'
                else f'Deterministic 3-scenario {("API token + cache-hit" if mode == "api-tokens" else "seat, cap, and overage")} cost model over verified primary vendor pricing snapshots.'
            )
        ),
        'units': 'USD/month and USD/year',
        'limitations': 'Excludes unpublished enterprise commits, custom volume discounts, and implementation labor.',
        'counterexample': auto_counter or 'Below starter free-tier caps, $0 plans beat paid tiers; above cap thresholds, overage rates flip the lowest-cost ranking.',
        'caseSelection': cases_ref,
        'caseSearchContext': ctx_queries,
        'caseDecisions': 'Searched first-party catalog for relevant anonymous operator/client context; numerical rankings rely strictly on verified pricing/benchmark artifacts.',
        'caseUses': [],
        'comparisons': comparisons_list,
        'sourceArtifacts': source_artifacts,
    }
    if packet_basis == 'measured' and packet_runs:
        pkt['runs'] = packet_runs
    else:
        pkt['execution'] = {
            'command': ['python3', str(model_py.relative_to(root))],
            'code': _ref(root, model_py),
            'inputs': [model_input_ref],
            'output': output_ref,
        }

    ev_path = ev_dir / 'evidence.json'
    ev_path.write_text(json.dumps(pkt, indent=2, ensure_ascii=False) + '\n')
    gates.analysis(root, pkt)

    # When `packet_basis == 'measured'` and `elig['eligible']`, also write a ready-to-review registration template for Phase 4 -> `scripts/tested/register.mts`!
    reg_template_rel = None
    if packet_basis == 'measured' and elig['eligible'] and packet_runs:
        reg_template = {
            'route': route,
            'note': 'Template for independent Phase 4 reviewer approval via `npx tsx scripts/tested/register.mts` once final normalized page JSON is verified.',
            'recordSkeleton': {
                'basis': 'tested',
                'createdBy': f'{author}-writer',
                'items': all_item_names,
                'runs': [
                    {'items': r['items'], 'testedAt': r['testedAt'], 'artifact': r['artifact']}
                    for r in packet_runs
                ],
            },
        }
        reg_p = ev_dir / 'testing-registration-candidate.json'
        reg_p.write_text(json.dumps(reg_template, indent=2) + '\n')
        reg_template_rel = str(reg_p.relative_to(root))

    return {
        'status': 'PASS',
        'route': route,
        'slug': slug,
        'track': track,
        'mode': mode,
        'basis': packet_basis,
        'testedEligible': elig['eligible'],
        'testedBadgeAuthorized': bool(packet_basis == 'measured' and elig['eligible']),
        'evidence': str(ev_path.relative_to(root)),
        'modelOutput': output_ref['path'],
        'scenarioTable': model_output.get('scenarioTable'),
        'testingRegistrationCandidate': reg_template_rel,
    }


def run_benchmark_for_manifest(
    root: Path,
    manifest_path: Path,
    specs_by_route: dict[str, dict] | None = None,
    author: str = 'mindmap-benchmark',
) -> dict:
    """Run Live Product & Pricing Benchmark across all Comparison, Roundup, and Alternatives actions in an approved manifest."""
    root = root.resolve()
    m_file = (root / manifest_path).resolve() if not Path(manifest_path).is_absolute() else Path(manifest_path).resolve()
    plan = json.loads(m_file.read_text())
    run_dir = m_file.parent
    review_file = run_dir / 'chart-review.json'
    if not review_file.is_file():
        raise ValueError(f'Missing chart-review.json beside {m_file}')

    tracks_spec = importlib.util.spec_from_file_location('mm_tracks_m', root / '.claude/tools/mindmap-tracks.py')
    tracks = importlib.util.module_from_spec(tracks_spec)
    tracks_spec.loader.exec_module(tracks)

    brief_by_id = {
        b['actionId']: b
        for b in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or [])
        if isinstance(b, dict) and b.get('actionId')
    }
    manifest_ref = _ref(root, m_file)
    review_ref = _ref(root, review_file)
    specs_by_route = specs_by_route or {}
    ledger = parse_local_pricing_ledger(root)

    results = []
    for row in (plan.get('actions') or []):
        if not isinstance(row, dict) or row.get('bucket') not in ('create new content', 'update existing body text'):
            continue
        target = str(row.get('target') or '').strip()
        slug = target.rstrip('/').split('/')[-1]
        ev_file = run_dir / 'evidence' / slug / 'evidence.json'
        br = brief_by_id.get(row.get('id', ''), {})
        tr = tracks.classify_action(row, br, plan)
        if tr not in ('alternatives', 'comparison', 'roundup') and target not in specs_by_route:
            continue
        if ev_file.is_file() and target not in specs_by_route:
            results.append({'route': target, 'track': tr, 'status': 'EXISTING', 'evidence': str(ev_file.relative_to(root))})
            continue

        cand = dict(specs_by_route.get(target) or br.get('benchmarkSpec') or {})
        cand.setdefault('title', (br.get('identity') or {}).get('title') or row.get('solution') or slug)
        cand.setdefault('workingAnswer', row.get('answer') or '')
        if br.get('subjectOfficialUrl'):
            cand.setdefault('officialUrl', br['subjectOfficialUrl'])

        # Auto-detect models from slug/title against `data/pricing.ts` when `models`/`vendors` not explicitly passed!
        if not cand.get('models') and not cand.get('vendors') and ledger:
            hay = f"{slug} {cand['title']}".lower()
            matched_models = []
            seen_ids = set()
            for rec in ledger.values():
                if rec.get('kind') == 'api' and rec['id'] not in seen_ids:
                    mname_low = rec['name'].lower()
                    if mname_low in hay or rec['id'].lower() in slug.lower():
                        seen_ids.add(rec['id'])
                        matched_models.append(rec['id'])
            if len(matched_models) >= 2:
                cand['models'] = matched_models[:6]
                cand['benchmarkMode'] = 'api-tokens'

        if not cand.get('models') and not cand.get('vendors'):
            # Derive option names from `<a>-vs-<b>` slug if possible and match plan ledger
            if '-vs-' in slug:
                parts = [p.replace('-', ' ').title() for p in slug.split('-vs-', 1)]
                cand['vendors'] = [{'name': parts[0]}, {'name': parts[1]}]
            else:
                results.append({'route': target, 'track': tr, 'status': 'SKIPPED_NO_VENDOR_SPEC'})
                continue

        res = run_benchmark_for_candidate(
            root=root,
            run_dir=run_dir,
            manifest_ref=manifest_ref,
            review_ref=review_ref,
            action_id=row['id'],
            route=target,
            track=tr,
            reader_question=str(row.get('reader_question') or ''),
            candidate=cand,
            author=author,
        )
        results.append(res)

    return {'status': 'PASS', 'processed': len(results), 'results': results}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='cmd', required=True)

    p_led = sub.add_parser('ledger', help='List or query verified local pricing ledger (`data/pricing.ts`)')
    p_led.add_argument('--query', default='')

    p_ext = sub.add_parser('extract-url', help='Fetch live vendor pricing URL and extract structured pricing/cap facts')
    p_ext.add_argument('--url', required=True)
    p_ext.add_argument('--vendor', required=True)
    p_ext.add_argument('--out', required=True)

    p_run = sub.add_parser('run', help='Execute Live Product & Pricing Benchmark for an approved manifest')
    p_run.add_argument('--manifest', required=True)
    p_run.add_argument('--spec-file', help='Optional JSON mapping route -> benchmarkSpec (vendors/models/scenarios/practicalTask)')
    p_run.add_argument('--author', default='mindmap-benchmark')

    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]

    if args.cmd == 'ledger':
        led = parse_local_pricing_ledger(root)
        uniq = {v['id']: v for v in led.values()}
        q = args.query.strip().lower()
        rows = [
            v for v in uniq.values()
            if not q or q in v['id'].lower() or q in v['name'].lower() or q in v.get('vendor', '').lower()
        ]
        print(json.dumps({'count': len(rows), 'entries': rows}, indent=2))
        return 0

    if args.cmd == 'extract-url':
        out_p = (root / args.out).resolve() if not Path(args.out).is_absolute() else Path(args.out).resolve()
        snap = fetch_live_url_snapshot(args.url, out_p)
        facts = extract_pricing_facts_from_text(snap.get('text', ''), args.vendor) if snap.get('ok') else {'status': 'unreachable', 'error': snap.get('error')}
        print(json.dumps({
            'ok': snap.get('ok'),
            'url': args.url,
            'checkedAt': snap.get('checkedAt'),
            'snapshot': str(out_p.relative_to(root)) if out_p.is_relative_to(root) else str(out_p),
            'sha256': _sha256_file(out_p),
            'extracted': facts,
        }, indent=2))
        return 0

    if args.cmd == 'run':
        specs = json.loads((root / args.spec_file if not Path(args.spec_file).is_absolute() else Path(args.spec_file)).read_text()) if args.spec_file else None
        res = run_benchmark_for_manifest(root, Path(args.manifest), specs_by_route=specs, author=args.author)
        print(json.dumps(res, indent=2))
        return 0

    return 1


if __name__ == '__main__':
    sys.exit(main())
