import { pgTable, pgEnum, uuid, varchar, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', ['ESSENTIALS', 'LEISURE', 'INVESTMENT']);

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  income: numeric({ precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const expenses = pgTable('expenses', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  category: categoryEnum().notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  amount: numeric({ precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
