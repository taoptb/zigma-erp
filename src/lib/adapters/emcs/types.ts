export interface EMCSClaimData {
  claimNumber: string
  insuranceCompany: string
  policyNumber: string
  licensePlate: string
  jobType: string
  claimAmount: number
  damageDescription?: string
}

export interface EMCSClaimResponse {
  referenceId: string
  status: 'submitted' | 'error'
  message?: string
}

export interface EMCSStatusResponse {
  referenceId: string
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  approvedAmount?: number
  notes?: string
}

export interface IEMCSAdapter {
  submitClaim(data: EMCSClaimData): Promise<EMCSClaimResponse>
  getClaimStatus(referenceId: string): Promise<EMCSStatusResponse>
  listInsuranceCompanies(): Promise<{ id: string; name: string }[]>
}
