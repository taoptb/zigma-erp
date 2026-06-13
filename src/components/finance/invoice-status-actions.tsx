'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateInvoiceStatus } from '@/lib/queries/invoices'
import type { InvoiceStatus } from '@/types/app.types'

const NEXT_STATUSES: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ['pending_payment', 'cancelled'],
  pending_payment: ['paid', 'waiting_insurance', 'cancelled'],
  waiting_insurance: ['paid', 'cancelled'],
  paid: [],
  cancelled: [],
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'ร่าง',
  pending_payment: 'รอชำระ',
  paid: 'ชำระแล้ว',
  waiting_insurance: 'รอประกัน',
  cancelled: 'ยกเลิก',
}

export function InvoiceStatusActions({
  invoiceId,
  shopId,
  currentStatus,
}: {
  invoiceId: string
  shopId: string
  currentStatus: InvoiceStatus
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<InvoiceStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const nextStatuses = NEXT_STATUSES[currentStatus]
  if (nextStatuses.length === 0) return null

  async function handleTransition(toStatus: InvoiceStatus) {
    setLoading(toStatus)
    setError(null)
    const supabase = createClient()
    const result = await updateInvoiceStatus(supabase, shopId, invoiceId, toStatus)
    if (result.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex gap-2">
        {nextStatuses.map((toStatus) => (
          <button
            key={toStatus}
            onClick={() => handleTransition(toStatus)}
            disabled={loading !== null}
            className="px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900 disabled:opacity-50"
          >
            {loading === toStatus ? '...' : `→ ${STATUS_LABELS[toStatus]}`}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
