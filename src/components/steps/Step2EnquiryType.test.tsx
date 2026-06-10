import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { FormWizardProvider } from '../../context/FormWizardContext'
import { Step2EnquiryType } from './Step2EnquiryType'

describe('Step2EnquiryType conditional fields', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows company fields for Business enquiry type', async () => {
    const user = userEvent.setup()
    render(
      <FormWizardProvider>
        <Step2EnquiryType />
      </FormWizardProvider>
    )

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    expect(screen.getByTestId('company-fields')).toBeInTheDocument()
    expect(screen.getByLabelText(/Company name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Number of employees/)).toBeInTheDocument()
  })

  it('hides company fields for Personal enquiry type', async () => {
    const user = userEvent.setup()
    render(
      <FormWizardProvider>
        <Step2EnquiryType />
      </FormWizardProvider>
    )

    expect(screen.queryByTestId('company-fields')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    expect(screen.getByTestId('company-fields')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Personal' }))
    expect(screen.queryByTestId('company-fields')).not.toBeInTheDocument()
  })

  it('resets company fields when switching from Business to Personal', async () => {
    const user = userEvent.setup()
    render(
      <FormWizardProvider>
        <Step2EnquiryType />
      </FormWizardProvider>
    )

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    await user.type(screen.getByLabelText(/Company name/), 'Acme Corp')
    await user.type(screen.getByLabelText(/Number of employees/), '100')

    await user.click(screen.getByRole('radio', { name: 'Personal' }))
    await user.click(screen.getByRole('radio', { name: 'Business' }))

    expect(screen.getByLabelText(/Company name/)).toHaveValue('')
    expect(screen.getByLabelText(/Number of employees/)).toHaveValue(null)
  })
})
