import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

import { fetchAdminCustomOrders, updateCustomOrderStatus, type CustomOrder } from '../../lib/api';

const statuses = ['REQUESTED', 'UNDER_REVIEW', 'QUOTED', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'DELIVERED'];

export default function CustomOrderManagement() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (sessionToken?: string | null) => {
    const currentToken = sessionToken || token;
    if (!currentToken) return;
    const response = await fetchAdminCustomOrders(currentToken, 1, 100);
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
      const quotedPrice = quotes[id] ? Number(quotes[id]) : undefined;
      await updateCustomOrderStatus(token, id, status, quotedPrice);
      await load(token);
    } catch (changeError) {
      setError(
        changeError instanceof Error ? changeError.message : 'Unable to update custom order status.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Bespoke</p>
      <h1 className="mt-3 font-cormorant text-5xl">Custom order requests</h1>
      {error ? <p className="mt-4 font-manrope text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="glass-card p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
              <div>
                <h2 className="font-cormorant text-3xl">Request #{order.id.slice(0, 8)}</h2>
                <p className="mt-3 whitespace-pre-line font-manrope text-sm leading-7 text-beige/65">{order.description}</p>
                <p className="mt-3 font-manrope text-xs text-beige/45">{order.dimensions || 'No dimensions'} · {order.material || 'No material'}</p>
                {order.referenceImages.length > 0 ? (
                  <div className="mt-4 flex gap-3 overflow-auto">
                    {order.referenceImages.map((image) => <img key={image} src={image} alt="Reference" className="h-20 w-20 object-cover" />)}
                  </div>
                ) : null}
              </div>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Quote amount"
                  value={quotes[order.id] || order.quotedPrice || ''}
                  onChange={(event) => setQuotes((current) => ({ ...current, [order.id]: event.target.value }))}
                  className="w-full border border-champagne/20 bg-void px-3 py-2 font-manrope text-sm text-beige"
                />
                <div className="flex flex-wrap gap-2">
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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
