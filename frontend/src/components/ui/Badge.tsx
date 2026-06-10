import type { HTMLAttributes } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'sale' | 'new' | 'stock' | 'neutral';
};

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  sale: 'bg-[#fff0ea] text-[#c2410c]',
  new: 'bg-[#edf7f1] text-[#166534]',
  stock: 'bg-white text-ink border border-border',
  neutral: 'bg-white text-muted border border-border',
};

const Badge = ({ variant = 'neutral', className = '', ...props }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${variantStyles[variant]} ${className}`} {...props} />
  );
};

export default Badge;
