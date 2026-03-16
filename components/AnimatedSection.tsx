'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = {
  className?: string;
  children: ReactNode;
};

const variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export function AnimatedSection({ className = '', children }: Props) {
  return (
    <motion.section
      className={className}
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}

