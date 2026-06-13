import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { FilmRoll, FilmTemplate } from '@/types/app.types'

type Supabase = SupabaseClient<Database>

// ─── Film Rolls ───────────────────────────────────────────────────────────────

export async function listFilmRolls(
  supabase: Supabase,
  shopId: string,
): Promise<FilmRoll[]> {
  const { data, error } = await supabase
    .from('film_rolls')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function getFilmRoll(
  supabase: Supabase,
  shopId: string,
  rollId: string,
): Promise<FilmRoll | null> {
  const { data } = await supabase
    .from('film_rolls')
    .select('*')
    .eq('shop_id', shopId)
    .eq('id', rollId)
    .is('deleted_at', null)
    .single()

  return data ?? null
}

// ─── Film Templates ───────────────────────────────────────────────────────────

export async function listFilmTemplates(
  supabase: Supabase,
  shopId: string,
): Promise<FilmTemplate[]> {
  // Fetch all templates: shop-specific and global defaults (shop_id IS NULL)
  const { data, error } = await supabase
    .from('film_templates')
    .select('*')
    .or(`shop_id.eq.${shopId},shop_id.is.null`)

  if (error) throw error

  const all = data ?? []

  // Build a set of car_type+position keys that have a shop-specific template
  const shopKeys = new Set<string>()
  for (const t of all) {
    if (t.shop_id === shopId) {
      shopKeys.add(`${t.car_type}::${t.position}`)
    }
  }

  // Filter out global defaults that are overridden by a shop-specific template
  return all.filter(
    (t) =>
      t.shop_id === shopId ||
      !shopKeys.has(`${t.car_type}::${t.position}`),
  )
}

// ─── Film Cuts ────────────────────────────────────────────────────────────────

export interface CreateFilmCutInput {
  filmRollId: string
  carType: string
  positions: string[]
  lengthUsedM: number
  remainingAfterM: number
  jobId?: string
  cutBy?: string
  notes?: string
}

export async function createFilmCut(
  supabase: Supabase,
  shopId: string,
  input: CreateFilmCutInput,
): Promise<{ cutId: string } | { error: string }> {
  // (a) Update remaining_length_m on the roll
  const { error: updErr } = await supabase
    .from('film_rolls')
    .update({ remaining_length_m: String(input.remainingAfterM) })
    .eq('id', input.filmRollId)
    .eq('shop_id', shopId)

  if (updErr) return { error: updErr.message }

  // (b) Insert the cut record
  const { data, error: insErr } = await supabase
    .from('film_cuts')
    .insert({
      shop_id: shopId,
      film_roll_id: input.filmRollId,
      car_type: input.carType,
      positions: input.positions,
      length_used_m: String(input.lengthUsedM),
      remaining_after_m: String(input.remainingAfterM),
      job_id: input.jobId ?? null,
      cut_by: input.cutBy ?? null,
      notes: input.notes ?? null,
    })
    .select('id')
    .single()

  if (insErr) return { error: insErr.message }

  return { cutId: data.id }
}

// ─── Create Film Roll ─────────────────────────────────────────────────────────

export async function createFilmRoll(
  supabase: Supabase,
  shopId: string,
  input: {
    name: string
    brand?: string
    specification?: string
    widthCm: number
    totalLengthM: number
    colorHex?: string
    minLengthAlertM?: number
  },
): Promise<{ error?: string }> {
  const totalStr = String(input.totalLengthM)

  const { error } = await supabase.from('film_rolls').insert({
    shop_id: shopId,
    name: input.name,
    brand: input.brand ?? null,
    specification: input.specification ?? null,
    width_cm: String(input.widthCm),
    total_length_m: totalStr,
    remaining_length_m: totalStr,
    color_hex: input.colorHex ?? '#000000',
    min_length_alert_m: input.minLengthAlertM != null
      ? String(input.minLengthAlertM)
      : '1',
  })

  return error ? { error: error.message } : {}
}
