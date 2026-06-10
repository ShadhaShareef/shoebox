import type { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

const Checkbox = ({ className = '', ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-border text-ink focus:ring-ink/20 ${className}`}
      {...props}
    />
  );
};

export default Checkbox;
