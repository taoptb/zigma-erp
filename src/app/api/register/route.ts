import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

export async function POST(request: NextRequest) {
  const { email, password, displayName, shopName, shopPhone } = await request.json()

  if (!email || !password || !displayName || !shopName) {
    return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, { status: 400 })
  }

  // Service role client — bypasses RLS, server-side only
  const admin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  // 1. Create auth user
  const { data: authData, error: signUpError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip email confirmation
    user_metadata: { display_name: displayName },
  })

  if (signUpError || !authData.user) {
    const msg = signUpError?.message ?? 'สมัครไม่สำเร็จ'
    if (msg.includes('already registered') || msg.includes('already been registered')) {
      return NextResponse.json({ error: 'อีเมลนี้มีบัญชีอยู่แล้ว' }, { status: 409 })
    }
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const userId = authData.user.id

  // 2. Create shop
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
    // Clean up the created user so they can retry
    await admin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: 'สร้างอู่ไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
  }

  // 3. Link profile (trigger already created it; just update)
  const { error: profileError } = await admin
    .from('profiles')
    .update({ shop_id: shop.id, role: 'owner', display_name: displayName })
    .eq('id', userId)

  if (profileError) {
    return NextResponse.json({ error: 'ตั้งค่าโปรไฟล์ไม่สำเร็จ กรุณาติดต่อผู้ดูแลระบบ' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
