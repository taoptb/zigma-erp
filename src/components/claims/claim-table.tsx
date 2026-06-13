'use client'

import Link from 'next/link'
import { ClaimStatusBadge } from './claim-status-badge'
import type { ClaimWithDocuments } from '@/types/app.types'

export function ClaimTable({ claims }: { claims: ClaimWithDocuments[] }) {
  if (claims.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">ยังไม่มีรายการเคลม</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
            <th className="text-left px-4 py-3">บริษัทประกัน</th>
            <th className="text-left px-4 py-3">เลขงาน</th>
            <th className="text-left px-4 py-3">เลขกรมธรรม์</th>
            <th className="text-right px-4 py-3">จำนวนเงินเคลม</th>
            <th className="text-left px-4 py-3">เอกสาร</th>
            <th className="text-left px-4 py-3">สถานะ</th>
            <th className="text-left px-4 py-3">วันที่</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {claims.map((claim) => (
            <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                <Link href={`/claims/${claim.id}`} className="hover:text-blue-600">
                  {claim.insurance_company}
                </Link>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">
                {claim.job?.job_number ?? '—'}
              </td>
              <td className="px-4 py-3 text-gray-500">{claim.policy_number ?? '—'}</td>
              <td className="px-4 py-3 text-right text-gray-700">
                {claim.claim_amount ? `฿${Number(claim.claim_amount).toLocaleString()}` : '—'}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {claim.documents.length} รายการ
              </td>
              <td className="px-4 py-3">
                <ClaimStatusBadge status={claim.status} />
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {new Date(claim.created_at).toLocaleDateString('th-TH', { dateStyle: 'short' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
