"""One deduplicated link and declared exclusion check on the actual released HTML."""
import argparse
import concurrent.futures
from html.parser import HTMLParser
import hashlib
import ipaddress
import json
from pathlib import Path
import socket
from urllib.error import HTTPError
from urllib.parse import urldefrag, urljoin, urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener


def public(url):
    parsed=urlsplit(url)
    if parsed.scheme not in ('http','https') or parsed.username or parsed.password or parsed.port not in (None,80,443):
        raise ValueError('Unsupported public link')
    addresses=socket.getaddrinfo(parsed.hostname,parsed.port or 443,type=socket.SOCK_STREAM)
    if not addresses or not all(ipaddress.ip_address(row[4][0]).is_global for row in addresses):
        raise ValueError('Nonpublic destination')


class PublicRedirect(HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        public(newurl)
        return super().redirect_request(req,fp,code,msg,headers,newurl)


def probe(url):
    try:
        public(url)
        opener=build_opener(PublicRedirect())
        for method in ('HEAD','GET'):
            try:
                req=Request(url,method=method,headers={'User-Agent':'Fleet link verification'})
                with opener.open(req,timeout=8) as response:
                    return {'status':response.status,'result':'reachable'}
            except HTTPError as error:
                if method=='HEAD':continue
                return {'status':error.code,'result':'broken' if error.code in (404,410) else 'unconfirmed'}
    except (ValueError,OSError) as error:
        return {'result':'unconfirmed','reason':type(error).__name__}


class Labels(HTMLParser):
    def __init__(self):
        super().__init__();self.labels=[]
    def handle_starttag(self,tag,attrs):
        values=dict(attrs)
        self.labels.extend(values[k] for k in ('alt','title','aria-label') if values.get(k))


def verify(snapshot,output):
    if output.exists():
        receipt=json.loads(output.read_bytes())
        if receipt.get('liveSnapshot')==snapshot['snapshotSha256']:return receipt
    origin=snapshot['manifest']['canonicalBase']
    specs={r['path']:r for r in snapshot['manifest']['routes']}
    urls=set();checked={}
    for page in snapshot['routes']:
        raw=Path(page['htmlFile']).read_bytes()
        if hashlib.sha256(raw).hexdigest()!=page['htmlSha256']:raise ValueError('Live HTML changed after capture')
        dom=Labels();dom.feed(raw.decode())
        values=[page['semantic']['text'],*dom.labels,json.dumps(page['semantic']['meta']),json.dumps(page['semantic']['schema'])]
        terms=specs[page['path']].get('forbiddenText',[])
        checked[page['path']]={'declaredExclusions':terms,'matches':[t for t in terms if any(t.casefold() in v.casefold() for v in values)]}
        for href in page['semantic']['links']:
            url=urldefrag(urljoin(origin+page['path'],href)).url
            if urlsplit(url).scheme in ('http','https'):urls.add(url)
    ordered=sorted(urls)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        links=dict(zip(ordered,pool.map(probe,ordered)))
    return save(output,{'liveSnapshot':snapshot['snapshotSha256'],'links':links,'renderedExclusions':checked})


def save(output,data):
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(data,indent=2)+'\n')
    return data


if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--snapshot',type=Path,required=True);ap.add_argument('--out',type=Path,required=True)
    a=ap.parse_args();r=verify(json.loads(a.snapshot.read_bytes()),a.out)
    print(json.dumps({k:sum(v['result']==k for v in r['links'].values()) for k in ('reachable','broken','unconfirmed')}))
