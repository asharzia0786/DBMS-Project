import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Boxes, ClipboardList, Mail, ShoppingBag, type LucideIcon } from 'lucide-react';

import {
  fetchAdminCustomOrders,
  fetchAdminInquiries,
  fetchAdminOrders,
  fetchProducts,
  type CustomOrder,
  type Inquiry,
  type Order,
} from '../../lib/api';

type DashboardState = {
  productTotal: number;
  orders: Order[];
  customOrders: CustomOrder[];
  inquiries: Inquiry[];
};

type StatItem = [string, number, LucideIcon];

export default function Dashboard() {
  const { getToken } = useAuth();
  const [state, setState] = useState<DashboardState>({ productTotal: 0, orders: [], customOrders: [], inquiries: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const token = await getToken();
        if (!token) throw new Error('Admin session is unavailable.');
        const [products, orders, customOrders, inquiries] = await Promise.all([
          fetchProducts(1, 1),
          fetchAdminOrders(token, 1, 5),
          fetchAdminCustomOrders(token, 1, 5),
          fetchAdminInquiries(token, 1, 5),
        ]);
        if (active) {
          setState({
            productTotal: products.total,
            orders: orders.items,
            customOrders: customOrders.items,
            inquiries: inquiries.items,
          });
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard.');
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [getToken]);

  const stats: StatItem[] = [
    ['Products', state.productTotal, Boxes],
    ['Recent orders', state.orders.length, ShoppingBag],
    ['Custom requests', state.customOrders.length, ClipboardList],
    ['Inquiries', state.inquiries.length, Mail],
  ];

  return (
    <div>
      <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Overview</p>
      <h1 className="mt-3 font-cormorant text-5xl">Dashboard</h1>
      {error ? <p className="mt-6 font-manrope text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <article key={label} className="glass-card p-6">
            <Icon className="text-champagne" size={24} />
            <p className="mt-5 font-cormorant text-4xl">{value}</p>
            <p className="font-manrope text-[11px] uppercase tracking-[0.22em] text-beige/50">{label}</p>
          </article>
        ))}
      </div>
      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="font-cormorant text-3xl">Recent orders</h2>
          <div className="mt-5 space-y-3">
            {state.orders.map((order) => (
              <div key={order.id} className="flex justify-between border-b border-champagne/10 pb-3 font-manrope text-sm">
                <span className="text-beige/65">{order.type}</span>
                <span className="text-champagne">{order.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="font-cormorant text-3xl">Recent inquiries</h2>
          <div className="mt-5 space-y-3">
            {state.inquiries.map((inquiry) => (
              <div key={inquiry.id} className="border-b border-champagne/10 pb-3">
                <p className="font-manrope text-sm text-beige">{inquiry.fullName}</p>
                <p className="mt-1 font-manrope text-xs text-beige/45">{inquiry.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
