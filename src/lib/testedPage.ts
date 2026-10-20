// "Tested" templates — which pages carry the "Tested and reviewed by" byline,
// the "(Tested YYYY)" title, and pros/cons Review markup. Mirrors layer3
// src/utils/testedPage.ts.
//
// Owner rule (2026-10-20): "I test every product and model we write about." A
// page qualifies only when BOTH hold:
//   1. its type is a roundup ("best X", "X alternatives"), a single-product
//      review, or an "X vs Y" comparison, and
//   2. its items are personal-finance apps or software.
// Anything that is itself a financial product, account, card, loan, fund, ETF,
// insurance, tax or legal service, or an investment never qualifies, nor do
// calculators, companies, services, gig platforms or people. When unsure: no.
//
// Route scope: only /roundup/<slug>/ (src/pages/roundup/[slug].astro). The
// /compare/ pages compare accounts, loans, funds, brokers, tax filers, legal
// structures and gig services; none compares two personal-finance apps, so the
// section is not wired in. Guides, calculators, templates, category hubs and
// About never call this. It is the ONE switch; nothing is stored per page.

export interface TestedCandidate {
  slug: string;
  /** Visible naming text: the <title>, the H1 and the roundup's category label. */
  text: string[];
  /** Meta description: checked only for the domain-defining words in DESCRIPTION_TOPICS. */
  context?: string[];
}

// ── Gate 1: page type ───────────────────────────────────────────────────────
const TYPE_SLUG_RE = /^(best|top)-|-alternatives$|-vs-|-review$/;

