import { useEffect, useState, type ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { isAdminUser } from '../lib/auth-role';
import { syncCurrentUser } from '../lib/api';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isBackendAdmin, setIsBackendAdmin] = useState<boolean | null>(null);
  const isClerkAdmin = isAdminUser(user);

  useEffect(() => {
    if (!requireAdmin || !isLoaded || !isSignedIn || isClerkAdmin) {
      setIsBackendAdmin(null);
      return;
    }

    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token || !active) {
          return;
        }
        const currentUser = await syncCurrentUser(token);
        if (active) {
          setIsBackendAdmin(String(currentUser.role).toUpperCase() === 'ADMIN');
        }
      } catch {
        if (active) {
          setIsBackendAdmin(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [getToken, isClerkAdmin, isLoaded, isSignedIn, requireAdmin]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-void text-beige flex items-center justify-center px-6">
        <p className="font-manrope text-[11px] uppercase tracking-[0.28em] text-beige/60">
          Checking access
        </p>
      </main>
    );
  }

  if (!isSignedIn) {
    window.location.replace(`${redirectTo}?redirect_url=${encodeURIComponent(window.location.pathname)}`);
    return null;
  }

  if (requireAdmin && !isClerkAdmin && isBackendAdmin === null) {
    return (
      <main className="min-h-screen bg-void text-beige flex items-center justify-center px-6">
        <p className="font-manrope text-[11px] uppercase tracking-[0.28em] text-beige/60">
          Checking admin access
        </p>
      </main>
    );
  }

  if (requireAdmin && !isClerkAdmin && !isBackendAdmin) {
    return (
      <main className="min-h-screen bg-void text-beige flex items-center justify-center px-6">
        <section className="glass-card glow-gold max-w-md p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 text-champagne" size={30} />
          <h1 className="font-cormorant text-4xl text-beige">Access restricted</h1>
          <p className="mt-3 font-manrope text-sm leading-7 text-beige/65">
            This area is available only to administrators.
          </p>
          <a
            href="/profile"
            className="mt-6 inline-flex font-manrope text-[11px] uppercase tracking-[0.24em] text-champagne hover:text-gold-200"
          >
            Return to profile
          </a>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
