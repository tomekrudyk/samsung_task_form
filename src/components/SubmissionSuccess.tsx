import { Button } from './ui/Button'

interface SubmissionSuccessProps {
  onReset: () => void
}

export function SubmissionSuccess({ onReset }: SubmissionSuccessProps) {
  return (
    <div className="space-y-6 text-center" data-testid="submission-success">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50"
        aria-hidden="true"
      >
        <span className="text-2xl">✓</span>
      </div>

      <div aria-live="polite" aria-atomic="true">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Enquiry submitted successfully
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
      </div>

      <Button type="button" variant="secondary" onClick={onReset}>
        Submit another enquiry
      </Button>
    </div>
  )
}
