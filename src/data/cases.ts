import { links } from './content';

export type Locale = 'pt' | 'en';
export type CaseSlug = 'carely' | 'fintech' | 'jordania';
type Text = Record<Locale, string>;
type Reference = { label: string; url: string };
type Section = { title: Text; text: Text; references?: Reference[] };
type Screen = { asset: string; title: Text; caption: Text; alt: Text };
type Scenario = { title: Text; steps: Text[]; implementation: Text; decision: Text; references: Reference[] };
type CaseStudy = {
  id: CaseSlug; name: string; category: Text; title: Text; description: Text;
  context: Text; role: Text; stack: string[]; sections: Section[]; state: Text; limits: Text[];
  links: { label: Text; url: string }[];
  screens?: Screen[]; screenNote?: Text;
  scenarios?: Scenario[]; scenarioNote?: Text; authPath?: Text[];
};
const text = (pt: string, en: string): Text => ({ pt, en });
// Public commit snapshots reviewed for this case, independent of local project checkouts.
const ios = `${links.fintechIOS}/blob/48ff69b7a457d394f1bd3104a29f0affd130a361/`;
const api = `${links.fintechAPI}/blob/cba4a86ff34933200288970898c319a63dd32e40/`;
const jordaniaIOS = `${links.jordaniaIOS}/blob/ab20de9c647b145b5b2badea450df4c221d3d006/`;
const jordaniaAPI = `${links.jordaniaAPI}/blob/55c6212f60875b574960bb2a8bb0e7a93489b79c/`;

