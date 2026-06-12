import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { listJobs } from '@/lib/queries/jobs'
import { JobTable } from '@/components/jobs/job-table'
import { NewJobDialog } from '@/components/jobs/new-job-dialog'

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()
  if (!profile?.shop_id) redirect('/register')

  const { data: shop } = await supabase
    .from('shops')
    .select('id, slug')
    .eq('id', profile.shop_id)
    .single()

  const jobs = await listJobs(supabase, profile.shop_id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">รายการงาน</h2>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} งาน</p>
        </div>
        <NewJobDialog shopId={profile.shop_id} shopSlug={shop?.slug ?? ''} userId={user.id} />
      </div>
      <JobTable jobs={jobs} />
    </div>
  )
}
