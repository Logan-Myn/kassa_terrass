# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive point-of-sale (POS) system for LatinPassion bar/restaurant operations, built with Next.js 16 App Router, React 19.2, TypeScript, and Tailwind CSS v4. The application handles product sales, cash reconciliation, shift management, inventory tracking, and payment processing.

See `KASSA_OVERVIEW.md` for complete functional requirements and business rules.

## Development Commands

**Package Manager**: This project uses `pnpm` (see `pnpm-lock.yaml`)

```bash
# Development
pnpm dev              # Start development server at http://localhost:3000

# Build & Production
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
```

## Tech Stack & Configuration

- **Next.js 16**: App Router with TypeScript, server and client components
- **React 19.2**: Latest React with new JSX transform (`jsx: "react-jsx"`)
- **Tailwind CSS v4**: Using new `@tailwindcss/postcss` package
- **TypeScript**: ES2017 target with strict mode enabled
- **Fonts**: Geist Sans and Geist Mono (optimized via `next/font`)
- **Path Aliases**: `@/*` maps to project root
- **Database**: Neon Postgres (serverless PostgreSQL)
- **Authentication**: Better-Auth with email/password support
- **Deployment**: Vercel with automatic GitHub integration

## Environment Setup

Required environment variables (already configured in Vercel):
- `POSTGRES_URL`: Neon database connection string (pooled)
- `POSTGRES_URL_NON_POOLING`: Direct connection for migrations
- `BETTER_AUTH_SECRET`: Secret key for Better-Auth (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: Application URL (http://localhost:3000 for dev)

To pull environment variables locally:
```bash
vercel env pull .env.local
```

## Architecture & Key Concepts

### External Integrations
- **Neon Postgres**: Serverless PostgreSQL database with connection pooling
- **Better-Auth**: Authentication system with session management
  - Tables: `user`, `session`, `account`, `verification`
  - Auth routes: `/api/auth/*` (handled by Better-Auth)
  - Client helpers: `lib/auth-client.ts` (signIn, signUp, signOut, useSession)
- **SumUp API**: Card payment processing with payment verification workflow (to be implemented)
- **@zxing/browser**: QR code scanning for voucher system (to be implemented)

### Core Business Logic Areas

**Shift Management**
- Opening/closing kassa with cash count
- Automatic envelope calculation (cash to deposit)
- Prevents sales when kassa is closed

**Product Catalog & Inventory**
- Real-time stock tracking with out-of-stock warnings
- Special cocktail handling: calculates servings based on ingredient availability via recipe_ingredients table
- Automatic stock deduction after successful payments (regular products and cocktail ingredients)

**Pricing & Discounts**
- Percentage discounts (10%, 20%, 50%) with exclusions (coffee, tea)
- Voucher system (QR code scanning, validation, single-use tracking)
- Cannot combine vouchers with percentage discounts
- Vouchers apply to most expensive item in cart

**Payment Processing**
- **SumUp Solo**: Card payments with verification workflow
  1. Send payment request to terminal
  2. Mark as "pending verification"
  3. Auto-verify after 1 minute
  4. Poll for real-time status updates
- **Cash**: Immediate completion, updates shift totals
- **Voucher-only**: €0.00 transactions, instant completion

**Failed Payment Recovery**
- 24-hour monitoring window
- Show alerts with payment details
- Options to retry (add to cart) or delete

**Order Status Tracking**
- New transactions marked as "pending" for bartender display
- Separate bartender interface for order management
- Status progression: pending → in progress → completed

### Mobile-First Design Considerations
- Responsive layout for tablets and phones
- Touch-optimized controls
- Floating cart button on mobile
- Smooth scroll behaviors

## Database Schema

### Authentication Tables (Already Created)
- `user`: User accounts with email and profile info
- `session`: Active user sessions
- `account`: OAuth provider accounts
- `verification`: Email verification tokens

### Application Tables (To Be Implemented)
- `products`: Catalog with stock levels and categories
- `transactions`: Sales records with payment method, verification status, SumUp references
- `vouchers`: Digital codes with validation state
- `kassa_shifts`: Open/close tracking with cash amounts
- `recipe_ingredients`: Cocktail recipes for ingredient-based stock calculation
- `profiles`: Extended user/staff information and roles

## Code Organization

When implementing features, follow Next.js 16 App Router conventions:
- Server Components by default
- Use `"use client"` only when necessary (hooks, event handlers, browser APIs)
- API routes in `app/api/*/route.ts`
- Organize by feature when structure grows (e.g., `/app/cashier`, `/app/bartender`)

## Important Business Rules

- Kassa must be open to process sales
- Stock warnings don't prevent sales (manual override allowed)
- One voucher per transaction maximum
- Vouchers and percentage discounts are mutually exclusive
- All card payments require verification before completion
- Cocktails use ingredient-based stock calculation
- 24-hour window for failed payment recovery
