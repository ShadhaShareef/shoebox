import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Product } from '../../types';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-neutral-100">
        <img src={product.image_url} alt={product.name} className="h-72 w-full object-cover transition duration-300 group-hover:scale-105" />
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">{product.brand}</p>
            <h3 className="mt-2 text-base font-semibold text-neutral-900">{product.name}</h3>
          </div>
          {discount > 0 ? <Badge variant="sale">-{discount}%</Badge> : null}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-lg font-semibold text-neutral-900">₹{product.sale_price ?? product.price}</p>
          {product.sale_price ? <span className="text-sm text-neutral-500 line-through">₹{product.price}</span> : null}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">View details</Button>
          <Link to={`/product/${product.id}`} className="rounded-xl bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200">
            Buy
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
