import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { StockItem, StockCategory } from '@/types/app.types'

type Supabase = SupabaseClient<Database>

export async function listStockItems(
  supabase: Supabase,
  shopId: string,
): Promise<StockItem[]> {
  const { data, error } = await supabase
    .from('stock_items')
    .select('*')
    .eq('shop_id', shopId)
    .is('deleted_at', null)
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function getStockItem(
  supabase: Supabase,
  shopId: string,
  itemId: string,
): Promise<StockItem | null> {
  const { data } = await supabase
    .from('stock_items')
    .select('*')
    .eq('shop_id', shopId)
    .eq('id', itemId)
    .is('deleted_at', null)
    .single()

  return data ?? null
}

export interface StockMovementInput {
  stockItemId: string
  movementType: 'in' | 'out' | 'adjustment'
  quantityDelta: number
  unitCost?: number
  supplierName?: string
  reference?: string
  createdBy?: string
}

export async function createStockMovement(
  supabase: Supabase,
  shopId: string,
  input: StockMovementInput,
): Promise<{ error?: string }> {
  const { data: item } = await supabase
    .from('stock_items')
    .select('quantity')
    .eq('id', input.stockItemId)
    .eq('shop_id', shopId)
    .single()

  if (!item) return { error: 'ไม่พบสินค้า' }

  const quantityAfter = item.quantity + input.quantityDelta
  if (quantityAfter < 0) return { error: 'สต็อกไม่เพียงพอ' }

  const { error: movErr } = await supabase.from('stock_movements').insert({
    shop_id: shopId,
    stock_item_id: input.stockItemId,
    movement_type: input.movementType,
    quantity_delta: input.quantityDelta,
    quantity_after: quantityAfter,
    unit_cost: input.unitCost ?? null,
    supplier_name: input.supplierName ?? null,
    reference: input.reference ?? null,
    created_by: input.createdBy ?? null,
  })
  if (movErr) return { error: movErr.message }

  const { error: updErr } = await supabase
    .from('stock_items')
    .update({ quantity: quantityAfter })
    .eq('id', input.stockItemId)
    .eq('shop_id', shopId)
  if (updErr) return { error: updErr.message }

  return {}
}

export async function createStockItem(
  supabase: Supabase,
  shopId: string,
  input: {
    productCode: string
    name: string
    category: StockCategory
    quantity: number
    minQuantity: number
    costPrice: number
    sellingPrice: number
    vehicleMake?: string
    vehicleModel?: string
    supplierName?: string
  },
): Promise<{ error?: string }> {
  const { error } = await supabase.from('stock_items').insert({
    shop_id: shopId,
    product_code: input.productCode,
    name: input.name,
    category: input.category,
    quantity: input.quantity,
    min_quantity: input.minQuantity,
    cost_price: input.costPrice,
    selling_price: input.sellingPrice,
    vehicle_make: input.vehicleMake ?? null,
    vehicle_model: input.vehicleModel ?? null,
    supplier_name: input.supplierName ?? null,
  })
  return error ? { error: error.message } : {}
}
