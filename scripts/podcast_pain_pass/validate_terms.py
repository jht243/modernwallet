#!/usr/bin/env python3
"""Translate mined patient-pain clusters into real informational search terms and
SEMRUSH-validate them.

Stdlib only. Reads pain_clusters.json (theme -> count), expands each PRESENT theme
into candidate SEARCH phrases (the questions/terms readers actually type — NOT the
pain phrasing), validates them on SEMRUSH (phrase_these + phrase_kdi), and writes
validated_terms.json for the auto-approve chart step. Only terms at/above --floor
survive. Each term is tagged with the site hub used for internal linking.

Needs SEMRUSH_API_KEY in the environment.

Usage:
  SEMRUSH_API_KEY=... python3 scripts/podcast_pain_pass/validate_terms.py \
      --run reports/podcast-pain-pass/run-<DATE> --floor 70
"""
from __future__ import annotations
import argparse, csv, json, os, urllib.parse, urllib.request, urllib.error
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "lib"))
from keyword_data import volumes, passes_floor, score_volume, notes  # noqa: E402

# theme -> the internal-linking hub on themodernwallet.com
HUBS = {
    "retirement": "/retirement",
    "investing": "/investing",
    "budget": "/budget",
    "real-estate": "/real-estate",
    "tax-estate": "/estate-planning",
    "net-worth": "/net-worth",
}

# theme -> candidate informational search phrases. Encodes the pain->query insight;
# SEMRUSH then filters to real demand. These are questions/terms people TYPE, not the
# spoken pain from the transcript.
THEME_TERMS = {
    "retirement": ["how much do i need to retire", "roth vs traditional ira", "when to take social security", "coast fire calculator", "safe withdrawal rate", "4.7 percent rule", "retirement stress test", "how to turn savings into retirement paycheck"],
    "investing": ["how to start investing", "index funds vs etf", "dividend investing strategy", "portfolio rebalancing", "target date fund fees", "brokerage account vs ira", "tax loss harvesting", "capital gains harvesting"],
    "budget": ["how to make a budget", "emergency fund amount", "debt payoff strategy", "50 30 20 rule", "retirement budget", "how much can i spend in retirement"],
    "real-estate": ["mortgage payoff calculator", "rental property roi", "should i refinance", "closing costs explained", "arm vs fixed rate mortgage", "brrrr method", "house hacking", "how to evict squatters"],
    "tax-estate": ["estate planning basics", "how does probate work", "tax deductions checklist", "trust vs will", "0 capital gains bracket", "hsa triple tax advantage", "how to appeal property taxes"],
    "net-worth": ["how to calculate net worth", "average net worth by age", "net worth milestones"],
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True)
    ap.add_argument("--floor", type=int, default=70, help="min monthly volume to keep")
    ap.add_argument("--database", default=os.environ.get("SEMRUSH_DATABASE", "us"))
    args = ap.parse_args()

    run = ROOT / args.run
    clusters = json.loads((run / "pain_clusters.json").read_text())

    # build candidate set from PRESENT themes only
    candidates = {}  # phrase -> {theme}
    for theme in clusters:
        for p in THEME_TERMS.get(theme, []):
            candidates.setdefault(p, {"theme": theme})
    phrases = list(candidates)
    if not phrases:
        (run / "validated_terms.json").write_text("[]")
        print("No candidate phrases generated.")
        return

    # Volume validation via the shared fallback ladder (never blocks on a dry key)
    rows = volumes(phrases, database=args.database)

    out = []
    for p, meta in candidates.items():
        r = rows.get(p.lower())
        if not r or not passes_floor(r, args.floor):
            continue
        vol = r.get("volume", 0)
        out.append({"phrase": p, "volume": vol,
                    "kd": r.get("kd", ""), "source": r.get("source", ""),
                    "confidence": r.get("confidence", ""),
                    "volume_low": r.get("volume_low"),
                    "volume_high": r.get("volume_high"),
                    "scored_volume": score_volume(r),
                    "theme": meta["theme"], "hub": HUBS.get(meta["theme"], "/")})
    # PODCAST_VALIDATE_BATCH_CAP_V1 — filter already-covered slugs & cap per-run batch so >20 never holds
    import re as _re
    _ledger_path = ROOT / "reports" / "podcast-pain-pass" / "ledger.json"
    _covered = set()
    try:
        if _ledger_path.is_file():
            _ld = json.loads(_ledger_path.read_text() or "{}")
            for _s in (_ld.get("shipped_slugs") or []):
                if isinstance(_s, str) and _s.strip():
                    _covered.add(_s.strip().strip("/").rsplit("/", 1)[-1].lower())
    except Exception:
        pass
    for _gdir in ("src/content/guides", "src/content/posts", "content/guides", "content/posts"):
        _gp = ROOT / _gdir
        if _gp.is_dir():
            for _f in _gp.glob("*.md*"):
                _covered.add(_f.stem.lower())
    def _term_covered(_phrase: str) -> bool:
        _sl = _re.sub(r"[^a-z0-9]+", "-", (_phrase or "").lower()).strip("-")
        if not _sl:
            return False
        if _sl in _covered:
            return True
        _dest = _re.sub(
            r"(?:^(?:is-it-safe-to-travel-to-|is-it-safe-to-visit-|is-(?:the-)?)|-safe(?:-to-travel|-to-visit)?$)",
            "",
            _sl,
        ).strip("-")
        if _dest and _dest != _sl and not _sl.endswith("for-solo-female-travelers") and _dest in _covered:
            return True
        return False
    out = [_row for _row in out if not _term_covered(_row.get("phrase", ""))]
    out.sort(key=lambda x: -x["scored_volume"])
    _max_terms = max(1, int(os.environ.get("PODCAST_MAX_VALIDATED_TERMS", "10") or "10"))
    if len(out) > _max_terms:
        _overflow = out[_max_terms:]
        out = out[:_max_terms]
        (run / "validated_terms_overflow.json").write_text(json.dumps(_overflow, indent=1))
    (run / "validated_terms.json").write_text(json.dumps(out, indent=1))
    (run / "keyword_data_notes.json").write_text(json.dumps(notes(), indent=1))
    _src = {}
    for _e in out:
        _src[_e["source"]] = _src.get(_e["source"], 0) + 1
    print(f"Sources: {_src}")
    if _src.get("estimate"):
        print("NOTE: estimate rows carry a volume BAND, not measured volume — "
              "label them as estimated in the chart.")
    print(f"Validated {len(out)}/{len(phrases)} candidate terms >= {args.floor} vol/mo")
    for e in out[:25]:
        print(f"  {e['volume']:>6}  KD{e['kd']:<3}  {e['phrase']}  [{e['theme']}]")
    print(f"-> {run/'validated_terms.json'}")


if __name__ == "__main__":
    main()
