import json,hashlib
from pathlib import Path
R=Path('reports/mindmap-pass/2026-11-04-aca-snap');rows=[]
for c in json.loads((R/'draft-word-counts.json').read_text()):
 slug=c['slug'];p=R/'drafts'/f'{slug}.json';meta=json.loads(Path(str(p)+'.meta.json').read_text());rows.append({**c,'draft':str(p),'draftSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'model':meta['model'],'fallbackUsed':meta['fallback_used'],'fallbackReason':meta.get('fallback_reason'),'writerMeta':str(p)+'.meta.json','fixRounds':len(meta['guards'].get('fixes',[])),'guardFlags':meta['guards'].get('flags',[]),'latestFixFlags':meta['guards'].get('fixes',[{}])[-1].get('flags',[])})

for row in rows:
 if row['slug']=='snap-benefits-calculator' and (R/'internal/n1-rework2.json').exists():
  row['substantiveReworks']=2;row['reworkReceipts']=['internal/n1-rework1.json','internal/n1-rework2.json'];row['additionalProvenance']=['drafts/n1-base-snippets.md.meta.json','drafts/n1-rhythm-rework2.md.meta.json']
 elif row['slug']=='snap-benefits-calculator' and (R/'internal/n1-rework1.json').exists():
  row['substantiveReworks']=1;row['reworkReceipt']='internal/n1-rework1.json';row['additionalProvenance']='drafts/n1-base-snippets.md.meta.json'
(R/'writer-handoff.json').write_text(json.dumps({'actor':'benefits_content','status':'Phase3 generated candidates; independent exact rendered Phase4 remains parent-owned','modules':['src/data/benefits-spokes.ts','src/data/benefits-comparisons.ts','src/data/benefits-guides.ts'],'moduleExports':['BENEFIT_SPOKES','BENEFIT_COMPARISONS','BENEFIT_GUIDES'],'rows':rows,'evidence':'evidence/<slug>/evidence.json and growth.json; shared executable calculate.py with inputs.json/calculation-output.json','preflight':'preflight-write-content completed32parts own actor; writer-preflight.json reused actualsame-runcheck','testing':'Excluded financial/program information; ordinary calculated/reported claims only','publication':'No worker commit/push/deploy; root owns reviews/links/build/liveverification'},indent=2)+'\n')
print(json.dumps(rows,indent=2))
