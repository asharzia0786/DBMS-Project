import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, ShoppingBag } from 'lucide-react';

import { useCart } from '../contexts/cart';
import { fetchProducts, type Product } from '../lib/api';

function formatCurrency(value: number): string {
  return `PKR ${new Intl.NumberFormat('en-PK').format(value)}`;
}

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/5825527/pexels-photo-5825527.jpeg?auto=compress&cs=tinysrgb&w=1200';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function asMetadataRecord(product: Product): Record<string, unknown> {
  return product.metadata && typeof product.metadata === 'object'
    ? (product.metadata as Record<string, unknown>)
    : {};
}

function getProductFeatures(product: Product): string[] {
  const metadata = asMetadataRecord(product);
  const featureSet = new Set<string>();

  if (product.material) {
    featureSet.add(product.material);
  }
  if (product.finish) {
    featureSet.add(product.finish);
  }

  if (typeof metadata.size === 'string' && metadata.size.trim()) {
    featureSet.add(metadata.size.trim());
  }

  const metadataFeatures = metadata.features;
  if (Array.isArray(metadataFeatures)) {
    for (const value of metadataFeatures) {
      if (typeof value === 'string' && value.trim()) {
        featureSet.add(value.trim());
      }
    }
  }

  return Array.from(featureSet);
}

