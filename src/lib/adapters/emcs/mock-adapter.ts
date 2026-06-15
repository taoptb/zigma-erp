import type { IEMCSAdapter, EMCSClaimData, EMCSClaimResponse, EMCSStatusResponse } from './types'

export class MockEMCSAdapter implements IEMCSAdapter {
  async submitClaim(data: EMCSClaimData): Promise<EMCSClaimResponse> {
    await new Promise((r) => setTimeout(r, 200))
    return {
      referenceId: `MOCK-${Date.now()}-${data.claimNumber}`,
      status: 'submitted',
      message: '[Mock] Claim submitted successfully',
    }
  }

  async getClaimStatus(referenceId: string): Promise<EMCSStatusResponse> {
    await new Promise((r) => setTimeout(r, 100))
    return {
      referenceId,
      status: 'in_review',
      notes: '[Mock] Under review',
    }
  }

  async listInsuranceCompanies(): Promise<{ id: string; name: string }[]> {
    return [
      { id: 'bki', name: 'กรุงเทพประกันภัย' },
      { id: 'tqm', name: 'TQM ประกันภัย' },
      { id: 'viriyah', name: 'วิริยะประกันภัย' },
      { id: 'smk', name: 'สมโพธิ์ประกันภัย' },
      { id: 'dhipaya', name: 'ทิพยประกันภัย' },
    ]
  }
}
