import { describe, it, expect } from 'vitest'
import { formatInvoiceNumber } from '@/lib/invoice-number'

describe('formatInvoiceNumber', () => {
  it('formats INV-YYMM-seq', () => {
    const d = new Date('2026-06-13T00:00:00Z')
    expect(formatInvoiceNumber('ZIG', d, 1)).toBe('ZIG-INV-2606-001')
    expect(formatInvoiceNumber('ZIG', d, 42)).toBe('ZIG-INV-2606-042')
    expect(formatInvoiceNumber('ZIG', d, 1000)).toBe('ZIG-INV-2606-1000')
  })

  it('zero-pads sequence to 3 digits', () => {
    const d = new Date('2026-01-01T00:00:00Z')
    expect(formatInvoiceNumber('AB', d, 5)).toBe('AB-INV-2601-005')
  })
})
