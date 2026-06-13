'use client'

import type { ClaimDocument } from '@/types/app.types'

const REQUIRED_DOCS = [
  { key: 'id_card', label: 'สำเนาบัตรประชาชน' },
  { key: 'vehicle_registration', label: 'สำเนาทะเบียนรถ' },
  { key: 'insurance_card', label: 'บัตรประกันภัย / กรมธรรม์' },
  { key: 'police_report', label: 'บันทึกประจำวันตำรวจ (ถ้ามี)' },
  { key: 'repair_estimate', label: 'ใบประเมินราคาซ่อม' },
  { key: 'before_photos', label: 'รูปถ่ายก่อนซ่อม' },
  { key: 'after_photos', label: 'รูปถ่ายหลังซ่อม' },
]

export function DocumentChecklist({ documents }: { documents: ClaimDocument[] }) {
  // Use document_name as the key identifier
  const uploadedKeys = new Set(documents.map((d) => d.document_name))

  return (
    <div className="space-y-2">
      {REQUIRED_DOCS.map((doc) => {
        const uploaded = uploadedKeys.has(doc.key)
        const claimDoc = documents.find((d) => d.document_name === doc.key)
        return (
          <div
            key={doc.key}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              uploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                uploaded ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-300'
              }`}>
                {uploaded ? '✓' : ''}
              </div>
              <span className={`text-sm ${uploaded ? 'text-green-800' : 'text-gray-600'}`}>
                {doc.label}
              </span>
            </div>
            {claimDoc?.file_url && (
              <a href={claimDoc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                ดูไฟล์
              </a>
            )}
          </div>
        )
      })}
      <p className="text-xs text-gray-400 pt-1">
        อัปโหลดเอกสาร {uploadedKeys.size}/{REQUIRED_DOCS.length} รายการ
      </p>
    </div>
  )
}
