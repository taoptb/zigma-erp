import type { DayRevenue } from '@/lib/queries/dashboard'
import { thaiCurrency } from '@/lib/thai-format'

export function RevenueChart({ data }: { data: DayRevenue[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)
  const chartH = 120
  const barW = 32
  const gap = 8
  const chartW = data.length * (barW + gap) - gap
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">รายได้ 7 วันล่าสุด</h3>

      <svg
        width={chartW}
        height={chartH + 40}
        viewBox={`0 0 ${chartW} ${chartH + 40}`}
        className="w-full overflow-visible"
      >
        {data.map((day, i) => {
          const barH = maxRevenue > 0 ? (day.revenue / maxRevenue) * chartH : 0
          const x = i * (barW + gap)
          const y = chartH - barH
          const isToday = day.date === todayStr

          return (
            <g key={day.date}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(barH, 2)}
                rx={4}
                fill={isToday ? '#3b82f6' : '#bfdbfe'}
              />
              {day.revenue > 0 && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#6b7280">
                  {day.revenue >= 1000
                    ? `${(day.revenue / 1000).toFixed(0)}k`
                    : String(Math.round(day.revenue))}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={chartH + 16}
                textAnchor="middle"
                fontSize={9}
                fill={isToday ? '#3b82f6' : '#9ca3af'}
                fontWeight={isToday ? 'bold' : 'normal'}
              >
                {day.date.slice(8)}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 text-xs text-gray-400">
        รวม 7 วัน: {thaiCurrency(data.reduce((s, d) => s + d.revenue, 0))}
      </div>
    </div>
  )
}
