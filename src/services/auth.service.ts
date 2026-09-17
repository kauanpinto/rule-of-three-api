import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { userRepository } from '@/repositories/user.repository.js';
import { hashPassword, comparePassword } from '@/config/password.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email.js';
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ConflictError,
} from '@/errors/AppError.js';
import type {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/schemas/auth.schema.js';

async function register(input: RegisterInput) {
  const existingUser = await userRepository.findUserByEmail(input.email);

  if (existingUser) {
    throw new ConflictError('Email já está em uso');
  }

  const passwordHashed = await hashPassword(input.password);
  const income = String(input.income);

  const newUser = await userRepository.createUser({
    name: input.name,
    email: input.email,
    password: passwordHashed,
    income,
  });

  const { password, ...safeUser } = newUser;

  try {
    await sendWelcomeEmail(newUser.email, newUser.name);
  } catch (error) {
    console.error('Falha ao enviar email de boas-vindas:', error);
  }

  return safeUser;
}

async function login(input: LoginInput) {
  const existingUser = await userRepository.findUserByEmail(input.email);

  if (!existingUser) {
    throw new UnauthorizedError('Credenciais inválidas');
  }

  const isPasswordValid = await comparePassword(input.password, existingUser.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Credenciais inválidas');
  }

  const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return token;
}

async function changePassword(userId: string, input: ChangePasswordInput) {
  if (input.currentPassword === input.newPassword) {
    throw new BadRequestError('A nova senha não pode ser igual à atual');
  }

  const existingUser = await userRepository.findUserById(userId);

  if (!existingUser) {
    throw new NotFoundError('usuário não encontrado');
  }

  const isPasswordValid = await comparePassword(input.currentPassword, existingUser.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Senha atual incorreta');
  }

  const hashedPassword = await hashPassword(input.newPassword);

  await userRepository.updatePassword(userId, hashedPassword);
}

async function forgotPassword(input: ForgotPasswordInput) {
  const existingUser = await userRepository.findUserByEmail(input.email);
  if (!existingUser) return;

  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await userRepository.saveResetToken(existingUser.id, hashedToken, expiresAt);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(existingUser.email, resetLink);
  } catch (error) {
    console.error('Falha ao enviar email de redefinição de senha:', error);
  }
}

async function resetPassword(token: string, input: ResetPasswordInput) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const existingUser = await userRepository.findUserByResetTokenHash(hashedToken);

  if (!existingUser) {
    throw new BadRequestError('Token inválido');
  }

  if (!existingUser.resetPasswordExpiresAt || existingUser.resetPasswordExpiresAt < new Date()) {
    throw new BadRequestError('Token expirado');
  }

  const isSamePassword = await comparePassword(input.password, existingUser.password);

  if (isSamePassword) {
    throw new BadRequestError('A nova senha não pode ser igual à atual');
  }

  const hashedPassword = await hashPassword(input.password);

  await userRepository.updatePassword(existingUser.id, hashedPassword);
  await userRepository.clearResetToken(existingUser.id);
}

export const authService = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
