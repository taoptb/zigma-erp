import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { ClaimWithDocuments, ClaimStatus, JobType } from '@/types/app.types'

type Supabase = SupabaseClient<Database>

export async function listClaims(
  supabase: Supabase,
  shopId: string,
): Promise<ClaimWithDocuments[]> {
  const { data, error } = await supabase
    .from('insurance_claims')
    .select(`
      *,
      documents:claim_documents(*),
      job:jobs(*)
    `)
    .eq('shop_id', shopId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return (data ?? []) as unknown as ClaimWithDocuments[]
}

export async function getClaim(
  supabase: Supabase,
  shopId: string,
  claimId: string,
): Promise<ClaimWithDocuments | null> {
  const { data } = await supabase
    .from('insurance_claims')
    .select(`
      *,
      documents:claim_documents(*),
      job:jobs(*)
    `)
    .eq('shop_id', shopId)
    .eq('id', claimId)
    .is('deleted_at', null)
    .single()

  return data as unknown as ClaimWithDocuments | null
}

export interface CreateClaimInput {
  claimNumber: string
  licensePlate: string
  jobType: JobType
  jobId?: string
  insuranceCompany: string
  policyNumber?: string
  claimAmount?: number
  notes?: string
}

export async function createClaim(
  supabase: Supabase,
  shopId: string,
  createdBy: string,
  input: CreateClaimInput,
): Promise<{ claimId: string } | { error: string }> {
  const { data, error } = await supabase
    .from('insurance_claims')
    .insert({
      shop_id: shopId,
      claim_number: input.claimNumber,
      license_plate: input.licensePlate.toUpperCase(),
      job_type: input.jobType,
      job_id: input.jobId ?? null,
      insurance_company: input.insuranceCompany,
      policy_number: input.policyNumber ?? null,
      claim_amount: input.claimAmount ?? null,
      status: 'waiting_docs',
      notes: input.notes ?? null,
      created_by: createdBy,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { claimId: data.id }
}

export async function updateClaimStatus(
  supabase: Supabase,
  shopId: string,
  claimId: string,
  status: ClaimStatus,
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('insurance_claims')
    .update({ status })
    .eq('id', claimId)
    .eq('shop_id', shopId)

  return error ? { error: error.message } : {}
}

export async function insertClaimDocument(
  supabase: Supabase,
  shopId: string,
  claimId: string,
  documentName: string,
  fileUrl: string,
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('claim_documents')
    .insert({
      shop_id: shopId,
      claim_id: claimId,
      document_name: documentName,
      file_url: fileUrl,
    })

  return error ? { error: error.message } : {}
}
