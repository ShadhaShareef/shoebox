import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import PageHeader from '../components/layout/PageHeader';
import ProductGallery from '../components/product/ProductGallery';
import PriceBlock from '../components/product/PriceBlock';
import QuantitySelector from '../components/product/QuantitySelector';
import SizeSelector from '../components/product/SizeSelector';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { addToCart, fetchAvailability, fetchProduct, fetchReviews, fetchStores, toggleWishlist } from '../lib/api';
import { estimateStoreDistance, nearestStoreCity } from '../lib/geo';
import { formatDistance, formatMoney } from '../lib/format';
import { deliveryMethods, storeCities } from '../lib/retail';
import type { Product, Review, Store } from '../types';
import { BoxIcon, MapPinIcon, ShieldIcon, TruckIcon, HeartIcon, ArrowRightIcon } from '../components/ui/icons';
import { useAuth } from '../context/AuthContext';

type ProductDetailState = {
  product: Product | null;
  related: Product[];
  reviews: Review[];
  stores: Array<{ id: number; name: string; stock: number }>;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState<ProductDetailState>({ product: null, related: [], reviews: [], stores: [] });
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCity, setSelectedCity] = useState('Kochi');
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reserveModalOpen, setReserveModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) return;
      try {
        const [productResponse, reviewsResponse, storesResponse] = await Promise.all([
          fetchProduct(id),
          fetchReviews(id),
          fetchStores(),
        ]);
        if (!active) return;
        setState({
          product: productResponse.product,
          related: productResponse.related,
          reviews: reviewsResponse.reviews,
          stores: storesResponse.stores.map((store) => ({ id: store.id, name: store.name, stock: 0 })),
        });
        setSize(productResponse.product.sizes?.[0] ?? '');

        const availability = await fetchAvailability(productResponse.product.id, productResponse.product.sizes?.[0]);
        if (!active) return;
        setState((current) => ({ ...current, stores: availability.stores }));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const product = state.product;
  const galleryImages = useMemo(() => {
    const images = [product?.image_url, state.related[0]?.image_url, state.related[1]?.image_url].filter(Boolean) as string[];
    return images.length ? images : [''];
  }, [product?.image_url, state.related]);

  const storeRows = useMemo(() => {
    const storeNames = state.stores.length ? state.stores : [];
    return storeNames
      .map((store) => {
        const distance = estimateStoreDistance(selectedCity, store.name);
        return {
          ...store,
          distance,
          city: store.name,
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [selectedCity, state.stores]);

  const nearestStore = nearestStoreCity(selectedCity, storeCities as unknown as string[]);

  const handleWishlist = async () => {
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      await toggleWishlist(product.id);
      setWishlisted((value) => !value);
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = async (proceedToCheckout = false) => {
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      await addToCart({ product_id: product.id, quantity, size: size || product.sizes?.[0] });
      window.dispatchEvent(new Event('cart:updated'));
      if (proceedToCheckout) {
        navigate('/checkout');
      } else {
        navigate('/cart');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReserve = async () => {
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      await addToCart({ product_id: product.id, quantity, size: size || product.sizes?.[0] });
      window.dispatchEvent(new Event('cart:updated'));
      navigate('/checkout?delivery=store_pickup');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="surface p-6 text-sm text-muted">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="surface px-6 py-10 text-center">
        <h1 className="text-lg font-semibold text-ink">Product not found</h1>
        <p className="mt-2 text-sm text-muted">The item may have been removed or is temporarily unavailable.</p>
        <Link to="/shop">
          <Button className="mt-4">Return to shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.brand}</span>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery images={galleryImages} alt={product.name} />

        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{product.brand}</p>
            <h1 className="text-3xl font-semibold text-ink">{product.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1 text-ink">
                <BoxIcon className="h-4 w-4 text-accent" />
                {product.rating?.toFixed(1) ?? '4.8'}
              </span>
              <span>{product.review_count ?? 0} reviews</span>
              <span>•</span>
              <span>In stock in selected stores</span>
            </div>
          </div>

          <PriceBlock price={product.price} salePrice={product.sale_price} rating={product.rating} reviewCount={product.review_count} />

          <div className="space-y-3">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Size</label>
                <button type="button" className="text-xs font-semibold text-ink underline-offset-4 hover:underline" onClick={() => setAvailabilityOpen(true)}>
                  View store availability
                </button>
              </div>
              <SizeSelector sizes={product.sizes ?? []} value={size} onChange={setSize} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted">Quantity</label>
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Stock at {nearestStore.city}</p>
                <p className="mt-2 text-sm font-semibold text-success">
                  {storeRows[0]?.stock > 0 ? `${storeRows[0].stock} pairs ready` : 'Reserve for later pickup'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void handleAddToCart(false)} disabled={saving} className="min-w-[170px]">
              Add to Cart
            </Button>
              <Button variant="outline" onClick={() => void handleAddToCart(true)} disabled={saving} className="bg-white min-w-[150px]">
                Buy Now
              </Button>
            <Button variant="secondary" onClick={handleWishlist} disabled={saving} className={`bg-white ${wishlisted ? 'border-ink' : ''}`}>
              <HeartIcon className="h-4 w-4" />
              {wishlisted ? 'Saved' : 'Wishlist'}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={() => setReserveModalOpen(true)} className="surface px-4 py-3 text-left transition-fast hover:-translate-y-0.5 hover:shadow-level2">
              <MapPinIcon className="h-5 w-5 text-ink" />
              <p className="mt-3 text-sm font-semibold text-ink">Reserve in Store</p>
              <p className="mt-1 text-sm text-muted">{nearestStore.city} is the nearest suggestion.</p>
            </button>
            <div className="surface px-4 py-3">
              <TruckIcon className="h-5 w-5 text-ink" />
              <p className="mt-3 text-sm font-semibold text-ink">Delivery</p>
              <p className="mt-1 text-sm text-muted">Choose home, store pickup, or express.</p>
            </div>
            <div className="surface px-4 py-3">
              <ShieldIcon className="h-5 w-5 text-ink" />
              <p className="mt-3 text-sm font-semibold text-ink">Secure checkout</p>
              <p className="mt-1 text-sm text-muted">Protected route and session cart.</p>
            </div>
          </div>

          <div className="surface p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <ArrowRightIcon className="h-4 w-4 text-accent" />
              Distance-based suggestion
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)} className="max-w-[220px]">
                {['Kochi', 'Thrissur', 'Kozhikode', 'Bengaluru', 'Chennai'].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-muted">
                Based on {selectedCity}, the nearest store is <span className="font-semibold text-ink">{nearestStore.city}</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface p-4">
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {['description', 'specs', 'reviews'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-fast ${
                  activeTab === tab ? 'bg-ink text-white' : 'border border-border bg-white text-ink hover:border-ink'
                }`}
              >
                {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specs' : 'Reviews'}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {activeTab === 'description' ? (
              <div className="space-y-4 text-sm leading-7 text-muted">
                <p>{product.description}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {(product.features ?? []).map((feature) => (
                    <li key={feature} className="surface px-3 py-2 text-ink">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {activeTab === 'specs' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Category', product.category],
                  ['Brand', product.brand],
                  ['Price', formatMoney(product.sale_price ?? product.price)],
                  ['Sizes', product.sizes?.join(', ') ?? 'N/A'],
                  ['Colors', product.colors?.join(', ') ?? 'N/A'],
                  ['Shipping', '3-5 business days'],
                ].map(([label, value]) => (
                  <div key={label} className="surface px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {activeTab === 'reviews' ? (
              <div className="space-y-3">
                {state.reviews.length ? state.reviews.map((review) => (
                  <article key={review.id} className="surface px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">{review.author}</p>
                      <Badge variant="neutral">{review.rating}/5</Badge>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-ink">{review.headline}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{review.body}</p>
                  </article>
                )) : <p className="text-sm text-muted">No reviews yet.</p>}
              </div>
            ) : null}
          </div>
        </div>

        <div className="surface p-4">
          <p className="text-sm font-semibold text-ink">Related pairs</p>
          <div className="mt-4 grid gap-3">
            {state.related.slice(0, 3).map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="flex items-center gap-3 rounded-md border border-border p-2 transition-fast hover:border-ink">
                <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{item.brand}</p>
                  <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-muted">{formatMoney(item.sale_price ?? item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Modal open={availabilityOpen} onClose={() => setAvailabilityOpen(false)} title="Store availability">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)} className="max-w-[220px]">
              {['Kochi', 'Thrissur', 'Kozhikode', 'Bengaluru', 'Chennai'].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
            <p className="text-sm text-muted">Sorted by proximity from {selectedCity}.</p>
          </div>
          <div className="grid gap-3">
            {storeRows.map((store) => (
              <div key={store.id} className="surface px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{store.name}</p>
                    <p className="mt-1 text-sm text-muted">{formatDistance(store.distance)}</p>
                  </div>
                  <Badge variant={store.stock > 0 ? 'stock' : 'neutral'}>{store.stock > 0 ? `${store.stock} in stock` : 'Reserve'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={reserveModalOpen} onClose={() => setReserveModalOpen(false)} title="Reserve in store">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            Pick a store, hold the pair, and finish checkout when you are ready. This is the easiest way to avoid out-of-stock surprises.
          </p>
          <div className="grid gap-3">
            {storeRows.slice(0, 3).map((store) => (
              <div key={store.id} className="surface px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{store.name}</p>
                    <p className="mt-1 text-sm text-muted">{formatDistance(store.distance)} away</p>
                  </div>
                  <Button variant="outline" className="bg-white" onClick={() => {
                    setReserveModalOpen(false);
                    void handleReserve();
                  }}>
                    Reserve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
