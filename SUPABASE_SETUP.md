# Supabase setup guide for EILIYAH / Mumsy

Follow this to create or reset your Supabase tables so they match the app. Do this in order.

---

## 1. Open your Supabase project

1. Go to **https://supabase.com/dashboard** and sign in.
2. Open your project (the one whose URL is in your `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`).
3. If the project is **Paused**, click **Restore project** and wait until it’s running.

---

## 2. Run the SQL (recommended – creates everything at once)

1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Copy the **entire** SQL below and paste it into the editor.
4. Click **Run** (or press Ctrl+Enter).

```sql
-- ============================================
-- EILIYAH / Mumsy – full schema (run once)
-- ============================================

-- Ranges (e.g. VINTIMA)
CREATE TABLE IF NOT EXISTS public.ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products (belong to a range)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  range_id UUID NOT NULL REFERENCES public.ranges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  benefits JSONB,
  ingredients JSONB,
  how_to_use JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product images (one product can have many images)
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Bundles (belong to a range)
CREATE TABLE IF NOT EXISTS public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  range_id UUID NOT NULL REFERENCES public.ranges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  savings_label TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bundle ↔ Products (many-to-many)
CREATE TABLE IF NOT EXISTS public.bundle_products (
  bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (bundle_id, product_id)
);

-- Orders (checkout; address includes street + city in one field)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  order_items JSONB NOT NULL DEFAULT '[]',
  total_price NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow anonymous read/write for now (your app uses anon key).
-- For production you may want Row Level Security (RLS) and policies.
ALTER TABLE public.ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for ranges" ON public.ranges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for product_images" ON public.product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for bundles" ON public.bundles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for bundle_products" ON public.bundle_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Optional: insert a default range so /range/vintima works
INSERT INTO public.ranges (name, slug, description)
VALUES ('VINTIMA', 'vintima', 'Premium intimate care range.')
ON CONFLICT (slug) DO NOTHING;
```

5. You should see **Success** at the bottom. If you see errors about “relation already exists”, that’s okay — it means tables are already there; you can then either drop them and run again, or skip to step 3.

---

## 3. Storage buckets (range logos + product images)

Create **two** buckets so admin-uploaded range logos and product images work and show on the website.

### 3a. Range logos

1. In the left sidebar click **Storage**.
2. Click **New bucket**.
3. **Name:** `range-logos`
4. Turn **Public bucket** **ON** (so range logos show on the site).
5. Click **Create bucket**.
6. Open the `range-logos` bucket → **Policies** tab → **New policy** → “For full customization” → create a policy that allows **INSERT** for role `anon` (so the app can upload when adding a range). Or use: Policy name `Allow anon upload`, Allowed operation **INSERT**, Target roles `anon`, WITH CHECK expression `true`.

### 3b. Product images

1. In **Storage**, click **New bucket** again.
2. **Name:** `product-images`
3. Turn **Public bucket** **ON**.
4. Click **Create bucket**.
5. Open `product-images` → **Policies** → add a policy that allows **INSERT** for role `anon` (so the app can upload product images).

Without these buckets (and with Public ON), range logos and product images will not upload or will not display; the site will show the default EILIYAH/Vintima logo instead.

**Product image uploads** use the **service role key** so they work even if storage policies are strict. In your project root `.env.local`, add (if not already there):

- `SUPABASE_SERVICE_KEY=your-service-role-key`

Find it in Supabase Dashboard → **Settings** → **API** → **service_role** (secret). Restart the dev server after adding it.

---

## 4. Auth (admin sign-in)

1. In the left sidebar click **Authentication** → **Providers**.
2. Make sure **Email** is **Enabled**.
3. (Optional) Under **Email**, enable **Confirm email** if you want users to verify email; for local testing you can leave it off.
4. Create your admin user:
   - Go to **Authentication** → **Users**.
   - Click **Add user** → **Create new user**.
   - **Email:** use the same as in your `.env.local`: `NEXT_PUBLIC_ADMIN_EMAIL` (e.g. `naqvimuhammad247@gmail.com`).
   - **Password:** set a password (you’ll use this on the admin login page).
   - Click **Create user**.

Use this email and password on **Admin Login** (`/admin/login`) in your app.

---

## 5. If you already had tables and want to start fresh

Only do this if you’re okay losing existing data.

1. **SQL Editor** → **New query**.
2. Run this to drop tables (order matters because of foreign keys):

```sql
DROP TABLE IF EXISTS public.bundle_products;
DROP TABLE IF EXISTS public.product_images;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.bundles;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.ranges;
```

3. Then run the full SQL from **Step 2** again to create the tables.

---

## 6. Check that tables exist

1. Go to **Table Editor** in the left sidebar.
2. You should see: `ranges`, `products`, `product_images`, `bundles`, `bundle_products`, `orders`.
3. Open **ranges** — you can have one row (e.g. VINTIMA with slug `vintima`). If not, add one from the admin panel after logging in, or run the `INSERT` from the SQL in Step 2.

---

## 7. Restart your app

1. In your project folder, stop the dev server (Ctrl+C).
2. Run `npm run dev` again.
3. Try:
   - **Admin:** go to `/admin/login`, sign in with the Supabase user you created.
   - **Ranges:** go to `/ranges`, click a range (e.g. VINTIMA) — the `/range/vintima` page should load.
   - **Order:** add something to cart, checkout, place order — it should succeed without “city” or “order_notes” errors.

---

## Summary

| What was wrong | Fix |
|----------------|-----|
| Sign-in then back to login | Middleware was always redirecting `/admin` to `/admin/login`. Middleware no longer does that; the admin layout checks the session and redirects only when not signed in. |
| Range undefined / 404 | `getRangeBySlug` now finds by slug in a way that works even if the table structure or casing differs; range page handles missing data safely. |
| `order_notes` column error | App no longer inserts `order_notes`. New `orders` table has only: `customer_name`, `phone`, `address`, `order_items`, `total_price`, `payment_method`, `created_at`. |
| Tables out of sync | This guide gives you one SQL script so your Supabase schema matches the app. |

If you still see “column not found” or “relation does not exist”, run the SQL in Step 2 again and make sure there are no errors in the SQL Editor.
