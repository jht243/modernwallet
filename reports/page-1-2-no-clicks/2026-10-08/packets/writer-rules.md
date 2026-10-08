## WRITER

**BAR 1 — Do not write like an unedited LLM.** Two classes of tell follow. The **single-instance bans** each fail the page on one occurrence. The **phrasing tells** fail the page at two or more. Strip both before you finalize.

### Single-instance bans (any one occurrence is a failure)

- **Meta-narration & condescending signposting.** Never announce the writing, rate what you just said, or tell the reader how to weigh it — it talks down to the reader. Delete the sentence or state the fact directly.
  - Signpost openers: "Here is the gap.", "Here is where X fits.", "Here's the thing.", "The truth is,", "What this means is,", "Now, the interesting part.".
  - Point-rating commentary: "That is the direct answer, and it matters more than…", "The short answer is…", "and that matters", "make no mistake".
  - Page/reader self-reference: "This guide covers…", "in this article", "as we'll see", "you might be wondering", "that's why you're here", "which is the reason this search exists", "if you're (still) reading this".
  - Structural labels (a bold "Practical takeaway:" line) and section headings are fine. The ban is narrating the writing inside the prose.
- **Em-dashes (— or --) used as a connector or aside.** Any instance fails. Use a period, comma, colon, or parentheses instead, and vary sentence shape. Number ranges use "to" (e.g., "50 to 70", not "50–70").
- **"honest" / "honestly" / "honesty" anywhere.** Software, a model, a tool, pricing, or a verdict has no honesty, and you never label your own writing honest. Say the thing directly ("the caveat is…", "the short answer is…", "a straight read"). `grep -inE "\bhonest"` the changed text and cut every hit.
- **The "X, not Y" antithesis flourish.** The compressed comma-antithesis ("the appeal is variety, not high doses"; "a whole food, not a drug"; "history is a hypothesis, not evidence") — and the "it's not just X, it's Y" / "isn't just about X — it's about Y" cadence — are banned. Write the plain declarative. A plain full-sentence negation ("It is not a supplement.") is fine; the compressed comma-antithesis is not.
- **Software "death" metaphors.** Never write that a demo, feature, product, tool, model, or technology "died", "is dead", was "killed", is "on life support", or "flatlined". Say what literally happened: it never shipped, was abandoned, stopped being used, or lost support.
- **The coy abstraction where a name belongs (ANYWHERE on the page, not only in headings).** Never write "the vendor", "the platform", "this provider", "the company", "the tool", "one major provider", or "a leading tool" when the page has already named the subject. Use the H1 name in every sentence that refers to it. "Verify the current figure on the vendor's own pricing page" is a failure. Name the product, then link its pricing page. The generic noun reads as though the writer is avoiding the name, and an AI extractor quoting that sentence loses the subject entirely. This applies to body prose, FAQ answers, CTA copy, and every heading field.
- **An instruction to check a source, with no link to it.** If you tell the reader to verify something, confirm a price, read the docs, or check a policy, link the exact page that answers it. A bare "check their pricing page" makes the reader search for what you already had open.
- **Vague abstractions that name nothing concrete** ("clever one-off demos", "seamless synergy", "strategic inflection point", "holistic solution", "next-level"). Replace with the specific noun, number, or example.
- **Faux-insight setups** that flatter the writer as the lone expert: "what nobody tells you", "the part everyone misses", "what most people get wrong", "this is the part most people skip". Cut the setup and make the claim stand on its own.
- **Weasel attribution.** "Experts agree", "studies show", "research suggests", "many argue", "widely regarded as", "industry reports suggest". Name the actual source or cut the claim — never invent one.
- **Parallel-list padding inside one sentence.** A triple that repeats a frame instead of adding information: "different moments, different billing terms, and sometimes different regions", "new tools, new workflows, new expectations". The reader learns one thing, told three times. Say the one thing, or give three items that each carry a distinct fact.
- **Trailing judgment appositive.** A comma-attached phrase at the end of a sentence that rates what you just said rather than adding to it: ", presented as settled fact", ", framed as certainty", ", sold as a feature", ", dressed up as strategy". Same defect as the `-ing` analysis clause: it performs analysis in place of stating one. Delete it, or replace it with the concrete consequence.
- **Presupposing the reader's situation.** Never assume what the reader already owns, uses, has done, has decided, or knows. A page about alternatives is read by people who use the subject, people on a rival, and people buying their first one. "You" for the person reading is required in operator register (VOICE in `_content-standard.md`). The fail is ownership, not address: "leaving" the product as if they already use it, "your current system", "before you switch", "now that you have outgrown it" tells two thirds of that audience the page is not for them. Same for "as you know", "you have probably already", "if you are like most people". For ownership, write "if you already use this product…" and put the H1 name where "this product" sits. Do not silently assume. Headings, subtitles, and meta fields are the worst place to presuppose, because they are what a searcher reads before deciding to click. Defaulting every sentence to "a firm" / "firms" so you never say "you" is encyclopedia voice, not a way around this ban. Naming a shop size or practice type ("a two-attorney shop", "midsize teams") is fine.
- **Pseudo-cleft emphasis padding.** "X is what decides whether Y", "the cleanup is the thing that determines Z", "what matters is whether…", "it is the data that drives the result". A roundabout frame that buries a plain subject-verb-object sentence inside "is what / is the thing that / what … is". Say it straight: "The data cleanup decides whether a switch pays off." If the direct version loses a nuance, the nuance belongs in its own sentence, not smuggled into a cleft.
- **The first-read test — a sentence you have to re-read to parse fails.** Read each sentence once, at speed. If you cannot extract who-does-what on that single pass — because clauses are stacked, a conditional is buried inside another conditional, or a phrase reads two ways — it fails, even if every word is defensible. Two specific traps: (1) **garden-path / phrasal-verb collisions** — "a switch off the old plan" reads first as *power off*; "turn down the offer", "make out the invoice", "run over the contract" all mislead for a beat. Reword so the first reading is the right one ("moving off the old plan"). (2) **stacked abstractions** — "whether a switch off the old plan pays off" chains three light words (switch/off/pays-off) with no concrete noun; name the thing ("whether moving off the old plan is worth the cost"). When a sentence makes a reader ask "what does this even mean?", the answer is never a smarter reader — it is a rewrite.
- **Folksy locative metaphor standing in for a fact.** "…is where the hours go", "that's where the money lives", "this is where deals die", "where the real work happens", "where the magic is", "that's where it falls apart". A vague place-metaphor pretending to be an insight, when the sentence should state the actual quantity, cause, or mechanism. "Setup is where the hours go" → "Setup takes the most hours" or, better, the real number. Cut the metaphor and state the fact.
- **Aphoristic fragment as a verdict.** "Both cannot be current." "Neither is the point." "That is the trade." A short declarative doing the work of an argument. State the mechanism instead.
- **Superficial `-ing` analysis clauses** that pretend to explain meaning: a trailing "highlighting…", "underscoring…", "reflecting…", "showcasing…". Replace with the concrete consequence ("…so users can find old drafts without leaving the editor").
- **Synonym cycling** — rotating "agent / assistant / tool / platform" for the same thing to avoid repetition. Repeat the one clear word instead.
- **Dramatic fragmentation** — "That's it. That's the whole thing.", "X. And Y. And Z." Use complete sentences.
- **Rhetorical setups** — "What if I told you…", "Think about it:", "Plot twist:", and self-answered "Question? Answer." pairs. Drop them and state the point.
- **Fake-profound kicker** — a final "deep" line that turns the point into a metaphor, aphorism, or mic-drop. Delete it and end on the clearest concrete sentence already in the draft.
- **Summary-recap ending** — "In conclusion", "Ultimately", "Overall", or a closing paragraph that restates the piece. End on the last concrete point, takeaway, or next action.

