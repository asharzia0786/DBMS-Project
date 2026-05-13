import { StrictMode } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './contexts/cart.tsx';
import App from './App.tsx';
import './index.css';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const missingClerkConfig = (
  <main className="min-h-screen bg-void text-beige flex items-center justify-center px-6">
    <section className="glass-card max-w-lg p-8 text-center">
      <h1 className="font-cormorant text-4xl text-beige">Authentication is not configured</h1>
      <p className="mt-4 font-manrope text-sm leading-7 text-beige/65">
        Add VITE_CLERK_PUBLISHABLE_KEY to Frontend/.env to enable login, sign-up, and profile pages.
      </p>
    </section>
  </main>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <CartProvider>
          <App />
        </CartProvider>
      </ClerkProvider>
    ) : (
      missingClerkConfig
    )}
  </StrictMode>
);
