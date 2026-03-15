/** Database types (Supabase) */

export type RangeRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  created_at?: string;
};

export type ProductRow = {
  id: string;
  range_id: string;
  name: string;
  description: string | null;
  price: number;
  benefits: string[] | null;
  ingredients: string[] | null;
  how_to_use: string[] | null;
  created_at?: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
};

export type BundleRow = {
  id: string;
  range_id: string;
  name: string;
  description: string | null;
  price: number;
  savings_label: string | null;
  created_at?: string;
};

export type BundleProductRow = {
  bundle_id: string;
  product_id: string;
  quantity: number;
};

export type OrderRow = {
  id?: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  order_notes: string | null;
  order_items: { id: string; name: string; price: number; quantity: number }[];
  total_price: number;
  payment_method: string;
  created_at?: string;
};

/** App-level types (with relations) */

export type Range = RangeRow & {
  products?: Product[];
  bundles?: Bundle[];
};

export type Product = ProductRow & {
  images: { url: string; sort_order: number }[];
};

export type Bundle = BundleRow & {
  products?: Product[];
  bundle_products?: { product_id: string; quantity: number }[];
};

/** Cart item (works with both Product and Bundle) */
export type CartItemPayload = {
  id: string;
  name: string;
  price: number;
  type: 'product' | 'bundle';
};
