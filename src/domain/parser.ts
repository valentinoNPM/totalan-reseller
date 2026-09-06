export function normalizeName(name: string): string {
  let normalized = name.normalize('NFKC').trim().replace(/\s+/g, ' ').toUpperCase();
  normalized = normalized.replace(/^SET\s+/, '');
  return normalized;
}

export interface ParsedLine {
  originalText: string;
  normalizedName: string;
  qty: number;
  isIgnored: boolean;
  isValid: boolean;
  error?: string;
}

export function parseOrderText(text: string): ParsedLine[] {
  const lines = text.split('\n');
  const results: ParsedLine[] = [];

  const ignoreExact = [
    'LIST PESANAN SEMENTARA',
    'LIST PESANAN',
    'REKAP ORDERAN'
  ];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      continue; // Skip empty lines
    }

    const upper = trimmed.toUpperCase();
    if (ignoreExact.includes(upper)) {
      results.push({ originalText: rawLine, normalizedName: '', qty: 0, isIgnored: true, isValid: true });
      continue;
    }

    // Remove simple leading bullets like "-", "*", "1.", etc.
    const withoutBullet = trimmed.replace(/^[-*•\d+.]\s+/, '');
    
    // Qty is the last word on the line separated by whitespace
    const match = withoutBullet.match(/^(.*?)\s+([^\s]+)$/);
    if (!match) {
      results.push({ 
        originalText: rawLine, 
        normalizedName: '', 
        qty: 0, 
        isIgnored: false, 
        isValid: false, 
        error: 'Tidak ditemukan quantity di akhir baris' 
      });
      continue;
    }

    const namePart = match[1];
    const qtyPart = match[2];
    
    if (!/^\d+$/.test(qtyPart)) {
      results.push({
        originalText: rawLine,
        normalizedName: '',
        qty: 0,
        isIgnored: false,
        isValid: false,
        error: 'Quantity harus angka positif (bukan pecahan/teks)'
      });
      continue;
    }

    const qty = parseInt(qtyPart, 10);

    if (qty <= 0) {
      results.push({
        originalText: rawLine,
        normalizedName: '',
        qty: 0,
        isIgnored: false,
        isValid: false,
        error: 'Quantity harus angka positif'
      });
      continue;
    }

    results.push({
      originalText: rawLine,
      normalizedName: normalizeName(namePart),
      qty,
      isIgnored: false,
      isValid: true
    });
  }

  return results;
}
