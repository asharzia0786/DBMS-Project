import { useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

type Stage = {
  id: string;
  image: string;
  kicker: string;
  title: string;
  note: string;
  widthClass: string;
  objectPosition?: string;
};

const STAGES: Stage[] = [
  {
    id: 'front',
    image: '/assets/bed-crops/front-bed.webp',
    kicker: '01 / Establish',
    title: 'One carved bed. Locked to scroll.',
    note: 'A frontal hero pass keeps the object centered while the camera begins to move.',
    widthClass: 'w-[min(92vw,980px)]',
  },
  {
    id: 'angle',
    image: '/assets/bed-crops/angled-bed.webp',
    kicker: '02 / Orbit',
    title: 'The room rotates around the silhouette.',
    note: 'The object turns from catalog symmetry into an interior-scale product shot.',
    widthClass: 'w-[min(82vw,820px)]',
  },
  {
    id: 'macro',
    image: '/assets/bed-crops/headboard-macro.webp',
    kicker: '03 / Macro',
    title: 'Scroll into the CNC relief.',
    note: 'The headboard becomes a carved surface study: highlights, shadows, and ornament.',
    widthClass: 'w-[min(88vw,900px)]',
  },
  {
    id: 'side',
    image: '/assets/bed-crops/side-profile.webp',
    kicker: '04 / Profile',
    title: 'The form slides into profile.',
    note: 'A lower camera pass reveals usable proportions and bedside presence.',
    widthClass: 'w-[min(74vw,700px)]',
  },
  {
    id: 'footboard',
    image: '/assets/bed-crops/footboard.webp',
    kicker: '05 / Detail',
    title: 'The footboard resolves the craft.',
    note: 'Deep walnut panels and floral carving close the object from every angle.',
    widthClass: 'w-[min(86vw,820px)]',
  },
];

const DETAIL_PLATES = [
  {
    image: '/assets/bed-crops/post-detail.webp',
    className: 'left-[8%] top-[18%] w-[18vw] max-w-[260px]',
    range: [0.1, 0.42, 0.68],
    travel: [-90, 0, 70],
    rotate: [-24, 0, 16],
  },
  {
    image: '/assets/bed-crops/headboard-macro.webp',
    className: 'right-[7%] top-[22%] w-[24vw] max-w-[340px]',
    range: [0.24, 0.52, 0.86],
    travel: [90, 0, -80],
    rotate: [22, 0, -18],
  },
  {
    image: '/assets/bed-crops/footboard.webp',
    className: 'right-[12%] bottom-[13%] w-[22vw] max-w-[330px]',
    range: [0.48, 0.72, 1],
    travel: [120, 0, -55],
    rotate: [18, 0, -10],
  },
];

function stageWindow(index: number) {
  const step = 1 / STAGES.length;
  const overlap = step * 0.42;
  const start = Math.max(0, index * step - overlap);
  const center = index * step + step * 0.5;
  const end = Math.min(1, (index + 1) * step + overlap);

  return { start, center, end };
}

function ProductFrame({
  stage,
  index,
  progress,
}: {
  stage: Stage;
  index: number;
  progress: MotionValue<number>;
}) {
  const { start, center, end } = stageWindow(index);

  const fadeInEnd = index === 0 ? 0 : start + 0.045;
  const fadeOutStart = index === STAGES.length - 1 ? 1 : end - 0.055;
  const opacity = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [index === 0 ? 1 : 0, 1, 1, index === STAGES.length - 1 ? 1 : 0],
  );
  const scale = useTransform(progress, [start, center, end], [0.82, 1, index === STAGES.length - 1 ? 1.04 : 0.9]);
  const rotateY = useTransform(progress, [start, center, end], [index % 2 === 0 ? -24 : 22, 0, index % 2 === 0 ? 14 : -16]);
  const rotateX = useTransform(progress, [start, center, end], [8, 0, -6]);
  const y = useTransform(progress, [start, center, end], [70, 0, -45]);
  const x = useTransform(progress, [start, center, end], [index % 2 === 0 ? -45 : 45, 0, index % 2 === 0 ? 30 : -30]);
  const blur = useTransform(progress, [start, start + 0.035, end - 0.035, end], [8, 0, 0, 6]);
  const filter = useTransform(blur, (value) => `drop-shadow(0 55px 90px rgba(0,0,0,0.64)) blur(${value}px)`);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-5 will-change-transform"
      style={{
        opacity,
        x,
        y,
        scale,
        rotateX,
        rotateY,
        filter,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.img
        src={stage.image}
        alt={stage.title}
        className={`${stage.widthClass} select-none object-contain`}
        draggable={false}
      />
    </motion.div>
  );
}

function DetailPlate({
  plate,
  progress,
}: {
  plate: (typeof DETAIL_PLATES)[number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [plate.range[0], plate.range[0] + 0.05, plate.range[1], plate.range[2]], [0, 1, 1, 0]);
  const y = useTransform(progress, plate.range, plate.travel);
  const rotateY = useTransform(progress, plate.range, plate.rotate);
  const scale = useTransform(progress, plate.range, [0.82, 1, 0.9]);

  return (
    <motion.div
      className={`absolute hidden overflow-hidden border border-champagne/18 bg-void/70 shadow-[0_32px_80px_rgba(0,0,0,0.55)] lg:block ${plate.className}`}
      style={{ opacity, y, rotateY, scale, transformStyle: 'preserve-3d' }}
    >
      <img src={plate.image} alt="" className="h-full w-full object-cover" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-void/45 to-transparent" />
    </motion.div>
  );
}

function StageCopy({
  stage,
  index,
  progress,
}: {
  stage: Stage;
  index: number;
  progress: MotionValue<number>;
}) {
  const { start, end } = stageWindow(index);
  const opacity = useTransform(progress, [start, start + 0.03, end - 0.025, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.05, end], [16, 0, -10]);

  return (
    <motion.div
      className="absolute bottom-20 left-6 z-30 max-w-[430px] lg:left-12"
      style={{ opacity, y }}
    >
      <span className="mb-3 block font-manrope text-[9px] uppercase tracking-[0.5em] text-champagne/70">
        {stage.kicker}
      </span>
      <h2 className="font-playfair text-[clamp(2rem,6vw,5.4rem)] leading-[0.92] text-beige">
        {stage.title}
      </h2>
      <p className="mt-5 max-w-sm font-manrope text-sm leading-7 text-beige/50">
        {stage.note}
      </p>
    </motion.div>
  );
}

export default function ObjectScrollExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const rigRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 4, -3]);
  const rigScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.04, 0.98]);
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const apertureScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1.08, 0.86]);
  const apertureOpacity = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0.15, 0.45, 0.45, 0.18]);

  return (
    <section
      ref={sectionRef}
      id="craftsmanship"
      className="relative bg-void"
      style={{ height: `${STAGES.length * 62}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(212,175,114,0.18),transparent_31%),linear-gradient(180deg,#050403_0%,#140b05_50%,#050403_100%)]" />
        <motion.div
          className="absolute inset-x-[-20%] bottom-[-28%] h-[58%] border-t border-champagne/10 opacity-70"
          style={{ y: gridY }}
        >
          <div className="h-full w-full bg-[linear-gradient(rgba(212,175,114,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,114,0.12)_1px,transparent_1px)] bg-[size:80px_80px] [transform:perspective(700px)_rotateX(58deg)]" />
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 h-[56vw] max-h-[720px] w-[56vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/18"
          style={{ scale: apertureScale, opacity: apertureOpacity }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[38vw] max-h-[500px] w-[38vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-beige/10"
          style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, 60]), opacity: apertureOpacity }}
        />

        <motion.div
          className="absolute inset-0 object-scroll-perspective"
          style={{ rotateZ: rigRotate, scale: rigScale }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-5 opacity-20 blur-[2px]"
            style={{
              scale: useTransform(scrollYProgress, [0, 1], [0.92, 1.08]),
              rotateY: useTransform(scrollYProgress, [0, 1], [-10, 10]),
              y: useTransform(scrollYProgress, [0, 1], [18, -18]),
            }}
          >
            <img
              src="/assets/bed-crops/front-bed.webp"
              alt=""
              className="w-[min(92vw,980px)] select-none object-contain"
              draggable={false}
            />
          </motion.div>
          {STAGES.map((stage, index) => (
            <ProductFrame
              key={stage.id}
              stage={stage}
              index={index}
              progress={scrollYProgress}
            />
          ))}
          {DETAIL_PLATES.map((plate) => (
            <DetailPlate
              key={plate.image + plate.className}
              plate={plate}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>

        {STAGES.map((stage, index) => (
          <StageCopy
            key={stage.id}
            stage={stage}
            index={index}
            progress={scrollYProgress}
          />
        ))}

        <div className="absolute right-6 top-24 z-30 hidden text-right lg:block">
          <p className="font-manrope text-[9px] uppercase tracking-[0.45em] text-champagne/65">
            Scroll-scrubbed product rig
          </p>
          <p className="mt-3 max-w-xs font-manrope text-[10px] uppercase leading-5 tracking-[0.28em] text-beige/30">
            Center object, camera orbit, macro reveals, detail plates
          </p>
        </div>

        <div className="absolute bottom-7 left-6 right-6 z-40 lg:left-12 lg:right-12">
          <div className="h-px w-full bg-beige/10">
            <motion.div className="h-px bg-champagne" style={{ width: progressWidth }} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void via-void/70 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
