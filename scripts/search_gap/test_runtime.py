import base64
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path
from types import SimpleNamespace
import tempfile
import unittest
from unittest.mock import patch, MagicMock
import urllib.error
import job_worker as worker
import fonts

class RuntimeRecovery(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd)
    def test_original_intake_resumed_even_when_current_window_empty(self):
        packet={'ok':True,'site':'one.test','runId':'original-job','candidateCount':1,'pendingEventCount':1,'candidates':[{'id':'old','eventIds':['old-event'],'term':'original question'}]}
        raw=json.dumps(packet,ensure_ascii=False,indent=2)+'\n'
        class Durable:
            def pending(self,site):return []
            def claim_job(self,site,owner,new):return {'status':'claimed','packetText':raw,'packetSha256':hashlib.sha256(raw.encode()).hexdigest(),'checkpoints':[]}
        result=worker.intake('one.test',Durable(),None,'new-owner-12345678')
        self.assertTrue(result['resumed']);self.assertEqual(result['runId'],'original-job');self.assertEqual(Path(result['intakeFile']).read_text(),raw)
    def test_owner_park_request_is_surfaced_only_for_its_job(self):
        packet={'ok':True,'site':'one.test','runId':'original-job','candidates':[{'id':'old','eventIds':['e'],'term':'q'}]};raw=json.dumps(packet)
        Path('reports/search-gap/park-requests').mkdir(parents=True);Path('reports/search-gap/park-requests/original-job.json').write_text(json.dumps({'runId':'original-job'}))
        class Durable:
            def pending(self,site):return []
            def claim_job(self,*a):return {'status':'claimed','packetText':raw,'packetSha256':hashlib.sha256(raw.encode()).hexdigest(),'checkpoints':[]}
        with patch.object(worker,'remember_lease'):result=worker.intake('one.test',Durable(),None,'new-owner-12345678')
        self.assertIn('OWNER PARK REQUEST',result['nextAction']);self.assertEqual(result['recoverySummary']['parkRequest'],'reports/search-gap/park-requests/original-job.json')
    def test_resume_restores_saved_candidate_and_next_stage(self):
        worker.subprocess.run(['git','init','--quiet'],check=True)
        path=Path('reports/candidate.patch');path.parent.mkdir();path.write_bytes(b'original candidate')
        stage={'stage':'audit-round2-PASS-awaiting-render-gate','results':[str(path)],'nextAction':'build and capture preview','artifacts':worker.capture_artifacts([str(path)])}
        path.unlink()
        packet={'ok':True,'site':'example.test','runId':'prior-run','candidates':[]};raw=json.dumps(packet)
        class Durable:
            def pending(self,site):return []
            def claim_job(self,site,owner,new):return {'status':'claimed','packetText':raw,'packetSha256':hashlib.sha256(raw.encode()).hexdigest(),'checkpoints':[stage]}
        resumed=worker.intake('example.test',Durable(),None,'new-owner-12345678')
        self.assertEqual(path.read_bytes(),b'original candidate');self.assertEqual(resumed['recoverySummary']['nextAction'],stage['nextAction'])
        self.assertEqual(resumed['recoverySummary']['results'],[str(path)])

    def test_only_terminal_session_releases_its_recorded_owner(self):
        worker.subprocess.run(['git','init','--quiet'],check=True)
        with patch.dict(os.environ,{'CLAUDE_CODE_REMOTE_SESSION_ID':'fixture-cloud-a'}),patch.object(worker,'Store') as store:
            worker.remember_lease('fixture.site','saved-job','original-owner')
            worker.release_at_session_end({'hook_event_name':'Stop'})
            store.assert_not_called()
            with patch.dict(os.environ,{'CLAUDE_CODE_REMOTE_SESSION_ID':'different-session'}):
                worker.release_at_session_end({'hook_event_name':'SessionEnd'})
                store.assert_not_called()
            worker.release_at_session_end({'hook_event_name':'SessionEnd'})
            store.return_value.release_job.assert_called_once_with('fixture.site','saved-job','original-owner')
            self.assertFalse(worker.lease_marker().exists())

    def test_busy_job_does_not_write_replacement_intake(self):
        class Durable:
            def pending(self,site):return []
            def claim_job(self,*a):return {'status':'busy'}
        with self.assertRaisesRegex(ValueError,'active job lease'):worker.intake('one.test',Durable(),None,'second-owner-123456')
        self.assertFalse(Path('reports').exists())
    def test_corrupt_saved_packet_refused(self):
        class Durable:
            def pending(self,site):return []
            def claim_job(self,*a):return {'status':'claimed','packetText':'{}','packetSha256':'wrong','checkpoints':[]}
        with self.assertRaisesRegex(ValueError,'bytes changed'):worker.intake('one.test',Durable(),None,'owner-1234567890')
    def test_recovery_does_not_overwrite_local_evidence(self):
        Path('reports').mkdir();p=Path('reports/audit.json');p.write_bytes(b'unrelated newer evidence');raw=b'saved original'
        cp=[{'artifacts':[{'path':str(p),'sha256':hashlib.sha256(raw).hexdigest(),'base64':base64.b64encode(raw).decode()}]}]
        with self.assertRaisesRegex(ValueError,'without overwriting'):worker.restore_artifacts(cp)
        self.assertEqual(p.read_bytes(),b'unrelated newer evidence')
    def test_checkpoint_round_trip_preserves_exact_bytes(self):
        Path('reports').mkdir();p=Path('reports/audit.json');raw=b'{"findings":["FAIL"], "reworks":2}\n';p.write_bytes(raw)
        cp=worker.capture_artifacts([str(p)]);p.unlink();worker.restore_artifacts([{'artifacts':cp}]);self.assertEqual(p.read_bytes(),raw)
    def test_completion_only_checkpoint_recovers_bound_chart_and_receipt(self):
        root = Path('reports'); root.mkdir()
        chart = root/'chart.md'; chart.write_bytes(b'Exact original chart.\n')
        receipt = root/'decision.json'; receipt.write_text(json.dumps({'chartSha256': worker.digest(chart), 'intakeSha256': 'fixture'}))
        completion = root/'completion.json'; completion.write_text(json.dumps({'runId':'fixture-run','intakeSha256':'fixture','decisions':[], 'chart':str(chart), 'chartReview':str(receipt)}))
        stored = worker.capture_artifacts([str(completion)])
        chart.unlink(); receipt.unlink(); worker.restore_artifacts([{'artifacts':stored}])
        self.assertEqual(chart.read_bytes(), b'Exact original chart.\n')
        chart.write_bytes(b'Changed chart')
        with self.assertRaisesRegex(ValueError,'exact independently reviewed'):
            worker.capture_artifacts([str(completion)])

    def test_checkpoint_refuses_source_and_path_escape(self):
        for p in ['src/page.md','reports/../../.env','/tmp/token']:
            with self.assertRaises(ValueError):worker.artifact_path(p)
    def test_checkpoint_refuses_secret_values(self):
        Path('reports').mkdir();Path('reports/out.json').write_text('private-credential-test-1234')
        with patch.dict(os.environ,{'API_KEY':'private-credential-test-1234'}):
            with self.assertRaisesRegex(ValueError,'Credential'):worker.capture_artifacts(['reports/out.json'])
    def test_recovery_refuses_symlink_outside_reports(self):
        Path('reports').mkdir();Path('private').mkdir();Path('reports/escape').symlink_to(Path('private').resolve(),target_is_directory=True)
        with self.assertRaisesRegex(ValueError,'symlink'):worker.artifact_path('reports/escape/key')
    def test_transport_retries_transient_error(self):
        store=worker.Store.__new__(worker.Store);store.url='https://one.invalid';store.key='test'
        response=MagicMock();response.__enter__.return_value.read.return_value=b'{"ok":true}'
        with patch.object(worker.urllib.request,'urlopen',side_effect=[urllib.error.URLError('temporary'),response]) as call,patch.object(worker.time,'sleep'):
            self.assertTrue(store.request('rpc/test','POST',{})['ok']);self.assertEqual(call.call_count,2)
    def test_auth_error_not_retried_or_misread_as_empty(self):
        store=worker.Store.__new__(worker.Store);store.url='https://one.invalid';store.key='test'
        error=urllib.error.HTTPError('https://one.invalid',403,'Forbidden',{},None)
        with patch.object(worker.urllib.request,'urlopen',side_effect=error) as call:
            with self.assertRaises(urllib.error.HTTPError):store.request('queue')
            self.assertEqual(call.call_count,1)

