import { PrismaClient } from './generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});

export const prisma = new PrismaClient({
  adapter,
});

export type GraphQLContext = {
  prisma: PrismaClient;
  user: {
    id: string;
    role: 'ADMIN' | 'USER';
    organizationId: string;
  } | null;
};

export async function createContext(): Promise<GraphQLContext> {
  return {
    prisma,
    user: {
      id: 'local-demo-user',
      role: 'ADMIN',
      organizationId: 'demo-org',
    },
  };
}
