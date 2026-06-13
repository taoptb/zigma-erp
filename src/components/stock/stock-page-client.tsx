'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StockTable } from './stock-table'
import { StockInDialog } from './stock-in-dialog'
import type { StockItem } from '@/types/app.types'

export function StockPageClient({
  items,
  shopId,
  userId,
}: {
  items: StockItem[]
  shopId: string
  userId: string
}) {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

  function handleDone() {
    setSelectedItem(null)
    router.refresh()
  }

  return (
    <>
      <StockTable items={items} onStockIn={setSelectedItem} />
      {selectedItem && (
        <StockInDialog
          item={selectedItem}
          shopId={shopId}
          userId={userId}
          onClose={() => setSelectedItem(null)}
          onDone={handleDone}
        />
      )}
    </>
  )
}
