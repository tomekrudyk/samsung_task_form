import { test, expect } from '@playwright/test'

function getAdultDob(): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 25)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

test.describe('Contact Form E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      sessionStorage.removeItem('contact-form-wizard')
      localStorage.removeItem('theme')
    })
    await page.reload()
  })

  test('full happy path submission', async ({ page }) => {
    await page.route('**/restcountries.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { name: { common: 'United States' }, cca2: 'US' },
          { name: { common: 'Poland' }, cca2: 'PL' },
        ]),
      })
    })

    await page.getByLabel('First name').fill('Jane')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByLabel('Email address').fill('jane@example.com')
    await page.getByLabel('Phone number').fill('+1 555 123 4567')
    await page.getByLabel('Date of birth').fill(getAdultDob())
    await page.getByLabel('Country').selectOption('US')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByRole('heading', { name: 'Enquiry Type' })).toBeVisible()
    await page.getByLabel('Business').check()
    await expect(page.getByTestId('company-fields')).toBeVisible()
    await page.getByLabel(/Company name/).fill('Acme Inc')
    await page.getByLabel(/Number of employees/).fill('50')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByRole('heading', { name: 'Message & Consent' })).toBeVisible()
    await page.getByLabel('Subject').fill('Partnership inquiry')
    await page.getByRole('textbox', { name: 'Message' }).fill('I would like to discuss a partnership opportunity.')
    await page.getByRole('checkbox').check()

    await page.getByRole('button', { name: 'Submit enquiry' }).click()
    await expect(page.getByTestId('submission-success')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Enquiry submitted successfully' })).toBeVisible()
  })

  test('cannot proceed with invalid step 1', async ({ page }) => {
    await page.route('**/restcountries.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ name: { common: 'United States' }, cca2: 'US' }]),
      })
    })

    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible()
    await expect(page.getByText('First name is required')).toBeVisible()
  })

  test('conditional block appears and disappears', async ({ page }) => {
    await page.route('**/restcountries.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { name: { common: 'United States' }, cca2: 'US' },
          { name: { common: 'Poland' }, cca2: 'PL' },
        ]),
      })
    })

    await page.getByLabel('First name').fill('Jane')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByLabel('Email address').fill('jane@example.com')
    await page.getByLabel('Phone number').fill('+1 555 123 4567')
    await page.getByLabel('Date of birth').fill(getAdultDob())
    await page.getByLabel('Country').selectOption('US')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByTestId('company-fields')).not.toBeVisible()
    await page.getByLabel('Partnership').check()
    await expect(page.getByTestId('company-fields')).toBeVisible()
    await page.getByLabel('Personal').check()
    await expect(page.getByTestId('company-fields')).not.toBeVisible()
  })

  test('dark mode toggle persists', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /Switch to/ })
    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await toggle.click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('mobile responsive flow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.route('**/restcountries.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ name: { common: 'United States' }, cca2: 'US' }]),
      })
    })

    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()
    await page.getByLabel('First name').fill('John')
    await page.getByLabel('Last name').fill('Smith')
    await page.getByLabel('Email address').fill('john@example.com')
    await page.getByLabel('Phone number').fill('555-0100')
    await page.getByLabel('Date of birth').fill(getAdultDob())
    await page.getByLabel('Country').selectOption('US')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByText('Step 2 of 3')).toBeVisible()
  })
})
