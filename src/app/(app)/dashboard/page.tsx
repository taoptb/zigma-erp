import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]
  const { count: todayJobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('scheduled_date', today)

  const { count: inProgressCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress')

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">ภาพรวมวันนี้</h2>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="งานวันนี้" value={todayJobsCount ?? 0} unit="งาน" color="blue" />
        <StatCard label="กำลังดำเนินการ" value={inProgressCount ?? 0} unit="งาน" color="orange" />
        <StatCard label="รายได้วันนี้" value="—" unit="฿" color="green" />
        <StatCard label="เคลมประกัน" value="—" unit="เรื่อง" color="purple" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500 text-center py-8">
          Dashboard chart จะเพิ่มใน Plan 2 (Core Modules)
        </p>
      </div>
    </div>
  )
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
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-400 mb-0.5">{unit}</span>
      </div>
      <div className={`mt-2 inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${colorMap[color]}`}>
        สด
      </div>
    </div>
  )
}
