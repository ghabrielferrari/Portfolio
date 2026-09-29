import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('script.js', root), 'utf8');

function run({ entry = true, stored = null, browserLanguage = 'en-US', blocked = false, hash = '' } = {}) {
  const redirects = [];
  const storage = new Map(stored === null ? [] : [['portfolio.language', stored]]);
  const links = ['pt', 'en'].map((language) => ({
    dataset: { language },
    href: `https://example.test/Portfolio/${language}/`,
    addEventListener(name, handler) { assert.equal(name, 'click'); this.click = handler; },
  }));
  const context = {
    URL,
    document: { querySelectorAll: () => links, body: { hasAttribute: () => entry } },
    navigator: { languages: [browserLanguage], language: browserLanguage },
    location: { href: `https://example.test/Portfolio/${entry ? '' : 'pt/'}${hash}`, hash, replace: (url) => redirects.push(url) },
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Storage disabled'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Storage disabled'); storage.set(key, value); },
    },
  };
  vm.runInNewContext(source, context);
  return { redirects, storage, links };
}

assert.deepEqual(run({ browserLanguage: 'pt-BR' }).redirects, ['https://example.test/Portfolio/pt/']);
assert.deepEqual(run({ browserLanguage: 'pt-PT' }).redirects, ['https://example.test/Portfolio/pt/']);
assert.deepEqual(run({ browserLanguage: 'fr-FR' }).redirects, ['https://example.test/Portfolio/en/']);
assert.deepEqual(run({ stored: 'en', browserLanguage: 'pt-BR' }).redirects, ['https://example.test/Portfolio/en/']);
assert.deepEqual(run({ stored: 'pt', browserLanguage: 'en-US' }).redirects, ['https://example.test/Portfolio/pt/']);
assert.deepEqual(run({ stored: 'invalid', browserLanguage: 'pt' }).redirects, ['https://example.test/Portfolio/pt/']);
assert.deepEqual(run({ blocked: true, browserLanguage: 'pt-BR', hash: '#work' }).redirects, ['https://example.test/Portfolio/pt/#work']);
const localized = run({ entry: false, stored: 'en', hash: '#technical' });
assert.equal(localized.redirects.length, 0, 'Explicit locale must not redirect');
assert.equal(localized.storage.get('portfolio.language'), 'en', 'Visiting a locale must not overwrite a manual preference');
localized.links[0].click();
assert.equal(localized.storage.get('portfolio.language'), 'pt');
assert.equal(localized.links[0].href, 'https://example.test/Portfolio/pt/#technical');
const privateMode = run({ entry: false, blocked: true });
assert.doesNotThrow(() => privateMode.links[1].click());
assert.equal(privateMode.links[1].href, 'https://example.test/Portfolio/en/');

for (const route of ['', 'pt/', 'en/']) {
  const pageUrl = new URL(`${route}index.html`, root);
  const html = readFileSync(pageUrl, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one main heading`);
  assert.ok(html.includes('hreflang="pt-BR"') && html.includes('hreflang="en"') && html.includes('hreflang="x-default"'));
  for (const match of html.matchAll(/<(a|img|script|link)\b[^>]*\b(?:href|src)="([^"]+)"[^>]*>/g)) {
    const [, tag, href] = match;
    if (/^(https?:|mailto:)/.test(href)) continue;
    const target = new URL(href, pageUrl);
    if (href.startsWith('#')) assert.ok(ids.includes(target.hash.slice(1)), `${route}: unknown anchor ${href}`);
    let path = fileURLToPath(target);
    if (path.endsWith('/')) path += 'index.html';
    assert.ok(existsSync(path), `${route}: missing ${tag} target ${href}`);
  }
  if (route) {
    const sectionIds = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(sectionIds, ['hero', 'work', 'technical', 'about', 'education', 'contact']);
    assert.match(html, /<img[^>]*\balt="Gabriel Ferrari"/);
    assert.ok(!/href="[^"]*(?:cases|case-study)/.test(html), 'No unfinished case links');
    if (route === 'en/') assert.ok(!html.includes('download='), 'English home must not suggest an English CV');
  }
}
const entryHtml = readFileSync(new URL('index.html', root), 'utf8');
assert.match(entryHtml, /<a[^>]*href="pt\/"[^>]*>Português<\/a>/);
assert.match(entryHtml, /<a[^>]*href="en\/"[^>]*>English<\/a>/);
assert.ok(!entryHtml.includes('display:none'), 'Language choices remain visible without JavaScript');
const cv = readFileSync(new URL('assets/documents/gabriel-ferrari-cv-pt.pdf', root));
assert.equal(cv.subarray(0, 5).toString(), '%PDF-');
const font = readFileSync(new URL('assets/fonts/source-sans-3-latin.woff2', root));
assert.equal(font.subarray(0, 4).toString(), 'wOF2');
console.log('Passed: locale routing, manual preference, blocked storage, no redirect loops, section order, static fallback, local links, font and CV.');
