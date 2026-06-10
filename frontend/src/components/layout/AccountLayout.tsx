import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Container from './Container';

const links = [
  { label: 'Dashboard', to: '/account/dashboard' },
  { label: 'Profile', to: '/account/profile' },
  { label: 'Addresses', to: '/account/addresses' },
  { label: 'Orders', to: '/account/orders' },
  { label: 'Wishlist', to: '/wishlist' },
];

type AccountLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const AccountLayout = ({ title, subtitle, children }: AccountLayoutProps) => {
  return (
    <Container className="py-6 sm:py-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="surface h-fit p-4">
          <p className="px-1 pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Account</p>
          <nav className="grid gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-semibold transition-fast ${
                    isActive ? 'bg-ink text-white' : 'text-ink hover:bg-paper'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="space-y-4">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Account area</p>
            <h1 className="text-2xl font-semibold text-ink">{title}</h1>
            {subtitle ? <p className="max-w-2xl text-sm leading-6 text-muted">{subtitle}</p> : null}
          </header>
          {children}
        </section>
      </div>
    </Container>
  );
};

export default AccountLayout;
