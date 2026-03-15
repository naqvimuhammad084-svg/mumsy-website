'use client';

import { useCart } from '@/context/CartContext';

type ProductLike = { id: string; name: string; price: number };

export function AddToCartButton({ product }: { product: ProductLike }) {
  const { addProduct } = useCart();

  return (
    <button
      type="button"
      onClick={() => addProduct({ id: product.id, name: product.name, price: product.price })}
      className="inline-flex items-center justify-center rounded-full bg-mumsy-purple text-white px-3 py-2 text-xs font-semibold shadow-soft hover:bg-mumsy-dark transition"
    >
      Add to Cart
    </button>
  );
}