### Headline tells (any one occurrence is a failure — applies to H1, SEO title, subtitle/deck, and section headings)

- **Presupposed change.** "still", "no longer", "now", "these days", "has become", "in the age of" used to imply the reader knows some earlier state. The reader arrived cold and has no before-picture. "What the Vendor Still Publishes" tells a first-time visitor that something changed and leaves them guessing what. Name the current state flatly instead.
- **The coy abstraction where a name belongs.** "the vendor", "this platform", "one major provider", "a leading tool" in a headline whose subject you already named. If the H1 names the subject, the next clause uses that name, not "the Vendor".
- **The two-clause headline formula.** "X, and What You Have to Ask For" / "X, and Why It Matters" / "X: What It Is and How to Choose". A comma or colon splicing a topic to a second promise is the default LLM headline shape. Write one clause that says the thing.
- **Headline tricolon.** A subtitle or deck built as three parallel items ("the one figure X lists, why Y disagree, and the line items that move your bill"). Two items, or one specific claim, reads as written by a person.
- **"actually" / "really" / "truly" as the insight.** "what actually drives your bill", "what it really costs". The word is doing the work a fact should do. Cut it, or replace the headline with the fact itself.
- **Question headlines the page then answers.** "Is X Worth It?" as an H1 is acceptable when it matches a real query. "But What About Y?" as a section heading is not.
- **Colon-drama in a heading.** "The Catch:", "The Result:", "The Real Story:".
- **Curiosity-gap headlines** that withhold the answer to force a click: "What Nobody Tells You About X", "The One Thing X Won't Say". State the finding in the heading.

