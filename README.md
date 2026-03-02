📑 Smart Invoice Extractor (NestJS + LLM)
  Sistema inteligente para processamento, extração e gestão de faturas de energia elétrica, utilizando Inteligência Artificial para transformar documentos não estruturados (PDF) em dados acionáveis.

🚀 Tecnologias e Decisões Arquiteturais
  A arquitetura foi pensada para ser escalável, tipada e de fácil manutenção.

🏗️ Decisões de Design
  Validação de Resposta da IA: LLMs podem sofrer "alucinações". Implementamos uma camada de validação com Zod imediatamente após a resposta do LLM. Se a IA omitir um campo obrigatório ou mudar o tipo do dado,
  o sistema rejeita a entrada antes que ela chegue ao banco.
  
  Transações Atômicas: No InvoiceRepository, o registro da empresa, do cliente e da fatura ocorre dentro de uma $transaction do Prisma. Isso evita dados órfãos se houver falha no meio do processo.
  
  Prompt Engineering: O prompt enviado ao LLM está configurado para retornar apenas JSON puro, facilitando o parse e reduzindo o consumo de tokens.


Tecnologia - Escolha - Por que?

Framework -	NestJS -	Pela arquitetura modular e injeção de dependência, facilitando testes e organização.
Linguagem	- TypeScript -	Segurança de tipos em todo o fluxo, essencial ao lidar com objetos JSON complexos vindos de LLMs.
ORM -	Prisma - Agilidade na modelagem de dados e Type Safety nas consultas ao banco de dados.
Banco de Dados -	PostgreSQL -Confiabilidade relacional para garantir a integridade dos dados de faturas e clientes.
LLM -	OpenRouter / OpenAI -	Utilizado para processamento de linguagem natural (NLP). O OpenRouter foi escolhido pela flexibilidade de trocar entre modelos (GPT-4o, Claude, etc.) sem mudar o código.
Validação	Zod	Garantia de que o JSON retornado pela IA segue rigorosamente o contrato de dados esperado antes de salvar no banco.

⚙️ Configuração do Ambiente
  Crie um arquivo .env na raiz do projeto com as seguintes chaves:
  obs: existe um .env.example na raiz do projeto

  - Banco de Dados
    DATABASE_URL="postgresql://user:password@localhost:5432/invoice_db?schema=public"
  
  - Inteligência Artificial
    # Se usar OpenRouter:
    OPENROUTER_API_KEY=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
    
    # Server
    PORT=3000



🛠️ Instalação e Execução
  1 - Instalar dependências:
    yarn
  
  2 - Configurar o banco de dados (Migrations):
    npx prisma migrate dev
    
  3 - Executar em modo desenvolvimento:
    yarn start
  

🧪 Testes
  O projeto conta com uma suíte de testes rigorosa para garantir que o processamento de PDFs e cálculos financeiros não quebrem.
    yarn test
  

📡 API Endpoints & Exemplos
1 - Upload de Fatura (Processamento via IA)
  POST /invoice/upload

2 - Listagem de Faturas
  GET /invoice?clientNumber=123456&page=1

3 - Dashboard
  GET /dashboard
