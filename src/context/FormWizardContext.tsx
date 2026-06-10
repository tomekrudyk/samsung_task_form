import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { parsePersistedState, sanitizeEnquiryType } from '../lib/schemas'
import {
  INITIAL_FORM_DATA,
  TOTAL_STEPS,
  type FormData,
} from '../types/form'

interface FormWizardContextValue {
  currentStep: number
  formData: FormData
  isSubmitted: boolean
  setFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  setSubmitted: (value: boolean) => void
  resetWizard: () => void
  totalSteps: number
}

const FormWizardContext = createContext<FormWizardContextValue | null>(null)

const STORAGE_KEY = 'contact-form-wizard'

function clampStep(step: number): number {
  return Math.min(Math.max(Math.floor(step), 1), TOTAL_STEPS)
}

function loadPersistedState(): { currentStep: number; formData: FormData } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = parsePersistedState(raw)
    if (!parsed) return null

    const { formData: stored } = parsed
    return {
      currentStep: clampStep(parsed.currentStep),
      formData: {
        ...INITIAL_FORM_DATA,
        ...stored,
        enquiryType: sanitizeEnquiryType(stored.enquiryType),
        terms: Boolean(stored.terms),
      },
    }
  } catch {
    return null
  }
}

export function FormWizardProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersistedState()

  const [currentStep, setCurrentStep] = useState(persisted?.currentStep ?? 1)
  const [formData, setFormDataState] = useState<FormData>(persisted?.formData ?? INITIAL_FORM_DATA)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (isSubmitted) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, formData }))
    } catch {
      /* ignore quota / private mode */
    }
  }, [currentStep, formData, isSubmitted])

  const setFormData = useCallback((data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }))
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(clampStep(step))
  }, [])

  const setSubmitted = useCallback((value: boolean) => {
    setIsSubmitted(value)
    if (value) clearFormWizardStorage()
  }, [])

  const resetWizard = useCallback(() => {
    setFormDataState(INITIAL_FORM_DATA)
    setCurrentStep(1)
    setIsSubmitted(false)
    clearFormWizardStorage()
  }, [])

  const value = useMemo(
    () => ({
      currentStep,
      formData,
      isSubmitted,
      setFormData,
      nextStep,
      prevStep,
      goToStep,
      setSubmitted,
      resetWizard,
      totalSteps: TOTAL_STEPS,
    }),
    [
      currentStep,
      formData,
      isSubmitted,
      setFormData,
      nextStep,
      prevStep,
      goToStep,
      setSubmitted,
      resetWizard,
    ]
  )

  return <FormWizardContext.Provider value={value}>{children}</FormWizardContext.Provider>
}

export function useFormWizard() {
  const context = useContext(FormWizardContext)
  if (!context) {
    throw new Error('useFormWizard must be used within FormWizardProvider')
  }
  return context
}

export function clearFormWizardStorage(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
