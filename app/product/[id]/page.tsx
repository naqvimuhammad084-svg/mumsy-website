import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { getProductById as getDbProduct } from '@/lib/data';
import { getProductById as getStaticProduct } from '@/data/products';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import type { Product } from '@/lib/types'; // ✅ import Product type

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const dbProduct = await getDbProduct(id);
  const staticProduct = getStaticProduct(id);

  const product = dbProduct ?? staticProduct;
  if (!product) return notFound();

  const isDb = !!dbProduct;

  // ✅ Safe type assertion for images
  const typedProduct = product as Product & { images?: { url: string; sort_order: number }[] };

  const imageUrl = isDb && typedProduct.images?.length
    ? typedProduct.images[0].url
    : 'image' in product
      ? (product as { image: string }).image
      : '/eiliyah-logo.png';

  const benefits = isDb ? (typedProduct.benefits ?? []) : (product as { benefits: string[] }).benefits ?? [];
  const howToUse = isDb ? (typedProduct.how_to_use ?? []) : (product as { howToUse: string[] }).howToUse ?? [];
  const ingredients = isDb ? (typedProduct.ingredients ?? []) : (product as { ingredients: string[] }).ingredients ?? [];
  const faqs = !isDb && 'faqs' in product ? (product as { faqs: { question: string; answer: string }[] }).faqs : [];

  return (
    <div className="container-page py-10 grid md:grid-cols-[1.1fr,1fr] gap-10">
      <div className="relative">
        <div className="absolute -inset-6 bg-mumsy-lavender/30 rounded-3xl blur-xl" />
        <div className="relative bg-white rounded-3xl border border-mumsy-lavender/40 shadow-soft overflow-hidden">
          <div className="aspect-[4/5] relative">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-6"
              unoptimized={imageUrl.startsWith('http')}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mumsy-purple/80">INTIMATE CARE</p>
        <h1 className="mt-2 font-heading text-3xl text-mumsy-dark">{product.name}</h1>
        <p className="mt-3 text-sm text-mumsy-dark/80">{product.description ?? ''}</p>
        <p className="mt-4 text-2xl font-semibold text-mumsy-purple">Rs {product.price.toFixed(0)}</p>
        <div className="mt-4">
          <AddToCartButton product={{ id: product.id, name: product.name, price: product.price }} />
        </div>

        <div className="mt-8 space-y-6">
          {benefits.length > 0 && (
            <DetailSection title="Benefits">
              <ul className="list-disc list-inside text-sm text-mumsy-dark/80 space-y-1">
                {benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </DetailSection>
          )}
          {howToUse.length > 0 && (
            <DetailSection title="How to use">
              <ol className="list-decimal list-inside text-sm text-mumsy-dark/80 space-y-1">
                {howToUse.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </DetailSection>
          )}
          {ingredients.length > 0 && (
            <DetailSection title="Key ingredients">
              <ul className="list-disc list-inside text-sm text-mumsy-dark/80 space-y-1">
                {ingredients.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </DetailSection>
          )}
          {faqs.length > 0 && (
            <DetailSection title="FAQs">
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <p className="text-sm font-semibold text-mumsy-dark">{faq.question}</p>
                    <p className="text-sm text-mumsy-dark/80 mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}
          <p className="text-xs text-mumsy-dark/65">
            Discreet packaging. For external use only. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider for medical concerns.
          </p>
        </div>

        <div className="mt-6">
          <a
            href="https://wa.me/923032379096?text=Hi%20I%20would%20like%20a%20private%20consultation%20about%20EILIYAH%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#20BD5A] transition"
          >
            WhatsApp Consultation
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-xl text-mumsy-dark">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}