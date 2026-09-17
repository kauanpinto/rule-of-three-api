import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import app from '@/app.js';
import { db } from '@/db/client.js';
import { users } from '@/db/schema.js';
import * as emailLib from '@/lib/email.js';
import { createTestSession } from './helpers.js';

describe('PATCH /users/me', () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  it('deve atualizar apenas o nome', async () => {
    const cookie = await createTestSession();

    const response = await request(app)
      .patch('/users/me')
      .set('Cookie', cookie)
      .send({ name: 'Nome Atualizado' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Nome Atualizado');
  });

  it('deve atualizar apenas a renda', async () => {
    const cookie = await createTestSession('test2@test.com');

    const response = await request(app)
      .patch('/users/me')
      .set('Cookie', cookie)
      .send({ income: 5000 });

    expect(response.status).toBe(200);
    expect(response.body.income).toBe('5000.00');
  });

  it('deve retornar 400 se nenhum campo for enviado', async () => {
    const cookie = await createTestSession('test3@test.com');

    const response = await request(app).patch('/users/me').set('Cookie', cookie).send({});

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se o nome for muito curto', async () => {
    const cookie = await createTestSession('test4@test.com');

    const response = await request(app)
      .patch('/users/me')
      .set('Cookie', cookie)
      .send({ name: 'T' });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se a renda não for positiva', async () => {
    const cookie = await createTestSession('test5@test.com');

    const response = await request(app)
      .patch('/users/me')
      .set('Cookie', cookie)
      .send({ income: -100 });

    expect(response.status).toBe(400);
  });

  it('deve retornar 401 se o usuário não estiver autenticado', async () => {
    const response = await request(app).patch('/users/me').send({ name: 'Sem Login' });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /users/me', () => {
  beforeEach(async () => {
    await db.delete(users);
    vi.spyOn(emailLib, 'sendWelcomeEmail').mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve excluir o usuário existente com sucesso', async () => {
    const cookie = await createTestSession();

    const response = await request(app).delete('/users/me').set('Cookie', cookie).send({
      password: 'teste123',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Conta deletada com sucesso');
  });

  it('deve retornar 401 se a senha estiver errada', async () => {
    const cookie = await createTestSession('test2@test.com');

    const response = await request(app).delete('/users/me').set('Cookie', cookie).send({
      password: 'senhaErrada',
    });

    expect(response.status).toBe(401);
  });

  it('deve retornar 401 se o usuário não estiver autenticado', async () => {
    const response = await request(app).delete('/users/me').send({
      password: 'teste123',
    });

    expect(response.status).toBe(401);
  });

  it('deve impedir login após a exclusão da conta', async () => {
    const cookie = await createTestSession('test3@test.com');

    await request(app).delete('/users/me').set('Cookie', cookie).send({
      password: 'teste123',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'test3@test.com',
      password: 'teste123',
    });

    expect(response.status).toBe(401);
  });
});