// STRICT page-type gate: pricing, how-to, explainer, news, tool/calculator, hub
// and About pages never qualify. Any one check excludes the page:
//   a) slug words, b) slug shapes, c) the title's or H1's lead phrase (text
//   before the first ':', '|', '—' or '(') names price, cost or free,
//   d) "explained"/"explainer"/"tutorial"/"hub" in the title or H1, or a
//   title/H1 that opens with How / What / Why.
const PAGE_TYPE_SLUG_WORDS = [
  'pricing', 'price', 'prices', 'priced', 'cost', 'costs', 'free', 'worth', 'cheap',
  'cheapest', 'discount', 'discounts', 'deal', 'deals', 'plan', 'plans', 'billing',
  'how', 'explained', 'explainer', 'what', 'why', 'guide', 'tutorial', 'tips',
  'setup', 'news', 'calculator', 'calculators', 'generator', 'checker', 'tool',
  'template', 'templates', 'hub', 'about', 'glossary', 'meaning', 'definition',
  'rates',
];
const PAGE_TYPE_SLUG_RE = /-pricing$|-costs?$|^is-.+-free$|^is-.+-worth-it$|^how-|^what-|^why-|^which-/;
const PAGE_TYPE_LEAD_WORDS = [
  'pricing', 'price', 'prices', 'priced', 'cost', 'costs', 'free', 'cheapest',
  'discount', 'discounts',
];
const PAGE_TYPE_TITLE_WORDS = ['hub', 'explained', 'explainer', 'tutorial', 'calculator', 'calculators'];
const leadPhrase = (t: string): string => t.split(/[:|—(]/)[0];
const PAGE_TYPE_TITLE_START_RE = /^\s*(how|what|why)\b/i;

// ── Gate 2: the items are apps/software, not financial/legal/tax products ───
// Whole-word match against slug + title + H1 + category label.
const EXCLUDED_TOPICS: Record<string, string[]> = {
  'financial product or investment': [
    'account', 'accounts', 'bank', 'banks', 'banking', 'savings', 'checking', 'cd', 'cds',
    'card', 'cards', 'credit', 'loan', 'loans', 'lender', 'lenders', 'lending',
    'mortgage', 'mortgages', 'refinance', 'heloc', 'fund', 'funds', 'etf', 'etfs',
    'index', 'dividend', 'dividends', 'stock', 'stocks', 'bond', 'bonds', 'treasury',
    'ira', 'iras', 'roth', '401k', '401', '403b', '457b', 'retirement', 'pension',
    'annuity', 'annuities', 'broker', 'brokers', 'brokerage', 'brokerages', 'robo',
    'advisor', 'advisors', 'adviser', 'advisers', 'invest', 'investing', 'investment',
    'investments', 'investor', 'trading', 'trader', 'bot', 'bots', 'crypto', 'portfolio',
    'backtesting', 'wealth', 'factoring', 'merchant', 'advance', 'financing', 'funding',
    'money', 'market', 'fire',
  ],
  insurance: ['insurance', 'insurer', 'insurers', 'medicare', 'medicaid'],
  tax: ['tax', 'taxes', 'irs', 'accounting', 'accountant', 'bookkeeping', 'bookkeeper', 'cpa', 'invoice', 'invoices', 'invoicing', 'payroll'],
  legal: [
    'legal', 'law', 'lawyer', 'lawyers', 'attorney', 'attorneys', 'will', 'wills',
    'trust', 'trusts', 'estate', 'probate', 'directive', 'directives', 'guardianship',
    'prenup',
  ],
  health: ['health', 'healthcare', 'medical', 'hsa', 'fsa'],
  'services, companies, gigs or people': [
    'service', 'services', 'company', 'companies', 'agency', 'agencies', 'firm', 'firms',
    'provider', 'providers', 'consultant', 'consultants', 'hr', 'relief', 'work', 'jobs',
    'training', 'platform', 'platforms', 'gig', 'driver', 'delivery', 'people',
  ],
};

const DESCRIPTION_TOPICS: Record<string, string[]> = {
  'financial product or investment': ['apy', 'apr', 'brokerage', 'lender', 'lenders'],
};

// Add a slug here to switch a page off by hand; nothing else needs to change.
const EXCLUDED_SLUGS = new Set<string>([
  'dataannotation-alternatives', // AI-training gig work platforms (employers), not apps
]);

const words = (s: string): string[] => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

function hits(haystack: string[], terms: string[]): string | null {
  const set = new Set(haystack);
  for (const t of terms) if (set.has(t)) return t;
  return null;
}

/** Why a page does NOT qualify, or null when it does. */
export function testedExclusionReason(c: TestedCandidate): string | null {
  if (!TYPE_SLUG_RE.test(c.slug)) return 'type: not a best-of/alternatives roundup, X-vs-Y or single-product review';
  if (EXCLUDED_SLUGS.has(c.slug)) return 'items: explicit list';
  const slugWords = words(c.slug);
  const titleText = c.text.slice(0, 2);
  const typeHit =
    hits(slugWords, PAGE_TYPE_SLUG_WORDS) ||
    (PAGE_TYPE_SLUG_RE.test(c.slug) ? 'slug shape' : null) ||
    hits(words(titleText.map(leadPhrase).join(' ')), PAGE_TYPE_LEAD_WORDS) ||
    hits(words(titleText.join(' ')), PAGE_TYPE_TITLE_WORDS) ||
    (titleText.some((t) => PAGE_TYPE_TITLE_START_RE.test(t)) ? 'how/what/why title' : null);
  if (typeHit) return `type: ${typeHit}`;
  const all = words([c.slug, ...c.text].join(' '));
  for (const [family, terms] of Object.entries(EXCLUDED_TOPICS)) {
    const h = hits(all, terms);
    if (h) return `items: ${family} (${h})`;
  }
  const ctx = words((c.context || []).join(' '));
  for (const [family, terms] of Object.entries(DESCRIPTION_TOPICS)) {
    const h = hits(ctx, terms);
    if (h) return `items: ${family} (description: ${h})`;
  }
  return null;
}

export function isTestedPage(c: TestedCandidate): boolean {
  return testedExclusionReason(c) === null;
}

// ── Change 2: "(Tested YYYY)" title ─────────────────────────────────────────
const Y = '(?:19|20)\\d{2}';
const BRAND_SUFFIX_RE = /\s+(?:\||-|—|–)\s+(?:The ?)?Modern ?Wallet\b.*$/i;
const MAX_RENDERED = 60;

export type TestedTitleResult =
  | { ok: true; title: string }
  | { ok: false; reason: 'too-long' | 'year-left' | 'already-tested'; candidate: string };

/**
 * The <title> for a qualifying page. The brand suffix is dropped (owner decision
 * 2026-10-20), a year phrase and a leading "The " are removed, and
 * " (Tested YYYY)" is appended. Over 60 characters, a year still inside, or
 * "Tested" already present: the original is kept, never truncated.
 */
export function buildTestedTitle(title: string, year: number = new Date().getFullYear()): TestedTitleResult {
  const m = BRAND_SUFFIX_RE.exec(title);
  let core = m ? title.slice(0, m.index) : title;
  core = core
    .replace(new RegExp(`\\s+in\\s+${Y}\\b`, 'gi'), '')
    .replace(new RegExp(`\\s+for\\s+${Y}\\b`, 'gi'), '')
    .replace(new RegExp(`\\s*\\(\\s*${Y}\\s*\\)`, 'g'), '')
    .replace(new RegExp(`\\s*\\[\\s*${Y}\\s*\\]`, 'g'), '')
    .replace(new RegExp(`:\\s*${Y}(?:\\s+\\S+){0,2}\\s*$`), '')  // ': 2026 Guide' tail → dropped whole; longer tails keep the original title
    .replace(new RegExp(`\\s+${Y}\\s*$`), '')
    .replace(/^The\s+/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const candidate = `${core} (Tested ${year})`;
  if (new RegExp(`\\b${Y}\\b`).test(core)) return { ok: false, reason: 'year-left', candidate };
  if (/\btested\b/i.test(core)) return { ok: false, reason: 'already-tested', candidate };
  if (candidate.length > MAX_RENDERED) return { ok: false, reason: 'too-long', candidate };
  return { ok: true, title: candidate };
}

// ── Change 3: pros/cons Review markup ───────────────────────────────────────
/**
 * Editorial pros/cons as a first-party Review (Google "pros and cons" markup).
 * Only the Strengths/Limitations the page shows, as plain text; never a rating.
 * Undefined unless there is at least one pro AND one con.
 */
export function buildProsConsReview(
  author: { name: string; url: string },
  pros: string[] = [],
  cons: string[] = [],
) {
  if (!pros.length || !cons.length) return undefined;
  const notes = (items: string[]) => ({
    '@type': 'ItemList',
    itemListElement: items.map((name, i) => ({ '@type': 'ListItem', position: i + 1, name })),
  });
  return {
    '@type': 'Review',
    author: { '@type': 'Person', name: author.name, url: author.url },
    positiveNotes: notes(pros),
    negativeNotes: notes(cons),
  };
}

export interface TestedInfo {
  /** Replacement <title>, or null to keep the original (too long etc.). */
  title: string | null;
}

/** undefined for every non-qualifying page, so its output stays byte-identical. */
export function testedInfo(c: TestedCandidate, title: string): TestedInfo | undefined {
  if (!isTestedPage(c)) return undefined;
  const t = buildTestedTitle(title);
  return { title: t.ok ? t.title : null };
}
