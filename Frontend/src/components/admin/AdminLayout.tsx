import type { ReactNode } from 'react';
import { Boxes, ClipboardList, LayoutDashboard, Mail, ShoppingBag } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Boxes },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: ClipboardList },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-void text-beige">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-champagne/10 bg-walnut-900/80 p-5 lg:border-b-0 lg:border-r">
          <a href="/" className="block">
            <span className="font-cormorant text-xl uppercase tracking-[0.2em] text-champagne">Habib & Sons</span>
            <span className="mt-1 block font-manrope text-[10px] uppercase tracking-[0.3em] text-beige/40">Admin</span>
          </a>
          <nav className="mt-8 grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.href} href={item.href} className="flex items-center gap-3 border border-transparent px-4 py-3 font-manrope text-xs uppercase tracking-[0.18em] text-beige/60 hover:border-champagne/20 hover:text-champagne">
                  <Icon size={16} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>
        <section className="p-6 lg:p-10">
          {children}
        </section>
      </div>
    </main>
  );
}
