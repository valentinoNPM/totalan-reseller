export type Tier = 'reseller' | 'grosir' | 'partai';

export function calculateTier(totalQty: number): Tier {
  if (totalQty >= 50) return 'partai';
  if (totalQty >= 12) return 'grosir';
  return 'reseller';
}

export interface PricingProduct {
  reseller_price: number;
  wholesale_price: number;
  bulk_price: number;
}

export function getUnitPrice(product: PricingProduct, tier: Tier): number {
  switch (tier) {
    case 'partai': return product.bulk_price;
    case 'grosir': return product.wholesale_price;
    case 'reseller': return product.reseller_price;
  }
}

export interface OrderItem {
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export function calculateOrderTotals(
  items: { qty: number; product: PricingProduct }[], 
  shippingMode: 'prepaid' | 'collect', 
  shippingAmount: number | null
) {
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const tier = calculateTier(totalQty);
  
  const pricedItems: OrderItem[] = items.map(item => {
    const unitPrice = getUnitPrice(item.product, tier);
    return {
      qty: item.qty,
      unitPrice,
      lineTotal: item.qty * unitPrice
    };
  });

  const goodsTotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  
  let transferTotal = goodsTotal;
  const isProvisional = shippingMode === 'prepaid' && shippingAmount === null;

  if (shippingMode === 'prepaid' && shippingAmount !== null) {
    transferTotal += shippingAmount;
  }

  return {
    tier,
    totalQty,
    pricedItems,
    goodsTotal,
    transferTotal,
    isProvisional
  };
}
