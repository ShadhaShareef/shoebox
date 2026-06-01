import { useState } from 'react';
import type { Product } from '../../types';

type ProductGalleryProps = {
  product: Product;
};

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [active, setActive] = useState(product.image_url);
  const thumbnails = [
    product.image_url,
    `${product.image_url}&auto=format&fit=crop&w=850&q=80`,
    `${product.image_url}&auto=format&fit=crop&w=900&q=80`,
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100">
        <img src={active} alt={product.name} className="w-full object-cover" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {thumbnails.map((src) => (
          <button key={src} type="button" onClick={() => setActive(src)} className={`overflow-hidden rounded-3xl border p-1 transition ${active === src ? 'border-brand-500' : 'border-neutral-200 hover:border-neutral-300'}`}>
            <img src={src} alt="Product thumbnail" className="h-24 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
