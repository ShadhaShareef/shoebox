export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  brand: string;
  category: string;
  created_at: string;
  image_url: string;
  rating?: number;
  review_count?: number;
  badges?: string[];
  sizes?: string[];
  colors?: string[];
  features?: string[];
};

export type Brand = {
  slug: string;
  name: string;
  logo_url: string;
  description: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image_url: string;
};

export type Store = {
  id: number;
  name: string;
  address: string;
  city: string;
  distance: string;
  hours: string;
  availability: string;
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  headline: string;
  body: string;
  created_at: string;
};
