import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { HeartIcon, BagIcon, StarIcon } from '../ui/icons';
import { formatMoney } from '../../lib/format';

type ProductCardProps = {
  product: Product;
  wishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
};

const ProductCard = ({ product, wishlisted = false, onToggleWishlist, onQuickAdd }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const price = product.sale_price ?? product.price;
  const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

  const handleWishlist = async () => {
    if (!onToggleWishlist) return;
    setIsLoading(true);
    try {
      await onToggleWishlist(product);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="group surface overflow-hidden transition-fast hover:-translate-y-0.5 hover:shadow-level2">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-white">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-fast group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void handleWishlist();
          }}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border transition-fast ${
            wishlisted ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink hover:border-ink'
          }`}
          disabled={isLoading}
        >
          <HeartIcon className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
        {discount > 0 ? <Badge variant="sale" className="absolute left-3 top-3">{discount}% off</Badge> : null}
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{product.brand}</p>
          <Link to={`/product/${product.id}`} className="mt-1 block">
            <h3 className="text-sm font-semibold leading-5 text-ink">{product.name}</h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-ink">
            <StarIcon className="h-3.5 w-3.5 text-accent" />
            <span className="font-semibold">{product.rating?.toFixed(1) ?? '4.8'}</span>
          </div>
          <span className="text-muted">({product.review_count ?? 48})</span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-ink">{formatMoney(price)}</p>
            {product.sale_price ? <p className="text-xs text-muted line-through">{formatMoney(product.price)}</p> : null}
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onQuickAdd?.(product);
            }}
            className="shrink-0 bg-white"
          >
            <BagIcon className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);
