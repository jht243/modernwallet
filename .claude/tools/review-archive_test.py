"""Storage/guard regression only; the fixture does not supply any editorial approval."""
import hashlib,importlib.util,json,os,shutil,subprocess,tempfile
from pathlib import Path
from unittest.mock import patch
original=Path.cwd()
def git(p,*a):return subprocess.check_output(['git','-C',str(p),*a],stderr=subprocess.PIPE)
def module(root):
 f=root/'.claude/tools/review-archive.py';spec=importlib.util.spec_from_file_location('evidence',f);x=importlib.util.module_from_spec(spec);spec.loader.exec_module(x);return x
with tempfile.TemporaryDirectory() as parent:
 home=Path(parent).resolve();remote=home/'remote.git';git(home,'init','-q','--bare','--initial-branch=main',str(remote))
 work=home/'first';git(home,'clone','-q',str(remote),str(work));git(work,'config','user.name','fixture');git(work,'config','user.email','fixture@invalid.test')
 t=work/'.claude/tools';t.mkdir(parents=True)
 for f in ['review-archive.py','content-review-durable.py','workflow-control-store.py']:
  shutil.copyfile(original/'.claude/tools'/f,t/f)
 (work/'.claude/content-review-policy.json').write_text('{}')
 (work/'src').mkdir();(work/'src/page.ts').write_text('original base');git(work,'add','.');git(work,'commit','-qm','base');git(work,'push','-q','origin','HEAD:main')
 base=git(work,'rev-parse','HEAD').decode().strip()
 src=work/'src/page.ts';src.write_text('reviewed article');css=work/'src/style.css';css.write_text('reviewed style')
 changes={'src/page.ts','src/style.css'}
 env={'CLAUDE_CODE_REMOTE_SESSION_ID':'fixture-real-git','CLAUDE_CODE_SESSION_ID':'fixture-real-git'}
 with patch.dict(os.environ,env):
  os.chdir(work);m=module(work)
  marker=m.marker(work,'search-gap-recovery/leases/');marker.parent.mkdir(parents=True);marker.write_text(json.dumps({'site':'fixture.test','run':'original-search','owner':'original-owner'}))
  rd=work/'reports';rd.mkdir();html=rd/'original.html';html.write_text('<main>reviewed fixture</main>');note=rd/'original.txt';note.write_text('original recorded finding')
  h=lambda file:hashlib.sha256(file.read_bytes()).hexdigest()
  snapshot=rd/'snapshot.json'
  snapshot.write_text(json.dumps({'manifest':{'canonicalBase':'https://fixture.test','workflowKind':'mindmap-pass','jobId':'article-job','reviewDependencies':[{'path':'reports/original.txt','sha256':h(note)}]},'baseUrl':'http://localhost:4455','reviewSourceArchive':m.snapshot_sources(work,rd),'routes':[{'path':'/fixture/','htmlFile':'reports/original.html','htmlSha256':h(html)}]}))
  review=rd/'review.json';review.write_text(json.dumps({'fixture':True,'history':[{'path':'reports/original.txt','sha256':h(note)}]}))
  try:m.require_search_archive(work,changes)
  except ValueError:pass
  else:raise AssertionError('Allowed publication before an archive')
  original_html=html.read_bytes();expected_src=src.read_bytes();expected_css=css.read_bytes();index=m.save_checked_pair(work,snapshot,review)
  assert index and len(index)==64
  git(work,'add','src');git(work,'commit','-qm','candidate kept off production')
  m.require_search_archive(work,changes)
  css.write_text('different unaudited style');git(work,'add','src/style.css');git(work,'commit','-qm','unreviewed edit')
  try:m.require_search_archive(work,changes)
  except ValueError as e:assert 'exact changed source' in str(e)
  else:raise AssertionError('Changed candidate accepted')
  # The source branch and reports were never pushed. Remove the original worker entirely.
  os.chdir(home);shutil.rmtree(work);fresh=home/'fresh';git(home,'clone','-q',str(remote),str(fresh));os.chdir(fresh)
  m=module(fresh);m.restore_package(fresh,'original-search');rec=fresh/'.git/review-recovery'/index
  assert (rec/'sources/src/page.ts').read_bytes()==expected_src and (rec/'sources/src/style.css').read_bytes()==expected_css
  assert (rec/'reports/original.html').read_bytes()==original_html and (rec/'reports/original.txt').is_file()
  assert json.loads((rec/'index.json').read_bytes())['baseCommit']==base
  # A fresh worker with a different lease owner can publish only the exact retained source.
  lease=m.marker(fresh,'search-gap-recovery/leases/');lease.parent.mkdir(parents=True,exist_ok=True)
  lease.write_text(json.dumps({'site':'fixture.test','run':'original-search','owner':'replacement-owner'}))
  for name in changes:shutil.copyfile(rec/'sources'/name,fresh/name)
  git(fresh,'config','user.name','fixture');git(fresh,'config','user.email','fixture@invalid.test')
  git(fresh,'add','src');git(fresh,'commit','-qm','restored original reviewed source')
  m.require_search_archive(fresh,changes)
  lease.write_text(json.dumps({'site':'different.test','run':'original-search','owner':'replacement-owner'}))
  try:m.require_search_archive(fresh,changes)
  except ValueError:pass
  else:raise AssertionError('Different site borrowed the original release')
  # An archive whose remote storage no longer contains the object must fail.
  try:m.verified_objects(fresh,base,[hashlib.sha256(original_html).hexdigest()])
  except ValueError as e:assert 'missing' in str(e)
  else:raise AssertionError('Missing remote evidence accepted')
  # Repaired pending slots carry invalidatedReferences in the journal; save_checked_pair
  # must propagate those invalidated references into persist() so a composed review does
  # not fail trying to walk an unavailable dependency inside the superseded snapshot.
  shutil.copyfile(original/'.claude/tools/content-review-policy.py',fresh/'.claude/tools/content-review-policy.py')
  (fresh/'.claude/content-review-policy.json').write_text(json.dumps({'version':'risk-review-budget-2026-11-08.1','siteId':'fixture','defaultProfile':'standard','minimumProfile':'standard','roundLimits':{'light':1,'standard':2,'high':3},'legacyInventory':{'path':'.claude/legacy.json','sha256':'0'*64},'scope':'test'}))
  (fresh/'.claude/legacy.json').write_text('{"version":"risk-review-budget-2026-11-08.1","pairs":[],"histories":[]}')
  rdir=fresh/'reports';rdir.mkdir(exist_ok=True)
  old_snap=rdir/'old-snap.json';old_snap.write_text(json.dumps({'manifest':{'reviewDependencies':[{'path':'reports/missing-draft.json','sha256':'a'*64}]}}))
  old_sha=hashlib.sha256(old_snap.read_bytes()).hexdigest()
  m.durable(fresh).cache(fresh,'reports/old-snap.json',old_sha,old_snap.read_bytes())
  old_snap.unlink()
  adm=rdir/'adm.json';adm.write_text(json.dumps({'identity':{'canonicalBase':'https://fixture.test','route':'/repaired'},'repairOf':{'path':'reports/old-snap.json','sha256':old_sha}}))
  adm_sha=hashlib.sha256(adm.read_bytes()).hexdigest()
  spec_p=importlib.util.spec_from_file_location('pol',fresh/'.claude/tools/content-review-policy.py');pol=importlib.util.module_from_spec(spec_p);spec_p.loader.exec_module(pol)
  j=pol.Journal(fresh,'https://fixture.test','/repaired')
  j.path.parent.mkdir(parents=True,exist_ok=True)
  j.path.write_text(
   json.dumps({'kind':'begin','identity':j.identity,'data':{}})+'\n'+
   json.dumps({'kind':'repair-pending','identity':j.identity,'data':{'invalidatedReferences':[{'path':'reports/old-snap.json','sha256':old_sha}]}})+'\n'
  )
  html2=rdir/'repaired.html';html2.write_text('<main>repaired</main>')
  snap2=rdir/'snap2.json';snap2.write_text(json.dumps({'manifest':{'canonicalBase':'https://fixture.test','workflowKind':'mindmap-pass','jobId':'repaired-job'},'baseUrl':'http://localhost:4455','reviewSourceArchive':m.snapshot_sources(fresh,rdir),'routes':[{'path':'/repaired','htmlFile':'reports/repaired.html','htmlSha256':hashlib.sha256(html2.read_bytes()).hexdigest()}]}))
  rev2=rdir/'rev2.json';rev2.write_text(json.dumps({'routes':[{'path':'/repaired','reviewBudget':{'path':'reports/adm.json','sha256':adm_sha}}]}))
  lease.write_text(json.dumps({'site':'fixture.test','run':'repaired-search','owner':'replacement-owner'}))
  idx2=m.save_checked_pair(fresh,snap2,rev2)
  assert idx2 and len(idx2)==64
  os.chdir(original)
