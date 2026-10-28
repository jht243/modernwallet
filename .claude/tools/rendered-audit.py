#!/usr/bin/env python3
"""Evidence-bound rendered-page release checks. Human review remains independent."""
import argparse
import concurrent.futures
import datetime as dt
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import urllib.request
from urllib.parse import urlsplit

CHECKS = {'wholePageCoherence', 'sourceSupport', 'testingAndAttribution', 'datesAndSchema', 'linksAndIndexability', 'renderedLayout', 'scopeAndExclusions'}
REQUIRED = CHECKS - {'testingAndAttribution', 'scopeAndExclusions'}
def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()
def read(path): return json.loads(Path(path).read_text())
def save(path, value):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
def require(condition, message):
    if not condition: raise ValueError(message)
def now(): return dt.datetime.now(dt.timezone.utc).isoformat()
def clean(text): return re.sub(r'\s+', ' ', text).strip()

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.text=[]; self.date_text=[]; self.headings=[]; self.links=[]; self.meta={}; self.schemas=[]; self.json=[]; self.is_json=False; self.title=[]; self.canonical=''; self.article=0; self.article_text=[]; self.structure=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in {'div','p','header','footer','article','main','section','li','aside','br','h1','h2','h3'}: self.date_text.append('\n')
        if tag not in {'script','style','noscript','meta','link','head','title'} and not any(t in self.stack for t in ['head','script','style','noscript']):
            keep = {k:v for k,v in a.items() if k in {'rel','target','class','hidden','min','max','step','placeholder','for','pattern','required','multiple','src','srcset','alt','type','value','checked','selected','disabled','aria-label','aria-hidden','role','colspan','rowspan','style','action','method','href','d','viewbox','points','cx','cy','r','x','y','width','height','fill','stroke','transform'}}
            self.structure.append([tag,keep])
        if tag not in {'meta','link','img','input','br','hr','source','wbr','area','base','embed','param','track','col'}: self.stack.append(tag)
        if tag in {'article','main'}: self.article+=1
        if tag=='meta' and (a.get('name') or a.get('property')): self.meta[a.get('name') or a.get('property')]=a.get('content','')
        if tag=='link' and 'canonical' in a.get('rel','').split(): self.canonical=a.get('href','')
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='script' and a.get('type')=='application/ld+json': self.is_json=True; self.json=[]
    def handle_endtag(self, tag):
        if tag=='script' and self.is_json:
            try: self.schemas.append(json.loads(''.join(self.json)))
            except json.JSONDecodeError: self.schemas.append({'INVALID_JSON': ''.join(self.json)})
            self.is_json=False
        if tag in self.stack:
            self.stack=self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
    def handle_data(self, data):
        if self.is_json: self.json.append(data)
        if 'title' in self.stack: self.title.append(data)
        if not any(t in self.stack for t in ['head','script','style','noscript']):
            self.text.append(data)
            self.date_text.append(data)
            if any(t in self.stack for t in ['main','article']): self.article_text.append(data)
            if 'h1' in self.stack: self.headings.append(data)

def normalize(value, base, canonical):
    if isinstance(value,str): return value.replace(base.rstrip('/'),canonical.rstrip('/'))
    if isinstance(value,list): return [normalize(v,base,canonical) for v in value]
    if isinstance(value,dict): return {k:normalize(v,base,canonical) for k,v in value.items()}
    return value

def objects(value):
    if isinstance(value,dict):
        yield value
        for v in value.values(): yield from objects(v)
    elif isinstance(value,list):
        for v in value: yield from objects(v)

