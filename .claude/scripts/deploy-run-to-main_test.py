#!/usr/bin/env python3
"""Unattended real-git regressions. Disposable local bare remotes only."""
import os
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

SOURCE = Path(__file__).with_name('deploy-run-to-main.sh')


class Deployment(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='layer3-deploy-test-')
        self.root = Path(self.tmp.name)
        self.remote, self.work, self.other = [self.root / n for n in ('remote.git','run','concurrent')]
        self.checklog, self.fencelog = self.root/'checks', self.root/'fences'
        self.env = dict(os.environ, GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM='1',
                        GITHUB_ACTIONS='false', CHECK_LOG=str(self.checklog), FENCE_LOG=str(self.fencelog))
        self.env.pop('PUBLISHER_RELEASE_DIR', None)
        self.cmd(['git','init','--bare','--initial-branch=main',str(self.remote)])
        self.cmd(['git','clone',str(self.remote),str(self.work)])
        self.configure(self.work)
        self.write('profile.txt','base\n'); self.write('note.txt','original\n')
        self.write('.claude/scripts/deploy-run-to-main.sh',SOURCE.read_text())
        self.write('.claude/scripts/deploy-precheck.sh', '''#!/usr/bin/env bash
test ! -f BLOCK_PRECHECK || exit 1
git rev-parse HEAD >> "$CHECK_LOG"
if [ -n "${MOVE_MAIN_ONCE:-}" ] && [ ! -f "$MOVE_MAIN_ONCE/did-move" ]; then
  touch "$MOVE_MAIN_ONCE/did-move"
  git -C "$MOVE_MAIN_ONCE" commit --allow-empty -qm 'concurrent main advance' || exit 1
  git -C "$MOVE_MAIN_ONCE" push -q origin main || exit 1
fi
''')
        self.write('scripts/publisher_failover/primary_release.py', '''import os,subprocess,sys
from pathlib import Path
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
with open(os.environ['FENCE_LOG'],'a') as f:f.write(head+'\\n')
if Path('BLOCK_FENCE').exists():sys.exit(1)
print('{"primaryPublisher": false}')
''')
        self.commit(self.work,'base'); self.git(self.work,'push','-q','origin','main')
        self.cmd(['git','clone',str(self.remote),str(self.other)]); self.configure(self.other)
        self.git(self.work,'checkout','-qb','routine')
        self.base=self.git(self.work,'rev-parse','HEAD').stdout.strip(); self.helper('mark')
        hook=self.remote/'hooks/pre-receive'
        hook.write_text('''#!/usr/bin/env bash
while read old new ref; do
  if git cat-file -e "$new:run.txt" 2>/dev/null; then
    grep -qx "$new" "$CHECK_LOG" || exit 1
    grep -qx "$new" "$FENCE_LOG" || exit 1
  fi
done
'''); hook.chmod(0o755)

    def tearDown(self): self.tmp.cleanup()

    def cmd(self,args,cwd=None,ok=True):
        r=subprocess.run(args,cwd=cwd,env=self.env,capture_output=True,text=True,timeout=40)
        if ok and r.returncode: self.fail('Fixture command failed: '+r.stdout+r.stderr)
        return r

    def git(self,cwd,*args,ok=True): return self.cmd(['git',*args],cwd,ok)

    def configure(self,where):
        for key,value in [('user.name','Deployment fixture'),('user.email','fixture@example.invalid'),('commit.gpgsign','false')]:
            self.git(where,'config',key,value)

    def write(self,name,value,where=None):
        p=(where or self.work)/name; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(value)

    def commit(self,where,message):
        self.git(where,'add','-A'); self.git(where,'commit','-qm',message)

    def helper(self,command,ok=True):
        return self.cmd(['bash','.claude/scripts/deploy-run-to-main.sh',command],self.work,ok)

    def advance(self,value):
        self.write('profile.txt',value,self.other); self.commit(self.other,'main profile')
        self.git(self.other,'push','-q','origin','main')

    def own_change(self):
        self.write('run.txt','exact reviewed candidate\n'); self.commit(self.work,'run candidate')

    def remote_tip(self): return self.git(self.remote,'rev-parse','refs/heads/main').stdout.strip()

    def integrated_main(self):
        self.write('reports/review-history.json','{"reviews":2,"reworks":1,"findings":["preserved"]}\n')
        self.commit(self.work,'canonical review history')
        self.advance('older main profile\n'); self.git(self.work,'fetch','-q','origin','main')
        self.git(self.work,'merge','--no-edit','origin/main'); self.own_change()
        self.advance('latest main profile\n')

    def test_pilot_history_recovers_without_operator_and_gates_before_push(self):
        self.integrated_main(); self.git(self.work,'fetch','-q','origin','main')
        old=self.git(self.work,'rebase','--onto','origin/main',self.base,'routine',ok=False)
        self.assertNotEqual(old.returncode,0); self.git(self.work,'rebase','--abort')
        self.write('note.txt','uncommitted note preserved\n'); r=self.helper('push')
        self.assertIn('replaying only commits absent',r.stdout)
        self.assertEqual(self.git(self.remote,'show','main:profile.txt').stdout,'latest main profile\n')
        self.assertEqual(self.git(self.remote,'show','main:run.txt').stdout,'exact reviewed candidate\n')
        self.assertEqual(self.git(self.remote,'show','main:reports/review-history.json').stdout,
                         '{"reviews":2,"reworks":1,"findings":["preserved"]}\n')
        self.assertEqual((self.work/'note.txt').read_text(),'uncommitted note preserved\n')
        self.assertEqual(self.git(self.work,'branch','--show-current').stdout.strip(),'routine')
        self.assertIn(self.remote_tip(),self.checklog.read_text().splitlines())
        self.assertIn(self.remote_tip(),self.fencelog.read_text().splitlines())

    def test_unpublished_foreign_history_below_mark_is_excluded(self):
        (self.work/'.git/run-base-routine').unlink()
        self.write('foreign.txt','must never ship\n'); self.commit(self.work,'inherited foreign work')
        self.helper('mark'); self.own_change(); self.advance('concurrent main\n'); self.helper('push')
        self.assertNotEqual(self.git(self.remote,'cat-file','-e','main:foreign.txt',ok=False).returncode,0)
        self.assertEqual(self.git(self.remote,'show','main:run.txt').stdout,'exact reviewed candidate\n')

    def test_real_content_conflict_stops_and_preserves_candidate(self):
        self.write('profile.txt','reviewed run price\n'); self.own_change()
        self.advance('different main price\n'); before=self.remote_tip()
        self.assertEqual(self.helper('push',ok=False).returncode,3)
        self.assertEqual(self.remote_tip(),before)
        self.assertEqual((self.work/'profile.txt').read_text(),'reviewed run price\n')
        self.assertFalse(self.checklog.exists()); self.assertFalse((self.work/'.git/rebase-merge').exists())

    def test_precheck_failure_after_recovery_cannot_publish(self):
        self.integrated_main(); before=self.remote_tip(); self.write('BLOCK_PRECHECK','block')
        self.assertEqual(self.helper('push',ok=False).returncode,4)
        self.assertEqual(self.remote_tip(),before); self.assertFalse(self.fencelog.exists())

    def test_ownership_failure_after_recovery_cannot_publish(self):
        self.integrated_main(); before=self.remote_tip(); self.write('BLOCK_FENCE','block')
        self.assertEqual(self.helper('push',ok=False).returncode,4)
        self.assertEqual(self.remote_tip(),before); self.assertTrue(self.checklog.exists())

    def test_main_advancing_during_precheck_retries_both_gates(self):
        self.own_change(); self.env['MOVE_MAIN_ONCE']=str(self.other); self.helper('push')
        self.assertEqual(len(self.checklog.read_text().splitlines()),2)
        self.assertEqual(len(self.fencelog.read_text().splitlines()),2)
        self.assertEqual(self.git(self.remote,'show','main:run.txt').stdout,'exact reviewed candidate\n')

    def test_mark_cannot_reset_the_run_after_commits(self):
        self.own_change(); self.assertIn('retaining original',self.helper('mark').stdout)
        self.assertEqual((self.work/'.git/run-base-routine').read_text().strip(),self.base)

    def test_unavailable_remote_cannot_use_cached_main(self):
        self.own_change(); self.git(self.work,'remote','set-url','origin',str(self.root/'missing.git'))
        self.assertEqual(self.helper('push',ok=False).returncode,3); self.assertFalse(self.checklog.exists())

    def test_unrelated_mark_is_rejected_before_publication(self):
        self.own_change(); self.advance('other branch\n'); self.git(self.work,'fetch','-q','origin','main')
        (self.work/'.git/run-base-routine').write_text(self.remote_tip()+'\n')
        self.assertEqual(self.helper('push',ok=False).returncode,3); self.assertFalse(self.checklog.exists())

    def test_current_main_skips_rebase_and_preserves_staged_and_unstaged_work(self):
        self.own_change()
        self.write('note.txt','foreign staged note\n'); self.git(self.work,'add','note.txt')
        self.write('profile.txt','foreign unstaged profile\n')
        self.env['LAND_PRESERVE_WORKTREE']='1'
        before=self.git(self.work,'diff','--cached').stdout
        r=self.helper('push')
        self.assertIn('no rebase or autostash needed',r.stdout)
        self.assertEqual(self.git(self.work,'diff','--cached').stdout,before)
        self.assertEqual((self.work/'profile.txt').read_text(),'foreign unstaged profile\n')
        self.assertEqual(self.git(self.remote,'show','main:note.txt').stdout,'original\n')
        self.assertEqual(self.git(self.remote,'show','main:profile.txt').stdout,'base\n')
        self.assertEqual(self.git(self.work,'stash','list').stdout,'')
        self.assertIn(self.remote_tip(),self.checklog.read_text().splitlines())
        self.assertIn(self.remote_tip(),self.fencelog.read_text().splitlines())

    def test_preserved_dirty_tree_refuses_needed_rebase_before_gates(self):
        self.own_change(); self.advance('new main\n'); before=self.remote_tip()
        self.write('note.txt','foreign note\n'); self.env['LAND_PRESERVE_WORKTREE']='1'
        r=self.helper('push',ok=False)
        self.assertEqual(r.returncode,3); self.assertIn('without autostash',r.stderr)
        self.assertEqual(self.remote_tip(),before)
        self.assertEqual((self.work/'note.txt').read_text(),'foreign note\n')
        self.assertEqual(self.git(self.work,'stash','list').stdout,'')
        self.assertFalse(self.checklog.exists()); self.assertFalse(self.fencelog.exists())

    def test_preservation_mode_rebases_clean_tree_with_autostash_disabled(self):
        self.own_change(); self.advance('new main\n')
        trace=self.root/'git-trace'; self.env.update(LAND_PRESERVE_WORKTREE='1',GIT_TRACE2_EVENT=str(trace))
        self.helper('push')
        events=[json.loads(line) for line in trace.read_text().splitlines()]
        self.assertTrue(any(e.get('event')=='start' and 'rebase.autoStash=false' in e.get('argv',[])
                            and 'rebase' in e.get('argv',[]) for e in events))
        self.assertEqual(self.git(self.remote,'show','main:run.txt').stdout,'exact reviewed candidate\n')
        self.assertEqual(self.git(self.work,'stash','list').stdout,'')

    def test_current_main_cannot_skip_an_unfinished_git_operation(self):
        self.own_change(); before=self.remote_tip()
        stopped=self.git(self.work,'rebase','--exec','false','HEAD~1',ok=False)
        self.assertNotEqual(stopped.returncode,0)
        self.assertTrue((self.work/'.git/rebase-merge').exists())
        r=self.helper('push',ok=False)
        self.assertEqual(r.returncode,3); self.assertIn('unfinished Git operation',r.stderr)
        self.assertEqual(self.remote_tip(),before)
        self.assertFalse(self.checklog.exists()); self.assertFalse(self.fencelog.exists())
        self.assertTrue((self.work/'.git/rebase-merge').exists())

    def test_preserved_dirty_tree_refuses_rebase_if_main_moves_during_precheck(self):
        self.own_change(); self.write('note.txt','foreign note\n')
        self.env.update(MOVE_MAIN_ONCE=str(self.other),LAND_PRESERVE_WORKTREE='1')
        r=self.helper('push',ok=False)
        self.assertEqual(r.returncode,3); self.assertIn('without autostash',r.stderr)
        self.assertNotEqual(self.git(self.work,'rev-parse','HEAD').stdout.strip(),self.remote_tip())
        self.assertNotEqual(self.git(self.remote,'cat-file','-e','main:run.txt',ok=False).returncode,0)
        self.assertEqual((self.work/'note.txt').read_text(),'foreign note\n')
        self.assertEqual(self.git(self.work,'stash','list').stdout,'')
        self.assertEqual(len(self.checklog.read_text().splitlines()),1)
        self.assertEqual(len(self.fencelog.read_text().splitlines()),1)

    def test_land_pushes_directly_to_main_when_permitted_and_mirrors_claude_branch(self):
        land_path = Path(__file__).resolve().with_name('land-run.sh')
        if not land_path.is_file():
            self.skipTest('land-run.sh not installed in this repository')
        land_sh = land_path.read_text()
        self.write('.claude/scripts/land-run.sh', land_sh)
        self.git(self.work,'checkout','-qb','claude/test-direct-land')
        self.cmd(['bash','.claude/scripts/land-run.sh','mark'], self.work)
        self.own_change()
        r=self.cmd(['bash','.claude/scripts/land-run.sh','land'], self.work)
        self.assertIn('directly to main',r.stdout)
        self.assertEqual(self.git(self.remote,'show','main:run.txt').stdout,'exact reviewed candidate\n')
        self.assertEqual(
            self.git(self.remote,'rev-parse','refs/heads/claude/test-direct-land').stdout.strip(),
            self.remote_tip(),
        )
        self.assertIn(self.remote_tip(),self.checklog.read_text().splitlines())
        self.assertIn(self.remote_tip(),self.fencelog.read_text().splitlines())

    def test_land_falls_back_to_claude_land_branch_when_direct_main_push_refused(self):
        land_path = Path(__file__).resolve().with_name('land-run.sh')
        if not land_path.is_file():
            self.skipTest('land-run.sh not installed in this repository')
        land_sh = land_path.read_text()
        self.write('.claude/scripts/land-run.sh', land_sh)
        hook=self.remote/'hooks/pre-receive'
        hook.write_text('''#!/usr/bin/env bash
while read old new ref; do
  if [ "$ref" = "refs/heads/main" ] && [ "${ALLOW_MAIN_MERGE:-0}" != "1" ]; then
    echo "restricted branch push: main not permitted" >&2
    exit 1
  fi
  if git cat-file -e "$new:run.txt" 2>/dev/null; then
    grep -qx "$new" "$CHECK_LOG" || exit 1
    grep -qx "$new" "$FENCE_LOG" || exit 1
  fi
done
'''); hook.chmod(0o755)
        self.git(self.work,'checkout','-qb','claude/test-restricted-land')
        self.cmd(['bash','.claude/scripts/land-run.sh','mark'], self.work)
        self.own_change()
        self.env['LAND_DEADLINE']='1'
        self.env['LAND_POLL_SECONDS']='1'
        r=self.cmd(['bash','.claude/scripts/land-run.sh','land'], self.work, ok=False)
        self.assertEqual(r.returncode,5)
        self.assertIn('falling back to claude/land/* workflow',r.stderr)
        refs=self.git(self.remote,'for-each-ref','--format=%(refname)','refs/heads/claude/land/').stdout.splitlines()
        self.assertEqual(len(refs),1)

    def test_rebased_claude_branch_updates_existing_remote_claude_ref_without_failing(self):
        self.git(self.work,'checkout','-qb','claude/test-rebased-mirror')
        self.helper('mark')
        # Simulate an earlier receipt push to origin/claude/test-rebased-mirror before origin/main advanced
        self.write('reports/checkpoint.json','{}\n')
        self.commit(self.work,'checkpoint')
        self.git(self.work,'push','-q','origin','HEAD:refs/heads/claude/test-rebased-mirror')
        self.own_change()
        self.advance('concurrent-main\n')
        r=self.helper('push')
        self.assertEqual(r.returncode,0)
        self.assertEqual(
            self.git(self.remote,'rev-parse','refs/heads/claude/test-rebased-mirror').stdout.strip(),
            self.remote_tip(),
        )

    def test_identical_untracked_review_evidence_collision_is_cleaned_before_rebase(self):
        ev_rel = 'reports/content-review-evidence/fac7853e213bd811023de5e809d1b55d4308c009789f7b718d4ff34b23514f0a.json'
        ev_body = '{"policy":"shared-frozen-evidence"}\n'
        # Concurrent routine commits and pushes the identical content-addressed evidence file to main
        self.write(ev_rel, ev_body, self.other)
        self.commit(self.other, 'concurrent evidence freeze')
        self.git(self.other, 'push', '-q', 'origin', 'main')

        # Our run has its own commit AND an untracked byte-identical copy of that evidence file
        self.own_change()
        self.write(ev_rel, ev_body, self.work)
        r = self.helper('push')
        self.assertEqual(r.returncode, 0, msg=r.stdout + r.stderr)
        self.assertEqual(self.git(self.remote, 'show', 'main:' + ev_rel).stdout, ev_body)
        self.assertEqual((self.work / ev_rel).read_text(), ev_body)

    def test_differing_untracked_review_evidence_collision_still_aborts_safely(self):
        ev_rel = 'reports/content-review-evidence/deadbeef.json'
        self.write(ev_rel, '{"main":1}\n', self.other)
        self.commit(self.other, 'main evidence')
        self.git(self.other, 'push', '-q', 'origin', 'main')
        before = self.remote_tip()

        self.own_change()
        self.write(ev_rel, '{"local_different":2}\n', self.work)
        r = self.helper('push', ok=False)
        self.assertEqual(r.returncode, 3)
        self.assertEqual(self.remote_tip(), before)
        self.assertEqual((self.work / ev_rel).read_text(), '{"local_different":2}\n')

    def test_append_only_reports_jsonl_conflict_auto_merges_without_generated_conf(self):
        ledger_rel = 'reports/standards-ledger.jsonl'
        self.write(ledger_rel, '{"id":"base"}\n', self.other)
        self.commit(self.other, 'seed standards ledger')
        self.git(self.other, 'push', '-q', 'origin', 'main')
        self.git(self.work, 'pull', '-q', 'origin', 'main')
        self.helper('mark')

        # Concurrent run appends one entry to main
        self.write(ledger_rel, '{"id":"base"}\n{"id":"comparison-run"}\n', self.other)
        self.commit(self.other, 'comparison ledger entry')
        self.git(self.other, 'push', '-q', 'origin', 'main')

        # Current run appends its own entry + content file
        self.write(ledger_rel, '{"id":"base"}\n{"id":"ga4-run"}\n', self.work)
        self.write('run.txt', 'exact reviewed candidate\n', self.work)
        self.commit(self.work, 'ga4 run + ledger')

        r = self.helper('push')
        self.assertEqual(r.returncode, 0, msg=r.stdout + r.stderr)
        merged = self.git(self.remote, 'show', 'main:' + ledger_rel).stdout.splitlines()
        self.assertEqual(merged, ['{"id":"base"}', '{"id":"comparison-run"}', '{"id":"ga4-run"}'])

    def test_reviewer_notes_ts_from_empty_base_auto_merges(self):
        rn_rel = 'src/data/reviewer-notes.ts'
        base_ts = 'export interface ReviewerNoteEntry { note: string; reviewedDate?: string; }\nexport const REVIEWER_NOTES: Record<string, ReviewerNoteEntry> = {};\n'
        self.write(rn_rel, base_ts, self.other)
        self.commit(self.other, 'seed empty reviewer notes')
        self.git(self.other, 'push', '-q', 'origin', 'main')
        self.git(self.work, 'pull', '-q', 'origin', 'main')
        self.helper('mark')

        ours_ts = (
            'export interface ReviewerNoteEntry { note: string; reviewedDate?: string; }\n'
            'export const REVIEWER_NOTES: Record<string, ReviewerNoteEntry> = {\n'
            '  "/guides/alpha": {\n    note: "Alpha note",\n  },\n};\n'
        )
        self.write(rn_rel, ours_ts, self.other)
        self.commit(self.other, 'main alpha note')
        self.git(self.other, 'push', '-q', 'origin', 'main')

        theirs_ts = (
            'export interface ReviewerNoteEntry { note: string; reviewedDate?: string; }\n'
            'export const REVIEWER_NOTES: Record<string, ReviewerNoteEntry> = {\n'
            '  "/guides/beta": {\n    note: "Beta note",\n  },\n};\n'
        )
        self.write(rn_rel, theirs_ts, self.work)
        self.write('run.txt', 'exact reviewed candidate\n', self.work)
        self.commit(self.work, 'run beta note')

        r = self.helper('push')
        self.assertEqual(r.returncode, 0, msg=r.stdout + r.stderr)
        merged = self.git(self.remote, 'show', 'main:' + rn_rel).stdout
        self.assertIn('"/guides/alpha"', merged)
        self.assertIn('"/guides/beta"', merged)
        self.assertTrue(merged.rstrip().endswith('};'))

    def test_page12_ledger_revert_plus_concurrent_append_auto_merges(self):
        ledger_rel = 'reports/page-1-2-no-clicks/ledger.jsonl'
        row1_pub = '{"page":"/guides/old","treated":"2026-10-20","status":"published"}'
        row1_rev = '{"page":"/guides/old","treated":"2026-10-20","status":"reverted"}'
        row2 = '{"page":"/guides/new-main","treated":"2026-11-27","status":"published"}'
        self.write(ledger_rel, row1_pub + '\n', self.other)
        self.commit(self.other, 'seed page12 ledger')
        self.git(self.other, 'push', '-q', 'origin', 'main')
        self.git(self.work, 'pull', '-q', 'origin', 'main')
        self.helper('mark')

        self.write(ledger_rel, row1_pub + '\n' + row2 + '\n', self.other)
        self.commit(self.other, 'concurrent append')
        self.git(self.other, 'push', '-q', 'origin', 'main')

        self.write(ledger_rel, row1_rev + '\n', self.work)
        self.write('run.txt', 'exact reviewed candidate\n', self.work)
        self.commit(self.work, '28d worse revert')

        r = self.helper('push')
        self.assertEqual(r.returncode, 0, msg=r.stdout + r.stderr)
        merged = self.git(self.remote, 'show', 'main:' + ledger_rel).stdout.splitlines()
        self.assertEqual(merged, [row1_rev, row2])

    def test_alternatives_pages_json_disjoint_merge_and_same_route_conflict(self):
        alt_rel = 'data/alternatives-pages.json'
        base_doc = {'_comment': 'test', 'pages': [{'route': '/guides/a-alt/', 'vendorHost': 'a.com'}]}
        self.write(alt_rel, json.dumps(base_doc, indent=2) + '\n', self.other)
        self.commit(self.other, 'seed alt pages')
        self.git(self.other, 'push', '-q', 'origin', 'main')
        self.git(self.work, 'pull', '-q', 'origin', 'main')
        self.helper('mark')

        main_doc = {'_comment': 'test', 'pages': base_doc['pages'] + [{'route': '/guides/b-alt/', 'vendorHost': 'b.com'}]}
        self.write(alt_rel, json.dumps(main_doc, indent=2) + '\n', self.other)
        self.commit(self.other, 'main b-alt')
        self.git(self.other, 'push', '-q', 'origin', 'main')

        run_doc = {'_comment': 'test', 'pages': base_doc['pages'] + [{'route': '/guides/c-alt/', 'vendorHost': 'c.com'}]}
        self.write(alt_rel, json.dumps(run_doc, indent=2) + '\n', self.work)
        self.write('run.txt', 'exact reviewed candidate\n', self.work)
        self.commit(self.work, 'run c-alt')

        r = self.helper('push')
        self.assertEqual(r.returncode, 0, msg=r.stdout + r.stderr)
        merged = json.loads(self.git(self.remote, 'show', 'main:' + alt_rel).stdout)
        self.assertEqual([p['route'] for p in merged['pages']], ['/guides/a-alt/', '/guides/b-alt/', '/guides/c-alt/'])


if __name__=='__main__': unittest.main()
