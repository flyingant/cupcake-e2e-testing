
export interface PhysicianRecord {
  id: string
  platformId: string
  salesforceId: string
  territorySfId: string
  email: string
  firstName: string
  lastName: string
  createdAt: Date
  t2pGoal: number | null
  t2tGoal: number | null
}

export interface PhysicianRecordData {
  platformId: string
  salesforceId?: string
  territorySfId?: string
  email?: string
  firstName: string
  lastName: string
}

export interface UpdatePhysician {
  email?: string
  firstName?: string
  lastName?: string
  t2pGoal?: number
  t2tGoal?: number
}

