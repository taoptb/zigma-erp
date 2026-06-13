import type { ClaimStatus } from '@/types/app.types'

const STATUS_STYLES: Record<ClaimStatus, string> = {
  waiting_docs: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  paid: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS: Record<ClaimStatus, string> = {
  waiting_docs: 'รอเอกสาร',
  in_progress: 'กำลังดำเนินการ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ไม่อนุมัติ',
  paid: 'จ่ายแล้ว',
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
