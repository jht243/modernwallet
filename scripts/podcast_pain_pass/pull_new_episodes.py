#!/usr/bin/env python3
"""Pull NEW transcript-ready podcast episodes since the last weekly run.

Stdlib only. Reads scripts/podcast_pain_pass/feeds.json, diffs each feed against
reports/podcast-pain-pass/ledger.json (processed episode GUIDs), downloads the
transcript for each new episode, normalizes it to plain text, and writes a
run manifest the miner consumes. Updates the ledger.

Usage:
  python3 scripts/podcast_pain_pass/pull_new_episodes.py \
      --out reports/podcast-pain-pass/run-<DATE> --max-per-show 8

Circuit breaker: --max-per-show caps episodes pulled per feed per run so a first
run (or a long gap) does not ingest a whole back catalog at once.
"""
from __future__ import annotations
import argparse, json, os, re, html, sys, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FEEDS = Path(__file__).resolve().parent / "feeds.json"
LEDGER = Path(os.environ.get("PPP_LEDGER", str(ROOT / "reports" / "podcast-pain-pass" / "ledger.json")))
UA = {"User-Agent": "modernwallet-podcast-pain-pass/1.0 (+https://www.themodernwallet.com)"}


def get(url: str, timeout: int = 40) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "ignore")


def load_ledger() -> dict:
    if LEDGER.exists():
        return json.loads(LEDGER.read_text())
    return {"version": 1, "shows": {}, "shipped_slugs": []}


def save_ledger(led: dict) -> None:
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    LEDGER.write_text(json.dumps(led, indent=1))


def transcript_url(item: str):
    tags = re.findall(r"<podcast:transcript\b[^>]*>", item)
    best = {}
    for t in tags:
        u = re.search(r'url="([^"]+)"', t)
        ty = re.search(r'type="([^"]+)"', t)
        if u:
            best[(ty.group(1) if ty else "").lower()] = u.group(1)
    for pref in ("text/plain", "text/vtt", "application/x-subrip", "application/srt", "text/html"):
        if pref in best:
            return best[pref], pref
    return (next(iter(best.values())), "?") if best else (None, None)


def to_text(raw: str, kind: str) -> str:
    raw = re.sub(r"WEBVTT.*?\n", "", raw)
    raw = re.sub(r"\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}.*", "", raw)
    raw = re.sub(r"^\s*\d+\s*$", "", raw, flags=re.M)
    # Strip ALL angle-bracket tags (HTML transcripts AND WebVTT voice/cue tags like
    # <v Speaker>, </v>, <c>); transcripts carry no markup worth keeping.
    raw = re.sub(r"</?[a-zA-Z][^>]*>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(raw)).strip()


def field(item: str, tag: str) -> str:
    m = re.search(rf"<{tag}[^>]*>(.*?)</{tag}>", item, re.S)
    return html.unescape(re.sub(r"<[^>]+>", "", m.group(1)).strip()) if m else ""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True, help="run output dir")
    ap.add_argument("--max-per-show", type=int, default=8)
    args = ap.parse_args()

    out = ROOT / args.out
    (out / "transcripts").mkdir(parents=True, exist_ok=True)
    roster = json.loads(FEEDS.read_text())["shows"]
    led = load_ledger()
    manifest = []

    for show in roster:
        name, topic, feed = show["name"], show["topic"], show["feed"]
        sled = led["shows"].setdefault(name, {"processed_guids": []})
        seen = set(sled["processed_guids"])
        try:
            xml = get(feed)
        except Exception as e:
            print(f"WARN  {name}: feed error {e}", file=sys.stderr)
            continue
        items = re.findall(r"<item>.*?</item>", xml, re.S)
        pulled = 0
        for it in items:
            if pulled >= args.max_per_show:
                break
            guid = field(it, "guid") or field(it, "link")
            if not guid or guid in seen:
                continue
            turl, kind = transcript_url(it)
            if not turl:
                continue  # no transcript -> cannot auto-mine; skip (do not mark seen)
            try:
                text = to_text(get(turl), kind)
            except Exception:
                continue
            if len(text) < 800:
                continue
            title = field(it, "title")
            slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:60] or f"ep-{pulled}"
            tp = out / "transcripts" / f"{topic}__{slug}.txt"
            tp.write_text(text)
            manifest.append({"show": name, "topic": topic, "title": title,
                             "guid": guid, "transcript": str(tp.relative_to(ROOT)),
                             "words": len(text.split())})
            sled["processed_guids"].append(guid)
            pulled += 1
        print(f"{name}: {pulled} new episode(s) pulled")

    (out / "manifest.json").write_text(json.dumps(manifest, indent=1))
    save_ledger(led)
    print(f"\nTotal new episodes: {len(manifest)} -> {out/'manifest.json'}")
    if len(manifest) == 0:
        print("NO_NEW_EPISODES")  # orchestrator treats this as a no-op week
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
