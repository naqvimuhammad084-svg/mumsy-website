import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBundleWithProducts, getBundleById } from '@/lib/data';
import { AddBundleToCartButton } from '@/components/cart/AddBundleToCartButton';
import { bundles as staticBundles } from '@/data/bundles';
import { products as staticProducts } from '@/data/products';

type Props = { params: Promise<{ id: string }> };

export default async function BundleDetailPage({ params }: Props) {
  const { id } = await params;
  const dbBundle = await getBundleWithProducts(id);
  const staticBundle = staticBundles.find((b) => b.id === id);
  const bundle = dbBundle ?? staticBundle ?? await getBundleById(id);
  if (!bundle) return notFound();

  const includedProducts =
    dbBundle?.includedProducts ?? (
      'includedProducts' in bundle
        ? (bundle as { includedProducts?: string[] }).includedProducts ?? []
        : []
    );
  const staticIncluded =
    Array.isArray(includedProducts) && includedProducts.length > 0 && typeof includedProducts[0] === 'string'
      ? staticProducts.filter((p) => (includedProducts as string[]).includes(p.id))
      : [];

  const hasFullProducts = dbBundle && dbBundle.includedProducts.length > 0;

  return (
    <div className="container-page py-10 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
        BUNDLE
      </p>
      <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
        {bundle.name}
      </h1>
      {'description' in bundle && bundle.description && (
        <p className="mt-3 text-mumsy-dark/80">{bundle.description}</p>
      )}
      {'savings_label' in bundle && bundle.savings_label && (
        <p className="mt-1 text-sm font-medium text-mumsy-purple">{bundle.savings_label}</p>
      )}
      <p className="mt-4 text-2xl font-semibold text-mumsy-purple">
        Rs {bundle.price.toFixed(0)}
      </p>
      <div className="mt-4">
        <AddBundleToCartButton bundle={{ id: bundle.id, name: bundle.name, price: bundle.price }} />
      </div>

      {hasFullProducts && (
        <div className="mt-10">
          <h2 className="font-heading text-xl text-mumsy-dark">Included in this bundle</h2>
          <p className="mt-1 text-sm text-mumsy-dark/70">All products below are included for the bundle price.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {dbBundle!.includedProducts.map(({ product, quantity }) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex gap-4 rounded-2xl bg-white border border-mumsy-lavender/40 p-4 hover:border-mumsy-purple/50 transition"
              >
                <div className="relative w-24 h-24 shrink-0 rounded-xl bg-mumsy-soft overflow-hidden">
                  <Image
                    src={product.images?.[0]?.url?.trim() || '/eiliyah-logo.png'}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    unoptimized={(product.images?.[0]?.url?.trim() ?? '').startsWith('http')}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-mumsy-dark">{product.name}</h3>
                  {product.description && (
                    <p className="mt-0.5 text-sm text-mumsy-dark/70 line-clamp-2">{product.description}</p>
                  )}
                  <p className="mt-2 text-sm text-mumsy-purple">
                    ×{quantity} · Rs {product.price.toFixed(0)} each
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!hasFullProducts && staticIncluded.length > 0 && (
        <div className="mt-10">
          <h2 className="font-heading text-xl text-mumsy-dark">Included products</h2>
          <ul className="mt-3 space-y-2">
            {staticIncluded.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl bg-white border border-mumsy-lavender/40 px-4 py-3">
                <Link href={`/product/${p.id}`} className="text-mumsy-dark font-medium hover:text-mumsy-purple">
                  {p.name}
                </Link>
                <span className="text-mumsy-purple font-semibold">Rs {p.price.toFixed(0)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 text-sm text-mumsy-dark/70">
        All orders are shipped in discreet packaging.
      </p>
    </div>
  );
}
