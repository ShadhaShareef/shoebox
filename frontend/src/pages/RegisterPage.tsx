import { useNavigate, Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/account/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="surface p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Create account</p>
          <h1 className="text-2xl font-semibold text-ink">Open your Shoebox account</h1>
        </div>
        {error ? <div className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink">{error}</div> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="First name">
            <Input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} />
          </Field>
          <Field label="Last name">
            <Input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} />
          </Field>
        </div>
        <Field label="Email">
          <Input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
        </Field>
        <Field label="Password">
          <Input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" />
        </Field>
        <Button className="w-full" onClick={() => void submit()} disabled={loading}>
          Create account
        </Button>
        <div className="flex items-center justify-between text-sm">
          <Link to="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
          <Link to="/forgot-password" className="font-semibold text-muted underline-offset-4 hover:underline">
            Forgot password
          </Link>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block space-y-2">
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
    {children}
  </label>
);

export default RegisterPage;
