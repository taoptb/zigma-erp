import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getJob } from '@/lib/queries/jobs'
import { StatusBadge } from '@/components/jobs/status-badge'
import { JobStatusActions } from '@/components/jobs/job-status-actions'
import { JobTimeline } from '@/components/tracking/job-timeline'

export default async function TrackingDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()
  if (!profile?.shop_id) redirect('/register')

  const job = await getJob(supabase, profile.shop_id, jobId)
  if (!job) notFound()

  const { data: history } = await supabase
    .from('job_status_history')
    .select('*')
    .eq('job_id', jobId)
    .eq('shop_id', profile.shop_id)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-2xl">
      <Link href="/tracking" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← กลับบอร์ด
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono bg-gray-900 text-white px-2 py-0.5 rounded text-sm tracking-wider">
                {job.vehicle?.license_plate ?? '—'}
              </span>
              <StatusBadge status={job.status} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {job.vehicle?.make} {job.vehicle?.model}
              {job.vehicle?.year && <span className="text-gray-400 font-normal text-sm ml-1">{job.vehicle.year}</span>}
            </h2>
            {job.customer && (
              <p className="text-sm text-gray-500 mt-0.5">
                {job.customer.name}{job.customer.phone && ` · ${job.customer.phone}`}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">฿{Number(job.price).toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-mono">{job.job_number}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">ประวัติสถานะ</h3>
          {(history ?? []).length > 0 ? (
            <JobTimeline history={history ?? []} />
          ) : (
            <p className="text-xs text-gray-400">ยังไม่มีประวัติ</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <JobStatusActions
            jobId={job.id}
            shopId={profile.shop_id}
            currentStatus={job.status}
            userId={user.id}
          />
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href={`/jobs/${job.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              ดูรายละเอียดงานเต็ม →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
