import { useEffect, useState, type ReactNode } from 'react';
import AccountLayout from '../components/layout/AccountLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchAccount, updateAccount } from '../lib/api';
import type { UserProfile } from '../types';

const AccountProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetchAccount()
      .then((response) => {
        if (!active) return;
        setProfile(response.user);
        setForm({
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          phone: response.user.phone ?? '',
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await updateAccount(form);
      setProfile(response.user);
      setMessage('Profile updated.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout title="Profile" subtitle="Update the account identity attached to checkout and order history.">
      {loading ? (
        <div className="surface p-6 text-sm text-muted">Loading profile...</div>
      ) : (
        <div className="surface p-4 space-y-4">
          {message ? <div className="rounded-md border border-border bg-paper px-3 py-2 text-sm font-semibold text-ink">{message}</div> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="First name">
              <Input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} />
            </Field>
            <Field label="Last name">
              <Input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} />
            </Field>
            <Field label="Phone" className="sm:col-span-2">
              <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </Field>
          </div>
          <Button onClick={() => void save()} disabled={saving}>
            Save changes
          </Button>
        </div>
      )}
    </AccountLayout>
  );
};

const Field = ({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) => (
  <label className={`block space-y-2 ${className}`}>
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
    {children}
  </label>
);

export default AccountProfilePage;