class ParkBlockedJob(unittest.TestCase):
    """Owner rule 2026-11-13: a provably unfinishable job stops holding later demand."""
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd)
        Path('reports').mkdir()
        self.packet={'site':'one.test','runId':'old-job','candidates':[{'id':c,'eventIds':[c+'-e']} for c in ('done','held','pub')]}
        Path('reports/intake.json').write_text(json.dumps(self.packet))
        Path('reports/chart.md').write_text('chart');Path('reports/review.json').write_text('{}')
        self.decisions=[{'id':'done','status':'dropped','reason':'x'*30},{'id':'held','status':'pending','reason':'HELD on /tools/calc at audit limit'},{'id':'pub','status':'published','paths':['/a'],'reason':'y'*30}]
        Path('reports/approved.json').write_text(json.dumps({'routes':[{'path':'/a'}]}))
        Path('reports/completion.json').write_text(json.dumps({'site':'one.test','runId':'old-job','intakeSha256':worker.digest('reports/intake.json'),
            'chart':'reports/chart.md','chartReview':'reports/review.json','decisions':self.decisions,'rendered':[{'approved':'reports/approved.json','review':'reports/review.json'}]}))
        Path('reports/holds.json').write_text(json.dumps({'held':{'route':'/tools/calc','basis':'released-at-audit-limit','releaseCommit':'a'*40}}))
        raw=Path('reports/intake.json').read_text()
        self.store=MagicMock();self.store.claim_job.return_value={'status':'claimed','packetSha256':hashlib.sha256(raw.encode()).hexdigest(),
            'checkpoints':[{'canonicalJobs':{'j':'j'},'reviewCounters':{'audit:/tools/calc':2},'verifiedContinuation':{'keep':1},'stage':'old'}],'createdAt':'2026-11-09T00:00:00+00:00'}
        for target in [patch.object(worker.native,'validate_decisions',return_value=self.decisions),patch.object(worker.native,'metadata_coverage',return_value=set()),
                       patch.object(worker,'full_history'),patch.object(worker.subprocess,'run',side_effect=self.fake_run),
                       patch.object(worker,'capture_artifacts',return_value=[]),patch.object(worker,'verify_hold',return_value={'basis':'released-at-audit-limit'}),
                       patch.object(worker,'declared_references',return_value={('reports/blobs/src.md','b'*64)})]:
            target.start();self.addCleanup(target.stop)
    archive='artifacts/'+'z'*64+'\n';needs='reports/blobs/src.md'
    def fake_run(self,args,**kw):
        if 'ls-tree' in args:return SimpleNamespace(stdout=self.archive,stderr='',returncode=0 if self.archive else 128)
        if any('rendered-audit.py' in str(a) for a in args):return SimpleNamespace(stdout='',stderr='BLOCKED: Missing actual review dependency before checkpoint: '+self.needs+'\n',returncode=1)
        return SimpleNamespace(stdout='',stderr='',returncode=0)
    def run_park(self,holds='reports/holds.json'):
        return worker.park('reports/intake.json','reports/completion.json',self.store,'owner-1234567890abcdef','Evidence for the reviewed release was lost from every branch.',holds)
    def test_lost_evidence_and_verified_hold_are_parked_settled_work_acknowledged(self):
        with patch.object(worker.native,'validate_render_groups',side_effect=ValueError('any failure')),patch.object(worker,'evidence_available',return_value=False):
            result=self.run_park()
        self.assertEqual(result['status'],'parked')
        self.assertEqual([c.args[3]['id'] for c in self.store.acknowledge_job.call_args_list],['done'])
        receipt=self.store.park_job.call_args.args[3]
        self.assertEqual({b['id']:b['kind'] for b in receipt['blocked']},{'held':'verified-hold','pub':'published-evidence-lost'})
        self.assertEqual(receipt['blocked'][1]['groups'][0]['lostEvidence'],[{'path':'reports/blobs/src.md','sha256':'b'*64}])
        saved=self.store.checkpoint_job.call_args.args[3]
        self.assertEqual((saved['stage'],saved['reviewCounters'],saved['verifiedContinuation']),('park-requested',{'audit:/tools/calc':2},{'keep':1}))
        self.store.release_job.assert_not_called()
    def test_fixable_group_is_refused_and_lease_released(self):
        with patch.object(worker.native,'validate_render_groups',side_effect=ValueError('Rendered content differs')),patch.object(worker,'evidence_available',return_value=True):
            with self.assertRaisesRegex(ValueError,'fixable'):self.run_park()
        self.store.acknowledge_job.assert_not_called();self.store.park_job.assert_not_called();self.store.release_job.assert_called_once()
    def test_unavailable_archive_never_proves_loss(self):
        self.archive=''
        with patch.object(worker.native,'validate_render_groups',side_effect=ValueError('x')),patch.object(worker,'evidence_available',return_value=False):
            with self.assertRaisesRegex(ValueError,'archive unavailable'):self.run_park()
        self.store.park_job.assert_not_called();self.store.release_job.assert_called_once()
    def test_lost_file_must_be_what_the_native_check_needs(self):
        self.needs='reports/other.md'
        with patch.object(worker.native,'validate_render_groups',side_effect=ValueError('drift')),patch.object(worker,'evidence_available',return_value=False):
            with self.assertRaisesRegex(ValueError,'fixable'):self.run_park()
        self.store.park_job.assert_not_called()
    def test_pending_without_verified_hold_keeps_being_worked(self):
        with patch.object(worker.native,'validate_render_groups',return_value=None):
            with self.assertRaisesRegex(ValueError,'no verified hold'):self.run_park(holds=None)
        self.store.park_job.assert_not_called();self.store.release_job.assert_called_once()
    def test_young_job_can_be_parked_right_away(self):
        self.store.claim_job.return_value['createdAt']=worker.native.dt.datetime.now(worker.native.dt.timezone.utc).isoformat()
        with patch.object(worker.native,'validate_render_groups',return_value=None):self.assertEqual(self.run_park()['status'],'parked')
    def test_validated_publication_is_acknowledged_not_parked(self):
        with patch.object(worker.native,'validate_render_groups',return_value=None):result=self.run_park()
        self.assertEqual(sorted(c.args[3]['id'] for c in self.store.acknowledge_job.call_args_list),['done','pub'])
        self.assertEqual([b['id'] for b in self.store.park_job.call_args.args[3]['blocked']],['held'])
    def test_intake_excludes_parked_observations(self):
        store=worker.native.Store.__new__(worker.native.Store);calls=[]
        def request(path,method='GET',body=None):calls.append(path);return []
        store.request=request;store.pending('one.test')
        self.assertIn('resolution-%3Eparked=is.null',calls[1])

