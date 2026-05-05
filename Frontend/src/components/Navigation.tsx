import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Collection', href: '#collection' },
  { label: 'Craftsmanship', href: '#craftsmanship' },
  { label: 'Workshop', href: '#workshop' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'glass-dark py-4' : 'py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex flex-col leading-none">
            <span className="font-cormorant text-champagne text-xl tracking-[0.2em] font-light uppercase">
              Zafar & Sons
            </span>
            <span className="font-manrope text-[10px] tracking-[0.4em] text-beige/40 uppercase mt-0.5">
              Master Craftsmen · Lahore
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-manrope text-[11px] tracking-[0.3em] text-beige/60 hover:text-champagne uppercase transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="font-manrope text-[10px] tracking-[0.3em] uppercase border border-champagne/40 text-champagne px-6 py-2.5 hover:bg-champagne hover:text-void transition-all duration-300"
            >
              Book Consultation
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-champagne"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
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
                transition={{ delay: i * 0.08 }}
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
              transition={{ delay: 0.4 }}
              className="mt-4 font-manrope text-[11px] tracking-[0.3em] uppercase border border-champagne/40 text-champagne px-8 py-3"
              onClick={() => setMenuOpen(false)}
            >
              Book Consultation
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
