import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '@/app.js';
import { db } from '@/db/client.js';
import { users, expenses } from '@/db/schema.js';
import { registerAndLogin } from './helpers.js';

describe('POST /expenses', () => {
  beforeEach(async () => {
    await db.delete(expenses);
    await db.delete(users);
  });

  it('deve criar um gasto com dados válidos', async () => {
    const cookie = await registerAndLogin();

    const response = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Teste',
      description: 'teste',
      amount: 1000,
      category: 'LEISURE',
    });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Teste');
    expect(response.body.description).toBe('teste');
    expect(response.body.amount).toBe('1000.00');
    expect(response.body.category).toBe('LEISURE');
    expect(response.body.userId).toBeDefined();
  });

  it('deve criar um gasto com dados válidos com a descrição opcional', async () => {
    const cookie = await registerAndLogin('test2@test.com');

    const response = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Teste2',
      amount: 1000,
      category: 'LEISURE',
    });

    expect(response.status).toBe(201);
  });

  it('deve retornar 400 se o título for muito curto', async () => {
    const cookie = await registerAndLogin('test3@test.com');

    const response = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: '',
      description: 'teste',
      amount: 1000,
      category: 'LEISURE',
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se o gasto for negativo', async () => {
    const cookie = await registerAndLogin('test4@test.com');

    const response = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Teste4',
      description: 'teste',
      amount: -100,
      category: 'LEISURE',
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se a categoria não existir', async () => {
    const cookie = await registerAndLogin('test5@test.com');

    const response = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Teste5',
      description: 'teste',
      amount: 1000,
      category: 'CATEGORIAINVALIDA',
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 401 se não estiver autenticado', async () => {
    const response = await request(app).post('/expenses').send({
      title: 'Teste6',
      description: 'teste',
      amount: 1000,
      category: 'LEISURE',
    });

    expect(response.status).toBe(401);
  });
});

describe('GET /expenses', () => {
  beforeEach(async () => {
    await db.delete(expenses);
    await db.delete(users);
  });

  it('deve listar os gastos do usuário autenticado', async () => {
    const cookie = await registerAndLogin();

    await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto 1',
      amount: 100,
      category: 'ESSENTIALS',
    });

    await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto 2',
      amount: 200,
      category: 'LEISURE',
    });

    const response = await request(app).get('/expenses').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('deve listar um array vazio do usuário autenticado', async () => {
    const cookie = await registerAndLogin('test2@test.com');
    const response = await request(app).get('/expenses').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it('deve listar os gastos do usuário autenticado, não de outros', async () => {
    const cookie = await registerAndLogin('test3a@test.com');
    const cookie2 = await registerAndLogin('test3b@test.com');

    await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto A1',
      amount: 100,
      category: 'ESSENTIALS',
    });

    await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto A2',
      amount: 200,
      category: 'LEISURE',
    });

    await request(app).post('/expenses').set('Cookie', cookie2).send({
      title: 'Gasto B1',
      amount: 100,
      category: 'ESSENTIALS',
    });

    await request(app).post('/expenses').set('Cookie', cookie2).send({
      title: 'Gasto B2',
      amount: 200,
      category: 'LEISURE',
    });

    const response = await request(app).get('/expenses').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('deve retonar 401 se o usuário não estiver autenticado', async () => {
    const response = await request(app).get('/expenses');

    expect(response.status).toBe(401);
  });
});