### The meaning bar — POSITIVE tests every sentence must pass

Everything else in this file is a ban. Bans alone produce empty prose, because a writer dodging them drifts toward abstraction: the safest sentence to write is one that says nothing. These tests are the other half. A page can carry zero banned phrases and still fail here, and that failure is worse, because it wastes the reader's time while looking compliant.

- **Never raise a problem you do not resolve.** If you name a problem, objection, risk, limitation, or complaint, the same passage must give the reader somewhere to go: the answer, the workaround, the tradeoff to accept, or a link to the page that handles it. A problem raised and abandoned is worse than silence, because you have told the reader they have a fire and then walked out. "There is a fifth complaint, that reminders are manual and orders go cold, and no dashboard fixes it" leaves the reader holding it. Either resolve it, route it, or cut the sentence. This applies to caveats and limitations too: "X is supported but not automated" must be followed by what to do about it.
- **The say-it-out-loud test.** Would you say this sentence, in these words, to a smart colleague across a table? If it would sound stilted spoken aloud, it is stilted written down. "Naming the problem first separates a good switch from an expensive lateral move" is not something a person says. "Work out what you actually need before you compare the options" is.
- **Concrete nouns, not placeholders.** Every sentence needs at least one noun the reader can picture. `problem`, `platform`, `solution`, `option`, `approach`, `thing`, `piece`, `area`, `aspect`, `move`, `one` are placeholders. A wait time, a refill pack, a duplicate row, $49 a month: those are things. A sentence built only from placeholders means nothing however grammatical it is.
- **Each sentence adds a new fact.** If a sentence restates its predecessor in different words, delete it. The predecessor can be the previous body sentence or the subtitle/deck. "Each constraint points at a different option. Overnight, ground, and pickup each fit a different one." is one idea written twice. A subtitle that states the finding, then an intro sentence that restates it, is the same fail.
- **No pronoun that sends the reader backwards.** "a different one", "if it cannot be stated", "that matters when". A pronoun whose antecedent sits in a previous sentence forces a re-read. Repeat the noun.
- **Verbs do the work; do not nominalize.** "Naming the problem first separates…" hides an instruction inside a noun. Write the instruction: "Name the problem first." Watch for `-ing` and `-tion` subjects.
- **Right collocations.** Use the words that actually go together. Products do not "answer" problems; they fit a need, solve a problem, or handle a job. A wrong pairing is the clearest signal that a machine assembled the sentence.
- **No abstract metaphor where a plain verb exists.** "separates a good switch from an expensive lateral move", "drives the real cost", "points at". Say what happens.

**If a reader could ask "what does this actually mean?" about a sentence, it fails, no matter how many bans it clears.**

### Overloaded sentences (any one is a failure)

- One idea per sentence. A sentence fails if it packs three or more ideas, chains clauses with commas / "and" / "from X to Y to Z", runs past ~30 words, or needs a second read. Split a stack. Do not split a clear spoken sentence just to get under 20 words.

### Inflated adjectives & hype verbs (cut the word, state the fact)

