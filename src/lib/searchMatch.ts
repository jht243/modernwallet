/**
 * Shared search-rescue helpers — the "did you mean" layer that keeps a near-miss
 * query from returning nothing.
 *
 * Used by BOTH search surfaces so they never diverge:
 *   - src/components/layout/NavSearch (client, fetches /search-aliases.json)
 *   - src/lib/chatAssist.ts (server, reads data/search-aliases.json via fs)
 *
 * It runs ONLY as a fallback — after a strict search returns zero results — so a
 * query that already works is never touched. Two rescues, in order:
 *   1. Alias replacement — a curated, data-driven map ({ "deep": ["deepseek"] }).
 *      The search-gap routine appends to this map whenever it decides a 0-result
 *      term is actually something we ALREADY publish (so we fix search instead of
 *      writing a duplicate page).
 *   2. Fuzzy correction — a bounded edit-distance match against the site's own
 *      vocabulary, to rescue plain typos ("deepseak" -> "deepseek").
 *
 * Pure + dependency-free so it bundles into the client with no cost.
 */

export type AliasMap = Record<string, string[]>

/** Tokenizer shared with the index — keeps dots/plus/hash (gpt-4o, c++, c#). */
export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9.+#]+/)
    .filter(Boolean)
}

/**
 * Normalize a raw parsed JSON object into an AliasMap. Accepts either
 * { alias: "target" } or { alias: ["t1", "t2"] }; drops anything malformed.
 * Keys are lowercased. Safe to call on unknown/untrusted input.
 */
export function normalizeAliasMap(raw: unknown): AliasMap {
  const out: AliasMap = {}
  if (!raw || typeof raw !== 'object') return out
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const key = String(k).toLowerCase().trim()
    // Skip blanks and "_comment"-style doc keys.
    if (!key || key.startsWith('_')) continue
    const list = Array.isArray(v) ? v : [v]
    const targets = list
      .map((x) => String(x).toLowerCase().trim())
      .filter(Boolean)
    if (targets.length) out[key] = targets
  }
  return out
}

/** Levenshtein with an early exit once the distance exceeds `max`. */
function boundedEditDistance(a: string, b: string, max: number): number {
  const al = a.length
  const bl = b.length
  if (Math.abs(al - bl) > max) return max + 1
  let prev = new Array(bl + 1)
  let cur = new Array(bl + 1)
  for (let j = 0; j <= bl; j++) prev[j] = j
  for (let i = 1; i <= al; i++) {
    cur[0] = i
    let rowMin = cur[0]
    const ac = a.charCodeAt(i - 1)
    for (let j = 1; j <= bl; j++) {
      const cost = ac === b.charCodeAt(j - 1) ? 0 : 1
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
      if (cur[j] < rowMin) rowMin = cur[j]
    }
    if (rowMin > max) return max + 1
    ;[prev, cur] = [cur, prev]
  }
  return prev[bl]
}

/**
 * Best single-word correction of `token` against `vocab`, or null. Longer tokens
 * are allowed a distance of 2, shorter ones 1. Prefix matches (the typo starts
 * the real word) are preferred as a tie-breaker.
 */
export function fuzzyCorrect(token: string, vocab: Set<string>): string | null {
  if (token.length < 4 || vocab.has(token)) return null
  const maxD = token.length >= 7 ? 2 : 1
  let best: string | null = null
  let bestD = maxD + 1
  let bestPrefix = false
  for (const w of Array.from(vocab)) {
    if (Math.abs(w.length - token.length) > maxD) continue
    const d = boundedEditDistance(token, w, maxD)
    if (d > maxD) continue
    const prefix = w.startsWith(token) || token.startsWith(w)
    if (d < bestD || (d === bestD && prefix && !bestPrefix)) {
      best = w
      bestD = d
      bestPrefix = prefix
      if (d === 1 && prefix) break
    }
  }
  return best
}

/**
 * Given the tokens of a query that returned NOTHING, produce an alternate token
 * set via alias replacement then fuzzy correction. Returns null when nothing
 * could be rescued (so the caller keeps the honest empty result).
 */
export function rescueTerms(
  terms: string[],
  aliases: AliasMap,
  vocab: Set<string>
): string[] | null {
  let changed = false
  const out: string[] = []
  for (const t of terms) {
    const alias = aliases[t]
    if (alias && alias.length) {
      for (const target of alias) out.push(...tokenize(target))
      changed = true
      continue
    }
    const fixed = fuzzyCorrect(t, vocab)
    if (fixed && fixed !== t) {
      out.push(fixed)
      changed = true
      continue
    }
    out.push(t)
  }
  return changed ? Array.from(new Set(out)) : null
}
