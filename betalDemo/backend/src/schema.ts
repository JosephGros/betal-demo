export const typeDefs = `#graphql
 type Supplier {
    id: ID!
    name: String!
    organizationNumber: String!
    riskStatus: String!
    createdAt: String!
    payments: [Payment!]!
 }

 type Payment {
    id: ID!
    amount: Float!
    currency: String!
    reference: String!
    status: String!
    createdAt: String!
    supplier: Supplier!
 }

 input CreateSupplierInput {
    name: String!
    organizationNumber: String!
    riskStatus: String
 }

 input CreatePaymentInput {
    supplierId: ID!
    amount: Float!
    currency: String
    reference: String!
    status: String
 }

 type Query {
    suppliers: [Supplier!]!
    supplier(id: ID!): Supplier
    payments: [Payment!]!
 }

 type Mutation {
    createSupplier(input: CreateSupplierInput!): Supplier!
    createPayment(input: CreatePaymentInput!): Payment!
 }
`;