class ParkEvidenceChecks(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd);Path('reports').mkdir()
    def test_references_followed_through_nested_review_files(self):
        Path('reports/b.json').write_text(json.dumps({'deps':[{'path':'reports/c.md','sha256':'c'*64}]}))
        Path('reports/a.json').write_text(json.dumps({'review':{'path':'reports/b.json','sha256':worker.digest('reports/b.json')},'other':{'path':'src/x','sha256':'d'*64}}))
        self.assertEqual(worker.declared_references(['reports/a.json']),{('reports/b.json',worker.digest('reports/b.json')),('reports/c.md','c'*64)})
    def test_any_recovery_source_means_not_lost(self):
        worker.subprocess.run(['git','init','--quiet'],check=True)
        self.assertFalse(worker.evidence_available('reports/gone.md','e'*64,'',set()))
        self.assertTrue(worker.evidence_available('reports/gone.md','e'*64,'artifacts/'+'e'*64,set()))
        self.assertTrue(worker.evidence_available('reports/gone.md','e'*64,'',{'e'*64}))
        Path('reports/content-review-evidence').mkdir();Path('reports/content-review-evidence/'+'e'*64+'.md').write_text('x')
        self.assertTrue(worker.evidence_available('reports/gone.md','e'*64,'',set()))
    def test_hold_requires_named_route_and_native_audit_limit(self):
        decision={'reason':'HELD: /tools/calc failed audit round 2 of 2'}
        with self.assertRaisesRegex(ValueError,'named in the reviewed'):worker.verify_hold('one.test',decision,{'route':'/tools/ca','basis':'released-at-audit-limit'},{'job'},'https://one.test')
        with self.assertRaisesRegex(ValueError,'Unsupported'):worker.verify_hold('one.test',decision,{'route':'/tools/calc','basis':'tired'},{'job'},'https://one.test')
        cycle={'jobId':'job','status':'needs-fix','rounds':[{'number':1,'status':'complete','verdict':'FAIL','fingerprint':'f'}]}
        class Journal:
            def __init__(self,*a):pass
            def __enter__(self):self.cycle=cycle;return self
            def __exit__(self,*a):return False
        fake=SimpleNamespace(Journal=Journal,exhausted=lambda c:len(c['rounds'])>=2)
        with patch.object(worker,'native_tool',return_value=fake):
            with self.assertRaisesRegex(ValueError,'Audit limit'):worker.verify_hold('one.test',decision,{'route':'/tools/calc','basis':'released-at-audit-limit'},{'job'},'https://one.test')
            cycle['rounds'].append({'number':2,'status':'complete','verdict':'FAIL','fingerprint':'f'})
            with self.assertRaisesRegex(ValueError,'No native review cycle'):worker.verify_hold('one.test',decision,{'route':'/tools/calc','basis':'released-at-audit-limit'},{'other-job'},'https://one.test')
            Path('reports/snap.json').write_text(json.dumps({'manifest':{'canonicalBase':'http://127.0.0.1:9'},'routes':[{'path':'/tools/calc','fingerprint':'f'}]}))
            with patch.object(worker,'live_fingerprint',return_value='changed') as live:
                with self.assertRaisesRegex(ValueError,'another site'):worker.verify_hold('one.test',decision,{'route':'/tools/calc','basis':'released-at-audit-limit','snapshot':'reports/snap.json'},{'job'},'https://one.test')
                Path('reports/snap.json').write_text(json.dumps({'manifest':{'canonicalBase':'https://www.one.test'},'routes':[{'path':'/tools/calc','fingerprint':'f'}]}))
                with self.assertRaisesRegex(ValueError,'Live production page is not'):worker.verify_hold('one.test',decision,{'route':'/tools/calc','basis':'released-at-audit-limit','snapshot':'reports/snap.json'},{'job'},'https://one.test')
                self.assertEqual(live.call_args.args[2],'https://one.test')
    def test_route_token_is_exact(self):
        self.assertFalse(worker.names_route('HELD on /about page','/a'));self.assertTrue(worker.names_route('HELD: /a edit reverted','/a'))

