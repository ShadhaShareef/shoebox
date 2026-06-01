import { useEffect, useState } from 'react';
import { fetchStores } from '../lib/api';
import type { Store } from '../types';
import StoreCard from '../components/cards/StoreCard';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const StoresPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetchStores();
      setStores(response.stores);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Container className="space-y-8 pb-16 pt-10">
      <div className="space-y-3 rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Store locator</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Find a store</h1>
        <p className="text-sm text-neutral-600">Discover nearby Shoebox locations with pickup availability and hours.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/shop">
            <Button variant="outline" size="md">Back to shop</Button>
          </Link>
          <Link to="/brands">
            <Button size="md">Browse brands</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-40 rounded-[28px] border border-neutral-200 bg-neutral-100" />
            ))
          : stores.map((store) => <StoreCard key={store.id} store={store} />)}
      </div>
    </Container>
  );
};

export default StoresPage;
