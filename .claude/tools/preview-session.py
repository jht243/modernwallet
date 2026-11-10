#!/usr/bin/env python3
"""Own and verify a loopback preview of the actual current build; no model calls."""
import argparse,datetime,hashlib,json,os,re,signal,socket,subprocess,sys,time,urllib.request
from pathlib import Path
from urllib.parse import urlsplit

_children={}

def require(value,message):
 if not value:raise ValueError(message)
def digest(raw):return hashlib.sha256(raw).hexdigest()
def read(path):return json.loads(path.read_text())
def framework(root):
 p=root/'package.json';v=read(p) if p.exists() else {};deps={**v.get('dependencies',{}),**v.get('devDependencies',{})}
 return 'next' if 'next' in deps else 'astro' if 'astro' in deps else 'static'
def signature(root):
 kind=framework(root);marker=root/('.next/BUILD_ID' if kind=='next' else 'dist/index.html')
 require(marker.is_file(),'Build the actual candidate before starting its preview')
 names=subprocess.check_output(['git','ls-files','-co','--exclude-standard','-z'],cwd=root).decode().split('\0')
 rows={};latest=0
 for name in sorted(set(names)):
  p=Path(name)
  if not name or p.suffix not in {'.ts','.tsx','.js','.jsx','.json','.astro','.md','.mdx','.css'}:continue
  if p.parts[0] not in {'src','app','pages','components','data','content','lib','styles'} and len(p.parts)!=1:continue
  if len(p.parts)==1 and name not in {'package.json','package-lock.json','next.config.js','next.config.mjs','next.config.ts','astro.config.mjs','astro.config.ts','tsconfig.json','middleware.ts'}:continue
  file=root/p
  if not file.is_file() or file.is_symlink():continue
  rows[name]=digest(file.read_bytes());latest=max(latest,file.stat().st_mtime)
 require(marker.stat().st_mtime+1>=latest,'Source changed after this build. Rebuild before preview; never audit a stale server')
 return {'framework':kind,'buildId':digest(marker.read_bytes()),'sourceSha256':digest(json.dumps(rows,sort_keys=True).encode())}
def directory(root):
 value=subprocess.check_output(['git','rev-parse','--absolute-git-dir'],cwd=root,text=True).strip();p=Path(value)/'preview-sessions';p.mkdir(exist_ok=True);return p
def started(pid):
 result=subprocess.run(['ps','-p',str(pid),'-o','lstart='],capture_output=True,text=True)
 return result.stdout.strip() if result.returncode==0 else ''
def alive(meta):
 try:
  state=subprocess.run(['ps','-p',str(meta['pid']),'-o','stat='],capture_output=True,text=True).stdout.strip()
  return bool(meta.get('processStart')) and not state.startswith('Z') and started(meta['pid'])==meta['processStart'] and os.getpgid(meta['pid'])==meta['pid']
 except ProcessLookupError:return False
def stop(root,meta):
 require(meta['root']==str(root),'Preview belongs to another checkout')
 if alive(meta):
  os.killpg(meta['pid'],signal.SIGTERM)
  deadline=time.monotonic()+5
  while alive(meta) and time.monotonic()<deadline:
   try:
    if os.waitpid(meta['pid'],os.WNOHANG)[0]:break
   except ChildProcessError:pass
   time.sleep(.05)
  if alive(meta):os.killpg(meta['pid'],signal.SIGKILL)
  try:os.waitpid(meta['pid'],os.WNOHANG)
  except ChildProcessError:pass
 child=_children.pop(meta['pid'],None)
 if child is not None:
  try:child.wait(timeout=1)
  except subprocess.TimeoutExpired:pass

def verify(root,base):
 url=urlsplit(base);require(url.hostname in ('127.0.0.1','localhost') and url.port,'Use the actual loopback preview URL')
 meta=read(directory(root)/('port-'+str(url.port)+'.json'))
 require(base.rstrip('/')==meta['baseUrl'],'Use the exact owned preview origin')
 require(meta['root']==str(root) and alive(meta),'Preview process is no longer owned/alive; start a fresh current-build preview')
 require(all(meta.get(k)==v for k,v in signature(root).items()),'Preview is serving another build/source revision. Start the current build with preview-session.py')
 return {k:meta[k] for k in ['runId','baseUrl','framework','buildId','sourceSha256','pid','processStart']}

def start(root,run,route='/'):
 require(re.fullmatch(r'[A-Za-z0-9._-]{6,128}',run),'Use the actual verified invocation run ID')
 require(route.startswith('/') and not route.startswith('//') and '..' not in route and '?' not in route and '#' not in route,'Use an actual local route')
 current=signature(root);folder=directory(root);index=folder/(digest(run.encode())+'.json');old=read(index) if index.exists() else None
 if old and all(old.get(k)==v for k,v in current.items()) and alive(old):return old
 with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
 if current['framework']=='next':command=[str(root/'node_modules/.bin/next'),'start','--hostname','127.0.0.1','--port',str(port)]
 elif current['framework']=='astro':command=[str(root/'node_modules/.bin/astro'),'preview','--host','127.0.0.1','--port',str(port)]
 else:command=[sys.executable,'-m','http.server',str(port),'--bind','127.0.0.1','--directory',str(root/'dist')]
 log=folder/('port-'+str(port)+'-'+str(time.time_ns())+'.log')
 with log.open('xb') as output:process=subprocess.Popen(command,cwd=root,stdout=output,stderr=subprocess.STDOUT,start_new_session=True)
 _children[process.pid]=process
 meta={**current,'root':str(root),'runId':run,'baseUrl':'http://127.0.0.1:'+str(port),'pid':process.pid,'processStart':started(process.pid)}
 deadline=time.monotonic()+90
 try:
  while True:
   require(process.poll() is None,'Preview process exited. Inspect its internal log: '+str(log))
   try:
    with urllib.request.urlopen(meta['baseUrl']+route,timeout=2) as response:
     final=urlsplit(response.url);require(final.hostname in ('127.0.0.1','localhost') and final.port==port,'Preview redirected outside its own loopback server')
     if response.status==200:break
   except OSError:
    if time.monotonic()>=deadline:raise ValueError('Preview did not become ready; internal log: '+str(log))
    time.sleep(.2)
  require(signature(root)==current,'Source/build changed while preview was starting; keep the candidate stable')
  meta['processStart']=started(process.pid)
  require(alive(meta),'Preview process identity changed')
  for path in [index,folder/('port-'+str(port)+'.json')]:path.write_text(json.dumps(meta,indent=2)+'\n')
  if old:stop(root,old)
  return meta
 except BaseException:
  if process.poll() is None:os.killpg(process.pid,signal.SIGTERM)
  process.wait(timeout=10);raise

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('command',choices=['start','stop']);p.add_argument('--run-id',required=True);p.add_argument('--route',default='/');a=p.parse_args();root=Path(__file__).resolve().parents[2]
 if a.command=='start':value=start(root,a.run_id,a.route);print(json.dumps({k:v for k,v in value.items() if k!='root'}))
 else:
  index=directory(root)/(digest(a.run_id.encode())+'.json')
  if index.exists():stop(root,read(index))
  print(json.dumps({'status':'owned-preview-stopped','runId':a.run_id}))
if __name__=='__main__':
 try:main()
 except (ValueError,OSError,subprocess.SubprocessError) as error:print('BLOCKED: '+str(error),file=sys.stderr);sys.exit(1)
