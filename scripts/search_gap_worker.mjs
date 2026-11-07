import { spawnSync } from 'node:child_process';
const site = process.env.SEARCH_SITE || "themodernwallet.com";
const r = spawnSync('python3', ['scripts/search_gap/job_worker.py', ...process.argv.slice(2), '--site', site], {stdio:'inherit'});
if(r.error) console.error('Search-gap worker could not start');
process.exitCode = r.error ? 1 : (r.status ?? 1);
