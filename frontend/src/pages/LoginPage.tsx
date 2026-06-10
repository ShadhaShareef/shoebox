import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/account/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="surface p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Sign in</p>
          <h1 className="text-2xl font-semibold text-ink">Continue to your account</h1>
        </div>
        {error ? <div className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink">{error}</div> : null}
        <Field label="Email">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </Field>
        <Field label="Password">
          <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
        </Field>
        <Button className="w-full" onClick={() => void submit()} disabled={loading}>
          Sign in
        </Button>
        <div className="flex items-center justify-between text-sm">
          <Link to="/register" className="font-semibold text-ink underline-offset-4 hover:underline">
            Create account
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

export default LoginPage;
