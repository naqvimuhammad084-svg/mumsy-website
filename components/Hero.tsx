import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="container-page pt-10 pb-16 grid md:grid-cols-[1.2fr,1fr] gap-10 items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80 mb-3">
          INTIMATE CARE • CONFIDENCE • COMFORT
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-mumsy-dark leading-tight">
          Feel confidently
          <span className="text-mumsy-purple"> yourself</span> in your most
          intimate moments.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-mumsy-dark/80 max-w-xl">
          EILIYAH creates gentle, dermatologist-inspired intimate-care essentials
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
            Learn more about intimate care
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-mumsy-dark/80">
          <Badge label="Safe, gentle ingredients" />
          <Badge label="Dermatologist-inspired formulas" />
          <Badge label="Discreet, private packaging" />
          <Badge label="Loved by women at every stage" />
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-8 bg-gradient-to-b from-mumsy-lavender/40 to-mumsy-soft rounded-3xl blur-2xl" />
        <div className="relative bg-white rounded-3xl shadow-soft overflow-hidden border border-mumsy-lavender/40">
          <div className="aspect-[4/5] relative">
            <Image
              src="/eiliyah-logo.png"
              alt="EILIYAH"
              fill
              priority
              className="object-contain p-6"
            />
          </div>
        </div>
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

