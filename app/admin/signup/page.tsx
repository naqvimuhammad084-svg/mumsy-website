'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const FETCH_ERR_CHECKLIST = `Network error (could not reach Supabase). Try:

1. Restart dev server: Ctrl+C then "npm run dev"
2. Supabase Dashboard → your project → "Restore" if paused
3. Authentication → Providers → Email → turn ON "Enable Email Signup"
4. Try in an incognito/private window (rules out ad blockers or extensions blocking the request)
5. .env.local: exact names NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY`;

export default function AdminSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  async function handleTestConnection() {
    setTestResult('Testing…');
    setError('');
    try {
      const { error: err } = await supabase.from('ranges').select('id').limit(1);
      if (err) {
        if (err.message?.includes('relation') && err.message?.includes('does not exist')) {
          setTestResult('Supabase reachable (ranges table missing – create it in Supabase or ignore).');
        } else {
          setTestResult(`API: ${err.message}`);
        }
        return;
      }
      setTestResult('Connection OK. Supabase is reachable. If sign up still fails, enable Email Signup in Supabase → Authentication → Providers → Email.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const cause = e instanceof Error && 'cause' in e ? String((e as Error & { cause?: unknown }).cause) : '';
      setTestResult(
        msg.includes('fetch') || msg.includes('Failed')
          ? 'Cannot reach Supabase. Restart server, restore project if paused, and check .env.local. ' + (cause ? cause : '')
          : msg + (cause ? ' ' + cause : '')
      );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!configured) {
      setError('Supabase is not configured. See instructions below.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      setLoading(false);

      if (!res.ok) {
        setError(json.error || res.statusText || 'Sign up failed');
        return;
      }

      if (json.needs_confirmation) {
        setSuccess(true);
        return;
      }

      if (json.access_token && json.refresh_token) {
        const { error: setErr } = await supabase.auth.setSession({
          access_token: json.access_token,
          refresh_token: json.refresh_token,
        });
        if (setErr) {
          setError(setErr.message);
          return;
        }
        router.replace('/admin');
        router.refresh();
        return;
      }

      setSuccess(true);
    } catch (e) {
      setLoading(false);
      const msg = e instanceof Error ? e.message : String(e);
      const isNetworkErr = msg.includes('fetch') || msg.includes('Network') || msg.includes('Failed');
      setError(
        (isNetworkErr ? 'Network error: ' : 'Error: ') +
          msg +
          (isNetworkErr ? '\n\n' + FETCH_ERR_CHECKLIST : '')
      );
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mumsy-soft to-mumsy-lavender/30 px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white border border-mumsy-lavender/40 shadow-soft p-8 text-center">
          <h1 className="font-heading text-2xl text-mumsy-dark">Check your email</h1>
          <p className="mt-3 text-sm text-mumsy-dark/80">
            We sent a confirmation link to <strong>{email}</strong>. Click the link (check spam too), then sign in below.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-block w-full rounded-full bg-mumsy-purple text-white py-2.5 font-semibold hover:bg-mumsy-dark transition text-center"
          >
            Go to Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mumsy-soft to-mumsy-lavender/30 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-mumsy-lavender/40 shadow-soft p-8">
        <h1 className="font-heading text-2xl text-mumsy-dark text-center">Admin Sign up</h1>
        <p className="mt-1 text-sm text-mumsy-dark/70 text-center">
          Create your admin account. Only you (site owner) should use this page.
        </p>
        {!configured && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@gmail.com"
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-mumsy-dark">Confirm password</span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 whitespace-pre-line">
              {error}
            </div>
          )}
          {testResult && (
            <div className="p-3 rounded-xl bg-mumsy-soft border border-mumsy-lavender/50 text-sm text-mumsy-dark">
              {testResult}
            </div>
          )}
          {configured && (
            <button
              type="button"
              onClick={handleTestConnection}
              className="w-full rounded-full border border-mumsy-purple/50 text-mumsy-purple py-2 text-sm font-medium hover:bg-mumsy-soft/50"
            >
              Test connection to Supabase
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !configured}
            className="w-full rounded-full bg-mumsy-purple text-white py-2.5 font-semibold hover:bg-mumsy-dark transition disabled:opacity-60"
          >
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-mumsy-dark/70">
          Already have an account?{' '}
          <Link href="/admin/login" className="font-medium text-mumsy-purple hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
