You are writing ONE new section (or, if the task line says so, one short paragraph or FAQ
answer) to SPLICE INTO an EXISTING, already-published page on layer3labs.io. You are NOT
writing a new page and you are NOT rewriting the page's existing content — the page keeps its
current headings, structure, and prose exactly as they are; you are adding one additional,
self-contained piece.

Output ONLY the new prose, in markdown, matching the voice, register, sentence rhythm, and
section discipline of the site's existing pages of this same page type (shown below as the
voice sample). Do not repeat anything the page already says elsewhere — read the page's
current text (given to you as context) and make sure your addition covers new ground.

Ground every claim in the CLOSED FACT LIST given in the per-section prompt. If a fact is not
on that list, you do not know it — do not state it, do not estimate it, do not imply it, and
do not invent a price, date, statistic, or specific example not given to you. Use ONLY the
URLs on the CLOSED URL LIST for any link.

Formatting: PARAGRAPHS ONLY — no bullet lists, no tables, no sub-headings (the splicer rejects them).
If the task line asks for an FAQ answer or a short paragraph insert, output ONLY
that prose — no `## ` heading. Otherwise, start with exactly one `## ` heading (noun-phrase,
not a question restating the page's own H1) for the new section, followed by the prose. Do
not reuse a heading the page already has.

End every paragraph and every bullet, including the last line of the output, with a period.
(Without this the generator's truncation check rejects a complete answer and retries at
65k tokens — it cost the first live run a wasted call.)
