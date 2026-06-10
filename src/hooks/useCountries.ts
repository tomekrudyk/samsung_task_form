import { useEffect, useState } from 'react'
import { FALLBACK_COUNTRIES, fetchCountries } from '../lib/countries'
import type { Country } from '../types/form'

interface UseCountriesResult {
  countries: Country[]
  isLoading: boolean
  error: string | null
  isFallback: boolean
}

export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchCountries()
        if (!cancelled) {
          setCountries(data)
          setIsFallback(false)
        }
      } catch {
        if (!cancelled) {
          setCountries(FALLBACK_COUNTRIES)
          setIsFallback(true)
          setError('Unable to load countries. Showing a limited list.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { countries, isLoading, error, isFallback }
}
