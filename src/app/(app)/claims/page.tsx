import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { listClaims } from '@/lib/queries/claims'
import { ClaimTable } from '@/components/claims/claim-table'

export default async function ClaimsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('shop_id').eq('id', user.id).single()
  if (!profile?.shop_id) redirect('/register')

  const claims = await listClaims(supabase, profile.shop_id)
  const activeClaims = claims.filter((c) => c.status !== 'paid' && c.status !== 'rejected')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">เคลมประกัน</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {claims.length} รายการ · กำลังดำเนินการ {activeClaims.length}
          </p>
        </div>
      </div>
      <ClaimTable claims={claims} />
    </div>
  )
}
