#!/usr/bin/env python3
"""L2 DATA REFRESH — pure code, seconds per page, no writer, no LLM.

For every page whose diagnosis needs L2 (on its own or alongside a higher level):
  1. Stale API prices: each "$X … input … $Y … output" pair the diagnosis pinned on a model is
     rewritten to the verified numbers in data/pricing.ts (that exact pair only).
  2. Demand moved to a successor: ONE internal-link sentence pointing to our pages on the successor
     model(s) is appended to the page's lead (introText). One link sentence is exempt from
     generation (Enrichment chapter of _content-generation.md); a new section would not be.
  3. updatedDate → today.
One commit per page ("DATA REFRESH"), syntax-checked, so it can be audited or reverted alone.

Usage: scripts/rank_drop/apply_data_refresh.py --packets reports/rank-drop/<date>/packets --date <date>
Writes <packets>/data-refresh.json
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
from apply_sections import splice  # noqa: E402
from diagnose import PRICE_PAIR, aliases_on_page  # noqa: E402
from prepare_pages import find_entry  # noqa: E402


def fmt(x: float) -> str:
    return str(int(x)) if float(x).is_integer() else f"{x:g}"


RATE_UNIT = re.compile(r"^\s*(?:(?:/|per)\s*(?:1M|M\b|MTok|million)|input|output|in\b|out\b)", re.I)
# Relative claims become false when a price changes ('half the input cost', 'doubles', '82% higher').
COMPARATIVE = re.compile(r"\b(half|double|doubles|doubled|twice|triple|third|thirds|quarter|percent|cheaper|pricier|"
                         r"higher|lower|more|less|times|fraction|saves?|premium|discount)\b|%|\d+x\b", re.I)
NARRATIVE = re.compile(r"\b(unchanged|still|remains|same as|rise|rises|rising|increase|increases|increased|introductory|through|until|effective|"
                       r"was|were|previously|from|total|month|monthly|seat|per user|budget|bill|spend|save|costs? you)\b",
                       re.I)


def _rate_shaped(clause: str, old: tuple[float, float]) -> bool:
    nums = [float(x) for x in re.findall(r"\$(\d+(?:\.\d+)?)(?![\d.])", clause)]
    if set(old) <= set(nums):                                      # the old input+output pair together
        return True
    if len(clause.strip()) <= 28:                                  # a table cell: 'Sol: $30 (OpenAI)'
        return True
    return all(RATE_UNIT.match(clause[m.end():]) for m in re.finditer(r"\$\d+(?:\.\d+)?(?![\d.])", clause)
               if float(m.group(0)[1:]) in old)


def _strings(entry: str):
    """(start, end) of every string literal in the entry."""
    i = 0
    while i < len(entry):
        if entry[i] in "'\"`":
            q, j = entry[i], i + 1
            while j < len(entry) and entry[j] != q:
                j += 2 if entry[j] == "\\" else 1
            yield i + 1, j
            i = j + 1
        else:
            i += 1


def _fix_table(text: str, model: str, names: list[str], swap: dict):
    """Price cells of a markdown table for one model. Returns the new text, None if `text` is not a
    table, or "REWRITE" when the table has a computed column (a per-task cost, a total) that a cell
    swap would leave wrong — that table goes to the sentence/fact rewrite instead."""
    sep = "\\n" if "\\n" in text else "\n"
    lines = text.split(sep)
    if sum(l.strip().startswith("|") for l in lines) < 3:
        return None
    head = next(l for l in lines if l.strip().startswith("|"))
    if re.search(r"cost of|total|per task|example|per month|monthly", head, re.I):
        return "REWRITE" if any(re.search(re.escape(n) + r"(?![\w.])", l, re.I) for n in names for l in lines) else text
    hcells = [c.strip() for c in head.strip().strip("|").split("|")]
    col = next((k for k, h in enumerate(hcells) if any(re.search(re.escape(n) + r"(?![\w.])", h, re.I) for n in names)), None)
    sw = lambda c: re.sub(r"\$(\d+(?:\.\d+)?)(?![\d.])",
                          lambda x: "$" + fmt(swap[float(x.group(1))]) if float(x.group(1)) in swap else x.group(0), c)
    out = []
    for l in lines:
        st = l.strip()
        if not st.startswith("|") or re.match(r"^\|[\s|:-]+\|?$", st) or l is head:
            out.append(l)
            continue
        cells = st.strip("|").split("|")
        if any(re.search(re.escape(n) + r"(?![\w.])", cells[0], re.I) for n in names):      # row per model
            cells = [cells[0]] + [sw(c) for c in cells[1:]]
        elif col is not None and col < len(cells) and re.search(r"price|cost|input|output", cells[0], re.I):
            cells[col] = sw(cells[col])                                                     # column per model
        lead = l[:len(l) - len(l.lstrip())]
        out.append(lead + "|" + "|".join(cells) + "|")
    return sep.join(out)


def fix_prices(entry: str, stale: list[dict]) -> tuple[str, list[str], list[str]]:
    """Fix EVERY rate mention of a stale API price on the page; send the rest to a sentence rewrite.

    For each string on the page that names the stale model (or is a table cell under it), the
    clause around the model name is classified:
      - rate statement ('$5 input / $30 output', 'Sol: $30 (OpenAI)', '$5 and $30 for Sol')
        -> numbers swapped to the ledger values in code;
      - narrative or derived ('rises to $3', 'costs $55 total ($25 for input and $30 for output)')
        -> left untouched and returned in `needs_rewrite` for a one-sentence planner edit, because
        a number swap there breaks the sentence or its arithmetic.
    Returns (entry, changes, needs_rewrite)."""
    done, needs = [], []
    alias = aliases_on_page(entry)
    cells = {}
    for side in ("A", "B"):
        m = re.search(r"""["']?option""" + side + r"""Name["']?\s*:\s*(["'])((?:\\.|(?!\1).)*)\1""", entry)
        if m and m.group(2).lower() in alias:
            cells[side] = alias[m.group(2).lower()]
    for sp in stale:
        if sp.get("ambiguous"):
            # can't attribute in code — every string carrying that pair goes to the fact-fix rewrite
            fv = [fmt(v) for v in sp["found"]]
            for a, b in _strings(entry):
                if all(re.search(r"\$" + re.escape(v) + r"(?![\d.])", entry[a:b]) for v in fv):
                    needs.append(entry[a:b])
            continue
        old = tuple(sp["found"])
        new_in, new_out = sp["ledger"]
        if old[0] == old[1]:
            continue
        swap = {old[0]: new_in, old[1]: new_out}
        names = [a for a, mdl in alias.items() if mdl == sp["model"]]
        name_re = re.compile(r"(" + "|".join(re.escape(a) for a in sorted(names, key=len, reverse=True)) +
                             r")(?![\w.])", re.I) if names else None
        other = [a for a, mdl in alias.items() if mdl != sp["model"]]
        other_re = re.compile(r"(" + "|".join(re.escape(a) for a in sorted(other, key=len, reverse=True)) +
                              r")(?![\w.])", re.I) if other else None
        edits = []
        for a, b in _strings(entry):
            text = entry[a:b]
            if not re.search(r"\$(" + "|".join(re.escape(fmt(v)) for v in old) + r")(?![\d.])", text):
                continue
            new_table = _fix_table(text, sp["model"], names, swap)
            if new_table is not None:                                # a markdown table: handled cell by cell
                if new_table == "REWRITE":
                    needs.append(text)
                elif new_table != text:
                    edits.append((a, b, new_table, text))
                continue
            # A string that names this model AND another priced model is a comparison: which pair
            # belongs to whom is grammar, not position. Never swap it in code (2026-10-05: "Sol
            # undercuts Fable 5 on token price: $4/$20 … vs $10/$50" got Sol's price set to Fable's).
            if name_re and other_re and name_re.search(text) and other_re.search(text):
                needs.append(text)
                continue
            if COMPARATIVE.search(text) and (not name_re or name_re.search(text) or "option" in entry[max(0, a - 12):a]):
                if all(re.search(r"\$" + re.escape(fmt(v)) + r"(?![\d.])", text) for v in old) or \
                        (name_re and name_re.search(text)):
                    needs.append(text)                              # whole sentence goes to a rewrite
                    continue
            # which clauses of this string belong to the stale model?
            clauses = []
            line_start = entry.rfind("\n", 0, a)
            cell = re.search(r"""option([AB])["']?\s*:\s*$""", entry[line_start:a].rstrip("'\" "))
            if cell and cells.get(cell.group(1)) == sp["model"]:
                clauses.append((0, len(text)))
            elif name_re:
                for m in name_re.finditer(text):
                    # forward clause: up to a sentence end or another model's name
                    end = len(text)
                    for stop in filter(None, [re.search(r"[.;]\s", text[m.end():]),
                                              other_re.search(text, m.end()) if other_re else None]):
                        end = min(end, (m.end() + stop.start()) if stop.re.pattern.startswith("[") else stop.start())
                    clauses.append((m.end(), end))
                    # backward clause: '$5 and $30 for Sol'
                    back = text[max(0, m.start() - 45):m.start()]
                    if re.search(r"\$\d.*\b(for|on|with)\s*$", back) and not (other_re and other_re.search(back)):
                        clauses.append((m.start() - len(back), m.start()))
            for ca, cb in clauses:
                clause = text[ca:cb]
                if not re.search(r"\$(" + "|".join(re.escape(fmt(v)) for v in old) + r")(?![\d.])", clause):
                    continue
                if NARRATIVE.search(clause) or not _rate_shaped(clause, old):
                    needs.append(text)
                    continue
                new_clause = re.sub(r"\$(\d+(?:\.\d+)?)(?![\d.])",
                                    lambda x: "$" + fmt(swap[float(x.group(1))]) if float(x.group(1)) in swap
                                    else x.group(0), clause)
                if new_clause != clause:
                    edits.append((a + ca, a + cb, new_clause, clause))
        for s_, e_, nc, oc in sorted(set(edits), key=lambda t: -t[0]):   # right-to-left keeps offsets valid
            if entry[s_:e_] == oc:
                entry = entry[:s_] + nc + entry[e_:]
                done.append(f'{sp["model"]}: "{oc.strip()[:100]}" -> "{nc.strip()[:100]}"')
        # safety net: any string still carrying the old input+output pair goes to a sentence rewrite
        for a, b in _strings(entry):
            text = entry[a:b]
            if all(re.search(r"\$" + re.escape(fmt(v)) + r"(?![\d.])", text) for v in old):
                needs.append(text)
    return entry, done, sorted(set(needs))


