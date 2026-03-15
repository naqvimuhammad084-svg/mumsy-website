import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_FETCH_MSG = 'Server cannot reach Supabase. Check .env.local (NEXT_PUBLIC_SUPABASE_URL must start with https://), restart dev server, and ensure the Supabase project is not paused.';

function apiError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes('Failed to fetch') || msg.includes('fetch failed') || msg === 'TypeError: Failed to fetch') return SUPABASE_FETCH_MSG;
  return msg;
}

function restUrl(base: string, path: string, q?: string): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return q ? `${b}/rest/v1${p}?${q}` : `${b}/rest/v1${p}`;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const contentType = request.headers.get('content-type') || '';
    let name: string | undefined;
    let slug: string | undefined;
    let description: string | null | undefined;
    let logo_url: string | null | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string | undefined;
      slug = formData.get('slug') as string | undefined;
      const desc = formData.get('description');
      description = desc !== undefined && desc !== null ? String(desc) : undefined;
      const logo = formData.get('logo') as File | null;
      if (logo && logo.size > 0) {
        try {
          const supabase = createClient(url, key);
          const buf = await logo.arrayBuffer();
          const ext = logo.name.split('.').pop() || 'png';
          const path = `range-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadErr } = await supabase.storage.from('range-logos').upload(path, buf, { contentType: logo.type || 'image/png' });
          if (!uploadErr) {
            const { data } = supabase.storage.from('range-logos').getPublicUrl(path);
            logo_url = data.publicUrl;
          }
        } catch {
          // skip logo
        }
      }
    } else {
      const body = await request.json().catch(() => ({}));
      name = body.name;
      slug = body.slug;
      description = body.description;
      logo_url = body.logo_url;
    }

    const update: Record<string, unknown> = {};
    if (name != null) update.name = name;
    if (slug != null) update.slug = slug;
    if (description !== undefined) update.description = description;
    if (logo_url !== undefined) update.logo_url = logo_url;

    if (Object.keys(update).length === 0) return NextResponse.json({ ok: true });

    const res = await fetch(restUrl(url, '/ranges', `id=eq.${encodeURIComponent(id)}`), {
      method: 'PATCH',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = errText;
      try {
        const j = JSON.parse(errText);
        if (j.message) errMsg = j.message;
      } catch {
        // use errText
      }
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: apiError(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const res = await fetch(restUrl(url, '/ranges', `id=eq.${encodeURIComponent(id)}`), {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = errText;
      try {
        const j = JSON.parse(errText);
        if (j.message) errMsg = j.message;
      } catch {
        // use errText
      }
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: apiError(e) }, { status: 500 });
  }
}
