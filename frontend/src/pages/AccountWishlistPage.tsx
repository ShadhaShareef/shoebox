import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { fetchWishlist, removeFromWishlist, addToCart } from '../lib/api';
import type { Product } from '../types';

const AccountWishlistPage = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const result = await fetchWishlist();
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId: number) => {
    setActionLoadingId(productId);
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMoveToCart = async (productId: number) => {
    setActionLoadingId(productId);
    try {
      // Add to cart with default quantity 1
      await addToCart({ product_id: productId, quantity: 1 });
      
      // Remove from wishlist
      await removeFromWishlist(productId);
      
      // Filter out from UI
      setItems((prev) => prev.filter((item) => item.id !== productId));
      
      // Trigger header cart count update
      window.dispatchEvent(new Event('cart:updated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move item to cart.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Container className="pb-16 pt-10">
      <div className="space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-50 blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-accent/5 blur-3xl"></div>
          
          <p className="text-sm uppercase tracking-[0.24em] font-semibold text-brand-600">Wishlist</p>
          <h1 className="mt-3 text-3xl font-semibold text-neutral-900 tracking-tight">Your favorite items</h1>
          <p className="mt-2 text-neutral-600">Review your saved premium products and add them directly to your cart.</p>
        </div>

        {error && (
          <div className="rounded-[16px] bg-red-50 px-4 py-3 text-sm text-red-800 font-medium">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          /* Loading skeleton list */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-neutral-100 rounded-2xl w-full"></div>
                <div className="h-4 bg-neutral-100 rounded w-2/3"></div>
                <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
                <div className="h-10 bg-neutral-100 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div className="rounded-[32px] border border-neutral-200 bg-white p-12 shadow-sm text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">❤️</div>
            <p className="text-lg font-bold text-neutral-900">Save your favorite pairs here</p>
            <p className="mt-2 text-sm text-neutral-600">Keep track of premium products you love before sealing the box.</p>
            <Link to="/shop">
              <Button className="mt-6 font-semibold">Explore Catalog</Button>
            </Link>
          </div>
        ) : (
          /* Grid list of wishlist items */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition duration-300 flex flex-col justify-between">
                <div>
                  {/* Image container */}
                  <Link to={`/product/${item.id}`} className="block relative aspect-[4/3] bg-neutral-50 rounded-2xl overflow-hidden group">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition duration-300"
                    />
                    {item.sale_price !== null && (
                      <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                        Sale
                      </span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{item.brand}</p>
                    <Link to={`/product/${item.id}`} className="block mt-1">
                      <h3 className="font-bold text-neutral-900 hover:text-brand-600 transition text-base truncate">
                        {item.name}
                      </h3>
                    </Link>
                    
                    {/* Prices */}
                    <div className="mt-2 flex items-baseline gap-2">
                      {item.sale_price !== null ? (
                        <>
                          <span className="text-base font-bold text-neutral-900">₹{item.sale_price.toFixed(0)}</span>
                          <span className="text-xs text-neutral-400 line-through">₹{item.price.toFixed(0)}</span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-neutral-900">₹{item.price.toFixed(0)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2 border-t border-neutral-100 pt-4">
                  <Button
                    onClick={() => handleMoveToCart(item.id)}
                    className="w-full font-semibold flex items-center justify-center gap-2"
                    disabled={actionLoadingId === item.id}
                  >
                    {actionLoadingId === item.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <span>🛒 Move to Cart</span>
                    )}
                  </Button>
                  
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-full text-center py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    disabled={actionLoadingId === item.id}
                  >
                    Remove item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default AccountWishlistPage;
