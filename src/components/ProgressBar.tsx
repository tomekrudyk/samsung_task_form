import { cn } from '../lib/utils'
import { STEP_TITLES, TOTAL_STEPS } from '../types/form'

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progressPercent = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          {Math.round(progressPercent)}% complete
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Form progress: step ${currentStep} of ${TOTAL_STEPS}`}
        className="relative h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-indigo-600 transition-all duration-250 ease-out dark:bg-indigo-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <ol className="flex gap-2" aria-label="Form steps">
        {STEP_TITLES.map((title, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <li
              key={title}
              className={cn(
                'flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors duration-200',
                isCompleted &&
                  'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300',
                isCurrent &&
                  'border-indigo-500 bg-white text-indigo-700 shadow-sm dark:border-indigo-500 dark:bg-slate-900 dark:text-indigo-300',
                !isCompleted &&
                  !isCurrent &&
                  'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500'
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]',
                  isCompleted && 'bg-indigo-600 text-white dark:bg-indigo-500',
                  isCurrent && 'bg-indigo-600 text-white dark:bg-indigo-500',
                  !isCompleted && !isCurrent && 'bg-slate-200 text-slate-500 dark:bg-slate-700'
                )}
                aria-hidden="true"
              >
                {isCompleted ? '✓' : stepNumber}
              </span>
              <span className="truncate" title={title}>
                <span className="sm:hidden">Step {stepNumber}</span>
                <span className="hidden sm:inline">{title}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
