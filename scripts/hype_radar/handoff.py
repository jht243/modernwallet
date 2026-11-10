"""Carry every harvested candidate to independent Mindmap review."""
import argparse
import contextlib
import hashlib
import importlib.util
import json
import os
import shlex
import re
from pathlib import Path
import subprocess
import sys
import tempfile


def checkpoint_module():
    spec = importlib.util.spec_from_file_location("hype_checkpoints",Path(__file__).with_name("checkpoints.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def fingerprint(data):
    return hashlib.sha256(data).hexdigest()


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as stream:
        stream.write(data)
    os.replace(stream.name, path)


def active_session():
    return os.environ.get("CLAUDE_CODE_REMOTE_SESSION_ID") or os.environ.get("CLAUDE_CODE_SESSION_ID")


def marker(root, session):
    folder = subprocess.check_output(["git", "rev-parse", "--absolute-git-dir"], cwd=root, text=True).strip()
    return Path(folder) / "hype-dispatch" / fingerprint(session.encode())


def production():
    spec=importlib.util.spec_from_file_location('native_hype_production',Path(__file__).with_name('production_recovery.py'))
    value=importlib.util.module_from_spec(spec);spec.loader.exec_module(value);return value


def announce(root, source):
    data = source.read_bytes()
    receipt=source.parent/'reviewed'/source.name
    if receipt.is_file():
        proof=json.loads(receipt.read_bytes());remaining=production().outstanding(root,proof)
        if remaining:
            archive = production().restore_work(root,proof)
            if archive: print('Recovered the original reviewed plan, candidate and available audit evidence in '+str(archive)+'. Use them directly; apply only the identified changes to current source.')
            if active_session():save(marker(root,active_session()),str(source.relative_to(root)).encode())
            print('Resume original Hype production job '+proof['job']+' from branch '+str(proof.get('workBranch') or 'its retained native evidence')+'. Remaining routes: '+json.dumps(remaining)+'. Reuse its chart and draft. Inspect original audit records and counters. If an informal independent FAIL exists without its native admission, retain that finding and its consumed round honestly. Never classify a missing admission as a PASS or reset the tier. Complete native AUDIT preparation and reservation BEFORE every new independent content review. Use exact reviewer-prescribed mechanical corrections where authorized; keep real testing/exclusion and build/live checks. Publish eligible exact candidates under the current native limit. No new harvest or chart.')
            return
    print(f"Mindmap handoff required for ALL candidates: {source} sha256={fingerprint(data)}")
    print("Persist the frozen intake and ledger; dispatch BUILD with this SHA, the full candidate list and all original evidence. Complete the existing independent chart review and handoff.py finish before closing.")
    date = json.loads(data)["generated_at"][:10]
    chart = root / "reports/mindmap-pass" / f"{date}-hype-{source.stem[:12]}.md"
    print(f"Use chartPath {chart.relative_to(root)} for this intake and for both angle checks; preserve earlier charts.")
    if any(c.get("angles") for c in json.loads(data)["candidates"]):
        print("Angle lens: during Step 1 (chart building), read `scripts/hype_radar/ANGLE_LENS.md` and apply it to every candidate's angle tally below.")
    session = active_session()
    if session:
        save(marker(root, session), str(source.relative_to(root)).encode())


@contextlib.contextmanager
def harvest_lock(root):
    import fcntl
    folder = Path(subprocess.check_output(["git","rev-parse","--absolute-git-dir"], cwd=root, text=True).strip())
    with (folder/"hype-harvest.lock").open("a") as stream:
        fcntl.flock(stream,fcntl.LOCK_EX)
        yield


def pending(root):
    directory = root / "reports/hype-radar/intakes"
    ledger = root/"reports/hype-radar/tools_seen.json"
    if ledger.exists():
        entries = json.loads(ledger.read_text())
        for value in entries.values():
            intake = value.get("hypeIntake")
            if not intake:
                continue
            digest = intake["sha256"]
            if not re.fullmatch(r"[a-f0-9]{64}", digest):
                raise ValueError("Invalid frozen intake reference")
            path = directory/(digest+".json")
            if not path.exists() and not (directory/"reviewed"/path.name).exists():
                source = (root/intake["source"]).resolve()
                if not source.is_relative_to(root.resolve()) or fingerprint(source.read_bytes()) != digest:
                    raise ValueError("Restore the original pending Hype pull before paid discovery")
                save(path,source.read_bytes())
    for source in sorted(directory.glob("*.json")):
        if fingerprint(source.read_bytes()) != source.stem:
            raise ValueError("Pending Hype intake changed")
        receipt = directory/"reviewed"/source.name
        if not receipt.is_file():
            return source
        proof = json.loads(receipt.read_text())
        validate_proof(source, proof)
        if production().outstanding(root,proof):return source
    return None


def validate_proof(source, proof):
    names = [c["name"].casefold() for c in json.loads(source.read_bytes())["candidates"]]
    if (fingerprint(source.read_bytes()) != source.stem or proof["pull"] != source.stem
            or not proof["job"] or not proof["reviewer"]
            or not all(re.fullmatch(r"[0-9a-f]{64}",proof[key]) for key in ("manifest","review"))
            or proof["candidates"] != names):
        raise ValueError("Invalid Hype handoff receipt")


def freeze(root, raw):
    path = root / "reports/hype-radar/intakes" / (fingerprint(raw) + ".json")
    if path.exists() and path.read_bytes() != raw:
        raise ValueError("Historical intake bytes changed")
    save(path, raw)
    checkpoint_module().persist(root,path)
    announce(root, path)
    return path


def finish(root, source, manifest, review):
    source = source.resolve()
    if source.parent != root / "reports/hype-radar/intakes" or source.stem != fingerprint(source.read_bytes()):
        raise ValueError("Require the original frozen Hype intake")
    spec = importlib.util.spec_from_file_location("mindmap_gates", root / ".claude/tools/mindmap-gates.py")
    gate = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gate)
    plan, verdict = (json.loads(p.read_text()) for p in (manifest,review))
    retained = source.parent / 'reviewed' / source.name
    if retained.is_file():
        proof = json.loads(retained.read_bytes())
        validate_proof(source, proof)
        stable = lambda obj: fingerprint(json.dumps(obj, sort_keys=True, separators=(',',':'), ensure_ascii=False).encode())
        if (proof['manifest'] != stable(plan) or proof['review'] != stable(verdict)
                or proof['job'] != verdict.get('jobId') or proof['reviewer'] != verdict.get('reviewer')):
            raise ValueError('Use the unchanged original independently reviewed chart and verdict')
        # Production is allowed to change the pre-write sources. The original
        # chart was already validated against them and is bound by both hashes.
        remaining = production().outstanding(root,proof)
        print(json.dumps({'chart':'original-independent-review-retained','pendingPublication':remaining}))
        return
    gate.chart(root, plan, verdict)
    gate.saved_chart(root, plan)
    acknowledge(root, source, plan, verdict)


def acknowledge(root, source, plan, verdict):
    raw = source.read_bytes()
    if fingerprint(raw) != source.stem or source.stem not in {ref["sha256"] for ref in plan["evidenceFiles"]}:
        raise ValueError("The independently reviewed chart must bind the exact pull")
    decisions = plan.get("candidateDispositions", [])
    names = [c["name"].casefold() for c in json.loads(raw)["candidates"]]
    accounted = [str(row["candidate"]).casefold() for row in decisions if row.get("decision") and row.get("reason")]
    if sorted(names) != sorted(accounted):
        raise ValueError("Account for each original candidate exactly once in the independently reviewed chart")
    subprocess.run([sys.executable,str(root/"scripts/hype_radar/check_chart.py"),"--pull",str(source),"--chart",str(root/plan["chartPath"])],check=True)
    digest = lambda value: fingerprint(json.dumps(value,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode())
    receipt = {"pull":source.stem, "manifest":verdict["manifestSha256"], "review":digest(verdict),
               "job":verdict["jobId"], "reviewer":verdict["reviewer"], "candidates":names}
    receipt['productionTargets']=production().publication_targets(plan)
    receipt['workBranch']=production().work_reference(root)
    path = source.parent / "reviewed" / source.name
    encoded = (json.dumps(receipt,sort_keys=True)+"\n").encode()
    if path.exists():
        old=json.loads(path.read_text())
        if old["pull"]!=source.stem or old["candidates"]!=names:
            raise ValueError("Changed original Hype handoff")
        return
    checkpoint_module().reviewed(root,receipt,plan,verdict)
    save(path,encoded)


def after_chart(root, plan, verdict):
    """Invoked only AFTER native independent chart validation succeeds."""
    directory=root/"reports/hype-radar/intakes"
    frozen=[directory/(ref["sha256"]+".json") for ref in plan["evidenceFiles"]]
    matched=[p for p in frozen if p.is_file()]
    if matched:
        for p in set(matched):
            acknowledge(root,p,plan,verdict)
    elif active_session():
        active=marker(root,active_session())
        if active.is_file() and not (directory/"reviewed"/Path(active.read_text()).name).is_file():
            raise ValueError("Include the pending Hype intake as immutable preparation evidence")


def active_pull(root, payload):
    session = active_session() or payload.get("session_id")
    if not session:
        return None
    path = marker(root, session)
    if not path.exists():
        return None
    source = root/path.read_text()
    receipt = source.parent / "reviewed" / source.name
    if receipt.is_file():
        proof=json.loads(receipt.read_bytes())
        validate_proof(source, proof)
        return source if production().outstanding(root,proof) else None
    return source



def guard_paid_dispatch(root,payload):
    session = active_session() or payload.get("session_id")
    if not session:
        return
    active = marker(root,session)
    if not active.is_file():
        return
    source = root/active.read_text()
    receipt = source.parent/"reviewed"/source.name
    if not receipt.is_file():
        return
    proof = json.loads(receipt.read_bytes())
    validate_proof(source,proof)
    task = payload.get("tool_input",{})
    role = (str(task.get("subagent_type",""))+" "+str(task.get("description",""))).casefold()
    chart = "chart" in role or re.search(r"\bbuild\b",role) and "preview" not in role
    if chart and "render" not in role:
        raise ValueError("The original Hype chart was independently reviewed. Use its preserved review, source and candidate. Resume production without repeating BUILD or chart review.")
    if not any(label in role for label in ("auditor","audit","phase 4","phase-4","phase4")):
        return
    native = root/".claude/tools/workflow-handoff.py"
    if not native.is_file(): return
    spec = importlib.util.spec_from_file_location("hype_stage_handoff",native)
    module = importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    for rel in set(re.findall(r"reports/[A-Za-z0-9._/-]+[.]json",str(task.get("prompt","")))):
        path = (root/rel).resolve()
        if not path.is_relative_to(root/"reports") or not path.is_file(): continue
        try: handoff = json.loads(path.read_bytes())
        except (UnicodeDecodeError,ValueError):continue
        if not isinstance(handoff,dict) or handoff.get("jobId") != proof["job"] or not handoff.get("snapshot"):continue
        module.focused(root,path,"audit")
        return
    raise ValueError("Before dispatching the independent content auditor, MAIN must seal the actual rendered AUDIT handoff for this Hype job and include its reports/...json path in the prompt. The auditor completes current preflight and reserves the real round before judging the page.")


def report_guard(root, payload):
    command = payload.get("tool_input", {}).get("command", "")
    if "/api/routine-run" not in command:
        return
    source = active_pull(root, payload)
    if source is None:
        return
    # The collector accepts the prepared JSON file. A genuine execution
    # failure can still be reported with the original intake left pending.
    try:
        lexer = shlex.shlex(command,posix=True,punctuation_chars=True)
        lexer.whitespace_split = True
        words = list(lexer)
        bodies = [words[i+1] for i,w in enumerate(words[:-1]) if w in {"-d","--data","--data-binary","--json"}]
        if len(bodies) == 1:
            body = bodies[0]
            if body.startswith("@"):
                path = (Path(payload.get("cwd",root)) / body[1:]).resolve()
                if path.is_file() and path.stat().st_size < 2_000_000:
                    body = path.read_text()
            if json.loads(body).get("status") == "failure":
                return
    except (ValueError,OSError,AttributeError):
        pass
    print(f"Pending Hype candidates cannot be reported as a no-op or success. Dispatch BUILD with {source.relative_to(root)}. For a genuine terminal failure, post the existing native failure JSON with curl --data-binary @/absolute/path/report.json as a separate command. Keep the original work pending.",file=sys.stderr)
    raise SystemExit(2)


def stop(root, payload):
    if payload.get('hook_event_name') == 'Stop' and payload.get('stop_hook_active') is True:
        return  # The first reminder fired; report_guard still refuses false success.
    source = active_pull(root,payload)
    if source is None:
        return
    helper=root/'.claude/tools/native-worker-wait.py'
    if helper.is_file():
        spec=importlib.util.spec_from_file_location('native_hype_worker_wait',helper)
        worker_wait=importlib.util.module_from_spec(spec);spec.loader.exec_module(worker_wait)
        if worker_wait.running(payload):return
    # A completed worker is not the independently validated chart handoff.
    print(json.dumps({"decision":"block","reason":f"Resume {source.relative_to(root)}. When chart proof exists, finish its outstanding production using the original work and counters. Otherwise dispatch BUILD with the frozen candidates. The dispatcher cannot drop the intake or finish as a no-op."}))


if __name__ == "__main__":
    root=Path(__file__).resolve().parents[2]
    parser=argparse.ArgumentParser()
    subs=parser.add_subparsers(dest="command",required=True)
    subs.add_parser("stop")
    subs.add_parser("report-guard")
    end=subs.add_parser("finish")
    for flag in ["pull","manifest","review"]:
        end.add_argument("--"+flag,required=True,type=Path)
    args=parser.parse_args()
    if args.command=="stop":
        stop(root,json.load(sys.stdin))
    elif args.command=="report-guard":
        report_guard(root,json.load(sys.stdin))
    else:
        finish(root,args.pull,args.manifest,args.review)
