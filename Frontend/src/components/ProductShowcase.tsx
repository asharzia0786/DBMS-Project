import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/cart';
import { fetchProducts, type Product } from '../lib/api';

type ShowcaseProduct = {
  id: string;
  name: string;
  collection: string;
  material: string;
  size: string;
  price: string;
  desc: string;
  image: string;
  imagePosition?: string;
  featured: boolean;
  source: Product;
};

const FALLBACK_PRODUCTS: ShowcaseProduct[] = [];

function formatCurrency(value: number): string {
  return `From PKR ${new Intl.NumberFormat('en-PK').format(value)}`;
}

function mapToShowcaseProduct(product: Product, index: number): ShowcaseProduct {
  const metadata = product.metadata || {};
  const collection =
    product.category || (typeof metadata.collection === 'string' ? metadata.collection : 'Luxury Collection');
  const material = product.material || (typeof metadata.material === 'string' ? metadata.material : 'Premium Wood');
  const size = typeof metadata.size === 'string' ? metadata.size : 'Bespoke Available';

  return {
    id: product.id,
    name: product.name,
    collection,
    material,
    size,
    price: formatCurrency(product.basePrice),
    desc:
      product.description ||
      'Handcrafted by our master artisans with precision CNC detailing and premium finishing.',
    image:
      product.images[0]?.imageUrl ||
      'https://images.pexels.com/photos/5825527/pexels-photo-5825527.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imagePosition: product.images[0]?.imageUrl ? '50% 50%' : '50% 50%',
    featured: index === 0,
    source: product,
  };
}

function ProductCard({ product, index }: { product: ShowcaseProduct; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();
  const productUrl = `/products/${product.source.slug}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.02, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      onClick={() => {
        window.location.href = productUrl;
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = productUrl;
        }
      }}
      style={{
        transform: hovered
          ? `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(10px)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)',
        transition: 'transform 0.4s ease',
      }}
      className={`relative glass-card overflow-hidden group cursor-pointer ${
        product.featured ? 'lg:col-span-2 lg:row-span-1' : ''
      }`}
    >
      {/* Ambient glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,114,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Gold reflection sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{ x: hovered ? '200%' : '-100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(105deg, transparent 20%, rgba(212,175,114,0.12) 50%, transparent 80%)',
          width: '60%',
          top: 0,
          bottom: 0,
        }}
      />

      {/* Image */}
      <div className={`overflow-hidden ${product.featured ? 'h-72 lg:h-80' : 'h-64'}`}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ objectPosition: product.imagePosition || '50% 50%' }}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-walnut-900/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="font-manrope text-[9px] tracking-[0.4em] uppercase text-champagne/50 mb-2 block">
              {product.collection}
            </span>
            <h3 className="font-playfair text-xl text-beige group-hover:text-champagne transition-colors duration-300">
              {product.name}
            </h3>
          </div>
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
            transition={{ duration: 0.3 }}
            className="text-champagne mt-1"
          >
            <ArrowRight size={18} />
          </motion.div>
        </div>

        <p className="font-manrope text-xs text-beige/40 leading-relaxed mb-6 max-w-sm">
          {product.desc}
        </p>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-manrope text-[9px] tracking-[0.3em] uppercase text-beige/30">Material</span>
              <span className="font-manrope text-[10px] text-beige/60">{product.material}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-manrope text-[9px] tracking-[0.3em] uppercase text-beige/30">Size</span>
              <span className="font-manrope text-[10px] text-beige/60">{product.size}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-cormorant text-lg text-champagne">{product.price}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-champagne/10 pt-6">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              addToCart(product.source);
            }}
            className="flex items-center gap-2 bg-champagne px-4 py-2 font-manrope text-[10px] uppercase tracking-[0.22em] text-void hover:bg-gold-200"
          >
            <ShoppingBag size={14} />
            Add to cart
          </button>
          <a
            href={productUrl}
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-2 font-manrope text-[10px] uppercase tracking-[0.28em] text-champagne hover:text-beige"
          >
            View details
            <span className="block h-px w-4 bg-current" />
          </a>
          <a
            href="/custom-order"
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-2 font-manrope text-[10px] uppercase tracking-[0.28em] text-champagne hover:text-beige"
          >
            Bespoke quote
            <span className="block h-px w-4 bg-current" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetchProducts(1, 6);
        if (mounted) {
          setProducts(response.items);
          setError(null);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load products.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const productsToRender = useMemo(
    () =>
      products.length > 0
        ? products.map((product, index) => mapToShowcaseProduct(product, index))
        : FALLBACK_PRODUCTS,
    [products],
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-void py-32 lg:py-48 overflow-hidden"
      id="collection"
    >
      {/* Background ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"
          style={{
            width: '80vw',
            height: '60vh',
            background: 'radial-gradient(ellipse, rgba(78,47,20,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-champagne/50" />
            <span className="font-manrope text-[9px] tracking-[0.5em] uppercase text-champagne/60">
              The Collection
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-champagne/50" />
          </div>
          <h2 className="font-playfair text-[clamp(2.5rem,6vw,5rem)] text-beige leading-tight font-normal">
            Museum-Grade
            <br />
            <span className="italic text-gradient-gold">Furniture</span>
          </h2>
          <p className="font-manrope text-sm text-beige/40 mt-6 max-w-lg mx-auto leading-relaxed">
            Each piece is a singular creation — designed with architectural intention,
            executed with generational expertise.
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {productsToRender.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        {!loading && error ? (
          <p className="mt-6 text-center font-manrope text-xs tracking-wide text-beige/40">
            Live catalog unavailable: {error}. Showing curated collection preview.
          </p>
        ) : null}

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.04 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a
            href="/collection"
            className="group inline-flex items-center gap-4 font-manrope text-[11px] tracking-[0.4em] uppercase text-champagne border border-champagne/30 px-12 py-4 hover:bg-champagne hover:text-void transition-all duration-500"
          >
            View Full Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
