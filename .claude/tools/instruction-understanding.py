#!/usr/bin/env python3
"""Reference genuine unchanged explanations; require a real current-context confirmation.

The compatibility view preserves original explanations with explicit provenance.
It is not a new explanation, comprehension proof, audit verdict or permission.
"""
import argparse
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

VERSION='retained-understanding-2026-11-08.1'
IDENTITY=['bundleId','actor','runId','contextId','contextEpoch']


def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def local(root):
    if not (root/'.claude/workflow-policy.local.json').is_file():return None
    return load('understanding_local',root/'.claude/tools/workflow-local.py')
def require(ok,message):
    if not ok:raise ValueError(message)
def read(path):return json.loads(Path(path).read_text())
def sha(raw):return hashlib.sha256(raw).hexdigest()
def ref(root,path):return {'path':str(path.resolve().relative_to(root.resolve())),'sha256':sha(path.read_bytes())}
def artifact(root,value):
    require(isinstance(value,dict) and isinstance(value.get('path'),str),'Missing understanding evidence reference')
    path=(root/value['path']).resolve()
    require(root.resolve() in path.parents and 'public' not in path.relative_to(root.resolve()).parts,'Keep understanding evidence internal and inside this repository')
    require(path.is_file() and sha(path.read_bytes())==value.get('sha256'),'Understanding evidence missing or changed: '+value['path'])
    return path
def save_exact(path,value):
    raw=(json.dumps(value,sort_keys=True,indent=2)+'\n').encode();path.parent.mkdir(parents=True,exist_ok=True)
    if path.exists():require(path.read_bytes()==raw,'Keep immutable explanation/confirmation evidence; choose a new filename')
    else:
        with path.open('xb') as stream:stream.write(raw)


def job(m,texts,root):
    name=m.get('contextPacket') or m.get('handoff')
    if not name:return None
    value=json.loads(texts[name]) if name in texts else read(root/name)
    return {'jobId':value['jobId'],'canonicalBase':value['canonicalBase'],'routes':value['routes']}


def previous(root,m,l,current_texts=None):
    reuse=m.get('reuse');require(reuse,'No prior retained reading: complete the normal first full application')
    path=artifact(root,{'path':reuse['directory']+'/manifest.json','sha256':reuse['sha256']})
    old,texts=l.historical_delivery(root,path.parent,application_override=reuse.get('application'))
    retained=getattr(l,'retained_context_check',None)
    if retained:retained(old,m)
    else:
        # Older site adapters permit retention only inside the same invocation.
        # Preserve that stricter native rule rather than importing Layer3's
        # later cross-run capability or changing its policy fingerprint.
        require(all(old.get(key)==m.get(key) for key in ['actor','runId','contextId','contextEpoch']),
                'Cannot reuse another actor/run/context under this site protocol')
    require(old['phase']==m['phase'] and old['role']==m['role'],'A new phase/role needs its normal first full explanation')
    prior_ref=old.get('application') or reuse.get('application');old_application=read(artifact(root,prior_ref))
    before=job(old,texts,root);after=job(m,current_texts or {},root)
    if before or after:
        require(before and after and before['jobId']==after['jobId'] and before['canonicalBase']==after['canonicalBase'] and
                set(after['routes'])<=set(before['routes']),'Different job or expanded scope: write the fresh application instead')
    else:require(old['runId']==m['runId'],'A different unscoped invocation needs its normal full application')
    task_sources={x for x in [m.get('handoff'),m.get('contextPacket')] if x}
    eligible={name for name in m.get('reused',[]) if old['files'].get(name)==m['files'].get(name) and name not in task_sources and not name.startswith('reports/')}
    return old,old_application,texts,ref(root,path),prior_ref,eligible


def challenge(root,directory):
    l=local(root)
    if l is None:return {'mode':'existing-protocol','instruction':'Keep this site\'s normal complete reading and independent application checks. No per-document explanation gate is added.'}
    m=l.validate(root,directory,False);old,a,texts,manifest_ref,application_ref,eligible=previous(root,m,l)
    require(m['delivered']==list(range(1,len(m['parts'])+1)),'Read every newly delivered instruction chunk first')
    return {'version':VERSION,'identity':{key:m[key] for key in IDENTITY},'previousBundleId':old['bundleId'],
            'eligibleUnchangedSources':len(eligible),'freshExplanationSources':sorted(set(m['files'])-eligible),
            'requiredCurrentStatements':['currentContextAvailable','rulesUnderstood','contextRetained','unchangedApplicationsStillApply','recallStillUnderstood','reuseEligibleSources'],
            'requiredCurrentExplanations':['task','accessEvidence','currentApplication'],
            'instruction':'Write your genuine CURRENT confirmation, concrete task and changed-focus/application explanation. Set the statements only if true. Supply freshUnderstanding entries for changed/new/task sources and any unchanged rule whose application no longer fits. Do not rewrite eligible unchanged explanations. Lost/unclear context requires the normal full reread/application. This command does not provide answers or a PASS.'}


