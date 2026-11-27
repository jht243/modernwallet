#!/usr/bin/env python3
"""Fleet-Wide Daily Presence + Quality Monitor for Internal Proof Across 29 Owned Fleet Sites.

Upgrades the binary "used / didn't use" check into a non-blocking 5-Signal Presence + Quality
Monitor across our 29 owned fleet sites (default lookback: 24 hours).

STRICT GUARDRAILS:
  1. NEVER touch or flag client/excluded repos (`barrycosta/git-darklight`, `GetOPTHealth/opt-health`,
     `HarmonicaAya/harmonica-ayahuasca-preview`, `jht243/Spin`).
  2. Keep existing valid exemptions intact (regulated medical, psychedelic, legal/policy,
     sanctions trackers, fixed launch schedules, and public-figure biographies).
  3. NEVER block publishing. Strictly observational — surfaces quality gaps by site and routine
     so routines can be tuned or pages queued for refresh without ever stalling publication.

5 QUALITY SIGNALS SCORED ON EVERY NEW NON-EXEMPT PAGE:
  1. Close the Generic Tagline Loophole (Kill False Positives)
  2. Depth & Volume Check (Target: 15%-20% / 150-250+ Word Original Analysis + Multi-Scenario Breakdown + Counterexample)
  3. Above-the-Fold Placement Check (Paragraph 1 Numeric Hook + Top-Half Proof Placement)
  4. Publisher's Take / Reviewer Note Quality & Visibility (Present + Wired to Template + Names Post-Month-1 Friction & Walk-Away)
  5. Matching Interactive Tool / Calculator Check (Embeds or Calls Out Matching Site Calculator/Tool)
"""
from __future__ import annotations

import argparse
import base64
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
import datetime as dt
import json
from pathlib import Path
import re
import subprocess
import sys

# Guardrail 1: Client and excluded repositories that must NEVER be touched or flagged
EXCLUDED_CLIENT_REPOS = {
    'barrycosta/git-darklight',
    'GetOPTHealth/opt-health',
    'HarmonicaAya/harmonica-ayahuasca-preview',
    'jht243/Spin',
}
EXCLUDED_CLIENT_DOMAINS = {
    'darklightcollection.com',
    'getopt.com',
    'harmonicaayahuasca.com',
    'wearespin.com',
}

# Exact 35 Owned Fleet Sites
OWNED_FLEET_REPOS: tuple[str, ...] = (
    'jht243/americanpivot',
    'jht243/banthebots',
    'jht243/chalkbox',
    'jht243/colombia-concierge',
    'jht243/cuban_insights',
    'jht243/diy-repair-guide',
    'jht243/drones_and_defense',
    'jht243/earnbycreating',
    'jht243/getzen_nomads',
    'jht243/humidor-atlas',
    'jht243/jet-and-beyond',
    'jht243/layer3labs',
    'jht243/longevitybenchmark',
    'jht243/medicalfrontier',
    'jht243/metabolic_journal',
    'jht243/modernwallet',
    'jht243/newparentpicks',
    'jht243/next-court',
    'jht243/orbitalintel',
    'jht243/partygamekit',
    'jht243/pipeflare-site',
    'jht243/prayer-site',
    'jht243/psych_report',
    'jht243/readnext',
    'jht243/relateguide',
    'jht243/safe-to-go',
    'jht243/shavingschool',
    'jht243/the_bot_scout',
    'jht243/thehoaguide',
    'jht243/theindoorreport',
    'jht243/trecklist-web',
    'jht243/undertheload',
    'jht243/ven_biz_network',
    'jht243/vet_tools',
    'jht243/weaponization_fund',
)

CANONICAL_SITE_INFO: dict[str, tuple[str, str]] = {
    'jht243/americanpivot': ('americanpivot.org', 'https://www.americanpivot.org'),
    'jht243/banthebots': ('banthebots.org', 'https://www.banthebots.org'),
    'jht243/chalkbox': ('chalkbox.org', 'https://www.chalkbox.org'),
    'jht243/colombia-concierge': ('colombiadesk.com', 'https://colombiadesk.com'),
    'jht243/cuban_insights': ('cubaninsights.com', 'https://cubaninsights.com'),
    'jht243/diy-repair-guide': ('diyrepairguide.com', 'https://diyrepairguide.com'),
    'jht243/drones_and_defense': ('droneanddefense.com', 'https://www.droneanddefense.com'),
    'jht243/earnbycreating': ('earnbycreating.com', 'https://earnbycreating.com'),
    'jht243/getzen_nomads': ('getzen.cash', 'https://getzen.cash'),
    'jht243/humidor-atlas': ('humidorist.com', 'https://humidorist.com'),
    'jht243/jet-and-beyond': ('jetandbeyond.com', 'https://www.jetandbeyond.com'),
    'jht243/layer3labs': ('layer3labs.io', 'https://www.layer3labs.io'),
    'jht243/longevitybenchmark': ('longevitybenchmark.com', 'https://www.longevitybenchmark.com'),
    'jht243/medicalfrontier': ('medicalfrontier.org', 'https://www.medicalfrontier.org'),
    'jht243/metabolic_journal': ('themetabolicjournal.com', 'https://themetabolicjournal.com'),
    'jht243/modernwallet': ('themodernwallet.com', 'https://www.themodernwallet.com'),
    'jht243/newparentpicks': ('newparentpicks.com', 'https://newparentpicks.com'),
    'jht243/next-court': ('wildcardsport.com', 'https://wildcardsport.com'),
    'jht243/orbitalintel': ('orbitalintel.org', 'https://www.orbitalintel.org'),
    'jht243/partygamekit': ('partygamekit.com', 'https://partygamekit.com'),
    'jht243/pipeflare-site': ('pipeflare.io', 'https://pipeflare.io'),
    'jht243/prayer-site': ('findaprayer.com', 'https://findaprayer.com'),
    'jht243/psych_report': ('mindmedicinelaw.com', 'https://mindmedicinelaw.com'),
    'jht243/readnext': ('readnextguide.com', 'https://readnextguide.com'),
    'jht243/relateguide': ('loveanswers.org', 'https://loveanswers.org'),
    'jht243/safe-to-go': ('safetotravel.org', 'https://safetotravel.org'),
    'jht243/shavingschool': ('shavingschool.com', 'https://www.shavingschool.com'),
    'jht243/the_bot_scout': ('thebotscout.com', 'https://www.thebotscout.com'),
    'jht243/thehoaguide': ('thehoaguide.com', 'https://www.thehoaguide.com'),
    'jht243/theindoorreport': ('theindoorreport.com', 'https://theindoorreport.com'),
    'jht243/trecklist-web': ('trecklist.com', 'https://trecklist.com'),
    'jht243/undertheload': ('undertheload.com', 'https://undertheload.com'),
    'jht243/ven_biz_network': ('caracasresearch.com', 'https://www.caracasresearch.com'),
    'jht243/vet_tools': ('rankandpay.org', 'https://www.rankandpay.org'),
    'jht243/weaponization_fund': ('lawfareclaims.org', 'https://www.lawfareclaims.org'),
}

# Guardrail 2: Regulated medical, psychedelic, legal/policy, and sanctions tracker sites
REGULATED_SITES = {
    'jht243/psych_report',
    'jht243/medicalfrontier',
    'jht243/longevitybenchmark',
    'jht243/modernwallet',
    'jht243/cuban_insights',
    'jht243/ven_biz_network',
    'jht243/weaponization_fund',
}

# Guardrail 2b: Physician-reviewed medical/psychedelic sites that intentionally keep REVIEWER_NOTES quote-free
MEDICAL_NO_QUOTE_SITES = {
    'jht243/longevitybenchmark',
    'jht243/medicalfrontier',
    'jht243/metabolic_journal',
    'jht243/psych_report',
}

# Template-wired Reviewer Note stores by repo (all 35 owned fleet sites)
REVIEWER_NOTE_STORES: dict[str, str] = {
    'jht243/americanpivot': 'src/data/reviewer-notes.ts',
    'jht243/banthebots': 'src/reviewer_notes.py',
    'jht243/chalkbox': 'src/data/reviewer-notes.ts',
    'jht243/colombia-concierge': 'src/data/reviewer-notes.ts',
    'jht243/cuban_insights': 'src/reviewer_notes.py',
    'jht243/diy-repair-guide': 'src/data/reviewer-notes.ts',
    'jht243/drones_and_defense': 'src/data/reviewer-notes.ts',
    'jht243/earnbycreating': 'src/data/reviewer-notes.ts',
    'jht243/getzen_nomads': 'src/reviewer_notes.py',
    'jht243/humidor-atlas': 'src/utils/reviewerNotes.ts',
    'jht243/jet-and-beyond': 'src/data/reviewer-notes.ts',
    'jht243/layer3labs': 'src/utils/reviewerNotes.ts',
    'jht243/longevitybenchmark': 'src/data/reviewer-notes.ts',
    'jht243/medicalfrontier': 'src/data/reviewer-notes.ts',
    'jht243/metabolic_journal': 'src/reviewer_notes.py',
    'jht243/modernwallet': 'src/data/reviewer-notes.ts',
    'jht243/newparentpicks': 'src/data/reviewer-notes.ts',
    'jht243/next-court': 'src/utils/reviewerNotes.ts',
    'jht243/orbitalintel': 'src/data/reviewer-notes.ts',
    'jht243/partygamekit': 'src/data/reviewer-notes.ts',
    'jht243/pipeflare-site': 'lib/reviewer-notes.ts',
    'jht243/prayer-site': 'lib/reviewer-notes.ts',
    'jht243/psych_report': 'src/reviewer_notes.py',
    'jht243/readnext': 'src/data/reviewer-notes.ts',
    'jht243/relateguide': 'src/data/reviewer-notes.ts',
    'jht243/safe-to-go': 'src/data/reviewer-notes.ts',
    'jht243/shavingschool': 'src/data/reviewer-notes.ts',
    'jht243/the_bot_scout': 'src/data/reviewer-notes.ts',
    'jht243/thehoaguide': 'src/data/reviewer-notes.ts',
    'jht243/theindoorreport': 'src/data/reviewer-notes.ts',
    'jht243/trecklist-web': 'src/data/reviewer-notes.ts',
    'jht243/undertheload': 'src/data/reviewer-notes.ts',
    'jht243/ven_biz_network': 'src/reviewer_notes.py',
    'jht243/vet_tools': 'src/reviewer_notes.py',
    'jht243/weaponization_fund': 'src/reviewer_notes.py',
}

