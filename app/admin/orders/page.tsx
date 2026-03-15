import { getOrders } from '@/lib/data';
import { OrdersTable } from './OrdersTable';

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-heading text-2xl text-mumsy-dark">Orders</h1>
      <p className="mt-1 text-sm text-mumsy-dark/70">
        Customer orders from checkout. You can delete orders from this list.
      </p>
      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
