import { useTheme } from '../context/ThemeContext'
import { cn } from '../lib/utils'

export function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn(
        'relative inline-flex h-9 w-16 items-center rounded-full border transition-colors duration-200',
        'border-slate-200 bg-slate-100 hover:bg-slate-200',
        'dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700',
        'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        'dark:focus-visible:ring-offset-slate-950'
      )}
    >
      <span
        className={cn(
          'inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white text-sm shadow-sm transition-transform duration-200',
          'dark:bg-slate-200',
          isDark ? 'translate-x-8' : 'translate-x-1'
        )}
        aria-hidden="true"
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
