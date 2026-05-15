import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { useCart } from '../contexts/cart';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <main className="min-h-screen bg-void px-6 py-10 text-beige">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 hover:text-champagne">
          <ArrowLeft size={16} />
          Continue shopping
        </a>

        <header className="mt-12 flex items-end justify-between gap-6">
          <div>
            <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Cart</p>
            <h1 className="mt-3 font-cormorant text-5xl text-beige">Selected pieces</h1>
          </div>
          <ShoppingBag className="text-champagne" size={34} />
        </header>

        {items.length === 0 ? (
          <section className="glass-card mt-10 p-8 text-center">
            <p className="font-manrope text-sm text-beige/60">Your cart is empty.</p>
            <a href="/#collection" className="mt-6 inline-flex bg-champagne px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-void hover:bg-gold-200">
              Browse collection
            </a>
          </section>
        ) : (
          <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.productId} className="glass-card grid gap-5 p-5 sm:grid-cols-[120px_1fr_auto]">
                  <div className="aspect-square overflow-hidden bg-walnut-900">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <h2 className="font-cormorant text-2xl text-beige">{item.name}</h2>
                    <p className="mt-2 font-manrope text-sm text-champagne">{formatCurrency(item.price)}</p>
                    <p className="mt-2 font-manrope text-[10px] uppercase tracking-[0.22em] text-beige/45">
                      {item.stock <= 0 ? 'Out of stock' : `${item.stock} available`}
                    </p>
                    <div className="mt-5 inline-flex items-center border border-champagne/20">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-3 text-champagne" aria-label="Decrease quantity">
                        <Minus size={15} />
                      </button>
                      <span className="w-10 text-center font-manrope text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.stock <= 0 || item.quantity >= item.stock}
                        className="p-3 text-champagne disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-4 sm:items-end">
                    <p className="font-cormorant text-2xl text-beige">{formatCurrency(item.price * item.quantity)}</p>
                    <button type="button" onClick={() => removeFromCart(item.productId)} className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/45 hover:text-red-300">
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="glass-card h-fit p-6">
              <p className="font-manrope text-[11px] uppercase tracking-[0.3em] text-champagne">Summary</p>
              <div className="mt-6 flex items-center justify-between border-b border-champagne/10 pb-4 font-manrope text-sm">
                <span className="text-beige/60">Subtotal</span>
                <span className="text-beige">{formatCurrency(subtotal)}</span>
              </div>
              <p className="mt-4 font-manrope text-xs leading-6 text-beige/45">
                Delivery, installation, and finishing options are confirmed after order review.
              </p>
              <a href="/checkout" className="mt-6 flex justify-center bg-champagne px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-void hover:bg-gold-200">
                Proceed to checkout
              </a>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
