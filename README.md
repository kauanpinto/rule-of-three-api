# Rule of Three - API

> Backend completo e testado. Deploy em andamento.

API REST para planejamento financeiro baseada na regra 50/30/20.

## Descrição

A aplicação organiza os gastos do usuário de acordo com sua renda, distribuindo-os entre:

- 50% — Essenciais: despesas necessárias, como moradia, alimentação e transporte.
- 30% — Lazer: gastos pessoais e de entretenimento.
- 20% — Investimentos: reserva financeira e investimentos.

## Índice
- [Tecnologias](#tecnologias)
- [Segurança](#segurança)
- [Requisitos](#requisitos)
- [Como executar](#como-executar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Testes](#testes)
- [Endpoints](#endpoints)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Autor](#autor)

## Tecnologias

- [Node.js](https://nodejs.org/) 22.x
- [Express](https://expressjs.com/) ^5.2.1
- [TypeScript](https://www.typescriptlang.org/) ^6.0.3
- [Drizzle ORM](https://orm.drizzle.team/) ^1.0.0-rc.4
- [PostgreSQL](https://www.postgresql.org/) 18
- [Vitest](https://vitest.dev/) ^5.0.0
- [Supertest](https://github.com/ladjs/supertest) ^7.2.2
- [Resend](https://resend.com/) ^6.26.0

## Segurança

- Senhas com hash via bcrypt (custo configurável, reduzido automaticamente em ambiente de teste)
- Autenticação via JWT em cookie httpOnly (proteção contra XSS)
- Rate limiting dedicado por tipo de rota (autenticação, ações de conta, rotas públicas sensíveis)
- Tokens de redefinição de senha com hash SHA-256, expiração de 1 hora e uso único
- Prevenção de enumeração de contas: `/auth/forgot-password` sempre responde de forma genérica, independente do email existir
- CORS restrito à origem do frontend
- Headers de segurança via Helmet
- Classes de erro customizadas para respostas HTTP consistentes e previsíveis

## Requisitos

- [Node.js](https://nodejs.org/) 22.x
- [npm](https://www.npmjs.com/)
- Conta na [Neon](https://neon.tech/)
- Uma segunda branch no Neon, dedicada a testes (opcional, só necessário se for rodar a suíte de testes)
- Conta na [Resend](https://resend.com/)

## Como executar

1. Clone o repositório:

```bash
git clone https://github.com/kauanpinto/rule-of-three-api.git
cd rule-of-three-api
```

2. Instalar as dependências:

```bash
npm install
```

3. Configurar as variáveis de ambiente:

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.example .env
```

4. Executar as migrações no banco:

```bash
npx drizzle-kit migrate
```

5. Executar o projeto:

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000`

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do banco PostgreSQL (Neon) |
| `JWT_SECRET` | Chave usada para assinar os tokens JWT |
| `RESEND_API_KEY` | Chave da API do Resend, para envio de emails |
| `FRONTEND_URL` | URL do frontend, usada no CORS e nos links de redefinição de senha |
| `PORT` | Porta em que o servidor roda (padrão: 3000) |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor em modo desenvolvimento, com reload automático |
| `npm run build` | Compila o TypeScript para JavaScript (pasta `dist/`) |
| `npm start` | Executa a versão compilada (produção, requer `npm run build` antes) |
| `npm run typecheck` | Verifica erros de tipo sem gerar arquivos |
| `npm run test` | Roda a suíte de testes automatizados |
| `npm run format` | Formata todo o código com Prettier |
| `npm run format:check` | Verifica se o código está formatado, sem alterar arquivos |

## Testes

O projeto usa [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest) para testes de integração dos endpoints.

### Configuração

Os testes rodam contra um banco separado do de desenvolvimento, para evitar apagar ou corromper dados reais.

1. No dashboard do Neon, crie uma branch dedicada a testes (ex: `test`)

2. Copie o arquivo de exemplo e preencha com a string da branch de teste:

```bash
cp .env.example .env.test
```

3. Aplique as migrations nela:

```bash
NODE_ENV=test npx drizzle-kit migrate
```

4. Executando:

```bash
npm run test
```

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um novo usuário |
| POST | `/auth/login` | Autentica o usuário e retorna um cookie de sessão |
| POST | `/auth/logout` | Encerra a sessão do usuário, removendo o cookie |
| PATCH | `/auth/change-password` | Altera a senha do usuário autenticado (exige senha atual) |
| POST | `/auth/forgot-password` | Envia o link de redefinição de senha |
| POST | `/auth/reset-password` | Altera a senha do usuário existente não autenticado |

### Usuário

| Método | Rota | Descrição |
|---|---|---|
| PATCH | `/users/me` | Atualiza nome e/ou renda do usuário autenticado |
| DELETE | `/users/me` | Exclui a conta do usuário autenticado (exige senha) |

### Gastos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/expenses` | Cria um novo gasto |
| GET | `/expenses` | Lista os gastos do usuário autenticado |
| PATCH | `/expenses/:id` | Atualiza parcialmente um gasto do usuário autenticado |
| DELETE | `/expenses/:id` | Remove um gasto do usuário autenticado |

### Dashboard

| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/summary` | Retorna o resumo 50/30/20 do usuário autenticado |

## Estrutura do projeto

```text
src/
├── app.ts          # Configuração do Express (middlewares e rotas)
├── server.ts       # Ponto de entrada, inicia o servidor
├── config/         # Configurações do projeto
├── controllers/    # Lida com request/response HTTP
├── db/             # Configuração do banco e schema
├── errors/         # Classes de erro customizadas
├── lib/            # Integrações externas (email)
├── middlewares/    # Autenticação e rate limiting
├── repositories/   # Acesso ao banco de dados
├── routes/         # Definição das rotas da API
├── schemas/        # Validação de dados com Zod
├── services/       # Regras de negócio
└── types/          # Definições de tipos globais (ex: Express Request)
```

## Autor

**Kauan Fernando**
