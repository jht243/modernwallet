import json,re
from pathlib import Path
R=Path('reports/mindmap-pass/2026-11-04-aca-snap');manifest=json.loads((R/'approval-manifest.json').read_text());groups={'spokes':[],'comparisons':[],'guides':[]};counts=[]
for b in manifest['newPageBriefs']:
 slug=b['target'].strip('/').split('/')[-1];p=R/'drafts'/f'{slug}.json'
 if not p.exists():continue
 j=json.loads(p.read_text());j['updated']='2026-11-04'
 typ='spokes' if b['actionId'] in ['N1','N2'] else 'guides' if b['actionId']=='N5' else 'comparisons'
 if typ=='spokes':
  j.update(calculator='budget',islandId='snap-benefits' if b['actionId']=='N1' else 'aca-subsidy',howItWorks='',commonMistakes=[],suppressRelatedFallback=True)
  j['preset']={}
 if typ=='guides':j['published']='2026-11-04'
 body=' '.join([j.get('introText',''),j.get('verdict','')]+[s.get('body',s.get('content','')) for s in j.get('sections',[])]+[f['answer'] for f in j.get('faqs',[])])
 if typ=='comparisons':body+=' '+' '.join(str(v) for row in j.get('comparisonTable',{}).get('rows',[]) for k,v in row.items() if k in ['a','b'])
 plain=re.sub(r'\[([^]]+)\]\([^)]*\)',r'\1',body);plain=re.sub(r'[#*|]',' ',plain);wc=len(plain.split());counts.append({'slug':slug,'words':wc,'floor':b['identity']['bodyFloor'],'measured':'source prose incl table values excludes headings/meta/disclaimer'})
 groups[typ].append(j)
for typ,items in groups.items():
 if not items:continue
 interface={'spokes':('SpokeEntry','./types'),'comparisons':('ComparisonEntry','./comparisons'),'guides':('Guide','./guides')}[typ]
 (Path('src/data')/f'benefits-{typ}.ts').write_text(f'import type {{ {interface[0]} }} from "{interface[1]}";\n\nexport const BENEFIT_{typ.upper()}: {interface[0]}[] = '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
(R/'draft-word-counts.json').write_text(json.dumps(counts,indent=2)+'\n');print(json.dumps(counts,indent=2))
