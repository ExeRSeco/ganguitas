import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Falta el ID del producto' }, { status: 400 });
    }

    // Prevención de abuso usando cookies (Stateless Edge-compatible Rate Limiting)
    const cookieStore = await cookies();
    const clickCookie = cookieStore.get(`ck_${productId}`);
    
    if (clickCookie) {
      // Ya hizo clic recientemente, evitamos saturar Supabase con escrituras zombie
      console.log(`[Tracking] Clic omitido por Rate Limit (Cookie) para IP: ${ip}, Prod: ${productId}`);
      return NextResponse.json({ success: true, message: 'Clic registrado (cached)' });
    }

    const supabase = await createClient();

    // Llama a la funcion RPC increment_clicks() creada en Supabase
    const { error } = await supabase
      .rpc('increment_clicks', { product_id: productId });
    
    if (error) {
       console.error("Error al incrementar click", error);
       return NextResponse.json({ error: 'Error interno de base de datos' }, { status: 500 });
    } else {
       console.log(`[Tracking] Clic registrado en BD para el producto: ${productId}`);
    }

    // Marcar que esta sesión ya hizo clic para evitar bots o spam de clics repetitivos (Cooldown 60 segundos)
    const response = NextResponse.json({ success: true, message: 'Clic registrado' });
    response.cookies.set(`ck_${productId}`, 'true', {
      maxAge: 60, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
