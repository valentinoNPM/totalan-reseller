import { describe, it, expect } from 'vitest';
import { calculateTier, calculateOrderTotals, type PricingProduct } from './pricing';

describe('Pricing Domain', () => {
  it('calculates tier correctly', () => {
    expect(calculateTier(1)).toBe('reseller');
    expect(calculateTier(11)).toBe('reseller');
    expect(calculateTier(12)).toBe('grosir');
    expect(calculateTier(49)).toBe('grosir');
    expect(calculateTier(50)).toBe('partai');
    expect(calculateTier(208)).toBe('partai');
  });

  it('calculates totals correctly (Prepaid + nominal)', () => {
    const mockProduct: PricingProduct = {
      reseller_price: 55000,
      wholesale_price: 53000,
      bulk_price: 52000
    };

    const items = [{ qty: 10, product: mockProduct }];
    // Tier: reseller (qty 10)
    // unitPrice = 55000
    // goodsTotal = 550000
    
    const result = calculateOrderTotals(items, 'prepaid', 35000);
    expect(result.tier).toBe('reseller');
    expect(result.goodsTotal).toBe(550000);
    expect(result.transferTotal).toBe(585000); // 550000 + 35000
    expect(result.isProvisional).toBe(false);
  });

  it('calculates totals correctly (Collect)', () => {
    const mockProduct: PricingProduct = {
      reseller_price: 55000,
      wholesale_price: 53000,
      bulk_price: 52000
    };

    const items = [{ qty: 12, product: mockProduct }]; // grosir
    
    const result = calculateOrderTotals(items, 'collect', 35000);
    expect(result.tier).toBe('grosir');
    expect(result.goodsTotal).toBe(12 * 53000);
    expect(result.transferTotal).toBe(12 * 53000); // ongkir collect tidak ditambah ke transfer
  });
});
