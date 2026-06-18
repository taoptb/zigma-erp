'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadJobPhoto } from '@/lib/queries/storage'

export function PhotoUpload({
  shopId,
  jobId,
  initialUrls,
}: {
  shopId: string
  jobId: string
  initialUrls: string[]
}) {
  const [urls, setUrls] = useState(initialUrls)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const result = await uploadJobPhoto(supabase, shopId, jobId, file)
      if ('error' in result) {
        setError(result.error)
        break
      }
      newUrls.push(result.url)
    }

    setUrls((prev) => [...prev, ...newUrls])
    setUploading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-700">รูปภาพ</h3>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-blue-600 hover:underline disabled:opacity-50"
        >
          {uploading ? 'กำลังอัปโหลด...' : '+ เพิ่มรูป'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {urls.length === 0 ? (
        <p className="text-xs text-gray-400">ยังไม่มีรูปภาพ</p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {urls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`รูปที่ ${i + 1}`}
                className="w-full aspect-square object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
