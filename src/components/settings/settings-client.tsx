'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Shop, Profile } from '@/types/app.types'

type Tab = 'shop' | 'integrations'

export function SettingsClient({ shop, profile }: { shop: Shop | null; profile: Profile }) {
  const [tab, setTab] = useState<Tab>('shop')

  if (!shop) return <p className="text-gray-400 text-sm">ไม่พบข้อมูลร้าน</p>

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">ตั้งค่า</h2>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(['shop', 'integrations'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'shop' ? 'ข้อมูลร้าน' : 'การเชื่อมต่อ'}
          </button>
        ))}
      </div>

      {tab === 'shop' && <ShopTab shop={shop} />}
      {tab === 'integrations' && <IntegrationsTab shop={shop} />}
    </div>
  )
}

function ShopTab({ shop }: { shop: Shop }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ชื่อร้าน</label>
        <p className="text-gray-900 font-medium">{shop.name}</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Slug</label>
        <p className="text-gray-500 font-mono text-sm">{shop.slug}</p>
      </div>
      {shop.phone && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">เบอร์โทร</label>
          <p className="text-gray-700">{shop.phone}</p>
        </div>
      )}
      {shop.address && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ที่อยู่</label>
          <p className="text-gray-700 text-sm">{shop.address}</p>
        </div>
      )}
    </div>
  )
}

function IntegrationsTab({ shop }: { shop: Shop }) {
  const router = useRouter()
  const settings = (shop.settings as Record<string, string>) ?? {}
  const [lineToken, setLineToken] = useState(settings.line_notify_token ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveLineToken() {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('shops')
      .update({ settings: { ...settings, line_notify_token: lineToken } })
      .eq('id', shop.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">LINE Notify</h3>
        <p className="text-xs text-gray-400 mb-4">
          แจ้งเตือนเมื่องานเสร็จ เคลมเปลี่ยนสถานะ และสต็อกใกล้หมด
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={lineToken}
            onChange={(e) => setLineToken(e.target.value)}
            placeholder="LINE Notify Token"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveLineToken}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? '...' : saved ? '✓ บันทึกแล้ว' : 'บันทึก'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          รับ Token ได้จาก{' '}
          <span className="font-mono text-gray-500">notify-bot.line.me/th/</span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">SMS</h3>
        <p className="text-xs text-gray-400 mb-3">ตั้งค่าผ่าน environment variables บน Vercel</p>
        <div className="space-y-1.5 text-xs font-mono text-gray-500">
          <p>SMS_API_KEY=your_key</p>
          <p>SMS_API_URL=https://api.sms-provider.com/send</p>
          <p>SMS_SENDER_NAME=ZigmaERP</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">EMCS (ระบบเคลมประกัน)</h3>
        <p className="text-xs text-gray-400 mb-3">
          ใช้ Mock Mode — ตั้งค่า EMCS_API_URL เมื่อได้รับ access
        </p>
        <div className="space-y-1.5 text-xs font-mono text-gray-500">
          <p>EMCS_API_URL=https://api.emcs.example.com</p>
          <p>EMCS_API_KEY=your_key</p>
        </div>
      </div>
    </div>
  )
}
