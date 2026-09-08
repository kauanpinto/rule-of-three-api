import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '@/app.js';
import { db } from '@/db/client.js';
import { users } from '@/db/schema.js';
import { registerAndLogin } from './helpers.js';

describe('POST /auth/register', () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  it('deve criar um novo usuário com dados válidos', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
      income: 3000,
    });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('teste@teste.com');
    expect(response.body.password).toBeUndefined();
  });

  it('deve retornar 409 se o email já estiver em uso', async () => {
    await request(app).post('/auth/register').send({
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
      income: 3000,
    });

    const response = await request(app).post('/auth/register').send({
      name: 'Teste2',
      email: 'teste@teste.com',
      password: 'teste123',
      income: 1500,
    });

    expect(response.status).toBe(409);
  });

  it('deve retornar 400 se a senha for muito curta', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Teste3',
      email: 'teste3@teste.com',
      password: 't',
      income: 1500,
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se o nome for muito curto', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'T',
      email: 'teste4@teste.com',
      password: 'teste123',
      income: 1500,
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se o email tiver formato inválido', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Teste',
      email: 'email-invalido',
      password: 'teste123',
      income: 1500,
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se a renda não for positiva', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Teste',
      email: 'teste5@teste.com',
      password: 'teste123',
      income: -100,
    });

    expect(response.status).toBe(400);
  });
});

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  it('deve autenticar com credenciais válidas e retornar cookie', async () => {
    await request(app).post('/auth/register').send({
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
      income: 3000,
    });

    const response = await request(app).post('/auth/login').send({
      email: 'teste@teste.com',
      password: 'teste123',
    });

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('deve retonar 401 se a senha for errada', async () => {
    await request(app).post('/auth/register').send({
      name: 'Teste2',
      email: 'teste2@teste.com',
      password: 'teste123',
      income: 3000,
    });

    const response = await request(app).post('/auth/login').send({
      email: 'teste2@teste.com',
      password: 'testesenhaerrada',
    });

    expect(response.status).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('deve retonar 401 se o email não estiver cadastrado', async () => {
    await request(app).post('/auth/register').send({
      name: 'Teste3',
      email: 'teste3@teste.com',
      password: 'teste123',
      income: 3000,
    });

    const response = await request(app).post('/auth/login').send({
      email: 'emailinvalido@teste.com',
      password: 'teste123',
    });

    expect(response.status).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('deve retonar 400 se a senha estiver vazia', async () => {
    await request(app).post('/auth/register').send({
      name: 'Teste4',
      email: 'teste4@teste.com',
      password: 'teste123',
      income: 3000,
    });

    const response = await request(app).post('/auth/login').send({
      email: 'teste4@teste.com',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('deve retonar 400 se o email tiver formato inválido', async () => {
    await request(app).post('/auth/register').send({
      name: 'Teste5',
      email: 'teste5@teste.com',
      password: 'teste123',
      income: 3000,
    });

    const response = await request(app).post('/auth/login').send({
      email: 'emailinvalido',
      password: 'teste123',
    });

    expect(response.status).toBe(400);
    expect(response.headers['set-cookie']).toBeUndefined();
  });
});

describe('POST /auth/logout', () => {
  it('deve limpar o cookie de sessão', async () => {
    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
  });
});

describe('PATCH /auth/change-password', () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  it('deve trocar a senha com dados válidos', async () => {
    const cookie = await registerAndLogin();

    const response = await request(app).patch('/auth/change-password').set('Cookie', cookie).send({
      currentPassword: 'teste123',
      newPassword: 'novaSenha456',
    });

    expect(response.status).toBe(200);
  });

  it('deve retornar 401 se a senha atual estiver errada', async () => {
    const cookie = await registerAndLogin('test2@test.com');

    const response = await request(app).patch('/auth/change-password').set('Cookie', cookie).send({
      currentPassword: 'senhaErrada',
      newPassword: 'novaSenha456',
    });

    expect(response.status).toBe(401);
  });

  it('deve retornar 400 se a nova senha for igual à atual', async () => {
    const cookie = await registerAndLogin('test3@test.com');

    const response = await request(app).patch('/auth/change-password').set('Cookie', cookie).send({
      currentPassword: 'teste123',
      newPassword: 'teste123',
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 400 se a nova senha for muito curta', async () => {
    const cookie = await registerAndLogin('test4@test.com');

    const response = await request(app).patch('/auth/change-password').set('Cookie', cookie).send({
      currentPassword: 'teste123',
      newPassword: 'senha',
    });

    expect(response.status).toBe(400);
  });

  it('deve retornar 401 se o usuário não estiver autenticado', async () => {
    const response = await request(app).patch('/auth/change-password').send({
      currentPassword: 'teste123',
      newPassword: 'novaSenha456',
    });

    expect(response.status).toBe(401);
  });
});
