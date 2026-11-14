#!/usr/bin/env python3
"""Additive GSC discovery signals for Trend Pass (24h and 7d pull variants).

Unlocks high-leverage search signals from the full 25,000-row GSC query pull
that `gsc_pull_24h.py` and `gsc_pull_7d.py` already fetch, WITHOUT modifying
`top_queries[10]`, `coverage_queries[20]`, or `top_pages[10]`:

  1. `rising_queries`: breakout or newly appearing queries whose impressions
     or clicks jumped vs. the preceding baseline window (catches emerging
     trends days or weeks before they accumulate enough clicks to crack top-10).
  2. `spillover_queries`: rank 6-50 queries outside `coverage_queries[20]`
     earning meaningful impressions with low clicks (0-3) — topics Google is
     already testing the site for where a dedicated page may not exist yet.
  3. `modifier_patterns`: recurring search modifier formulas across the query
     set (e.g. `dumb <X>`, `non smart <X>`, `<X> alternatives without ai`,
     `<X> without ai`, `<X> free trial`, `how to turn off <X>`, `<X> for <Y>`)
     so Trend Pass and Mindmap can expand winning search formulas sideways
     into sibling categories/products not yet covered on the site.
"""

from __future__ import annotations

import re
from collections import defaultdict

_YEAR_RE = re.compile(r"\b20[2-3]\d\b")
_TOKEN_RE = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")

_PURE_STOPWORDS = frozenset({
    "a", "an", "the", "in", "on", "at", "of", "to", "and", "or", "by",
    "with", "from", "is", "are", "was", "were", "be", "been", "it",
    "this", "that", "these", "those", "my", "your", "our", "their",
    "for", "as", "into", "about", "than", "then", "so", "if",
})

_SLOT_BOUNDARY_REJECT = frozenset({
    "a", "an", "the", "for", "to", "in", "on", "at", "of", "with",
    "without", "no", "not", "non", "vs", "versus", "or", "and", "from",
    "by", "is", "are", "was", "were", "how", "what", "why", "when",
    "where", "who", "which", "can", "does", "do", "should", "will",
    "best", "top", "most", "alternative", "alternatives",
})

# Single-word modifiers that represent genuinely transferable search formulas
# across sibling categories/products (excludes brand/entity nouns like "google" or "ai").
_SINGLE_TOKEN_MODIFIERS = frozenset({
    "dumb", "nonsmart", "non-smart", "analog", "offline", "degoogled",
    "open-source", "opensource", "self-hosted", "selfhosted", "private",
    "encrypted", "unplugged", "minimalist", "ad-free", "adfree",
    "alternatives", "alternative", "pricing", "cost", "costs", "price",
    "review", "reviews", "benchmarks", "benchmark", "comparison",
    "calculator", "template", "checklist", "dosage", "side-effects",
    "legality", "worth", "trial", "subscription", "hipaa", "compliant",
    "disable", "remove", "block", "turn-off",
})

# At least one token from this open intent/modifier vocabulary must appear in
# a multi-word frame so entity prefixes (`chatgpt plus <X>`) aren't misread as modifiers.
_MODIFIER_INTENT_TOKENS = _SINGLE_TOKEN_MODIFIERS | frozenset({
    "non", "smart", "without", "no", "vs", "versus", "free", "cheap",
    "affordable", "open", "source", "self", "hosted", "how", "turn",
    "off", "for", "best", "top", "safe", "safety", "risks", "side",
    "effects", "legal", "legit", "much", "does", "use", "setup",
    "replace", "avoid", "escape", "quit", "stop", "opt", "out",
})

# Words that are pure modifiers/durations rather than a standalone entity noun
# if they comprise the ENTIRE `<X>` slot.
_NON_ENTITY_SLOT_ONLY = frozenset({
    "free", "trial", "day", "days", "week", "weeks", "month", "months",
    "year", "years", "cost", "costs", "price", "pricing", "worth", "it",
    "plus", "pro", "max", "mini", "plan", "plans", "subscription",
    "alternative", "alternatives", "review", "reviews", "vs", "ai",
})

