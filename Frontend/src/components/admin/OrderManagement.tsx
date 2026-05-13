import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

import { fetchAdminOrders, updateOrderStatus, type Order } from '../../lib/api';

const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderManagement() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const load = useCallback(async (sessionToken?: string | null) => {
    const currentToken = sessionToken || token;
    if (!currentToken) return;
    const response = await fetchAdminOrders(currentToken, 1, 100);
    setOrders(response.items);
  }, [token]);

  useEffect(() => {
    void getToken().then((sessionToken) => {
      setToken(sessionToken);
      void load(sessionToken);
    });
  }, [getToken, load]);

  async function changeStatus(id: string, status: string) {
    if (!token) return;
    await updateOrderStatus(token, id, status);
    await load(token);
  }

  return (
    <div>
      <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Orders</p>
      <h1 className="mt-3 font-cormorant text-5xl">Order management</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="glass-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-cormorant text-3xl">{order.type}</h2>
                <p className="mt-1 font-manrope text-xs text-beige/45">#{order.id} · PKR {order.totalAmount.toLocaleString('en-PK')}</p>
              </div>
              <select value={order.status} onChange={(event) => void changeStatus(order.id, event.target.value)} className="border border-champagne/20 bg-void px-3 py-2 font-manrope text-sm text-beige">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
