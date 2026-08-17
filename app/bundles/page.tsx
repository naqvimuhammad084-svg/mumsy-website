import { BundleCard } from '@/components/BundleCard';
import { getAllBundlesWithProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Bundles • EILIYAH Intimate Care'
};

export default async function BundlesPage() {
  let bundles;
  try {
    bundles = await getAllBundlesWithProducts();
  } catch (err) {
    console.error('[BundlesPage] Failed to load bundles:', err);
    return (
      <div className="container-page py-10">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
            BUNDLES
          </p>
          <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
            Thoughtfully curated bundles for every season of womanhood.
          </h1>
        </header>
        <p className="mt-8 text-sm text-mumsy-dark/70">
          Bundles are temporarily unavailable. Please refresh or try again shortly.
        </p>
      </div>
    );
  }

  const bundleCards = bundles.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    price: b.price,
    savings_label: b.savings_label,
    includedProductDetails: b.includedProducts.map(({ product, quantity }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.images?.[0]?.url?.trim() || null,
      quantity,
    })),
  }));

  return (
    <div className="container-page py-10">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
          BUNDLES
        </p>
        <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
          Thoughtfully curated bundles for every season of womanhood.
        </h1>
        <p className="mt-3 text-sm text-mumsy-dark/80">
          Save more with routines designed around daily comfort, brightening,
          and more. Discreet packaging on every order.
        </p>
      </header>
      {bundleCards.length === 0 ? (
        <p className="mt-8 text-sm text-mumsy-dark/70">No bundles available yet.</p>
      ) : (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {bundleCards.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  );
}
