import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useFormWizard } from '../../context/FormWizardContext'
import { useCountries } from '../../hooks/useCountries'
import {
  buildDialCodeOptions,
  DEFAULT_PHONE_COUNTRY,
  formatPhoneToE164,
  parseStoredPhone,
} from '../../lib/phone'
import { step1Schema, type Step1FormValues } from '../../lib/schemas'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { PhoneInput } from '../ui/PhoneInput'
import { Select } from '../ui/Select'

export function Step1PersonalInfo() {
  const { formData, setFormData, nextStep } = useFormWizard()
  const { countries, isLoading, error: countriesError, isFallback } = useCountries()

  const parsedPhone = useMemo(
    () =>
      parseStoredPhone(
        formData.phone,
        formData.phoneCountryCode || formData.country || DEFAULT_PHONE_COUNTRY
      ),
    [formData.phone, formData.phoneCountryCode, formData.country]
  )

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneCountryCode: formData.phoneCountryCode || parsedPhone.phoneCountryCode,
      phone: parsedPhone.phone,
      dateOfBirth: formData.dateOfBirth,
      country: formData.country,
    },
    mode: 'onBlur',
  })

  const selectedCountry = watch('country')
  const phoneValue = watch('phone')

  useEffect(() => {
    if (selectedCountry && !phoneValue) {
      setValue('phoneCountryCode', selectedCountry, { shouldValidate: false })
    }
  }, [selectedCountry, phoneValue, setValue])

  const onSubmit = (data: Step1FormValues) => {
    const e164 = formatPhoneToE164(data.phone, data.phoneCountryCode)
    if (!e164) return

    setFormData({
      ...data,
      phone: e164,
      phoneCountryCode: data.phoneCountryCode,
    })
    nextStep()
  }

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }))
  const dialCodeOptions = buildDialCodeOptions(countries)
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

      <Controller
        name="phoneCountryCode"
        control={control}
        render={({ field: dialCodeField }) => (
          <Controller
            name="phone"
            control={control}
            render={({ field: phoneField }) => (
              <PhoneInput
                id="phone"
                dialCodeId="phoneCountryCode"
                required
                helperText="Select your country code and enter your local number."
                error={errors.phone?.message ?? errors.phoneCountryCode?.message}
                dialCodeOptions={dialCodeOptions}
                dialCodeProps={{
                  ...dialCodeField,
                  disabled: isLoading || dialCodeField.disabled,
                }}
                phoneProps={{
                  ...phoneField,
                  value: phoneField.value ?? '',
                }}
              />
            )}
          />
        )}
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
