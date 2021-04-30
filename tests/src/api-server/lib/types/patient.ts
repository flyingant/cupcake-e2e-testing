enum EGender {
  male,
  female,
  other
}

export enum EStage {
  'candidate' = 0,
  'awaitingTrial' = 1,
  'inTrial' = 2,
  'awaitingImplant' = 3,
  'implanted' = 4,
  'failed' = 5
}

interface Patient {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  mobileNumber: string
  email: string
  zip?: string
  dob: string
  gender: EGender
  stage: EStage
  pid: string
  platformId: string
  territoryId: string
  salesforceId: string
  patientCreatedDate?: string
  leadCreatedDate?: string
  isPreAuthDataLocked: boolean
}

export interface UpdatePatient {
  stage?: EStage
  platformId?: string
  salesforceId?: string
  territoryId?: string
  educationState?: string
  educationDate?: string | null
  educationSource?: string
  trialPhysicianName?: string
  implantPhysicianName?: string
  implantDate?: string | null
  trialDate?: string | null
  preAuthState?: string
  preAuthDate?: string | null
  notes?: string
  psychDate?: string | null
  psychStatus?: string
  insurance?: string
  medicalClearanceDate?: string | null
  implantConsultDate?: string | null
  implantConsultStatus?: string
  mriDate?: string | null
  primaryPhysicianName?: string
  referingPhysicianName?: string
  salesRepName?: string
  isDirty?: boolean
}

export interface PatientRecord extends Patient {
  psychState: string
  psychDate: string | null
  psychStatus: string
  leadStatus: string
  insurance: string
  medicalClearanceDate: string | null
  implantConsultDate: string | null
  implantConsultStatus: string
  mriDate: string | null
  primaryPhysicianName: string
  referingPhysicianName: string
  attendingRepPlatfromId: string
  patientContacted: boolean
  trialOppyStatus: string
  trialPhysicianPlatformId?: string
  trialPhysicianSalesforceId?: string
  trialPhysicianName: string
  implantPhysicianPlatformId?: string
  implantPhysicianSalesforceId?: string
  implantPhysicianName: string
  implantDate?: string | null
  trialDate?: string | null
  preAuthState: string
  preAuthDate: string | null
  preAuthOffLabel: boolean
  preAuthSubStatus: string
  isPreAuthDataLocked: boolean
  educationState: boolean
  educationDate: string | null
  educationSource: string
  notes?: string
  isDirty?: boolean
  trialOppyCreatedDate: string
  trialSfId: string,
  preAuthSfId: string,
  leadCreatedDate?: string
  salesRepName: string,
  implantSfId: string,
  leadSfId: string
}
