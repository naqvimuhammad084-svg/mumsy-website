import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { StoreShell } from '@/components/StoreShell';

export const metadata: Metadata = {
  title: 'EILIYAH Intimate Care',
  description:
    'Premium, gentle intimate-care essentials designed to support your confidence every day.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}

