import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    const { data, error } = await supabase
      .from('hero_slides')
      .select('id, text, image_url, sort_order, created_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const image_url = typeof body?.image_url === 'string' ? body.image_url.trim() : '';
    const sort_order = Number(body?.sort_order ?? 0);
    if (!text && !image_url) {
      return NextResponse.json({ error: 'Add slide text or image URL' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('hero_slides')
      .insert({
        text: text || null,
        image_url: image_url || null,
        sort_order: Number.isFinite(sort_order) ? sort_order : 0,
      })
      .select('id')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data?.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

