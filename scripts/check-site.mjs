import assert from "node:assert/strict";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import config from "../astro.config.mjs";

const require = createRequire(import.meta.url);
const base = new URL(
  config.base,
  process.env.SITE_URL || process.env.BASE_URL || "http://127.0.0.1:4330",
).href.replace(/\/$/, "");
for (let attempt = 0; ; attempt += 1) {
  try {
    const response = await fetch(`${base}/pt/`, { signal: AbortSignal.timeout(1000) });
    assert.ok(response.ok);
    break;
  } catch {
    assert.ok(attempt < 29, `Preview unavailable at ${base}/pt/`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
const output = fileURLToPath(new URL("../review/", import.meta.url));
await mkdir(output, { recursive: true });
const axe = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const report = {
  base,
  checks: [],
  accessibility: [],
  errors: [],
  screenshots: [],
};
const available = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
const candidates = [
  process.env.BROWSER_PATH,
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  chromium.executablePath(),
].filter(Boolean);
let browser;
for (const executablePath of candidates) {
  if (!(await available(executablePath))) continue;
  try {
    browser = await chromium.launch({ executablePath, headless: true });
    break;
  } catch {
    /* Try an existing alternative. */
  }
}
assert.ok(
  browser,
  "Chromium unavailable: set BROWSER_PATH to an installed browser.",
);

async function check(name, run) {
  try {
    await run();
    report.checks.push({ name, passed: true });
  } catch (error) {
    report.checks.push({ name, passed: false, message: error.message });
  }
}

async function visit(locale, theme, viewport, extra = {}) {
  const context = await browser.newContext({
    viewport,
    colorScheme: theme,
    ...extra,
  });
  const page = await context.newPage();
  const label = `${locale}-${theme}-${viewport.width}`;
  page.on("pageerror", (error) =>
    report.errors.push({ label, type: "pageerror", message: error.message }),
  );
  page.on("console", (message) => {
    if (message.type() === "error")
      report.errors.push({ label, type: "console", message: message.text() });
  });
  await page.goto(`${base}/${locale}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, label };
}

async function revealPage(page) {
  await page.evaluate(async () => {
    for (
      let y = 0;
      y < document.body.scrollHeight;
      y += window.innerHeight * 0.75
    ) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 55));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(850);
}

try {
  await check("Root selects browser language or saved preference and preserves hash", async () => {
    for (const [locale, preference, expected] of [
      ["pt-BR", null, "pt"],
      ["en-US", null, "en"],
      ["pt-BR", "en", "en"],
      ["en-US", "pt", "pt"],
      ["pt-BR", "invalid", "pt"],
    ]) {
      const entry = await browser.newContext({ locale, reducedMotion: "reduce" });
      if (preference) await entry.addInitScript((value) => localStorage.setItem("gf-language", value), preference);
      const entryPage = await entry.newPage();
      await entryPage.goto(`${base}/#carely`);
      await entryPage.waitForURL(`${base}/${expected}/#carely`);
      assert.equal(await entryPage.locator("html").getAttribute("lang"), expected === "pt" ? "pt-BR" : "en");
      await entry.close();
    }
  });
  await check("Explicit locale routes never redirect based on preference", async () => {
    const entry = await browser.newContext({ locale: "en-US" });
    await entry.addInitScript(() => localStorage.setItem("gf-language", "en"));
    const entryPage = await entry.newPage();
    for (const locale of ["pt", "en"]) {
      await entryPage.goto(`${base}/${locale}/`, { waitUntil: "networkidle" });
      assert.equal(entryPage.url(), `${base}/${locale}/`);
    }
    await entry.close();
  });
  await check("Root and language links work when storage is unavailable", async () => {
    const entry = await browser.newContext({ locale: "en-US", reducedMotion: "reduce" });
    await entry.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage unavailable"); } }));
    const entryPage = await entry.newPage();
    await entryPage.goto(`${base}/`);
    await entryPage.waitForURL(`${base}/en/`);
    await entryPage.locator('[data-language="pt"]').click();
    await entryPage.waitForURL(`${base}/pt/`);
    assert.equal(await entryPage.locator("html").getAttribute("lang"), "pt-BR");
    await entry.close();
  });
  await check("Root without JavaScript serves PT content and real locale links", async () => {
    const entry = await browser.newContext({ javaScriptEnabled: false, locale: "en-US" });
    const entryPage = await entry.newPage();
    await entryPage.goto(`${base}/`, { waitUntil: "networkidle" });
    assert.equal(entryPage.url(), `${base}/`);
    assert.equal(await entryPage.locator("html").getAttribute("lang"), "pt-BR");
    assert.equal(await entryPage.locator(".project").count(), 3);
    assert.equal(await entryPage.locator('link[rel="canonical"]').getAttribute("href"), `${config.site}${config.base}pt/`);
    await entryPage.locator('[data-language="en"]').click();
    await entryPage.waitForURL(`${base}/en/`);
    assert.equal(await entryPage.locator("html").getAttribute("lang"), "en");
    await entry.close();
  });
  await check("Hosted local URLs, CSS, scripts, fonts and favicon load under the base path", async () => {
    const entry = await browser.newContext({ reducedMotion: "reduce" });
    const entryPage = await entry.newPage();
    const paths = new Set();
    const fonts = new Set();
    entryPage.on("response", (response) => {
      if (new URL(response.url()).pathname.endsWith(".woff2")) fonts.add(response.url());
    });
    for (const locale of ["pt", "en"]) {
      await entryPage.goto(`${base}/${locale}/`, { waitUntil: "networkidle" });
      await entryPage.evaluate(() => document.fonts.ready);
      assert.equal(await entryPage.evaluate(() => [...document.fonts].filter((font) => ["Bricolage", "Source"].includes(font.family) && font.status === "loaded").length), 2);
      const urls = await entryPage.locator("[href], [src], [data-image]").evaluateAll((elements) => elements.flatMap((element) => ["href", "src", "data-image"].map((name) => element.getAttribute(name)).filter(Boolean)));
      for (const value of urls) {
        const url = new URL(value, entryPage.url());
        if (url.origin !== new URL(base).origin) continue;
        assert.ok(url.pathname.startsWith(config.base), url.href);
        url.hash = "";
        paths.add(url.href);
      }
    }
    for (const url of paths) assert.equal((await entry.request.get(url)).status(), 200, url);
    assert.equal(fonts.size, 2, "Both actual font requests must be captured");
    for (const url of fonts) {
      assert.ok(new URL(url).pathname.startsWith(config.base), url);
      assert.ok(!new URL(url).pathname.includes("//"), url);
      const response = await entry.request.get(url);
      assert.equal(response.status(), 200);
      assert.equal((await response.body()).subarray(0, 4).toString(), "wOF2");
    }
    const favicon = await entry.request.get(`${base}/favicon.svg`);
    assert.equal(favicon.status(), 200);
    assert.match(await favicon.text(), /<svg/);
    await entry.close();
  });
  for (const locale of ["pt", "en"])
    for (const theme of ["light", "dark"])
      for (const width of [1440, 390]) {
        const { context, page, label } = await visit(locale, theme, {
          width,
          height: width === 390 ? 844 : 1000,
        });
        await revealPage(page);
        await check(`${label}: locale and theme`, async () => {
          assert.equal(
            await page.locator("html").getAttribute("lang"),
            locale === "pt" ? "pt-BR" : "en",
          );
          assert.equal(
            await page.locator("html").getAttribute("data-theme"),
            theme,
          );
          assert.match(
            await page.locator("h1").innerText(),
            /Software Engineer/,
          );
        });
        await check(`${label}: horizontal overflow`, async () => {
          const overflow = await page.evaluate(() => ({
            viewport: innerWidth,
            document: document.documentElement.scrollWidth,
            elements: [...document.querySelectorAll("body *")]
              .filter((el) => {
                const box = el.getBoundingClientRect();
                const style = getComputedStyle(el);
                return (
                  box.width &&
                  style.position !== "fixed" &&
                  (box.right > innerWidth + 1 || box.left < -1)
                );
              })
              .slice(0, 12)
              .map((el) => ({
                selector:
                  el.tagName.toLowerCase() +
                  ((el.className?.baseVal ?? el.className)
                    ? "." +
                      String(el.className?.baseVal ?? el.className)
                        .trim()
                        .replaceAll(" ", ".")
                    : ""),
                right: el.getBoundingClientRect().right,
              })),
          }));
          assert.ok(
            overflow.document <= overflow.viewport + 1,
            JSON.stringify(overflow),
          );
        });
        await check(`${label}: real image assets load`, async () => {
          const details = page.locator(".secondary-evidence");
          await details.evaluate((el) => {
            el.open = true;
          });
          await page.locator(".secondary-content").scrollIntoViewIfNeeded();
          await page.waitForFunction(() =>
            [...document.images]
              .filter((img) => img.getAttribute("src"))
              .every((img) => img.complete && img.naturalWidth > 0),
          );
          const failures = await page
            .locator("img[src]")
            .evaluateAll((images) =>
              images
                .filter((img) => !img.complete || !img.naturalWidth)
                .map((img) => img.src),
            );
          assert.deepEqual(failures, []);
          await details.evaluate((el) => {
            el.open = false;
          });
          await page.evaluate(() => scrollTo(0, 0));
        });
        await check(`${label}: WCAG AA automated scan`, async () => {
          await page.addScriptTag({ content: axe });
          const result = await page.evaluate(async () =>
            window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
              },
            }),
          );
          const violations = result.violations.map(
            ({ id, impact, description, helpUrl, nodes }) => ({
              id,
              impact,
              description,
              helpUrl,
              nodes: nodes.map(({ target, failureSummary, html }) => ({
                target,
                failureSummary,
                html,
              })),
            }),
          );
          report.accessibility.push({ label, violations });
          assert.equal(
            violations.length,
            0,
            violations
              .map(
                (v) =>
                  `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
              )
              .join("; "),
          );
        });
        if (locale === "pt" && process.env.CAPTURE !== "0") {
          const path = `${output}${width === 390 ? "mobile" : "desktop"}-${theme}.png`;
          await page.screenshot({ path, fullPage: true });
          report.screenshots.push(path);
        }
        await context.close();
      }

  const { context, page } = await visit("pt", "light", {
    width: 1440,
    height: 1000,
  });
  await check("Responsive composition from 320px to 1024px", async () => {
    for (const width of [320, 360, 430, 560, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      const size = await page.evaluate(() => [
        innerWidth,
        document.documentElement.scrollWidth,
      ]);
      assert.ok(
        size[1] <= size[0] + 1,
        `Horizontal overflow at ${width}px: ${size[1]}px`,
      );
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  });
  await check(
    "Keyboard image dialog, Escape and focus restoration",
    async () => {
      const trigger = page.locator("[data-image]").first();
      await trigger.focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(
        () => document.querySelector(".image-dialog").open,
      );
      assert.equal(
        await page.locator(".image-dialog img").getAttribute("src"),
        await trigger.getAttribute("data-image"),
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator(".image-dialog").evaluate((el) => el.open),
        false,
      );
      assert.equal(
        await trigger.evaluate((el) => document.activeElement === el),
        true,
      );
    },
  );

  await check(
    "Fintech scenarios: first/next/previous/direct steps and finite playback",
    async () => {
      const flow = page.locator("[data-fintech-flow]");
      await flow.scrollIntoViewIfNeeded();
      for (const [id, length] of [
        ["authenticated", 5],
        ["refresh", 6],
        ["idempotency", 6],
      ]) {
        await flow.locator(`[data-scenario="${id}"]`).click();
        assert.equal(
          await flow
            .locator(`[data-scenario="${id}"]`)
            .getAttribute("aria-pressed"),
          "true",
        );
        assert.equal(await flow.locator(".flow-steps button").count(), length);
        assert.equal(await flow.locator("[data-previous]").isDisabled(), true);
        await flow.locator("[data-next]").click();
        assert.match(
          await flow.locator("[data-step-count]").innerText(),
          new RegExp(`2 de ${length}`),
        );
        await flow.locator("[data-previous]").click();
        assert.match(
          await flow.locator("[data-step-count]").innerText(),
          new RegExp(`1 de ${length}`),
        );
        await flow.locator(".flow-steps button").last().click();
        assert.equal(await flow.locator("[data-next]").isDisabled(), true);
        assert.equal(
          await flow
            .locator(".flow-steps button")
            .last()
            .getAttribute("aria-current"),
          "step",
        );
        if (id === "idempotency") {
          await flow.locator(".flow-steps button").nth(4).click();
          assert.equal(
            await flow.locator("[data-step-badge]").innerText(),
            "Idempotency-Key",
          );
        }
        await flow.locator("[data-replay]").click();
        await page.waitForFunction(
          () =>
            document.querySelector("[data-fintech-flow]").dataset.playing ===
            "false",
          null,
          { timeout: 18000 },
        );
        assert.match(
          await flow.locator("[data-step-count]").innerText(),
          new RegExp(`${length} de ${length}`),
        );
        assert.equal(await flow.locator("[data-next]").isDisabled(), true);
        assert.equal(
          await flow.evaluate((el) =>
            el
              .getAnimations({ subtree: true })
              .some(
                (animation) =>
                  animation.effect.getTiming().iterations === Infinity,
              ),
          ),
          false,
        );
      }
    },
  );

  await check(
    "Language switch retains equivalent section and chosen theme",
    async () => {
      await page.locator(".theme-toggle").click();
      await page.goto(`${base}/pt/#contact`, { waitUntil: "networkidle" });
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.waitForFunction(
        (expected) =>
          document
            .querySelector('[data-language="en"]')
            .getAttribute("href") === expected,
        `${new URL("en/", `${base}/`).pathname}#contact`,
      );
      await page.locator('[data-language="en"]').click();
      await page.waitForURL("**/en/#contact");
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        "dark",
      );
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      assert.equal(await page.evaluate(() => localStorage.getItem("gf-language")), "en");
      assert.equal(
        await page
          .locator(".hero-support .actions a[href='#contact']")
          .getAttribute("href"),
        "#contact",
      );
      assert.equal(await page.locator("a[download]").count(), 1);
      assert.equal(await page.locator("a[download]").innerText(), "Download CV (Portuguese)");
    },
  );
  for (const locale of ["pt", "en"]) await check(`${locale}: download serves the original Portuguese DOCX`, async () => {
    await page.goto(`${base}/${locale}/`, { waitUntil: "networkidle" });
    const link = page.locator("a[download]");
    assert.equal(await link.count(), 1);
    const response = await context.request.get(
      new URL(await link.getAttribute("href"), base).href,
    );
    assert.ok(response.ok());
    assert.deepEqual(
      await response.body(),
      await readFile(
        new URL(
          "../public/documents/gabriel-ferrari-cv-pt.docx",
          import.meta.url,
        ),
      ),
    );
  });
  await context.close();

  const reduced = await visit(
    "en",
    "dark",
    { width: 390, height: 844 },
    { reducedMotion: "reduce" },
  );
  await check(
    "Reduced motion: each scenario reaches final state without playback",
    async () => {
      const flow = reduced.page.locator("[data-fintech-flow]");
      for (const [id, length] of [
        ["authenticated", 5],
        ["refresh", 6],
        ["idempotency", 6],
      ]) {
        await flow.locator(`[data-scenario="${id}"]`).click();
        await flow.locator("[data-replay]").click();
        assert.match(
          await flow.locator("[data-step-count]").innerText(),
          new RegExp(`${length} of ${length}`),
        );
        assert.equal(await flow.getAttribute("data-playing"), "false");
        assert.equal(
          await flow.evaluate(
            (el) => el.getAnimations({ subtree: true }).length,
          ),
          0,
        );
      }
      assert.equal(
        await reduced.page
          .locator("html")
          .evaluate((el) => el.classList.contains("motion-ready")),
        false,
      );
    },
  );
  await reduced.context.close();

  const noJS = await visit(
    "en",
    "light",
    { width: 390, height: 844 },
    { javaScriptEnabled: false },
  );
  await check(
    "No JavaScript: meaningful static content and technical explanation",
    async () => {
      assert.match(
        await noJS.page.locator("h1").innerText(),
        /Software Engineer/,
      );
      assert.equal(await noJS.page.locator(".project").count(), 3);
      assert.equal(await noJS.page.locator(".flow-static li").count(), 5);
      assert.equal(await noJS.page.locator(".flow-static").isVisible(), true);
      assert.equal(
        await noJS.page.locator(".flow-scenarios").isVisible(),
        false,
      );
      assert.ok(await noJS.page.locator("#carely .contribution").isVisible());
      assert.ok(
        await noJS.page.locator('#contact a[href^="mailto:"]').isVisible(),
      );
      assert.ok(
        await noJS.page.locator('[data-language="pt"]').getAttribute("href"),
      );
    },
  );
  await noJS.context.close();
  await check("No JavaScript or console errors", async () =>
    assert.deepEqual(report.errors, []),
  );
} finally {
  await browser.close();
  await writeFile(`${output}checks.json`, JSON.stringify(report, null, 2));
}

const failed = report.checks.filter((check) => !check.passed);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} browser checks passed. Report: ${output}checks.json`,
);
for (const check of failed) console.error(`${check.name}: ${check.message}`);
if (failed.length) process.exitCode = 1;
