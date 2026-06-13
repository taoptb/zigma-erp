'use client'

import type { InvoiceWithItems, InvoiceStatus } from '@/types/app.types'

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'ร่าง',
  pending_payment: 'รอชำระ',
  paid: 'ชำระแล้ว',
  waiting_insurance: 'รอประกัน',
  cancelled: 'ยกเลิก',
}

export function InvoicePreview({ invoice, shopName }: { invoice: InvoiceWithItems; shopName: string }) {
  return (
    <div>
      <div className="flex gap-2 mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900"
        >
          พิมพ์ / บันทึก PDF
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl print:border-none print:rounded-none print:p-0 print:max-w-full">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{shopName}</h1>
            <p className="text-sm text-gray-500 mt-1">ใบแจ้งหนี้ / Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 font-mono">{invoice.invoice_number}</p>
            <p className="text-sm text-gray-500">
              {new Date(invoice.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {STATUS_LABELS[invoice.status]}
            </span>
          </div>
        </div>

        {invoice.customer && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ลูกค้า</p>
            <p className="font-semibold text-gray-900">{invoice.customer.name}</p>
            {invoice.customer.phone && <p className="text-sm text-gray-500">{invoice.customer.phone}</p>}
          </div>
        )}

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 font-semibold text-gray-700">รายการ</th>
              <th className="text-center py-2 font-semibold text-gray-700 w-16">จำนวน</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-28">ราคาต่อหน่วย</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-28">รวม</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2 text-gray-800">{item.description}</td>
                <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                <td className="py-2 text-right text-gray-600">฿{Number(item.unit_price).toLocaleString()}</td>
                <td className="py-2 text-right text-gray-800 font-medium">
                  ฿{Number(item.line_total).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>ยอดก่อน VAT</span>
              <span>฿{Number(invoice.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VAT ({(Number(invoice.vat_rate) * 100).toFixed(0)}%)</span>
              <span>฿{Number(invoice.vat_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t-2 border-gray-200 pt-2 mt-2 text-base">
              <span>รวมทั้งสิ้น</span>
              <span>฿{Number(invoice.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">หมายเหตุ</p>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
