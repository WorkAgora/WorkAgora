export enum KycStatus {
  PENDING,
  VERIFIED,
  CANCELLED,
  FINAL_REJECTED
}

export enum KycService {
  LIVENESS,
  IDENTITY,
  RESIDENCY
}

export enum KycServiceState {
  NOT_STARTED,
  SUBMITTED,
  VALIDATED,
  REJECTED,
  FINAL_REJECTED,
  RESET
}
