import { test, expect } from '@playwright/test';

for (const locale of ['pt', 'en']) {
  test(`${locale}: content, localized URLs, links and assets`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/Portfolio/${locale}/`);
    await expect(page.locator('h1')).toHaveText(locale === 'pt' ? 'Software Engineer com foco em iOS.' : 'Software Engineer focused on iOS.');
    expect(await page.locator('main > section').evaluateAll(elements => elements.map(e => e.id))).toEqual(['hero','work','technical','about','education','contact']);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://ghabrielferrari.github.io/Portfolio/${locale}/`);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://ghabrielferrari.github.io/Portfolio/');
    const urls = await page.locator('a[href]').evaluateAll(links => links.map(a => (a as HTMLAnchorElement).href));
    for (const url of urls) {
      const target = new URL(url);
      if (target.origin !== 'http://127.0.0.1:4321') continue;
      expect(target.pathname.startsWith('/Portfolio/')).toBeTruthy();
      if (target.hash) await expect(page.locator(target.hash)).toHaveCount(1);
      expect((await request.get(url)).status(), url).toBe(200);
    }
    for (const project of ['fintech','jordania']) {
      await expect(page.locator(`#${project} .project-links a[href$="-ios"]`)).toHaveCount(1);
    }
    await expect(page.locator('#fintech a[href$="fintech-api"]')).toHaveCount(1);
    await expect(page.locator('#jordania a[href$="jordania-backend"]')).toHaveCount(1);
    if (locale === 'pt') {
      const response = await request.get('/Portfolio/assets/documents/gabriel-ferrari-cv-pt.pdf');
      expect(response.headers()['content-type']).toContain('application/pdf');
      expect((await response.body()).subarray(0,4).toString()).toBe('%PDF');
      await expect(page.getByRole('link', { name: 'Baixar CV' })).toHaveAttribute('download', 'Gabriel-Ferrari-CV-PT.pdf');
    } else await expect(page.locator('a[download]')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  test(`${locale}: all viewport widths, themes, and reflow`, async ({ page }) => {
    await page.goto(`/Portfolio/${locale}/`);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ['light','dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      for (const width of [320,390,430,768,1024,1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale}, ${theme}, ${width}`).toBeTruthy();
        await expect(page.locator('#hero-heading')).toBeVisible();
      }
      expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(theme === 'light' ? 'rgb(244, 246, 245)' : 'rgb(17, 24, 32)');
    }
    // A 1440px desktop at 200% browser zoom has a 720px CSS layout viewport.
    await page.setViewportSize({ width: 720, height: 450 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await expect(page.locator('header nav.main-nav')).toBeVisible();
    await page.setViewportSize({ width:390,height:844 });
    const screens = await page.locator('#carely .screens figure').evaluateAll(elements => elements.map(e => e.getBoundingClientRect().toJSON()));
    expect(screens).toHaveLength(3);
    expect(screens[0]!.width).toBeLessThanOrEqual(300);
    expect(screens[1]!.y).toBeGreaterThan(screens[0]!.bottom);
    expect(screens[2]!.y).toBeGreaterThan(screens[1]!.bottom);
    expect(screens[1]!.width / screens[0]!.width).toBeCloseTo(.86, 1);
    expect(screens[2]!.width / screens[0]!.width).toBeCloseTo(.92, 1);
  });
}

test('contrast, local fonts, dimensions, and narrow-screen controls', async ({ page }) => {
  await page.goto('/Portfolio/pt/');
  await page.evaluate(() => document.fonts.ready);
  for (const colorScheme of ['light','dark'] as const) {
    await page.emulateMedia({ colorScheme });
    const ratios = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      function luminance(hex: string) {
        const channels = hex.trim().slice(1).match(/.{2}/g)!.map(channel => parseInt(channel,16)/255).map(channel => channel <= .04045 ? channel/12.92 : ((channel+.055)/1.055)**2.4);
        return channels[0]!*.2126 + channels[1]!*.7152 + channels[2]!*.0722;
      }
      const bg = luminance(style.getPropertyValue('--bg'));
      return ['--text','--secondary','--interaction'].map(token => {
        const foreground = luminance(style.getPropertyValue(token));
        return (Math.max(bg,foreground)+.05)/(Math.min(bg,foreground)+.05);
      });
    });
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
  expect(await page.evaluate(() => document.fonts.check('18px "Source Sans 3"') && document.fonts.check('600 56px "Bricolage Grotesque"'))).toBeTruthy();
  expect(await page.locator('img[src]').evaluateAll(images => images.every(image => image.hasAttribute('width') && image.hasAttribute('height')))).toBeTruthy();
  await page.setViewportSize({width:320,height:700});
  for (const selector of ['header a','.actions a','.scenario-controls label']) {
    for (const box of await page.locator(selector).evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height))) expect(box).toBeGreaterThanOrEqual(44);
  }
  await page.locator('#carely summary').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.locator('[data-enlarge]').first().click();
  expect(await page.locator('dialog').evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
  await page.keyboard.press('Escape');
});

