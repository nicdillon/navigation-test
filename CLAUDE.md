# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5 application built with React 19 and TypeScript, designed to demonstrate server-side rendering with aggressive no-cache behavior. The project serves as a test bed for navigation and caching behavior in Next.js.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`

## Architecture

### Caching Strategy

The application is specifically configured to prevent all caching at multiple levels:

1. **Middleware-level** (middleware.ts:1): Global middleware adds `Cache-Control: no-store` headers to all responses
2. **Page-level**: Both `app/page.tsx` and `app/about/page.tsx` export `dynamic = 'force-dynamic'` and `revalidate = 0`
3. **Purpose**: Ensures the server time displayed on the home page updates on every page refresh

### Client/Server Component Pattern

The app demonstrates Next.js's split rendering model:

- **Root Layout** (app/layout.tsx:1): Uses `'use client'` directive despite being the root layout
- **Server Components**: Both page routes (`app/page.tsx` and `app/about/page.tsx`) are async server components that call `headers()` from `next/headers`
- **Client Component**: `counter-button.tsx` uses React state and is explicitly marked with `'use client'`

### Navigation Implementation

Navigation uses standard HTML `<a>` tags with `href` attributes rather than Next.js's `<Link>` component. This is intentional for testing purposes as it affects caching and navigation behavior.

## Module Resolution

TypeScript is configured with path alias `@/*` mapping to the project root (tsconfig.json:24), though it's not currently used in the codebase.
