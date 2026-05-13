import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: 'When the bed arrived, my bedroom was transformed into something I had only seen in architectural magazines. The carving depth is otherworldly — it catches candlelight in a way no photograph can capture.',
    name: 'Aisha Tariq',
    title: 'Interior Designer, Islamabad',
    location: 'F-7, Islamabad',
    initial: 'A',
  },
  {
    quote: 'I ordered the Imperial Sovereign Bed for my villa in DHA. Guests ask where I found a museum piece for my home. Three years on, it is still the most discussed object in the house.',
    name: 'Farhan Qureshi',
    title: 'Entrepreneur',
    location: 'DHA Phase 6, Lahore',
    initial: 'F',
  },
  {
    quote: 'The Alhambra dining suite seats twelve and commands every dinner conversation before the food is even served. Habib & Sons does not make furniture — they make architecture for the home.',
    name: 'Sana Malik',
    title: 'Architect, NESPAK',
    location: 'Gulberg III, Lahore',
    initial: 'S',
  },
  {
    quote: 'From first consultation to white-glove delivery, the experience rivaled buying art from a gallery. The attention to grain matching alone took two weeks. Worth every rupee.',
    name: 'Imran Chaudhry',
    title: 'Surgeon',
    location: 'Model Town, Lahore',
    initial: 'I',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[active];

  return (
    <section className="relative bg-void py-32 lg:py-48 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-walnut-900/10 via-transparent to-void" />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,114,0.2), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,114,0.2), transparent)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-champagne/50" />
            <span className="font-manrope text-[9px] tracking-[0.5em] uppercase text-champagne/60">
              Client Voices
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-champagne/50" />
          </div>
          <h2 className="font-playfair text-[clamp(2rem,5vw,4rem)] text-beige font-normal">
            What Our Patrons
            <br />
            <span className="italic text-champagne/70">Have to Say</span>
          </h2>
        </motion.div>

        {/* Testimonial display */}
        <div className="relative min-h-[380px] flex flex-col justify-center">
          {/* Large decorative quote mark */}
          <div
            className="absolute -top-8 left-0 font-playfair text-[10rem] leading-none text-champagne/5 select-none"
            aria-hidden
          >
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-champagne/60" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-cormorant text-[clamp(1.1rem,2.5vw,1.6rem)] text-beige/80 font-light italic leading-[1.7] mb-12 max-w-3xl mx-auto">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center justify-center gap-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-champagne/30"
                  style={{ background: 'linear-gradient(135deg, rgba(78,47,20,0.6), rgba(30,17,8,0.8))' }}
                >
                  <span className="font-playfair text-champagne text-lg">{t.initial}</span>
                </div>
                <div className="text-left">
                  <div className="font-manrope text-sm text-beige font-medium">{t.name}</div>
                  <div className="font-manrope text-[10px] tracking-[0.2em] text-beige/40 uppercase mt-0.5">
                    {t.title} · {t.location}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 mt-14">
          <button
            onClick={prev}
            className="font-manrope text-[10px] tracking-[0.3em] uppercase text-beige/40 hover:text-champagne transition-colors duration-300 flex items-center gap-2"
          >
            <span className="block w-6 h-px bg-current" />
            Prev
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === active
                    ? 'w-8 h-1.5 bg-champagne'
                    : 'w-1.5 h-1.5 bg-beige/20 hover:bg-beige/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="font-manrope text-[10px] tracking-[0.3em] uppercase text-beige/40 hover:text-champagne transition-colors duration-300 flex items-center gap-2"
          >
            Next
            <span className="block w-6 h-px bg-current" />
          </button>
        </div>
      </div>
    </section>
  );
}
