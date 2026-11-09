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


def announce(root, source):
    data = source.read_bytes()
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
    path = source.parent / "reviewed" / source.name
    encoded = (json.dumps(receipt,sort_keys=True)+"\n").encode()
    if path.exists():
        old=json.loads(path.read_text())
        if old["pull"]!=source.stem or old["candidates"]!=names:
            raise ValueError("Changed original Hype handoff")
        return
    checkpoint_module().reviewed(root,receipt)
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
        validate_proof(source, json.loads(receipt.read_bytes()))
        return None
    return source


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
    print(f"Pending Hype candidates cannot be reported as a no-op or success. Dispatch BUILD with {source.relative_to(root)}. Only a prepared failure report can be submitted before independent chart accounting.",file=sys.stderr)
    raise SystemExit(2)


def stop(root, payload):
    source = active_pull(root,payload)
    if source is None:
        return
    # A completed worker is not the independently validated chart handoff.
    print(json.dumps({"decision":"block","reason":f"Resume {source.relative_to(root)}. Dispatch BUILD with the original pull hash and all candidates. The dispatcher cannot drop the intake or finish as a no-op."}))


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
