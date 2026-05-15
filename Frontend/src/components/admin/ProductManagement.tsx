import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Plus, Trash2 } from 'lucide-react';

import ImageUploadWidget from '../ImageUploadWidget';
import { createProduct, deleteProduct, fetchProducts, updateProduct, type Product } from '../../lib/api';

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  stock: string;
  category: string;
  material: string;
  finish: string;
  size: string;
  images: string[];
};

const emptyForm: ProductForm = {
  name: '',
  slug: '',
  description: '',
  basePrice: '',
  stock: '0',
  category: '',
  material: '',
  finish: '',
  size: '',
  images: [],
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProductManagement() {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [status, setStatus] = useState<string | null>(null);

  async function loadProducts() {
    const response = await fetchProducts(1, 100);
    setProducts(response.items);
  }

  useEffect(() => {
    void getToken().then(setToken);
    void loadProducts();
  }, [getToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || undefined,
      basePrice: Number(form.basePrice),
      stock: Number(form.stock),
      category: form.category || undefined,
      material: form.material || undefined,
      finish: form.finish || undefined,
      metadata: form.size ? { size: form.size } : undefined,
      images: form.images.map((imageUrl) => ({ imageUrl, altText: form.name })),
    };

    if (form.id) {
      await updateProduct(token, form.id, payload);
      setStatus('Product updated.');
    } else {
      await createProduct(token, payload);
      setStatus('Product created.');
    }
    setForm(emptyForm);
    await loadProducts();
  }

  function editProduct(product: Product) {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      basePrice: String(product.basePrice),
      stock: String(product.stock),
      category: product.category || '',
      material: product.material || '',
      finish: product.finish || '',
      size: typeof product.metadata?.size === 'string' ? product.metadata.size : '',
      images: product.images.map((image) => image.imageUrl),
    });
  }

  async function removeProduct(id: string) {
    if (!token) return;
    await deleteProduct(token, id);
    await loadProducts();
  }

  return (
    <div>
      <p className="font-manrope text-[11px] uppercase tracking-[0.35em] text-champagne">Catalog</p>
      <h1 className="mt-3 font-cormorant text-5xl">Product management</h1>
      {status ? <p className="mt-4 font-manrope text-sm text-beige/60">{status}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-5">
          <p className="font-manrope text-[10px] uppercase tracking-[0.25em] text-beige/45">Total stock</p>
          <p className="mt-3 font-cormorant text-4xl text-champagne">{products.reduce((sum, product) => sum + product.stock, 0)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="font-manrope text-[10px] uppercase tracking-[0.25em] text-beige/45">Low stock</p>
          <p className="mt-3 font-cormorant text-4xl text-champagne">
            {products.filter((product) => product.stock > 0 && product.stock <= 5).length}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="font-manrope text-[10px] uppercase tracking-[0.25em] text-beige/45">Out of stock</p>
          <p className="mt-3 font-cormorant text-4xl text-champagne">
            {products.filter((product) => product.stock <= 0).length}
          </p>
        </div>
      </div>
      <section className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="glass-card h-fit space-y-4 p-6">
          <h2 className="font-cormorant text-3xl">{form.id ? 'Edit product' : 'Add product'}</h2>
          {[
            ['name', 'Name'],
            ['slug', 'Slug'],
            ['basePrice', 'Price PKR'],
            ['stock', 'Stock'],
            ['category', 'Category'],
            ['material', 'Material'],
            ['finish', 'Finish'],
            ['size', 'Size'],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="font-manrope text-[10px] uppercase tracking-[0.2em] text-beige/50">{label}</span>
              <input
                required={key === 'name' || key === 'basePrice'}
                value={form[key as keyof ProductForm] as string}
                type={key === 'basePrice' || key === 'stock' ? 'number' : 'text'}
                min={key === 'basePrice' ? '1' : key === 'stock' ? '0' : undefined}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value, ...(key === 'name' && !current.id ? { slug: slugify(event.target.value) } : {}) }))}
                className="mt-2 w-full border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
              />
            </label>
          ))}
          <label className="block">
            <span className="font-manrope text-[10px] uppercase tracking-[0.2em] text-beige/50">Description</span>
            <textarea
              rows={5}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="mt-2 w-full resize-none border border-champagne/15 bg-void/70 px-4 py-3 font-manrope text-sm text-beige outline-none focus:border-champagne"
            />
          </label>
          <ImageUploadWidget token={token} value={form.images} onChange={(images) => setForm((current) => ({ ...current, images }))} folder="luxury-cnc/products" />
          <button className="inline-flex items-center gap-2 bg-champagne px-5 py-3 font-manrope text-[11px] uppercase tracking-[0.22em] text-void">
            <Plus size={16} />
            Save product
          </button>
        </form>
        <div className="space-y-4">
          {products.map((product) => (
            <article key={product.id} className="glass-card grid gap-4 p-4 sm:grid-cols-[100px_1fr_auto]">
              <div className="aspect-square overflow-hidden bg-walnut-900">
                {product.images[0] ? <img src={product.images[0].imageUrl} alt={product.name} className="h-full w-full object-cover" /> : null}
              </div>
              <button type="button" onClick={() => editProduct(product)} className="text-left">
                <h3 className="font-cormorant text-2xl text-beige">{product.name}</h3>
                <p className="mt-2 font-manrope text-xs text-beige/50">
                  {product.category || 'Uncategorized'} · PKR {product.basePrice.toLocaleString('en-PK')} · Stock {product.stock}
                </p>
                <p className="mt-2 font-manrope text-[10px] uppercase tracking-[0.22em] text-beige/40">
                  {product.stock <= 0 ? 'Out of stock' : product.stock <= 5 ? 'Low stock' : 'In stock'}
                </p>
              </button>
              <button type="button" onClick={() => void removeProduct(product.id)} className="text-red-300">
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
