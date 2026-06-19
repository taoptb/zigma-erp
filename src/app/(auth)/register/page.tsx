'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  // 'check' = detecting auth state, 'account' = new user, 'shop' = create shop
  const [step, setStep] = useState<'check' | 'account' | 'shop'>('check')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopPhone, setShopPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isExistingUser, setIsExistingUser] = useState(false)

  // On mount: check if already logged in and if shop is missing
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setStep('account')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('shop_id')
        .eq('id', user.id)
        .single()

      if (profile?.shop_id) {
        // Already has a shop — go straight to dashboard
        router.replace('/dashboard')
      } else {
        // Logged in but no shop yet — skip account step
        setIsExistingUser(true)
        setStep('shop')
      }
    }
    checkAuth()
  }, [router])

  function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('shop')
  }

  async function handleShopSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isExistingUser) {
      // Already logged in — just create the shop
      const res = await fetch('/api/setup-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName, shopPhone }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'สร้างอู่ไม่สำเร็จ กรุณาลองใหม่')
        setLoading(false)
        return
      }
      router.push('/dashboard')
      router.refresh()
      return
    }

    // New user — create account + shop via /api/register
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName, shopName, shopPhone }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'สมัครไม่สำเร็จ กรุณาลองใหม่')
      setLoading(false)
      return
    }

    // Sign in with the newly created credentials
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('สร้างบัญชีสำเร็จแล้ว กรุณาเข้าสู่ระบบ')
      setLoading(false)
      router.push('/login')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (step === 'check') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-400">กำลังโหลด...</p>
      </div>
    )
  }

  if (step === 'account') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">สร้างบัญชีผู้ดูแล</h2>
        <form onSubmit={handleAccountSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="สมชาย ใจดี"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน (อย่างน้อย 8 ตัว)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            ถัดไป →
          </button>
          <p className="text-center text-sm text-gray-500">
            มีบัญชีแล้ว?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">เข้าสู่ระบบ</Link>
          </p>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">ข้อมูลอู่</h2>
      <form onSubmit={handleShopSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่ออู่</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="อู่กระจก สมชาย"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรอู่</label>
          <input
            type="tel"
            value={shopPhone}
            onChange={(e) => setShopPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="02-XXX-XXXX"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          {!isExistingUser && (
            <button
              type="button"
              onClick={() => setStep('account')}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
            >
              ← ย้อนกลับ
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'กำลังสร้าง...' : 'สร้างอู่'}
          </button>
        </div>
      </form>
    </div>
  )
}
