#!/usr/bin/env python3
"""Read real public host-build provenance; never infer deployment from HTTP 200.

Provider environment contract: https://render.com/docs/environment-variables
No credentials, editorial judgment or publication authority are created here.
"""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
import uuid

ENDPOINT='/.well-known/fleet-deployment.json'

def require(ok,message):
    if not ok:raise ValueError(message)

def config(root):
    value=json.loads((root/'.claude/deployment-evidence.json').read_bytes())
    require(re.fullmatch(r'[\w.-]+/[\w.-]+',value['repository']) and value.get('branch') and value.get('canonicalHosts'),'Invalid native deployment identity')
    require(all(re.fullmatch(r'[a-z0-9.-]+',h) for h in value['canonicalHosts']),'Use actual canonical hostnames')
    return value

def git(root,*args):
    result=subprocess.run(['git',*args],cwd=root,capture_output=True,timeout=60)
    require(result.returncode==0,'Repository lineage could not be verified')
    return result.stdout.decode().strip()

def host_value(root,env=None):
    env=os.environ if env is None else env;c=config(root)
    require(env.get('RENDER')=='true' and env.get('RENDER_SERVICE_TYPE') in ('static','web') and env.get('IS_PULL_REQUEST')!='true','Not the production host')
    require(env.get('RENDER_GIT_BRANCH')==c['branch'] and env.get('RENDER_GIT_REPO_SLUG','').lower()==c['repository'].lower(),'Wrong production source identity')
    commit=env.get('RENDER_GIT_COMMIT','');require(re.fullmatch('[0-9a-f]{40}',commit),'Missing actual host source commit')
    require(git(root,'rev-parse','HEAD')==commit,'Host checkout differs from its real build source')
    return dict(schemaVersion=1,provider='render',serviceType=env['RENDER_SERVICE_TYPE'],repository=c['repository'],branch=c['branch'],commit=commit,runtimeVerifiedAt=dt.datetime.now(dt.timezone.utc).isoformat())

def install_endpoint(app,root):
    """Native Flask sites expose only actual provider metadata; local previews 404."""
    from flask import jsonify,abort
    def provenance():
        try:value=host_value(root)
        except (ValueError,OSError,subprocess.SubprocessError):abort(404)
        response=jsonify(value);response.headers['Cache-Control']='no-store';return response
    app.add_url_rule(ENDPOINT,endpoint='fleet_deployment_provenance',view_func=provenance,methods=['GET'])

def fetch(root):
    c=config(root);url='https://'+c['canonicalHosts'][0]+ENDPOINT+'?verify='+uuid.uuid4().hex
    request=urllib.request.Request(url,headers={'Accept':'application/json','Cache-Control':'no-cache'})
    with urllib.request.urlopen(request,timeout=20) as response:
        final=urllib.parse.urlsplit(response.url)
        require(final.scheme=='https' and final.hostname in c['canonicalHosts'] and final.path==ENDPOINT and final.port in (None,443),'Provenance redirected outside this canonical host')
        raw=response.read(32769);require(len(raw)<=32768,'Unexpected host evidence size')
        return json.loads(raw),urllib.parse.urlunsplit((final.scheme,final.netloc,final.path,'',''))

def verify(root,value,url,expected=None):
    c=config(root)
    endpoint=urllib.parse.urlsplit(url)
    require(endpoint.scheme=='https' and endpoint.hostname in c['canonicalHosts'] and endpoint.path==ENDPOINT and endpoint.port in (None,443),'Use this exact canonical provenance endpoint')
    require(isinstance(value,dict) and value.get('schemaVersion')==1 and value.get('provider')=='render' and value.get('serviceType') in ('static','web') and value.get('repository')==c['repository'] and value.get('branch')==c['branch'],'Wrong host provenance identity')
    actual=value.get('commit','');require(isinstance(actual,str) and re.fullmatch('[0-9a-f]{40}',actual),'Invalid real host commit')
    require(expected is None or re.fullmatch('[0-9a-f]{40}',expected),'Resolve the complete intended publication commit')
    built=dt.datetime.fromisoformat((value.get('builtAt') or value.get('runtimeVerifiedAt','')).replace('Z','+00:00'))
    require(built.tzinfo is not None and built<=dt.datetime.now(dt.timezone.utc)+dt.timedelta(minutes=5),'Invalid provider build timestamp')
    listing=git(root,'ls-remote','origin','refs/heads/'+c['branch']).split()
    require(len(listing)==2 and re.fullmatch('[0-9a-f]{40}',listing[0]),'Current published source unavailable')
    git(root,'fetch','--quiet','--no-tags','--no-write-fetch-head','origin',listing[0])
    git(root,'merge-base','--is-ancestor',actual,listing[0])
    if expected is not None:git(root,'merge-base','--is-ancestor',expected,actual)
    return dict(status='live' if expected else 'host-verified',commit=actual,expectedPublicationCommit=expected,includesPublicationCommit=expected is not None,verifiedAt=dt.datetime.now(dt.timezone.utc).isoformat(),evidenceUrl=url,provider='render',repository=c['repository'],builtAt=value.get('builtAt'),runtimeVerifiedAt=value.get('runtimeVerifiedAt'),source='Canonical HTTPS host reports its actual provider-bound source commit; repository ancestry verified. No owner credential used.')

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[2]);p.add_argument('--expected-commit');p.add_argument('--check',action='store_true');p.add_argument('--out',type=Path);p.add_argument('--timeout',type=float,default=600);p.add_argument('--interval',type=float,default=15);a=p.parse_args()
    if not a.check and (not a.expected_commit or not a.out):p.error('Publication evidence requires --expected-commit FULL_SHA and --out NEW_INTERNAL.json')
    if a.out and (a.out.exists() or 'public' in a.out.resolve().parts):p.error('Use a new internal evidence output')
    if a.timeout<0 or a.interval<=0:p.error('Use a nonnegative timeout and positive interval')
    deadline=time.monotonic()+a.timeout
    while True:
        try:
            value,url=fetch(a.root);proof=verify(a.root,value,url,None if a.check else a.expected_commit)
            if a.out:
                a.out.parent.mkdir(parents=True,exist_ok=True)
                with a.out.open('x') as stream:json.dump(proof,stream,indent=2);stream.write('\n')
            print(json.dumps(proof));return 0
        except (ValueError,KeyError,OSError,subprocess.SubprocessError):
            if time.monotonic()>=deadline:
                print('Actual canonical host deployment remains unverified; no success proof written.',file=sys.stderr);return 1
            time.sleep(min(a.interval,max(0,deadline-time.monotonic())))

if __name__=='__main__':sys.exit(main())
