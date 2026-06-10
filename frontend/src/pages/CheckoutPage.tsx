import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { fetchAccount, fetchAddresses, fetchCart, placeOrder } from '../lib/api';
import { deliveryMethods, paymentMethods } from '../lib/retail';
import { formatMoney } from '../lib/format';
import type { Address } from '../types';

type CheckoutForm = {
  firstName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

const defaultForm: CheckoutForm = {
  firstName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<CheckoutForm>(defaultForm);
  const [deliveryMethod, setDeliveryMethod] = useState<'home_delivery' | 'store_pickup' | 'express_delivery'>(
    (searchParams.get('delivery') as 'home_delivery' | 'store_pickup' | 'express_delivery') ?? 'home_delivery'
  );
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('upi');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [cart, account, addressResponse] = await Promise.all([fetchCart(), fetchAccount(), fetchAddresses()]);
        if (!active) return;
        setSubtotal(cart.subtotal);
        setShipping(cart.shipping);
        setTax(cart.tax);
        setTotal(cart.total);
        setAddresses(addressResponse.addresses);
        setForm((current) => ({
          ...current,
          firstName: account.user.firstName ?? current.firstName,
          phone: account.user.phone ?? current.phone,
        }));
        const defaultAddress = addressResponse.addresses.find((address) => address.isDefault) ?? addressResponse.addresses[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          fillAddress(defaultAddress);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const fillAddress = (address: Address) => {
    setForm((current) => ({
      ...current,
      phone: address.phone ?? current.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      pincode: address.pincode ?? '',
    }));
  };

  const cartLabel = useMemo(() => formatMoney(total), [total]);

  const handleChange = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.addressLine1.trim()) next.addressLine1 = 'Address line 1 is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.state.trim()) next.state = 'State is required';
    if (!form.pincode.trim()) next.pincode = 'Pincode is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await placeOrder({
        firstName: form.firstName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        deliveryMethod,
        paymentMethod,
      });
      window.dispatchEvent(new Event('cart:updated'));
      navigate(`/order-success/${response.orderId}`, {
        state: { total: response.total, deliveryMethod },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="surface p-6 text-sm text-muted">Loading checkout...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Checkout"
        title="Seal the box"
        subtitle="Delivery details, delivery method, payment method, and order summary stay on one page."
        action={<Badge variant="neutral">{cartLabel}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="surface p-4 space-y-4">
            <h2 className="text-sm font-semibold text-ink">Delivery details</h2>
            {addresses.length ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Saved address</label>
                <Select
                  value={selectedAddressId}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === 'new') {
                      setSelectedAddressId('new');
                      return;
                    }
                    const address = addresses.find((item) => item.id === Number(value));
                    if (address) {
                      setSelectedAddressId(address.id);
                      fillAddress(address);
                    }
                  }}
                >
                  <option value="new">Enter a new address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label ?? `Address ${address.id}`} {address.isDefault ? '(default)' : ''}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName}>
                <Input value={form.firstName} onChange={(event) => handleChange('firstName', event.target.value)} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <Input value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} />
              </Field>
              <Field label="Address line 1" error={errors.addressLine1} className="sm:col-span-2">
                <Input value={form.addressLine1} onChange={(event) => handleChange('addressLine1', event.target.value)} />
              </Field>
              <Field label="Address line 2">
                <Input value={form.addressLine2} onChange={(event) => handleChange('addressLine2', event.target.value)} />
              </Field>
              <Field label="City" error={errors.city}>
                <Input value={form.city} onChange={(event) => handleChange('city', event.target.value)} />
              </Field>
              <Field label="State" error={errors.state}>
                <Input value={form.state} onChange={(event) => handleChange('state', event.target.value)} />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <Input value={form.pincode} onChange={(event) => handleChange('pincode', event.target.value)} />
              </Field>
            </div>
          </section>

          <section className="surface p-4 space-y-4">
            <h2 className="text-sm font-semibold text-ink">Delivery method</h2>
            <div className="grid gap-3">
              {deliveryMethods.map((method) => (
                <label key={method.value} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-fast ${deliveryMethod === method.value ? 'border-ink bg-paper' : 'border-border bg-white'}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={method.value}
                    checked={deliveryMethod === method.value}
                    onChange={() => setDeliveryMethod(method.value)}
                    className="mt-1 h-4 w-4 border-border text-ink focus:ring-ink/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink">{method.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{method.detail}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="surface p-4 space-y-4">
            <h2 className="text-sm font-semibold text-ink">Payment method</h2>
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <label key={method.value} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-fast ${paymentMethod === method.value ? 'border-ink bg-paper' : 'border-border bg-white'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="mt-1 h-4 w-4 border-border text-ink focus:ring-ink/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-ink">{method.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{method.detail}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="sticky top-24 hidden h-fit lg:block">
          <div className="surface p-4">
            <h2 className="text-sm font-semibold text-ink">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatMoney(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? 'Free' : formatMoney(shipping)} />
              <Row label="Tax" value={formatMoney(tax)} />
              <div className="border-t border-border pt-2">
                <Row label="Total" value={formatMoney(total)} strong />
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => void submit()} disabled={submitting}>
              Place order
            </Button>
            <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">Fast submission flow</p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-20 z-30 border-t border-border bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Total</p>
            <p className="text-base font-semibold text-ink">{formatMoney(total)}</p>
          </div>
          <Button onClick={() => void submit()} disabled={submitting}>
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, error, className = '', children }: { label: string; error?: string; className?: string; children: ReactNode }) => (
  <label className={`block space-y-2 ${className}`}>
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
    {children}
    {error ? <span className="block text-xs font-semibold text-[#b45309]">{error}</span> : null}
  </label>
);

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex items-center justify-between gap-3 ${strong ? 'text-base font-semibold text-ink' : 'text-sm text-muted'}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default CheckoutPage;
