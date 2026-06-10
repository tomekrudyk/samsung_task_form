import { z } from 'zod'

const ENQUIRY_TYPES = ['Personal', 'Business', 'Partnership', 'Other'] as const

function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

export const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s+\-()]+$/, 'Please enter a valid phone number'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Please enter a valid date',
    })
    .refine((value) => calculateAge(value) >= 18, {
      message: 'You must be at least 18 years old',
    }),
  country: z.string().min(1, 'Please select a country'),
})

export const step2Schema = z
  .object({
    enquiryType: z.enum(ENQUIRY_TYPES),
    companyName: z.string().optional(),
    numberOfEmployees: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const requiresCompany = data.enquiryType === 'Business' || data.enquiryType === 'Partnership'

    if (requiresCompany) {
      if (!data.companyName?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Company name is required',
          path: ['companyName'],
        })
      }
      const employees = data.numberOfEmployees ? Number(data.numberOfEmployees) : NaN
      if (!data.numberOfEmployees?.trim() || Number.isNaN(employees) || employees < 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'Number of employees must be at least 1',
          path: ['numberOfEmployees'],
        })
      }
    }
  })

export const step3Schema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must be 500 characters or less'),
  terms: z
    .boolean()
    .refine((val) => val === true, { message: 'You must accept the terms and conditions' }),
})

export type Step1FormValues = z.infer<typeof step1Schema>
export type Step2FormValues = z.infer<typeof step2Schema>
export type Step3FormValues = z.infer<typeof step3Schema>

export { calculateAge, ENQUIRY_TYPES }
