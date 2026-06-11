import { describe, it, expect } from 'vitest'
import { shopPrefix, formatJobNumber } from '@/lib/job-number'

describe('shopPrefix', () => {
  it('takes first 3 alphanumeric chars, uppercased', () => {
    expect(shopPrefix('zigma-erp')).toBe('ZIG')
    expect(shopPrefix('my-shop')).toBe('MYS')
    expect(shopPrefix('ab')).toBe('AB')
    expect(shopPrefix('123-test')).toBe('123')
  })

  it('strips non-alphanumeric before slicing', () => {
    expect(shopPrefix('---abc')).toBe('ABC')
    expect(shopPrefix('อู่กระจก')).toBe('')
  })
})

describe('formatJobNumber', () => {
  it('formats prefix-YYMMDD-seq', () => {
    const d = new Date('2026-06-11T00:00:00Z')
    expect(formatJobNumber('ZIG', d, 1)).toBe('ZIG-260611-001')
    expect(formatJobNumber('ZIG', d, 99)).toBe('ZIG-260611-099')
    expect(formatJobNumber('ZIG', d, 1000)).toBe('ZIG-260611-1000')
  })

  it('zero-pads sequence to 3 digits', () => {
    const d = new Date('2026-01-01T00:00:00Z')
    expect(formatJobNumber('AB', d, 5)).toBe('AB-260101-005')
  })
})