# Fleet Interactive Calculators & Tools catalog by repo: list of (tool_route_or_id, trigger_keywords, match_min_hits)
FLEET_CALCULATORS: dict[str, list[tuple[str, tuple[str, ...], int]]] = {
    'jht243/layer3labs': [
        ('/tools/local-ai-hardware-calculator', ('dgx-spark', 'mac-studio', 'ryzen-ai-max', 'ryzen-ai-halo', 'geekom-a9', 'evo-x5', 'rtx-spark', 'local-ai', 'local-llm', 'vram', 'unified-memory'), 1),
        ('/tools/what-llm-can-i-run', ('dgx-spark', 'mac-studio', 'ryzen-ai-max', 'ryzen-ai-halo', 'geekom-a9', 'evo-x5', 'rtx-spark', 'local-ai', 'local-llm'), 1),
        ('/tools/gpu-rent-vs-buy-calculator', ('dgx-spark', 'mac-studio', 'ryzen-ai-max', 'gpu-rent', 'local-ai'), 1),
        ('/tools/wordpress-cost-calculator', ('wordpress', 'get-off-wordpress', 'hostinger-ai-website-builder'), 1),
        ('/roi/ai-receptionist-roi-calculator', ('appointment-scheduling', 'ai-receptionist', 'missed-call', 'telephone-booking'), 1),
        ('/tools/support-savings-calculator', ('agentic-commerce', 'chatgpt-shopping', 'acp-vs-ucp'), 1),
        ('/tools/ai-vendor-evaluation-checklist', ('chatgpt-shopping', 'get-off-wordpress'), 1),
        ('/tools/ai-model-cost-calculator', ('token-pricing', 'api-pricing', 'model-pricing', 'deepseek-pricing', 'claude-pricing', 'gemini-pricing', 'wix-ai-website-builder', 'framer-ai', 'agentic-commerce'), 1),
        ('/tools/llm-routing-cost-calculator', ('token-pricing', 'api-pricing', 'model-pricing', 'claude-pricing', 'gemini-pricing', 'openrouter-pricing'), 1),
        ('/tools/ai-plan-model-picker', ('claude-pricing', 'gemini-pricing', 'chatgpt-pricing', 'cursor-pricing', 'perplexity-pricing'), 1),
        ('/tools/voice-agent-cost-calculator', ('voice-agent', 'speechify-pricing', 'tts', 'voice-generator'), 1),
    ],
    'jht243/modernwallet': [
        ('/investing/compound-interest-calculator/', ('compound-interest', 'excel-google-sheets'), 1),
        ('/mortgage/piti-calculator/', ('property-tax-by-state', 'mortgage-payment'), 1),
        ('/mortgage/down-payment-calculator/', ('conforming-loan-limit', 'down-payment'), 1),
        ('/investing/dividend-reinvestment-calculator/', ('dividend-stocks', 'sp500'), 1),
        ('/budget/zero-based-budget-calculator/', ('tiller', 'copilot-money', 'ynab', 'monarch-money', 'budgeting'), 1),
        ('/budget/aca-subsidy-calculator/', ('medicaid-work-requirements', 'aca-vs-medicaid'), 1),
    ],
    'jht243/pipeflare-site': [
        ('/tax/crypto-tax-calculator', ('crypto-tax-calculator', 'koinly', 'cointracker', 'tax-loss'), 1),
        ('/staking/crypto-staking-calculator', ('lido-alternatives', 'liquid-staking', 'rocket-pool', 'eth-staking'), 1),
        ('/invest/bitcoin-dca-calculator', ('river-alternatives', 'recurring-bitcoin', 'dca', 'swan-bitcoin'), 1),
        ('/fees/bitcoin-transaction-fee-calculator', ('network-fee', 'mempool', 'utxo', 'sats-to-usd'), 1),
    ],
    'jht243/orbitalintel': [
        ('/tools/satellite-tracker', ('track-space-debris', 'space-debris', 'satellite-deorbit', 'deorbit', 'conjunction', 'space-track'), 1),
        ('/tools/satellite-service-matcher', ('satellite-spectrum', 'constellation', 'starlink', 'ngso'), 1),
        ('/tools/rideshare-payload-fit-calculator', ('rideshare', 'payload', 'cubesat', 'transporter'), 1),
    ],
    'jht243/readnext': [
        ('/tools/series-reading-order', ('books-in-order', 'percy-jackson-books-in-order', 'hunger-games-books-in-order', 'chronological-order'), 1),
        ('/tools/reading-time-calculator', ('do-audiobooks-count-as-reading', 'audiobook', 'reading-speed', 'listening-time'), 1),
        ('/tools/book-gift-finder', ('book-gifts', 'gifts-for-audiobook-lovers', 'gifts-for-kid-book-lovers'), 1),
    ],
    'jht243/thehoaguide': [
        ('/tools/hoa-reserve-fund-calculator', ('reserve-study', 'reserve-fund', 'special-assessment', 'fannie-mae-condo'), 1),
        ('/board-toolkit/', ('clickpay-alternatives', 'avigilon-alta-alternatives', 'payhoa', 'buildium', 'appfolio', 'hoa-accounting'), 1),
    ],
    'jht243/theindoorreport': [
        ('/air/air-purifier-lifetime-cost', ('levoit', 'air-purifier', 'airfanta', 'dreo', 'hepa', 'cadr', 'filter-replacement'), 1),
        ('/air/air-purifier-size-for-room', ('levoit', 'air-purifier', 'airfanta', 'dreo', 'cadr'), 1),
        ('/humidity/dehumidifier-size', ('midea', 'dehumidifier', 'humidity', 'pint', 'moisture'), 1),
    ],
    'jht243/chalkbox': [
        ('/tools/', ('education-com-alternatives', 'hapara-alternatives', 'memrise-alternatives', 'worksheet', 'classroom'), 1),
    ],
    'jht243/vet_tools': [
        ('/tsp-rmd-calculator', ('vanguard', 'charles-schwab', 'tsp', 'brokerage', 'robo-advisor', 'ira'), 1),
        ('/va-funding-fee-calculator', ('funding-fee', 'va-loan', 'upstart', 'personal-loan'), 1),
        ('/gi-bill-calculator', ('gi-bill', 'post-9-11', 'education-benefits', 'yellow-ribbon'), 1),
    ],
    'jht243/undertheload': [
        ('/tools/ruck-weight-calculator', ('ruck', 'rucking', 'pack-weight'), 1),
        ('/tools/weighted-vest-weight-calculator', ('weighted-vest', 'vest-weight'), 1),
    ],
    'jht243/diy-repair-guide': [
        ('/calculators/concrete-calculator', ('concrete', 'slab', 'footing'), 1),
        ('/calculators/stair-stringer-calculator', ('stair', 'stringer', 'riser', 'tread'), 1),
    ],
    'jht243/jet-and-beyond': [
        ('/cost/private-jet-cost-calculator', ('charter', 'jet-card', 'fractional', 'hourly-rate'), 1),
    ],
    'jht243/humidor-atlas': [
        ('/humidor-tracker', ('humidor', 'rh', 'boveda', 'seasoning', 'hygrometer'), 1),
    ],
}

# Exclude non-article navigation, IA, taxonomy, author, and ledger JSON/TS files in data/ and lib/
CONTENT_PATH_RE = re.compile(
    r'^('
    r'(?:src/)?data/(?!ia(?:\.|[-_])|related(?:\.|[-_])|links?(?:\.|[-_])|nav(?:igation)?(?:\.|[-_])|menu(?:\.|[-_])|categor(?:y|ies)|clusters?(?:\.|[-_])|hubs?(?:\.|[-_])|routes?(?:\.|[-_])|redirects?(?:\.|[-_])|taxonom(?:y|ies)|authors?(?:\.|[-_])|team(?:\.|[-_])|site(?:\.|[-_])|config(?:\.|[-_])|tested-methods|placement|testing-|alternatives-pages|sponsored|affiliate|paid-placements|reviewer-notes|pricing|gear-prices|search-index|sitemap|ledger|backlog|snapshot)[^/]+\.(?:ts|tsx|json)|'
    r'(?:src/)?data/(?:alternatives|explainers|toolPages)/[^/]+\.json|'
    r'lib/(?!rates|utils|seo|sitemap|schema|constants|ia|related|nav|navigation)[^/]*(?:content|trends|guides|articles|posts|alternatives|comparisons|reviews)[^/]*\.(?:ts|tsx|json)|'
    r'src/content/.*\.(?:md|mdx|json)|'
    r'content/.*\.(?:md|mdx|json)|'
    r'posts/.*\.(?:md|mdx)'
    r')$'
)
BIOGRAPHY_PATH_RE = re.compile(r'^(?:src/)?content/people/|/people/')
LEGAL_POLICY_EXPLAINER_RE = re.compile(
    r'/explainers/(?:trump-ai-vetting-executive-order|biden-ai-executive-order-14110|genesis-mission-executive-order|trump-ai-executive-orders)|'
    r'/guides/hud-mixed-status-housing-rule',
    re.I,
)
SKIP_MSG_PATTERNS = (
    '[skip-content]',
    'indexing-pass',
    'internal link',
    'paid placement',
    'paid-placement',
    'page-1-2-no-clicks-pass',
    'upgrade editorial identity',
    ': receipts',
    'revert /',
    'audit fix /',
    'fact fix /',
    'fix queue:',
    'partner upsells:',
    'checkout rescues:',
    'omit archived',
    'ledger:',
    'queue:',
)
SKIP_MSG_PREFIXES = (
    'chore(',
    'fix(review-policy)',
    'fix(verify-live-urls)',
    'fix(alternatives-daily)',
    'fix(alternatives-builder)',
    'fix(search-gap)',
    'feat(mindmap)',
    'feat(eeat)',
    'feat(trust',
    'feat(seo',
    'feat(tested)',
    'feat(layouts)',
    'affiliate:',
)

# Signal 1: Generic boilerplate phrases that do NOT count as internal proof unless backed by real math/testing/benchmarks/survey(N>=25)
GENERIC_TAGLINE_RE = re.compile(
    r'at\s+layer3\s*labs,\s+we\s+(?:build|run|design|help|implement|operate|advise|map|audit|inspect)[^.!?\n]*[.!?]?|'
    r'we\s+build\s+and\s+(?:run|operate)\s+(?:ai\s+)?systems\s+inside\s+(?:other\s+people\'?s|client)\s+businesses[^.!?\n]*[.!?]?|'
    r'we\s+build\s+(?:custom\s+)?(?:artificial\s+intelligence\s+\(ai\)\s+|ai\s+)?(?:agents|workflow\s+automations?|integrations)[^.!?\n]*[.!?]?|'
    r'we\s+(?:audit|inspect)\s+(?:workflow\s+security|software\s+architectures|site\s+requirements|operational\s+security)[^.!?\n]*[.!?]?|'
    r'in\s+our\s+review\s+of\s+(?:the\s+)?(?:primary|published|official|vendor)\s+(?:program\s+)?(?:docs|documentation|documents|pricing|sources)[^.!?\n]*[.!?]?|'
    r'based\s+on\s+our\s+reading\s+of\s+(?:the\s+)?[a-z0-9\'\s,&-]{0,45}(?:published|official|primary)\s+(?:pricing\s+)?(?:pages|docs|documentation)[^.!?\n]*[.!?]?|'
    r'we\s+(?:read|reviewed|checked|inspected)\s+(?:the\s+)?(?:official\s+|published\s+|primary\s+|vendor\s+)?(?:documentation|docs|pricing\s+pages?|terms|sources)[^.!?\n]*[.!?]?|'
    r'(?:on|in)\s+the\s+(?:pages?|sources?|docs?)\s+we\s+(?:could\s+read|read|reviewed|checked|saved)|'
    r'at\s+(?:readnext|the\s+modern\s+wallet|pipeflare|orbitalintel|the\s+bot\s+scout|the\s+hoa\s+guide|chalkbox),\s+we\s+(?:line\s+up|lay\s+out|compare|track|read\s+every\s+price\s+move|evaluate)[^.!?\n]*[.!?]?',
    re.I,
)

