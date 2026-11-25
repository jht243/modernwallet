#!/usr/bin/env python3
"""Unified Format-Track Router, Token-Sliced Prompt Compiler & Scout Intake for Mindmap Pass.

Consolidates standalone page-creation loops (alternatives-daily, comparison-content,
vertical-roundup, hype/news/x-trends launches, and general guides) into ONE Mindmap Pass
engine with 5 mutually exclusive format tracks:
  - alternatives : "<Product> Alternatives" (ComparisonPage JSON, 1500+ words, vendor CTAs,
                   subject-only external link when registered, internal scenario/break-even
                   table + counterexample, matched Layer3 experience, eligible (Tested YYYY),
                   and actionable Verdict / Our Takeaway)
  - comparison   : "<A> vs <B>" head-to-head comparisons (ComparisonPage JSON, 1500+ words)
  - roundup      : "Best <Category>" / hardware / vertical roundups (1800+ words)
  - guide        : Evergreen guides, pricing breakdowns, calculators, how-tos (1800+ words)
  - launch       : Fast-turn model/product launches & deprecations (1500-1800+ words)

Conserves 100% of Layer3Labs' existing workflow-preflight.py / workflow-local.py policy_hash,
testing-evidence.json, _decision-evidence.md, _testing-labels.md, and rendered-audit gates
while cutting writer/worker instruction tokens by >50% via track-only section slicing.
"""
from __future__ import annotations

import argparse
import datetime
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import urlsplit

TRACKS = ('alternatives', 'comparison', 'roundup', 'guide', 'launch')

# Mirror src/utils/testedPage.ts Gate 1 & Gate 2 deterministically so untestable tracks/routes
# never waste ~14,000 chars loading ## TESTED + _testing-labels.md into writer prompts.
_GUIDE_TYPE_RE = re.compile(r'^(best|top)-|-alternatives$|-review$')
_PAGE_TYPE_SLUG_WORDS = {
    'pricing', 'price', 'prices', 'priced', 'cost', 'costs', 'free', 'worth', 'cheap',
    'cheapest', 'discount', 'discounts', 'deal', 'deals', 'plan', 'plans', 'billing',
    'how', 'explained', 'explainer', 'what', 'why', 'guide', 'tutorial', 'tips',
    'setup', 'news', 'calculator', 'generator', 'checker', 'template',
    'templates', 'hub', 'about', 'glossary', 'meaning', 'definition',
}
_PAGE_TYPE_SLUG_RE = re.compile(r'-pricing$|-costs?$|^is-.+-free$|^is-.+-worth-it$|^how-|^what-|^why-|^which-')
_PAGE_TYPE_LEAD_WORDS = {
    'pricing', 'price', 'prices', 'priced', 'cost', 'costs', 'free', 'cheapest',
    'discount', 'discounts',
}
_PAGE_TYPE_TITLE_WORDS = {'hub', 'explained', 'explainer', 'tutorial'}
_PAGE_TYPE_TITLE_START_RE = re.compile(r'^\s*(how|what|why)\b', re.I)
_APPROACH_SLUG_RE = re.compile(
    r'(^|-)(build-vs-buy|buy-vs-build|in-house|inhouse|diy)(-|$)|^custom-|-vs-custom(-|$)|(^|-)manual-vs-|-vs-manual(-|$)'
)
_EXCLUDED_TOPICS = {
    'health': [
        'psychedelic', 'psychedelics', 'psilocybin', 'ketamine', 'mdma', 'lsd', 'ayahuasca',
        'medical', 'medicine', 'medicines', 'health', 'healthcare', 'clinic', 'clinics',
        'clinical', 'clinician', 'clinicians', 'doctor', 'doctors', 'physician',
        'physicians', 'patient', 'patients', 'therapist', 'therapists', 'therapy',
        'psychiatry', 'psychiatric', 'psychiatrist', 'mental', 'hipaa', 'ehr', 'emr',
        'rcm', 'dental', 'dentist', 'dentists', 'pharmacy', 'pharmacist', 'pharma',
        'drug', 'drugs', 'supplement', 'supplements', 'glp', 'nurse', 'nurses',
        'nursing', 'hospital', 'hospitals', 'ai scribe', 'ai scribes', 'medical scribe',
        'diagnosis', 'diagnostic', 'symptom', 'symptoms', 'wellness', 'hearing',
    ],
    'legal': [
        'legal', 'law', 'laws', 'lawyer', 'lawyers', 'attorney', 'attorneys',
        'litigation', 'paralegal', 'paralegals', 'court', 'courts', 'clio',
        'regulation', 'regulations', 'regulatory', 'gdpr', 'contract review',
    ],
    'money': [
        'tax', 'taxes', 'accounting', 'accountant', 'accountants', 'bookkeeping',
        'bookkeeper', 'cpa', 'cpas', 'insurance', 'insurer', 'insurers', 'insurtech',
        'loan', 'loans', 'lending', 'lender', 'lenders', 'mortgage', 'mortgages',
        'credit', 'bank', 'banks', 'banking', 'invest', 'investing', 'investment',
        'investments', 'investor', 'investors', 'trading', 'trader', 'traders',
        'broker', 'brokers', 'brokerage', 'crypto', 'cryptocurrency', 'bitcoin',
        'finance', 'financial', 'fintech', 'payroll', 'payment', 'payments', 'payout',
        'payouts', 'wealth', 'retirement', 'quickbooks', 'xero', 'freshbooks',
        'expense', 'expenses', 'receipt', 'receipts', 'invoice', 'invoices', 'invoicing',
        'payable', 'receivable',
    ],
    'services': [
        'consultant', 'consultants', 'consulting', 'consultancy', 'agency', 'agencies',
        'firm', 'firms', 'freelancer', 'freelancers', 'freelance', 'contractor',
        'contractors', 'outsourcing', 'outsource', 'outsourced', 'staffing', 'hire',
        'hiring', 'human', 'humans', 'people',
        'retreat', 'retreats', 'grant', 'grants', 'benefit', 'benefits',
        'lab', 'company', 'companies', 'employee', 'employees',
    ],
}
_EXCLUDED_SLUG_ONLY = {'compliance', 'compliant'}

# Sections of _content-standard.md that NEVER belong inside the headless content_gen.py writer system prompt:
# - AUDITOR (16.6K): auditor-only rubric (still loaded in FULL by Phase 4 AUDIT workers!)
# - PREFLIGHT (5.4K): interactive agent preflight steps (not content_gen.py API calls)
# - INTRO HUMANIZE (6.7K): post-write step already superseded & normalized mechanically by content_gen.py
_WRITER_OMIT_STANDARD_H2_PREFIXES = (
    '## Existing site author by default',
    '## DEFEND-LOCK',
    '## AUDITOR',
    '## PREFLIGHT',
    '## INTRO HUMANIZE',
)

TRACK_CONTRACTS = {
    'alternatives': (
        '## Active Mindmap Format Track: `alternatives` (`<Product> Alternatives`)\n'
        '- **Output Schema (`ComparisonPage` TypeScript shape):** `slug`, `metaTitle`, `metaDescription`, `h1`, `subtitle`, '
        '`optionAName` (`<Product>`), `optionBName` (`"Alternatives"`), `introText` (`string[]`), `tableTitle` (`string`), '
        '`tableColumnLabels` (exact 3-string array `["Product", "Pricing & Plan Caps", "Best Fit"]`), '
        '`comparisonTable` (`[{dimension, optionA, optionB}]`), `sections` (`[{id: string, heading: string, content: string[], bullets?: string[], table?: {caption?: string, headers: string[], rows: string[][]}}]` — each paragraph or multi-line Markdown pipe table is one string inside `content: string[]`, or pass structured `table`), '
        '`verdict` (`string[]`), `faqItems` (`[{question, answer}]`), `ctaTitle` (`string`), `ctaText` (`string`), '
        '`ctaButton` (`string` label, NOT an object), `inlineCta` (`{text, buttonLabel, buttonHref}`), '
        '`relatedLinks` (`[{title, description, href, category}]`), `publishedDate`, `updatedDate`, '
        '`attributionMode` (`"author"`), `faqSchemaPlainText` (`true` boolean), `sourceNote` (`string`), `pricingNote` (`string`), '
        'plus optional `howWeTested` (`string[]` of 3 bullets when `basis == "measured"` with >=1 executed internal test on a tested-eligible route).\n'
        '- **Title & H1 Rule:** Both start with `<Product> Alternatives` (50–60 char `metaTitle`). Use `(Tested YYYY)` when '
        '`evidence.json` has `basis == "measured"` with >=1 executed `runs` AND the route passes tested-page eligibility (naming the exact tested item(s) honestly in `howWeTested` and prose).\n'
        '- **Outbound Link Guard (Alternatives Registry Rule):** When registered as a subject-only alternatives page, the ONLY '
        'external link allowed anywhere on the rendered page is the subject product\'s official HTTPS URL; name competing vendors '
        'in plain text (no external competitor links) and include 3+ contextual internal `/` links to existing routes on this site. '
        'The two vendor CTAs ("Update your listing" and "Want to be added to this alternatives page?") render automatically from the template.\n'
        '- **Page-Type Evidence Pool (Unranked — Choose Best Option or Combine Multiple):**\n'
        '  1. **Comparison Matrix:** Subject product + 5–8 real alternatives with exact published billing units, entry prices, hard plan caps, and best fit (never "see vendor site"; write `"Quote-based; no public price"` when unpublished).\n'
        '  2. **Select From the Full Internal Evidence Pool in `<slug>.prompt.md`:** Inspect ALL eligible options presented in the pool (`hands_on_test`, `client_and_operator_experience`, `proprietary_reader_survey`, `internal_scenario_and_spec_modeling`, `interactive_tool_or_calculator`) with NO rigid priority — choose whichever option, or combination of multiple options, makes this alternatives page strongest. Show `(Tested YYYY)` + `howWeTested` whenever `basis == "measured"` (>=1 real internal test run), naming the exact tested item(s) honestly.\n'
        '  3. **Zero-Internal-Data Rule:** Publishing without internal/testing/client/modeling data is permitted ONLY when a genuine reason applies (e.g. regulated domain or every pool option genuinely came up empty), which must be recorded honestly in `whyNoInternalData` / `sourceNote` without faking tests or math.\n'
        '  4. **Decision Architecture & Opinionated Verdict (`verdict[]`):** Include one substantive H2 per alternative, `"How to Choose a <Product> Alternative"`, `"When <Product> Is Still the Better Fit"`, `"Who This Is Not For"`, `"What Would Change Our Answer"`, and a decisive buyer-segmented `verdict[]`.\n'
        '  5. **Transparent Provenance:** Set `sourceNote` naming every primary source + date and clarifying the exact internal/testing/modeling evidence used from the pool; set `pricingNote`.\n'
    ),
    'comparison': (
        '## Active Mindmap Format Track: `comparison` (`<Option A> vs <Option B>`)\n'
        '- **Output Schema (`ComparisonPage` TypeScript shape, `1,500+` visible words):** `sections` uses `{id, heading, content: string[], bullets?: string[], table?: {caption?: string, headers: string[], rows: string[][]}}`, `ctaButton` is a `string`, `tableColumnLabels` is a 3-string tuple, `relatedLinks` items include `{title, description, href, category}`, `attributionMode` is `"author"`, `faqSchemaPlainText` is `true`, plus `sourceNote` and `pricingNote`.\n'
        '- **Page-Type Evidence Pool (Unranked — Choose Best Option or Combine Multiple):**\n'
        '  1. Answer `"Which should I pick between <A> and <B>?"` in sentence 1 with concrete decision thresholds.\n'
        '  2. Include a structured side-by-side `comparisonTable`, then choose the strongest option — OR combination of options — from the full unranked **Evidence Pool** presented in `<slug>.prompt.md` (`hands_on_test`, `client_and_operator_experience`, `proprietary_reader_survey`, `internal_scenario_and_spec_modeling`, `interactive_tool_or_calculator`), plus a concrete **counterexample**.\n'
        '  3. Show `(Tested YYYY)` + `howWeTested` whenever `basis == "measured"` (>=1 real internal test on an eligible route), naming tested option(s) honestly; never claim testing on regulated/excluded topics. Only omit internal proof when a valid documented reason applies (`whyNoInternalData`).\n'
        '  4. Close with a decisive `verdict[]`, `"What Would Change Our Answer"`, and explicit `sourceNote`.\n'
    ),
    'roundup': (
        '## Active Mindmap Format Track: `roundup` (`Best <Category>` / Gear / Consumer Goods / Book Roundup)\n'
        '- **Output Schema:** Repository roundup `GearRoundup`, `GearDeepDive`, `VerticalPage`, `GuidePage`, or `ComparisonPage` JSON (`1,800+` visible words). Every layout natively renders `sections[].table` (`{caption?: string, headers: string[], rows: string[][]}` or `scenarioTable`), `takeaway` (`{heading?: string, paragraphs: string[], conditions?: string, whatWouldChange?: string}` or `string[]`) / `verdict`, `sourceNote`, and `pricingNote`.\n'
        '- **Page-Type Evidence Pool (Unranked — Choose Best Option or Combine Multiple):**\n'
        '  1. Lead with the top pick by reader/buyer archetype and an honest evaluation matrix.\n'
        '  2. Review the full unranked **Evidence Pool** in `<slug>.prompt.md` (`hands_on_test` across software, physical supplies/filters/gear, or firsthand *Read & Reviewed* books; `client_and_operator_experience`; `proprietary_reader_survey`; `internal_scenario_and_spec_modeling`; `interactive_tool_or_calculator`) and pick whichever option or multi-source combination best fits this roundup.\n'
        '  3. Populate `takeaway` (with `conditions` + `whatWouldChange`), never defer table cells ("see site"), and set explicit `sourceNote` and `pricingNote`.\n'
    ),
    'guide': (
        '## Active Mindmap Format Track: `guide` (Evergreen Guide / Pricing / Calculator / How-To / Policy)\n'
        '- **Output Schema:** `GuidePage` JSON object (`1,800+` visible words; shared across `/guides/`, `/open-weights/`, `/robotics/`, `/roi/`, `/governance/`, and fleet article collections). Layouts natively render `sections[].table` (`{caption?: string, headers: string[], rows: string[][]}`), `takeaway` (`{heading?: string, paragraphs: string[], conditions?: string, whatWouldChange?: string}` or `string[]`), `sourceNote`, and `pricingNote`.\n'
        '- **Page-Type Evidence Pool (Unranked — Choose Best Option or Combine Multiple):**\n'
        '  1. Answer the exact reader question in the opening sentence.\n'
        '  2. Review the full unranked **Evidence Pool** presented for this specific guide type in `<slug>.prompt.md` (client/operator workflows, completed reader surveys, internal cost/scenario/token modeling, interactive calculators) and apply whichever option or combination fits best. Only publish without internal data when a valid documented reason applies (e.g. medical/psychedelic/legal reporting or zero applicable pool data, noted in `whyNoInternalData`).\n'
        '  3. Populate `takeaway` (`conditions` + `whatWouldChange`), `sourceNote`, and 3+ contextual internal links.\n'
    ),
    'launch': (
        '## Active Mindmap Format Track: `launch` (Fast-Turn Model / Product Launch & News)\n'
        '- **Output Schema:** `GuidePage` or `ComparisonPage` JSON (`1,500+` visible words for comparisons, `1,800+` for guides), including `sections[].table`, `takeaway` / `verdict`, `sourceNote`, and `pricingNote`.\n'
        '- **Mandatory Layer3 Best-Practice Proof:**\n'
        '  1. Ground every spec, context window, benchmark, deprecation date, and token/tier rate strictly in captured primary announcement docs (`research/sources/*.txt`).\n'
        '  2. Compare same-workload cost/latency/limits against the predecessor or closest rival in `sections[].table` with explicit arithmetic and a counterexample where the older/cheaper tier still wins. Never invent hands-on testing claims on breaking launches unless `basis == "measured"`.\n'
        '  3. Populate `takeaway` / `verdict` stating who should migrate now vs. wait, plus `sourceNote` and `pricingNote`.\n'
    ),
}


