'use client'

import Link from 'next/link'
import { JOB_STATUS_LABELS } from '@/lib/job-status'
import type { JobWithRelations, JobStatus } from '@/types/app.types'

const BOARD_COLUMNS: { status: JobStatus; label: string }[] = [
  { status: 'pending', label: 'รอดำเนินการ' },
  { status: 'in_progress', label: 'กำลังซ่อม' },
  { status: 'waiting_parts', label: 'รออะไหล่' },
  { status: 'claim', label: 'รอเคลม' },
  { status: 'done_waiting', label: 'เสร็จ รอส่ง' },
]

function elapsed(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}ว`
  if (h > 0) return `${h}ชม`
  return `<1ชม`
}

export function TrackingBoard({ jobs }: { jobs: JobWithRelations[] }) {
  const byStatus = (status: JobStatus) => jobs.filter((j) => j.status === status)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {BOARD_COLUMNS.map((col) => {
        const colJobs = byStatus(col.status)
        return (
          <div key={col.status} className="flex-shrink-0 w-56">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{col.label}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
                {colJobs.length}
              </span>
            </div>
            <div className="space-y-2">
              {colJobs.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-xs text-gray-400">
                  ว่าง
                </div>
              )}
              {colJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/tracking/${job.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs tracking-wider">
                      {job.vehicle?.license_plate ?? '—'}
                    </span>
                    <span className="text-xs text-gray-400">{elapsed(job.created_at)}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-700">
                    {job.vehicle?.make} {job.vehicle?.model}
                  </p>
                  {job.customer && (
                    <p className="text-xs text-gray-400 mt-0.5">{job.customer.name}</p>
                  )}
                  <p className="text-xs text-gray-400 font-mono mt-1">{job.job_number}</p>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