- Banned as filler: crucial, vital, essential, pivotal, paramount, powerful, profound, remarkable, notable, significant, key, game-changer, cutting-edge, revolutionary, breakthrough, robust, holistic, "wealth of", myriad, plethora, delve, realm, landscape, testament, "plays a key/vital/pivotal role", "cannot be overstated", unlock, harness, supercharge, boost, foster, utilize, facilitate, empower, streamline, tapestry, beacon, multifaceted, meticulous, intricate, embark, elevate, transformative. Name the actual feature and what it does instead.

### Punctuation tells (any one is a failure)

- Rhetorical-question section openers, colon-drama ("The result:", "The catch:"), exclamation points, scare-quote overuse, semicolon-stacked sentences.

### Formatting slop (any one is a failure)

- Emoji in headings, bold sprinkled mid-sentence for emphasis, bullet lists where two sentences of prose read better, and a header over a two-sentence section. Format follows the content; it does not decorate it.
- Three or more parallel steps, checks, or tests announced as a set, then written as paragraphs that open First / Second / Third (or 1. / 2. / 3. in body copy). Those belong in a list. Two related sentences, or a story that uses "first … then …", stay prose.

### Phrasing tells (two or more fail the page)

- Throat-clearing openers ("When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…").
- Empty tricolons ("efficient, effective, and scalable"); hedged non-conclusions ("ultimately, the right choice depends on your needs").
- Filler verbs/phrases: "delve into", "leverage" (verb), "navigate the complexities of", "unlock the power of", "it's worth noting that", "a testament to".
- Symmetrical listicle padding where every bullet is the same length and shape with no concrete specifics.

Write with concrete specifics, commit to a verdict, and vary sentence shape.

---

## DEFEND-LOCK — check before you edit any existing page

**Before editing, rewriting, or appending to ANY existing page, check `reports/ai-answer-citation-pass/defended-pages.json` (if it exists in this repo).** If the page's route is listed in `pages[].route`, the page is **AIO-defended**: Google's AI Overview currently cites it as the source for its query, and rewriting it risks losing that citation.

- A defended route is **frozen** — do NOT rewrite, append to, or metadata-edit it. Skip it and log `skipped — AIO-defended` in your digest, exactly like a cooldown skip.
- The ONE exception: correcting a genuine factual error (e.g. a YMYL fact went stale). Such an edit still runs the full audit, and you note it so the next `/ai-answer-citation-pass` run re-checks the citation survived.
- The lock is self-releasing: `/ai-answer-citation-pass` rewrites this file every run from the live SERP, so a page leaves the list automatically the moment we lose the citation. Do not edit this file yourself — `/ai-answer-citation-pass` is its only writer.
- If the file is absent (repo without the pass, or first run), there is no lock; proceed normally.

## INTENT — answer the reason the reader is on the page, near the top (added 2026-09-22)

Every page is opened by a person with ONE question, and it is usually a *doing* question, not a
*defining* one. Someone who searches "law firm client onboarding automation" wants to know **how
to build it** — what connects to what, what fires first, what to wire up before anything else.
A page that opens by defining onboarding, drawing its boundaries, and classifying its stages has
answered a question nobody asked, however well it did it.

**The rule:**

1. **Name the reader's question on the row**, as `reader question: "<the question, in the
   reader's words>"`. It is DECIDED at chart-build time (mindmap-pass build-brief Step 4.6 —
   question, then answer + shape, then placement — recorded as chart cols 10–12 and approved by
   the user in the Phase 0 manifest); the writer and auditor consume it. Derive it from the
   query's verb and the live PAA, not from the topic noun:
   "how do I…", "which should I…", "is X worth…", "what does X cost". If the row cannot state it
   in one sentence, the page has no reason to exist yet.
2. **Answer that question in the first or second section**, before any scope, boundary,
   background, taxonomy, or "what is X" material. Sentence 1 of the body is still the direct
   answer (GATE Tee-up); this rule governs the *first sections*, which must deliver the working
   answer — the mechanism, the recommendation, the number, the verdict — not set up for it.
3. **A "how" question gets a "how" answer**: the trigger, the sequence of hops, the parts to
   assemble, and the one thing to build first. Naming the categories of work without showing
   how to do it does not satisfy a "how" question.
4. Definitions, scope, and history may follow the answer, or sit at the end, or be cut. They
   never lead.