class OwnerCloseOut(unittest.TestCase):
    """Owner rule 2026-11-13: close an old job as the owner's registered request says."""
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd)
        Path('reports/search-gap/owner-requests').mkdir(parents=True)
        self.packet={'site':'one.test','runId':'old-job','candidates':[{'id':c,'eventIds':[c+'-e']} for c in ('pub','fresh','none','done')]}
        Path('reports/intake.json').write_text(json.dumps(self.packet))
        Path('reports/completion.json').write_text(json.dumps({'runId':'old-job','intakeSha256':worker.digest('reports/intake.json')}))
        self.request='reports/search-gap/owner-requests/old-job.json'
        Path(self.request).write_text(json.dumps({'runId':'old-job','site':'one.test','canonicalBase':'https://www.one.test','reason':'owner choice','candidates':{
            'pub':{'action':'publish-as-written','routes':[{'path':'/a','requiredText':['Only the draft says this']}]},'none':{'action':'publish-as-written','routes':[{'path':'/b','requiredText':['Another draft-only line']}]},'fresh':{'action':'restart'},
            'done':{'action':'settled','completion':'reports/completion.json'}}}))
        Path('reports/published.json').write_text(json.dumps({'pub':['/a']}))
        raw=Path('reports/intake.json').read_text()
        self.store=MagicMock();self.store.owner_request_sha.return_value=worker.digest(self.request)
        self.store.claim_job.return_value={'status':'claimed','packetSha256':hashlib.sha256(raw.encode()).hexdigest(),'checkpoints':[{'reviewCounters':{'audit:/a':1},'canonicalJobs':{'j':'j'}}],'createdAt':'2026-11-09T00:00:00+00:00'}
        request_bytes=Path(self.request).read_bytes()
        def fake_run(args,**kw):
            if args[:3]==['git','show','-s']:return SimpleNamespace(stdout='2026-11-13T16:00:00+00:00\n',returncode=0)
            if '--name-only' in args:return SimpleNamespace(stdout='src/a.py\n',returncode=0)
            if args[:2]==['git','show']:return SimpleNamespace(stdout=request_bytes,returncode=0)
            return SimpleNamespace(stdout='',returncode=0)
        for target in [patch.object(worker,'capture_artifacts',return_value=[]),patch.object(worker.native,'validate_decisions',return_value=[{'id':'done','status':'dropped','reason':'x'*30}]),
                       patch.object(worker.subprocess,'run',side_effect=fake_run),patch.dict('sys.modules',{'publication_history':SimpleNamespace(published=lambda c:c)})]:
            target.start();self.addCleanup(target.stop)
    def close(self,published='reports/published.json',check=False):
        return worker.owner_close('reports/intake.json',self.request,self.store,'owner-1234567890abcdef',published,'c'*40,check)
    def test_publishes_live_drafts_settles_reviewed_and_restarts_the_rest(self):
        with patch.object(worker,'live_ok',return_value=True):result=self.close()
        acked={c.args[3]['id']:c.args[3]['status'] for c in self.store.acknowledge_job.call_args_list}
        self.assertEqual(acked,{'pub':'published','done':'dropped'})
        receipt=self.store.owner_close_job.call_args.args[3]
        self.assertEqual(sorted(receipt['restart']),['fresh','none']);self.assertEqual(receipt['published'],{'pub':['/a']})
        self.assertEqual(self.store.checkpoint_job.call_args.args[3]['reviewCounters'],{'audit:/a':1});self.assertEqual(result['status'],'owner-closed')
    def test_unregistered_request_is_refused(self):
        self.store.owner_request_sha.return_value='0'*64
        with self.assertRaisesRegex(ValueError,'not registered'):self.close()
        self.store.claim_job.assert_not_called()
    def test_only_the_drafts_own_routes_can_be_reported(self):
        Path('reports/published.json').write_text(json.dumps({'pub':['/']}))
        with self.assertRaisesRegex(ValueError,'exactly the request'):self.close()
        Path('reports/published.json').write_text(json.dumps({'fresh':['/a']}))
        with self.assertRaisesRegex(ValueError,'Only publish-as-written'):self.close()
    def test_live_check_needs_exact_route_and_draft_text(self):
        def opener(html,final):
            response=MagicMock();response.__enter__.return_value=response;response.status=200;response.geturl.return_value=final;response.read.return_value=html.encode();return response
        with patch.object(worker.urllib.request,'urlopen',return_value=opener('<main><p>Only the  draft says&nbsp;this</p></main>','https://www.one.test/a')):
            self.assertTrue(worker.live_ok('https://www.one.test/a',['Only the draft says this']))
        with patch.object(worker.urllib.request,'urlopen',return_value=opener('<main>old page</main>','https://www.one.test/a')):
            self.assertFalse(worker.live_ok('https://www.one.test/a',['Only the draft says this']))
        with patch.object(worker.urllib.request,'urlopen',return_value=opener('<p>Only the draft says this</p>','https://www.one.test/')):
            self.assertFalse(worker.live_ok('https://www.one.test/a',['Only the draft says this']))
    def test_page_not_live_is_refused_and_lease_released(self):
        with patch.object(worker,'live_ok',return_value=False):
            with self.assertRaisesRegex(ValueError,'not live at exactly'):self.close()
        self.store.acknowledge_job.assert_not_called();self.store.owner_close_job.assert_not_called();self.store.release_job.assert_called_once()
    def test_check_runs_every_gate_but_closes_nothing(self):
        result=self.close(check=True)
        self.assertEqual(result['status'],'owner-close-check-passed');self.store.acknowledge_job.assert_not_called();self.store.owner_close_job.assert_not_called()
        self.store.release_job.assert_called_once()
    def test_no_waiting_period(self):
        self.store.claim_job.return_value['createdAt']=worker.native.dt.datetime.now(worker.native.dt.timezone.utc).isoformat()
        self.assertEqual(self.close(check=True)['status'],'owner-close-check-passed')
    def test_request_shown_to_routine_only_when_registered(self):
        raw=Path('reports/intake.json').read_text()
        class Durable:
            def pending(self,site):return []
            def claim_job(self,*a):return {'status':'claimed','packetText':raw,'packetSha256':hashlib.sha256(raw.encode()).hexdigest(),'checkpoints':[]}
            def owner_request_sha(self,site,run):return self.sha
        store=Durable();os.remove('reports/intake.json')
        store.sha='0'*64
        with patch.object(worker,'remember_lease'):result=worker.intake('one.test',store,None,'new-owner-12345678')
        self.assertNotIn('OWNER CLOSE-OUT',result['nextAction'])
        os.remove(result['intakeFile']);store.sha=worker.digest(self.request)
        with patch.object(worker,'remember_lease'):result=worker.intake('one.test',store,None,'new-owner-12345678')
        self.assertTrue(result['nextAction'].startswith('OWNER CLOSE-OUT REQUEST'))