describe('PATCH /expenses/:id', () => {
  beforeEach(async () => {
    await db.delete(expenses);
    await db.delete(users);
  });

  it('deve atualizar o gasto do usuário autenticado', async () => {
    const cookie = await registerAndLogin();

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).patch(`/expenses/${id}`).set('Cookie', cookie).send({
      title: 'Gasto atualizado',
      amount: 200,
      category: 'INVESTMENT',
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Gasto atualizado');
    expect(response.body.amount).toBe('200.00');
    expect(response.body.category).toBe('INVESTMENT');
    expect(response.body.userId).toBeDefined();
    expect(response.body.id).toBeDefined();
  });

  it('deve atualizar o gasto parcialmente do usuário autenticado', async () => {
    const cookie = await registerAndLogin('test2@test.com');

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).patch(`/expenses/${id}`).set('Cookie', cookie).send({
      title: 'Gasto atualizado',
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Gasto atualizado');
    expect(response.body.amount).toBe('100.00');
    expect(response.body.category).toBe('LEISURE');
    expect(response.body.userId).toBeDefined();
    expect(response.body.id).toBeDefined();
  });

  it('deve retornar 404 se o id for inexistente', async () => {
    const cookie = await registerAndLogin('test3@test.com');

    const idInexistente = '00000000-0000-0000-0000-000000000000';

    const response = await request(app)
      .patch(`/expenses/${idInexistente}`)
      .set('Cookie', cookie)
      .send({
        title: 'Gasto atualizado',
      });

    expect(response.status).toBe(404);
  });

  it('deve retornar 404 se tentar atualizar o gasto de outro usuário', async () => {
    const cookieA = await registerAndLogin('test4@test.com');
    const cookieB = await registerAndLogin('test4b@test.com');

    const spentA = await request(app).post('/expenses').set('Cookie', cookieA).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spentA.body.id;

    const response = await request(app).patch(`/expenses/${id}`).set('Cookie', cookieB).send({
      title: 'Gasto atualizado',
    });

    expect(response.status).toBe(404);
  });

  it('deve retornar 401 se o usuário não estiver autenticado', async () => {
    const cookie = await registerAndLogin('test5@test.com');

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).patch(`/expenses/${id}`).send({
      title: 'Gasto atualizado',
      amount: 200,
      category: 'INVESTMENT',
    });

    expect(response.status).toBe(401);
  });

  it('deve retornar 400 se o título for muito curto', async () => {
    const cookie = await registerAndLogin('test6@test.com');

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).patch(`/expenses/${id}`).set('Cookie', cookie).send({
      title: '',
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se a categoria não existir', async () => {
    const cookie = await registerAndLogin('test7@test.com');

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).patch(`/expenses/${id}`).set('Cookie', cookie).send({
      category: 'CATEGORIAINVALIDA',
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se o gasto for negativo', async () => {
    const cookie = await registerAndLogin('test6@test.com');

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).patch(`/expenses/${id}`).set('Cookie', cookie).send({
      amount: -100,
    });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /expenses/:id', () => {
  beforeEach(async () => {
    await db.delete(expenses);
    await db.delete(users);
  });

  it('deve deletar o gasto do usuário autenticado', async () => {
    const cookie = await registerAndLogin();

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).delete(`/expenses/${id}`).set('Cookie', cookie);

    const listExpenses = await request(app).get('/expenses').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Gasto deletado com sucesso');
    expect(listExpenses.body).toHaveLength(0);
  });

  it('deve retornar 404 se tentar deletar o gasto de outro usuário', async () => {
    const cookieA = await registerAndLogin('test2@test.com');
    const cookieB = await registerAndLogin('test2b@test.com');

    const spentA = await request(app).post('/expenses').set('Cookie', cookieA).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spentA.body.id;

    const response = await request(app).delete(`/expenses/${id}`).set('Cookie', cookieB);

    expect(response.status).toBe(404);
  });

  it('deve retornar 404 se o id for inexistente', async () => {
    const cookie = await registerAndLogin('test3@test.com');

    const idInexistente = '00000000-0000-0000-0000-000000000000';

    const response = await request(app).delete(`/expenses/${idInexistente}`).set('Cookie', cookie);

    expect(response.status).toBe(404);
  });

  it('deve retornar 401 se o usuário não estiver autenticado', async () => {
    const cookie = await registerAndLogin('test4@test.com');

    const spent = await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto',
      amount: 100,
      category: 'LEISURE',
    });

    const id = spent.body.id;

    const response = await request(app).delete(`/expenses/${id}`);

    expect(response.status).toBe(401);
  });
});
