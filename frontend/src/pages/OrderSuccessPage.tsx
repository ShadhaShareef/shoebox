import { Link, useLocation, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { estimateDeliveryDate } from '../lib/retail';
import { formatDate, formatMoney } from '../lib/format';
import { BoxIcon, CheckIcon, ClockIcon, TruckIcon, ArrowRightIcon } from '../components/ui/icons';

const steps = [
  { label: 'Box', icon: BoxIcon },
  { label: 'Packed', icon: CheckIcon },
  { label: 'Shipped', icon: TruckIcon },
  { label: 'Delivered', icon: ClockIcon },
];

const OrderSuccessPage = () => {
  const { orderId = 'SHOEBOX' } = useParams();
  const location = useLocation();
  const state = (location.state as { total?: number; deliveryMethod?: string } | null) ?? null;
  const total = state?.total ?? 0;
  const deliveryDate = estimateDeliveryDate(state?.deliveryMethod === 'express_delivery' ? 2 : 4);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Order success"
        title="Your box is confirmed"
        subtitle="The generic confirmation screen is replaced with a tracking timeline and a clean next action."
        action={<Badge variant="neutral">{orderId}</Badge>}
      />

      <section className="surface p-4">
        <div className="grid gap-3 sm:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = index <= 1;
            return (
              <div key={step.label} className={`rounded-md border p-4 ${active ? 'border-ink bg-paper' : 'border-border bg-white'}`}>
                <Icon className={`h-5 w-5 ${active ? 'text-ink' : 'text-muted'}`} />
                <p className="mt-3 text-sm font-semibold text-ink">{step.label}</p>
                <p className="mt-1 text-xs text-muted">
                  {index === 0 ? 'Order placed' : index === 1 ? 'Packed and ready' : index === 2 ? 'On the way' : 'Final delivery'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="surface p-4">
          <h2 className="text-sm font-semibold text-ink">Tracking details</h2>
          <div className="mt-4 space-y-3">
            <Detail label="Order ID" value={orderId} />
            <Detail label="Estimated delivery" value={formatDate(deliveryDate)} />
            <Detail label="Order total" value={formatMoney(total)} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/account/orders">
              <Button>
                Track Order
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="bg-white">
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Next steps</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            We’ll keep the order visible in your account and update the status as the box moves through the timeline.
          </p>
        </div>
      </section>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-3">
    <span className="text-sm text-muted">{label}</span>
    <span className="text-sm font-semibold text-ink">{value}</span>
  </div>
);

export default OrderSuccessPage;
