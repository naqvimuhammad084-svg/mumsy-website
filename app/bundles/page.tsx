import { BundleCard } from '@/components/BundleCard';
import { getAllBundlesWithProducts, getAllBundles } from '@/lib/data';

export const metadata = {
  title: 'Bundles • EILIYAH Intimate Care'
};

export default async function BundlesPage() {
  const dbBundles = await getAllBundlesWithProducts();
  const fallback = await getAllBundles();
  const bundles = dbBundles.length > 0 ? dbBundles : fallback;

  const bundleCards = bundles.map((bundle) => {
    if ('includedProducts' in bundle && Array.isArray((bundle as { includedProducts?: { product: { id: string; name: string; price: number; description?: string | null; images: { url: string }[] }; quantity: number }[] }).includedProducts)) {
      const b = bundle as import('@/lib/data').BundleWithProducts;
      return {
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
      };
    }
    return {
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      savings_label: (bundle as { savings_label?: string }).savings_label,
    };
  });

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
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {bundleCards.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}
