export const brandStory = {
  headline: 'Shoes that move as fast as the cart',
  subhead: 'A focused retail system for browsing, reserving, and buying footwear without friction.',
};

export const collections = [
  { label: 'Running', slug: 'running' },
  { label: 'Lifestyle', slug: 'lifestyle' },
  { label: 'Training', slug: 'training' },
  { label: 'Court', slug: 'court' },
  { label: 'Sandals', slug: 'sandals' },
];

export const sortOptions = [
  { label: 'Best match', value: 'best' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export const deliveryMethods = [
  { value: 'home_delivery', label: 'Home delivery', detail: 'Delivered to your address in the usual 3-5 day window.' },
  { value: 'store_pickup', label: 'Store pickup', detail: 'Reserve in store and collect when ready.' },
  { value: 'express_delivery', label: 'Express delivery', detail: 'Priority handling for the fastest doorstep handoff.' },
] as const;

export const paymentMethods = [
  { value: 'upi', label: 'UPI', detail: 'Fast, low-friction payment.' },
  { value: 'card', label: 'Card', detail: 'Debit or credit card checkout.' },
  { value: 'cod', label: 'Cash on delivery', detail: 'Pay when the box lands.' },
] as const;

export const storeCities = ['Thrissur', 'Kochi', 'Kozhikode'] as const;

export const cityCoords: Record<string, { lat: number; lng: number }> = {
  Thrissur: { lat: 10.5276, lng: 76.2144 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Kozhikode: { lat: 11.2588, lng: 75.7804 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
};

export const categoryCopy: Record<string, string> = {
  running: 'Responsive cushioning and secure lockdown for daily distance work.',
  lifestyle: 'Everyday silhouettes with clean lines and repeat wear comfort.',
  training: 'Stable, structured pairs for gym and mixed sessions.',
  court: 'Grip, lateral support, and court-ready control.',
  sandals: 'Easy-on options for warm-weather comfort and quick exits.',
};

export const ratingLabel = (rating: number) => `${rating.toFixed(1)} / 5`;

export const estimateDeliveryDate = (days = 3) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
