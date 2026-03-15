import Link from 'next/link';
import Image from 'next/image';
import { getRanges } from '@/lib/data';

export const metadata = {
  title: 'Ranges • EILIYAH Intimate Care'
};

export default async function RangesPage() {
  const list = await getRanges();

  return (
    <div className="container-page py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
        OUR RANGES
      </p>
      <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
        Explore EILIYAH by range.
      </h1>
      <p className="mt-3 text-sm text-mumsy-dark/80 max-w-xl">
        Each range is designed for a specific need—discover products and
        bundles that fit your routine.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((range) => (
          <Link
            key={range.id}
            href={`/range/${range.slug}`}
            className="group block rounded-3xl bg-white border border-mumsy-lavender/40 shadow-soft/40 p-6 hover:border-mumsy-purple/50 hover:shadow-soft transition"
          >
            <div className="relative aspect-square w-full max-w-[180px] mx-auto rounded-2xl bg-mumsy-soft overflow-hidden">
              <Image
                src={range.logo_url?.trim() ? range.logo_url : '/eiliyah-logo.png'}
                alt={range.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform"
                unoptimized={(range.logo_url?.trim() ?? '').startsWith('http')}
              />
            </div>
            <h2 className="mt-4 font-heading text-xl text-mumsy-dark text-center">
              {range.name}
            </h2>
            {range.description && (
              <p className="mt-1 text-sm text-mumsy-dark/70 text-center line-clamp-2">
                {range.description}
              </p>
            )}
            <p className="mt-3 text-sm font-medium text-mumsy-purple text-center">
              View range →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
