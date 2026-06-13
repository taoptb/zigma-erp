import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { listJobs } from '@/lib/queries/jobs'
import { TrackingBoard } from '@/components/tracking/tracking-board'

export default async function TrackingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()
  if (!profile?.shop_id) redirect('/register')

  const allJobs = await listJobs(supabase, profile.shop_id)
  const activeJobs = allJobs.filter(
    (j) => j.status !== 'delivered' && j.status !== 'cancelled' && j.status !== 'quote'
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ติดตามงาน</h2>
          <p className="text-sm text-gray-500 mt-0.5">{activeJobs.length} งานที่กำลังดำเนินการ</p>
        </div>
      </div>
      <TrackingBoard jobs={activeJobs} />
    </div>
  )
}
