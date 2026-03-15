import Link from 'next/link';
import Image from 'next/image';
import { AddBundleToCartButton } from '@/components/cart/AddBundleToCartButton';

export type BundleProductDetail = {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  quantity: number;
};

export type BundleCardData = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  savingsLabel?: string | null;
  savings_label?: string | null;
  includedProducts?: string[];
  products?: { name: string }[];
  includedProductDetails?: BundleProductDetail[];
};

export function BundleCard({ bundle }: { bundle: BundleCardData }) {
  const savings = bundle.savingsLabel ?? bundle.savings_label ?? '';
  const hasDetails = bundle.includedProductDetails && bundle.includedProductDetails.length > 0;
  const included = hasDetails
    ? bundle.includedProductDetails!
    : bundle.includedProducts
      ? bundle.includedProducts.map((name) => ({ id: '', name, price: 0, quantity: 1 }))
      : bundle.products ?? [];

  return (
    <article className="bg-white rounded-3xl border border-mumsy-lavender/40 shadow-soft/40 overflow-hidden flex flex-col">
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg text-mumsy-dark">{bundle.name}</h3>
            {savings && (
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mumsy-purple/80">
                {savings}
              </p>
            )}
          </div>
          <p className="text-xl font-semibold text-mumsy-purple">
            Rs {bundle.price.toFixed(0)}
          </p>
        </div>
        {bundle.description && (
          <p className="text-sm text-mumsy-dark/80">{bundle.description}</p>
        )}

        {hasDetails ? (
          <div className="mt-3">
            <p className="text-xs font-semibold text-mumsy-dark/70 mb-2">Includes:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {bundle.includedProductDetails!.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="flex flex-col rounded-xl border border-mumsy-lavender/40 overflow-hidden bg-mumsy-soft/40 hover:border-mumsy-purple/50 transition"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={p.imageUrl?.trim() || '/eiliyah-logo.png'}
                      alt={p.name}
                      fill
                      className="object-contain p-2"
                      unoptimized={(p.imageUrl?.trim() ?? '').startsWith('http')}
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs font-medium text-mumsy-dark line-clamp-2">{p.name}</p>
                    <p className="text-xs text-mumsy-purple mt-0.5">
                      ×{p.quantity} · Rs {p.price.toFixed(0)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          included.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-mumsy-dark/70">Includes:</p>
              <ul className="mt-1 text-xs text-mumsy-dark/80 list-disc list-inside space-y-0.5">
                {included.map((p, i) => (
                  <li key={i}>{typeof p === 'string' ? p : 'name' in p ? p.name : ''}</li>
                ))}
              </ul>
            </div>
          )
        )}

        <div className="mt-auto pt-3 flex gap-2">
          <AddBundleToCartButton bundle={bundle} />
          <Link
            href={`/bundle/${bundle.id}`}
            className="inline-flex items-center justify-center rounded-full border border-mumsy-purple/40 text-mumsy-purple px-4 py-2 text-xs font-semibold hover:bg-mumsy-soft transition"
          >
            View bundle
          </Link>
        </div>
      </div>
    </article>
  );
}
