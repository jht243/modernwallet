"""Verify historical publication against current origin, including shallow cloud clones."""
import re
import subprocess
import sys


def git(*args, check=True):
    return subprocess.run(["git", *args], capture_output=True, text=True, check=check)


def published(commit):
    if not re.fullmatch("[0-9a-f]{40}", commit):
        raise ValueError("Use the complete original publication commit")
    remote = git("ls-remote", "--symref", "origin", "HEAD").stdout.splitlines()
    default = next(line.split()[1] for line in remote if line.startswith("ref: refs/heads/"))
    ref = "refs/workflow/search-gap-publication"
    git("fetch", "--quiet", "--no-tags", "--no-write-fetch-head", "origin", "+" + default + ":" + ref)
    if git("merge-base", "--is-ancestor", commit, ref, check=False).returncode:
        if git("rev-parse", "--is-shallow-repository").stdout.strip() == "true":
            git("fetch", "--quiet", "--unshallow", "--no-tags", "--no-write-fetch-head", "origin", "+" + default + ":" + ref)
        if git("merge-base", "--is-ancestor", commit, ref, check=False).returncode:
            raise ValueError("Original publication commit is outside the current default branch history")
    return git("rev-parse", ref).stdout.strip()


if __name__ == "__main__":
    print(published(sys.argv[1]))
