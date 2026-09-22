import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Printer } from 'lucide-react';

interface OrderHistory {
  id: string;
  order_number: number;
  current_revision: number;
  customers: {
    name: string;
    phone: string;
  } | null;
  order_revisions: {
    version: number;
    qty_total: number;
    transfer_total: number;
    tier: string;
    created_at: string;
  }[];
}

export default function History() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    // Fetch top 50 recent orders
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        current_revision,
        customers (name, phone),
        order_revisions (
          version, qty_total, transfer_total, tier, created_at
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h2>Riwayat Pesanan</h2>
        <button className="primary" onClick={handlePrint} style={{ minHeight: 'auto', padding: '8px' }}>
          <Printer size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          Cetak Rekap
        </button>
      </div>

      {errorMsg && <div style={{ color: 'var(--color-error)' }}>{errorMsg}</div>}

      {loading ? (
        <p>Memuat...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }} className="print-area">
          {orders.map(o => {
            // Find the current revision's details
            const currentRev = o.order_revisions?.find(r => r.version === o.current_revision);
            
            return (
              <div key={o.id} style={{
                border: '1px solid var(--color-border)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-md)'
              }} className="print-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <strong>Order #{o.order_number}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                    {currentRev ? new Date(currentRev.created_at).toLocaleDateString('id-ID') : ''}
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-2)' }}>
                  <div>Pelanggan: {o.customers?.name || 'Tidak ada nama'} {o.customers?.phone ? `(${o.customers.phone})` : ''}</div>
                </div>

                {currentRev ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '14px', backgroundColor: 'var(--color-bg-alt)', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Total Pcs</div>
                      {currentRev.qty_total} ({currentRev.tier})
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Total Transfer</div>
                      <strong>Rp{currentRev.transfer_total.toLocaleString('id-ID')}</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--color-error)' }}>Data revisi tidak ditemukan</div>
                )}
              </div>
            );
          })}
          
          {orders.length === 0 && <p style={{ color: 'var(--color-text-light)' }}>Belum ada pesanan.</p>}
        </div>
      )}
    </div>
  );
}
