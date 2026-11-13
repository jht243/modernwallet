#!/usr/bin/env python3
"""Search Gap lifecycle guards: PreToolUse report/exit-mask guard, Stop close-out enforcement, and SessionEnd safety net."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time

sys.path.insert(0, str(Path(__file__).resolve().parent))
import job_worker as worker

MAX_BLOCKS = 3
SESSION_HINT_TTL = 3600
LEASE_TTL = 21600
GUARDED_WORKER_RE = re.compile(r'\b(?:job_worker\.py|search_gap_worker\.(?:mjs|mts))\b')
REPORT_CMD_RE = re.compile(r'(?:/api/routine-run\b|send-routine-email\.py\b)')
OTHER_SKILL_RE = re.compile(r'(?:"skill"\s*:\s*"(?!search-gap)[^"]+"|--skill(?:=|\s+)["\']?(?!search-gap)[a-zA-Z0-9_.-]+)')
EXIT_MASK_PIPE_RE = re.compile(r'\|\s*(?:tail|head|cat|sed|grep|egrep|fgrep|awk|cut|tr|wc|tee)\b')
EXIT_MASK_OR_RE = re.compile(r'(?:\|\||;)\s*(?::(?=\s|$)|true\b|exit\s+0\b|echo\b)')

STOP_HOOK_CMD = 'python3 "{root}/scripts/search_gap/session_end.py" stop'
PRE_BASH_HOOK_CMD = 'python3 "{root}/scripts/search_gap/session_end.py" pre-bash'
SESSION_END_HOOK_CMD = 'python3 "{root}/scripts/search_gap/session_end.py"'


def git_dir(root):
    out = subprocess.check_output(['git', 'rev-parse', '--absolute-git-dir'], cwd=root, text=True).strip()
    p = Path(out)
    return p if p.is_absolute() else (root / p)


def recovery_dir(root):
    return git_dir(root) / 'search-gap-recovery'


def sha(value):
    return hashlib.sha256(value.encode()).hexdigest()


def record_session_hint(root, sid, now=None):
    if not sid:
        return
    try:
        d = recovery_dir(root)
        d.mkdir(parents=True, exist_ok=True)
        (d / 'current-session.json').write_text(json.dumps({'sessionId': sid, 'updatedAt': now or time.time()}))
    except Exception:
        pass


def read_session_hint(root, now=None):
    now = now or time.time()
    try:
        p = recovery_dir(root) / 'current-session.json'
        if not p.is_file():
            return ''
        data = json.loads(p.read_text())
        if now - float(data.get('updatedAt', 0)) > SESSION_HINT_TTL:
            return ''
        return str(data.get('sessionId') or '')
    except Exception:
        return ''


def resolve_session_id(root, payload=None, now=None):
    sid = (os.environ.get('CLAUDE_CODE_REMOTE_SESSION_ID')
           or os.environ.get('CLAUDE_CODE_SESSION_ID')
           or (payload or {}).get('session_id')
           or '')
    if not sid:
        sid = read_session_hint(root, now=now)
    return sid


def active_lease(root, payload=None, now=None):
    now = now or time.time()
    sid = resolve_session_id(root, payload=payload, now=now)
    if not sid:
        return None, None
    marker = recovery_dir(root) / 'leases' / (sha(sid) + '.json')
    if not marker.is_file():
        return sid, None
    try:
        saved = json.loads(marker.read_text())
    except Exception:
        return sid, None
    if saved.get('createdAt') and (now - float(saved['createdAt']) > LEASE_TTL):
        return sid, None
    cur_wf = os.environ.get('WORKFLOW_RUN_ID', '').strip()
    saved_wf = str(saved.get('workflowRunEnv') or '').strip()
    if cur_wf and saved_wf and cur_wf != saved_wf:
        return sid, None
    return sid, saved


def child_worker_running(root, payload):
    helper = root / '.claude/tools/native-worker-wait.py'
    if not helper.is_file():
        return False
    try:
        spec = importlib.util.spec_from_file_location('search_gap_worker_wait', helper)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return bool(mod.running(payload))
    except Exception:
        return False


def close_instructions(saved):
    site = saved.get('site', '<site>')
    owner = saved.get('owner', '<owner>')
    intake = saved.get('intake', 'reports/search-gap/intake-current.json')
    return (
        f'STANDING OWNER RULE (2026-11-13): Search Gap job {saved.get("run", "")} on {site} is still open. '
        f'Every Search Gap invocation must either finish its job or close it out in the SAME run — never leave an active job open. '
        f'Run `python3 scripts/search_gap/job_worker.py end-run --site {site} --owner {owner} --intake "{intake}" --deploy '
        f'--reason "<specific blocker>"` (passing `--completion <file>` if a completion JSON exists, or `--written <file>` if reviewed drafts exist) '
        f'with this run\'s SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before reporting or stopping.'
    )


def decide_pre_bash(root, payload, now=None):
    now = now or time.time()
    if (payload or {}).get('agent_id') or (payload or {}).get('subagent_type'):
        return True, ''
    sid = (payload or {}).get('session_id') or resolve_session_id(root, payload=payload, now=now)
    if sid:
        record_session_hint(root, sid, now=now)
    command = str(((payload or {}).get('tool_input') or {}).get('command') or '')
    if not command:
        return True, ''
    if GUARDED_WORKER_RE.search(command):
        has_pipefail = bool(re.search(r'set\s+-o\s+pipefail|set\s+-[a-zA-Z]*o\s+pipefail', command))
        if (EXIT_MASK_PIPE_RE.search(command) and not has_pipefail) or EXIT_MASK_OR_RE.search(command):
            return False, (
                'Blocked exit-code masking on Search Gap worker command. '
                'Run `job_worker.py` / `search_gap_worker` directly without piping to `tail`/`head`/`cat` and without `|| true`, '
                'so nonzero exit codes are preserved.'
            )
    if REPORT_CMD_RE.search(command) and not OTHER_SKILL_RE.search(command):
        _, saved = active_lease(root, payload=payload, now=now)
        if saved and saved.get('autoClose') and not saved.get('closed'):
            return False, 'Close the open Search Gap job BEFORE sending the collector report or email. ' + close_instructions(saved)
    return True, ''


def decide_stop(root, payload, now=None):
    now = now or time.time()
    if (payload or {}).get('agent_id') or (payload or {}).get('subagent_type'):
        return True, ''
    if child_worker_running(root, payload or {}):
        return True, ''
    sid, saved = active_lease(root, payload=payload, now=now)
    if not sid or not saved or saved.get('closed') or not saved.get('autoClose'):
        return True, ''
    d = recovery_dir(root)
    d.mkdir(parents=True, exist_ok=True)
    counts_file = d / ('stop-blocks-' + sha(sid)[:24] + '.json')
    try:
        seen = json.loads(counts_file.read_text())
    except Exception:
        seen = {}
    key = f"{saved.get('site', '')}:{saved.get('run', '')}"
    used = int(seen.get(key, 0))
    if used >= MAX_BLOCKS:
        return True, ''
    seen[key] = used + 1
    counts_file.write_text(json.dumps(seen))
    return False, close_instructions(saved)


def install_runtime(root, settings_dir=None):
    target_dir = Path(settings_dir) if settings_dir else root.parent / '.claude'
    if not settings_dir and (root.parent / '.git').exists():
        return None
    f = target_dir / 'settings.json'
    cfg = json.loads(f.read_text()) if f.is_file() else {}
    hooks = cfg.setdefault('hooks', {})
    changed = False
    stop_cmd = STOP_HOOK_CMD.format(root=str(root))
    stop_list = hooks.setdefault('Stop', [])
    if not any(h.get('command') == stop_cmd for e in stop_list for h in e.get('hooks', [])):
        stop_list.append({'hooks': [{'type': 'command', 'command': stop_cmd}]})
        changed = True
    pre_cmd = PRE_BASH_HOOK_CMD.format(root=str(root))
    pre_list = hooks.setdefault('PreToolUse', [])
    if not any(h.get('command') == pre_cmd for e in pre_list for h in e.get('hooks', [])):
        pre_list.append({'matcher': 'Bash', 'hooks': [{'type': 'command', 'command': pre_cmd}]})
        changed = True
    end_cmd = SESSION_END_HOOK_CMD.format(root=str(root))
    end_list = hooks.setdefault('SessionEnd', [])
    if not any(h.get('command') == end_cmd for e in end_list for h in e.get('hooks', [])):
        end_list.append({'hooks': [{'type': 'command', 'timeout': 60, 'command': end_cmd}]})
        changed = True
    if changed:
        target_dir.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps(cfg, indent=2) + '\n')
    return f


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    root = Path(__file__).resolve().parents[2]
    mode = argv[0] if argv else 'session-end'
    if mode == 'install-runtime':
        print(install_runtime(root, argv[1] if len(argv) > 1 else None))
        return 0
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw) if raw.strip() else {}
    except Exception:
        payload = {}
    if mode == 'stop':
        try:
            allow, reason = decide_stop(root, payload)
        except Exception as error:
            print(f'search-gap stop: {error}', file=sys.stderr)
            return 0
        if allow:
            return 0
        print(reason, file=sys.stderr)
        return 2
    if mode == 'pre-bash':
        try:
            allow, reason = decide_pre_bash(root, payload)
        except Exception as error:
            print(f'search-gap pre-bash: {error}', file=sys.stderr)
            return 0
        if allow:
            return 0
        print(reason, file=sys.stderr)
        return 2
    try:
        old_cwd = Path.cwd()
        os.chdir(root)
        os.environ.setdefault('SEARCH_GAP_HTTP_TIMEOUT', '8')
        try:
            worker.release_at_session_end(payload)
        finally:
            os.chdir(old_cwd)
    except Exception as error:
        print(f'search-gap session-end: {error}', file=sys.stderr)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