export default function ProductCollectionPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedFinish, setSelectedFinish] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState('all');

  useEffect(() => {
    let active = true;

    const loadAllProducts = async () => {
      try {
        const pageSize = 24;
        let page = 1;
        let totalPages = 1;
        const collected: Product[] = [];

        while (page <= totalPages) {
          const response = await fetchProducts(page, pageSize);
          if (!active) {
            return;
          }
          collected.push(...response.items);
          totalPages = response.totalPages;
          page += 1;
        }

        if (active) {
          setProducts(collected);
          setError(null);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load products.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadAllProducts();

    return () => {
      active = false;
    };
  }, []);

  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean) as string[])).sort(),
    [products],
  );
  const materialOptions = useMemo(
    () => Array.from(new Set(products.map((product) => product.material).filter(Boolean) as string[])).sort(),
    [products],
  );
  const finishOptions = useMemo(
    () => Array.from(new Set(products.map((product) => product.finish).filter(Boolean) as string[])).sort(),
    [products],
  );
  const featureOptions = useMemo(
    () =>
      Array.from(new Set(products.flatMap((product) => getProductFeatures(product)).filter(Boolean))).sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = normalize(searchQuery);

    return products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedMaterial !== 'all' && product.material !== selectedMaterial) {
        return false;
      }
      if (selectedFinish !== 'all' && product.finish !== selectedFinish) {
        return false;
      }

      const features = getProductFeatures(product);
      if (selectedFeature !== 'all' && !features.includes(selectedFeature)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        product.name,
        product.slug,
        product.description || '',
        product.category || '',
        product.material || '',
        product.finish || '',
        ...features,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [products, searchQuery, selectedCategory, selectedMaterial, selectedFinish, selectedFeature]);

  return (
    <main className="min-h-screen bg-void px-6 py-10 text-beige">
      <div className="mx-auto max-w-7xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 font-manrope text-[11px] uppercase tracking-[0.24em] text-beige/60 hover:text-champagne"
        >
          <ArrowLeft size={16} />
          Home
        </a>

        <header className="mt-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">
              Full Collection
            </p>
            <h1 className="mt-3 font-cormorant text-5xl text-beige lg:text-6xl">
              Entire Product Range
            </h1>
            <p className="mt-4 max-w-2xl font-manrope text-sm leading-7 text-beige/55">
              Explore every handcrafted piece in our catalog and open any item for detailed imagery,
              specifications, and checkout actions.
            </p>
          </div>
          <p className="font-manrope text-[10px] uppercase tracking-[0.28em] text-beige/45">
            {loading ? 'Loading products...' : `${filteredProducts.length} of ${products.length} products`}
          </p>
        </header>

        {error ? (
          <div className="mt-8 border border-champagne/20 bg-walnut-900/40 px-5 py-4 font-manrope text-xs tracking-wide text-champagne/85">
            Unable to load full catalog: {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 border border-champagne/10 bg-walnut-900/25 p-4 lg:grid-cols-5">
          <label className="lg:col-span-2">
            <span className="mb-2 block font-manrope text-[9px] uppercase tracking-[0.3em] text-champagne/65">
              Search
            </span>
            <div className="flex items-center gap-2 border border-champagne/20 bg-void/55 px-3">
              <Search size={14} className="text-champagne/55" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, description, material..."
                className="h-11 w-full bg-transparent font-manrope text-sm text-beige placeholder:text-beige/35 focus:outline-none"
              />
            </div>
          </label>
          <label>
            <span className="mb-2 block font-manrope text-[9px] uppercase tracking-[0.3em] text-champagne/65">
              Category
            </span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="h-11 w-full border border-champagne/20 bg-void/55 px-3 font-manrope text-sm text-beige focus:outline-none"
            >
              <option value="all">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block font-manrope text-[9px] uppercase tracking-[0.3em] text-champagne/65">
              Material
            </span>
            <select
              value={selectedMaterial}
              onChange={(event) => setSelectedMaterial(event.target.value)}
              className="h-11 w-full border border-champagne/20 bg-void/55 px-3 font-manrope text-sm text-beige focus:outline-none"
            >
              <option value="all">All materials</option>
              {materialOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block font-manrope text-[9px] uppercase tracking-[0.3em] text-champagne/65">
              Finish / Feature
            </span>
            <div className="flex gap-2">
              <select
                value={selectedFinish}
                onChange={(event) => setSelectedFinish(event.target.value)}
                className="h-11 w-1/2 border border-champagne/20 bg-void/55 px-3 font-manrope text-sm text-beige focus:outline-none"
              >
                <option value="all">All finishes</option>
                {finishOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={selectedFeature}
                onChange={(event) => setSelectedFeature(event.target.value)}
                className="h-11 w-1/2 border border-champagne/20 bg-void/55 px-3 font-manrope text-sm text-beige focus:outline-none"
              >
                <option value="all">All features</option>
                {featureOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="glass-card overflow-hidden">
              <a href={`/products/${product.slug}`} className="block">
                <div className="aspect-[4/3] overflow-hidden bg-walnut-900">
                  <img
                    src={product.images[0]?.imageUrl || FALLBACK_IMAGE}
                    alt={product.images[0]?.altText || product.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <p className="font-manrope text-[9px] uppercase tracking-[0.35em] text-champagne/60">
                    {product.category || 'Luxury Collection'}
                  </p>
                  <h2 className="mt-3 font-playfair text-2xl text-beige">{product.name}</h2>
                  <p className="mt-3 line-clamp-2 font-manrope text-sm leading-6 text-beige/50">
                    {product.description ||
                      'Handcrafted with premium materials and precision CNC detailing.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {getProductFeatures(product)
                      .slice(0, 3)
                      .map((feature) => (
                        <span
                          key={feature}
                          className="border border-champagne/20 px-2 py-1 font-manrope text-[9px] uppercase tracking-[0.2em] text-beige/60"
                        >
                          {feature}
                        </span>
                      ))}
                  </div>
                </div>
              </a>
              <div className="flex items-center justify-between border-t border-champagne/10 px-6 py-5">
                <span className="font-cormorant text-2xl text-champagne">
                  {formatCurrency(product.basePrice)}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center gap-2 bg-champagne px-4 py-2 font-manrope text-[10px] uppercase tracking-[0.2em] text-void hover:bg-gold-200"
                  >
                    <ShoppingBag size={14} />
                    Add
                  </button>
                  <a
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-1 font-manrope text-[10px] uppercase tracking-[0.24em] text-champagne hover:text-beige"
                  >
                    Details
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        {!loading && !error && products.length === 0 ? (
          <div className="mt-8 border border-champagne/15 bg-walnut-900/30 px-5 py-4 font-manrope text-sm text-beige/65">
            No products are available right now.
          </div>
        ) : null}
        {!loading && !error && products.length > 0 && filteredProducts.length === 0 ? (
          <div className="mt-8 border border-champagne/15 bg-walnut-900/30 px-5 py-4 font-manrope text-sm text-beige/65">
            No products match your current search and filters.
          </div>
        ) : null}
      </div>
    </main>
  );
}
