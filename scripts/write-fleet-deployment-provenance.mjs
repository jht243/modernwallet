/** Machine-only provider source stamp. No credentials or audience-facing copy. */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function stamp(root=process.cwd(),env=process.env) {
  const config=JSON.parse(readFileSync(path.join(root,'.claude/deployment-evidence.json'),'utf8'))
  const target=path.join(root,'public/.well-known/fleet-deployment.json')
  if(env.RENDER!=='true'||!['static','web'].includes(env.RENDER_SERVICE_TYPE)||env.IS_PULL_REQUEST==='true') {
    rmSync(target,{force:true});return {written:false}
  }
  if(env.RENDER_GIT_BRANCH!==config.branch||(env.RENDER_GIT_REPO_SLUG||'').toLowerCase()!==config.repository.toLowerCase())throw Error('Wrong production source identity')
  const commit=env.RENDER_GIT_COMMIT||''
  if(!/^[a-f0-9]{40}$/.test(commit)||execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()!==commit)throw Error('Provider source does not match the actual build')
  const value={schemaVersion:1,provider:'render',serviceType:env.RENDER_SERVICE_TYPE,repository:config.repository,branch:config.branch,commit,builtAt:new Date().toISOString()}
  mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,JSON.stringify(value,null,2)+'\n');return {written:true,commit}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(stamp())) } catch(error) {console.error(error.message);process.exitCode=1}
}
