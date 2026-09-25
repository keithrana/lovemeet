import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbReady?: Promise<void>;
};

// On Vercel's serverless functions, only /tmp is writable, and it starts
// empty on every cold start. Point SQLite there instead of the repo-relative
// path used for local development. This is a demo-friendly stand-in until a
// real hosted database is wired up (data does not persist across cold starts).
const databaseUrl = process.env.VERCEL ? "file:/tmp/dev.db" : process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const CREATE_USER_TABLE = `
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
`;
const CREATE_USER_EMAIL_INDEX = `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`;

// Idempotent, so it's safe to call before every request. Needed because on
// Vercel the /tmp SQLite file is missing entirely on a fresh cold start.
export async function ensureDb(): Promise<void> {
  if (!globalForPrisma.dbReady) {
    globalForPrisma.dbReady = prisma
      .$executeRawUnsafe(CREATE_USER_TABLE)
      .then(() => prisma.$executeRawUnsafe(CREATE_USER_EMAIL_INDEX))
      .then(() => undefined);
  }
  await globalForPrisma.dbReady;
}
