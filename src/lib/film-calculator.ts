import type { FilmCalculationResult, FilmCalculationBreakdown, FilmPosition, CarType } from '@/types/app.types'

interface TemplateRow {
  car_type: string
  position: string
  length_m: string
  margin_m: string
}

export function calcFilm(
  templates: TemplateRow[],
  carType: CarType,
  positions: FilmPosition[],
  remainingM: number,
): FilmCalculationResult {
  const breakdown: FilmCalculationBreakdown[] = []

  for (const pos of positions) {
    const tpl = templates.find((t) => t.car_type === carType && t.position === pos)
    if (!tpl) continue

    const baseLength = Number(tpl.length_m)
    const margin = Number(tpl.margin_m ?? 0.15)
    const totalLength = Math.round((baseLength + margin) * 1e10) / 1e10
    breakdown.push({
      position: pos,
      baseLength,
      margin,
      totalLength,
    })
  }

  const totalLengthM = breakdown.reduce((sum, b) => sum + b.totalLength, 0)
  const remainingAfterM = remainingM - totalLengthM

  return {
    breakdown,
    totalLengthM,
    remainingAfterM,
    isEnough: remainingAfterM >= 0,
  }
}