class AutoCloseSameDay(unittest.TestCase):
    """Owner rule 2026-11-13: anything stuck is fixed in the same run, never left for later."""
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd);Path('reports').mkdir()
        self.packet={'site':'one.test','runId':'job','candidates':[{'id':'rev','eventIds':['e1']},{'id':'unrev','eventIds':['e2']},{'id':'none','eventIds':['e3']},{'id':'again','eventIds':['e4']}]}
        Path('reports/intake.json').write_text(json.dumps(self.packet))
        Path('reports/written.json').write_text(json.dumps({'rev':[{'path':'/a','requiredText':['Reviewed draft text appears']}],'unrev':[{'path':'/b','requiredText':['Unreviewed draft text here']}]}))
        Path('reports/published.json').write_text(json.dumps({'rev':['/a']}))
        raw=Path('reports/intake.json').read_text()
        self.store=MagicMock();self.store.owner_policy.return_value=True;self.store.prior_restarted_events.return_value={'e4'}
        self.store.claim_job.return_value={'status':'claimed','packetSha256':hashlib.sha256(raw.encode()).hexdigest(),'checkpoints':[{'stage':'audit-round1-fail','reviewCounters':{'audit:/a':1},'canonicalJobs':{'j':'job-1'}}],'createdAt':worker.native.dt.datetime.now(worker.native.dt.timezone.utc).isoformat()}
        self.reviewed={'/a':'Subscribe to our newsletter today. Intro. Reviewed draft text appears here.'}
        for target in [patch.object(worker,'capture_artifacts',return_value=[]),patch.object(worker,'site_base',return_value='https://www.one.test'),patch.object(worker,'home_text',return_value='Home. Subscribe to our newsletter today.'),
                       patch.object(worker,'reviewed_text',side_effect=lambda base,route,jobs,created:self.reviewed.get(route) if jobs=={'job-1'} else None),
                       patch.object(worker,'live_ok',return_value=True)]:
            target.start();self.addCleanup(target.stop)
    def auto(self,check=False,published='reports/published.json'):
        return worker.owner_close('reports/intake.json',None,self.store,'owner-1234567890abcdef',published,None,check,'reports/written.json')
    def test_reviewed_draft_publishes_others_restart_and_a_failed_retry_is_closed(self):
        result=self.auto()
        acked={c.args[3]['id']:c.args[3]['status'] for c in self.store.acknowledge_job.call_args_list}
        self.assertEqual(acked,{'rev':'published','again':'dropped'})
        receipt=self.store.owner_close_job.call_args.args[3]
        self.assertTrue(receipt['autoClose']);self.assertEqual(sorted(receipt['restart']),['none','unrev']);self.assertEqual(receipt['dropped'],['again'])
        self.assertEqual(json.loads(Path('reports/search-gap/auto-close/job.json').read_text())['candidates']['unrev'],{'action':'restart'})
    def test_text_not_in_the_reviewed_capture_is_never_published(self):
        Path('reports/written.json').write_text(json.dumps({'rev':[{'path':'/a','requiredText':['Edited after the review text']}]}))
        with self.assertRaisesRegex(ValueError,'Only publish-as-written'):self.auto()
        self.assertEqual(json.loads(Path('reports/search-gap/auto-close/job.json').read_text())['candidates']['rev'],{'action':'restart'})
    def test_no_recorded_attempt_means_no_auto_close(self):
        self.store.claim_job.return_value['checkpoints']=[]
        with self.assertRaisesRegex(ValueError,'No recorded attempt'):self.auto(check=True)
        self.store.release_job.assert_called_once()
    def test_edited_request_file_is_never_trusted(self):
        self.auto(check=True);path=Path('reports/search-gap/auto-close/job.json')
        forged=json.loads(path.read_text());forged['candidates']['unrev']={'action':'publish-as-written','routes':[{'path':'/b','requiredText':['Unreviewed draft text here']}]}
        path.write_text(json.dumps(forged));Path('reports/published.json').write_text(json.dumps({'rev':['/a'],'unrev':['/b']}))
        with self.assertRaisesRegex(ValueError,'Only publish-as-written'):self.auto()
    def test_site_wide_text_is_not_draft_proof(self):
        Path('reports/written.json').write_text(json.dumps({'rev':[{'path':'/a','requiredText':['Subscribe to our newsletter today']}]}))
        with self.assertRaisesRegex(ValueError,'Only publish-as-written'):self.auto()
    def test_a_bare_checkpoint_is_not_a_recorded_attempt(self):
        self.store.claim_job.return_value['checkpoints']=[{'stage':'anything-requested'}]
        with self.assertRaisesRegex(ValueError,'No recorded attempt'):self.auto(check=True)
    def test_requires_the_owners_standing_policy(self):
        self.store.owner_policy.return_value=False
        with self.assertRaisesRegex(ValueError,'not enabled'):self.auto(check=True)
        self.store.claim_job.assert_not_called()
    def test_unreviewed_draft_can_never_be_reported_published(self):
        Path('reports/published.json').write_text(json.dumps({'unrev':['/b']}))
        with self.assertRaisesRegex(ValueError,'Only publish-as-written'):self.auto()
    def test_resumed_job_is_told_to_finish_or_close_this_run(self):
        raw=Path('reports/intake.json').read_text()
        class Durable:
            def pending(self,site):return []
            def claim_job(self,*a):return {'status':'claimed','packetText':raw,'packetSha256':hashlib.sha256(raw.encode()).hexdigest(),'checkpoints':[]}
            def owner_policy(self,site):return True
            def owner_request_sha(self,*a):return None
        os.remove('reports/intake.json')
        with patch.object(worker,'remember_lease'):result=worker.intake('one.test',Durable(),None,'new-owner-12345678')
        self.assertTrue(result['nextAction'].startswith('STANDING OWNER RULE'))

