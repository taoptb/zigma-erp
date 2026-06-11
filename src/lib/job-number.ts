import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

export function shopPrefix(slug: string): string {
  return slug.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase()
}

export function formatJobNumber(prefix: string, date: Date, sequence: number): string {
  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const seq = String(sequence).padStart(3, '0')
  return `${prefix}-${yy}${mm}${dd}-${seq}`
}

export async function nextJobNumber(
  supabase: SupabaseClient<Database>,
  shopId: string,
  shopSlug: string,
): Promise<string> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const { count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)
    .gte('created_at', todayStart)

  return formatJobNumber(shopPrefix(shopSlug), now, (count ?? 0) + 1)
}
