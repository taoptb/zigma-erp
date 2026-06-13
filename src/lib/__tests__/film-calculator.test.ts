import { describe, it, expect } from 'vitest'
import { calcFilm } from '@/lib/film-calculator'
import type { FilmPosition, CarType } from '@/types/app.types'

const makeTemplates = (entries: { carType: CarType; position: FilmPosition; lengthM: number; marginM: number }[]) =>
  entries.map((e) => ({
    car_type: e.carType,
    position: e.position,
    length_m: String(e.lengthM),
    margin_m: String(e.marginM),
  }))

describe('calcFilm', () => {
  it('returns breakdown per position with base + margin', () => {
    const templates = makeTemplates([
      { carType: 'sedan_s', position: 'front', lengthM: 1.4, marginM: 0.15 },
      { carType: 'sedan_s', position: 'rear', lengthM: 1.2, marginM: 0.15 },
    ])
    const result = calcFilm(templates, 'sedan_s', ['front', 'rear'], 10)
    expect(result.breakdown).toHaveLength(2)
    expect(result.breakdown[0]).toMatchObject({ position: 'front', baseLength: 1.4, margin: 0.15, totalLength: 1.55 })
    expect(result.breakdown[1]).toMatchObject({ position: 'rear', baseLength: 1.2, margin: 0.15, totalLength: 1.35 })
  })

  it('sums total length across positions', () => {
    const templates = makeTemplates([
      { carType: 'suv', position: 'front', lengthM: 1.6, marginM: 0.15 },
      { carType: 'suv', position: 'side_front', lengthM: 1.0, marginM: 0.15 },
    ])
    const result = calcFilm(templates, 'suv', ['front', 'side_front'], 10)
    expect(result.totalLengthM).toBeCloseTo(1.75 + 1.15, 5)
  })

  it('calculates remaining after cut', () => {
    const templates = makeTemplates([
      { carType: 'sedan_s', position: 'front', lengthM: 1.4, marginM: 0.15 },
    ])
    const result = calcFilm(templates, 'sedan_s', ['front'], 5.0)
    expect(result.remainingAfterM).toBeCloseTo(5.0 - 1.55, 5)
    expect(result.isEnough).toBe(true)
  })

  it('isEnough is false when roll is too short', () => {
    const templates = makeTemplates([
      { carType: 'sedan_s', position: 'front', lengthM: 1.4, marginM: 0.15 },
      { carType: 'sedan_s', position: 'rear', lengthM: 1.2, marginM: 0.15 },
      { carType: 'sedan_s', position: 'side_front', lengthM: 1.0, marginM: 0.15 },
      { carType: 'sedan_s', position: 'side_rear', lengthM: 1.0, marginM: 0.15 },
    ])
    const result = calcFilm(templates, 'sedan_s', ['front', 'rear', 'side_front', 'side_rear'], 2.0)
    expect(result.isEnough).toBe(false)
  })

  it('skips positions with no matching template', () => {
    const templates = makeTemplates([
      { carType: 'sedan_s', position: 'front', lengthM: 1.4, marginM: 0.15 },
    ])
    const result = calcFilm(templates, 'sedan_s', ['front', 'side_front'], 10)
    expect(result.breakdown).toHaveLength(1)
    expect(result.breakdown[0].position).toBe('front')
  })
})
