from pathlib import Path
import json,re,urllib.request,sys,datetime
run=Path('reports/mindmap-pass/2026-11-04-aca-snap');service='srv-d901evv7f7vs739n02b0';root='https://api.render.com/v1/services/'+service
secret=(Path.home()/'.claude/new-site.env').read_text();match=re.search(r'^\s*(?:export\s+)?RENDER_API_KEY\s*=\s*[\'"]?([^\'"\s]+)',secret,re.M)
assert match,'Owner Render credential unavailable'
headers={'Authorization':'Bearer '+match.group(1),'Accept':'application/json'}
with urllib.request.urlopen(urllib.request.Request(root+'/deploys?limit=5',headers=headers),timeout=30) as response:rows=json.load(response)
expected=sys.argv[1] if len(sys.argv)>1 else None
match_deploy=next((row['deploy'] for row in rows if (row['deploy'].get('commit') or {}).get('id')==expected),None) if expected else rows[0]['deploy']
now=datetime.datetime.now(datetime.timezone.utc).isoformat();record={'expectedCommit':expected,'verifiedAt':now,'serviceId':service,'deploy':match_deploy,'latestDeploy':{k:rows[0]['deploy'].get(k) for k in ['id','status','commit','createdAt','finishedAt']}}
(run/'internal/host-latest.json').write_text(json.dumps(record,indent=2)+'\n')
if match_deploy and match_deploy.get('status')=='live' and expected:
 evidence={'commit':expected,'status':'live','evidenceUrl':root+'/deploys/'+match_deploy['id'],'verifiedAt':now,'serviceId':service,'deploymentId':match_deploy['id'],'hostResponseFile':str(run/'internal/host-latest.json')};(run/'deployment-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
print(json.dumps({'expectedCommit':expected,'status':match_deploy.get('status') if match_deploy else 'not-seen','deployId':match_deploy.get('id') if match_deploy else None,'latestCommit':(rows[0]['deploy'].get('commit') or {}).get('id')}))
