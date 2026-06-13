'use client'

import Link from 'next/link'
import type { InvoiceWithItems, InvoiceStatus } from '@/types/app.types'

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending_payment: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  waiting_insurance: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'ร่าง',
  pending_payment: 'รอชำระ',
  paid: 'ชำระแล้ว',
  waiting_insurance: 'รอประกัน',
  cancelled: 'ยกเลิก',
}

export function InvoiceTable({ invoices }: { invoices: InvoiceWithItems[] }) {
  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">ยังไม่มีใบแจ้งหนี้</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
            <th className="text-left px-4 py-3">เลขใบแจ้งหนี้</th>
            <th className="text-left px-4 py-3">ลูกค้า</th>
            <th className="text-right px-4 py-3">ยอดรวม</th>
            <th className="text-right px-4 py-3">VAT</th>
            <th className="text-right px-4 py-3">รวมทั้งสิ้น</th>
            <th className="text-left px-4 py-3">สถานะ</th>
            <th className="text-left px-4 py-3">วันที่</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {invoices.map((inv) => (
            <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/finance/${inv.id}`} className="font-mono text-blue-600 hover:underline text-xs">
                  {inv.invoice_number}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-700">{inv.customer?.name ?? '—'}</td>
              <td className="px-4 py-3 text-right text-gray-600">฿{Number(inv.subtotal).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-gray-500">฿{Number(inv.vat_amount).toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">฿{Number(inv.total).toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[inv.status]}`}>
                  {STATUS_LABELS[inv.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {new Date(inv.created_at).toLocaleDateString('th-TH', { dateStyle: 'short' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
