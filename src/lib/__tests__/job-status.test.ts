import { describe, it, expect } from 'vitest'
import { getNextStatuses, JOB_STATUS_LABELS, JOB_STATUS_COLORS } from '@/lib/job-status'
import type { JobStatus } from '@/types/app.types'

describe('getNextStatuses', () => {
  it('quote → pending or cancelled', () => {
    expect(getNextStatuses('quote')).toEqual(['pending', 'cancelled'])
  })
  it('in_progress → waiting_parts, claim, or done_waiting', () => {
    expect(getNextStatuses('in_progress')).toEqual(['waiting_parts', 'claim', 'done_waiting'])
  })
  it('delivered has no next statuses', () => {
    expect(getNextStatuses('delivered')).toEqual([])
  })
  it('cancelled has no next statuses', () => {
    expect(getNextStatuses('cancelled')).toEqual([])
  })
})

describe('JOB_STATUS_LABELS', () => {
  it('has a Thai label for every status', () => {
    const statuses: JobStatus[] = [
      'quote', 'pending', 'in_progress', 'waiting_parts',
      'claim', 'done_waiting', 'delivered', 'cancelled',
    ]
    statuses.forEach((s) => {
      expect(JOB_STATUS_LABELS[s]).toBeTruthy()
    })
  })
})

describe('JOB_STATUS_COLORS', () => {
  it('has a Tailwind class for every status', () => {
    const statuses: JobStatus[] = [
      'quote', 'pending', 'in_progress', 'waiting_parts',
      'claim', 'done_waiting', 'delivered', 'cancelled',
    ]
    statuses.forEach((s) => {
      expect(JOB_STATUS_COLORS[s]).toMatch(/bg-\w/)
    })
  })
})
