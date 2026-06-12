'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createJob } from '@/lib/queries/jobs'
import type { JobType } from '@/types/app.types'

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'windshield_replace', label: 'เปลี่ยนกระจกหน้า' },
  { value: 'side_glass_replace', label: 'เปลี่ยนกระจกข้าง' },
  { value: 'rear_glass_replace', label: 'เปลี่ยนกระจกหลัง' },
  { value: 'film_tint', label: 'ติดฟิล์ม' },
  { value: 'crack_repair', label: 'ซ่อมรอยร้าว' },
  { value: 'insurance_claim', label: 'เคลมประกัน' },
  { value: 'other', label: 'อื่นๆ' },
]

export function NewJobDialog({
  shopId,
  shopSlug,
  userId,
}: {
  shopId: string
  shopSlug: string
  userId: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [licensePlate, setLicensePlate] = useState('')
  const [vehicleMake, setVehicleMake] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [jobType, setJobType] = useState<JobType>('windshield_replace')
  const [price, setPrice] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [notes, setNotes] = useState('')
  const [isInsurance, setIsInsurance] = useState(false)
  const [insuranceCompany, setInsuranceCompany] = useState('')

  function resetForm() {
    setLicensePlate(''); setVehicleMake(''); setVehicleModel(''); setVehicleYear('')
    setCustomerName(''); setCustomerPhone('')
    setJobType('windshield_replace'); setPrice(''); setScheduledDate(''); setNotes('')
    setIsInsurance(false); setInsuranceCompany('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const result = await createJob(supabase, shopId, userId, {
      licensePlate,
      vehicleMake,
      vehicleModel,
      vehicleYear: vehicleYear ? Number(vehicleYear) : undefined,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      jobType,
      price: Number(price),
      scheduledDate: scheduledDate || undefined,
      notes: notes || undefined,
      isInsuranceClaim: isInsurance,
      insuranceCompany: isInsurance ? insuranceCompany : undefined,
      shopSlug,
    })

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    setOpen(false)
    resetForm()
    setLoading(false)
    router.push(`/jobs/${result.jobId}`)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
      >
        + รับงานใหม่
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">รับงานใหม่</h3>
          <button onClick={() => { setOpen(false); resetForm() }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ข้อมูลรถ</legend>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ทะเบียนรถ *</label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="กข 1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อรถ *</label>
                <input
                  type="text"
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  placeholder="Toyota"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รุ่น *</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Camry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ปีรถ</label>
              <input
                type="number"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                placeholder="2565"
                min={1990}
                max={new Date().getFullYear() + 543 + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </fieldset>

          {/* Customer */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ข้อมูลลูกค้า (ไม่บังคับ)</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อลูกค้า</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="สมชาย ใจดี"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="081-234-5678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </fieldset>

          {/* Job */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider">รายละเอียดงาน</legend>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทงาน *</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันนัด</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isInsurance"
                checked={isInsurance}
                onChange={(e) => setIsInsurance(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isInsurance" className="text-sm text-gray-700">เป็นงานเคลมประกัน</label>
            </div>
            {isInsurance && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บริษัทประกัน</label>
                <input
                  type="text"
                  value={insuranceCompany}
                  onChange={(e) => setInsuranceCompany(e.target.value)}
                  placeholder="เช่น กรุงเทพประกันภัย"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setOpen(false); resetForm() }}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'กำลังสร้าง...' : 'รับงาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
