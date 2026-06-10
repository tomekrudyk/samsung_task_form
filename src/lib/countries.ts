import type { Country } from '../types/form'

const COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2'

let cachedCountries: Country[] | null = null
let fetchPromise: Promise<Country[]> | null = null

function mapCountries(data: Array<{ name: { common: string }; cca2: string }>): Country[] {
  return data
    .map((item) => ({
      name: item.name.common,
      code: item.cca2,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchCountries(): Promise<Country[]> {
  if (cachedCountries) {
    return cachedCountries
  }

  if (fetchPromise) {
    return fetchPromise
  }

  fetchPromise = (async () => {
    const response = await fetch(COUNTRIES_URL)
    if (!response.ok) {
      throw new Error('Failed to load countries')
    }
    const data = (await response.json()) as Array<{ name: { common: string }; cca2: string }>
    cachedCountries = mapCountries(data)
    return cachedCountries
  })()

  try {
    return await fetchPromise
  } catch (error) {
    fetchPromise = null
    throw error
  }
}

export function resetCountriesCache(): void {
  cachedCountries = null
  fetchPromise = null
}

export const FALLBACK_COUNTRIES: Country[] = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Australia', code: 'AU' },
  { name: 'Poland', code: 'PL' },
]
