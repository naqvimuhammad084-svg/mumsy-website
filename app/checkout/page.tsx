'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/data';

type PaymentMethod = 'cod' | 'debit_card' | 'credit_card' | 'whatsapp';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    orderNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment) {
      setError('Please select a payment method.');
      return;
    }
    setError(null);
    setLoading(true);

    if (payment === 'whatsapp') {
      const summary = items
        .map((i) => `${i.name} x${i.quantity} - Rs ${(i.price * i.quantity).toFixed(0)}`)
        .join('\n');
      const message = `Hi, I would like to place an order for EILIYAH products.\n\nName: ${form.fullName}\nPhone: ${form.phone}\nAddress: ${form.address}, ${form.city}\n\nItems:\n${summary}\nTotal: Rs ${total.toFixed(0)}`;
      window.open(
        `https://wa.me/923032379096?text=${encodeURIComponent(message)}`,
        '_blank'
      );
      setLoading(false);
      return;
    }

    const result = await createOrder({
      customer_name: form.fullName,
      phone: form.phone,
      address: form.address,
      city: form.city,
      order_notes: form.orderNotes || null,
      order_items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      })),
      total_price: total,
      payment_method: payment === 'cod' ? 'Cash on Delivery' : payment === 'debit_card' ? 'Debit Card' : 'Credit Card'
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    clear();
  };

  if (items.length === 0 && !success) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-heading text-2xl text-mumsy-dark">Your cart is empty</h1>
        <p className="mt-2 text-mumsy-dark/70">Add items before checkout.</p>
        <Link href="/shop" className="mt-4 inline-block text-mumsy-purple font-medium">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container-page py-16 max-w-lg mx-auto text-center">
        <div className="rounded-3xl bg-white border border-mumsy-lavender/40 shadow-soft p-8">
          <h1 className="font-heading text-2xl text-mumsy-dark">
            Order placed successfully
          </h1>
          <p className="mt-3 text-mumsy-dark/80">
            Our team will contact you shortly to confirm delivery.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-mumsy-purple text-white px-6 py-2.5 font-semibold hover:bg-mumsy-dark transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl text-mumsy-dark">Checkout</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">
        Enter your details and choose a payment method.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-2xl bg-white border border-mumsy-lavender/40 p-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark">Full Name</span>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark">Phone Number</span>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark">Delivery Address</span>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark">City</span>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark/80">Order Notes (optional)</span>
            <textarea
              value={form.orderNotes}
              onChange={(e) => setForm((f) => ({ ...f, orderNotes: e.target.value }))}
              rows={2}
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="rounded-2xl bg-white border border-mumsy-lavender/40 p-5">
          <h2 className="font-heading text-lg text-mumsy-dark">Select Payment Method</h2>
          <div className="mt-3 space-y-2">
            {[
              { id: 'cod' as const, label: 'Cash on Delivery (COD)' },
              { id: 'debit_card' as const, label: 'Debit Card' },
              { id: 'credit_card' as const, label: 'Credit Card' },
              { id: 'whatsapp' as const, label: 'WhatsApp Order' }
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  payment === opt.id
                    ? 'border-mumsy-purple bg-mumsy-soft/50'
                    : 'border-mumsy-lavender/40 hover:border-mumsy-purple/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === opt.id}
                  onChange={() => setPayment(opt.id)}
                  className="text-mumsy-purple"
                />
                <span className="text-sm font-medium text-mumsy-dark">{opt.label}</span>
              </label>
            ))}
          </div>

          {(payment === 'credit_card' || payment === 'debit_card') && (
            <div className="mt-4 p-4 rounded-xl bg-mumsy-soft/60 border border-mumsy-lavender/40 text-sm text-mumsy-dark">
              <p className="font-semibold text-mumsy-dark">Pay online (Pakistan)</p>
              <p className="mt-1 text-mumsy-dark/80">
                After you place the order, our team will contact you with payment options:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-0.5 text-mumsy-dark/80">
                <li><strong>JazzCash</strong> – send payment to our JazzCash number</li>
                <li><strong>EasyPaisa</strong> – send payment to our EasyPaisa number</li>
                <li><strong>Bank transfer</strong> – we will share our bank account details</li>
                <li><strong>Card payment</strong> – we may send a secure payment link for debit/credit card</li>
              </ul>
              <p className="mt-2 text-mumsy-dark/70">
                Select your preferred method when we call or WhatsApp you. Your order will be confirmed once payment is received.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-mumsy-soft/50 border border-mumsy-lavender/40 p-4 flex justify-between items-center">
          <span className="font-semibold text-mumsy-dark">Total</span>
          <span className="text-xl font-semibold text-mumsy-purple">
            Rs {total.toFixed(0)}
          </span>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-mumsy-purple text-white py-3 font-semibold shadow-soft hover:bg-mumsy-dark transition disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
