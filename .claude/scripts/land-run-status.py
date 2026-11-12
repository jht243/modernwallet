#!/usr/bin/env python3
"""Read-only status of THIS landing branch's own `land.yml` run.

    land-run-status.py --branch claude/land/<key>-<epoch> --sha <pushed head sha>

Prints exactly one JSON line and always exits 0, so a status problem can never
stop a landing by itself:

    {"state": "failed",  "id": 1, "url": "...", "conclusion": "failure", "reason": "..."}
    {"state": "success" | "pending" | "unknown", ...}

Only a verified terminal failure of the run that belongs to this exact attempt is
"failed". The run is bound by its unique display title ("Land <branch>", the branch
name carries the epoch of this attempt) AND either the push event on that branch at
the pushed sha, or a workflow_dispatch run (which executes on main) with the same
title. An older, unrelated or unreadable run is "unknown" and never stops anything.
It never triggers, re-runs or cancels a workflow and never touches main.
"""
import argparse
import json
import os
import subprocess

FAILED = {'failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure', 'stale'}
FIELDS = 'databaseId,displayTitle,headBranch,headSha,event,status,conclusion,url,createdAt,attempt'


def gh(args, timeout=25):
    result = subprocess.run([os.environ.get('GH_BIN', 'gh')] + args, capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        raise OSError(result.stderr.strip()[:200] or 'gh failed')
    return result.stdout


def belongs(run, branch, sha):
    if run.get('displayTitle') != 'Land ' + branch:
        return False
    if run.get('event') == 'push':
        return run.get('headBranch') == branch and run.get('headSha') == sha
    return run.get('event') == 'workflow_dispatch' and run.get('headBranch') == 'main'


def reason(run_id):
    """Best effort: the first job annotation (e.g. the billing/spending-limit message)."""
    try:
        jobs = json.loads(gh(['api', 'repos/{owner}/{repo}/actions/runs/%s/jobs' % run_id])).get('jobs', [])
        for job in jobs[:3]:
            notes = json.loads(gh(['api', 'repos/{owner}/{repo}/check-runs/%s/annotations' % job['id']]))
            if notes and notes[0].get('message'):
                return str(notes[0]['message'])[:300]
    except (OSError, ValueError, KeyError, subprocess.SubprocessError):
        pass
    return ''


def status(branch, sha):
    try:
        runs = json.loads(gh(['run', 'list', '--workflow', 'land.yml', '--limit', '50', '--json', FIELDS]))
    except (OSError, ValueError, subprocess.SubprocessError):
        return {'state': 'unknown', 'why': 'github status unavailable'}
    if not isinstance(runs, list):
        return {'state': 'unknown', 'why': 'unexpected github response'}
    own = [r for r in runs if isinstance(r, dict) and belongs(r, branch, sha)]
    if not own:
        return {'state': 'unknown', 'why': 'no run bound to this landing attempt yet'}
    run = sorted(own, key=lambda r: (str(r.get('createdAt', '')), int(r.get('attempt') or 0)))[-1]
    base = {'id': run.get('databaseId'), 'url': run.get('url'), 'conclusion': run.get('conclusion'), 'status': run.get('status')}
    if run.get('status') != 'completed':
        return dict(base, state='pending')
    if run.get('conclusion') in FAILED:
        return dict(base, state='failed', reason=reason(run.get('databaseId')))
    if run.get('conclusion') == 'success':
        return dict(base, state='success')
    return dict(base, state='unknown', why='completed with an unrecognised conclusion')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--branch', required=True)
    parser.add_argument('--sha', required=True)
    args = parser.parse_args()
    print(json.dumps(status(args.branch, args.sha)))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