**Why this exists:** on 2026-09-22 five per-vertical `…-automation` guides shipped that each
opened with a "Scope and Boundaries" section and walked the stages by automation bucket, and not
one of them said what to connect to what, or named an automation layer. Every gate passed,
because every gate checked the *quality* of the answer and none checked that it answered the
reader's question. This section is that check, and the AUDITOR gate below enforces it.

---

## STYLE

- Use simple, everyday language at a 7th–8th grade reading level.
- Keep sentences easy enough to parse on the first read. One idea per sentence. A clear sentence a person would say aloud can run 20 to 28 words. Do not split a natural sentence just to hit a count. Do not write a 30-word stack.
- Use active voice.
- Write one main idea per sentence. One idea may take 22 words. That is still one idea.
- Keep paragraphs to 3 sentences max.
- **Lists for parallel items, prose for a story.** If you announce three or more items of the same job (steps, checks, tests, criteria), put them in a list. Numbered when sequence or a count matters; bullets when it does not. A one-sentence lead-in ("Check five things.") may stay prose. A closer that is a different job stays a paragraph after the list. Two related sentences, or a story that uses "first … then …", stay prose. Do not write "First, … Second, … Third, …" as body paragraphs when the items are parallel, and do not turn a pair into a list to look structured. If this project's page record has a list field (`bullets` on a section), put the items there. Do not fake a list inside body `content`.
- Add subheadings every 200–300 words.
- Use common words: "help" instead of "facilitate," "use" instead of "utilize," and "show" instead of "demonstrate."
- Avoid jargon unless necessary.
- Use transition words naturally.
- Keep the tone helpful, clear, and professional.

**Vary sentence length on purpose.** Uniform sentence length is the single most reliable signal that text was machine-produced, and it makes a page monotonous to read even when every sentence is correct. Sugarman edits specifically for rhythm; do the same. Working bands: **short (1 to 8 words), medium (9 to 14), long (15 or more)**. A long spoken sentence is often 20 to 28 words. That is allowed. Two concrete rules:
- Any run of 10 consecutive sentences uses at least **two** bands. It does **not** have to include a 1-to-8 word sentence.
- Never write **5 consecutive sentences** whose lengths sit within 3 words of each other.
Short sentences carry emphasis. Spend them on the actual point, when you have one. Do not invent a short sentence to hit the mix. Do not split a natural sentence into a stub and a follow-up. A page of clear 12-to-24 word sentences a person would say is better than a page of 5-word stubs manufactured for the count.

**The opening sentence earns the second one.** The first sentence of the page exists to get the next one read. Keep it short and easy: no multisyllabic throat-clearing, no clause stack. Sugarman's slippery-slide test applies down the whole page. Each sentence should make stopping feel like an interruption.

**Page opener vs section opener.** These are different slots. The **page's** first body sentence is the answer to the page (VOICE). **Section** openers must be self-contained declarative answers, because extractors quote them (AEO in QUALITY). The tee-up is never the page's first sentence. If it belongs, it is the next sentence, operator only.

Worked passages that show this rhythm are in EXAMPLES.

---

## VOICE

Google's February 2026 core update rewards pages a human evidently decided the shape of, and demotes detached, sourceless prose that could have come from anywhere. A page earns trust by showing who is talking and why they would know. This section governs that. `_anti-ai-language.md` outranks it: sounding human never licenses a tell.

### Step 1 — pick the register, before drafting

Not every page should say "we". Choose one and **record it on the row** as `register: operator` or `register: reporter`, the same way MEDIUM records its decision. The audit phase checks the record.

| Register | Use when the page's job is… | Sounds like |
|---|---|---|
| **operator** | helping the reader decide, where our having done this before is the reason to trust the answer — guides, how-to, listicles, roundups, comparisons, reviews, worth-it, audience/vertical pages, anything that recommends or ranks | "we", "our", "what we've seen"; sentence 1 is the answer; a one-sentence tee-up may follow; commits to a recommendation |
| **reporter** | conveying what happened or what a thing is — news and announcement briefs, release notes, model and regulation launches, pricing changes, data and reference tables, glossary and definitional entries, policy summaries | third person, sourced, straight facts; **no "we", no first-person experience claims, no tee-up** |

Wrapping a news item in "in our years of experience" is worse than plain reporting. When genuinely torn, ask what the reader came for: a decision (operator) or a fact (reporter).

