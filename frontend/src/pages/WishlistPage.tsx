import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { addToCart, fetchWishlist, removeFromWishlist } from '../lib/api';
import { formatMoney } from '../lib/format';
import type { Product } from '../types';
import { HeartIcon, BagIcon, CloseIcon } from '../components/ui/icons';

const WishlistPage = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetchWishlist()
      .then((response) => {
        if (!active) return;
        setItems(response.items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleRemove = async (id: number) => {
    setBusyId(id);
    try {
      await removeFromWishlist(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (product: Product) => {
    setBusyId(product.id);
    try {
      await addToCart({ product_id: product.id, quantity: 1, size: product.sizes?.[0] });
      await removeFromWishlist(product.id);
      setItems((current) => current.filter((item) => item.id !== product.id));
      window.dispatchEvent(new Event('cart:updated'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Wishlist" title="Saved pairs" subtitle="Keep favorites close and move them to cart when the timing feels right." action={<Badge variant="neutral">{items.length}</Badge>} />

      {loading ? (
        <div className="surface p-6 text-sm text-muted">Loading wishlist...</div>
      ) : items.length === 0 ? (
        <div className="surface px-6 py-10 text-center">
          <HeartIcon className="mx-auto h-8 w-8 text-muted" />
          <h2 className="mt-4 text-lg font-semibold text-ink">Nothing saved yet</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Add products from shop or product pages to build your shortlist.</p>
          <Link to="/shop">
            <Button className="mt-4">Explore shop</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <article key={product.id} className="surface overflow-hidden">
              <Link to={`/product/${product.id}`} className="block aspect-[4/3] overflow-hidden">
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{product.brand}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="mt-1 text-sm font-semibold text-ink">{product.name}</h3>
                  </Link>
                  <p className="mt-2 text-sm text-ink">{formatMoney(product.sale_price ?? product.price)}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => void handleMove(product)} disabled={busyId === product.id}>
                    <BagIcon className="h-4 w-4" />
                    Move to cart
                  </Button>
                  <button
                    type="button"
                    onClick={() => void handleRemove(product.id)}
                    disabled={busyId === product.id}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-white transition-fast hover:border-ink"
                    aria-label={`Remove ${product.name}`}
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
