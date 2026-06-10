import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ShopProvider } from '@/context/shop-context'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import type { ShopContext } from '@/types/app.types'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.shop_id) redirect('/register')

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('id', profile.shop_id)
    .single()

  if (!shop) redirect('/register')

  const shopContext: ShopContext = {
    shopId: shop.id,
    shop,
    profile,
    role: profile.role,
  }

  return (
    <ShopProvider value={shopContext}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ShopProvider>
  )
}
