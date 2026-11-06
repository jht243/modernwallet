import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import worker

class Reliability(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
    def write(self,n,value):
        p=self.root/n; p.write_text(json.dumps(value)); return str(p)
    def fixture(self):
        p={'site':'one.test','runId':'same','candidates':[{'id':'a','eventIds':['old']}]}
        decisions=[{'id':'a','status':'no-addition','reason':'Existing answer explicitly covers the complete reader question.'}]
        chart=self.write('chart.json',{'complete':True})
        review=self.write('review.json',{'author':'builder','reviewer':'independent','verdict':'PASS','chartSha256':worker.digest(chart),'intakeSha256':'hash','decisionsSha256':hashlib.sha256(json.dumps(decisions,sort_keys=True).encode()).hexdigest()})
        c={'site':p['site'],'runId':p['runId'],'chart':chart,'chartReview':review,'intakeSha256':'hash','decisions':decisions}
        return p,c
    def test_independent_no_addition(self):
        p,c=self.fixture(); self.assertEqual(len(worker.validate_completion(p,c)),1)
    def test_missing_chart_blocks_lookup_shortcut(self):
        p,c=self.fixture(); del c['chart']; self.assertRaises(KeyError,worker.validate_completion,p,c)
    def test_changed_chart_blocked(self):
        p,c=self.fixture(); Path(c['chart']).write_text('changed'); self.assertRaises(ValueError,worker.validate_completion,p,c)
    def test_changed_decisions_blocked(self):
        p,c=self.fixture(); c['decisions'][0]['status']='dropped'; self.assertRaises(ValueError,worker.validate_completion,p,c)
    def test_missing_candidate_blocked(self):
        p,c=self.fixture(); p['candidates'].append({'id':'b'}); self.assertRaises(ValueError,worker.validate_completion,p,c)
    def test_wrong_site_blocked(self):
        p,c=self.fixture(); c['site']='other'; self.assertRaises(ValueError,worker.validate_completion,p,c)
    def test_same_reviewer_blocked(self):
        p,c=self.fixture(); r=worker.read(c['chartReview']);r['reviewer']='builder';Path(c['chartReview']).write_text(json.dumps(r));self.assertRaises(ValueError,worker.validate_completion,p,c)
    def test_published_requires_render(self):
        p,c=self.fixture();d=c['decisions'][0];d.update(status='published',paths=['/new']);r=worker.read(c['chartReview']);r['decisionsSha256']=hashlib.sha256(json.dumps(c['decisions'],sort_keys=True).encode()).hexdigest();Path(c['chartReview']).write_text(json.dumps(r));self.assertRaises(KeyError,worker.validate_completion,p,c)
    def test_no_age_filter_or_fragment_loss(self):
        class Store:
            def pending(self,site):return [{'event_id':str(i),'payload':{'term':'x','created_at':'2020-01-01','source':source,'path':'/'}} for i,source in enumerate(['nav_search','chatbot'])]
        result=worker.intake('one.test',Store(),str(self.root/'intake.json'));self.assertEqual(result['candidateCount'],2);self.assertEqual(result['pendingEventCount'],2)
    def test_pending_never_acknowledged(self):
        p,c=self.fixture(); pth=self.write('intake.json',p);c['intakeSha256']=worker.digest(pth);c['decisions'][0]['status']='pending';r=worker.read(c['chartReview']);r['intakeSha256']=c['intakeSha256'];r['decisionsSha256']=hashlib.sha256(json.dumps(c['decisions'],sort_keys=True).encode()).hexdigest();Path(c['chartReview']).write_text(json.dumps(r));cpath=self.write('completion.json',c)
        from unittest.mock import Mock
        store=Mock();result=worker.finish(pth,cpath,store);self.assertFalse(result['ok']);store.resolve.assert_not_called()
    def test_render_commands_must_pass(self):
        p,c=self.fixture();c['decisions'][0].update(status='published',paths=['/new']);r=worker.read(c['chartReview']);r['decisionsSha256']=hashlib.sha256(json.dumps(c['decisions'],sort_keys=True).encode()).hexdigest();Path(c['chartReview']).write_text(json.dumps(r));c['rendered']={'approved':self.write('render.json',{'baseUrl':'http://127.0.0.1:8123','manifest':{'canonicalBase':'https://one.test'},'routes':[{'path':'/new'}]}),'live':'live.json','review':'audit.json'}
        import subprocess
        with patch.object(worker.subprocess,'run',side_effect=subprocess.CalledProcessError(1,'check')):
            self.assertRaises(subprocess.CalledProcessError,worker.validate_completion,p,c)
    def test_two_live_captures_cannot_approve_publication(self):
        p,c=self.fixture();c['decisions'][0].update(status='published',paths=['/new'])
        r=worker.read(c['chartReview']);r['decisionsSha256']=hashlib.sha256(json.dumps(c['decisions'],sort_keys=True).encode()).hexdigest();Path(c['chartReview']).write_text(json.dumps(r))
        c['rendered']={'approved':self.write('render.json',{'baseUrl':'https://www.one.test','manifest':{'canonicalBase':'https://one.test'},'routes':[{'path':'/new'}]}),'live':'live.json','review':'audit.json'}
        with patch.object(worker.subprocess,'run') as native:
            with self.assertRaisesRegex(ValueError,'two live captures'):
                worker.validate_completion(p,c)
            native.assert_not_called()
    def test_separate_preview_runs_all_native_checks(self):
        p,c=self.fixture();c['decisions'][0].update(status='published',paths=['/new'])
        r=worker.read(c['chartReview']);r['decisionsSha256']=hashlib.sha256(json.dumps(c['decisions'],sort_keys=True).encode()).hexdigest();Path(c['chartReview']).write_text(json.dumps(r))
        c['rendered']={'approved':self.write('render.json',{'baseUrl':'http://127.0.0.1:8123','manifest':{'canonicalBase':'https://one.test'},'routes':[{'path':'/new'}]}),'live':'live.json','review':'audit.json'}
        with patch.object(worker.subprocess,'run') as native:
            worker.validate_completion(p,c)
            self.assertEqual([x.args[0][2] for x in native.call_args_list],['check','compare','capture','compare'])
if __name__=='__main__':unittest.main()
