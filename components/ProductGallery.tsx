'use client';

import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';

type Props = {
  images: { url: string }[];
  alt: string;
};

export function ProductGallery({ images, alt }: Props) {
  const list = useMemo(() => images.map((i) => i.url).filter((u) => typeof u === 'string' && u.trim()), [images]);
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const clamp = useCallback(
    (n: number) => {
      if (list.length === 0) return 0;
      const mod = ((n % list.length) + list.length) % list.length;
      return mod;
    },
    [list.length]
  );

  const prev = useCallback(() => setIdx((i) => clamp(i - 1)), [clamp]);
  const next = useCallback(() => setIdx((i) => clamp(i + 1)), [clamp]);

  if (list.length === 0) {
    return (
      <div className="aspect-[4/5] relative rounded-3xl bg-white border border-mumsy-lavender/40 shadow-soft overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mumsy-soft to-white" />
        <Image
          src="/eiliyah-logo.png"
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const current = list[clamp(idx)];

  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-mumsy-lavender/30 rounded-3xl blur-xl" />
      <div
        className="relative bg-white/80 rounded-3xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden backdrop-blur-xl"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
          touchDeltaX.current = 0;
        }}
        onTouchMove={(e) => {
          if (touchStartX.current == null) return;
          const x = e.touches[0]?.clientX ?? 0;
          touchDeltaX.current = x - touchStartX.current;
        }}
        onTouchEnd={() => {
          const dx = touchDeltaX.current;
          touchStartX.current = null;
          touchDeltaX.current = 0;
          if (Math.abs(dx) < 40) return;
          if (dx > 0) prev();
          else next();
        }}
      >
        <div className="aspect-[4/5] relative bg-gradient-to-b from-mumsy-soft/70 to-white">
          <Image
            key={current}
            src={current}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
            unoptimized={current.startsWith('http')}
            priority
          />
        </div>

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 border border-mumsy-lavender/50 shadow-soft px-3 py-2 text-mumsy-dark hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 border border-mumsy-lavender/50 shadow-soft px-3 py-2 text-mumsy-dark hover:bg-white"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
              {list.map((u, i) => (
                <button
                  key={u + i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    clamp(idx) === i ? 'bg-mumsy-purple' : 'bg-mumsy-lavender/60 hover:bg-mumsy-purple/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

