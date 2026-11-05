from pathlib import Path
import json,re,hashlib,statistics
r=Path('reports/mindmap-pass/2026-11-04-aca-snap');rows=[];depth=[]
for slug,floor in [('snap-benefits-calculator',1200),('aca-subsidy-calculator',1200),('snap-vs-wic',1500),('aca-vs-medicaid',1500),('how-to-apply-for-food-stamps',1200)]:
 p=r/'drafts'/f'{slug}.json';d=json.loads(p.read_text());fields=[d['introText']]+[z.get('body',z.get('content','')) for z in d['sections']]+([d['verdict']] if d.get('verdict') else [])+[z['answer'] for z in d['faqs']];units=[]
 for field in fields:
  t=re.sub(r'\[([^]]+)\]\([^)]*\)',r'\1',field)
  for ab in ['U.S.','U.K.','Oct.','Sept.']:t=t.replace(ab,ab.replace('.','∯'))
  for line in t.splitlines():
   if not line.strip() or line.lstrip().startswith('|'):continue
   line=re.sub(r'^\s*(?:- |\d+\. )','',line)
   for text in re.split(r'(?<=[.!?])\s+(?=[A-Z])',line):units.append({'text':text.replace('∯','.'),'words':len(text.split()),'terminalSentencePunctuation':bool(re.search(r'[.!?][\]\"\')]*$',text))})
 lengths=[u['words'] for u in units];band=lambda n:0 if n<9 else 1 if n<15 else 2
 ten=[i+1 for i in range(len(units)-9) if len({band(n) for n in lengths[i:i+10]})==1];rawfive=[i for i in range(len(units)-4) if max(lengths[i:i+5])-min(lengths[i:i+5])<=3];five=[];fragments=[]
 for i in rawfive:
  group=units[i:i+5]
  if all(not u['terminalSentencePunctuation'] for u in group):fragments.append({'startUnit':i+1,'units':group,'decision':'Not five sentences: this is a noun-only grocery list. No rhythm repair applies.'})
  else:five.append(i+1)
 assert not ten and not five,(slug,ten,five)
 rows.append({'slug':slug,'draftSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sentenceUnitLengths':lengths,'tenSentenceSingleBandRuns':ten,'fiveSentenceNearLengthRuns':five,'nonSentenceListCandidates':fragments,'status':'PASS'})
 parts=fields+d.get('commonMistakes',[])
 if d.get('comparisonTable'):parts += [str(z[k]) for z in d['comparisonTable']['rows'] for k in ['a','b']]
 words=len(re.sub(r'\[([^]]+)\]\([^)]*\)',r'\1','\n'.join(parts)).split());assert words>=floor
 depth.append({'slug':slug,'proseBodyWords':words,'floor':floor,'draftSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'status':'depth-floor-cleared'})
proof=json.dumps(rows)
assert 'FY2027 sets a $25 minimum for eligible one- or two-person households.' in (r/'drafts/snap-benefits-calculator.json').read_text()
assert 'Request a fair hearing by phone, in writing or at your SNAP office.' in (r/'drafts/how-to-apply-for-food-stamps.json').read_text()
(r/'audit/final-rhythm.json').write_text(json.dumps({'reviewer':'benefits_final_reviewer','method':'Abbreviations protected before measuring actual sentence units. Noun-only grocery-list fragments are reported separately and are not treated as five consecutive sentences. Original counter mistakes and superseded approvals remain preserved.','pages':rows,'status':'PASS'},indent=2)+'\n')
(r/'audit/final-depth.json').write_text(json.dumps({'reviewer':'benefits_final_reviewer','method':'Reader-facing source intro/sections/FAQ answers/verdict/common-mistake and comparison answer cells. Title, metadata, headings, CTA, nav, schema and code excluded.','pages':depth,'passing':5,'failing':0,'median':statistics.median(z['proseBodyWords'] for z in depth)},indent=2)+'\n')
print(json.dumps({'rhythm':'5 PASS; no actual ten-sentence single-band or five-sentence near-length violations','N3 noun-list candidate':'retained explicitly as non-sentences','depth':depth,'median':statistics.median(z['proseBodyWords'] for z in depth)},indent=2))
