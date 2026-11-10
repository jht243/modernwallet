# Output contract for enrichment sections (comparison page store: src/data/comparisons.ts)

You are adding to an EXISTING comparison page. Output is markdown only.
- When the task line asks for a section: exactly one `## ` heading in Title Case (noun-phrase, one clause, no colon-drama), then the prose. The heading text is given in the task line; use it verbatim.
- When the task line says "no heading": output only the prose paragraphs, no `#` heading.
- Paragraphs are separated by one blank line, at most 3 sentences each. No raw HTML, no em-dashes, no bullet lists unless the task line asks for one.
- Links are markdown `[label](url)` and only from the closed URL list or the closed internal-route list.
- Do not add the page byline, a disclaimer, a conclusion/summary heading, or a CTA.
- Operator register ("you"), plain 7th to 8th grade words. The page speaks for the site; it never claims we tested, modeled or surveyed anything. Source-only content: name the IRS beside each rule.
- The brand first-"we" rule does not apply to additions that contain no company claim; do not add any "we" experience claim.
