export enum EJourneyStatus {
  failed = 'failed',
  successful = 'successful',
  inconclusive = 'inconclusive',
  pending = 'pending'
}

export enum EJourneyType {
  trial = 'trial',
  implant = 'implant',
  explant = 'explant',
  revision = 'revision',
}

export interface JourneyBase {
  recordType: EJourneyType,
  createdDate: string,
  scheduledDate: string,
  physicianPlatformId: string,
  status: EJourneyStatus,
  recordSfId: string
}
export interface Journey extends JourneyBase {
  id: string,
  patientId: string,
}

export interface JourneyAggregated {
  patientId: string,
  journeys: Array<Journey>
}
