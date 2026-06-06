---
name: Vercel Auth Architecture
description: How auth works across the cross-domain Vercel deployment (frontend on one domain, API on another).
---

## The Problem
On Vercel, the frontend (didee.vercel.app) and API (didee-api.vercel.app) are on different domains. Cross-domain cookies (`sameSite: none; Secure`) are blocked by Safari and privacy-focused browsers even when set correctly.

## The Solution: Bearer Tokens in localStorage

### API Server
- `lib/jwt.ts` exports `extractAdminToken(req)` and `extractUserToken(req)` that check:
  1. `Authorization: Bearer <token>` header (primary — works cross-domain)
  2. Cookie (fallback — works same-domain)
- `isAdminRequest(req)` and `getUserIdFromRequest(req)` are the guard helpers used in all protected routes
- Login/register responses include `{ token, ... }` in the response body (not just the cookie)
- All `req.session` references were dead code — no session middleware was ever configured. All replaced with JWT helpers.

### Frontend
- `api.ts` exports `authedFetch(url, opts)` and `adminFetch(url, opts)` — these read the token from localStorage and add `Authorization: Bearer` header automatically
- `CustomerAuthContext.tsx`: calls `setUserToken(data.token)` on login/register; `authedFetch` used for all protected calls
- `AdminAuthContext.tsx`: calls `setAdminToken(data.token)` on login; `adminFetch` used for all protected calls
- Token keys: `didee.user.token` (user) and `didee.admin.token` (admin) in localStorage
- Login/logout still send `credentials: "include"` for cookie fallback compatibility

## Content Storage
- `content.ts` previously wrote to local disk (wiped on Vercel) → now uses `site_content` table in PostgreSQL
- Table: `section TEXT PRIMARY KEY, data JSONB, updated_at TIMESTAMP`
- Falls back to `DEFAULT_CONTENT` if table query fails (safe on first deploy before migration)

## Database SSL
- `lib/db/src/index.ts` adds `ssl: { rejectUnauthorized: false }` in production
- Required for Supabase PostgreSQL connections

**Why:** Cross-domain cookies are unreliable across browsers (Safari blocks all 3rd-party cookies). Bearer tokens in localStorage work in 100% of browsers for cross-domain API calls.

**How to apply:** Any new protected route should import `isAdminRequest(req)` or `getUserIdFromRequest(req)` from `../lib/jwt.js`. Any new frontend page with auth-protected fetches should import `adminFetch` or `authedFetch` from `@/lib/api`.
