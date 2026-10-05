#!/usr/bin/env python3
"""Diagnose every dropped page on an ESCALATING scale — before any work is done.

Each page gets the lowest level that fixes it (plus any lower-level fixes it also
needs). Cheap levels are code; only the top levels use a writer.

  L0 MONITOR        nothing to fix on the page (searches dried up / no gap found)
  L1 TECH           Google can't index it properly (status, noindex, canonical)  → fix the cause
  L2 DATA REFRESH   stale prices vs data/pricing.ts, or the model it covers has a
                    successor we already cover (searches moved to the new model)  → code, seconds
  L3 METADATA       the lost searches' words aren't in the title/description, or
                    another of our pages took them (sharpen the angle)            → 1 short call
  L4 SECTION        the page body doesn't answer one or more lost searches        → one new section
  L5 REWRITE        most of the lost demand isn't served anywhere on the page     → full page regeneration

Every signal is measured from the packet (Google detection data + the page's own
text + the pricing ledger). Nothing is guessed by a model at this step; the
planner later confirms L3+ only.

Writes <packets>/<slug>/diagnosis.json and <packets>/diagnosis.md (the chart).
Usage: scripts/rank_drop/diagnose.py --packets reports/rank-drop/<date>/packets
"""

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LEVELS = {0: "MONITOR", 1: "TECH", 2: "DATA REFRESH", 3: "METADATA", 4: "SECTION", 5: "REWRITE"}
MEANS = {0: "nothing to fix on the page", 1: "Google can't index it properly — fix the cause",
         2: "stale prices / model replaced by a successor we cover — code, seconds",
         3: "title/description miss the lost searches, or our own page took them — 1 short call",
         4: "body doesn't answer some lost searches — add one section",
         5: "most lost demand unserved anywhere on the page — full rewrite (automated, audit-gated, auto-revert)"}
STOP = set("""a an the and or of for to in on at by with vs versus is are was be can do does how what
which who why when best top free 2025 2026 new latest model models ai review reviews guide using use
your my me i it its this that than""".split())
STR = re.compile(r"""(?P<q>["'`])((?:\\.|(?!(?P=q)).)*)(?P=q)""")
META_KEYS = ("metaTitle", "metaDescription", "h1", "title", "subtitle")


def norm(t: str) -> list[str]:
    t = t.lower().replace("\\'", "'")
    t = re.sub(r"(\d)-(\d)", r"\1.\2", t)          # gpt-5-6 -> gpt 5.6 when it appears slug-style
    return [w for w in re.split(r"[^a-z0-9.]+", t) if w and w.strip(".") and w not in STOP]


def page_text(src: str) -> tuple[str, str]:
    meta, body = [], []
    for m in re.finditer(r"""["']?(\w+)["']?\s*:\s*""" + STR.pattern, src):
        (meta if m.group(1) in META_KEYS else body).append(m.group(3))
    for m in STR.finditer(src):                     # array items (content: [ '...', '...' ])
        body.append(m.group(2))
    return " ".join(meta), " ".join(body)


def covered(q: str, text_tokens: set[str], squashed: str = "") -> float:
    """Share of the query's words on the page. 'kimik3' / 'chatgpt6' style typos count when the
    squashed page text (no spaces/punctuation) contains them."""
    toks = norm(q)
    if not toks:
        return 1.0
    return sum(t in text_tokens or (len(t) >= 4 and t.replace(".", "") in squashed) for t in toks) / len(toks)


def junk(q: dict) -> bool:
    """Searches not worth fixing a page for: tiny volume, path/URL fragments, gibberish tokens."""
    text = q["query"]
    if q["base_impr_d"] < 2:
        return True
    if re.search(r"[/\\]|https?|\.com|\.io", text):
        return True
    words = text.split()
    if any(w.count("-") >= 2 for w in words):                       # code-like: evt-parade-mkt
        return True
    return any(len(w) >= 14 or (len(w) >= 9 and re.search(r"\d", w) and re.search(r"[a-z]{5,}", w))
               for w in re.split(r"[\s-]+", text))                  # k3knightwired


def pricing() -> list[tuple[str, float, float, list[float]]]:
    rows = []
    from siteconf import site
    led = site().get("price_ledger")
    f = ROOT / led if led else None
    if not f or not f.exists():
        return rows                                   # no price ledger on this site → L2 price checks off
    for line in f.read_text().splitlines():
        m = re.search(r"model:\s*'([^']+)'.*?inputPer1M:\s*([\d.]+),\s*outputPer1M:\s*([\d.]+)", line)
        if m:
            extra = [float(x) for x in re.findall(r"cachedInputPer1M:\s*([\d.]+)", line)]
            rows.append((m.group(1), float(m.group(2)), float(m.group(3)), extra))
    return rows