def parse(html, route, base, canonical, status=200):
    p=Page(); p.feed(html)
    semantic=normalize({'text':clean(' '.join(p.text)), 'h1':clean(' '.join(p.headings)), 'title':clean(''.join(p.title)), 'canonical':p.canonical,'meta':p.meta,'links':p.links,'schema':p.schemas,'structure':p.structure},base,canonical)
    failures=[]
    def test(ok, reason):
        if not ok: failures.append(reason)
    test(status==200, f'HTTP {status}')
    test(p.article>0 and len(clean(' '.join(p.article_text)))>200 and bool(semantic['h1']), 'Missing complete article/main content or H1; app shells cannot pass')
    canonical_path = route.get('canonicalPath', route['path'])
    test(semantic['canonical'].rstrip('/') == (canonical.rstrip('/')+canonical_path).rstrip('/'), 'Canonical mismatch')
    for name in ['robots','googlebot','bingbot']:
        directives=re.split(r'[,\s]+',p.meta.get(name,'').lower())
        test(not {'noindex','none'} & set(directives), 'Page blocks indexing: '+name)
    test(bool(p.schemas), 'Missing structured data')
    dates=[]
    for obj in objects(p.schemas):
        test('INVALID_JSON' not in obj,'Invalid JSON-LD')
        published=obj.get('datePublished'); modified=obj.get('dateModified')
        for label,value in [('datePublished',published),('dateModified',modified)]:
            if value:
                try: dt.datetime.fromisoformat(str(value).replace('Z','+00:00'))
                except ValueError: test(False,'Invalid '+label)
        types=obj.get('@type',[]); types=[types] if isinstance(types,str) else types
        identity=normalize(obj.get('url') or obj.get('@id') or '',base,canonical).split('#')[0]
        primary=bool(set(types)&{'Article','TechArticle','BlogPosting','NewsArticle','WebPage','FAQPage'}) and (not identity or identity.rstrip('/') in {(canonical.rstrip('/')+route['path']).rstrip('/'),(canonical.rstrip('/')+canonical_path).rstrip('/')})
        if modified and primary: dates.append(str(modified)[:10])
        if published and modified: test(str(modified)[:10]>=str(published)[:10], 'dateModified precedes datePublished')
    expected=route.get('expectedUpdatedDate')
    if expected:
        test(bool(dates) and all(d==expected for d in dates),'Structured-data updated date mismatch')
        date=dt.date.fromisoformat(expected)
        variants=[expected,date.strftime('%b %-d, %Y'),date.strftime('%B %-d, %Y')]
        # Labels begin a visible text block or follow a byline separator. A
        # historical sentence such as 'the model was updated on August 13'
        # is not the article's update date.
        labels=re.findall(r'(?:^|[\n·|]|\blast\s+)\s*updated\s*(?:on\s+)?[:·-]?\s*(\d{4}-\d{2}-\d{2}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})',''.join(p.date_text),re.I)
        parsed=[]
        for value in labels:
            for fmt in ['%Y-%m-%d','%b %d %Y','%B %d %Y']:
                try: parsed.append(str(dt.datetime.strptime(value.replace(',',''),fmt).date())); break
                except ValueError: pass
        test(bool(parsed) and len(parsed)==len(labels) and all(v==expected for v in parsed),'Visible updated date missing or inconsistent')
    for phrase in route.get('requiredText',[]): test(phrase in semantic['text'],f'Missing required text: {phrase}')
    for phrase in route.get('forbiddenText',[]): test(phrase.casefold() not in semantic['text'].casefold(),f'Forbidden text: {phrase}')
    return {'path':route['path'],'status':status,'fingerprint':digest(semantic),'semantic':semantic,'failures':failures,'htmlSha256':hashlib.sha256(html.encode()).hexdigest()}

def validate_manifest(manifest):
    require(manifest.get('author') and manifest.get('canonicalBase','').startswith('https://'),'Manifest needs author and HTTPS canonicalBase')
    routes=manifest.get('routes',[])
    require(routes,'Manifest must enumerate affected routes')
    paths=[r['path'] for r in routes]
    require(len(paths)==len(set(paths)), 'Duplicate route')
    require(all(p.startswith('/') and '..' not in p and '?' not in p and '#' not in p for p in paths),'Unsafe route path')
    for r in routes:
        if 'canonicalPath' in r:
            p=r['canonicalPath']
            require(p in paths and p.startswith('/') and not p.startswith('//') and '..' not in p and '?' not in p and '#' not in p,'Canonical target must be an audited same-site route')
            target=next(t for t in routes if t['path']==p)
            require(target.get('canonicalPath',p)==p,'Canonical target must be self-canonical; chains and cycles are invalid')

