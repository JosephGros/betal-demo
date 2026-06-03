export type RiskStatus = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REVIEW';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  reference: string;
  status: PaymentStatus;
}

export interface Supplier {
  id: string;
  name: string;
  organizationNumber: string;
  riskStatus: RiskStatus;
  payments: Payment[];
}

export interface CreateSupplierInput {
  name: string;
  organizationNumber: string;
  riskStatus?: RiskStatus;
}

export interface CreatePaymentInput {
  supplierId: string;
  amount: number;
  currency?: string;
  reference: string;
  status?: PaymentStatus;
}
