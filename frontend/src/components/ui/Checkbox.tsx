import type { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

const Checkbox = ({ className = '', ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={`h-5 w-5 rounded-lg border border-neutral-300 text-brand-600 focus:ring-brand-400 ${className}`}
      {...props}
    />
  );
};

export default Checkbox;
