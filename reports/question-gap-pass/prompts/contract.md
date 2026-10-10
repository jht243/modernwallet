# Output contract (enrichment of an EXISTING page)
You are adding ONE answer to an existing page. Return markdown only, nothing else.
- Task type "faq": return only the answer text for the FAQ: 1 to 3 tight sentences, no heading, no bullet list. The FIRST sentence is a complete, self-contained declarative answer a reader (or an AI assistant) could quote on its own. It must not restate the question as a rhetorical opener.
- Task type "strengthen": return only the replacement text for the named existing answer, same length class or at most 1.5x, leading with the direct answer.
- Task type "section": return one `## ` noun-phrase heading plus 2 to 4 short paragraphs.
- State only figures that are in the CLOSED FACT LIST. If a figure is not on it, you do not know it. Keep the page's existing voice. Informational, not individualized advice; no "you should" instructions about someone's own money, use "it depends on" framing where the answer varies.
- First-person claims only as licensed by the experience file. Prefer none.
- Internal links: markdown `[text](/path/)`, only from the allowed internal list in the prompt. External links only from the CLOSED URL LIST.
