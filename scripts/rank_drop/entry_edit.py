#!/usr/bin/env python3
"""Edit a page's data entry by top-level key, preserving everything else byte-for-byte.

Used by the L5 rewrite (replace the generated keys, keep slug/publishedDate/CTA/related links and
any field the generator doesn't produce) and by exact one-sentence fact edits.
"""

import json
import re


def _skip_string(s: str, i: int) -> int:
    q = s[i]
    i += 1
    while i < len(s):
        if s[i] == "\\":
            i += 2
            continue
        if s[i] == q:
            return i + 1
        i += 1
    raise ValueError("unterminated string")


def split_top_level(entry: str) -> list[tuple[str, str]]:
    """'{ a: 1, "b": [..] }' -> [('a', '1'), ('b', '[..]')] with raw value text, in order."""
    assert entry.lstrip().startswith("{") and entry.rstrip().endswith("}")
    body = entry[entry.index("{") + 1: entry.rindex("}")]
    out, i, n = [], 0, len(body)
    while i < n:
        while i < n and body[i] in " \t\r\n,":
            i += 1
        if i >= n:
            break
        if body.startswith("//", i):
            i = body.find("\n", i) if body.find("\n", i) >= 0 else n
            continue
        m = re.match(r"""(["']?)([A-Za-z_$][\w$]*)\1\s*:\s*""", body[i:])
        if not m:
            raise ValueError(f"cannot parse key at: {body[i:i + 40]!r}")
        key = m.group(2)
        j = i + m.end()
        start, depth = j, 0
        while j < n:
            c = body[j]
            if c in "'\"`":
                j = _skip_string(body, j)
                continue
            if c in "[{(":
                depth += 1
            elif c in "]})":
                depth -= 1
            elif c == "," and depth == 0:
                break
            j += 1
        out.append((key, body[start:j].rstrip()))
        i = j + 1
    return out


def rebuild(entry: str, replace: dict, today: str) -> str:
    """Replace the given top-level keys with JSON values (new keys appended), keep the rest raw."""
    json_keys = bool(re.search(r'^\s*"slug"\s*:', entry, re.M))
    ind_m = re.search(r"\n(\s+)[\"']?slug", entry)
    ind = ind_m.group(1) if ind_m else "  "
    k = (lambda x: f'"{x}"') if json_keys else (lambda x: x)
    parts, seen = [], set()
    for key, raw in split_top_level(entry):
        seen.add(key)
        if key in replace:
            val = json.dumps(replace[key], ensure_ascii=False, indent=2).replace("\n", "\n" + ind)
        elif key == "updatedDate":
            val = json.dumps(today)
        else:
            val = raw
        parts.append(f"{ind}{k(key)}: {val}")
    for key, v in replace.items():
        if key not in seen:
            parts.append(f"{ind}{k(key)}: " + json.dumps(v, ensure_ascii=False, indent=2).replace("\n", "\n" + ind))
    close_ind = ind[:-2] if len(ind) >= 2 else ""
    return "{\n" + ",\n".join(parts) + "\n" + close_ind + "}"


def apply_fact_edits(entry: str, edits: list[dict]) -> tuple[str, list[str]]:
    """Exact, single-occurrence sentence replacements. The 'old' text is matched against the entry
    with both escaped and unescaped apostrophes, so a planner can quote the sentence as it reads."""
    done = []
    escs = (lambda t: t, lambda t: t.replace("'", "\\'"), lambda t: t.replace('"', '\\"'))
    for e in edits:
        old, new = e["old"], e["new"]
        for esc in escs:
            if entry.count(esc(old)) == 1:
                entry = entry.replace(esc(old), esc(new))
                done.append(f'"{old[:80]}" -> "{new[:80]}"')
                break
        else:
            raise ValueError(f"fact edit 'old' text not found exactly once: {old[:80]!r}")
    return entry, done


def commit_or_preview(f, src: str, new_src: str, dry_run: bool, preview: "Path | None" = None):
    """Write the edited file and syntax-check it — or, in dry-run, never touch the repo: write the
    edited copy to a temp path, syntax-check that, and save a unified diff for review.
    Returns (ok, message)."""
    import difflib
    import subprocess
    import tempfile
    from pathlib import Path
    check = Path(__file__).resolve().parent / "syntax_check.mjs"
    if dry_run:
        with tempfile.TemporaryDirectory() as td:
            tmp = Path(td) / Path(f).name
            tmp.write_text(new_src)
            r = subprocess.run(["node", str(check), str(tmp)], capture_output=True, text=True)
        if preview is not None:
            diff = difflib.unified_diff(src.splitlines(), new_src.splitlines(),
                                        f"a/{Path(f).name}", f"b/{Path(f).name}", n=1, lineterm="")
            Path(preview).write_text("\n".join(diff) + "\n")
        return r.returncode == 0, r.stdout.strip()[:300]
    Path(f).write_text(new_src)
    r = subprocess.run(["node", str(check), str(f)], capture_output=True, text=True)
    if r.returncode:
        Path(f).write_text(src)                                    # roll back this page only
    return r.returncode == 0, r.stdout.strip()[:300]
