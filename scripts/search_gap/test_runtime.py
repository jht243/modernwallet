import base64
import hashlib
import json
import os
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
if __name__=='__main__':unittest.main()
