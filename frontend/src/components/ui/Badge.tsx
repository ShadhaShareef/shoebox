import type { HTMLAttributes } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'sale' | 'new' | 'stock' | 'neutral';
};

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  sale: 'bg-[#fde8e8] text-[#b91c1c]',
  new: 'bg-[#fff7ed] text-[#b45309]',
  stock: 'bg-neutral-100 text-neutral-700',
  neutral: 'bg-neutral-100 text-neutral-700',
};

const Badge = ({ variant = 'neutral', className = '', ...props }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${variantStyles[variant]} ${className}`} {...props} />
  );
};

export default Badge;
