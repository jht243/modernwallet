#!/usr/bin/env python3
"""Submit live URLs to IndexNow from a routine (cloud or local). Fleet-shared.

    python3 .claude/scripts/indexnow-submit.py --urls-file reports/<pass>/<date>.indexnow.txt
    python3 .claude/scripts/indexnow-submit.py https://www.example.com/a/ https://www.example.com/b/

Every routine that pings IndexNow should call this script instead of hand-rolling
a curl. It exists because two things kept losing the ping:

1. Wrong endpoint. `api.indexnow.com` does not exist (NXDOMAIN on public DNS).
   Inside a cloud sandbox that shows up as "denied by egress policy" or
   "sandbox blocks api.indexnow.com". The real endpoints are api.indexnow.org,
   www.bing.com/indexnow and yandex.com/indexnow.
2. Wrong key. Bing pins the key it first verified for a host, so a site that
   serves the fleet key file can still get 403 UserForbiddedToAccessSite.
   PINNED_KEYS below holds the key Bing accepts for those hosts.

Order of attempts:
- endpoints api.indexnow.org -> www.bing.com -> yandex.com, and per endpoint every
  candidate key (pinned key for the host, then --key / $INDEXNOW_KEY, then the
  fleet key) until one returns 200/202.
- If the session's network cannot reach an endpoint (connection error, DNS
  failure, or a proxy 403 carrying `x-deny-reason`), it moves on. If every
  direct endpoint is unreachable it posts the same list to the fleet relay
  (layer3labs-web /api/indexnow-relay), which runs the same loop server-side.

Stdlib only. Never raises. Exit 0 = accepted, 2 = not accepted, 1 = bad input.
Prints one summary line starting with `INDEXNOW` for the run report.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

FLEET_KEY = "dc557f6bfced447aa1a71771d8a0d24a"

# Hosts where Bing accepts a different key than the fleet key. Each of these
# hosts also serves the fleet key file, but Bing answers 403 for it.
# Keep in sync with src/lib/indexnowFleet.ts in jht243/layer3labs.
PINNED_KEYS = {
    "mindmedicinelaw.com": "0b2fff2a4cb56ba2c10382745f51cdd8",
    "themetabolicjournal.com": "4cc1bd5a92d14002ba49f4f01765fd34",
}

ENDPOINTS = (
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
)
DEFAULT_RELAY = "https://layer3labs-web.onrender.com/api/indexnow-relay"
SECRET_KEYS = ("ROUTINE_INGEST_SECRET", "NURTURE_CRON_SECRET")
HEX32 = re.compile(r"^[0-9a-fA-F]{32}$")
MAX_URLS = 10_000
UA = "layer3-routines-indexnow/1.0 (+https://www.layer3labs.io)"


def load_env_file_values() -> dict[str, str]:
    """Optional bearer for the relay, same lookup as send-routine-email.py."""
    out: dict[str, str] = {}
    for path in (Path.cwd() / ".claude" / "secrets.env", Path.home() / ".claude" / "secrets.env"):
        try:
            for line in path.read_text().splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                out.setdefault(k.strip().removeprefix("export ").strip(), v.strip().strip("'\""))
        except OSError:
            continue
    for k in SECRET_KEYS + ("INDEXNOW_KEY", "INDEXNOW_RELAY_URL"):
        if os.environ.get(k):
            out[k] = os.environ[k]
    return out


def repo_override() -> dict:
    """Optional per-repo `.claude/indexnow.json` = {"host": ..., "key": ...}."""
    try:
        data = json.loads((Path.cwd() / ".claude" / "indexnow.json").read_text())
        return data if isinstance(data, dict) else {}
    except (OSError, ValueError):
        return {}


def post(url: str, payload: dict, headers: dict | None = None, timeout: int = 30):
    """Returns (status or None, body snippet, blocked: bool)."""
    body = json.dumps(payload).encode()
    h = {"Content-Type": "application/json; charset=utf-8", "User-Agent": UA}
    h.update(headers or {})
    req = urllib.request.Request(url, data=body, headers=h, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read(4000).decode("utf-8", "replace"), False
    except urllib.error.HTTPError as e:
        snippet = ""
        try:
            snippet = e.read(4000).decode("utf-8", "replace")
        except Exception:
            pass
        # The cloud sandbox proxy answers a disallowed host with 403 + x-deny-reason.
        blocked = bool(e.headers and e.headers.get("x-deny-reason")) or e.code in (407, 502, 503, 504)
        return e.code, snippet, blocked
    except Exception as e:  # DNS failure, refused, proxy CONNECT refused, timeout
        return None, f"{type(e).__name__}: {e}"[:200], True


def key_rejected(status, snippet: str) -> bool:
    """IndexNow's own 403/422: the key is not accepted for this host."""
    return status in (403, 422)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("urls", nargs="*", help="URLs to submit (all on one host)")
    ap.add_argument("--urls-file", help="file with one URL per line")
    ap.add_argument("--key", help="IndexNow key to try (after the host's pinned key)")
    ap.add_argument("--host", help="override the host (default: host of the first URL)")
    ap.add_argument("--relay-only", action="store_true", help="skip direct endpoints (testing)")
    args = ap.parse_args()

    urls = list(args.urls)
    if args.urls_file:
        try:
            urls += [l.strip() for l in Path(args.urls_file).read_text().splitlines()]
        except OSError as e:
            print(f"INDEXNOW FAIL cannot read {args.urls_file}: {e}")
            return 1
    urls = list(dict.fromkeys(u for u in urls if u.startswith(("http://", "https://"))))
    if not urls:
        print("INDEXNOW SKIP no URLs")
        return 0

    env = load_env_file_values()
    override = repo_override()
    host = (args.host or urlparse(urls[0]).hostname or "").lower()
    off_host = [u for u in urls if (urlparse(u).hostname or "").lower() != host]
    urls = [u for u in urls if (urlparse(u).hostname or "").lower() == host][:MAX_URLS]
    if off_host:
        print(f"[indexnow] dropped {len(off_host)} URL(s) not on {host}", file=sys.stderr)

    keys: list[str] = []
    for k in (
        override.get("key") if (override.get("host") or host).lower() == host else None,
        PINNED_KEYS.get(host.removeprefix("www.")),
        args.key,
        env.get("INDEXNOW_KEY"),
        FLEET_KEY,
    ):
        if k and HEX32.match(k) and k not in keys:
            keys.append(k)

    attempts: list[str] = []
    any_reachable = False
    if not args.relay_only:
        for ep in ENDPOINTS:
            ep_host = urlparse(ep).hostname
            for key in keys:
                payload = {"host": host, "key": key, "keyLocation": f"https://{host}/{key}.txt", "urlList": urls}
                status, snippet, blocked = post(ep, payload)
                attempts.append(f"{ep_host}/{key[:4]}={status or 'unreachable'}")
                if blocked:
                    break  # this endpoint is not reachable from here; next endpoint
                any_reachable = True
                if status in (200, 202):
                    print(f"INDEXNOW OK {status} via {ep_host} key={key[:4]}… host={host} urls={len(urls)}")
                    return 0
                if key_rejected(status, snippet):
                    continue  # try the next key on the same endpoint
                break  # 400 / 429 / other: next endpoint

    # Relay: used when no direct endpoint was reachable (or every attempt failed).
    relay = (env.get("INDEXNOW_RELAY_URL") or DEFAULT_RELAY).strip()
    headers = {}
    token = next((env[k] for k in SECRET_KEYS if env.get(k)), "")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    status, snippet, blocked = post(relay, {"host": host, "key": keys[0], "urlList": urls}, headers, timeout=60)
    attempts.append(f"relay={status or 'unreachable'}")
    if status == 200:
        try:
            data = json.loads(snippet)
        except ValueError:
            data = {}
        up = data.get("upstreamStatus", "?")
        if data.get("ok"):
            print(f"INDEXNOW OK {up} via relay ({data.get('endpoint', '?')}) host={host} urls={len(urls)}")
            return 0
    why = "network blocked every endpoint" if not any_reachable else "rejected"
    print(f"INDEXNOW FAIL ({why}) host={host} urls={len(urls)} attempts: {', '.join(attempts)} relay_body={snippet[:160]!r}")
    return 2


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:  # never break a routine over a ping
        print(f"INDEXNOW FAIL unexpected {type(e).__name__}: {e}")
        sys.exit(2)
