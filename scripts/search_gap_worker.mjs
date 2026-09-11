#!/usr/bin/env node
/**
 * Unanswered-demand reader — fleet-portable port of layer3's scripts/search_gap_worker.mts
 * (plain Node, no tsx). Data source for the search-gap-content-auto routine.
 *
 * Reads the shared Supabase `search_queries` table (the same one the nav search box writes
 * to through growth-sites-api, and the daily digest reads) and returns EVERY zero-result
 * search for THIS site in the window, aggregated by term. It filters NOTHING — no relevance,
 * novelty, or coverage judgement here. Mindmap decides. (Pre-filters here have silently
 * killed real demand twice on layer3; see that repo's routine notes.)
 *
 *   node scripts/search_gap_worker.mjs list-gaps --days 1 --limit 200
 *
 * Output: { ok, site, since, candidateCount, candidates: [{ term, kind:'search', count, firstSeen, lastSeen, paths }] }
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (missing → { ok:false, skipped:true }, exit 0),
 *      SEARCH_SITE (the `site` value the API stores — the bare hostname, e.g. thebotscout.com).
 */
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SITE = process.env.SEARCH_SITE || 'themodernwallet.com';
const out = (o) => process.stdout.write(JSON.stringify(o) + '\n');
const arg = (n, f) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : f; };
const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

async function listGaps() {
  if (!SUPABASE_URL || !KEY) return out({ ok: false, skipped: true, reason: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY unset' });
  const days = Math.max(1, Number(arg('days', '1')));
  const limit = Math.max(1, Number(arg('limit', '5000')));
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const p = new URLSearchParams({
    select: 'term,results_count,path,source,created_at',
    site: `eq.${SITE}`,
    or: '(results_count.eq.0,source.eq.chatbot)',
    created_at: `gte.${since}`,
    order: 'created_at.asc',
    limit: '5000',
  });
  const r = await fetch(`${SUPABASE_URL}/rest/v1/search_queries?${p}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!r.ok) return out({ ok: false, error: `supabase ${r.status}` });
  const rows = await r.json();
  const map = new Map();
  for (const row of rows) {
    const isChat = (row.source || 'nav_search') === 'chatbot';
    if (!isChat && row.results_count !== 0) continue;
    const term = norm(row.term); if (term.length < 2) continue;
    const k = (isChat ? 'chat:' : 'search:') + term;
    const cur = map.get(k) || { term, kind: isChat ? 'chat' : 'search', count: 0, firstSeen: row.created_at, lastSeen: row.created_at, paths: {} };
    cur.count++; if (row.created_at > cur.lastSeen) cur.lastSeen = row.created_at; if (row.created_at < cur.firstSeen) cur.firstSeen = row.created_at;
    if (row.path) cur.paths[row.path] = (cur.paths[row.path] || 0) + 1;
    map.set(k, cur);
  }
  const candidates = [...map.values()].sort((a, b) => b.count - a.count || a.term.localeCompare(b.term)).slice(0, limit)
    .map((c) => ({ ...c, paths: Object.entries(c.paths).sort((a, b) => b[1] - a[1]).map(([path, n]) => ({ path, n })) }));
  out({ ok: true, site: SITE, since, days, candidateCount: candidates.length, candidates });
}
const cmd = process.argv[2];
if (cmd === 'list-gaps') listGaps().catch((e) => { out({ ok: false, error: String(e?.message || e) }); });
else { out({ ok: false, error: 'usage: search_gap_worker.mjs list-gaps [--days N] [--limit N]' }); process.exit(1); }
