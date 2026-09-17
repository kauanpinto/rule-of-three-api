import bcrypt from 'bcryptjs';
import { userRepository } from '@/repositories/user.repository.js';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/errors/AppError.js';
import type { UpdateProfileData } from '@/repositories/user.repository.js';
import type { DeleteAccountInput, UpdateProfileInput } from '@/schemas/user.schema.js';

async function updateProfile(userId: string, input: UpdateProfileInput) {
  const existingUser = await userRepository.findUserById(userId);

  if (!existingUser) {
    throw new NotFoundError('Usuário não encontrado');
  }

  if (!input.name && !input.income) {
    throw new BadRequestError('Informe ao menos um campo para atualizar');
  }

  const dataToUpdate: UpdateProfileData = {};

  if (input.name) {
    dataToUpdate.name = input.name;
  }

  if (input.income) {
    dataToUpdate.income = String(input.income);
  }

  const updatedUser = await userRepository.updateProfile(userId, dataToUpdate);

  if (!updatedUser) {
    throw new NotFoundError('Usuário não encontrado');
  }

  const { password, ...safeUser } = updatedUser;

  return safeUser;
}

async function deleteAccount(userId: string, input: DeleteAccountInput) {
  const existingUser = await userRepository.findUserById(userId);

  if (!existingUser) {
    throw new NotFoundError('Usuário não encontrado');
  }

  const isPasswordValid = await bcrypt.compare(input.password, existingUser.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Senha atual incorreta');
  }

  await userRepository.deleteUser(userId);
}

export const userService = {
  updateProfile,
  deleteAccount,
};
