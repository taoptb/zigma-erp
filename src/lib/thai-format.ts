type DateInput = Date | string | number

function toDate(input: DateInput): Date {
  return input instanceof Date ? input : new Date(input)
}

export function thaiDate(input: DateInput): string {
  return toDate(input).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function thaiShortDate(input: DateInput): string {
  const d = toDate(input)
  const buddhistYear = d.getUTCFullYear() + 543
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${dd}/${mm}/${buddhistYear}`
}

export function thaiCurrency(amount: number): string {
  return '฿' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
