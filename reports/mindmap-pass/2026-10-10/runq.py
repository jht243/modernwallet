"""Run gen.sh jobs with bounded concurrency and a wall-clock watchdog (stalled streams keep
the per-read timeout alive with pings). One retry per page on watchdog kill."""
import subprocess, sys, time
JOBS = [l.split() for l in open(sys.argv[1]) if l.strip()]
CONC, WALL = int(sys.argv[2]), int(sys.argv[3])
pending = [(j, 0) for j in JOBS]; running = []
while pending or running:
    while pending and len(running) < CONC:
        j, tries = pending.pop(0)
        p = subprocess.Popen(["./gen.sh"] + j, start_new_session=True)
        running.append((p, j, tries, time.time())); print(time.strftime("%H:%M:%S"), "START", j[0], "try", tries + 1, flush=True)
        time.sleep(5)
    time.sleep(10)
    for item in running[:]:
        p, j, tries, t0 = item
        if p.poll() is not None:
            running.remove(item); print(time.strftime("%H:%M:%S"), "END", j[0], "rc", p.returncode, f"{(time.time()-t0)/60:.1f}m", flush=True)
        elif time.time() - t0 > WALL:
            import os, signal
            os.killpg(p.pid, signal.SIGTERM); running.remove(item)
            print(time.strftime("%H:%M:%S"), "WATCHDOG KILL", j[0], flush=True)
            if tries < 2: pending.append((j, tries + 1))
