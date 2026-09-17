import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import app from '@/app.js';
import { db } from '@/db/client.js';
import { users } from '@/db/schema.js';
import * as emailLib from '@/lib/email.js';
import { createTestSession } from './helpers.js';

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
