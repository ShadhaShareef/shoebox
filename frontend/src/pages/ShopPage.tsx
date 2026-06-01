import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { Category, Product } from '../types';
import { fetchCategories, fetchProducts } from '../lib/api';
import Container from '../components/layout/Container';
import ProductCard from '../components/cards/ProductCard';
import Checkbox from '../components/ui/Checkbox';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';

const sortOptions = [
  { value: 'best', label: 'Best selling' },
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const ShopPage = () => {
  const params = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentCategory = params.category ?? searchParams.get('category') ?? '';
  const searchQuery = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? 'best';
  const page = Number(searchParams.get('page') ?? 1);

  const filterChips = useMemo(() => {
    const chips: Array<{ label: string; value: string; key: string }> = [];
    if (searchQuery) chips.push({ label: `Search: ${searchQuery}`, value: '', key: 'search' });
    if (currentCategory) chips.push({ label: `Category: ${currentCategory}`, value: 'category', key: 'category' });
    return chips;
  }, [currentCategory, searchQuery]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetchProducts({ category: currentCategory, search: searchQuery, sort, page, limit: pageSize });
      setProducts(response.items);
      setTotal(response.total);
      setLoading(false);
    };
    load();
  }, [currentCategory, searchQuery, sort, page, pageSize]);

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data.categories));
  }, []);

  const updateParam = (key: string, value: string) => {
    if (key === 'category') {
      const next = new URLSearchParams(searchParams);
      next.delete('category');
      next.delete('page');
      const search = next.toString();
      if (value) {
        navigate({ pathname: `/shop/${encodeURIComponent(value)}`, search }, { replace: false });
      } else {
        navigate({ pathname: '/shop', search }, { replace: false });
      }
      return;
    }

    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  return (
    <Container className="space-y-8 pb-12 pt-8 lg:pb-16 lg:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Shop</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Find the perfect pair.</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-3xl border border-neutral-200 bg-white p-3 shadow-sm">
            <p className="text-sm text-neutral-600">Showing</p>
            <p className="text-lg font-semibold text-neutral-900">{total} items</p>
          </div>
          <Button variant="secondary" size="md" onClick={() => setMobileFiltersOpen(true)} className="md:hidden">
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden flex-col gap-6 rounded-[32px] border border-neutral-200 bg-white px-6 py-7 shadow-sm lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">Filters</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-neutral-900">Search</p>
              <Input
                value={searchQuery}
                onChange={(event) => updateParam('search', event.target.value)}
                placeholder="Search products"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-neutral-900">Category</p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.slug} className="flex items-center gap-3 rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 transition hover:border-brand-300">
                    <Checkbox checked={currentCategory === category.slug} onChange={() => updateParam('category', currentCategory === category.slug ? '' : category.slug)} />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Sort</p>
                <Select value={sort} onChange={(event) => updateParam('sort', event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterChips.map((chip) => (
                  <button key={chip.key} type="button" onClick={() => updateParam(chip.key, '')} className="rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-200">
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-96 rounded-[28px] border border-neutral-200 bg-neutral-100" />
                ))
              : products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
            </p>
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={(next) => updateParam('page', String(next))} />
          </div>
        </section>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 sm:p-6">
          <div className="h-full overflow-y-auto rounded-[28px] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Filters</p>
                <h2 className="text-2xl font-semibold text-neutral-900">Refine results</h2>
              </div>
              <button type="button" className="text-sm font-semibold text-neutral-700" onClick={() => setMobileFiltersOpen(false)}>
                Close
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-900">Search</p>
                <Input
                  value={searchQuery}
                  onChange={(event) => updateParam('search', event.target.value)}
                  placeholder="Search products"
                />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-900">Category</p>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.slug} className="flex items-center gap-3 rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                      <Checkbox checked={currentCategory === category.slug} onChange={() => updateParam('category', currentCategory === category.slug ? '' : category.slug)} />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="w-full" onClick={() => { navigate('/shop'); setSearchParams(new URLSearchParams()); setMobileFiltersOpen(false); }}>
                  Clear all
                </Button>
                <Button size="lg" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                  Apply filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ShopPage;
