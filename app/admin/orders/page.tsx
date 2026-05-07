'use client';

import { useEffect, useState } from 'react';
import { OrdersTable } from './OrdersTable';

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setError((data && data.error) || 'Failed to load orders');
        setOrders([]);
        return;
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      await loadOrders();
      if (!alive) return;
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl text-mumsy-dark">Orders</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">
        Customer orders from checkout. You can confirm or delete orders from this list.
      </p>
      {loading ? (
        <p className="mt-6 text-mumsy-dark/70">Loading orders…</p>
      ) : error ? (
        <p className="mt-6 text-red-600">{error}</p>
      ) : (
        <div className="mt-6">
          <OrdersTable orders={orders} onChanged={loadOrders} />
        </div>
      )}
    </div>
  );
}
