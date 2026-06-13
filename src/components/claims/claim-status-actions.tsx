'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateClaimStatus } from '@/lib/queries/claims'
import type { ClaimStatus } from '@/types/app.types'

const NEXT_STATUSES: Record<ClaimStatus, ClaimStatus[]> = {
  waiting_docs: ['in_progress'],
  in_progress: ['approved', 'rejected'],
  approved: ['paid'],
  rejected: [],
  paid: [],
}

const STATUS_LABELS: Record<ClaimStatus, string> = {
  waiting_docs: 'รอเอกสาร',
  in_progress: 'กำลังดำเนินการ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ไม่อนุมัติ',
  paid: 'จ่ายแล้ว',
}

export function ClaimStatusActions({
  claimId,
  shopId,
  currentStatus,
}: {
  claimId: string
  shopId: string
  currentStatus: ClaimStatus
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<ClaimStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const nextStatuses = NEXT_STATUSES[currentStatus]
  if (nextStatuses.length === 0) return <p className="text-xs text-gray-400">เคลมนี้เสร็จสิ้นแล้ว</p>

  async function handleTransition(toStatus: ClaimStatus) {
    setLoading(toStatus)
    setError(null)
    const supabase = createClient()
    const result = await updateClaimStatus(supabase, shopId, claimId, toStatus)
    if (result.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
    setLoading(null)
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">เปลี่ยนสถานะ</p>
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((toStatus) => (
          <button
            key={toStatus}
            onClick={() => handleTransition(toStatus)}
            disabled={loading !== null}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
          >
            {loading === toStatus ? '...' : `→ ${STATUS_LABELS[toStatus]}`}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
