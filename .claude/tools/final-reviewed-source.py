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


def prepare(root, base, dry_run=False):
    changed = set(git(root,'diff','--name-only','-z','--diff-filter=ACMR','origin/main','HEAD').decode().split('\0'))
    config = json.loads((root/'.claude/content-review-policy.json').read_bytes())
    files = {}
    requirements = {}
    recorded_events = []
    policy = None
    for name in sorted(changed):
        log = Path(name)
        if log.parent != Path('reports/content-review-journals') or log.suffix != '.jsonl':
            continue
        events = [json.loads(line) for line in git(root,'show','HEAD:'+name).splitlines() if line]
        if not events:
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
        boundary=json.loads(exact_file(root,snapshot['correctionBoundary']).read_bytes())['files']
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
                boundary = json.loads(exact_file(root, snapshot['correctionBoundary']).read_bytes())['files']
            except (ValueError, KeyError):
                continue
            seen_snapshots.add(snap_ref['sha256'])
            recorded_snapshots.append((snapshot, boundary))
        for path, reqs in requirements.items():
            head_sha = hashlib.sha256(git(root, 'show', 'HEAD:' + path)).hexdigest()
            compatible = []
            for snap, bnd in recorded_snapshots:
                cand_ref = snapshot_preserves_all(snap, bnd, path, reqs)
                if cand_ref:
                    compatible.append((snap.get('capturedAt', ''), cand_ref))
            head_match = next((ref for _, ref in compatible if ref.get('sha256') == head_sha), None)
            if head_match is not None:
                files[path] = head_match
            elif compatible:
                compatible.sort(key=lambda item: item[0])
                files[path] = compatible[-1][1]
            elif len({r['ref']['sha256'] for r in reqs}) == 1:
                files[path] = reqs[0]['ref']
            else:
                raise ValueError('Two final reviews refer to conflicting candidate versions: ' + path)
    changes=[]
    for name, ref in files.items():
        expected=exact_file(root,ref).read_bytes()
        if git(root,'show','HEAD:'+name)==expected:continue
        # Work only on this branch's own committed page source. Never replace
        # unstaged edits, concurrent default-branch changes or unrelated files.
        path=(root/name).resolve()
        if (not path.is_relative_to(root) or path.is_symlink() or not path.is_file()
            or path.read_bytes()!=git(root,'show','HEAD:'+name)
            or git(root,'diff','--cached','--name-only','--',name).strip()
            or git(root,'diff','--name-only',base,'origin/main','--',name).strip()):
            raise ValueError('Reconcile concurrent edits to '+name+' against the retained reviewed version')
        changes.append((name,path,expected))
    if changes and not dry_run:
        for _,path,raw in changes:path.write_bytes(raw)
        names=[entry[0] for entry in changes]
        git(root,'add','--',*names)
        git(root,'commit','--only','-qm','Restore exact page sources from the final independent review','--',*names)
    if not dry_run:
        import importlib.util
        archive_path=Path(__file__).with_name('review-archive.py')
        if archive_path.is_file():
            spec=importlib.util.spec_from_file_location('prepush_review_archive',archive_path);archive=importlib.util.module_from_spec(spec);spec.loader.exec_module(archive)
            delta=git(root,'diff','--no-renames','--name-only','-z','origin/main','HEAD').decode().split('\0')
            archive.confirm_changed_journals(root,delta)
            if archive.search_job(root):archive.require_search_archive(root,delta)
    return [entry[0] for entry in changes]


if __name__=='__main__':
    root=Path(subprocess.check_output(['git','rev-parse','--show-toplevel'],text=True).strip()).resolve()
    result=prepare(root,sys.argv[1],dry_run='--dry-run' in sys.argv[2:])
    if result:print('Final reviewed sources:',', '.join(result))
