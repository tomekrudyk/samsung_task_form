import type { FormData } from '../types/form'

const REQUEST_TIMEOUT_MS = 15_000

export class SubmitFormError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubmitFormError'
  }
}

export async function submitContactForm(data: FormData): Promise<void> {
  const submitUrl = import.meta.env.VITE_SUBMIT_URL as string | undefined

  if (submitUrl) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new SubmitFormError('Unable to submit your enquiry. Please try again.')
      }
    } catch (error) {
      if (error instanceof SubmitFormError) throw error
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new SubmitFormError('Request timed out. Please check your connection and try again.')
      }
      throw new SubmitFormError('Unable to submit your enquiry. Please try again.')
    } finally {
      clearTimeout(timeoutId)
    }
    return
  }

  // Mock endpoint when VITE_SUBMIT_URL is not configured
  await new Promise((resolve) => setTimeout(resolve, 600))
}
