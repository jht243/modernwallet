"""Keep Hype inputs and writer reservations across ephemeral cloud checkouts."""
import hashlib
import importlib.util
import json
import os
import subprocess
from pathlib import Path
import tempfile

REF = "refs/heads/automation/hype-control"


def backend(root, durable=False):
    if not (durable or os.environ.get("CLAUDE_CODE_REMOTE_SESSION_ID") or os.environ.get("CLAUDE_CODE_REMOTE", "").lower() in ("1","true","yes")):
        return None
    path = root / "scripts/routine_control.py"
    spec = importlib.util.spec_from_file_location("hype_git_store", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module, module.Store(root, ref=REF)


def data(state):
    if state.get("job") is None:
        state["job"] = {"artifacts": {}}
    return state.setdefault("hype", {"intakes": {}, "writers": {}})


def replace(path, raw):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as f:
        f.write(raw)
    os.replace(f.name,path)


def production_complete(value):
    if not value:return False
    if value.get('state')=='retired' and bool(str(value.get('retiredReason') or '').strip()):return True
    if value.get('state')!='complete':return False
    if value.get('kind')!='hype-retained-publication-v1':return True
    proof=value.get('hostVerification',{})
    return proof.get('status')=='live' and proof.get('purpose')=='host-deployment-evidence' and bool(value.get('completedLiveSnapshot'))


def restore(root):
    connection = backend(root)
    if not connection:
        return set()
    module, store = connection
    revision, state = store.read()
    if revision is None:
        store.mutate(lambda state: data(state))
        return set()
    known = set()
    for digest, row in data(state)["intakes"].items():
        if len(digest)!=64 or any(c not in "0123456789abcdef" for c in digest):
            raise ValueError("Invalid Hype checkpoint digest")
        known.update(row["names"])
        path = root/"reports/hype-radar/intakes"/(digest+".json")
        production=row.get('production')
        if production:
            replace(path.parent/'production'/path.name,(json.dumps(production,sort_keys=True)+'\n').encode())
        if row.get("review") and (not production or production_complete(production)) and not path.exists():
            replace(path.parent/"reviewed"/path.name, (json.dumps(row["review"],sort_keys=True)+"\n").encode())
            continue
        if not path.exists():
            raw = module.git(root, "show", revision+":artifacts/"+digest).stdout
            if hashlib.sha256(raw).hexdigest() != digest:
                raise ValueError("Original Hype checkpoint changed")
            replace(path, raw)
        if row.get("review"):
            replace(path.parent/"reviewed"/path.name, (json.dumps(row["review"],sort_keys=True)+"\n").encode())
    return known


def persist(root, path):
    connection = backend(root)
    if not connection:
        return
    _, store = connection
    digest = path.stem
    raw = path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != digest:
        raise ValueError("Preserve the exact Hype input")
    names = sorted({name.casefold() for row in json.loads(raw)["candidates"]
                    for name in [row["name"], *row.get("aliases",[])]})
    branch=subprocess.run(['git','symbolic-ref','--short','HEAD'],cwd=root,capture_output=True,text=True)
    production={'state':'pending'}
    if branch.returncode==0:production['sourceRef']='refs/heads/'+branch.stdout.strip()
    _, old = store.read()
    if digest in data(old)["intakes"]:
        return
    def add(state):
        data(state)["intakes"].setdefault(digest, {"names":names,'production':production})
    store.mutate(add, [str(path.relative_to(root))])


def reviewed(root, proof, production_required=True):
    connection = backend(root)
    if not connection:
        return
    _, store = connection
    def close(state):
        row = data(state)["intakes"][proof["pull"]]
        if row.get("review") and row["review"] != proof:
            raise ValueError("The original reviewed Hype handoff is already closed")
        row["review"] = proof
        if not production_required:row['production']={'state':'complete','reason':'independently-reviewed-no-addition','chartReview':proof['review']}
    store.mutate(close)


def publication(root, digest, value, durable=False):
    """Retain inputs/status, never grant an audit PASS or publication authority."""
    connection=backend(root,durable)
    if connection:
        _,store=connection
        def change(state):
            row=data(state)['intakes'].get(digest)
            if row is None or not row.get('review'):raise ValueError('Restore the original independently reviewed Hype handoff')
            if value.get('jobId') and value['jobId']!=row['review']['job']:raise ValueError('Publication belongs to another canonical job')
            previous=row.get('production',{})
            if previous.get('state')=='complete' and previous!=value:
                if value.get('state')!='complete' or any(value.get(k)!=v for k,v in previous.items()):raise ValueError('Do not reopen completed production')
            row['production']=value
        store.mutate(change)
    target=root/'reports/hype-radar/intakes/production'/(digest+'.json')
    replace(target,(json.dumps(value,sort_keys=True)+'\n').encode())


def reserve_writer(root,key,local,admit):
    connection = backend(root)
    if not connection:
        return admit(local)
    _, store = connection
    def change(state):
        writers = data(state)["writers"]
        previous = writers.get(key,local)
        if len(local["operations"]) > len(previous["operations"]):
            raise ValueError("Recover divergent writer history before paying for a new operation")
        writers[key] = admit(previous)
        return writers[key]
    return store.mutate(change)
