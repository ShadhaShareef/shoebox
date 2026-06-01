import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ className = '', children, ...props }: SelectProps) => {
  return (
    <select
      className={`w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-neutral-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
