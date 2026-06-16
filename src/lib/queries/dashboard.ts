import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Supabase = SupabaseClient<Database>

export interface DashboardStats {
  todayJobs: number
  inProgressJobs: number
  todayRevenue: number
  pendingClaims: number
}

export interface DayRevenue {
  date: string // YYYY-MM-DD
  revenue: number
}

export async function getDashboardStats(supabase: Supabase, shopId: string): Promise<DashboardStats> {
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: todayJobs },
    { count: inProgressJobs },
    { data: todayInvoices },
    { count: pendingClaims },
  ] = await Promise.all([
    supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shopId)
      .eq('scheduled_date', today)
      .is('deleted_at', null),
    supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shopId)
      .eq('status', 'in_progress')
      .is('deleted_at', null),
    supabase
      .from('invoices')
      .select('total')
      .eq('shop_id', shopId)
      .eq('status', 'paid')
      .gte('paid_at', `${today}T00:00:00`)
      .lte('paid_at', `${today}T23:59:59`)
      .is('deleted_at', null),
    supabase
      .from('insurance_claims')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shopId)
      .in('status', ['waiting_docs', 'in_progress'])
      .is('deleted_at', null),
  ])

  const todayRevenue = (todayInvoices ?? []).reduce((sum, inv) => sum + Number(inv.total), 0)

  return {
    todayJobs: todayJobs ?? 0,
    inProgressJobs: inProgressJobs ?? 0,
    todayRevenue,
    pendingClaims: pendingClaims ?? 0,
  }
}

export async function getRevenueByDay(
  supabase: Supabase,
  shopId: string,
  days = 7,
): Promise<DayRevenue[]> {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - (days - 1))

  const { data } = await supabase
    .from('invoices')
    .select('paid_at, total')
    .eq('shop_id', shopId)
    .eq('status', 'paid')
    .gte('paid_at', start.toISOString())
    .lte('paid_at', end.toISOString())
    .is('deleted_at', null)

  const map: Record<string, number> = {}
  for (const inv of data ?? []) {
    if (!inv.paid_at) continue
    const date = inv.paid_at.split('T')[0]
    map[date] = (map[date] ?? 0) + Number(inv.total)
  }

  const result: DayRevenue[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const date = d.toISOString().split('T')[0]
    result.push({ date, revenue: map[date] ?? 0 })
  }

  return result
}
