import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogIn, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useCart } from '../contexts/cart';
import { isAdminUser } from '../lib/auth-role';

const navLinks = [
  { label: 'Collection', href: '/#collection' },
  { label: 'Craftsmanship', href: '/#craftsmanship' },
  { label: 'Workshop', href: '/#workshop' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useUser();
  const isAdmin = isAdminUser(user);

  const clerkAppearance = {
    variables: {
      colorBackground: '#0e0804',
      colorInputBackground: '#050403',
      colorInputText: '#e8d5b7',
      colorText: '#e8d5b7',
      colorTextSecondary: 'rgba(232, 213, 183, 0.68)',
      colorPrimary: '#d4af72',
    },
    elements: {
      userButtonAvatarBox: 'h-8 w-8 border border-champagne/30',
      userButtonPopoverCard: 'bg-walnut-900/95 border border-champagne/15 text-beige shadow-none',
      userButtonPopoverActionButton:
        'text-beige hover:bg-walnut-800/80 hover:text-champagne transition-colors',
      userButtonPopoverActionButtonText: 'text-beige/85',
      userButtonPopoverFooter: 'border-t border-champagne/10 bg-walnut-900/90',
      userPreviewTextContainer: 'text-beige',
      userPreviewMainIdentifier: 'text-beige',
      userPreviewSecondaryIdentifier: 'text-beige/60',
      card: 'bg-walnut-900/95 border border-champagne/15 text-beige shadow-none',
      navbar: 'bg-walnut-900/80 border-r border-champagne/10',
      navbarButton: 'text-beige/75 hover:text-champagne hover:bg-walnut-800/70',
      navbarButtonActive: 'bg-walnut-800 text-champagne',
      pageScrollBox: 'bg-walnut-900/95',
      profileSectionTitleText: 'text-beige/65',
      formFieldLabel: 'text-beige/70',
      formFieldInput:
        'bg-void/70 border border-champagne/20 text-beige focus:border-champagne focus:ring-champagne/20',
      formButtonPrimary:
        'bg-champagne text-void hover:bg-gold-200 font-manrope uppercase tracking-[0.2em] text-[11px]',
      footerActionLink: 'text-champagne hover:text-gold-200',
    },
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'glass-dark py-3' : 'py-6'
        }`}
      >
        <div className="mx-auto flex w-full max-w-[88rem] items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <a href="#" className="flex flex-col leading-none">
            <span className="font-cormorant text-champagne text-xl tracking-[0.2em] font-light uppercase">
              Habib and Sons
            </span>
            <span className="font-manrope text-[10px] tracking-[0.4em] text-beige/40 uppercase mt-0.5">
              Master Craftsmen · Faisalabad
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-manrope text-[9px] xl:text-[10px] tracking-[0.2em] text-champagne hover:text-gold-200 uppercase transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <div className="ml-2 flex items-center gap-4 border-l border-champagne/15 pl-5">
              <a
                href="/#contact"
                className="font-manrope text-[9px] xl:text-[10px] tracking-[0.22em] uppercase border border-champagne/35 text-champagne px-4 py-2 hover:bg-champagne hover:text-void transition-all duration-300"
              >
                Consult
              </a>
              <a
                href="/cart"
                className="relative inline-flex items-center gap-2 font-manrope text-[10px] tracking-[0.2em] uppercase text-champagne hover:text-gold-200 transition-colors duration-300"
              >
                <ShoppingBag size={15} />
                Cart
                {itemCount > 0 ? (
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-champagne px-1 text-[10px] text-void">
                    {itemCount}
                  </span>
                ) : null}
              </a>
              <SignedOut>
                <a
                  href="/login"
                  className="inline-flex items-center gap-1.5 font-manrope text-[9px] xl:text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-gold-200 transition-colors duration-300"
                >
                  <LogIn size={14} />
                  Login
                </a>
              </SignedOut>
              <SignedIn>
                {isAdmin ? (
                  <a
                    href="/admin"
                    className="inline-flex items-center gap-1.5 font-manrope text-[9px] xl:text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-gold-200 transition-colors duration-300"
                  >
                    <LayoutDashboard size={14} />
                    Admin
                  </a>
                ) : null}
                <a
                  href="/profile"
                  className="inline-flex items-center gap-1.5 font-manrope text-[9px] xl:text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-gold-200 transition-colors duration-300"
                >
                  <UserRound size={14} />
                  Profile
                </a>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={clerkAppearance}
                  userProfileProps={{
                    appearance: clerkAppearance,
                  }}
                />
              </SignedIn>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <SignedOut>
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 border border-champagne/25 px-3 py-2 font-manrope text-[10px] uppercase tracking-[0.18em] text-champagne hover:border-champagne hover:text-gold-200 transition-colors duration-300"
              >
                <LogIn size={13} />
                Login
              </a>
            </SignedOut>
            <button
              className="text-champagne"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 glass-dark flex flex-col items-center justify-center gap-10"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="font-cormorant text-4xl text-beige hover:text-champagne transition-colors duration-300"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-manrope text-[11px] tracking-[0.3em] uppercase border border-champagne/40 text-champagne px-8 py-3"
              onClick={() => setMenuOpen(false)}
            >
              Book Consultation
            </motion.a>
            <motion.a
              href="/cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.13 }}
              className="font-manrope text-[11px] tracking-[0.3em] uppercase text-champagne"
              onClick={() => setMenuOpen(false)}
            >
              Cart {itemCount > 0 ? `(${itemCount})` : ''}
            </motion.a>
            <SignedOut>
              <motion.a
                href="/login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.16 }}
                className="font-manrope text-[11px] tracking-[0.3em] uppercase text-champagne"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </motion.a>
            </SignedOut>
            <SignedIn>
              {isAdmin ? (
                <motion.a
                  href="/admin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.16 }}
                  className="font-manrope text-[11px] tracking-[0.3em] uppercase text-champagne"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </motion.a>
              ) : null}
              <motion.a
                href="/profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.19 }}
                className="font-manrope text-[11px] tracking-[0.3em] uppercase text-champagne"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </motion.a>
            </SignedIn>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
