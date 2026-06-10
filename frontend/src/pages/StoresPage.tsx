import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { fetchStores } from '../lib/api';
import { estimateStoreDistance } from '../lib/geo';
import { formatDistance } from '../lib/format';
import { MapPinIcon, ClockIcon, ArrowRightIcon } from '../components/ui/icons';
import type { Store } from '../types';
import { Link } from 'react-router-dom';

const StoresPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [baseCity, setBaseCity] = useState('Kochi');

  useEffect(() => {
    let active = true;
    fetchStores()
      .then((response) => {
        if (!active) return;
        setStores(response.stores);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleStores = useMemo(() => {
    return stores
      .filter((store) => [store.name, store.city, store.address].join(' ').toLowerCase().includes(search.toLowerCase()))
      .map((store) => ({
        ...store,
        distance: estimateStoreDistance(baseCity, store.city),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [baseCity, search, stores]);

  const nearest = visibleStores[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Store locator"
        title="Reserve in store"
        subtitle="Use the store network as a conversion layer: pick a location, check stock, and move faster."
        action={nearest ? <Badge variant="neutral">Nearest: {nearest.city}</Badge> : null}
      />

      <div className="grid gap-4 surface p-4 md:grid-cols-[1fr_220px]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search store, city, or address" aria-label="Search stores" />
        <Select value={baseCity} onChange={(event) => setBaseCity(event.target.value)}>
          {['Kochi', 'Thrissur', 'Kozhikode', 'Bengaluru', 'Chennai'].map((city) => (
            <option key={city} value={city}>
              Based in {city}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="surface p-6 text-sm text-muted">Loading stores...</div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {visibleStores.map((store) => (
            <article key={store.id} className="surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{store.city}</p>
                  <h2 className="mt-1 text-lg font-semibold text-ink">{store.name}</h2>
                </div>
                <Badge variant="stock">{store.availability}</Badge>
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                {store.address}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  {store.hours}
                </span>
                <span>{formatDistance(store.distance)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="bg-white" onClick={() => store.phone && window.open(`tel:${store.phone}`)}>
                  Call store
                </Button>
                <Link to="/shop">
                  <Button>
                    Reserve in store
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoresPage;
