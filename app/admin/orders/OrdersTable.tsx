'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  order_items: unknown;
  total_price: number;
  payment_method: string;
  created_at: string;
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || 'Delete failed');
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  if (orders.length === 0) {
    return <p className="text-mumsy-dark/70">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-mumsy-lavender/40 rounded-2xl overflow-hidden bg-white">
        <thead>
          <tr className="bg-mumsy-soft/50 border-b border-mumsy-lavender/40">
            <th className="text-left p-3 font-semibold text-mumsy-dark">Date</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Customer</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Phone</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Address</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Total</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Payment</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-mumsy-lavender/30">
              <td className="p-3 text-mumsy-dark/80">
                {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}
              </td>
              <td className="p-3">{o.customer_name}</td>
              <td className="p-3">{o.phone}</td>
              <td className="p-3 max-w-[200px] truncate" title={o.address}>
                {o.address}
              </td>
              <td className="p-3 font-semibold text-mumsy-purple">
                Rs {Number(o.total_price).toFixed(0)}
              </td>
              <td className="p-3">{o.payment_method}</td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => handleDelete(o.id)}
                  disabled={deletingId === o.id}
                  className="text-red-600 font-medium hover:underline disabled:opacity-50"
                >
                  {deletingId === o.id ? 'Deleting…' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