_UNIT = r"\s*(?:(?:/|per)\s*(?:1M|M\b|MTok|million)(?:\s+tokens)?)?\s*(?:of\s+)?"
PRICE_PAIR = re.compile(r"\$(\d+(?:\.\d+)?)" + _UNIT + r"input\b[^$]{0,20}?\$(\d+(?:\.\d+)?)" + _UNIT + r"output\b",
                        re.I)                                       # strictly "$X … input … $Y … output"
# Short pair forms right after a model name: "$5/$30", "$5 / $30", "$5 and $30", "$5 + $30", "$5 in / $30 out"
PAIR_ANY = re.compile(r"\$(\d+(?:\.\d+)?)\s*(?:in(?:put)?\s*)?(?:/|and|\+|,)\s*\$(\d+(?:\.\d+)?)", re.I)


def _table_rows(text: str) -> list[list[str]]:
    rows = []
    for line in re.split(r"\\n|\n", text):
        if line.strip().startswith("|") and not re.match(r"^\|[\s|:-]+\|?$", line.strip()):
            rows.append([c.strip() for c in line.strip().strip("|").split("|")])
    return rows if len(rows) >= 2 else []


def table_prices(text: str, names: dict) -> list[tuple[str, tuple[float, float]]]:
    """(model, (in, out)) pairs read from a markdown table — a row per model or a column per model."""
    out = []
    rows = _table_rows(text)
    if not rows:
        return out
    money = lambda c: [float(x) for x in re.findall(r"\$(\d+(?:\.\d+)?)", c)]
    head = [h.lower() for h in rows[0]]
    for r in rows[1:]:                                              # row per model
        label = r[0].lower()
        m = next((names[n] for n in sorted(names, key=len, reverse=True) if re.search(re.escape(n) + r"(?![\w.])", label)), None)
        vals = [v for c in r[1:] for v in money(c)]
        if m and len(vals) >= 2:
            out.append((m, (vals[0], vals[1])))
    for k, h in enumerate(head[1:], 1):                             # column per model
        m = next((names[n] for n in sorted(names, key=len, reverse=True) if re.search(re.escape(n) + r"(?![\w.])", h)), None)
        if not m:
            continue
        cells = {r[0].lower(): r[k] for r in rows[1:] if len(r) > k}
        pair = next((money(c)[:2] for lbl, c in cells.items() if "price" in lbl and len(money(c)) >= 2), None)
        if not pair:
            i = next((money(c)[0] for lbl, c in cells.items() if "input" in lbl and money(c)), None)
            o = next((money(c)[0] for lbl, c in cells.items() if "output" in lbl and money(c)), None)
            pair = [i, o] if i is not None and o is not None else None
        if pair:
            out.append((m, (pair[0], pair[1])))
    return out


def aliases_on_page(entry: str) -> dict[str, str]:
    """alias (lowercase) -> ledger model, for every priced model named on this page. An alias is
    kept only if it points at ONE model on this page: 'Sol' means GPT-5.6 Sol on a page that only
    names GPT-5.6 Sol, but is dropped on a page that also names GPT-6 Sol."""
    low = entry.lower()
    present = [r[0] for r in pricing() if re.search(re.escape(r[0].lower()) + r"(?![\w.])", low)]
    cand: dict[str, set] = {}
    for model in present:
        n = model.lower()
        forms = {n, re.sub(r"^(claude|openai|google|meta|xai)\s+", "", n)}
        parts = n.split()
        if len(parts) > 1:
            forms.add(parts[-1])                                   # 'sol', 'opus 5' -> '5' is skipped below
        for f in forms:
            if len(f) >= 3 and not f.isdigit():
                cand.setdefault(f, set()).add(model)
    return {f: next(iter(ms)) for f, ms in cand.items() if len(ms) == 1}



