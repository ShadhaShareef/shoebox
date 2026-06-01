import { Link } from 'react-router-dom';
import type { Category } from '../../types';

type CategoryCardProps = {
  category: Category;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/shop/${encodeURIComponent(category.slug)}`} className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
      <div className="relative h-52 overflow-hidden bg-neutral-100">
        <img src={category.image_url} alt={category.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/10 to-transparent" />
      </div>
      <div className="space-y-2 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Category</p>
        <h3 className="text-xl font-semibold text-neutral-900">{category.name}</h3>
        <p className="text-sm text-neutral-600">{category.description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
