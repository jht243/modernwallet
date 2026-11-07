#!/usr/bin/env python3
"""Pin verified external font inputs for a search-only candidate build, never production."""
import argparse
import datetime as dt
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.parse
import urllib.request

UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
DEFAULT=['https://fonts.googleapis.com/css2?family=Fraunces:wght@100..900&display=swap','https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap']

def require(ok,message):
    if not ok:raise ValueError(message)


def fetch(url, hosts):
    require(urllib.parse.urlsplit(url).scheme=='https' and urllib.parse.urlsplit(url).hostname in hosts,'Unexpected font asset origin')
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=30) as response:
        require(urllib.parse.urlsplit(response.geturl()).hostname in hosts,'Unexpected asset redirect')
        return response.read()

class Links(HTMLParser):
    def __init__(self):super().__init__();self.styles=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='link' and a.get('rel')=='stylesheet':self.styles.append(a['href'])

def faces(css):
    for match in re.finditer(r'@font-face\s*\{([^}]+)\}',css):
        values=dict((m.group(1).strip().lower(),m.group(2).strip()) for m in re.finditer(r'([\w-]+)\s*:\s*([^;]+)',match.group(1)))
        url=re.search(r'url\([\'\"]?([^\)\'\"]+)',values.get('src',''))
        if url:yield match,values,url.group(1)

def family(value):return re.sub(r'^__(.+)_[a-f0-9]{6}$',r'\1',value.strip('\'"')).lower()
def intervals(value):
    result=[]
    for token in value.split(','):
        parts=token.strip().upper().removeprefix('U+').split('-')
        if len(parts)==1 and '?' in parts[0]:
            require(re.fullmatch(r'[0-9A-F]*\?+',parts[0]) and len(parts[0])<=6,'Invalid unicode wildcard')
            result.append((int(parts[0].replace('?','0'),16),int(parts[0].replace('?','F'),16)))
        else:
            require(len(parts) in (1,2) and all(re.fullmatch('[0-9A-F]+',p) for p in parts),'Invalid unicode range')
            result.append((int(parts[0],16),int(parts[-1],16)))
    return result

def pin_ranges(original, deployed):
    a,b=intervals(original),intervals(deployed)
    if a==b:return original
    parts=original.split(',');require(len(a)==len(b),'Changed font range partition; independent reconciliation required')
    for i,(old,new) in enumerate(zip(a,b)):
        if old==new:continue
        token=parts[i].strip();raw=token.removeprefix('U+').split('-')
        require(len(raw)==2 and new[0]==old[0],'Unexpected font-range change')
        replacement='U+'+format(new[0],'0'+str(len(raw[0]))+'X')+'-'+format(new[1],'0'+str(len(raw[1]))+'X')
        parts[i]=parts[i].replace(token,replacement)
    result=','.join(parts);require(intervals(result)==b,'Range pin mismatch');return result


def write_environment(folder, receipt):
    mapping={}
    for url,css in receipt['inputs'].items():
        for digest in receipt['fontFiles']:
            path=folder/'fonts'/(digest+'.woff2');require(hashlib.sha256(path.read_bytes()).hexdigest()==digest,'Pinned font bytes changed')
            css=css.replace('sgfont://'+digest,str(path.resolve()))
        mapping[url]=css
    module=folder/'font-inputs.cjs';module.write_text('module.exports='+json.dumps(mapping)+';\n')
    return {'NEXT_FONT_GOOGLE_MOCKED_RESPONSES':str(module.resolve())}


def capture(base,urls,folder):
    require(not (folder/'font-method.json').exists(),'Use a fresh attempt directory; preserve earlier evidence')
    host=urllib.parse.urlsplit(base).hostname;require(host and not host.replace('.','').isdigit(),'Canonical hostname required')
    hosts={host,host.removeprefix('www.'),'www.'+host.removeprefix('www.')};html=fetch(base,hosts);links=Links();links.feed(html.decode());cache={}
    def asset(url,allowed):
        if url not in cache:cache[url]=fetch(url,allowed)
        return cache[url]
    deployed=[];styles=[]
    for value in links.styles:
        url=urllib.parse.urljoin(base,value);css=asset(url,hosts).decode();styles.append({'url':url,'sha256':hashlib.sha256(css.encode()).hexdigest()})
        for _,v,source in faces(css):
            font_url=urllib.parse.urljoin(base,source)
            if not urllib.parse.urlsplit(font_url).path.endswith('.woff2'):continue
            raw=asset(font_url,hosts);deployed.append((v,hashlib.sha256(raw).hexdigest()))
    require(deployed,'No deployed font faces found')
    folder.mkdir(parents=True,exist_ok=True);(folder/'fonts').mkdir(exist_ok=True)
    receipt={'baseUrl':base,'capturedAt':dt.datetime.now(dt.timezone.utc).isoformat(),'htmlSha256':hashlib.sha256(html).hexdigest(),'stylesheets':styles,'originalInputs':{},'inputs':{},'fontFiles':{},'rangeChanges':[], 'method':'Separate actual build; genuine font bytes; any unicode-range pin derived from deployed stylesheet. Not a fresh unmodified Google response or a Render build. Requires independent full render review and unchanged native comparison.'}
    for url in urls:
        require(urllib.parse.urlsplit(url).hostname=='fonts.googleapis.com','Google stylesheet URL required')
        css=fetch(url,{'fonts.googleapis.com'}).decode();receipt['originalInputs'][url]=css;replacements=[]
        for match,v,source in faces(css):
            require(urllib.parse.urlsplit(source).hostname=='fonts.gstatic.com','Unexpected font origin')
            raw=asset(source,{'fonts.gstatic.com'});digest=hashlib.sha256(raw).hexdigest()
            matches=[d for d,h in deployed if h==digest and family(d.get('font-family',''))==family(v.get('font-family','')) and d.get('font-weight')==v.get('font-weight') and d.get('font-style')==v.get('font-style')]
            require(len(matches)==1,'Font asset/style changed; do not fabricate equivalence')
            before=v.get('unicode-range','');after=pin_ranges(before,matches[0].get('unicode-range',''))
            block=match.group(0).replace(source,'sgfont://'+digest)
            if before!=after:
                block=block.replace(before,after);receipt['rangeChanges'].append({'family':family(v['font-family']),'fontSha256':digest,'before':before,'after':after})
            replacements.append((match.start(),match.end(),block));(folder/'fonts'/(digest+'.woff2')).write_bytes(raw);receipt['fontFiles'][digest]={'source':source,'byteLength':len(raw)}
        for start,end,value in reversed(replacements):css=css[:start]+value+css[end:]
        receipt['inputs'][url]=css
    (folder/'font-method.json').write_text(json.dumps(receipt,indent=2))
    return write_environment(folder,receipt)


def main():
    p=argparse.ArgumentParser();p.add_argument('--base-url',required=True);p.add_argument('--out',required=True);p.add_argument('--google-url',action='append');p.add_argument('--restore',action='store_true');a=p.parse_args();folder=Path(a.out)
    if a.restore:
        receipt=json.loads((folder/'font-method.json').read_text());require(receipt['baseUrl'].rstrip('/')==a.base_url.rstrip('/'),'Cross-site font profile refused');env=write_environment(folder,receipt)
    else:env=capture(a.base_url,a.google_url or DEFAULT,folder)
    print(json.dumps({'ok':True,'buildEnvironment':env,'methodFile':str(folder/'font-method.json'),'independentReviewStillRequired':True}))
if __name__=='__main__':main()
