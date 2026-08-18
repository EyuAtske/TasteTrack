import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
  disabled,
  ...props
}) {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-medium rounded-lg',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-xl',
    lg: 'px-6 py-3.5 text-base font-semibold rounded-xl',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-sm hover:shadow active:scale-[0.99]',
    secondary:
      'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm active:scale-[0.99]',
    outline:
      'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-neutral-400 active:scale-[0.99]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}