import { withBase } from "../utils/paths";

const root = document.documentElement;
const toggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
const syncTheme = () => {
  toggle?.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      "content",
      root.dataset.theme === "dark" ? "#111a2a" : "#f4f6fb",
    );
};
syncTheme();
toggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("gf-theme", root.dataset.theme);
  } catch {
    /* Theme works without storage. */
  }
  syncTheme();
});

const languageLinks =
  document.querySelectorAll<HTMLAnchorElement>("[data-language]");
languageLinks.forEach((link) =>
  link.addEventListener("click", () => {
    try {
      localStorage.setItem("gf-language", link.dataset.language!);
    } catch {
      /* Language links work without storage. */
    }
  }),
);
if (document.body.hasAttribute("data-language-entry")) {
  let language: string | null = null;
  try {
    language = localStorage.getItem("gf-language");
  } catch {
    /* Use the browser language when storage is unavailable. */
  }
  if (language !== "pt" && language !== "en") {
    language = /^pt(?:-|$)/i.test(navigator.languages[0] || navigator.language)
      ? "pt"
      : "en";
  }
  location.replace(`${withBase(`${language}/`)}${location.hash}`);
}
let currentSection = location.hash.slice(1) || "top";
const updateLanguages = () =>
  languageLinks.forEach((link) => {
    link.href = `${withBase(`${link.dataset.language}/`)}${currentSection === "top" ? "" : `#${currentSection}`}`;
  });
updateLanguages();
window.addEventListener("hashchange", () => {
  currentSection = location.hash.slice(1) || "top";
  updateLanguages();
});
const nav = document.querySelectorAll<HTMLAnchorElement>("[data-nav]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      currentSection = entry.target.id;
      updateLanguages();
      const area = ["carely", "fintech", "jordania", "projects"].includes(
        currentSection,
      )
        ? "projects"
        : currentSection;
      nav.forEach((link) => {
        if (link.dataset.nav === area)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-15% 0px -60% 0px" },
);
document
  .querySelectorAll("section[id],article[id]")
  .forEach((section) => sectionObserver.observe(section));

const dialog = document.querySelector<HTMLDialogElement>(".image-dialog");
const dialogImage = dialog?.querySelector<HTMLImageElement>("img");
const caption = dialog?.querySelector("figcaption");
document.querySelectorAll<HTMLButtonElement>("[data-image]").forEach((button) =>
  button.addEventListener("click", () => {
    if (!dialog || !dialogImage || !caption) return;
    dialogImage.src = button.dataset.image!;
    dialogImage.alt = button.querySelector("img")?.alt || "";
    caption.textContent = button.dataset.caption || "";
    dialog.showModal();
  }),
);
dialog
  ?.querySelector("button")
  ?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches) {
  root.classList.add("motion-ready");
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => reveal.observe(element));
}
