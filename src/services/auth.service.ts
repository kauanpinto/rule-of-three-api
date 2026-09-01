import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '@/repositories/user.repository';
import type { RegisterInput } from '@/schemas/auth.schema';

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
