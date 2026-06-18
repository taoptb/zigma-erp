import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { InvoiceWithItems, InvoiceStatus } from '@/types/app.types'
import { nextInvoiceNumber } from '@/lib/invoice-number'

type Supabase = SupabaseClient<Database>

export async function listInvoices(
  supabase: Supabase,
  shopId: string,
): Promise<InvoiceWithItems[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(id, name, phone),
      items:invoice_items(*)
    `)
    .eq('shop_id', shopId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return (data ?? []) as unknown as InvoiceWithItems[]
}

export async function getInvoice(
  supabase: Supabase,
  shopId: string,
  invoiceId: string,
): Promise<InvoiceWithItems | null> {
  const { data } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(id, name, phone),
      items:invoice_items(*)
    `)
    .eq('shop_id', shopId)
    .eq('id', invoiceId)
    .is('deleted_at', null)
    .single()

  return data as unknown as InvoiceWithItems | null
}

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface CreateInvoiceInput {
  customerId?: string
  jobId?: string
  claimId?: string
  items: InvoiceLineItem[]
  vatRate?: number
  notes?: string
  billedToName?: string
  billedToPhone?: string
  licensePlate?: string
  shopSlug: string
}

export async function createInvoice(
  supabase: Supabase,
  shopId: string,
  issuedBy: string,
  input: CreateInvoiceInput,
): Promise<{ invoiceId: string } | { error: string }> {
  const vatRate = input.vatRate ?? 0.07
  const subtotal = input.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const invoiceNumber = await nextInvoiceNumber(supabase, shopId, input.shopSlug)

  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .insert({
      shop_id: shopId,
      invoice_number: invoiceNumber,
      customer_id: input.customerId ?? null,
      job_id: input.jobId ?? null,
      claim_id: input.claimId ?? null,
      billed_to_name: input.billedToName ?? null,
      billed_to_phone: input.billedToPhone ?? null,
      license_plate: input.licensePlate ?? null,
      subtotal,
      vat_rate: vatRate,
      status: 'draft',
      notes: input.notes ?? null,
      issued_by: issuedBy,
    })
    .select('id')
    .single()

  if (invErr) return { error: invErr.message }

  const lineItems = input.items.map((i) => ({
    shop_id: shopId,
    invoice_id: invoice.id,
    description: i.description,
    quantity: i.quantity,
    unit_price: i.unitPrice,
  }))

  const { error: itemsErr } = await supabase.from('invoice_items').insert(lineItems)
  if (itemsErr) return { error: itemsErr.message }

  return { invoiceId: invoice.id }
}

export async function updateInvoiceStatus(
  supabase: Supabase,
  shopId: string,
  invoiceId: string,
  status: InvoiceStatus,
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId)
    .eq('shop_id', shopId)

  return error ? { error: error.message } : {}
}
