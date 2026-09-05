import { eq } from 'drizzle-orm';
import { db } from '@/db/client.js';
import { users } from '@/db/schema.js';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  income: string;
};

async function findUserByEmail(email: string) {
  const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return existingUser;
}

async function findUserById(id: string) {
  const [existingUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return existingUser;
}

async function createUser(data: CreateUserInput) {
  const [newUser] = await db.insert(users).values(data).returning();

  if (!newUser) throw new Error('Não foi possível criar o usuário');

  return newUser;
}

export const userRepository = {
  findUserByEmail,
  findUserById,
  createUser,
};