# Substantive proof signals (evaluated AFTER stripping generic boilerplate taglines)
SUBSTANTIVE_MATH_RE = re.compile(
    r'worked\s+cost\s+example|'
    r'in\s+our\s+(?:internal\s+)?(?:cost|scenario|specification|sizer|packing|fleet-readiness|procurement|site-readiness|workload|token|tco|break-even|margin|vram|bandwidth|two-year|24-month|3-year|annual|orbital(?:\s+cadence)?(?:\s+and\s+power)?|cadence|power|hardware(?:\s+and\s+memory)?|memory|room-sizing|governance|provenance|storage|battery)\s+(?:modeling|analysis|calculation|comparison|translation|breakdown|evaluation|matrix)|'
    r'in\s+our\s+(?:internal\s+modeling|internal\s+calculation|calculated\s+comparison|simple\s+arithmetic\s+from\s+the\s+published\s+figures|scenario\s+modeling|specification\s+modeling)|'
    r'(?:across|comparing)\s+(?:three|3)\s+(?:standardized\s+|common\s+|production\s+|representative\s+|verified\s+|publishing\s+|hardware\s+|recording\s+|buyer\s+|travel\s+|carry-on\s+|procurement\s+|site-readiness\s+|deployment\s+|observing\s+)?(?:workloads?|scenarios?|profiles?|provenance\s+scenarios?)|'
    r'(?:buyer|procurement|operator)\s+(?:verification|readiness)\s+checklist|'
    r'we\s+modeled\b|we\s+calculated\b|calculated\s+(?:directly\s+)?from\s+(?:amd|apple|nvidia|order\s+da|[a-z0-9_-]+\'s)\s+|'
    r'break-even\s+(?:threshold|point|month|apr|rule|step|transfers|hours|balance|counterexample)|breaks\s+even\s+at|'
    r'10-page\s+pdfs?|30-minute\s+meetings?|8-hour\s+workdays?|22\s+workdays|260\s+workdays|'
    r'scenariotable',
    re.I,
)
SUBSTANTIVE_LIVE_OR_TEST_RE = re.compile(
    r'\(tested\s+20\d\d\)|howwetested|in\s+our\s+(?:internal\s+)?testing\b|we\s+tested\b|read\s+and\s+reviewed\b|'
    r'live\s+(?:free-tier|sandbox|cli|api|workspace)\s+(?:test|probe|check|run|observation)|'
    r'we\s+ran\s+timeline\s+assembly\s+on\s+free-tier\s+cuts\s+first',
    re.I,
)
SUBSTANTIVE_OPERATOR_RE = re.compile(
    r'working\s+with\s+(?:over\s+\d+|a\s+|an\s+|several\s+|multiple\s+)?(?:small\s+medical\s+practices|small\s+business\s+founders|client|law\s+firms|hoa|condo|doctors|physicians|operators|executive)|'
    r'based\s+on\s+our\s+work\s+(?:with|optimizing|across)\s+(?:over\s+\d+|[a-z0-9\s-]{3,40})|'
    r'in\s+our\s+(?:client\s+)?(?:engagement|rollout|implementation|conversations|work)\s+with\b|'
    r'across\s+(?:the\s+\d+\s+|our\s+)(?:sites|publications|properties|portfolio)\s+we\s+(?:build\s+and\s+)?operate|'
    r'at\s+(?:dapper\s+labs|horizen\s+labs|amazon|uber)\b|1\.5m\s+users|60,000\s+daily\s+players|\$200m\+',
    re.I,
)
SURVEY_N_RE = re.compile(
    r'(?:reader\s+survey|reader\s+poll|our\s+survey\s+of|calculator\s+usage|tool\s+usage)[^.\n]{0,140}?\b(?:n\s*[=:]\s*(\d+)|(\d{2,6})\s+(?:respondents|readers|calculator\s+runs|runs|sessions|submissions|operators\s+surveyed))\b',
    re.I,
)

# Backwards-compatible regex export used by callers/tests, now excluding bare generic taglines
INTERNAL_SIGNAL_RE = re.compile(
    r'\(tested\s+20\d\d\)|howwetested|worked\s+cost\s+example|'
    r'in\s+our\s+(?:internal\s+)?(?:testing|cost|scenario|workload|token|tco|break-even|modeling|analysis|calculation)|'
    r'we\s+tested\b|we\s+modeled\b|we\s+calculated\b|read\s+and\s+reviewed\b|'
    r'in\s+our\s+(?:client\s+)?(?:conversations|engagement|work)\s+with\b|'
    r'based\s+on\s+our\s+work\s+(?:with|optimizing|across)\s+over\s+\d+|'
    r'reader\s+survey|reader\s+poll|scenariotable|break-even',
    re.I,
)

COUNTEREXAMPLE_RE = re.compile(
    r'what\s+would\s+change\s+our\s+(?:answer|guidance|recommendation|verdict)|'
    r'when\s+[^\n.]{2,50}\s+is\s+(?:still\s+)?the\s+better\s+fit|'
    r'who\s+this\s+is\s+not\s+for|'
    r'counterexample|break-even|breaks\s+even|crossover|reverses|flips|'
    r'cheaper\s+when|wins\s+when|better\s+fit\s+when|walk\s+away\s+if|stay\s+on\s+|skip\s+[a-z0-9\s-]{2,35}\s+(?:if|when|unless)',
    re.I,
)

P1_CONCRETE_NUMBER_RE = re.compile(
    r'(?:\$|USD\s*|EUR\s*|GBP\s*|CAD\s*|AUD\s*|£)\s*\d+(?:,\d{3})*(?:\.\d+)?|'
    r'\b\d+(?:\.\d+)?(?:-\s*|\s*)(?:%|percent|x\b|gb/s|tb/s|gb\b|tb\b|mb\b|mhz|ghz|watts?|w\b|kwh|lbs?\b|pounds?\b|kg\b|kilograms?\b|oz\b|ounces?\b|liters?\b|l\b|inches?\b|inch\b|in\b|cm\b|mm\b|miles?|km\b|fps\b|p\b|bps\b|basis\s+points?|petabytes?)|'
    r'\b\d+(?:,\d{3})+\s+(?:transfers?|transactions?|credits?|tokens?|users?|seats?|invoices?|minutes?|hours?|days?|months?|years?|pdfs?|satellites?|fragments?|objects?|miles?|machines?|models?)|'
    r'\b\d+(?:\.\d+)?(?:-\s*|\s+)(?:transfers?|transactions?|credits?|tokens?|seats?|invoices?|minutes?|hours?|days?|months?|years?|workdays?|pdfs?|books?|novels?|prequels?|companions?|tiers?|plans?|models?|satellites?|million\s+machines?|Wait)|'
    r'10\^\d+',
    re.I,
)

# Weak Publisher's Take detector: flags notes that merely restate vendor pricing/facts without post-month-1 friction + walk-away guidance
STRONG_NOTE_FRICTION_OR_WALKAWAY_RE = re.compile(
    r'\b(?:'
    r'walk\s+away|skip\s+|avoid\s+|stay\s+on\s+|stick\s+with|don\'?t\s+buy|don\'?t\s+judge|don\'?t\s+build|before\s+you\s+(?:commit|waive|switch|sign|pay|upgrade)|'
    r'only\s+makes\s+sense\s+when|only\s+if\s+you|unless\s+you|until\s+a\s+deferred|surprise\s+special\s+assessment|'
    r'bottleneck|rate\s+limits?\s+interrupt|rework\s+loops?|arrears|lags?\s+while|inertia|blind\s+spots?|'
    r'single\s+point\s+of\s+failure|contested\s+conflict|kill\s+more\s+deals|front-desk\s+surprises|'
    r'tax\s+bracket\s+and\s+owner\s+bandwidth|redirect\s+map|over-withholds|carryover\s+worksheet|'
    r'lease\s+ended\s+within\s+months|fire-code\s+and\s+insurance|outside\s+audit\s+before'
    r')\b',
    re.I,
)
WEAK_PRICING_RESTATEMENT_NOTE_RE = re.compile(
    r'easiest\s+to\s+judge\s+by\s+what\s+\w+\s+itself\s+states|'
    r'check\s+the\s+plan\s+amounts\s+for\s+your\s+location\s+before\s+you\s+build|'
    r'second\s+term\s+is\s+billed\s+at\s+the\s+renewal\s+rate\s+\w+\s+states|'
    r'pricing\s+page\s+does\s+not\s+say\s+what\s+one\s+credit\s+buys|'
    r'only\s+free\s+until\s+you\s+need\s+a\s+custom\s+domain,\s+payments\s+or\s+your\s+own\s+branding|'
    r'shares\s+a\s+name\s+with\s+the\s+agency,\s+but\s+\w+\s+says\s+the\s+agency\s+has\s+no\s+affiliation',
    re.I,
)


def _has_substantive_internal_proof(text: str) -> tuple[bool, list[str], bool]:
    """Return `(has_valid_proof, detected_proof_types, had_generic_tagline)`.

    Closes Signal 1 (Generic Tagline Loophole): strips boilerplate phrases like
    'At Layer3Labs, we build and run AI systems...' or 'In our review of primary docs...'
    before checking for real scenario math, hands-on/sandbox testing, verified operator
    experience, or reader survey/tool data (N >= 25).
    """
    raw = text or ''
    had_tagline = bool(GENERIC_TAGLINE_RE.search(raw))
    cleaned = GENERIC_TAGLINE_RE.sub(' ', raw)

    proof_types: list[str] = []
    if SUBSTANTIVE_LIVE_OR_TEST_RE.search(cleaned):
        proof_types.append('hands_on_or_live_sandbox_test')
    if SUBSTANTIVE_OPERATOR_RE.search(cleaned):
        proof_types.append('client_and_operator_experience')
    if SUBSTANTIVE_MATH_RE.search(cleaned) or (
        (
            re.search(r'["\']?(?:scenarioTable|table)["\']?\s*:\s*\{', cleaned)
            or re.search(r'<table\b[\s\S]*?<tr[\s\S]*?<tr', cleaned, re.I)
        )
        and re.search(r'(?:\$\s*\d|\b\d+(?:\.\d+)?\s*(?:%|credits?|months?|years?|days?|hours?|minutes?|recordings?|languages?|gb\b|tb\b|tops\b))', cleaned, re.I)
    ):
        proof_types.append('internal_cost_or_spec_modeling')
    for sm in SURVEY_N_RE.finditer(cleaned):
        n_val = int(sm.group(1) or sm.group(2) or 0)
        if n_val >= 25:
            proof_types.append('proprietary_reader_survey_or_tool_data')
            break

    return (len(proof_types) > 0, proof_types, had_tagline)


def _infer_routine_from_message(msg: str) -> str:
    low = (msg or '').lower()
    if 'people radar' in low or 'people-radar' in low:
        return 'people-radar'
    if 'mindmap pass' in low or 'mindmap-pass' in low:
        return 'podcast-pain-pass' if 'podcast' in low else 'mindmap-pass'
    if 'why-is-' in low or 'price-move' in low:
        return 'price-move-pass'
    if 'alternatives' in low and ('publish ' in low or 'wip ' in low or 'add ' in low or low.startswith('alternatives')):
        return 'alternatives-daily'
    for name in (
        'alternatives-daily',
        'podcast-pain-pass',
        'price-move-pass',
        'amazon-gear-radar',
        'comparison-miner',
        'autocomplete-paa',
        'search-gap',
        'question-gap',
        'striking-distance',
        'hype-radar',
        'news-radar',
        'people-radar',
        'x-trends',
        'visitor-requests',
        'vertical-roundup',
        'vendor-roundup',
        'trend-pass',
    ):
        if name in low:
            return name
    m = re.match(r'^([a-z0-9_-]+):', low)
    return m.group(1) if m else 'content-publish'


