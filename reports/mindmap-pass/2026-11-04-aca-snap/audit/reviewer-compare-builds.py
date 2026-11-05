from pathlib import Path
import json,importlib.util,hashlib
repo=Path.cwd();run=repo/'reports/mindmap-pass/2026-11-04-aca-snap';info=json.loads((run/'internal/publication-paths.json').read_text());base=Path(info['baseline'])/'dist';candidate=Path(info['root'])/'candidate/dist';spec=importlib.util.spec_from_file_location('rendered',repo/'.claude/tools/rendered-audit.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
def collect(root):
 out={}
 for p in sorted(root.rglob('*.html')):
  rel=p.relative_to(root).as_posix();route='/' if rel=='index.html' else '/'+rel[:-10] if rel.endswith('index.html') else '/'+rel
  html=p.read_text();record=mod.parse(html,{'path':route},'https://www.themodernwallet.com','https://www.themodernwallet.com',200)
  out[route]=record
 return out
b=collect(base);c=collect(candidate);changed=[p for p in b.keys()&c.keys() if b[p]['fingerprint']!=c[p]['fingerprint']];new=sorted(c.keys()-b.keys());removed=sorted(b.keys()-c.keys());same=sorted(p for p in b.keys()&c.keys() if b[p]['fingerprint']==c[p]['fingerprint']);record={'baselineRevision':info['baseRevision'],'existingRoutesInspected':len(b),'candidateRoutesInspected':len(c),'unchangedRoutes':same,'changedRoutes':sorted(changed),'newRoutes':new,'removedRoutes':removed,'allRoutes':{p:{'before':b.get(p,{}).get('fingerprint'),'after':c.get(p,{}).get('fingerprint'),'failures':c.get(p,{}).get('failures',[])} for p in sorted(b.keys()|c.keys())}}
(run/'audit/reviewer-all-route-comparison-v2.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({k:v for k,v in record.items() if k not in ['unchangedRoutes','allRoutes']},indent=2))
