import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRangeBySlug, getProductsByRangeId, getBundlesWithProductsByRangeId } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { BundleCard } from '@/components/BundleCard';
import type { Product } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

export default async function RangePage({ params }: Props) {
  const { slug } = await params;
  const rawSlug = typeof slug === 'string' ? slug : '';
  const range = await getRangeBySlug(rawSlug);

  const safeRange = range && range.id && (range.name ?? range.slug)
    ? {
        name: String(range.name ?? range.slug ?? 'Range'),
        logo_url: (range.logo_url && range.logo_url.trim()) ? range.logo_url : '/vintima-logo.png',
        description: range.description ?? null,
      }
    : null;

  if (!safeRange) {
    if (rawSlug.toLowerCase() === 'vintima') {
      return (
        <RangeLayout
          range={{
            name: 'VINTIMA',
            logo_url: '/vintima-logo.png',
            description: 'Premium intimate care range.'
          }}
          products={[]}
          bundlesWithProducts={[]}
        />
      );
    }
    return notFound();
  }

  const rangeId = range?.id ?? '';
  const [productsRaw, bundlesRaw] = await Promise.all([
    rangeId ? getProductsByRangeId(rangeId) : Promise.resolve([]),
    rangeId ? getBundlesWithProductsByRangeId(rangeId) : Promise.resolve([]),
  ]);

  // ✅ Map products to always include images
  const products = productsRaw.map((p) => ({
    ...p,
    images: p.images?.map((img) => ({ url: img.url })) ?? [],
  }));

  // ✅ Map bundles to ensure each included product has images
  const bundlesWithProducts = bundlesRaw.map((b) => ({
    ...b,
    includedProducts: b.includedProducts.map(({ product, quantity }) => ({
      product: {
        ...product,
        images: product.images?.map((img) => ({ url: img.url })) ?? [],
      },
      quantity,
    })),
  }));

  return (
    <RangeLayout
      range={safeRange}
      products={products}
      bundlesWithProducts={bundlesWithProducts}
    />
  );
}

function RangeLayout({
  range,
  products,
  bundlesWithProducts
}: {
  range: { name: string; logo_url: string | null; description: string | null };
  products: { id: string; name: string; price: number; description?: string | null; images: { url: string }[] }[];
  bundlesWithProducts: { id: string; name: string; price: number; description?: string | null; savings_label?: string | null; includedProducts: { product: { id: string; name: string; price: number; description?: string | null; images: { url: string }[] }; quantity: number }[] }[];
}) {
  const logoUrl = (range.logo_url && range.logo_url.trim()) ? range.logo_url : '/vintima-logo.png';

  return (
    <div className="min-h-screen">
      <section className="container-page pt-10 pb-12">
        <div className="rounded-3xl bg-gradient-to-b from-mumsy-lavender/30 to-mumsy-soft border border-mumsy-lavender/40 p-8 md:p-12 flex flex-col items-center text-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-white/80 overflow-hidden">
            <Image
              src={logoUrl}
              alt={range.name}
              fill
              className="object-cover"
              priority
              unoptimized={logoUrl.startsWith('http')}
            />
          </div>
          <h1 className="mt-6 font-heading text-3xl md:text-4xl text-mumsy-dark">
            {range.name}
          </h1>
          {range.description && (
            <p className="mt-3 text-mumsy-dark/80 max-w-xl">{range.description}</p>
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section className="container-page py-10">
          <h2 className="font-heading text-2xl text-mumsy-dark">Products</h2>
          <p className="mt-1 text-sm text-mumsy-dark/70">
            Gentle formulas designed for your intimate care routine.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  description: product.description ?? undefined,
                  images: product.images
                }}
              />
            ))}
          </div>
        </section>
      )}

      {bundlesWithProducts.length > 0 && (
        <section className="container-page py-10">
          <h2 className="font-heading text-2xl text-mumsy-dark">Bundles</h2>
          <p className="mt-1 text-sm text-mumsy-dark/70">
            Curated sets with built-in savings.
          </p>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {bundlesWithProducts.map((bundle) => (
              <BundleCard
                key={bundle.id}
                bundle={{
                  id: bundle.id,
                  name: bundle.name,
                  description: bundle.description,
                  price: bundle.price,
                  savings_label: bundle.savings_label,
                  includedProductDetails: bundle.includedProducts.map(({ product, quantity }) => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    images: product.images, // ✅ now safe
                    quantity,
                  })),
                }}
              />
            ))}
          </div>
        </section>
      )}

      {products.length === 0 && bundlesWithProducts.length === 0 && (
        <section className="container-page py-10 text-center text-mumsy-dark/70">
          <p>No products or bundles in this range yet.</p>
          <Link href="/ranges" className="mt-3 inline-block text-mumsy-purple font-medium">
            View all ranges
          </Link>
        </section>
      )}
    </div>
  );
}