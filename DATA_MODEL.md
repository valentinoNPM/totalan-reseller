# Data Model dan Kontrak Transaksi

ID UUID kecuali nomor tampilan sequence. Timestamp timestamptz UTC. Uang bigint rupiah nonnegatif; konversi JSON ke integer aman terverifikasi. Qty integer positif, agregat dicek overflow. Nama normalisasi memiliki satu implementasi konsisten dan test parity JS/SQL.

## Tabel

| Tabel | Field utama dan constraint |
|---|---|
| staff_profiles | user_id FK auth.users, active, display_name; akun nonaktif ditolak RLS |
| private.login_identities | username_normalized unique, user_id unique, auth_email; tidak diekspos Data API |
| products | id, name, normalized_name unique, reseller_price, wholesale_price, bulk_price, active, version, created_at, updated_at |
| product_names | normalized_name PK, product_id FK, kind canonical/alias; satu namespace untuk mencegah alias berbenturan dengan nama produk lain |
| customers | id, name nullable, normalized_name indexed nonunique, phone nullable, normalized_phone unique where not null, created_at, updated_at; minimal nama atau HP |
| orders | id, order_number unique server sequence, customer_id nullable, current_revision, created_by, created_at, updated_at |
| order_revisions | order_id + version PK, raw_text, customer_name_snapshot, customer_phone_snapshot, tier, qty_total, goods_total, shipping_mode, shipping_amount nullable, courier nullable, service nullable, transfer_total, total_is_provisional, actor_id, created_at |
| order_items | order_id + revision + position unique, product_id FK, name_snapshot, qty, reseller_snapshot, wholesale_snapshot, bulk_snapshot, unit_price, line_total |
| save_requests | actor_id + idempotency_key unique, payload_hash, order_id, revision; tidak dapat dimanipulasi browser |
| product_changes | id, product_id, before/after fields, actor_id, created_at; rekam perubahan master |
| private.login_attempts | bucket hash username/IP, waktu dan count untuk throttling atomik, expiry; tidak berisi password |

Jangan hard delete produk, order, revisi atau customer yang direferensikan. products.name dan entry canonical product_names diperbarui atomik. Aliases yang sudah tidak valid dapat dihapus melalui master, snapshot lama tidak berubah. Seed memakai ID stabil terdefinisi, tidak meregenerasi ID setiap run.

## save_totalan kontrak

Input: idempotency_key, optional order_id, expected_version untuk edit, customer selection/new data, raw_text, resolved product IDs dan qty, reviewed catalog versions untuk item baru, shipping fields. Tidak menerima total client sebagai otoritatif.

1. Validasi auth.uid dan active membership, ukuran payload, qty/harga/ongkir.
2. Cek idempotency scoped actor. Key+payload sama → hasil tersimpan; beda payload → conflict.
3. Untuk edit lock order dan cocokkan expected_version. Terapkan harga snapshot lama sesuai BUSINESS_RULES.
4. Resolve customer berdasarkan ID/HP atau pilihan explicit create untuk nama sama. Race HP ditangani unique constraint.
5. Lock/read katalog aktif untuk item baru. Bandingkan versi yang ditinjau. Konflik mengembalikan error terstruktur sebelum mutasi apa pun.
6. Hitung tier, semua subtotal dan ongkir di database. Simpan header jika baru, revision immutable, items, customer jika baru, dan save_request dalam transaksi yang sama.
7. Return snapshot committed lengkap. Exception → rollback semua perubahan termasuk customer.

Error codes minimal: INVALID_INPUT, UNKNOWN_PRODUCT, INACTIVE_PRODUCT, CATALOG_CHANGED, CUSTOMER_CONFLICT, VERSION_CONFLICT, IDEMPOTENCY_CONFLICT, UNAUTHORIZED. UI menerjemahkan menjadi Bahasa Indonesia dan mempertahankan input.

## RLS dan grants

anon: tidak dapat membaca/menulis data bisnis atau menjalankan RPC bisnis. authenticated: hanya staff aktif dapat membaca shared business data. Rekapan terlihat lintas akun staff yang aktif, bukan hanya pembuatnya. Tidak ada tenant/organisasi tambahan di MVP.

Direct write orders/revisions/items/save_requests ditolak; gunakan RPC terjaga. RPC security definer jika diperlukan harus fixed search_path, schema-qualified, explicit auth membership checks, revoke execute public/anon dan grant hanya yang diperlukan. Private identity dan login limit hanya function operator/service, tidak dapat dibaca staff melalui browser. Master update juga memvalidasi keanggotaan, angka, nama dan alias.

## Index dan migrasi

Index nomor totalan, orders.created_at desc, customer name/phone, product normalized name dan product_names. Riwayat dibatasi 25–50 per halaman. Jangan memuat seluruh revision untuk daftar. SQL migrations versioned, reproducible dan dapat dijalankan pada database kosong. Seed default insert-only/idempotent; rerun tidak menimpa harga yang sudah diubah pengguna.
