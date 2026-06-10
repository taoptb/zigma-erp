'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [invitation, setInvitation] = useState<{ email: string; role: string } | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadInvitation() {
      try {
        const res = await fetch(`/api/invite/${token}`)
        if (res.status === 404) { setNotFound(true); return }
        if (!res.ok) { setFetchError(true); return }
        const data = await res.json()
        setInvitation(data)
      } catch {
        setFetchError(true)
      }
    }
    loadInvitation()
  }, [token])

  async function handleAccept(e: React.FormEvent<HTMLFormElement>) {
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

    // The handle_new_user trigger automatically sets shop_id, role, and marks accepted_at
    router.push('/dashboard')
    router.refresh()
  }

  if (fetchError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-700">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>
        <button
          onClick={() => { setFetchError(false); window.location.reload() }}
          className="mt-4 inline-block text-blue-600 hover:underline text-sm"
        >
          ลองใหม่
        </button>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-700">ลิงก์เชิญนี้ไม่ถูกต้องหรือหมดอายุแล้ว</p>
        <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
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
            autoComplete="name"
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
            autoComplete="new-password"
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
