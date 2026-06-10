import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/cards/ProductCard';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import PageHeader from '../components/layout/PageHeader';
import { fetchProducts } from '../lib/api';
import { brandStory, collections } from '../lib/retail';
import { formatMoney } from '../lib/format';
import type { Product } from '../types';
import { ArrowRightIcon, CheckIcon, MapPinIcon, ShieldIcon, TruckIcon } from '../components/ui/icons';

const retailBenefits = [
  { title: 'Fast browse, fast buy', detail: 'Clear product paths, no clutter, and direct checkout flow.', icon: ArrowRightIcon },
  { title: 'Store stock visible', detail: 'See availability by store before you commit to a pair.', icon: MapPinIcon },
  { title: 'Protected checkout', detail: 'Session-based cart and secure account routing.', icon: ShieldIcon },
  { title: 'Delivery clarity', detail: 'Clear shipping methods and arrival estimates every time.', icon: TruckIcon },
];

const HomePage = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetchProducts({ sort: 'newest', limit: 4 });
        if (!active) return;
        setFeatured(response.items);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Shoebox retail system</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">{brandStory.headline}</h1>
            <p className="max-w-xl text-base leading-7 text-muted">{brandStory.subhead}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop">
              <Button size="lg">Shop now</Button>
            </Link>
            <Link to="/stores">
              <Button variant="outline" size="lg" className="bg-white">
                Find a store
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Free returns', 'Reserve in store', 'Checkout in minutes'].map((item) => (
              <div key={item} className="surface px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <CheckIcon className="h-4 w-4 text-success" />
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface overflow-hidden">
          {featured[0] ? (
            <Link to={`/product/${featured[0].id}`} className="block">
              <img src={featured[0].image_url} alt={featured[0].name} className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-end justify-between gap-4 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{featured[0].brand}</p>
                  <h2 className="mt-1 text-lg font-semibold text-ink">{featured[0].name}</h2>
                </div>
                <p className="text-lg font-semibold text-ink">{formatMoney(featured[0].sale_price ?? featured[0].price)}</p>
              </div>
            </Link>
          ) : (
            <div className="aspect-[4/3] bg-white" />
          )}
        </div>
      </section>

      <section className="space-y-4">
        <PageHeader
          eyebrow="Collections"
          title="Browse by intent"
          subtitle="The categories stay simple so shoppers can move straight to the pair they want."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {collections.map((collection) => (
            <Link key={collection.slug} to={`/shop?category=${collection.slug}`} className="surface px-4 py-4 transition-fast hover:-translate-y-0.5 hover:shadow-level2">
              <p className="text-sm font-semibold text-ink">{collection.label}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{itemCopy(collection.slug)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <PageHeader eyebrow="Retail advantage" title="Built for conversion" subtitle="The interface keeps attention on product, price, and store availability." />
        <div className="grid gap-3 lg:grid-cols-4">
          {retailBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="surface p-4">
                <Icon className="h-5 w-5 text-ink" />
                <h3 className="mt-4 text-sm font-semibold text-ink">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{benefit.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <PageHeader eyebrow="Featured" title="Latest arrivals" subtitle="A tight grid of products with the details customers actually scan." action={<Link to="/shop"><Button variant="outline" className="bg-white">View all</Button></Link>} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="surface aspect-[4/5] animate-pulse bg-white" />)
            : featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
};

const itemCopy = (slug: string) => ({
  running: 'Responsive comfort for regular mileage.',
  lifestyle: 'Everyday silhouettes with a clean profile.',
  training: 'Supportive pairs for mixed workouts.',
  court: 'Grip and lateral control for quick cuts.',
  sandals: 'Easy-wear options for warm days.',
}[slug] ?? 'A focused edit of shoes that sell well.');

export default HomePage;