def capture(manifest, base, out, dom_dir=None):
    validate_manifest(manifest)
    folder=Path(out).with_suffix(''); folder.mkdir(parents=True,exist_ok=True)
    def one(route):
        url=base.rstrip('/')+route['path']
        req=urllib.request.Request(url,headers={'User-Agent':'RenderedPageAudit/1.0'})
        with urllib.request.urlopen(req,timeout=90) as response:
            status=response.status; html=response.read().decode('utf-8')
            require(response.geturl().rstrip('/')==url.rstrip('/'),f'{url}: unexpected redirect to {response.geturl()}')
            require(not {'noindex','none'} & set(re.split(r'[,\s:]+',response.headers.get('X-Robots-Tag','').lower())),f'{url}: X-Robots-Tag noindex')
        if dom_dir: html=(Path(dom_dir)/route['path'].lstrip('/')/'index.html').read_text()
        result=parse(html,route,base,manifest['canonicalBase'],status)
        filename=hashlib.sha256(route['path'].encode()).hexdigest()[:20]
        (folder/(filename+'.html')).write_text(html)
        (folder/(filename+'.txt')).write_text(result['semantic']['text'])
        result['htmlFile']=str(folder/(filename+'.html')); result['textFile']=str(folder/(filename+'.txt')); result['textSha256']=hashlib.sha256(result['semantic']['text'].encode()).hexdigest()
        return result
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(one,manifest['routes']))
    payload={'capturedAt':now(),'baseUrl':base,'domDir':dom_dir,'manifest':manifest,'routes':results}
    payload['snapshotSha256']=digest(payload); save(out,payload)
    return payload

def valid_snapshot(s):
    unsigned={k:v for k,v in s.items() if k!='snapshotSha256'}
    require(digest(unsigned)==s['snapshotSha256'],'Snapshot evidence changed')
    validate_manifest(s['manifest'])
    expected={r['path'] for r in s['manifest']['routes']}
    require(len(s['routes'])==len(expected) and {r['path'] for r in s['routes']}==expected,'Snapshot route coverage mismatch')
    for r in s['routes']:
        require(not r['failures'],r['path']+': '+str(r['failures']))
        require(digest(r['semantic'])==r['fingerprint'],'Semantic fingerprint mismatch')
        if r.get('htmlFile'):
            require(hashlib.sha256(Path(r['htmlFile']).read_bytes()).hexdigest()==r['htmlSha256'],'Captured HTML changed')
        if r.get('textFile'):
            require(hashlib.sha256(Path(r['textFile']).read_bytes()).hexdigest()==r['textSha256'],'Captured readable text changed')

def review_check(s, review):
    valid_snapshot(s)
    require(review.get('reviewer') and review['reviewer']!=s['manifest']['author'],'Independent reviewer required')
    require(review.get('snapshotSha256')==s['snapshotSha256'],'Review is for a different snapshot')
    rows=review.get('routes',[]); by_path={r['path']:r for r in rows}
    require(len(rows)==len(by_path)==len(s['routes']) and set(by_path)=={r['path'] for r in s['routes']},'Review must cover every route exactly once')
    for r in s['routes']:
        rr=by_path[r['path']]
        require(rr.get('fingerprint')==r['fingerprint'] and rr.get('verdict')=='PASS',r['path']+': unapproved render')
        checks=rr.get('checks',{})
        require(set(checks)==CHECKS,r['path']+': missing audit checks')
        for key,check in checks.items():
            require(check.get('status') in (['PASS'] if key in REQUIRED else ['PASS','NA']),r['path']+': failed '+key)
            require(isinstance(check.get('evidence'),str) and len(check['evidence'].strip())>=20,r['path']+': missing evidence for '+key)

def compare(approved, live, review, require_live=True):
    review_check(approved,review); valid_snapshot(live)
    if require_live:
        require(urlsplit(live['baseUrl']).scheme=='https' and live['baseUrl'].rstrip('/')==live['manifest']['canonicalBase'].rstrip('/'),'Live verification requires canonical production origin')
    require(approved['manifest']==live['manifest'],'Live manifest differs from approved scope')
    a={r['path']:r['fingerprint'] for r in approved['routes']}; b={r['path']:r['fingerprint'] for r in live['routes']}
    require(a==b,'Rendered content differs: '+str([p for p in set(a)|set(b) if a.get(p)!=b.get(p)]))

