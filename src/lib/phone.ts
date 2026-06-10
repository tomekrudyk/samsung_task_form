import {
  getCountryCallingCode,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'US'

export function toCountryCode(code: string): CountryCode | null {
  const upper = code.toUpperCase()
  return isSupportedCountry(upper) ? upper : null
}

export function getDialCode(countryCode: string): string | null {
  const country = toCountryCode(countryCode)
  if (!country) return null
  return `+${getCountryCallingCode(country)}`
}

export function validatePhoneNumber(nationalNumber: string, countryCode: string): boolean {
  const country = toCountryCode(countryCode)
  if (!country) return false
  const digits = nationalNumber.trim()
  if (!digits) return false
  return isValidPhoneNumber(digits, country)
}

export function formatPhoneToE164(nationalNumber: string, countryCode: string): string | null {
  const country = toCountryCode(countryCode)
  if (!country) return null

  const parsed = parsePhoneNumberFromString(nationalNumber.trim(), country)
  if (!parsed?.isValid()) return null
  return parsed.format('E.164')
}

export function parseStoredPhone(
  storedPhone: string,
  fallbackCountry: string = DEFAULT_PHONE_COUNTRY
): { phoneCountryCode: string; phone: string } {
  if (!storedPhone) {
    return { phoneCountryCode: fallbackCountry, phone: '' }
  }

  const parsed = parsePhoneNumberFromString(storedPhone)
  if (parsed?.country) {
    return {
      phoneCountryCode: parsed.country,
      phone: parsed.nationalNumber,
    }
  }

  return { phoneCountryCode: fallbackCountry, phone: storedPhone }
}

export function buildDialCodeOptions(
  countries: Array<{ code: string; name: string }>
): Array<{ value: string; label: string; dialCode: string }> {
  return countries
    .map((country) => {
      const dialCode = getDialCode(country.code)
      if (!dialCode) return null
      return {
        value: country.code,
        label: `${dialCode} ${country.name}`,
        dialCode,
      }
    })
    .filter((option): option is { value: string; label: string; dialCode: string } => option !== null)
}
