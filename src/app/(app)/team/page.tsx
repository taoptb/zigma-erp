import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { listAllStaff } from '@/lib/queries/team'
import { TechnicianGrid } from '@/components/team/technician-grid'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('shop_id').eq('id', user.id).single()
  if (!profile?.shop_id) redirect('/register')

  const staff = await listAllStaff(supabase, profile.shop_id)
  const technicians = staff.filter((s) => s.role === 'technician')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ทีมงาน</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {staff.length} คน · ช่าง {technicians.length} คน
          </p>
        </div>
      </div>
      <TechnicianGrid staff={staff} />
    </div>
  )
}
