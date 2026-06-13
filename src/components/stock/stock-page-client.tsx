'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StockTable } from './stock-table'
import type { StockItem } from '@/types/app.types'

// StockInDialog will be imported once created in Task 11
// For now define a stub so this file compiles
function StockInDialogPlaceholder({
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
  return null
}

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
        <StockInDialogPlaceholder
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
