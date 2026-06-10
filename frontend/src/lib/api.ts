import type { Address, AccountResponse, OrderSummary, Product, Brand, Category, Review, Store, UserProfile } from '../types';

export type CartProduct = {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  brand: string;
  category: string;
  image_url?: string;
};

export type CartItem = {
  product_id: number;
  size: string | null;
  quantity: number;
  product: CartProduct | null;
};

export type CartResponse = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export interface CheckoutPayload {
  firstName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryMethod: 'home_delivery' | 'store_pickup' | 'express_delivery';
  paymentMethod: 'cod' | 'upi' | 'card';
}

export type PlaceOrderResponse = {
  success: true;
  orderId: string;
  total: number;
};

export type AccountResponse = {
  user: UserProfile;
  addresses: Address[];
};

export type AccountOrdersResponse = {
  orders: OrderSummary[];
};

type AuthResponse = {
  success: true;
  user: UserProfile;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

const requestJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, { credentials: 'include' });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || `Request failed: ${response.status}`);
  }
  return response.json();
};

export const fetchProducts = (params: Record<string, string | number | undefined> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  return requestJson<{ items: Product[]; total: number; page: number; pageSize: number }>(`/api/products.php?${searchParams.toString()}`);
};

export const fetchProduct = (id: string | number) => requestJson<{ product: Product; related: Product[] }>(`/api/product.php?id=${id}`);
export const fetchBrands = () => requestJson<{ brands: Brand[] }>(`/api/brands.php`);
export const fetchCategories = () => requestJson<{ categories: Category[] }>(`/api/categories.php`);
export const fetchStores = () => requestJson<{ stores: Store[] }>(`/api/stores.php`);
export const fetchReviews = (productId: string | number) => requestJson<{ reviews: Review[] }>(`/api/reviews.php?product_id=${productId}`);
export const addToCart = async (payload: { product_id: number; quantity: number; size?: string }) => {
  const response = await fetch('/api/cart.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', ...payload }),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || 'Unable to add to cart.');
  }
  return response.json();
};

export const fetchCart = () => requestJson<CartResponse>(`/api/cart.php`);

export const updateCartItem = async (payload: { product_id: number; quantity: number; size?: string | null }) => {
  const response = await fetch('/api/cart.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', ...payload }),
    credentials: 'include',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || 'Unable to update cart item.');
  }
  return data as CartResponse & { success: true };
};

export const removeCartItem = async (payload: { product_id: number; size?: string | null }) => {
  const response = await fetch('/api/cart.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'remove', ...payload }),
    credentials: 'include',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || 'Unable to remove cart item.');
  }
  return data as CartResponse & { success: true };
};

export const clearCart = async () => {
  const response = await fetch('/api/cart.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'clear' }),
    credentials: 'include',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || 'Unable to clear cart.');
  }
  return data as { success: true };
};

export const fetchAvailability = (product_id: number, size?: string) => {
  const params = new URLSearchParams();
  params.set('product_id', String(product_id));
  if (size) params.set('size', String(size));
  return requestJson<{ stores: Array<{ id: number; name: string; stock: number }> }>(`/api/availability.php?${params.toString()}`);
};

export const placeOrder = async (payload: CheckoutPayload) => {
  const response = await fetch('/api/place-order.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to place order.');
  }

  return data as PlaceOrderResponse;
};

export const fetchAccount = () => requestJson<AccountResponse>('/api/account.php');
export const fetchAccountOrders = () => requestJson<AccountOrdersResponse>('/api/account-orders.php');

export const login = async (payload: LoginPayload) => {
  const response = await fetch('/api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to sign in.');
  }

  return data as AuthResponse;
};

export const register = async (payload: RegisterPayload) => {
  const response = await fetch('/api/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to register.');
  }

  return data as AuthResponse;
};

export const logout = async () => {
  const response = await fetch('/api/logout.php', {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Unable to log out.');
  }
  return response.json();
};

export const fetchWishlist = () => requestJson<{ items: Product[] }>('/api/wishlist.php');

export const toggleWishlist = async (productId: number) => {
  const response = await fetch('/api/wishlist.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'toggle', product_id: productId }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to update wishlist.');
  }
  return data;
};

export const fetchOrders = () => requestJson<AccountOrdersResponse>('/api/account-orders.php');

export const addToWishlist = async (productId: number) => {
  const response = await fetch('/api/wishlist.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', product_id: productId }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to add to wishlist.');
  }
  return data;
};

export const removeFromWishlist = async (productId: number) => {
  const response = await fetch('/api/wishlist.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'remove', product_id: productId }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to remove from wishlist.');
  }
  return data;
};

export const updateAccount = async (payload: { firstName: string; lastName: string; phone?: string }) => {
  const response = await fetch('/api/account.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to update account.');
  }
  return data as { success: true; message: string; user: UserProfile };
};

export const fetchAddresses = () => requestJson<{ addresses: Address[] }>('/api/addresses.php');

export const saveAddress = async (payload: { id?: number; label?: string; addressLine1: string; addressLine2?: string; city: string; state: string; pincode: string; phone?: string; isDefault?: boolean }) => {
  const response = await fetch('/api/addresses.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to save address.');
  }
  return data;
};

export const deleteAddress = async (id: number) => {
  const response = await fetch('/api/addresses.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to delete address.');
  }
  return data;
};

export const setDefaultAddress = async (id: number) => {
  const response = await fetch('/api/addresses.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'set_default', id }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to set default address.');
  }
  return data;
};
