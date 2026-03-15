'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// false = require sign-in for /admin (admin layout redirects to /admin/login when no session)
const ADMIN_AUTH_BYPASS = false;

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (ADMIN_AUTH_BYPASS) {
      if (pathname === '/admin/login' || pathname === '/admin/signup') {
        router.replace('/admin');
      }
      setAllowed(true);
      setChecking(false);
      return;
    }
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthPage = pathname === '/admin/login' || pathname === '/admin/signup';

      if (!session && !isAuthPage) {
        router.replace('/admin/login');
        setChecking(false);
        return;
      }
      if (session && isAuthPage) {
        router.replace('/admin');
        setChecking(false);
        return;
      }
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (session && adminEmail && session.user?.email !== adminEmail) {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        setChecking(false);
        return;
      }
      setAllowed(true);
      setChecking(false);
    })();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mumsy-soft">
        <p className="text-mumsy-dark/70">Loading…</p>
      </div>
    );
  }

  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-mumsy-soft">
      <header className="border-b border-mumsy-lavender/40 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-heading text-lg text-mumsy-dark">
            EILIYAH Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-mumsy-dark/70 hover:text-mumsy-purple">
              View site
            </Link>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace('/admin/login');
              }}
              className="text-sm text-mumsy-dark/70 hover:text-mumsy-purple"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
