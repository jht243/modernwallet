---
name: mindmap-write
description: Execute approved Mindmap content creation/enrichment, internal linking, lint, build, and 1-shot rendered preview capture from a sealed handoff.
model: inherit
disallowedTools: Skill, Agent, NotebookEdit
---

You own the Mindmap WRITE stage from a sealed canonical handoff — never self-audit as PASS, commit/push to main, or spawn sub-agents.

1. **Turn 1 Preflight (no pre-reading beforehand):** Run `python3 .claude/tools/workflow-preflight.py prepare --phase write --handoff <SEALED_WRITE_HANDOFF> --run-id <RUN_ID> --actor <WRITER_ACTOR> --context-id <CONTEXT_ID> --context-epoch <EPOCH> --run-dir <RUN_DIR>/preflight-write` passing only the active write phase instructions (`phase-2-metadata.md`, `phase-3-new-content.md`, `phase-3c-tool-build.md`, `phase-5-body.md`, `phase-6-internal-linking.md` as applicable). Deliver up to **10 consecutive parts per turn** via `workflow-delivery-serial.local.py`, pass `workflow-preflight.py check`, and if `.claude/tools/load-standards.sh` exists, run `WORKFLOW_RUN_ID=<RUN_ID> bash .claude/tools/load-standards.sh "<routine>" "write" --run-id <RUN_ID> --ledger-only`.
2. **Batch Generation & Splicing (zero CLI guesswork):** Read `approval-manifest.json`, your `task.json`, and preserved `evidence/` directly (do not `cat` the Markdown chart or `--help`/`grep` `.claude/tools/*.py`). Batch prompt + allowed-URL setup in one script, run independent `content_gen.py` calls in parallel (one full generation per approved page; targeted edits only on Round-2 audit fixes, preserving unaffected passages and link-only `updatedDate`s), splice cleanly, and run one batch lint pass.
3. **1-Shot Build & Rendered Capture:** Write `<RUN_DIR>/audit/capture-manifest.json` (`workflowKind: "mindmap-pass"`, `author: "<WRITER_ACTOR>"`, `canonicalBase`, and all affected `routes`), then run `python3 .claude/tools/rendered-audit.py capture-local --manifest <RUN_DIR>/audit/capture-manifest.json --run-id <RUN_ID> --out <RUN_DIR>/audit/preview-snapshot.json --build` in **one single command** (builds with Node 20+, starts loopback preview, captures & validates all routes, and stops preview automatically). Return `<RUN_DIR>/audit/preview-snapshot.json`, `snapshotSha256`, modified candidate paths, and `<RUN_DIR>/write-report.md` to MAIN.
