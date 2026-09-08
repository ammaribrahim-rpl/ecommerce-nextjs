import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// HANYA proses sign out jika metode adalah POST
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return NextResponse.redirect(new URL('/auth/login', origin), { status: 303 })
}

// Jika request GET (misal prefetch browser atau Next.js Link), JANGAN signOut!
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return NextResponse.redirect(new URL('/', origin))
}
