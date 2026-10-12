#!/usr/bin/env node
// Fast pre-push gate for data/*.ts — parse errors AND duplicate keys in one object literal.
//
// WHY: on 2026-10-12 a mindmap pass (dde568d2) inserted a new guide INSIDE the previous
// _entries.push({...}) in data/guides-new.ts — its anchor ("publishedDate"/"updatedDate"
// + "});") matched the prior entry's tail. The file still PARSED, so a parse-only check
// passes it, but tsc rejects duplicate properties ("An object literal cannot have multiple
// properties with the same name"), so every Render build failed for 7 hours (5 routine
// pushes stranded) until a later run repaired it. Full-project `tsc --noEmit` reports 16k
// pre-existing errors here and takes minutes, so this checks only what breaks the deploy.
//
// Usage: node scripts/check_data_files.mjs data/guides-new.ts [more .ts files]
// Exit 0 = all clean, 1 = at least one file has a parse error or duplicate key.
import { createRequire } from 'module'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

function loadTs () {
  try { return createRequire(path.resolve('package.json'))('typescript') } catch {}
  // Check package.json, not the folder: a tmp cleaner can leave a half-deleted install behind.
  const dir = '/tmp/check-data-files-ts'
  if (!fs.existsSync(`${dir}/node_modules/typescript/package.json`)) {
    fs.rmSync(`${dir}/node_modules/typescript`, { recursive: true, force: true })
    execSync(`npm i --silent --no-audit --no-fund --prefix ${dir} typescript@5`, { stdio: 'ignore' })
  }
  return createRequire(`${dir}/package.json`)('typescript')
}

let ts
try { ts = loadTs() } catch (e) {
  // Fail OPEN: a missing toolchain must never block a deploy — only a real data break should.
  console.error(`[check_data_files] WARN: could not load typescript (${e.message.split('\n')[0]}); skipping check`)
  process.exit(0)
}

function propName (p) {
  const n = p.name
  if (!n) return null
  if (ts.isIdentifier(n) || ts.isStringLiteral(n) || ts.isNumericLiteral(n) || ts.isPrivateIdentifier(n)) return n.text
  return null // computed keys can't be compared statically
}

let bad = 0
for (const f of process.argv.slice(2)) {
  if (!fs.existsSync(f)) continue // deleted in this run
  const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const errs = []
  for (const d of (sf.parseDiagnostics || []).slice(0, 10)) {
    errs.push([d.start, ts.flattenDiagnosticMessageText(d.messageText, ' ')])
  }
  const visit = node => {
    if (ts.isObjectLiteralExpression(node)) {
      const seen = new Map()
      for (const p of node.properties) {
        if (!(ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p) || ts.isMethodDeclaration(p))) continue
        const k = propName(p)
        if (k == null) continue
        if (seen.has(k)) errs.push([p.getStart(sf), `duplicate key "${k}" (first at line ${sf.getLineAndCharacterOfPosition(seen.get(k)).line + 1}) — two entries merged?`])
        else seen.set(k, p.getStart(sf))
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  for (const [pos, msg] of errs.slice(0, 20)) {
    const { line, character } = sf.getLineAndCharacterOfPosition(pos)
    console.log(`${f}:${line + 1}:${character + 1} ${msg}`)
  }
  if (errs.length) bad++
  else console.log(`OK ${f}`)
}
process.exit(bad ? 1 : 0)
