import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useFormWizard } from '../../context/FormWizardContext'
import { ENQUIRY_TYPES, step2Schema, type Step2FormValues } from '../../lib/schemas'
import { cn } from '../../lib/utils'
import type { EnquiryType } from '../../types/form'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

function requiresCompanyFields(type: EnquiryType): boolean {
  return type === 'Business' || type === 'Partnership'
}

export function Step2EnquiryType() {
  const { formData, setFormData, nextStep, prevStep } = useFormWizard()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      enquiryType: formData.enquiryType,
      companyName: formData.companyName ?? '',
      numberOfEmployees:
        formData.numberOfEmployees !== undefined ? String(formData.numberOfEmployees) : '',
    },
    mode: 'onBlur',
  })

  const enquiryType = useWatch({ control, name: 'enquiryType' })
  const showCompanyFields = requiresCompanyFields(enquiryType)

  useEffect(() => {
    if (!showCompanyFields) {
      setValue('companyName', '')
      setValue('numberOfEmployees', '')
      clearErrors(['companyName', 'numberOfEmployees'])
    }
  }, [showCompanyFields, setValue, clearErrors])

  const onSubmit = (data: Step2FormValues) => {
    const payload = {
      enquiryType: data.enquiryType,
      ...(requiresCompanyFields(data.enquiryType)
        ? {
            companyName: data.companyName?.trim() ?? '',
            numberOfEmployees: data.numberOfEmployees?.trim()
              ? Number(data.numberOfEmployees)
              : undefined,
          }
        : {
            companyName: '',
            numberOfEmployees: undefined,
          }),
    }
    setFormData(payload)
    nextStep()
  }

  const handleBack = () => {
    const values = getValues()
    setFormData({
      enquiryType: values.enquiryType,
      companyName: values.companyName,
      numberOfEmployees: values.numberOfEmployees
        ? Number(values.numberOfEmployees)
        : undefined,
    })
    prevStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enquiry Type</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          How can we help you today?
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Select enquiry type
          <span className="ml-0.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true">
            *
          </span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ENQUIRY_TYPES.map((type) => (
            <label
              key={type}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200',
                'hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20',
                enquiryType === type
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              )}
            >
              <input
                type="radio"
                value={type}
                className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                {...register('enquiryType')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{type}</span>
            </label>
          ))}
        </div>
        {errors.enquiryType && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {errors.enquiryType.message}
          </p>
        )}
      </fieldset>

      {showCompanyFields && (
        <div
          className="animate-conditional-enter space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50"
          data-testid="company-fields"
        >
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Company details
            <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
              (optional)
            </span>
          </p>
          <Input
            id="companyName"
            label="Company name"
            autoComplete="organization"
            error={errors.companyName?.message}
            {...register('companyName')}
          />
          <Input
            id="numberOfEmployees"
            label="Number of employees"
            type="number"
            min={1}
            inputMode="numeric"
            error={errors.numberOfEmployees?.message}
            {...register('numberOfEmployees')}
          />
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Continue
        </Button>
      </div>
    </form>
  )
}
