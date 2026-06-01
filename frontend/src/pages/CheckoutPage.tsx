import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { CartItem, CartResponse, CheckoutPayload } from '../lib/api';
import { fetchCart, placeOrder } from '../lib/api';
import Container from '../components/layout/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const deliveryOptions = [
  {
    id: 'home_delivery',
    label: 'Home Delivery',
    description: 'Delivered to your address in 3-5 days.',
  },
  {
    id: 'store_pickup',
    label: 'Store Pickup',
    description: 'Reserve and collect from the nearest store.',
  },
  {
    id: 'express_delivery',
    label: 'Express Delivery',
    description: 'Faster delivery within 1-2 days.',
  },
] as const;

const paymentOptions = [
  { id: 'cod', label: 'Cash on Delivery' },
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
] as const;

const CheckoutPage = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CheckoutPayload>({
    firstName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    deliveryMethod: 'home_delivery',
    paymentMethod: 'cod',
  });
  const [validation, setValidation] = useState<Record<string, string>>({});
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

  const shippingAmount = useMemo(() => {
    if (!cart) return 0;
    if (form.deliveryMethod === 'store_pickup') return 0;
    if (form.deliveryMethod === 'express_delivery') return 99;
    return 49;
  }, [cart, form.deliveryMethod]);

  const taxAmount = useMemo(() => {
    if (!cart) return 0;
    return Math.round(cart.subtotal * 0.05);
  }, [cart]);

  const orderTotal = useMemo(() => {
    if (!cart) return 0;
    return cart.subtotal + shippingAmount + taxAmount;
  }, [cart, shippingAmount, taxAmount]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.addressLine1.trim()) next.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (!form.state.trim()) next.state = 'State is required.';
    if (!form.pincode.trim()) next.pincode = 'Pincode is required.';
    setValidation(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart || cart.items.length === 0) {
      setError('Your cart is empty. Add items before placing an order.');
      return;
    }
    if (!validate()) {
      setError('Please fix the errors above before placing your order.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload: CheckoutPayload = {
        firstName: form.firstName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2?.trim() || '',
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        deliveryMethod: form.deliveryMethod,
        paymentMethod: form.paymentMethod,
      };

      const response = await placeOrder(payload);
      window.dispatchEvent(new CustomEvent('cart:updated'));
      navigate(`/order/${response.orderId}`);
    } catch (submissionError: unknown) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">Loading checkout details...</div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm text-center">
          <p className="text-xl font-semibold text-neutral-900">Your cart is empty</p>
          <p className="mt-2 text-sm text-neutral-600">Add items to your cart before you can place an order.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Continue shopping
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 pb-16 pt-8 lg:pb-20 lg:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Complete your order</h1>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Order total</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">₹{orderTotal}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-8 rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Shipping address</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-900">Delivery details</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-neutral-900">First Name</span>
                <Input
                  value={form.firstName}
                  onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                  placeholder="Enter first name"
                />
                {validation.firstName && <p className="text-sm text-red-600">{validation.firstName}</p>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-neutral-900">Phone</span>
                <Input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="Enter phone number"
                />
                {validation.phone && <p className="text-sm text-red-600">{validation.phone}</p>}
              </label>
            </div>
            <div className="mt-4 space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-neutral-900">Address Line 1</span>
                <Input
                  value={form.addressLine1}
                  onChange={(event) => setForm({ ...form, addressLine1: event.target.value })}
                  placeholder="Street address, building, flat"
                />
                {validation.addressLine1 && <p className="text-sm text-red-600">{validation.addressLine1}</p>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-neutral-900">Address Line 2</span>
                <Input
                  value={form.addressLine2}
                  onChange={(event) => setForm({ ...form, addressLine2: event.target.value })}
                  placeholder="Apt, suite, landmark (optional)"
                />
              </label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-neutral-900">City</span>
                <Input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="City" />
                {validation.city && <p className="text-sm text-red-600">{validation.city}</p>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-neutral-900">State</span>
                <Input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} placeholder="State" />
                {validation.state && <p className="text-sm text-red-600">{validation.state}</p>}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-neutral-900">Pincode</span>
                <Input value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} placeholder="Pincode" />
                {validation.pincode && <p className="text-sm text-red-600">{validation.pincode}</p>}
              </label>
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Delivery method</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {deliveryOptions.map((option) => (
                <label key={option.id} className={`relative block cursor-pointer rounded-3xl border p-4 transition ${form.deliveryMethod === option.id ? 'border-brand-600 bg-white shadow-sm' : 'border-neutral-200 bg-white/80 hover:border-neutral-300'}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={form.deliveryMethod === option.id}
                    onChange={() => setForm({ ...form, deliveryMethod: option.id })}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-neutral-900">{option.label}</span>
                  <p className="mt-2 text-sm text-neutral-600">{option.description}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Payment method</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {paymentOptions.map((option) => (
                <label key={option.id} className={`relative block cursor-pointer rounded-3xl border p-4 transition ${form.paymentMethod === option.id ? 'border-brand-600 bg-white shadow-sm' : 'border-neutral-200 bg-white/80 hover:border-neutral-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={form.paymentMethod === option.id}
                    onChange={() => setForm({ ...form, paymentMethod: option.id })}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-neutral-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="space-y-4 rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Order summary</h2>
            <div className="mt-4 space-y-4">
              {cart.items.map((item) => (
                <div key={`${item.product_id}-${item.size ?? 'default'}`} className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-neutral-900">{item.product?.name ?? 'Product'}</p>
                    <p className="text-sm text-neutral-500">Size {item.size ?? 'N/A'} · Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-neutral-900">₹{((item.product?.sale_price ?? item.product?.price ?? 0) * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-neutral-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>₹{shippingAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>₹{taxAmount}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-lg font-semibold text-neutral-900">
              <span>Total</span>
              <span>₹{orderTotal}</span>
            </div>
          </div>

          <Button size="lg" type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Placing order…' : 'Place order'}
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Need help?</h2>
            <p className="mt-3 text-sm text-neutral-600">Our support team is available to assist with shipping, payment, and order status.</p>
            <Link to="/shop" className="mt-4 inline-flex rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50">
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
};

export default CheckoutPage;
