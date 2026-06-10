import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  INITIAL_FORM_DATA,
  TOTAL_STEPS,
  type FormData,
} from '../types/form'

interface FormWizardContextValue {
  currentStep: number
  formData: FormData
  setFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  totalSteps: number
}

const FormWizardContext = createContext<FormWizardContextValue | null>(null)

const STORAGE_KEY = 'contact-form-wizard'

function loadPersistedState(): { currentStep: number; formData: FormData } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as { currentStep: number; formData: FormData }
  } catch {
    return null
  }
}

export function FormWizardProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersistedState()

  const [currentStep, setCurrentStep] = useState(persisted?.currentStep ?? 1)
  const [formData, setFormDataState] = useState<FormData>(persisted?.formData ?? INITIAL_FORM_DATA)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, formData }))
    } catch {
      /* ignore */
    }
  }, [currentStep, formData])

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
    setCurrentStep(Math.min(Math.max(step, 1), TOTAL_STEPS))
  }, [])

  const value = useMemo(
    () => ({
      currentStep,
      formData,
      setFormData,
      nextStep,
      prevStep,
      goToStep,
      totalSteps: TOTAL_STEPS,
    }),
    [currentStep, formData, setFormData, nextStep, prevStep, goToStep]
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
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
