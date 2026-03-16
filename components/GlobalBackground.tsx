'use client';

import { motion } from 'framer-motion';

const blobs = [
  {
    className: 'top-[-18%] left-[-10%] h-[260px] w-[260px]',
    from: 0,
  },
  {
    className: 'top-[10%] right-[-8%] h-[220px] w-[220px]',
    from: 8,
  },
  {
    className: 'bottom-[-15%] left-[5%] h-[260px] w-[260px]',
    from: 16,
  },
];

export function GlobalBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-[999px] bg-mumsy-purple/15 blur-[110px] mix-blend-multiply ${blob.className}`}
          style={{ opacity: 0.16 }}
          animate={{ y: [-20, 20, -20] }}
          transition={{
            duration: 24 + i * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <motion.div
        className="absolute top-1/3 left-1/2 h-[220px] w-[220px] -translate-x-1/2 rounded-[999px] bg-mumsy-lavender/18 blur-[120px] mix-blend-screen"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

