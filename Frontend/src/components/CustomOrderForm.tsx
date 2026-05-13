import { useState, type FormEvent } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import ImageUploadWidget from './ImageUploadWidget';
import { createCustomOrder } from '../lib/api';

export default function CustomOrderForm() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [form, setForm] = useState({
    description: '',
    dimensions: '',
    material: '',
    specialRequests: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function ensureToken() {
    if (!isSignedIn) {
      window.location.replace(`/login?redirect_url=${encodeURIComponent('/custom-order')}`);
      return null;
    }
    const nextToken = await getToken();
    setToken(nextToken);
    return nextToken;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const sessionToken = token || (await ensureToken());
      if (!sessionToken) return;

      const created = await createCustomOrder(sessionToken, {
        customerEmail: user?.primaryEmailAddress?.emailAddress,
        description: [form.description, form.specialRequests].filter(Boolean).join('\n\nSpecial requests:\n'),
        referenceImages: images,
        dimensions: form.dimensions || undefined,
        material: form.material || undefined,
      });
      setCreatedId(created.id);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit custom order.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-void px-6 py-10 text-beige">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 hover:text-champagne">
          <ArrowLeft size={16} />
          Home
        </a>
        <header className="mt-12">
          <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Bespoke Work</p>
          <h1 className="mt-3 font-cormorant text-5xl">Request a custom piece</h1>
        </header>

        {createdId ? (
          <section className="glass-card mt-10 p-8 text-center">
            <CheckCircle2 className="mx-auto text-champagne" size={42} />
            <h2 className="mt-5 font-cormorant text-4xl">Request submitted</h2>
            <p className="mt-3 font-manrope text-sm text-beige/60">Reference #{createdId.slice(0, 8)} is now with our design team.</p>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card mt-10 space-y-6 p-6">
            <label className="block">
              <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">Description</span>
              <textarea
                required
                minLength={10}
                rows={5}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-2 w-full resize-none border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
                placeholder="Describe the design, use case, room, and finish you have in mind."
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">Dimensions</span>
                <input
                  value={form.dimensions}
                  onChange={(event) => setForm((current) => ({ ...current, dimensions: event.target.value }))}
                  className="mt-2 w-full border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
                  placeholder="Width x height x depth"
                />
              </label>
              <label className="block">
                <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">Material</span>
                <select
                  value={form.material}
                  onChange={(event) => setForm((current) => ({ ...current, material: event.target.value }))}
                  className="mt-2 w-full border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
                >
                  <option value="">Select material</option>
                  <option>Walnut</option>
                  <option>Oak</option>
                  <option>MDF</option>
                  <option>Plywood</option>
                  <option>Mixed material</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="font-manrope text-[11px] uppercase tracking-[0.2em] text-beige/55">Special requests</span>
              <textarea
                rows={3}
                value={form.specialRequests}
                onChange={(event) => setForm((current) => ({ ...current, specialRequests: event.target.value }))}
                className="mt-2 w-full resize-none border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
              />
            </label>
            <ImageUploadWidget token={token} value={images} onChange={setImages} folder="luxury-cnc/custom-orders" label="Upload reference images" />
            {!token ? (
              <button type="button" onClick={() => void ensureToken()} className="border border-champagne/30 px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-champagne hover:bg-champagne hover:text-void">
                Enable image upload
              </button>
            ) : null}
            {error ? <p className="font-manrope text-sm text-red-300">{error}</p> : null}
            <button disabled={submitting} className="bg-champagne px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-void hover:bg-gold-200 disabled:opacity-50">
              {submitting ? 'Submitting' : 'Submit request'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
