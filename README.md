# Gabriel Ferrari — Portfolio

Home bilíngue em Astro, TypeScript strict e CSS próprio. Output estático, sem React, Motion, MDX ou scripts de terceiros. Este é o Checkpoint 2 local; não foi publicado.

## Desenvolvimento e validação

Use Node.js 24 LTS ou versão compatível com o Astro instalado.

```sh
npm ci
npm run dev
npm run check
npm run build
npx playwright install chromium webkit
npm test
npm run preview
```

Preview: `http://127.0.0.1:4321/Portfolio/pt/` e `/Portfolio/en/`.

## Estrutura

- `src/pages/index.astro`: entrada de idioma; links PT/EN funcionam sem JavaScript.
- `src/pages/[locale]/index.astro`: gera somente as homes PT e EN.
- `src/layouts/Layout.astro`: metadata, canonical/hreflang, fontes e preferência de idioma.
- `src/components/`: Hero, Carely, Fintech, Jordania, perfil técnico e demais seções.
- `src/content.config.ts` e `src/content/projects/*.md`: uma Content Collection com schema tipado; identidade, tecnologias, links e limites compartilhados; copy e legendas separados por idioma.
- `src/i18n.ts`: textos gerais PT/EN.
- `src/styles/global.css`: tokens e fundamentos; componentes usam scoped styles.
- `src/assets/`: fotografias/screenshots originais e fontes locais, processados pelo Astro/Vite.
- `public/assets/documents/`: CV em português. Não existe CV inglês.
- `public/assets/fonts/`: licenças OFL.
- `images/`: assets originais da primeira versão, preservados; não entram no build.
- `tests/home.spec.ts`: validação essencial em Chromium e WebKit.

## Interações

Carely: links para screenshots viram ampliação em `<dialog>` nativo. Escape, fechamento e restauração de foco; `<details>` expande somente as duas capturas secundárias. Sem JS, links abrem as imagens e a expansão continua nativa.

Fintech: radios nativos e TypeScript local selecionam três cenários. Explicação e percurso atualizam imediatamente; a seleção cancela a progressão anterior. Motion finito de até 510 ms; reduced motion usa estado final. Sem JS, as três explicações ficam visíveis. Não há requests para as APIs dos projetos.

Idioma: escolha manual tem prioridade; somente a raiz redireciona. Rotas localizadas nunca redirecionam automaticamente. Storage indisponível não impede navegação.

## GitHub Pages

`site: https://ghabrielferrari.github.io`, `base: /Portfolio/`, trailing slash, output estático em `dist/`. Acesso direto e reload usam arquivos `index.html` por rota.

`ci.yml` executa type-check, build e testes. `deploy.yml` está preparado com **gatilho exclusivamente manual**. Nenhum workflow foi disparado e nenhuma configuração remota foi alterada. No checkpoint de publicação, configurar Pages para GitHub Actions e executar o deploy somente após aprovação.

## Evidências e performance

Veja `review/validation.md`, `review/links.json` e `review/lighthouse/`. Medição diagnóstica mobile a 390×844, throttling padrão do Lighthouse, Chromium local e cache limpo. Não representa mediana de Release Candidate nem performance publicada.

Para repetir um diagnóstico autorizado, crie `review/lighthouse/` e execute:

```sh
node scripts/lighthouse.mjs http://127.0.0.1:4321/Portfolio/pt/ current
```

## Limites factuais

Carely: cinco capturas próprias de desenvolvimento com dados demonstrativos. A revisão da build atual da App Store não foi confirmada. Não há claim de envio efetivo das candidaturas à instituição.

Fintech: projeto pessoal integralmente desenvolvido por Gabriel; diagrama de implementação, sem execução real ou claim de validação em produção.

Jordania: contribuição em frontend/iOS, sessão, autenticação e integração Java/Spring. Providers Apple/Google reais funcionaram durante o desenvolvimento. Outros módulos do backend da equipe não são atribuídos a Gabriel.

Casos completos ficam para o Checkpoint 3. Futuras rotas: `/Portfolio/pt/projetos/<slug>/` e `/Portfolio/en/work/<slug>/`, com `carely`, `fintech`, `jordania`; nenhuma rota ou link de case foi criado antecipadamente.

## Fontes e assets

Source Sans 3: arquivo local já validado na baseline. Bricolage Grotesque: um WOFF2 latino, peso 600, optical sizing variável; ambos SIL OFL. O subset cobre os caracteres PT/EN usados. Fontes preloaded, fallback com métricas ajustadas, dimensões de imagem reservadas e WebP responsivo via `astro:assets`.

Referências de implementação: [Content Collections](https://docs.astro.build/en/guides/content-collections/) e [GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), documentação oficial Astro.
