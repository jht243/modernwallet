"""Synthetic host identity fixtures, never actual deployment evidence."""
import datetime as dt
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

s=importlib.util.spec_from_file_location('provenance',Path(__file__).with_name('deployment-evidence.py'))
p=importlib.util.module_from_spec(s);s.loader.exec_module(p)

class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
        (self.root/'.claude').mkdir();(self.root/'.claude/deployment-evidence.json').write_text(json.dumps({'repository':'synthetic/site','branch':'main','canonicalHosts':['fixture.invalid']}))
        self.value=dict(schemaVersion=1,provider='render',serviceType='static',repository='synthetic/site',branch='main',commit='1'*40,builtAt=dt.datetime.now(dt.timezone.utc).isoformat())
    def test_real_provider_identity_and_checkout_are_both_required(self):
        env={'RENDER':'true','RENDER_SERVICE_TYPE':'static','RENDER_GIT_REPO_SLUG':'synthetic/site','RENDER_GIT_BRANCH':'main','RENDER_GIT_COMMIT':'1'*40}
        with patch.object(p,'git',return_value='1'*40):
            self.assertEqual(p.host_value(self.root,env)['commit'],'1'*40)
            for name,value in [('RENDER','false'),('IS_PULL_REQUEST','true'),('RENDER_GIT_BRANCH','review'),('RENDER_GIT_REPO_SLUG','wrong/site')]:
                with self.subTest(name=name),self.assertRaises(ValueError):p.host_value(self.root,{**env,name:value})
        with patch.object(p,'git',return_value='2'*40),self.assertRaises(ValueError):p.host_value(self.root,env)
    def test_proof_requires_expected_content_in_actual_published_host_lineage(self):
        calls=[]
        def git(root,*args):
            calls.append(args)
            if args[0]=='ls-remote':return '3'*40+'\trefs/heads/main'
            return ''
        with patch.object(p,'git',side_effect=git):
            proof=p.verify(self.root,self.value,'https://fixture.invalid'+p.ENDPOINT,'2'*40)
        self.assertEqual(proof['commit'],'1'*40)
        self.assertIn(('merge-base','--is-ancestor','2'*40,'1'*40),calls)
        self.assertIn(('merge-base','--is-ancestor','1'*40,'3'*40),calls)
        with patch.object(p,'git',side_effect=ValueError('not an ancestor')),self.assertRaises(ValueError):p.verify(self.root,self.value,'https://fixture.invalid'+p.ENDPOINT,'2'*40)
    def test_wrong_host_identity_or_future_stamp_cannot_become_live(self):
        for update in [{'repository':'wrong/site'},{'branch':'review'},{'provider':'unknown'},{'commit':'short'},{'builtAt':(dt.datetime.now(dt.timezone.utc)+dt.timedelta(hours=2)).isoformat()}]:
            with self.subTest(update=update),self.assertRaises(ValueError):p.verify(self.root,{**self.value,**update},'https://fixture.invalid'+p.ENDPOINT,'2'*40)

if __name__=='__main__':unittest.main()
