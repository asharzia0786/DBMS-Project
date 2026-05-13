import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { ArrowLeft, BadgeCheck, LogOut, MailWarning, Package, Save, UserRound } from 'lucide-react';

import { fetchUserOrders, type Order } from '../lib/api';

type ProfileForm = {
  firstName: string;
  lastName: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export default function UserProfile() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const { isLoaded, user } = useUser();
  const [form, setForm] = useState<ProfileForm>({ firstName: '', lastName: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    });
  }, [user]);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      setOrdersLoading(true);
      setOrdersError(null);

      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Unable to load your session token.');
        }

        const response = await fetchUserOrders(token);
        if (active) {
          setOrders(response.items);
        }
      } catch (error) {
        if (active) {
          setOrdersError(error instanceof Error ? error.message : 'Unable to load orders.');
        }
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    }

    if (isLoaded && user) {
      void loadOrders();
    }

    return () => {
      active = false;
    };
  }, [getToken, isLoaded, user]);

  const primaryEmail = useMemo(() => user?.primaryEmailAddress?.emailAddress || '', [user]);
  const emailVerified = user?.primaryEmailAddress?.verification?.status === 'verified';

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      await user.update({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });
      setStatus('Profile updated.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-void text-beige px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 transition-colors hover:text-champagne"
          >
            <ArrowLeft size={16} />
            Home
          </a>
          <button
            type="button"
            onClick={() => void signOut({ redirectUrl: '/' })}
            className="inline-flex items-center gap-2 border border-champagne/30 px-5 py-2.5 font-manrope text-[11px] uppercase tracking-[0.22em] text-champagne transition-colors hover:bg-champagne hover:text-void"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card glow-gold p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-champagne/25 bg-walnut-800 text-champagne">
                <UserRound size={26} />
              </div>
              <div>
                <p className="font-manrope text-[11px] uppercase tracking-[0.3em] text-champagne">
                  Profile
                </p>
                <h1 className="font-cormorant text-4xl text-beige">
                  {user?.fullName || primaryEmail || 'Your account'}
                </h1>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-8 space-y-5">
              <label className="block">
                <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">
                  First name
                </span>
                <input
                  value={form.firstName}
                  onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                  className="mt-2 w-full border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none transition-colors focus:border-champagne"
                />
              </label>
              <label className="block">
                <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">
                  Last name
                </span>
                <input
                  value={form.lastName}
                  onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                  className="mt-2 w-full border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none transition-colors focus:border-champagne"
                />
              </label>
              <label className="block">
                <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">
                  Email
                </span>
                <input
                  value={primaryEmail}
                  disabled
                  className="mt-2 w-full border border-champagne/10 bg-walnut-900/70 px-4 py-3 font-manrope text-sm text-beige/55"
                />
              </label>

              <div
                className={`rounded border p-4 ${
                  emailVerified
                    ? 'border-emerald-300/25 bg-emerald-500/10'
                    : 'border-amber-200/30 bg-amber-300/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {emailVerified ? (
                    <BadgeCheck className="mt-0.5 text-emerald-300" size={18} />
                  ) : (
                    <MailWarning className="mt-0.5 text-amber-200" size={18} />
                  )}
                  <div>
                    <p
                      className={`font-manrope text-sm leading-6 ${
                        emailVerified ? 'text-emerald-100' : 'text-amber-100'
                      }`}
                    >
                      {emailVerified
                        ? 'Your email is verified.'
                        : 'Your email is not verified yet. Verify it to complete account setup.'}
                    </p>
                    {!emailVerified ? (
                      <a
                        href="/verify-email"
                        className="mt-2 inline-flex font-manrope text-[11px] uppercase tracking-[0.2em] text-champagne hover:text-gold-200"
                      >
                        Open verify email panel
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              {status ? <p className="font-manrope text-sm text-beige/65">{status}</p> : null}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-champagne px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-void transition-colors hover:bg-gold-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? 'Saving' : 'Save profile'}
              </button>
            </form>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-manrope text-[11px] uppercase tracking-[0.3em] text-champagne">
                  Orders
                </p>
                <h2 className="mt-2 font-cormorant text-4xl text-beige">Order history</h2>
              </div>
              <Package className="text-champagne" size={28} />
            </div>

            <div className="mt-8 space-y-4">
              {ordersLoading ? (
                <p className="font-manrope text-sm text-beige/60">Loading orders...</p>
              ) : ordersError ? (
                <p className="font-manrope text-sm text-beige/60">{ordersError}</p>
              ) : orders.length === 0 ? (
                <p className="font-manrope text-sm leading-7 text-beige/60">
                  No orders are attached to this account yet.
                </p>
              ) : (
                orders.map((order) => (
                  <article
                    key={order.id}
                    className="border border-champagne/12 bg-void/35 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-manrope text-sm uppercase tracking-[0.18em] text-beige">
                          {order.type}
                        </h3>
                        <p className="mt-2 font-manrope text-xs text-beige/50">
                          {formatDate(order.createdAt)} · {order.paymentStatus}
                        </p>
                      </div>
                      <span className="border border-champagne/20 px-3 py-1 font-manrope text-[10px] uppercase tracking-[0.2em] text-champagne">
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-4 font-cormorant text-2xl text-beige">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