export const cases: Record<CaseSlug, CaseStudy> = {
  carely: {
    id: 'carely', name: 'Carely', category: text('Projeto em equipe · iOS', 'Team project · iOS'),
    title: text('Da busca à intenção de candidatura.', 'From search to application intent.'),
    description: text(
      'Frontend iOS em um projeto de equipe publicado na App Store: busca, listagens, detalhes e confirmação de candidatura.',
      'iOS frontend in a team project published on the App Store: search, listings, details and application confirmation.'),
    context: text(
      'Carely reúne interfaces de descoberta de vagas e consulta de instituições. O recorte deste case é o frontend iOS que implementei e refinei dentro do trabalho da equipe.',
      'Carely brings together interfaces for vacancy discovery and institution information. This case covers the iOS frontend I implemented and refined within the team’s work.'),
    role: text(
      'Busca textual, filtros, listagens e cards, navegação, telas de detalhes, modais e fluxo de candidatura. Minha contribuição não abrange a autoria exclusiva da busca, da arquitetura, do backend ou dos dados.',
      'Text search, filters, listings and cards, navigation, detail screens, modals and the application flow. My contribution does not imply sole authorship of search, architecture, backend or data.'),
    stack: ['Swift', 'SwiftUI', 'iOS'],
    screenNote: text(
      'Capturas reais de desenvolvimento com dados demonstrativos. Elas representam etapas do fluxo, com vagas e instituições diferentes; não documentam uma mesma candidatura. O filtro aberto não está documentado nestas capturas.',
      'Real development screenshots with demo data. They represent steps in the flow, with different vacancies and institutions; they do not document a single application. An open filter panel is not documented in these captures. The app interface is in Portuguese.'),
    screens: [
      { asset: 'carely-search', title: text('Busca e listagens', 'Search and listings'),
        caption: text('Implementei e refinei busca textual, listagens e cards. A captura mostra a entrada de texto e a apresentação dos resultados que levam à consulta de uma vaga.', 'I implemented and refined text search, listings and cards. The screenshot shows text input and the presentation of results leading to a vacancy.'),
        alt: text('Busca no Carely com campo de texto, cards de instituições e dados demonstrativos.', 'Carely search with a text field, institution cards and demo data. Interface in Portuguese.') },
      { asset: 'carely-detail', title: text('Detalhes da vaga', 'Vacancy details'),
        caption: text('Implementei e refinei a navegação e as telas de detalhes. A interface organiza informações da vaga e apresenta a ação de candidatura no contexto da consulta.', 'I implemented and refined navigation and detail screens. The interface organizes vacancy information and presents the application action within the detail view.'),
        alt: text('Detalhes de uma vaga de Educação na Casa para Idosos Villa 4 Estações, com dados demonstrativos.', 'Details for an Education vacancy at Casa para Idosos Villa 4 Estações, with demo data. Interface in Portuguese.') },
      { asset: 'carely-confirmation', title: text('Confirmação antes do envio', 'Pre-submission confirmation'),
        caption: text('Implementei e refinei modais e o fluxo de candidatura. Este modal reúne os dados para confirmar a intenção antes da ação; a captura não comprova envio nem recebimento pela instituição.', 'I implemented and refined modals and the application flow. This modal gathers information to confirm intent before the action; the screenshot does not establish submission or receipt by an institution.'),
        alt: text('Modal de confirmação para uma vaga de Desenvolvedor Web no Instituto Lar dos Velhinhos; dados demonstrativos diferentes da tela ao fundo.', 'Confirmation modal for a Web Developer vacancy at Instituto Lar dos Velhinhos; demo data differs from the screen behind it. Interface in Portuguese.') },
    ],
    sections: [
      { title: text('O desafio de interface', 'The interface challenge'), text: text(
        'Permitir que a pessoa encontre uma opção, consulte seus detalhes e revise a intenção de candidatura. Esse percurso exige entradas de busca, apresentação de resultados, navegação e confirmação — responsabilidades do frontend que conectei.',
        'Let someone find an option, inspect its details and review application intent. This path requires search inputs, result presentation, navigation and confirmation — frontend responsibilities I connected.') },
      { title: text('Implementação e limites de responsabilidade', 'Implementation and responsibility boundaries'), text: text(
        'Meu trabalho integra descoberta, consulta e apresentação de modais no cliente iOS. Listagens e informações de instituições são evidência complementar de navegação, disponível na Home. O código do projeto é público; a atribuição aqui permanece restrita à contribuição de frontend confirmada.',
        'My work integrates discovery, details and modal presentation in the iOS client. Institution listings and information provide complementary navigation evidence, available on the Home. The project code is public; attribution here remains restricted to the confirmed frontend contribution.') },
    ],
    state: text('Carely está publicado na App Store. As capturas demonstram interfaces de desenvolvimento do meu recorte de contribuição; não foram comparadas com a build atualmente distribuída.', 'Carely is published on the App Store. The screenshots demonstrate development interfaces within my contribution; they have not been compared with the currently distributed build.'),
    limits: [
      text('Os dados demonstrativos não comprovam vagas publicadas pelas instituições.', 'Demo data does not establish that institutions published the vacancies.'),
      text('As imagens não comprovam uma candidatura concluída ou o recebimento por uma instituição.', 'The images do not establish a completed application or receipt by an institution.'),
      text('O produto é resultado da equipe. Este case não atribui a mim a implementação do sistema completo.', 'The product is the team’s work. This case does not attribute implementation of the complete system to me.'),
    ],
    links: [{ label: text('App Store', 'App Store'), url: links.appstore }, { label: text('Repositório da equipe', 'Team repository'), url: links.carely }],
  },
  fintech: {
    id: 'fintech', name: 'Fintech', category: text('Projeto pessoal · iOS + API', 'Personal project · iOS + API'),
    title: text('Sessão, retry e consistência no banco.', 'Sessions, retry and database consistency.'),
    description: text('Um projeto pessoal em desenvolvimento: do cliente SwiftUI à API NestJS e ao PostgreSQL, incluindo falhas de autenticação e criação idempotente de transações.', 'A personal project in development: from the SwiftUI client to the NestJS API and PostgreSQL, including authentication failures and idempotent transaction creation.'),
    context: text('Uma operação financeira não termina no toque. O cliente precisa lidar com credenciais expiradas e tentativas adicionais; a API precisa validar a conta e manter o resultado consistente no banco.', 'A financial operation does not end with a tap. The client must handle expired credentials and additional attempts; the API must validate the account and keep the database result consistent.'),
    role: text('Desenvolvido integralmente por mim: UI iOS, autenticação e sessão, networking, API e persistência. O projeto inclui login/cadastro, Sign in with Apple, refresh, logout e criação de transações.', 'Developed entirely by me: iOS UI, authentication and sessions, networking, API and persistence. The project includes sign-in/sign-up, Sign in with Apple, refresh, logout and transaction creation.'),
    stack: ['SwiftUI', 'Observation', 'URLSession / Foundation', 'Keychain', 'TypeScript', 'NestJS', 'PostgreSQL', 'SQL'],
    scenarioNote: text('As sequências abaixo descrevem comportamento implementado nos repositórios. A visualização interativa da Home é uma representação explicativa: não executa requests reais, não acessa credenciais e não grava transações.', 'The sequences below describe behavior implemented in the repositories. The Home’s interactive visualization is an explanatory representation: it makes no real requests, accesses no credentials and writes no transactions.'),
    scenarios: [
      { title: text('Requisição autenticada', 'Authenticated request'),
        steps: [text('UI iOS', 'iOS UI'), text('Credenciais da sessão', 'Session credentials'), text('APIClient / Bearer', 'APIClient / Bearer'), text('API', 'API'), text('Resposta ao cliente', 'Client response')],
        implementation: text('O APIClient obtém as credenciais da AuthenticationSession e inclui o access token na requisição. URLSession transporta a chamada. As credenciais persistidas ficam no Keychain; a sessão concentra o estado de autenticação.', 'APIClient obtains credentials from AuthenticationSession and includes the access token in the request. URLSession transports the call. Persisted credentials live in Keychain; the session centralizes authentication state.'),
        decision: text('Centralizei a sessão em um actor. Isso fornece um ponto de coordenação para leitura de credenciais, renovação e invalidação, usado também pelos caminhos de falha.', 'I centralized the session in an actor. This provides a coordination point for credential access, renewal and invalidation, also used by failure paths.'),
        references: [{ label: 'APIClient', url: `${ios}Fintech/Networking/APIClient.swift#L94-L145` }, { label: 'KeychainCredentialStore', url: `${ios}Fintech/Authentication/KeychainCredentialStore.swift#L50-L88` }] },
      { title: text('401, refresh compartilhado e retry', '401, shared refresh and retry'),
        steps: [text('401', '401'), text('Refresh coordenado', 'Coordinated refresh'), text('Atualização da sessão', 'Session update'), text('Retry com novo token', 'Retry with new token'), text('Novo 401: invalidação', 'Another 401: invalidation')],
        implementation: text('AuthenticationSession compartilha uma refreshTask entre requisições concorrentes. Após a renovação, APIClient repete a requisição com as credenciais atualizadas. Um segundo 401 invalida a sessão, sem criar um ciclo de retry.', 'AuthenticationSession shares a refreshTask across concurrent requests. After renewal, APIClient repeats the request with updated credentials. A second 401 invalidates the session without creating a retry loop.'),
        decision: text('Guardas de geração da sessão impedem que respostas tardias de login/refresh substituam uma sessão posterior. Esse mecanismo protege a conclusão das operações de autenticação; não é um bloqueio geral de qualquer resposta tardia da API. O retry parte da requisição original, preservando body e headers da operação.', 'Session generation guards prevent late sign-in/refresh responses from replacing a later session. This mechanism protects authentication completion; it does not block every late API response. Retry starts from the original request, preserving the operation’s body and headers.'),
        references: [{ label: 'AuthenticationSession', url: `${ios}Fintech/Authentication/AuthenticationSession.swift#L132-L207` }, { label: 'AuthenticationTests', url: `${ios}FintechTests/Authentication/AuthenticationTests.swift` }] },
      { title: text('Criação de transação e resultado atômico', 'Transaction creation and atomic result'),
        steps: [text('Payload + clientMutationId', 'Payload + clientMutationId'), text('Retry: mesma chave', 'Retry: same key'), text('API / lock transacional', 'API / transaction lock'), text('Ownership da conta', 'Account ownership'), text('Transação + resultado idempotente', 'Transaction + idempotent result'), text('COMMIT no PostgreSQL', 'PostgreSQL COMMIT')],
        implementation: text('O cliente envia clientMutationId e Idempotency-Key. O retry após refresh conserva payload e chave. Na API, TransactionsService usa um lock transacional por usuário e chave, verifica um resultado anterior e valida que a conta pertence ao usuário antes de inserir a transação.', 'The client sends clientMutationId and Idempotency-Key. Retry after refresh keeps the payload and key. In the API, TransactionsService uses a transaction lock per user and key, checks for a previous result and validates that the account belongs to the user before inserting the transaction.'),
        decision: text('A transação financeira e a resposta idempotente são gravadas na mesma transação SQL. Repetir a mesma chave e payload retorna o resultado salvo; reutilizar a chave com outro payload é rejeitado. O lock coordena tentativas concorrentes dessa operação no PostgreSQL.', 'The financial transaction and idempotent response are written in the same SQL transaction. Repeating the same key and payload returns the saved result; reusing the key with another payload is rejected. The lock coordinates concurrent attempts for that operation in PostgreSQL.'),
        references: [{ label: 'TransactionService', url: `${ios}Fintech/Transactions/TransactionService.swift#L17-L25` }, { label: 'TransactionsService', url: `${api}src/modules/transactions/transactions.service.ts#L52-L175` }, { label: 'Integration tests', url: `${api}test/transactions.integration-spec.ts` }] },
    ],
    sections: [
      { title: text('Evidência além da representação', 'Evidence beyond the representation'), text: text('Os repositórios expõem os componentes e testes desses caminhos. Eles permitem inspecionar a coordenação de refresh, a preservação da requisição e o contrato de idempotência. AuthenticationTests inclui concurrentUnauthorizedRequestsShareOneRefresh e authenticatedRequestRefreshesOnceAndPreservesRequest. A validação deste portfólio não equivale a executar o app iOS ou a API em produção.', 'The repositories expose components and tests for these paths. They allow inspection of refresh coordination, request preservation and the idempotency contract. AuthenticationTests includes concurrentUnauthorizedRequestsShareOneRefresh and authenticatedRequestRefreshesOnceAndPreservesRequest. Validating this portfolio does not equate to running the iOS app or API in production.') },
    ],
    state: text('Em desenvolvimento. A evidência é a implementação consultável do cliente, da API e da persistência, incluindo caminhos de erro. Não há claim de plataforma financeira completa ou de prontidão para produção.', 'In development. The evidence is the inspectable client, API and persistence implementation, including error paths. There is no claim of a complete financial platform or production readiness.'),
    limits: [text('Sign in with Apple está implementado; a integração Apple em produção não foi validada neste case.', 'Sign in with Apple is implemented; Apple integration in production has not been validated in this case.'),
      text('A coordenação descrita usa a sessão do cliente e transações PostgreSQL. Não é evidência de escala distribuída ou sincronização offline.', 'The coordination described uses the client session and PostgreSQL transactions. It is not evidence of distributed scale or offline synchronization.')],
    links: [{ label: text('Repositório iOS', 'iOS repository'), url: links.fintechIOS }, { label: text('Repositório API', 'API repository'), url: links.fintechAPI }, { label: text('Documentação', 'Documentation'), url: links.fintechDocs }],
  },
  jordania: {
    id: 'jordania', name: 'Jordania', category: text('Projeto em equipe · iOS + Java', 'Team project · iOS + Java'),
    title: text('Autenticação entre iOS e Java/Spring.', 'Authentication across iOS and Java/Spring.'),
    description: text('Contribuição em equipe: frontend iOS, autenticação e sessão, integração do cliente e participação nas rotas de autenticação Java/Spring.', 'A team contribution: iOS frontend, authentication and sessions, client integration and participation in Java/Spring authentication routes.'),
    context: text('O cliente iOS e o backend Java/Spring precisam concordar sobre entrada, renovação e encerramento de sessão. Este é o recorte de integração demonstrado pelo projeto.', 'The iOS client and Java/Spring backend must agree on sign-in, renewal and session termination. This is the integration scope demonstrated by the project.'),
    role: text('Atuei no frontend/iOS, na camada de autenticação e sessão e na integração do cliente. Também contribuí nas rotas Java/Spring relacionadas à autenticação. A implementação do restante do backend e do produto pertence ao trabalho da equipe.', 'I worked on the iOS frontend, authentication and session layer, and client integration. I also contributed to Java/Spring authentication routes. The rest of the backend and product implementation belongs to the team’s work.'),
    stack: ['SwiftUI', 'Observation', 'AuthenticationServices', 'GoogleSignIn', 'URLSession', 'Keychain', 'Java', 'Spring Boot', 'Spring Security', 'JPA', 'Flyway', 'PostgreSQL'],
    authPath: [text('Apple / Google', 'Apple / Google'), text('Camada de autenticação iOS', 'iOS authentication layer'), text('Sessão do cliente', 'Client session'), text('Backend Java / Spring', 'Java / Spring backend')],
    sections: [
      { title: text('Implementação na fronteira entre as stacks', 'Implementation at the boundary between stacks'), text: text('Login, refresh e logout conectam o ciclo de sessão do cliente às rotas de autenticação da API. AuthenticationServices e GoogleSignIn participam dos fluxos de provedor; URLSession faz a integração HTTP, e Keychain armazena credenciais no cliente. BackendAuthService conecta os endpoints; TokenProvider coordena o token usado pelo cliente.', 'Sign-in, refresh and logout connect the client session lifecycle to the API’s authentication routes. AuthenticationServices and GoogleSignIn participate in provider flows; URLSession handles HTTP integration, and Keychain stores client credentials. BackendAuthService connects the endpoints; TokenProvider coordinates the token used by the client.'), references: [{ label: 'BackendAuthService', url: `${jordaniaIOS}JordaniaTeam/Core/Authentication/BackendAuthService.swift#L58-L119` }, { label: 'TokenProvider', url: `${jordaniaIOS}JordaniaTeam/Core/Authentication/TokenProvider.swift#L45-L106` }, { label: 'AuthController', url: `${jordaniaAPI}backend/api/src/main/java/com/jordania/api/Auth/AuthController.java#L27-L40` }] },
      { title: text('Responsabilidade demonstrada', 'Demonstrated responsibility'), text: text('O código iOS e backend permite consultar a integração de autenticação entre duas stacks. O recorte mostra trabalho nas duas pontas do contrato de sessão, dentro de um projeto em equipe; não atribui a mim todo o backend.', 'The iOS and backend code allows inspection of authentication integration across two stacks. This scope shows work on both ends of the session contract within a team project; it does not attribute the entire backend to me.') },
    ],
    state: text('Projeto em desenvolvimento. Os repositórios documentam login, refresh, logout e os fluxos Apple/Google durante o desenvolvimento. Este case não comprova disponibilidade em produção ou publicação na App Store.', 'Project in development. The repositories document sign-in, refresh, logout and Apple/Google flows during development. This case does not establish production availability or App Store publication.'),
    limits: [text('A presença dos fluxos no código não substitui validação atual com provedores reais. Não há claim de rede social completa ou de produto final.', 'The presence of flows in code does not replace current validation with real providers. There is no claim of a complete social network or finished product.')],
    links: [{ label: text('Repositório iOS', 'iOS repository'), url: links.jordaniaIOS }, { label: text('Repositório backend', 'Backend repository'), url: links.jordaniaAPI }],
  },
};
