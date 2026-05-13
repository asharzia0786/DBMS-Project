import { useState, type FormEvent } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import { useCart } from '../contexts/cart';
import { createOrder, createSafepaySession } from '../lib/api';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Checkout() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'Cash on delivery',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!isSignedIn) {
        window.location.replace(`/login?redirect_url=${encodeURIComponent('/checkout')}`);
        return;
      }

      const token = await getToken();
      if (!token) {
        throw new Error('Unable to read your session token.');
      }

      const order = await createOrder(token, {
        type: items.map((item) => `${item.quantity}x ${item.name}`).join(', '),
        totalAmount: subtotal,
        paymentStatus: form.paymentMethod,
        customerEmail: user?.primaryEmailAddress?.emailAddress,
      });

      if (form.paymentMethod === 'SafePay') {
        await createSafepaySession(token, {
          orderId: order.id,
          amount: subtotal,
        });
      }

      clearCart();
      setOrderId(order.id);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <main className="min-h-screen bg-void px-6 py-10 text-beige">
        <section className="glass-card mx-auto mt-20 max-w-xl p-8 text-center">
          <CheckCircle2 className="mx-auto text-champagne" size={44} />
          <h1 className="mt-5 font-cormorant text-5xl">Order received</h1>
          <p className="mt-4 font-manrope text-sm leading-7 text-beige/60">
            Your order #{orderId.slice(0, 8)} has been created. Our team will confirm details and delivery timing.
          </p>
          <a href="/orders" className="mt-7 inline-flex bg-champagne px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-void hover:bg-gold-200">
            View orders
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void px-6 py-10 text-beige">
      <div className="mx-auto max-w-5xl">
        <a href="/cart" className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 hover:text-champagne">
          <ArrowLeft size={16} />
          Back to cart
        </a>
        <header className="mt-12">
          <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Checkout</p>
          <h1 className="mt-3 font-cormorant text-5xl">Confirm your order</h1>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6">
            {[
              ['fullName', 'Full name'],
              ['phone', 'Phone'],
              ['city', 'City'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">{label}</span>
                <input
                  required
                  value={form[key as keyof typeof form]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  className="mt-2 w-full border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
                />
              </label>
            ))}
            <label className="block">
              <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">Delivery address</span>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                className="mt-2 w-full resize-none border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
              />
            </label>
            <label className="block">
              <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">Payment method</span>
              <select
                value={form.paymentMethod}
                onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
                className="mt-2 w-full border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
              >
                <option>Cash on delivery</option>
                <option>Bank transfer</option>
                <option>SafePay</option>
              </select>
            </label>
            <label className="block">
              <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">Notes</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                className="mt-2 w-full resize-none border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
              />
            </label>
            {error ? <p className="font-manrope text-sm text-red-300">{error}</p> : null}
            <button disabled={submitting || items.length === 0} className="bg-champagne px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-void hover:bg-gold-200 disabled:opacity-50">
              {submitting ? 'Placing order' : 'Place order'}
            </button>
          </form>

          <aside className="glass-card h-fit p-6">
            <p className="font-manrope text-[11px] uppercase tracking-[0.3em] text-champagne">Order summary</p>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-4 border-b border-champagne/10 pb-3 font-manrope text-sm">
                  <span className="text-beige/60">{item.quantity}x {item.name}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between font-cormorant text-2xl">
              <span>Total</span>
              <span className="text-champagne">{formatCurrency(subtotal)}</span>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
