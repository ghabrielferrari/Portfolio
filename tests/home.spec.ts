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
        const textOverflow = await page.locator('main h1,main h2,main h3,main h4,main p,figcaption').evaluateAll(elements => elements.filter(element => element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1).map(element => element.textContent));
        expect(textOverflow, `${locale}, ${theme}, ${width}: text overflow`).toEqual([]);
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
        const value = hex.trim().slice(1);
        const normalized = value.length === 3 ? [...value].map(character => character + character).join('') : value;
        const channels = normalized.match(/.{2}/g)!.map(channel => parseInt(channel,16)/255).map(channel => channel <= .04045 ? channel/12.92 : ((channel+.055)/1.055)**2.4);
        return channels[0]!*.2126 + channels[1]!*.7152 + channels[2]!*.0722;
      }
      return ['--bg','--surface','--wash','--carely-surface','--carely-wash'].flatMap(background => ['--text','--secondary','--interaction'].map(token => {
        const bg = luminance(style.getPropertyValue(background));
        const foreground = luminance(style.getPropertyValue(token));
        return (Math.max(bg,foreground)+.05)/(Math.min(bg,foreground)+.05);
      }));
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
  await expect(page.locator('[data-scenario]')).toHaveCount(3);
  for (const index of [0,1,2]) {
    await page.locator('input[name="scenario"]').nth(index).check();
    await expect(page.locator(`#scenario-${index}`)).toBeVisible();
    await expect(page.locator('[data-scenario]:visible')).toHaveCount(1);
  }
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
  await page.locator('[data-controls]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-flow]')).toHaveAttribute('data-enhanced','true');
  const controls = page.locator('input[name="scenario"]');
  await controls.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(controls.nth(1)).toBeChecked();
  await expect(page.locator('#scenario-1')).toBeVisible();
  await expect(page.locator('[data-unit="1"] [data-operation]')).toHaveText('Refresh coordenado');
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
  expect(await page.locator('[data-flow]').evaluate(e => e.getAnimations({subtree:true}).filter(a => a.playState === 'running' && a.constructor.name === 'Animation').length)).toBeLessThanOrEqual(9);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await controls.nth(2).check();
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
  expect(await page.locator('#hero-heading').evaluate(e => getComputedStyle(e).opacity)).toBe('1');
});

// Guard the interruption contract, including a media-preference change mid-progression.
test('rapid scenario changes keep the latest path and reduce immediately', async ({ page }) => {
  await page.goto('/Portfolio/en/');
  await page.locator('[data-controls]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-flow]')).toHaveAttribute('data-enhanced','true');
  const radios=page.locator('input[name="scenario"]');
  for (const index of [1,2,1,0,2]) {
    await radios.nth(index).check();
    await expect(page.locator('[data-flow]')).toHaveAttribute('data-selected-scenario',String(index));
    await expect(page.locator(`#scenario-${index}`)).toBeVisible();
  }
  await expect(page.locator('[data-scenario]:visible')).toHaveCount(1);
  await expect(page.locator('[data-unit="3"] [data-operation]')).toHaveText('Same key, one transaction');
  await radios.nth(2).focus();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>page.locator('.connector-progress:visible').evaluateAll(paths=>paths.every(path=>parseFloat(getComputedStyle(path).strokeDasharray)===1))).toBeTruthy();
  await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(animation=>animation.playState==='running').length)).toBe(0);
  const final=await page.locator('[data-flow]').evaluate(flow=>({state:flow.getAttribute('data-selected-scenario'),paths:[...flow.querySelectorAll('.connector-progress')].map(path=>getComputedStyle(path).strokeDasharray)}));
  await page.waitForTimeout(650);
  expect(await page.locator('[data-flow]').evaluate(flow=>({state:flow.getAttribute('data-selected-scenario'),paths:[...flow.querySelectorAll('.connector-progress')].map(path=>getComputedStyle(path).strokeDasharray)}))).toEqual(final);
  await expect(radios.nth(2)).toBeFocused();
});

