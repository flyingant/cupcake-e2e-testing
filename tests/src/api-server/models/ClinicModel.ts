
export interface ClinicRecord {
  id: string
  salesforceId: string
  name: string
  logo: string | null
  banner: string | null
  createdAt: Date
  updatedAt: Date
  t2tGoal?: number
  t2pGoal?: number
}

export interface ClinicRecordData {
  salesforceId?: string
  name?: string
  logo?: string
  banner?: string
}

