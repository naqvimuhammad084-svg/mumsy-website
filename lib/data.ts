import { supabase } from '@/lib/supabase';
import type { Range, Product, Bundle } from '@/lib/types';

const DEFAULT_VINTIMA: Range = {
  id: 'vintima-default',
  name: 'VINTIMA',
  slug: 'vintima',
  logo_url: '/vintima-logo.png',
  description: 'Premium intimate care range.'
};

export async function getRanges(): Promise<Range[]> {
  try {
    const { data: ranges, error } = await supabase
      .from('ranges')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    const list = (ranges ?? []) as Range[];
    return list.length > 0 ? list : [DEFAULT_VINTIMA];
  } catch {
    return [DEFAULT_VINTIMA];
  }
}

export async function getRangeBySlug(slug: string): Promise<Range | null> {
  if (!slug || typeof slug !== 'string') return null;
  try {
    const normalized = slug.trim().toLowerCase();
    const { data: list, error } = await supabase
      .from('ranges')
      .select('*')
      .limit(10);
    if (error) return null;
    const found = (list ?? []).find((r: { slug?: string }) =>
      String((r.slug ?? '')).toLowerCase() === normalized
    );
    return found ? (found as Range) : null;
  } catch {
    return null;
  }
}

export async function getProductsByRangeId(rangeId: string): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('range_id', rangeId)
      .order('created_at', { ascending: true });
    if (error) throw error;

    const withImages: Product[] = await Promise.all(
      (products ?? []).map(async (p) => {
        const { data: imgs } = await supabase
          .from('product_images')
          .select('url, sort_order')
          .eq('product_id', p.id)
          .order('sort_order');
        return {
          ...p,
          images: (imgs ?? []).map((i) => ({ url: i.url, sort_order: i.sort_order ?? 0 })),
        } as Product;
      })
    );
    return withImages;
  } catch {
    return [];
  }
}

export async function getBundlesByRangeId(rangeId: string): Promise<Bundle[]> {
  try {
    const { data: bundles, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('range_id', rangeId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (bundles ?? []) as Bundle[];
  } catch {
    return [];
  }
}

export type BundleWithProducts = Bundle & {
  includedProducts: { product: Product; quantity: number }[];
};

export async function getBundlesWithProductsByRangeId(rangeId: string): Promise<BundleWithProducts[]> {
  try {
    const bundles = await getBundlesByRangeId(rangeId);
    const withProducts: BundleWithProducts[] = await Promise.all(
      bundles.map(async (b) => {
        const rows = await getBundleProductIds(b.id);
        const includedProducts = await Promise.all(
          rows.map(async ({ product_id, quantity }) => {
            const product = await getProductById(product_id);
            return product ? { product, quantity } : null;
          })
        );
        return {
          ...b,
          includedProducts: includedProducts.filter((x): x is { product: Product; quantity: number } => x != null),
        };
      })
    );
    return withProducts;
  } catch {
    return [];
  }
}

export async function getBundleWithProducts(id: string): Promise<BundleWithProducts | null> {
  try {
    const bundle = await getBundleById(id);
    if (!bundle) return null;
    const rows = await getBundleProductIds(bundle.id);
    const includedProducts = await Promise.all(
      rows.map(async ({ product_id, quantity }) => {
        const product = await getProductById(product_id);
        return product ? { product, quantity } : null;
      })
    );
    return {
      ...bundle,
      includedProducts: includedProducts.filter((x): x is { product: Product; quantity: number } => x != null),
    };
  } catch {
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !product) return null;

    const { data: imgs } = await supabase
      .from('product_images')
      .select('url, sort_order')
      .eq('product_id', id)
      .order('sort_order');

    return {
      ...product,
      images: (imgs ?? []).map((i) => ({ url: i.url, sort_order: i.sort_order ?? 0 })),
    } as Product;
  } catch {
    return null;
  }
}

export async function getBundleById(id: string): Promise<Bundle | null> {
  try {
    const { data: bundle, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !bundle) return null;
    return bundle as Bundle;
  } catch {
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;

    const withImages: Product[] = await Promise.all(
      (products ?? []).map(async (p) => {
        const { data: imgs } = await supabase
          .from('product_images')
          .select('url, sort_order')
          .eq('product_id', p.id)
          .order('sort_order');
        return {
          ...p,
          images: (imgs ?? []).map((i) => ({ url: i.url, sort_order: i.sort_order ?? 0 })),
        } as Product;
      })
    );
    return withImages;
  } catch {
    return [];
  }
}

export async function getAllBundles(): Promise<Bundle[]> {
  try {
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Bundle[];
  } catch {
    return [];
  }
}

export async function getAllBundlesWithProducts(): Promise<BundleWithProducts[]> {
  try {
    const bundles = await getAllBundles();
    const withProducts: BundleWithProducts[] = await Promise.all(
      bundles.map(async (b) => {
        const rows = await getBundleProductIds(b.id);
        const includedProducts = await Promise.all(
          rows.map(async ({ product_id, quantity }) => {
            const product = await getProductById(product_id);
            return product ? { product, quantity } : null;
          })
        );
        return {
          ...b,
          includedProducts: includedProducts.filter((x): x is { product: Product; quantity: number } => x != null),
        };
      })
    );
    return withProducts;
  } catch {
    return [];
  }
}

export async function getOrders(): Promise<
  { id: string; customer_name: string; phone: string; address: string; order_items: unknown; total_price: number; payment_method: string; created_at: string }[]
> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, customer_name, phone, address, order_items, total_price, payment_method, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as typeof data;
  } catch {
    return [];
  }
}

