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
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const normalized = (data ?? []).map((row) => {
      const r = row as Record<string, unknown>;
      return {
        id: String(r.id ?? ''),
        customer_name: String(r.customer_name ?? ''),
        phone: String(r.phone ?? r.customer_phone ?? ''),
        address: String(r.address ?? ''),
        order_items: r.order_items ?? r.items ?? [],
        total_price: Number(r.total_price ?? r.total_amount ?? 0),
        payment_method: String(r.payment_method ?? ''),
        status: String(r.status ?? 'pending'),
        created_at: String(r.created_at ?? ''),
      };
    });

    return NextResponse.json(normalized);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

