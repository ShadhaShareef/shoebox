import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct, addToCart, fetchReviews, fetchAvailability } from '../lib/api';
import Container from '../components/layout/Container';
import ProductGallery from '../components/product/ProductGallery';
import PriceBlock from '../components/product/PriceBlock';
import SizeSelector from '../components/product/SizeSelector';
import QuantitySelector from '../components/product/QuantitySelector';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import ReviewCard from '../components/cards/ReviewCard';
import ProductCard from '../components/cards/ProductCard';
import type { Product, Review } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState('8');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [modalOpen, setModalOpen] = useState(false);
  const [availabilityStores, setAvailabilityStores] = useState<Array<{ id: number; name: string; stock: number }>>([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const load = async () => {
      try {
        const response = await fetchProduct(id);
        const reviewResponse = await fetchReviews(id);
        setProduct(response.product);
        setRelated(response.related);
        setReviews(reviewResponse.reviews);
        setSelectedSize(response.product.sizes?.[0] ?? '8');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({ product_id: product.id, quantity, size: selectedSize });
      setMessage('Added to your cart');
      window.dispatchEvent(new Event('cart:updated'));
    } catch (error) {
      setMessage('Unable to add to cart. Please try again.');
    }
  };

  useEffect(() => {
    if (!modalOpen || !product) return;
    let mounted = true;
    setAvailLoading(true);
    fetchAvailability(product.id, selectedSize)
      .then((res) => {
        if (!mounted) return;
        setAvailabilityStores(res.stores ?? []);
      })
      .catch(() => setAvailabilityStores([]))
      .finally(() => setAvailLoading(false));
    return () => { mounted = false; };
  }, [modalOpen, product, selectedSize]);

  if (loading) {
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">Loading product...</div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm text-center text-neutral-700">Product not found.</div>
      </Container>
    );
  }

  const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

  return (
    <Container className="pb-20 pt-8 lg:pb-24 lg:pt-12">
      <div className="mb-6">
        <nav className="text-sm text-neutral-500">
          <span className="text-neutral-600">Home</span> · <span className="text-neutral-600">Shop</span> · <span className="text-neutral-900 font-semibold">{product.name}</span>
        </nav>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <main className="space-y-8">
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1fr_420px] items-start">
              <div>
                <ProductGallery product={product} />
              </div>
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-2xl bg-white p-6 shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-semibold text-neutral-900">{product.name}</h1>
                        <p className="text-sm text-neutral-500">{product.brand} · {product.category}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <PriceBlock product={product} />
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-semibold uppercase text-neutral-500">Select size</p>
                        <div className="mt-3">
                          <SizeSelector sizes={product.sizes ?? ['6','7','8','9','10']} value={selectedSize} onChange={setSelectedSize} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase text-neutral-500">Quantity</p>
                        <div className="mt-3">
                          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                        </div>
                      </div>
                      <div className="mt-2 flex gap-3">
                        <Button size="lg" className="flex-1" onClick={handleAddToCart}>Add to cart</Button>
                        <Button variant="outline" size="lg" onClick={() => setModalOpen(true)}>Check availability</Button>
                      </div>
                      <div className="mt-2">
                        <button type="button" className={`text-sm font-medium text-neutral-700`} onClick={() => setWishlisted((c) => !c)}>
                          {wishlisted ? 'Wishlisted' : 'Add to wishlist'}
                        </button>
                      </div>
                      {message && <div className="mt-3 rounded-2xl bg-brand-50 px-3 py-2 text-sm text-brand-800">{message}</div>}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <section className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Product Details</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-900">{product.name}</h2>
                <p className="mt-1 text-sm text-neutral-600">{product.brand} · {product.category}</p>
              </div>
              <div className="text-sm text-neutral-500">{product.rating ?? 4.8} ★ • {product.review_count ?? 54} reviews</div>
            </div>
            <div className="mt-6">
              <Tabs activeId={activeTab} onChange={setActiveTab} tabs={[
                { id: 'description', label: 'Description', content: <p className="text-sm leading-7 text-neutral-600">{product.description}</p> },
                { id: 'specifications', label: 'Specifications', content: (
                  <ul className="space-y-3 text-sm text-neutral-600">{(product.features ?? []).map((f) => <li key={f} className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />{f}</li>)}</ul>
                ) },
                { id: 'reviews', label: 'Reviews', content: (<div className="space-y-4">{reviews.length ? reviews.map((r) => <ReviewCard key={r.id} review={r} />) : <p className="text-sm text-neutral-600">No reviews yet.</p>}</div>) }
              ]} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-neutral-900">Related products</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {related.slice(0, 6).map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        </main>

        <aside className="lg:hidden">
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{product.name}</h2>
                <div className="text-sm text-neutral-500">{product.brand}</div>
              </div>
              <div>
                <PriceBlock product={product} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold uppercase text-neutral-500">Select size</p>
              <div className="mt-2"><SizeSelector sizes={product.sizes ?? ['6','7','8','9','10']} value={selectedSize} onChange={setSelectedSize} /></div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold uppercase text-neutral-500">Quantity</p>
              <div className="mt-2"><QuantitySelector quantity={quantity} setQuantity={setQuantity} /></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" size="lg" onClick={handleAddToCart}>Add to cart</Button>
              <Button variant="outline" onClick={() => setModalOpen(true)}>Check</Button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 block bg-white border-t border-neutral-200 p-3 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
          <div>
            <div className="text-sm text-neutral-600">{product.name}</div>
            <div className="text-base font-semibold text-neutral-900"><PriceBlockInline product={product} /></div>
          </div>
          <div className="w-40">
            <Button size="lg" className="w-full" onClick={handleAddToCart}>Add to cart</Button>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} title="Store availability" onClose={() => setModalOpen(false)}>
        <div className="space-y-4 text-sm text-neutral-700">
          <p>Check real-time stock at nearby stores before you choose pickup.</p>
          {availLoading ? (
            <div>Loading availability...</div>
          ) : (
            <ul className="space-y-4">
              {availabilityStores.length ? availabilityStores.map((s) => (
                <li key={s.id} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-900">{s.name}</p>
                  <p className="mt-2 text-neutral-600">{s.stock > 0 ? `Available — ${s.stock} in stock for size ${selectedSize}` : 'Out of stock for selected size. Explore delivery.'}</p>
                </li>
              )) : (
                <li className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">No store availability information.</li>
              )}
            </ul>
          )}
        </div>
      </Modal>
    </Container>
  );
};

export default ProductDetailPage;
