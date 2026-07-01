#!/usr/bin/env python3
"""Classify the 2026-06-30 SEMRUSH gap into chart rows + per-keyword CSV.

Hard rules:
- Drop branded competitor names (bankrate, nerdwallet, ramsey, etc.)
- Drop live RATES queries (we're a calculator hub, not a rates aggregator)
- Drop OFF-MISSION verticals (insurance, credit cards, estate trusts)
- Drop JUNK strings (repeated tokens, brand bleed)
- Drop candidates duplicating shipped spokes (use SHIPPED registry)
- Otherwise classify into: metadata / body / create-new
"""
from __future__ import annotations
import csv
import json
import pathlib
import re
import sys

GAP_JSON = pathlib.Path("reports/keyword-pass/2026-06-30.gap.json")
CHART_OUT = pathlib.Path("reports/keyword-pass/2026-06-30.md")
CSV_OUT = pathlib.Path("reports/keyword-pass/2026-06-30.keywords.csv")

# Shipped spoke target keywords (lowercased)
SHIPPED_SPOKE_KEYWORDS = {
    # auto
    "auto loan payoff calculator", "auto loan extra payment calculator",
    "pay off car loan early calculator", "auto loan amortization calculator",
    "auto loan interest calculator", "car affordability calculator",
    # mortgage
    "mortgage payoff calculator", "mortgage extra payment calculator",
    "mortgage amortization calculator", "pay off mortgage early calculator",
    "mortgage calculator with taxes and insurance", "mortgage affordability calculator",
    "mortgage refinance calculator", "fha loan calculator", "va loan calculator",
    "interest only mortgage calculator", "home affordability calculator",
    "down payment calculator", "closing cost calculator",
    # investing
    "compound interest calculator", "investment growth calculator",
    "high yield savings calculator", "savings goal calculator",
    "roth ira calculator", "dividend reinvestment calculator",
    "dollar cost averaging calculator", "s&p 500 calculator",
    "investment withdrawal calculator",
    # net-worth
    "how to calculate net worth", "net worth by age calculator",
    "liquid net worth calculator", "net worth percentile calculator",
    "couples net worth calculator", "net worth projection calculator",
    # portfolio
    "asset allocation calculator", "60/40 portfolio calculator",
    "expected return calculator", "portfolio risk calculator",
    # real-estate
    "rental property cash flow calculator", "rental income calculator",
    "cap rate calculator", "cash on cash return calculator",
    "rental property roi calculator", "rental property depreciation calculator",
    "rental income tax calculator", "airbnb income calculator",
    "rental property capital gains calculator",
    # retirement
    "401k early withdrawal calculator", "401k calculator",
    "retirement savings calculator", "rmd calculator", "fire calculator",
    "couples retirement calculator", "retirement income calculator",
    "military retirement calculator", "early retirement calculator",
    "retirement calculator with pension", "retirement calculator with social security",
    # budget
    "50 30 20 budget calculator", "monthly budget calculator",
    "zero based budget calculator", "household budget calculator",
}

# Hub head terms (what /hub/ index pages target)
HUB_HEAD = {
    "auto loan calculator": "/auto-loan/",
    "mortgage calculator": "/mortgage/",
    "investing calculator": "/investing/",
    "portfolio calculator": "/portfolio/",
    "retirement calculator": "/retirement/",
    "net worth calculator": "/net-worth/",
    "real estate calculator": "/real-estate/",
    "budget calculator": "/budget/",
}

# Drop patterns -------------------------------------------------------------

BRANDED = re.compile(
    r"\b(bankrate|nerdwallet|ramsey|dave\s*ramsey|smartasset|fidelity|"
    r"chase|wells\s*fargo|bank\s*of\s*america|victoria.?secret|aaa|"
    r"experian|equifax|transunion)\b",
    re.I,
)
# Live rates queries — we're a calculator, not a rates page
RATES = re.compile(
    r"\b(rates\s+today|rates\s+now|current\s+rates|rate\s+news|"
    r"mortgage\s+rate(s)?(\s+today|\s+now|\s+news)?|"
    r"rates(\s+news)?$|^mortgage\s+rates|^current\s+mortgage|"
    r"refinance\s+rates|mortgage\s+quote|home\s+equity\s+loan\s+rates|"
    r"\d+\s*year\s+mortgage\s+rates|savings\s+account\s+rates)\b",
    re.I,
)
# Off-mission verticals
OFF_MISSION = re.compile(
    r"\b(insurance|credit\s*cards?|trust|estate\s+plan|family\s+trust|"
    r"renters\s+insurance|term\s+life|home\s+insurance|cashback)\b",
    re.I,
)
# Junk
JUNK = re.compile(
    r"(tax\s+calculator\s+tax\s+calculator|figure\s+paycheck\s+tax|"
    r"^mortgage$)",
    re.I,
)

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())

