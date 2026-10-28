"""Exercise actual Git worktrees, including uncommitted runtime dependencies."""
import importlib.util
import io
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('freshness', Path(__file__).with_name('worktree-freshness.py'))
freshness = importlib.util.module_from_spec(spec)
spec.loader.exec_module(freshness)


class FreshnessTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.source = Path(self.tmp.name) / 'source'
        self.target = Path(self.tmp.name) / 'target'
        self.session_patch = patch.dict(os.environ, {'WORKFLOW_RUN_ID': self.tmp.name})
        self.session_patch.start(); self.addCleanup(self.session_patch.stop)
        self.source.mkdir()
        self.run_git('init', '-q')
        self.run_git('config', 'user.email', 'test@example.invalid')
        self.run_git('config', 'user.name', 'Fixture')
        self.write('src/runtime.py', 'old')
        self.write('.gitignore', '*.secret\n')
        self.run_git('add', '.')
        self.run_git('commit', '-qm', 'base')
        self.run_git('worktree', 'add', '-q', '--detach', str(self.target))

    def run_git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.source), *args], stderr=subprocess.PIPE)

    def write(self, rel, text, target=False):
        p = (self.target if target else self.source) / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)

    def check(self):
        return freshness.check(self.target)

    def test_clean_worktree_and_primary(self):
        self.assertEqual(self.check()['status'], 'current')
        self.assertEqual(freshness.check(self.source)['status'], 'current')

    def test_dirty_runtime_cannot_be_hidden_by_current_instructions(self):
        self.write('src/runtime.py', 'new')
        self.write('.claude/commands/routine.md', 'current instructions')
        self.write('.claude/commands/routine.md', 'current instructions', target=True)
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])
        self.assertEqual((self.target / 'src/runtime.py').read_text(), 'old')
        self.assertEqual((self.source / 'src/runtime.py').read_text(), 'new')

    def test_new_dependency_and_deletion(self):
        self.write('scripts/new.py', 'dependency')
        (self.source / 'src/runtime.py').unlink()
        self.assertEqual(self.check()['missing'], ['scripts/new.py', 'src/runtime.py'])

    def test_staged_changes_are_inputs(self):
        self.write('src/runtime.py', 'staged')
        self.run_git('add', 'src/runtime.py')
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_unpushed_source_commit_is_input(self):
        self.write('src/runtime.py', 'committed locally')
        self.run_git('commit', '-qam', 'local change')
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_rechecking_allows_run_edits_but_detects_later_source_changes(self):
        self.write('src/runtime.py', 'source v2')
        self.write('src/runtime.py', 'source v2', target=True)
        self.assertEqual(self.check()['status'], 'current')
        self.write('src/runtime.py', 'intentional run edit', target=True)
        self.assertEqual(self.check()['status'], 'current')
        self.write('src/runtime.py', 'source v3')
        self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_receipt_cannot_hide_next_checkout_commit(self):
        self.write('src/runtime.py', 'v2')
        self.write('src/runtime.py', 'v2', target=True)
        self.check()
        self.write('src/runtime.py', 'stale', target=True)
        subprocess.check_call(['git', '-C', str(self.target), 'commit', '-qam', 'new run base'], stdout=subprocess.DEVNULL)
        with patch.dict(os.environ, {'WORKFLOW_RUN_ID':'next-run'}):
            self.assertEqual(self.check()['missing'], ['src/runtime.py'])

    def test_reports_and_ignored_secrets_are_not_copied_or_checked(self):
        self.write('reports/output.md', 'run output')
        self.write('token.secret', 'synthetic fixture')
        self.assertEqual(self.check()['status'], 'current')
        self.assertFalse((self.target / 'token.secret').exists())

    def test_removed_untracked_input_is_rechecked(self):
        self.write('scripts/new.py', 'v1')
        self.write('scripts/new.py', 'v1', target=True)
        self.check()
        (self.source / 'scripts/new.py').unlink()
        self.assertEqual(self.check()['missing'], ['scripts/new.py'])

    def test_loader_stops_before_standard_receipt_on_stale_runtime(self):
        tools = Path(__file__).parent
        for rel in ['worktree-freshness.py', 'load-standards.sh', 'workflow-start.sh']:
            for root in [self.source, self.target]:
                dest = root / '.claude/tools' / rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(tools / rel, dest)
        for name in ['_content-standard.md', '_experience.md', '_anti-ai-language.md']:
            self.write('.claude/commands/' + name, '## DOMAIN\nFixture\n')
            self.write('.claude/commands/' + name, '## DOMAIN\nFixture\n', target=True)
        self.write('src/runtime.py', 'new')
        result = subprocess.run(['bash', str(self.target / '.claude/tools/load-standards.sh'), 'fixture', 'phase-3'], cwd=self.target, capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertIn('src/runtime.py', result.stdout)
        self.assertNotIn('standard-loaded:', result.stdout)
        self.assertFalse((self.target / 'reports/standards-ledger.jsonl').exists())
        self.write('src/runtime.py', 'new', target=True)
        result = subprocess.run(['bash', str(self.target / '.claude/tools/load-standards.sh'), 'fixture', 'phase-3'], cwd=self.target, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('standard-loaded:', result.stdout)
        self.assertTrue((self.target / 'reports/standards-ledger.jsonl').exists())

    def setup_remote(self):
        remote = Path(self.tmp.name) / 'remote.git'
        subprocess.check_call(['git', 'clone', '-q', '--bare', str(self.source), str(remote)])
        self.run_git('remote', 'add', 'origin', str(remote))

    def test_cloud_checks_live_remote_not_cached_origin(self):
        self.setup_remote()
        self.assertEqual(freshness.cloud_check(self.target)['status'], 'current')
        self.write('src/runtime.py', 'published change')
        self.run_git('commit', '-qam', 'publish runtime')
        self.run_git('push', '-q', 'origin', 'HEAD')
        self.assertEqual(freshness.cloud_check(self.target)['missing'], ['src/runtime.py'])

    def test_cloud_allows_run_edits_after_initial_check(self):
        self.setup_remote()
        freshness.cloud_check(self.target)
        self.write('src/runtime.py', 'run edit', target=True)
        self.assertEqual(freshness.cloud_check(self.target)['status'], 'current')

    def test_cloud_missing_remote_cannot_pass(self):
        with self.assertRaises(subprocess.CalledProcessError):
            freshness.cloud_check(self.target)

    def test_render_runtime_without_git_verifies_published_build(self):
        env = {'RENDER_GIT_REPO_SLUG': 'fixture/site', 'RENDER_GIT_COMMIT': 'abc'}
        with patch.dict(os.environ, env, clear=True), patch.object(freshness.urllib.request, 'urlopen', side_effect=[io.StringIO('{"default_branch":"main"}'), io.StringIO('{"sha":"abc"}')]), patch.object(freshness, 'git', side_effect=AssertionError('Runtime has no git')):
            self.assertEqual(freshness.cloud_check('/no-git')['status'], 'current')

    def test_render_old_build_cannot_pass(self):
        env = {'RENDER_GIT_REPO_SLUG': 'fixture/site', 'RENDER_GIT_COMMIT': 'old'}
        with patch.dict(os.environ, env, clear=True), patch.object(freshness.urllib.request, 'urlopen', side_effect=[io.StringIO('{"default_branch":"main"}'), io.StringIO('{"sha":"new"}')]):
            self.assertEqual(freshness.cloud_check('/no-git')['missing'], ['deployed-build-revision'])

    def test_render_uses_dedicated_reader_without_changing_publishing_credentials(self):
        env = {'RENDER_GIT_REPO_SLUG': 'fixture/site', 'RENDER_GIT_COMMIT': 'abc',
               'WORKFLOW_GITHUB_TOKEN': 'fixture-reader', 'GIT_PUSH_TOKEN': 'fixture-publisher',
               'GITHUB_TOKEN': 'fixture-legacy'}

        def request_response(request, **kwargs):
            self.assertEqual(request.get_header('Authorization'), 'Bearer fixture-reader')
            return io.StringIO('{"sha":"abc"}' if '/commits/' in request.full_url else '{"default_branch":"main"}')

        with patch.dict(os.environ, env, clear=True), patch.object(freshness.urllib.request, 'urlopen', side_effect=request_response):
            self.assertEqual(freshness.cloud_check('/no-git')['status'], 'current')
            for name, value in env.items():
                self.assertEqual(os.environ[name], value)


import pathlib
import json
f = freshness

class PrimaryTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.envpatch=patch.dict(os.environ,{'WORKFLOW_RUN_ID':self.tmp.name});self.envpatch.start();self.addCleanup(self.envpatch.stop);self.addCleanup(self.tmp.cleanup);self.root=pathlib.Path(self.tmp.name)/'source';self.root.mkdir();self.g('init','-q');self.g('config','user.name','Fixture');self.g('config','user.email','fixture@example.invalid');self.write('a.txt','one\ntwo\nthree\nfour\nfive\n');self.g('add','.');self.g('commit','-qm','initial');self.remote=pathlib.Path(self.tmp.name)/'remote.git';subprocess.check_call(['git','clone','-q','--bare',str(self.root),str(self.remote)]);self.g('remote','add','origin',str(self.remote));self.publisher=pathlib.Path(self.tmp.name)/'publisher';subprocess.check_call(['git','clone','-q',str(self.remote),str(self.publisher)]);self.g('config','user.name','Publisher',root=self.publisher);self.g('config','user.email','publisher@example.invalid',root=self.publisher)
 def g(self,*args,root=None):return subprocess.check_output(['git','-C',str(root or self.root),*args],stderr=subprocess.PIPE)
 def write(self,path,text,root=None):p=(root or self.root)/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
 def publish(self,path='a.txt',text='published\ntwo\nthree\nfour\nfive\n'):
  self.write(path,text,self.publisher);self.g('add','.',root=self.publisher);self.g('commit','-qm','published',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher)
 def test_symlink_is_not_regular_file(self):
  self.assertFalse(f.includes_published(('100644',b'a'),('120000',b'b'),('100644',b'b')))
 def test_receipt_different_run_cannot_hide_revert(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nfive\n')
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'first'}):self.assertEqual(f.primary_check(self.root)['status'],'current')
  self.g('checkout','HEAD','--','a.txt')
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'second'}):self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_cloud_untracked_inputs_block_new_run(self):
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'first'}):
   self.assertEqual(f.cloud_check(self.root)['status'],'current');self.write('new.py','run owned');self.assertEqual(f.cloud_check(self.root)['status'],'current')
  with patch.dict(os.environ,{'WORKFLOW_RUN_ID':'second'}):self.assertEqual(f.cloud_check(self.root)['missing'],['new.py'])
 def test_no_run_id_never_reuses_receipt(self):
  with patch.dict(os.environ,{},clear=True):
   self.assertEqual(f.cloud_check(self.root)['status'],'current');self.write('new.py','run owned');self.assertEqual(f.cloud_check(self.root)['missing'],['new.py'])
 def test_own_commit_retains_acknowledged_base(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.primary_check(self.root)['status'],'current');self.write('a.txt','owned\ntwo\nthree\nfour\nfive\n');self.g('commit','-qam','run ownedit');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_branch_switch_invalidates(self):
  f.primary_check(self.root);self.publish();self.g('checkout','-qb','other');self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_new_file_inclusion(self):
  entry=lambda x:('100644',x)
  for local in [b'a\nb\nextra\n',b'extra\na\nb\n',b'a\nextra\nb\n']:
   self.assertTrue(f.includes_published(None,entry(local),entry(b'a\nb\n')))
  for local in [b'a\n',b'a\nchanged\n',b'b\na\n',b'a\nb',b'a\nb\n\0']:
   self.assertFalse(f.includes_published(None,entry(local),entry(b'a\nb\n')))
  self.assertFalse(f.includes_published(None,('100755',b'a\nb\nextra\n'),entry(b'a\nb\n')))
 def test_existing_file_adjacent_insertions_preserve_published_input(self):
  entry=lambda x:('100644',x)
  for local in [b'a\nlocal\nremote\nz\n', b'a\nremote\nlocal\nz\n']:
   self.assertTrue(f.includes_published(entry(b'a\nz\n'),entry(local),entry(b'a\nremote\nz\n')))
 def test_existing_file_line_preservation_rejects_loss_and_reordering(self):
  entry=lambda x:('100644',x)
  for local in [b'a\nlocal\nz\n',b'a\nchanged\nz\n',b'remote\na\nz\n',b'a\nremote\nz',b'a\nremote\n\0z\n']:
   self.assertFalse(f.includes_published(entry(b'a\nz\n'),entry(local),entry(b'a\nremote\nz\n')))
 def test_existing_file_line_preservation_rejects_mode_and_symlink_changes(self):
  self.assertFalse(f.includes_published(('100644',b'a\nz\n'),('100644',b'a\nremote\nlocal\nz\n'),('100755',b'a\nremote\nz\n')))
  self.assertFalse(f.includes_published(('120000',b'a'),('120000',b'a\nremote\nlocal\nz\n'),('120000',b'a\nremote\nz\n')))
 def test_primary_adjacent_insertions_are_current_without_mutation(self):
  self.publish(text='one\nremote\ntwo\nthree\nfour\nfive\n')
  self.write('a.txt','one\nlocal\nremote\ntwo\nthree\nfour\nfive\n')
  before=self.g('status','--porcelain')
  self.assertEqual(f.primary_check(self.root)['status'],'current')
  self.assertEqual(self.g('status','--porcelain'),before)
 def test_cloud_receipt_handles_next_publication(self):
  self.assertEqual(f.cloud_check(self.root)['status'],'current');self.write('own.py','owned');self.publish();self.assertEqual(f.cloud_check(self.root)['missing'],['a.txt']);self.write('a.txt','published\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.cloud_check(self.root)['status'],'current')
 def test_clean_behind_blocks(self):self.publish();self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_remote_hunk_and_unrelated_local_edit_pass(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nlocal\n');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_overlap_blocks(self):self.publish();self.write('a.txt','other\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.primary_check(self.root)['missing'],['a.txt'])
 def test_remote_add_collision_blocks(self):self.publish('new.txt','published');self.write('new.txt','local');self.assertEqual(f.primary_check(self.root)['missing'],['new.txt'])
 def test_remote_delete_requires_integration(self):
  self.g('rm','a.txt',root=self.publisher);self.g('commit','-qm','delete',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher);self.assertEqual(f.primary_check(self.root)['missing'],['a.txt']);(self.root/'a.txt').unlink();self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_receipt_preserves_run_edits(self):
  self.assertEqual(f.primary_check(self.root)['status'],'current');self.write('a.txt','owned edit');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_next_revision_uses_acknowledged_base(self):
  self.publish();self.write('a.txt','published\ntwo\nthree\nfour\nfive\n');self.assertEqual(f.primary_check(self.root)['status'],'current');self.write('a.txt','owned\ntwo\nthree\nfour\nfive\n');self.publish(text='published\ntwo\nthree\nfour\nnew remote\n');self.assertEqual(f.primary_check(self.root)['missing'],['a.txt']);self.write('a.txt','owned\ntwo\nthree\nfour\nnew remote\n');self.assertEqual(f.primary_check(self.root)['status'],'current')
 def test_remote_mode_and_symlink(self):
  (self.publisher/'a.txt').chmod(0o755);self.g('add','.',root=self.publisher);self.g('commit','-qm','mode',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher);self.assertEqual(f.primary_check(self.root)['missing'],['a.txt']);(self.root/'a.txt').chmod(0o755);self.assertEqual(f.primary_check(self.root)['status'],'current');(self.publisher/'link').symlink_to('a.txt');self.g('add','.',root=self.publisher);self.g('commit','-qm','link',root=self.publisher);self.g('push','-q','origin','HEAD',root=self.publisher);self.assertEqual(f.primary_check(self.root)['missing'],['link'])
 def test_fetch_failure_blocks(self):
  self.g('remote','set-url','origin',str(self.remote)+'-missing')
  with self.assertRaises(subprocess.CalledProcessError):f.primary_check(self.root)
 def test_receipt_identity_cannot_hide_missing_file(self):
  f.primary_check(self.root);self.publish('new.txt','new');receipt=f.receipt_file(self.root,'primary',f.run_identity());r=json.loads(receipt.read_text());r['identity']='wrong';r['revision']=self.g('rev-parse','HEAD',root=self.publisher).decode().strip();receipt.write_text(json.dumps(r));self.assertEqual(f.primary_check(self.root)['missing'],['new.txt'])
 def test_no_worktree_or_index_mutations(self):
  before=self.g('status','--porcelain');self.publish();f.primary_check(self.root);self.assertEqual(self.g('status','--porcelain'),before)

if __name__ == '__main__':
    unittest.main()
