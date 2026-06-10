import { useFormWizard } from '../context/FormWizardContext'
import { useFocusTrap } from '../lib/utils'
import { STEP_TITLES } from '../types/form'
import { ProgressBar } from './ProgressBar'
import { Step1PersonalInfo } from './steps/Step1PersonalInfo'
import { Step2EnquiryType } from './steps/Step2EnquiryType'
import { Step3MessageConsent } from './steps/Step3MessageConsent'
import { Card } from './ui/Card'

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1PersonalInfo />
    case 2:
      return <Step2EnquiryType />
    case 3:
      return <Step3MessageConsent />
    default:
      return null
  }
}

export function FormWizard() {
  const { currentStep } = useFormWizard()
  const cardRef = useFocusTrap(true)

  return (
    <Card>
      <div ref={cardRef}>
        <ProgressBar currentStep={currentStep} />

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Step {currentStep}: {STEP_TITLES[currentStep - 1]}
        </div>

        <div key={currentStep} className="animate-step-enter">
          <StepContent step={currentStep} />
        </div>
      </div>
    </Card>
  )
}
