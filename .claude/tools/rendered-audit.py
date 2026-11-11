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
from urllib.parse import urlsplit, quote

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

def content_review_policy():
    root=Path(__file__).resolve().parents[2]
    if not (root/'.claude/content-review-policy.json').is_file(): return None
    import importlib.util
    spec=importlib.util.spec_from_file_location('portable_content_review_policy',Path(__file__).with_name('content-review-policy.py'))
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module

def instruction_understanding():
    root=Path(__file__).resolve().parents[2]
    path=Path(__file__).with_name('instruction-understanding.py')
    if not (root/'.claude/workflow-policy.local.json').is_file() or not path.is_file(): return None
    import importlib.util
    spec=importlib.util.spec_from_file_location('rendered_instruction_understanding',path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module

def content_correction_scope():
    root=Path(__file__).resolve().parents[2]
    path=Path(__file__).with_name('content-correction-scope.py')
    if not (root/'.claude/content-review-policy.json').is_file() or not path.is_file(): return None
    import importlib.util
    spec=importlib.util.spec_from_file_location('rendered_correction_scope',path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module

class Page(HTMLParser):
    def __init__(self, volatile_ads=None, normalize_class_whitespace=False):
        super().__init__(convert_charrefs=True)
        self.normalize_class_whitespace=normalize_class_whitespace
        self.volatile_ads=volatile_ads; self.ad_stack=[]; self.fixed_ad_root=False; self.fixed_ad_children=0; self.confiant_root=False; self.vendor_body=False; self.closed_body=False; self.closed_html=False
        self.stack=[]; self.text=[]; self.date_text=[]; self.headings=[]; self.links=[]; self.meta={}; self.schemas=[]; self.json=[]; self.is_json=False; self.title=[]; self.canonical=''; self.article=0; self.article_text=[]; self.structure=[]
    def handle_starttag(self, tag, attrs):
        a={k:v or "" for k,v in attrs}
        # Explicit route opt-in is bound to independent full-page review. Class
        # tokens use HTML ASCII whitespace; preserve token order and duplicates.
        # The original bytes remain archived in htmlSha256.
        if self.normalize_class_whitespace and 'class' in a:
            a['class']=re.sub(r'[\t\n\f\r ]+', ' ', a['class']).strip(' ')
        # Hydration may add an empty style attribute; retain every actual CSS value.
        if 'style' in a and not a['style'].strip(): del a['style']
        void=tag in {'meta','link','img','input','br','hr','source','wbr','area','base','embed','param','track','col'}
        classes=set(a.get('class','').split()); ident=a.get('id','')
        if tag=='body':self.vendor_body='mv-loaded' in classes
        displays=[part.split(':',1)[1].strip().lower() for part in a.get('style','').split(';') if ':' in part and part.split(':',1)[0].strip().lower()=='display']
        unambiguously_hidden=displays==['none']
        fixed_root=tag=='div' and ident=='fixed_container_bottom' and self.stack==['html','body'] and self.vendor_body
        confi_root=tag=='div' and ident=='confiant_tag_holder' and self.stack==['html','body'] and self.vendor_body and unambiguously_hidden
        frame=urlsplit(a.get('src','')) if tag=='iframe' else None
        known_hidden_tracker=bool(frame is not None and self.vendor_body and unambiguously_hidden and (
            (frame.hostname,frame.path) in {
                ('feed.pghub.io','/tag'),('ads.pubmatic.com','/AdServer/js/user_sync.html'),
                ('eus.rubiconproject.com','/usync.html'),('elb.the-ozone-project.com','/static/load-cookie.html'),
                ('onetag-sys.com','/usync/'),('mediavine-d.openx.net','/w/1.0/pd'),
                ('eb2.3lift.com','/sync'),('csync.smilewanted.com',''),('csync.smilewanted.com','/')} or
            (re.fullmatch(r'[0-9a-f]{32}\.safeframe\.googlesyndication\.com',frame.hostname or '') and
             frame.path=='/safeframe/1-0-45/html/container.html') or
            (a.get('name')=='cnftComm' and not a.get('src') and self.stack==['html','body'])))
        # Explicit manifest opt-in is hash-bound to independent review. Full HTML
        # remains archived; only known third-party rotating ad UI is normalized.
        ad=self.volatile_ads=='mediavine' and (
            (tag=='div' and ident=='mv-first-video' and 'mv-video-target' in classes) or
            (tag=='div' and re.fullmatch(r'(?:content(?:_\d+)?_btf|adhesion_(?:desktop|mobile)|universalPlayer)(?:_wrapper)?',ident) and bool(classes & {'adunit','adunitwrapper','adhesion_wrapper'})) or
            (tag=='div' and 'mv-ad-box' in classes and re.fullmatch(r'content(?:_\d+)?_btf',a.get('data-slotid',''))) or fixed_root or confi_root or
            (tag in {'div','iframe'} and ident.startswith('google_ads_iframe_')) or
            (tag=='iframe' and re.fullmatch(r'goog_\d+',ident)) or
            (tag=='iframe' and (a.get('width')=='0' and a.get('height')=='0' or 'display:none' in a.get('style','').replace(' ','') or all(v in a.get('style','').replace(' ','') for v in ['width:0px','height:0px'])) and
             ((a.get('src')=='about:blank' and a.get('name')=='__pb_locator__' and self.vendor_body) or urlsplit(a.get('src','')).hostname in {'i.liadm.com','exchange.mediavine.com','exchange.pubnation.com','exchange.journeymv.com','cm.g.doubleclick.net'} or
              known_hidden_tracker)))
        if self.ad_stack or ad:
            protected=' '.join(str(a.get(k,'')) for k in ['id','class','aria-label','data-testid']).lower()
            require(tag not in {'main','article','h1'} and not (tag=='script' and a.get('type')=='application/ld+json') and
                    not any(token in protected for token in ['reader-survey','readersurvey','reader survey','affiliate','tested','testing','byline']),
                    'Protected editorial content inside a volatile ad region')
            if self.confiant_root and len(self.ad_stack)==1:
                require(tag=='script' or (tag=='iframe' and ad),'Unverified child in Confiant tracking holder')
            if not self.ad_stack and confi_root:self.confiant_root=True
            if self.fixed_ad_root and len(self.ad_stack)==1:
                require(ad and not fixed_root,'Unverified child in fixed third-party ad container')
                self.fixed_ad_children+=1
            if not self.ad_stack and fixed_root:self.fixed_ad_root=True;self.fixed_ad_children=0
            if not void:self.ad_stack.append(tag)
            return
        if self.volatile_ads=='mediavine' and tag=='body' and 'class' in a:
            transient={'mv-loaded','mv-device-desktop','mv-device-mobile','mv-device-tablet','highImpact_adhesion','mediavine-video__has-sticky'}
            a['class']=' '.join(c for c in a['class'].split() if c not in transient)
            if not a['class']:del a['class']
        if tag in {'div','p','header','footer','article','main','section','li','aside','br','h1','h2','h3'}: self.date_text.append('\n')
        if tag not in {'script','style','noscript','meta','link','head','title'} and not any(t in self.stack for t in ['head','script','style','noscript']):
            keep = {k:v for k,v in a.items() if k in {'rel','target','class','hidden','min','max','step','placeholder','for','pattern','required','multiple','src','srcset','alt','type','value','checked','selected','disabled','aria-label','aria-hidden','role','colspan','rowspan','style','action','method','href','d','viewbox','points','cx','cy','r','x','y','width','height','fill','stroke','transform'}}
            self.structure.append([tag,keep])
        if tag not in {'meta','link','img','input','br','hr','source','wbr','area','base','embed','param','track','col'}: self.stack.append(tag)
        if tag in {'article','main'}: self.article+=1
        # Next's internal head-node counter changes with runtime script loading.
        # All SEO metadata, including similarly named properties, remains bound.
        if tag=='meta' and (a.get('name') or a.get('property')) and a.get('name')!='next-head-count': self.meta[a.get('name') or a.get('property')]=a.get('content','')
        if tag=='link' and 'canonical' in a.get('rel','').split(): self.canonical=a.get('href','')
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='script' and a.get('type')=='application/ld+json': self.is_json=True; self.json=[]
    def handle_endtag(self, tag):
        if tag in {'meta','link','img','input','br','hr','source','wbr','area','base','embed','param','track','col'}:return
        if self.ad_stack:
            require(tag in self.ad_stack,'Unterminated volatile ad region')
            self.ad_stack=self.ad_stack[:len(self.ad_stack)-1-self.ad_stack[::-1].index(tag)]
            if not self.ad_stack:self.confiant_root=False
            if not self.ad_stack and self.fixed_ad_root:
                require(self.fixed_ad_children>0,'Unverified fixed third-party ad container')
                self.fixed_ad_root=False
            return
        if tag=='body' and 'body' in self.stack:self.closed_body=True
        if tag=='html' and 'html' in self.stack:self.closed_html=True
        if tag=='script' and self.is_json:
            try: self.schemas.append(json.loads(''.join(self.json)))
            except json.JSONDecodeError: self.schemas.append({'INVALID_JSON': ''.join(self.json)})
            self.is_json=False
        if tag in self.stack:
            self.stack=self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
    def handle_data(self, data):
        if self.ad_stack:
            require(not ((self.fixed_ad_root or self.confiant_root) and len(self.ad_stack)==1 and data.strip()),'Unexpected text in fixed third-party ad container')
            return
        if self.is_json: self.json.append(data)
        if 'title' in self.stack: self.title.append(data)
        if not any(t in self.stack for t in ['head','script','style','noscript']):
            self.text.append(data)
            self.date_text.append(data)
            if any(t in self.stack for t in ['main','article']): self.article_text.append(data)
            if 'h1' in self.stack: self.headings.append(data)

def normalize(value, base, canonical):
    if isinstance(value,str):
        value=value.replace(base.rstrip('/'),canonical.rstrip('/'))
        return re.sub(re.escape(quote(base.rstrip('/'),safe=''))+r'(?=$|%2[fF]|%3[fF]|%23|&)',lambda _:quote(canonical.rstrip('/'),safe=''),value)
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
    require(re.search(r'</body\s*>',html,re.I) and re.search(r'</html\s*>\s*$',html,re.I),'Incomplete full-page capture; recapture without truncation')
    p=Page(route.get('volatileThirdPartyAds'), route.get('normalizeClassTokenWhitespace') is True); p.feed(html); require(not p.ad_stack,'Unterminated volatile ad region'); require(p.closed_body and p.closed_html,'Incomplete full-page capture; document closures were not parsed')
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
        require(r.get('volatileThirdPartyAds') in (None,'mediavine'),'Unsupported volatile third-party region')
        require('normalizeClassTokenWhitespace' not in r or isinstance(r['normalizeClassTokenWhitespace'],bool),'Class token whitespace opt-in must be boolean')
        if 'canonicalPath' in r:
            p=r['canonicalPath']
            require(p in paths and p.startswith('/') and not p.startswith('//') and '..' not in p and '?' not in p and '#' not in p,'Canonical target must be an audited same-site route')
            target=next(t for t in routes if t['path']==p)
            require(target.get('canonicalPath',p)==p,'Canonical target must be self-canonical; chains and cycles are invalid')

def capture(manifest, base, out, dom_dir=None, comparison_only=False):
    validate_manifest(manifest)
    require(not Path(out).exists() and not Path(out).with_suffix('').exists(),'Capture output is immutable. Use a new versioned output path; never overwrite a reserved snapshot or its HTML.')
    if dom_dir:
        missing=[r['path'] for r in manifest['routes'] if not (Path(dom_dir)/r['path'].lstrip('/')/'index.html').is_file()]
        require(not missing,'--dom-dir is existing hydrated DOM input, not an output directory. Save every route first; omit it for complete server-rendered HTTP HTML. Missing routes: '+', '.join(missing))
    preview=None
    if manifest.get('workflowKind')=='mindmap-pass' and urlsplit(base).hostname in ('127.0.0.1','localhost'):
        import importlib.util
        root=Path(__file__).resolve().parents[2];helper=root/'.claude/tools/preview-session.py'
        package=read(root/'package.json') if (root/'package.json').is_file() else {}
        dependencies={**package.get('dependencies',{}),**package.get('devDependencies',{})}
        if 'next' in dependencies or 'astro' in dependencies:
            require(helper.is_file(),'Restore the checked-in preview-session.py before Node preview capture')
            spec=importlib.util.spec_from_file_location('actual_preview',helper);preview_module=importlib.util.module_from_spec(spec);spec.loader.exec_module(preview_module)
            try:preview=preview_module.verify(root,base)
            except (ValueError,OSError) as error:raise ValueError('Start the actual current-build loopback preview with preview-session.py start --run-id ACTUAL_RUN_ID before capture: '+str(error))
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
        for field in ('htmlFile','textFile'):
            path=Path(result[field])
            if path.is_absolute() and path.is_relative_to(Path.cwd()):
                result[field]=str(path.relative_to(Path.cwd()))
        return result
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(one,manifest['routes']))
    payload={'capturedAt':now(),'baseUrl':base,'domDir':dom_dir,'manifest':manifest,'routes':results}
    if preview:payload['previewProvenance']=preview
    if not comparison_only: attach_review_evidence(payload,folder)
    if not comparison_only and 'correctionBoundary' not in payload and (Path(__file__).with_name('review-archive.py')).is_file():
        archive_path=Path(__file__).with_name('review-archive.py')
        import importlib.util
        spec=importlib.util.spec_from_file_location('render_source_archive',archive_path);archive=importlib.util.module_from_spec(spec);spec.loader.exec_module(archive)
        root=Path(__file__).resolve().parents[2]
        if manifest.get('workflowKind')=='mindmap-pass' or archive.search_job(root):
            payload['reviewSourceArchive']=archive.snapshot_sources(root,folder)

    payload['snapshotSha256']=digest(payload); save(out,payload)
    return payload


def attach_review_evidence(payload,folder):
    manifest=payload['manifest']
    review_policy=content_review_policy()
    if review_policy is not None and manifest.get('workflowKind')=='mindmap-pass':
        root=Path(__file__).resolve().parents[2]
        payload['contentReviewPolicy']={'version':review_policy.VERSION,'sha256':review_policy.policy_hash(root)}
        correction=content_correction_scope()
        if correction is not None:
            payload['correctionBoundary']=correction.boundary(root,folder/'correction-boundary.json',manifest)


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

def testing_attribution_check(semantic, checks):
    text = semantic.get('text', '')
    claimed = re.search(r'\btested\s+(?:and|&)\s+reviewed\s+by\b|\btested\s+guidance\b', text, re.I)
    require(not claimed or checks.get('testingAndAttribution', {}).get('status') == 'PASS',
            'Visible testing attribution cannot be NA: verify actual local permission, evidence and identity, or remove the unsupported inherited label')


def review_check(s, review):
    valid_snapshot(s)
    require(review.get('reviewer') and review['reviewer']!=s['manifest']['author'],'Independent reviewer required')
    require(review.get('snapshotSha256')==s['snapshotSha256'],'Review is for a different snapshot')
    rows=review.get('routes',[]); by_path={r['path']:r for r in rows}
    require(len(rows)==len(by_path)==len(s['routes']) and set(by_path)=={r['path'] for r in s['routes']},'Review must cover every route exactly once')
    root = Path(__file__).resolve().parents[2]
    policy = content_review_policy()
    released = set()
    if any(row.get('verdict')=='FAIL' for row in rows) and policy and policy.capped_release(root,s):
        require(s.get('contentReviewPolicy') and policy.check_rendered(root,s,review,force=True),
                'Release requires a recorded final independent audit')
        released = {row['path'] for row in rows if row.get('verdict')=='FAIL'}
    for r in s['routes']:
        if r['path'] in released:
            require(by_path[r['path']].get('fingerprint')==r['fingerprint'],'Final candidate changed')
            continue
        rr=by_path[r['path']]
        require(rr.get('fingerprint')==r['fingerprint'] and rr.get('verdict')=='PASS',r['path']+': unapproved render')
        checks=rr.get('checks',{})
        testing_attribution_check(r.get('semantic',{}),checks)
        require(set(checks)==CHECKS,r['path']+': missing audit checks')
        for key,check in checks.items():
            require(check.get('status') in (['PASS'] if key in REQUIRED else ['PASS','NA']),r['path']+': failed '+key)
            require(isinstance(check.get('evidence'),str) and len(check['evidence'].strip())>=20,r['path']+': missing evidence for '+key)
    # Portable Mindmap budgets are separate from native client/upsell contracts.
    correction=content_correction_scope()
    if correction is not None: correction.validate(Path(__file__).resolve().parents[2],s,review)
    review_policy=content_review_policy()
    if review_policy is not None:
        review_policy.check_rendered(Path(__file__).resolve().parents[2],s,review)
    # Layer3-only opt-in. No config means unchanged behavior in every fleet repo.
    root = Path(__file__).resolve().parents[2]
    if (root / '.claude/workflow-policy.local.json').is_file() and urlsplit(s['manifest']['canonicalBase']).hostname in ['layer3labs.io', 'www.layer3labs.io']:
        import importlib.util
        spec = importlib.util.spec_from_file_location('rendered_local_policy', Path(__file__).with_name('workflow-local.py'))
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
        # One source-bound private publisher may carry completed applications
        # between its review workstation and subsequently leased hosted worker.
        transport = root / 'scripts/publisher_failover/verbatim_review.py'
        if review.get('jobId') == 'in_1UYyTgGWYDLBQAioMNhIWU8J' and transport.is_file():
            loader = importlib.util.spec_from_file_location('verbatim_portable_review',transport)
            portable = importlib.util.module_from_spec(loader); loader.loader.exec_module(portable)
            if portable.applies(root,s,review):
                portable.verify(root,s,review,module)
                return
        understanding=instruction_understanding()
        if understanding is not None and review_policy and s.get('contentReviewPolicy'):
            sources,_=review_policy.authorities(root,s,review)
            originals={review_policy.digest(value[1]):value[1] for value in sources.values()}
            if originals and all(review_policy.saved_applications(root,original) for original in originals.values()):
                # The original repo commit and both actor bundles must authenticate
                # before their historical access confirmations can be replayed.
                require(review_policy.check_rendered(root,s,review,local_module=module),'Missing signed original review and instruction bindings')
                for original in originals.values():
                    understanding.review_check(root,original,archived=True)
                return
        if understanding is not None: understanding.review_check(root,review)
        if review_policy is not None and review_policy.check_rendered(root,s,review,local_module=module): return
        if s.get('manifest', {}).get('workflowKind') == 'client-service-correction' and review_policy is not None:
            spec = importlib.util.spec_from_file_location('native_service_release_compat', root / '.claude/tools/native-service-release-compat.py')
            compatibility = importlib.util.module_from_spec(spec); spec.loader.exec_module(compatibility)
            if compatibility.apply(root, s, review, module, review_policy): return
        module.rendered_review(root, s, review)

def publication_semantic(semantic):
    # Next font loader hashes vary with build paths. Keep exact archived HTML,
    # signed fingerprints and all editorial/visibility attributes unchanged;
    # compare only these known generated identifiers on document roots.
    result={**semantic}
    structure=[]
    for tag,attributes in semantic.get('structure',[]):
        attributes=dict(attributes)
        if tag in ('html','body') and 'class' in attributes:
            attributes['class']=' '.join(re.sub(r'^(__variable_|__className_)[0-9a-f]{6}$',r'\1BUILD',token) for token in attributes['class'].split())
        structure.append([tag,attributes])
    if 'structure' in semantic:result['structure']=structure
    return result


def compare(approved, live, review, require_live=True):
    review_check(approved,review); valid_snapshot(live)
    if require_live:
        require(urlsplit(live['baseUrl']).scheme=='https' and live['baseUrl'].rstrip('/')==live['manifest']['canonicalBase'].rstrip('/'),'Live verification requires canonical production origin')
    require(approved['manifest']==live['manifest'],'Live manifest differs from approved scope')
    a={r['path']:digest(publication_semantic(r['semantic'])) for r in approved['routes']}; b={r['path']:digest(publication_semantic(r['semantic'])) for r in live['routes']}
    require(a==b,'Rendered content differs: '+str([p for p in set(a)|set(b) if a.get(p)!=b.get(p)]))

def record(s, approved, review, commit, host, ledger):
    compare(approved,s,review)
    require(re.fullmatch('[0-9a-f]{40}',commit) is not None and host.get('commit')==commit and host.get('status')=='live' and host.get('evidenceUrl') and host.get('verifiedAt'),'Verified host deployment evidence required')
    if (review.get('jobId','').startswith('competitor-') and
            urlsplit(s['manifest']['canonicalBase']).hostname in ('layer3labs.io','www.layer3labs.io')):
        from importlib.util import module_from_spec,spec_from_file_location
        spec=spec_from_file_location('competitor_release_checks',Path(__file__).with_name('competitor-release-checks.py'))
        checks=module_from_spec(spec);spec.loader.exec_module(checks)
        output=Path(ledger).parent/'competitor-monitor'/'release-checks'/(s['snapshotSha256']+'.json')
        result=checks.verify(s,output)
        print('Release checks:',str(output),{k:sum(x['result']==k for x in result['links'].values()) for k in ('reachable','broken','unconfirmed')},
              'declared exclusion matches:',sum(len(row['matches']) for row in result['renderedExclusions'].values()))
    path=Path(ledger); prior=[json.loads(l) for l in path.read_text().splitlines() if l.strip()] if path.exists() else []
    output=[]
    for route in s['manifest']['routes']:
        if not route.get('growthFile'): continue
        growth_path=Path(route['growthFile']); require(not growth_path.is_absolute() and '..' not in growth_path.parts,'Growth file must be repository-relative')
        growth=read(growth_path)
        contribution=route.get('contributionId',route['growthFile'])
        previous=next((p for p in prior if p.get('path')==route['path'] and p.get('contributionId')==contribution and p.get('firstVerifiedLiveAt')),None)
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
    review_policy=content_review_policy()
    if review_policy is not None: review_policy.mark_published(Path(__file__).resolve().parents[2],approved,review,commit,host)
    return len(output)

def inspect_pack(s, selected_routes=()):
    """Mechanical route summary and risk classification in one turn; never a verdict."""
    valid_snapshot(s)
    root = Path(__file__).resolve().parents[2]
    policy = content_review_policy()
    wanted = {r.rstrip('/') or '/' for r in selected_routes} if selected_routes else None
    spec_by_path = {r['path']: r for r in s['manifest']['routes']}
    origin_host = (urlsplit(s['manifest']['canonicalBase']).hostname or '').lower().removeprefix('www.')
    items = []
    for r in s['routes']:
        norm_path = r['path'].rstrip('/') or '/'
        if wanted is not None and norm_path not in wanted:
            continue
        sem = r.get('semantic', {})
        spec = spec_by_path.get(r['path'], {})
        links = sem.get('links', [])
        internal, external = [], []
        for href in links:
            u = urlsplit(href)
            host = (u.hostname or '').lower().removeprefix('www.')
            if not u.scheme or host == origin_host:
                internal.append(href)
            elif u.scheme in ('http', 'https'):
                external.append(href)
        schema_types = []
        schema_dates = []
        def walk_schema(node):
            if isinstance(node, dict):
                if '@type' in node:
                    schema_types.append(node['@type'])
                for dk in ('datePublished', 'dateModified'):
                    if dk in node:
                        schema_dates.append({dk: node[dk]})
                for child in node.values():
                    walk_schema(child)
            elif isinstance(node, list):
                for child in node:
                    walk_schema(child)
        walk_schema(sem.get('schema') if 'schema' in sem else sem.get('schemas', []))
        article_words = len((sem.get('articleText') or sem.get('text') or '').split())
        claimed_testing = bool(re.search(r'\btested\s+(?:and|&)\s+reviewed\s+by\b|\btested\s+guidance\b', sem.get('text', ''), re.I))
        entry = {
            'path': r['path'],
            'fingerprint': r['fingerprint'],
            'htmlFile': r.get('htmlFile'),
            'textFile': r.get('textFile'),
            'title': sem.get('title'),
            'h1': sem.get('h1'),
            'headings': sem.get('headings', []),
            'canonical': sem.get('canonical'),
            'meta': sem.get('meta', {}),
            'schemaTypes': schema_types,
            'schemaDates': schema_dates,
            'visibleDates': sem.get('dates', []),
            'articleWordCount': article_words,
            'internalLinkCount': len(internal),
            'externalLinkCount': len(external),
            'sampleExternalLinks': external[:25],
            'testingAttributionClaimed': claimed_testing,
        }
        if policy is not None:
            ctext = policy.claim_text(sem)
            prof = policy.profile(root, sem, spec.get('claimCategories', []), spec.get('reviewProfile'))
            entry['riskClassification'] = {
                'provisionalProfile': prof,
                'maximumRounds': policy.audit_limit(policy.policy(root), prof),
                'textSha256': policy.sha(ctext.encode()),
                'riskPassages': policy.flags(ctext),
                'requiredFactualChecks': policy.FACTS[prof],
            }
        items.append(entry)
    return {
        'snapshotSha256': s['snapshotSha256'],
        'canonicalBase': s['manifest']['canonicalBase'],
        'author': s['manifest']['author'],
        'routeCount': len(items),
        'routes': items,
        'scope': 'Mechanical surface and provisional risk scan only; read full rendered pages and raw sources for independent judgment.',
    }


def main():
    parser=argparse.ArgumentParser(); sub=parser.add_subparsers(dest='command',required=True)
    p=sub.add_parser('capture'); p.add_argument('--manifest',required=True); p.add_argument('--base-url',required=True); p.add_argument('--out',required=True); p.add_argument('--dom-dir',help='Existing hydrated DOM input by route; not an output directory. Omit for complete server-rendered HTTP HTML.')
    p=sub.add_parser('inspect-pack'); p.add_argument('--snapshot',required=True); p.add_argument('--route',action='append',default=[]); p.add_argument('--out')
    p=sub.add_parser('check'); p.add_argument('--snapshot',required=True); p.add_argument('--review',required=True); p.add_argument('--recapture',action='store_true')
    p=sub.add_parser('compare'); p.add_argument('--approved',required=True); p.add_argument('--live',required=True); p.add_argument('--review',required=True)
    p=sub.add_parser('record-deployment')
    for name in ['snapshot','approved','review','commit','deployment-evidence','ledger']: p.add_argument('--'+name,required=True)
    a=parser.parse_args()
    if a.command=='capture':
        s=capture(read(a.manifest),a.base_url,a.out,a.dom_dir); valid_snapshot(s); print(f"Captured {len(s['routes'])} complete routes")
    elif a.command=='inspect-pack':
        pack=inspect_pack(read(a.snapshot),a.route)
        if a.out: save(a.out,pack)
        print(json.dumps(pack,indent=2,ensure_ascii=False))
    elif a.command=='check':
        s=read(a.snapshot); review=read(a.review); review_check(s,review)
        if a.recapture:
            fresh=capture(s['manifest'],s['baseUrl'],str(Path(a.snapshot).with_suffix('.recapture.json')),s.get('domDir')); compare(s,fresh,review,require_live=False)
        archive_path=Path(__file__).with_name('review-archive.py')
        if archive_path.is_file():
            import importlib.util
            spec=importlib.util.spec_from_file_location('release_proof',archive_path);archive=importlib.util.module_from_spec(spec);spec.loader.exec_module(archive)
            archive.save_checked_pair(Path(__file__).resolve().parents[2],Path(a.snapshot),Path(a.review),fresh=a.recapture)
        print('Rendered review evidence verified')
    elif a.command=='compare': compare(read(a.approved),read(a.live),read(a.review)); print('Live render matches approved render')
    else: print('Deployment records:',record(read(a.snapshot),read(a.approved),read(a.review),a.commit,read(a.deployment_evidence),a.ledger))
if __name__=='__main__':
    try: main()
    except (ValueError,KeyError,OSError) as e: print('BLOCKED:',e,file=sys.stderr); sys.exit(1)
