import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardStats, getRevenueByDay } from '@/lib/queries/dashboard'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { thaiCurrency } from '@/lib/thai-format'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()
  if (!profile?.shop_id) redirect('/register')

  const [stats, revenueData] = await Promise.all([
    getDashboardStats(supabase, profile.shop_id),
    getRevenueByDay(supabase, profile.shop_id, 7),
  ])

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">ภาพรวมวันนี้</h2>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="งานวันนี้" value={stats.todayJobs} unit="งาน" color="blue" />
        <StatCard label="กำลังดำเนินการ" value={stats.inProgressJobs} unit="งาน" color="orange" />
        <StatCard label="รายได้วันนี้" value={thaiCurrency(stats.todayRevenue)} unit="" color="green" />
        <StatCard label="เคลมรอดำเนินการ" value={stats.pendingClaims} unit="เรื่อง" color="purple" />
      </div>

      <RevenueChart data={revenueData} />
    </div>
  )
}

const COLOR_MAP = {
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
}

function StatCard({
  label,
  value,
  unit,
  color,
}: {
  label: string
  value: number | string
  unit: string
  color: 'blue' | 'orange' | 'green' | 'purple'
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
      </div>
      <div className={`mt-2 inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${COLOR_MAP[color]}`}>
        สด
      </div>
    </div>
  )
}
