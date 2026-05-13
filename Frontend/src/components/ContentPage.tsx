import { ArrowLeft } from 'lucide-react';

type ContentPageProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

export default function ContentPage({ eyebrow, title, children }: ContentPageProps) {
  return (
    <main className="min-h-screen bg-void px-6 py-10 text-beige">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 hover:text-champagne">
          <ArrowLeft size={16} />
          Home
        </a>
        <header className="mt-12">
          <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">{eyebrow}</p>
          <h1 className="mt-3 font-cormorant text-5xl lg:text-6xl">{title}</h1>
        </header>
        <section className="prose prose-invert mt-10 max-w-none prose-p:font-manrope prose-p:text-beige/65 prose-p:leading-8 prose-headings:font-cormorant prose-headings:text-beige prose-li:text-beige/65">
          {children}
        </section>
      </div>
    </main>
  );
}