export async function createOrder(order: {
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  order_notes: string | null;
  order_items: { id: string; name: string; price: number; quantity: number }[];
  total_price: number;
  payment_method: string;
}): Promise<{ id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customer_name,
        phone: order.phone,
        address: [order.address, order.city].filter(Boolean).join(', '),
        order_items: order.order_items,
        total_price: order.total_price,
        payment_method: order.payment_method,
      })
      .select('id')
      .single();
    if (error) return { error: error.message };
    return { id: data?.id };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function deleteOrder(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  return error ? { error: error.message } : {};
}

// --- Ranges CRUD ---
export async function createRange(row: { name: string; slug: string; logo_url?: string | null; description?: string | null }): Promise<{ id?: string; error?: string }> {
  try {
    const { data, error } = await supabase.from('ranges').insert(row).select('id').single();
    if (error) return { error: error.message };
    return { id: data?.id };
  } catch (e) {
    return { error: String(e) };
  }
}
export async function updateRange(id: string, row: Partial<{ name: string; slug: string; logo_url: string | null; description: string | null }>): Promise<{ error?: string }> {
  const { error } = await supabase.from('ranges').update(row).eq('id', id);
  return error ? { error: error.message } : {};
}
export async function deleteRange(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('ranges').delete().eq('id', id);
  return error ? { error: error.message } : {};
}

// --- Products CRUD ---
export async function createProduct(row: { range_id: string; name: string; description?: string | null; price: number; benefits?: string[] | null; ingredients?: string[] | null; how_to_use?: string[] | null }): Promise<{ id?: string; error?: string }> {
  try {
    const { data, error } = await supabase.from('products').insert(row).select('id').single();
    if (error) return { error: error.message };
    return { id: data?.id };
  } catch (e) {
    return { error: String(e) };
  }
}
export async function updateProduct(id: string, row: Partial<{ range_id: string; name: string; description: string | null; price: number; benefits: string[] | null; ingredients: string[] | null; how_to_use: string[] | null }>): Promise<{ error?: string }> {
  const { error } = await supabase.from('products').update(row).eq('id', id);
  return error ? { error: error.message } : {};
}
export async function deleteProduct(id: string): Promise<{ error?: string }> {
  const { error: e2 } = await supabase.from('product_images').delete().eq('product_id', id);
  if (e2) return { error: e2.message };
  const { error } = await supabase.from('products').delete().eq('id', id);
  return error ? { error: error.message } : {};
}
export async function addProductImage(product_id: string, url: string, sort_order: number): Promise<{ error?: string }> {
  const { error } = await supabase.from('product_images').insert({ product_id, url, sort_order });
  return error ? { error: error.message } : {};
}
export async function removeProductImage(product_id: string, url: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('product_images').delete().eq('product_id', product_id).eq('url', url);
  return error ? { error: error.message } : {};
}

// --- Bundles CRUD ---
export async function createBundle(row: { range_id: string; name: string; description?: string | null; price: number; savings_label?: string | null }): Promise<{ id?: string; error?: string }> {
  try {
    const { data, error } = await supabase.from('bundles').insert(row).select('id').single();
    if (error) return { error: error.message };
    return { id: data?.id };
  } catch (e) {
    return { error: String(e) };
  }
}
export async function updateBundle(id: string, row: Partial<{ range_id: string; name: string; description: string | null; price: number; savings_label: string | null }>): Promise<{ error?: string }> {
  const { error } = await supabase.from('bundles').update(row).eq('id', id);
  return error ? { error: error.message } : {};
}
export async function deleteBundle(id: string): Promise<{ error?: string }> {
  const { error: e2 } = await supabase.from('bundle_products').delete().eq('bundle_id', id);
  if (e2) return { error: e2.message };
  const { error } = await supabase.from('bundles').delete().eq('id', id);
  return error ? { error: error.message } : {};
}
export async function setBundleProducts(bundle_id: string, items: { product_id: string; quantity: number }[]): Promise<{ error?: string }> {
  const { error: del } = await supabase.from('bundle_products').delete().eq('bundle_id', bundle_id);
  if (del) return { error: del.message };
  if (items.length === 0) return {};
  const { error } = await supabase.from('bundle_products').insert(items.map((i) => ({ bundle_id, product_id: i.product_id, quantity: i.quantity })));
  return error ? { error: error.message } : {};
}
export async function getBundleProductIds(bundle_id: string): Promise<{ product_id: string; quantity: number }[]> {
  const { data } = await supabase.from('bundle_products').select('product_id, quantity').eq('bundle_id', bundle_id);
  return (data ?? []) as { product_id: string; quantity: number }[];
}
