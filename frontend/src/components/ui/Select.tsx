import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ className = '', children, ...props }: SelectProps) => {
  return (
    <select
      className={`w-full rounded-md border border-border bg-white px-3.5 py-3 pr-10 text-sm text-ink outline-none transition-fast focus:border-ink focus:ring-2 focus:ring-ink/10 disabled:bg-neutral-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
