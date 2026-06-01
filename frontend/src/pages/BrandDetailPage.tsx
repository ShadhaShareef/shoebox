import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Product } from '../types';
import { fetchProducts } from '../lib/api';
import ProductCard from '../components/cards/ProductCard';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';

const BrandDetailPage = () => {
  const { brand } = useParams<{ brand?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!brand) return;
      setLoading(true);
      const brandName = brand
        .split('-')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
      const response = await fetchProducts({ brand: brandName, limit: 24 });
      setProducts(response.items);
      setLoading(false);
    };
    load();
  }, [brand]);

  if (!brand) {
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm text-center">
          <p className="text-sm text-neutral-500">Brand not found</p>
        </div>
      </Container>
    );
  }

  const brandLabel = brand
    ? brand.split('-').map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' ')
    : '';

  return (
    <Container className="space-y-8 pb-16 pt-10">
      <div className="space-y-3 rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Brand</p>
        <h1 className="text-3xl font-semibold text-neutral-900">{brandLabel}</h1>
        <p className="text-sm text-neutral-600">Products from this brand are shown below.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/brands">
            <Button variant="outline" size="md">Back to brands</Button>
          </Link>
          <Link to="/shop">
            <Button size="md">Browse shop</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 rounded-[28px] border border-neutral-200 bg-neutral-100" />
            ))
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </Container>
  );
};

export default BrandDetailPage;
