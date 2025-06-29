# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Management:**
- Always use `npm` to install packages and run the app

**Primary Development:**
- `npm run dev` - Start development server with hot reload (React + Hono API)
- `npm run build` - Build for production
- `npm run deploy` - Build and deploy to Cloudflare Workers

**Code Quality:**
- `npm run lint` - Lint and auto-fix with Biome
- `npm run check` - Full type check and dry-run deploy

**Database:**
- `npm run db:generate` - Generate migrations from schema changes
- `npm run db:migrate` - Apply migrations locally
- `npm run db:migrate:remote` - Apply migrations to Cloudflare D1
- `npm run db:studio` - Open Drizzle Studio

**Type Generation:**
- `npm run cf-typegen` - Generate Cloudflare Worker types

## Architecture Overview

This is a full-stack SaaS starter built for **Cloudflare Workers** with these key architectural decisions:

### Monorepo Structure
- `src/client/` - React frontend with Vite, TanStack Router/Query/Form
- `src/worker/` - Hono backend API for Cloudflare Workers
- `src/shared/` - Shared Zod schemas and utilities
- Path aliases: `@client/*`, `@worker/*`, `@shared/*`

### Authentication System
- **Better Auth** with Google OAuth and email/password
- Sessions stored in Cloudflare D1 database with 5-minute cookie caching
- Protected routes use `_authenticated/` directory pattern
- Auth middleware in `src/worker/middleware/`
- **React Components**: Use native `useSession()` hook from better-auth
- **Router/Loader**: Use Better Auth client directly in route loaders
- **Hono API Routes**: Use `requireAuth()` middleware for protected endpoints

### Database Architecture
- **Drizzle ORM** with **Cloudflare D1** (SQLite)
- Schema defined in `src/worker/db/schema.ts`
- Migrations in `src/worker/db/migrations/` directory
- Local development uses file-based SQLite

### API Architecture
- **Hono** framework with type-safe routing
- Routes in `src/worker/routes/`
- Middleware for authentication and session handling
- Full TypeScript integration with client
- Use **Hono RPC** with **TanStack React Query** for backend requests

### Frontend Architecture
- **TanStack Router** with file-based routing in `src/client/routes/`
- **TanStack Query** for server state management
- **TanStack Form** with Zod validation for all forms
- **Shadcn/ui** components in `src/client/components/ui/`

## Code Standards

### File Naming
- Use **kebab-case** for all files (enforced by Biome)
- React components end with `.tsx`
- API routes follow REST conventions
- **TanStack Router Dynamic Parameters**: Files like `$provider.tsx` use `$` as dynamic parameter placeholders (e.g., for OAuth providers) - do NOT rename to kebab-case

### Code Style (Biome)
- Tab indentation (2 spaces)
- Double quotes for strings
- Trailing commas always
- 80 character line width
- Unused imports/variables are errors

### Type Safety
- All API routes must be fully typed
- Shared Zod schemas between client/server
- Database operations through Drizzle ORM only

## Environment Setup

**Required Environment Variables:**

**Local Development (.dev.vars):**
```
ENVIRONMENT="development"
BETTER_AUTH_SECRET="random-secret-key"
BETTER_AUTH_URL="http://localhost:5173"
GOOGLE_CLIENT_ID="google-oauth-client-id"
GOOGLE_CLIENT_SECRET="google-oauth-client-secret"
```

**Production (wrangler.json vars or Cloudflare dashboard):**
```
ENVIRONMENT="production"
```

**Important:** `.dev.vars` takes precedence over `wrangler.json` vars during local development.

## Deployment Context

- Built specifically for **Cloudflare Workers** edge computing
- Single-page application with API on same domain
- Database is **Cloudflare D1** (serverless SQLite)
- Static assets served from Cloudflare Workers
- Uses `@cloudflare/vite-plugin` for seamless integration

## Authentication Notes

Email/password auth may fail with `503 cpuExceeded` error on Cloudflare free plan due to resource limits. Google OAuth is more reliable for development.

## Key Patterns

1. **Type-safe full-stack** - Shared types from database to frontend
2. **Edge-first architecture** - Optimized for global distribution
3. **File-based routing** - Both API routes and frontend routes
4. **Middleware pattern** - Hono middleware for cross-cutting concerns
5. **Schema-first validation** - Zod schemas shared between layers

## Pending Features - Builder Commitment System

Based on the mockup provided, we need to implement:

### Builder Commitments Page
- **Checkbox System**: 5 predefined commitments worth $5 each
  - "I'll show up weekly to build something ($5)"
  - "I'll give feedback when asked ($5)"
  - "I'll record a call with someone new ($5)"
  - "I'll nominate a builder I trust ($5)"
  - "I'll help another builder get unstuck ($5)"
- **Custom Input**: "Add your own" text field for custom commitments
- **Value Tracking**: Sum total intent value as user selects items
- **Unlock Threshold**: When total reaches $20+, unlock private join link
- **Success State**: "Great! We'll now generate a private link to join. Check your inbox or DMs soon."

### Technical Implementation
- Add to existing funnel after copy reveal step
- Store commitment selections in database
- Generate unique private links for qualified users
- Email/DM notification system for sending links
