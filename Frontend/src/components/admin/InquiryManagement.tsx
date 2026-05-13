import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Mail } from 'lucide-react';

import { fetchAdminInquiries, updateInquiryStatus, type Inquiry } from '../../lib/api';

export default function InquiryManagement() {
  const { getToken } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async (sessionToken?: string | null) => {
    try {
      const currentToken = sessionToken || token || (await getToken());
      if (!currentToken) throw new Error('Admin session is unavailable.');
      setToken(currentToken);
      const response = await fetchAdminInquiries(currentToken, 1, 100);
      setInquiries(response.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load inquiries.');
    }
  }, [getToken, token]);

  useEffect(() => {
    let active = true;
    void getToken().then((sessionToken) => {
      if (!active) return;
      setToken(sessionToken);
      void load(sessionToken);
    });
    return () => {
      active = false;
    };
  }, [getToken, load]);

  async function changeStatus(id: string, status: string, responseMessage?: string) {
    if (!token) return;
    setUpdatingId(id);
    try {
      await updateInquiryStatus(token, id, { status, responseMessage });
      setResponses((current) => ({ ...current, [id]: '' }));
      await load(token);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Inbox</p>
      <h1 className="mt-3 font-cormorant text-5xl">Inquiry management</h1>
      {error ? <p className="mt-5 font-manrope text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="glass-card p-5">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="font-cormorant text-3xl">{inquiry.fullName}</h2>
                <p className="mt-1 font-manrope text-xs text-beige/45">{inquiry.email} · {inquiry.phone} · {inquiry.city}</p>
              </div>
              <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-2 text-champagne">
                <Mail size={17} />
                Reply
              </a>
            </div>
            <p className="mt-4 font-manrope text-sm leading-7 text-beige/65">{inquiry.message}</p>
            <div className="mt-5 grid gap-3 lg:grid-cols-[180px_1fr_auto]">
              <div className="flex flex-wrap gap-2">
                {['NEW', 'READ', 'RESPONDED', 'ARCHIVED'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void changeStatus(inquiry.id, status)}
                    disabled={updatingId === inquiry.id || inquiry.status === status}
                    className={`border px-3 py-2 font-manrope text-[10px] uppercase tracking-[0.18em] transition-colors disabled:opacity-50 ${
                      inquiry.status === status
                        ? 'border-champagne bg-champagne text-void'
                        : 'border-champagne/20 text-beige/70 hover:border-champagne/45 hover:text-champagne'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <input
                value={responses[inquiry.id] || ''}
                onChange={(event) => setResponses((current) => ({ ...current, [inquiry.id]: event.target.value }))}
                placeholder="Optional response email message"
                className="border border-champagne/20 bg-void px-3 py-2 font-manrope text-sm text-beige placeholder:text-beige/30"
              />
              <button
                type="button"
                onClick={() => void changeStatus(inquiry.id, 'RESPONDED', responses[inquiry.id])}
                disabled={updatingId === inquiry.id}
                className="bg-champagne px-4 py-2 font-manrope text-[11px] uppercase tracking-[0.2em] text-void disabled:opacity-50"
              >
                Send response
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
