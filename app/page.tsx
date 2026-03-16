import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { BundleCard } from '@/components/BundleCard';
import { TestimonialSection } from '@/components/TestimonialSection';
import { EducationSection } from '@/components/EducationSection';
import { products as staticProducts } from '@/data/products';
import { bundles as staticBundles } from '@/data/bundles';
import { getRanges } from '@/lib/data';
import type { ProductCardData } from '@/components/ProductCard';
import type { BundleCardData } from '@/components/BundleCard';

export const metadata = {
  title: 'EILIYAH Intimate Care',
  description: 'Gentle, dermatologist-inspired intimate-care essentials.'
};

export default async function HomePage() {
  // Load all ranges from Supabase via existing data helper.
  const ranges = await getRanges();
  const featuredProducts: ProductCardData[] = staticProducts.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    shortBenefit: p.shortBenefit
  }));
  const featuredBundles: BundleCardData[] = staticBundles.slice(0, 3).map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    price: b.price,
    savingsLabel: b.savingsLabel
  }));

  return (
    <main>
      <Hero />

      {/* Our Ranges - always show at least VINTIMA */}
      <section className="container-page py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">OUR RANGES</p>
        <h2 className="mt-2 font-heading text-3xl text-mumsy-dark">Explore by range</h2>
        <p className="mt-2 text-sm text-mumsy-dark/80 max-w-xl">
          Each range is designed for a specific need—discover products and bundles that fit your routine.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranges.map((range) => (
            <Link
              key={range.id}
              href={`/range/${range.slug}`}
              className="group block rounded-3xl bg-white border border-mumsy-lavender/40 shadow-soft/40 p-6 hover:border-mumsy-purple/50 hover:shadow-soft transition"
            >
              <div className="relative aspect-square w-full max-w-[180px] mx-auto rounded-2xl bg-mumsy-soft overflow-hidden">
                <Image
                  src={range.logo_url || '/vintima-logo.png'}
                  alt={range.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  unoptimized={(range.logo_url || '').startsWith('http')}
                />
              </div>
              <h3 className="mt-4 font-heading text-xl text-mumsy-dark text-center">{range.name}</h3>
              {range.description && (
                <p className="mt-1 text-sm text-mumsy-dark/70 text-center line-clamp-2">{range.description}</p>
              )}
              <p className="mt-3 text-sm font-medium text-mumsy-purple text-center">View range →</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center">
          <Link href="/ranges" className="text-mumsy-purple font-medium hover:underline">View all ranges</Link>
        </p>
      </section>

      {/* Featured Products */}
      <section className="container-page py-12 border-t border-mumsy-lavender/30">
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">SHOP</p>
        <h2 className="mt-2 font-heading text-3xl text-mumsy-dark">Featured products</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/shop" className="text-mumsy-purple font-medium hover:underline">Shop all products</Link>
        </p>
      </section>

      {/* Curated Bundles */}
      <section className="container-page py-12 border-t border-mumsy-lavender/30">
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">BUNDLES</p>
        <h2 className="mt-2 font-heading text-3xl text-mumsy-dark">Curated bundles</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/bundles" className="text-mumsy-purple font-medium hover:underline">View all bundles</Link>
        </p>
      </section>

      <EducationSection />
      <TestimonialSection />
    </main>
  );
}
