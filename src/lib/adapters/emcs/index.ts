import type { IEMCSAdapter } from './types'
import { MockEMCSAdapter } from './mock-adapter'

export function createEMCSAdapter(): IEMCSAdapter {
  if (process.env.EMCS_API_URL && process.env.EMCS_API_KEY) {
    // Real adapter not yet implemented — waiting for API access
    console.warn('[EMCS] Real adapter not yet implemented, falling back to mock')
  }
  return new MockEMCSAdapter()
}

export type { IEMCSAdapter, EMCSClaimData, EMCSClaimResponse, EMCSStatusResponse } from './types'
