
export interface UserRecord {
  id: string
  clinicId: string
  platformId: string
  coordinatorId: string | null
  email: string
  firstName: string
  lastName: string
  activatedAt: Date
  createdAt: Date
  updatedAt: Date
  policiesAccepted: boolean
  canReadOnly: boolean
  isOnboarded: boolean
}

export interface UserRecordData {
  clinicId?: string
  platformId?: string
  coordinatorId?: string
  email?: string
  firstName?: string
  lastName?: string
  activatedAt?: Date
  updatedAt?: Date
  policiesAccepted?: boolean,
  canReadOnly?: boolean
  isOnboarded?: boolean
}

