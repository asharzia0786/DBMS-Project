import { useClerk, useUser } from '@clerk/clerk-react';
import { ArrowLeft, BadgeCheck, MailWarning } from 'lucide-react';

export default function VerifyEmailPanel() {
  const { openUserProfile } = useClerk();
  const { isLoaded, user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const isVerified = user?.primaryEmailAddress?.verification?.status === 'verified';

  return (
    <main className="min-h-screen bg-void text-beige px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <a
          href="/profile"
          className="inline-flex w-fit items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 transition-colors hover:text-champagne"
        >
          <ArrowLeft size={16} />
          Profile
        </a>

        <section className="glass-card glow-gold mt-12 p-8">
          <p className="font-manrope text-[11px] uppercase tracking-[0.32em] text-champagne">
            Account Security
          </p>
          <h1 className="mt-3 font-cormorant text-5xl text-beige">Verify email</h1>

          {!isLoaded ? (
            <p className="mt-6 font-manrope text-sm text-beige/60">Checking account status...</p>
          ) : isVerified ? (
            <div className="mt-6 rounded border border-emerald-300/25 bg-emerald-500/10 p-4">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 text-emerald-300" size={18} />
                <p className="font-manrope text-sm leading-6 text-emerald-100">
                  Your email {email ? <strong>{email}</strong> : null} is verified.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded border border-amber-200/30 bg-amber-300/10 p-4">
              <div className="flex items-start gap-3">
                <MailWarning className="mt-0.5 text-amber-200" size={18} />
                <p className="font-manrope text-sm leading-6 text-amber-100">
                  {email ? (
                    <>
                      Your email <strong>{email}</strong> is not verified yet.
                    </>
                  ) : (
                    'Your account email is not verified yet.'
                  )}{' '}
                  Open the verification panel to complete verification and unlock protected actions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openUserProfile()}
                className="mt-4 bg-champagne px-5 py-2.5 font-manrope text-[11px] uppercase tracking-[0.22em] text-void transition-colors hover:bg-gold-200"
              >
                Open verification panel
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
