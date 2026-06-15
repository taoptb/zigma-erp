import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from '@/components/settings/settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.shop_id) redirect('/register')

  const { data: shop } = await supabase.from('shops').select('*').eq('id', profile.shop_id).single()

  return <SettingsClient shop={shop} profile={profile} />
}
