#!/usr/bin/env python3
"""Fetch newly published business-facing law/rule candidates for the Compliance Alerts vertical.

Two lanes (both ported from the lawfare tracker in the weaponization_fund repo):
  1. FEDERAL — Federal Register API (free, no key): final RULEs published in the lookback
     window, all agencies. https://www.federalregister.gov/developers/documentation/api/v1
  2. STATES — OpenStates v3 API (needs OPENSTATES_API_KEY): recently updated bills in major
     states, kept only when the action timeline proves the bill actually became law
     (executive-signature / became-law classifications — the "passage-verification gate").

This script is deliberately DETERMINISTIC — no LLM calls (repo rule: content judgment happens
in Claude subagents during the pass, never via external LLM APIs). It fetches + normalizes;
classify.py applies the keyword obligation gate; the /compliance-alert-pass skill does the
final "is this really a business obligation?" judgment.

Output: prints normalized JSON to stdout (classify.py consumes it), or --out <path>.
Usage:  python3 scripts/compliance_pass/fetch.py [--days 7] [--out reports/compliance-pass/raw.json]
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import pathlib
import sys
import time
import urllib.parse
import urllib.request

FR_API = "https://www.federalregister.gov/api/v1/documents.json"
OS_API = "https://v3.openstates.org/bills"

# Major-state coverage, ported from the lawfare tracker's MAJOR_STATES.
MAJOR_STATES = [
    "CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI",
    "NJ", "VA", "WA", "MA", "CO",
]

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)


def _get_json(url: str, params: dict, headers: dict | None = None) -> dict:
    qs = urllib.parse.urlencode(params, doseq=True)
    req = urllib.request.Request(f"{url}?{qs}", headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


# ── Lane 1: Federal Register final rules ─────────────────────────────────────

def fetch_federal(days: int) -> list[dict]:
    """All final RULEs published in the window, normalized. No key required."""
    since = (dt.date.today() - dt.timedelta(days=days)).isoformat()
    out: list[dict] = []
    page = 1
    while True:
        params = {
            # ENACTED-ONLY: type=RULE returns FINAL (in-force / scheduled) rules only. Proposed
            # rules (type=PRORULE), notices, and presidential docs are excluded — we never
            # publish a rule that is still pending.
            "conditions[type][]": "RULE",
            "conditions[publication_date][gte]": since,
            "per_page": 100,
            "page": page,
            "order": "newest",
            # Pull the STRUCTURED metadata the classifier scores on — not just the abstract.
            # cfr_references = which CFR title it amends (the domain fingerprint); action =
            # sub-type (a "correction"/"delay" is not a new duty); topics = FR's own tags.
            "fields[]": [
                "title", "abstract", "document_number", "publication_date",
                "effective_on", "html_url", "agencies", "type", "significant",
                "action", "cfr_references", "topics",
            ],
        }
        try:
            data = _get_json(FR_API, params)
        except Exception as exc:  # noqa: BLE001
            print(f"[fetch] Federal Register page {page} failed: {exc}", file=sys.stderr)
            break
        for doc in data.get("results", []):
            agencies = [a for a in (doc.get("agencies") or []) if isinstance(a, dict)]
            out.append({
                "id": f"fr-{doc.get('document_number', '')}",
                "source_type": "federal_rule",
                "jurisdiction": "Federal",
                "title": doc.get("title") or "",
                "summary": doc.get("abstract") or "",
                "url": doc.get("html_url") or "",
                "agency": ", ".join(a.get("name", "") for a in agencies),
                "agency_slugs": [a.get("slug", "") for a in agencies if a.get("slug")],
                "citation": doc.get("document_number") or "",
                "published": doc.get("publication_date") or "",
                "effective_date": doc.get("effective_on") or "",
                "significant": bool(doc.get("significant")),
                # Structured signals for the classifier:
                "action": doc.get("action") or "",
                "cfr_titles": sorted({int(r["title"]) for r in (doc.get("cfr_references") or [])
                                      if isinstance(r, dict) and str(r.get("title", "")).isdigit()}),
                "topics": doc.get("topics") or [],
            })
        total_pages = data.get("total_pages") or 1
        if page >= total_pages or page >= 5:  # hard cap: 500 docs/run
            break
        page += 1
    print(f"[fetch] Federal Register: {len(out)} final rules since {since}", file=sys.stderr)
    return out


# ── Lane 2: OpenStates enacted state laws ────────────────────────────────────

# Action classifications that prove a bill actually became law (the passage gate).
ENACTED_CLASSIFICATIONS = {"executive-signature", "became-law"}
# Classifications that mean the bill is dead — never publish these.
DEAD_CLASSIFICATIONS = {"executive-veto", "veto-override-failure", "failure", "withdrawal"}


def fetch_states(days: int, api_key: str, states: list[str]) -> list[dict]:
    since = (dt.date.today() - dt.timedelta(days=days)).isoformat()
    out: list[dict] = []
    for state in states:
        params = {
            "jurisdiction": state,
            "sort": "latest_action_desc",
            "updated_since": since,
            "per_page": 20,  # API max
            "include": ["abstracts", "actions", "sponsorships"],
        }
        try:
            time.sleep(7)  # OpenStates rate limit: ~10 req/min (ported from lawfare fetcher)
            data = _get_json(OS_API, params, headers={"X-API-KEY": api_key})
        except Exception as exc:  # noqa: BLE001
            print(f"[fetch] OpenStates {state} failed: {exc}", file=sys.stderr)
            continue
        kept = 0
        for item in data.get("results", []):
            # ENACTED-ONLY gate (only laws already PASSED — never pending, vetoed, or dead).
            # Walk the action timeline: record the last enactment event, and flag any
            # veto/failure/withdrawal. Keep the bill only if it was enacted AND not killed.
            signed_date = ""
            dead = False
            for action in sorted(item.get("actions", []), key=lambda a: a.get("order", 0)):
                cls = set(action.get("classification", []))
                if ENACTED_CLASSIFICATIONS & cls:
                    signed_date = action.get("date", "")[:10]
                    dead = False  # a signature after an earlier setback re-enacts it
                if cls & DEAD_CLASSIFICATIONS:
                    dead = True
            if not signed_date or dead:
                continue  # pending, failed, vetoed, or withdrawn → skip
            abstracts = item.get("abstracts") or []
            summary = (abstracts[0].get("abstract") if abstracts else "") or item.get("title") or ""
            out.append({
                "id": f"os-{item.get('id', '')}",
                "source_type": "state_law",
                "jurisdiction": state,
                "title": item.get("title") or "",
                "summary": summary,
                "url": item.get("openstates_url") or "",
                "agency": "",
                "citation": item.get("identifier") or "",
                "published": signed_date,
                "effective_date": "",  # rarely structured in OpenStates; Claude extracts at write time
                "significant": False,
                # OpenStates' own subject tags — the state-lane analogue of CFR titles.
                "subjects": item.get("subject") or [],
                "agency_slugs": [],
                "action": "",
                "cfr_titles": [],
                "topics": [],
            })
            kept += 1
        print(f"[fetch] OpenStates {state}: {kept} enacted bills", file=sys.stderr)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=7, help="lookback window in days")
    ap.add_argument("--out", type=str, default="", help="write JSON here instead of stdout")
    ap.add_argument("--states", type=str, default=",".join(MAJOR_STATES),
                    help="comma-separated USPS codes, or empty to skip the state lane")
    ap.add_argument("--skip-states", action="store_true", help="federal lane only")
    args = ap.parse_args()

    items = fetch_federal(args.days)

    api_key = os.environ.get("OPENSTATES_API_KEY", "")
    states = [s.strip().upper() for s in args.states.split(",") if s.strip()]
    if args.skip_states or not states:
        pass
    elif not api_key:
        print("[fetch] OPENSTATES_API_KEY unset — skipping state lane", file=sys.stderr)
    else:
        items += fetch_states(args.days, api_key, states)

    payload = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "lookback_days": args.days,
        "count": len(items),
        "items": items,
    }
    text = json.dumps(payload, indent=2)
    if args.out:
        path = pathlib.Path(args.out)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
        print(f"[fetch] wrote {len(items)} items → {path}", file=sys.stderr)
    else:
        print(text)


if __name__ == "__main__":
    main()
