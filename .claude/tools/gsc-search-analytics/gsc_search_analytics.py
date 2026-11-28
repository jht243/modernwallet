#!/usr/bin/env python3
"""GSC Search Analytics fetcher — universal page performance lookup.

Sibling to gsc_url_inspection.py. Same service-account auth, same property
derivation. Pulls page-level performance from Google Search Console's
SearchAnalytics API: impressions, clicks, CTR, avg position, top queries,
and 90-day trend.

Designed to drive metadata-rewrite decisions: before rewriting a page's
title/meta description, this tells you whether the page is currently
performing well, underperforming, or has no traction yet.

Usage:
  # Summary metrics + top queries for one page (last 30 days, default):
  gsc_search_analytics.py \\
    --base-url https://www.example.com \\
    --page https://www.example.com/some-page

  # With trend history (week-by-week impressions for last 90 days):
  gsc_search_analytics.py --base-url https://www.example.com \\
    --page https://www.example.com/some-page --trend

  # Batch mode — one page URL per line on stdin:
  echo -e "https://x.com/a\\nhttps://x.com/b" | gsc_search_analytics.py \\
    --base-url https://www.example.com --stdin --json out.json

Output (default JSON):
  {
    "page": "https://www.example.com/some-page",
    "window_days": 30,
    "totals": {
      "impressions": 1234, "clicks": 56,
      "ctr": 0.045, "position": 8.3
    },
    "top_queries": [
      {"query": "ai for medical practices", "impressions": 510,
       "clicks": 18, "ctr": 0.035, "position": 9.1},
      ...
    ],
    "verdict": {
      "label": "underperforming|performing|no-data|mixed",
      "reason": "<short human-readable reason>",
      "ctr": 0.045, "ctr_threshold_low": 0.03, "ctr_threshold_high": 0.05,
      "impressions_trend_30d": "flat",   // up | flat | down
      "rewrite_recommended": true|false
    }
  }

Exit codes:
  0  success
  2  no credentials (place SA JSON at ~/.claude/secrets/gsc-service-account.json)
  3  403 — service account lacks property permission
  4  corrupt/truncated service-account credentials across all sources (CREDENTIAL_CORRUPT_NO_RETRY) or bad arguments
"""

import argparse
import base64
import hashlib
import json
import os
import sys
import threading
import time
import urllib.parse
from datetime import date, timedelta
from pathlib import Path
from typing import Optional

_GSC_PACE_LOCK = threading.Lock()
_GSC_LAST_CALL_TS = 0.0
_STAGGERED_SITES: set[str] = set()
_QUOTA_TOKENS = (
    "quota",
    "ratelimit",
    "rate limit",
    "load quota",
    "resource_exhausted",
    "userratelimitexceeded",
)


def _is_quota_403(status_code: int, body_text: str) -> bool:
    if status_code != 403:
        return False
    low = (body_text or "").lower()
    return any(tok in low for tok in _QUOTA_TOKENS)


