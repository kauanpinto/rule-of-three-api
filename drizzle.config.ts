import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
