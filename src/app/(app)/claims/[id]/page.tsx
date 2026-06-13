import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClaim } from '@/lib/queries/claims'
import { ClaimStatusBadge } from '@/components/claims/claim-status-badge'
import { DocumentChecklist } from '@/components/claims/document-checklist'
import { ClaimStatusActions } from '@/components/claims/claim-status-actions'

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('shop_id').eq('id', user.id).single()
  if (!profile?.shop_id) redirect('/register')

  const claim = await getClaim(supabase, profile.shop_id, id)
  if (!claim) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{claim.insurance_company}</h2>
          <div className="flex items-center gap-3 mt-2">
            <ClaimStatusBadge status={claim.status} />
            {claim.policy_number && (
              <span className="text-sm text-gray-500 font-mono">{claim.policy_number}</span>
            )}
          </div>
        </div>
        {claim.claim_amount && (
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">฿{Number(claim.claim_amount).toLocaleString()}</p>
            <p className="text-xs text-gray-400">จำนวนเงินเคลม</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">เอกสารประกอบ</h3>
          <DocumentChecklist documents={claim.documents} />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">ข้อมูลเคลม</h3>
            {claim.job && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">เลขงาน</span>
                <span className="font-mono text-gray-700">{claim.job.job_number}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">วันที่ยื่น</span>
              <span className="text-gray-700">{new Date(claim.created_at).toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span>
            </div>
            {claim.notes && (
              <div className="text-sm">
                <span className="text-gray-500 block mb-1">หมายเหตุ</span>
                <span className="text-gray-700">{claim.notes}</span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <ClaimStatusActions claimId={claim.id} shopId={profile.shop_id} currentStatus={claim.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
