'use client'

import { useShop } from '@/context/shop-context'
import type { UserRole } from '@/types/app.types'

export function RoleGate({
  allow,
  children,
  fallback,
}: {
  allow: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { role } = useShop()
  if (!allow.includes(role)) return <>{fallback ?? null}</>
  return <>{children}</>
}
