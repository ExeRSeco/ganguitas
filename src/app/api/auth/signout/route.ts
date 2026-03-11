import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Redirigir al home o login luego de desloguearse
  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}
