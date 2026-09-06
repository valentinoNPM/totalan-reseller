import { describe, it, expect } from 'vitest';
import { parseOrderText, normalizeName } from './parser';

describe('Parser Domain', () => {
  it('normalizes names correctly', () => {
    expect(normalizeName('SET 7/8 BUSUI')).toBe('7/8 BUSUI');
    expect(normalizeName(' ANAK   XXL ')).toBe('ANAK XXL');
    expect(normalizeName('set moana')).toBe('MOANA');
    expect(normalizeName('set Set Moana')).toBe('SET MOANA'); // Only removes first SET
  });

  it('parses valid order text', () => {
    const text = `List pesanan
Febby 50
Dania pdk 18
Rosy 16
Hana 33
Kimono Kombi 13
Hagia pdk 10
Yoona pdk 12
Anak M 17
Anak L 11
Anak XL 16
Anak XXL 12`;

    const results = parseOrderText(text);
    
    // First line ignored
    expect(results[0].isIgnored).toBe(true);
    
    // 11 valid lines
    const validLines = results.filter(r => r.isValid && !r.isIgnored);
    expect(validLines.length).toBe(11);
    
    expect(validLines[0].normalizedName).toBe('FEBBY');
    expect(validLines[0].qty).toBe(50);
    
    expect(validLines[10].normalizedName).toBe('ANAK XXL');
    expect(validLines[10].qty).toBe(12);
  });

  it('marks invalid lines', () => {
    const text = `Febby
Dania pdk -5
Rosy abc
Hana 1.5`;

    const results = parseOrderText(text);
    expect(results.every(r => !r.isValid)).toBe(true);
    expect(results[0].error).toContain('Tidak ditemukan quantity');
    expect(results[1].error).toContain('harus angka positif');
  });
});