# Classification rules ------------------------------------------------------
# Each rule: (matcher predicate, bucket, target, solution_template, notes, best_medium, resolved_deliverable)

def classify(kw: str, gap: dict) -> dict | None:
    """Return classification dict or None if dropped."""
    n = norm(kw)
    # --- HARD DROPS ---
    if JUNK.search(n):
        return {"_drop": "junk string"}
    if BRANDED.search(n):
        return {"_drop": "branded competitor"}
    if RATES.search(n):
        return {"_drop": "live-rates query (not our model)"}
    if OFF_MISSION.search(n):
        return {"_drop": "off-mission vertical"}
    if n in SHIPPED_SPOKE_KEYWORDS:
        return {"_drop": f"duplicate of shipped spoke"}

    # --- METADATA UPDATE (existing hub, term should appear in title/meta/H1) ---
    # Mortgage hub synonyms
    if re.match(
        r"^(mortgage\s+payment\s+calculator|home\s+loan\s+calculator|"
        r"mortgage\s+(calc|estimator|rate\s+calculator|loan\s+calculator)|"
        r"home\s+mortgage\s+calculator|free\s+mortgage\s+calculator|"
        r"online\s+mortgage\s+calculator|monthly\s+mortgage\s+calculator|"
        r"calculate\s+mortgage\s+payment|how\s+to\s+calculate\s+mortgage\s+payments|"
        r"30\s*year\s+mortgage\s+calculator)$", n):
        return _meta("/mortgage/", "src/data/calculators.ts (mortgage entry)",
                     f"Work '{kw}' into mortgage hub title/meta/H1 as a synonym",
                     "core-mortgage synonym")
    # Auto-loan synonyms
    if n in {"car loan calculator", "loan payment calculator"}:
        return _meta("/auto-loan/", "src/data/calculators.ts (auto-loan entry)",
                     f"Work '{kw}' into auto-loan hub title/meta/H1 as a synonym",
                     "core-auto-loan synonym")
    # Investing hub synonyms
    if n == "investment calculator":
        return _meta("/investing/", "src/data/calculators.ts (investing entry)",
                     f"Work 'investment calculator' into investing hub title/meta/H1",
                     "core-investing synonym")
    # Retirement 401k spoke — work bare head term into existing 401k calc metadata
    if n == "401k":
        return _meta("/retirement/401k-calculator/",
                     "src/data/spokes-retirement.ts (401k-calculator entry)",
                     "Work bare '401k' into 401k calculator title/meta/H1 as head term",
                     "401k spoke head-term enrichment")
    # Mortgage early-payoff synonyms — already shipped as /mortgage/early-payoff-calculator/
    if n in {"early mortgage payoff calculator", "mortgage early payoff calculator"}:
        return {"_drop": "duplicate of shipped spoke (mortgage early-payoff)"}
    # Brand-bleed junk
    if n == "mortgage calculator pay":
        return {"_drop": "junk string (brand bleed)"}
    # Savings — overlap with high-yield-savings-calculator
    if n in {"savings calculator", "hysa", "high interest savings account"}:
        return _meta("/investing/high-yield-savings-calculator/",
                     "src/data/spokes-investing.ts (high-yield-savings entry)",
                     f"Work '{kw}' into HYSA spoke title/meta/H1 as a synonym",
                     "HYSA spoke synonym")

    # --- BODY UPDATE (existing hub, add a section/paragraphs) ---
    # Budget hub: how-to-make-a-budget
    if n in {"how to make a budget", "how to create a family budget"}:
        return _body("/budget/", "src/data/calculators.ts (budget entry — howItWorks)",
                     "Add a 'How to make a budget' section to the budget hub body",
                     "budget hub body expansion")
    # Investing hub: how to invest in stocks + strategies + basics
    if n in {"how to invest in stocks", "investment strategies", "investment basics"}:
        return _body("/investing/",
                     "src/data/calculators.ts (investing entry — howItWorks)",
                     f"Add a section on '{kw}' to the investing hub body",
                     "investing hub body expansion")
    # Real-estate hub: real estate investing
    if n in {"real estate investing"}:
        return _body("/real-estate/",
                     "src/data/calculators.ts (real-estate entry — howItWorks)",
                     "Add 'Real estate investing fundamentals' section to /real-estate/ body",
                     "real-estate body expansion")
    # HYSA spoke body: best HYSA roundup-style content
    if n in {"high yield savings account",
             "best high yield savings account",
             "best high yield savings accounts"}:
        return _body("/investing/high-yield-savings-calculator/",
                     "src/data/spokes-investing.ts (high-yield-savings entry)",
                     f"Add an HYSA-overview section to the HYSA spoke body covering '{kw}'",
                     "HYSA spoke body expansion")

    # --- CREATE NEW CONTENT ---
    # NEW HUB / standalone: TAX
    if n in {"tax calculator", "income tax calculator", "tax refund calculator",
             "tax estimator", "tax calculator 2025", "tax calculator 2026",
             "capital gains tax calculator", "federal income tax calculator",
             "effective tax rate calculator", "net income calculator"}:
        return _new("/tax/", "create",
                    f"Create /tax/ hub (or relevant spoke) targeting '{kw}'",
                    "new-hub tax", "interactive tool", "interactive tool")
    # State-specific tax spokes
    if re.match(r"^(nyc|california|new york)\s+(income\s+)?tax\s+calculator$", n):
        slug = n.replace(" tax calculator", "").replace(" income", "")
        slug = slug.replace(" ", "-")
        return _new(f"/tax/{slug}-tax-calculator/", "create",
                    f"Create /tax/{slug}-tax-calculator/ for '{kw}'",
                    "state tax spoke", "interactive tool", "interactive tool")
    if n == "income tax calculator nevada":
        return _new("/tax/nevada-tax-calculator/", "create",
                    "Create /tax/nevada-tax-calculator/",
                    "state tax spoke", "interactive tool", "interactive tool")
    # NEW HUB: PAYCHECK/SALARY
    if n in {"salary calculator", "salary paycheck calculator",
             "paycheck tax calculator", "take home salary estimator"}:
        return _new("/paycheck/", "create",
                    f"Create /paycheck/ hub targeting '{kw}'",
                    "new-hub paycheck", "interactive tool", "interactive tool")
    if re.match(r"^(salary\s+calculator\s+california|new\s+york\s+salary\s+calculator)$", n):
        state = "california" if "california" in n else "new-york"
        return _new(f"/paycheck/{state}-paycheck-calculator/", "create",
                    f"Create /paycheck/{state}-paycheck-calculator/ for '{kw}'",
                    "state paycheck spoke", "interactive tool", "interactive tool")
    # INFLATION calculator — adjacent vertical, low-difficulty
    if n == "inflation calculator":
        return _new("/inflation-calculator/", "create",
                    "Create /inflation-calculator/ standalone calculator",
                    "standalone calculator (low difficulty)", "interactive tool", "interactive tool")
    # MORTGAGE new spokes
    if n in {"heloc calculator: how much can i borrow"}:
        return _new("/mortgage/heloc-calculator/", "create",
                    "Create /mortgage/heloc-calculator/ spoke",
                    "mortgage spoke (new)", "interactive tool", "interactive tool")
    if n == "reverse mortgage calculator":
        return _new("/mortgage/reverse-mortgage-calculator/", "create",
                    "Create /mortgage/reverse-mortgage-calculator/ spoke",
                    "mortgage spoke (new)", "interactive tool", "interactive tool")
    if n == "commercial mortgage calculator":
        return _new("/mortgage/commercial-mortgage-calculator/", "create",
                    "Create /mortgage/commercial-mortgage-calculator/ spoke",
                    "mortgage spoke (new)", "interactive tool", "interactive tool")
    # RETIREMENT new content
    if n == "roth ira":
        # Dropped by adversarial reviewer 2026-06-30: /investing/roth-ira-calculator/
        # already covers the topic (howItWorks has full Roth content).
        return {"_drop": "duplicate of shipped spoke (Roth IRA covered by /investing/roth-ira-calculator/)"}
    # GUIDES (text-only adjacent content)
    if n == "passive income ideas":
        return _new("/guides/passive-income-ideas/", "create",
                    "Create /guides/passive-income-ideas/ educational guide",
                    "adjacent guide", "text", "text")
    if n == "tax tips":
        return _new("/guides/tax-tips/", "create",
                    "Create /guides/tax-tips/ educational guide",
                    "adjacent guide", "text", "text")
    if n == "how to choose a financial advisor":
        return _new("/guides/how-to-choose-a-financial-advisor/", "create",
                    "Create /guides/how-to-choose-a-financial-advisor/ educational guide",
                    "adjacent guide", "text", "text")
    if n == "money market account":
        return _new("/guides/money-market-account/", "create",
                    "Create /guides/money-market-account/ educational guide",
                    "adjacent guide", "text", "text")
    if n == "debt snowball":
        return _new("/budget/debt-snowball-calculator/", "create",
                    "Create /budget/debt-snowball-calculator/ spoke",
                    "budget spoke (new)", "interactive tool", "interactive tool")

    # Catch-all: unclassified — drop with reason
    return {"_drop": "no credible target — set aside"}


