'use client';

import { useCart } from '@/context/CartContext';

type BundleLike = { id: string; name: string; price: number };

export function AddBundleToCartButton({ bundle }: { bundle: BundleLike }) {
  const { addBundle } = useCart();

  return (
    <button
      type="button"
      onClick={() => addBundle({ id: bundle.id, name: bundle.name, price: bundle.price })}
      className="inline-flex items-center justify-center rounded-full bg-mumsy-purple text-white px-4 py-2 text-xs font-semibold shadow-soft hover:bg-mumsy-dark transition"
    >
      Add Bundle to Cart
    </button>
  );
}

