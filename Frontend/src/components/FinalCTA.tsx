import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { submitInquiry } from '../lib/api';

const CTA_IMAGE = 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1920';

const CTA_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: 60 + Math.random() * 40,
  size: Math.random() * 2.5 + 0.5,
  duration: Math.random() * 7 + 5,
  delay: Math.random() * 4,
}));

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', city: '', message: '' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.12]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitInquiry(form);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center" id="contact">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <motion.img
          src={CTA_IMAGE}
          alt="Luxury bedroom"
          className="w-full h-full object-cover"
          style={{ scale: imgScale }}
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/60 to-void/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/40 via-transparent to-void/40" />

      {/* Warm spotlight */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse-glow"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(140,94,42,0.2) 0%, transparent 60%)',
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CTA_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: 'rgba(212,175,114,0.6)',
              boxShadow: '0 0 6px rgba(212,175,114,0.4)',
            }}
            animate={{
              y: [0, -90, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        {!formOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-champagne/50" />
              <span className="font-manrope text-[9px] tracking-[0.5em] uppercase text-champagne/60">
                Begin Your Journey
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-champagne/50" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="font-playfair text-[clamp(3rem,9vw,7rem)] font-normal leading-[0.95] text-beige mb-8"
            >
              Designed to
              <br />
              <span className="italic text-gradient-gold">dominate</span>
              <br />
              your space.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
              className="font-cormorant text-xl text-beige/50 font-light italic mb-12 max-w-md mx-auto leading-relaxed"
            >
              Every room deserves one masterpiece. Let us create yours.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              onClick={() => setFormOpen(true)}
              className="group relative font-manrope text-[11px] tracking-[0.4em] uppercase px-14 py-5 bg-champagne text-void hover:bg-gold-200 transition-all duration-500 overflow-hidden glow-gold"
            >
              <span className="relative z-10">Book a Consultation</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-8 mt-14"
            >
              {['Bespoke Designs', 'White Glove Delivery', '5-Year Warranty'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-champagne/40" />
                  <span className="font-manrope text-[9px] tracking-[0.3em] uppercase text-beige/30">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 lg:p-12 max-w-xl mx-auto"
          >
            {!submitted ? (
              <>
                <h3 className="font-playfair text-2xl text-beige mb-2">Book a Consultation</h3>
                <p className="font-manrope text-xs text-beige/40 mb-8 tracking-wide">
                  Our design team will reach out within 24 hours.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+92 300 0000000' },
                    { key: 'city', label: 'City', type: 'text', placeholder: 'Lahore, Karachi, Islamabad...' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block font-manrope text-[9px] tracking-[0.4em] uppercase text-champagne/60 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        className="w-full bg-void/60 border border-champagne/20 text-beige text-sm px-4 py-3 focus:outline-none focus:border-champagne/50 transition-colors duration-300 placeholder:text-beige/20 font-manrope"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block font-manrope text-[9px] tracking-[0.4em] uppercase text-champagne/60 mb-2">
                      Tell us about your vision
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Master bedroom furniture, dining suite..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full bg-void/60 border border-champagne/20 text-beige text-sm px-4 py-3 focus:outline-none focus:border-champagne/50 transition-colors duration-300 placeholder:text-beige/20 font-manrope resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 font-manrope text-[10px] tracking-[0.35em] uppercase bg-champagne text-void py-4 hover:bg-gold-200 transition-colors duration-300"
                    >
                      {submitting ? 'Submitting' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="font-manrope text-[10px] tracking-[0.3em] uppercase border border-champagne/30 text-beige/40 px-6 hover:border-champagne/50 transition-colors duration-300"
                    >
                      Back
                    </button>
                  </div>
                  {submitError ? (
                    <p className="font-manrope text-xs text-champagne/80">
                      {submitError}
                    </p>
                  ) : null}
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="w-14 h-14 rounded-full border border-champagne/40 flex items-center justify-center mx-auto mb-6">
                  <div className="w-4 h-4 border-r-2 border-b-2 border-champagne rotate-45 -mt-1" />
                </div>
                <h3 className="font-playfair text-2xl text-beige mb-3">Thank You</h3>
                <p className="font-cormorant text-lg italic text-beige/50">
                  We will be in touch within 24 hours to discuss your bespoke vision.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />
    </section>
  );
}
