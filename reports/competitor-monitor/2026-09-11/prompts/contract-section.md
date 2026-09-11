# Output contract — a section/paragraph addition to an EXISTING comparison page (ModernWallet, comparisons.ts)

Return PLAIN MARKDOWN, not JSON, not a code fence:
- If the task asks for a new or replacement SECTION, output exactly one `## Heading In Title Case` line, followed by one or more paragraphs (blank line between paragraphs).
- Markdown links `[text](url)` for every external company/source/regulator named — first mention only, official/primary source only, from the closed URL list.
- Match the voice of the sample: operator register, "you" addressing the reader, plain declarative sentences, varied sentence length, no filler.
- The brand first-"we" rule only applies if this addition is the FIRST "we" claim anywhere on the page — this page already has earlier "we" usage, so do not add a new "At ModernWallet, we..." line here.
- Do not add a disclaimer, a CTA, or a "related comparisons" list — those are handled elsewhere on the page.
- Internal links use only the exact paths given in the task's internal-links list, if any.
