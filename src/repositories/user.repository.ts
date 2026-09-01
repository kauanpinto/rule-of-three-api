import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  income: string;
};

export async function findUserByEmail(email: string) {
  const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return existingUser;
}

export async function createUser(data: CreateUserInput) {
  const [newUser] = await db.insert(users).values(data).returning();

  return newUser;
}
