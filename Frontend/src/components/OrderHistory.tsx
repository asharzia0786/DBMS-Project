import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, PackageCheck } from 'lucide-react';

import { cancelOrder, fetchUserOrders, type Order } from '../lib/api';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value);
}

export default function OrderHistory() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  async function loadOrders() {
    const token = await getToken();
    if (!token) throw new Error('Unable to load your session token.');
    const response = await fetchUserOrders(token, 1, 20);
    setOrders(response.items);
  }

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new Error('Unable to load your session token.');
        const response = await fetchUserOrders(token, 1, 20);
        if (active) setOrders(response.items);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load orders.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [getToken]);

  async function handleCancel(orderId: string) {
    setCancelingId(orderId);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Unable to read your session token.');
      }

      await cancelOrder(token, orderId);
      await loadOrders();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Unable to cancel order.');
    } finally {
      setCancelingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-void px-6 py-10 text-beige">
      <div className="mx-auto max-w-5xl">
        <a href="/profile" className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 hover:text-champagne">
          <ArrowLeft size={16} />
          Profile
        </a>
        <header className="mt-12 flex items-center justify-between">
          <div>
            <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Tracking</p>
            <h1 className="mt-3 font-cormorant text-5xl">Order history</h1>
          </div>
          <PackageCheck className="text-champagne" size={34} />
        </header>
        <section className="mt-10 space-y-4">
          {loading ? <p className="font-manrope text-sm text-beige/60">Loading orders...</p> : null}
          {error ? <p className="font-manrope text-sm text-red-300">{error}</p> : null}
          {!loading && !error && orders.length === 0 ? (
            <p className="glass-card p-6 font-manrope text-sm text-beige/60">No orders found.</p>
          ) : null}
          {orders.map((order) => (
            <article key={order.id} className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-cormorant text-3xl">{order.type}</h2>
                  <p className="mt-2 font-manrope text-xs uppercase tracking-[0.2em] text-beige/45">
                    #{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="border border-champagne/20 px-3 py-1 font-manrope text-[10px] uppercase tracking-[0.2em] text-champagne">
                  {order.status}
                </span>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {['PENDING', 'PAID', 'PROCESSING', 'SHIPPED'].map((step) => (
                  <div key={step} className={`h-2 ${step === order.status ? 'bg-champagne' : 'bg-champagne/15'}`} />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="font-cormorant text-2xl text-champagne">{formatCurrency(order.totalAmount)}</p>
                {['PENDING', 'PAID', 'PROCESSING'].includes(order.status) ? (
                  <button
                    type="button"
                    onClick={() => void handleCancel(order.id)}
                    disabled={cancelingId === order.id}
                    className="border border-champagne/30 px-4 py-2 font-manrope text-[10px] uppercase tracking-[0.24em] text-champagne hover:bg-champagne/10 disabled:opacity-50"
                  >
                    {cancelingId === order.id ? 'Cancelling...' : 'Cancel order'}
                  </button>
                ) : (
                  <span className="font-manrope text-[10px] uppercase tracking-[0.22em] text-beige/40">
                    {order.status === 'CANCELLED' ? 'Order cancelled' : 'Cancellation unavailable'}
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