def record(s, approved, review, commit, host, ledger):
    compare(approved,s,review)
    require(re.fullmatch('[0-9a-f]{40}',commit) is not None and host.get('commit')==commit and host.get('status')=='live' and host.get('evidenceUrl') and host.get('verifiedAt'),'Verified host deployment evidence required')
    path=Path(ledger); prior=[json.loads(l) for l in path.read_text().splitlines() if l.strip()] if path.exists() else []
    output=[]
    for route in s['manifest']['routes']:
        if not route.get('growthFile'): continue
        growth_path=Path(route['growthFile']); require(not growth_path.is_absolute() and '..' not in growth_path.parts,'Growth file must be repository-relative')
        growth=read(growth_path)
        contribution=route.get('contributionId',route['growthFile'])
        previous=next((p for p in prior if p['path']==route['path'] and p.get('contributionId')==contribution and p.get('firstVerifiedLiveAt')),None)
        first=growth.get('firstVerifiedLiveAt') or (previous['firstVerifiedLiveAt'] if previous else s['capturedAt'])
        require(dt.datetime.fromisoformat(first.replace('Z','+00:00'))<=dt.datetime.fromisoformat(s['capturedAt'].replace('Z','+00:00')),'First live timestamp is in the future')
        day=dt.datetime.fromisoformat(first.replace('Z','+00:00')).date()+dt.timedelta(days=1)
        baseline=growth.get('baseline')
        if not isinstance(baseline,dict) or not baseline.get('status'):
            baseline={'status':'unavailable','reason':'No verified pre-change GSC extract in the run evidence; retry historical date-filtered extraction during the existing measurement routine.','priorSpecification':baseline}
        entry={'path':route['path'],'contributionId':contribution,'growthFile':route['growthFile'],'evidenceFile':route.get('evidenceFile'),'commit':commit,'status':'live-verified','firstVerifiedLiveAt':first,'verifiedAt':s['capturedAt'],'snapshotSha256':s['snapshotSha256'],'deployment':host,'baseline':baseline,'windows':{'days1to28':{'start':str(day),'end':str(day+dt.timedelta(days=27))},'days29to56':{'start':str(day+dt.timedelta(days=28)),'end':str(day+dt.timedelta(days=55))}}}
        growth.update(entry); save(growth_path,growth)
        if not any(p.get('path')==entry['path'] and p.get('contributionId')==contribution and p.get('snapshotSha256')==entry['snapshotSha256'] for p in prior): output.append(entry)
    path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('a') as f:
        for entry in output: f.write(json.dumps(entry,sort_keys=True)+'\n')
    return len(output)

def main():
    parser=argparse.ArgumentParser(); sub=parser.add_subparsers(dest='command',required=True)
    p=sub.add_parser('capture'); p.add_argument('--manifest',required=True); p.add_argument('--base-url',required=True); p.add_argument('--out',required=True); p.add_argument('--dom-dir')
    p=sub.add_parser('check'); p.add_argument('--snapshot',required=True); p.add_argument('--review',required=True); p.add_argument('--recapture',action='store_true')
    p=sub.add_parser('compare'); p.add_argument('--approved',required=True); p.add_argument('--live',required=True); p.add_argument('--review',required=True)
    p=sub.add_parser('record-deployment')
    for name in ['snapshot','approved','review','commit','deployment-evidence','ledger']: p.add_argument('--'+name,required=True)
    a=parser.parse_args()
    if a.command=='capture':
        s=capture(read(a.manifest),a.base_url,a.out,a.dom_dir); valid_snapshot(s); print(f"Captured {len(s['routes'])} complete routes")
    elif a.command=='check':
        s=read(a.snapshot); review=read(a.review); review_check(s,review)
        if a.recapture:
            fresh=capture(s['manifest'],s['baseUrl'],str(Path(a.snapshot).with_suffix('.recapture.json')),s.get('domDir')); compare(s,fresh,review,require_live=False)
        print('Rendered review evidence verified')
    elif a.command=='compare': compare(read(a.approved),read(a.live),read(a.review)); print('Live render matches approved render')
    else: print('Deployment records:',record(read(a.snapshot),read(a.approved),read(a.review),a.commit,read(a.deployment_evidence),a.ledger))
if __name__=='__main__':
    try: main()
    except (ValueError,KeyError,OSError) as e: print('BLOCKED:',e,file=sys.stderr); sys.exit(1)
