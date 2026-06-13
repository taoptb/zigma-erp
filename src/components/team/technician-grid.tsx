import type { Profile } from '@/types/app.types'

const ROLE_LABELS: Record<string, string> = {
  owner: 'เจ้าของ',
  manager: 'ผู้จัดการ',
  technician: 'ช่าง',
  accountant: 'บัญชี',
}

export function TechnicianGrid({ staff }: { staff: Profile[] }) {
  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">ยังไม่มีสมาชิกในทีม</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {staff.map((member) => (
        <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: member.avatar_color ?? '#6366f1' }}
          >
            {member.display_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{member.display_name}</p>
            <p className="text-xs text-gray-400">{ROLE_LABELS[member.role] ?? member.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
