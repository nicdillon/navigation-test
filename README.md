# Next.js Navigation Cache Test

## The Challenge

When users navigate forward through a Next.js application and then use the browser's back button to return to the root page, they may see stale data. This happens because of two caching mechanisms:

1. **Next.js Router Cache** - Next.js caches route data in memory for fast client-side navigation
2. **Browser bfcache (back/forward cache)** - Modern browsers fully restore pages from memory, including JavaScript state

For pages that display time-sensitive or frequently-changing data (like cart totals, live prices, or server timestamps), serving cached content on back navigation creates a poor user experience.

## The Solution

This project demonstrates how to force revalidation of the root page when users navigate back to it via browser back/forward buttons, while avoiding unnecessary refreshes on normal link navigation.

### Implementation Overview

The solution uses a combination of browser events and React hooks to detect back/forward navigation and trigger `router.refresh()` at the right time.

**Key Components:**

1. **Event Listeners**
   - `popstate` - Detects when back/forward buttons are clicked
   - `pageshow` - Detects when a page is restored from bfcache

2. **React Refs for State Tracking**
   - `wasPopState` - Tracks whether the last navigation was via back/forward buttons
   - `prevPathname` - Tracks the previous route to detect "navigated TO root FROM another page"

3. **Two useEffect Hooks**
   - First effect: Attaches event listeners once on mount
   - Second effect: Triggers refresh after React completes navigation

### Why Each Piece is Required

```tsx
const wasPopState = useRef(false)
const prevPathname = useRef(pathname)
```
- **`wasPopState`**: Distinguishes back/forward navigation from link clicks (we only want to refresh on back/forward)
- **`prevPathname`**: Tracks where we came from to detect "navigated TO root FROM another page"

```tsx
useEffect(() => {
  const onPopState = () => {
    wasPopState.current = true  // Mark that back/forward button was clicked
  }

  const onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted && pathname === '/') {
      router.refresh()  // Handle bfcache restoration
    }
  }

  window.addEventListener('popstate', onPopState)
  window.addEventListener('pageshow', onPageShow)

  return () => { /* cleanup */ }
}, [])
```
- **`popstate` listener**: Fires when back/forward buttons are clicked, sets flag
- **`pageshow` listener**: Fires when page is restored from bfcache (`e.persisted === true`), immediately refreshes
- **Empty dependency array**: Listeners attached once, stay attached (prevents memory leaks from constant cleanup/reattachment)

```tsx
useEffect(() => {
  if (pathname === '/' && prevPathname.current !== '/' && wasPopState.current) {
    router.refresh()  // Refresh Next.js router cache
    wasPopState.current = false  // Reset flag
  }
  prevPathname.current = pathname  // Update previous pathname
}, [pathname, router])
```
- **Waits for pathname to update**: Ensures `router.refresh()` runs AFTER React finishes navigation
- **Checks all conditions**: Only refreshes when (1) now at root, (2) came from different page, (3) via back/forward button
- **Resets flag**: Prevents refresh on next navigation
- **Updates previous pathname**: Tracks navigation history

### What Breaks Without Each Piece

| Without... | What breaks |
|------------|-------------|
| `wasPopState` ref | Refreshes on ALL navigation (including link clicks) |
| `prevPathname` ref | Can't detect if we actually navigated TO root |
| `popstate` listener | Can't detect back/forward button usage |
| `pageshow` listener | Misses bfcache restores (full page restore from memory) |
| Second `useEffect` | `router.refresh()` fires before navigation completes (wrong page refreshed) |

## Project Structure

```
app/
├── layout.tsx                    # Root layout with back/forward navigation refresh logic
├── page.tsx                      # Root page displaying server timestamp
├── about/
│   └── page.tsx                  # About page for navigation testing
├── cart/
│   ├── page.tsx                  # Cart page (server component with refresh logic)
│   └── back-navigation-refresh.tsx  # Invisible client component handling cart refresh
└── pdp/
    └── page.tsx                  # Product page with add-to-cart action
```

## Testing the Implementation

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test root page refresh:**
   - Visit the root page (`/`) and note the server timestamp
   - Click "Go to About Page"
   - Click browser back button
   - Timestamp should update (not cached)

3. **Test cart page refresh:**
   - Visit the PDP page (`/pdp`)
   - Add items to cart
   - Navigate to cart page (`/cart`)
   - Go back to PDP and add more items
   - Use browser back button to return to cart
   - Cart should show updated data (not cached)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Node.js 18+

## Key Configuration

All pages use aggressive cache-busting configuration:

```tsx
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
```

This ensures data is always fetched fresh from the server, even on forward navigation.
