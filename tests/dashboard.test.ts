import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '@/app.js';
import { db } from '@/db/client.js';
import { users, expenses } from '@/db/schema.js';
import { registerAndLogin } from './helpers.js';

describe('GET /dashboard/summary', () => {
  beforeEach(async () => {
    await db.delete(expenses);
    await db.delete(users);
  });

  it('deve calcular o resumo 50/30/20 corretamente', async () => {
    const cookie = await registerAndLogin();

    await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto essencial',
      amount: 1000,
      category: 'ESSENTIALS',
    });

    await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto lazer',
      amount: 500,
      category: 'LEISURE',
    });

    const response = await request(app).get('/dashboard/summary').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body.income).toBe(3000);
    expect(response.body.breakdown.ESSENTIALS.limit).toBe(1500);
    expect(response.body.breakdown.ESSENTIALS.spent).toBe(1000);
    expect(response.body.breakdown.LEISURE.limit).toBe(900);
    expect(response.body.breakdown.LEISURE.spent).toBe(500);
    expect(response.body.breakdown.INVESTMENT.limit).toBe(600);
    expect(response.body.breakdown.INVESTMENT.spent).toBe(0);
  });

  it('deve calcular o resumo 50/30/20 corretamente mesmo sem gastos', async () => {
    const cookie = await registerAndLogin('test2@test.com');

    const response = await request(app).get('/dashboard/summary').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body.income).toBe(3000);
    expect(response.body.breakdown.ESSENTIALS.limit).toBe(1500);
    expect(response.body.breakdown.ESSENTIALS.spent).toBe(0);
    expect(response.body.breakdown.LEISURE.limit).toBe(900);
    expect(response.body.breakdown.LEISURE.spent).toBe(0);
    expect(response.body.breakdown.INVESTMENT.limit).toBe(600);
    expect(response.body.breakdown.INVESTMENT.spent).toBe(0);
  });

  it('deve retornar o gasto maior que o limite da regra 50/30/20', async () => {
    const cookie = await registerAndLogin('test3@test.com');

    await request(app).post('/expenses').set('Cookie', cookie).send({
      title: 'Gasto essencial',
      amount: 2000,
      category: 'ESSENTIALS',
    });

    const response = await request(app).get('/dashboard/summary').set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body.income).toBe(3000);
    expect(response.body.breakdown.ESSENTIALS.limit).toBe(1500);
    expect(response.body.breakdown.ESSENTIALS.spent).toBe(2000);
    expect(response.body.breakdown.LEISURE.limit).toBe(900);
    expect(response.body.breakdown.LEISURE.spent).toBe(0);
    expect(response.body.breakdown.INVESTMENT.limit).toBe(600);
    expect(response.body.breakdown.INVESTMENT.spent).toBe(0);
  });

  it('deve retornar 401 se o usuário não estiver autenticado', async () => {
    const response = await request(app).get('/dashboard/summary');

    expect(response.status).toBe(401);
  });
});
