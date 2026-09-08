import request from 'supertest';
import app from '@/app.js';

export async function registerAndLogin(email = 'teste@teste.com') {
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
