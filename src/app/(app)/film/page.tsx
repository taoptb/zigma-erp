import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { listFilmRolls, listFilmTemplates } from '@/lib/queries/film'
import { FilmRollCard } from '@/components/film/film-roll-card'
import { FilmCalculatorForm } from '@/components/film/film-calculator-form'

export default async function FilmPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()
  if (!profile?.shop_id) redirect('/register')

  const [rolls, templates] = await Promise.all([
    listFilmRolls(supabase, profile.shop_id),
    listFilmTemplates(supabase, profile.shop_id),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ฟิล์ม</h2>
          <p className="text-sm text-gray-500 mt-0.5">{rolls.length} ม้วนที่ใช้งานอยู่</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-gray-600">ม้วนฟิล์ม</h3>
          {rolls.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">ยังไม่มีม้วนฟิล์ม</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {rolls.map((roll) => (
                <FilmRollCard key={roll.id} roll={roll} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-4">คำนวณ</h3>
          {rolls.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-400">
              เพิ่มม้วนฟิล์มก่อน
            </div>
          ) : (
            <FilmCalculatorForm
              rolls={rolls}
              templates={templates}
              shopId={profile.shop_id}
              userId={user.id}
            />
          )}
        </div>
      </div>
    </div>
  )
}
