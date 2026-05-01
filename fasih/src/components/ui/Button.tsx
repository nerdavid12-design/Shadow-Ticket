import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center font-medium rounded-xl transition-colors active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none';

const variants = {
  primary: 'bg-teal text-white hover:bg-teal-dark',
  secondary: 'bg-surface border border-border text-ink hover:bg-bg',
  ghost: 'text-ink-mid hover:text-ink',
} as const;

const sizes = {
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
