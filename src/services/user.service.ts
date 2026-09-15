import bcrypt from 'bcryptjs';
import { userRepository } from '@/repositories/user.repository.js';
import type { DeleteAccountInput } from '@/schemas/user.schema.js';
import { UnauthorizedError, NotFoundError } from '@/errors/AppError.js';

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
  deleteAccount,
};
