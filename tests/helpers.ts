import request from 'supertest';
import { vi } from 'vitest';
import app from '@/app.js';
import * as emailLib from '@/lib/email.js';

export async function registerAndLogin(email = 'test@test.com') {
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

  return response.headers['set-cookie'][0].split(';')[0];
}
