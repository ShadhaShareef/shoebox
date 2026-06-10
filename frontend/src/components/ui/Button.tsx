import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

const variantStyles = {
  primary: 'bg-ink text-white hover:bg-black focus-visible:ring-ink',
  secondary: 'bg-white text-ink hover:border-ink hover:bg-white focus-visible:ring-ink border border-border',
  outline: 'border border-border bg-transparent text-ink hover:bg-white focus-visible:ring-ink',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-sm',
};

const Button = ({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
};

export default Button;
