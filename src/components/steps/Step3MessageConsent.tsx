import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useFormWizard } from '../../context/FormWizardContext'
import { step3Schema, type Step3FormValues } from '../../lib/schemas'
import { SubmitFormError, submitContactForm } from '../../lib/submitForm'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const TERMS_URL = import.meta.env.VITE_TERMS_URL ?? '#terms'
const PRIVACY_URL = import.meta.env.VITE_PRIVACY_URL ?? '#privacy'

export function Step3MessageConsent() {
  const { formData, setFormData, prevStep, setSubmitted } = useFormWizard()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      subject: formData.subject,
      message: formData.message,
      terms: formData.terms,
    },
    mode: 'onChange',
  })

  const message = useWatch({ control, name: 'message' }) ?? ''
  const messageLength = message.length
  const isNearLimit = messageLength >= 450
  const isOverLimit = messageLength > 500

  const onSubmit = async (data: Step3FormValues) => {
    setSubmitError(null)
    const payload = { ...formData, ...data }

    try {
      await submitContactForm(payload)
      setFormData(data)
      setSubmitted(true)
    } catch (error: unknown) {
      const message =
        error instanceof SubmitFormError
          ? error.message
          : 'Something went wrong. Please try again.'
      setSubmitError(message)
    }
  }

  const handleBack = () => {
    const values = getValues()
    setFormData(values)
    prevStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Message & Consent
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Share your message and confirm your consent to proceed.
        </p>
      </div>

      <Input
        id="subject"
        label="Subject"
        required
        error={errors.subject?.message}
        {...register('subject')}
      />

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Message
          <span className="ml-0.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="message"
          rows={5}
          autoComplete="off"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby="message-counter message-error"
          className={cn(
            'w-full resize-y rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900',
            'transition-colors duration-200 placeholder:text-slate-400',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
            errors.message || isOverLimit
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200'
          )}
          {...register('message')}
        />
        <div className="flex items-center justify-between">
          <p
            id="message-counter"
            className={cn(
              'text-xs',
              isNearLimit && !isOverLimit && 'text-amber-600 dark:text-amber-400',
              isOverLimit && 'text-red-600 dark:text-red-400',
              !isNearLimit && 'text-slate-500 dark:text-slate-400'
            )}
          >
            {isNearLimit && !isOverLimit && 'Approaching character limit — '}
            {messageLength}/500 characters
          </p>
        </div>
        {errors.message && (
          <p id="message-error" className="text-xs text-red-600 dark:text-red-400" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
          <input
            type="checkbox"
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? 'terms-error' : 'terms-description'}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            {...register('terms')}
          />
          <span id="terms-description" className="text-sm text-slate-600 dark:text-slate-300">
            I agree to the{' '}
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
            >
              terms and conditions
            </a>{' '}
            and{' '}
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
            >
              privacy policy
            </a>
            .
          </span>
        </label>
        {errors.terms && (
          <p id="terms-error" className="text-xs text-red-600 dark:text-red-400" role="alert">
            {errors.terms.message}
          </p>
        )}
      </div>

      {submitError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="secondary" onClick={handleBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting || !isValid} aria-busy={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit enquiry'}
        </Button>
      </div>
    </form>
  )
}
