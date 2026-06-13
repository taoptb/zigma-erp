import type { FilmRoll } from '@/types/app.types'

export function FilmRollCard({ roll }: { roll: FilmRoll }) {
  const totalM = Number(roll.total_length_m)
  const remainingM = Number(roll.remaining_length_m)
  const alertM = Number(roll.min_length_alert_m)
  const pct = totalM > 0 ? (remainingM / totalM) * 100 : 0
  const isLow = remainingM <= alertM

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: roll.color_hex }}
            />
            <h3 className="font-semibold text-gray-900 text-sm">{roll.name}</h3>
          </div>
          {roll.brand && <p className="text-xs text-gray-400 mt-0.5">{roll.brand}</p>}
          {roll.specification && <p className="text-xs text-gray-400">{roll.specification}</p>}
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
            {remainingM.toFixed(1)} m
          </p>
          <p className="text-xs text-gray-400">/ {totalM.toFixed(1)} m</p>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? 'bg-red-400' : 'bg-blue-500'}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      {isLow && <p className="text-xs text-red-500 mt-2">⚠ เหลือน้อยกว่า {alertM} m</p>}
      <p className="text-xs text-gray-400 mt-1">กว้าง {Number(roll.width_cm)} cm</p>
    </div>
  )
}
