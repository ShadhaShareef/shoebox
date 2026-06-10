import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCart } from '../../lib/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { BagIcon, HeartIcon, HomeIcon, MenuIcon, SearchIcon, StoreIcon, UserIcon, CloseIcon } from '../ui/icons';

const topLinks = [
  { label: 'Shop', to: '/shop' }
];

const mobileLinks = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Shop', to: '/shop', icon: SearchIcon },
  { label: 'Brands', to: '/brands', icon: StoreIcon },
  { label: 'Stores', to: '/stores', icon: StoreIcon },
  { label: 'Wishlist', to: '/wishlist', icon: HeartIcon },
  { label: 'Account', to: '/account/dashboard', icon: UserIcon },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const title = useMemo(() => {
    if (location.pathname.startsWith('/shop')) return 'Shop';
    if (location.pathname.startsWith('/brands')) return 'Brands';
    if (location.pathname.startsWith('/stores')) return 'Stores';
    if (location.pathname.startsWith('/wishlist')) return 'Wishlist';
    if (location.pathname.startsWith('/cart')) return 'Your Shoebox';
    if (location.pathname.startsWith('/checkout')) return 'Checkout';
    if (location.pathname.startsWith('/account')) return 'Account';
    return 'Shoebox';
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    const sync = async () => {
      try {
        const response = await fetchCart();
        if (!active) return;
        setCartCount(response.items.reduce((sum, item) => sum + item.quantity, 0));
      } catch {
        if (active) setCartCount(0);
      }
    };

    sync();
    const handleUpdate = () => sync();
    window.addEventListener('cart:updated', handleUpdate);
    return () => {
      active = false;
      window.removeEventListener('cart:updated', handleUpdate);
    };
  }, [user?.id]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white shadow-level1">S</span>
            Shoebox
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {topLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-fast ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="hidden flex-1 items-center gap-2 md:flex">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${title.toLowerCase()}`}
                aria-label="Search products"
                className="pl-9"
              />
            </div>
            <Button variant="secondary" type="submit" className="shrink-0 border-border bg-white">
              Search
            </Button>
          </form>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link to="/brands" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink transition-fast hover:border-ink hover:bg-paper">Brands</Link>
            <Link to="/stores" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink transition-fast hover:border-ink hover:bg-paper">Stores</Link>
            <Link to="/wishlist" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink transition-fast hover:border-ink hover:bg-paper">
              Wishlist
            </Link>
            <Link to="/cart" className="relative inline-flex h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition-fast hover:bg-black">
              <BagIcon className="h-4 w-4" />
              Cart
              <span className="inline-flex min-w-6 items-center justify-center rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            </Link>
            {user ? (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink transition-fast hover:border-ink"
                  onClick={() => setAccountOpen((value) => !value)}
                  aria-expanded={accountOpen}
                  aria-label="Open account menu"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-paper text-xs font-bold">{user.first_name.slice(0, 1)}{user.last_name.slice(0, 1)}</span>
                  Account
                </button>
                {accountOpen ? (
                  <div className="absolute right-0 mt-2 w-64 rounded-md border border-border bg-white p-2 shadow-level3">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Signed in as {user.email}</p>
                    <Link to="/account/dashboard" className="block rounded-md px-3 py-2 text-sm text-ink transition-fast hover:bg-paper" onClick={() => setAccountOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/account/orders" className="block rounded-md px-3 py-2 text-sm text-ink transition-fast hover:bg-paper" onClick={() => setAccountOpen(false)}>
                      Orders
                    </Link>
                    <Link to="/account/addresses" className="block rounded-md px-3 py-2 text-sm text-ink transition-fast hover:bg-paper" onClick={() => setAccountOpen(false)}>
                      Addresses
                    </Link>
                    <Link to="/account/profile" className="block rounded-md px-3 py-2 text-sm text-ink transition-fast hover:bg-paper" onClick={() => setAccountOpen(false)}>
                      Profile
                    </Link>
                    <button type="button" onClick={handleLogout} className="mt-1 block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-[#b45309] transition-fast hover:bg-[#fff0ea]">
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-3 text-sm font-semibold text-ink transition-fast hover:border-ink">
                Sign in
              </Link>
            )}
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-white text-ink transition-fast hover:border-ink md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
              Shoebox
            </Link>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white" onClick={() => setMobileOpen(false)}>
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <form onSubmit={submitSearch} className="mb-4">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search shoes"
                  aria-label="Search products"
                  className="pl-9"
                />
              </div>
            </form>
            <div className="grid gap-2">
              {topLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md border px-4 py-3 text-sm font-semibold transition-fast ${isActive ? 'border-ink bg-white text-ink' : 'border-border bg-white text-muted'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="rounded-md border border-ink bg-ink px-4 py-3 text-sm font-semibold text-white">
                Cart ({cartCount})
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/98 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5">
          {mobileLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold ${isActive ? 'text-ink' : 'text-muted'}`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Header;






















