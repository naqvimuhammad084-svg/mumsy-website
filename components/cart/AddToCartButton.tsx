'use client';

import { useCart } from '@/context/CartContext';
import { getEffectivePrice } from '@/lib/pricing';

type ProductLike = { id: string; name: string; price: number; sale_price?: number | null };

export function AddToCartButton({ product }: { product: ProductLike }) {
  const { addProduct } = useCart();
  const payPrice = getEffectivePrice(product.price, product.sale_price);

  return (
    <button
      type="button"
      onClick={() => addProduct({ id: product.id, name: product.name, price: payPrice })}
      className="inline-flex items-center justify-center rounded-full bg-mumsy-purple text-white px-3 py-2 text-xs font-semibold shadow-soft hover:bg-mumsy-dark transition"
    >
      Add to Cart
    </button>
  );
}

