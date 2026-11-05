from pathlib import Path
import json,subprocess,tarfile,hashlib,sys,shutil
repo=Path.cwd(); run=repo/'reports/mindmap-pass/2026-11-04-aca-snap'; info=json.loads((run/'internal/publication-paths.json').read_text()); candidate=Path(info['root'])/'candidate'; 
assert candidate.parent == Path(info['root']) and candidate.name == 'candidate'
if candidate.exists():shutil.rmtree(candidate)
candidate.mkdir()
# Export the verified published tree; merge only this run's exact before→after deltas.
p=subprocess.Popen(['git','archive',info['baseRevision']],stdout=subprocess.PIPE)
with tarfile.open(fileobj=p.stdout,mode='r|') as t:t.extractall(candidate)
assert p.wait()==0
before=run/'root-before'; files=json.loads((before/'manifest.json').read_text()); selected=[]
for f in files:
    current=repo/f
    if current.read_bytes()==(before/f).read_bytes():continue
    published=candidate/f
    result=subprocess.run(['git','merge-file','-p',str(published),str(before/f),str(current)],capture_output=True)
    if result.returncode:raise SystemExit('Selective delta conflict: '+f+' '+result.stderr.decode())
    published.write_bytes(result.stdout);selected.append(f)
new=['src/components/BenefitsNotice.astro','src/components/BenefitsCalculators.tsx','src/components/BenefitsCalculators.css','src/lib/benefits-math.ts','src/lib/benefits-text.ts','src/data/benefits-guides.ts','src/data/benefits-comparisons.ts','src/data/benefits-spokes.ts','scripts/test-benefits-tools.mjs']
for f in new:
    dest=candidate/f
    assert not dest.exists(),f+' unexpectedly exists on published base'
    dest.parent.mkdir(parents=True,exist_ok=True)
    if not (repo/f).exists() and '--partial' in sys.argv and f in ['src/data/benefits-guides.ts','src/data/benefits-comparisons.ts']:
        name='BENEFIT_GUIDES' if 'guides' in f else 'BENEFIT_COMPARISONS';dest.write_text('export const '+name+' = [];\n');continue
    dest.write_bytes((repo/f).read_bytes());selected.append(f)
if not (candidate/'node_modules').exists():(candidate/'node_modules').symlink_to(repo/'node_modules',target_is_directory=True)
record={'partial': '--partial' in sys.argv,'baseRevision':info['baseRevision'],'candidate':str(candidate),'selectedFiles':{f:hashlib.sha256((candidate/f).read_bytes()).hexdigest() for f in selected}}
(run/'internal/selected-source.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({'candidate':str(candidate),'selectedFiles':len(selected)}))
