"""Keep Hype inputs and writer reservations across ephemeral cloud checkouts."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import tempfile

REF = "refs/heads/automation/hype-control"


def backend(root):
    if not (os.environ.get("CLAUDE_CODE_REMOTE_SESSION_ID") or os.environ.get("CLAUDE_CODE_REMOTE", "").lower() in ("1","true","yes")):
        return None
    path = root / ".claude/tools/workflow-control-store.py"
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
        if row.get("review") and not path.exists():
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
    _, old = store.read()
    if digest in data(old)["intakes"]:
        return
    def add(state):
        data(state)["intakes"].setdefault(digest, {"names":names})
    store.mutate(add, [str(path.relative_to(root))])


def reviewed(root, proof):
    connection = backend(root)
    if not connection:
        return
    _, store = connection
    def close(state):
        row = data(state)["intakes"][proof["pull"]]
        if row.get("review") and row["review"] != proof:
            raise ValueError("The original reviewed Hype handoff is already closed")
        row["review"] = proof
    store.mutate(close)


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