def _stale_prices_raw(body: str, rows, strings: list[str] | None = None) -> list[dict]:
    """A model named right before an API price pair ('$X … input … $Y … output', '$5/$30',
    '$5 and $30', '$5 + $30') that disagrees with the verified ledger. Names are resolved per page
    (aliases_on_page): 'Sol' counts as GPT-5.6 Sol only on a page where no other Sol is named. A
    mention's window stops at the next name of ANY model, so a neighbour's price is never pinned on
    the model named earlier."""
    low = body.lower()
    alias = aliases_on_page(body)
    ledger = {r[0]: r for r in rows}
    names = sorted(alias, key=len, reverse=True)
    if not names:
        return []
    # every word that names some model (incl. ambiguous short names) ends a window
    stopwords = set(names)
    for n in {r[0].lower() for r in rows}:
        parts = n.split()
        stopwords.add(parts[-1])
        if len(parts) > 1 and re.search(r"\d", " ".join(parts[:-1])):
            stopwords.add(" ".join(parts[:-1]))
    stopwords = {x for x in stopwords if len(x) >= 3 and not x.replace(".", "").isdigit()}   # never "5" (it hit "$5")
    stop_re = re.compile(r"\b(" + "|".join(re.escape(x) for x in sorted(stopwords, key=len, reverse=True)) + r")(?![\w.])")
    mentions = sorted((m.start(), m.end(), n) for n in names
                      for m in re.finditer(r"\b" + re.escape(n) + r"(?![\w.])", low)
                      # a one-word short name ('flash', 'sol') right after another product token
                      # ('V4.1 Flash', 'Gemini Flash') belongs to THAT product, not the ledger model
                      if " " in n or not re.search(r"(?:\d[\w.]*|[a-z]{3,})\s+$", low[max(0, m.start() - 14):m.start()])
                      or re.search(re.escape(alias[n].lower().rsplit(" ", 1)[0]) + r"\s+$", low[max(0, m.start() - 30):m.start()]))
    keep, last_end = [], -1
    for a, b, n in mentions:                      # drop mentions nested inside a longer one
        if a >= last_end:
            keep.append((a, b, n))
            last_end = b
    out, seen = [], set()
    for a, b, n in keep:
        model = alias[n]
        w_end = b + 120
        st = stop_re.search(low, b, w_end)
        while st and alias.get(st.group(1)) == model:      # the same model named again is not a stop
            st = stop_re.search(low, st.end(), w_end)
        window = body[b:(st.start() if st else w_end)]
        m = PRICE_PAIR.search(window) or PAIR_ANY.search(window[:60])
        if not m or model in seen:
            continue
        _, inp, outp, extra = ledger[model]
        found = (float(m.group(1)), float(m.group(2)))
        if found != (inp, outp):
            seen.add(model)
            out.append({"model": model, "found": list(found), "ledger": [inp, outp],
                        "context": body[a:b + 120][:200]})
    # Ambiguous short names ('Sol' on a page naming both GPT-5.6 Sol and GPT-6 Sol): code can't tell
    # which model a price belongs to, so any pair after the short name that matches NO candidate's
    # ledger price is flagged as ambiguous — those sentences go to the fact-fix rewrite, which reads
    # the context; code never swaps them.
    short_models = {}
    for r in rows:
        parts = r[0].lower().split()
        if len(parts) > 1 and len(parts[-1]) >= 3:
            short_models.setdefault(parts[-1], []).append(r[0])
    present = set(alias.values())
    for short, cands in short_models.items():
        cands = [c for c in cands if c in present]
        if len(cands) < 2 or short in alias:
            continue
        for m0 in re.finditer(r"\b" + re.escape(short) + r"\b", low):
            m = PAIR_ANY.search(body[m0.end():m0.end() + 60]) or PRICE_PAIR.search(body[m0.end():m0.end() + 120])
            if not m:
                continue
            found = (float(m.group(1)), float(m.group(2)))
            if all(found != (ledger[c][1], ledger[c][2]) for c in cands) and ("?" + short) not in seen:
                seen.add("?" + short)
                out.append({"model": " or ".join(cands), "ambiguous": True, "candidates": cands,
                            "found": list(found), "ledger": None, "context": body[m0.start():m0.end() + 120][:200]})
    # tables (a row per model or a column per model) state prices without any sentence around them
    for text in (strings or []):
        if text.count("|") < 6:
            continue
        for model, found in table_prices(text, alias):
            _, inp, outp, extra = ledger[model]
            if model in seen or found == (inp, outp):
                continue
            seen.add(model)
            out.append({"model": model, "found": list(found), "ledger": [inp, outp], "context": "table"})
    return out



