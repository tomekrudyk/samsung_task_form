import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { calculateAge, step1Schema, step2Schema, step3Schema } from './schemas'
import { submitContactForm, SubmitFormError } from './submitForm'
import type { FormData } from '../types/form'

const validFormData: FormData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '+1 555 123 4567',
  dateOfBirth: '1990-01-15',
  country: 'US',
  enquiryType: 'Personal',
  subject: 'Hello',
  message: 'Test message',
  terms: true,
}

describe('step1Schema', () => {
  const validStep1 = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '+1 555 123 4567',
    dateOfBirth: '1990-01-15',
    country: 'US',
  }

  it('accepts valid personal info', () => {
    expect(step1Schema.safeParse(validStep1).success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = step1Schema.safeParse({ ...validStep1, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true)
    }
  })

  it('rejects users under 18', () => {
    const today = new Date()
    const under18 = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate())
    const dob = `${under18.getFullYear()}-${String(under18.getMonth() + 1).padStart(2, '0')}-${String(under18.getDate()).padStart(2, '0')}`
    const result = step1Schema.safeParse({ ...validStep1, dateOfBirth: dob })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes('18'))).toBe(true)
    }
  })

  it('rejects whitespace-only names', () => {
    const result = step1Schema.safeParse({ ...validStep1, firstName: '   ' })
    expect(result.success).toBe(false)
  })

  it('requires all fields', () => {
    const result = step1Schema.safeParse({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      country: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('step2Schema', () => {
  it('accepts Personal without company fields', () => {
    const result = step2Schema.safeParse({
      enquiryType: 'Personal',
      companyName: '',
      numberOfEmployees: '',
    })
    expect(result.success).toBe(true)
  })

  it('requires company fields for Business', () => {
    const result = step2Schema.safeParse({
      enquiryType: 'Business',
      companyName: '',
      numberOfEmployees: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts Business with company fields', () => {
    const result = step2Schema.safeParse({
      enquiryType: 'Business',
      companyName: 'Acme Inc',
      numberOfEmployees: '50',
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-integer employee count', () => {
    const result = step2Schema.safeParse({
      enquiryType: 'Business',
      companyName: 'Acme Inc',
      numberOfEmployees: '1.5',
    })
    expect(result.success).toBe(false)
  })

  it('requires company fields for Partnership', () => {
    const result = step2Schema.safeParse({
      enquiryType: 'Partnership',
      companyName: '',
      numberOfEmployees: '0',
    })
    expect(result.success).toBe(false)
  })
})

describe('step3Schema', () => {
  it('accepts valid message and terms', () => {
    const result = step3Schema.safeParse({
      subject: 'Hello',
      message: 'This is a test message.',
      terms: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects message over 500 characters', () => {
    const result = step3Schema.safeParse({
      subject: 'Hello',
      message: 'a'.repeat(501),
      terms: true,
    })
    expect(result.success).toBe(false)
  })

  it('requires terms acceptance', () => {
    const result = step3Schema.safeParse({
      subject: 'Hello',
      message: 'Valid message',
      terms: false,
    })
    expect(result.success).toBe(false)
  })
})

describe('calculateAge', () => {
  it('uses local date parsing for YYYY-MM-DD', () => {
    const today = new Date()
    const birthYear = today.getFullYear() - 25
    const dob = `${birthYear}-06-15`
    expect(calculateAge(dob)).toBeGreaterThanOrEqual(24)
  })

  it('returns 18 for exactly 18 years old', () => {
    const today = new Date()
    const birthYear = today.getFullYear() - 18
    const dob = `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    expect(calculateAge(dob)).toBeGreaterThanOrEqual(18)
  })
})

describe('submitContactForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses mock submission when VITE_SUBMIT_URL is unset', async () => {
    await expect(submitContactForm(validFormData)).resolves.toBeUndefined()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('throws SubmitFormError on failed API response', async () => {
    vi.stubEnv('VITE_SUBMIT_URL', 'https://api.example.com/contact')
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }))

    await expect(submitContactForm(validFormData)).rejects.toBeInstanceOf(SubmitFormError)
  })
})