def expand(root,m,c,l,seen=None,current_texts=None):
    require(c.get('version')==VERSION,'Unknown retained-understanding confirmation')
    for key in IDENTITY:require(c.get(key)==m.get(key),'Confirmation belongs to another current '+key)
    for key in ['currentContextAvailable','rulesUnderstood','contextRetained','unchangedApplicationsStillApply','recallStillUnderstood','reuseEligibleSources']:
        require(c.get(key) is True,'Current access/understanding unavailable or unclear: reread and explain normally ('+key+')')
    for key in ['task','accessEvidence','currentApplication']:
        require(isinstance(c.get(key),str) and len(c[key].strip())>=60,'Write the actual current '+key+'; no automatic/generic affirmation')
    old,a,texts,manifest_ref,application_ref,eligible=previous(root,m,l,current_texts)
    require(c.get('previousBundleId')==old['bundleId'],'Wrong retained instruction bundle')
    if a.get('understandingReuse'):verify_view(root,artifact(root,manifest_ref).parent,artifact(root,application_ref),historical=True,seen=seen)
    fresh=c.get('freshUnderstanding',[]);require(isinstance(fresh,list),'Fresh source explanations must be a list')
    mapping={x.get('source'):x for x in fresh if isinstance(x,dict)}
    require(len(mapping)==len(fresh) and set(mapping)<=set(m['files']),'Unknown or repeated fresh source explanation')
    retained=eligible-set(mapping);required=set(m['files'])-retained
    require(set(mapping)==required,'Explain every changed/new/task source; unchanged source references never cover new rules')
    old_entries={entry['source']:entry for entry in a['understanding']}
    entries=[]
    for source in m['files']:
        if source in retained:
            entry=copy.deepcopy(old_entries[source]);entry['explanationOrigin']={'application':application_ref,'sourceSha256':m['files'][source]}
        else:
            entry=copy.deepcopy(mapping[source]);require(not entry.get('explanationOrigin'),'Fresh explanations cannot pretend to be retained')
            if source in old_entries:
                require(any(entry.get(key)!=old_entries[source].get(key) for key in ['quote','meaning','application']),
                        'Changed/newly applicable sources need a real fresh explanation, not an old answer replay')
        entries.append(entry)
    view={key:c[key] for key in IDENTITY}
    view.update(currentContextAvailable=c['currentContextAvailable'],rulesUnderstood=c['rulesUnderstood'],task=c['task'],
                scenarios=copy.deepcopy(a['scenarios']),understanding=entries)
    # Legacy validators still inspect every original quote/meaning/application.
    # The actual new focus and access statements remain in their own immutable
    # confirmation and must be judged by the existing independent reviewer.
    l.application_check(root,m,view,source_texts=current_texts)
    return view,{'version':VERSION,'previousManifest':manifest_ref,'previousApplication':application_ref,
                 'reusedSources':sorted(retained),'freshSources':sorted(required),
                 'scope':'Mechanical validation view of attributed prior explanations plus genuine current confirmation; not newly authored explanations or an audit PASS.'}


def record(root,directory,confirmation,out):
    l=local(root);require(l is not None,'This site has no detailed local explanation gate; preserve its existing protocol without adding one')
    m=l.validate(root,directory,False)
    require(m['delivered']==list(range(1,len(m['parts'])+1)),'Read the complete current/new instruction delivery before confirming')
    c=read(confirmation);view,proof=expand(root,m,c,l)
    view['understandingReuse']={**proof,'confirmation':ref(root,confirmation)}
    # Confirms no previously recorded application is silently replaced.
    if m.get('application'):
        require((root/m['application']['path']).resolve()==out.resolve() and out.is_file() and read(out)==view,'Application already recorded; do not replace its evidence')
    save_exact(out,view);l.record_application(root,directory,out)
    registered=read(directory/'manifest.json')
    registered['understandingReuse']={'version':VERSION,'confirmation':ref(root,confirmation),'application':ref(root,out)}
    l.save(directory/'manifest.json',registered)
    verify_view(root,directory,out)
    return {'status':'current-confirmation-recorded-not-an-audit-pass','application':ref(root,out),
            'bundle':ref(root,directory/'manifest.json'),
            'unchangedExplanationsReused':len(proof['reusedSources']),'freshExplanations':len(proof['freshSources']),
            'instruction':'Use inspect for the compact independent-review view; original attributed explanations remain retrievable.'}


