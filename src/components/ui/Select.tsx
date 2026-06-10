import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  helperText?: string
  id: string
  placeholder?: string
  options: Array<{ value: string; label: string }>
  isLoading?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      placeholder = 'Select an option',
      options,
      isLoading,
      required,
      ...props
    },
    ref
  ) => {
    const helperId = helperText ? `${id}-helper` : undefined
    const errorId = error ? `${id}-error` : undefined
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-busy={isLoading || undefined}
            required={required}
            disabled={isLoading || props.disabled}
            className={cn(
              'w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-slate-900',
              'transition-colors duration-200',
              'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
              'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200',
              isLoading && 'animate-pulse text-transparent',
              className
            )}
            {...props}
          >
            <option value="">{isLoading ? 'Loading countries…' : placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400"
            aria-hidden="true"
          >
            ▾
          </span>
        </div>
        {helperText && (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
