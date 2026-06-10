import { useEffect, useState, type ReactNode } from 'react';
import AccountLayout from '../components/layout/AccountLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { deleteAddress, fetchAddresses, saveAddress, setDefaultAddress } from '../lib/api';
import type { Address } from '../types';

const emptyForm = {
  label: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
};

const AccountAddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    const response = await fetchAddresses();
    setAddresses(response.addresses);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await load();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const submit = async () => {
    setSaving(true);
    try {
      await saveAddress({
        id: editingId ?? undefined,
        label: form.label || undefined,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone || undefined,
      });
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout title="Addresses" subtitle="Save delivery locations and keep checkout moving.">
      {loading ? (
        <div className="surface p-6 text-sm text-muted">Loading addresses...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {addresses.map((address) => (
              <article key={address.id} className="surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{address.label ?? 'Saved address'}</p>
                      {address.isDefault ? <Badge variant="stock">Default</Badge> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                      {address.city}, {address.state} {address.pincode}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="bg-white" onClick={() => {
                      setEditingId(address.id);
                      setForm({
                        label: address.label ?? '',
                        addressLine1: address.addressLine1,
                        addressLine2: address.addressLine2 ?? '',
                        city: address.city ?? '',
                        state: address.state ?? '',
                        pincode: address.pincode ?? '',
                        phone: address.phone ?? '',
                      });
                    }}>
                      Edit
                    </Button>
                    {!address.isDefault ? (
                      <Button variant="outline" className="bg-white" onClick={() => void setDefaultAddress(address.id).then(load)}>
                        Default
                      </Button>
                    ) : null}
                    <Button variant="outline" className="bg-white" onClick={() => void deleteAddress(address.id).then(load)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <form className="surface p-4 space-y-3">
            <h2 className="text-sm font-semibold text-ink">{editingId ? 'Edit address' : 'Add address'}</h2>
            <Field label="Label">
              <Input value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} />
            </Field>
            <Field label="Address line 1">
              <Input value={form.addressLine1} onChange={(event) => setForm((current) => ({ ...current, addressLine1: event.target.value }))} />
            </Field>
            <Field label="Address line 2">
              <Input value={form.addressLine2} onChange={(event) => setForm((current) => ({ ...current, addressLine2: event.target.value }))} />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            </Field>
            <Field label="State">
              <Input value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} />
            </Field>
            <Field label="Pincode">
              <Input value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </Field>
            <Button type="button" onClick={() => void submit()} disabled={saving}>
              {editingId ? 'Update address' : 'Save address'}
            </Button>
          </form>
        </div>
      )}
    </AccountLayout>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block space-y-2">
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
    {children}
  </label>
);

export default AccountAddressesPage;
