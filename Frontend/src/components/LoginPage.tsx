import { SignIn } from '@clerk/clerk-react';
import { ArrowLeft } from 'lucide-react';

const authAppearance = {
  variables: {
    colorBackground: '#0e0804',
    colorInputBackground: '#050403',
    colorInputText: '#e8d5b7',
    colorText: '#e8d5b7',
    colorTextSecondary: 'rgba(232, 213, 183, 0.68)',
    colorPrimary: '#d4af72',
  },
  elements: {
    cardBox: 'shadow-none',
    card: 'bg-walnut-900/90 border border-champagne/15 text-beige shadow-none',
    footer: 'bg-walnut-900/90 border-t border-champagne/10',
    footerAction: 'bg-walnut-900/90 text-beige',
    headerTitle: 'font-cormorant text-beige',
    headerSubtitle: 'text-beige/60',
    socialButtonsBlockButton:
      'border border-champagne/20 bg-walnut-800/70 text-beige hover:bg-walnut-700',
    formFieldLabel: 'text-beige/70',
    formFieldInput:
      'bg-void/70 border border-champagne/20 text-beige focus:border-champagne focus:ring-champagne/20',
    footerActionText: 'text-beige/60',
    footerActionLink: 'text-champagne hover:text-gold-200',
    identityPreviewText: 'text-beige',
    formButtonPrimary:
      'bg-champagne text-void hover:bg-gold-200 font-manrope uppercase tracking-[0.2em] text-[11px]',
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-void text-beige px-6 py-10 flex flex-col">
      <a
        href="/"
        className="inline-flex w-fit items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 transition-colors hover:text-champagne"
      >
        <ArrowLeft size={16} />
        Home
      </a>

      <section className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">
              Client Access
            </p>
            <h1 className="mt-3 font-cormorant text-5xl text-beige">Sign in</h1>
          </div>

          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/signup"
            fallbackRedirectUrl="/profile"
            appearance={authAppearance}
          />
        </div>
      </section>
    </main>
  );
}
