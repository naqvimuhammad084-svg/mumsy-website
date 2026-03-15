import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_FETCH_MSG = `Server cannot reach Supabase. Do this:
1. In .env.local set NEXT_PUBLIC_SUPABASE_URL to your project URL (e.g. https://xxxx.supabase.co) — no spaces or quotes.
2. Restart the dev server (Ctrl+C then "npm run dev").
3. In Supabase Dashboard check the project is not paused.`;

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

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) return NextResponse.json({ error: 'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local' }, { status: 500 });
    if (!url.startsWith('https://')) return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_URL must start with https://' }, { status: 500 });

    const res = await fetch(restUrl(url, '/ranges', 'order=created_at.asc'), {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err || res.statusText }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e) {
    return NextResponse.json({ error: apiError(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) return NextResponse.json({ error: 'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local' }, { status: 500 });
    if (!url.startsWith('https://')) return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_URL must start with https://' }, { status: 500 });

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = (formData.get('description') as string) || null;
    const logo = formData.get('logo') as File | null;

    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
    }

    let logo_url: string | null = null;
    if (logo && logo.size > 0) {
      try {
        const supabase = createClient(url, key);
        const buf = await logo.arrayBuffer();
        const ext = logo.name.split('.').pop() || 'png';
        const path = `range-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('range-logos').upload(path, buf, { contentType: logo.type || 'image/png' });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('range-logos').getPublicUrl(path);
          logo_url = urlData.publicUrl;
        }
      } catch {
        // continue without logo
      }
    }

    const body = JSON.stringify({
      name: name.trim(),
      slug: slug.trim(),
      description: description || null,
      logo_url
    });

    const res = await fetch(restUrl(url, '/ranges'), {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = errText;
      try {
        const j = JSON.parse(errText);
        if (j.message) errMsg = j.message;
        else if (j.error_description) errMsg = j.error_description;
      } catch {
        // use errText
      }
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    const inserted = await res.json();
    const id = Array.isArray(inserted) ? inserted[0]?.id : inserted?.id;
    return NextResponse.json(id ? { id } : { ok: true });
  } catch (e) {
    return NextResponse.json({ error: apiError(e) }, { status: 500 });
  }
}
