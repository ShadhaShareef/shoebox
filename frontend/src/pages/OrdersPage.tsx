import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';

const OrdersPage = () => {
  return (
    <Container className="pb-16 pt-10">
      <div className="mx-auto max-w-3xl space-y-6 rounded-[32px] border border-neutral-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">My orders</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Order history coming soon</h1>
        <p className="text-sm leading-6 text-neutral-600">We’ll keep your past orders here so you can review them later.</p>
        <Link to="/shop">
          <Button size="lg">Browse more shoes</Button>
        </Link>
      </div>
    </Container>
  );
};

export default OrdersPage;