def compute_cron_stagger_seconds(site_url: str, max_s: int = 150) -> int:
    """Deterministic per-site stagger (0..max_s-1s) so simultaneous 3:00/3:30 AM fleet cron runs spread out."""
    if max_s <= 0 or not site_url:
        return 0
    digest = hashlib.sha256(site_url.strip().lower().encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % max_s


def _maybe_cron_stagger(site_url: str) -> int:
    """Sleep once per site/process ONLY in unattended cloud/cron runs (zero delay in interactive CLI or tests)."""
    key = (site_url or "").strip().lower()
    if not key or key in _STAGGERED_SITES:
        return 0
    jitter_env = (os.environ.get("GSC_CRON_JITTER") or "").strip().lower()
    if jitter_env in ("0", "false", "no", "off"):
        _STAGGERED_SITES.add(key)
        return 0
    is_cloud = (
        jitter_env in ("1", "true", "yes", "on")
        or (os.environ.get("CLAUDE_CODE_REMOTE") or "").strip().lower() in ("1", "true")
        or (os.environ.get("CLAUDE_CLOUD_ROUTINE") or "").strip().lower() in ("1", "true")
    )
    _STAGGERED_SITES.add(key)
    if not is_cloud:
        return 0
    max_s = int(os.environ.get("GSC_CRON_JITTER_MAX_S", "150"))
    delay = compute_cron_stagger_seconds(key, max_s=max_s)
    if delay > 0:
        print(f"[gsc-stagger] cloud cron offset {delay}s for {site_url}", file=sys.stderr, flush=True)
        time.sleep(delay)
    return delay


def _pace_gsc_call() -> None:
    global _GSC_LAST_CALL_TS
    pace_s = float(os.environ.get("GSC_PACE_S", "0.4"))
    if pace_s <= 0:
        return
    with _GSC_PACE_LOCK:
        now = time.monotonic()
        wait = (_GSC_LAST_CALL_TS + pace_s) - now
        if wait > 0:
            time.sleep(wait)
        _GSC_LAST_CALL_TS = time.monotonic()


_SA_ENV_KEYS = (
    "GOOGLE_REPORTING_SA_JSON",
    "GOOGLE_REPORTING_SA_B64",
    "GSC_SA_B64",
    "GSC_SA_JSON",
    "GSC_SERVICE_ACCOUNT_JSON",
    "GOOGLE_SERVICE_ACCOUNT_JSON",
    "GOOGLE_REPORTING_SA_FILE",
    "GSC_SA_FILE",
    "GOOGLE_APPLICATION_CREDENTIALS",
)


def _parse_env_files_for_sa(repo_root: Optional[Path] = None) -> list[tuple[str, str]]:
    """Collect fallback GSC SA values from local/home env files without overriding env vars."""
    root = repo_root or Path.cwd()
    found: list[tuple[str, str]] = []
    env_files = [
        root / ".claude" / "secrets.env",
        root / ".claude" / "routines.config",
        root / ".env.local",
        root / ".env",
        Path.home() / ".claude" / "secrets.env",
    ]
    for ef in env_files:
        if not ef.is_file():
            continue
        try:
            lines = ef.read_text(encoding="utf-8", errors="ignore").splitlines()
        except OSError:
            continue
        vals: dict[str, str] = {}
        for raw in lines:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            if line.startswith("export "):
                line = line[7:].strip()
            k, _, v = line.partition("=")
            k = k.strip()
            v = v.strip()
            if len(v) >= 2 and v[0] == v[-1] and v[0] in ('"', "'"):
                v = v[1:-1]
            if k in _SA_ENV_KEYS and v:
                vals[k] = v
        for k in _SA_ENV_KEYS:
            if k in vals:
                found.append((f"{ef}:{k}", vals[k]))
    return found


def _validate_sa_dict(info: object) -> tuple[bool, str]:
    """Pure-stdlib PKCS#8 / PEM ASN.1 length check — catches truncated env keys in <1ms before pip install."""
    if not isinstance(info, dict):
        return False, "not a JSON object"
    email = str(info.get("client_email") or "").strip()
    if "@" not in email:
        return False, "missing client_email"
    pk = str(info.get("private_key") or "").strip()
    if not pk:
        return False, "missing private_key"
    if "\\n" in pk and "\n" not in pk:
        pk = pk.replace("\\n", "\n")
        info["private_key"] = pk
    if "-----BEGIN " not in pk or "PRIVATE KEY-----" not in pk or "-----END " not in pk:
        return False, "private_key missing PEM header/footer"
    b64_lines = [
        ln.strip()
        for ln in pk.splitlines()
        if ln.strip() and not ln.strip().startswith("-----")
    ]
    if not b64_lines:
        return False, "private_key PEM body empty"
    try:
        der = base64.b64decode("".join(b64_lines), validate=True)
    except Exception as exc:
        return False, f"private_key base64 corrupt ({exc})"
    if len(der) < 512 or der[0] != 0x30:
        return False, f"private_key DER truncated ({len(der)} bytes)"
    first_len = der[1]
    if first_len < 0x80:
        seq_len = first_len
        hdr_len = 2
    else:
        n_oct = first_len & 0x7F
        if n_oct == 0 or n_oct > 4 or len(der) < 2 + n_oct:
            return False, "private_key ASN.1 length header corrupt"
        seq_len = int.from_bytes(der[2 : 2 + n_oct], "big")
        hdr_len = 2 + n_oct
    if hdr_len + seq_len != len(der):
        return False, f"private_key ASN.1 short/truncated data (expected {hdr_len + seq_len}B, got {len(der)}B)"
    return True, "ok"


def _decode_sa_candidate(val: str) -> tuple[Optional[dict], Optional[str], bool]:
    """Return (info_dict, err_msg, was_present). Handles inline JSON, base64 JSON, and file paths safely."""
    if val.startswith("{") or ("private_key" in val and "client_email" in val):
        try:
            return json.loads(val), None, True
        except json.JSONDecodeError as exc:
            return None, f"invalid inline JSON ({exc.msg})", True
    is_file = False
    p = None
    if len(val) < 1024 and "\n" not in val:
        try:
            p = Path(val).expanduser()
            is_file = p.is_file()
        except OSError:
            is_file = False
    if is_file and p is not None:
        try:
            return json.loads(p.read_text(encoding="utf-8")), None, True
        except Exception as exc:
            return None, f"({p}): invalid JSON ({exc})", True
    compact = "".join(val.split())
    if len(compact) >= 64 and "/" not in compact[:16] and not compact.endswith(".json"):
        try:
            padded = compact + "=" * (-len(compact) % 4)
            decoded = base64.b64decode(padded, validate=False).decode("utf-8", errors="strict").strip()
            if decoded.startswith("{"):
                return json.loads(decoded), None, True
        except Exception:
            pass
    return None, None, False


def resolve_sa_info(sa_file_override: Optional[str] = None, repo_root: Optional[Path] = None) -> tuple[dict, str]:
    """Resolve and validate the first non-corrupt service-account dict across all configured sources.
    Exits 2 when no credentials exist anywhere, or 4 (CREDENTIAL_CORRUPT_NO_RETRY) when present keys are corrupt."""
    candidates: list[tuple[str, Optional[str]]] = []
    if sa_file_override:
        candidates.append(("--sa-file", sa_file_override))
    for k in _SA_ENV_KEYS:
        candidates.append((f"env:{k}", os.environ.get(k)))
    candidates.extend(_parse_env_files_for_sa(repo_root))
    candidates.append(("~/.claude/secrets/gsc-service-account.json", os.path.expanduser("~/.claude/secrets/gsc-service-account.json")))

    errors: list[str] = []
    seen_values: set[str] = set()
    for label, raw in candidates:
        if not raw or not str(raw).strip():
            continue
        val = str(raw).strip()
        if val in seen_values:
            continue
        seen_values.add(val)
        info, err, present = _decode_sa_candidate(val)
        if not present:
            continue
        if err is not None:
            errors.append(f"{label}: {err}")
            continue
        ok, reason = _validate_sa_dict(info)
        if not ok:
            errors.append(f"{label}: {reason}")
            continue
        return info, label

    if errors:
        print(
            "CREDENTIAL_CORRUPT_NO_RETRY: GSC service-account key present but corrupt/truncated across all sources "
            f"({'; '.join(errors)}). Do NOT retry or fall back to Ahrefs; rotate GOOGLE_REPORTING_SA_JSON.",
            file=sys.stderr,
        )
        sys.exit(4)

    print(
        "ERROR: No service-account credentials found. Place SA JSON at "
        "~/.claude/secrets/gsc-service-account.json or set GOOGLE_REPORTING_SA_FILE.",
        file=sys.stderr,
    )
    sys.exit(2)


def _ensure_google_deps() -> None:
    import subprocess
    probe = subprocess.run(
        [sys.executable, "-c", "import requests; from google.auth.transport.requests import Request; from google.oauth2 import service_account; from cryptography.hazmat.primitives.asymmetric import rsa"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if probe.returncode == 0:
        return
    for extra in (["--break-system-packages", "--ignore-installed"], ["--ignore-installed"], ["--break-system-packages"], []):
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "-q", "--disable-pip-version-check", *extra, "cryptography", "cffi", "google-auth", "requests"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            recheck = subprocess.run(
                [sys.executable, "-c", "import requests; from google.oauth2 import service_account; from cryptography.hazmat.primitives.asymmetric import rsa"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            if recheck.returncode == 0:
                return
        except Exception:
            continue


def load_credentials(sa_file_override: Optional[str] = None):
    sa_info, source_label = resolve_sa_info(sa_file_override)
    _ensure_google_deps()
    try:
        from google.oauth2 import service_account
    except ImportError:
        print("ERROR: google-auth not installed. Run: pip install --break-system-packages google-auth requests",
              file=sys.stderr)
        sys.exit(1)

    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    try:
        return service_account.Credentials.from_service_account_info(sa_info, scopes=scopes)
    except Exception as exc:
        print(
            f"CREDENTIAL_CORRUPT_NO_RETRY: google-auth rejected {source_label} ({exc}). "
            "Do NOT retry or fall back to Ahrefs.",
            file=sys.stderr,
        )
        sys.exit(4)


def _normalize_url_typo(url: str) -> str:
    """Fix accidental double-www typos (e.g. https://www.www.droneanddefense.com)."""
    u = (url or "").strip()
    while "://www.www." in u.lower():
        idx = u.lower().index("://www.www.")
        u = u[: idx + 3] + u[idx + 7 :]
    while u.lower().startswith("www.www."):
        u = u[4:]
    return u


def derive_site_url(base_url: str, override: Optional[str] = None) -> str:
    """Derive the GSC property identifier from a base URL.
    base_url=https://www.example.com → sc-domain:example.com (default — covers all hosts/schemes).
    Override with --site-url for a URL-prefix property."""
    if override:
        return _normalize_url_typo(override)
    norm_base = _normalize_url_typo(base_url)
    host = urllib.parse.urlparse(norm_base).netloc or norm_base
    host = host.lower()
    while host.startswith("www."):
        host = host[4:]
    return f"sc-domain:{host}"


def query_search_analytics(session, site_url: str, body: dict, retries: int = 6) -> dict:
    """Hit the SearchAnalytics:query endpoint with per-site cloud cron stagger, polite pacing, and quota backoff."""
    import random
    import requests as req_lib

    _maybe_cron_stagger(site_url)
    timeout_s = int(os.environ.get("GSC_HTTP_TIMEOUT", "60"))
    quoted_site = urllib.parse.quote(site_url, safe="")
    endpoint = (
        f"https://searchconsole.googleapis.com/webmasters/v3/sites/"
        f"{quoted_site}/searchAnalytics/query"
    )
    quota_backoffs = (15, 30, 60, 90, 135)
    last_err = None
    for attempt in range(retries):
        _pace_gsc_call()
        try:
            r = session.post(endpoint, json=body, timeout=timeout_s)
            if r.status_code == 403:
                body_text = getattr(r, "text", "") or ""
                if _is_quota_403(403, body_text):
                    if attempt < retries - 1:
                        wait = quota_backoffs[min(attempt, len(quota_backoffs) - 1)] + random.uniform(0.5, 2.5)
                        print(
                            f"[gsc-quota] 403 quota/rate-limit on {site_url} (attempt {attempt + 1}/{retries}); "
                            f"sleeping {wait:.1f}s before retry",
                            file=sys.stderr,
                            flush=True,
                        )
                        time.sleep(wait)
                        continue
                    print(
                        f"ERROR 403 QUOTA: GSC Search Analytics load/rate quota exhausted on {site_url} after {retries} attempts: {body_text[:240]}",
                        file=sys.stderr,
                    )
                    sys.exit(11)
                print(f"ERROR 403: service account lacks permission on {site_url}. "
                      f"Add it as Full/Owner in GSC → Settings → Users and permissions.",
                      file=sys.stderr)
                sys.exit(3)
            if r.status_code in (408, 429, 500, 502, 503, 504) and attempt < retries - 1:
                base_wait = quota_backoffs[min(attempt, len(quota_backoffs) - 1)] if r.status_code == 429 else min(2 ** (attempt + 1), 24)
                retry_after = (getattr(r, "headers", None) or {}).get("Retry-After")
                if retry_after:
                    try:
                        base_wait = max(base_wait, min(int(float(retry_after)), 150))
                    except ValueError:
                        pass
                time.sleep(base_wait + random.uniform(0.5, 2.5))
                continue
            r.raise_for_status()
            return r.json()
        except req_lib.RequestException as e:
            last_err = e
            if attempt < retries - 1:
                time.sleep(min(2 ** (attempt + 1), 24) + random.uniform(0.5, 2.5))
                continue
            raise
    raise RuntimeError(f"unreachable: {last_err}")


def fetch_top_pages(session, site_url: str, window_days: int, limit: int) -> list[dict]:
    """Site-wide top pages ranked by clicks then impressions over the last N days.

    This is the "most visited pages" selector. GSC returns rows ordered by clicks
    desc; we over-fetch and re-sort by (clicks, impressions) so a pre-click site
    (lots of impressions, ~0 clicks) still ranks sensibly by visibility.
    """
    end = date.today()
    start = end - timedelta(days=window_days)
    fetch_n = max(limit * 5, 100)
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": ["page"],
        "rowLimit": fetch_n,
    }
    resp = query_search_analytics(session, site_url, body)
    rows = []
    for row in resp.get("rows", []):
        rows.append({
            "page": row.get("keys", [""])[0],
            "clicks": int(row.get("clicks", 0)),
            "impressions": int(row.get("impressions", 0)),
            "ctr": round(row.get("ctr", 0.0), 4),
            "position": round(row.get("position", 0.0), 2),
        })
    rows.sort(key=lambda r: (r["clicks"], r["impressions"]), reverse=True)
    return rows[:limit]


def fetch_page_summary(session, site_url: str, page_url: str, window_days: int) -> dict:
    """Get totals + top queries for one page over the last N days."""
    page_url = _normalize_url_typo(page_url)
    end = date.today()
    start = end - timedelta(days=window_days)
    body_base = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensionFilterGroups": [{
            "filters": [{
                "dimension": "page",
                "operator": "equals",
                "expression": page_url,
            }],
        }],
        "rowLimit": 25,
    }
    # Totals: no dimensions, single aggregate row
    totals_resp = query_search_analytics(session, site_url, {**body_base, "dimensions": []})
    totals_rows = totals_resp.get("rows", [])
    if totals_rows:
        t = totals_rows[0]
        totals = {
            "impressions": int(t.get("impressions", 0)),
            "clicks": int(t.get("clicks", 0)),
            "ctr": round(t.get("ctr", 0.0), 4),
            "position": round(t.get("position", 0.0), 2),
        }
    else:
        totals = {"impressions": 0, "clicks": 0, "ctr": 0.0, "position": 0.0}

    # Top queries
    q_resp = query_search_analytics(session, site_url, {**body_base, "dimensions": ["query"]})
    top_queries = []
    for row in q_resp.get("rows", []):
        top_queries.append({
            "query": row.get("keys", [""])[0],
            "impressions": int(row.get("impressions", 0)),
            "clicks": int(row.get("clicks", 0)),
            "ctr": round(row.get("ctr", 0.0), 4),
            "position": round(row.get("position", 0.0), 2),
        })
    return {"totals": totals, "top_queries": top_queries[:10]}


def fetch_trend(session, site_url: str, page_url: str, window_days: int = 90) -> dict:
    """Get week-bucketed impressions for the page over the last window_days."""
    page_url = _normalize_url_typo(page_url)
    end = date.today()
    start = end - timedelta(days=window_days)
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": ["date"],
        "dimensionFilterGroups": [{
            "filters": [{
                "dimension": "page",
                "operator": "equals",
                "expression": page_url,
            }],
        }],
        "rowLimit": 1000,
    }
    resp = query_search_analytics(session, site_url, body)
    daily = []
    for row in resp.get("rows", []):
        daily.append({
            "date": row.get("keys", [""])[0],
            "impressions": int(row.get("impressions", 0)),
            "clicks": int(row.get("clicks", 0)),
        })
    # Classify trend: compare first third vs last third
    if len(daily) < 14:
        trend = "insufficient-data"
    else:
        third = len(daily) // 3
        early = sum(d["impressions"] for d in daily[:third]) / max(third, 1)
        late = sum(d["impressions"] for d in daily[-third:]) / max(third, 1)
        if early == 0 and late == 0:
            trend = "no-traffic"
        elif early == 0:
            trend = "up"
        else:
            ratio = late / early
            if ratio >= 1.2:
                trend = "up"
            elif ratio <= 0.8:
                trend = "down"
            else:
                trend = "flat"
    return {"daily": daily, "trend_30d": trend}