class FontInputs(unittest.TestCase):
    def test_wildcard_equivalence_preserves_original_source_bytes(self):
        original='U+0000-00FF, U+1F00-1FFF';self.assertEqual(fonts.pin_ranges(original,'u+00??,u+1f??'),original)
    def test_observed_range_difference_is_pinned_without_other_changes(self):
        self.assertEqual(fonts.pin_ranges('U+0100-02BA, U+20AD-20C4','u+0100-02ba,u+20ad-20c0'),'U+0100-02BA, U+20AD-20C0')
    def test_unknown_range_change_blocks_automatic_pin(self):
        with self.assertRaises(ValueError):fonts.pin_ranges('U+0100-02BA','U+0100-0200,U+0300-0400')
    def test_font_files_must_match_saved_content_hash(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d);(p/'fonts').mkdir();(p/'fonts'/'abc.woff2').write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError,'bytes changed'):fonts.write_environment(p,{'inputs':{'url':'sgfont://abc'},'fontFiles':{'abc':{}}})
    def test_restore_regenerates_machine_paths_without_changing_font_bytes(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d);(p/'fonts').mkdir();raw=b'font fixture';sha=hashlib.sha256(raw).hexdigest();(p/'fonts'/(sha+'.woff2')).write_bytes(raw)
            env=fonts.write_environment(p,{'inputs':{'url':'src:url(sgfont://'+sha+')'},'fontFiles':{sha:{}}});self.assertIn(str(p.resolve()),Path(env['NEXT_FONT_GOOGLE_MOCKED_RESPONSES']).read_text())

class EvidencePersistenceTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd)
        subprocess.run(['git','init','-q'],check=True)
        subprocess.run(['git','config','user.email','test@example.com'],check=True)
        subprocess.run(['git','config','user.name','Test'],check=True)
        Path('README.md').write_text('init\n')
        subprocess.run(['git','add','README.md'],check=True)
        subprocess.run(['git','commit','-q','-m','init'],check=True)

    def test_large_reports_use_private_storage_and_verify_sha256_on_restore(self):
        Path('reports/mindmap-pass').mkdir(parents=True)
        big=('Reviewed evidence line with detailed rendering notes.\n'*500).encode()
        small=b'{"verdict":"PASS"}'
        Path('reports/mindmap-pass/render-pack.json').write_bytes(big)
        Path('reports/mindmap-pass/receipt.json').write_bytes(small)
        blobs={}
        store=MagicMock()
        store.supports_evidence_storage=True
        def up(site,run_id,sha,raw):
            key=f'{site}/{run_id}/{sha}';blobs[key]=raw;return key
        store.upload_evidence.side_effect=up
        store.download_evidence.side_effect=lambda key:blobs[key]
        saved=worker.capture_artifacts(['reports/mindmap-pass/render-pack.json','reports/mindmap-pass/receipt.json'],store,'one.test','run-123')
        by_path={item['path']:item for item in saved}
        self.assertIn('storageKey',by_path['reports/mindmap-pass/render-pack.json'])
        self.assertNotIn('base64',by_path['reports/mindmap-pass/render-pack.json'])
        self.assertIn('base64',by_path['reports/mindmap-pass/receipt.json'])
        shutil.rmtree('reports')
        restored=worker.restore_artifacts([{'artifacts':saved}],store)
        self.assertEqual(restored['restored'],2)
        self.assertEqual(Path('reports/mindmap-pass/render-pack.json').read_bytes(),big)
        self.assertEqual(Path('reports/mindmap-pass/receipt.json').read_bytes(),small)
        shutil.rmtree('reports')
        blobs[by_path['reports/mindmap-pass/render-pack.json']['storageKey']]=b'tampered'
        with self.assertRaisesRegex(ValueError,'Saved artifact bytes changed'):
            worker.restore_artifacts([{'artifacts':saved}],store)

    def test_auto_sweep_captures_reports_and_excludes_intakes_and_secrets(self):
        Path('reports/search-gap').mkdir(parents=True)
        Path('reports/mindmap-pass').mkdir(parents=True)
        Path('reports/search-gap/intake-current.json').write_text('{"candidates":[{"term":"raw visitor query"}]}')
        Path('reports/mindmap-pass/chart.md').write_text('# Chart\nApproved action plan\n')
        store=SimpleNamespace(supports_evidence_storage=True)
        paths=worker.auto_evidence_paths(store=store)
        self.assertIn('reports/mindmap-pass/chart.md',paths)
        self.assertNotIn('reports/search-gap/intake-current.json',paths)
        Path('reports/mindmap-pass/secret.txt').write_text('token sk-ant-api03-secretvalue1234567890abcdef')
        with self.assertRaisesRegex(ValueError,'Credential value found'):
            worker.capture_artifacts(['reports/mindmap-pass/secret.txt'])

class FreshRuleAccountingAndEndRunTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd)
        subprocess.run(['git','init','-q'],check=True)
        Path('reports/search-gap').mkdir(parents=True)

    def test_fresh_job_receives_standing_owner_rule_immediately(self):
        owner='fresh-run-12345678'
        class FreshStore:
            def pending(self,site):
                return [{'event_id':'ev1','payload':{'term':'shbg levels','source':'search','path':'/','created_at':'2026-11-13T18:00:00Z'}}]
            def claim_job(self,site,owner_arg,packet_text):
                parsed=json.loads(packet_text)
                return {'status':'claimed','runId':parsed['runId'],'packetText':packet_text,'packetSha256':hashlib.sha256(packet_text.encode()).hexdigest(),'checkpoints':[]}
            def owner_policy(self,site):return True
            def owner_request_sha(self,site,run):return None
        with patch.object(worker,'remember_lease'):
            out=worker.intake('one.test',FreshStore(),'reports/search-gap/intake-current.json',owner)
        self.assertFalse(out['resumed'])
        self.assertTrue(out['nextAction'].startswith('STANDING OWNER RULE'))

    def test_partial_finish_and_settled_dispositions_preserved_in_auto_close(self):
        packet={'site':'one.test','runId':'job-p','candidates':[
            {'id':'already_pub','eventIds':['e1']},
            {'id':'already_drop','eventIds':['e2']},
            {'id':'retained_noadd','eventIds':['e3']},
            {'id':'unfinished','eventIds':['e4']}
        ]}
        intake_path=Path('reports/search-gap/intake-current.json')
        intake_path.write_text(json.dumps(packet))
        chart_path=Path('reports/search-gap/chart.md');chart_path.write_text('# Chart\n')
        decisions=[
            {'id':'already_pub','status':'published','reason':'Published SHBG guide with full clinical citations','paths':['/biomarkers/shbg']},
            {'id':'already_drop','status':'dropped','reason':'Off-mission query outside site scope','paths':[]},
            {'id':'retained_noadd','status':'no-addition','reason':'Already covered thoroughly on /guide','paths':[]},
            {'id':'unfinished','status':'pending','reason':'Held on missing clinical source','paths':[]}
        ]
        receipt_path=Path('reports/search-gap/chart-review.json')
        receipt_path.write_text(json.dumps({
            'author':'builder-1','reviewer':'reviewer-2','verdict':'PASS',
            'chartSha256':worker.digest(chart_path),
            'intakeSha256':worker.digest(intake_path),
            'decisionsSha256':hashlib.sha256(json.dumps(decisions,sort_keys=True).encode()).hexdigest()
        }))
        comp_path=Path('reports/search-gap/completion.json')
        comp_path.write_text(json.dumps({
            'site':'one.test','runId':'job-p','intakeSha256':worker.digest(intake_path),
            'chart':str(chart_path),'chartReview':str(receipt_path),'decisions':decisions
        }))
        store=MagicMock()
        store.owner_policy.return_value=True
        store.prior_restarted_events.return_value=set()
        store.acknowledged_decisions.return_value={
            'already_pub':{'id':'already_pub','status':'published','paths':['/biomarkers/shbg']},
            'already_drop':{'id':'already_drop','status':'dropped','paths':[]}
        }
        store.claim_job.return_value={
            'status':'claimed',
            'packetSha256':hashlib.sha256(intake_path.read_bytes()).hexdigest(),
            'checkpoints':[
                {'stage':'build-pass','canonicalJobs':{'c1':'job-a'}},
                {'stage':'partial-finish','completionFile':str(comp_path),'canonicalJobs':{'c2':'job-b'}}
            ],
            'createdAt':worker.native.dt.datetime.now(worker.native.dt.timezone.utc).isoformat()
        }
        self.assertEqual(worker.recorded_canonical_jobs(store.claim_job.return_value['checkpoints']),{'job-a','job-b'})
        self.assertEqual(worker.recorded_canonical_jobs([{'reviewCounters':{'chart-review:job-fallback':1}}]),{'job-fallback'})
        with patch.object(worker,'capture_artifacts',return_value=[]), \
             patch.object(worker,'site_base',return_value='https://www.one.test'), \
             patch.object(worker,'home_text',return_value='Home'), \
             patch.object(worker,'live_ok',return_value=True):
            res=worker.owner_close(str(intake_path),None,store,'owner-1234567890abcdef',None,None,False,'')
        self.assertEqual(res['status'],'owner-closed')
        acked={c.args[3]['id']:c.args[3]['status'] for c in store.acknowledge_job.call_args_list}
        self.assertEqual(acked,{'retained_noadd':'no-addition'})
        receipt=store.owner_close_job.call_args.args[3]
        self.assertEqual(receipt['published'],{'already_pub':['/biomarkers/shbg']})
        self.assertEqual(sorted(receipt['settled']),['already_drop','retained_noadd'])
        self.assertEqual(receipt['dropped'],[])
        self.assertEqual(receipt['restart'],['unfinished'])

    def test_end_run_records_blocker_and_auto_closes_uncheckpointed_job(self):
        packet={'site':'one.test','runId':'job-b','candidates':[{'id':'c1','eventIds':['e1']}]}
        intake_path=Path('reports/search-gap/intake-current.json')
        intake_path.write_text(json.dumps(packet))
        store=MagicMock()
        store.owner_policy.return_value=True
        store.prior_restarted_events.return_value=set()
        store.acknowledged_decisions.return_value={}
        checkpoints=[]
        def claim_side_effect(*a):
            return {'status':'claimed','runId':'job-b','packetSha256':hashlib.sha256(intake_path.read_bytes()).hexdigest(),'checkpoints':list(checkpoints),'createdAt':worker.native.dt.datetime.now(worker.native.dt.timezone.utc).isoformat()}
        def cp_side_effect(site,run_id,owner,meta):
            checkpoints.append(meta);return {'checkpointCount':len(checkpoints)}
        store.claim_job.side_effect=claim_side_effect
        store.checkpoint_job.side_effect=cp_side_effect
        with patch.dict(os.environ,{'CLAUDE_CODE_SESSION_ID':'sess-endrun'}), \
             patch.object(worker,'capture_artifacts',return_value=[]), \
             patch.object(worker,'site_base',return_value='https://www.one.test'), \
             patch.object(worker,'home_text',return_value='Home'):
            worker.remember_lease('one.test','job-b','owner-1234567890abcdef',str(intake_path),True)
            res=worker.end_run(str(intake_path),store,'owner-1234567890abcdef',reason='write reservation blocked')
        self.assertEqual(res['status'],'owner-closed')
        self.assertEqual(checkpoints[0]['stage'],'run-blocked')
        lease_files=list((Path('.git/search-gap-recovery/leases')).glob('*.json'))
        self.assertTrue(lease_files and json.loads(lease_files[0].read_text()).get('closed') is True)

class SessionEndHookAndArchiveTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.cwd=Path.cwd();os.chdir(self.tmp.name);self.addCleanup(os.chdir,self.cwd)
        subprocess.run(['git','init','-q'],check=True)
        subprocess.run(['git','config','user.email','test@example.com'],check=True)
        subprocess.run(['git','config','user.name','Test'],check=True)

    def test_pre_bash_and_stop_hooks_enforce_close_out_before_reporting_or_exit(self):
        import session_end
        root=Path(self.tmp.name)
        with patch.dict(os.environ,{'CLAUDE_CODE_SESSION_ID':'sess-abc'}):
            worker.remember_lease('one.test','job-x','owner-1234567890abcdef','reports/search-gap/intake-current.json',True)
            allow,msg=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'curl -X POST https://api.example/api/routine-run'}})
            self.assertFalse(allow);self.assertIn('end-run',msg)
            allow,msg=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'.claude/scripts/send-routine-email.py --status failure'}})
            self.assertFalse(allow)
            allow,msg=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'python3 scripts/search_gap/job_worker.py end-run --deploy || true'}})
            self.assertFalse(allow);self.assertIn('exit-code',msg)
            allow,msg=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'python3 scripts/search_gap/job_worker.py end-run --deploy || : '}})
            self.assertFalse(allow);self.assertIn('exit-code',msg)
            allow,msg=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'python3 scripts/search_gap/job_worker.py end-run --deploy || exit 0'}})
            self.assertFalse(allow);self.assertIn('exit-code',msg)
            allow,_=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'.claude/scripts/send-routine-email.py --skill competitor-content-auto --status success'}})
            self.assertTrue(allow)
            allow,msg=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'python3 scripts/search_gap/job_worker.py end-run --site one.test --owner owner-1234567890abcdef --intake reports/search-gap/intake-current.json --deploy'}})
            self.assertTrue(allow)
            allow_stop,stop_reason=session_end.decide_stop(root,{'session_id':'sess-abc'})
            self.assertFalse(allow_stop);self.assertIn('end-run',stop_reason)
            worker.mark_lease_closed('job-x')
            allow,_=session_end.decide_pre_bash(root,{'session_id':'sess-abc','tool_input':{'command':'curl -X POST https://api.example/api/routine-run'}})
            self.assertTrue(allow)
            allow_stop_after,_=session_end.decide_stop(root,{'session_id':'sess-abc'})
            self.assertTrue(allow_stop_after)

    def test_install_runtime_is_idempotent(self):
        import session_end
        root=Path(self.tmp.name)
        target_dir=root/'user-claude';target_dir.mkdir()
        target=target_dir/'settings.json'
        target.write_text(json.dumps({'env':{'FOO':'1'}}))
        session_end.install_runtime(root,target_dir)
        session_end.install_runtime(root,target_dir)
        cfg=json.loads(target.read_text())
        self.assertEqual(cfg['env']['FOO'],'1')
        self.assertEqual(len(cfg['hooks']['Stop']),1)
        self.assertEqual(len(cfg['hooks']['SessionEnd']),1)
        self.assertEqual(len(cfg['hooks']['PreToolUse']),1)

    def test_review_archive_owner_close_allows_reverted_sibling_and_rejects_unreviewed_lines(self):
        import importlib.util
        ra_path=(self.cwd/'../../.claude/tools/review-archive.py').resolve()
        spec=importlib.util.spec_from_file_location('review_archive_mod',ra_path)
        ra=importlib.util.module_from_spec(spec);spec.loader.exec_module(ra)
        root=Path(self.tmp.name)
        (root/'data').mkdir()
        (root/'data/prayers.ts').write_bytes(b'line 1\nline 2\n')
        subprocess.run(['git','add','data/prayers.ts'],check=True)
        subprocess.run(['git','commit','-q','-m','base'],check=True)
        base_rev=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
        approved_sent='Approved kolbe addition sentence that exceeds twenty five chars. Required medical disclaimer stays intact here.'
        reviewed=(f'line 1\n{approved_sent}\nheld /prayers/salvation addition\nline 2\n').encode()
        reverted_sibling=(f'line 1\n{approved_sent}\nline 2\n').encode()
        sneaky_edit=(f'line 1\n{approved_sent}\nunreviewed extra claim\nline 2\n').encode()
        stripped_disclaimer=b'line 1\nApproved kolbe addition sentence that exceeds twenty five chars.\nline 2\n'
        deleted_base=(f'{approved_sent}\nline 2\n').encode()
        kwargs={'approved_texts':[approved_sent],'held_routes':['/prayers/salvation'],'pub_route_set':{'/prayers/kolbe'}}
        self.assertTrue(ra._verified_route_subset(root,'data/prayers.ts',reverted_sibling,reviewed,base_rev,**kwargs))
        self.assertFalse(ra._verified_route_subset(root,'data/prayers.ts',sneaky_edit,reviewed,base_rev,**kwargs))
        self.assertFalse(ra._verified_route_subset(root,'data/prayers.ts',stripped_disclaimer,reviewed,base_rev,**kwargs))
        self.assertFalse(ra._verified_route_subset(root,'data/prayers.ts',reviewed,reviewed,base_rev,**kwargs))
        self.assertFalse(ra._verified_route_subset(root,'data/prayers.ts',deleted_base,reviewed,base_rev,**kwargs))

if __name__=='__main__':unittest.main()
