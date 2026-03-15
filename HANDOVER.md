# EILIYAH Website — Handover to Client

Use this when you deploy the site and hand it over to your client. It explains **two separate areas** of the site and how to set them up.

---

## 1. Two panels (what to tell the client)

### Customer site (shopping / user panel)

- **URL:** The main website address (e.g. `https://your-domain.com` or `https://your-app.vercel.app`).
- **Who uses it:** Shoppers / customers.
- **What they do:** Browse products, ranges, bundles, add to cart, checkout, WhatsApp consultation.
- **No login:** Customers do **not** sign in. They just use the site.

**What to tell the client:**  
*“Your customers use your normal website link. They shop, add to cart, and checkout. They never need to sign in.”*

---

### Admin panel (back office)

- **URL:** Same site + `/admin`  
  Examples:  
  - `https://your-domain.com/admin`  
  - `https://your-app.vercel.app/admin`
- **Who uses it:** Only the client (site owner) or staff you authorize.
- **What they do:** Manage ranges, products, bundles, view orders. Sign in required.
- **Login:** Admin **must** sign in. If not signed in, visiting `/admin` sends them to the **Sign in** page.

**What to tell the client:**  
*“To manage products and orders, go to your website address and add `/admin` at the end. You’ll see a sign-in page. Use the email and password you created when we set up your admin account.”*

---

## 2. Before handover — what you do

### A. Deploy the site

Deploy as usual (e.g. Vercel). Ensure in your hosting:

- **Environment variables** are set (same as `.env.local`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (Optional) `NEXT_PUBLIC_ADMIN_EMAIL` — see below.

### B. Create the first admin account (one-time)

1. Open the **admin sign-up** page:  
   `https://your-deployed-url.com/admin/signup`
2. Enter the **client’s email** (e.g. their Gmail) and a **password** (at least 6 characters).
3. Click **Sign up**.
4. If Supabase is set to “Confirm email”:
   - They receive an email; they click the link, then go to **Sign in**.
5. If confirmation is off:
   - They are signed in and taken to the admin dashboard.

Give the client:

- **Admin URL:** `https://your-domain.com/admin` (or your real URL).
- **Sign-in URL:** `https://your-domain.com/admin/login` (if they ever need it directly).
- **Email and password** you used (or ask them to set the password on first sign-in and keep it safe).

### C. Optional: lock admin to one email

If you want **only one email** to be able to sign in as admin:

1. In your hosting (e.g. Vercel), add:
   - **Name:** `NEXT_PUBLIC_ADMIN_EMAIL`  
   - **Value:** the client’s email (e.g. `client@gmail.com`)
2. Redeploy if needed.

Then:

- Only that email can sign in to `/admin`.
- Other emails get “Access denied” or “This email is not an admin” if they try to sign up or sign in.

**What to tell the client:**  
*“Only this email can access the admin panel. If you want to change it later, we can update the setting.”*

---

## 3. Short summary for the client (you can copy-paste)

**Customer site (shoppers):**  
- Open: **your main website URL** (e.g. `https://yoursite.com`).  
- No sign-in. They shop and checkout as normal.

**Admin panel (you / staff):**  
- Open: **your website URL + `/admin`** (e.g. `https://yoursite.com/admin`).  
- Sign in with the **admin email and password** we set up.  
- From there you manage ranges, products, bundles, and orders.

Sign-in and sign-up are **only for admin**. Customers never see them and never need an account.
