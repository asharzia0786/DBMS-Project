import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fetchProducts } from '../lib/api';

const HERO_FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/5825527/pexels-photo-5825527.jpeg?auto=compress&cs=tinysrgb&w=1400',
  'https://images.pexels.com/photos/3757055/pexels-photo-3757055.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3637786/pexels-photo-3637786.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

const DETAIL_FLOATS = [
  {
    className: 'left-[4%] top-[18%] w-[22vw] max-w-[330px]',
    delay: 0.02,
  },
  {
    className: 'right-[5%] top-[16%] w-[24vw] max-w-[360px]',
    delay: 0.04,
  },
  {
    className: 'right-[9%] bottom-[13%] w-[18vw] max-w-[280px]',
    delay: 0.06,
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [heroImages, setHeroImages] = useState(HERO_FALLBACK_IMAGES);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bedScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const bedY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [-8, 18]);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 28);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 18);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    let active = true;

    const loadHeroImages = async () => {
      try {
        const response = await fetchProducts(1, 8);
        const productImages = response.items
          .map((item) => item.images[0]?.imageUrl)
          .filter((url): url is string => Boolean(url))
          .slice(0, 4);

        if (active && productImages.length >= 3) {
          setHeroImages(productImages.length === 4 ? productImages : [...productImages, HERO_FALLBACK_IMAGES[3]]);
        }
      } catch {
        // Keep fallback images when live catalog is unavailable.
      }
    };

    void loadHeroImages();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen min-h-[720px] items-center justify-center overflow-hidden bg-void"
      id="hero"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(212,175,114,0.18),transparent_34%),linear-gradient(180deg,#050403_0%,#150c06_52%,#050403_100%)]" />

      <motion.div
        className="absolute inset-x-[-8vw] bottom-[-2vh] h-[78vh] cinematic-mask"
        style={{ y: bedY, scale: bedScale, x: springX }}
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url("${heroImages[0]}")`,
          }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/18 to-void/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-void/70" />

      <motion.div
        className="absolute inset-0 hidden lg:block"
        style={{ rotate: orbitRotate, transformStyle: 'preserve-3d' }}
      >
        {DETAIL_FLOATS.map((detail, index) => (
          <motion.div
            key={detail.className}
            initial={{ opacity: 0, y: 40, rotateY: -22 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.9, delay: detail.delay, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute overflow-hidden border border-champagne/15 bg-walnut-900/60 shadow-[0_40px_90px_rgba(0,0,0,0.45)] ${detail.className}`}
            style={{
              aspectRatio: '1.45 / 1',
              x: springX,
              y: springY,
            }}
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url("${heroImages[index + 1] || heroImages[0]}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/35 to-transparent" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 text-center"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.03 }}
          className="mb-7 flex items-center justify-center gap-4"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-champagne/60" />
          <span className="font-manrope text-[10px] uppercase tracking-[0.5em] text-champagne/75">
            Faisalabad Workshop · Since 1985
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-champagne/60" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 38 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="font-playfair text-[clamp(3.6rem,11vw,9.4rem)] font-normal leading-[0.84] text-beige"
        >
          Crafted
          <br />
          <span className="italic text-gradient-gold">for real spaces</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mx-auto mt-8 max-w-xl font-cormorant text-[clamp(1.1rem,2.4vw,1.55rem)] font-light tracking-wide text-beige/62"
        >
          Habib & Sons designs retail-ready furniture, wall decor, and custom CNC pieces for homes,
          offices, and hospitality interiors across Pakistan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#craftsmanship"
            className="group relative overflow-hidden bg-champagne px-10 py-4 font-manrope text-[11px] uppercase tracking-[0.35em] text-void transition-all duration-500 hover:bg-gold-200"
          >
            <span className="relative z-10">Our Process</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href="#collection"
            className="border border-champagne/40 px-10 py-4 font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne transition-all duration-500 hover:border-champagne hover:bg-champagne/10"
          >
            View Collection
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.5 }}
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-manrope text-[9px] uppercase tracking-[0.4em] text-beige/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-champagne/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
