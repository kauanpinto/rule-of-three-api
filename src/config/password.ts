import bcrypt from 'bcryptjs';

const SALT_ROUNDS = process.env.NODE_ENV === 'test' ? 4 : 10;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
