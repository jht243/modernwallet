import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, existsSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { stamp } from './write-fleet-deployment-provenance.mjs'

test('only the actual provider checkout can stamp production provenance',()=>{
  const root=mkdtempSync(path.join(os.tmpdir(),'synthetic-deployment-'))
  try {
    mkdirSync(path.join(root,'.claude'))
    writeFileSync(path.join(root,'.claude/deployment-evidence.json'),JSON.stringify({repository:'synthetic/site',branch:'main'}))
    execFileSync('git',['init','-q'],{cwd:root})
    execFileSync('git',['-c','user.name=Fixture','-c','user.email=fixture@invalid','commit','--allow-empty','-qm','Synthetic fixture'],{cwd:root})
    const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()
    const env={RENDER:'true',RENDER_SERVICE_TYPE:'static',RENDER_GIT_BRANCH:'main',RENDER_GIT_REPO_SLUG:'synthetic/site',RENDER_GIT_COMMIT:commit}
    assert.equal(stamp(root,env).written,true)
    const target=path.join(root,'public/.well-known/fleet-deployment.json')
    assert.equal(JSON.parse(readFileSync(target,'utf8')).commit,commit)
    assert.throws(()=>stamp(root,{...env,RENDER_GIT_COMMIT:'1'.repeat(40)}))
    assert.throws(()=>stamp(root,{...env,RENDER_GIT_REPO_SLUG:'wrong/site'}))
    assert.equal(stamp(root,{}).written,false)
    assert.equal(existsSync(target),false)
  } finally {rmSync(root,{recursive:true,force:true})}
})
