import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { fetchCart } from '../../lib/api';

const navItems = [
  { label: 'Shop', to: '/shop' },
  { label: 'Brands', to: '/brands' },
  { label: 'Stores', to: '/stores' },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetchCart().then((res) => {
      if (!mounted) return;
      const count = res.items ? res.items.reduce((s: number, it: any) => s + (it.quantity || 0), 0) : 0;
      setCartCount(count);
    }).catch(() => {});

    const handler = () => {
      fetchCart().then((res) => {
        const count = res.items ? res.items.reduce((s: number, it: any) => s + (it.quantity || 0), 0) : 0;
        setCartCount(count);
      }).catch(() => {});
    };
    window.addEventListener('cart:updated', handler as EventListener);
    return () => { mounted = false; window.removeEventListener('cart:updated', handler as EventListener); };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-neutral-900">
          Shoebox
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-brand-700' : 'text-neutral-600 hover:text-neutral-900'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50">
            Sign In
          </Link>
          <Link to="/cart" className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700">
            Cart <Badge variant="sale" className="ml-2">{cartCount}</Badge>
          </Link>
        </div>

        <button type="button" className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3 text-neutral-700 transition hover:bg-neutral-50 md:hidden" onClick={() => setDrawerOpen(true)}>
          Menu
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 px-4 py-5 sm:px-6 md:hidden">
          <div className="h-full overflow-y-auto rounded-3xl bg-white p-6 shadow-lg shadow-black/10">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" className="text-xl font-semibold text-neutral-900">
                Shoebox
              </Link>
              <button type="button" className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700" onClick={() => setDrawerOpen(false)}>
                Close
              </button>
            </div>
            <div className="space-y-4">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className="block rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-base font-semibold text-neutral-900 transition hover:bg-neutral-100" onClick={() => setDrawerOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Button variant="outline" size="lg" className="w-full" onClick={() => { setDrawerOpen(false); navigate('/login'); }}>
                Sign In
              </Button>
              <Button variant="primary" size="lg" className="w-full" onClick={() => { setDrawerOpen(false); navigate('/cart'); }}>
                Cart <Badge variant="sale" className="ml-2">{cartCount}</Badge>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
