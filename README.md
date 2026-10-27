# Shopping Cart Application

A responsive shopping cart application built with **React, TypeScript, Vite, Bootstrap, Zustand, TanStack Query, and Zod**.

## Project Details

This application allows users to:

- Browse products fetched from a public API
- Search products by title
- Filter products by category and price
- Add and remove products from the cart
- Increase and decrease product quantities
- Persist cart data using localStorage
- View cart totals, tax, discount, and final amount
- Complete a three-step checkout process
- Validate shipping details using Zod

### Technologies Used

- **React 19** — User interface
- **TypeScript** — Type safety
- **Vite** — Development and build tool
- **Bootstrap** — Responsive styling
- **Zustand** — Global cart state management
- **TanStack Query** — API fetching and caching
- **Zod** — API response and form validation
- **localStorage** — Cart persistence
- **pnpm** — Package management

### API

The application uses the **DummyJSON Products API**:

```text
https://dummyjson.com/products
```

Product data is fetched using TanStack Query and validated using Zod.

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm
- Git

### Clone the Repository

```bash
git clone https://github.com/ARUN-KR07/taskshopping.git
```

### Navigate to the Project

```bash
cd taskshopping
```

### Install Dependencies

```bash
pnpm install
```

### Run the Development Server

```bash
pnpm dev
```

The application will be available at the local development URL provided by Vite.

## Production Build

Create a production build:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Project Structure

```text
src/
├── components/
├── hooks/
├── pages/
├── schemas/
├── store/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

### State Management

**TanStack Query** is used for product API data, including fetching, caching, loading, and error handling.

**Zustand** is used for global cart state such as adding, removing, updating quantities, and clearing the cart.

**Zustand Persist Middleware** is used to save cart data in browser localStorage.

### Validation

**Zod** is used to:

- Validate the product API response
- Validate the shipping form

## Cart Calculation Rules

- Tax: **5% of subtotal**
- Discount: **10% when subtotal is greater than $100**
- Final Total: **Subtotal + Tax - Discount**
- Minimum checkout value: **$10**
- Maximum quantity per product: **5**
- Minimum quantity per product: **1**

## Known Limitations

- Products are provided by the DummyJSON public API.
- No backend database is used.
- No real payment gateway is integrated.
- Orders are simulated.
- Cart persistence is limited to browser localStorage.

## Repository

GitHub:

https://github.com/ARUN-KR07/taskshopping