test('language entry respects manual preference, browser fallback, and explicit routes', async ({ page }) => {
  await page.goto('/Portfolio/pt/');
  await page.evaluate(() => localStorage.setItem('portfolio.language','pt'));
  await page.goto('/Portfolio/');
  await expect(page).toHaveURL(/\/Portfolio\/pt\/$/);
  await page.goto('/Portfolio/en/');
  await expect(page).toHaveURL(/\/Portfolio\/en\/$/);
  await page.getByRole('link',{name:'Work',exact:true}).click();
  await page.locator('[data-language="pt"]').click();
  await expect(page).toHaveURL(/\/Portfolio\/pt\/#work$/);
  expect(await page.evaluate(() => localStorage.getItem('portfolio.language'))).toBe('pt');
  await page.reload();
  await expect(page.locator('h1')).toContainText('com foco em iOS');
});

test('unavailable storage cannot break entry or locale switching', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window,'localStorage',{get(){throw new Error('storage unavailable');}}));
  await page.goto('/Portfolio/');
  await expect(page).toHaveURL(/\/Portfolio\/en\/$/);
  await page.locator('[data-language="pt"]').click();
  await expect(page).toHaveURL(/\/Portfolio\/pt\/$/);
});

test('no JavaScript: language selector, screenshots, expansion and all scenarios are usable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/Portfolio/');
  await expect(page.getByRole('link',{name:'Português'})).toBeVisible();
  await page.getByRole('link',{name:'Português'}).click();
  await expect(page.locator('#carely .screens figure')).toHaveCount(3);
  await page.locator('#carely summary').click();
  await expect(page.locator('#carely .institutions')).toBeVisible();
  await expect(page.locator('[data-scenario]:visible')).toHaveCount(3);
  await page.locator('[data-enlarge]').first().click();
  await expect(page).toHaveURL(/\/_astro\/.*\.jpg$/);
  await context.close();
});

test('Carely keyboard expansion, modal Escape, focus restoration and focus trap', async ({ page, browserName }) => {
  await page.goto('/Portfolio/pt/');
  // macOS WebKit uses Option+Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  expect(await page.locator('.skip-link').evaluate(e => getComputedStyle(e).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const trigger = page.locator('[data-enlarge]').first();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog',{name:'Busca por vagas'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Fechar imagem'})).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.querySelector('dialog')?.contains(document.activeElement))).toBeTruthy();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.locator('#carely summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#carely .institutions')).toBeVisible();
  await page.locator('#carely .institutions [data-enlarge]').first().click();
  await expect(page.getByRole('dialog',{name:'Busca por instituições'})).toBeVisible();
  await page.getByRole('button',{name:'Fechar imagem'}).click();
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:844});
    await trigger.click();
    const bounds = await page.locator('dialog').evaluate(dialog => {
      dialog.scrollTop = dialog.scrollHeight;
      return { dialog: dialog.getBoundingClientRect().toJSON(), close: dialog.querySelector('button')!.getBoundingClientRect().toJSON() };
    });
    expect(bounds.close.top).toBeGreaterThanOrEqual(bounds.dialog.top);
    expect(bounds.close.bottom).toBeLessThanOrEqual(bounds.dialog.bottom);
    await page.getByRole('button',{name:'Fechar imagem'}).click();
    await expect(trigger).toBeFocused();
  }
});

