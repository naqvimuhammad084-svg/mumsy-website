'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const SPLASH_KEY = 'eiliyah-splash-seen';
const DURATION_MS = 3000;

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(SPLASH_KEY);
    if (seen) return;
    setVisible(true);
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
        <div className="relative w-40 h-40 md:w-52 md:h-52">
          <Image
            src="/eiliyah-logo.png"
            alt="EILIYAH"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <p className="mt-4 font-heading text-2xl text-white tracking-widest">
          EILIYAH
        </p>
      </div>
    </div>
  );
}
