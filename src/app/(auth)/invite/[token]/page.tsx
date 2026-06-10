'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [invitation, setInvitation] = useState<{
    id: string; shop_id: string; email: string; role: string
  } | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadInvitation() {
      const supabase = createClient()
      const { data } = await supabase
        .from('shop_invitations')
        .select('id, shop_id, email, role')
        .eq('token', token)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (!data) { setNotFound(true); return }
      setInvitation(data)
    }
    loadInvitation()
  }, [token])

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    if (!invitation) return
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: { data: { display_name: displayName } },
    })

    if (signUpError || !authData.user) {
      setError(signUpError?.message ?? 'สมัครไม่สำเร็จ')
      setLoading(false)
      return
    }

    await supabase
      .from('profiles')
      .update({
        shop_id: invitation.shop_id,
        role: invitation.role as 'manager' | 'technician' | 'accountant',
        display_name: displayName,
      })
      .eq('id', authData.user.id)

    await supabase
      .from('shop_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id)

    router.push('/dashboard')
    router.refresh()
  }

  if (notFound) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-700">ลิงก์เชิญนี้ไม่ถูกต้องหรือหมดอายุแล้ว</p>
        <a href="/login" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
          กลับไปหน้าเข้าสู่ระบบ
        </a>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-sm">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">รับคำเชิญ</h2>
      <p className="text-sm text-gray-500 mb-6">
        ตำแหน่ง: <span className="font-medium text-gray-700">{invitation.role}</span>
      </p>
      <form onSubmit={handleAccept} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล: {invitation.email}
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ตั้งรหัสผ่าน</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength={8}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'กำลังสร้างบัญชี...' : 'เข้าร่วมทีม'}
        </button>
      </form>
    </div>
  )
}
