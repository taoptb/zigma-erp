'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useShop } from '@/context/shop-context'
import type { UserRole } from '@/types/app.types'

const NAV_ITEMS: {
  href: string
  label: string
  icon: string
  allowedRoles: UserRole[]
}[] = [
  { href: '/dashboard', label: 'แดชบอร์ด', icon: '◉', allowedRoles: ['owner', 'manager', 'technician', 'accountant'] },
  { href: '/jobs', label: 'รับงาน', icon: '🔧', allowedRoles: ['owner', 'manager', 'technician'] },
  { href: '/tracking', label: 'ติดตามงาน', icon: '🚗', allowedRoles: ['owner', 'manager', 'technician'] },
  { href: '/claims', label: 'เคลมประกัน', icon: '📋', allowedRoles: ['owner', 'manager', 'accountant'] },
  { href: '/stock', label: 'สต็อก', icon: '📦', allowedRoles: ['owner', 'manager', 'technician'] },
  { href: '/film', label: 'ฟิล์ม', icon: '🎞', allowedRoles: ['owner', 'manager', 'technician'] },
  { href: '/finance', label: 'การเงิน', icon: '💰', allowedRoles: ['owner', 'manager', 'accountant'] },
  { href: '/team', label: 'ทีมช่าง', icon: '👥', allowedRoles: ['owner', 'manager'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { role, shop } = useShop()

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(role)
  )

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">ZigmaERP</p>
        <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{shop.name}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          ⚙ ตั้งค่า
        </Link>
      </div>
    </aside>
  )
}
