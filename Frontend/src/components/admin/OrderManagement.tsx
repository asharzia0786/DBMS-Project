import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

import { cancelOrder, fetchAdminOrders, updateOrderStatus, type Order } from '../../lib/api';

const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderManagement() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setUpdatingId(id);
    setError(null);
    try {
      await updateOrderStatus(token, id, status);
      await load(token);
    } catch (changeError) {
      setError(changeError instanceof Error ? changeError.message : 'Unable to update order status.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function cancel(orderId: string) {
    if (!token) return;
    setUpdatingId(orderId);
    setError(null);
    try {
      await cancelOrder(token, orderId);
      await load(token);
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Unable to cancel order.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Orders</p>
      <h1 className="mt-3 font-cormorant text-5xl">Order management</h1>
      {error ? <p className="mt-4 font-manrope text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-cormorant text-3xl">{order.type}</h2>
                <p className="mt-1 font-manrope text-xs text-beige/45">
                  #{order.id} · PKR {order.totalAmount.toLocaleString('en-PK')} · Status: {order.status}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void changeStatus(order.id, status)}
                    disabled={updatingId === order.id || order.status === status}
                    className={`border px-3 py-2 font-manrope text-[10px] uppercase tracking-[0.18em] transition-colors disabled:opacity-50 ${
                      order.status === status
                        ? 'border-champagne bg-champagne text-void'
                        : 'border-champagne/20 text-beige/70 hover:border-champagne/45 hover:text-champagne'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-manrope text-[10px] uppercase tracking-[0.2em] text-beige/45">
                  {order.status}
                </span>
                {['PENDING', 'PAID', 'PROCESSING'].includes(order.status) ? (
                  <button
                    type="button"
                    onClick={() => void cancel(order.id)}
                    disabled={updatingId === order.id}
                    className="border border-champagne/25 px-3 py-2 font-manrope text-[10px] uppercase tracking-[0.18em] text-champagne hover:bg-champagne/10 disabled:opacity-50"
                  >
                    {updatingId === order.id ? 'Cancelling...' : 'Cancel order'}
                  </button>
                ) : (
                  <span className="font-manrope text-[10px] uppercase tracking-[0.2em] text-beige/40">
                    {order.status === 'CANCELLED' ? 'Already cancelled' : 'Locked'}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
    </div>
  );
}
