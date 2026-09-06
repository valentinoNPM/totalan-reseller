import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { parseOrderText, type ParsedLine } from '../../domain/parser';
import { calculateOrderTotals, type PricingProduct } from '../../domain/pricing';
import { Trash2, Copy, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import './totalan.css';

interface CatalogProduct extends PricingProduct {
  id: string;
  normalized_name: string;
  name: string;
}

interface PreviewItem extends ParsedLine {
  catalogProduct?: CatalogProduct;
  manualQty?: number;
}

const formatRupiah = (value: number) => `Rp${value.toLocaleString('id-ID')}`;

const tierLabel: Record<'reseller' | 'grosir' | 'partai', string> = {
  reseller: 'Reseller',
  grosir: 'Grosir',
  partai: 'Partai',
};

export default function Totalan() {
  const [rawText, setRawText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [shippingMode, setShippingMode] = useState<'prepaid'|'collect'>('prepaid');
  const [shippingAmountText, setShippingAmountText] = useState('');
  
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [aliases, setAliases] = useState<Record<string, string>>({}); // alias -> canonical id
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState('');

  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const [hasPreview, setHasPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoadingCatalog(true);
    // Fetch products
    const { data: pData, error: pErr } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);
      
    if (pErr) {
      setCatalogError('Gagal memuat katalog: ' + pErr.message);
    } else {
      setCatalog(pData || []);
    }

    // Fetch aliases
    const { data: aData, error: aErr } = await supabase
      .from('product_names')
      .select('*')
      .eq('kind', 'alias');
      
    if (!aErr && aData) {
      const aliasMap: Record<string, string> = {};
      aData.forEach(a => {
        aliasMap[a.normalized_name] = a.product_id;
      });
      setAliases(aliasMap);
    }
    
    setLoadingCatalog(false);
  };

  const handleBaca = () => {
    const parsed = parseOrderText(rawText);
    const enriched: PreviewItem[] = parsed.map(item => {
      if (item.isIgnored || !item.isValid) return { ...item } as PreviewItem;
      
      // Resolve against catalog
      let found = catalog.find(p => p.normalized_name === item.normalizedName);
      if (!found && aliases[item.normalizedName]) {
        found = catalog.find(p => p.id === aliases[item.normalizedName]);
      }

      return {
        ...item,
        catalogProduct: found,
        manualQty: item.qty
      } as PreviewItem;
    });
    
    // Group identical products (as per BUSINESS_RULES: Gabungkan baris dengan product_id sama)
    const grouped: PreviewItem[] = [];
    for (const item of enriched) {
      if (!item.isValid || item.isIgnored) {
        grouped.push(item);
        continue;
      }
      
      if (item.catalogProduct) {
        const existing = grouped.find(g => g.catalogProduct?.id === item.catalogProduct!.id);
        if (existing) {
          existing.manualQty = (existing.manualQty || 0) + (item.manualQty || 0);
          existing.qty = existing.manualQty || 0;
          continue;
        }
      }
      grouped.push(item);
    }

    setPreviewItems(grouped);
    setHasPreview(true);
  };

  const updateItemQty = (index: number, newQty: string) => {
    const updated = [...previewItems];
    const qty = parseInt(newQty, 10);
    updated[index].manualQty = isNaN(qty) ? 0 : qty;
    setPreviewItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...previewItems];
    updated.splice(index, 1);
    setPreviewItems(updated);
  };

  const shippingAmount = shippingAmountText === '' ? null : parseInt(shippingAmountText, 10) || 0;

  const validPricingItems = useMemo(() => {
    return previewItems
      .filter(i => i.isValid && !i.isIgnored && i.catalogProduct && (i.manualQty || 0) > 0)
      .map(i => ({
        qty: i.manualQty || 0,
        product: i.catalogProduct!
      }));
  }, [previewItems]);

  const totals = calculateOrderTotals(validPricingItems, shippingMode, shippingAmount);

  const getPrice = (product: CatalogProduct) => product[
    totals.tier === 'partai'
      ? 'bulk_price'
      : totals.tier === 'grosir'
        ? 'wholesale_price'
        : 'reseller_price'
  ];

  const hasErrors = previewItems.some(i => !i.isIgnored && (!i.isValid || !i.catalogProduct));
  const canSave = hasPreview && !hasErrors && validPricingItems.length > 0;

  const handleCopyText = async () => {
    const lines = validPricingItems.map(item => 
      `${item.product.name} = ${item.qty} pcs @ Rp${(item.product as any)[totals.tier === 'partai' ? 'bulk_price' : totals.tier === 'grosir' ? 'wholesale_price' : 'reseller_price'].toLocaleString('id-ID')}`
    );
    lines.push('--------------------------------');
    lines.push(`Total Pcs: ${totals.totalQty}`);
    lines.push(`Subtotal Barang: Rp${totals.goodsTotal.toLocaleString('id-ID')}`);
    if (shippingMode === 'prepaid' && shippingAmount !== null) {
      lines.push(`Ongkos Kirim: Rp${shippingAmount.toLocaleString('id-ID')}`);
    }
    lines.push(`Total Transfer: Rp${totals.transferTotal.toLocaleString('id-ID')}`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      alert('Teks disalin!');
    } catch {
      alert('Gagal menyalin teks (clipboard error).');
    }
  };

  const handleExportPNG = async () => {
    if (!printRef.current) return;
    const invoiceElement = printRef.current;
    invoiceElement.classList.add('invoice-exporting');
    try {
      const dataUrl = await toPng(invoiceElement, {
        backgroundColor: '#ffffff',
        cacheBust: true,
        pixelRatio: 2,
        width: 760,
        style: {
          width: '760px',
          maxWidth: 'none',
          margin: '0',
        },
      });
      const link = document.createElement('a');
      const safeName = (customerName.trim() || 'Reseller').replace(/[^a-zA-Z0-9-_]+/g, '-');
      link.download = `Pre-Invoice-${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('Gagal mengekspor gambar.');
    } finally {
      invoiceElement.classList.remove('invoice-exporting');
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    
    // Create payload
    const payload = {
      idempotency_key: crypto.randomUUID(), // For M4 demo, use random UUID for new save
      payload_hash: 'dummy-hash-for-now', // Should be a real hash of contents
      customer: {
        name: customerName,
        phone: customerPhone,
        normalized_phone: customerPhone.replace(/\D/g, '')
      },
      tier: totals.tier,
      qty_total: totals.totalQty,
      goods_total: totals.goodsTotal,
      shipping_mode: shippingMode,
      shipping_amount: shippingAmount || 0,
      transfer_total: totals.transferTotal,
      total_is_provisional: totals.isProvisional,
      raw_text: rawText,
      items: validPricingItems.map((item, idx) => ({
        position: idx + 1,
        product_id: item.product.id,
        name_snapshot: item.product.name,
        qty: item.qty,
        reseller_snapshot: item.product.reseller_price,
        wholesale_snapshot: item.product.wholesale_price,
        bulk_snapshot: item.product.bulk_price,
        unit_price: item.product[totals.tier === 'partai' ? 'bulk_price' : totals.tier === 'grosir' ? 'wholesale_price' : 'reseller_price'],
        line_total: item.qty * item.product[totals.tier === 'partai' ? 'bulk_price' : totals.tier === 'grosir' ? 'wholesale_price' : 'reseller_price']
      }))
    };

    const { data, error } = await supabase.rpc('save_order_transaction', { payload });
    
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      alert('Berhasil disimpan! Order ID: ' + (data as any).order_id);
      // Reset form
      setRawText('');
      setCustomerName('');
      setCustomerPhone('');
      setHasPreview(false);
    }
  };

  return (
    <div style={{ paddingBottom: '140px' }}>
      <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Buat Totalan</h2>
      
      {catalogError && <div style={{ color: 'var(--color-error)' }}>{catalogError}</div>}
      
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <input 
          placeholder="Nama Customer (opsional)" 
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
        />
        <input 
          placeholder="No HP (opsional)" 
          type="tel"
          value={customerPhone}
          onChange={e => setCustomerPhone(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <textarea 
          placeholder="Tempel rekap pesanan dari WA di sini..."
          value={rawText}
          onChange={e => {
            setRawText(e.target.value);
            setHasPreview(false); // require re-parse
          }}
          rows={8}
        />
        <button 
          className="primary" 
          onClick={handleBaca} 
          style={{ width: '100%', marginTop: 'var(--spacing-2)' }}
          disabled={loadingCatalog || !rawText.trim()}
        >
          {loadingCatalog ? 'Memuat Katalog...' : 'Baca Pesanan'}
        </button>
      </div>

      {hasPreview && (
        <>
          <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Review Pesanan</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
            {previewItems.map((item, idx) => {
              if (item.isIgnored) return null;

              if (!item.isValid) {
                return (
                  <div key={idx} style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', color: 'var(--color-error)' }}>
                    <div><strong>Teks Asli:</strong> {item.originalText}</div>
                    <div style={{ fontSize: '12px' }}>Pesan: {item.error}</div>
                    <button onClick={() => removeItem(idx)} style={{ marginTop: 'var(--spacing-2)', minHeight: 'auto', padding: '4px' }} data-html2canvas-ignore>Hapus Baris</button>
                  </div>
                );
              }

              if (!item.catalogProduct) {
                return (
                  <div key={idx} style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ color: 'var(--color-error)' }}><strong>Tidak Dikenali:</strong> {item.normalizedName}</div>
                    <div style={{ fontSize: '12px' }}>Teks Asli: {item.originalText}</div>
                    <button onClick={() => removeItem(idx)} style={{ marginTop: 'var(--spacing-2)', minHeight: 'auto', padding: '4px' }} data-html2canvas-ignore>Hapus Baris</button>
                  </div>
                );
              }

              return (
                <div key={idx} style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{item.catalogProduct.name}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                      Teks asli: {item.originalText}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <input 
                      type="number" 
                      value={item.manualQty} 
                      onChange={e => updateItemQty(idx, e.target.value)}
                      style={{ width: '60px', padding: 'var(--spacing-2)', minHeight: '36px' }}
                      inputMode="numeric"
                    />
                    <button onClick={() => removeItem(idx)} style={{ padding: '8px', minHeight: 'auto', color: 'var(--color-error)' }} data-html2canvas-ignore>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {canSave && (
            <section className="invoice-preview-shell" aria-label="Pratinjau gambar pre-invoice">
              <div className="invoice-document" ref={printRef}>
                <header className="invoice-header">
                  <div>
                    <div className="invoice-eyebrow">TOTALAN RESELLER</div>
                    <h3>PRE-INVOICE</h3>
                    <p>Ringkasan pesanan</p>
                  </div>
                  <div className="invoice-customer">
                    <span>Nama Reseller</span>
                    <strong>{customerName.trim() || 'Reseller'}</strong>
                    {customerPhone.trim() && <small>{customerPhone.trim()}</small>}
                  </div>
                </header>

                <div className="invoice-tier">
                  Harga <strong>{tierLabel[totals.tier]}</strong> · Total {totals.totalQty} pcs
                </div>

                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Harga ({tierLabel[totals.tier]})</th>
                      <th>Qty</th>
                      <th>Sub Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validPricingItems.map(item => {
                      const unitPrice = getPrice(item.product);
                      return (
                        <tr key={item.product.id}>
                          <td>{item.product.name}</td>
                          <td>{formatRupiah(unitPrice)}</td>
                          <td>{item.qty}</td>
                          <td>{formatRupiah(unitPrice * item.qty)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="invoice-summary">
                  <div><span>Total Qty</span><strong>{totals.totalQty} pcs</strong></div>
                  <div><span>Total Barang</span><strong>{formatRupiah(totals.goodsTotal)}</strong></div>
                  <div>
                    <span>Ongkos Kirim</span>
                    <strong>
                      {shippingMode === 'collect'
                        ? shippingAmount === null ? 'Bayar di tempat' : `${formatRupiah(shippingAmount)} (di tempat)`
                        : shippingAmount === null ? 'Belum termasuk' : formatRupiah(shippingAmount)}
                    </strong>
                  </div>
                  <div className="invoice-grand-total">
                    <span>{totals.isProvisional ? 'Total Sementara' : 'Total Transfer'}</span>
                    <strong>{formatRupiah(totals.transferTotal)}</strong>
                  </div>
                </div>

                <footer className="invoice-footer">
                  Pre-invoice ini merupakan ringkasan pesanan dan bukan bukti pembayaran.
                </footer>
              </div>
            </section>
          )}

          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', marginBottom: 'var(--spacing-5)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-3)' }}>Ongkos Kirim (Opsional)</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <select 
                value={shippingMode} 
                onChange={e => setShippingMode(e.target.value as any)}
                style={{ flex: 1 }}
              >
                <option value="prepaid">Dibayar Langsung (Prepaid)</option>
                <option value="collect">Bayar di Tempat (Collect)</option>
              </select>
              <input 
                type="number" 
                placeholder="Nominal (opsional)" 
                value={shippingAmountText}
                onChange={e => setShippingAmountText(e.target.value)}
                style={{ flex: 1 }}
                inputMode="numeric"
              />
            </div>
            {shippingMode === 'collect' && shippingAmount === null && (
              <div style={{ fontSize: '12px', marginTop: 'var(--spacing-2)', color: 'var(--color-text-light)' }}>
                Ongkir akan mengikuti tagihan ekspedisi saat diterima.
              </div>
            )}
            {shippingMode === 'prepaid' && shippingAmount === null && (
              <div style={{ fontSize: '12px', marginTop: 'var(--spacing-2)', color: 'var(--color-text-light)' }}>
                Total sementara (belum termasuk ongkir).
              </div>
            )}
          </div>

          <div style={{ 
            position: 'fixed', 
            bottom: '65px', 
            left: 0, 
            right: 0, 
            padding: 'var(--spacing-3)', 
            backgroundColor: 'var(--color-bg)',
            borderTop: '1px solid var(--color-border)',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)', fontSize: '14px' }}>
              <span>Total Pcs: {totals.totalQty} ({totals.tier})</span>
              <span>Barang: Rp{totals.goodsTotal.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
              <strong>Transfer:</strong>
              <strong style={{ fontSize: '20px', color: 'var(--color-primary-dark)' }}>
                Rp{totals.transferTotal.toLocaleString('id-ID')}
              </strong>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <button style={{ flex: 1, padding: '8px' }} onClick={handleCopyText} disabled={!canSave}>
                <Copy size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Teks
              </button>
              <button style={{ flex: 1, padding: '8px' }} onClick={handleExportPNG} disabled={!canSave}>
                <ImageIcon size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Gambar
              </button>
            </div>
            <button 
              className="primary" 
              style={{ width: '100%' }}
              disabled={!canSave}
              onClick={handleSave}
            >
              Simpan Totalan
            </button>
            {hasErrors && (
              <div style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: 'var(--spacing-2)', textAlign: 'center' }}>
                Ada baris bermasalah, perbaiki atau hapus sebelum menyimpan.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
