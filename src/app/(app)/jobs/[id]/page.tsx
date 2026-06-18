import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getJob } from '@/lib/queries/jobs'
import { listJobPhotos } from '@/lib/queries/storage'
import { StatusBadge } from '@/components/jobs/status-badge'
import { JobStatusActions } from '@/components/jobs/job-status-actions'
import { PhotoUpload } from '@/components/jobs/photo-upload'
import type { JobType } from '@/types/app.types'

const JOB_TYPE_LABELS: Record<JobType, string> = {
  windshield_replace: 'เปลี่ยนกระจกหน้า',
  side_glass_replace: 'เปลี่ยนกระจกข้าง',
  rear_glass_replace: 'เปลี่ยนกระจกหลัง',
  film_tint: 'ติดฟิล์ม',
  crack_repair: 'ซ่อมรอยร้าว',
  insurance_claim: 'เคลมประกัน',
  other: 'อื่นๆ',
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()
  if (!profile?.shop_id) redirect('/register')

  const job = await getJob(supabase, profile.shop_id, id)
  if (!job) notFound()

  const photoUrls = await listJobPhotos(supabase, profile.shop_id, job.id)

  const { data: history } = await supabase
    .from('job_status_history')
    .select('id, from_status, to_status, note, created_at, changed_by')
    .eq('job_id', id)
    .eq('shop_id', profile.shop_id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">{job.job_number}</p>
          <h2 className="text-xl font-semibold text-gray-900">
            {job.vehicle?.make} {job.vehicle?.model}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono bg-gray-900 text-white px-2 py-0.5 rounded text-sm tracking-wider">
              {job.vehicle?.license_plate ?? '—'}
            </span>
            <StatusBadge status={job.status} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">฿{Number(job.price).toLocaleString()}</p>
          <p className="text-sm text-gray-500">{JOB_TYPE_LABELS[job.job_type]}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Job info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">รายละเอียดงาน</h3>
          <Row label="ลูกค้า" value={job.customer?.name ?? '—'} />
          <Row label="เบอร์โทร" value={job.customer?.phone ?? '—'} />
          <Row label="ช่าง" value={job.technician?.display_name ?? '—'} />
          <Row label="วันนัด" value={job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString('th-TH', { dateStyle: 'medium' }) : '—'} />
          {job.is_insurance_claim && <Row label="ประกัน" value={job.insurance_company ?? '—'} />}
          {job.notes && <Row label="หมายเหตุ" value={job.notes} />}
        </div>

        {/* Status actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <JobStatusActions
            jobId={job.id}
            shopId={profile.shop_id}
            currentStatus={job.status}
            userId={user.id}
          />
        </div>
      </div>

      {/* Status history */}
      {(history ?? []).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">ประวัติสถานะ</h3>
          <div className="space-y-3">
            {(history ?? []).map((h) => (
              <div key={h.id} className="flex items-start gap-3 text-sm">
                <span className="text-gray-400 text-xs w-28 flex-shrink-0 mt-0.5">
                  {new Date(h.created_at).toLocaleDateString('th-TH', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                <span className="text-gray-600">
                  {h.from_status != null ? `${h.from_status} → ` : ''}<strong>{h.to_status}</strong>
                  {h.note && <span className="text-gray-400"> — {h.note}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <PhotoUpload shopId={profile.shop_id} jobId={job.id} initialUrls={photoUrls} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  )
}
