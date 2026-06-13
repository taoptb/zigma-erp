import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { listStockItems } from '@/lib/queries/stock'
import { StockPageClient } from '@/components/stock/stock-page-client'

export default async function StockPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()
  if (!profile?.shop_id) redirect('/register')

  const items = await listStockItems(supabase, profile.shop_id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">สต็อกสินค้า</h2>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} รายการ</p>
        </div>
      </div>
      <StockPageClient items={items} shopId={profile.shop_id} userId={user.id} />
    </div>
  )
}
