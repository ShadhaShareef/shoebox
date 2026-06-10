import Badge from '../ui/Badge';
import { formatMoney } from '../../lib/format';

type PriceBlockProps = {
  price: number;
  salePrice?: number | null;
  rating?: number;
  reviewCount?: number;
};

const PriceBlock = ({ price, salePrice, rating, reviewCount }: PriceBlockProps) => {
  const activePrice = salePrice ?? price;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-2xl font-semibold text-ink">{formatMoney(activePrice)}</p>
        {salePrice ? <p className="text-sm text-muted line-through">{formatMoney(price)}</p> : null}
        {discount > 0 ? <Badge variant="sale">{discount}% off</Badge> : null}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="font-semibold text-ink">{rating?.toFixed(1) ?? '4.8'}</span>
        <span>Rating</span>
        <span>•</span>
        <span>{reviewCount ?? 0} reviews</span>
      </div>
    </div>
  );
};

export default PriceBlock;