test('Fintech scenarios respond immediately, keyboard selects, animation cancels, reduced motion is final', async ({ page }) => {
  await page.goto('/Portfolio/pt/');
  const controls = page.locator('input[name="scenario"]');
  await controls.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(controls.nth(1)).toBeChecked();
  await expect(page.locator('#scenario-1')).toBeVisible();
  await expect(page.locator('[data-unit="3"]')).toHaveAttribute('data-active','false');
  await expect(page.locator('[data-unit="3"] [data-stage-status]')).toHaveText('Fora deste percurso');
  await expect(page.locator('[data-connector="2"]')).toHaveAttribute('data-active','false');
  await expect(page.locator('[data-connector="0"] .connector-arrow')).toHaveText('↔');
  await controls.nth(2).check();
  await expect(page.locator('#scenario-2')).toContainText('mesma chave');
  await expect(page.locator('[data-connector="2"]')).toHaveAttribute('data-active','true');
  await expect(page.locator('[data-connector="0"] .connector-arrow')).toHaveText('→');
  await controls.nth(0).check();
  await expect(page.locator('#scenario-0')).toBeVisible();
  await expect(page.locator('[data-scenario]:visible')).toHaveCount(1);
  expect(await page.locator('[data-flow]').evaluate(e => e.getAnimations({subtree:true}).filter(a => a.playState === 'running' && a.constructor.name === 'Animation').length)).toBeLessThanOrEqual(8);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await controls.nth(2).check();
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
  expect(await page.locator('#hero-heading').evaluate(e => getComputedStyle(e).opacity)).toBe('1');
});

// Guard the interruption contract, including a media-preference change mid-progression.
test('rapid scenario changes leave only the final path, with bounded motion', async ({ page }) => {
  await page.goto('/Portfolio/en/');
  await page.locator('[data-flow]').scrollIntoViewIfNeeded();
  const state = await page.evaluate(() => {
    const radios = [...document.querySelectorAll<HTMLInputElement>('input[name="scenario"]')];
    const previous: Animation[] = [];
    for (const index of [1,2,1,0,2]) {
      const flow = document.querySelector('[data-flow]')!;
      previous.push(...flow.getAnimations({subtree:true}));
      radios[index]!.checked = true;
      radios[index]!.dispatchEvent(new Event('change'));
    }
    const current = document.querySelector('[data-flow]')!.getAnimations({subtree:true});
    return {oldCancelled: previous.every(animation => animation.playState === 'idle'), durations: current.map(animation => { const timing = animation.effect!.getTiming(); return Number(timing.duration) + Number(timing.delay); })};
  });
  expect(state.oldCancelled).toBeTruthy();
  expect(Math.max(...state.durations)).toBeLessThanOrEqual(600);
  await expect(page.locator('[data-flow]')).toHaveAttribute('data-selected-scenario','2');
  await expect(page.locator('[data-scenario]:visible')).toHaveCount(1);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(() => page.locator('[data-flow]').evaluate(flow => flow.getAnimations({subtree:true}).length)).toBe(0);
  expect(await page.locator('.connector-progress').evaluateAll(connectors => connectors.every(connector => getComputedStyle(connector).transform === 'matrix(1, 0, 0, 1, 0, 0)'))).toBeTruthy();
});
