import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-12',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
