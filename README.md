# SaaS Contact Form

Production-ready 3-step multi-step contact form built with React 18+, TypeScript, Tailwind CSS, React Hook Form, and Zod.

## Features

- **3-step wizard** — Personal info, enquiry type, message & consent
- **Dark mode** — Class-based toggle with localStorage persistence and system preference detection
- **Accessibility** — WCAG AA labels, ARIA attributes, keyboard navigation, live regions
- **REST Countries API** — Cached country dropdown with loading and fallback states
- **Conditional fields** — Business/Partnership company details with animated reveal and reset
- **Validation** — React Hook Form + Zod per step (email, 18+ DOB, required fields)
- **Animations** — Subtle fade/translate step transitions and conditional field reveals

## Tech Stack

- React 18+ / TypeScript
- Tailwind CSS v4
- React Hook Form + Zod
- Context API (wizard + theme state)
- Vitest + React Testing Library
- Playwright (e2e)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run e2e tests (Playwright) |

## Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Input, Select, Card
│   ├── steps/        # Step1, Step2, Step3
│   ├── FormWizard.tsx
│   ├── ProgressBar.tsx
│   └── DarkModeToggle.tsx
├── context/          # FormWizard + Theme providers
├── hooks/            # useCountries
├── lib/              # Schemas, countries API, utils
└── types/            # Form types
```

## Form Flow

1. **Step 1 — Personal Info**: Name, email, phone, DOB (18+), country
2. **Step 2 — Enquiry Type**: Personal / Business / Partnership / Other (+ conditional company fields)
3. **Step 3 — Message & Consent**: Subject, message (500 char limit), terms checkbox

Submit logs the full payload to the console (ready to swap for a real API).
