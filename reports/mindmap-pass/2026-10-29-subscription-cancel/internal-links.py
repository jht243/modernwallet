"""Apply only the three approved inbound links to their inspected guide sections."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
GUIDES = ROOT / "src/data/guides.ts"
SPOKES = ROOT / "src/data/spokes-checklists.ts"
text = GUIDES.read_text()
rows = [
    (
        "Where the Numbers Come from When You Make a Budget",
        "If a recurring charge is one you want to stop, use the [subscription cancellation planner](/checklists/cancel-subscription-planner/) to identify the biller and keep a dated record.",
    ),
    (
        "Subscription Creep: The Quiet Budget Killer",
        "If a recurring charge keeps coming after you ask to cancel, use the [subscription cancellation planner](/checklists/cancel-subscription-planner/) to identify the biller and document your next step.",
    ),
    (
        "Robinhood Gold Billing and Cancellation",
        "If another subscription has unclear billing or cancellation steps, use the [subscription cancellation planner](/checklists/cancel-subscription-planner/) to map the route and keep proof.",
    ),
]

for heading, sentence in rows:
    heading_literal = json.dumps(heading, ensure_ascii=False)
    pattern = re.compile(
        r'(?:(?:"heading")|heading)\s*:\s*'
        + re.escape(heading_literal)
        + r'\s*,\s*(?:"body"|body)\s*:\s*("(?:\\.|[^"\\])*")'
    )
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise SystemExit(f"Expected one section for {heading!r}; found {len(matches)}")
    match = matches[0]
    body = json.loads(match.group(1))
    if sentence not in body:
        body = body.rstrip() + "\n\n" + sentence
        text = text[:match.start(1)] + json.dumps(body, ensure_ascii=False) + text[match.end(1):]

GUIDES.write_text(text)
spokes = SPOKES.read_text()
marker = "// Mindmap pass (2026-10-29): subscription cancellation rights and route planner."
start = spokes.rfind(marker)
if start < 0:
    raise SystemExit("Could not locate the new planner entry for its approved section link.")
tail = spokes[start:]
old_href = "/guides/how-to-budget-for-teens-college-students/"
new_href = old_href + "#subscription-creep-the-quiet-budget-killer"
if old_href in tail and new_href not in tail:
    tail = tail.replace(old_href, new_href, 1)
    spokes = spokes[:start] + tail
    SPOKES.write_text(spokes)
print("Applied the approved inbound links and matching section anchors.")
