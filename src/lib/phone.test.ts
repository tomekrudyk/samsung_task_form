import { describe, expect, it } from 'vitest'
import {
  buildDialCodeOptions,
  formatPhoneToE164,
  getDialCode,
  parseStoredPhone,
  validatePhoneNumber,
} from './phone'

describe('phone utilities', () => {
  it('returns dial code for supported countries', () => {
    expect(getDialCode('US')).toBe('+1')
    expect(getDialCode('PL')).toBe('+48')
  })

  it('validates US phone numbers', () => {
    expect(validatePhoneNumber('2025550123', 'US')).toBe(true)
    expect(validatePhoneNumber('123', 'US')).toBe(false)
  })

  it('validates PL phone numbers', () => {
    expect(validatePhoneNumber('512345678', 'PL')).toBe(true)
    expect(validatePhoneNumber('12345', 'PL')).toBe(false)
  })

  it('formats phone numbers to E.164', () => {
    expect(formatPhoneToE164('2025550123', 'US')).toBe('+12025550123')
    expect(formatPhoneToE164('512345678', 'PL')).toBe('+48512345678')
  })

  it('parses stored E.164 numbers', () => {
    expect(parseStoredPhone('+12025550123')).toEqual({
      phoneCountryCode: 'US',
      phone: '2025550123',
    })
  })

  it('builds dial code options from countries', () => {
    const options = buildDialCodeOptions([
      { code: 'US', name: 'United States' },
      { code: 'PL', name: 'Poland' },
    ])

    expect(options).toEqual([
      { value: 'US', label: '+1 United States', dialCode: '+1' },
      { value: 'PL', label: '+48 Poland', dialCode: '+48' },
    ])
  })
})