test('editorial motion is finite, plays once, and reduces to visible content', async ({ page }) => {
  await page.goto('/Portfolio/pt/');
  for (const selector of ['#carely .screen-0','#technical .ios','#about .statement','#contact h2']) {
    const element = page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await expect(element).toHaveClass(/is-entering/);
    const timing = await element.evaluate(element => element.getAnimations().map(animation => animation.effect!.getTiming()));
    expect(timing.every(item => item.iterations === 1 && Number(item.duration) <= 800)).toBeTruthy();
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  for (const selector of ['#carely .screen-0','#technical .ios','#about .statement','#contact h2']) {
    expect(await page.locator(selector).evaluate(element => ({opacity:getComputedStyle(element).opacity,transform:getComputedStyle(element).transform,clip:getComputedStyle(element).clipPath}))).toEqual({opacity:'1',transform:'none',clip:'none'});
  }
  // Returning to an observed section must not replay an entrance.
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('#carely .screen-0').scrollIntoViewIfNeeded();
  expect(await page.locator('#carely .screen-0').evaluate(element => element.getAnimations().length)).toBe(0);
});

test('Fintech selector follows the selected control after responsive reflow', async ({page}) => {
  await page.goto('/Portfolio/en/');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-controls]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-flow]')).toHaveAttribute('data-enhanced','true');
  for (const width of [1440,390,768,320]) {
    await page.setViewportSize({width,height:844});
    await page.locator('input[name="scenario"]').nth(2).check();
    await expect.poll(() => page.locator('[data-selection]').evaluate(indicator => {
      const selected=document.querySelector('input[name="scenario"]:checked')!.closest('label')!;
      const a=indicator.getBoundingClientRect(), b=selected.getBoundingClientRect();
      return Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y),Math.abs(a.width-b.width),Math.abs(a.height-b.height));
    })).toBeLessThan(1);
    await expect(page.locator('[data-unit="3"] [data-operation]')).toHaveText('Same key, one transaction');
  }
});


test('Carely reveal waits for evidence rather than empty layout spacing', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/Portfolio/pt/');
  await page.evaluate(() => document.fonts.ready);
  const screen=page.locator('#carely .screen-2');
  const top=await screen.evaluate(element => element.getBoundingClientRect().top+scrollY);
  // This reproduces the old trigger point, with only the former 240px spacer visible.
  await page.evaluate(top => scrollTo({top:top-innerHeight-60,behavior:'instant'}),top);
  await expect(screen).not.toHaveClass(/is-entering/);
  expect(await screen.locator('figcaption').evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThan(900);
  await page.evaluate(top => scrollTo({top:top-innerHeight+180,behavior:'instant'}),top);
  await expect(screen).toHaveClass(/is-entering/);
  expect(await screen.locator('figcaption').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(900);
});

test('Carely mobile keyboard follows the visual reading order without backward jumps', async ({page,browserName})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/Portfolio/pt/');
  const sequence=await page.locator('#carely a').evaluateAll(links=>links.map(link=>link.getAttribute('aria-label')??link.textContent?.trim()));
  expect(sequence.slice(0,5)).toEqual(['Ampliar: Busca por vagas','App Store','Repositório','Ampliar: Detalhes da vaga','Ampliar: Confirmação de candidatura']);
  await page.locator('#carely .project-links a').last().focus();
  const before=await page.evaluate(()=>scrollY);
  // Verified in the running macOS WebKit: Tab skips links; Option+Tab includes them.
  await page.keyboard.press(browserName==='webkit'?'Alt+Tab':'Tab');
  await expect(page.locator('#carely .screen-1 a')).toBeFocused();
  expect(await page.evaluate(()=>scrollY)).toBeGreaterThanOrEqual(before);
});

test('Fintech mobile connectors span the open path between glyphs',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/Portfolio/en/');
  await page.locator('[data-controls]').scrollIntoViewIfNeeded();
  const geometry=await page.locator('[data-connector]').evaluateAll(connectors=>connectors.map(connector=>{
    const line=connector.querySelector('.vertical-path')!.getBoundingClientRect();
    const body=connector.parentElement!.getBoundingClientRect();
    const next=connector.parentElement!.nextElementSibling!.querySelector('.node-glyph')!.getBoundingClientRect();
    return {height:line.height,expected:body.height-84+28,nextGap:next.top-line.bottom};
  }));
  for(const line of geometry){expect(Math.abs(line.height-line.expected)).toBeLessThan(1);expect(line.nextGap).toBeLessThanOrEqual(13);expect(line.height).toBeGreaterThan(80)}
});
