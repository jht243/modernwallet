#!/usr/bin/env node
// Fast syntax gate for edited data files — parse only, ~1s per file.
//
// The 2026-10-04 run spent ~90s per page on `npx tsc --noEmit -p .`, which reports
// 16,000+ pre-existing project errors and so proves nothing about the edit. One
// unbalanced quote in a data file breaks EVERY deploy, so what matters is that the
// file still parses. Uses the repo's typescript, or installs it once into /tmp.
//
// Usage: node scripts/rank_drop/syntax_check.mjs data/comparisons-new.ts [more files]
import { createRequire } from 'module'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

function loadTs () {
  try { return createRequire(path.resolve('package.json'))('typescript') } catch {}
  const dir = '/tmp/rank-drop-ts'
  if (!fs.existsSync(`${dir}/node_modules/typescript`)) {
    execSync(`npm i --silent --no-audit --no-fund --prefix ${dir} typescript@5`, { stdio: 'ignore' })
  }
  return createRequire(`${dir}/package.json`)('typescript')
}

const ts = loadTs()
let bad = 0
for (const f of process.argv.slice(2)) {
  const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const diags = sf.parseDiagnostics || []
  for (const d of diags.slice(0, 10)) {
    const { line, character } = sf.getLineAndCharacterOfPosition(d.start)
    console.log(`${f}:${line + 1}:${character + 1} ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`)
  }
  if (diags.length) bad++
  else console.log(`OK ${f}`)
}
process.exit(bad ? 1 : 0)
