---
name: Auth Gate for Cart and Wishlist
description: Cart and wishlist require sign-in; enforced at component level.
---

**Rule:** Users must be signed in to add to cart or wishlist. Check `authenticated` from `useCustomerAuth()` before any cart/wishlist action. If not authenticated, show a toast ("Sign in required") and navigate to `/login`.

**Why:** User requirement — anonymous browsing is allowed but cart and wishlist are account-bound features.

**How to apply:** Both `ProductCard.tsx` (wishlist heart) and `ProductShow.tsx` (Add to Cart button + wishlist heart) implement this check. The Add to Cart button also changes its label to "Sign In to Buy" with a lock icon when the user is not authenticated.
