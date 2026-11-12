"""PreToolUse: require separate tool results in one request for unread instruction chunks."""
import json
import os
from pathlib import Path
import shlex
import sys
import time

# The model transcript lags the live request. Measured in the live runtime: when
# the first hook of a genuine batch starts, the tool_use rows of that message may
# not be flushed yet; they appear together within ~2 seconds, still before the
# first call executes (tool calls and their hooks run one after another). The
# guard polls boundedly for the companion rows; a lone singleton call never gains
# a partner and is rejected when the window ends.
WINDOW = float(os.environ.get("DELIVERY_PAIR_WINDOW", "8"))
POLL = 0.1
MAX_GROUP = int(os.environ.get("DELIVERY_GROUP_SIZE", "10"))


def delivery(command):
    if not isinstance(command, str):
        return None
    if "workflow-delivery-serial.local.py" not in command and "workflow-preflight.py" not in command:
        return None
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars=True)
        lexer.whitespace_split = True
        words = list(lexer)
        helper = next(i for i, w in enumerate(words) if Path(w).name in
                      {"workflow-delivery-serial.local.py", "workflow-preflight.py"})
        args = words[helper + 1:]
        serial = words[helper].endswith("serial.local.py")
        if not serial and args[:1] != ["next"]:
            return None
        directory = args[args.index("--run-dir") + 1]
        from string import Template
        assignments = dict(word.split("=", 1) for word in words[:helper] if "=" in word and word.split("=", 1)[0].isidentifier())
        for _ in range(len(assignments) + 1):
            directory = Template(directory).safe_substitute(assignments)
        part = int(args[args.index("--part") + 1]) if "--part" in args else None
        return serial, directory, part
    except (ValueError, IndexError, StopIteration):
        return None


def group_request(path, tool_id, directory, first, part):
    requests = {}
    with Path(path).open("rb") as stream:
        stream.seek(max(0, stream.seek(0, os.SEEK_END) - 2_000_000))
        lines = stream.read().splitlines()
    for line in lines:
        try:
            row = json.loads(line)
        except (UnicodeDecodeError, ValueError):
            continue
        msg = row.get("message", {})
        if row.get("type") != "assistant":
            continue
        key = row.get("requestId") or msg.get("id")
        if not key:
            continue
        calls = requests.setdefault(key, {})
        for block in msg.get("content", []):
            if isinstance(block, dict) and block.get("type") == "tool_use":
                calls[block.get("id")] = delivery(block.get("input", {}).get("command", ""))
    for calls in requests.values():
        if tool_id not in calls:
            continue
        parts = sorted({
            p for parsed in calls.values()
            if parsed is not None for s, d, p in [parsed]
            if s and d == directory and isinstance(p, int)
        })
        if 2 <= len(parts) <= max(2, MAX_GROUP):
            if parts == list(range(parts[0], parts[-1] + 1)) and parts[0] <= first <= parts[-1] and part in parts:
                return True
    return False


def block_reason(payload, root):
    root = root.resolve()
    call = delivery(payload.get("tool_input", {}).get("command", ""))
    if call is None:
        return None
    serial, directory, part = call
    path = (root / directory / "manifest.json").resolve()
    if not path.is_relative_to(root) or not path.is_file():
        return None
    manifest = json.loads(path.read_text())
    done = manifest["delivered"]
    total = len(manifest["parts"])
    if part in done or len(done) >= total:
        return None
    first = len(done) + 1
    if not serial:
        return ("Use workflow-delivery-serial.local.py for unread parts. " +
                pair_message(directory, first, total))
    if first == total:
        return None
    if not isinstance(part, int):
        return pair_message(directory, first, total)
    transcripts = [payload.get("agent_transcript_path"), payload.get("transcript_path")]
    # Native subagents sometimes receive only the parent transcript location.
    # Use the exact tool ID and request when looking in that session's child logs.
    parent = payload.get("transcript_path")
    children = Path(parent).with_suffix("") / "subagents" if parent and not payload.get("agent_transcript_path") else None
    has_any_transcript = any(p and Path(p).exists() for p in transcripts) or bool(children and children.is_dir())
    if not has_any_transcript and first % 2 == 0 and part == first:
        return None
    deadline = time.monotonic() + WINDOW
    while True:
        candidates = list(transcripts)
        if children and children.is_dir():
            candidates.extend(children.glob("*.jsonl"))
        if any(p and Path(p).is_file() and group_request(p, payload.get("tool_use_id"), directory, first, part) for p in candidates):
            return None
        if time.monotonic() >= deadline:
            return pair_message(directory, first, total)
        time.sleep(POLL)


def pair_message(directory, first, total):
    span = max(2, MAX_GROUP)
    numbers = list(range(first, min(first + span, total + 1))) if first < total else [first]
    commands = [f"python3 .claude/tools/workflow-delivery-serial.local.py --run-dir {shlex.quote(directory)} --part {n}" for n in numbers]
    return "Request these as separate Bash calls in the SAME assistant message: " + " | ".join(commands)


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[2]
    payload = json.load(sys.stdin)
    if not ((root / ".claude/workflow-policy.local.json").is_file() or (root / ".claude/tools/workflow-efficiency.py").is_file()):
        sys.exit(0)
    reason = block_reason(payload, root)
    if reason:
        print(reason, file=sys.stderr)
        sys.exit(2)
