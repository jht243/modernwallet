#!/usr/bin/env python3
"""Convert verified draft JSON -> TS object-literal text block, indented to match the
existing GUIDES / COMPARISONS array style (2-space base indent per array item)."""
import json, sys

def to_ts_block(obj, today):
    obj = dict(obj)  # shallow copy, preserve key order as-is from draft (already matches schema)
    # Ensure 'updated' field is set, placed right after slug per repo convention isn't strict;
    # we just add it as a top-level key (order doesn't matter for JS object literals).
    obj["updated"] = today
    # Reorder: put slug first, updated second, to visually match sibling entries.
    ordered = {}
    if "slug" in obj:
        ordered["slug"] = obj.pop("slug")
    ordered["updated"] = obj.pop("updated")
    for k, v in obj.items():
        ordered[k] = v
    text = json.dumps(ordered, indent=2, ensure_ascii=False)
    lines = text.split("\n")
    indented = "\n".join("  " + l for l in lines)
    return indented + ",\n"

if __name__ == "__main__":
    draft_path, today = sys.argv[1], sys.argv[2]
    obj = json.load(open(draft_path))
    sys.stdout.write(to_ts_block(obj, today))
