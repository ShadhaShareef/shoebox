import { Link } from 'react-router-dom';
import { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="surface p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Recover access</p>
          <h1 className="text-2xl font-semibold text-ink">Reset your password</h1>
        </div>
        {sent ? (
          <div className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink">If the account exists, a reset link has been sent.</div>
        ) : (
          <>
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Email</span>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </label>
            <Button className="w-full" onClick={() => setSent(true)}>
              Send reset link
            </Button>
          </>
        )}
        <div className="text-sm">
          <Link to="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
