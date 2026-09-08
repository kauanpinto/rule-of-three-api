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
- [Vitest](https://vitest.dev/) ^5.0.0
- [Supertest](https://github.com/ladjs/supertest) ^7.2.2

## Requisitos

- Node.js 22.x
- npm
- Conta na [Neon](https://neon.tech/)
- Uma segunda branch no Neon, dedicada a testes (opcional, só necessário se for rodar a suíte de testes)

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

O projeto usa Vitest + Supertest para testes de integração dos endpoints.

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

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um novo usuário |
| POST | `/auth/login` | Autentica o usuário e retorna um cookie de sessão |
| POST | `/auth/logout` | Encerra a sessão do usuário, removendo o cookie |
| PATCH | `/auth/change-password` | Altera a senha do usuário autenticado (exige senha atual) |
| POST | `/expenses` | Cria um novo gasto |
| GET | `/expenses` | Lista os gastos do usuário autenticado |
| PATCH | `/expenses/:id` | Atualiza parcialmente um gasto do usuário autenticado |
| DELETE | `/expenses/:id` | Remove um gasto do usuário autenticado |
| GET | `/dashboard/summary` | Retorna o resumo 50/30/20 do usuário autenticado |

## Autor

**Kauan Fernando**
