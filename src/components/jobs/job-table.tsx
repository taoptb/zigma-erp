'use client'

import Link from 'next/link'
import { StatusBadge } from './status-badge'
import type { JobWithRelations, JobType } from '@/types/app.types'

const JOB_TYPE_LABELS: Record<JobType, string> = {
  windshield_replace: 'เปลี่ยนกระจกหน้า',
  side_glass_replace: 'เปลี่ยนกระจกข้าง',
  rear_glass_replace: 'เปลี่ยนกระจกหลัง',
  film_tint: 'ติดฟิล์ม',
  crack_repair: 'ซ่อมรอยร้าว',
  insurance_claim: 'เคลมประกัน',
  other: 'อื่นๆ',
}

export function JobTable({ jobs }: { jobs: JobWithRelations[] }) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">ยังไม่มีรายการงาน</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
            <th className="text-left px-4 py-3">เลขงาน</th>
            <th className="text-left px-4 py-3">ทะเบียน</th>
            <th className="text-left px-4 py-3">ลูกค้า</th>
            <th className="text-left px-4 py-3">ประเภทงาน</th>
            <th className="text-right px-4 py-3">ราคา</th>
            <th className="text-left px-4 py-3">สถานะ</th>
            <th className="text-left px-4 py-3">วันนัด</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/jobs/${job.id}`}
                  className="font-mono text-blue-600 hover:underline text-xs"
                >
                  {job.job_number}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs tracking-wider">
                  {job.vehicle?.license_plate ?? '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">
                {job.customer?.name ?? <span className="text-gray-400">—</span>}
                {job.customer?.phone && (
                  <span className="block text-xs text-gray-400">{job.customer.phone}</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">{JOB_TYPE_LABELS[job.job_type]}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">
                ฿{Number(job.price).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={job.status} />
              </td>
              <td className="px-4 py-3 text-gray-500">
                {job.scheduled_date
                  ? new Date(job.scheduled_date).toLocaleDateString('th-TH', {
                      day: 'numeric', month: 'short',
                    })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
