import type { JobStatus } from '@/types/app.types'

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  quote: 'ใบเสนอราคา',
  pending: 'รอดำเนินการ',
  in_progress: 'กำลังซ่อม',
  waiting_parts: 'รออะไหล่',
  claim: 'รอเคลมประกัน',
  done_waiting: 'เสร็จ รอส่งรถ',
  delivered: 'ส่งรถแล้ว',
  cancelled: 'ยกเลิก',
}

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  quote: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  waiting_parts: 'bg-orange-100 text-orange-700',
  claim: 'bg-purple-100 text-purple-700',
  done_waiting: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
}

const NEXT_STATUSES: Record<JobStatus, JobStatus[]> = {
  quote: ['pending', 'cancelled'],
  pending: ['in_progress', 'cancelled'],
  in_progress: ['waiting_parts', 'claim', 'done_waiting'],
  waiting_parts: ['in_progress', 'done_waiting'],
  claim: ['done_waiting', 'cancelled'],
  done_waiting: ['delivered'],
  delivered: [],
  cancelled: [],
}

export function getNextStatuses(current: JobStatus): JobStatus[] {
  return NEXT_STATUSES[current]
}
