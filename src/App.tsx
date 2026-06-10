import { DarkModeToggle } from './components/DarkModeToggle'
import { FormWizard } from './components/FormWizard'
import { FormWizardProvider } from './context/FormWizardContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <FormWizardProvider>
        <div className="page-gradient min-h-screen">
          <header className="mx-auto flex max-w-2xl items-center justify-end px-4 pt-6 sm:px-6">
            <DarkModeToggle />
          </header>

          <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                Contact Us
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Complete the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            <FormWizard />
          </main>
        </div>
      </FormWizardProvider>
    </ThemeProvider>
  )
}

export default App
