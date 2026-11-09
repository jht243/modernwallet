"""Synthetic delivery checks. These fixtures never create editorial approvals."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('core_test',Path(__file__).with_name('workflow-preflight.py'))
core=importlib.util.module_from_spec(spec);spec.loader.exec_module(core)

class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name).resolve()
        for name in core.BASE+['_keyword-demand-ladder.md','phase.md','_workflow-efficiency.md']:
            p=self.root/'.claude/commands'/name;p.parent.mkdir(parents=True,exist_ok=True)
            p.write_bytes(('Shared exact rule.\r\n\r\nUnique obligation '+name+'\r\n'*20).encode())
        self.reading=self.root/'reading'
    def prepare(self,path=None,**kwargs):
        with patch.object(core.subprocess,'run'):
            return core.prepare(self.root,'build',['.claude/commands/phase.md'],path or self.reading,
                                actor='reader',run_id='actual-fixture-run',context_id='native-fixture',context_epoch='fresh',**kwargs)
    def deliver(self,path=None):
        path=path or self.reading
        for _ in core.load(path)['parts']:
            with contextlib.redirect_stdout(io.StringIO()):core.emit(self.root,path)
    def test_lossless_sources_and_exact_deduplication(self):
        m=self.prepare();self.deliver();core.validate(self.root,self.reading)
        text=''.join((self.reading/p['path']).read_text() for p in m['parts'])
        self.assertEqual(text.count('Shared exact rule.'),1)
        for name,body in m['sourceTexts'].items():
            self.assertEqual(body.encode(),(self.root/name).read_bytes())
            self.assertIn('Unique obligation '+Path(name).name,text)
        self.assertLess(m['deliveryCharacters'],m['sourceCharacters'])
    def test_changed_rules_read_only_changed_sources_in_same_context(self):
        self.prepare();self.deliver()
        (self.root/'.claude/commands/phase.md').write_text('Entirely new task rule.')
        next=self.root/'next';m=self.prepare(next,reuse=self.reading)
        self.assertGreater(len(m['reused']),1)
        self.assertNotIn('.claude/commands/phase.md',m['reused'])
        self.deliver(next);core.validate(self.root,next)
    def test_different_context_and_epoch_require_fresh_reading(self):
        self.prepare();self.deliver()
        for field in ('contextId','contextEpoch','actor','phase'):
            manifest=core.load(self.reading);manifest[field]='other'
            core.save(self.reading/'manifest.json',manifest)
            with self.assertRaisesRegex(ValueError,'actual uninterrupted'):
                self.prepare(self.root/field,reuse=self.reading)
            manifest[field]={'contextId':'native-fixture','contextEpoch':'fresh','actor':'reader','phase':'build'}[field]
            core.save(self.reading/'manifest.json',manifest)
    def test_partial_reading_is_never_reused(self):
        self.prepare()
        with self.assertRaisesRegex(ValueError,'Incomplete'):
            self.prepare(self.root/'next',reuse=self.reading)
    def test_truncated_sources_or_chunks_cannot_pass(self):
        self.prepare();self.deliver();manifest=core.load(self.reading)
        for key in ('sourceTexts','parts'):
            changed=dict(manifest);changed[key]={} if key=='sourceTexts' else []
            core.save(self.reading/'manifest.json',changed)
            with self.assertRaises(ValueError):core.validate(self.root,self.reading)
            core.save(self.reading/'manifest.json',manifest)
    def test_lost_reused_history_cannot_pass(self):
        self.prepare();self.deliver();next=self.root/'next';self.prepare(next,reuse=self.reading)
        (self.reading/'manifest.json').write_text('{}')
        with self.assertRaises(ValueError):core.validate(self.root,next)
    def test_new_local_rule_requires_a_new_bundle(self):
        self.prepare();self.deliver();(self.root/'.claude/commands/_testing-labels.local.md').write_text('Local exclusion')
        with self.assertRaises(ValueError):core.validate(self.root,self.reading)
    def test_broken_output_never_records_a_read(self):
        self.prepare()
        with patch('builtins.print',side_effect=BrokenPipeError):
            with self.assertRaises(BrokenPipeError):core.emit(self.root,self.reading)
        self.assertEqual(core.load(self.reading)['delivered'],[])
    def test_write_preflight_binds_the_focused_canonical_handoff(self):
        import hashlib
        (self.root/'.claude/content-review-policy.json').write_text('{"siteId":"fixture"}')
        page=self.root/'candidate.txt';page.write_text('Private fixture, never published.')
        value={'version':1,'siteId':'fixture','canonicalBase':'https://fixture.example','jobId':'original','producer':'author','nextAction':'Continue this private test', 'routes':['/guide'],'candidates':[{'path':page.name,'sha256':hashlib.sha256(page.read_bytes()).hexdigest()}], 'sources':[], 'findings':[],'reviewCounters':{'reviews':0,'reworks':0}}
        path=self.root/'handoff.json';path.write_text(json.dumps(value))
        with patch.object(core.subprocess,'run'):
            m=core.prepare(self.root,'write',['.claude/commands/phase.md'],self.reading,actor='reader',run_id='actual-fixture-run',context_id='native-fixture',context_epoch='fresh',handoff='handoff.json')
        self.deliver();core.validate(self.root,self.reading)
        packet=self.root/m['taskPath'];task=json.loads(packet.read_bytes())
        self.assertEqual(task['reviewCounters'],value['reviewCounters'])
        self.assertNotIn('previous',task)
        task['reviewCounters']['reviews']=99;packet.write_text(json.dumps(task))
        with self.assertRaises(ValueError):core.validate(self.root,self.reading)

    def test_write_cannot_omit_current_handoff(self):
        with patch.object(core.subprocess,'run'):
            with self.assertRaisesRegex(ValueError,'canonical handoff'):
                core.prepare(self.root,'write',['.claude/commands/phase.md'],self.reading,actor='reader',run_id='actual-fixture-run')

if __name__=='__main__':unittest.main()
