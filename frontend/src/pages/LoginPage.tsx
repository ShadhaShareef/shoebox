import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';

const LoginPage = () => (
  <Container className="pb-16 pt-10">
    <div className="mx-auto max-w-3xl space-y-8 rounded-[32px] border border-neutral-200 bg-white p-12 shadow-sm text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Login</p>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-900">Sign in to your account</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">Access your order history, saved items, and account settings.</p>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-left text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Note</p>
          <p className="mt-2">Authentication is not implemented in this demo, but the route is now consistent with the sitemap.</p>
        </div>
        <Link to="/">
          <Button size="lg" className="w-full sm:w-auto">Return to home</Button>
        </Link>
      </div>
    </div>
  </Container>
);

export default LoginPage;
