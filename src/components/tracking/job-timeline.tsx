import { JOB_STATUS_LABELS } from '@/lib/job-status'
import type { JobStatusHistory, JobStatus } from '@/types/app.types'

const STATUS_DOT_COLORS: Partial<Record<JobStatus, string>> = {
  in_progress: 'bg-blue-500',
  done_waiting: 'bg-green-500',
  delivered: 'bg-gray-500',
  waiting_parts: 'bg-orange-500',
  claim: 'bg-purple-500',
  cancelled: 'bg-red-500',
  pending: 'bg-yellow-500',
  quote: 'bg-gray-400',
}

export function JobTimeline({ history }: { history: JobStatusHistory[] }) {
  const sorted = [...history].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
      <div className="space-y-4">
        {sorted.map((h) => (
          <div key={h.id} className="relative">
            <div
              className={`absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                STATUS_DOT_COLORS[h.to_status] ?? 'bg-gray-400'
              }`}
            />
            <div className="text-xs text-gray-400 mb-0.5">
              {new Date(h.created_at).toLocaleDateString('th-TH', {
                day: 'numeric', month: 'short', year: '2-digit',
                hour: '2-digit', minute: '2-digit',
              })}
            </div>
            <div className="text-sm font-medium text-gray-800">
              {JOB_STATUS_LABELS[h.to_status]}
            </div>
            {h.note && <div className="text-xs text-gray-500 mt-0.5">{h.note}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