def add_link_sentence(entry: str, sentence: str) -> str:
    """Append one sentence as the last introText paragraph (the page's lead), else as the first
    paragraph of the first section. Quote style follows the entry."""
    lit = json.dumps(sentence, ensure_ascii=False)
    m = re.search(r"""(["']?introText["']?\s*:\s*\[)""", entry)
    if m:
        from apply_sections import match_bracket
        a = m.end() - 1
        b = match_bracket(entry, a) - 1                          # index of ']'
        j = b - 1
        while j > a and entry[j] in " \n\t,":
            j -= 1
        ind = re.search(r"\n(\s*)\S[^\n]*$", entry[a:j + 1])
        pad = ind.group(1) if ind else "    "
        return entry[:j + 1] + ",\n" + pad + lit + entry[j + 1:]
    m = re.search(r"""["']?content["']?\s*:\s*\[\s*\n(\s*)""", entry)
    if not m:
        raise ValueError("no introText or section content to hold the link sentence")
    return entry[:m.end()] + lit + ",\n" + m.group(1) + entry[m.end():]


def title_of(route: str) -> str | None:
    slug = route.rstrip("/").rsplit("/", 1)[-1]
    hit = find_entry(slug, sorted((ROOT / "data").glob("*.ts")))
    if not hit:
        return None
    for key in ("h1", "title", "metaTitle"):                      # the visible H1 first, never a "| Brand" meta title
        m = re.search(r"""["']?""" + key + r"""["']?\s*:\s*(["'])((?:\\.|(?!\1).)*)\1""", hit[3])
        if m:
            return re.sub(r"\s*[|–-]\s*Layer\s?3\s?Labs.*$", "", m.group(2).replace("\\'", "'"), flags=re.I)
    return None