# Multi-word or high-intent formula markers eligible to surface even when a
# single breakout root entity is leading the wave (e.g. `non smart tv` at
# 1,480 impressions or `pinterest alternatives without ai` at 19 clicks).
_HIGH_SIGNAL_FORMULA_PATTERNS = (
    re.compile(r"^dumb <X>$"),
    re.compile(r"^non[- ]smart <X>$"),
    re.compile(r"^<X> alternatives? without [a-z0-9-]+$"),
    re.compile(r"^alternatives? to <X>(?: (?:without|no) [a-z0-9-]+)?$"),
    re.compile(r"^<X> (?:without|no) [a-z0-9-]+$"),
    re.compile(r"^(?:how to )?(?:turn off|disable|remove|block) <X>$"),
    re.compile(r"^<X> (?:free trial|subscription|pricing|alternatives?)$"),
    re.compile(r"^is <X> (?:worth it|safe|free|legit|legal|hipaa compliant)$"),
    re.compile(r"^how much (?:does|is) <X>(?: cost)?$"),
    re.compile(r"^<X> for (?:kids|seniors|students|beginners|small business|law firms|dentists|real estate)$"),
    re.compile(r"^(?:best|free|offline|open source|analog) <X>(?: without [a-z0-9-]+| for [a-z0-9-]+)?$"),
)

# Generic format/tier/duration words stripped when computing canonical entity identity inside
# a slot so "pinterest" & "pinterest alternatives", or "chatgpt" & "chatgpt 1 month free",
# count as ONE root entity rather than falsely inflating `distinct_entities`.
_ENTITY_WRAPPER_WORDS = frozenset({
    "alternative", "alternatives", "review", "reviews", "guide", "guides",
    "app", "apps", "tool", "tools", "software", "platform", "platforms",
    "site", "sites", "website", "websites", "device", "devices", "option",
    "options", "plan", "plans", "tier", "tiers", "plus", "pro", "max",
    "free", "trial", "day", "days", "week", "weeks", "month", "months",
    "year", "years", "4k", "hd", "best", "top", "new", "cheap", "good",
})


def is_noise_query(query: str) -> bool:
    """Filter crawler/operator strings and empty noise."""
    if not query:
        return True
    q = query.strip()
    if len(q) < 2 or q.startswith("-"):
        return True
    lower = q.lower()
    if "-site:" in lower or "site:" in lower:
        return True
    return False


def _singularize_token(tok: str) -> str:
    if len(tok) <= 2 or tok.isdigit():
        return tok
    if tok.endswith("ies") and len(tok) > 4:
        return tok[:-3] + "y"
    if tok.endswith(("ches", "shes", "xes", "sses", "zes")) and len(tok) > 4:
        return tok[:-2]
    if tok.endswith("s") and not tok.endswith(("ss", "us", "is", "os")):
        return tok[:-1]
    return tok


def canonical_query_key(query: str) -> str:
    """Canonical key collapsing year suffixes and basic singular/plural forms."""
    cleaned = _YEAR_RE.sub(" ", query.lower())
    tokens = [_singularize_token(t) for t in _TOKEN_RE.findall(cleaned)]
    tokens = [t for t in tokens if t not in {"a", "an", "the"}]
    return " ".join(tokens) if tokens else query.strip().lower()


def _canonical_slot_entity(slot_tokens: list[str]) -> str:
    """Normalize a slot (`['dumb', 'phones', 'for', 'kids']` or `['tvs']`) to a root entity."""
    norm = [_singularize_token(t) for t in slot_tokens if t not in {"a", "an", "the"} and not t.isdigit()]
    if not norm:
        return ""
    if all(t in _NON_ENTITY_SLOT_ONLY for t in norm):
        return ""
    # Collapse `phone for kid` -> head entity `phone` if `for <audience>` is trailing.
    if "for" in norm:
        idx = norm.index("for")
        if idx >= 1:
            norm = norm[:idx]
    core = [t for t in norm if t not in _ENTITY_WRAPPER_WORDS]
    chosen = core if core else norm
    if all(t in _NON_ENTITY_SLOT_ONLY for t in chosen):
        return ""
    return " ".join(chosen)


