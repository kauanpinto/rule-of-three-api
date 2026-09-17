import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepository } from '@/repositories/user.repository.js';

export async function createTestSession(email = 'test@test.com') {
  const hashedPassword = await bcrypt.hash('teste123', 4);

  const user = await userRepository.createUser({
    name: 'Teste',
    email,
    password: hashedPassword,
    income: '3000',
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return `token=${token}`;
}