def _meta(target, file, solution, notes):
    return {"bucket": "update existing metadata", "target": target,
            "file": file, "solution": solution, "notes": notes,
            "best_medium": "n/a", "resolved_deliverable": "n/a"}

def _body(target, file, solution, notes):
    return {"bucket": "update existing body text", "target": target,
            "file": file, "solution": solution, "notes": notes,
            "best_medium": "n/a", "resolved_deliverable": "n/a"}

def _new(target, _verb, solution, notes, best_medium, resolved_deliverable):
    return {"bucket": "create new content", "target": target,
            "file": target, "solution": solution, "notes": notes,
            "best_medium": best_medium,
            "resolved_deliverable": resolved_deliverable}


def main():
    data = json.loads(GAP_JSON.read_text())
    gaps = data["gaps"]

    actionable = []
    drops: dict[str, int] = {}
    for g in gaps:
        res = classify(g["keyword"], g)
        if res is None:
            drops["unclassified"] = drops.get("unclassified", 0) + 1
            continue
        if "_drop" in res:
            drops[res["_drop"]] = drops.get(res["_drop"], 0) + 1
            continue
        res["keyword"] = g["keyword"]
        res["volume"] = g["volume"]
        res["kd"] = g["kd"]
        res["tier"] = g["tier"]
        res["intent"] = g.get("intent", "")
        res["competitor"] = g["competitor"]
        res["comp_position"] = g["comp_position"]
        res["lens"] = "Lens 1 (competitor gap)"
        actionable.append(res)

    # Sort: core first, then volume desc
    actionable.sort(key=lambda x: (x["tier"] != "core", -x["volume"]))

    print(f"Actionable: {len(actionable)}", file=sys.stderr)
    print("Drops:", drops, file=sys.stderr)

    # Save per-keyword CSV
    with CSV_OUT.open("w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["keyword", "action", "target_page_or_new_url", "lens",
                    "tier", "volume", "notes", "best_medium", "resolved_deliverable"])
        for r in actionable:
            w.writerow([r["keyword"], r["bucket"], r["target"], r["lens"],
                        r["tier"], r["volume"], r["notes"],
                        r["best_medium"], r["resolved_deliverable"]])

    # Group by (target, bucket) only — synonyms collapse into one chart row
    groups: dict[tuple, list] = {}
    for r in actionable:
        key = (r["target"], r["bucket"])
        groups.setdefault(key, []).append(r)

    chart_rows = []
    for (target, bucket), rs in groups.items():
        kws = [r["keyword"] for r in rs]
        total_vol = sum(r["volume"] for r in rs)
        tier = "core" if any(r["tier"]=="core" for r in rs) else "adjacent"
        top_kw = max(rs, key=lambda r: r["volume"])
        # Pick representative solution (top-volume row's solution)
        rep_solution = top_kw["solution"]
        notes = top_kw["notes"]
        problem = (
            f"**{top_kw['keyword']}** (Lens 1 competitor gap, **tier: {tier}**) — "
            f"v={top_kw['volume']:,}, comp #{top_kw['comp_position']} on "
            f"{top_kw['competitor']}. {notes}. "
            f"Total cluster vol: {total_vol:,}; {len(rs)} keyword(s) in cluster."
        )
        # For multi-keyword clusters, generalize the solution
        if len(rs) > 1:
            if bucket == "update existing metadata":
                rep_solution = (f"Work the synonym cluster ({len(rs)} variants of '"
                                f"{top_kw['keyword']}') into title/meta/H1 of {target}")
            elif bucket == "update existing body text":
                rep_solution = (f"Add a section to {target} covering the cluster "
                                f"({len(rs)} variants headlined by '{top_kw['keyword']}')")
            elif bucket == "create new content" and target == "/tax/":
                rep_solution = (f"Create the /tax/ hub + spokes targeting {len(rs)} "
                                f"variants of '{top_kw['keyword']}'")
            elif bucket == "create new content" and target == "/paycheck/":
                rep_solution = (f"Create the /paycheck/ hub + spokes targeting {len(rs)} "
                                f"variants of '{top_kw['keyword']}'")
        chart_rows.append({
            "problem": problem,
            "solution": rep_solution,
            "bucket": bucket,
            "target": target,
            "best_medium": rs[0]["best_medium"],
            "resolved_deliverable": rs[0]["resolved_deliverable"],
            "cluster": kws,
            "_total_vol": total_vol,
            "_tier_sort": 0 if tier == "core" else 1,
        })

    # Sort chart by tier (core first) then total cluster volume desc
    chart_rows.sort(key=lambda r: (r["_tier_sort"], -r["_total_vol"]))

    # Write chart MD
    lines = []
    lines.append("---")
    lines.append("keyword_pass_date: 2026-06-30")
    lines.append("source: live competitor gap (Lens 1) — SEMRUSH domain_organic on 8 competitors, diffed against target-keywords.md + shipped spoke registry")
    lines.append("generated_by: keyword-gap-pass build phase — scripts/semrush_keyword_gap.py + scripts/keyword_pass_classify.py")
    lines.append("status: ready-for-execution")
    lines.append("---")
    lines.append("")
    lines.append("# Keyword Gap Pass — 2026-06-30 — themodernwallet.com")
    lines.append("")
    lines.append("## Competitors this run")
    lines.append("")
    lines.append(
        "SEMRUSH `domain_organic_organic` returned 0 live competitors "
        "(brand-new site with too few organic rankings to compute overlap). "
        "Falling back to a curated seed set of the 8 dominant US personal-finance "
        "calculator/content competitors:"
    )
    lines.append("")
    for c in data["competitors"]:
        lines.append(f"- `{c}` — seed (no live SERP overlap yet; site is new)")
    lines.append("")
    lines.append(f"_Our organic rankings: {data['our_organic_count']} keywords. "
                 f"Tracked already: {data['tracked_count']}. "
                 f"Raw gap after dedup: {data['gap_count']} ({data['core_count']} core + "
                 f"{data['adjacent_count']} adjacent). "
                 f"Actionable after classification: {len(actionable)}._")
    lines.append("")
    lines.append("## Chart")
    lines.append("")
    lines.append("| problem | solution | bucket | target | best_medium | resolved_deliverable |")
    lines.append("|---|---|---|---|---|---|")
    for r in chart_rows:
        lines.append(f"| {r['problem']} | {r['solution']} | {r['bucket']} | "
                     f"`{r['target']}` | {r['best_medium']} | {r['resolved_deliverable']} |")
    lines.append("")
    lines.append("## Cluster details (which actionable keywords roll into each row)")
    lines.append("")
    for r in chart_rows:
        lines.append(f"### `{r['target']}` — {r['bucket']}")
        for k in r["cluster"]:
            lines.append(f"- {k}")
        lines.append("")
    lines.append("## Exclusions")
    lines.append("")
    total_dropped = sum(drops.values())
    lines.append(f"{total_dropped} raw gap rows dropped silently from the chart "
                 f"(per the actionable-only rule):")
    for reason, count in sorted(drops.items(), key=lambda x: -x[1]):
        lines.append(f"- {count} × {reason}")
    lines.append("")
    lines.append(
        "Plus Lens 2 (Autocomplete) ran on auto-loan / portfolio / budget seeds "
        "and appended 772 new long-tail suggestions to "
        "reports/seo-research/target-keywords.md for the next pass. "
        "No Lens-2 row promoted to this chart — Lens 1 was already saturated with "
        "higher-volume actionable opportunities."
    )

    CHART_OUT.write_text("\n".join(lines))
    print(f"Saved {CHART_OUT} with {len(chart_rows)} chart rows "
          f"({len(actionable)} actionable keywords) and {CSV_OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