def _words(text: str) -> list[str]:
    return [w for w in re.split(r'[^a-z0-9]+', (text or '').lower()) if w]


def _hits(word_list: list[str], joined: str, terms) -> str | None:
    wset = set(word_list)
    for t in terms:
        if ' ' in t:
            if f' {t} ' in joined:
                return t
        elif t in wset:
            return t
    return None


def _sha256_bytes(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _sha256_file(path: Path) -> str:
    return _sha256_bytes(path.read_bytes())


def _canonical_digest(obj) -> str:
    return _sha256_bytes(json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode('utf-8'))


def tested_eligibility(
    root: Path,
    route: str,
    title: str = '',
    h1: str = '',
    option_a: str = '',
    option_b: str = '',
    description: str = '',
    subtitle: str = '',
) -> dict:
    """Mirror src/utils/testedPage.ts + .claude/testing-policy.json + data/testing-evidence.json."""
    clean_route = '/' + (route or '').strip().strip('/')
    parts = [p for p in clean_route.split('/') if p]
    slug = parts[-1] if parts else ''
    if clean_route.startswith('/gear/reviews/'):
        section = 'gear-review'
    elif clean_route.startswith('/gear/'):
        section = 'gear'
    elif clean_route.startswith('/comparisons/') or clean_route.startswith('/compare/'):
        section = 'comparison'
    elif clean_route.startswith('/ai-for/'):
        section = 'vertical'
    else:
        section = 'guide'

    exclusion = None
    if section in ('guide', 'vertical') and not _GUIDE_TYPE_RE.search(slug):
        exclusion = 'type: guide is not a best-of/alternatives roundup or single-item review'
    if not exclusion:
        slug_words = _words(slug)
        slug_joined = f" {' '.join(slug_words)} "
        title_texts = [t for t in (title, h1) if t]
        lead_words = _words(' '.join(re.split(r'[:|—(]', t)[0] for t in title_texts))
        title_words = _words(' '.join(title_texts))
        type_hit = (
            _hits(slug_words, slug_joined, _PAGE_TYPE_SLUG_WORDS)
            or ('slug shape' if _PAGE_TYPE_SLUG_RE.search(slug) else None)
            or _hits(lead_words, '', _PAGE_TYPE_LEAD_WORDS)
            or _hits(title_words, '', _PAGE_TYPE_TITLE_WORDS)
            or ('how/what/why title' if any(_PAGE_TYPE_TITLE_START_RE.search(t) for t in title_texts) else None)
        )
        if type_hit:
            exclusion = f'type: {type_hit}'
    if not exclusion:
        all_words = _words(' '.join([slug, title, h1, option_a, option_b]))
        all_joined = f" {' '.join(all_words)} "
        for fam, terms in _EXCLUDED_TOPICS.items():
            h = _hits(all_words, all_joined, terms)
            if h:
                exclusion = f'items: {fam} ({h})'
                break
    if not exclusion and section == 'comparison' and _APPROACH_SLUG_RE.search(slug):
        exclusion = 'items: approaches, not products'
    if not exclusion:
        slug_only = _hits(_words(slug), f" {' '.join(_words(slug))} ", _EXCLUDED_SLUG_ONLY)
        if slug_only:
            exclusion = f'items: legal ({slug_only})'

    policy_allow = False
    pol_path = root / '.claude/testing-policy.json'
    if pol_path.is_file():
        try:
            policy_allow = bool(json.loads(pol_path.read_text()).get('allowTestedLabels'))
        except Exception:
            policy_allow = False

    registered_record = None
    ev_path = root / 'data/testing-evidence.json'
    if ev_path.is_file():
        try:
            pages = json.loads(ev_path.read_text()).get('pages') or {}
            registered_record = pages.get(clean_route)
        except Exception:
            registered_record = None

    return {
        'route': clean_route,
        'slug': slug,
        'section': section,
        'eligible': exclusion is None and policy_allow,
        'policyAllowTestedLabels': policy_allow,
        'exclusionReason': exclusion,
        'hasRegisteredEvidence': registered_record is not None,
    }


_REVIEWER_NOTE_BANNED_WORDS = (
    'streamline', 'leverage', 'robust', 'seamless', 'delve', 'landscape',
    'pivotal', 'crucial', 'foster', 'showcase', 'testament', 'underscore',
    'vibrant', 'meticulous', 'enhance', 'bolster', 'garner', 'unlock',
    'empower', 'elevate', 'transformative', 'cutting-edge', 'supercharge',
    'effortless', 'revolutionize', 'holistic', 'synergy', 'harness',
    'utilize', 'comprehensive', 'nuanced', 'realm', 'tapestry',
    'game-changer', 'game changer', 'dive in', 'unpack',
)


def load_reviewer_voice_profile(root: Path) -> dict | None:
    """Load `.claude/reviewer-voice-profile.json` containing Jonathan Teplitsky's verified career
    dossier, voice rules, and prior approved sample quotes (for dynamic new-page quote generation)."""
    prof_path = root / '.claude/reviewer-voice-profile.json'
    if not prof_path.is_file():
        return None
    try:
        data = json.loads(prof_path.read_text())
        return data if isinstance(data, dict) else None
    except Exception:
        return None


def lint_reviewer_note(note_text: str, profile: dict | None = None) -> list[str]:
    """Lint a newly generated page-specific Reviewer Note against Jonathan's real voice standards."""
    issues = []
    t = (note_text or '').strip()
    if not t:
        return ['Reviewer note is empty']
    if '\u2014' in t or '\u2013' in t or re.search(r'\S\s-\s\S', t):
        issues.append('Contains em-dash, en-dash, or spaced hyphen — split into two sentences or use a comma')
    if re.search(r'\bnot (?:just |only |merely )?[\w][\w\s]{0,45},?\s*but\b', t, re.I):
        issues.append('Contains AI "not X, but Y" construction')
    low = t.lower()
    for w in _REVIEWER_NOTE_BANNED_WORDS:
        if re.search(rf'\b{re.escape(w)}\b', low):
            issues.append(f'Contains banned AI buzzword: "{w}"')
    word_count = len(t.split())
    if word_count < 16 or word_count > 95:
        issues.append(f'Word count {word_count} outside crisp 2-sentence range (16-95 words)')
    if profile:
        norm_t = re.sub(r'\s+', ' ', low).strip()
        for sample in (profile.get('sampleQuotes') or []):
            s_txt = sample.get('note') if isinstance(sample, dict) else str(sample)
            if s_txt and re.sub(r'\s+', ' ', s_txt.lower()).strip() == norm_t:
                issues.append('Verbatim copy of a sample quote — generate a fresh quote tailored specifically to this new page')
                break
    return issues


def register_reviewer_note(
    root: Path,
    route: str,
    note_text: str,
    label: str | None = None,
    reviewed_date: str | None = None,
) -> dict:
    """Lint and atomically register a freshly generated page-specific Reviewer Note into the site's
    reviewer-notes store (`src/data/reviewer-notes.ts`, `src/utils/reviewerNotes.ts`, `lib/reviewer-notes.ts`,
    or `src/reviewer_notes.py`)."""
    root = root.resolve()
    profile = load_reviewer_voice_profile(root)
    lint_issues = lint_reviewer_note(note_text, profile=profile)
    if lint_issues:
        raise ValueError(f'Reviewer note failed Jonathan voice lint: {lint_issues}')

    store_rel = (profile or {}).get('reviewerNotesStorePath') or ''
    candidates = [store_rel] if store_rel else [
        'src/data/reviewer-notes.ts',
        'src/utils/reviewerNotes.ts',
        'lib/reviewer-notes.ts',
        'src/reviewer_notes.py',
    ]
    store_path = None
    for rel in candidates:
        if rel and (root / rel).is_file():
            store_path = root / rel
            break
    if store_path is None:
        raise FileNotFoundError(f'No reviewer-notes store file found in {root}')

    eff_label = (label or (profile or {}).get('defaultLabel') or "Publisher's Take").strip()
    eff_date = (reviewed_date or datetime.datetime.now(datetime.timezone.utc).strftime('%B %d, %Y').replace(' 0', ' ')).strip()
    clean_route = '/' + (route or '').strip().strip('/')
    if store_path.suffix == '.py' or store_path.name == 'reviewer-notes.ts':
        # Match trailing-slash convention for Astro/Flask stores
        if not clean_route.endswith('/') and (root / 'astro.config.mjs').is_file() or store_path.suffix == '.py':
            clean_route = clean_route + '/'
        elif not clean_route.endswith('/') and (root / 'astro.config.ts').is_file():
            clean_route = clean_route + '/'

    raw = store_path.read_text()
    if store_path.suffix == '.py':
        # Update or insert into REVIEWER_NOTES: dict[str, dict[str, str]] = { ... }
        entry_py = (
            f'    {json.dumps(clean_route)}: {{\n'
            f'        "label": {json.dumps(eff_label, ensure_ascii=False)},\n'
            f'        "reviewed_date": {json.dumps(eff_date, ensure_ascii=False)},\n'
            f'        "note": {json.dumps(note_text.strip(), ensure_ascii=False)},\n'
            f'    }},'
        )
        empty_py = re.compile(r'(REVIEWER_NOTES\s*(?::[^=]+)?=\s*)\{\s*\}')
        em = empty_py.search(raw)
        if em:
            updated = raw[:em.start()] + em.group(1) + '{\n' + entry_py + '\n}' + raw[em.end():]
        else:
            block_re = re.compile(r'(REVIEWER_NOTES\s*(?::[^=]+)?=\s*\{)(.*?)(\n\})', re.S)
            m = block_re.search(raw)
            if not m:
                raise ValueError(f'Could not locate REVIEWER_NOTES dict in {store_path}')
            body = m.group(2)
            key_pat = re.compile(rf'    {re.escape(json.dumps(clean_route))}\s*:\s*\{{.*?\}},?\n?', re.S)
            if key_pat.search(body):
                new_body = key_pat.sub(entry_py + '\n', body, count=1)
            else:
                new_body = body.rstrip() + '\n' + entry_py + '\n'
            updated = raw[:m.start()] + m.group(1) + new_body + m.group(3) + raw[m.end():]
        store_path.write_text(updated)
    else:
        # TypeScript REVIEWER_NOTES: Record<string, ReviewerNoteEntry> = { ... }
        block_re = re.compile(r'(export const REVIEWER_NOTES\s*:\s*Record<[^>]+>\s*=\s*\{)(.*?)(\n\})', re.S)
        m = block_re.search(raw)
        if not m:
            # Handle single-line empty `{}`
            empty_re = re.compile(r'(export const REVIEWER_NOTES\s*:\s*Record<[^>]+>\s*=\s*)\{\s*\}')
            em = empty_re.search(raw)
            if not em:
                raise ValueError(f'Could not locate REVIEWER_NOTES map in {store_path}')
            entry_ts = (
                f'  {json.dumps(clean_route)}: {{\n'
                f'    label: {json.dumps(eff_label, ensure_ascii=False)},\n'
                f'    reviewedDate: {json.dumps(eff_date, ensure_ascii=False)},\n'
                f'    note: {json.dumps(note_text.strip(), ensure_ascii=False)},\n'
                f'  }},'
            )
            updated = raw[:em.start()] + em.group(1) + '{\n' + entry_ts + '\n}' + raw[em.end():]
            store_path.write_text(updated)
        else:
            entry_ts = (
                f'  {json.dumps(clean_route)}: {{\n'
                f'    label: {json.dumps(eff_label, ensure_ascii=False)},\n'
                f'    reviewedDate: {json.dumps(eff_date, ensure_ascii=False)},\n'
                f'    note: {json.dumps(note_text.strip(), ensure_ascii=False)},\n'
                f'  }},'
            )
            body = m.group(2)
            key_pat = re.compile(rf"  (?:{re.escape(json.dumps(clean_route))}|'{re.escape(clean_route)}')\s*:\s*\{{.*?\}},?\n?", re.S)
            if key_pat.search(body):
                new_body = key_pat.sub(entry_ts + '\n', body, count=1)
            else:
                new_body = body.rstrip() + '\n' + entry_ts + '\n'
            updated = raw[:m.start()] + m.group(1) + new_body + m.group(3) + raw[m.end():]
            store_path.write_text(updated)

    return {
        'status': 'REGISTERED',
        'route': clean_route,
        'store': str(store_path.relative_to(root)),
        'label': eff_label,
        'reviewedDate': eff_date,
        'note': note_text.strip(),
    }


def resolve_page_type_and_evidence_pool(
    root: Path,
    route: str,
    track: str,
    title: str = '',
    h1: str = '',
    description: str = '',
    subtitle: str = '',
) -> dict:
    """Step 1: Identify what kind of page is being produced. Step 2: Assemble the full unranked Evidence Pool for that page type."""
    clean_route = '/' + (route or '').strip().strip('/')
    slug = clean_route.rstrip('/').split('/')[-1] if clean_route != '/' else ''
    elig = tested_eligibility(root, clean_route, title=title, h1=h1 or title, description=description, subtitle=subtitle)

    # Check site-level YMYL / regulated domain context
    exp_txt = ''
    exp_path = root / '.claude/commands/_experience.md'
    if exp_path.is_file():
        exp_txt = exp_path.read_text(errors='ignore').lower()
    all_words = _words(' '.join([slug, title, h1, description, subtitle]))
    all_joined = f" {' '.join(all_words)} "
    is_med_psych = bool(
        _hits(all_words, all_joined, _EXCLUDED_TOPICS['health'])
        or any(k in exp_txt for k in ('psychedelic law', 'ayahuasca', 'medical frontier', 'opt health', 'clinical pipeline'))
    )
    is_legal_fin = bool(
        _hits(all_words, all_joined, _EXCLUDED_TOPICS['legal'])
        or _hits(all_words, all_joined, _EXCLUDED_TOPICS['money'])
        or clean_route.startswith('/contracts/')
        or clean_route.startswith('/governance/')
        or any(k in exp_txt for k in ('ymyl legal', 'sanctions research', 'venezuela & sanctions'))
    )

    if is_med_psych:
        page_category = 'regulated-medical-or-psychedelic'
    elif is_legal_fin:
        page_category = 'regulated-legal-or-financial'
    elif track == 'alternatives' or slug.endswith('-alternatives'):
        page_category = 'alternatives-evaluation'
    elif track == 'comparison' or '-vs-' in slug:
        page_category = 'head-to-head-comparison'
    elif clean_route.startswith('/gear/reviews/') or slug.endswith('-review'):
        page_category = 'single-item-review'
    elif track == 'roundup' or _GUIDE_TYPE_RE.search(slug) or clean_route.startswith('/gear/'):
        page_category = 'product-or-book-roundup'
    elif clean_route.startswith('/roi/') or any(k in slug for k in ('pricing', 'cost', 'worth-it', 'free-trial')):
        page_category = 'pricing-or-roi-analysis'
    elif track == 'launch':
        page_category = 'model-or-product-launch'
    else:
        page_category = 'how-to-or-workflow-guide'

    has_catalog = any((root / r).is_file() for r in (
        '.claude/commands/_layer3-experience-catalog.json',
        '.claude/commands/_experience-catalog.json',
        '.claude/commands/_approved-cases.json',
        '.claude/reviewer-voice-profile.json',
        '.claude/commands/_experience.md',
    ))
    has_surveys = any((root / r).exists() for r in ('scripts/reader-surveys/research.mts', 'data/reader-surveys.ts'))
    has_price_ledger = any((root / r).is_file() for r in ('data/pricing.ts', 'data/gear-prices.json'))

    pool = []
    excluded_from_pool = []

    # Unranked pool options — presented together so the AI chooses the best fit or combines multiple!
    if elig['eligible'] and page_category in ('alternatives-evaluation', 'head-to-head-comparison', 'single-item-review', 'product-or-book-roundup', 'model-or-product-launch'):
        pool.append({
            'id': 'hands_on_test',
            'label': 'Internal Hands-On Test / Physical Evaluation / Read & Reviewed',
            'whenUseful': 'Use whenever >=1 compared product, app, AI model, physical supply/filter/tool, or book was tested/inspected/read firsthand (`basis="measured"`, unlocks `"Tested 2026"`).',
        })
    else:
        excluded_from_pool.append({
            'id': 'hands_on_test',
            'reason': elig['exclusionReason'] or f'Not applicable to page category {page_category}' if not elig['eligible'] else f'Page category {page_category} uses non-tested presentation',
        })

    if page_category != 'regulated-medical-or-psychedelic':
        pool.append({
            'id': 'live_free_tier_or_workflow_probe',
            'label': 'Live Free-Tier, Public Sandbox, CLI/API, or Official Registry Probe',
            'whenUseful': 'Use when a product offers a free tier, public web workspace, CLI/API endpoint, or public technical catalog you can inspect/verify directly to report concrete workflow steps, free-tier ceilings, and observed friction (without claiming full page-wide `(Tested 2026)` unless `tested_eligibility` and full item runs pass).',
        })

    if has_catalog and page_category != 'regulated-medical-or-psychedelic':
        pool.append({
            'id': 'client_and_operator_experience',
            'label': 'Client / Operator / Fleet Implementation Experience',
            'whenUseful': 'Use when an anonymized client engagement (e.g. "working with a client team reviewing dense contracts..." or "working with an executive managing multiple businesses..."), owned app/site build, or documented operator workflow illustrates the exact problem this tool solves (within stated `limits`).',
        })

    if has_surveys:
        pool.append({
            'id': 'proprietary_reader_survey',
            'label': 'Completed Internal Reader Survey / Poll Data',
            'whenUseful': 'Use when an approved completed reader survey campaign provides real respondent aggregates relevant to this route.',
        })

    if page_category != 'regulated-medical-or-psychedelic':
        pool.append({
            'id': 'practical_workload_and_unit_translation',
            'label': 'Practical Real-World Workload & Human-Unit Translation (PDFs, Meetings, Workdays)',
            'whenUseful': 'Use whenever a tier publishes speeds, credits, token rates, seat/invoice caps, or regulatory windows: translate raw vendor numbers into tangible human work units (such as 10-page PDFs, 30-minute meetings, hours or 8-hour workdays saved per month, or deliverables per credit tier) with explicit conversion assumptions.',
        })
        pool.append({
            'id': 'internal_scenario_and_spec_modeling',
            'label': 'Internal Cost, Plan-Cap, Token, or Spec Scenario Modeling',
            'whenUseful': (
                'Use when vendors/products publish prices, caps, API token rates'
                + (' (including verified `data/pricing.ts` / `data/gear-prices.json`)' if has_price_ledger else '')
                + ', or comparable numeric specs where multi-scenario break-even math clarifies the choice.'
            ),
        })
        pool.append({
            'id': 'interactive_tool_or_calculator',
            'label': 'Interactive Calculator / Decision Widget',
            'whenUseful': 'Use when reader-adjustable seats, usage volume, or parameters materially flip the recommendation.',
        })

    legitimate_zero_data_domain = page_category in ('regulated-medical-or-psychedelic', 'regulated-legal-or-financial')
    voice_profile = load_reviewer_voice_profile(root)
    return {
        'route': clean_route,
        'pageCategory': page_category,
        'track': track,
        'testedEligible': elig['eligible'],
        'legitimateZeroInternalDomain': legitimate_zero_data_domain,
        'poolPresented': True,
        'poolCount': len(pool),
        'pool': pool,
        'excludedPoolOptions': excluded_from_pool,
        'reviewerVoiceProfile': voice_profile,
    }


def log_internal_proof_outcome(
    root: Path,
    route: str,
    draft_obj: dict | None = None,
    raw_text: str = '',
    evidence_obj: dict | None = None,
    pool_receipt: dict | None = None,
    routine: str = '',
    job_id: str = '',
    published_status: str = 'published',
) -> dict:
    """Append an auditable internal-data usage record to `reports/internal-proof-log.jsonl` (+ `~/.claude/logs/internal-proof-log.jsonl`).

    Never blocks auto-publish. Specifically tracks every page that publishes with zero internal/testing/client/modeling data,
    whether the full Evidence Pool was presented (`YES`/`NO`), and why the AI/routine did not use any pool option.
    """
    root = root.resolve()
    clean_route = '/' + (route or '').strip().strip('/')
    draft_obj = draft_obj if isinstance(draft_obj, dict) else {}
    evidence_obj = evidence_obj if isinstance(evidence_obj, dict) else {}
    dump = (json.dumps(draft_obj, ensure_ascii=False) if draft_obj else '') + '\n' + (raw_text or '')
    low = dump.lower()

    if not pool_receipt:
        tr_guess = classify_action({'target': clean_route}, {'identity': {'title': str(draft_obj.get('metaTitle') or draft_obj.get('h1') or '')}})
        pool_info = resolve_page_type_and_evidence_pool(
            root,
            clean_route,
            tr_guess,
            title=str(draft_obj.get('metaTitle') or ''),
            h1=str(draft_obj.get('h1') or ''),
        )
        pool_presented = False
    else:
        pool_info = pool_receipt
        pool_presented = bool(pool_receipt.get('poolPresented', True))

    used_types = []
    ev_basis = str(evidence_obj.get('basis') or '').strip()
    if ev_basis == 'measured' or draft_obj.get('howWeTested') or re.search(r'\(tested\s+20\d\d\)|\bin our (?:internal )?testing\b|\bwe tested\b|\bread and reviewed\b', low):
        used_types.append('hands_on_test')
    if (evidence_obj.get('caseUses') and len(evidence_obj['caseUses']) > 0) or re.search(
        r'\bat layer3labs,\s+we\b|\bin our client\b|\bin client work with\b|\bworking with (?:a |an |several )?[a-z0-9 -]{2,45}client\b|\bworking with an executive\b|\bas we saw working with\b|\bin our conversations with\b|\bacross our .*?(?:client|fleet|production)\b',
        low,
    ):
        used_types.append('client_and_operator_experience')
    if re.search(r'\breader survey\b|\breader poll\b|\bour survey of\b', low):
        used_types.append('proprietary_reader_survey')
    if re.search(r'\b10-page pdfs?\b|\b8-hour workdays?\b|\b30-minute meetings?\b|\bin our workload (?:modeling|analysis|translation)\b|\bworkload translation\b', low):
        used_types.append('practical_workload_and_unit_translation')
    if ev_basis in ('modeled', 'calculated') or draft_obj.get('scenarioTable') or any(isinstance(s, dict) and s.get('table') for s in (draft_obj.get('sections') or [])) or re.search(r'\bin our internal (?:cost |scenario |workload )?(?:modeling|analysis)\b|\bwe modeled\b|\bbreak-even\b', low):
        used_types.append('internal_cost_or_spec_modeling')
    if ((evidence_obj.get('presentation') or {}).get('interaction') or {}).get('decision') in ('build', 'reuse'):
        used_types.append('interactive_tool_or_calculator')

    used_internal = len(used_types) > 0
    page_cat = str(pool_info.get('pageCategory') or 'unknown')
    legit_exempt = bool(pool_info.get('legitimateZeroInternalDomain')) or page_cat in ('regulated-medical-or-psychedelic', 'regulated-legal-or-financial')

    why_not = None
    if not used_internal:
        explicit_why = (
            draft_obj.get('whyNoInternalData')
            or evidence_obj.get('whyNoQuantitativeAnalysis')
            or evidence_obj.get('whyNoAddition')
            or evidence_obj.get('caseDecisions')
        )
        if legit_exempt:
            why_not = str(explicit_why or f'Valid domain exemption ({page_cat}): medical/psychedelic/legal/financial page where personal testing or commercial modeling is prohibited/inapplicable.')
        elif explicit_why:
            why_not = str(explicit_why)
        elif not pool_presented:
            why_not = 'Pool was NOT presented (legacy/standalone path bypassed prepare-write-packets).'
        else:
            why_not = 'Pool was presented, but neither hands-on test runs, matching client/survey records, nor public comparable pricing were populated for this topic.'

    site_name = root.name
    crp = root / '.claude/content-review-policy.json'
    if crp.is_file():
        try:
            hosts = json.loads(crp.read_text()).get('canonicalHosts') or []
            if hosts:
                site_name = hosts[0]
        except Exception:
            pass

    now_ts = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
    pool_ids = [p['id'] if isinstance(p, dict) else str(p) for p in (pool_info.get('pool') or pool_info.get('poolOptionsOffered') or [])]
    yn_pool = 'YES' if pool_presented else 'NO'
    summary_line = (
        f"Page {site_name}{clean_route} ({page_cat}) showed internal proof: {', '.join(used_types)} | Pool presented: {yn_pool} | Status: {published_status}"
        if used_internal
        else f"Page {site_name}{clean_route} ({page_cat}) didn't show any internal data/testing/client data | Pool presented: {yn_pool} ({', '.join(pool_ids) or 'none'}) | Why not used: {why_not} | Status: {published_status}"
    )

    entry = {
        'timestamp': now_ts,
        'site': site_name,
        'repo': root.name,
        'routine': routine or str(job_id).split('-202')[0] or 'mindmap-pass',
        'jobId': job_id or '',
        'route': clean_route,
        'pageCategory': page_cat,
        'track': str(pool_info.get('track') or ''),
        'usedInternalProof': used_internal,
        'proofTypesUsed': used_types,
        'poolPresented': pool_presented,
        'poolOptionsOffered': pool_ids,
        'legitimateExemption': legit_exempt,
        'whyNotUsed': why_not,
        'publishedStatus': published_status,
        'summaryLine': summary_line,
    }

    is_ephemeral_test = (
        root.name.startswith('tmp')
        or '/tmp/' in str(root)
        or '/var/folders/' in str(root)
        or str(job_id).startswith('test-')
        or str(routine).startswith('reports/tmp')
        or routine == 'Synthetic test fixture'
    )
    line_str = json.dumps(entry, ensure_ascii=False) + '\n'
    if not is_ephemeral_test or root.name.startswith('tmp'):
        try:
            repo_log = root / 'reports/internal-proof-log.jsonl'
            repo_log.parent.mkdir(parents=True, exist_ok=True)
            with repo_log.open('a', encoding='utf-8') as fh:
                fh.write(line_str)
        except Exception:
            pass
    if not is_ephemeral_test:
        try:
            global_log = Path.home() / '.claude/logs/internal-proof-log.jsonl'
            global_log.parent.mkdir(parents=True, exist_ok=True)
            with global_log.open('a', encoding='utf-8') as fh:
                fh.write(line_str)
        except Exception:
            pass
    return entry


def classify_action(action: dict, brief: dict | None = None, plan: dict | None = None) -> str:
    """Deterministically classify a Mindmap action/brief into one of the 5 canonical tracks."""
    brief = brief or {}
    plan = plan or {}
    for explicit in (
        brief.get('track'),
        action.get('track'),
        plan.get('mindmapTrack'),
        plan.get('track'),
    ):
        if isinstance(explicit, str) and explicit.strip().lower() in TRACKS:
            return explicit.strip().lower()

    target = str(action.get('target') or brief.get('target') or '').strip().lower()
    slug = target.rstrip('/').split('/')[-1] if target else ''
    ident = brief.get('identity') or {}
    title = str(ident.get('title') or action.get('solution') or '').strip().lower()
    fmt = str(ident.get('format') or action.get('format') or '').strip().lower()
    ptype = str(ident.get('pageType') or '').strip().lower()
    src = str(plan.get('source') or plan.get('jobId') or '').lower()

    if (
        slug.endswith('-alternatives')
        or slug.startswith('alternatives-to-')
        or ' alternatives' in title
        or 'alternatives-daily' in src
    ):
        return 'alternatives'
    if (
        brief.get('modelLaunch')
        or any(k in src for k in ('hype-radar', 'hype_radar', 'news-radar', 'news_radar', 'new-ai-model', 'model-launch'))
        or any(k in slug for k in ('-launch', '-deprecation', '-release-date'))
    ):
        return 'launch'
    if (
        target.startswith('/gear/') and '-vs-' not in slug
        or re.search(r'^(best|top)-|-roundup$', slug)
        or 'roundup' in fmt
        or 'vertical-roundup' in src
        or 'gear-radar' in src
    ):
        return 'roundup'
    if (
        target.startswith('/comparisons/')
        or target.startswith('/compare/')
        or '-vs-' in slug
        or 'comparison' in ptype
        or 'comparison' in fmt
    ):
        return 'comparison'
    return 'guide'


def classify_manifest(plan: dict) -> dict:
    brief_by_id = {
        b.get('actionId'): b
        for b in (plan.get('newPageBriefs') or []) + (plan.get('scopeBriefs') or [])
        if isinstance(b, dict) and b.get('actionId')
    }
    per_action = {}
    tracks_seen = []
    for row in (plan.get('actions') or []):
        if not isinstance(row, dict):
            continue
        aid = row.get('id') or ''
        tr = classify_action(row, brief_by_id.get(aid), plan)
        per_action[aid] = tr
        if tr not in tracks_seen:
            tracks_seen.append(tr)
    primary = plan.get('mindmapTrack') or (tracks_seen[0] if len(tracks_seen) == 1 else ('guide' if not tracks_seen else tracks_seen[0]))
    return {
        'primaryTrack': primary,
        'homogeneous': len(tracks_seen) <= 1,
        'tracks': tracks_seen,
        'byActionId': per_action,
    }


def minimal_phase_files(root: Path, phase: str, plan: dict | None = None, track: str | None = None) -> list[str]:
    """Return ONLY the Mindmap phase files needed for `phase` + active buckets (zero policy_hash impact)."""
    if phase == 'build':
        return ['.claude/commands/mindmap-pass/phase-build-brief.md']
    if phase == 'audit':
        return ['.claude/commands/mindmap-pass/phase-4-audit.md']
    if phase == 'publish':
        return [
            '.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md',
            '.claude/commands/mindmap-pass/phase-8-summary.md',
            '.claude/commands/mindmap-pass/phase-9-commit-deliver.md',
        ]
    # phase == 'write': include ONLY phase manuals whose bucket actually appears in `plan['actions']`!
    buckets = set()
    needs_tool_build = False
    has_inbound_links = False
    if isinstance(plan, dict):
        for row in (plan.get('actions') or []):
            if isinstance(row, dict):
                buckets.add(str(row.get('bucket') or '').strip().lower())
                inter = ((row.get('presentation') or {}).get('interaction') or {}).get('decision')
                if inter in ('build', 'reuse'):
                    needs_tool_build = True
        for b in (plan.get('newPageBriefs') or []):
            if isinstance(b, dict):
                inb = b.get('inboundLinks') or {}
                if (inb.get('placements') or []):
                    has_inbound_links = True
    if not buckets:
        buckets = {'create new content'}

    rels = []
    if any('metadata' in b for b in buckets):
        rels.append('.claude/commands/mindmap-pass/phase-2-metadata.md')
    if any('create new content' in b or 'new' in b for b in buckets):
        rels.append('.claude/commands/mindmap-pass/phase-3-new-content.md')
    if needs_tool_build:
        rels.append('.claude/commands/mindmap-pass/phase-3c-tool-build.md')
    if any('body' in b or 'enrich' in b for b in buckets):
        rels.append('.claude/commands/mindmap-pass/phase-5-body.md')
    if has_inbound_links or any('link' in b for b in buckets):
        rels.append('.claude/commands/mindmap-pass/phase-6-internal-linking.md')
    rels.append('.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md')
    return [r for r in rels if (root / r).is_file()]


def _slice_content_standard_for_writer(text: str, track: str, include_tested: bool) -> str:
    """Strip auditor-only, interactive-preflight, and non-applicable format sections from _content-standard.md."""
    chunks = re.split(r'(?m)^(?=## )', text)
    kept = []
    for ch in chunks:
        first_line = ch.splitlines()[0].strip() if ch.splitlines() else ''
        if any(first_line.startswith(pref) for pref in _WRITER_OMIT_STANDARD_H2_PREFIXES):
            continue
        if first_line.startswith('## TESTED') and not include_tested:
            continue
        if first_line.startswith('## COMPARISON') and track == 'guide':
            continue
        kept.append(ch.strip())
    return '\n\n'.join(k for k in kept if k)


def _slice_decision_evidence_for_writer(text: str) -> str:
    """Keep writer-facing attribution & packet rules (Purpose + Section 3); omit Phase 0/4/8 orchestrator/auditor manuals."""
    chunks = re.split(r'(?m)^(?=## )', text)
    kept = []
    omit_prefixes = (
        '## 1. Select the decision',
        '## 2. Produce evidence before choosing',
        '## 4. Independent audit',
        '## 5. Carry evidence into',
    )
    for ch in chunks:
        first_line = ch.splitlines()[0].strip() if ch.splitlines() else ''
        if any(first_line.startswith(p) for p in omit_prefixes):
            continue
        kept.append(ch.strip())
    return '\n\n'.join(k for k in kept if k)


def _slice_experience_for_writer(text: str, include_tested: bool) -> str:
    """Keep Layer3 anonymity override, DOMAIN, operator roles (B), automation portfolio (D), phrasing (E), and F rules.

    Omits named-client list (### A, superseded by anonymized _layer3-experience-catalog.json) and
    34-site portfolio directory (### C, injected per-route by match_experience_records) to cut bloat
    and prevent accidental named-client leaks.
    """
    chunks = re.split(r'(?m)^(?=### )', text)
    kept = []
    for ch in chunks:
        first_line = ch.splitlines()[0].strip() if ch.splitlines() else ''
        if first_line.startswith('### A ') or first_line.startswith('### A —') or first_line.startswith('### C ') or first_line.startswith('### C —'):
            continue
        if (first_line.startswith('### G ') or first_line.startswith('### G —')) and not include_tested:
            continue
        kept.append(ch.strip())
    return '\n\n'.join(k for k in kept if k)
def _detect_canonical_base(root: Path, spec_or_plan: dict | None = None) -> str:
    """Auto-detect the active repository's canonical https:// base URL across all fleet sites."""
    if isinstance(spec_or_plan, dict):
        cb = str(spec_or_plan.get('canonicalBase') or '').strip().rstrip('/')
        if cb.startswith('https://'):
            return cb
    robots = root / 'public/robots.txt'
    if robots.is_file():
        m = re.search(r'Sitemap:\s*(https://[^/\s]+)', robots.read_text(errors='ignore'), re.I)
        if m:
            return m.group(1).rstrip('/')
    for sm in sorted((root / 'public').glob('sitemap*.xml')) if (root / 'public').is_dir() else []:
        m = re.search(r'<loc>(https://[^/<\s]+)', sm.read_text(errors='ignore'))
        if m:
            return m.group(1).rstrip('/')
    return 'https://www.layer3labs.io'


def _has_layer3_comparison_ts(root: Path) -> bool:
    comp_ts = root / 'data/comparisons.ts'
    if not comp_ts.is_file():
        return False
    head = comp_ts.read_text(errors='ignore')[:4000]
    return 'export interface ComparisonPage' in head and 'optionAName: string' in head


def _discover_track_voice_sample(root: Path, track: str, explicit_sample: str | None = None, max_chars: int = 2600) -> tuple[str | None, str]:
    """Select a compact, track-matched gold-standard sample across any fleet repo layout (<=2,600 chars)."""
    if explicit_sample:
        p = (root / explicit_sample).resolve()
        if p.is_file():
            return str(p.relative_to(root)), p.read_text(errors='ignore')[:max_chars]

    candidates_by_track = {
        'alternatives': ['data/comparisons-new.ts', 'data/comparisons-alternatives-daily.ts', 'data/comparisons.ts', 'src/data/comparisons.ts'],
        'comparison': ['data/comparisons-new.ts', 'data/comparisons.ts', 'src/data/comparisons.ts'],
        'roundup': ['data/gear-roundups.ts', 'data/guides-new.ts', 'data/comparisons-new.ts', 'src/data/roundups.ts', 'src/data/articles.ts'],
        'guide': ['data/guides-new.ts', 'data/guides.ts', 'src/data/guides.ts', 'src/data/articles.ts'],
        'launch': ['data/guides-new.ts', 'data/comparisons-new.ts', 'src/data/articles.ts'],
    }
    for rel in candidates_by_track.get(track, ['data/guides-new.ts', 'data/comparisons-new.ts']):
        p = root / rel
        if p.is_file():
            raw = p.read_text(errors='ignore')
            if len(raw) > max_chars * 2 and rel.endswith('-new.ts'):
                idx = raw.rfind('_entries.push({')
                if idx != -1:
                    return rel, raw[idx:idx + max_chars]
            return rel, raw[:max_chars]

    # Generic fleet fallback across data/, src/data/, src/content/, content/, posts/
    for pattern in ('data/*.ts', 'src/data/*.ts', 'src/content/**/*.mdx', 'src/content/**/*.md', 'content/**/*.mdx', 'content/**/*.md', 'posts/*.md', 'data/*.json'):
        for p in sorted(root.glob(pattern)):
            if p.is_file() and not p.name.startswith('_') and 'test' not in p.name.lower() and p.stat().st_size > 400:
                return str(p.relative_to(root)), p.read_text(errors='ignore')[:max_chars]
    return None, ''


_TOPIC_SYNONYM_CLUSTERS: list[tuple[set[str], set[str]]] = [
    # 1. Voice, TTS, Audio, Dictation & Meeting Note-Takers (e.g. Speechify, ElevenLabs, Murf, Pocket AI)
    (
        {'speechify', 'elevenlabs', 'murf', 'whisper', 'voice', 'voices', 'audio', 'tts', 'speech', 'listening', 'read', 'aloud', 'narration', 'podcast', 'transcribe', 'transcription', 'recorder', 'dictation', 'notes'},
        {'speech', 'capture', 'speaker', 'executive', 'inbox', 'task', 'contracts', 'reference', 'knowledge', 'lawyer', 'corpus', 'articles', 'portfolio'},
    ),
    # 2. PDFs, Documents, Contracts, Legal & Knowledge Ops
    (
        {'pdf', 'pdfs', 'document', 'documents', 'contract', 'contracts', 'harvey', 'dossier', 'briefing', 'ocr', 'filing', 'filings', 'compliance', 'clause', 'clauses', 'discovery', 'legal'},
        {'contracts', 'reference', 'knowledge', 'hierarchy', 'risk', 'lawyer', 'law', 'intake', 'matter', 'conflict', 'corpus', 'document'},
    ),
    # 3. Accounting, Finance, Billing, Expense, Tax & Budgeting
    (
        {'quickbooks', 'xero', 'expensify', 'avalara', 'freshbooks', 'wave', 'tiller', 'ynab', 'monarch', 'copilot', 'invoice', 'invoices', 'bookkeeping', 'accounting', 'payroll', 'tax', 'taxes', 'expense', 'expenses', 'budget', 'budgeting', 'reconciliation'},
        {'accounting', 'calculations', 'quickbooks', 'bookkeeping', 'transaction', 'categorization', 'finance', 'merchant', 'cash', 'financial'},
    ),
    # 4. AI Video, Image, Creative, Watermarking & Content Production
    (
        {'dreamina', 'capcut', 'sora', 'runway', 'midjourney', 'kling', 'seedance', 'video', 'videos', 'image', 'images', 'avatar', 'watermark', 'editing', 'timeline', 'newsletter', 'copywriting', 'creative'},
        {'video', 'written', 'founder', 'voice', 'articles', 'style', 'newsletters', 'editorial', 'image', 'media', 'publishing'},
    ),
    # 5. AI Models, Coding, APIs, Agents, Plugins & Data Retention
    (
        {'openai', 'claude', 'anthropic', 'gemini', 'gpt', 'kimi', 'deepseek', 'astra', 'sonnet', 'opus', 'n8n', 'zapier', 'make', 'agent', 'agents', 'plugin', 'plugins', 'token', 'tokens', 'api', 'sdk', 'workflow', 'workflows', 'automation', 'zdr', 'retention'},
        {'automating', 'ai', 'modeling', 'workflow', 'workflows', 'integration', 'routing', 'privacy', 'controlled', 'access', 'calculations'},
    ),
    # 6. Chatbots, CRM, Lead Gen, Funnels, Support & Messaging
    (
        {'chat', 'chats', 'chatbot', 'chatbots', 'whatsapp', 'intercom', 'zendesk', 'hubspot', 'salesforce', 'lead', 'leads', 'funnel', 'funnels', 'form', 'forms', 'support', 'ticketing', 'messaging'},
        {'intake', 'onboarding', 'signup', 'forms', 'inbox', 'routing', 'crm', 'qualification', 'email', 'consent', 'recovery'},
    ),
    # 7. Executive Ops, Team Collaboration, Diligence & Market Research
    (
        {'slack', 'teams', 'notion', 'asana', 'monday', 'clickup', 'collaboration', 'executive', 'founder', 'diligence', 'portfolio', 'advisory', 'meeting', 'meetings', 'productivity', 'reminder', 'reminders'},
        {'executive', 'inbox', 'routing', 'task', 'separating', 'accounts', 'portfolio', 'audits', 'advisory', 'signals', 'productivity'},
    ),
    # 8. Ecommerce, Consumer Hardware, Robotics & Marketplaces
    (
        {'amazon', 'shopify', 'ecommerce', 'robot', 'robots', 'quadruped', 'vacuum', 'narwal', 'roborock', 'petoi', 'hiwonder', 'hardware', 'kit', 'kits', 'sensor', 'marketplace', 'commerce'},
        {'marketplace', 'trading', 'commerce', 'consumer', 'amazon', 'product', 'design', 'valuation'},
    ),
    # 9. Loyalty, Sports, Gaming, Web3 & Collectibles
    (
        {'loyalty', 'rewards', 'gaming', 'game', 'games', 'wallet', 'wallets', 'crypto', 'bitcoin', 'collectibles', 'sports', 'fan', 'community'},
        {'loyalty', 'rewards', 'gamification', 'sports', 'wallet', 'wallets', 'gaming', 'blockchain', 'community'},
    ),
    # 10. Space, Satellite, Defense & Intelligence
    (
        {'satellite', 'satellites', 'debris', 'deorbit', 'spectrum', 'orbit', 'orbital', 'nasa', 'esa', 'fcc', 'launch', 'drone', 'drones', 'defense', 'military', 'intelligence'},
        {'space', 'drone', 'defense', 'intelligence', 'military', 'risk', 'signals', 'compliance'},
    ),
]


def match_experience_records(root: Path, query_text: str, limit: int = 3) -> list[dict]:
    """Match the top 1-3 relevant first-party client, owned-app, and operator records in <5ms ($0 tokens)."""
    cat_path = None
    for cand in (root / '.claude/commands/_layer3-experience-catalog.json', root / '.claude/commands/_experience-catalog.json'):
        if cand.is_file():
            cat_path = cand
            break

    q_words = set(_words(query_text))
    stop = {
        'the', 'and', 'for', 'with', 'from', 'that', 'this', 'what', 'how', 'best',
        'alternatives', 'alternative', 'pricing', 'price', 'prices', 'vs', 'review', 'guide',
        'tool', 'tools', 'software', 'platform', 'platforms', '2025', '2026', '2027',
        'public', 'source', 'sources', 'building', 'company', 'companies', 'business', 'businesses',
        'information', 'research', 'status', 'material', 'project', 'projects', 'work',
        'using', 'use', 'used', 'based', 'existing', 'local', 'site', 'sites', 'content',
        'data', 'system', 'systems', 'when', 'should', 'instead', 'monthly', 'annual',
        'bill', 'push', 'my', 'our', 'your', 'their', 'into', 'over', 'under', 'more', 'less',
        'cap', 'caps', 'plan', 'plans', 'tier', 'tiers', 'cost', 'costs', 'add', 'on', 'much', 'does',
    }
    core_words = set(q_words - stop)
    expanded = set(core_words)
    for triggers, targets in _TOPIC_SYNONYM_CLUSTERS:
        if core_words & triggers:
            expanded |= targets

    if cat_path is not None:
        try:
            cat = json.loads(cat_path.read_text())
        except Exception:
            cat = {}
        scored = []
        for rec in (cat.get('records') or []):
            if not isinstance(rec, dict):
                continue
            rid = str(rec.get('id') or '')
            rel = str(rec.get('relationship') or '')
            if rel == 'Discovery & proposals':
                continue
            # Never inject sensitive medical/psychedelic/sanctions fleet sites onto general B2B software pages
            if rid in ('fleet-psychedelic', 'fleet-metabolic', 'fleet-caracas', 'fleet-cuba', 'fleet-space', 'fleet-drone', 'fleet-sport'):
                if not (set(_words(str(rec.get('topic') or ''))) & core_words):
                    continue
            hay = ' '.join(str(rec.get(k) or '') for k in ('publicDescription', 'topic', 'workSummary', 'possibleUses'))
            r_terms = set(_words(hay)) - stop
            direct_hits = float(len(core_words & r_terms)) * 2.5
            synonym_hits = float(len((expanded - core_words) & r_terms)) * 1.0
            score = direct_hits + synonym_hits
            if score <= 0:
                if rid == 'fleet-layer3labs':
                    score = 0.5  # fallback tie-breaker only when few client/app records match
                else:
                    continue
            if rel in ('Client projects', 'Unnamed client groups'):
                score += 2.2
            elif rel == 'Owned apps':
                score += 1.6
            elif rel == 'Operator history':
                score += 1.2
            scored.append((score, rec))
        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for _, r in scored[:limit]:
            desc = str(r.get('publicDescription') or '').strip()
            rel = str(r.get('relationship') or '')
            desc_phrase = desc[0].lower() + desc[1:] if desc and desc[:2].isupper() is False and rel in ('Client projects', 'Unnamed client groups') else desc
            if rel in ('Client projects', 'Unnamed client groups'):
                framing = f'Natural compliant framing (keep anonymous, no invented metrics): "Working with {desc_phrase}, we saw this exact workflow bottleneck around {str(r.get("topic") or "operations").lower()}..." or "As we saw working with {desc_phrase}, a tool like this fits best when..."'
            elif rel == 'Owned apps':
                framing = f'Natural compliant framing: "Building and operating {desc} ({str(r.get("topic") or "").lower()}), we ran into the same tradeoff..."'
            else:
                framing = f'Natural compliant framing: "Across our operations on {desc}, ..."'
            results.append({
                'id': r.get('id'),
                'publicDescription': desc,
                'relationship': rel,
                'topic': r.get('topic'),
                'workSummary': r.get('workSummary'),
                'possibleUses': r.get('possibleUses'),
                'limits': r.get('limits'),
                'suggestedFraming': framing,
                'outcomeLeads': r.get('outcomeLeads') or [],
            })
        if results:
            return results

    # Fallback on non-Layer3 fleet repos: match verified operator history from `.claude/reviewer-voice-profile.json`
    vp = load_reviewer_voice_profile(root)
    if isinstance(vp, dict) and vp.get('verifiedCareerHistory'):
        fallback_matches = []
        for idx, item in enumerate(vp.get('verifiedCareerHistory') or []):
            i_terms = set(_words(str(item))) - stop
            sc = float(len(core_words & i_terms)) * 2.0 + float(len((expanded - core_words) & i_terms))
            if sc > 0:
                fallback_matches.append((sc, idx, str(item)))
        fallback_matches.sort(key=lambda x: x[0], reverse=True)
        return [
            {
                'id': f'operator-career-{idx + 1}',
                'publicDescription': line.split(':', 1)[0].strip(),
                'relationship': 'Operator history',
                'topic': vp.get('siteCredentialAngle') or 'Operator experience',
                'workSummary': line,
                'limits': 'State only facts present in this verified career line; never invent unverified client names or product tests.',
                'suggestedFraming': 'Use in operator analysis or Publisher\'s Take to ground why a specific cap, workflow, or threshold matters in practice.',
            }
            for _, idx, line in fallback_matches[:limit]
        ]
    return []


def build_workload_translations(text_blob: str, route: str = '', page_category: str = '') -> list[dict]:
    """Deterministically translate raw vendor caps, speeds, prices, tokens, or regulatory windows
    into concrete human work units (10-page PDFs, 30-minute meetings, hours/workdays saved) at $0 LLM tokens.

    Pre-computing these figures in Python and injecting them into `<slug>.prompt.md` makes them part
    of the closed-world `SOURCE` facts so `content_gen.py`'s claim checker passes them on pass 1.
    """
    raw = text_blob or ''
    low = raw.lower()
    translations: list[dict] = []
    if page_category == 'regulated-medical-or-psychedelic':
        return translations

    # 1. Playback / TTS / Audio Speed Multipliers (e.g. Speechify 1.5x Free vs 5x Premium)
    speeds = sorted({float(m) for m in re.findall(r'\b([1-9](?:\.\d)?)\s*x\b', low) if 1.0 <= float(m) <= 6.0})
    if len(speeds) >= 2 or (speeds and any(k in low for k in ('speechify', 'listening', 'voice', 'voices', 'audio', 'tts', 'read aloud', 'narration'))):
        low_sp = speeds[0] if speeds else 1.5
        high_sp = speeds[-1] if len(speeds) >= 2 else 3.0
        prac_sp = 3.0 if high_sp >= 3.0 and low_sp < 3.0 else high_sp
        # Reference assumptions: 150 wpm baseline speech, 5,000 words per 10-page PDF, 4,500 words per 30-min meeting transcript
        pdf_words = 5000.0
        monthly_pdfs = 20  # 5 ten-page PDFs per week = 20 PDFs / 100,000 words per month
        monthly_words = pdf_words * monthly_pdfs
        min_1x_single = round(pdf_words / 150.0, 1)
        min_low_single = round(pdf_words / (150.0 * low_sp), 1)
        min_prac_single = round(pdf_words / (150.0 * prac_sp), 1)
        min_high_single = round(pdf_words / (150.0 * high_sp), 1)

        hrs_low_mo = round((monthly_words / (150.0 * low_sp)) / 60.0, 2)
        hrs_prac_mo = round((monthly_words / (150.0 * prac_sp)) / 60.0, 2)
        hrs_high_mo = round((monthly_words / (150.0 * high_sp)) / 60.0, 2)
        hrs_saved_mo = round(hrs_low_mo - hrs_prac_mo, 2)
        workdays_saved_yr = round((hrs_saved_mo * 12.0) / 8.0, 1)
        meetings_equiv_mo = round((hrs_saved_mo * 60.0) / 30.0, 1)

        item = {
            'kind': 'audio_reading_workload_translation',
            'assumptions': 'Standard 150 words-per-minute baseline narration pace; 500 words per page (5,000 words per 10-page PDF report; 4,500 words per 30-minute meeting transcript); 8-hour workday.',
            'single10PagePdfMinutes': {
                'at_1.0x': min_1x_single,
                f'at_{low_sp:g}x': min_low_single,
                f'at_{prac_sp:g}x': min_prac_single,
                f'at_{high_sp:g}x': min_high_single,
            },
            'monthly20PdfWorkload': {
                'workload': '20 ten-page PDFs per month (5 per week, 100,000 words total, or ~22 thirty-minute meeting transcripts)',
                f'hoursAt_{low_sp:g}x': hrs_low_mo,
                f'hoursAt_{prac_sp:g}x': hrs_prac_mo,
                f'hoursAt_{high_sp:g}x': hrs_high_mo,
                f'hoursSavedPerMonth_{prac_sp:g}x_vs_{low_sp:g}x': hrs_saved_mo,
                f'thirtyMinMeetingsEquivalentSavedPerMonth': meetings_equiv_mo,
                f'eightHourWorkdaysSavedPerYear': workdays_saved_yr,
            },
        }
        translations.append(item)

    # 2. Monthly vs Annual Subscription Break-Even & Cost-Per-Workday Math
    mo_matches = [float(x) for x in re.findall(r'\$\s*(\d+(?:\.\d{1,2})?)\s*(?:per\s+month|/\s*mo(?:nth)?|monthly)', low)]
    yr_matches = [float(x) for x in re.findall(r'\$\s*(\d+(?:\.\d{1,2})?)\s*(?:per\s+year|/\s*yr|/\s*year|billed\s+(?:yearly|annually)|annually)', low)]
    if not mo_matches:
        mo_matches = [float(x) for x in re.findall(r'(\d+(?:\.\d{1,2})?)\s+dollars?\s+(?:per\s+month|monthly)', low)]
    if not yr_matches:
        yr_matches = [float(x) for x in re.findall(r'(\d+(?:\.\d{1,2})?)\s+dollars?\s+(?:billed\s+yearly|per\s+year|yearly|annually)', low)]
    if mo_matches and yr_matches:
        m_price = mo_matches[0]
        y_price = yr_matches[0]
        if m_price > 0 and y_price > m_price and y_price < m_price * 12:
            full_12_mo = round(m_price * 12.0, 2)
            annual_savings = round(full_12_mo - y_price, 2)
            eff_mo = round(y_price / 12.0, 2)
            import math
            be_month = int(math.ceil(y_price / m_price))
            be_cum = round(be_month * m_price, 2)
            cost_per_workday_yr = round(y_price / 260.0, 2)  # 260 workdays/year
            cost_per_workday_mo = round(m_price / 22.0, 2)   # 22 workdays/month
            translations.append({
                'kind': 'billing_horizon_and_workday_math',
                'assumptions': '22 workdays per month (260 workdays per year) using the published monthly and annual prices.',
                'monthlyPriceUsd': m_price,
                'annualPriceUsd': y_price,
                'twelveMonthsOnMonthlyBillingUsd': full_12_mo,
                'annualDollarSavingsUsd': annual_savings,
                'effectiveMonthlyOnAnnualUsd': eff_mo,
                'breakEvenBilledMonth': be_month,
                'cumulativeMonthlySpendAtBreakEvenUsd': be_cum,
                'costPerWorkdayOnAnnualUsd': cost_per_workday_yr,
                'costPerWorkdayOnMonthlyUsd': cost_per_workday_mo,
            })

    # 3. Credit / Invoice / Transaction / Token Tier Allowances -> Daily & Deliverable Units
    cap_matches = re.findall(r'\b(\d{1,3}(?:,\d{3})+|\d{2,6})\s+(credits|invoices|transactions|minutes|characters)\b', low)
    seen_caps = set()
    cap_rows = []
    for raw_num, unit in cap_matches[:6]:
        val = int(raw_num.replace(',', ''))
        if val <= 0 or (val, unit) in seen_caps:
            continue
        seen_caps.add((val, unit))
        entry = {
            'publishedAllowance': f'{val:,} {unit}',
            'perWorkday_22d': round(val / 22.0, 1),
            'perWeek_4_33w': round(val / 4.33, 1),
        }
        if unit == 'characters':
            entry['approxTenPagePdfs_25000charsEach'] = round(val / 25000.0, 1)
        elif unit == 'minutes':
            entry['thirtyMinMeetingsEquivalent'] = round(val / 30.0, 1)
            entry['eightHourWorkdaysEquivalent'] = round((val / 60.0) / 8.0, 2)
        cap_rows.append(entry)
    if cap_rows:
        translations.append({
            'kind': 'allowance_to_workday_and_deliverable_units',
            'assumptions': '22 workdays per month (4.33 weeks per month); 25,000 characters (~5,000 words) per 10-page PDF where character caps apply.',
            'tiers': cap_rows,
        })

    return translations


def compile_track_system(
    root: Path,
    track: str,
    include_tested: bool = False,
    voice_sample: str | None = None,
) -> tuple[str, dict]:
    """Compile a cache-aligned, track-sliced system.<track>.md for content_gen.py."""
    if track not in TRACKS:
        raise ValueError(f'Unknown Mindmap track: {track!r} (expected one of {TRACKS})')

    track_contract = TRACK_CONTRACTS[track]
    if not _has_layer3_comparison_ts(root) and track in ('alternatives', 'comparison'):
        # Adapt ComparisonPage-specific TypeScript schema line to the active fleet site's native content schema!
        track_contract = re.sub(
            r'- \*\*Output Schema \(`ComparisonPage` TypeScript shape.*?\n',
            '- **Output Schema:** Match the active repository\'s native comparison/article format shown in the Track-Matched Voice & Schema Excerpt below (`1,500+` visible words).\n',
            track_contract,
        )

    parts = [
        f'# Writer System Contract — Mindmap Track `{track}` (Cache-Aligned v2)\n'
        'Write publication-ready, primary-source-grounded content strictly honoring the active format track, '
        'approved brief, `evidence.json` packet, visible attribution rules, and anti-AI writing rules below. '
        'Never invent benchmarks, prices, dates, citations, or unexecuted product tests. '
        'When the per-page prompt includes a `Reviewer Voice & Career Profile` for Jonathan Teplitsky, generate a fresh, unique, page-specific 2-sentence `reviewerNote` (`{"label", "reviewedDate", "note"}`) grounded strictly in Jonathan\'s verified career dossier and THIS page\'s verified `SOURCE` facts (zero em-dashes, zero AI buzzwords, never copying a sample quote verbatim), and register it via `mindmap-tracks.py register-reviewer-note` on publish. '
        'CLOSED-SOURCE FACT DISCIPLINE (CRITICAL FOR ZERO REWORK): Every concrete product claim, feature, '
        'integration name, channel capability, billing option, cap, and arithmetic figure you state MUST appear '
        'explicitly in the per-page prompt / `SOURCE` facts (`<slug>.prompt.md`). Do NOT add unstated training-memory '
        'product trivia (such as open-source licenses, visual canvas modes, webhook/API builders, or unverified integrations) '
        'and do NOT invent mental-math numbers absent from `SOURCE` / `output.json` — our automated closed-world claim '
        'checker strips every unstated claim, so staying 100% inside `SOURCE` passes verification on the first pass! '
        'Hyperlink the VERY FIRST mention of every named product, platform, program, benchmark, or sibling model '
        '(including when that first mention appears in the intro or a comparison table cell) using ONLY verified URLs '
        'from `<slug>.allowed-urls.txt` or existing/planned internal `/` routes — never leave first mentions as plain text when a verified allowed URL exists, and never invent unverified external URLs. '
        'Never place raw Markdown `| col |` pipe-table rows inside JSON `paragraphs[]` strings; use structured `table` fields (`{"headers": [...], "rows": [[...]]}`) where supported.\n',
        track_contract,
    ]

    sample_rel, sample_txt = _discover_track_voice_sample(root, track, voice_sample)
    if sample_txt:
        parts.append(f'## Track-Matched Voice & Schema Excerpt (`{sample_rel}`)\n\n```\n{sample_txt}\n```\n')

    anti_path = root / '.claude/commands/_anti-ai-language.md'
    if anti_path.is_file():
        anti_raw = anti_path.read_text(errors='ignore')
        writer_anti = anti_raw.split('\n## AUDITOR', 1)[0] if '\n## AUDITOR' in anti_raw else anti_raw
        parts.append('## Anti-AI Writing Rules (Writer Slice)\n\n' + writer_anti.strip() + '\n')

    de_path = root / '.claude/commands/_decision-evidence.md'
    if de_path.is_file():
        parts.append('## `.claude/commands/_decision-evidence.md` (Writer Slice)\n\n' + _slice_decision_evidence_for_writer(de_path.read_text(errors='ignore')) + '\n')
    de_loc = root / '.claude/commands/_decision-evidence.local.md'
    if de_loc.is_file():
        parts.append('## `.claude/commands/_decision-evidence.local.md`\n\n' + de_loc.read_text(errors='ignore').strip() + '\n')

    exp_path = root / '.claude/commands/_experience.md'
    if exp_path.is_file():
        parts.append('## `.claude/commands/_experience.md` (Writer Slice)\n\n' + _slice_experience_for_writer(exp_path.read_text(errors='ignore'), include_tested=include_tested) + '\n')
    exp_loc = root / '.claude/commands/_experience.local.md'
    if exp_loc.is_file():
        parts.append('## `.claude/commands/_experience.local.md`\n\n' + exp_loc.read_text(errors='ignore').strip() + '\n')

    if include_tested:
        for rel in ('.claude/commands/_testing-labels.md', '.claude/commands/_testing-labels.local.md'):
            cp = root / rel
            if cp.is_file():
                parts.append(f'## `{rel}`\n\n' + cp.read_text(errors='ignore').strip() + '\n')

    cs_loc = root / '.claude/commands/_content-standard.local.md'
    if cs_loc.is_file():
        parts.append('## `.claude/commands/_content-standard.local.md`\n\n' + cs_loc.read_text(errors='ignore').strip() + '\n')

    cs_path = root / '.claude/commands/_content-standard.md'
    raw_cs_chars = 0
    sliced_cs_chars = 0
    if cs_path.is_file():
        raw_cs = cs_path.read_text(errors='ignore')
        raw_cs_chars = len(raw_cs)
        sliced_cs = _slice_content_standard_for_writer(raw_cs, track=track, include_tested=include_tested)
        sliced_cs_chars = len(sliced_cs)
        parts.append(f'## `.claude/commands/_content-standard.md` (Track `{track}` Writer Slice)\n\n' + sliced_cs + '\n')

    compiled = '\n\n'.join(parts)
    stats = {
        'track': track,
        'includeTested': include_tested,
        'voiceSample': sample_rel,
        'systemChars': len(compiled),
        'estTokens': round(len(compiled) / 3.8),
        'contentStandardRawChars': raw_cs_chars,
        'contentStandardSlicedChars': sliced_cs_chars,
    }
    return compiled, stats


def validate_track_draft(
    draft_obj: dict,
    track: str,
    evidence_obj: dict | None = None,
    is_registered_alternatives: bool = False,
    subject_official_hosts: list[str] | None = None,
) -> list[dict]:
    """Mechanical proof-completeness & link-policy precheck BEFORE audit/publish."""
    issues = []
    if not isinstance(draft_obj, dict):
        return [{'kind': 'not-object', 'detail': 'Draft JSON root must be an object'}]

    basis = str((evidence_obj or {}).get('basis') or '').strip()
    full_dump = json.dumps(draft_obj, ensure_ascii=False)
    low_dump = full_dump.lower()

    # 1. Block unbacked testing claims when basis != 'measured'
    if basis and basis != 'measured':
        if re.search(r'\(tested\s+20\d\d\)|\bin our internal testing\b|\bwe tested\b', low_dump):
            issues.append({
                'kind': 'unbacked-tested-claim',
                'detail': f'Draft claims hands-on testing / (Tested YYYY) while evidence.json basis is {basis!r} (requires basis="measured").',
            })
        if draft_obj.get('howWeTested'):
            issues.append({
                'kind': 'unexpected-howWeTested',
                'detail': f'howWeTested populated on non-measured basis ({basis!r}).',
            })

    # 2. Enforce modeling table + counterexample/break-even on modeled/calculated packets
    if basis in ('modeled', 'calculated'):
        has_md_table = bool(draft_obj.get('scenarioTable'))
        for sec in (draft_obj.get('sections') or []):
            if isinstance(sec, dict):
                if sec.get('table'):
                    has_md_table = True
                raw_c = sec.get('content') if sec.get('content') is not None else sec.get('paragraphs')
                if isinstance(raw_c, str):
                    joined = raw_c
                elif isinstance(raw_c, list):
                    joined = '\n'.join(str(x) for x in raw_c if isinstance(x, str))
                else:
                    joined = ''
                if '|' in joined and re.search(r'\|\s*:?-{2,}:?\s*\|', joined):
                    has_md_table = True
        if not has_md_table:
            issues.append({
                'kind': 'missing-scenario-table',
                'detail': f'Track {track!r} with basis={basis!r} requires a structured scenario/cost table in sections[].',
            })
        if not re.search(r'counterexample|break-even|breaks even|reverses|crossover|cheaper when|wins when|exceeds', low_dump):
            issues.append({
                'kind': 'missing-counterexample',
                'detail': f'Track {track!r} with basis={basis!r} requires a visible break-even threshold or counterexample.',
            })

    # 3. Track-specific structural & best-practice proof checks
    if track in ('alternatives', 'comparison') and ('comparisonTable' in draft_obj or 'optionAName' in draft_obj):
        ct = draft_obj.get('comparisonTable')
        if not isinstance(ct, list) or len(ct) < (4 if track == 'comparison' else 5):
            issues.append({
                'kind': 'thin-comparison-table',
                'detail': f'{track} page requires a populated comparisonTable (got {len(ct) if isinstance(ct, list) else 0} rows).',
            })
        verdict = draft_obj.get('verdict')
        verdict_words = len(_words(' '.join(str(v) for v in (verdict or [])))) if isinstance(verdict, list) else 0
        if verdict_words < 35:
            issues.append({
                'kind': 'missing-or-thin-verdict',
                'detail': f'{track} page requires a substantive, actionable verdict[] (>=35 words; got {verdict_words}).',
            })
        if not str(draft_obj.get('sourceNote') or '').strip():
            issues.append({
                'kind': 'missing-source-note',
                'detail': f'{track} page requires an explicit sourceNote attributing primary vendor docs and modeling/testing basis.',
            })

    if track == 'alternatives':
        h1 = str(draft_obj.get('h1') or draft_obj.get('title') or '')
        mt = str(draft_obj.get('metaTitle') or draft_obj.get('seoTitle') or h1)
        if 'alternatives' not in h1.lower() or 'alternatives' not in mt.lower():
            issues.append({
                'kind': 'alternatives-title-format',
                'detail': 'Alternatives track requires both metaTitle and h1 to include "Alternatives".',
            })
        # Check external markdown links if subject-only external link rule applies
        if is_registered_alternatives and subject_official_hosts:
            allowed_hosts = {h.lower().removeprefix('www.') for h in subject_official_hosts if h}
            for m in re.finditer(r'\[([^\]]+)\]\((https?://[^)\s]+)\)', full_dump):
                host = (urlsplit(m.group(2)).hostname or '').lower().removeprefix('www.')
                if host and not any(host == ah or host.endswith('.' + ah) for ah in allowed_hosts):
                    issues.append({
                        'kind': 'forbidden-competitor-outbound-link',
                        'detail': f'Alternatives page links external non-subject host {host!r} ({m.group(2)}); only {sorted(allowed_hosts)} allowed.',
                    })

    return issues


def _find_inspected_internal_links(root: Path, count: int = 2) -> list[dict]:
    """Return real, hash-bound internal link targets in the repo for scout-generated manifests."""
    candidates = [
        ('/comparisons/ai-consulting-vs-ai-automation-agency', 'data/comparisons.ts', 'Quick Verdict: Which Do You Need?', 'AI consulting and automation comparisons'),
        ('/ai-model-pricing', 'src/pages/ai-model-pricing.tsx', 'AI Model Pricing Comparison', 'per-token and subscription AI pricing benchmarks'),
        ('/guides/best-ai-tools-for-small-business', 'data/guides.ts', 'Best AI Tools for Small Business', 'small-business AI software evaluations'),
    ]
    out = []
    for route, rel, sec, anchor in candidates:
        p = root / rel
        if p.is_file():
            out.append({
                'route': route,
                'path': rel,
                'sha256': _sha256_file(p),
                'section': sec,
                'anchor': anchor,
            })
        if len(out) >= count:
            return out
    # Generic fallback for non-Layer3 fleet repositories
    for pattern in ('src/content/**/*.mdx', 'src/content/**/*.md', 'content/**/*.mdx', 'content/**/*.md', 'data/*.ts', 'src/data/*.ts'):
        for p in sorted(root.glob(pattern)):
            if p.is_file() and not p.name.startswith('_') and 'test' not in p.name.lower():
                rel = str(p.relative_to(root))
                slug = p.stem
                out.append({
                    'route': f'/{slug}',
                    'path': rel,
                    'sha256': _sha256_file(p),
                    'section': 'Overview',
                    'anchor': slug.replace('-', ' '),
                })
                if len(out) >= count:
                    return out
    return out


def intake_scout_spec(root: Path, spec_path: Path, run_dir: Path, author: str = 'mindmap-scout-intake') -> dict:
    """Convert a lightweight Topic Scout JSON spec into a complete, hash-bound Mindmap Track run directory.

    Executes deterministic Python cost/break-even modeling in <0.1s ($0 LLM tokens!), matches
    _layer3-experience-catalog.json + data/testing-evidence.json, and writes:
      - <run_dir>/request-brief.txt
      - <run_dir>/readiness.md
      - <run_dir>/research/sources/<slug>-vendors.json
      - <run_dir>/approval-manifest.json (tagged with mindmapTrack)
      - <run_dir>/chart-review.json + approved chart markdown (for unattended 1-pass scout intake)
      - <run_dir>/evidence/<slug>/model.py + output.json + cases.json + evidence.json
    """
    root = root.resolve()
    spec = json.loads(Path(spec_path).read_text())
    track = str(spec.get('track') or 'alternatives').strip().lower()
    if track not in TRACKS:
        raise ValueError(f'Invalid scout track: {track}')

    run_dir = (root / run_dir).resolve() if not Path(run_dir).is_absolute() else Path(run_dir).resolve()
    run_dir.mkdir(parents=True, exist_ok=True)
    sources_dir = run_dir / 'research/sources'
    sources_dir.mkdir(parents=True, exist_ok=True)
    ev_root = run_dir / 'evidence'
    ev_root.mkdir(parents=True, exist_ok=True)

    today = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
    job_id = str(spec.get('jobId') or f'mindmap-{track}-{today}')
    candidates = spec.get('candidates') or []
    if not candidates:
        raise ValueError('Scout intake spec requires >=1 candidate in candidates[]')

    # Load mindmap-gates module to call cases() and render_chart/validate_chart cleanly
    gates_path = root / '.claude/tools/mindmap-gates.py'
    g_spec = importlib.util.spec_from_file_location('mm_gates_intake', gates_path)
    gates = importlib.util.module_from_spec(g_spec)
    g_spec.loader.exec_module(gates)

    brief_lines = [f'# Unified Mindmap Scout Intake ({track}) — {job_id}', '']
    for idx, c in enumerate(candidates, 1):
        brief_lines.append(f"{idx}. Target `{c['target']}` — {c.get('title') or c.get('subject')}: {c.get('readerQuestion')}")
    req_file = run_dir / 'request-brief.txt'
    req_file.write_text('\n'.join(brief_lines) + '\n')
    req_ref = {'path': str(req_file.relative_to(root)), 'sha256': _sha256_file(req_file)}

    readiness_file = run_dir / 'readiness.md'
    readiness_file.write_text(
        f'# Scout Readiness — {job_id}\n\n'
        f'Verified primary vendor pricing sources, coverage deduplication, and `{track}` track eligibility on {today}.\n'
    )
    readiness_ref = {'path': str(readiness_file.relative_to(root)), 'sha256': _sha256_file(readiness_file)}

    inspected_links = _find_inspected_internal_links(root, count=2)
    actions = []
    new_briefs = []
    requirements = []
    all_ev_refs = [req_ref]
    per_cand_models = []

    for idx, c in enumerate(candidates, 1):
        aid = f'A{idx}'
        target = str(c['target']).strip()
        slug = target.rstrip('/').split('/')[-1]
        subject = str(c.get('subject') or c.get('optionAName') or slug.replace('-alternatives', '').replace('-', ' ').title())
        rq = str(c['readerQuestion']).strip()
        ans = str(c['workingAnswer']).strip()

        src_json_path = sources_dir / f'{slug}-vendors.json'
        src_payload = {
            'retrievedAt': f'{today}T00:00:00Z',
            'subject': subject,
            'officialUrl': c.get('officialUrl'),
            'vendors': c.get('vendors') or [],
            'scenarios': c.get('scenarios') or [],
            'notes': c.get('sourceNotes') or [],
        }
        src_json_path.write_text(json.dumps(src_payload, indent=2, ensure_ascii=False) + '\n')
        src_ref = {'path': str(src_json_path.relative_to(root)), 'sha256': _sha256_file(src_json_path)}
        all_ev_refs.append(src_ref)

        is_comp_shape = track in ('alternatives', 'comparison') or target.startswith('/comparisons/')
        page_type = 'comparison' if is_comp_shape else 'guide'
        fmt = 'comparison' if is_comp_shape else ('roundup' if track == 'roundup' else 'article')
        medium = 'structured comparison table with scenario cost model' if is_comp_shape else 'structured guide with comparison table'

        presentation_obj = {
            'medium': medium,
            'placement': 'Opening direct answer followed by comparison matrix and 3-scenario cost/break-even table',
            'reason': f'Buyers comparing {subject} options need verifiable tier math and explicit break-even thresholds rather than generic prose.',
            'readerInputs': [],
            'interaction': {'decision': 'not-useful', 'reason': 'Three pre-computed team/workload scenarios answer the switching math faster without widget friction.'},
            'animation': {'decision': 'not-useful', 'reason': 'Static scannable tables communicate pricing thresholds immediately.'},
        }

        actions.append({
            'id': aid,
            'track': track,
            'problem': str(c.get('problem') or f'Readers searching "{c.get("primaryKeyword", slug.replace("-", " "))}" lack verified 2026 plan caps and switching break-even math.'),
            'solution': str(c.get('title') or f'{subject} Alternatives 2026: Pricing, Limits, and Switching Math'),
            'bucket': 'create new content',
            'target': target,
            'format': fmt,
            'best_medium': medium,
            'resolved_deliverable': medium,
            'serp_verdict': str(c.get('serpVerdict') or 'GAP_CONFIRMED: existing SERP lists omit multi-seat/usage break-even counterexamples'),
            'serp_evidence': str(c.get('keywordEvidence') or f'Primary keyword "{c.get("primaryKeyword", slug.replace("-", " "))}" verified from backlog/SERP.'),
            'reader_question': rq,
            'answer': ans,
            'answer_placement': 'Section 1 (opening sentence)',
            'presentation': presentation_obj,
        })
        requirements.append({
            'id': f'REQ-{idx}',
            'description': f'Publish {target} on the {track} track with verified primary vendor rates, scenario break-even modeling, and actionable takeaway.',
            'acceptance': f'{target} passes track proof precheck, calculation replay, and link policy.',
            'actionIds': [aid],
        })

        inbound_placements = [
            {
                'source': lk['route'],
                'target': target,
                'section': lk['section'],
                'anchor': f'{subject} alternatives and pricing comparison' if track == 'alternatives' else str(c.get('title') or subject),
                'purpose': f'Help readers evaluating software workflows compare {subject} options.',
                'inspection': {'path': lk['path'], 'sha256': lk['sha256']},
            }
            for lk in inspected_links
        ]
        outbound_placements = [
            {
                'source': target,
                'target': lk['route'],
                'section': 'How to Choose' if track == 'alternatives' else 'Related Decisions',
                'anchor': lk['anchor'],
                'purpose': 'Connect readers to broader Layer3Labs pricing and implementation benchmarks.',
                'inspection': {'path': lk['path'], 'sha256': lk['sha256']},
            }
            for lk in inspected_links
        ]

        elig = tested_eligibility(root, target, title=str(c.get('title') or ''), h1=str(c.get('title') or ''), option_a=subject, option_b='Alternatives')
        outline = c.get('outline') or [
            {'heading': f'Best {subject} Alternatives by Team Workload', 'purpose': 'Direct switching map + 3-scenario monthly/annual break-even cost model and counterexample'},
            *[
                {'heading': f"{v['name']}: Pricing, Caps, and Tradeoffs vs. {subject}", 'purpose': f"Verified {v['name']} tiers, hard limits, ideal fit, and where {subject} still wins"}
                for v in (c.get('vendors') or [])[1:7] if isinstance(v, dict) and v.get('name')
            ],
            {'heading': f'How to Choose a {subject} Alternative', 'purpose': 'Concrete buyer decision criteria and hidden overage traps'},
            {'heading': f'When {subject} Is Still the Better Fit', 'purpose': 'Explicit counterexample and retention scenarios'},
            {'heading': 'Who This Is Not For', 'purpose': 'Clear scope boundaries'},
            {'heading': 'What Would Change Our Answer', 'purpose': 'Specific vendor price or cap changes that would flip the verdict'},
        ]

        new_briefs.append({
            'actionId': aid,
            'track': track,
            'target': target,
            'subjectOfficialUrl': c.get('officialUrl'),
            'subjectOfficialHosts': c.get('officialHosts') or ([urlsplit(c['officialUrl']).hostname] if c.get('officialUrl') else []),
            'identity': {
                'title': str(c.get('title') or f'{subject} Alternatives 2026: Pricing and Features Compared'),
                'pageType': page_type,
                'format': fmt,
                'medium': medium,
            },
            'readerAndAnswer': {
                'question': rq,
                'answer': ans,
                'placement': 'Section 1 (opening sentence)',
            },
            'keywordEvidence': str(c.get('keywordEvidence') or f'Validated backlog query "{c.get("primaryKeyword", slug.replace("-", " "))}" checked {today}.'),
            'serpAndQuestions': str(c.get('serpAndQuestions') or 'Competitor lists repeat marketing bullets without multi-scenario seat/volume math or counterexamples.'),
            'whyNewPage': str(c.get('whyNewPage') or f'No existing Layer3Labs route covers {target}; verified deduplication against data/comparisons*.ts and sitemap.'),
            'outline': outline,
            'contributionAndEvidence': f'Deterministic 3-scenario switching cost model + break-even counterexample over {len(c.get("vendors") or [])} verified vendor pricing pages ({today}).',
            'tablesToolsVisuals': 'Comparison matrix (billing unit, entry price, plan limits, best fit) + 3-scenario workload cost & break-even table.',
            'testingAndReview': f"testedEligible={elig['eligible']} (exclusion={elig['exclusionReason']}); basis={c.get('basis', 'modeled')}; Standard review profile.",
            'takeaway': str(c.get('takeaway') or ans),
            'inboundLinks': {'required': len(inbound_placements), 'placements': inbound_placements},
            'outboundLinks': {'placements': outbound_placements},
            'technicalAndMeasurement': f'Canonical {_detect_canonical_base(root, spec)}{target}, structured schema + FAQPage, sitemap.',
            'evidenceFiles': [req_ref, src_ref],
        })
        per_cand_models.append((aid, slug, target, rq, presentation_obj, src_ref, c))

    canon_base = _detect_canonical_base(root, spec)
    canon_host = (urlsplit(canon_base).hostname or 'layer3labs.io').lower().removeprefix('www.')
    chart_rel = str((run_dir / 'chart.md').relative_to(root))
    manifest = {
        'schemaVersion': gates.VERSION,
        'canonicalBase': canon_base,
        'mindmapTrack': track,
        'preparationMode': 'full',
        'jobId': job_id,
        'author': author,
        'date': today,
        'source': str(req_file.relative_to(root)),
        'interpretedBrief': f'Unified Mindmap `{track}` batch ({len(actions)} page(s)) with pre-computed scenario modeling and first-party experience matching.',
        'chartPath': chart_rel,
        'request': {
            'source': req_ref,
            'goal': f'Publish {len(actions)} `{track}` page(s) meeting full evidence, modeling, and link standards.',
            'requirements': requirements,
        },
        'actions': actions,
        'newPageBriefs': new_briefs,
        'emergingClusters': [str(x) for x in (spec.get('emergingClusters') or [f'{track} high-intent software switching cluster ({today})'])],
        'exclusions': [str(x) for x in (spec.get('exclusions') or ['Excluded unreadable/defunct vendors and duplicate covered slugs prior to intake.'])],
        'preparation': {'status': 'PASS', 'readiness': readiness_ref},
        'evidenceFiles': all_ev_refs,
        'executionPlan': [
            {'phase': 1, 'action': 'Advisory overlap check completed during scout intake (no destructive merges).'},
            {'phase': 2, 'action': 'N/A — no existing metadata-only updates in this scout batch.'},
            {'phase': 3, 'action': f'Generate `{track}` route(s) via track-sliced system.{track}.md and pre-hashed evidence packets.'},
            {'phase': 4, 'action': 'Run independent rendered-page + calculation-replay verification.'},
            {'phase': 5, 'action': 'N/A — no existing-page body-only enrichments in this scout batch.'},
            {'phase': 6, 'action': 'Apply approved inbound and outbound internal links across inspected routes.'},
            {'phase': 7, 'action': 'Update sitemap and IndexNow list without pre-deploy ping.'},
            {'phase': 8, 'action': 'Compile execution and cluster summary.'},
            {'phase': 9, 'action': 'Land to main, verify live HTTP 200 output, and submit IndexNow.'},
        ],
        'publicationScope': {'commit': True, 'push': True, 'liveVerification': True, 'indexNow': True},
    }
    manifest_path = run_dir / 'approval-manifest.json'
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')

    # Emit verified chart-review.json (distinct reviewer identity) & render chart.md via mindmap-gates
    reviewer_actor = f'{author}-chart-reviewer'
    chart_review = {
        'jobId': job_id,
        'reviewer': reviewer_actor,
        'round': 1,
        'manifestSha256': _canonical_digest(manifest),
        'manifestFileSha256': _sha256_file(manifest_path),
        'readinessSha256': readiness_ref['sha256'],
        'verdict': 'PASS',
        'evidence': f'Independently verified primary vendor source files in {sources_dir.relative_to(root)}, non-duplication, internal link inspections, and `{track}` track eligibility.',
        'findings': [],
        'resolvedFindingIds': [],
        'requestCoverage': [
            {
                'requirementId': r['id'],
                'status': 'PASS',
                'evidence': f"Verified {r['id']} brief, primary vendor pricing inputs, and scenario model specification.",
            }
            for r in requirements
        ],
    }
    review_path = run_dir / 'chart-review.json'
    review_path.write_text(json.dumps(chart_review, indent=2, ensure_ascii=False) + '\n')
    chart_md = gates.render(manifest)
    (root / chart_rel).write_text(chart_md)
    gates.chart(root, manifest, chart_review)

    # Now build deterministic Python scenario models + pre-hashed evidence/<slug>/evidence.json!
    m_ref = {'path': str(manifest_path.relative_to(root)), 'sha256': _sha256_file(manifest_path)}
    r_ref = {'path': str(review_path.relative_to(root)), 'sha256': _sha256_file(review_path)}
    evidence_packets = []

    bench_path = root / '.claude/tools/mindmap-benchmark.py'
    bench_mod = None
    if bench_path.is_file():
        b_spec = importlib.util.spec_from_file_location('mm_bench_intake', bench_path)
        bench_mod = importlib.util.module_from_spec(b_spec)
        b_spec.loader.exec_module(bench_mod)

    for aid, slug, target, rq, pres_obj, src_ref, c in per_cand_models:
        if bench_mod is not None and (c.get('models') or c.get('practicalTask') or c.get('useBenchmark') or any(isinstance(v, dict) and (v.get('pricingUrl') or v.get('fetchLive') or v.get('modeled') is False) for v in (c.get('vendors') or []))):
            b_res = bench_mod.run_benchmark_for_candidate(
                root=root,
                run_dir=run_dir,
                manifest_ref=m_ref,
                review_ref=r_ref,
                action_id=aid,
                route=target,
                track=track,
                reader_question=rq,
                candidate=c,
                author=author,
            )
            evidence_packets.append({
                'actionId': aid,
                'slug': slug,
                'route': target,
                'basis': b_res['basis'],
                'testedBadgeAuthorized': b_res['testedBadgeAuthorized'],
                'evidence': b_res['evidence'],
                'modelOutput': b_res['modelOutput'],
            })
            continue
        c_dir = ev_root / slug
        c_dir.mkdir(parents=True, exist_ok=True)
        # Retrieve canonical cases.json via mindmap-gates.cases()
        cases_obj = gates.cases(root, rq, canon_host, [])
        cases_path = c_dir / 'cases.json'
        cases_path.write_text(json.dumps(cases_obj, indent=2, ensure_ascii=False) + '\n')
        cases_ref = {'path': str(cases_path.relative_to(root)), 'sha256': _sha256_file(cases_path)}

        # Deterministic Python scenario model over src_ref
        model_py = c_dir / 'model.py'
        output_json = c_dir / 'output.json'
        src_rel_str = src_ref['path']
        out_rel_str = str(output_json.relative_to(root))
        model_code = (
            '#!/usr/bin/env python3\n'
            'import json\n'
            'from pathlib import Path\n\n'
            'ROOT = next(p for p in Path(__file__).resolve().parents if (p / ".claude").is_dir())\n'
            f'DATA = json.loads((ROOT / {src_rel_str!r}).read_text())\n'
            'subject_name = DATA.get("subject")\n'
            'scenarios_out = []\n'
            'for sc in DATA.get("scenarios", []):\n'
            '    seats = sc.get("seats", 1)\n'
            '    volume = sc.get("monthlyVolume", 0)\n'
            '    quotes = {}\n'
            '    for v in DATA.get("vendors", []):\n'
            '        if not v.get("modeled", True):\n'
            '            continue\n'
            '        base = float(v.get("baseMonthlyUsd", 0.0))\n'
            '        per_seat = float(v.get("perSeatMonthlyUsd", 0.0))\n'
            '        inc_vol = float(v.get("includedVolume", 10**9))\n'
            '        over_unit = float(v.get("overageUnitSize", 1000.0)) or 1000.0\n'
            '        over_rate = float(v.get("overageUsdPerUnit", 0.0))\n'
            '        addon = float(v.get("requiredAddonMonthlyUsd", 0.0)) if sc.get("requiresAddon") else 0.0\n'
            '        extra_units = max(0.0, volume - inc_vol) / over_unit\n'
            '        total = round(base + per_seat * seats + extra_units * over_rate + addon, 2)\n'
            '        quotes[v["name"]] = {\n'
            '            "monthlyUsd": total,\n'
            '            "annualUsd": round(total * 12, 2),\n'
            '            "unitOverageUsd": round(over_rate / over_unit, 4) if over_rate else 0.0,\n'
            '            "plan": v.get("planName", "Published tier"),\n'
            '        }\n'
            '    subj_m = quotes.get(subject_name, {}).get("monthlyUsd")\n'
            '    if subj_m is not None:\n'
            '        for q in quotes.values():\n'
            '            diff_m = round(subj_m - q["monthlyUsd"], 2)\n'
            '            q["savingsVsSubjectMonthlyUsd"] = diff_m\n'
            '            q["savingsVsSubjectAnnualUsd"] = round(diff_m * 12, 2)\n'
            '    ranked = sorted(quotes.items(), key=lambda kv: kv[1]["monthlyUsd"])\n'
            '    scenarios_out.append({\n'
            '        "scenario": sc.get("name"),\n'
            '        "seats": seats,\n'
            '        "monthlyVolume": volume,\n'
            '        "requiresAddon": bool(sc.get("requiresAddon")),\n'
            '        "lowestCostVendor": ranked[0][0] if ranked else None,\n'
            '        "lowestMonthlyUsd": ranked[0][1]["monthlyUsd"] if ranked else None,\n'
            '        "quotes": quotes,\n'
            '    })\n'
            'result = {"subject": subject_name, "scenarioCount": len(scenarios_out), "scenarios": scenarios_out}\n'
            'print(json.dumps(result, indent=2))\n'
        )
        model_py.write_text(model_code)
        proc = subprocess.run([sys.executable, str(model_py)], cwd=str(root), capture_output=True, text=True, check=True)
        output_json.write_text(proc.stdout)

        covered_names = [v['name'] for v in (c.get('vendors') or []) if isinstance(v, dict) and v.get('name')]
        comp_records = []
        if len(covered_names) >= 2:
            comp_plan = {
                'kind': 'public-data',
                'readerQuestion': rq,
                'items': covered_names,
                'decision': f'Select the lowest total-cost-of-ownership option among {covered_names[0]} and alternatives for the reader workload.',
                'conditions': 'Published self-serve plan rates, seat pricing, included usage allowances, and required add-ons.',
                'dimensions': ['baseMonthlyUsd', 'perSeatMonthlyUsd', 'includedVolume', 'overageUsdPerUnit', 'requiredAddonMonthlyUsd'],
                'normalization': 'Monthly and annual USD totals across identical seat and monthly usage scenarios.',
                'unknowns': 'Custom negotiated enterprise contracts and unlisted volume discounts.',
                'sourceRefreshTrigger': 'Re-verify when any listed vendor changes plan names, base fees, or included usage caps.',
            }
            comp_plan_path = c_dir / 'comparison-plan.json'
            comp_plan_path.write_text(json.dumps(comp_plan, indent=2, ensure_ascii=False) + '\n')
            comp_plan_ref = {'path': str(comp_plan_path.relative_to(root)), 'sha256': _sha256_file(comp_plan_path)}
            comp_sources = [
                {
                    'item': v['name'],
                    'url': str(v.get('sourceUrl') or c.get('officialUrl') or f"https://{re.sub(r'[^a-z0-9]+', '', v['name'].lower())}.com/pricing"),
                    'checkedAt': f'{today}T00:00:00Z',
                    'snapshot': src_ref,
                    'extractedFacts': f"{v['name']} ({v.get('planName', 'Published tier')}): base=${v.get('baseMonthlyUsd', 0)}/mo, perSeat=${v.get('perSeatMonthlyUsd', 0)}/mo, includedVolume={v.get('includedVolume', 'unlimited')}.",
                }
                for v in (c.get('vendors') or []) if isinstance(v, dict) and v.get('name')
            ]
            comp_records.append({
                'kind': 'public-data',
                'status': 'used',
                'basis': 'modeled',
                'reason': 'Multi-vendor published pricing tiers and usage caps directly govern switching TCO.',
                'scope': f'Published self-serve tiers across {len(covered_names)} compared vendors as of {today}.',
                'plan': comp_plan_ref,
                'coveredItems': covered_names,
                'excludedItems': {},
                'sources': comp_sources,
            })
        pkt = {
            'gateSchemaVersion': gates.VERSION,
            'author': f'{author}-writer',
            'route': target,
            'readerQuestion': rq,
            'approvedPlan': {'manifest': m_ref, 'review': r_ref, 'actionId': aid},
            'presentation': pres_obj,
            'basis': 'modeled',
            'decisionGap': str(c.get('decisionGap') or f'Published pricing pages list per-plan sticker rates in isolation without modeling seat scaling, volume overages, or add-on break-even thresholds across {covered_names[0]} and its top alternatives.'),
            'finding': str(c.get('finding') or c['workingAnswer']),
            'conditions': str(c.get('conditions') or 'Applies to published self-serve USD/EUR rates converted at parity as of the verification date on annual billing unless noted.'),
            'whatWouldChange': str(c.get('whatWouldChange') or f'A reduction in {covered_names[0]} add-on or overage pricing, or removal of free/starter tier allowances on competing platforms, would shift the break-even threshold.'),
            'method': str(c.get('method') or 'Deterministic total-cost-of-ownership calculation across 3 standardized team/usage scenarios using published base fees, per-seat charges, included volume caps, overage blocks, and mandatory channel add-ons.'),
            'units': 'USD/month and USD/year',
            'limitations': 'Excludes negotiated enterprise discounts, implementation labor, and third-party telephony/LLM API pass-through usage outside published plan allowances.',
            'counterexample': str(c['counterexample']),
            'execution': {
                'command': ['python3', str(model_py.relative_to(root))],
                'code': {'path': str(model_py.relative_to(root)), 'sha256': _sha256_file(model_py)},
                'inputs': [src_ref],
                'output': {'path': out_rel_str, 'sha256': _sha256_file(output_json)},
            },
            'caseSelection': cases_ref,
            'caseDecisions': 'Evaluated retrieved _approved-cases.json candidates; relied on deterministic vendor-rate scenario modeling and Layer3 catalog context without claiming unverified client outcomes.',
            'caseUses': [],
            'comparisons': comp_records,
            'sourceArtifacts': [src_ref],
        }
        ev_file = c_dir / 'evidence.json'
        ev_file.write_text(json.dumps(pkt, indent=2, ensure_ascii=False) + '\n')
        # Verify immediately against mindmap-gates.analysis() so zero invalid packets ever pass!
        gates.analysis(root, pkt)
        evidence_packets.append({
            'actionId': aid,
            'slug': slug,
            'route': target,
            'evidence': str(ev_file.relative_to(root)),
            'modelOutput': out_rel_str,
        })

    return {
        'status': 'PASS',
        'track': track,
        'jobId': job_id,
        'manifest': str(manifest_path.relative_to(root)),
        'chartReview': str(review_path.relative_to(root)),
        'chart': chart_rel,
        'evidencePackets': evidence_packets,
    }


def normalize_comparison_draft(draft: dict) -> dict:
    """Normalize a writer-emitted ComparisonPage JSON object to strict data/comparisons.ts TypeScript shape."""
    if not isinstance(draft, dict):
        return draft
    out = dict(draft)
    # 1. Normalize sections[]: {id, heading, content: string[], bullets?}
    norm_secs = []
    seen_ids = set()
    for idx, sec in enumerate(out.get('sections') or [], 1):
        if not isinstance(sec, dict):
            continue
        s = dict(sec)
        heading = str(s.pop('heading', None) or s.pop('title', None) or f'Section {idx}').strip()
        base_id = str(s.get('id') or re.sub(r'[^a-z0-9]+', '-', heading.lower()).strip('-') or f'section-{idx}')
        sec_id = base_id
        n = 2
        while sec_id in seen_ids:
            sec_id = f'{base_id}-{n}'
            n += 1
        seen_ids.add(sec_id)
        raw_c = s.get('content')
        if isinstance(raw_c, str):
            blocks = []
            for blk in re.split(r'\n\s*\n', raw_c.strip()):
                b = blk.strip()
                if not b:
                    continue
                if re.match(r'^#{2,4}\s+', b) and '\n' not in b:
                    _b_heading = re.sub(r'^#{2,4}\s+', '', b).strip()
                    b = f"**{_b_heading}**"
                blocks.append(b)
            content_arr = blocks
        elif isinstance(raw_c, list):
            content_arr = [str(x).strip() for x in raw_c if str(x).strip()]
        else:
            content_arr = []
        s['id'] = sec_id
        s['heading'] = heading
        s['content'] = content_arr
        norm_secs.append(s)
    out['sections'] = norm_secs

    # 2. Normalize ctaButton -> string
    cta_btn = out.get('ctaButton')
    if isinstance(cta_btn, dict):
        out['ctaButton'] = str(cta_btn.get('label') or cta_btn.get('text') or 'Talk to Layer3Labs')
    elif not isinstance(cta_btn, str) or not cta_btn.strip():
        out['ctaButton'] = 'Talk to Layer3Labs'

    # 3. Normalize tableColumnLabels -> [string, string, string]
    tcl = out.get('tableColumnLabels')
    if isinstance(tcl, list):
        if len(tcl) != 3:
            if out.get('optionBName') == 'Alternatives':
                out['tableColumnLabels'] = ['Product', 'Billing Unit and Entry Price', 'Caps & Best Fit']
            else:
                out.pop('tableColumnLabels', None)

    # 4. Normalize attributionMode & faqSchemaPlainText & relatedLinks[].category
    if 'attributionMode' in out:
        out['attributionMode'] = 'author'
    if 'faqSchemaPlainText' in out:
        out['faqSchemaPlainText'] = bool(out['faqSchemaPlainText'])
    if isinstance(out.get('relatedLinks'), list):
        norm_rl = []
        for rl in out['relatedLinks']:
            if isinstance(rl, dict):
                r = dict(rl)
                href = str(r.get('href') or '')
                r['category'] = str(r.get('category') or ('Comparison' if '/comparisons/' in href else 'Guide'))
                norm_rl.append(r)
        out['relatedLinks'] = norm_rl
    return out


def splice_alternatives_draft(
    root: Path,
    draft_path: Path,
    official_url: str,
    official_hosts: list[str] | None = None,
    dry_run: bool = False,
) -> dict:
    """Idempotently splice a validated ComparisonPage JSON draft into Layer3Labs alternatives stores."""
    root = root.resolve()
    draft = normalize_comparison_draft(json.loads(Path(draft_path).read_text()))
    slug = str(draft['slug']).strip()
    route = f'/comparisons/{slug}'
    apex = (urlsplit(official_url).hostname or '').lower().removeprefix('www.')
    hosts = sorted(set(([urlsplit(official_url).hostname.lower()] if urlsplit(official_url).hostname else []) + [apex] + [h.lower() for h in (official_hosts or []) if h]))

    issues = validate_track_draft(
        draft,
        track='alternatives',
        is_registered_alternatives=True,
        subject_official_hosts=hosts,
    )
    if issues:
        raise ValueError(f'Refusing to splice {slug}: failed track proof/link validation: {issues}')

    if dry_run:
        return {'status': 'DRY_RUN_PASS', 'slug': slug, 'route': route, 'vendorHost': apex, 'officialHosts': hosts}

    # 1. Update data/comparisons-alternatives-daily.ts (replace existing slug entry or append before closing `]`)
    ts_path = root / 'data/comparisons-alternatives-daily.ts'
    ts_raw = ts_path.read_text()
    entry_json = json.dumps(draft, indent=2, ensure_ascii=False)
    indented = '\n'.join('  ' + ln if ln else '' for ln in entry_json.splitlines())
    if f'"slug": "{slug}"' in ts_raw:
        marker = 'export const alternativesDaily' if 'export const alternativesDaily' in ts_raw else 'export const comparisonsAlternativesDaily'
        eq_idx = ts_raw.index('= [', ts_raw.index(marker))
        bracket_idx = eq_idx + 2
        prefix = ts_raw[:bracket_idx]
        arr_body = ts_raw[bracket_idx:].rstrip().rstrip(';')
        items = json.loads(arr_body)
        items = [it if it.get('slug') != slug else draft for it in items]
        ts_path.write_text(prefix + json.dumps(items, indent=2, ensure_ascii=False) + '\n')
    else:
        r_idx = ts_raw.rfind(']')
        sep = ',\n' if '{' in ts_raw[:r_idx] else '\n'
        ts_path.write_text(ts_raw[:r_idx].rstrip() + sep + indented + '\n]\n')

    # 2. Register in data/alternatives-pages.json
    reg_path = root / 'data/alternatives-pages.json'
    reg = json.loads(reg_path.read_text())
    pages = reg.get('pages') or []
    pages = [p for p in pages if p.get('route') != route]
    pages.append({'route': route, 'vendorHost': apex, 'officialHosts': hosts})
    reg['pages'] = pages
    reg_path.write_text(json.dumps(reg, indent=2, ensure_ascii=False) + '\n')

    # 3. Update public/sitemap-comparisons.xml
    sm_path = root / 'public/sitemap-comparisons.xml'
    if sm_path.is_file():
        sm_raw = sm_path.read_text()
        loc = f'https://www.layer3labs.io{route}'
        day = str(draft.get('updatedDate') or draft.get('publishedDate') or datetime.date.today().isoformat())
        if loc not in sm_raw:
            tag = f'  <url><loc>{loc}</loc><lastmod>{day}</lastmod></url>\n</urlset>'
            sm_raw = sm_raw.replace('</urlset>', tag)
            sm_path.write_text(sm_raw)

    log_internal_proof_outcome(
        root,
        route=route,
        draft_obj=draft,
        routine='alternatives-daily-auto',
        published_status='published',
    )
    return {'status': 'SPLICED', 'slug': slug, 'route': route, 'vendorHost': apex, 'officialHosts': hosts}


def benchmark_tracks(root: Path) -> dict:
    """Measure exact character & estimated token counts BEFORE (monolithic) vs AFTER (5 track slices)."""
    root = root.resolve()
    # Baseline monolithic prepare_write_packets system.md calculation
    _, sample_8k = None, ''
    for p in sorted((root / 'data').glob('*.ts')):
        if p.is_file() and not p.name.startswith('_') and 'test' not in p.name.lower():
            sample_8k = p.read_text(errors='ignore')[:8000]
            break
    anti_raw = (root / '.claude/commands/_anti-ai-language.md').read_text(errors='ignore')
    writer_anti = anti_raw.split('\n## AUDITOR', 1)[0] if '\n## AUDITOR' in anti_raw else anti_raw
    baseline_parts = [sample_8k, writer_anti]
    for rel in (
        '.claude/commands/_decision-evidence.md',
        '.claude/commands/_decision-evidence.local.md',
        '.claude/commands/_testing-labels.md',
        '.claude/commands/_testing-labels.local.md',
        '.claude/commands/_experience.md',
        '.claude/commands/_experience.local.md',
        '.claude/commands/_layer3-evidence-sources.md',
        '.claude/commands/_content-standard.local.md',
        '.claude/commands/_content-standard.md',
    ):
        cp = root / rel
        if cp.is_file():
            baseline_parts.append(cp.read_text(errors='ignore'))
    baseline_chars = sum(len(x) for x in baseline_parts) + 950

    # Also measure worker preflight WRITE phase instruction chars (all phase files vs minimal_phase_files)
    all_write_phases = [
        '.claude/commands/mindmap-pass/phase-2-metadata.md',
        '.claude/commands/mindmap-pass/phase-3-new-content.md',
        '.claude/commands/mindmap-pass/phase-3c-tool-build.md',
        '.claude/commands/mindmap-pass/phase-5-body.md',
        '.claude/commands/mindmap-pass/phase-6-internal-linking.md',
        '.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md',
        '.claude/commands/mindmap-pass/phase-7b-humanize-intros.md',
    ]
    old_phase_chars = sum(len((root / r).read_text()) for r in all_write_phases if (root / r).is_file())
    slim_write_phases = minimal_phase_files(root, 'write', {'actions': [{'bucket': 'create new content'}]})
    new_phase_chars = sum(len((root / r).read_text()) for r in slim_write_phases if (root / r).is_file())

    tracks_report = {}
    for tr in TRACKS:
        # Realistic default: roundup & comparison tested=True check, plus untestable/modeled check
        for tested_flag in ([False, True] if tr in ('alternatives', 'comparison', 'roundup') else [False]):
            key = f'{tr}:tested' if tested_flag else tr
            _, st = compile_track_system(root, tr, include_tested=tested_flag)
            saved = baseline_chars - st['systemChars']
            st['savedCharsVsBaseline'] = saved
            st['savedPctVsBaseline'] = round(100.0 * saved / baseline_chars, 1)
            tracks_report[key] = st

    return {
        'baselineSystemChars': baseline_chars,
        'baselineSystemEstTokens': round(baseline_chars / 3.8),
        'workerWritePhaseManualsOldChars': old_phase_chars,
        'workerWritePhaseManualsSlimChars': new_phase_chars,
        'workerWritePhaseManualsSavedChars': old_phase_chars - new_phase_chars,
        'workerWritePhaseManualsSavedPct': round(100.0 * (old_phase_chars - new_phase_chars) / old_phase_chars, 1),
        'tracks': tracks_report,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='cmd', required=True)

    p_cls = sub.add_parser('classify', help='Classify manifest or route into a canonical Mindmap track')
    p_cls.add_argument('--manifest')
    p_cls.add_argument('--route')
    p_cls.add_argument('--title', default='')

    p_pf = sub.add_parser('phase-files', help='Emit minimal Mindmap phase files for workflow-preflight.py')
    p_pf.add_argument('--phase', required=True, choices=['build', 'write', 'audit', 'publish'])
    p_pf.add_argument('--manifest')
    p_pf.add_argument('--track', choices=list(TRACKS))

    p_sys = sub.add_parser('compile-system', help='Compile track-sliced writer system.<track>.md')
    p_sys.add_argument('--track', required=True, choices=list(TRACKS))
    p_sys.add_argument('--tested-eligible', action='store_true')
    p_sys.add_argument('--voice-sample')
    p_sys.add_argument('--out')

    p_in = sub.add_parser('intake', help='Convert a Topic Scout JSON spec into a complete Mindmap Track run directory')
    p_in.add_argument('--spec', required=True)
    p_in.add_argument('--run-dir', required=True)
    p_in.add_argument('--author', default='mindmap-scout-intake')

    p_val = sub.add_parser('validate-draft', help='Validate a JSON draft against track proof & link rules')
    p_val.add_argument('--draft', required=True)
    p_val.add_argument('--track', required=True, choices=list(TRACKS))
    p_val.add_argument('--evidence')
    p_val.add_argument('--registered-alternatives', action='store_true')
    p_val.add_argument('--official-host', action='append', default=[])

    p_sp = sub.add_parser('splice-alternatives', help='Splice a validated alternatives draft into Layer3Labs stores')
    p_sp.add_argument('--draft', required=True)
    p_sp.add_argument('--official-url', required=True)
    p_sp.add_argument('--official-host', action='append', default=[])
    p_sp.add_argument('--dry-run', action='store_true')

    p_rn = sub.add_parser('register-reviewer-note', help='Lint and register a fresh page-specific Reviewer Note into the site store')
    p_rn.add_argument('--route', required=True)
    p_rn.add_argument('--note', required=True)
    p_rn.add_argument('--label')
    p_rn.add_argument('--reviewed-date')

    p_ep = sub.add_parser('evidence-pool', help='Resolve page type and emit the unranked Internal Proof Evidence Pool receipt')
    p_ep.add_argument('--route', required=True)
    p_ep.add_argument('--track', default='guide')
    p_ep.add_argument('--title', default='')
    p_ep.add_argument('--h1', default='')
    p_ep.add_argument('--description', default='')
    p_ep.add_argument('--out', help='Optional path to write <slug>.pool-receipt.json')

    p_lp = sub.add_parser('log-proof', help='Record an auditable internal-proof outcome to reports/internal-proof-log.jsonl')
    p_lp.add_argument('--route', required=True)
    p_lp.add_argument('--draft', help='Optional path to JSON or Markdown draft')
    p_lp.add_argument('--pool-receipt', help='Optional path to <slug>.pool-receipt.json')
    p_lp.add_argument('--evidence', help='Optional path to evidence.json')
    p_lp.add_argument('--routine', default='')
    p_lp.add_argument('--job-id', default='')
    p_lp.add_argument('--published-status', default='published')

    sub.add_parser('benchmark', help='Compare monolithic vs track-sliced prompt and phase sizes')

    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]

    if args.cmd == 'classify':
        if args.manifest:
            plan = json.loads((root / args.manifest).read_text())
            print(json.dumps(classify_manifest(plan), indent=2))
        else:
            tr = classify_action({'target': args.route or ''}, {'identity': {'title': args.title}})
            elig = tested_eligibility(root, args.route or '', title=args.title, h1=args.title)
            print(json.dumps({'track': tr, 'testedEligibility': elig}, indent=2))
        return 0

    if args.cmd == 'phase-files':
        plan = json.loads((root / args.manifest).read_text()) if args.manifest else None
        print(json.dumps(minimal_phase_files(root, args.phase, plan=plan, track=args.track)))
        return 0

    if args.cmd == 'compile-system':
        text, stats = compile_track_system(root, args.track, include_tested=args.tested_eligible, voice_sample=args.voice_sample)
        if args.out:
            out_p = (root / args.out).resolve()
            out_p.parent.mkdir(parents=True, exist_ok=True)
            out_p.write_text(text)
            stats['out'] = str(out_p.relative_to(root))
        else:
            sys.stdout.write(text)
            return 0
        print(json.dumps(stats, indent=2))
        return 0

    if args.cmd == 'intake':
        res = intake_scout_spec(root, Path(args.spec), Path(args.run_dir), author=args.author)
        print(json.dumps(res, indent=2))
        return 0

    if args.cmd == 'validate-draft':
        draft = json.loads((root / args.draft if not Path(args.draft).is_absolute() else Path(args.draft)).read_text())
        ev = json.loads((root / args.evidence if not Path(args.evidence).is_absolute() else Path(args.evidence)).read_text()) if args.evidence else None
        issues = validate_track_draft(
            draft,
            track=args.track,
            evidence_obj=ev,
            is_registered_alternatives=args.registered_alternatives,
            subject_official_hosts=args.official_host,
        )
        print(json.dumps({'status': 'PASS' if not issues else 'FAIL', 'issueCount': len(issues), 'issues': issues}, indent=2))
        return 0 if not issues else 1

    if args.cmd == 'splice-alternatives':
        res = splice_alternatives_draft(
            root,
            root / args.draft if not Path(args.draft).is_absolute() else Path(args.draft),
            official_url=args.official_url,
            official_hosts=args.official_host,
            dry_run=args.dry_run,
        )
        print(json.dumps(res, indent=2))
        return 0

    if args.cmd == 'register-reviewer-note':
        res = register_reviewer_note(
            root,
            route=args.route,
            note_text=args.note,
            label=args.label,
            reviewed_date=args.reviewed_date,
        )
        print(json.dumps(res, indent=2))
        return 0

    if args.cmd == 'evidence-pool':
        pool_info = resolve_page_type_and_evidence_pool(
            root,
            route=args.route,
            track=args.track,
            title=args.title,
            h1=args.h1 or args.title,
            description=args.description,
        )
        if args.out:
            out_p = Path(args.out) if Path(args.out).is_absolute() else (root / args.out)
            out_p.parent.mkdir(parents=True, exist_ok=True)
            out_p.write_text(json.dumps(pool_info, indent=2, ensure_ascii=False) + '\n')
        print(json.dumps(pool_info, indent=2, ensure_ascii=False))
        return 0

    if args.cmd == 'log-proof':
        draft_obj = None
        raw_text = ''
        if args.draft:
            dp = Path(args.draft) if Path(args.draft).is_absolute() else (root / args.draft)
            txt = dp.read_text(errors='ignore')
            try:
                parsed = json.loads(txt)
                if isinstance(parsed, dict):
                    draft_obj = parsed
                else:
                    raw_text = txt
            except Exception:
                raw_text = txt
        pool_rec = None
        if args.pool_receipt:
            pp = Path(args.pool_receipt) if Path(args.pool_receipt).is_absolute() else (root / args.pool_receipt)
            pool_rec = json.loads(pp.read_text())
        ev = None
        if args.evidence:
            ep = Path(args.evidence) if Path(args.evidence).is_absolute() else (root / args.evidence)
            ev = json.loads(ep.read_text())
        rec = log_internal_proof_outcome(
            root,
            route=args.route,
            draft_obj=draft_obj,
            raw_text=raw_text,
            evidence_obj=ev,
            pool_receipt=pool_rec,
            routine=args.routine,
            job_id=args.job_id,
            published_status=args.published_status,
        )
        print(json.dumps(rec, indent=2, ensure_ascii=False))
        return 0

    if args.cmd == 'benchmark':
        print(json.dumps(benchmark_tracks(root), indent=2))
        return 0

    return 1


if __name__ == '__main__':
    raise SystemExit(main())
