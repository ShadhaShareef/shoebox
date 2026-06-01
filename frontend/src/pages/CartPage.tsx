import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CartResponse } from '../lib/api';
import { fetchCart } from '../lib/api';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';

const CartPage = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchCart();
        setCart(response);
      } catch {
        setCart({ items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const empty = !cart || cart.items.length === 0;

  return (
    <Container className="space-y-8 pb-12 pt-8 lg:pb-16 lg:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Your cart</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Ready to checkout</h1>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Estimated total</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">₹{cart ? cart.total : '0'}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">Loading your cart...</div>
      ) : empty ? (
        <div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm text-center">
          <p className="text-xl font-semibold text-neutral-900">Your cart is empty</p>
          <p className="mt-2 text-sm text-neutral-600">Add a pair to your cart and come back here to checkout.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="space-y-6 rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Items in your cart</h2>
                <p className="text-sm text-neutral-500">Review your selected products before checkout.</p>
              </div>
            </div>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={`${item.product_id}-${item.size ?? 'default'}`} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-neutral-900">{item.product?.name ?? 'Product'}</p>
                      <p className="mt-1 text-sm text-neutral-500">{item.product?.brand ?? ''}</p>
                      {item.size ? <p className="mt-2 text-sm text-neutral-600">Size: {item.size}</p> : null}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Qty {item.quantity}</p>
                      <p className="mt-2 text-lg font-semibold text-neutral-900">₹{((item.product?.sale_price ?? item.product?.price ?? 0) * item.quantity).toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm text-neutral-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart.subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>₹{cart.shipping}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>₹{cart.tax}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5 text-lg font-semibold text-neutral-900">
                <span>Total</span>
                <span>₹{cart.total}</span>
              </div>
              <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/checkout')}>
                Proceed to checkout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
};

export default CartPage;
