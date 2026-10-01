import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ghabrielferrari.github.io",
  base: "/Portfolio/",
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