def best_successors(pk: dict, n: int = 2) -> list[tuple[str, str]]:
    from prepare_pages import FAMILY
    fam = lambda r: set(FAMILY.findall(r.rsplit("/", 1)[-1]))
    mine, kind = fam(pk["path"]), pk["path"].split("/")[1]
    # same model families, same page type, no unrelated vendors (v1 picked a Grok page for GPT vs Fable)
    score = lambda r: (2 * len(mine & fam(r)) - 2 * len(fam(r) - mine) + (r.split("/")[1] == kind)
                       + ("-vs-" in r) * ("-vs-" in pk["path"]))
    ranked = sorted((r for r in pk.get("successor_routes", []) if not (fam(r) - mine)),
                    key=lambda r: -score(r))
    out = []
    for r in ranked:
        t = title_of(r)
        if t:
            out.append((r, t))
        if len(out) == n:
            break
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--packets", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--no-commit", action="store_true")
    ap.add_argument("--dry-run", action="store_true",
                    help="never write data files: syntax-check a temp copy, save <slug>/*.preview.diff")
    a = ap.parse_args(argv)
    from siteconf import site
    if not site().get("price_ledger") or site()["backend"] != "ts_entries":
        P0 = Path(a.packets).resolve()
        (P0 / "data-refresh.json").write_text("[]")
        print("OK data-refresh skipped: this site has no price ledger (L2 prices are auditor-checked)")
        return 0
    P = Path(a.packets).resolve()
    results = []
    for item in json.load(open(P / "queue.json"))["queue"]:
        d = P / item["slug"]
        dx_f = d / "diagnosis.json"
        if not dx_f.exists():
            continue
        dx = json.load(open(dx_f))
        if 2 not in dx.get("needs", []):
            continue
        pk = json.load(open(d / "packet.json"))
        try:
            f, _, _, entry = find_entry(item["slug"], [ROOT / item["data_file"]])
            src = f.read_text()
            new, changes, needs_rewrite = fix_prices(entry, dx["evidence"].get("stale_prices", []))
            if needs_rewrite:                                      # narrative/derived price sentences
                (d / "fact-fixes.json").write_text(json.dumps({
                    "why": "these sentences state a stale price inside a narrative or a worked calculation; "
                           "a number swap would break them — rewrite each as one sentence with the ledger facts",
                    "ledger": [{"model": m, "row": next((l.strip() for l in (ROOT / "data/pricing.ts").read_text().splitlines()
                                                         if f"model: '{m}'" in l), "")[:400]}
                               for sp in dx["evidence"].get("stale_prices", [])
                               for m in (sp.get("candidates") or [sp["model"]])],
                    "sentences": needs_rewrite}, indent=2))
            if "demand_moved_to_successor" in dx["evidence"]:
                succ = best_successors(pk)
                if succ:
                    links = " and ".join(f"[{t}]({r})" for r, t in succ)
                    # ONE internal-link sentence (exempt from generation per the Enrichment chapter of
                    # _content-generation.md) — not a new section, which would be new content.
                    sentence = f"Newer versions of these models are out; for the current releases, see {links}."
                    new = add_link_sentence(new, sentence)
                    changes.append("successor link sentence → " + ", ".join(r for r, _ in succ))
            if not changes:
                results.append({"slug": item["slug"], "status": "nothing-to-change",
                                "needs_sentence_rewrite": len(needs_rewrite)})
                continue
            new = re.sub(r"""(["']?updatedDate["']?\s*:\s*)(["'])\d{4}-\d{2}-\d{2}\2""",
                         lambda m: f"{m.group(1)}{m.group(2)}{a.date}{m.group(2)}", new, count=1)
            assert src.count(entry) == 1
            from entry_edit import commit_or_preview
            ok, msg = commit_or_preview(f, src, src.replace(entry, new), a.dry_run,
                                        d / "data-refresh.preview.diff")
            if not ok:
                raise ValueError("syntax check failed: " + msg)
            sha = None
            if not (a.no_commit or a.dry_run):
                subprocess.run(["git", "add", str(f.relative_to(ROOT))], cwd=ROOT)
                subprocess.run(["git", "commit", "-q", "-m",
                                f"rank-drop-recovery {a.date}: DATA REFRESH {item['path']}\n\n" + "\n".join(changes)],
                               cwd=ROOT)
                sha = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT,
                                     capture_output=True, text=True).stdout.strip()
            results.append({"slug": item["slug"], "path": item["path"], "status": "applied",
                            "changes": changes, "commit": sha, "needs_sentence_rewrite": len(needs_rewrite)})
        except Exception as e:  # noqa: BLE001
            results.append({"slug": item["slug"], "status": "error", "error": str(e)[:300]})
    (P / "data-refresh.json").write_text(json.dumps(results, indent=2))
    print(f"OK data-refresh applied={sum(r['status'] == 'applied' for r in results)} of {len(results)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
