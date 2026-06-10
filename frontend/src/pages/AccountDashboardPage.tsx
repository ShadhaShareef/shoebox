import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/layout/AccountLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { fetchAccount, fetchAccountOrders } from '../lib/api';
import { formatMoney, formatDate } from '../lib/format';
import type { Address, OrderSummary } from '../types';

const AccountDashboardPage = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [account, orderResponse] = await Promise.all([fetchAccount(), fetchAccountOrders()]);
        if (!active) return;
        setAddresses(account.addresses);
        setOrders(orderResponse.orders);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AccountLayout
      title="Dashboard"
      subtitle="Review order activity, saved addresses, and the shortcuts that keep the account side of the flow fast."
    >
      {loading ? (
        <div className="surface p-6 text-sm text-muted">Loading account...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label="Recent orders" value={String(orders.length)} />
            <Stat label="Saved addresses" value={String(addresses.length)} />
            <Stat label="Open wishlist" value="View" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="surface p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-ink">Recent orders</h2>
                <Link to="/account/orders" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {orders.length ? orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-muted">{formatDate(order.createdAt)} • {order.status}</p>
                    </div>
                    <Badge variant="neutral">{formatMoney(order.totalAmount)}</Badge>
                  </div>
                )) : <p className="text-sm text-muted">No orders yet.</p>}
              </div>
            </div>

            <div className="surface p-4">
              <h2 className="text-sm font-semibold text-ink">Quick links</h2>
              <div className="mt-4 grid gap-2">
                <Link to="/account/profile"><Button variant="outline" className="w-full bg-white">Profile</Button></Link>
                <Link to="/account/addresses"><Button variant="outline" className="w-full bg-white">Addresses</Button></Link>
                <Link to="/wishlist"><Button variant="outline" className="w-full bg-white">Wishlist</Button></Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="surface p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
  </div>
);

export default AccountDashboardPage;
