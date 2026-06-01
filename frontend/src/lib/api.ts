import type { Brand, Category, Product, Review, Store } from '../types';

export type CartProduct = {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  brand: string;
  category: string;
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

const requestJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
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
    throw new Error('Unable to add to cart.');
  }
  return response.json();
};

export const fetchCart = () => requestJson<CartResponse>(`/api/cart.php`);

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
