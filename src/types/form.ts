export type EnquiryType = 'Personal' | 'Business' | 'Partnership' | 'Other'

export interface PersonalInfoData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  country: string
}

export interface EnquiryTypeData {
  enquiryType: EnquiryType
  companyName?: string
  numberOfEmployees?: number
}

export interface MessageConsentData {
  subject: string
  message: string
  terms: boolean
}

export type FormData = PersonalInfoData & EnquiryTypeData & MessageConsentData

export interface Country {
  name: string
  code: string
}

export const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  country: '',
  enquiryType: 'Personal',
  companyName: '',
  numberOfEmployees: undefined,
  subject: '',
  message: '',
  terms: false,
}

export const TOTAL_STEPS = 3

export const STEP_TITLES = [
  'Personal Information',
  'Enquiry Type',
  'Message & Consent',
] as const
