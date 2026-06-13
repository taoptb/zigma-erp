'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createInvoice } from '@/lib/queries/invoices'
import type { InvoiceLineItem } from '@/lib/queries/invoices'

export function NewInvoiceDialog({
  shopId,
  shopSlug,
  userId,
}: {
  shopId: string
  shopSlug: string
  userId: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<InvoiceLineItem[]>([
    { description: '', quantity: 1, unitPrice: 0 },
  ])

  function addItem() {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }])
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateItem(idx: number, field: keyof InvoiceLineItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const vat = subtotal * 0.07
  const total = subtotal + vat

  function resetForm() {
    setCustomerPhone('')
    setNotes('')
    setItems([{ description: '', quantity: 1, unitPrice: 0 }])
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (items.every((i) => !i.description)) {
      setError('กรุณาระบุรายการสินค้า/บริการ')
      return
    }

    setLoading(true)
    setError(null)

    let customerId: string | undefined
    if (customerPhone) {
      const sb = createClient()
      const { data } = await sb
        .from('customers')
        .select('id')
        .eq('shop_id', shopId)
        .eq('phone', customerPhone)
        .maybeSingle()
      customerId = data?.id
    }

    const supabase = createClient()
    const result = await createInvoice(supabase, shopId, userId, {
      customerId,
      items: items.filter((i) => i.description),
      notes: notes || undefined,
      shopSlug,
    })

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    setOpen(false)
    resetForm()
    setLoading(false)
    router.push(`/finance/${result.invoiceId}`)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
      >
        + สร้างใบแจ้งหนี้
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">สร้างใบแจ้งหนี้</h3>
          <button
            onClick={() => { setOpen(false); resetForm() }}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรลูกค้า (ค้นหา)</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="081-234-5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">ถ้ามีในระบบจะเชื่อมอัตโนมัติ</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">รายการ *</label>
              <button type="button" onClick={addItem} className="text-xs text-blue-600 hover:underline">
                + เพิ่มรายการ
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    placeholder="รายการ/บริการ"
                    className="col-span-6 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                    min={1}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <input
                    type="number"
                    value={item.unitPrice || ''}
                    onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                    placeholder="ราคา"
                    min={0}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length === 1}
                    className="col-span-1 text-gray-400 hover:text-red-500 disabled:opacity-30 text-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>ยอดก่อน VAT</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VAT 7%</span>
              <span>฿{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1 mt-1">
              <span>รวมทั้งสิ้น</span>
              <span>฿{total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setOpen(false); resetForm() }}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างใบแจ้งหนี้'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
