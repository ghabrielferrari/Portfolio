import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { writeFile } from 'node:fs/promises';

const [url = 'http://127.0.0.1:4321/Portfolio/pt/', name = 'current'] = process.argv.slice(2);
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-first-run'] });
try {
  const result = await lighthouse(url, { port: chrome.port, output: ['json', 'html'], logLevel: 'error' }, {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
    },
  });
  if (!result) throw new Error('Lighthouse returned no report');
  await writeFile(`review/lighthouse/${name}.json`, result.report[0]);
  await writeFile(`review/lighthouse/${name}.html`, result.report[1]);
  const { audits, categories } = result.lhr;
  console.log(JSON.stringify({ name, LCP: audits['largest-contentful-paint'].numericValue, CLS: audits['cumulative-layout-shift'].numericValue, TBT: audits['total-blocking-time'].numericValue, scores: Object.fromEntries(Object.entries(categories).map(([key, value]) => [key, value.score])), failures: Object.entries(audits).filter(([,a]) => a.score !== null && a.score < 1 && a.details?.type === 'table').map(([id,a])=>({id,title:a.title,items:a.details.items})) }, null, 2));
} finally { await Promise.resolve(chrome.kill()); }
