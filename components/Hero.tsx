 'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const heroTextVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const heroImageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: [0, -8, 0],
  },
};

export function Hero() {
  const [slides, setSlides] = useState<{ text?: string | null; image_url?: string | null }[]>([]);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/slides');
        const data = await res.json().catch(() => []);
        if (!alive || !res.ok || !Array.isArray(data)) return;
        setSlides(
          data.map((s) => ({
            text: typeof s?.text === 'string' ? s.text : null,
            image_url: typeof s?.image_url === 'string' ? s.image_url : null,
          }))
        );
      } catch {
        // keep empty state on fetch failure
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const imageSlidesCount = slides.filter((s) => s.image_url?.trim()).length;
    if (imageSlidesCount <= 1) return;
    const t = setInterval(() => {
      setSlideIdx((i) => (i + 1) % imageSlidesCount);
    }, 3500);
    return () => clearInterval(t);
  }, [slides]);

  const imageSlides = useMemo(
    () => slides.map((s) => (s.image_url?.trim() ? s.image_url.trim() : '')).filter(Boolean),
    [slides]
  );
  const activeImage = useMemo(() => imageSlides[slideIdx] ?? '', [imageSlides, slideIdx]);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-32 h-80 w-80 rounded-full bg-mumsy-lavender/30 blur-[110px] animate-[float-soft_22s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-mumsy-purple/20 blur-[100px] animate-[float-soft_20s_ease-in-out_infinite]" />
      <div className="container-page pt-16 pb-20 grid md:grid-cols-[1.2fr,1fr] gap-10 items-center">
      <motion.div
        className="relative z-[1]"
        variants={heroTextVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80 mb-3">
          PERSONAL CARE • CONFIDENCE • COMFORT
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-mumsy-dark leading-tight">
          Feel confidently
          <span className="text-mumsy-purple"> yourself</span> in your most
          personal moments.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-mumsy-dark/80 max-w-xl">
          EILIYAH creates gentle, dermatologist-inspired personal-care essentials
          that support a more even-looking tone, deep hydration, and everyday
          comfort—without harsh bleaching agents or complicated routines.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-mumsy-purple text-white px-6 py-3 text-sm font-semibold shadow-soft hover:bg-mumsy-dark transition"
          >
            Shop Products
          </Link>
          <Link
            href="/bundles"
            className="inline-flex items-center justify-center rounded-full border border-mumsy-purple/40 bg-white text-mumsy-purple px-6 py-3 text-sm font-semibold hover:border-mumsy-purple hover:bg-mumsy-soft transition"
          >
            View Bundles
          </Link>
          <a
            href="#education"
            className="inline-flex items-center justify-center rounded-full text-mumsy-dark/80 px-4 py-3 text-sm font-medium hover:text-mumsy-purple transition"
          >
            Learn more about personal care
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-mumsy-dark/80">
          <Badge label="Safe, gentle ingredients" />
          <Badge label="Dermatologist-inspired formulas" />
          <Badge label="Discreet, private packaging" />
          <Badge label="Loved by women at every stage" />
        </div>
      </motion.div>

      <motion.div
        className="relative z-[1]"
        variants={heroImageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.9, ease: 'easeOut', repeat: Infinity, repeatType: 'mirror', delay: 0.3 }}
      >
        {imageSlides.length > 0 ? (
          <>
            <div className="absolute -inset-8 bg-gradient-to-b from-mumsy-lavender/40 to-mumsy-soft rounded-3xl blur-3xl" />
            <div className="relative bg-white/80 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-white/40 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(0,0,0,0.14)]">
              <div className="aspect-[4/5] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage}
                      alt="EILIYAH hero slide"
                      fill
                      className="object-cover"
                      unoptimized={activeImage.startsWith('http')}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-[4/5] rounded-3xl border border-white/40 bg-white/30 backdrop-blur" />
        )}
      </motion.div>
      </div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-white border border-mumsy-lavender/50 px-3 py-2">
      {label}
    </div>
  );
}

