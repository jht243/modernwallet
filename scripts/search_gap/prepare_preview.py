#!/usr/bin/env python3
"""Prepare the native Python preview without changing system-installed packages."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys


def main():
    root=Path(__file__).resolve().parents[2]
    requirements=root/'requirements.txt'
    if not requirements.is_file():
        raise ValueError('Use this project native non-Python preview build')
    directory=Path(subprocess.check_output(['git','rev-parse','--git-path','search-gap-preview-venv'],cwd=root,text=True).strip())
    if not directory.is_absolute():directory=root/directory
    python=directory/('Scripts/python.exe' if os.name=='nt' else 'bin/python')
    version=hashlib.sha256(requirements.read_bytes()+sys.version.encode()).hexdigest()
    receipt=directory/'requirements-sha256'
    if not python.is_file():
        subprocess.run([sys.executable,'-m','venv',str(directory)],cwd=root,check=True)
    if not receipt.is_file() or receipt.read_text()!=version:
        subprocess.run([str(python),'-m','pip','install','--quiet','-r',str(requirements)],cwd=root,check=True)
        receipt.write_text(version)
    # Failure is propagated directly. Never infer a successful import from tail/echo.
    subprocess.run([str(python),'-c','import server'],cwd=root,check=True)
    print(json.dumps({'python':str(python),'requirementsSha256':version,'status':'ready',
                      'next':'Use this interpreter for the native owned loopback preview and rendered-audit commands.'}))


if __name__=='__main__':main()
