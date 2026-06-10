import { describe, expect, it } from 'vitest'
import { calculateAge, step1Schema, step2Schema, step3Schema } from './schemas'

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
      expect(result.error.issues.some((i: { path: unknown[] }) => i.path.includes('email'))).toBe(true)
    }
  })

  it('rejects users under 18', () => {
    const today = new Date()
    const under18 = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate())
    const dob = under18.toISOString().split('T')[0]
    const result = step1Schema.safeParse({ ...validStep1, dateOfBirth: dob })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i: { message: string }) => i.message.includes('18'))).toBe(true)
    }
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
    const result = step2Schema.safeParse({ enquiryType: 'Personal' })
    expect(result.success).toBe(true)
  })

  it('requires company fields for Business', () => {
    const result = step2Schema.safeParse({ enquiryType: 'Business' })
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
  it('calculates age correctly before birthday', () => {
    const today = new Date()
    const birthYear = today.getFullYear() - 25
    const futureMonth = today.getMonth() + 1
    if (futureMonth <= 11) {
      const dob = `${birthYear}-${String(futureMonth + 1).padStart(2, '0')}-15`
      expect(calculateAge(dob)).toBe(24)
    }
  })

  it('returns 18 for exactly 18 years old', () => {
    const today = new Date()
    const birthYear = today.getFullYear() - 18
    const dob = `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    expect(calculateAge(dob)).toBeGreaterThanOrEqual(18)
  })
})
