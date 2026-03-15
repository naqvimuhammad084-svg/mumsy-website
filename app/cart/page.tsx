'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clear } = useCart();

  return (
    <div className="container-page py-10 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
        YOUR CART
      </p>
      <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
        Review your order.
      </h1>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-mumsy-dark/80">
          Your cart is currently empty. Browse our products and bundles to add
          items here.
        </p>
      ) : (
        <>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-mumsy-lavender/40 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-mumsy-dark">
                    {item.name}
                  </p>
                  <p className="text-xs text-mumsy-dark/70 capitalize">
                    {item.type}
                  </p>
                  <p className="mt-1 text-sm text-mumsy-purple font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-mumsy-lavender/60">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1 text-sm"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-mumsy-dark/70 hover:text-mumsy-purple"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-mumsy-lavender/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-mumsy-dark/80">Subtotal</span>
              <span className="font-semibold text-mumsy-purple">
                Rs {total.toFixed(0)}
              </span>
            </div>
            <p className="text-xs text-mumsy-dark/70">
              Taxes and delivery fees may vary and will be confirmed by our team
              via WhatsApp before you complete payment.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center justify-center rounded-full border border-mumsy-purple/40 px-4 py-2 text-xs font-semibold text-mumsy-purple hover:border-mumsy-purple hover:bg-mumsy-soft transition"
              >
                Clear cart
              </button>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-full bg-mumsy-purple text-white px-6 py-2 text-sm font-semibold shadow-soft hover:bg-mumsy-dark transition"
              >
                Proceed to Checkout
              </Link>
              <WhatsAppCheckoutButton />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WhatsAppCheckoutButton() {
  const url = 'https://wa.me/923032379096?text=Hi%20I%20would%20like%20to%20place%20an%20order%20for%20EILIYAH%20products';
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full border border-mumsy-purple/40 text-mumsy-purple px-6 py-2 text-sm font-semibold hover:bg-mumsy-soft transition"
    >
      WhatsApp Order
    </a>
  );
}

