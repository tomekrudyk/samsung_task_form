import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm',
        'dark:border-slate-700 dark:bg-slate-900/90 sm:p-8',
        className
      )}
    >
      {children}
    </div>
  )
}
