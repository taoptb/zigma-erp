'use client'

import { createContext, useContext } from 'react'
import type { ShopContext } from '@/types/app.types'

const ShopCtx = createContext<ShopContext | null>(null)

export function ShopProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: ShopContext
}) {
  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>
}

export function useShop(): ShopContext {
  const ctx = useContext(ShopCtx)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
