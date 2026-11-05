from pathlib import Path
import json,subprocess,hashlib,os
repo=Path.cwd();run=repo/'reports/mindmap-pass/2026-11-04-aca-snap';selected=json.loads((run/'internal/selected-source.json').read_text())
assert not selected.get('partial'),'Partial candidates cannot be staged for publication'
assert (run/'final-render-review.json').exists(),'Independent final review required'
review=json.loads((run/'final-render-review.json').read_text());snapshot=json.loads((run/'final-snapshot.json').read_text());assert review['snapshotSha256']==snapshot['snapshotSha256']
subprocess.run(['python3','.claude/tools/rendered-audit.py','check','--snapshot',str(run/'final-snapshot.json'),'--review',str(run/'final-render-review.json'),'--recapture'],check=True)
remote=subprocess.check_output(['git','ls-remote','origin','refs/heads/main'],text=True).split()[0];assert remote==selected['baseRevision'],'Remote advanced: reconcile and review before publication'
index=run/'internal/publication.index';env={**os.environ,'GIT_INDEX_FILE':str(index)}
if index.exists():index.unlink()
subprocess.run(['git','read-tree',selected['baseRevision']],env=env,check=True)
blobs={}
def add(file,content):
 blob=subprocess.check_output(['git','hash-object','-w','--stdin'],input=content).decode().strip();subprocess.run(['git','update-index','--add','--cacheinfo','100644',blob,file],env=env,check=True);blobs[file]=blob
candidate=Path(selected['candidate'])
for file,sha in selected['selectedFiles'].items():
 content=(candidate/file).read_bytes();assert hashlib.sha256(content).hexdigest()==sha,'Selected source changed: '+file;add(file,content)
# Keep the complete honest run evidence, excluding unrelated source backups and large image artifacts.
for p in sorted(run.rglob('*')):
 if not p.is_file():continue
 rel=p.relative_to(run);parts=rel.parts
 if parts[0]=='root-before' or p.suffix.lower() in ['.png','.pdf'] or p.name in ['publication.index','publication-index.json'] or p.name.endswith('.lock'):continue
 if 'node_modules' in parts:continue
 add(str(p.relative_to(repo)),p.read_bytes())
chart=Path('reports/mindmap-pass/2026-11-04-aca-snap.md');add(str(chart),chart.read_bytes())
indexnow=Path('reports/mindmap-pass/2026-11-04-aca-snap.indexnow.txt');add(str(indexnow),indexnow.read_bytes())
tree=subprocess.check_output(['git','write-tree'],env=env,text=True).strip();changes=subprocess.check_output(['git','diff-tree','--no-commit-id','--name-status','-r',selected['baseRevision'],tree],text=True)
record={'baseRevision':selected['baseRevision'],'tree':tree,'index':str(index),'files':len(blobs),'blobs':blobs,'changes':changes,'status':'reviewed-tree-prepared-not-committed'};(run/'internal/publication-index.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({k:v for k,v in record.items() if k not in ['blobs','changes']},indent=2))
