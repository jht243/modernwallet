"""Keep page source bound to the final review as the normal deployment branch is prepared."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys


def git(root, *args):
    return subprocess.check_output(['git', *args], cwd=root, stderr=subprocess.PIPE)


def exact_file(root, ref):
    path = (root/ref['path']).resolve()
    if not path.is_relative_to(root/'reports'):
        raise ValueError('Release evidence must be an internal report')
    if path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == ref['sha256']:
        return path
    cached = root/'reports/content-review-evidence'/(ref['sha256']+path.suffix)
    if not cached.is_file() or hashlib.sha256(cached.read_bytes()).hexdigest() != ref['sha256']:
        for archive_ref in (
            'refs/heads/automation/content-review-journals',
            'refs/remotes/origin/automation/content-review-journals',
        ):
            blob = _git_blob_or_none(root, archive_ref + ':artifacts/' + str(ref.get('sha256', '')))
            if blob is not None and hashlib.sha256(blob).hexdigest() == ref.get('sha256'):
                cached.parent.mkdir(parents=True, exist_ok=True)
                cached.write_bytes(blob)
                return cached
        raise ValueError('Restore the signed review evidence '+ref['path']+' before publishing')
    return cached


def snapshot_preserves_all(snapshot, boundary, path, reqs):
    ref = boundary.get(path, {}).get('artifact')
    if not ref:
        return None
    canon = snapshot.get('manifest', {}).get('canonicalBase', '').rstrip('/')
    if not reqs or canon != reqs[0]['canonicalBase']:
        return None
    by_route = {r['path'].rstrip('/'): r for r in snapshot.get('routes', [])}
    for req in reqs:
        if req['canonicalBase'] != canon:
            return None
        row = by_route.get(req['route'])
        if (row is None
            or row.get('fingerprint') != req['fingerprint']
            or row.get('textSha256') != req['textSha256']
            or row.get('semantic') != req['semantic']):
            return None
    return ref


def _git_blob_or_none(root, spec):
    kind = subprocess.run(['git', 'cat-file', '-t', spec], cwd=root, capture_output=True, text=True)
    if kind.returncode != 0 or kind.stdout.strip() != 'blob':
        return None
    return git(root, 'show', spec)


def _durable_journal_bytes(root, rel_journal_path):
    """Return bytes of rel_journal_path stored on automation/content-review-journals, if any."""
    journal_key = Path(rel_journal_path).stem
    for ref in (
        'refs/heads/automation/content-review-journals',
        'refs/remotes/origin/automation/content-review-journals',
    ):
        state_raw = _git_blob_or_none(root, ref + ':state.json')
        if not state_raw:
            continue
        try:
            state = json.loads(state_raw)
            rj = (state.get('reviewJournals') or {}).get(journal_key) or {}
            blob_sha = rj.get('head') or (rj.get('artifacts') or {}).get(rel_journal_path)
            if not blob_sha:
                for entry in (state.get('reviewJournals') or {}).values():
                    if isinstance(entry, dict) and rel_journal_path in (entry.get('artifacts') or {}):
                        blob_sha = entry['artifacts'][rel_journal_path]
                        break
            if blob_sha:
                art = _git_blob_or_none(root, ref + ':artifacts/' + blob_sha)
                if art is not None:
                    return art
        except Exception:
            pass
    return None


def _event_job_id(events):
    for ev in reversed(events):
        jid = (ev.get('data') or {}).get('jobId') or ev.get('jobId')
        if isinstance(jid, str) and jid:
            return jid
    return None


def _resolve_merge_base(root, recorded_base, fallback_base):
    for cand in (recorded_base, fallback_base):
        if not cand:
            continue
        res = subprocess.run(['git', 'merge-base', cand, 'origin/main'], cwd=root, capture_output=True, text=True)
        if res.returncode == 0 and res.stdout.strip():
            return res.stdout.strip()
    return fallback_base


def _three_way_integrate_reviewed(root, name, expected, merge_base):
    origin_bytes = _git_blob_or_none(root, 'origin/main:' + name)
    if origin_bytes is None:
        return None
    base_bytes = _git_blob_or_none(root, merge_base + ':' + name) if merge_base else None
    if base_bytes is None:
        return expected if origin_bytes == expected else None
    if b'\0' in expected or b'\0' in base_bytes or b'\0' in origin_bytes:
        return None
    import tempfile
    with tempfile.TemporaryDirectory(prefix='final-reviewed-merge-') as td:
        td_path = Path(td)
        exp_p, base_p, orig_p = td_path / 'expected', td_path / 'base', td_path / 'origin'
        exp_p.write_bytes(expected)
        base_p.write_bytes(base_bytes)
        orig_p.write_bytes(origin_bytes)
        merged = subprocess.run(
            ['git', 'merge-file', '-p', str(exp_p), str(base_p), str(orig_p)],
            capture_output=True,
            timeout=60,
        )
        if merged.returncode == 0:
            return merged.stdout
        if name == 'data/pages.generated.ts':
            for mp in (
                root / '.claude/scripts/merge-pages-generated.py',
                Path(__file__).resolve().parents[1] / 'scripts/merge-pages-generated.py',
            ):
                if mp.is_file():
                    out_p = td_path / 'out.ts'
                    mp_res = subprocess.run(
                        [sys.executable, str(mp), '--base', str(base_p), '--ours', str(orig_p), '--theirs', str(exp_p), '--output', str(out_p)],
                        capture_output=True,
                        timeout=60,
                    )
                    if mp_res.returncode == 0 and out_p.is_file():
                        return out_p.read_bytes()
        return None


def prepare(root, base, dry_run=False):
    changed = set(git(root,'diff','--name-only','-z','--diff-filter=ACMR','origin/main','HEAD').decode().split('\0'))
    config = json.loads((root/'.claude/content-review-policy.json').read_bytes())
    files = {}
    recovery_bases = {}
    requirements = {}
    recorded_events = []
    policy = None
    journal_names = [
        n for n in sorted(changed)
        if Path(n).parent == Path('reports/content-review-journals') and Path(n).suffix == '.jsonl'
    ]
    journal_rows = []
    fresh_job_ids = set()
    has_fresh_journal = False
    for name in journal_names:
        head_raw = git(root, 'show', 'HEAD:' + name)
        events = [json.loads(line) for line in head_raw.splitlines() if line]
        if not events:
            continue
        durable_raw = _durable_journal_bytes(root, name)
        is_restored_unchanged = durable_raw is not None and head_raw == durable_raw
        jid = _event_job_id(events)
        if not is_restored_unchanged:
            has_fresh_journal = True
            if jid:
                fresh_job_ids.add(jid)
        journal_rows.append((name, events, is_restored_unchanged, jid))
    for name, events, is_restored_unchanged, jid in journal_rows:
        if is_restored_unchanged and has_fresh_journal and (not jid or jid not in fresh_job_ids):
            continue
        last_event = events[-1]
        pending = last_event['kind'] in ('reserve', 'repair-pending')
        if pending:
            if 'thirdReviewClaimCategories' not in config or last_event['data']['number'] < 3:
                continue
            # Only the preceding reviewed round of this cycle can be eligible.
            prior = next((event for event in reversed(events[:-1]) if event['kind'] in ('record', 'begin', 'published')), None)
            if not prior or prior['kind'] != 'record' or prior['data']['number'] + 1 != last_event['data']['number']:
                continue
            last_event = prior
        if last_event['kind'] != 'record':
            continue
        last = last_event['data']
        if last.get('legacyImport'):
            continue
        recorded_events.append(last_event)
        if last['verdict']!='FAIL':
            continue
        maximum = last.get('maximumRounds',config['roundLimits'][last['profile']])
        if 'thirdReviewClaimCategories' in config and last['profile'] == 'high':
            if policy is None:
                import importlib.util
                spec = importlib.util.spec_from_file_location('release_review_budget', Path(__file__).with_name('content-review-policy.py'))
                policy = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(policy)
            report = json.loads(exact_file(root, last['report']).read_bytes())
            maximum = policy.recorded_limit(config, last['profile'], last_event['identity']['route'], report)
        if last['number'] < maximum:continue
        admit=json.loads(exact_file(root,last['admission']).read_bytes())
        snapshot=json.loads(exact_file(root,admit['snapshot']).read_bytes())
        if snapshot['manifest'].get('workflowKind')!='mindmap-pass' or not snapshot.get('correctionBoundary'):
            continue
        boundary_doc=json.loads(exact_file(root,snapshot['correctionBoundary']).read_bytes())
        boundary=boundary_doc['files']
        rec_base=boundary_doc.get('recoveryBaseCommit')
        route=admit['identity']['route'].rstrip('/')
        row=next(v for v in snapshot['manifest']['routes'] if v['path'].rstrip('/')==route)
        rendered_row=next(v for v in snapshot['routes'] if v['path'].rstrip('/')==route)
        canon=snapshot['manifest']['canonicalBase'].rstrip('/')
        for path in set(row.get('correctionContentFiles',[])) & changed:
            ref=boundary[path].get('artifact')
            if not ref:continue
            requirements.setdefault(path,[]).append({
                'canonicalBase': canon,
                'route': route,
                'fingerprint': rendered_row['fingerprint'],
                'textSha256': rendered_row.get('textSha256'),
                'semantic': rendered_row['semantic'],
                'ref': ref,
                'recoveryBaseCommit': rec_base,
            })
    if requirements:
        recorded_snapshots = []
        seen_snapshots = set()
        for event in recorded_events:
            admit_ref = event['data'].get('admission')
            if not admit_ref:
                continue
            try:
                admit = json.loads(exact_file(root, admit_ref).read_bytes())
                snap_ref = admit['snapshot']
                if snap_ref['sha256'] in seen_snapshots:
                    continue
                snapshot = json.loads(exact_file(root, snap_ref).read_bytes())
                if snapshot['manifest'].get('workflowKind') != 'mindmap-pass' or not snapshot.get('correctionBoundary'):
                    continue
                boundary_doc = json.loads(exact_file(root, snapshot['correctionBoundary']).read_bytes())
                boundary = boundary_doc['files']
                rec_base = boundary_doc.get('recoveryBaseCommit')
            except (ValueError, KeyError):
                continue
            seen_snapshots.add(snap_ref['sha256'])
            recorded_snapshots.append((snapshot, boundary, rec_base))
        for path, reqs in requirements.items():
            head_sha = hashlib.sha256(git(root, 'show', 'HEAD:' + path)).hexdigest()
            compatible = []
            for snap, bnd, rbase in recorded_snapshots:
                cand_ref = snapshot_preserves_all(snap, bnd, path, reqs)
                if cand_ref:
                    compatible.append((snap.get('capturedAt', ''), cand_ref, rbase))
            head_match = next(((ref, rbase) for _, ref, rbase in compatible if ref.get('sha256') == head_sha), None)
            if head_match is not None:
                files[path], recovery_bases[path] = head_match
            elif compatible:
                compatible.sort(key=lambda item: item[0])
                files[path], recovery_bases[path] = compatible[-1][1], compatible[-1][2]
            elif len({r['ref']['sha256'] for r in reqs}) == 1:
                files[path] = reqs[0]['ref']
                recovery_bases[path] = reqs[0].get('recoveryBaseCommit')
            else:
                raise ValueError('Two final reviews refer to conflicting candidate versions: ' + path)
    changes=[]
    for name, ref in files.items():
        expected=exact_file(root,ref).read_bytes()
        head_bytes=git(root,'show','HEAD:'+name)
        if head_bytes==expected:continue
        # Work only on this branch's own committed page source. Never replace
        # unstaged edits or unrelated files; integrate concurrent default-branch
        # changes only when a clean 3-way merge proves zero overlap on reviewed hunks.
        path=(root/name).resolve()
        if (not path.is_relative_to(root) or path.is_symlink() or not path.is_file()
            or path.read_bytes()!=head_bytes
            or git(root,'diff','--cached','--name-only','--',name).strip()):
            raise ValueError('Reconcile concurrent edits to '+name+' against the retained reviewed version')
        merge_base=_resolve_merge_base(root, recovery_bases.get(name), base)
        if not git(root,'diff','--name-only',merge_base,'origin/main','--',name).strip():
            changes.append((name,path,expected))
            continue
        integrated=_three_way_integrate_reviewed(root, name, expected, merge_base)
        if integrated is None:
            raise ValueError('Reconcile concurrent edits to '+name+' against the retained reviewed version')
        if head_bytes==integrated:
            continue
        changes.append((name,path,integrated))
    if changes and not dry_run:
        for _,path,raw in changes:path.write_bytes(raw)
        names=[entry[0] for entry in changes]
        git(root,'add','--',*names)
        git(root,'commit','--only','-qm','Restore exact page sources from the final independent review','--',*names)
    if not dry_run:
        import importlib.util
        archive_path=Path(__file__).with_name('review-archive.py')
        if archive_path.is_file() and (root/'.claude/tools/content-review-durable.py').is_file():
            spec=importlib.util.spec_from_file_location('prepush_review_archive',archive_path);archive=importlib.util.module_from_spec(spec);spec.loader.exec_module(archive)
            delta=git(root,'diff','--no-renames','--name-only','-z','origin/main','HEAD').decode().split('\0')
            archive.confirm_changed_journals(root,delta)
            if archive.search_job(root):archive.require_search_archive(root,delta)
            big_ts=[d for d in delta if d.startswith('reports/content-review-evidence/') and d.endswith('.ts') and (root/d).is_file() and (root/d).stat().st_size>2_000_000]
            if big_ts:
                git(root,'rm','-f','-q','--',*big_ts)
                git(root,'commit','--only','-qm','Omit archived >2MB .ts source blobs from main (retained on automation/content-review-journals)','--',*big_ts)
    return [entry[0] for entry in changes]


if __name__=='__main__':
    root=Path(subprocess.check_output(['git','rev-parse','--show-toplevel'],text=True).strip()).resolve()
    result=prepare(root,sys.argv[1],dry_run='--dry-run' in sys.argv[2:])
    if result:print('Final reviewed sources:',', '.join(result))
