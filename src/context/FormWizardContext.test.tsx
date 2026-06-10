import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormWizardProvider, useFormWizard, clearFormWizardStorage } from './FormWizardContext'

function NavigationHarness() {
  const { currentStep, nextStep, prevStep, totalSteps } = useFormWizard()

  return (
    <div>
      <span data-testid="current-step">{currentStep}</span>
      <span data-testid="total-steps">{totalSteps}</span>
      <button onClick={nextStep}>Next</button>
      <button onClick={prevStep}>Back</button>
    </div>
  )
}

describe('FormWizardContext navigation', () => {
  beforeEach(() => {
    sessionStorage.clear()
    clearFormWizardStorage()
  })

  it('starts at step 1', () => {
    render(
      <FormWizardProvider>
        <NavigationHarness />
      </FormWizardProvider>
    )
    expect(screen.getByTestId('current-step')).toHaveTextContent('1')
    expect(screen.getByTestId('total-steps')).toHaveTextContent('3')
  })

  it('navigates forward and backward between steps', async () => {
    const user = userEvent.setup()
    render(
      <FormWizardProvider>
        <NavigationHarness />
      </FormWizardProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByTestId('current-step')).toHaveTextContent('2')

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByTestId('current-step')).toHaveTextContent('3')

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByTestId('current-step')).toHaveTextContent('2')
  })

  it('does not go below step 1', async () => {
    const user = userEvent.setup()
    render(
      <FormWizardProvider>
        <NavigationHarness />
      </FormWizardProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByTestId('current-step')).toHaveTextContent('1')
  })

  it('does not exceed step 3', async () => {
    const user = userEvent.setup()
    render(
      <FormWizardProvider>
        <NavigationHarness />
      </FormWizardProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByTestId('current-step')).toHaveTextContent('3')
  })

  it('clamps corrupted persisted step values', () => {
    sessionStorage.setItem(
      'contact-form-wizard',
      JSON.stringify({ currentStep: 99, formData: { firstName: 'Jane' } })
    )

    render(
      <FormWizardProvider>
        <NavigationHarness />
      </FormWizardProvider>
    )

    expect(screen.getByTestId('current-step')).toHaveTextContent('3')
  })
})
