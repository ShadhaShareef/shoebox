import type { Product } from '../../types';

type PriceBlockProps = {
  product: Product;
};

const PriceBlock = ({ product }: PriceBlockProps) => {
  const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Price</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-4xl font-semibold text-neutral-900">₹{product.sale_price ?? product.price}</span>
            {product.sale_price ? <span className="text-sm text-neutral-500 line-through">₹{product.price}</span> : null}
          </div>
        </div>
        {discount > 0 ? <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Save {discount}%</span> : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-neutral-600">Inclusive of all taxes. Choose delivery or store pickup based on your location.</p>
    </div>
  );
};

export default PriceBlock;
