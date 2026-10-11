#!/usr/bin/env node
/* Verify the fleet tool-usage tracker on real pages.
 *
 *   node scripts/tool_usage/verify_beacons.cjs <baseUrl> <path> [<path> ...]
 *
 * For each path: loads the page in headless Chrome, intercepts beacons to
 * growth-sites-api /api/tool-use (answered locally with 204 — nothing is
 * written to the DB), clicks a non-control spot in the tool (must NOT count),
 * then interacts with the first input/select/textarea/button inside
 * [data-tool]. PASS = exactly one `view` and exactly one `use`.
 *
 * Needs playwright-core + system Chrome (no browser download):
 *   PW_CORE (default: OpenAI/is_it_safe_travel/node_modules/playwright-core)
 *   CHROME  (default: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome)
 */
const PW_CORE = process.env.PW_CORE || '/Users/jonathanteplitsky/Desktop/Github Projects/OpenAI/is_it_safe_travel/node_modules/playwright-core';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const { chromium } = require(PW_CORE);

const [base, ...paths] = process.argv.slice(2);
if (!base || !paths.length) { console.error('usage: verify_beacons.cjs <baseUrl> <path> [...]'); process.exit(2); }

(async () => {
  // Cloud runs have no system Chrome: fall back to Playwright's own Chromium.
  const browser = await chromium.launch({ headless: true, executablePath: require('fs').existsSync(CHROME) ? CHROME : undefined });
  let failed = 0;
  for (const path of paths) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const beacons = [];
    await page.route('**/api/tool-use', (route) => {
      try { beacons.push(JSON.parse(route.request().postData() || '{}')); } catch { beacons.push({ bad: true }); }
      return route.fulfill({ status: 204, body: '' });
    });
    let note = '';
    try {
      await page.goto(base.replace(/\/$/, '') + path, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(1500);
      const root = page.locator('[data-tool]').first();
      if (!(await root.count())) { note = 'NO [data-tool] on page'; }
      else {
        // a click on the root's own box (not a control) must not count as a use
        await root.evaluate((el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
        await page.waitForTimeout(300);
        const usesBefore = beacons.filter((b) => b.event === 'use').length;
        if (usesBefore) note = 'non-control click counted as use; ';
        const ctl = root.locator('input:not([type=hidden]):visible, select:visible, textarea:visible, button:visible, [role=button]:visible').first();
        if (await ctl.count()) {
          const tag = await ctl.evaluate((el) => el.tagName.toLowerCase() + (el.type ? ':' + el.type : ''));
          if (/^input:(text|number|search|email|tel|url|)$|^textarea/.test(tag) || tag === 'input') { await ctl.click({ timeout: 5000 }).catch(() => {}); await ctl.type('5').catch(() => {}); }
          else if (tag.startsWith('select')) { await ctl.selectOption({ index: 1 }).catch(() => ctl.click()); }
          else await ctl.click({ timeout: 5000 }).catch(() => {});
          note += `interacted with ${tag}`;
        } else if (await root.evaluate((el) => el.hasAttribute('data-tool-any-click'))) {
          await root.click({ position: { x: 10, y: 10 } }).catch(() => {});
          note += 'clicked any-click root';
        } else note += 'no visible control in [data-tool]';
        // second interaction must not send another use
        await page.waitForTimeout(800);
        await page.mouse.wheel(0, 200);
      }
    } catch (e) { note += ' ERROR ' + e.message.split('\n')[0]; }
    const views = beacons.filter((b) => b.event === 'view');
    const uses = beacons.filter((b) => b.event === 'use');
    const ok = views.length === 1 && uses.length === 1 && !beacons.some((b) => b.bad);
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${path}  view=${views.length} use=${uses.length}  tool=${(uses[0] || views[0] || {}).tool || '-'}  (${note})`);
    await ctx.close();
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
