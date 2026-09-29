(() => {
  const preferenceKey = 'portfolio.language';
  const supportedLanguages = ['pt', 'en'];

  document.querySelectorAll('[data-language]').forEach((link) => {
    link.addEventListener('click', () => {
      const language = link.dataset.language;
      if (!supportedLanguages.includes(language)) return;
      try {
        localStorage.setItem(preferenceKey, language);
      } catch {
        // Navigation still works when persistent storage is unavailable.
      }
      if (location.hash) {
        const destination = new URL(link.href);
        destination.hash = location.hash;
        link.href = destination.href;
      }
    });
  });

  // Explicit localized URLs are never redirected or saved as a manual choice.
  if (!document.body.hasAttribute('data-language-entry')) return;

  let language;
  try {
    language = localStorage.getItem(preferenceKey);
  } catch {
    // Browser language is the fallback when storage is unavailable.
  }
  if (!supportedLanguages.includes(language)) {
    const browserLanguage = navigator.languages?.[0] || navigator.language || '';
    language = /^pt(?:-|$)/i.test(browserLanguage) ? 'pt' : 'en';
  }
  const destination = new URL(`${language}/`, location.href);
  destination.hash = location.hash;
  location.replace(destination.href);
})();
