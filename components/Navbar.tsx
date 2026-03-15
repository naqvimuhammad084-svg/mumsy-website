'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartSummary } from '@/components/cart/CartSummary';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/bundles', label: 'Bundles' },
  { href: '/ranges', label: 'Ranges' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-mumsy-lavender/40">
      <div className="container-page flex items-center justify-between py-3 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative h-9 w-9 rounded-2xl bg-mumsy-purple overflow-hidden">
            <Image
              src="/eiliyah-logo.png"
              alt="EILIYAH"
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="leading-tight">
            <p className="font-heading text-lg tracking-wide text-mumsy-dark">
              EILIYAH
            </p>
            <p className="text-xs text-mumsy-dark/70">
              Intimate Confidence Care
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-mumsy-dark/80">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-mumsy-purple transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartSummary />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl border border-mumsy-lavender/60 bg-white text-mumsy-dark"
            aria-label="Open menu"
          >
            <span className="sr-only">{menuOpen ? 'Close' : 'Open'} menu</span>
            <span className="block w-5 h-0.5 bg-current rounded mb-1" />
            <span className="block w-5 h-0.5 bg-current rounded mb-1" />
            <span className="block w-5 h-0.5 bg-current rounded" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-mumsy-lavender/40 shadow-lg">
          <nav className="container-page py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-sm font-medium text-mumsy-dark hover:text-mumsy-purple hover:bg-mumsy-soft/50 rounded-lg transition"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
