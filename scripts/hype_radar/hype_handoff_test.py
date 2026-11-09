"""Private replay of native Hype recovery. No real discovery or content approval."""
import importlib.util,json,os,subprocess,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from types import SimpleNamespace
HERE=Path(__file__).resolve().parent
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
h=load('handoff_test',HERE/'handoff.py')
p=load('hype_pull_test',HERE/'pull.py')
class Tests(unittest.TestCase):
 def test_pending_original_is_resumed_without_any_new_discovery(self):
  with tempfile.TemporaryDirectory() as tmp,patch.dict(os.environ,{'CLAUDE_CODE_REMOTE':'false','CLAUDE_CODE_REMOTE_SESSION_ID':''}):
   root=Path(tmp);subprocess.run(['git','init','-q',str(root)],check=True)
   raw=b'{"generated_at":"2026-11-09","candidates":[{"name":"fixture","angles":[]}]}'
   with patch.object(h,'announce'):source=h.freeze(root,raw)
   with patch.object(p,'REPO',root),patch.object(p,'load_config',side_effect=AssertionError('Unnecessary new discovery')),patch.object(h,'announce'):
    result=p.harvest(SimpleNamespace(json=str(root/'out.json')),h,True)
   self.assertEqual(result,0);self.assertEqual((root/'out.json').read_bytes(),raw);self.assertEqual(h.pending(root),source)
 def test_pending_intake_cannot_be_reported_as_noop(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);source=root/'original.json'
   with patch.object(h,'active_pull',return_value=source):
    with self.assertRaises(SystemExit):
     h.report_guard(root,{'tool_input':{'command':'curl https://example.org/api/routine-run --data "{\\"status\\":\\"no-op\\"}"'}})
if __name__=='__main__':unittest.main()
