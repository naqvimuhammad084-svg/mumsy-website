'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export function CartSummary() {
  const { items, total } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-2 rounded-full border border-mumsy-purple/40 bg-white px-4 py-1.5 text-xs font-medium text-mumsy-dark hover:border-mumsy-purple hover:text-mumsy-purple transition"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-mumsy-purple text-white text-xs font-semibold">
        {count}
      </span>
      <span>Cart • Rs {total.toFixed(0)}</span>
    </Link>
  );
}

