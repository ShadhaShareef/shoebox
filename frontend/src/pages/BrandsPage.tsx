import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Brand } from '../types';
import { fetchBrands } from '../lib/api';
import BrandCard from '../components/cards/BrandCard';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetchBrands();
      setBrands(response.brands);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Container className="space-y-8 pb-16 pt-10">
      <div className="space-y-4 rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Brands</p>
          <h1 className="text-3xl font-semibold text-neutral-900">All brands</h1>
          <p className="text-sm text-neutral-600">Browse by brand and discover curated collections for your favorite labels.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/shop">
            <Button variant="outline" size="lg">Back to shop</Button>
          </Link>
          <Link to="/stores">
            <Button size="lg">Store locator</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-40 rounded-[28px] border border-neutral-200 bg-neutral-100" />
            ))
          : brands.map((brand) => <BrandCard key={brand.slug} brand={brand} />)}
      </div>
    </Container>
  );
};

export default BrandsPage;
