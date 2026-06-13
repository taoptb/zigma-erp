import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { shopPrefix } from '@/lib/job-number'

export function formatInvoiceNumber(prefix: string, date: Date, sequence: number): string {
  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const seq = String(sequence).padStart(3, '0')
  return `${prefix}-INV-${yy}${mm}-${seq}`
}

export async function nextInvoiceNumber(
  supabase: SupabaseClient<Database>,
  shopId: string,
  shopSlug: string,
): Promise<string> {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)
    .gte('created_at', monthStart)

  return formatInvoiceNumber(shopPrefix(shopSlug), now, (count ?? 0) + 1)
}
