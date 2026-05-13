import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SLIDES = [
  {
    image: 'https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg?auto=compress&cs=tinysrgb&w=1200',
    label: '01',
    caption: 'Walnut Grain',
    quote: 'Every curve carved\nwith precision.',
    sub: 'The finest Pakistani walnut, hand-selected for its grain density and natural warmth.',
  },
  {
    image: 'https://images.pexels.com/photos/3757055/pexels-photo-3757055.jpeg?auto=compress&cs=tinysrgb&w=1200',
    label: '02',
    caption: 'Floral Carvings',
    quote: 'Every detail refined\nby hand.',
    sub: 'Our master carvers spend weeks on a single headboard, tracing ancient Mughal motifs.',
  },
  {
    image: 'https://images.pexels.com/photos/6580235/pexels-photo-6580235.jpeg?auto=compress&cs=tinysrgb&w=1200',
    label: '03',
    caption: 'CNC Precision',
    quote: 'Technology meets\ntradition.',
    sub: '5-axis CNC machining creates tolerances of 0.1mm — a precision invisible yet profound.',
  },
  {
    image: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200',
    label: '04',
    caption: 'Polished Surfaces',
    quote: 'A finish that reflects\nyour excellence.',
    sub: 'Seven layers of hand-applied lacquer create depth that mirrors light like liquid amber.',
  },
];

function SlideCard({ slide, index }: { slide: typeof SLIDES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={`flex-shrink-0 w-[85vw] sm:w-[70vw] lg:w-[55vw] h-[75vh] relative overflow-hidden rounded-sm ${
        index % 2 === 0 ? 'mt-0' : 'mt-16'
      }`}
    >
      {/* Image */}
      <motion.img
        src={slide.image}
        alt={slide.caption}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ scale: imgScale }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/40 via-transparent to-transparent" />

      {/* Slide number */}
      <div className="absolute top-8 left-8 font-manrope text-[10px] tracking-[0.5em] text-champagne/50 uppercase">
        {slide.label} / {SLIDES.length.toString().padStart(2, '0')}
      </div>

      {/* Caption tag */}
      <div className="absolute top-8 right-8">
        <span className="font-manrope text-[9px] tracking-[0.4em] uppercase text-beige/40 border border-beige/20 px-3 py-1.5">
          {slide.caption}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-10">
        <h3 className="font-playfair text-[clamp(1.8rem,4vw,3rem)] text-beige leading-tight mb-4 whitespace-pre-line">
          {slide.quote}
        </h3>
        <p className="font-manrope text-sm text-beige/50 font-light max-w-xs leading-relaxed">
          {slide.sub}
        </p>
        {/* Gold accent line */}
        <div className="mt-6 h-px w-16 bg-gradient-to-r from-champagne/60 to-transparent" />
      </div>
    </motion.div>
  );
}

export default function CraftsmanshipStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-75%']);

  return (
    <section
      ref={sectionRef}
      className="relative bg-void"
      style={{ height: '400vh' }}
      id="craftsmanship"
    >
      {/* Sticky horizontal scroll container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Section header */}
        <div className="px-6 lg:px-12 mb-12 flex items-end justify-between max-w-7xl mx-auto w-full">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="h-px w-8 bg-champagne/50" />
              <span className="font-manrope text-[9px] tracking-[0.5em] text-champagne/60 uppercase">
                The Art
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.03 }}
              className="font-playfair text-[clamp(2rem,5vw,4rem)] text-beige font-normal"
            >
              Craftsmanship Story
            </motion.h2>
          </div>
          <p className="hidden lg:block font-manrope text-xs text-beige/30 tracking-widest uppercase">
            Scroll to explore &rarr;
          </p>
        </div>

        {/* Horizontal scroll track */}
        <div ref={trackRef} className="overflow-hidden pl-6 lg:pl-12">
          <motion.div
            style={{ x }}
            className="flex gap-6 lg:gap-10 items-start"
          >
            {SLIDES.map((slide, i) => (
              <SlideCard key={i} slide={slide} index={i} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Divider gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-walnut-900/30 to-transparent pointer-events-none" />
    </section>
  );
}
