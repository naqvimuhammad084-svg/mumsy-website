'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const SPLASH_KEY = 'eiliyah-splash-seen';
const DURATION_MS = 3000;

export function SplashScreen() {
  // Start visible so the splash renders before the page (prevents a brief "flash" of the site).
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(SPLASH_KEY);
    if (seen) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SPLASH_KEY, '1');
    }, DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-mumsy-dark via-mumsy-purple to-mumsy-dark opacity-100 animate-[fadeIn_0.5s_ease-out]"
      aria-hidden
    >
      <div className="flex flex-col items-center animate-[fadeInScale_0.8s_ease-out]">
        <div className="relative">
          <div className="absolute -inset-8 rounded-[2.5rem] bg-white/15 blur-2xl" />
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] bg-white/10 border border-white/15 shadow-soft overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />
            <Image
              src="/eiliyah-logo.png"
              alt="EILIYAH"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <p className="mt-6 font-heading text-3xl md:text-4xl text-white tracking-[0.25em]">
          EILIYAH
        </p>
        <p className="mt-2 text-xs md:text-sm text-white/75 tracking-[0.3em] uppercase">
          Intimate care
        </p>
      </div>
    </div>
  );
}