**The register is a lens, not a lighter standard.** Everything else in this file applies identically to both — SEO and its required page elements, the DEPTH floors, QUALITY, STYLE, LINKS, COMPARISON, NEUTRALITY, and `_anti-ai-language.md`. A reporter page is held to the same word-count floor, the same sourcing bar, and the same AEO openers as a guide.

Exactly two things differ:
1. **The tee-up** — operator only. If it is used, it is the sentence after the answer, never sentence 1. Reporter pages open on the news itself.
2. **How ANCHOR is attributed** — operator states the page's original insight as first-hand experience; reporter states the same substance as sourced analysis, without claiming we did it. The requirement is identical; only the attribution changes.

**Mixed pages.** A reporter brief may carry ONE clearly-scoped analysis section at the end ("what this changes for teams running X") in operator register, where we genuinely have something to say. The reporting body stays reporter throughout. Never blend the two inside a paragraph.

### Step 2 — the tee-up (operator register only)

Sentence 1 of the first body paragraph is the answer. If a tee-up belongs on this page, it is the next sentence, one sentence: what our relationship to the subject is and why we are the ones telling you. Draw it from ANCHOR / `_experience.md`. Concrete beats grand: name the domain, the work, or the volume, not an adjective.

Do not reverse them. A tee-up that comes first delays the answer. A tee-up that tries to also be the answer becomes a clause stack. Do not pad a second sentence just to have a tee-up.

**Where it goes: the sentence after the answer, in the FIRST BODY PARAGRAPH. Never the header, title, subtitle, hero, or any deck/standfirst slot, and never sentence 1.** Those header slots are metadata the template renders above the article, and a voice line placed there reads as a tagline rather than a person talking. Concretely, in a record with a `subtitle` (or `deck`, `standfirst`, `excerpt`, `summary`) field plus a body array, the first body element's first sentence is the answer, a tee-up (if used) is its second sentence, and the subtitle keeps doing its own job of describing the page.

**Never duplicate it.** Do not repeat the tee-up, verbatim or near-verbatim, in the subtitle or any other header field. Do not restate the subtitle in the intro. A reader who sees the same finding twice in a row, once as a deck and once in the body, is looking at a copy-paste error, not a voice. The intro adds a fact the subtitle did not already say.

**Fit gate.** The tee-up is the default within operator register, not a quota. If it would read as bolted-on for this particular page, skip it, keep the operator voice in the prose, and leave a one-line note `teeup-exempt: [why]`. Sentence 1 is still the answer. A forced tee-up fails the audit exactly like a missing one — the same rule as forced client mentions in ANCHOR and forced tables in COMPARISON.

### Step 3 — operator-register rules

- **Name the business at the FIRST "we" on the page: "At {BUSINESS_NAME}, we…".** The first time a page speaks as the business, the reader must be told who is speaking. A bare "We build and run AI systems inside other people's businesses" dropped into an intro has no antecedent — the reader does not know who "we" is, and an extractor quoting that sentence attributes it to nobody. Applies to the first first-person **company claim** (what the business does, builds, runs, helps with, audits, charges for, or refuses to do). **Once per page only** — every later "we" stays bare, because repeating the brand reads as an ad. Skip it when the brand already appears earlier on the page or lands in the same breath just after. Does **not** apply to the authorial "we" ("we cover", "we compared", "we ranked these on") — there "we" is the guide's authors, not the company. Never in `metaTitle` / `metaDescription`, where the title suffix already carries the brand and the prefix burns characters against the 160-char cap.
  - ✗ "Portable Computer has no price of its own. We build and run AI systems inside other people's businesses…"
  - ✓ "Portable Computer has no price of its own. At {BUSINESS_NAME}, we build and run AI systems inside other people's businesses…"
- First person plural throughout: "we", "our", "we've seen". Never "I" — no page has a named human speaking it. Never a fabricated persona.
- Second person for the reader ("you"), singular, present tense. "You" is the person reading. It is not a claim that they already own, use, or have decided to leave the subject. For ownership, write "if you already use this product…" "Your current system" and "leaving" the product as if they already use it fail `_anti-ai-language.md`.
- Do not default to "a firm that…" or "firms that…". That is encyclopedia voice. Keep "firm" when you name a type of shop.
- Never the detached encyclopedia register. The page is us talking to one reader about a decision they are making.
- Experience claims come from `_experience.md` only. Its required section always licenses general framing for this site's domain; its optional section, where present, licenses concrete named claims. Never invent a number, duration, headcount, client name, or test result that neither section supplies.
- Commit to a recommendation, and say who should not take it. Hedged non-conclusions already fail `_anti-ai-language.md`; here they are also a voice defect.
- Every judgment states its basis: what we ran, what we saw, or what the named source publishes.

