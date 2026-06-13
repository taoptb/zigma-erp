'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createStockMovement } from '@/lib/queries/stock'
import type { StockItem } from '@/types/app.types'

export function StockInDialog({
  item,
  shopId,
  userId,
  onClose,
  onDone,
}: {
  item: StockItem
  shopId: string
  userId: string
  onClose: () => void
  onDone: () => void
}) {
  const [quantity, setQuantity] = useState('1')
  const [unitCost, setUnitCost] = useState('')
  const [supplier, setSupplier] = useState(item.supplier_name ?? '')
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const qty = Number(quantity)
    if (!qty || qty <= 0) { setError('กรุณาระบุจำนวนที่ถูกต้อง'); return }

    setLoading(true)
    setError(null)
    const supabase = createClient()
    const result = await createStockMovement(supabase, shopId, {
      stockItemId: item.id,
      movementType: 'in',
      quantityDelta: qty,
      unitCost: unitCost ? Number(unitCost) : undefined,
      supplierName: supplier || undefined,
      reference: reference || undefined,
      createdBy: userId,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    onDone()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">รับสินค้าเข้า</h3>
            <p className="text-sm text-gray-500">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
          <span className="text-gray-500">คงเหลือปัจจุบัน: </span>
          <span className="font-semibold text-gray-900">{item.quantity} ชิ้น</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนที่รับเข้า *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
            {quantity && Number(quantity) > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                หลังรับเข้า: {item.quantity + Number(quantity)} ชิ้น
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคาต่อหน่วย (บาท)</label>
            <input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              min={0}
              placeholder={String(item.cost_price)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ผู้จัดจำหน่าย</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขอ้างอิง / ใบส่งของ</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="INV-2026-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'กำลังบันทึก...' : 'รับเข้าสต็อก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
