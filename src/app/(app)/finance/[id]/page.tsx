import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvoice } from '@/lib/queries/invoices'
import { InvoicePreview } from '@/components/finance/invoice-preview'
import { InvoiceStatusActions } from '@/components/finance/invoice-status-actions'

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('shop_id').eq('id', user.id).single()
  if (!profile?.shop_id) redirect('/register')

  const { data: shop } = await supabase.from('shops').select('name').eq('id', profile.shop_id).single()
  const invoice = await getInvoice(supabase, profile.shop_id, id)
  if (!invoice) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">ใบแจ้งหนี้</h2>
          <p className="text-sm text-gray-400 font-mono">{invoice.invoice_number}</p>
        </div>
        <InvoiceStatusActions
          invoiceId={invoice.id}
          shopId={profile.shop_id}
          currentStatus={invoice.status}
        />
      </div>
      <InvoicePreview invoice={invoice} shopName={shop?.name ?? 'ZigmaERP'} />
    </div>
  )
}
