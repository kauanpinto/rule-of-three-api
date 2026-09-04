# Rule of Three - API

**⚠ PROJETO EM DESENVOLVIMENTO!**

API REST para planejamento financeiro baseada na regra 50/30/20.

## Descrição

A aplicação organiza os gastos do usuário de acordo com sua renda, distribuindo-os entre:

- 50% — Essenciais: despesas necessárias, como moradia, alimentação e transporte.
- 30% — Lazer: gastos pessoais e de entretenimento.
- 20% — Investimentos: reserva financeira e investimentos.

## Tecnologias

- [Node.js](https://nodejs.org/) 22.x
- [Express](https://expressjs.com/) ^5
- [TypeScript](https://www.typescriptlang.org/) ^6
- [Drizzle ORM](https://orm.drizzle.team/) 1.0.0-rc.4
- [PostgreSQL](https://www.postgresql.org/) 18

## Requisitos

- Node.js 22.x
- npm
- Conta na [Neon](https://neon.tech/)

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

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um novo usuário |
| POST | `/auth/login` | Autentica o usuário e retorna um cookie de sessão |
| POST | `/auth/logout` | Encerra a sessão do usuário, removendo o cookie |
| POST | `/expenses` | Cria um novo gasto |
| GET | `/expenses` | Lista os gastos do usuário autenticado |

## Autor

**Kauan Fernando**
