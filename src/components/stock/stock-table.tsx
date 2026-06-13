'use client'

import type { StockItem, StockStatus, StockCategory } from '@/types/app.types'

const STATUS_STYLES: Record<StockStatus, string> = {
  adequate: 'bg-green-100 text-green-700',
  low: 'bg-yellow-100 text-yellow-700',
  near_out: 'bg-orange-100 text-orange-700',
  out_of_stock: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<StockStatus, string> = {
  adequate: 'เพียงพอ',
  low: 'ใกล้หมด',
  near_out: 'เหลือน้อย',
  out_of_stock: 'หมดแล้ว',
}

const CATEGORY_LABELS: Record<StockCategory, string> = {
  glass: 'กระจก',
  film: 'ฟิล์ม',
  seal_rubber: 'ยางอุดขอบ',
  tool: 'เครื่องมือ',
  other: 'อื่นๆ',
}

export function StockTable({
  items,
  onStockIn,
}: {
  items: StockItem[]
  onStockIn: (item: StockItem) => void
}) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">ยังไม่มีรายการสินค้า</p>
      </div>
    )
  }

  const lowItems = items.filter((i) => i.status === 'low' || i.status === 'near_out' || i.status === 'out_of_stock')

  return (
    <div className="space-y-4">
      {lowItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-orange-700 mb-2">⚠ สินค้าใกล้หมด {lowItems.length} รายการ</p>
          <div className="flex flex-wrap gap-2">
            {lowItems.map((item) => (
              <span key={item.id} className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[item.status]}`}>
                {item.name} ({item.quantity}/{item.min_quantity})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
              <th className="text-left px-4 py-3">รหัส / ชื่อสินค้า</th>
              <th className="text-left px-4 py-3">หมวดหมู่</th>
              <th className="text-right px-4 py-3">คงเหลือ</th>
              <th className="text-right px-4 py-3">ขั้นต่ำ</th>
              <th className="text-right px-4 py-3">ราคาขาย</th>
              <th className="text-left px-4 py-3">สถานะ</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{item.product_code}</p>
                  {(item.vehicle_make || item.vehicle_model) && (
                    <p className="text-xs text-gray-400">{item.vehicle_make} {item.vehicle_model}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{CATEGORY_LABELS[item.category]}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-gray-400">{item.min_quantity}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  ฿{Number(item.selling_price).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onStockIn(item)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    รับเข้า
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
