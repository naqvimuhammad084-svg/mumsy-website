'use client';

import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { SplashScreen } from '@/components/SplashScreen';
import { PageTransition } from '@/components/PageTransition';
import { GlobalBackground } from '@/components/GlobalBackground';

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SplashScreen />
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-transparent">
          <GlobalBackground />
          <Navbar />
          <main className="flex-1 pt-20">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </>
  );
}
