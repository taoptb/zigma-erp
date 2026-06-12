import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from '@/lib/job-status'
import type { JobStatus } from '@/types/app.types'

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${JOB_STATUS_COLORS[status]}`}>
      {JOB_STATUS_LABELS[status]}
    </span>
  )
}