def classify_verdict(summary: dict, trend: Optional[dict]) -> dict:
    """Decide whether a metadata rewrite is recommended based on perf signals.

    Rules (sensible defaults — tweak as you learn):
      - CTR < 3% at avg position < 10 → underperforming → REWRITE OK
      - Impressions trending DOWN for 30d → underperforming → REWRITE OK
      - No impressions → no-data → REWRITE OK (nothing to lose)
      - CTR >= 5% AND impressions trending UP → performing → DEFER rewrite
      - Otherwise → mixed → REWRITE OK with caution
    """
    t = summary["totals"]
    ctr = t["ctr"]
    impressions = t["impressions"]
    position = t["position"]
    trend_label = trend["trend_30d"] if trend else None

    if impressions == 0:
        return {
            "label": "no-data",
            "reason": "Page has no GSC impressions in window — nothing to lose by rewriting.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    if ctr >= 0.05 and trend_label == "up":
        return {
            "label": "performing",
            "reason": f"CTR {ctr:.1%} ≥ 5% AND impressions trending up — current title is working; DEFER rewrite.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": False,
        }
    if trend_label == "down":
        return {
            "label": "underperforming",
            "reason": f"Impressions trending DOWN over 30 days — rewrite justified.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    if ctr == 0.0 and impressions >= 50:
        return {
            "label": "underperforming",
            "reason": f"CTR 0% on {impressions} impressions (avg pos {position:.1f}) — page is shown but nobody clicks; rewrite justified.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    if ctr < 0.03 and position < 10:
        return {
            "label": "underperforming",
            "reason": f"CTR {ctr:.1%} < 3% at avg position {position:.1f} — title not pulling clicks; rewrite justified.",
            "ctr": ctr, "impressions": impressions, "position": position,
            "impressions_trend_30d": trend_label,
            "rewrite_recommended": True,
        }
    return {
        "label": "mixed",
        "reason": f"CTR {ctr:.1%}, position {position:.1f}, trend {trend_label} — neither clearly winning nor losing. Rewrite OK with caution.",
        "ctr": ctr, "impressions": impressions, "position": position,
        "impressions_trend_30d": trend_label,
        "rewrite_recommended": True,
    }


def build_session(creds):
    """Authenticated requests session with auto token refresh."""
    import requests
    from google.auth.transport.requests import Request as GoogleRequest

    class AuthSession(requests.Session):
        def __init__(self, credentials):
            super().__init__()
            self._creds = credentials
            self._gauth_req = GoogleRequest()

        def request(self, method, url, *args, **kwargs):  # type: ignore[override]
            if not self._creds.valid:
                self._creds.refresh(self._gauth_req)
            headers = kwargs.pop("headers", {}) or {}
            headers["Authorization"] = f"Bearer {self._creds.token}"
            return super().request(method, url, *args, headers=headers, **kwargs)

    return AuthSession(creds)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        description="GSC Search Analytics fetcher — page-level performance + rewrite verdict."
    )
    ap.add_argument("--base-url",
                    help="e.g. https://www.example.com — used to derive sc-domain:<host>.")
    ap.add_argument("--check-creds", action="store_true",
                    help="Validate GSC service-account JSON/PEM in pure stdlib (before pip install) and exit 0/2/4.")
    ap.add_argument("--page",
                    help="Full page URL to inspect. Use --stdin for batch.")
    ap.add_argument("--stdin", action="store_true",
                    help="Read one page URL per line from stdin (overrides --page).")
    ap.add_argument("--top-pages", type=int, metavar="N",
                    help="Site-wide: return the top N pages by clicks then impressions "
                         "(the 'most visited pages' selector). Ignores --page/--stdin.")
    ap.add_argument("--site-url",
                    help="Override the derived GSC property (e.g. URL-prefix property).")
    ap.add_argument("--sa-file", help="Path to service-account JSON (overrides env vars).")
    ap.add_argument("--days", type=int, default=30,
                    help="Summary window in days (default 30).")
    ap.add_argument("--trend", action="store_true",
                    help="Also fetch 90-day day-by-day impressions for trend classification.")
    ap.add_argument("--json", help="Write JSON results to file instead of stdout.")
    args = ap.parse_args(argv)

    if args.check_creds:
        info, source_label = resolve_sa_info(args.sa_file)
        print(json.dumps({"ok": True, "client_email": info.get("client_email"), "source": source_label}))
        return 0

    if not args.base_url:
        ap.error("--base-url is required unless --check-creds is set")
    if not args.page and not args.stdin and not args.top_pages:
        ap.error("--page, --stdin, or --top-pages required")

    site_url = derive_site_url(args.base_url, args.site_url)
    creds = load_credentials(args.sa_file)
    session = build_session(creds)

    # Site-wide top-pages mode: the "most visited pages" selector.
    if args.top_pages:
        top = fetch_top_pages(session, site_url, args.days, args.top_pages)
        payload = {"site_url": site_url, "window_days": args.days,
                   "top_pages": top}
        if args.json:
            with open(args.json, "w") as f:
                json.dump(payload, f, indent=2)
            print(f"Wrote {len(top)} top pages to {args.json}", file=sys.stderr)
        else:
            json.dump(payload, sys.stdout, indent=2)
            sys.stdout.write("\n")
        return 0

    pages = ([_normalize_url_typo(line.strip()) for line in sys.stdin if line.strip()]
             if args.stdin else [_normalize_url_typo(args.page)])

    results = []
    for page in pages:
        try:
            summary = fetch_page_summary(session, site_url, page, args.days)
            trend = fetch_trend(session, site_url, page, 90) if args.trend else None
            verdict = classify_verdict(summary, trend)
            results.append({
                "page": page,
                "site_url": site_url,
                "window_days": args.days,
                "totals": summary["totals"],
                "top_queries": summary["top_queries"],
                "trend": trend,
                "verdict": verdict,
            })
        except Exception as e:
            print(f"[warn] {page}: {e}", file=sys.stderr)
            results.append({"page": page, "error": str(e)})

    payload = results[0] if len(results) == 1 else results
    if args.json:
        with open(args.json, "w") as f:
            json.dump(payload, f, indent=2)
        print(f"Wrote {len(results)} page result(s) to {args.json}", file=sys.stderr)
    else:
        json.dump(payload, sys.stdout, indent=2)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
