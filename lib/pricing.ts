/** Returns the price customers pay (sale price when valid, otherwise regular). */
export function getEffectivePrice(price: number, salePrice?: number | null): number {
  if (salePrice != null && salePrice > 0 && salePrice < price) {
    return salePrice;
  }
  return price;
}

export function hasSalePrice(price: number, salePrice?: number | null): boolean {
  return salePrice != null && salePrice > 0 && salePrice < price;
}