### Step 4 — read it back before hand-off

Not a rewrite pass. A voice instruction buried in a long prompt loses to word counts and keyword slots, so before handing the draft to the audit phase, re-read it once for voice alone and answer:

1. Does the row carry all three records: `medium:`, `register:`, and `page type:`? Is the register right for what this page actually does?
1b. Operator — is sentence 1 the answer, is any tee-up the next sentence of the FIRST BODY PARAGRAPH (or `teeup-exempt:`), and does no header field repeat the tee-up?
2. Operator — if there is a tee-up, does it sound like us, or did it get skipped with no exemption note? Reporter — did any "we" leak in?
3. Is every experience claim backed by `_experience.md`, or did one get invented?
4. Operator — does the page commit to a recommendation and name who should not take it?
5. Did any sentence you changed just now introduce an `_anti-ai-language.md` tell?

---

## COMPARISON

**NET ADD — do not remove or shrink any existing section.**

- After the page structure is fully planned, ask: does this topic have a natural "X vs Y," "X vs alternatives," or "which approach/tool is better for [use case]" question a reader would also want answered?
- If yes, add a comparison table (3–5 criteria rows, one column per option, a verdict row) and a brief "when to choose X" paragraph as an EXTRA section on top of the already-planned outline. This is additive only — it must not replace, shorten, or merge with any section that was already planned.
- Applicable on: tool/platform pages, methodology pages, regulatory/compliance option pages, any page where two or more approaches, products, or frameworks are meaningfully in scope. Skip if the page is definitional or reference content with no real comparison axis.
- Do NOT force a comparison where none exists — one well-executed table beats a hollow one.

---

## LINKS

**MANDATORY, NO EXCEPTIONS: the first time you name any company, you link to it.** This is the most frequently broken rule in this file. If a proper noun names an organisation, it gets a link on its first appearance. That includes companies you cite as a source, comparison and aggregator sites, publications, research outfits, and vendors you mention only in passing to dismiss them. Naming a source without linking it is the same defect as not naming it: the reader cannot check your work either way.

**Writers (new content, body/enrich edits, tools).** The FIRST time a page names ANY external company, product, tool, model, benchmark, standard, law/regulation, dataset, study, or cited source a reader might click to act on your advice, that mention MUST link to its OFFICIAL primary source — the vendor's, lab's, or regulator's own page, or the benchmark's own repo. Never an aggregator. Link only the first mention of each entity.

**Exception — projects that auto-link at render time.** If THIS project turns common entities into links automatically via a render-time registry (Phase 0 discovers whether it does, and where), write those names in PLAIN TEXT so the page is not double-linked, and never hand-write a referral URL. **CHECK the registry before writing — never assume a vendor is in it.** If the entity is NOT in the registry, hand-link it inline; if it will recur across many pages, extend the registry instead (preferred) and keep the name plain. If the project has no auto-linker, hand-link everything. When unsure, hand-link — one correct link on first mention is the goal.

**Deep-link the page you are sending the reader to.** The auto-link registry sends a bare entity name to that organisation's HOMEPAGE. That is right for a passing mention and wrong whenever you direct the reader somewhere specific. When the sentence tells them to check a price, read the docs, confirm a limit, or verify a policy, hand-link the exact URL that answers it (the official pricing or docs URL, not the homepage). Markdown links are resolved BEFORE auto-linking and are left untouched, so a hand-written deep link does not double-link. Put the link on the destination words rather than on the bare entity name: the words "pricing page" point at that organisation's official pricing URL.

**Name the subject; never write "the vendor".** On a page about a named product or company, use its name in every sentence that refers to it. Generic stand-ins ("the vendor", "the platform", "this provider") are banned by `_anti-ai-language.md` and fail the audit.

