export const withBase = (path = "") =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const casePath = (locale: "pt" | "en", slug: "carely" | "fintech" | "jordania") =>
  withBase(`${locale}/${locale === "pt" ? "projetos" : "work"}/${slug}/`);
