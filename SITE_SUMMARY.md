## EILIYAH / Mumsy Store – Tech & Design Summary

### Tech stack
- **Framework**: Next.js 13+ App Router (TypeScript)
- **Styling**: Tailwind CSS with custom EILIYAH color tokens (`mumsy-purple`, `mumsy-lavender`, `mumsy-soft`, `mumsy-dark`)
- **Runtime**: React server components + client components where needed (`'use client'`)
- **State**:
  - Cart state in a dedicated `CartContext` with context provider
  - Admin forms using React `useState`
- **Auth & DB**:
  - Supabase used for:
    - Authentication for admin (`/admin/login`, `/admin/signup`, `/api/auth/*`)
    - Data tables for `ranges`, `products`, `bundles`, `orders`
  - Supabase Storage buckets:
    - `range-logos` for range logos
    - `product-images` for product photos
- **Build tooling**: TypeScript, ESLint, Tailwind/PostCSS, `tsconfig.json` configured for `@/` imports

### Routing / pages
- **Storefront**
  - `/` – Home:
    - `Hero` section with big centered brand image
    - “Our ranges” section with range cards
    - Featured products (using `ProductCard`)
    - Featured bundles (using `BundleCard`)
    - Education and testimonials sections
  - `/shop` – All products grid using `ProductCard`
  - `/product/[id]` – Product detail page:
    - `ProductGallery` at top
    - Details, benefits, ingredients, how to use
    - Add-to-cart actions
  - `/bundles` – All bundles list using `BundleCard`
  - `/bundle/[id]` – Bundle detail page with included products list
  - `/ranges` – All ranges grid with logo cards
  - `/range/[slug]` – Single range landing:
    - Big logo header
    - Range-specific product grid
    - Range-specific bundle list
  - `/cart` – Cart page with `CartSummary`
  - `/about`, `/faq`, `/shop`, `/bundle/*` – standard marketing + shop pages styled with same design system

- **Admin**
  - Layout: `/admin/layout.tsx`
    - Protects all admin routes using Supabase auth session
    - Redirects to `/admin/login` when not logged in
    - Optionally enforces `NEXT_PUBLIC_ADMIN_EMAIL` for extra safety
  - `/admin/login` – Admin sign-in form (Supabase password auth via `/api/auth/login`)
  - `/admin/signup` – Optional admin signup (Supabase email/password via `/api/auth/signup`)
  - `/admin` – Dashboard linking to all management sections
  - `/admin/ranges`
    - CRUD for `ranges` table
    - Upload logo images to `range-logos` bucket via `/api/admin/ranges*`
  - `/admin/products`
    - CRUD for `products` table
    - Multi-image upload, stored in `product-images` bucket and linked through a `product_images` table
  - `/admin/bundles`
    - Create and edit bundles, link products to bundles
  - `/admin/orders`
    - View customer orders

### Global shell & layout
- **Root layout** (`app/layout.tsx`)
  - Applies global Tailwind styles from `app/globals.css`
  - Wraps all pages in `StoreShell`
- **StoreShell**
  - Renders:
    - `Navbar` at top (fixed)
    - `SplashScreen` on first visit (session-based)
    - Main page content
    - `Footer`
    - Floating WhatsApp button
  - Provides `CartContext` so all pages can read/update cart

### Visual design system
- **Colors** (in `globals.css` and `tailwind.config`):
  - `mumsy-purple`: primary brand purple
  - `mumsy-lavender`: soft lavender for borders and accents
  - `mumsy-soft`: off-white background
  - `mumsy-dark`: deep purple for headings and body text
- **Typography**:
  - `font-heading`: for main headings, titles, hero text, cards
  - `font-body`: for general copy and labels
