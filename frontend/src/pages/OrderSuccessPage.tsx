import { Link, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <Container className="pb-16 pt-10">
      <div className="mx-auto max-w-3xl space-y-8 rounded-[32px] border border-neutral-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <span className="text-4xl">✓</span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Order confirmed</p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-900">Your order is on its way</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600">Thanks for shopping with Shoebox. We are preparing your order and will let you know once it ships.</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-5 text-left text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Order ID</p>
          <p className="mt-2">{orderId ?? 'N/A'}</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/shop">
            <Button size="lg" className="w-full sm:w-auto">Continue shopping</Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">View orders</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderSuccessPage;
