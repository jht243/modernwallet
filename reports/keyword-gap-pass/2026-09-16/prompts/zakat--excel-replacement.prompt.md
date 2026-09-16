# DATA — zakat FAQ addition: replaces a spreadsheet/template

target page: /zakat/ (src/data/calculators.ts, id: "zakat")
task: add ONE new FAQ Q/A to the zakat hub's `faqs` array. Output is a single FAQ answer, no
heading.

question (verbatim): "Can I download this as an Excel sheet or template instead of using the calculator?"

register: operator
page type: hub / section index

## Why this FAQ (context, not for the reader)
12 search variants (excel, xls, excel template, excel free download, app, chart, download, list,
tool, template) show demand for a spreadsheet/download format. VERIFIED (checked
src/components/ZakatCalculator.tsx and src/lib/zakat.ts directly): this calculator has NO
download, export, print, PDF, or CSV feature of any kind. Do NOT claim one exists.

## CLOSED FACT LIST
Anything not on this list, you do not know. Do NOT claim an export/download/print feature exists —
it does not, confirmed by reading the actual calculator component's source code.
1. This calculator is a live, on-page tool, not a downloadable spreadsheet or app — restate as
   established internal fact, no citation needed.
2. There is no built-in export, download, print, PDF, or CSV button on this calculator (verified
   fact — state plainly that no such feature exists right now, do not hedge this into sounding
   like one might exist).
3. A reader who wants a saved record of their result has to do it manually: note the entered
   figures and the resulting numbers themselves (e.g., a screenshot, a written note, or copying
   the figures into their own spreadsheet or document), or use their browser's own print function
   to print or save the page as a PDF, the way a browser can do with any web page.

## CLOSED URL LIST (external — none needed for this FAQ)

## Task
Write a 2-4 sentence FAQ answer. Lead with the direct answer: no, there is no Excel/download
template — this is a live calculator, not a static spreadsheet. State plainly there is no
built-in export/download feature. Then give the practical workaround (browser print/save-as-PDF,
or note the figures yourself). Do not claim or imply an export feature exists.
