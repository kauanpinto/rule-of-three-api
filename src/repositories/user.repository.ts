import { eq } from 'drizzle-orm';
import { db } from '@/db/client.js';
import { users } from '@/db/schema.js';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  income: string;
};

export type UpdateProfileData = {
  name?: string;
  income?: string;
};

async function findUserByEmail(email: string) {
  const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return existingUser;
}

async function findUserById(id: string) {
  const [existingUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return existingUser;
}

async function findUserByResetTokenHash(hashedToken: string) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.resetPasswordTokenHash, hashedToken))
    .limit(1);

  return existingUser;
}

async function createUser(data: CreateUserInput) {
  const [newUser] = await db.insert(users).values(data).returning();

  if (!newUser) {
    throw new Error('Não foi possível criar o usuário');
  }

  return newUser;
}

async function updateProfile(userId: string, data: UpdateProfileData) {
  const [updatedUser] = await db.update(users).set(data).where(eq(users.id, userId)).returning();

  return updatedUser;
}

async function deleteUser(userId: string) {
  const [deletedUser] = await db.delete(users).where(eq(users.id, userId)).returning();

  return deletedUser;
}

async function updatePassword(userId: string, newPassword: string) {
  const [updatedUser] = await db
    .update(users)
    .set({ password: newPassword })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}

async function saveResetToken(userId: string, resetTokenHash: string, resetTokenExpiresAt: Date) {
  const [updatedUser] = await db
    .update(users)
    .set({
      resetPasswordTokenHash: resetTokenHash,
      resetPasswordExpiresAt: resetTokenExpiresAt,
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}

async function clearResetToken(userId: string) {
  const [updatedUser] = await db
    .update(users)
    .set({
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}

export const userRepository = {
  findUserByEmail,
  findUserById,
  findUserByResetTokenHash,
  createUser,
  updateProfile,
  deleteUser,
  updatePassword,
  saveResetToken,
  clearResetToken,
};
