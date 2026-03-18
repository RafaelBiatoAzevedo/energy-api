# 📑 Smart Invoice Extractor (NestJS + LLM)

Sistema inteligente para processamento, extração e gestão de faturas de energia elétrica, utilizando Inteligência Artificial para transformar documentos não estruturados (PDF) em dados acionáveis.

---

## 🚀 Tecnologias e Decisões Arquiteturais

A arquitetura foi pensada para ser escalável, tipada e de fácil manutenção.

| Tecnologia         | Escolha                 | Por que?                                                                                               |
| ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| **Framework**      | **NestJS**              | Pela arquitetura modular e injeção de dependência, facilitando testes e organização.                   |
| **Linguagem**      | **TypeScript**          | Segurança de tipos em todo o fluxo, essencial ao lidar com objetos JSON complexos vindos de LLMs.      |
| **ORM**            | **Prisma**              | Agilidade na modelagem de dados e Type Safety nas consultas ao banco de dados.                         |
| **Banco de Dados** | **PostgreSQL**          | Confiabilidade relacional para garantir a integridade dos dados de faturas e clientes.                 |
| **LLM**            | **OpenRouter / OpenAI** | Flexibilidade de trocar entre modelos (GPT-4o, Claude, etc.) sem mudar o código através do OpenRouter. |
| **Validação**      | **Zod**                 | Garantia de que o JSON retornado pela IA segue rigorosamente o contrato de dados esperado.             |

---

## 🏗️ Decisões de Design

- **Validação de Resposta da IA:** LLMs podem sofrer "alucinações". Implementamos uma camada de validação com **Zod** imediatamente após a resposta do LLM. Se a IA omitir um campo ou mudar um tipo de dado, o sistema rejeita a entrada antes que ela chegue ao banco.
- **Transações Atômicas:** No `InvoiceRepository`, o registro da empresa, do cliente e da fatura ocorre dentro de uma `$transaction` do Prisma. Isso evita a criação de dados órfãos caso ocorra uma falha no meio do processo de salvamento.
- **Prompt Engineering:** O prompt enviado ao LLM está configurado para retornar estritamente JSON puro, facilitando o parse e reduzindo drasticamente o consumo de tokens e latência.

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o modelo do arquivo `.env.example` já existente:

```env
# Banco de Dados
DATABASE_URL=

# Inteligência Artificial (OpenRouter)
OPENROUTER_API_KEY=

# Server
PORT=

```

---

## 🛠️ Instalação e Execução

1. **Instalar dependências:**

```bash
yarn

```

2. **Configurar o banco de dados (Migrations):**

```bash
npx prisma migrate dev

```

3. **Executar em modo desenvolvimento:**

```bash
yarn start

```

---

## 🧪 Testes

O projeto conta com uma suíte de testes rigorosa para garantir a integridade do processamento de PDFs e dos cálculos financeiros.

```bash
# Executar todos os testes
yarn test

```

---

## 📡 API Endpoints & Exemplos

### 1. Upload de Fatura (Processamento via IA)

Extrai dados do PDF e persiste no banco de dados.

- **POST** `/invoice/upload`
- **Body**: `multipart/form-data` (arquivo no campo `file`)

### 2. Listagem de Faturas

Filtre e pagine as faturas extraídas.

- **GET** `/invoice?clientNumber=123456&page=1`

### 3. Dashboard

Dados consolidados para visualização de indicadores.

- **GET** `/dashboard`

🌐 Deploy
O projeto está configurado para deploy via Vercel, garantindo baixa latência e alta disponibilidade para o cliente final.
link: https://energy-api-six.vercel.app/docs

Desenvolvido por Rafael Azevedo 🚀
