import { describe, it, expect } from 'vitest'
import { thaiDate, thaiShortDate, thaiCurrency } from '@/lib/thai-format'

describe('thaiShortDate', () => {
  it('formats as DD/MM/YYYY Buddhist era', () => {
    const result = thaiShortDate(new Date('2025-03-05T00:00:00Z'))
    expect(result).toBe('05/03/2568')
  })

  it('accepts ISO string', () => {
    const result = thaiShortDate('2024-01-15T00:00:00Z')
    expect(result).toBe('15/01/2567')
  })

  it('adds 543 to get Buddhist year', () => {
    const result = thaiShortDate(new Date('2023-12-31T00:00:00Z'))
    expect(result).toBe('31/12/2566')
  })
})

describe('thaiDate', () => {
  it('returns a non-empty string', () => {
    const result = thaiDate(new Date('2025-06-08T00:00:00Z'))
    expect(result.length).toBeGreaterThan(0)
    expect(typeof result).toBe('string')
  })
})

describe('thaiCurrency', () => {
  it('formats as baht with comma separators', () => {
    expect(thaiCurrency(10700)).toBe('฿10,700.00')
  })

  it('formats zero', () => {
    expect(thaiCurrency(0)).toBe('฿0.00')
  })

  it('formats large amounts', () => {
    expect(thaiCurrency(1250000)).toBe('฿1,250,000.00')
  })
})
