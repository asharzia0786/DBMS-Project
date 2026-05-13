import { useEffect, useState } from 'react';

import ContentPage from './ContentPage';
import { fetchProducts, type Product } from '../lib/api';

export default function Gallery() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void fetchProducts(1, 40).then((response) => setProducts(response.items)).catch(() => setProducts([]));
  }, []);

  return (
    <ContentPage eyebrow="Portfolio" title="Gallery">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.flatMap((product) =>
          product.images.slice(0, 2).map((image) => (
            <figure key={image.id} className="not-prose overflow-hidden border border-champagne/15 bg-walnut-900">
              <img src={image.imageUrl} alt={image.altText || product.name} className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105" />
              <figcaption className="p-4 font-manrope text-xs uppercase tracking-[0.2em] text-beige/55">{product.name}</figcaption>
            </figure>
          )),
        )}
      </div>
      {products.length === 0 ? <p>Product images will appear here after the catalog import runs.</p> : null}
    </ContentPage>
  );
}
