import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const variants = {
  primary: 'bg-brand-primary text-white hover:opacity-90',
  secondary: 'bg-brand-secondary text-grey-7 hover:opacity-90',
} as const;

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-md px-xs py-3 text-base font-bold transition-opacity ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export default Button;
