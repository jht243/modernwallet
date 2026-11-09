#!/usr/bin/env python3
"""Serialize explicit single-part deliveries without changing preflight or its rules.

An actor may request two SEPARATE Bash tool calls in one model turn. Each call
still emits exactly one original bounded part through the existing validator.
This wrapper only orders the receipt writes; it never combines/summarizes parts,
writes understanding, changes sources, or creates an editorial verdict.
"""
import argparse
import fcntl
import importlib.util
import json
from pathlib import Path
import time


def deliver(root, directory, number, preflight, timeout=15):
    if not isinstance(number, int) or number < 1:
        raise ValueError('Specify the actual positive original part number')
    deadline = time.monotonic()+timeout
    with (directory/'.delivery-order.lock').open('a') as lock:
        while True:
            fcntl.flock(lock, fcntl.LOCK_EX)
            try:
                manifest = json.loads((directory/'manifest.json').read_text())
                delivered = manifest['delivered']
                if number <= len(delivered)+1:
                    # Existing emit performs full source/part validation, prints
                    # ONE original part, flushes stdout, then records delivery.
                    preflight.emit(root,directory,number)
                    return
            finally:
                fcntl.flock(lock, fcntl.LOCK_UN)
            if time.monotonic() >= deadline:
                raise ValueError('Earlier part did not finish; receipt unchanged. Read the missing part first.')
            time.sleep(0.03)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--run-dir',required=True)
    parser.add_argument('--part',required=True,type=int)
    args = parser.parse_args(); root = Path(__file__).resolve().parents[2]
    directory = (root/args.run_dir).resolve()
    if root not in directory.parents:
        raise ValueError('Keep the actual bundle inside the active project')
    spec = importlib.util.spec_from_file_location('original_preflight',Path(__file__).with_name('workflow-preflight.py'))
    preflight = importlib.util.module_from_spec(spec); spec.loader.exec_module(preflight)
    deliver(root,directory,args.part,preflight)


if __name__ == '__main__': main()
