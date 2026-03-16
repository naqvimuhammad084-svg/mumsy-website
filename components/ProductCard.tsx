import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: { url: string }[];
  shortBenefit?: string;
  description?: string;
};

function getImageUrl(p: ProductCardData): string {
  if (p.image?.trim()) return p.image;
  const first = p.images?.[0]?.url?.trim();
  if (first) return first;
  return '/eiliyah-logo.png';
}

function getShortBenefit(p: ProductCardData): string {
  if (p.shortBenefit) return p.shortBenefit;
  if (p.description) return p.description.slice(0, 90) + (p.description.length > 90 ? '…' : '');
  return '';
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const imageUrl = getImageUrl(product);
  const benefit = getShortBenefit(product);

  return (
    <article className="group bg-white/80 rounded-3xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-mumsy-soft/80 to-white"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(147,115,255,0.10),_transparent_55%)]" />
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={imageUrl.startsWith('http')}
        />
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-heading text-lg text-mumsy-dark">{product.name}</h3>
        {benefit && (
          <p className="mt-1 text-sm text-mumsy-dark/70">{benefit}</p>
        )}
        <p className="mt-3 text-base font-semibold text-mumsy-purple">
          Rs {product.price.toFixed(0)}
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-mumsy-purple/40 text-mumsy-purple px-3 py-2 text-xs font-semibold hover:border-mumsy-purple hover:bg-mumsy-soft transition"
          >
            View details
          </Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
