import { useEffect, useState } from 'react';
import AccountLayout from '../components/layout/AccountLayout';
import Badge from '../components/ui/Badge';
import { fetchAccountOrders } from '../lib/api';
import { formatDate, formatMoney } from '../lib/format';
import type { OrderSummary } from '../types';

const AccountOrdersPage = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchAccountOrders()
      .then((response) => {
        if (!active) return;
        setOrders(response.orders);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AccountLayout title="Orders" subtitle="Review the order history that powers the account dashboard.">
      {loading ? (
        <div className="surface p-6 text-sm text-muted">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="surface p-6 text-sm text-muted">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-muted">{formatDate(order.createdAt)}</p>
                </div>
                <Badge variant="neutral">{order.status}</Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
                <Meta label="Total" value={formatMoney(order.totalAmount)} />
                <Meta label="Items" value={String(order.items)} />
                <Meta label="Payment" value={order.paymentMethod} />
                <Meta label="Delivery" value={order.deliveryMethod} />
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-border px-3 py-3">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
    <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
  </div>
);

export default AccountOrdersPage;
