import { z } from 'zod'
import { validatePhoneNumber } from './phone'

const ENQUIRY_TYPES = ['Personal', 'Business', 'Partnership', 'Other'] as const
const ENQUIRY_TYPE_SET = new Set<string>(ENQUIRY_TYPES)

export function parseLocalDate(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function calculateAge(dateOfBirth: string): number {
  const birth = parseLocalDate(dateOfBirth)
  if (!birth) return 0

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

const trimmedString = (message: string, max = 200) =>
  z.string().trim().min(1, message).max(max, `${message.replace(' is required', '')} is too long`)

export const step1Schema = z.object({
  firstName: trimmedString('First name is required', 100),
  lastName: trimmedString('Last name is required', 100),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .email('Please enter a valid email address'),
  phoneCountryCode: z.string().trim().min(1, 'Country code is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => parseLocalDate(value) !== null, {
      message: 'Please enter a valid date',
    })
    .refine((value) => calculateAge(value) >= 18, {
      message: 'You must be at least 18 years old',
    }),
  country: z.string().trim().min(1, 'Please select a country'),
}).superRefine((data, ctx) => {
  if (!validatePhoneNumber(data.phone, data.phoneCountryCode)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Please enter a valid phone number for the selected country code',
      path: ['phone'],
    })
  }
})

export const step2Schema = z
  .object({
    enquiryType: z.enum(ENQUIRY_TYPES),
    companyName: z.string(),
    numberOfEmployees: z.string(),
  })
  .superRefine((data, ctx) => {
    const requiresCompany = data.enquiryType === 'Business' || data.enquiryType === 'Partnership'

    if (!requiresCompany) return

    if (data.companyName?.trim() && data.companyName.trim().length > 200) {
      ctx.addIssue({
        code: 'custom',
        message: 'Company name is too long',
        path: ['companyName'],
      })
    }

    if (!data.numberOfEmployees?.trim()) return

    const employees = Number(data.numberOfEmployees)
    if (Number.isNaN(employees) || !Number.isInteger(employees) || employees < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Number of employees must be a whole number of at least 1',
        path: ['numberOfEmployees'],
      })
    } else if (employees > 1_000_000) {
      ctx.addIssue({
        code: 'custom',
        message: 'Number of employees is too large',
        path: ['numberOfEmployees'],
      })
    }
  })

export const step3Schema = z.object({
  subject: trimmedString('Subject is required', 200),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(500, 'Message must be 500 characters or less'),
  terms: z
    .boolean()
    .refine((val) => val === true, { message: 'You must accept the terms and conditions' }),
})

export type Step1FormValues = z.infer<typeof step1Schema>
export type Step2FormValues = z.infer<typeof step2Schema>
export type Step3FormValues = z.infer<typeof step3Schema>

export { ENQUIRY_TYPES }

const persistedFormDataSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    phoneCountryCode: z.string().optional(),
    dateOfBirth: z.string().optional(),
    country: z.string().optional(),
    enquiryType: z.string().optional(),
    companyName: z.string().optional(),
    numberOfEmployees: z.number().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    terms: z.boolean().optional(),
  })
  .passthrough()

const persistedStateSchema = z.object({
  currentStep: z.number().int(),
  formData: persistedFormDataSchema.optional(),
})

export function sanitizeEnquiryType(value: unknown): (typeof ENQUIRY_TYPES)[number] {
  if (typeof value === 'string' && ENQUIRY_TYPE_SET.has(value)) {
    return value as (typeof ENQUIRY_TYPES)[number]
  }
  return 'Personal'
}

export function parsePersistedState(raw: string): {
  currentStep: number
  formData: Record<string, unknown>
} | null {
  try {
    const parsed = persistedStateSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return null
    return {
      currentStep: parsed.data.currentStep,
      formData: parsed.data.formData ?? {},
    }
  } catch {
    return null
  }
}