- **Components / sections**:
  - `Navbar`
    - Fixed at top, white glassy background, lavender border
    - Left: rounded purple logo block with full-cover brand mark
    - Center: main nav links (Home, Shop, Bundles, Ranges, About, FAQ)
    - Right: cart summary and mobile menu toggle
  - `Hero`
    - Left: large title and copy, primary and secondary CTAs
    - Right: tall 4:5 card with full-cover brand image and soft gradient glow
  - `ProductCard`
    - Rounded 3xl white card with lavender border and soft shadow
    - Fixed 4:5 image area; product image **covers the entire area**
    - Below: name, short benefit/description, price, “View details” + Add to cart
  - `ProductGallery`
    - 4:5 image container with gradient background
    - Main image fills the space (cover)
    - Left/right arrows and dots for multiple images
    - Fallback: brand image filling the frame
  - `BundleCard`
    - Price and savings badge at top
    - Description and “Includes” list
    - Included products grid: each thumbnail is a square image that **fully covers** its box
    - CTA: Add bundle to cart + View bundle
  - `EducationSection`
    - Educational content about intimate care, aligned with brand look
  - `TestimonialSection`
    - Customer quotes styled with soft cards and brand colors
  - `WhatsAppButton`
    - Floating rounded button for quick contact
  - `SplashScreen`
    - Full-screen gradient from dark to purple
    - Large, rounded rectangular card with glow and full-cover brand image
    - Brand name + subtitle below
    - Shown only once per browser session via `sessionStorage`

### Data & API layer
- **Data types** (`lib/types.ts`)
  - `Range`, `Product`, `Bundle`, `Order`, etc. shared between client and server
- **Static seed data** (`data/*.ts`)
  - Default `ranges`, `products`, `bundles` used when the database is empty or for static pages
- **APIs**
  - `/api/admin/ranges` (GET/POST) and `/api/admin/ranges/[id]` (PATCH/DELETE)
  - `/api/admin/products` and `/api/admin/products/upload-image`
  - `/api/admin/orders/[id]` etc. for order operations
  - `/api/auth/login` and `/api/auth/signup` for admin auth

### Auth behavior (admin)
- Supabase client is created in `lib/supabase.ts`:
  - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `persistSession: false` so sessions are not stored across full page reloads
- `app/admin/layout.tsx`:
  - On load, checks Supabase `auth.getSession()`
  - If **no session** and path is not `/admin/login` or `/admin/signup` → redirect to `/admin/login`
  - If **session exists** and user is on login/signup → redirect to `/admin`
  - If `NEXT_PUBLIC_ADMIN_EMAIL` is set and logged-in user’s email doesn’t match → sign out and send back to `/admin/login`

### How to “copy-paste” this site
- **Core pieces to replicate:**
  1. **Global layout**: `app/layout.tsx`, `StoreShell`, `Navbar`, `Footer`, `globals.css`, Tailwind config
  2. **Design system**: the Tailwind color tokens, font setup, border radius (`rounded-3xl`), shadows, gradients
  3. **Storefront pages**: all `app/*.tsx` pages for home, shop, product, bundles, ranges, cart, about, faq
  4. **Reusable components**: `ProductCard`, `BundleCard`, `ProductGallery`, `EducationSection`, `TestimonialSection`, `WhatsAppButton`, `SplashScreen`
  5. **Cart context**: `CartContext` and the `AddToCartButton/AddBundleToCartButton` components
  6. **Admin area**: `app/admin/**/*` pages + Supabase-powered APIs in `app/api/admin/**/*`
  7. **Supabase util**: `lib/supabase.ts`, `lib/storage.ts`, and any data helpers in `lib/data.ts`

- **To rebuild the same site elsewhere:**
  - Create a new Next.js + Tailwind project
  - Copy:
    - `app` directory (pages, layouts, API routes)
    - `components` directory
    - `context`, `lib`, `data`
    - Tailwind and PostCSS config, `tsconfig`, and `SITE_SUMMARY.md`
  - Set Supabase project URL and anon key in `.env.local`
  - Recreate the database tables (`ranges`, `products`, `bundles`, `orders`, etc.) and buckets (`range-logos`, `product-images`) in Supabase to match this project’s schema

