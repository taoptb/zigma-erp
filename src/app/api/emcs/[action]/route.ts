import { NextResponse, type NextRequest } from 'next/server'
import { createEMCSAdapter } from '@/lib/adapters/emcs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params
  const adapter = createEMCSAdapter()

  switch (action) {
    case 'submit-claim': {
      const data = await request.json()
      const result = await adapter.submitClaim(data)
      return NextResponse.json(result)
    }
    case 'claim-status': {
      const { referenceId } = await request.json()
      const result = await adapter.getClaimStatus(referenceId)
      return NextResponse.json(result)
    }
    case 'insurance-companies': {
      const companies = await adapter.listInsuranceCompanies()
      return NextResponse.json({ companies })
    }
    default:
      return NextResponse.json({ error: 'unknown_action' }, { status: 404 })
  }
}
