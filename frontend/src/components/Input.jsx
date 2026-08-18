import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  error,
  helperText,
  leftIcon,
  isPassword = false,
  className = '',
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const calculatedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={calculatedType}
          className={`w-full text-sm text-neutral-900 bg-white placeholder:text-neutral-400 rounded-xl border transition-all duration-150 outline-none
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${isPassword ? 'pr-11' : 'pr-3.5'}
            py-3
            ${
              error
                ? 'border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20'
                : 'border-neutral-200 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 hover:border-neutral-300'
            }
            ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}