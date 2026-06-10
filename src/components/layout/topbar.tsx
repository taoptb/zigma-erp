'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useShop } from '@/context/shop-context'

const ROLE_LABELS: Record<string, string> = {
  owner: 'เจ้าของ',
  manager: 'ผู้จัดการ',
  technician: 'ช่าง',
  accountant: 'บัญชี',
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'แดชบอร์ด',
  '/jobs': 'รับงาน / ใบเสนอราคา',
  '/tracking': 'ติดตามงาน',
  '/claims': 'เคลมประกัน',
  '/stock': 'สต็อกกระจก / อะไหล่',
  '/film': 'ฟิล์มกรองแสง',
  '/finance': 'การเงิน / ใบแจ้งหนี้',
  '/team': 'ทีมช่าง',
  '/settings': 'ตั้งค่า',
}

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, role } = useShop()

  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname.startsWith(path)
  )?.[1] ?? 'ZigmaERP'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: profile.avatar_color }}
          >
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">{profile.display_name}</p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[role] ?? role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  )
}
