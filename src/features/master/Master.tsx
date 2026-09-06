import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit2, Save, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  normalized_name: string;
  reseller_price: number;
  wholesale_price: number;
  bulk_price: number;
  active: boolean;
}

export default function Master() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
      
    if (error) {
      setErrorMsg(error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    // Basic validation
    if (
      (editForm.reseller_price ?? 0) < (editForm.wholesale_price ?? 0) ||
      (editForm.wholesale_price ?? 0) < (editForm.bulk_price ?? 0)
    ) {
      if (!window.confirm('Peringatan: Urutan harga (Reseller >= Grosir >= Partai) tidak menurun. Yakin simpan pengecualian ini?')) {
        return;
      }
    }

    const { error } = await supabase
      .from('products')
      .update({
        reseller_price: editForm.reseller_price,
        wholesale_price: editForm.wholesale_price,
        bulk_price: editForm.bulk_price,
        active: editForm.active,
      })
      .eq('id', id);

    if (error) {
      alert('Gagal menyimpan: ' + error.message);
      return;
    }

    setEditingId(null);
    fetchProducts();
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Master Data Produk</h2>
      {errorMsg && <div style={{ color: 'var(--color-error)' }}>{errorMsg}</div>}
      
      {loading ? (
        <p>Memuat...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {products.map(p => {
            const isEditing = editingId === p.id;
            return (
              <div key={p.id} style={{
                border: '1px solid var(--color-border)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: p.active ? 'var(--color-bg)' : 'var(--color-bg-alt)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                  <strong style={{ opacity: p.active ? 1 : 0.5 }}>{p.name}</strong>
                  {!isEditing && (
                    <button onClick={() => handleEdit(p)} style={{ padding: '4px', minHeight: 'auto' }}>
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div style={{ display: 'grid', gap: 'var(--spacing-2)', gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <label style={{ fontSize: '12px' }}>Reseller</label>
                      <input 
                        type="number" 
                        value={editForm.reseller_price}
                        onChange={e => setEditForm({...editForm, reseller_price: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px' }}>Grosir</label>
                      <input 
                        type="number" 
                        value={editForm.wholesale_price}
                        onChange={e => setEditForm({...editForm, wholesale_price: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px' }}>Partai</label>
                      <input 
                        type="number" 
                        value={editForm.bulk_price}
                        onChange={e => setEditForm({...editForm, bulk_price: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px' }}>Status</label>
                      <select 
                        value={editForm.active ? 'active' : 'inactive'}
                        onChange={e => setEditForm({...editForm, active: e.target.value === 'active'})}
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                      <button className="primary" onClick={() => handleSave(p.id)} style={{ flex: 1, padding: '8px', minHeight: 'auto' }}>
                        <Save size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Simpan
                      </button>
                      <button onClick={handleCancel} style={{ flex: 1, padding: '8px', minHeight: 'auto' }}>
                        <X size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '14px', opacity: p.active ? 1 : 0.5 }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Reseller</div>
                      Rp{p.reseller_price.toLocaleString('id-ID')}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Grosir</div>
                      Rp{p.wholesale_price.toLocaleString('id-ID')}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Partai</div>
                      Rp{p.bulk_price.toLocaleString('id-ID')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
