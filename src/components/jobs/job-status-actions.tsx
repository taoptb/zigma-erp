'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateJobStatus } from '@/lib/queries/jobs'
import { getNextStatuses, JOB_STATUS_LABELS } from '@/lib/job-status'
import type { JobStatus } from '@/types/app.types'

const STATUS_BUTTON_STYLES: Partial<Record<JobStatus, string>> = {
  in_progress: 'bg-blue-600 hover:bg-blue-700 text-white',
  done_waiting: 'bg-green-600 hover:bg-green-700 text-white',
  delivered: 'bg-gray-800 hover:bg-gray-900 text-white',
  waiting_parts: 'bg-orange-500 hover:bg-orange-600 text-white',
  claim: 'bg-purple-600 hover:bg-purple-700 text-white',
  cancelled: 'border border-red-300 text-red-600 hover:bg-red-50',
  pending: 'bg-yellow-500 hover:bg-yellow-600 text-white',
}

export function JobStatusActions({
  jobId,
  shopId,
  currentStatus,
  userId,
}: {
  jobId: string
  shopId: string
  currentStatus: JobStatus
  userId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<JobStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const nextStatuses = getNextStatuses(currentStatus)

  if (nextStatuses.length === 0) return null

  async function handleTransition(toStatus: JobStatus) {
    setLoading(toStatus)
    setError(null)
    const supabase = createClient()
    const result = await updateJobStatus(supabase, shopId, jobId, userId, currentStatus, toStatus)
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
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
              STATUS_BUTTON_STYLES[toStatus] ?? 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {loading === toStatus ? '...' : `→ ${JOB_STATUS_LABELS[toStatus]}`}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