def stale_prices(body: str, rows, strings: list[str] | None = None) -> list[dict]:
    """_stale_prices_raw + one safety rule: if two different models on the page are 'found' at the
    SAME price pair, the attribution is unreliable (one of them is reading its neighbour's price), so
    both become ambiguous — sentence rewrite only, never a code swap. Stops a swap from turning Sol's
    $5/$30 into Fable's $10/$50."""
    out = _stale_prices_raw(body, rows, strings)
    by_pair = {}
    for e in out:
        if not e.get("ambiguous"):
            by_pair.setdefault(tuple(e["found"]), []).append(e)
    for pair, es in by_pair.items():
        if len({e["model"] for e in es}) > 1:
            cands = sorted({e["model"] for e in es})
            for e in es:
                e.update({"ambiguous": True, "candidates": cands, "ledger": None,
                          "model": " or ".join(cands)})
    return out

def diagnose(pk: dict, src: str, rows) -> dict:
    meta, body = page_text(src)
    meta_t, body_t = set(norm(meta)), set(norm(meta + " " + body))
    sq_meta = re.sub(r"[^a-z0-9]", "", meta.lower())
    sq_all = re.sub(r"[^a-z0-9]", "", (meta + body).lower())
    lost = [q for q in pk["lost_searches"] if not junk(q)]
    clicks = pk["traffic"]["gsc_clicks_d"]
    if clicks["baseline"] and clicks["current"] >= 0.9 * clicks["baseline"]:
        return {"level": 0, "label": LEVELS[0], "needs": [],
                "evidence": {"net_healthy": f"page clicks {clicks['baseline']}→{clicks['current']}/day — "
                                            "individual searches moved, the page did not drop"}}
    if not lost:
        return {"level": 0, "label": LEVELS[0], "needs": [],
                "evidence": {"only_junk_searches": [q["query"] for q in pk["lost_searches"]][:5]}}
    impr = sum(q["base_impr_d"] for q in lost) or 1.0
    needs, ev = set(), {}

    tech = pk.get("tech") or {}
    if tech and not tech.get("ok", True):
        return {"level": 1, "label": LEVELS[1], "needs": [1], "evidence": {"tech": tech}}

    # L2 — data
    sp = stale_prices(body, rows, [m.group(2) for m in STR.finditer(src)])
    if sp:
        needs.add(2)
        ev["stale_prices"] = sp
    if pk.get("cooldown"):
        # fixed less than 28 days ago: only a data correction is allowed (a wrong price can't wait
        # for the measurement window); every content level waits for the 28-day verdict
        return {"level": 2 if sp else 0, "label": LEVELS[2] if sp else "COOLDOWN",
                "needs": [2] if sp else [], "evidence": ev or {"cooldown": "treated <28 days ago"}}
    own_versions = set(re.findall(r"\d+\.\d+|k\d+", " ".join(norm(pk["slug"]))))
    old_q = [q for q in lost if own_versions & set(norm(q["query"]))]
    moved = sum(q["base_impr_d"] for q in old_q) / impr
    if pk.get("successor_routes") and moved >= 0.5:
        needs.add(2)
        ev["demand_moved_to_successor"] = {"share_of_lost_impressions": round(moved, 2),
                                           "successors": pk["successor_routes"][:5]}

    # L3/L4/L5 — only for searches that are still about THIS page's subject
    live_q = [q for q in lost if q not in old_q] if moved >= 0.5 else lost
    live_impr = sum(q["base_impr_d"] for q in live_q) or 0.0
    top = sorted(live_q, key=lambda q: -q["base_impr_d"])[:3]
    meta_miss = [q["query"] for q in top if covered(q["query"], meta_t, sq_meta) < 1.0]
    if meta_miss:
        needs.add(3)
        ev["searches_missing_from_title_description"] = meta_miss
    if pk.get("taker_routes"):
        needs.add(3)
        ev["our_other_pages_took_searches"] = pk["taker_routes"][:5]
    body_miss = [q for q in live_q if covered(q["query"], body_t, sq_all) < 0.75]
    if body_miss:
        share = sum(q["base_impr_d"] for q in body_miss) / (live_impr or 1.0)
        ev["searches_not_answered_in_body"] = [q["query"] for q in body_miss][:8]
        ev["unanswered_share"] = round(share, 2)
        ranking = sum(q["base_impr_d"] for q in live_q if q["class"] == "RANKING_LOSS") / (live_impr or 1.0)
        if share >= 0.6 and ranking >= 0.5 and len(live_q) >= 3:
            needs.add(5)
        else:
            needs.add(4)

    # Ranking loss on searches the page already covers word-for-word: the page is out-served,
    # not missing words — that needs the competitor study + a section upgrade (L4), never L0.
    # VANISHED = dropped out of the logged results (~30+). When the page itself lost half its
    # clicks, treat those as ranking losses too, not as searches that dried up.
    fell = clicks["baseline"] and clicks["current"] <= 0.5 * clicks["baseline"]
    ranking = [q for q in live_q if q["class"] == "RANKING_LOSS" or (fell and q["class"] == "VANISHED")]
    r_share = sum(q["base_impr_d"] for q in ranking) / (live_impr or 1.0)
    if ranking and r_share >= 0.3 and 4 not in needs and 5 not in needs:
        needs.add(4)
        ev["outranked_on_covered_searches"] = [f"{q['query']} #{q['base_pos']}→#{q['cur_pos']}" for q in ranking[:4]]

    level = max(needs) if needs else 0
    return {"level": level, "label": LEVELS[level], "needs": sorted(needs), "evidence": ev}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    a = ap.parse_args(argv)
    P = Path(a.packets)
    queue = json.load(open(P / "queue.json"))["queue"]
    rows = pricing()
    chart = []
    for item in queue:
        d = P / item["slug"]
        pk = json.load(open(d / "packet.json"))
        if (d / "page.ts").exists():
            dx = diagnose(pk, (d / "page.ts").read_text(), rows)
        else:                                          # non-TS backend: plain page text, meta from packet
            md = (d / "page.md").read_text()
            src = "\n".join([f'metaTitle: {json.dumps(pk.get("title", ""))}',
                             f'metaDescription: {json.dumps(pk.get("description", ""))}'] +
                            [json.dumps(l) for l in md.splitlines() if l.strip()])
            dx = diagnose(pk, src, rows)
        (d / "diagnosis.json").write_text(json.dumps(dx, indent=2))
        chart.append((item, pk, dx))

    counts = Counter(dx["level"] for _, _, dx in chart)
    L = ["# Rank-drop diagnosis", "",
         "| level | what it means | pages |", "|---|---|---|"]
    for lv in range(6):
        L.append(f"| L{lv} {LEVELS[lv]} | {MEANS[lv]} | {counts.get(lv, 0)} |")
    L += ["", "| page | level | also needs | lost clicks/day | why |", "|---|---|---|---|---|"]
    for item, pk, dx in sorted(chart, key=lambda c: (-c[2]["level"], c[0]["path"])):
        e = dx["evidence"]
        why = []
        if "stale_prices" in e:
            why.append("stale price: " + ", ".join(f"{s['model']} ${s['found']}→${s['ledger']}" for s in e["stale_prices"][:2]))
        if "demand_moved_to_successor" in e:
            why.append(f"{int(e['demand_moved_to_successor']['share_of_lost_impressions']*100)}% of lost demand was for the old model")
        if "searches_missing_from_title_description" in e:
            why.append("title misses: " + "; ".join(e["searches_missing_from_title_description"][:2]))
        if "our_other_pages_took_searches" in e:
            why.append("taken by " + ", ".join(e["our_other_pages_took_searches"][:2]))
        if "searches_not_answered_in_body" in e:
            why.append(f"body doesn't answer ({int(e['unanswered_share']*100)}%): " + "; ".join(e["searches_not_answered_in_body"][:2]))
        if "outranked_on_covered_searches" in e:
            why.append("outranked (page covers it): " + "; ".join(e["outranked_on_covered_searches"][:2]))
        if "net_healthy" in e:
            why.append(e["net_healthy"])
        if "only_junk_searches" in e:
            why.append("only junk/low-volume searches lost")
        if "tech" in e:
            why.append("tech: " + str({k: e["tech"].get(k) for k in ("status", "verdict", "noindex", "canonical")}))
        also = ",".join(f"L{n}" for n in dx["needs"] if n != dx["level"])
        L.append(f"| `{item['path']}` | L{dx['level']} {dx['label']} | {also or '—'} | "
                 f"{pk['traffic']['gsc_clicks_d']['baseline']}→{pk['traffic']['gsc_clicks_d']['current']} | "
                 f"{' · '.join(why) or 'no actionable gap'} |")
    (P / "diagnosis.md").write_text("\n".join(L) + "\n")
    print("OK " + " ".join(f"L{k}={counts.get(k, 0)}" for k in range(6)) + f" → {P / 'diagnosis.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
