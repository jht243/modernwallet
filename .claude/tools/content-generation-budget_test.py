"""Synthetic budget fixtures; never real research or independent approvals."""
import importlib.util,json,tempfile,unittest
import os,shutil,subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('budget',Path(__file__).with_name('content-generation-budget.py'))
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
        self.manifest=self.root/'manifest.json';self.review=self.root/'review.json'
        self.manifest.write_text(json.dumps({'actions':[{'target':'/guides/page','bucket':'create new content'}]}))
        self.review.write_text('{"jobId":"original"}')
        self.args=SimpleNamespace(mindmap_manifest=str(self.manifest),mindmap_review=str(self.review),slug='page',out='drafts/page.json')
        self.policy=SimpleNamespace(policy=lambda root:{'siteId':'fixture'},LIMITS={'light':1,'standard':2,'high':3})
        self.mock=patch.object(b,'load_policy',return_value=self.policy);self.mock.start();self.addCleanup(self.mock.stop)
    def test_no_reset_from_directory_slug_suffix_or_job_id(self):
        b.reserve(self.root,self.args,'write')
        self.args.out='other/page.json';self.args.slug='page--new'
        with self.assertRaises(ValueError):b.reserve(self.root,self.args,'section')
        self.review.write_text('{"jobId":"renamed"}')
        with patch.object(b,'current_cycle',return_value=None):
            with self.assertRaises(ValueError):b.reserve(self.root,self.args,'write')
    def test_actual_remaining_independent_failure_can_authorize_one_repair(self):
        b.reserve(self.root,self.args,'write')
        cycle={'jobId':'original','status':'needs-fix','profile':'standard','rounds':[{'status':'complete','verdict':'FAIL','number':1,'reportObjectSha256':'real-fixture-report'}]}
        with patch.object(b,'current_cycle',return_value=cycle):
            b.reserve(self.root,self.args,'repair')
            with self.assertRaises(ValueError):b.reserve(self.root,self.args,'repair')
            cycle['rounds'][-1]['number']=2;cycle['rounds'][-1]['reportObjectSha256']='other-fixture'
            with self.assertRaises(ValueError):b.reserve(self.root,self.args,'repair')
    def test_separate_original_sections_of_existing_page_keep_working(self):
        self.manifest.write_text(json.dumps({'actions':[{'target':'/guides/page','bucket':'update existing body text'}]}))
        for name in ('page--cost','page--uses'):
            self.args.slug=name;b.reserve(self.root,self.args,'section')
        with self.assertRaises(ValueError):b.reserve(self.root,self.args,'section')
    def test_ordinary_unrelated_cli_has_no_new_requirement(self):
        self.args.mindmap_manifest=None
        self.assertIsNone(b.reserve(self.root,self.args,'write'))
    def test_two_cloud_checkouts_cannot_pay_for_the_same_page_twice(self):
        with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ,{'CLAUDE_CODE_REMOTE':'true'}):
            base=Path(tmp);remote=base/'remote.git'
            subprocess.run(['git','init','--bare','-q',str(remote)],check=True)
            copies=[]
            for i in (1,2):
                root=base/str(i);subprocess.run(['git','init','-q',str(root)],check=True)
                subprocess.run(['git','-C',str(root),'remote','add','origin',str(remote)],check=True)
                helper=root/'.claude/tools/workflow-control-store.py';helper.parent.mkdir(parents=True)
                shutil.copyfile(Path(__file__).with_name('workflow-control-store.py'),helper)
                manifest=root/'manifest.json';review=root/'review.json'
                manifest.write_bytes(self.manifest.read_bytes());review.write_bytes(self.review.read_bytes())
                copies.append((root,SimpleNamespace(**{**vars(self.args),'mindmap_manifest':str(manifest),'mindmap_review':str(review)})))
            def attempt(value):
                try:b.reserve(value[0],value[1],'write');return 1
                except ValueError as error:
                    self.assertIn('Generation already reserved',str(error));return 0
            with ThreadPoolExecutor(2) as pool:self.assertEqual(sum(pool.map(attempt,copies)),1)
if __name__=='__main__':unittest.main()
