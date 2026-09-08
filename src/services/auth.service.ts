import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '@/repositories/user.repository.js';
import type { RegisterInput, LoginInput, ChangePasswordInput } from '@/schemas/auth.schema.js';

async function registerUser(input: RegisterInput) {
  const existingUser = await userRepository.findUserByEmail(input.email);
  if (existingUser) throw new Error('Email já está em uso');

  const passwordHashed = await bcrypt.hash(input.password, 10);
  const income = String(input.income);

  const newUser = await userRepository.createUser({
    name: input.name,
    email: input.email,
    password: passwordHashed,
    income,
  });

  const { password, ...safeUser } = newUser;

  return safeUser;
}

async function loginUser(input: LoginInput) {
  const existingUser = await userRepository.findUserByEmail(input.email);
  if (!existingUser) throw new Error('Credenciais inválidas');

  const isPasswordValid = await bcrypt.compare(input.password, existingUser.password);
  if (!isPasswordValid) throw new Error('Credenciais inválidas');

  const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return token;
}

async function changePassword(userId: string, input: ChangePasswordInput) {
  if (input.currentPassword === input.newPassword) throw new Error('SAME_PASSWORD');

  const existingUser = await userRepository.findUserById(userId);
  if (!existingUser) throw new Error('USER_NOT_FOUND');

  const isPasswordValid = await bcrypt.compare(input.currentPassword, existingUser.password);
  if (!isPasswordValid) throw new Error('INVALID_CURRENT_PASSWORD');

  const hashedPassword = await bcrypt.hash(input.newPassword, 10);

  await userRepository.updatePassword(userId, hashedPassword);
}

export const authService = {
  registerUser,
  loginUser,
  changePassword,
};
