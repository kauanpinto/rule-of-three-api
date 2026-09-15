import request from 'supertest';
import { vi } from 'vitest';
import app from '@/app.js';
import * as emailLib from '@/lib/email.js';

export async function registerAndLogin(email = 'test@test.com'): Promise<string> {
  vi.spyOn(emailLib, 'sendWelcomeEmail').mockResolvedValue(undefined);

  await request(app).post('/auth/register').send({
    name: 'Teste',
    email,
    password: 'teste123',
    income: 3000,
  });

  const response = await request(app).post('/auth/login').send({
    email,
    password: 'teste123',
  });

  const cookie = response.headers['set-cookie']?.[0];

  if (!cookie) {
    throw new Error('Login falhou ao gerar cookie de sessão nos testes');
  }

  const sessionCookie = cookie.split(';')[0];

  if (!sessionCookie) {
    throw new Error('Cookie de sessão inválido nos testes');
  }

  return sessionCookie;
}
