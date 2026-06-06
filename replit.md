# DIDEE – Digital Flagship Fashion Platform

DIDEE is a luxury digital flagship platform for a modern Nepalese fashion brand — combining editorial ecommerce, fashion journal, lookbook, admin dashboard, and community into one world-class experience.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/didee run dev` — run the frontend (port 21971)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Fonts: Cormorant Garamond (editorial headings), Inter (body)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — DB schema: `products.ts`, `orders.ts`, `content.ts`
- `artifacts/api-server/src/routes/` — Express route handlers (one file per domain)
- `artifacts/didee/src/` — React frontend (pages, components, context)
- `artifacts/didee/src/context/CartContext.tsx` — Cart state (sessionStorage + API)

## Architecture decisions

- Contract-first: OpenAPI spec → Orval codegen → typed React Query hooks + Zod schemas
- Collections and categories use slug as the foreign key (not integer ID) for readable URLs
- Cart is session-based (UUID in sessionStorage), no auth required
- Prices stored as numeric strings in DB, parsed to float in API responses
- Product images are stored as JSON array of URLs in the DB

## Product

**Customer-facing:**
- Homepage with cinematic hero, featured collections, new arrivals, best sellers, journal preview, lookbook
- Shop with filtering by collection/category/price, sorting
- Collection landing pages
- Product detail with variants (size/color), reviews, related products
- Fashion journal (editorial blog)
- Lookbook gallery
- Brand story (About page)
- Cart and checkout (eSewa, Khalti, COD, Card)
- Customer account

**Admin:**
- Dashboard with revenue summary, recent orders, top products
- Product management (create/edit/delete, variants)
- Collection management
- Order management with status updates
- Customer management
- Journal post management

## Brand Identity

- Name: DIDEE
- Tagline: BUILT IN NEPAL. MADE FOR EVERYONE.
- Colors: #0A0A0A (primary), #FFFFFF (secondary), #C9A86A (gold accent), #F5F3EF (neutral)
- Typography: Cormorant Garamond (headings), Inter (body)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The `uuid` package must be installed in `@workspace/didee` — used for cart sessionId generation
- Collections use `slug` as FK in products, not numeric ID
- Prices come back as `number` from the API (parsed from DB numeric strings in route handlers)
- DB schema push: `pnpm --filter @workspace/db run push`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
