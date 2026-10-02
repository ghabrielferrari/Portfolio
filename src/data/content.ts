export const links = {
  email: "ghcferrari75@gmail.com",
  github: "https://github.com/ghabrielferrari",
  linkedin: "https://www.linkedin.com/in/ghabriel-ferrari/",
  carely: "https://github.com/VitorFSLacerda/TheGentlemen",
  appstore: "https://apps.apple.com/br/app/carely/id6755479596",
  fintechIOS: "https://github.com/fintech-platform-hq/fintech-ios",
  fintechAPI: "https://github.com/fintech-platform-hq/fintech-api",
  fintechDocs: "https://github.com/fintech-platform-hq/fintech-docs",
  jordaniaIOS: "https://github.com/jordania-team/jordania-ios",
  jordaniaAPI: "https://github.com/jordania-team/jordania-backend",
};

export const content = {
  pt: {
    title: "Gabriel Ferrari — Software Engineer com foco em iOS",
    description:
      "Interfaces iOS, APIs e sistemas conectados. Projetos e contribuições de Gabriel Ferrari em Swift, SwiftUI, autenticação e backend.",
    nav: ["Projetos", "Perfil", "Contato"],
    skip: "Pular para o conteúdo",
    theme: "Alternar tema",
    headline: ["Software Engineer", "com foco em iOS."],
    intro:
      "Desenvolvo interfaces iOS com Swift e SwiftUI e também trabalho com APIs, autenticação e backend, conectando interface, estado e dados em fluxos completos.",
    view: "Ver projetos",
    cv: "Baixar CV",
    contact: "Contato",
    heroNote: "Da interface ao sistema que a sustenta.",
    selected: "Software em contexto.",
    selectedIntro:
      "Três projetos. Diferentes responsabilidades. Evidências do que construí.",
    jump: "Explorar projetos",
    team: "Projeto em equipe",
    personal: "Projeto pessoal",
    contribution: "Minha contribuição",
    repository: "Repositório",
    iosRepo: "Repositório iOS",
    backendRepo: "Repositório backend",
    decisions: "Contexto e decisões de implementação",
    carelyTitle: "Da busca à candidatura.",
    carelyIntro:
      "Carely é um projeto iOS em equipe, publicado na App Store. Aqui, o foco é o fluxo de descoberta de vagas e candidatura que implementei no frontend.",
    carelyContribution:
      "Busca textual, filtros, listagens e cards, navegação, telas de detalhes, modais e integração do fluxo de candidatura.",
    screenTitles: ["Busca", "Detalhes da vaga", "Confirmação"],
    screenCaptions: [
      "Texto e filtros conduzem a descoberta.",
      "A navegação mantém o contexto da vaga.",
      "O modal reúne as informações antes da ação.",
    ],
    screenAlts: [
      "Busca textual por vagas no Carely, com cards e dados demonstrativos.",
      "Tela de detalhes de uma vaga no Carely, com dados demonstrativos.",
      "Modal de confirmação anterior ao envio da candidatura no Carely.",
    ],
    expandImage: "Ampliar captura",
    closeImage: "Fechar captura",
    carelyNote:
      "Capturas de desenvolvimento com dados demonstrativos, em etapas representativas com vagas diferentes. A correspondência com a versão atual da App Store não foi confirmada.",
    secondary: "Também no fluxo de instituições",
    secondaryText:
      "Listagens e informações de instituições como evidência complementar da navegação.",
    carelyCase: [
      [
        "Contexto e problema",
        "Um fluxo iOS em equipe: encontrar uma vaga, entender os detalhes e chegar à confirmação da candidatura.",
      ],
      [
        "Responsabilidade",
        "Meu trabalho se concentra no frontend e na integração dessas etapas. O produto é resultado do trabalho da equipe.",
      ],
      [
        "Implementação",
        "Busca textual e filtros, cards e listagens, navegação para detalhes e apresentação de modais no fluxo de candidatura.",
      ],
      [
        "Decisão em foco",
        "Tratar a navegação como um fluxo completo conecta as ações de descoberta, consulta e confirmação, em vez de apresentar telas isoladas.",
      ],
      [
        "Evidência e estado",
        "As capturas reais mostram as interfaces de desenvolvimento. Carely está publicado na App Store; a captura de confirmação não demonstra recebimento pela instituição.",
      ],
      [
        "O que validaria em seguida",
        "Continuidade do estado entre as etapas, acessibilidade e correspondência entre as capturas e a versão distribuída.",
      ],
    ],
    fintechTitle: "O que acontece depois do toque.",
    fintechIntro:
      "Um projeto pessoal para conectar sessão, autenticação e criação de transações, do cliente iOS à consistência no banco de dados.",
    fintechContribution:
      "Desenvolvido integralmente por mim: iOS, networking, autenticação e sessão, API NestJS e persistência em PostgreSQL.",
    development: "Em desenvolvimento",
    documentation: "Documentação",
    fintechCase: [
      [
        "Contexto e problema",
        "Uma operação iniciada no iOS precisa atravessar autenticação, rede, API e banco de dados sem perder sua identidade durante uma tentativa adicional.",
      ],
      [
        "Responsabilidade e implementação",
        "Projeto integralmente meu, com credenciais no Keychain, AuthenticationSession, integração iOS/API, criação de transações e PostgreSQL.",
      ],
      [
        "Decisões de sessão",
        "O refresh coordenado permite compartilhar a renovação entre requisições concorrentes. Após um 401, a tentativa adicional utiliza as credenciais renovadas.",
      ],
      [
        "Decisões de dados",
        "Preservar a chave de idempotência conecta as tentativas à mesma operação lógica. A consistência também depende das regras e transações no PostgreSQL.",
      ],
      [
        "Evidência e estado",
        "Os repositórios iOS, API e documentação permitem consultar a implementação. O diagrama explica os fluxos; não executa chamadas reais. Projeto em desenvolvimento.",
      ],
      [
        "O que validaria em seguida",
        "Cenários de falha de rede, expiração de sessão e concorrência em ambientes representativos, antes de considerar uso em produção.",
      ],
    ],
    jordaniaTitle: "Autenticação, dos dois lados.",
    jordaniaIntro:
      "Projeto em equipe. Desenvolvi o frontend iOS e a infraestrutura de autenticação e sessão, contribuí nas rotas Java/Spring de login, refresh e logout e sua integração com o iOS.",
    jordaniaNote:
      "Integração Apple e Google durante o desenvolvimento; não implica validação atual em produção.",
    jordaniaCase: [
      [
        "Contexto e responsabilidade",
        "Projeto em equipe com uma contribuição concentrada no frontend iOS, na sessão e nas rotas de autenticação Java/Spring.",
      ],
      [
        "Problema e implementação",
        "Conectar login, refresh e logout do backend ao ciclo de sessão do cliente iOS.",
      ],
      [
        "Decisão em foco",
        "Considerar autenticação como um ciclo completo: o cliente precisa integrar entrada, renovação e encerramento de sessão.",
      ],
      [
        "Evidência e estado",
        "Repositórios iOS e backend disponíveis. Integração Apple e Google presente no código de desenvolvimento, sem implicar disponibilidade em produção.",
      ],
      [
        "O que validaria em seguida",
        "Expiração e revogação de credenciais, falhas dos provedores e comportamento de logout entre cliente e API.",
      ],
    ],
    profileTitle: "iOS como foco.\nEngenharia como base.",
    profileIntro:
      "Meu trabalho atual se concentra em iOS. Os projetos também envolvem APIs, autenticação, backend e integração — o que existe entre uma interface e seus dados.",
    academyIntro:
      "O desenvolvimento colaborativo na Apple Developer Academy faz parte dessa trajetória.",
    capabilities: [
      [
        "iOS & Interfaces",
        "Swift · SwiftUI",
        "Interfaces, navegação e fluxos conectados.",
        "Carely + Fintech",
      ],
      [
        "Backend & APIs",
        "Java · Spring Boot · Node.js · NestJS · REST · PostgreSQL",
        "Autenticação, sessão, integração e dados.",
        "Fintech + Jordania",
      ],
      [
        "Web",
        "HTML · CSS · JavaScript · TypeScript",
        "Esta experiência, suas rotas e interações.",
        "Este portfólio",
      ],
    ],
    education: "Formação",
    degree: "Engenharia de Software",
    expected: "Conclusão prevista: dezembro de 2028",
    academy: "Programa educacional · 2025–2026",
    closing: "Vamos construir\no próximo fluxo.",
    closingIntro:
      "Para conversar sobre oportunidades em iOS, mobile e engenharia de software.",
    emailAction: "Enviar email",
    location: "Paulínia, São Paulo, Brasil",
    backTop: "Voltar ao início",
    footer: "Gabriel Ferrari",
  },
  en: {
    title: "Gabriel Ferrari — Software Engineer focused on iOS",
    description:
      "iOS interfaces, APIs and connected systems. Explore Gabriel Ferrari’s projects and contributions in Swift, SwiftUI, authentication and backend engineering.",
    nav: ["Projects", "Profile", "Contact"],
    skip: "Skip to content",
    theme: "Switch theme",
    headline: ["Software Engineer", "focused on iOS."],
    intro:
      "I build iOS interfaces with Swift and SwiftUI and also work with APIs, authentication and backend systems, connecting interfaces, state and data in complete flows.",
    view: "View projects",
    cv: "Download CV",
    contact: "Contact",
    heroNote: "From the interface to the system behind it.",
    selected: "Software in context.",
    selectedIntro:
      "Three projects. Different responsibilities. Evidence of what I built.",
    jump: "Explore projects",
    team: "Team project",
    personal: "Personal project",
    contribution: "My contribution",
    repository: "Repository",
    iosRepo: "iOS repository",
    backendRepo: "Backend repository",
    decisions: "Context and implementation decisions",
    carelyTitle: "From search to application.",
    carelyIntro:
      "Carely is an iOS team project published on the App Store. This case focuses on the vacancy discovery and application flow I implemented in the frontend.",
    carelyContribution:
      "Text search, filters, listings and cards, navigation, detail screens, modals and integration of the application flow.",
    screenTitles: ["Search", "Vacancy details", "Confirmation"],
    screenCaptions: [
      "Text and filters guide discovery.",
      "Navigation preserves vacancy context.",
      "The modal gathers information before the action.",
    ],
    screenAlts: [
      "Text search for vacancies in Carely, with cards and demo data. The app interface is in Portuguese.",
      "Vacancy detail screen in Carely, with demo data. The app interface is in Portuguese.",
      "Pre-submission application confirmation modal in Carely. The app interface is in Portuguese.",
    ],
    expandImage: "Expand screenshot",
    closeImage: "Close screenshot",
    carelyNote:
      "Development screenshots with demo data, showing representative steps with different vacancies. Their correspondence with the current App Store version has not been confirmed. The app interface is in Portuguese.",
    secondary: "Also in the institution flow",
    secondaryText:
      "Institution listings and information provide additional evidence of navigation.",
    carelyCase: [
      [
        "Context and problem",
        "A team-built iOS flow: find a vacancy, understand its details and reach the application confirmation.",
      ],
      [
        "Responsibility",
        "My work focuses on the frontend and integration between these steps. The product is the result of the team’s work.",
      ],
      [
        "Implementation",
        "Text search and filters, cards and listings, navigation to details and modal presentation in the application flow.",
      ],
      [
        "Decision in focus",
        "Treating navigation as a complete flow connects discovery, detail and confirmation actions instead of presenting isolated screens.",
      ],
      [
        "Evidence and state",
        "Real screenshots show the development interfaces. Carely is published on the App Store; the confirmation screenshot does not prove receipt by an institution.",
      ],
      [
        "What I would validate next",
        "State continuity between steps, accessibility and correspondence between these screenshots and the distributed version.",
      ],
    ],
    fintechTitle: "What happens after the tap.",
    fintechIntro:
      "A personal project connecting sessions, authentication and transaction creation, from the iOS client to database consistency.",
    fintechContribution:
      "Developed entirely by me: iOS, networking, authentication and sessions, the NestJS API and PostgreSQL persistence.",
    development: "In development",
    documentation: "Documentation",
    fintechCase: [
      [
        "Context and problem",
        "An operation initiated on iOS must cross authentication, networking, the API and database without losing its identity during another attempt.",
      ],
      [
        "Responsibility and implementation",
        "An entirely personal project, with Keychain credentials, AuthenticationSession, iOS/API integration, transaction creation and PostgreSQL.",
      ],
      [
        "Session decisions",
        "Coordinated refresh allows concurrent requests to share credential renewal. After a 401, the additional attempt uses the renewed credentials.",
      ],
      [
        "Data decisions",
        "Preserving the idempotency key connects attempts to the same logical operation. Consistency also depends on PostgreSQL rules and transactions.",
      ],
      [
        "Evidence and state",
        "The iOS, API and documentation repositories expose the implementation. The diagram explains the flows; it makes no real requests. In development.",
      ],
      [
        "What I would validate next",
        "Network failures, session expiry and concurrency in representative environments before considering production use.",
      ],
    ],
    jordaniaTitle: "Authentication on both sides.",
    jordaniaIntro:
      "Team project. I developed the iOS frontend and authentication/session infrastructure, contributed to Java/Spring login, refresh and logout endpoints and their integration with iOS.",
    jordaniaNote:
      "Apple and Google integration during development; this does not imply current production validation.",
    jordaniaCase: [
      [
        "Context and responsibility",
        "A team project with my contribution focused on the iOS frontend, sessions and Java/Spring authentication routes.",
      ],
      [
        "Problem and implementation",
        "Connect backend login, refresh and logout to the iOS client’s session lifecycle.",
      ],
      [
        "Decision in focus",
        "Treat authentication as a complete lifecycle: the client must integrate sign-in, renewal and session termination.",
      ],
      [
        "Evidence and state",
        "iOS and backend repositories are available. Apple and Google integration is present in development code, without implying production availability.",
      ],
      [
        "What I would validate next",
        "Credential expiry and revocation, provider failures and logout behavior across the client and API.",
      ],
    ],
    profileTitle: "iOS at the center.\nEngineering underneath.",
    profileIntro:
      "My current work focuses on iOS. My projects also involve APIs, authentication, backend systems and integration — everything between an interface and its data.",
    academyIntro:
      "Collaborative development at the Apple Developer Academy is part of that path.",
    capabilities: [
      [
        "iOS & Interfaces",
        "Swift · SwiftUI",
        "Interfaces, navigation and connected flows.",
        "Carely + Fintech",
      ],
      [
        "Backend & APIs",
        "Java · Spring Boot · Node.js · NestJS · REST · PostgreSQL",
        "Authentication, sessions, integration and data.",
        "Fintech + Jordania",
      ],
      [
        "Web",
        "HTML · CSS · JavaScript · TypeScript",
        "This experience, its routes and interactions.",
        "This portfolio",
      ],
    ],
    education: "Education",
    degree: "Software Engineering",
    expected: "Expected completion: December 2028",
    academy: "Educational program · 2025–2026",
    closing: "Let’s build\nthe next flow.",
    closingIntro:
      "For conversations about opportunities in iOS, mobile and software engineering.",
    emailAction: "Send email",
    location: "Paulínia, São Paulo, Brazil",
    backTop: "Back to top",
    footer: "Gabriel Ferrari",
  },
};
