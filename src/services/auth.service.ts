import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '@/repositories/user.repository';
import type { RegisterInput, LoginInput } from '@/schemas/auth.schema';

export async function registerUser(input: RegisterInput) {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) throw new Error('Email já está em uso');

  const passwordHashed = await bcrypt.hash(input.password, 10);
  const income = String(input.income);

  const newUser = await createUser({
    name: input.name,
    email: input.email,
    password: passwordHashed,
    income,
  });

  const { password, ...safeUser } = newUser;

  return safeUser;
}

export async function loginUser(input: LoginInput) {
  const existingUser = await findUserByEmail(input.email);
  if (!existingUser) throw new Error('Credenciais inválidas');

  const isPasswordValid = await bcrypt.compare(input.password, existingUser.password);
  if (!isPasswordValid) throw new Error('Credenciais inválidas');

  const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return token;
}
