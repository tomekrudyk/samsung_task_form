import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useFormWizard } from '../../context/FormWizardContext'
import { useCountries } from '../../hooks/useCountries'
import { step1Schema, type Step1FormValues } from '../../lib/schemas'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

export function Step1PersonalInfo() {
  const { formData, setFormData, nextStep } = useFormWizard()
  const { countries, isLoading, error: countriesError, isFallback } = useCountries()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      country: formData.country,
    },
    mode: 'onBlur',
  })

  const onSubmit = (data: Step1FormValues) => {
    setFormData(data)
    nextStep()
  }

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }))
  const countryHelperText = isFallback
    ? countriesError
    : 'Select your country of residence.'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tell us a bit about yourself to get started.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="firstName"
          label="First name"
          required
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          id="lastName"
          label="Last name"
          required
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        id="email"
        label="Email address"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        helperText="We'll use this to respond to your enquiry."
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="phone"
        label="Phone number"
        type="tel"
        required
        autoComplete="tel"
        inputMode="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        id="dateOfBirth"
        label="Date of birth"
        type="date"
        required
        helperText="You must be at least 18 years old."
        error={errors.dateOfBirth?.message}
        {...register('dateOfBirth')}
      />

      <Select
        id="country"
        label="Country"
        required
        isLoading={isLoading}
        options={countryOptions}
        helperText={countryHelperText ?? undefined}
        error={errors.country?.message}
        {...register('country')}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting || isLoading}>
          Continue
        </Button>
      </div>
    </form>
  )
}
