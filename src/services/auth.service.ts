import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email.js';
import { userRepository } from '@/repositories/user.repository.js';
import type {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/schemas/auth.schema.js';

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

  try {
    await sendWelcomeEmail(newUser.email, newUser.name);
  } catch (error) {
    console.error('Falha ao enviar email de boas-vindas:', error);
  }

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
  const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');

  const existingUser = await userRepository.findUserByResetTokenHash(hashedToken);
  if (!existingUser) throw new Error('INVALID_TOKEN');

  if (!existingUser.resetPasswordExpiresAt || existingUser.resetPasswordExpiresAt < new Date())
    throw new Error('EXPIRED_TOKEN');

  const isSamePassword = await bcrypt.compare(input.password, existingUser.password);

  if (isSamePassword) throw new Error('SAME_PASSWORD');

  const hashedPassword = await bcrypt.hash(input.password, 10);

  await userRepository.updatePassword(existingUser.id, hashedPassword);
  await userRepository.clearResetToken(existingUser.id);
}

export const authService = {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
