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
if __name__=='__main__':unittest.main()
