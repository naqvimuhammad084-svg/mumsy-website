import { ProductCard } from '@/components/ProductCard';
import { getAllProducts } from '@/lib/data';
import { products as staticProducts } from '@/data/products';

export const metadata = {
  title: 'Shop • EILIYAH Intimate Care'
};

export default async function ShopPage() {
  const dbProducts = await getAllProducts();
  const products = dbProducts.length > 0 ? dbProducts : staticProducts;

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
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={
              'image' in product
                ? product
                : {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    description: product.description ?? undefined,
                    images: product.images
                  }
            }
          />
        ))}
      </div>
    </div>
  );
}