**Auditors.** An unlinked first mention of a company/product NOT covered by the project's auto-link registry is a **HARD FAIL**, not an advisory note. The fix is additive: link the first occurrence, or register the entity. Never rewrite the page.

---

## ANCHOR

Google's February 2026 core update rewarded pages carrying **proprietary substance** — first-hand detail, real cases, a defensible point of view — and demoted pages that carry none. Every page must give the reader something the top-ranking results do not already have.

**Do this FIRST, before drafting.** Load `.claude/commands/_experience.md` and walk it against your topic:
- Its **required** section says who we are to this site's reader and what we have actually done in this domain. This always licenses general framing.
- Its **optional** section, where the repo has authored one, holds concrete, true, citable specifics — named clients, real engagements, systems we operate — plus that repo's own rules about using them.

If anything there has honest topical overlap, weave **ONE** observation into the relevant section. Never a standalone "Case study" sidebar.

**Attribution by register:**
- **operator** — grounded first-person, so a reader (and an extractor) understands this is real first-hand data rather than a hypothetical. Patterns: "In our engagement with [X], we observed…", "When we ran [Y] across the sites we operate, the pattern was…", "From the [X] rollout, the failure mode was [A] — we solved it by [B]."
- **reporter** — the same substance as sourced analysis, third person, with no claim that we did it: "[X]'s own documentation puts the limit at…", "Filings from [regulator] show…", "The failure mode operators report is…".

**Rules, both registers, non-negotiable:** proof not promotion; **max 2 named-client references per page**; the topic must genuinely overlap — **never force-fit**, a shoehorned reference is an audit fail exactly like having none; **never invent** specifics (numbers, percentages, durations, headcounts, dates, quotes) — reference only the real qualitative observation; no inline CTA hanging off a client sentence.

**If nothing in `_experience.md` honestly fits**, anchor the page another way: an original number or benchmark you actually produced, an original artifact, a non-obvious tradeoff, or a defensible POV with reasoning. Only if none of that honestly applies may the page ship without an anchor, and you must leave a one-line note for the auditor: `anchor-exempt: [why nothing honestly fit this topic]`. The default is to include an anchor; the exemption bar is high.

---

## NEUTRALITY

**NEVER assert our own neutrality or lack of financial interest.** Do not write that {BUSINESS_NAME} "does not resell", "takes no referral fee", "takes no commission", "does not partner with", "is vendor-neutral", that a ranking "is independent", or any "note on objectivity". The audit phase hard-fails any page carrying one.

Two reasons. First, it is often **false**: where a project auto-inserts `rel="sponsored"` affiliate links from an entity registry, the very page making the claim may be earning a referral fee. Second, it does not work even when true — a reader credits objectivity that is **shown**, not claimed.

**Never claim the site takes no payment for placement.** Do not write "no paid placement", "no sponsored placement", "we don't take payment to be listed", "rankings are not paid", "picks are chosen on the merits", or that affiliate commissions are the only revenue. The site sells paid placements; any such claim is false.

Demonstrate it instead, using the required page elements in SEO: name who should NOT pick the option you favour, state plainly what would change your verdict, and ground every judgment in what each vendor actually publishes. If a real affiliate relationship exists, the site's affiliate-disclosure mechanism handles it. Body prose never does, and must never claim the relationship does not exist.

---

## EXPERIENCE (only source for first-person claims)

# Experience — who "we" are on this site

<!-- PER-REPO. NOT synced, NEVER overwritten by sync-standards.sh. Loaded by
     _content-standard.md (## VOICE / ## ANCHOR). If ## DOMAIN is empty the run STOPS. -->

## DOMAIN

The Modern Wallet (themodernwallet.com) is a personal-finance site built around free calculators and plain-language money guides, with 400-plus pages spanning auto loans, mortgages, retirement, investing, rentals, and net worth. Our reader is making one concrete decision and wants an accurate number, fast, with no signup. We show the math, name what moves it, and explain the tradeoff.

**General framings this section licenses** (editorial "we", no client roster required):

- "In the guides we publish here..."
- "What we see readers get wrong most often is..."
- "Every guide we write starts from..."
- "When we reviewed this ourselves..."

These license a real editorial observation about work on this site. They never license a fabricated specific.

---

## SPECIFICS

_(No named-client claims. This is a content property; the editorial "we" above is the voice.)_

---
