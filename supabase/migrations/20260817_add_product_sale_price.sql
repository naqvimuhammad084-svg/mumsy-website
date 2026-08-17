-- Optional sale/discount price for products (safe to run multiple times).
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sale_price NUMERIC;

COMMENT ON COLUMN public.products.sale_price IS 'Optional discounted price; when set and lower than price, customers pay sale_price.';
