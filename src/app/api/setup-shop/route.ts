import { NextResponse, type NextRequest } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

// Creates a shop for an already-logged-in user who has no shop yet.
export async function POST(request: NextRequest) {
  const { shopName, shopPhone } = await request.json()

  if (!shopName) {
    return NextResponse.json({ error: 'กรุณากรอกชื่ออู่' }, { status: 400 })
  }

  // Get the current user from their session
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
  }

  // Use service role to bypass RLS
  const admin = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  // Check if user already has a shop
  const { data: existing } = await admin
    .from('profiles')
    .select('shop_id')
    .eq('id', user.id)
    .single()

  if (existing?.shop_id) {
    return NextResponse.json({ error: 'บัญชีนี้มีอู่อยู่แล้ว' }, { status: 409 })
  }

  // Create the shop
  const slug =
    shopName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') +
    '-' +
    Date.now().toString(36)

  const { data: shop, error: shopError } = await admin
    .from('shops')
    .insert({ name: shopName, slug, phone: shopPhone ?? null })
    .select()
    .single()

  if (shopError || !shop) {
    return NextResponse.json({ error: 'สร้างอู่ไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
  }

  // Link profile to the new shop
  const displayName = user.user_metadata?.display_name as string | undefined
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: user.id,
      shop_id: shop.id,
      role: 'owner',
      display_name: displayName ?? user.email?.split('@')[0] ?? 'เจ้าของ',
    }, { onConflict: 'id' })

  if (profileError) {
    return NextResponse.json({ error: 'ตั้งค่าโปรไฟล์ไม่สำเร็จ' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
