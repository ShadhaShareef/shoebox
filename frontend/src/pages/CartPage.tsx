import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { clearCart, fetchCart, removeCartItem, updateCartItem } from '../lib/api';
import { formatMoney } from '../lib/format';
import type { CartItem } from '../lib/api';
import { MinusIcon, PlusIcon, CloseIcon, ArrowRightIcon } from '../components/ui/icons';

const CartPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [busyItem, setBusyItem] = useState<string | null>(null);

  const loadCart = async () => {
    const response = await fetchCart();
    setItems(response.items);
    setSubtotal(response.subtotal);
    setShipping(response.shipping);
    setTax(response.tax);
    setTotal(response.total);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await loadCart();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const handleUpdate = async (item: CartItem, nextQuantity: number) => {
    const key = `${item.product_id}-${item.size ?? ''}`;
    setBusyItem(key);
    try {
      await updateCartItem({ product_id: item.product_id, quantity: nextQuantity, size: item.size });
      await loadCart();
      window.dispatchEvent(new Event('cart:updated'));
    } finally {
      setBusyItem(null);
    }
  };

  const handleRemove = async (item: CartItem) => {
    const key = `${item.product_id}-${item.size ?? ''}`;
    setBusyItem(key);
    try {
      await removeCartItem({ product_id: item.product_id, size: item.size });
      await loadCart();
      window.dispatchEvent(new Event('cart:updated'));
    } finally {
      setBusyItem(null);
    }
  };

  const handleClear = async () => {
    await clearCart();
    await loadCart();
    window.dispatchEvent(new Event('cart:updated'));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cart"
        title="Your Shoebox"
        subtitle="A clean item list, clear totals, and one strong path to checkout."
        action={<Badge variant="neutral">{itemCount} item{itemCount === 1 ? '' : 's'}</Badge>}
      />

      {loading ? (
        <div className="surface p-6 text-sm text-muted">Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="surface px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-ink">Your box is empty</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Add a pair, reserve in store, or continue browsing the shelf.</p>
          <Link to="/shop">
            <Button className="mt-4">Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3">
            {items.map((item) => {
              const product = item.product;
              const key = `${item.product_id}-${item.size ?? ''}`;
              const price = product?.sale_price ?? product?.price ?? 0;
              return (
                <article key={key} className="surface flex gap-4 p-4">
                  <Link to={`/product/${item.product_id}`} className="shrink-0">
                    <img src={product?.image_url ?? ''} alt={product?.name ?? 'Product'} className="h-24 w-24 rounded-md object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{product?.brand}</p>
                        <Link to={`/product/${item.product_id}`} className="block truncate text-sm font-semibold text-ink">
                          {product?.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted">
                          Size {item.size || 'n/a'} • {formatMoney(price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-ink transition-fast hover:border-ink"
                        aria-label={`Remove ${product?.name ?? 'item'}`}
                        onClick={() => void handleRemove(item)}
                        disabled={busyItem === key}
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-1 rounded-md border border-border bg-white p-1">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink transition-fast hover:border-ink"
                          onClick={() => void handleUpdate(item, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                          disabled={busyItem === key}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="inline-flex h-9 min-w-10 items-center justify-center px-2 text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink transition-fast hover:border-ink"
                          onClick={() => void handleUpdate(item, item.quantity + 1)}
                          aria-label="Increase quantity"
                          disabled={busyItem === key}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-base font-semibold text-ink">{formatMoney(price * item.quantity)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 surface p-4">
              <h2 className="text-sm font-semibold text-ink">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatMoney(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? 'Free' : formatMoney(shipping)} />
                <Row label="Tax" value={formatMoney(tax)} />
                <div className="border-t border-border pt-2">
                  <Row label="Total" value={formatMoney(total)} strong />
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">Seal The Box</p>
              <button type="button" onClick={() => void handleClear()} className="mt-4 w-full rounded-md border border-border px-3 py-3 text-sm font-semibold text-ink transition-fast hover:border-ink">
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-20 z-30 border-t border-border bg-white/98 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Total</p>
            <p className="text-base font-semibold text-ink">{formatMoney(total)}</p>
          </div>
          <Button onClick={() => setSummaryOpen(true)}>
            Proceed to Checkout
          </Button>
        </div>
        <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">Seal The Box</p>
      </div>

      <Drawer open={summaryOpen} onClose={() => setSummaryOpen(false)} title="Order summary">
        <div className="space-y-3">
          <Row label="Subtotal" value={formatMoney(subtotal)} />
          <Row label="Shipping" value={shipping === 0 ? 'Free' : formatMoney(shipping)} />
          <Row label="Tax" value={formatMoney(tax)} />
          <div className="border-t border-border pt-2">
            <Row label="Total" value={formatMoney(total)} strong />
          </div>
          <Button className="w-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
          <button type="button" onClick={() => void handleClear()} className="w-full rounded-md border border-border px-3 py-3 text-sm font-semibold text-ink transition-fast hover:border-ink">
            Clear cart
          </button>
        </div>
      </Drawer>
    </div>
  );
};

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex items-center justify-between gap-3 ${strong ? 'text-base font-semibold text-ink' : 'text-sm text-muted'}`}>
    <span>{label}</span>
    <span className={strong ? 'text-ink' : 'text-ink'}>{value}</span>
  </div>
);

export default CartPage;
