import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, tap } from 'rxjs';

import {
  CreateSupplierInput,
  CreatePaymentInput,
  Payment,
  Supplier,
} from '../models/supplier.model';

type GraphQLResponse<T> = {
  data?: T;
  errors?: {
    message: string;
  }[];
};

type GetSuppliersData = {
  suppliers: Supplier[];
};

type GetSupplierData = {
  supplier: Supplier | null;
};

type CreateSupplierData = {
  createSupplier: Supplier;
};

type CreatePaymentData = {
  createPayment: Payment;
};

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private http = inject(HttpClient);

  private graphqlUrl = 'http://localhost:4000/graphql';

  getSuppliers() {
    const query = `
      query GetSuppliers {
        suppliers {
          id
          name
          organizationNumber
          riskStatus
          payments {
            id
            amount
            currency
            reference
            status
          }
        }
      }
    `;

    return this.http
      .post<GraphQLResponse<GetSuppliersData>>(this.graphqlUrl, {
        query,
      })
      .pipe(
        tap((response) => {
          console.log('GET_SUPPLIERS GraphQL response:', response);
        }),
        map((response) => {
          if (response.errors?.length) {
            throw new Error(response.errors[0].message);
          }

          return response.data?.suppliers ?? [];
        }),
      );
  }

  getSupplier(id: string) {
    const query = `
      query GetSupplier($id: ID!) {
        supplier(id: $id) {
          id
          name
          organizationNumber
          riskStatus
          payments {
            id
            amount
            currency
            reference
            status
          }
        }
      }
    `;

    return this.http
      .post<GraphQLResponse<GetSupplierData>>(this.graphqlUrl, {
        query,
        variables: {
          id,
        },
      })
      .pipe(
        tap((response) => {
          console.log('GET_SUPPLIER GraphQL response:', response);
        }),
        map((response) => {
          if (response.errors?.length) {
            throw new Error(response.errors[0].message);
          }

          return response.data?.supplier ?? null;
        }),
      );
  }

  createPayment(input: CreatePaymentInput) {
    const query = `
      mutation CreatePayment($input: CreatePaymentInput!) {
        createPayment(input: $input) {
          id
          amount
          currency
          reference
          status
        }
      }
    `;

    return this.http
      .post<GraphQLResponse<CreatePaymentData>>(this.graphqlUrl, {
        query,
        variables: {
          input,
        },
      })
      .pipe(
        map((response) => {
          console.log('CREATE_PAYMENT RESPONSE:', response);

          if (response.errors?.length) {
            throw new Error(response.errors[0].message);
          }

          return response.data?.createPayment ?? null;
        }),
      );
  }

  createSupplier(input: CreateSupplierInput) {
    const query = `
      mutation CreateSupplier($input: CreateSupplierInput!) {
        createSupplier(input: $input) {
          id
          name
          organizationNumber
          riskStatus
          payments {
            id
            amount
            currency
            reference
            status
          }
        }
      }
    `;

    return this.http
      .post<GraphQLResponse<CreateSupplierData>>(this.graphqlUrl, {
        query,
        variables: {
          input,
        },
      })
      .pipe(
        tap((response) => {
          console.log('CREATE_SUPPLIER GraphQL response:', response);
        }),
        map((response) => {
          if (response.errors?.length) {
            throw new Error(response.errors[0].message);
          }

          return response.data?.createSupplier ?? null;
        }),
      );
  }
}
