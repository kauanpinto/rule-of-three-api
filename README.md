# Rule of Three - API

API REST para planejamento financeiro baseada na regra 50/30/20.

## Descrição

A aplicação organiza os gastos do usuário de acordo com sua renda, distribuindo-os entre:

- 50% — Essenciais: despesas necessárias, como moradia, alimentação e transporte.
- 30% — Lazer: gastos pessoais e de entretenimento.
- 20% — Investimentos: reserva financeira e investimentos.

## Índice

1. [Tecnologias](#tecnologias)
2. [Segurança](#seguranca)
3. [Deploy](#deploy)
4. [Requisitos](#requisitos)
5. [Como executar](#como-executar)
6. [Variáveis de ambiente](#variaveis-de-ambiente)
7. [Scripts](#scripts)
8. [Testes](#testes)
9. [Endpoints](#endpoints)
10. [Estrutura do projeto](#estrutura-do-projeto)
11. [Autor](#autor)

## Tecnologias

- [Node.js](https://nodejs.org/) 22.x
- [Express](https://expressjs.com/) ^5.2.1
- [TypeScript](https://www.typescriptlang.org/) ^6.0.3
- [Drizzle ORM](https://orm.drizzle.team/) ^1.0.0-rc.4
- [PostgreSQL](https://www.postgresql.org/) 18
- [Vitest](https://vitest.dev/) ^5.0.0
- [Supertest](https://github.com/ladjs/supertest) ^7.2.2
- [Resend](https://resend.com/) ^6.26.0

<a id="seguranca"></a>

## Segurança

- Senhas com hash via [bcrypt](https://www.npmjs.com/package/bcryptjs)
- Autenticação via [JWT](https://www.jwt.io/) em cookie httpOnly
- [Rate limiting](https://express-rate-limit.mintlify.app/) dedicado por tipo de rota (autenticação, ações de conta, rotas públicas sensíveis)
- Tokens de redefinição de senha com hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2), expiração de 1 hora e uso único
- Prevenção de enumeração de contas no fluxo de recuperação de senha
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) restrito à origem do frontend
- Headers de segurança via [Helmet](https://helmet.js.org/)
- Classes de erro customizadas para respostas HTTP consistentes

## Deploy

A API está hospedada na [Render](https://render.com/) e utiliza [Neon](https://neon.tech/) como banco de dados.

**URL do projeto**: https://ruleof3-api.onrender.com

> `trust proxy` habilitado, já que a [Render](https://render.com/) opera atrás de um proxy reverso — necessário para o rate limiting identificar corretamente o IP de cada cliente.

## Requisitos

- [Node.js](https://nodejs.org/) 22.x
- Conta na [Neon](https://neon.tech/)
- Conta na [Resend](https://resend.com/)

> Para executar os testes, é necessário também um banco separado na [Neon](https://neon.tech/).

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

<a id="variaveis-de-ambiente"></a>

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL |
| `JWT_SECRET` | Chave usada para assinar os JWTs |
| `RESEND_API_KEY` | Chave da API do Resend |
| `FRONTEND_URL` | URL do frontend, usada no CORS e nos links de redefinição de senha |
| `PORT` | Porta do servidor (padrão: 3000) |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa a versão compilada |
| `npm run typecheck` | Verifica os tipos |
| `npm run test` | Executa os testes |
| `npm run format` | Formata o código |
| `npm run format:check` | Verifica se o código está formatado |

## Testes

O projeto usa [Vitest](https://vitest.dev/) e [Supertest](https://github.com/ladjs/supertest) para os testes.

### Configuração

1. Crie uma branch dedicada aos testes no Neon e configure:

```bash
cp .env.example .env.test
```

2. Aplique as migrations:

```bash
NODE_ENV=test npx drizzle-kit migrate
```

3. Execute os testes:

```bash
npm run test
```

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um usuário |
| POST | `/auth/login` | Autentica o usuário |
| POST | `/auth/logout` | Encerra a sessão |
| PATCH | `/auth/change-password` | Altera a senha |
| POST | `/auth/forgot-password` | Solicita redefinição de senha |
| POST | `/auth/reset-password` | Redefine a senha |

### Usuário

| Método | Rota | Descrição |
|---|---|---|
| PATCH | `/users/me` | Atualiza nome e/ou renda |
| DELETE | `/users/me` | Exclui a conta |

### Gastos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/expenses` | Cria um gasto |
| GET | `/expenses` | Lista os gastos |
| PATCH | `/expenses/:id` | Atualiza um gasto |
| DELETE | `/expenses/:id` | Remove um gasto |

### Dashboard

| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/summary` | Retorna o resumo 50/30/20 |

## Estrutura do projeto

```text
src/
├── app.ts          # Configuração do Express
├── server.ts       # Inicialização do servidor
├── config/         # Configurações
├── controllers/    # Requisições e respostas HTTP
├── db/             # Banco de dados e schemas
├── errors/         # Erros customizados
├── lib/            # Integrações externas
├── middlewares/    # Middlewares
├── repositories/   # Acesso ao banco de dados
├── routes/         # Rotas
├── schemas/        # Validação com Zod
├── services/       # Regras de negócio
└── types/          # Tipos globais
```

## Autor

**Kauan Fernando**