def compute_rising_queries(
    current_rows: list[dict],
    baseline_rows: list[dict] | None,
    *,
    baseline_divisor: float = 1.0,
    top20_queries: set[str] | None = None,
    limit: int = 15,
) -> list[dict]:
    """Identify breakout and newly-appearing queries vs. a baseline window."""
    if baseline_rows is None:
        return []

    div = max(float(baseline_divisor), 1.0)
    is_daily = div > 1.0
    top20 = {q.lower().strip() for q in (top20_queries or set())}

    prev_map: dict[str, tuple[float, float]] = {}
    prev_canon_map: dict[str, tuple[float, float]] = defaultdict(lambda: (0.0, 0.0))
    for r in baseline_rows:
        q = str(r.get("query", "")).strip()
        if not q:
            continue
        ql = q.lower()
        c = float(r.get("clicks", 0)) / div
        impr = float(r.get("impressions", 0)) / div
        prev_map[ql] = (c, impr)
        ck = canonical_query_key(q)
        oc, oi = prev_canon_map[ck]
        prev_canon_map[ck] = (oc + c, oi + impr)

    def _scan(min_new_impr: int, min_surge_impr: int, min_impr_delta: float, min_ratio: float) -> list[dict]:
        found: list[dict] = []
        seen_canon: set[str] = set()
        for r in current_rows:
            q = str(r.get("query", "")).strip()
            if is_noise_query(q):
                continue
            clicks = int(r.get("clicks", 0))
            impr = int(r.get("impressions", 0))
            if impr < min(min_new_impr, min_surge_impr) and clicks < 2:
                continue

            ql = q.lower()
            ck = canonical_query_key(q)
            if ql in prev_map:
                prev_c, prev_i = prev_map[ql]
            else:
                prev_c, prev_i = prev_canon_map.get(ck, (0.0, 0.0))

            impr_delta = round(impr - prev_i, 1)
            click_delta = round(clicks - prev_c, 2)
            growth_tag = None

            if prev_i < 0.5 and prev_c < 0.5:
                if impr >= min_new_impr or clicks >= 2 or (clicks >= 1 and impr >= max(5, min_new_impr // 2)):
                    growth_tag = "new"
            else:
                impr_ratio = impr / max(prev_i, 1.0)
                click_ratio = clicks / max(prev_c, 0.5)
                if (impr >= min_surge_impr and impr_delta >= min_impr_delta and impr_ratio >= min_ratio) or (
                    clicks >= 2 and click_delta >= 2.0 and click_ratio >= min_ratio
                ):
                    growth_tag = "surging"

            if not growth_tag:
                continue
            if ck in seen_canon:
                continue
            seen_canon.add(ck)

            in_top20 = ql in top20
            velocity_score = (
                (0 if in_top20 else 25.0)
                + max(click_delta, 0.0) * 18.0
                + max(impr_delta, 0.0) * (1.35 if growth_tag == "new" else 1.0)
            )
            found.append({
                "query": q,
                "clicks": clicks,
                "impressions": impr,
                "ctr": round(float(r.get("ctr", 0.0)), 4),
                "position": round(float(r.get("position", 0.0)), 2),
                "prev_clicks": round(prev_c, 2),
                "prev_impressions": round(prev_i, 1),
                "impressions_delta": impr_delta,
                "growth_tag": growth_tag,
                "in_top20": in_top20,
                "_score": velocity_score,
            })
        found.sort(key=lambda x: (x["_score"], x["clicks"], x["impressions"]), reverse=True)
        return found

    if is_daily:
        results = _scan(min_new_impr=8, min_surge_impr=10, min_impr_delta=8.0, min_ratio=1.8)
        if len(results) < 3:
            results = _scan(min_new_impr=5, min_surge_impr=6, min_impr_delta=5.0, min_ratio=1.6)
    else:
        results = _scan(min_new_impr=15, min_surge_impr=15, min_impr_delta=10.0, min_ratio=1.75)
        if len(results) < 3:
            results = _scan(min_new_impr=8, min_surge_impr=10, min_impr_delta=6.0, min_ratio=1.5)

    trimmed = results[:limit]
    for item in trimmed:
        item.pop("_score", None)
    return trimmed


def compute_spillover_queries(
    current_rows: list[dict],
    *,
    top20_queries: set[str] | None = None,
    is_24h: bool = False,
    limit: int = 15,
) -> list[dict]:
    """Find page-2/3 impression-rich, low-click queries outside `coverage_queries[20]`."""
    top20 = {q.lower().strip() for q in (top20_queries or set())}
    top20_canon = {canonical_query_key(q) for q in top20}

    def _collect(min_impr: int) -> list[dict]:
        candidates: list[dict] = []
        seen_canon: set[str] = set()
        by_impr = sorted(
            current_rows,
            key=lambda r: (int(r.get("impressions", 0)), int(r.get("clicks", 0))),
            reverse=True,
        )
        for r in by_impr:
            q = str(r.get("query", "")).strip()
            if is_noise_query(q):
                continue
            ql = q.lower()
            if ql in top20:
                continue
            ck = canonical_query_key(q)
            if ck in top20_canon or ck in seen_canon:
                continue
            clicks = int(r.get("clicks", 0))
            impr = int(r.get("impressions", 0))
            pos = float(r.get("position", 0.0))
            if clicks > 3 or impr < min_impr:
                continue
            if not (5.5 <= pos <= 50.0):
                continue
            seen_canon.add(ck)
            candidates.append({
                "query": q,
                "clicks": clicks,
                "impressions": impr,
                "ctr": round(float(r.get("ctr", 0.0)), 4),
                "position": round(pos, 2),
            })
        candidates.sort(key=lambda x: (x["impressions"], -x["position"], x["clicks"]), reverse=True)
        return candidates

    primary_floor = 5 if is_24h else 10
    found = _collect(primary_floor)
    if len(found) < 5 and primary_floor > 5:
        found = _collect(5)
    return found[:limit]


def _valid_frame(mod_tokens: list[str], slot_tokens: list[str], frame_str: str) -> bool:
    if not mod_tokens or not slot_tokens:
        return False
    if len(slot_tokens) > 4:
        return False
    if slot_tokens[0] in _SLOT_BOUNDARY_REJECT or slot_tokens[-1] in _SLOT_BOUNDARY_REJECT:
        return False
    if all(t in _PURE_STOPWORDS for t in mod_tokens):
        return False
    if len(mod_tokens) == 1:
        if mod_tokens[0] not in _SINGLE_TOKEN_MODIFIERS:
            return False
    else:
        if frame_str.startswith(("and ", "or ", "the ", "a ", "an ", "of ", "in ", "on ")):
            return False
        if frame_str.endswith((" and", " or", " the", " a", " an", " of", " to", " for", " with", " without")):
            return False
        if not any(t in _MODIFIER_INTENT_TOKENS for t in mod_tokens):
            return False
    return True


def _is_high_signal_formula(frame_str: str) -> bool:
    return any(rx.match(frame_str) for rx in _HIGH_SIGNAL_FORMULA_PATTERNS)


def _modifier_family_key(mod_tokens: list[str]) -> frozenset[str]:
    norm = []
    for t in mod_tokens:
        if t in _PURE_STOPWORDS:
            continue
        s = _singularize_token(t)
        if s == "no":
            s = "without"
        norm.append(s)
    return frozenset(norm)


def extract_modifier_patterns(
    current_rows: list[dict],
    *,
    max_rows: int = 500,
    limit: int = 10,
) -> list[dict]:
    """Extract repeatable modifier formulas (`dumb <X>`, `<X> without ai`, etc.) from GSC rows."""
    eligible = [
        r for r in current_rows
        if not is_noise_query(str(r.get("query", "")))
        and (int(r.get("impressions", 0)) >= 3 or int(r.get("clicks", 0)) >= 1)
    ]
    eligible.sort(
        key=lambda r: (
            int(r.get("clicks", 0)) * 20 + int(r.get("impressions", 0)),
            int(r.get("impressions", 0)),
        ),
        reverse=True,
    )
    pool = eligible[:max_rows]

    buckets: dict[str, dict] = {}

    def _record(frame_str: str, mod_tokens: list[str], slot_tokens: list[str], row: dict) -> None:
        if not _valid_frame(mod_tokens, slot_tokens, frame_str):
            return
        canon_ent = _canonical_slot_entity(slot_tokens)
        if not canon_ent or canon_ent in _PURE_STOPWORDS or len(canon_ent) < 2:
            return
        if canon_ent in mod_tokens or any(tok in canon_ent.split() for tok in mod_tokens if tok not in _PURE_STOPWORDS):
            return
        b = buckets.get(frame_str)
        if b is None:
            b = {
                "entities": {},
                "rows": {},
                "mod_len": len(mod_tokens),
                "mod_tokens": list(mod_tokens),
            }
            buckets[frame_str] = b
        slot_display = " ".join(slot_tokens)
        if canon_ent not in b["entities"]:
            b["entities"][canon_ent] = slot_display
        q = str(row.get("query", "")).strip()
        if q not in b["rows"]:
            b["rows"][q] = row

    for row in pool:
        raw_q = str(row.get("query", "")).strip()
        cleaned = _YEAR_RE.sub(" ", raw_q.lower())
        tokens = _TOKEN_RE.findall(cleaned)
        n = len(tokens)
        if n < 2 or n > 8:
            continue

        for p_len in range(1, min(4, n) + 1):
            s_len = n - p_len
            if 1 <= s_len <= 4:
                prefix = tokens[:p_len]
                slot = tokens[p_len:]
                _record(f"{' '.join(prefix)} <X>", prefix, slot, row)

        for suf_len in range(1, min(4, n) + 1):
            s_len = n - suf_len
            if 1 <= s_len <= 4:
                slot = tokens[:s_len]
                suffix = tokens[s_len:]
                _record(f"<X> {' '.join(suffix)}", suffix, slot, row)

        if n >= 3:
            for p_len in range(1, min(3, n - 1) + 1):
                for suf_len in range(1, min(3, n - p_len) + 1):
                    if p_len + suf_len > 5:
                        continue
                    s_len = n - p_len - suf_len
                    if 1 <= s_len <= 3:
                        prefix = tokens[:p_len]
                        slot = tokens[p_len : n - suf_len]
                        suffix = tokens[n - suf_len :]
                        _record(
                            f"{' '.join(prefix)} <X> {' '.join(suffix)}",
                            prefix + suffix,
                            slot,
                            row,
                        )

    scored: list[dict] = []
    for frame_str, data in buckets.items():
        distinct_count = len(data["entities"])
        rows_list = list(data["rows"].values())
        total_clicks = sum(int(r.get("clicks", 0)) for r in rows_list)
        total_impr = sum(int(r.get("impressions", 0)) for r in rows_list)
        high_sig = _is_high_signal_formula(frame_str)

        if distinct_count >= 2:
            if total_impr < 15 and total_clicks < 2:
                continue
            pattern_type = "multi_entity"
        elif distinct_count == 1 and high_sig and (total_clicks >= 5 or total_impr >= 100):
            pattern_type = "single_breakout"
        else:
            continue

        rows_list.sort(key=lambda r: (int(r.get("clicks", 0)), int(r.get("impressions", 0))), reverse=True)
        examples = [
            {
                "query": str(r.get("query", "")),
                "clicks": int(r.get("clicks", 0)),
                "impressions": int(r.get("impressions", 0)),
            }
            for r in rows_list[:5]
        ]

        rank_score = (
            (1000.0 if distinct_count >= 2 else 0.0)
            + distinct_count * 180.0
            + (120.0 if high_sig else 0.0)
            + total_clicks * 8.0
            + min(total_impr, 5000) * 0.12
            + data["mod_len"] * 10.0
        )
        scored.append({
            "pattern": frame_str,
            "pattern_type": pattern_type,
            "distinct_entities": distinct_count,
            "entities": list(data["entities"].values())[:8],
            "total_clicks": total_clicks,
            "total_impressions": total_impr,
            "example_queries": examples,
            "_query_set": frozenset(data["rows"].keys()),
            "_ent_set": frozenset(data["entities"].keys()),
            "_fam_key": _modifier_family_key(data["mod_tokens"]),
            "_mod_len": data["mod_len"],
            "_score": rank_score,
        })

    scored.sort(key=lambda x: (x["_score"], x["_mod_len"]), reverse=True)

    deduped: list[dict] = []
    seen_qsets: list[frozenset[str]] = []
    seen_single_families: set[tuple[frozenset[str], frozenset[str]]] = set()
    for item in scored:
        qset = item["_query_set"]
        if any(qset == prev for prev in seen_qsets):
            continue
        if item["pattern_type"] == "single_breakout":
            fam_sig = (item["_ent_set"], item["_fam_key"])
            if fam_sig in seen_single_families or any(qset.issubset(prev) for prev in seen_qsets):
                continue
            seen_single_families.add(fam_sig)
        seen_qsets.append(qset)
        for k in ("_query_set", "_ent_set", "_fam_key", "_mod_len", "_score"):
            item.pop(k, None)
        deduped.append(item)
        if len(deduped) >= limit:
            break

    return deduped


def build_additive_signals(
    all_query_rows: list[dict],
    coverage_queries: list[dict],
    *,
    baseline_rows: list[dict] | None = None,
    baseline_divisor: float = 1.0,
    is_24h: bool = False,
) -> dict:
    """Compute all three additive Phase 0 pull signals in one call."""
    top20_set = {str(r.get("query", "")).lower().strip() for r in coverage_queries if r.get("query")}
    return {
        "total_queries_in_window": len(all_query_rows),
        "rising_queries": compute_rising_queries(
            all_query_rows,
            baseline_rows,
            baseline_divisor=baseline_divisor,
            top20_queries=top20_set,
        ),
        "spillover_queries": compute_spillover_queries(
            all_query_rows,
            top20_queries=top20_set,
            is_24h=is_24h,
        ),
        "modifier_patterns": extract_modifier_patterns(all_query_rows),
    }
