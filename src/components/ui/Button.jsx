import { motion } from 'framer-motion';
import { buttonTapVariants } from '@/lib/motion';

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50',
    secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200 active:bg-stone-300 disabled:opacity-50',
    ghost: 'bg-transparent text-stone-700 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-50',
    outline: 'border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      variants={buttonTapVariants}
      whileTap={!isDisabled ? 'tap' : undefined}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
