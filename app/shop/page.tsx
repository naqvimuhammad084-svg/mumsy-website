import { ProductCard } from '@/components/ProductCard';
import { getAllProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Shop • EILIYAH Intimate Care'
};

export default async function ShopPage() {
  let products;
  try {
    products = await getAllProducts();
  } catch (err) {
    console.error('[ShopPage] Failed to load products:', err);
    return (
      <div className="container-page py-10">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
            SHOP
          </p>
          <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
            Explore the EILIYAH collection.
          </h1>
        </header>
        <p className="mt-8 text-sm text-mumsy-dark/70">
          Products are temporarily unavailable. Please refresh or try again shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">
          SHOP
        </p>
        <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">
          Explore the EILIYAH collection.
        </h1>
        <p className="mt-3 text-sm text-mumsy-dark/80">
          Gentle, comforting formulas for the external intimate area.
        </p>
      </header>
      {products.length === 0 ? (
        <p className="mt-8 text-sm text-mumsy-dark/70">No products available yet.</p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description ?? undefined,
                images: product.images
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
