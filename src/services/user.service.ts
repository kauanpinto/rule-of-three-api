import bcrypt from 'bcryptjs';
import { userRepository } from '@/repositories/user.repository.js';
import type { DeleteAccountInput } from '@/schemas/user.schema.js';

async function deleteAccount(userId: string, input: DeleteAccountInput) {
  const existingUser = await userRepository.findUserById(userId);
  if (!existingUser) throw new Error('USER_NOT_FOUND');

  const isPasswordValid = await bcrypt.compare(input.password, existingUser.password);
  if (!isPasswordValid) throw new Error('INVALID_CURRENT_PASSWORD');

  await userRepository.deleteUser(userId);
}

export const userService = {
  deleteAccount,
};
