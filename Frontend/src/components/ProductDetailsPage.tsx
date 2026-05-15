import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, ZoomIn, ZoomOut, X } from 'lucide-react';

import SeoHead from './SeoHead';
import { useCart } from '../contexts/cart';
import { fetchProductBySlug, type Product } from '../lib/api';
import { buildProductSeo } from '../lib/seo';

type ProductDetailsPageProps = {
  slug: string;
};

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/5825527/pexels-photo-5825527.jpeg?auto=compress&cs=tinysrgb&w=1200';

function formatCurrency(value: number): string {
  return `PKR ${new Intl.NumberFormat('en-PK').format(value)}`;
}

export default function ProductDetailsPage({ slug }: ProductDetailsPageProps) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.6);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        const response = await fetchProductBySlug(slug);
        if (active) {
          setProduct(response);
          setSelectedImageIndex(0);
          setError(null);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load product.');
          setProduct(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  const images = useMemo(() => {
    if (!product || product.images.length === 0) {
      return [{ id: 'fallback', imageUrl: FALLBACK_IMAGE, altText: product?.name || 'Product image' }];
    }
    return product.images;
  }, [product]);

  const selectedImage = images[Math.min(selectedImageIndex, Math.max(images.length - 1, 0))];
  const availableStock = product?.stock ?? 0;
  const productSeo = buildProductSeo({
    slug,
    name: product?.name,
    description: product?.description || undefined,
    imageUrl: selectedImage?.imageUrl,
    category: product?.category || undefined,
  });

  const increaseQuantity = () => setQuantity((current) => current + 1);
  const decreaseQuantity = () => setQuantity((current) => Math.max(1, current - 1));

  useEffect(() => {
    if (!product) {
      return;
    }

    setQuantity((current) => (availableStock > 0 ? Math.min(current, availableStock) : 1));
  }, [availableStock, product]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }
    if (product.stock <= 0) {
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) {
      return;
    }
    if (product.stock <= 0) {
      return;
    }
    addToCart(product, quantity);
    window.location.href = '/checkout';
  };

  return (
    <>
      <SeoHead metadata={productSeo} />
      <main className="min-h-screen bg-void px-6 py-10 text-beige">
        <div className="mx-auto max-w-7xl">
        <a
          href="/collection"
          className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 hover:text-champagne"
        >
          <ArrowLeft size={16} />
          Back to collection
        </a>

        {loading ? (
          <section className="mt-10 glass-card p-8 font-manrope text-sm text-beige/65">
            Loading product details...
          </section>
        ) : null}

        {!loading && error ? (
          <section className="mt-10 border border-champagne/20 bg-walnut-900/40 p-8 font-manrope text-sm text-champagne/85">
            Unable to open this product: {error}
          </section>
        ) : null}

        {!loading && !error && product ? (
          <section className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="relative overflow-hidden bg-walnut-900">
                <button type="button" onClick={() => setZoomOpen(true)} className="block w-full">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.altText || product.name}
                    className="h-[520px] w-full object-cover"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="absolute right-4 top-4 inline-flex items-center gap-2 bg-void/75 px-3 py-2 font-manrope text-[10px] uppercase tracking-[0.24em] text-champagne hover:bg-void"
                >
                  <ZoomIn size={14} />
                  Zoom
                </button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`overflow-hidden border ${
                      selectedImageIndex === index ? 'border-champagne' : 'border-champagne/20'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.altText || `${product.name} ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-manrope text-[10px] uppercase tracking-[0.34em] text-champagne/70">
                {product.category || 'Luxury Collection'}
              </p>
              <h1 className="mt-4 font-cormorant text-5xl leading-tight text-beige">{product.name}</h1>
              <p className="mt-5 font-manrope text-base leading-8 text-beige/65">
                {product.description ||
                  'Crafted with premium materials, precise CNC detailing, and hand-finished luxury surfaces.'}
              </p>

              <p className="mt-8 font-cormorant text-4xl text-champagne">{formatCurrency(product.basePrice)}</p>
              <p className="mt-2 font-manrope text-[10px] uppercase tracking-[0.24em] text-beige/45">
                {availableStock <= 0
                  ? 'Out of stock'
                  : availableStock <= 5
                    ? `Only ${availableStock} left`
                    : `${availableStock} available`}
              </p>

              <div className="mt-8 inline-flex items-center border border-champagne/20">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-3 text-champagne disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center font-manrope text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={product.stock > 0 ? quantity >= product.stock : true}
                  className="p-3 text-champagne disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="inline-flex items-center gap-2 bg-champagne px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-void hover:bg-gold-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag size={15} />
                  {product.stock <= 0 ? 'Unavailable' : 'Add to cart'}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="border border-champagne/40 px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-champagne hover:bg-champagne/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy now
                </button>
                <a
                  href="/custom-order"
                  className="border border-champagne/25 px-6 py-3 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/75 hover:text-champagne"
                >
                  Bespoke quote
                </a>
              </div>

              <div className="mt-10 grid gap-3 border-t border-champagne/10 pt-6 font-manrope text-sm text-beige/60">
                <p>
                  <span className="text-beige/35">Material:</span> {product.material || 'Premium wood'}
                </p>
                <p>
                  <span className="text-beige/35">Finish:</span> {product.finish || 'Custom hand finish'}
                </p>
                <p>
                  <span className="text-beige/35">Category:</span> {product.category || 'Luxury Collection'}
                </p>
                <p>
                  <span className="text-beige/35">Stock:</span>{' '}
                  {product.stock <= 0 ? 'Out of stock' : `${product.stock} available`}
                </p>
              </div>
            </div>
          </section>
        ) : null}
        </div>

        {zoomOpen && product ? (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-6 py-8"
          >
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center border border-champagne/30 text-champagne hover:bg-champagne/10"
              aria-label="Close zoom view"
            >
              <X size={16} />
            </button>

            <div className="absolute left-6 top-6 inline-flex items-center gap-2 bg-void/75 px-4 py-2 font-manrope text-[10px] uppercase tracking-[0.24em] text-beige/70">
              Zoom View
            </div>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
              <button
                type="button"
                onClick={() => setZoomScale((current) => Math.max(1, current - 0.2))}
                className="inline-flex items-center gap-2 border border-champagne/30 px-4 py-2 font-manrope text-[10px] uppercase tracking-[0.24em] text-champagne hover:bg-champagne/10"
              >
                <ZoomOut size={14} />
                Zoom out
              </button>
              <button
                type="button"
                onClick={() => setZoomScale((current) => Math.min(3, current + 0.2))}
                className="inline-flex items-center gap-2 border border-champagne/30 px-4 py-2 font-manrope text-[10px] uppercase tracking-[0.24em] text-champagne hover:bg-champagne/10"
              >
                <ZoomIn size={14} />
                Zoom in
              </button>
            </div>

            <div className="max-h-full max-w-[90vw] overflow-auto">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.altText || product.name}
                className="max-h-[80vh] max-w-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center' }}
              />
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
