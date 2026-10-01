// Renders each artboard to a 1080x1350 PNG. Needs: npm i playwright-core
import { chromium } from 'playwright-core';
const files = ['Main', 'Fayda1', 'Fayda2', 'Fayda3'];
const names = { Main: 'slayt-1-kapak', Fayda1: 'slayt-2-fayda-1', Fayda2: 'slayt-3-fayda-2', Fayda3: 'slayt-4-fayda-3' };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
for (const f of files) {
  await page.goto('file://' + process.cwd() + '/' + f + '.dc.html');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  await page.screenshot({ path: names[f] + '.png' });
  console.log('shot', f);
}
await browser.close();
