'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calcFilm } from '@/lib/film-calculator'
import { createFilmCut } from '@/lib/queries/film'
import type { FilmRoll, FilmTemplate, CarType, FilmPosition } from '@/types/app.types'

const CAR_TYPES: { value: CarType; label: string }[] = [
  { value: 'sedan_s', label: 'เก๋ง S' },
  { value: 'sedan_m', label: 'เก๋ง M' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'กระบะ' },
  { value: 'van', label: 'ตู้/Van' },
]

const POSITIONS: { value: FilmPosition; label: string }[] = [
  { value: 'front', label: 'กระจกหน้า' },
  { value: 'rear', label: 'กระจกหลัง' },
  { value: 'side_front', label: 'กระจกข้างหน้า (คู่)' },
  { value: 'side_rear', label: 'กระจกข้างหลัง (คู่)' },
]

export function FilmCalculatorForm({
  rolls,
  templates,
  shopId,
  userId,
}: {
  rolls: FilmRoll[]
  templates: FilmTemplate[]
  shopId: string
  userId: string
}) {
  const router = useRouter()
  const [selectedRollId, setSelectedRollId] = useState(rolls[0]?.id ?? '')
  const [carType, setCarType] = useState<CarType>('sedan_s')
  const [positions, setPositions] = useState<FilmPosition[]>(['front'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const selectedRoll = rolls.find((r) => r.id === selectedRollId)
  const remainingM = selectedRoll ? Number(selectedRoll.remaining_length_m) : 0
  const result =
    templates.length > 0 ? calcFilm(templates, carType, positions, remainingM) : null

  function togglePosition(pos: FilmPosition) {
    setPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos],
    )
  }

  async function handleCut() {
    if (!result || !selectedRoll) return
    if (!result.isEnough) {
      setError('ม้วนฟิล์มไม่เพียงพอ')
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const res = await createFilmCut(supabase, shopId, {
      filmRollId: selectedRollId,
      carType,
      positions,
      lengthUsedM: result.totalLengthM,
      remainingAfterM: result.remainingAfterM,
      cutBy: userId,
    })
    if ('error' in res) {
      setError(res.error)
    } else {
      setDone(true)
      router.refresh()
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-800 font-semibold">บันทึกการตัดฟิล์มแล้ว ✓</p>
        <button
          onClick={() => setDone(false)}
          className="mt-3 text-sm text-green-600 hover:underline"
        >
          ตัดใหม่
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h3 className="text-sm font-semibold text-gray-700">คำนวณการตัดฟิล์ม</h3>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">เลือกม้วนฟิล์ม</label>
        <div className="grid grid-cols-2 gap-2">
          {rolls.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRollId(r.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-colors ${
                selectedRollId === r.id
                  ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: r.color_hex }}
              />
              <div>
                <p className="font-medium text-xs">{r.name}</p>
                <p className="text-xs text-gray-400">
                  {Number(r.remaining_length_m).toFixed(1)} m เหลือ
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">ประเภทรถ</label>
        <div className="flex flex-wrap gap-2">
          {CAR_TYPES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCarType(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                carType === c.value
                  ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">ตำแหน่งที่ตัด</label>
        <div className="grid grid-cols-2 gap-2">
          {POSITIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => togglePosition(p.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                positions.includes(p.value)
                  ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div
          className={`rounded-lg p-4 space-y-2 ${
            result.isEnough ? 'bg-gray-50' : 'bg-red-50 border border-red-200'
          }`}
        >
          {result.breakdown.map((b) => (
            <div key={b.position} className="flex justify-between text-xs text-gray-600">
              <span>{POSITIONS.find((p) => p.value === b.position)?.label ?? b.position}</span>
              <span>
                {b.baseLength.toFixed(2)} + {b.margin.toFixed(2)} ={' '}
                <strong>{b.totalLength.toFixed(2)} m</strong>
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2 mt-2">
            <span>รวมใช้</span>
            <span>{result.totalLengthM.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">คงเหลือหลังตัด</span>
            <span
              className={result.isEnough ? 'text-gray-700' : 'text-red-600 font-semibold'}
            >
              {result.remainingAfterM.toFixed(2)} m
            </span>
          </div>
          {!result.isEnough && (
            <p className="text-xs text-red-600 font-medium">
              ม้วนฟิล์มไม่เพียงพอ กรุณาเลือกม้วนใหม่
            </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCut}
        disabled={loading || !result || !result.isEnough || positions.length === 0}
        className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'กำลังบันทึก...' : 'บันทึกการตัด'}
      </button>
    </div>
  )
}