def _normalize_routine_label(routine: str) -> str:
    """Map verbose brief file paths to canonical routine family names for hotspot aggregation."""
    r = (routine or 'unknown').strip()
    low = r.lower()
    if 'alternatives' in low:
        return 'alternatives-daily'
    if 'podcast-pain' in low:
        return 'podcast-pain-pass'
    if 'price-move' in low:
        return 'price-move-pass'
    if 'people-radar' in low:
        return 'people-radar'
    if 'hype-radar' in low or '-hype-' in low:
        return 'hype-radar'
    if 'x-trends' in low or 'xtrends' in low:
        return 'x-trends'
    if 'tool-usage' in low:
        return 'tool-usage-pass'
    if 'trend-lane' in low or 'trend-pass' in low:
        return 'trend-pass'
    if 'search-gap' in low:
        return 'search-gap'
    if 'autocomplete' in low or 'keyword-pass' in low:
        return 'mindmap-autocomplete'
    if 'ai-shopping-agents' in low or 'local-ai-pc' in low or 'mindmap-pass' in low:
        return 'mindmap-pass'
    return r


def _canonical_repo_for_name(repo_or_site: str) -> str:
    s = (repo_or_site or '').strip()
    if not s:
        return ''
    if s in EXCLUDED_CLIENT_REPOS or s in EXCLUDED_CLIENT_DOMAINS:
        return 'EXCLUDED'
    if any(ex in s for ex in ('git-darklight', 'opt-health', 'harmonica-ayahuasca', 'darklightcollection')):
        return 'EXCLUDED'
    if s.startswith('layer3-mindmap-') or s == 'layer3labs.io' or s == 'layer3labs':
        return 'jht243/layer3labs'
    if '/' in s:
        return s
    for full_repo, (dom, _) in CANONICAL_SITE_INFO.items():
        if s == full_repo.split('/')[-1] or s == dom:
            return full_repo
    return f'jht243/{s}'


def _is_genuinely_exempt(rec: dict, full_repo: str) -> bool:
    """Guardrail 2: Keep valid regulated medical, psychedelic, legal/policy, sanctions, fixed-schedule, and biography exemptions intact."""
    routine_low = str(rec.get('routine') or '').lower()
    route_str = str(rec.get('route') or '')
    page_cat = str(rec.get('pageCategory') or '').lower()
    is_alt = (
        'alternatives' in routine_low
        or route_str.startswith(('/alternatives/', '/compare/'))
        or route_str.rstrip('/').endswith('-alternatives')
        or page_cat == 'alternatives-evaluation'
    )
    if 'people-radar' in routine_low or BIOGRAPHY_PATH_RE.search(route_str) or page_cat == 'public-figure-biography':
        return True
    if LEGAL_POLICY_EXPLAINER_RE.search(route_str):
        return True
    if full_repo in ('jht243/psych_report', 'jht243/medicalfrontier', 'jht243/longevitybenchmark', 'jht243/cuban_insights', 'jht243/ven_biz_network', 'jht243/weaponization_fund'):
        return not is_alt
    if full_repo == 'jht243/modernwallet' and not is_alt and not rec.get('usedInternalProof'):
        return True
    if not rec.get('usedInternalProof') and rec.get('legitimateExemption'):
        return True
    return False


def _normalize_logged_exemption(rec: dict, full_repo: str) -> dict:
    """Apply consistent regulated-domain / biographical / policy exemption rules to logged rows."""
    if full_repo in CANONICAL_SITE_INFO:
        rec['site'] = CANONICAL_SITE_INFO[full_repo][0]
    rec['repoFull'] = full_repo
    if _is_genuinely_exempt(rec, full_repo):
        rec['legitimateExemption'] = True
    return rec


def _route_keys_for_filename_or_route(val: str) -> list[str]:
    s = (val or '').strip()
    if not s:
        return []
    if s.startswith('/'):
        norm = '/' + s.strip('/')
        leaf = '/' + norm.strip('/').split('/')[-1]
        return list(dict.fromkeys([norm, leaf]))
    p = Path(s)
    stem = p.stem.strip('/')
    if not stem:
        return [s]
    return list(dict.fromkeys([s, f'/{stem}']))


def _discover_fleet_repos() -> list[tuple[str, str]]:
    """Return the 29 owned fleet site repositories, strictly excluding client/excluded repos."""
    return [(r, 'main') for r in OWNED_FLEET_REPOS if r not in EXCLUDED_CLIENT_REPOS]


def _local_scratch_root(full_repo: str) -> Path | None:
    rname = full_repo.split('/')[-1]
    cand = Path.home() / '.gemini/antigravity/scratch' / rname
    if cand.is_dir():
        return cand
    return None


