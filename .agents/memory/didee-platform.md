---
name: DIDEE Platform
description: Key decisions and gotchas for the DIDEE digital flagship fashion platform
---

## Schema decisions
- Collections and categories use `slug` as the FK in the products table (not integer ID) — readable URLs, simpler queries
- Prices stored as `numeric` strings in DB (`price` column), always `parseFloat()` before returning from API routes
- Images stored as `jsonb` arrays of URL strings
- Cart is session-based: UUID generated client-side stored in sessionStorage, sent as query param to `/api/cart`

## Package notes
- `uuid` package is required in `@workspace/didee` for cart sessionId generation — must be in package.json devDependencies

## Data flow
- OpenAPI spec → Orval codegen → `lib/api-client-react` (React Query hooks) + `lib/api-zod` (Zod schemas for server validation)
- Frontend imports hooks from `@workspace/api-client-react`, server imports Zod schemas from `@workspace/api-zod`

**Why:** Entity-shaped slug FKs make URL routing simpler; price-as-string is a PostgreSQL numeric precision requirement.
