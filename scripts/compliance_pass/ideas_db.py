#!/usr/bin/env python3
"""Idea database + fuzzy dedup for the /compliance/ engine.

The source of truth for "have we already produced (or rejected) this law?" — a Supabase table
(`compliance_ideas`, project weaponization-fund) queried through two SECURITY DEFINER RPCs, so
this client needs only the PUBLISHABLE key (safe to commit / embed in the cloud routine), never
the service-role key.

Dedup is deterministic (NO AI / NO embeddings): exact citation match, plus pg_trgm trigram
similarity on a NORMALIZED title within the same jurisdiction. That catches both the identical
law and a near-duplicate ("Virginia Paid Sick Leave Law" vs "Virginia's New Paid-Sick-Leave
Requirements") before it reaches the expensive verify/write phases.

Two modes:
  check  — read candidates.json, tag each NEW vs DUPLICATE (against the DB AND within the batch),
           write the NEW ones (+ a dupes report) out.
  record — read an ideas JSON (shipped/rejected/flagged) and insert each into the DB.

Config (env): SUPABASE_URL (default the weaponization-fund project) and
SUPABASE_COMPLIANCE_KEY / SUPABASE_PUBLISHABLE_KEY (the publishable key).

Usage:
  python3 scripts/compliance_pass/ideas_db.py check  <candidates.json> --out <deduped.json>
  python3 scripts/compliance_pass/ideas_db.py record <ideas.json>
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://jqoerawizjoqldkhdshj.supabase.co").rstrip("/")
PUBLISHABLE_KEY = (
    os.environ.get("SUPABASE_COMPLIANCE_KEY")
    or os.environ.get("SUPABASE_PUBLISHABLE_KEY")
    or "sb_publishable_hiXi99G_2pPpu5-h9EtXew_egXNVDLK"  # weaponization-fund publishable (public)
)
SIMILARITY_THRESHOLD = 0.45  # trigram similarity at/above this (same jurisdiction) = near-duplicate

_STOPWORDS = {
    "the", "a", "an", "of", "for", "to", "and", "or", "in", "on", "act", "law", "rule", "rules",
    "relating", "regulation", "regulations", "requirement", "requirements", "amendment",
    "amendments", "new", "revised", "update", "updates", "s", "state", "states",
}


def normalize(title: str) -> str:
    """Lowercase, strip punctuation, drop filler words, collapse whitespace. Must stay identical
    on insert and on query so stored norm_title and query title are comparable."""
    t = re.sub(r"[^a-z0-9\s]", " ", (title or "").lower())
    toks = [w for w in t.split() if w and w not in _STOPWORDS]
    return " ".join(toks)


def _rpc(fn: str, payload: dict) -> list | dict:
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/rpc/{fn}",
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "apikey": PUBLISHABLE_KEY,
            "Authorization": f"Bearer {PUBLISHABLE_KEY}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read() or "null")


def check_one(cand: dict) -> list:
    """Return DB matches for one candidate (empty = novel)."""
    return _rpc("compliance_idea_matches", {
        "p_norm_title": normalize(cand.get("title", "")),
        "p_citation": cand.get("citation", "") or "",
        "p_jurisdiction": cand.get("jurisdiction", "") or "",
        "p_threshold": SIMILARITY_THRESHOLD,
    }) or []


def record_one(idea: dict) -> str:
    return _rpc("compliance_idea_record", {
        "p_status": idea.get("status", "shipped"),
        "p_source_type": idea.get("source_type", ""),
        "p_jurisdiction": idea.get("jurisdiction", ""),
        "p_category": idea.get("category") or idea.get("category_guess", ""),
        "p_title": idea.get("title", ""),
        "p_norm_title": normalize(idea.get("title", "")),
        "p_citation": idea.get("citation", "") or "",
        "p_citation_url": idea.get("citation_url") or idea.get("url", "") or "",
        "p_slug": idea.get("slug", "") or "",
        "p_target_keyword": idea.get("target_keyword", "") or "",
        "p_score": int(idea.get("score", 0) or 0),
        "p_reason": idea.get("reason", "") or "",
    })


def cmd_check(args) -> None:
    data = json.load(open(args.file))
    cands = data.get("candidates", data.get("items", []))
    new, dupes = [], []
    seen_norms: list[str] = []  # in-batch dedup too
    for c in cands:
        db_matches = check_one(c)
        norm = normalize(c.get("title", ""))
        # in-batch near-duplicate: crude token-overlap vs already-accepted this run
        batch_dup = next(
            (s for s in seen_norms if _overlap(norm, s) >= SIMILARITY_THRESHOLD), None
        )
        if db_matches:
            dupes.append({"candidate": c, "reason": "db", "matches": db_matches})
        elif batch_dup is not None:
            dupes.append({"candidate": c, "reason": "in-batch", "matches": [{"title": batch_dup}]})
        else:
            new.append(c)
            seen_norms.append(norm)
    out = {
        "checked": len(cands),
        "new": len(new),
        "duplicates": len(dupes),
        "candidates": new,          # only the novel ones proceed
        "dropped_duplicates": dupes,
    }
    text = json.dumps(out, indent=2)
    if args.out:
        open(args.out, "w").write(text)
        print(f"[ideas_db] {len(new)} new, {len(dupes)} duplicate → {args.out}", file=sys.stderr)
    else:
        print(text)


def _overlap(a: str, b: str) -> float:
    """Jaccard token overlap — a cheap in-process proxy for the DB's trigram check, used only
    to spot two near-identical candidates within the SAME run before either is recorded."""
    sa, sb = set(a.split()), set(b.split())
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def cmd_record(args) -> None:
    data = json.load(open(args.file))
    ideas = data.get("ideas", data.get("candidates", data if isinstance(data, list) else []))
    ids = []
    for idea in ideas:
        try:
            ids.append(record_one(idea))
        except Exception as exc:  # noqa: BLE001
            print(f"[ideas_db] record failed for {idea.get('title','?')[:50]}: {exc}", file=sys.stderr)
    print(f"[ideas_db] recorded {len(ids)} idea(s)", file=sys.stderr)


def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("check"); c.add_argument("file"); c.add_argument("--out", default="")
    r = sub.add_parser("record"); r.add_argument("file")
    args = ap.parse_args()
    {"check": cmd_check, "record": cmd_record}[args.cmd](args)


if __name__ == "__main__":
    main()
