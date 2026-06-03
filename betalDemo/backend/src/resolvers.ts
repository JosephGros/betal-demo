import { GraphQLContext } from './context.js';

type CreateSupplierArgs = {
  input: {
    name: string;
    organizationNumber: string;
    riskStatus?: string;
  };
};

type CreatePaymentArgs = {
  input: {
    supplierId: string;
    amount: number;
    currency?: string;
    reference: string;
    status?: string;
  };
};

export const resolvers = {
  Query: {
    suppliers: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return context.prisma.supplier.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    },

    supplier: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return context.prisma.supplier.findUnique({
        where: {
          id: Number(args.id),
        },
      });
    },

    payments: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return context.prisma.payment.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  },

  Mutation: {
    createSupplier: async (
      _parent: unknown,
      args: CreateSupplierArgs,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      if (!args.input.name.trim()) {
        throw new Error('Supplier name is required');
      }

      if (!args.input.organizationNumber.trim()) {
        throw new Error('Organization number is required');
      }

      return context.prisma.supplier.create({
        data: {
          name: args.input.name,
          organizationNumber: args.input.organizationNumber,
          riskStatus: args.input.riskStatus ?? 'UNKNOWN',
        },
      });
    },

    createPayment: async (
      _parent: unknown,
      args: CreatePaymentArgs,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const supplier = await context.prisma.supplier.findUnique({
        where: {
          id: Number(args.input.supplierId),
        },
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      return context.prisma.payment.create({
        data: {
          supplierId: Number(args.input.supplierId),
          amount: args.input.amount,
          currency: args.input.currency ?? 'SEK',
          reference: args.input.reference,
          status: args.input.status ?? 'PENDING',
        },
      });
    },
  },

  Supplier: {
    payments: async (
      parent: { id: number },
      _args: unknown,
      context: GraphQLContext
    ) => {
      return context.prisma.payment.findMany({
        where: {
          supplierId: parent.id,
        },
      });
    },
  },

  Payment: {
    supplier: async (
      parent: { supplierId: number },
      _args: unknown,
      context: GraphQLContext
    ) => {
      return context.prisma.supplier.findUnique({
        where: {
          id: parent.supplierId,
        },
      });
    },
  },
};
