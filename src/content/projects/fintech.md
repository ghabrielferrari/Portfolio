---
{
  "id": "fintech",
  "name": "Fintech",
  "technologies": [
    "Swift",
    "SwiftUI",
    "Keychain",
    "URLSession",
    "TypeScript",
    "NestJS",
    "PostgreSQL"
  ],
  "links": [
    {
      "url": "https://github.com/fintech-platform-hq/fintech-ios",
      "pt": "Repositório iOS",
      "en": "iOS repository"
    },
    {
      "url": "https://github.com/fintech-platform-hq/fintech-api",
      "pt": "API",
      "en": "API"
    },
    {
      "url": "https://github.com/fintech-platform-hq/fintech-docs",
      "pt": "Documentação técnica",
      "en": "Technical documentation"
    }
  ],
  "pt": {
    "kind": "iOS e backend / Projeto pessoal",
    "summary": "Sessão e transações, do iOS ao banco de dados.",
    "contribution": "Desenvolvido integralmente por mim: autenticação, sessão e refresh concorrente, Keychain, integração iOS/API e transações com idempotência e consistência no PostgreSQL.",
    "note": "Em desenvolvimento. Diagrama da implementação, sem execução ou validação em produção."
  },
  "en": {
    "kind": "iOS and backend / Personal project",
    "summary": "Sessions and transactions, from iOS to the database.",
    "contribution": "Developed entirely by me: authentication, session and concurrent refresh handling, Keychain, iOS/API integration, and transactions with idempotency and PostgreSQL consistency.",
    "note": "In development. An implementation diagram, not a live execution or production validation."
  },
  "evidenceLimits": [
    "No live API requests.",
    "No claim of production validation.",
    "Retries preserve one logical operation key; this is not global exactly-once delivery."
  ],
  "images": []
}
---
