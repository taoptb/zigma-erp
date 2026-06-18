import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Supabase = SupabaseClient<Database>

export async function uploadJobPhoto(
  supabase: Supabase,
  shopId: string,
  jobId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${shopId}/${jobId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('job-photos')
    .upload(path, file, { upsert: false })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from('job-photos').getPublicUrl(path)
  return { url: data.publicUrl }
}

export async function listJobPhotos(
  supabase: Supabase,
  shopId: string,
  jobId: string,
): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('job-photos')
    .list(`${shopId}/${jobId}`, { limit: 50 })

  if (error || !data) return []

  return data
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => {
      const { data: urlData } = supabase.storage
        .from('job-photos')
        .getPublicUrl(`${shopId}/${jobId}/${f.name}`)
      return urlData.publicUrl
    })
}

export async function uploadClaimDoc(
  supabase: Supabase,
  shopId: string,
  claimId: string,
  docName: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split('.').pop() ?? 'pdf'
  const path = `${shopId}/${claimId}/${docName}.${ext}`

  const { error } = await supabase.storage
    .from('claim-docs')
    .upload(path, file, { upsert: true })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from('claim-docs').getPublicUrl(path)
  return { url: data.publicUrl }
}