def _fetch_file_text_at_ref(full_repo: str, filename: str, ref: str) -> str:
    if full_repo in EXCLUDED_CLIENT_REPOS:
        return ''
    proc = subprocess.run(
        ['gh', 'api', f'repos/{full_repo}/contents/{filename}?ref={ref}', '--jq', '.content'],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0 or not proc.stdout.strip():
        return ''
    try:
        return base64.b64decode(proc.stdout).decode('utf-8', errors='ignore')
    except Exception:
        return ''


def _extract_balanced_block(text: str, pos: int) -> str:
    start = text.rfind('{', max(0, pos - 4000), pos)
    while start != -1:
        depth = 0
        in_str = None
        esc = False
        end = -1
        limit = min(len(text), start + 150000)
        for i in range(start, limit):
            ch = text[i]
            if esc:
                esc = False
                continue
            if ch == '\\':
                esc = True
                continue
            if in_str:
                if ch == in_str:
                    in_str = None
                continue
            if ch in ('"', "'", '`'):
                in_str = ch
                continue
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        if end != -1 and end > pos:
            return text[start:end]
        start = text.rfind('{', max(0, start - 4000), start)
    return text[max(0, pos - 1000):min(len(text), pos + 35000)]


_REPO_FILE_CACHE: dict[tuple[str, str], str] = {}
_REPO_RN_CACHE: dict[str, dict[str, str]] = {}


def _sync_local_scratch_repos(repos: list[tuple[str, str]]) -> int:
    """Sync all local scratch checkouts from GitHub `origin/main` right before scanning so local files never lag cloud commits."""
    def _sync_one(item: tuple[str, str]) -> int:
        full_repo, branch = item
        local_dir = _local_scratch_root(full_repo)
        if local_dir is None or not (local_dir / '.git').exists():
            return 0
        # Ensure sparse-checkout is disabled if accidentally active so all data/content paths are visible
        sp = subprocess.run(
            ['git', '-C', str(local_dir), 'config', '--bool', 'core.sparseCheckout'],
            capture_output=True, text=True,
        )
        if sp.stdout.strip() == 'true':
            subprocess.run(['git', '-C', str(local_dir), 'sparse-checkout', 'disable'], capture_output=True, text=True, timeout=60)
        fetch_p = subprocess.run(
            ['git', '-C', str(local_dir), 'fetch', 'origin', branch, '--quiet'],
            capture_output=True, text=True, timeout=45,
        )
        if fetch_p.returncode != 0:
            return 0
        # Fast-forward working tree when clean so glob searches see brand-new cloud files immediately
        st = subprocess.run(['git', '-C', str(local_dir), 'status', '--porcelain'], capture_output=True, text=True)
        if st.returncode == 0 and not st.stdout.strip():
            subprocess.run(['git', '-C', str(local_dir), 'merge', '--ff-only', f'origin/{branch}', '--quiet'], capture_output=True, text=True, timeout=30)
        return 1

    with ThreadPoolExecutor(max_workers=10) as pool:
        return sum(pool.map(_sync_one, repos))


def _get_cached_repo_file(full_repo: str, rel_path: str, ref: str = 'main') -> str:
    key = (full_repo, f'{ref}:{rel_path}')
    if key in _REPO_FILE_CACHE:
        return _REPO_FILE_CACHE[key]
    local_dir = _local_scratch_root(full_repo)
    txt = ''
    if local_dir is not None and (local_dir / '.git').exists():
        # Prefer `origin/main:<rel_path>` when ref=='main' so even a dirty local checkout reads live cloud commits!
        git_ref = 'origin/main' if ref == 'main' else ref
        gp = subprocess.run(
            ['git', '-C', str(local_dir), 'show', f'{git_ref}:{rel_path}'],
            capture_output=True, text=True,
        )
        if gp.returncode == 0 and gp.stdout:
            txt = gp.stdout
        elif ref == 'main' and (local_dir / rel_path).is_file():
            try:
                txt = (local_dir / rel_path).read_text(encoding='utf-8', errors='ignore')
            except Exception:
                txt = ''
    if not txt:
        txt = _fetch_file_text_at_ref(full_repo, rel_path, ref)
    _REPO_FILE_CACHE[key] = txt
    return txt


def _parse_reviewer_notes_map(raw: str) -> dict[str, str]:
    notes: dict[str, str] = {}
    if not raw:
        return notes
    str_lit_re = r'(?:"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')'
    for m in re.finditer(rf'({str_lit_re})\s*:\s*\{{([^}}]+)\}}', raw, re.S):
        key_raw = m.group(1)[1:-1]
        if not key_raw.startswith('/'):
            continue
        rt = '/' + key_raw.strip('/')
        body = m.group(2)
        nm = re.search(rf'["\']?note["\']?\s*:\s*(?:\(\s*)?((?:{str_lit_re}\s*\+?\s*)+)', body, re.S)
        if nm:
            parts = [
                (dm.group(1) if dm.group(1) is not None else dm.group(2))
                for dm in re.finditer(r'"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'', nm.group(1))
            ]
            notes[rt] = ''.join(parts)
    return notes


def _get_repo_reviewer_notes(full_repo: str, ref: str = 'main') -> tuple[bool, dict[str, str]]:
    """Return `(has_wired_template_store, route_to_note_map)`."""
    store_rel = REVIEWER_NOTE_STORES.get(full_repo)
    if not store_rel:
        return False, {}
    if full_repo not in _REPO_RN_CACHE:
        raw = _get_cached_repo_file(full_repo, store_rel, ref)
        _REPO_RN_CACHE[full_repo] = _parse_reviewer_notes_map(raw)
    return True, _REPO_RN_CACHE[full_repo]


def _resolve_page_text(full_repo: str, route: str, routine: str = '', fallback_text: str = '', ref: str = 'main') -> str:
    """Resolve the full content of a published route from local checkout or GitHub for 5-signal scoring."""
    clean_rt = '/' + (route or '').strip('/')
    slug = clean_rt.split('/')[-1]
    if not slug:
        return fallback_text

    local_dir = _local_scratch_root(full_repo)
    if local_dir is not None:
        # 1. Check live published content files first (so post-draft enrichments take precedence)
        for pattern in (
            f'src/content/**/*{slug}.md',
            f'src/content/**/*{slug}.mdx',
            f'content/**/*{slug}.md',
            f'data/alternatives/{slug}.json',
            f'data/alternatives/{slug}-alternatives.json',
            f'data/toolPages/{slug}.json',
            f'data/explainers/{slug}.json',
            f'templates/tool_prose/{slug}.html',
        ):
            for p in local_dir.glob(pattern):
                if p.is_file():
                    return p.read_text(encoding='utf-8', errors='ignore')

        # 2. Check multi-entry JSON stores
        for pattern in ('src/data/*.json', 'data/*.json'):
            for p in sorted(local_dir.glob(pattern)):
                if not p.is_file() or p.name in (
                    'ia.json', 'related.json', 'related-overrides.json', 'testing-evidence.json',
                    'tested-methods.json', 'entity-links.json', 'search-aliases.json', 'alternatives-pages.json',
                ):
                    continue
                raw = _get_cached_repo_file(full_repo, str(p.relative_to(local_dir)), ref)
                if slug not in raw:
                    continue
                try:
                    obj = json.loads(raw)
                    items = obj if isinstance(obj, list) else (
                        obj.get('pages') or obj.get('items') or (list(obj.values()) if isinstance(obj, dict) else [])
                    )
                    for it in items:
                        if isinstance(it, dict):
                            it_slug = str(it.get('slug') or it.get('route') or it.get('id') or '').strip('/')
                            if it_slug in (slug, f'{slug}-alternatives') or it_slug.endswith('/' + slug):
                                return json.dumps(it, ensure_ascii=False, indent=2)
                except Exception:
                    pass

        # 3. Check TypeScript data stores
        for pattern in ('src/data/*.ts', 'data/*.ts', 'lib/*.ts'):
            for p in sorted(local_dir.glob(pattern)):
                if not p.is_file() or any(x in p.name for x in ('reviewer-notes', 'reviewerNotes', 'pricing.ts', 'site.ts', 'registry.ts')):
                    continue
                rel = str(p.relative_to(local_dir))
                raw = _get_cached_repo_file(full_repo, rel, ref)
                if slug not in raw:
                    continue
                m_end = re.search(rf'// mindmap-pass [^\n]*:{re.escape(slug)} END', raw)
                if m_end:
                    end_idx = m_end.start()
                    push_idx = raw.rfind('_entries.push(', max(0, end_idx - 150000), end_idx)
                    if push_idx != -1:
                        return raw[push_idx:end_idx]
                for pat in (
                    rf'(?m)^[ \t]{{1,4}}["\']?slug["\']?\s*:\s*["\'](?:[^"\']*/)?{re.escape(slug)}/?["\']',
                    rf'["\']?slug["\']?\s*:\s*["\'](?:[^"\']*/)?{re.escape(slug)}/?["\']',
                    rf'["\']{re.escape(slug)}["\']\s*:\s*\{{',
                ):
                    for m in re.finditer(pat, raw):
                        blk = _extract_balanced_block(raw, m.start())
                        if len(blk) > 1200 and any(k in blk for k in ('metaTitle', 'sections', 'buyingGuide', 'introText', 'comparisonTable')):
                            return blk

        # 3b. Check custom Next.js / Astro page files (e.g. `src/pages/ai-model-pricing.tsx`)
        for page_cand in (f'src/pages/{slug}.tsx', f'src/pages/{slug}.astro', f'pages/{slug}.tsx'):
            if (local_dir / page_cand).is_file():
                return (local_dir / page_cand).read_text(encoding='utf-8', errors='ignore')

        # 4. Fallback to local mindmap draft/page JSON
        for pattern in (
            f'reports/mindmap-pass/**/pages/{slug}.json',
            f'reports/mindmap-pass/**/drafts/{slug}.json',
        ):
            for p in local_dir.glob(pattern):
                if p.is_file():
                    return p.read_text(encoding='utf-8', errors='ignore')

    # 5. Remote GitHub lookup for sparse/remote-only repos
    if 'alternatives' in slug and full_repo == 'jht243/the_bot_scout':
        raw = _get_cached_repo_file(full_repo, 'src/data/alternativesDaily.json', ref)
        if raw:
            try:
                obj = json.loads(raw)
                items = obj if isinstance(obj, list) else (obj.get('pages') or obj.get('items') or list(obj.values()))
                for it in items:
                    if isinstance(it, dict) and slug in str(it.get('slug') or it.get('route') or ''):
                        return json.dumps(it, ensure_ascii=False, indent=2)
            except Exception:
                pass

    # Try deriving draft path from routine brief path (e.g. `reports/mindmap-pass/<run>/brief.txt`)
    cand_paths = []
    if routine and 'reports/mindmap-pass/' in routine:
        run_base = routine.rsplit('/', 1)[0]
        if run_base.endswith('/research'):
            run_base = run_base.rsplit('/', 1)[0]
        cand_paths.append(f'{run_base}/drafts/{slug}.json')
        if routine.endswith('-brief.md'):
            cand_paths.append(routine[:-len('-brief.md')] + f'-run/drafts/{slug}.json')
    cand_paths.extend([
        f'src/content/guides/{slug}.md',
        f'data/alternatives/{slug}.json',
        f'data/toolPages/{slug}.json',
    ])
    for cp in cand_paths:
        txt = _get_cached_repo_file(full_repo, cp, ref)
        if txt:
            return txt

    return fallback_text


def _extract_opening_paragraph(text: str) -> str:
    """Extract the opening paragraph under the H1 across JSON, TS, Markdown, or HTML page formats."""
    raw = (text or '').strip()
    if not raw:
        return ''

    # 0. Check YAML frontmatter `introText:` block scalars / list items BEFORE stripping frontmatter
    fm_m = re.match(r'\A---\n(.*?)\n---\n', raw, flags=re.S)
    if fm_m:
        fm_body = fm_m.group(1)
        m_yaml_intro = re.search(
            r'(?m)^introText:\s*\n(?:\s*-\s*(?:\|-?|>)?\s*\n((?:[ \t]{2,}[^\n]+\n?)+)|\s*-\s*["\']?([^\n"\']{30,})["\']?)',
            fm_body,
        )
        if m_yaml_intro:
            y_para = (m_yaml_intro.group(1) or m_yaml_intro.group(2) or '').strip()
            y_clean = re.sub(r'\s+', ' ', y_para)
            if len(y_clean) > 30:
                return y_clean

    # 1. Try JSON / TS fields (`introText`, `introHtml`, `intro`, `opening`, `howItWorks`, `summary`, `dek`)
    for field in ('introText', 'introHtml', 'intro', 'opening', 'howItWorks', 'summary', 'dek', 'subtitle', 'cardBlurb'):
        m_arr = re.search(rf'["\']?{field}["\']?\s*:\s*\[\s*["\']((?:[^"\'\\]|\\.)+)["\']', raw, re.S)
        if m_arr:
            cand = re.sub(r'<[^>]+>', ' ', m_arr.group(1)).strip()
            if len(cand) > 30:
                return cand
        m_str = re.search(rf'["\']?{field}["\']?\s*:\s*["\']((?:[^"\'\\]|\\.)+)["\']', raw, re.S)
        if m_str:
            cand = re.sub(r'<[^>]+>', ' ', m_str.group(1)).strip()
            if len(cand) > 30:
                return cand

    # 2. Try first paragraph inside `sections[0]` (`content` or `paragraphs` or `body` or `html`)
    for sec_field in ('content', 'paragraphs', 'body', 'html'):
        m_sec = re.search(rf'["\']?{sec_field}["\']?\s*:\s*\[?\s*["\']((?:[^"\'\\]|\\.){{40,800}})', raw, re.S)
        if m_sec:
            return re.sub(r'<[^>]+>', ' ', m_sec.group(1))

    # 3. Markdown: strip YAML frontmatter and H1, take first substantive paragraph
    md = re.sub(r'\A---\n.*?\n---\n', '', raw, flags=re.S)
    paras = []
    for blk in re.split(r'\n\s*\n', md):
        b = blk.strip()
        if not b or b.startswith(('#', '|', 'import ', 'export ', '//', '/*')):
            continue
        b_clean = re.sub(r'<[^>]+>', ' ', b).strip()
        if len(b_clean.split()) >= 8:
            paras.append(b_clean)
            if len(paras) >= 2:
                break
    return ' '.join(paras[:2]) if paras else raw[:600]


def _estimate_analysis_words_and_offset(text: str) -> tuple[int, int, float, bool]:
    """Return `(total_body_words, original_analysis_words, first_proof_offset_pct, has_multi_scenario_breakdown)`."""
    raw = text or ''
    if not raw.strip():
        return (0, 0, 100.0, False)

    # Strip boilerplate taglines AND YAML frontmatter metadata before measuring body proof offset/words
    raw_body = re.sub(r'\A---\n.*?\n---\n', '', raw, flags=re.S)
    cleaned = GENERIC_TAGLINE_RE.sub(' ', raw_body)
    plain = re.sub(r'<[^>]+>', ' ', cleaned)
    total_words = max(len(re.findall(r'\b[A-Za-z0-9][A-Za-z0-9\'-]*\b', plain)), 1)

    # Check structured multi-scenario breakdown:
    # - `scenarioTable`, `sections[].table`, HTML `<table>`, or Markdown pipe table `| ... |`
    #   paired with scenario/cost/tier/workload numbers, OR >=2 modeled scenario paragraphs/bullets
    has_structured_table = bool(
        re.search(r'["\']?(?:scenarioTable|table)["\']?\s*:\s*\{', cleaned)
        or re.search(r'<table\b[\s\S]*?<tr[\s\S]*?<tr', cleaned, re.I)
        or re.search(r'\|\s*:?-{2,}:?\s*\|', cleaned)
    )
    has_scenario_tiers = bool(
        re.search(r'\b(?:three|3|two|4|four)\s+(?:standardized\s+|common\s+|household\s+|buyer\s+|learner\s+|user\s+|investor\s+|borrowing\s+|personal-loan\s+)?(?:scenarios?|profiles?|horizons?|workloads?|tiers?|budgets?)\b', cleaned, re.I)
        or len(re.findall(r'\bscenario\s*[123a-c]\b|\b(?:light|standard|heavy|solo|small\s+team|mid-size|enterprise|64gb|128gb|512gb)\b', cleaned, re.I)) >= 3
    )
    has_multi_scenario = (has_structured_table and (has_scenario_tiers or bool(SUBSTANTIVE_MATH_RE.search(cleaned)))) or (
        has_scenario_tiers and bool(SUBSTANTIVE_MATH_RE.search(cleaned))
    )

    # Locate first substantive proof offset percentage in `cleaned`
    first_pos = len(cleaned)
    table_rx = re.compile(r'["\']?(?:scenarioTable|table)["\']?\s*:\s*\{|<table\b', re.I)
    for rx in (SUBSTANTIVE_MATH_RE, SUBSTANTIVE_LIVE_OR_TEST_RE, SUBSTANTIVE_OPERATOR_RE, table_rx):
        m = rx.search(cleaned)
        if m and m.start() < first_pos:
            first_pos = m.start()
    offset_pct = round((first_pos / max(len(cleaned), 1)) * 100.0, 1) if first_pos < len(cleaned) else 100.0

    # Measure original analysis word volume across chunks/paragraphs/sections carrying modeling, testing,
    # operator experience, scenario tables, counterexamples, and decision takeaways/verdicts
    analysis_chunks: list[str] = []
    # Split by H2 sections first if Markdown headings exist; for JSON/TS section arrays split on `},\n {` so
    # multi-paragraph proof sections + their structured `table` stay together as one coherent section!
    if re.search(r'(?m)^##\s+', cleaned):
        segments = re.split(r'(?m)(?=^##\s+)', cleaned)
    elif re.search(r'["\']?(?:sections|buyingGuide)["\']?\s*:\s*\[', cleaned):
        segments = re.split(r'\}\s*,\s*\{', cleaned)
    else:
        segments = re.split(r'\n\s*\n|(?:\"\s*,\s*\")|(?:\},\s*\{)', cleaned)
    analysis_cue_re = re.compile(
        r'in\s+our\s+(?:internal\s+)?(?:cost|scenario|specification|sizer|packing|fleet-readiness|procurement|site-readiness|workload|token|tco|break-even|testing|modeling|analysis|calculation|comparison|evaluation|breakdown)|'
        r'we\s+(?:modeled|calculated|tested)|worked\s+cost\s+example|scenariotable|'
        r'(?:across|comparing)\s+(?:three|3)\s+(?:standardized\s+|common\s+|travel\s+|carry-on\s+|workload\s+|procurement\s+|site-readiness\s+|deployment\s+|buyer\s+|observing\s+)?(?:scenarios?|workloads?|profiles?)|'
        r'(?:buyer|procurement|operator)\s+(?:verification|readiness)\s+checklist|'
        r'break-even|breaks\s+even|counterexample|what\s+would\s+change\s+our|when\s+[^\n.]{2,50}\s+is\s+(?:still\s+)?the\s+better|'
        r'who\s+this\s+is\s+not\s+for|who\s+should\s+skip|our\s+takeaway|verdict|recommendation\s+flips|walk\s+away|'
        r'working\s+with\s+(?:over\s+\d+|a\s+|an\s+|several\s+|multiple\s+)|'
        r'based\s+on\s+our\s+work\s+(?:with|optimizing|across)|'
        r'calculated\s+from\s+|modeled\s+from\s+|amortized\s+across\s+|'
        r'10-page\s+pdfs?|30-minute\s+meetings?|8-hour\s+workdays?|'
        r'scenario\s*[123a-c]\b',
        re.I,
    )
    for seg in segments:
        if analysis_cue_re.search(seg) or COUNTEREXAMPLE_RE.search(seg):
            seg_plain = re.sub(r'<[^>]+>', ' ', seg)
            analysis_chunks.append(seg_plain)

    analysis_words = len(re.findall(r'\b[A-Za-z0-9][A-Za-z0-9\'-]*\b', ' '.join(analysis_chunks)))
    return (total_words, analysis_words, offset_pct, has_multi_scenario)


def _check_matching_calculator(full_repo: str, route: str, text: str) -> tuple[bool, list[str], bool]:
    """Signal 5: Check if the site hosts a calculator/tool matching the page topic and whether the article calls it out.

    Returns `(passed_signal5, matching_tools_available, is_self_calculator)`.
    """
    clean_rt = '/' + (route or '').strip('/')
    low_rt = clean_rt.lower()
    if any(k in low_rt for k in ('calculator', '-tool', '/tools/', '-checker', '-generator', '-finder', '-tracker', '-assessment')):
        return (True, [], True)

    tools = FLEET_CALCULATORS.get(full_repo) or []
    if not tools:
        return (True, [], False)

    hay_head = (clean_rt + ' ' + (text or '')[:1500]).lower()
    full_low = (text or '').lower()

    matched_tools: list[str] = []
    called_out_any = False
    for tool_route, keywords, min_hits in tools:
        hits = sum(1 for kw in keywords if kw in hay_head)
        if hits >= min_hits:
            matched_tools.append(tool_route)
            tool_slug = tool_route.strip('/').split('/')[-1]
            if tool_route.lower().rstrip('/') in full_low or (tool_slug and tool_slug.lower() in full_low):
                called_out_any = True

    if not matched_tools:
        return (True, [], False)
    return (called_out_any, matched_tools, False)


def evaluate_page_quality(ev: dict, full_repo: str, page_text: str = '', ref: str = 'main') -> dict:
    """Evaluate all 5 Quality Signals on a single page event and populate `qualityTier` + `qualityFlags`."""
    route = str(ev.get('route') or '')
    clean_rt = '/' + route.strip('/')
    routine = str(ev.get('routine') or '')
    base_url = CANONICAL_SITE_INFO.get(full_repo, (ev.get('site') or full_repo.split('/')[-1], f"https://{ev.get('site') or full_repo.split('/')[-1]}"))[1]
    ev['site'] = CANONICAL_SITE_INFO.get(full_repo, (ev.get('site') or full_repo.split('/')[-1], base_url))[0]
    ev['url'] = f'{base_url}{clean_rt}'

    text = page_text or _resolve_page_text(full_repo, clean_rt, routine=routine, ref=ref)

    # Check Signal 1 first (Substantive Proof vs Generic Tagline Loophole)
    has_substantive_proof, substantive_types, had_tagline = _has_substantive_internal_proof(text) if text else (
        bool(ev.get('usedInternalProof')),
        list(ev.get('proofTypesUsed') or []),
        False,
    )

    # Guardrail 2: Valid Exemptions
    if _is_genuinely_exempt(ev, full_repo):
        ev['legitimateExemption'] = True
        ev['qualityTier'] = 'exempt'
        ev['qualityFlags'] = []
        ev['qualitySignals'] = {
            'exempt': True,
            'qualityScorePct': 100,
        }
        return ev

    ev['legitimateExemption'] = False
    flags: list[str] = []

    # Signal 1: Close Generic Tagline Loophole
    if not has_substantive_proof:
        ev['usedInternalProof'] = False
        ev['proofTypesUsed'] = []
        if had_tagline:
            flags.append('tagline-only proof')
            ev['whyNotUsed'] = 'Generic boilerplate tagline ("At Layer3Labs, we build..." / "In our review of primary docs...") without backing scenario math, sandbox test, operator benchmark, or survey data (N >= 25).'
        else:
            flags.append('no internal proof')
    else:
        ev['usedInternalProof'] = True
        if substantive_types:
            ev['proofTypesUsed'] = substantive_types

    # Signal 2: Depth & Volume Check (150-250+ word analysis block + multi-scenario breakdown + counterexample)
    total_words, analysis_words, proof_offset_pct, has_multi_scenario = _estimate_analysis_words_and_offset(text)
    analysis_pct = round((analysis_words / max(total_words, 1)) * 100.0, 1)
    has_depth_150w = analysis_words >= 150
    has_counterexample = bool(COUNTEREXAMPLE_RE.search(text or ''))

    if has_substantive_proof:
        if not has_depth_150w:
            flags.append('shallow original analysis (<150w)')
        if not has_multi_scenario:
            flags.append('missing multi-scenario breakdown')
        if not has_counterexample:
            flags.append('missing counterexample')

    # Signal 3: Above-the-Fold Placement Check (Paragraph 1 Numeric Hook + Top-Half Proof)
    opening_para = _extract_opening_paragraph(text)
    opening_clean = re.sub(r'\b202[4-8]\b', '', opening_para)
    has_p1_hook = bool(P1_CONCRETE_NUMBER_RE.search(opening_clean))
    has_top_half_proof = proof_offset_pct <= 55.0

    if has_substantive_proof:
        if not has_p1_hook:
            flags.append('missing Paragraph 1 numeric hook')
        if not has_top_half_proof:
            if proof_offset_pct >= 75.0:
                flags.append('proof buried in bottom 25%')
            else:
                flags.append('proof buried in bottom 50%')

    # Signal 4: Publisher's Take / Reviewer Note Quality & Visibility
    # Physician-reviewed medical/psychedelic sites intentionally omit ReviewerNote quotes (`REVIEWER_NOTES = {}`)
    if full_repo in MEDICAL_NO_QUOTE_SITES:
        rn_status = 'medical_quote_exempt'
        rn_is_strong = True
        wired_note = None
        has_wired_store = True
    else:
        has_wired_store, rn_map = _get_repo_reviewer_notes(full_repo, ref=ref)
        wired_note = rn_map.get(clean_rt)
        if wired_note is None and '/' in clean_rt.lstrip('/'):
            leaf_rt = '/' + clean_rt.strip('/').split('/')[-1]
            wired_note = rn_map.get(leaf_rt)
        has_backend_unwired_note = bool(
            not wired_note
            and text
            and re.search(r'["\']?(?:reviewerNote|publishersTake|editorNote|editorsNote)["\']?\s*:\s*\{', text)
        )
        rn_status = 'missing'
        rn_is_strong = False
        if wired_note and has_wired_store:
            # Honor flexible Publisher's Take / Editor's Note standard: NEVER require numbers or narrow phrase triggers;
            # only flag notes that restate vendor boilerplate verbatim or are too short (<14 words) to offer real guidance.
            if WEAK_PRICING_RESTATEMENT_NOTE_RE.search(wired_note) or len(wired_note.split()) < 14:
                rn_status = 'generic'
                flags.append("generic Publisher's Take")
            else:
                rn_status = 'strong_and_wired'
                rn_is_strong = True
        elif has_backend_unwired_note:
            rn_status = 'unwired_in_backend'
            flags.append("Publisher's Take unwired in backend data")
        else:
            rn_status = 'missing'
            flags.append("missing Publisher's Take")

    # Signal 5: Matching Interactive Tool / Calculator Check
    calc_passed, matching_calcs, is_self_calc = _check_matching_calculator(full_repo, clean_rt, text)
    if not calc_passed:
        flags.append('missed matching calculator')

    # Compute overall 0-100 quality score and qualityTier
    if not has_substantive_proof:
        score = 0
        tier = 'empty'
    else:
        score = 20  # Signal 1 passed
        if has_depth_150w:
            score += 10
        if has_multi_scenario:
            score += 10
        if has_counterexample:
            score += 5
        if has_p1_hook:
            score += 10
        if has_top_half_proof:
            score += 10
        if rn_is_strong:
            score += 20
        elif rn_status == 'generic':
            score += 10
        if calc_passed:
            score += 15
        tier = 'strong' if score >= 90 else 'thin'

    ev['qualityTier'] = tier
    ev['qualityFlags'] = flags
    ev['qualitySignals'] = {
        'signal1_substantiveProof': {
            'passed': has_substantive_proof,
            'hadGenericTagline': had_tagline,
            'proofTypes': substantive_types,
        },
        'signal2_depthAndVolume': {
            'passed': has_depth_150w and has_multi_scenario and has_counterexample,
            'totalBodyWords': total_words,
            'originalAnalysisWords': analysis_words,
            'originalAnalysisPct': analysis_pct,
            'hasMultiScenarioBreakdown': has_multi_scenario,
            'hasCounterexample': has_counterexample,
        },
        'signal3_aboveTheFold': {
            'passed': has_p1_hook and has_top_half_proof,
            'hasParagraph1NumericHook': has_p1_hook,
            'hasTopHalfProof': has_top_half_proof,
            'firstProofOffsetPct': proof_offset_pct,
        },
        'signal4_publishersTake': {
            'passed': rn_is_strong,
            'status': rn_status,
            'wiredToTemplate': bool(wired_note and has_wired_store),
        },
        'signal5_matchingCalculator': {
            'passed': calc_passed,
            'isCalculatorPage': is_self_calc,
            'matchingCalculatorsAvailable': matching_calcs,
        },
        'qualityScorePct': score,
    }
    return ev


def _scan_repo_window(item: tuple[str, str], since_iso: str) -> list[dict]:
    full_repo, branch = item
    if full_repo in EXCLUDED_CLIENT_REPOS:
        return []

    chk = subprocess.run(
        ['gh', 'api', f'repos/{full_repo}/contents/.claude/tools/mindmap-gates.py?ref={branch}', '--jq', '.sha'],
        capture_output=True,
        text=True,
    )
    if chk.returncode != 0 or not chk.stdout.strip():
        return []

    commits_proc = subprocess.run(
        ['gh', 'api', f'repos/{full_repo}/commits?sha={branch}&since={since_iso}&per_page=20'],
        capture_output=True,
        text=True,
    )
    if commits_proc.returncode != 0 or not commits_proc.stdout.strip():
        return []

    try:
        commits = json.loads(commits_proc.stdout)
    except Exception:
        return []

    events: list[dict] = []
    emitted_by_route_key: dict[str, int] = {}
    carryover_by_key: dict[str, dict] = {}
    cutoff_dt = dt.datetime.fromisoformat(since_iso.replace('Z', '+00:00'))
    carryover_cutoff_dt = cutoff_dt - dt.timedelta(hours=24)

    def _upsert_event(rec: dict, rkeys: list[str], page_text: str = '', ref: str = branch) -> None:
        scored = evaluate_page_quality(dict(rec), full_repo, page_text=page_text, ref=branch)
        new_rank = (
            int((scored.get('qualitySignals') or {}).get('qualityScorePct') or 0),
            1 if scored.get('usedInternalProof') else 0,
        )
        existing_idx = next((emitted_by_route_key[rk] for rk in rkeys if rk in emitted_by_route_key), None)
        if existing_idx is not None:
            prev = events[existing_idx]
            prev_rank = (
                int((prev.get('qualitySignals') or {}).get('qualityScorePct') or 0),
                1 if prev.get('usedInternalProof') else 0,
            )
            if new_rank >= prev_rank:
                events[existing_idx] = scored
        else:
            idx = len(events)
            events.append(scored)
            for rk in rkeys:
                emitted_by_route_key[rk] = idx
        for rk in rkeys:
            prev_c = carryover_by_key.get(rk)
            prev_c_rank = (
                int(((prev_c or {}).get('qualitySignals') or {}).get('qualityScorePct') or 0),
                1 if (prev_c or {}).get('usedInternalProof') else 0,
            )
            if prev_c is None or new_rank >= prev_c_rank:
                carryover_by_key[rk] = scored

    # 0. Read committed `reports/internal-proof-log.jsonl` directly
    raw_log = _fetch_file_text_at_ref(full_repo, 'reports/internal-proof-log.jsonl', branch)
    if raw_log:
        for ln in raw_log.splitlines():
            if not ln.strip():
                continue
            try:
                rec = _normalize_logged_exemption(json.loads(ln), full_repo)
                ts_s = str(rec.get('timestamp') or '')
                if not ts_s:
                    continue
                rec_dt = dt.datetime.fromisoformat(ts_s.replace('Z', '+00:00'))
                if rec_dt < carryover_cutoff_dt:
                    continue
                rt = str(rec.get('route') or '').strip()
                rkeys = _route_keys_for_filename_or_route(rt)
                if rec_dt >= cutoff_dt:
                    _upsert_event(rec, rkeys, ref=branch)
                else:
                    scored_carry = evaluate_page_quality(dict(rec), full_repo, ref=branch)
                    for rk in rkeys:
                        prev = carryover_by_key.get(rk)
                        if prev is None or scored_carry.get('usedInternalProof') or not prev.get('usedInternalProof'):
                            carryover_by_key[rk] = scored_carry
            except Exception:
                pass

    # Process commits oldest-first so initial page creation in commit N carries forward to polish commit N+1
    for c in reversed(commits):
        sha = c.get('sha', '')
        msg = ((c.get('commit') or {}).get('message') or '').splitlines()[0]
        committed_at = ((c.get('commit') or {}).get('committer') or {}).get('date') or ''
        msg_low = msg.lower()
        if any(p in msg_low for p in SKIP_MSG_PATTERNS) or msg_low.startswith(SKIP_MSG_PREFIXES):
            continue

        detail_proc = subprocess.run(
            ['gh', 'api', f'repos/{full_repo}/commits/{sha}'],
            capture_output=True,
            text=True,
        )
        if detail_proc.returncode != 0:
            continue
        try:
            detail = json.loads(detail_proc.stdout)
        except Exception:
            continue

        files = detail.get('files') or []
        proof_log_patch = next((f.get('patch', '') for f in files if f.get('filename') == 'reports/internal-proof-log.jsonl'), '')
        parsed_from_log = False
        if proof_log_patch:
            for ln in proof_log_patch.splitlines():
                if ln.startswith('+') and not ln.startswith('+++'):
                    try:
                        rec = _normalize_logged_exemption(json.loads(ln[1:]), full_repo)
                        rec['commitSha'] = sha[:10]
                        rkeys = _route_keys_for_filename_or_route(str(rec.get('route') or ''))
                        _upsert_event(rec, rkeys, ref=sha or branch)
                        parsed_from_log = True
                    except Exception:
                        pass
        if parsed_from_log:
            continue

        content_files = [f for f in files if CONTENT_PATH_RE.match(f.get('filename', ''))]
        if not content_files:
            continue
        pool_presented = any('pool-receipt.json' in f.get('filename', '') for f in files)
        routine = _infer_routine_from_message(msg)
        is_reg = full_repo in REGULATED_SITES and not (full_repo == 'jht243/modernwallet' and routine == 'alternatives-daily')

        commit_events: list[tuple[dict, str]] = []
        had_concrete_slug = False
        for cf in content_files:
            fname = cf.get('filename', '')
            patch_added = '\n'.join(
                ln[1:] for ln in (cf.get('patch') or '').splitlines() if ln.startswith('+') and not ln.startswith('+++')
            )
            if len(patch_added.strip()) < 250:
                continue
            full_txt = ''
            has_internal, detected_types, _ = _has_substantive_internal_proof(patch_added)
            if not has_internal and cf.get('status') == 'modified' and fname.endswith(('.md', '.mdx')):
                full_txt = _fetch_file_text_at_ref(full_repo, fname, sha)
                if full_txt:
                    has_internal, detected_types, _ = _has_substantive_internal_proof(full_txt)

            if fname.endswith(('.ts', '.tsx')):
                # Extract ONLY top-level record slugs (`indent <= 4`), never nested `alternatives[].slug` or `relatedLinks` slugs
                slugs = list(dict.fromkeys(re.findall(r'(?m)^[ \t]{0,4}"?slug"?\s*:\s*["\']([a-z0-9/-]+)["\']', patch_added)))
            else:
                slugs = list(dict.fromkeys(re.findall(r'"?slug"?\s*:\s*["\']([a-z0-9/-]+)["\']', patch_added)))
            if not slugs and (
                fname.endswith(('.md', '.mdx'))
                or re.match(r'^(?:src/)?data/(?:alternatives|explainers|toolPages)/[^/]+\.json$', fname)
            ):
                slugs = [Path(fname).stem]
            if not slugs:
                continue
            had_concrete_slug = True
            routes = []
            for s in slugs:
                s_clean = s.lstrip('/')
                if '/' not in s_clean:
                    if 'data/alternatives' in fname or (routine == 'alternatives-daily' and full_repo in ('jht243/modernwallet', 'jht243/banthebots', 'jht243/vet_tools')):
                        s_clean = f'alternatives/{s_clean}'
                    elif 'gear-deep-dives' in fname or 'gear-reviews' in fname:
                        s_clean = f'gear/reviews/{s_clean}'
                    elif 'gear-roundups' in fname:
                        s_clean = f'gear/{s_clean}'
                    elif 'data/comparisons' in fname:
                        s_clean = f'comparisons/{s_clean}'
                    elif 'data/guides' in fname:
                        s_clean = f'guides/{s_clean}'
                    elif 'explainers/' in fname:
                        s_clean = f'explainers/{s_clean}'
                    elif 'toolPages/' in fname:
                        s_clean = f'tools/{s_clean}'
                routes.append(f'/{s_clean}')
            is_bio = routine == 'people-radar' or bool(BIOGRAPHY_PATH_RE.search(fname))
            is_exempt = is_reg or is_bio

            for route in routes:
                rkeys = _route_keys_for_filename_or_route(route)
                if any(rk in emitted_by_route_key for rk in rkeys):
                    continue
                carried = next((carryover_by_key[rk] for rk in rkeys if rk in carryover_by_key), None)
                if carried is not None:
                    ev_copy = dict(carried)
                    ev_copy['commitSha'] = sha[:10]
                    ev_copy['timestamp'] = committed_at or ev_copy.get('timestamp')
                    _upsert_event(ev_copy, rkeys, page_text=full_txt or patch_added, ref=sha or branch)
                    continue

                why_not = None
                if not has_internal:
                    if is_bio:
                        why_not = 'Valid exemption: public-figure biographical profile/update.'
                    elif is_reg:
                        why_not = 'Valid domain exemption: regulated medical/psychedelic/legal/policy publication.'
                    elif pool_presented:
                        why_not = 'Pool was presented in prompt artifacts, but draft published using external primary sources only.'
                    else:
                        why_not = 'Published without pool receipt (routine ran prior to pool rollout or bypassed write-packet builder).'

                ev = {
                    'timestamp': committed_at,
                    'site': CANONICAL_SITE_INFO.get(full_repo, (full_repo.split('/')[-1], ''))[0],
                    'repoFull': full_repo,
                    'commitSha': sha[:10],
                    'routine': routine,
                    'route': route,
                    'pageCategory': (
                        'public-figure-biography'
                        if is_bio
                        else ('regulated-domain' if is_reg else 'content-publish')
                    ),
                    'usedInternalProof': has_internal,
                    'proofTypesUsed': detected_types if has_internal else [],
                    'poolPresented': pool_presented,
                    'legitimateExemption': is_exempt,
                    'whyNotUsed': why_not,
                    'publishedStatus': 'published',
                }
                commit_events.append((ev, full_txt or patch_added))

        if had_concrete_slug or any(str(ev.get('route') or '').startswith('/') for ev, _ in commit_events):
            commit_events = [(ev, txt) for ev, txt in commit_events if str(ev.get('route') or '').startswith('/')]
        for ev, txt in commit_events:
            rkeys = _route_keys_for_filename_or_route(str(ev.get('route') or ''))
            if any(rk in emitted_by_route_key for rk in rkeys):
                continue
            _upsert_event(ev, rkeys, page_text=txt, ref=sha or branch)
    return events


def format_ceo_summary(report: dict) -> str:
    """Render the concise Daily CEO Summary markdown from a `run_monitor` report dict."""
    sc = report.get('fleetScorecard') or {}
    total = sc.get('totalNewPages', 0)
    strong = sc.get('strongPages', 0)
    thin = sc.get('thinPages', 0)
    empty = sc.get('emptyPages', 0)
    exempt = sc.get('exemptPages', 0)

    lines = [
        f"# Fleet Daily Internal-Proof Presence + Quality Monitor (Last {report.get('windowHours', 24):.0f}h)",
        f"**Checked At:** `{report.get('checkedAt')}` · **Owned Fleet Sites Scanned:** `{report.get('fleetReposScanned')}` · **Guardrails:** Client repos excluded (`0` touched), zero-block observational mode active.",
        '',
        '## 1. Overall Fleet Scorecard',
        '| Metric | Count | Share of Total | Standard / Action |',
        '|---|---:|---:|---|',
        f'| **Total New Pages** | **{total}** | **100.0%** | Across {len(report.get("siteBreakdown") or {})} active owned fleet sites in last {report.get("windowHours", 24):.0f}h |',
        f'| **Strong (`strong`)** | **{strong}** | **{(strong / max(total, 1)) * 100:.1f}%** | Passed 90%+ 5-signal quality standard (substantive math/proof, 150w+ depth, above-the-fold, wired Publisher\'s Take, matching tool) |',
        f'| **Published-But-Thin (`thin`)** | **{thin}** | **{(thin / max(total, 1)) * 100:.1f}%** | Passed Zero-Block rule with real proof, but missed 1+ quality signals (needs refresh/routine tuning) |',
        f'| **Empty / Bypassed (`empty`)** | **{empty}** | **{(empty / max(total, 1)) * 100:.1f}%** | Tagline-only boilerplate false positives or published without substantive internal proof |',
        f'| **Valid Exemptions (`exempt`)** | **{exempt}** | **{(exempt / max(total, 1)) * 100:.1f}%** | Regulated medical/psychedelic/legal/policy explainers, fixed launch schedules, or public-figure biographies |',
        '',
        '## 2. Routine & Site Hotspots (Last 24h)',
        '### By Routine',
        '| Routine | Total | Strong | Thin | Empty | Exempt | #1 Recurring Quality Gap |',
        '|---|---:|---:|---:|---:|---:|---|',
    ]
    for rh in (report.get('routineHotspots') or []):
        lines.append(
            f"| `{rh['routine']}` | {rh['totalPublished']} | {rh['strong']} | {rh['thin']} | {rh['empty']} | {rh['exempt']} | {rh['topReason']} |"
        )

    lines.extend([
        '',
        '### By Site',
        '| Owned Fleet Site | Total | Strong | Thin | Empty | Exempt | #1 Recurring Quality Gap |',
        '|---|---:|---:|---:|---:|---:|---|',
    ])
    for sh in (report.get('siteHotspots') or []):
        lines.append(
            f"| `{sh['site']}` | {sh['totalPublished']} | {sh['strong']} | {sh['thin']} | {sh['empty']} | {sh['exempt']} | {sh['topReason']} |"
        )

    lines.extend([
        '',
        '## 3. Top Action List (Exact URLs Queued for Quick Quality Upgrade)',
    ])
    for idx, act in enumerate((report.get('topActionList') or [])[:25], 1):
        flags_str = ', '.join(act.get('qualityFlags') or [])
        lines.append(f"{idx}. **{act['url']}** (`{act['qualityTier']}` · `{act['routine']}`) — {flags_str}")

    return '\n'.join(lines)


def run_monitor(hours: float = 24.0, sync_local: bool = True) -> dict:
    now = dt.datetime.now(dt.timezone.utc)
    cutoff = now - dt.timedelta(hours=hours)
    since_iso = cutoff.replace(microsecond=0).isoformat().replace('+00:00', 'Z')

    repos = _discover_fleet_repos()
    synced_local_count = _sync_local_scratch_repos(repos) if sync_local else 0

    by_canonical_key: dict[tuple[str, str], dict] = {}

    # 1. Read local `~/.claude/logs/internal-proof-log.jsonl` (filtering out excluded client repos)
    local_log = Path.home() / '.claude/logs/internal-proof-log.jsonl'
    if local_log.is_file():
        for ln in local_log.read_text(errors='ignore').splitlines():
            if not ln.strip():
                continue
            try:
                rec = json.loads(ln)
                if (
                    str(rec.get('repo') or '').startswith('tmp')
                    or str(rec.get('jobId') or '').startswith('test-')
                    or rec.get('routine') == 'Synthetic test fixture'
                ):
                    continue
                full_repo = _canonical_repo_for_name(str(rec.get('repoFull') or rec.get('repo') or rec.get('site') or ''))
                if not full_repo or full_repo == 'EXCLUDED' or full_repo in EXCLUDED_CLIENT_REPOS:
                    continue
                rec = _normalize_logged_exemption(rec, full_repo)
                ts_str = str(rec.get('timestamp') or '')
                ts = dt.datetime.fromisoformat(ts_str.replace('Z', '+00:00'))
                if ts >= cutoff:
                    scored = evaluate_page_quality(rec, full_repo)
                    norm_rt = '/' + str(scored.get('route') or '').strip('/')
                    leaf_rt = '/' + norm_rt.strip('/').split('/')[-1]
                    by_canonical_key[(full_repo, leaf_rt)] = scored
            except Exception:
                pass

    # 2. Scan all 35 owned fleet repos on GitHub + synced local checkouts in parallel
    with ThreadPoolExecutor(max_workers=10) as pool:
        for repo_events in pool.map(lambda r: _scan_repo_window(r, since_iso), repos):
            for ev in repo_events:
                full_repo = str(ev.get('repoFull') or _canonical_repo_for_name(str(ev.get('site') or '')))
                if full_repo in EXCLUDED_CLIENT_REPOS or full_repo == 'EXCLUDED':
                    continue
                norm_rt = '/' + str(ev.get('route') or '').strip('/')
                leaf_rt = '/' + norm_rt.strip('/').split('/')[-1]
                ckey = (full_repo, leaf_rt)
                prev = by_canonical_key.get(ckey)
                if prev is None:
                    by_canonical_key[ckey] = ev
                else:
                    # Prefer the more specific route path (e.g. `/guides/foo` over `/foo`) and latest proof state
                    if len(norm_rt) > len('/' + str(prev.get('route') or '').strip('/')):
                        by_canonical_key[ckey] = ev
                    elif ev.get('usedInternalProof') and not prev.get('usedInternalProof'):
                        by_canonical_key[ckey] = ev

    all_events = list(by_canonical_key.values())

    strong_pages = [e for e in all_events if e.get('qualityTier') == 'strong']
    thin_pages = [e for e in all_events if e.get('qualityTier') == 'thin']
    empty_pages = [e for e in all_events if e.get('qualityTier') == 'empty']
    exempt_pages = [e for e in all_events if e.get('qualityTier') == 'exempt']

    # Backward-compatible lists
    with_proof = [e for e in all_events if e.get('usedInternalProof')]
    empty_exempt = [e for e in all_events if e.get('qualityTier') == 'exempt']
    empty_actionable = [e for e in all_events if e.get('qualityTier') == 'empty']

    by_routine: dict[str, dict] = {}
    routine_flags: dict[str, Counter] = {}
    by_site: dict[str, dict] = {}
    site_flags: dict[str, Counter] = {}

    for e in all_events:
        rt_raw = str(e.get('routine') or 'unknown')
        rt_fam = _normalize_routine_label(rt_raw)
        site_name = str(e.get('site') or 'unknown')
        tier = str(e.get('qualityTier') or 'empty')
        qflags = list(e.get('qualityFlags') or [])

        for key_label, store, flag_store in ((rt_fam, by_routine, routine_flags), (site_name, by_site, site_flags)):
            bucket = store.setdefault(
                key_label,
                {
                    'totalPublished': 0,
                    'withInternalProof': 0,
                    'emptyExempt': 0,
                    'emptyActionable': 0,
                    'strong': 0,
                    'thin': 0,
                    'empty': 0,
                    'exempt': 0,
                    'topQualityGap': None,
                },
            )
            bucket['totalPublished'] += 1
            if e.get('usedInternalProof'):
                bucket['withInternalProof'] += 1
            if tier in ('strong', 'thin', 'empty', 'exempt'):
                bucket[tier] += 1
            if tier == 'exempt':
                bucket['emptyExempt'] += 1
            elif tier == 'empty':
                bucket['emptyActionable'] += 1
            if tier in ('thin', 'empty'):
                c = flag_store.setdefault(key_label, Counter())
                for fl in qflags:
                    c[fl] += 1

    for rt_k, bucket in by_routine.items():
        c = routine_flags.get(rt_k)
        if c:
            top_fl, top_cnt = c.most_common(1)[0]
            bucket['topQualityGap'] = f'{top_fl} ({top_cnt} pages)'

    for st_k, bucket in by_site.items():
        c = site_flags.get(st_k)
        if c:
            top_fl, top_cnt = c.most_common(1)[0]
            bucket['topQualityGap'] = f'{top_fl} ({top_cnt} pages)'

    routine_hotspots = [
        {
            'routine': k,
            **v,
            'topReason': v['topQualityGap'] or 'none',
        }
        for k, v in sorted(by_routine.items(), key=lambda kv: (kv[1]['empty'] + kv[1]['thin'], kv[1]['empty']), reverse=True)
        if (v['empty'] + v['thin']) > 0
    ]

    site_hotspots = [
        {
            'site': k,
            **v,
            'topReason': v['topQualityGap'] or 'none',
        }
        for k, v in sorted(by_site.items(), key=lambda kv: (kv[1]['empty'] + kv[1]['thin'], kv[1]['empty']), reverse=True)
        if (v['empty'] + v['thin']) > 0
    ]

    # Top Action List: prioritize `empty` pages first (tagline-only / no proof), then `thin` pages with most flags / lowest score
    action_candidates = sorted(
        empty_pages + thin_pages,
        key=lambda e: (
            0 if e.get('qualityTier') == 'empty' else 1,
            (e.get('qualitySignals') or {}).get('qualityScorePct', 0),
            -len(e.get('qualityFlags') or []),
            str(e.get('site') or ''),
            str(e.get('route') or ''),
        ),
    )
    top_action_list = [
        {
            'url': e.get('url'),
            'site': e.get('site'),
            'route': e.get('route'),
            'routine': _normalize_routine_label(str(e.get('routine') or '')),
            'qualityTier': e.get('qualityTier'),
            'qualityScorePct': (e.get('qualitySignals') or {}).get('qualityScorePct', 0),
            'qualityFlags': e.get('qualityFlags') or [],
        }
        for e in action_candidates
    ]

    report = {
        'checkedAt': now.replace(microsecond=0).isoformat().replace('+00:00', 'Z'),
        'windowHours': hours,
        'since': since_iso,
        'fleetReposScanned': len(repos),
        'localCheckoutsSynced': synced_local_count,
        'totalPagesPublished': len(all_events),
        'pagesWithInternalProof': len(with_proof),
        'pagesEmptyLegitimateExemption': len(empty_exempt),
        'pagesEmptyActionable': len(empty_actionable),
        'fleetScorecard': {
            'totalNewPages': len(all_events),
            'strongPages': len(strong_pages),
            'thinPages': len(thin_pages),
            'emptyPages': len(empty_pages),
            'exemptPages': len(exempt_pages),
        },
        'routineBreakdown': by_routine,
        'siteBreakdown': by_site,
        'routineHotspots': routine_hotspots,
        'siteHotspots': site_hotspots,
        'topActionList': top_action_list,
        'strongPages': strong_pages,
        'thinPages': thin_pages,
        'emptyPages': empty_pages,
        'exemptPages': exempt_pages,
        'actionableEmptyPages': empty_actionable,
        'exemptEmptyPages': empty_exempt,
        'withProofPages': with_proof,
    }
    report['ceoSummaryMarkdown'] = format_ceo_summary(report)
    return report


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--hours', type=float, default=24.0, help='Lookback window in hours (default: 24.0)')
    p.add_argument('--summary', action='store_true', help='Print concise CEO daily summary markdown instead of raw JSON')
    args = p.parse_args()
    report = run_monitor(hours=args.hours)
    if args.summary:
        print(report['ceoSummaryMarkdown'])
    else:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
