'use client';

import { useState } from 'react';

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  order_items: unknown;
  total_price: number;
  payment_method: string;
  status?: string;
  created_at: string;
};

export function OrdersTable({
  orders,
  onChanged,
}: {
  orders: Order[];
  onChanged: () => Promise<void>;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleConfirm = async (id: string) => {
    setConfirmingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'PATCH' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || 'Confirm failed');
        return;
      }
      await onChanged();
    } finally {
      setConfirmingId(null);
    }
  };

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
      await onChanged();
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
            <th className="text-left p-3 font-semibold text-mumsy-dark">Items</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Total</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Payment</th>
            <th className="text-left p-3 font-semibold text-mumsy-dark">Status</th>
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
              <td className="p-3 max-w-[260px]">
                <div className="line-clamp-3 text-mumsy-dark/80">
                  {Array.isArray(o.order_items)
                    ? o.order_items
                        .map((it) => {
                          if (!it || typeof it !== 'object') return '';
                          const row = it as Record<string, unknown>;
                          return `${String(row.name ?? 'Item')} x${String(row.quantity ?? 1)}`;
                        })
                        .filter(Boolean)
                        .join(', ')
                    : '—'}
                </div>
              </td>
              <td className="p-3 font-semibold text-mumsy-purple">
                Rs {Number(o.total_price).toFixed(0)}
              </td>
              <td className="p-3">{o.payment_method}</td>
              <td className="p-3 capitalize">{o.status ?? 'pending'}</td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => handleConfirm(o.id)}
                  disabled={(o.status ?? 'pending').toLowerCase() === 'confirmed' || confirmingId === o.id}
                  className="mr-3 text-green-700 font-medium hover:underline disabled:opacity-50"
                >
                  {confirmingId === o.id ? 'Confirming…' : (o.status ?? 'pending').toLowerCase() === 'confirmed' ? 'Confirmed' : 'Confirm'}
                </button>
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
