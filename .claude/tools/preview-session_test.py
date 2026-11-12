"""Actual local loopback lifecycle and stale-build checks; no production verdicts."""
import importlib.util,json,os,subprocess,tempfile,time,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('preview_fixture',Path(__file__).with_name('preview-session.py'));p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
class Tests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name).resolve()
  subprocess.run(['git','init','-q',str(self.root)],check=True);(self.root/'dist').mkdir();(self.root/'dist/index.html').write_text('<main>Fixture</main>')
 def test_source_after_build_is_rejected_before_any_preview_is_started(self):
  (self.root/'data').mkdir();source=self.root/'data/page.json';source.write_text('{}');os.utime(source,(time.time()+10,time.time()+10))
  with self.assertRaisesRegex(ValueError,'Source changed'):p.signature(self.root)
 def test_real_owned_server_reuse_restart_and_stop(self):
  first=p.start(self.root,'synthetic-fixture');self.addCleanup(lambda:p.stop(self.root,first))
  self.assertEqual(p.verify(self.root,first['baseUrl'])['buildId'],first['buildId']);self.assertEqual(p.start(self.root,'synthetic-fixture')['pid'],first['pid'])
  (self.root/'dist/index.html').write_text('<main>Changed fixture</main>')
  with self.assertRaisesRegex(ValueError,'another build'):p.verify(self.root,first['baseUrl'])
  second=p.start(self.root,'synthetic-fixture');self.addCleanup(lambda:p.stop(self.root,second));self.assertNotEqual(second['pid'],first['pid']);self.assertFalse(p.alive(first));self.assertTrue(p.alive(second))
  p.stop(self.root,second);self.assertFalse(p.alive(second))
 def test_node20_env_strips_claudecode_and_sets_astro_background(self):
  old_cc=os.environ.get('CLAUDECODE');old_ep=os.environ.get('CLAUDE_CODE_ENTRYPOINT')
  os.environ['CLAUDECODE']='1';os.environ['CLAUDE_CODE_ENTRYPOINT']='cli'
  try:
   env=p._node20_env()
   self.assertNotIn('CLAUDECODE',env);self.assertNotIn('CLAUDE_CODE_ENTRYPOINT',env)
   self.assertEqual(env.get('ASTRO_PREVIEW_BACKGROUND'),'1');self.assertEqual(env.get('CI'),'1')
  finally:
   if old_cc is None:os.environ.pop('CLAUDECODE',None)
   else:os.environ['CLAUDECODE']=old_cc
   if old_ep is None:os.environ.pop('CLAUDE_CODE_ENTRYPOINT',None)
   else:os.environ['CLAUDE_CODE_ENTRYPOINT']=old_ep
 def test_wsgi_server_py_preview_lifecycle(self):
  import shutil,urllib.request
  shutil.rmtree(self.root/'dist')
  (self.root/'server.py').write_text(
   'def app(environ, start_response):\n'
   ' start_response("200 OK", [("Content-Type", "text/html")])\n'
   ' return [b"<main>WSGI OK</main>"]\n'
  )
  self.assertEqual(p.framework(self.root),'wsgi')
  meta=p.start(self.root,'wsgi-fixture');self.addCleanup(lambda:p.stop(self.root,meta))
  self.assertEqual(meta['framework'],'wsgi')
  with urllib.request.urlopen(meta['baseUrl']+'/',timeout=5) as r:
   self.assertEqual(r.status,200);self.assertIn(b'WSGI OK',r.read())
  self.assertEqual(p.verify(self.root,meta['baseUrl'])['buildId'],meta['buildId'])
  p.stop(self.root,meta);self.assertFalse(p.alive(meta))
if __name__=='__main__':unittest.main()
