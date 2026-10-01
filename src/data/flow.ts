export type Locale = "pt" | "en";
type Text = Record<Locale, string>;
export type FlowNode = "ios" | "session" | "api" | "database" | "keychain";
export type FlowLink =
  "client-session" | "session-api" | "api-database" | "keychain-session";
type FlowStep = {
  title: Text;
  description: Text;
  nodes: FlowNode[];
  links: FlowLink[];
  reverseLinks?: FlowLink[];
  badge: string;
};
export type FlowScenario = {
  id: string;
  title: Text;
  insight: Text;
  steps: FlowStep[];
};

export const flowScenarios: FlowScenario[] = [
  {
    id: "authenticated",
    title: { pt: "Requisição autenticada", en: "Authenticated request" },
    insight: {
      pt: "A interface inicia a operação. A sessão conecta credenciais, rede e resposta, sem espalhar essa responsabilidade pelas telas.",
      en: "The interface starts the operation. The session connects credentials, networking and the response, keeping that responsibility out of individual screens.",
    },
    steps: [
      {
        title: {
          pt: "Uma ação na interface",
          en: "An action in the interface",
        },
        description: {
          pt: "O fluxo começa no iOS: a interface solicita uma operação e acompanha seu estado.",
          en: "The flow starts in iOS: the interface requests an operation and follows its state.",
        },
        nodes: ["ios"],
        links: [],
        badge: "iOS",
      },
      {
        title: {
          pt: "Credenciais na sessão",
          en: "Credentials in the session",
        },
        description: {
          pt: "AuthenticationSession coordena o acesso às credenciais armazenadas no Keychain para enviar a requisição autenticada.",
          en: "AuthenticationSession coordinates access to credentials stored in Keychain to send the authenticated request.",
        },
        nodes: ["session", "keychain"],
        links: ["client-session", "keychain-session"],
        badge: "Keychain",
      },
      {
        title: {
          pt: "A API recebe a operação",
          en: "The API receives the operation",
        },
        description: {
          pt: "O networking envia a requisição à API NestJS, que valida a autenticação antes de processar a operação.",
          en: "Networking sends the request to the NestJS API, which validates authentication before processing the operation.",
        },
        nodes: ["api"],
        links: ["session-api"],
        badge: "REST API",
      },
      {
        title: { pt: "Dados consistentes", en: "Consistent data" },
        description: {
          pt: "A API conecta a operação aos dados no PostgreSQL. A interface não acessa o banco diretamente.",
          en: "The API connects the operation to data in PostgreSQL. The interface does not access the database directly.",
        },
        nodes: ["api", "database"],
        links: ["api-database"],
        badge: "PostgreSQL",
      },
      {
        title: {
          pt: "A resposta volta à interface",
          en: "The response returns to the interface",
        },
        description: {
          pt: "O resultado retorna pela camada de rede. O iOS atualiza o estado apresentado na interface.",
          en: "The result returns through the networking layer. iOS updates the state presented in the interface.",
        },
        nodes: ["ios", "session"],
        links: ["session-api", "client-session"],
        reverseLinks: ["session-api", "client-session"],
        badge: "iOS",
      },
    ],
  },
  {
    id: "refresh",
    title: {
      pt: "401 e refresh coordenado",
      en: "401 and coordinated refresh",
    },
    insight: {
      pt: "Requisições concorrentes compartilham a mesma promessa de refresh em andamento. Cada uma retoma seu próprio fluxo após a renovação.",
      en: "Concurrent requests share the same refresh promise while it is in progress. Each resumes its own flow after renewal.",
    },
    steps: [
      {
        title: { pt: "A requisição sai do iOS", en: "The request leaves iOS" },
        description: {
          pt: "A sessão envia uma requisição com as credenciais disponíveis.",
          en: "The session sends a request with the available credentials.",
        },
        nodes: ["ios", "session"],
        links: ["client-session", "session-api"],
        badge: "Authorization",
      },
      {
        title: { pt: "A API responde 401", en: "The API responds with 401" },
        description: {
          pt: "A resposta não autorizada volta para a sessão. A recuperação fica concentrada nessa camada.",
          en: "The unauthorized response returns to the session. Recovery is concentrated in this layer.",
        },
        nodes: ["api", "session"],
        links: ["session-api"],
        reverseLinks: ["session-api"],
        badge: "401",
      },
      {
        title: { pt: "Uma renovação compartilhada", en: "One shared refresh" },
        description: {
          pt: "Se um refresh já está em andamento, outras requisições aguardam sua promessa. Isso evita iniciar uma renovação para cada 401 concorrente.",
          en: "If a refresh is already in progress, other requests await its promise. This avoids starting a separate renewal for every concurrent 401.",
        },
        nodes: ["session", "api"],
        links: ["session-api"],
        badge: "shared refresh",
      },
      {
        title: { pt: "Credenciais atualizadas", en: "Updated credentials" },
        description: {
          pt: "Após uma renovação válida, as credenciais atualizadas são armazenadas no Keychain.",
          en: "After a valid renewal, the updated credentials are stored in Keychain.",
        },
        nodes: ["session", "keychain"],
        links: ["keychain-session"],
        reverseLinks: ["keychain-session"],
        badge: "Keychain",
      },
      {
        title: { pt: "A requisição é repetida", en: "The request is retried" },
        description: {
          pt: "A sessão repete a requisição com as novas credenciais. A tela continua acompanhando a mesma operação.",
          en: "The session retries the request with the new credentials. The screen continues following the same operation.",
        },
        nodes: ["session", "api"],
        links: ["session-api"],
        badge: "retry",
      },
      {
        title: { pt: "O fluxo continua", en: "The flow continues" },
        description: {
          pt: "A resposta volta ao iOS e atualiza o estado da interface.",
          en: "The response returns to iOS and updates the interface state.",
        },
        nodes: ["ios", "session"],
        links: ["client-session"],
        reverseLinks: ["client-session"],
        badge: "iOS",
      },
    ],
  },
  {
    id: "idempotency",
    title: { pt: "Retry com a mesma chave", en: "Retry with the same key" },
    insight: {
      pt: "A chave identifica a operação lógica, não cada tentativa de rede. Preservá-la no retry permite tratar a repetição sem representar uma nova intenção de criar uma transação.",
      en: "The key identifies the logical operation, rather than each network attempt. Preserving it on retry lets a repeated request be handled without representing a new intention to create a transaction.",
    },
    steps: [
      {
        title: { pt: "Uma intenção, uma chave", en: "One intention, one key" },
        description: {
          pt: "A criação de uma transação recebe uma Idempotency-Key associada àquela operação lógica.",
          en: "Transaction creation receives an Idempotency-Key associated with that logical operation.",
        },
        nodes: ["ios", "session"],
        links: ["client-session"],
        badge: "Idempotency-Key",
      },
      {
        title: { pt: "Primeira tentativa", en: "First attempt" },
        description: {
          pt: "A camada de rede envia a operação com sua chave e as credenciais da sessão.",
          en: "The networking layer sends the operation with its key and the session credentials.",
        },
        nodes: ["session", "api"],
        links: ["session-api"],
        badge: "Idempotency-Key",
      },
      {
        title: {
          pt: "401 interrompe a tentativa",
          en: "401 interrupts the attempt",
        },
        description: {
          pt: "A API responde 401. A operação mantém sua identidade enquanto a sessão recupera a autenticação.",
          en: "The API responds with 401. The operation retains its identity while the session recovers authentication.",
        },
        nodes: ["api", "session"],
        links: ["session-api"],
        reverseLinks: ["session-api"],
        badge: "401",
      },
      {
        title: {
          pt: "A sessão renova as credenciais",
          en: "The session renews credentials",
        },
        description: {
          pt: "O refresh coordenado renova as credenciais. A chave da operação é preservada.",
          en: "Coordinated refresh renews credentials. The operation key is preserved.",
        },
        nodes: ["session", "keychain", "api"],
        links: ["session-api", "keychain-session"],
        reverseLinks: ["keychain-session"],
        badge: "Idempotency-Key",
      },
      {
        title: { pt: "Retry, mesma operação", en: "Retry, same operation" },
        description: {
          pt: "A nova tentativa usa a mesma Idempotency-Key. A API pode reconhecer a repetição da operação.",
          en: "The new attempt uses the same Idempotency-Key. The API can recognize the repeated operation.",
        },
        nodes: ["session", "api"],
        links: ["session-api"],
        badge: "Idempotency-Key",
      },
      {
        title: {
          pt: "Consistência no banco",
          en: "Consistency in the database",
        },
        description: {
          pt: "A idempotência e a consistência no PostgreSQL trabalham juntas no registro da transação. Esse mecanismo não é uma garantia global de execução exatamente uma vez.",
          en: "Idempotency and PostgreSQL consistency work together when recording the transaction. This mechanism is not a global exactly-once execution guarantee.",
        },
        nodes: ["api", "database"],
        links: ["api-database"],
        badge: "PostgreSQL",
      },
    ],
  },
];

export const normalizeStep = (index: number, count: number) =>
  Math.max(0, Math.min(index, count - 1));
