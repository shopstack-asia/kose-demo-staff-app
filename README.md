# KOSE Staff Web Application

A Staff App for KOSE retail counters (shopping malls, events) to assist customers who do NOT have LINE to register and create offline orders.

## Features

### Authentication & Security
- **Login Screen** - Premium KOSE-branded login page
- **Protected Routes** - All internal pages require authentication
- **Mock Authentication** - Ready to switch to real auth system
- **Session Management** - Token-based authentication

**Default Login Credentials (Mock):**
- Username: `staff` / Password: `password`
- Username: `admin` / Password: `admin123`

### Customer Registration Flow (5 Steps)
1. **Staff Input Customer Information** - Staff fills customer details
2. **Customer Review & Confirm** - Customer reviews and confirms information
3. **Terms & Conditions** - Customer must accept terms (staff cannot accept on behalf)
4. **Verify OTP** - Phone OTP first, then Email OTP (if email provided)
5. **Registration Completed** - Customer becomes ACTIVE

### Customer Management
- Search customers by name, phone, email, or member number
- View customer profile and order history
- Edit customer information

### Offline Order Management
- Create offline orders for customers
- Select customer (search or register new)
- Select store/counter
- Add products with quantities
- Calculate totals with discounts

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Ant Design 5**
- **Day.js** (date handling)

## Architecture

- **Authentication**: Mock auth system (ready for real auth integration)
- Frontend calls Next.js API routes only
- API routes return mock data (ready to switch to CS APIs)
- All date pickers and dropdowns use drawer pattern (bottom drawer)
- Touch-first UX for desktop and tablet
- Protected routes using Next.js App Router route groups

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:4300`

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (mock data)
│   │   └── auth/          # Authentication routes
│   ├── login/             # Login page (public)
│   ├── (protected)/       # Protected route group
│   │   ├── customer/      # Customer pages
│   │   ├── register/     # Registration flow (5 steps)
│   │   ├── search/       # Customer search
│   │   └── [id]/         # Customer detail & edit
│   └── order/             # Order pages
│       └── create/        # Create offline order
├── components/
│   ├── common/            # Reusable components
│   │   ├── date_picker_drawer.tsx
│   │   ├── gender_picker_drawer.tsx
│   │   ├── store_picker_drawer.tsx
│   │   ├── product_picker_drawer.tsx
│   │   └── otp_input.tsx
│   └── layout/            # Layout components
│       └── page_header.tsx
├── lib/
│   └── api_client.ts      # API client
└── mock/                  # Mock data
    ├── customer.ts
    ├── store.ts
    ├── product.ts
    └── order.ts
```

## Key Design Principles

### Drawer-based Input Pattern (STRICT)
- ALL date pickers and dropdowns MUST open in a bottom drawer
- No inline popovers or native browser pickers
- Drawer must have:
  - Clear title
  - Cancel button
  - Confirm button
- Value applied ONLY after pressing Confirm

### Staff-Assisted Flow Rules
- Staff fills data
- Customer reviews, confirms, consents, and verifies
- Staff CANNOT accept terms or OTP on behalf of customer
- Consent and verification must always be done by customer

### Module Separation
- **Offline Order**: Separate flow, can select/create customer
- **Customer Search & Edit**: Search, view, edit, view history - NO "Create Order" action

## API Routes

All API routes are in `src/app/api/` and return mock data:

### Authentication
- `POST /api/auth/login` - Staff login
- `POST /api/auth/logout` - Staff logout
- `GET /api/auth/me` - Get current user

### Customer
- `GET /api/customer/search?q=...` - Search customers
- `GET /api/customer/[id]` - Get customer details
- `PATCH /api/customer/[id]` - Update customer
- `POST /api/customer/create` - Create customer
- `POST /api/customer/accept_terms` - Accept terms
- `POST /api/customer/register` - Complete registration
- `GET /api/store/list` - List stores
- `GET /api/product/list` - List products
- `POST /api/order/create` - Create order
- `GET /api/order/customer/[customerId]` - Get customer orders
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP

## Switching to Real CS APIs

To switch from mock data to real CS APIs:

1. Update API route handlers in `src/app/api/`
2. Replace mock data calls with actual CS API calls
3. Update API client if needed (authentication, error handling)
4. No changes needed in frontend components

## License

Private - KOSE Internal Use Only

