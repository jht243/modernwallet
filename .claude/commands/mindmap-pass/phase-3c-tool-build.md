# Phase 3c — Build the tool rows (interactive tool / calculator / quiz-assessment)

Phase 3 routes every `create new content` row whose format is `interactive tool`, `calculator` or
`quiz/assessment` here. These are BUILT in this run — a working tool on a live route — not
specced for later. `git add` your work; do NOT commit. Phase 4 (tool checklist) is the gate.

Same rules as Phase 3: NET-NEW routes only (a row pointing at an existing route → STOP and flag it),
and page PROSE (intro, how-to, explanation, FAQ) comes from the API writer —
`scripts/lib/content_gen.py` per `_content-generation.md`, `.meta.json` committed beside it. The
tool's CODE (component, logic, labels, button text) is yours to write.

## 1. Find this repo's tool pattern
Every fleet site already ships tools. Find them before writing anything:
- the fleet usage tracker's roots: `grep -rn 'data-tool' src templates app 2>/dev/null`
- tool routes/registries: `src/pages/tools/`, `src/components/tools/`, `src/data/ia.ts`-style spoke
  registries (`kind:'noapi'`), Python page dicts / Jinja templates with an embedded widget

Pick the existing tool most like the new one (same hub/section, same kind — calculator vs
generator vs quiz). **Mirror its whole wiring exactly; never invent a new pattern:** registry/IA
entry, route/page file, component location and framework (React island, vanilla JS, Jinja
partial…), layout, schema/JSON-LD (e.g. `SoftwareApplication`), breadcrumbs, related-tools block,
FAQ shape, CTA, and the sitemap source the existing tool is listed in.

No interactive tool anywhere in the repo → build it as ONE self-contained client-side component
inside the site's standard page template (same framework as the rest of the site; vanilla JS for
static/Python sites), and say "first tool on this site" in the Phase 8 summary.

## 2. Decide the logic before the UI
From the row's `solution` (what the tool DOES: inputs → outputs / question flow) and the
reader_question, write down:
- inputs (fields, units, sensible defaults so it shows a result on first load, valid ranges)
- outputs (what the reader acts on, in their units and words)
- the formula / scoring / generation rules. **Every number is a named constant with a comment
  saying where it comes from** (official rate table, published method, stated assumption).

If no defensible logic exists — you would have to invent the math or the scoring — do NOT ship a
tool. Re-route the row to a normal article (Phase 3 `--schema guide`) on the same query and note
the switch in the chart row. Never ship invented math.

## 3. Build it
- **Client-side and deterministic.** No tool that calls a paid API (LLM, data vendor) per use, no
  new backend service. Reuse what the site already has.
- **The `data-tool="<slug>"` root** wraps the tool (the fleet usage tracker counts views/uses off
  it) — mirror exactly how the existing tool sets it (attribute on the root, or the layout's
  `tool` slot that adds it). Slug = the route's last segment.
- Accessible labels on every control; works at 390px wide; no console errors.
- **A way to keep the result** when the reader's job ends in a thing (print, copy, download,
  fullscreen for projecting) — whatever the mirrored tool offers, at minimum.
- **Printable output prints like a real worksheet.** If the result is meant to be printed, Print shows ONLY the
  output (no site header, page copy or controls), on a white page with margins, with a title, Name/Date lines
  where students fill it in, one line of directions, and rows spaced to fill the page. Use the repo's shared print
  component if it has one (e.g. Chalkbox `src/components/tools/PrintSheet.tsx`); otherwise mirror the existing
  tool's print CSS. Check it with a print-to-PDF before Phase 4.
- No new runtime dependency over ~30 KB gz (the bundle gate fails the build anyway).

## 4. Write the page around it
Generate the page prose with the API writer exactly as for an article row (same row prompt
template, same standards, same depth floor the repo uses for tool pages — else match the mirrored
tool page's depth). The prose explains how to use the tool, how it works (the logic + named
assumptions, one worked example with real numbers), when its answer is wrong for you, and the
FAQ — and must describe the tool you actually built (labels, steps and defaults match the code).
Place the tool where the mirrored tool sits (above the fold, before the long prose).

## 5. Wire it up and build
- Registry/IA entry, nav/hub listing and sitemap source exactly as the mirrored tool has them.
- Run the site's full build (Node 20 for Node sites). It must pass, including any bundle/depth/
  markup gates. Confirm the new route rendered in the build output.

Record each built tool's route in the chart row (`built: /route`). **Auto-continue to Phase 4.**
