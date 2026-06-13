import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { Profile } from '@/types/app.types'

type Supabase = SupabaseClient<Database>

export async function listAllStaff(supabase: Supabase, shopId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_id', shopId)
    .order('display_name')
  if (error) throw error
  return data ?? []
}

export async function listTechnicians(supabase: Supabase, shopId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('shop_id', shopId)
    .eq('role', 'technician')
    .order('display_name')
  if (error) throw error
  return data ?? []
}

export async function assignJob(
  supabase: Supabase,
  shopId: string,
  jobId: string,
  technicianId: string,
  assignedBy: string,
  isPrimary = true,
): Promise<{ error?: string }> {
  const { error: jobErr } = await supabase
    .from('jobs')
    .update({ technician_id: technicianId })
    .eq('id', jobId)
    .eq('shop_id', shopId)
  if (jobErr) return { error: jobErr.message }

  const { error: assignErr } = await supabase
    .from('job_assignments')
    .insert({
      shop_id: shopId,
      job_id: jobId,
      technician_id: technicianId,
      assigned_by: assignedBy,
      is_primary: isPrimary,
    })
  return assignErr ? { error: assignErr.message } : {}
}
