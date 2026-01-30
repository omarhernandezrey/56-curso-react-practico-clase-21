import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

export function getPrismaInstance(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  return prismaInstance;
}

export async function disconnectDatabase(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
  }
}

export const prisma = getPrismaInstance();
