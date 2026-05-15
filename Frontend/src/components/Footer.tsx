export default function Footer() {
  return (
    <footer className="relative bg-void border-t border-champagne/10 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="font-cormorant text-champagne text-2xl tracking-[0.15em] font-light uppercase mb-3">
              Habib and Sons
            </div>
            <div className="font-manrope text-[9px] tracking-[0.4em] text-beige/30 uppercase mb-6">
              Master Craftsmen · Faisalabad
            </div>
            <p className="font-manrope text-xs text-beige/30 leading-relaxed max-w-xs">
              Three generations of master craftsmen creating heirloom furniture for Pakistan's most discerning homes since 1985.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <div className="font-manrope text-[9px] tracking-[0.5em] uppercase text-champagne/50 mb-6">Navigate</div>
            {['Collection', 'Craftsmanship', 'Workshop', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block font-manrope text-xs text-beige/40 hover:text-champagne transition-colors duration-300 tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="font-manrope text-[9px] tracking-[0.5em] uppercase text-champagne/50 mb-6">Reach Us</div>
            <div className="space-y-3">
              {[
                { label: 'Workshop', value: '47-B Industrial Estate, Faisalabad' },
                { label: 'Showroom', value: 'M.M. Alam Road, Gulberg III' },
                { label: 'Phone', value: '+92 300 123 4567' },
                { label: 'Email', value: 'studio@habibandsons.pk' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="font-manrope text-[9px] tracking-[0.3em] uppercase text-champagne/40 w-16 flex-shrink-0 mt-0.5">
                    {item.label}
                  </span>
                  <span className="font-manrope text-xs text-beige/40">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-champagne/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-manrope text-[9px] tracking-[0.3em] uppercase text-beige/20">
            &copy; 2026 Habib and Sons. All rights reserved.
          </span>
            <span className="font-manrope text-[9px] tracking-[0.3em] uppercase text-beige/20">
            Handcrafted in Faisalabad, Pakistan
            </span>
        </div>
      </div>
    </footer>
  );
}
