import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface PhoneInputProps {
  id: string
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  dialCodeId: string
  dialCodeOptions: Array<{ value: string; label: string }>
  dialCodeProps: SelectHTMLAttributes<HTMLSelectElement>
  phoneProps: InputHTMLAttributes<HTMLInputElement>
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      id,
      label = 'Phone number',
      required,
      helperText,
      error,
      dialCodeId,
      dialCodeOptions,
      dialCodeProps,
      phoneProps,
    },
    ref
  ) => {
    const helperId = helperText ? `${id}-helper` : undefined
    const errorId = error ? `${id}-error` : undefined
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <fieldset className="space-y-2">
        <legend className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {required && (
            <span className="ml-0.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true">
              *
            </span>
          )}
        </legend>

        <div className="flex gap-2">
          <div className="w-[9.5rem] shrink-0 sm:w-44">
            <label htmlFor={dialCodeId} className="sr-only">
              Country calling code
            </label>
            <div className="relative">
              <select
                id={dialCodeId}
                aria-label="Country calling code"
                aria-invalid={error ? true : undefined}
                className={cn(
                  'w-full appearance-none rounded-xl border bg-white px-3 py-2.5 pr-8 text-sm text-slate-900',
                  'transition-colors duration-200',
                  'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
                  'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200'
                )}
                {...dialCodeProps}
              >
                {dialCodeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400"
                aria-hidden="true"
              >
                ▾
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <label htmlFor={id} className="sr-only">
              Phone number
            </label>
            <input
              ref={ref}
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              required={required}
              placeholder="555 123 4567"
              className={cn(
                'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900',
                'transition-colors duration-200 placeholder:text-slate-400',
                'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
                'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200'
              )}
              {...phoneProps}
            />
          </div>
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
      </fieldset>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
