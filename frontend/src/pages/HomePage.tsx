import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Brand, Category, Product, Store } from '../types';
import { fetchBrands, fetchCategories, fetchProducts, fetchStores } from '../lib/api';
import Container from '../components/layout/Container';
import ProductCard from '../components/cards/ProductCard';
import CategoryCard from '../components/cards/CategoryCard';
import BrandCard from '../components/cards/BrandCard';
import StoreCard from '../components/cards/StoreCard';
import Button from '../components/ui/Button';

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryResponse, brandResponse, productResponse, storeResponse] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchProducts({ sort: 'best', limit: 8 }),
          fetchStores(),
        ]);

        setCategories(categoryResponse.categories);
        setBrands(brandResponse.brands);
        setProducts(productResponse.items);
        setStores(storeResponse.stores.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container className="space-y-16 pb-12 pt-8 lg:pb-16 lg:pt-10">
      <section className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Premium footwear in Kerala</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Discover local premium sneakers, everyday runners, and curated brand drops.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
            Shoebox blends modern footwear design with approachable store experiences, fast delivery, and store pickup across Kerala.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/shop">
              <Button size="lg">Shop the collection</Button>
            </Link>
            <Link to="/stores">
              <Button variant="secondary" size="lg">Find a store</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] bg-brand-900 p-8 text-white shadow-lg shadow-brand-500/10">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Fast delivery</p>
            <h2 className="mt-5 text-2xl font-semibold">Get the latest styles before your next week.</h2>
            <p className="mt-4 text-sm leading-7 text-brand-100">Order now and choose express delivery or convenient store pickup from nearby Shoebox stores.</p>
          </div>
          <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Style guide</p>
            <h2 className="mt-5 text-2xl font-semibold text-neutral-900">Street-ready, comfortable footwear for every routine.</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">Browse curated collections for running, weekend looks, and premium everyday silhouettes.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Featured categories</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">Shop by category</h2>
          </div>
          <p className="text-sm text-neutral-600">A curated entry point to the latest arrivals and best sellers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Best sellers</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">Most loved footwear</h2>
          </div>
          <Button variant="outline">View all sneakers</Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">New arrivals</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">Fresh drops for the season</h2>
          </div>
          <p className="text-sm text-neutral-600">Modern silhouettes, premium materials, and launch-ready designs.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(4, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Popular brands</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">Brands you trust</h2>
          </div>
          <Link to="/brands">
            <Button variant="secondary">Browse brands</Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.slice(0, 6).map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Trusted service</p>
              <h2 className="text-3xl font-semibold text-neutral-900">Fast local pickup and citywide shipping</h2>
              <p className="max-w-2xl text-sm leading-7 text-neutral-600">
                Choose same-day store pickup from our Kerala stores or get secure delivery to your doorstep with weekend delivery options.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Newsletter</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">Stay ahead with new releases and offers.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">
              Subscribe for curated launches, local store events, and early access to limited footwear drops.
            </p>
          </div>
          <form className="grid gap-4 sm:grid-cols-[1.8fr_0.8fr]">
            <input type="email" placeholder="Enter your email" className="w-full rounded-3xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-neutral-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            <Button type="submit" size="lg">Subscribe</Button>
          </form>
        </div>
      </section>
    </Container>
  );
};

export default HomePage;
