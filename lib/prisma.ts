import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: undefined | PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.prisma ?? new PrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
