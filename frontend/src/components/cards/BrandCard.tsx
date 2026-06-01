import { Link } from 'react-router-dom';
import type { Brand } from '../../types';

type BrandCardProps = {
  brand: Brand;
};

const BrandCard = ({ brand }: BrandCardProps) => {
  return (
    <Link to={`/brand/${encodeURIComponent(brand.slug)}`} className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
      <div className="flex h-32 items-center justify-between gap-4 px-6">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{brand.name}</p>
          <p className="mt-2 text-sm text-neutral-500">{brand.description}</p>
        </div>
        <img src={brand.logo_url} alt={brand.name} className="h-14 w-auto object-contain" />
      </div>
    </Link>
  );
};

export default BrandCard;
