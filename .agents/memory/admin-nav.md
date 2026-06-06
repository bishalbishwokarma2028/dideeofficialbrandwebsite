---
name: Admin Navigation
description: Why admin routes must not use AnimatePresence page transitions.
---

**Rule:** Admin routes (`/admin`, `/admin/*`) must be excluded from the `AnimatePresence mode="wait"` wrapper in `AnimatedRoutes` and from the `LogoPageTransition`.

**Why:** `AnimatePresence mode="wait"` uses `key={location}` which causes the entire Router to remount on every navigation. For admin, this disrupts the AdminLayout's sticky header, fixed bottom nav, and slide-in drawer state. It also causes a brief flash during transition that can confuse users into thinking the page didn't navigate.

**How to apply:** In `App.tsx → AnimatedRoutes()`, check `isAdmin = location.startsWith("/admin")` and return `<Router />` directly (no AnimatePresence). In `LogoPageTransition.tsx`, skip the animation if `location.startsWith("/admin")`.
