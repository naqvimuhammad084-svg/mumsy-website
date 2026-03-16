'use client';

import { useEffect, useState } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 border-b border-white/40 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 shadow-[0_18px_45px_rgba(48,10,80,0.14)] py-1.5'
          : 'bg-white/60 shadow-[0_14px_35px_rgba(48,10,80,0.08)] py-3'
      }`}
    >
      <div className="container-page flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative h-9 w-9 rounded-2xl bg-mumsy-purple/95 overflow-hidden shadow-[0_10px_30px_rgba(91,44,131,0.35)]">
            <Image
              src="/eiliyah-logo.png"
              alt="EILIYAH"
              fill
              className="object-cover"
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
              className="relative pb-0.5 hover:text-mumsy-purple transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-mumsy-purple after:transition-all after:duration-300 hover:after:w-full"
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