def verify_view(root,directory,path,historical=False,seen=None):
    seen=set() if seen is None else seen;key=str(path.resolve())
    require(key not in seen,'Circular retained-understanding evidence');seen.add(key)
    l=local(root);require(l is not None,'Retained local explanation evidence requires its original site protocol')
    if historical:m,current_texts=l.historical_delivery(root,directory)
    else:m=l.validate(root,directory,False);current_texts=None
    require(m.get('application') and artifact(root,m['application'])==path.resolve(),'Verify the actually recorded application')
    view=read(path);proof=view.get('understandingReuse');require(isinstance(proof,dict),'Missing retained-understanding provenance')
    require(m.get('understandingReuse')=={'version':VERSION,'confirmation':proof.get('confirmation'),'application':ref(root,path)},
            'Retained-understanding bundle registration missing or changed')
    c=read(artifact(root,proof.get('confirmation')))
    expected,binding=expand(root,m,c,l,seen,current_texts)
    expected['understandingReuse']={**binding,'confirmation':proof['confirmation']}
    require(view==expected,'Retained explanations, identities or current confirmation changed')
    return {'application':ref(root,path),'confirmation':proof['confirmation'],'identity':{key:m[key] for key in IDENTITY},
            'currentTask':c['task'],'currentAccess':c['accessEvidence'],'currentApplication':c['currentApplication'],
            'unchangedExplanationCount':len(proof['reusedSources']),'freshExplanations':[entry for entry in view['understanding'] if entry['source'] in proof['freshSources']],
            'originalExplanationReference':proof['previousApplication'],
            'scope':'Fresh current-context confirmation and source-bound retained explanations. Not comprehension proof or an audit PASS.'}


def review_check(root,review):
    for reference in review.get('instructionApplications',[]):
        # Existing legacy/native transport validators retain their own paths.
        # This hook adds verification only for the new opt-in receipt format.
        try:
            manifest_path=(root/reference['path']).resolve();m=read(manifest_path)
            path=(root/m['application']['path']).resolve();view=read(path)
        except (OSError,KeyError,ValueError,TypeError):continue
        if m.get('understandingReuse') or view.get('understandingReuse'):
            manifest_path=artifact(root,reference);path=artifact(root,m['application'])
            verify_view(root,manifest_path.parent,path)
    return True


def sources(root,path):
    found=set();pending=[ref(root,path)]
    while pending:
        value=pending.pop();key=value['path']
        if key in found:continue
        found.add(key);a=read(artifact(root,value));proof=a.get('understandingReuse')
        if proof:
            pending.extend(proof[k] for k in ['confirmation','previousManifest','previousApplication','application'] if isinstance(proof.get(k),dict))
        if a.get('application'):pending.append(a['application'])
    return {'paths':sorted(found),'scope':'Retain with the normal complete bundle/chunk/handoff/source evidence; this list does not replace those existing dependencies.'}


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--root',default=str(Path(__file__).resolve().parents[2]));sub=parser.add_subparsers(dest='command',required=True)
    q=sub.add_parser('challenge');q.add_argument('--run-dir',required=True)
    q=sub.add_parser('record')
    for key in ['run-dir','confirmation','out']:q.add_argument('--'+key,required=True)
    q=sub.add_parser('inspect');q.add_argument('--run-dir',required=True);q.add_argument('--application',required=True)
    q=sub.add_parser('sources');q.add_argument('--application',required=True)
    args=parser.parse_args();root=Path(args.root).resolve()
    def inside(name):
        path=(root/name).resolve();require(root in path.parents and 'public' not in path.relative_to(root).parts,'Use internal repository evidence paths');return path
    if args.command=='challenge':value=challenge(root,inside(args.run_dir))
    elif args.command=='record':value=record(root,inside(args.run_dir),inside(args.confirmation),inside(args.out))
    elif args.command=='inspect':value=verify_view(root,inside(args.run_dir),inside(args.application))
    else:value=sources(root,inside(args.application))
    print(json.dumps(value,indent=2))


if __name__=='__main__':
    try:main()
    except (ValueError,KeyError,OSError) as error:print('BLOCKED: '+str(error),file=sys.stderr);sys.exit(1)
