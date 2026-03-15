import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(url, key);
    const { data, error } = await supabase.auth.signUp({
      email: String(email).trim(),
      password: String(password),
      options: {
        emailRedirectTo: request.headers.get('origin') ? `${request.headers.get('origin')}/admin` : undefined,
      },
    });

    if (error) {
      const msg = error.message + (error.message.toLowerCase().includes('sign up') || error.message.toLowerCase().includes('signup') ? ' Enable Email Signup in Supabase: Authentication → Providers → Email.' : '');
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Sign up failed' }, { status: 400 });
    }

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim();
    if (adminEmail && data.user.email !== adminEmail) {
      return NextResponse.json({
        error: 'This email is not authorized as admin. Only the email set in NEXT_PUBLIC_ADMIN_EMAIL can sign up.',
      }, { status: 403 });
    }

    if (data.session) {
      return NextResponse.json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        needs_confirmation: false,
      });
    }

    return NextResponse.json({
      needs_confirmation: true,
      message: 'Check your email for a confirmation link, then sign in.',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
