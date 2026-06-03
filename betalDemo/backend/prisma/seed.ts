import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.payment.deleteMany();
  await prisma.supplier.deleteMany();

  await prisma.supplier.create({
    data: {
      name: 'Nordic Office AB',
      organizationNumber: '556111-2222',
      riskStatus: 'LOW',
      payments: {
        create: [
          {
            amount: 12500,
            currency: 'SEK',
            reference: 'INV-1001',
            status: 'APPROVED',
          },
          {
            amount: 12500,
            currency: 'SEK',
            reference: 'INV-1001-DUPLICATE',
            status: 'REVIEW',
          },
        ],
      },
    },
  });

  await prisma.supplier.create({
    data: {
      name: 'Snabbfaktura Sverige AB',
      organizationNumber: '556333-4444',
      riskStatus: 'HIGH',
      payments: {
        create: [
          {
            amount: 49900,
            currency: 'SEK',
            reference: 'INV-9001',
            status: 'REVIEW',
          },
        ],
      },
    },
  });

  await prisma.supplier.create({
    data: {
      name: 'Trygg Leverantör AB',
      organizationNumber: '556555-6666',
      riskStatus: 'MEDIUM',
      payments: {
        create: [
          {
            amount: 8200,
            currency: 'SEK',
            reference: 'INV-3001',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
