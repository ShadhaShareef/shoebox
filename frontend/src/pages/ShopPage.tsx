import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/cards/ProductCard';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/layout/PageHeader';
import { fetchBrands, fetchProducts, addToCart, fetchWishlist, toggleWishlist } from '../lib/api';
import { collections, sortOptions } from '../lib/retail';
import type { Brand, Product } from '../types';
import { FilterIcon } from '../components/ui/icons';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 16;

const ShopPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') ?? 'all');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'best');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'));
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get('search') ?? '');
    setSelectedCategory(searchParams.get('category') ?? 'all');
    setSelectedBrand(searchParams.get('brand') ?? 'all');
    setSort(searchParams.get('sort') ?? 'best');
    setPage(Number(searchParams.get('page') ?? '1'));
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const [productResponse, brandResponse] = await Promise.all([
          fetchProducts({
            page,
            limit: PAGE_SIZE,
            search: query || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            brand: selectedBrand !== 'all' ? selectedBrand : undefined,
            sort,
          }),
          fetchBrands(),
        ]);
        if (!active) return;
        setProducts(productResponse.items);
        setTotal(productResponse.total);
        setBrands(brandResponse.brands);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [page, query, selectedBrand, selectedCategory, sort]);

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    let active = true;
    fetchWishlist()
      .then((response) => {
        if (!active) return;
        setWishlistIds(response.items.map((item) => item.id));
      })
      .catch(() => setWishlistIds([]));
    return () => {
      active = false;
    };
  }, [user]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const searchCountLabel = useMemo(() => `${total} product${total === 1 ? '' : 's'}`, [total]);

  const updateParams = (updates: Record<string, string | number | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next, { replace: true });
  };

  const handleWishlist = async (product: Product) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    await toggleWishlist(product.id);
    setWishlistIds((current) =>
      current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]
    );
  };

  const handleQuickAdd = async (product: Product) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      await addToCart({ product_id: product.id, quantity: 1, size: product.sizes?.[0] ?? '9' });
      window.dispatchEvent(new Event('cart:updated'));
    } finally {
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Shop"
        title="Browse the box"
        subtitle="Search, filter, sort, and add with no page reload. Store availability follows the product wherever it appears."
        action={<Badge variant="neutral">{searchCountLabel}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Filters</h2>
              <button type="button" className="text-xs font-semibold text-muted hover:text-ink" onClick={() => updateParams({ search: null, category: null, brand: null, sort: 'best', page: 1 })}>
                Reset
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Search</label>
                <Input
                  value={query}
                  onChange={(event) => {
                    setPage(1);
                    updateParams({ search: event.target.value, page: 1 });
                  }}
                  placeholder="Search by shoe, brand, or category"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Category</label>
                <Select value={selectedCategory} onChange={(event) => { setPage(1); updateParams({ category: event.target.value, page: 1 }); }}>
                  <option value="all">All categories</option>
                  {collections.map((collection) => (
                    <option key={collection.slug} value={collection.slug}>
                      {collection.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Brand</label>
                <Select value={selectedBrand} onChange={(event) => { setPage(1); updateParams({ brand: event.target.value, page: 1 }); }}>
                  <option value="all">All brands</option>
                  {brands.map((brand) => (
                    <option key={brand.slug} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Sort</label>
                <Select value={sort} onChange={(event) => { setPage(1); updateParams({ sort: event.target.value, page: 1 }); }}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
            <Button variant="secondary" onClick={() => setDrawerOpen(true)} className="bg-white">
              <FilterIcon className="h-4 w-4" />
              Filters
            </Button>
            <div className="text-sm font-semibold text-muted">{searchCountLabel}</div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Input
                value={query}
                onChange={(event) => {
                  setPage(1);
                  updateParams({ search: event.target.value, page: 1 });
                }}
                placeholder="Instant search"
                aria-label="Search products"
              />
            </div>
            <div className="hidden md:block md:min-w-[220px]">
              <Select value={sort} onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="surface aspect-[4/5] animate-pulse bg-white" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="surface px-6 py-10 text-center">
              <h2 className="text-lg font-semibold text-ink">No matches yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Tighten or clear filters to get back to the shelf.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleWishlist}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>

              {pageCount > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-sm text-muted">
                    Page {page} of {pageCount}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled={page <= 1} onClick={() => updateParams({ page: page - 1 })} className="bg-white">
                      Previous
                    </Button>
                    <Button variant="outline" disabled={page >= pageCount} onClick={() => updateParams({ page: page + 1 })} className="bg-white">
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Search</label>
            <Input
              value={query}
              onChange={(event) => {
                setPage(1);
                updateParams({ search: event.target.value, page: 1 });
              }}
              placeholder="Search shoes"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Category</label>
            <Select value={selectedCategory} onChange={(event) => updateParams({ category: event.target.value, page: 1 })}>
              <option value="all">All categories</option>
              {collections.map((collection) => (
                <option key={collection.slug} value={collection.slug}>
                  {collection.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Brand</label>
            <Select value={selectedBrand} onChange={(event) => updateParams({ brand: event.target.value, page: 1 })}>
              <option value="all">All brands</option>
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Sort</label>
            <Select value={sort} onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ShopPage;
