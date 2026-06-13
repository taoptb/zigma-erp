import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { listInvoices } from '@/lib/queries/invoices'
import { InvoiceTable } from '@/components/finance/invoice-table'
import { NewInvoiceDialog } from '@/components/finance/new-invoice-dialog'

export default async function FinancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('shop_id').eq('id', user.id).single()
  if (!profile?.shop_id) redirect('/register')

  const { data: shop } = await supabase.from('shops').select('id, slug').eq('id', profile.shop_id).single()
  const invoices = await listInvoices(supabase, profile.shop_id)

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.total), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">การเงิน</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {invoices.length} ใบแจ้งหนี้ · รายได้รวม ฿{totalRevenue.toLocaleString()}
          </p>
        </div>
        <NewInvoiceDialog shopId={profile.shop_id} shopSlug={shop?.slug ?? ''} userId={user.id} />
      </div>
      <InvoiceTable invoices={invoices} />
    </div>
  )
}
