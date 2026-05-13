import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WORKSHOP_IMAGE = 'https://images.pexels.com/photos/3637786/pexels-photo-3637786.jpeg?auto=compress&cs=tinysrgb&w=1400';

const STATS = [
  { value: '38+', label: 'Years of Mastery' },
  { value: '4,200+', label: 'Pieces Crafted' },
  { value: '0.1mm', label: 'CNC Tolerance' },
  { value: '7×', label: 'Hand-Applied Lacquer Coats' },
];

const STEPS = [
  { num: '01', title: 'Wood Selection', desc: 'Master craftsmen inspect every plank for grain, density, and natural character.' },
  { num: '02', title: 'Digital Design', desc: 'Architects and designers translate vision into precise CNC vector blueprints.' },
  { num: '03', title: 'CNC Machining', desc: '5-axis machines carve complex forms with 0.1mm tolerance across hardwood.' },
  { num: '04', title: 'Hand Finishing', desc: 'Artisans sand, stain, and lacquer each surface by hand — seven meticulous coats.' },
];

export default function WorkshopExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-void pt-12 pb-32 lg:pt-16 lg:pb-48 overflow-hidden"
      id="workshop"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-walnut-900/20 via-transparent to-walnut-800/10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-20 items-center">

          {/* Left: Cinematic image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-sm mb-16 lg:mb-0"
            style={{ height: 'clamp(420px, 60vh, 700px)' }}
          >
            <motion.img
              src={WORKSHOP_IMAGE}
              alt="Workshop"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ y: imgY, scale: imgScale }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-void/50" />

            {/* Warm dust particle overlay */}
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-champagne/30"
                  style={{
                    left: `${10 + i * 7}%`,
                    top: `${20 + (i % 5) * 15}%`,
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                  }}
                  animate={{
                    y: [0, -60, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 5 + i * 0.4,
                    delay: i * 0.08,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Workshop label */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="glass-dark inline-block px-4 py-2">
                <span className="font-manrope text-[9px] tracking-[0.4em] uppercase text-champagne/70">
                  Faisalabad Workshop · Since 1985
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Typography & Process */}
          <div className="lg:pl-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-champagne/50" />
              <span className="font-manrope text-[9px] tracking-[0.5em] text-champagne/60 uppercase">
                The Process
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.04 }}
              viewport={{ once: true }}
              className="font-playfair text-[clamp(2rem,5vw,3.5rem)] text-beige leading-[1.1] font-normal mb-6"
            >
              Crafted by artisans.{' '}
              <br />
              <span className="italic text-gradient-gold">Refined by precision</span>
              <br />
              engineering.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              viewport={{ once: true }}
              className="font-manrope text-sm text-beige/50 leading-7 mb-12 max-w-md"
            >
              In our Faisalabad workshop, three generations of craftsmen work alongside state-of-the-art CNC machinery.
              The result is furniture that carries the warmth of human hands and the exactness of digital precision.
            </motion.p>

            {/* Process steps */}
            <div className="space-y-8 mb-14">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.03 }}
                  viewport={{ once: true }}
                  className="flex gap-6 group"
                >
                  <span className="font-cormorant text-4xl text-champagne/20 group-hover:text-champagne/40 transition-colors duration-300 leading-none w-10 flex-shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <h4 className="font-manrope text-xs tracking-[0.25em] uppercase text-champagne mb-1.5 font-medium">
                      {step.title}
                    </h4>
                    <p className="font-manrope text-sm text-beige/40 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6 pt-10 border-t border-champagne/10"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-playfair text-2xl text-champagne mb-1">{s.value}</div>
                  <div className="font-manrope text-[10px] tracking-[0.3em] text-beige/40 uppercase">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
