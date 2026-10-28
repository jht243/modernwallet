// Saves the hydrated DOM of every manifest route (served by serve-and-run.cjs) to <outDir>/<path>/index.html.
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const [manifest, base, outDir] = process.argv.slice(2);
(async () => {
  const m = JSON.parse(fs.readFileSync(manifest, 'utf8')); const b = await chromium.launch();
  for (const r of m.routes) {
    const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
    await p.goto(base + r.path, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
    const html = '<!doctype html>\n' + (await p.evaluate(() => document.documentElement.outerHTML));
    const dir = path.join(outDir, r.path === '/' ? '' : r.path); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html); await p.close();
  }
  await b.close(); console.log('dom saved', m.routes.length);
})();
