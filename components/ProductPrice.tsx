import { getEffectivePrice, hasSalePrice } from '@/lib/pricing';

type ProductPriceProps = {
  price: number;
  salePrice?: number | null;
  className?: string;
  size?: 'sm' | 'lg';
};

export function ProductPrice({ price, salePrice, className = '', size = 'sm' }: ProductPriceProps) {
  const onSale = hasSalePrice(price, salePrice);
  const effective = getEffectivePrice(price, salePrice);
  const prominentClass = size === 'lg' ? 'text-2xl' : 'text-base';
  const struckClass = size === 'lg' ? 'text-lg' : 'text-sm';

  if (!onSale) {
    return (
      <p className={`font-semibold text-mumsy-purple ${prominentClass} ${className}`}>
        Rs {price.toFixed(0)}
      </p>
    );
  }

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <p className={`font-semibold text-mumsy-purple ${prominentClass}`}>
        Rs {effective.toFixed(0)}
      </p>
      <p className={`text-mumsy-dark/50 line-through ${struckClass}`}>
        Rs {price.toFixed(0)}
      </p>
    </div>
  );
}
