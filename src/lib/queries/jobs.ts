import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { JobWithRelations, JobStatus, JobType } from '@/types/app.types'
import { nextJobNumber } from '@/lib/job-number'

type Supabase = SupabaseClient<Database>

export async function listJobs(
  supabase: Supabase,
  shopId: string,
): Promise<JobWithRelations[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      vehicle:vehicles(id, license_plate, make, model, year, color),
      customer:customers(id, name, phone),
      technician:profiles!jobs_technician_id_fkey(id, display_name, avatar_color)
    `)
    .eq('shop_id', shopId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return (data ?? []) as unknown as JobWithRelations[]
}

export async function getJob(
  supabase: Supabase,
  shopId: string,
  jobId: string,
): Promise<JobWithRelations | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      vehicle:vehicles(id, license_plate, make, model, year, color),
      customer:customers(id, name, phone),
      technician:profiles!jobs_technician_id_fkey(id, display_name, avatar_color)
    `)
    .eq('shop_id', shopId)
    .eq('id', jobId)
    .is('deleted_at', null)
    .single()

  if (error) return null
  return data as unknown as JobWithRelations
}

export interface CreateJobInput {
  licensePlate: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear?: number
  customerName?: string
  customerPhone?: string
  jobType: JobType
  price: number
  scheduledDate?: string
  notes?: string
  isInsuranceClaim?: boolean
  insuranceCompany?: string
  shopSlug: string
}

export async function createJob(
  supabase: Supabase,
  shopId: string,
  createdBy: string,
  input: CreateJobInput,
): Promise<{ jobId: string } | { error: string }> {
  // 1. Upsert customer (by phone if provided, else always create new)
  let customerId: string | null = null
  if (input.customerName) {
    if (input.customerPhone) {
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('shop_id', shopId)
        .eq('phone', input.customerPhone)
        .maybeSingle()
      if (existing) {
        customerId = existing.id
      }
    }
    if (!customerId) {
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({ shop_id: shopId, name: input.customerName, phone: input.customerPhone ?? null })
        .select('id')
        .single()
      if (error) return { error: error.message }
      customerId = newCustomer.id
    }
  }

  // 2. Find or create vehicle by license plate
  let vehicleId: string | null = null
  const { data: existingVehicle } = await supabase
    .from('vehicles')
    .select('id')
    .eq('shop_id', shopId)
    .eq('license_plate', input.licensePlate.toUpperCase())
    .maybeSingle()

  if (existingVehicle) {
    vehicleId = existingVehicle.id
    if (customerId) {
      await supabase.from('vehicles').update({ customer_id: customerId }).eq('id', vehicleId)
    }
  } else {
    const { data: newVehicle, error } = await supabase
      .from('vehicles')
      .insert({
        shop_id: shopId,
        license_plate: input.licensePlate.toUpperCase(),
        make: input.vehicleMake,
        model: input.vehicleModel,
        year: input.vehicleYear ?? null,
        customer_id: customerId,
      })
      .select('id')
      .single()
    if (error) return { error: error.message }
    vehicleId = newVehicle.id
  }

  // 3. Generate job number
  const jobNumber = await nextJobNumber(supabase, shopId, input.shopSlug)

  // 4. Create job
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert({
      shop_id: shopId,
      job_number: jobNumber,
      vehicle_id: vehicleId,
      customer_id: customerId,
      job_type: input.jobType,
      status: 'pending',
      price: String(input.price),
      scheduled_date: input.scheduledDate ?? null,
      notes: input.notes ?? null,
      is_insurance_claim: input.isInsuranceClaim ?? false,
      insurance_company: input.insuranceCompany ?? null,
      created_by: createdBy,
    })
    .select('id')
    .single()

  if (jobError) return { error: jobError.message }
  return { jobId: job.id }
}

export async function updateJobStatus(
  supabase: Supabase,
  shopId: string,
  jobId: string,
  changedBy: string,
  fromStatus: JobStatus,
  toStatus: JobStatus,
  note?: string,
): Promise<{ error?: string }> {
  const { error: updateError } = await supabase
    .from('jobs')
    .update({ status: toStatus })
    .eq('id', jobId)
    .eq('shop_id', shopId)

  if (updateError) return { error: updateError.message }

  await supabase.from('job_status_history').insert({
    job_id: jobId,
    shop_id: shopId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_by: changedBy,
    note: note ?? null,
  })

  return {}
}
