import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import config from "../astro.config.mjs";

const site = "https://ghabrielferrari.github.io";
const prefix = "/Portfolio/";
const dist = new URL("../dist/", import.meta.url);
const attribute = (tag, name) =>
  tag.match(new RegExp(`(?:\\s|^)${name}="([^"]*)"`))?.[1];

assert.equal(config.site, site);
assert.equal(config.base, prefix);
assert.equal(config.output, "static");

async function asset(path) {
  assert.ok(path.startsWith(prefix), `Missing base path: ${path}`);
  const pathname = new URL(path, site).pathname.slice(prefix.length);
  assert.ok((await stat(new URL(pathname, dist))).isFile(), path);
}

for (const [file, locale] of [
  ["index.html", "pt"],
  ["pt/index.html", "pt"],
  ["en/index.html", "en"],
]) {
  const html = await readFile(new URL(file, dist), "utf8");
  const tags = html.match(/<(?:link|meta|script|img|a|button)\b[^>]*>/g) || [];
  const links = tags.filter((tag) => tag.startsWith("<link"));
  const metas = tags.filter((tag) => tag.startsWith("<meta"));
  const canonical = `${site}${prefix}${locale}/`;
  assert.equal(
    attribute(links.find((tag) => attribute(tag, "rel") === "canonical"), "href"),
    canonical,
    file,
  );
  assert.equal(
    attribute(metas.find((tag) => attribute(tag, "property") === "og:url"), "content"),
    canonical,
    file,
  );
  assert.deepEqual(
    Object.fromEntries(links.filter((tag) => attribute(tag, "hreflang")).map((tag) => [attribute(tag, "hreflang"), attribute(tag, "href")])),
    { "pt-BR": `${site}${prefix}pt/`, en: `${site}${prefix}en/`, "x-default": `${site}${prefix}` },
    file,
  );
  assert.match(html, /<title>Gabriel Ferrari/);
  assert.ok(attribute(metas.find((tag) => attribute(tag, "name") === "description"), "content"));
  assert.ok(attribute(metas.find((tag) => attribute(tag, "property") === "og:title"), "content"));
  assert.ok(attribute(metas.find((tag) => attribute(tag, "property") === "og:description"), "content"));
  for (const tag of tags) {
    for (const name of ["href", "src", "data-image"]) {
      const path = attribute(tag, name);
      if (!path?.startsWith("/")) continue;
      if (name === "href" && !path.includes(".")) {
        assert.ok(path.startsWith(prefix), path);
        const pathname = new URL(path, site).pathname.slice(prefix.length);
        await stat(new URL(`${pathname}index.html`, dist));
      } else await asset(path);
    }
  }
  if (locale === "en") assert.match(html, /Download CV \(Portuguese\)/);
}

let fonts = 0;
for (const file of await readdir(new URL("_astro/", dist))) {
  if (!file.endsWith(".css")) continue;
  const css = await readFile(new URL(`_astro/${file}`, dist), "utf8");
  for (const [, path] of css.matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) {
    await asset(path);
    if (path.endsWith(".woff2")) fonts += 1;
  }
}
assert.equal(fonts, 2, "Both local fonts must be present in the generated CSS");
assert.deepEqual(
  await readFile(new URL("documents/gabriel-ferrari-cv-pt.docx", dist)),
  await readFile(new URL("../public/documents/gabriel-ferrari-cv-pt.docx", import.meta.url)),
);
console.log("Static HTML, PT/EN SEO, base paths, CSS fonts and original CV: passed.");
