# BetalDemo – Angular, GraphQL and SQL Demo

BetalDemo is a simple fullstack application built to practice Angular, TypeScript, GraphQL and SQL in a local development environment.

The project is inspired by a supplier control and payment flow system. The application allows the user to:

- view a list of suppliers
- view details for a specific supplier
- create a new supplier
- view payments connected to a supplier
- create a new payment for a supplier

The purpose of this project is not to be a finished product, but to demonstrate a simple technical flow from frontend to backend and database.

---

## Tech Stack

The project uses:

- Angular
- TypeScript
- Tailwind CSS
- GraphQL
- Node.js
- Express
- Apollo Server
- Prisma
- SQLite

---

## Project Structure

```txt
BETALDEMO/
  backend/
    prisma/
      migrations/
      schema.prisma
      seed.ts
    src/
      generated/
      context.ts
      index.ts
      resolvers.ts
      schema.ts
    .env
    dev.db
    package.json
    prisma.config.ts
    tsconfig.json

  frontend/
    public/
    src/
      app/
        models/
          supplier.model.ts
        pages/
          supplier-create/
            supplier-create.component.ts
            supplier-create.html
          supplier-detail/
            supplier-detail.component.ts
            supplier-detail.html
          supplier-list/
            supplier-list.component.ts
            supplier-list.html
        services/
          supplier.service.ts
        app.config.ts
        app.css
        app.html
        app.routes.ts
        app.spec.ts
        app.ts
      index.html
      main.ts
      styles.css
    package.json
```

Note: `node_modules`, `.angular`, `.vscode`, `package-lock.json` and generated/cache files may exist locally, but they are not important for understanding the project structure.

---

## How the Application Works

The frontend is built with Angular's newer standalone component structure.

The root Angular files are:

- `app.ts`
- `app.html`
- `app.routes.ts`
- `app.config.ts`

Feature pages are placed under:

- `frontend/src/app/pages/`

The application currently has three main pages:

- `supplier-list`
- `supplier-detail`
- `supplier-create`

API logic is separated into an Angular service:

- `frontend/src/app/services/supplier.service.ts`

The backend is a GraphQL API built with Apollo Server and Express. The GraphQL schema defines the available queries and mutations.

Data is stored in a local SQLite database. Prisma is used to define the data model, run migrations and communicate with the database from TypeScript.

The overall flow is:

```txt
Angular component
-> Angular service
-> GraphQL request
-> Apollo Server
-> Resolver
-> Prisma
-> SQLite database
```

---

## Features

### Suppliers

The application can:

- fetch all suppliers
- fetch a specific supplier
- create a new supplier

A supplier has:

- name
- organization number
- risk status
- payments

Example risk statuses:

```txt
LOW
MEDIUM
HIGH
UNKNOWN
```

### Payments

The application can:

- show payments for a supplier
- create a new payment connected to a supplier

A payment has:

- amount
- currency
- reference
- status

Example payment statuses:

```txt
PENDING
APPROVED
REVIEW
```

---

## Prerequisites

To run this project, you need:

- Node.js
- npm

Check your installation with:

```bash
node -v
npm -v
```

---

## Installation

Clone or download the project and go to the project folder:

```bash
cd BETALDEMO
```

The project has two separate parts:

- `backend`
- `frontend`

You need to install dependencies in both folders.

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Run the database migration:

```bash
npx prisma migrate dev
```

Seed the database with test data:

```bash
npx prisma db seed
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

```txt
http://localhost:4000/graphql
```

---

## Testing the GraphQL API

When the backend is running, open:

```txt
http://localhost:4000/graphql
```

Example query to fetch all suppliers:

```graphql
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
```

Example query to fetch one supplier:

```graphql
query GetSupplier {
  supplier(id: 1) {
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
```

Example mutation to create a supplier:

```graphql
mutation CreateSupplier($input: CreateSupplierInput!) {
  createSupplier(input: $input) {
    id
    name
    organizationNumber
    riskStatus
  }
}
```

Variables:

```json
{
  "input": {
    "name": "Test Supplier AB",
    "organizationNumber": "559999-0000",
    "riskStatus": "MEDIUM"
  }
}
```

Example mutation to create a payment:

```graphql
mutation CreatePayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    id
    amount
    currency
    reference
    status
  }
}
```

Variables:

```json
{
  "input": {
    "supplierId": "1",
    "amount": 1500,
    "currency": "SEK",
    "reference": "INV-TEST-1",
    "status": "REVIEW"
  }
}
```

---

## Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd BETALDEMO/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm start
```

The frontend runs at:

```txt
http://localhost:4200
```

---

## Running the Full Application Locally

You need two terminals open.

### Terminal 1 – Backend

```bash
cd BETALDEMO/backend
npm run dev
```

### Terminal 2 – Frontend

```bash
cd BETALDEMO/frontend
npm start
```

Then open:

```txt
http://localhost:4200
```

---

## Important Frontend Routes

```txt
/suppliers
```

Shows all suppliers.

```txt
/suppliers/new
```

Form for creating a new supplier.

```txt
/suppliers/:id
```

Detail page for a specific supplier. This page shows the supplier's payments and allows the user to add a new payment.

---

## Database

The project uses SQLite through Prisma.

The data model consists of two main tables:

- `Supplier`
- `Payment`

The relationship is:

```txt
One Supplier can have many Payments.
One Payment belongs to one Supplier.
```

The Prisma models are defined in:

```txt
backend/prisma/schema.prisma
```

---

## Backend Files

### `backend/src/index.ts`

Starts the Express server and connects Apollo Server to the `/graphql` endpoint.

### `backend/src/schema.ts`

Contains the GraphQL type definitions, including:

- `Supplier`
- `Payment`
- `Query`
- `Mutation`
- `CreateSupplierInput`
- `CreatePaymentInput`

### `backend/src/resolvers.ts`

Contains the resolver logic for GraphQL queries and mutations.

Resolvers connect GraphQL operations to Prisma database calls.

### `backend/src/context.ts`

Creates the GraphQL context and Prisma client.

### `backend/prisma/schema.prisma`

Defines the database models.

### `backend/prisma/seed.ts`

Adds test data to the database.

---

## Frontend Files

### `frontend/src/app/app.ts`

Root Angular component.

### `frontend/src/app/app.html`

Root layout and navigation.

### `frontend/src/app/app.routes.ts`

Defines frontend routes.

### `frontend/src/app/app.config.ts`

Configures Angular providers such as routing and HttpClient.

### `frontend/src/app/services/supplier.service.ts`

Handles GraphQL requests from Angular to the backend.

The frontend sends GraphQL requests manually using Angular `HttpClient`.

### `frontend/src/app/models/supplier.model.ts`

Contains TypeScript interfaces and types for suppliers and payments.

### `frontend/src/app/pages/supplier-list`

Displays all suppliers.

### `frontend/src/app/pages/supplier-detail`

Displays one supplier, its payments, and includes a button to add a new payment.

### `frontend/src/app/pages/supplier-create`

Contains the form for creating a new supplier.

---

## Prisma Studio

To inspect the database visually, run:

```bash
cd backend
npx prisma studio
```

This opens Prisma Studio in the browser, where you can view suppliers and payments directly in the database.

---

## Common Issues

### The frontend does not show any data

Make sure the backend is running:

```bash
cd backend
npm run dev
```

The backend must be available at:

```txt
http://localhost:4000/graphql
```

Also check the browser console and the Network tab.

### GraphQL requests fail

Check that the frontend is sending requests to:

```txt
http://localhost:4000/graphql
```

Also make sure the backend server is running.

### The database has no test data

Run the seed command again:

```bash
cd backend
npx prisma db seed
```

### Prisma Client is missing

Run:

```bash
cd backend
npx prisma generate
```

### Frontend route does not work

Check that the route exists in:

```txt
frontend/src/app/app.routes.ts
```

Also check that the root app uses:

```txt
<router-outlet />
```

inside:

```txt
frontend/src/app/app.html
```

### Router links do not work

If a component template uses `routerLink`, the component must import `RouterLink`.

Example:

```ts
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
})
export class ExampleComponent {}
```

### Reactive forms do not work

If a component template uses `[formGroup]` or `formControlName`, the component must import `ReactiveFormsModule`.

Example:

```ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
})
export class ExampleComponent {}
```

---

## Notes About Angular

This project uses Angular's newer standalone component structure.

It also uses modern Angular template control flow:

```html
@if (condition) { ... } @for (item of items; track item.id) { ... }
```

Because of this, the project does not need `NgIf` or `NgFor` imports for those template blocks.

---

## Why This Project Exists

This project was created as a practical exercise before a technical interview for a fullstack role using Angular, TypeScript, GraphQL and SQL.

The focus is to understand:

- how Angular communicates with an API
- how GraphQL queries and mutations work
- how resolvers connect GraphQL to the database
- how Prisma is used with a SQL database
- how data flows through a fullstack application
- how suppliers and payments can be modeled in a simple business domain

---

## Possible Improvements

This is a simple demo application. Possible improvements include:

- authentication
- user roles
- better backend validation
- better error handling
- pagination
- filtering by risk status
- supplier search
- automated tests
- Docker setup
- environment variables for API URLs
- stronger security
- logging
- audit trail
- duplicate payment detection
- supplier risk scoring

---

## Short Technical Summary

```txt
Angular frontend
-> HttpClient sends GraphQL queries/mutations
-> Apollo Server receives the request
-> Resolver runs backend logic
-> Prisma communicates with SQLite
-> Data is returned to Angular
```

This demonstrates a complete local fullstack flow using Angular, TypeScript, GraphQL and SQL.
