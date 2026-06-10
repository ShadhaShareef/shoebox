import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      className={`w-full rounded-md border border-border bg-white px-3.5 py-3 text-sm text-ink outline-none transition-fast placeholder:text-muted/70 focus:border-ink focus:ring-2 focus:ring-ink/10 disabled:bg-neutral-100 ${className}`}
      {...props}
    />
  );
};

export default Input;
