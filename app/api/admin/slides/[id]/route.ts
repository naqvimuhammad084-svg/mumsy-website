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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    if (!id) {
      return NextResponse.json({ error: 'Slide id required' }, { status: 400 });
    }
    const { data, error } = await supabase.from('hero_slides').delete().eq('id', id).select('id').limit(1);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Slide could not be deleted. Check RLS delete policy or service role key.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

