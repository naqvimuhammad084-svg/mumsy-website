'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const FETCH_ERR_CHECKLIST = `Failed to reach Supabase. Do these in order:

1. RESTART dev server: In terminal press Ctrl+C, then run "npm run dev" again.

2. Is your Supabase project PAUSED? Open https://supabase.com/dashboard → your project. If it says "Project paused", click "Restore project".

3. .env.local must be in the project root (same folder as package.json). Names must be EXACTLY: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Use the "anon public" key.

4. Check your internet connection.`;

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  async function handleTestConnection() {
    setTestResult('Testing…');
    setError('');
    try {
      const { error: err } = await supabase.from('ranges').select('id').limit(1);
      if (err) {
        setTestResult(err.message?.includes('relation') ? 'Supabase reachable (ranges table may be missing).' : `API: ${err.message}`);
        return;
      }
      setTestResult('Connection OK. Supabase is reachable.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setTestResult(msg.includes('fetch') || msg.includes('Failed') ? 'Cannot reach Supabase. Restart server and/or restore project.' : msg);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!configured) {
      setError('Supabase is not configured. See instructions below.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoading(false);
        setError(json.error || res.statusText || 'Sign in failed');
        return;
      }

      if (!json.access_token || !json.refresh_token) {
        setLoading(false);
        setError(json.error || 'Invalid response from server');
        return;
      }

      const { error: setErr } = await supabase.auth.setSession({
        access_token: json.access_token,
        refresh_token: json.refresh_token,
      });
      if (setErr) {
        setLoading(false);
        setError(setErr.message);
        return;
      }

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const { data: { user } } = await supabase.auth.getUser();
      if (adminEmail && user?.email !== adminEmail) {
        await supabase.auth.signOut();
        setLoading(false);
        setError('Access denied. This account is not an admin.');
        return;
      }

      setLoading(false);
      // Full page navigation so the admin layout reads the session from storage reliably
      window.location.href = '/admin';
    } catch (e) {
      setLoading(false);
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg.includes('fetch') || msg.includes('Network') || msg.includes('Failed') ? FETCH_ERR_CHECKLIST : msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mumsy-soft to-mumsy-lavender/30 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-mumsy-lavender/40 shadow-soft p-8">
        <h1 className="font-heading text-2xl text-mumsy-dark text-center">
          Admin Login
        </h1>
        <p className="mt-1 text-sm text-mumsy-dark/70 text-center">
          EILIYAH dashboard — staff only
        </p>
        {!configured && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
            Add to <code className="bg-amber-100 px-1 rounded">.env.local</code>:<br />
            NEXT_PUBLIC_SUPABASE_URL=your-project-url<br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key<br />
            Then restart: <code className="bg-amber-100 px-1 rounded">npm run dev</code>
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
              className="mt-1 w-full rounded-xl border border-mumsy-lavender/50 px-3 py-2 text-sm"
            />
          </label>
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 whitespace-pre-line">{error}</div>
          )}
          {testResult && (
            <div className="p-3 rounded-xl bg-mumsy-soft border border-mumsy-lavender/50 text-sm text-mumsy-dark">{testResult}</div>
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-mumsy-dark/70">
          Don&apos;t have an account?{' '}
          <Link href="/admin/signup" className="font-medium text-mumsy-purple hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}