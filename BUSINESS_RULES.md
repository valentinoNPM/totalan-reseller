# Business Rules

## Normalisasi dan parsing

Normalize nama dengan Unicode NFKC, trim, collapse whitespace dan uppercase; hapus token SET hanya di awal nama. Pertahankan ejaan produk sumber termasuk STANDART dan JMB sampai ada alias eksplisit. Jangan menyamakan seluruh pdk ke PDPD global: tiga alias di data/aliases.json adalah pemetaan spesifik.

Qty adalah integer positif terakhir pada baris, dipisahkan whitespace. Contoh ANAK XXL 12 → produk ANAK XXL, qty 12; 7/8 BUSUI 2 → produk 7/8 BUSUI, qty 2. Tidak menerima angka pecahan, negatif, nol, notasi eksponen, atau angka yang melampaui batas integer aman. Batas pengamanan input: maksimal 500 baris atau 50 KB, ditampilkan sebagai batas teknis, bukan aturan penjualan.

Baris kosong dan judul tepat List pesanan sementara, List pesanan, Rekap orderan boleh diabaikan setelah normalisasi. Teks lain yang tidak terurai harus ditandai. Boleh menghapus bullet sederhana di awal; timestamp dan metadata WA tidak dihapus dengan heuristik berisiko. Daftar alias tidak mengandung instruksi eksekusi.

Gabungkan baris dengan product_id sama setelah resolusi, jumlahkan qty, urutan mengikuti kemunculan pertama, dan beri catatan bahwa baris digabung. Simpan teks mentah. Pencocokan fuzzy hanya boleh menyarankan pilihan, tidak boleh menetapkan produk otomatis.

## Harga

1–11 reseller; 12–49 grosir; ≥50 partai. Semua item memakai tier yang sama, harga berbeda per produk. Hitung sebagai integer rupiah di client untuk preview dan ulangi di database sebelum commit. Client tidak berwenang menentukan nilai akhir.

Pada totalan baru, server mengambil harga aktif saat save. Jika harga/versi katalog berubah sejak preview, hentikan save dengan konflik harga, tampilkan perubahan, lalu minta pengguna meninjau dan menekan save lagi. Jangan menyimpan harga baru diam-diam.

Snapshot tiap item menyimpan nama dan ketiga harga saat dibuat. Saat edit qty/ongkir/customer totalan lama, gunakan snapshot harga lama dan hitung tier ulang; item baru menggunakan snapshot harga katalog saat ditambahkan. Ini adalah default rancangan agar edit ongkir tidak mengubah harga barang. Tidak ada fitur repricing seluruh order di MVP. Pengguna melihat harga sebelum menyimpan revisi.

## Ongkir

shipping_amount null berarti belum diisi/belum diketahui, bukan nol. Nilai 0 yang sengaja diinput berarti Rp0. shipping_mode prepaid atau collect. Default UI prepaid.

- Prepaid + nominal: transfer = barang + ongkir.
- Prepaid + null: simpan boleh; label Total sementara (belum termasuk ongkir), nominal = total barang.
- Collect + nominal: transfer = barang; label ongkir dibayar ke ekspedisi saat diterima.
- Collect + null: transfer = barang; keterangan ongkir mengikuti tagihan ekspedisi.

Nominal nonnegatif dalam rupiah. Tampilan dapat memformat ribuan; simpan integer. Ekspedisi/layanan bebas opsional, tidak ada validasi dukungan layanan otomatis. Jangan menyebut collect sebagai COD barang.

## Customer

HP: hilangkan spasi, tanda hubung, kurung; +62 dan 0 awal Indonesia menjadi 62. Nomor internasional eksplisit dengan + disimpan konsisten tanpa + untuk pencocokan; jangan menambah 62 ke semua nomor. Validasi panjang masuk akal maksimal 15 digit, minimum 8; nomor dengan format meragukan minta koreksi. Tidak menyimpulkan identitas dari digit terakhir.

Nomor normal unik jika non-null. Jika cocok, gunakan record lama. Perbedaan nama ditampilkan untuk pilihan; jangan update profil otomatis. Dengan nama saja, cari case-insensitive dan whitespace-insensitive; pilih record lama atau buat orang berbeda. Nomor baru + nama sama: tampilkan saran tetapi jangan merge otomatis. Keduanya kosong → customer_id null. Nomor saja → customer tanpa nama, label UI nomor.

Customer baru dibuat saat save totalan berhasil dalam satu transaksi. Retry dan race pada nomor sama menggunakan unique constraint; nama saja dilindungi idempotency key untuk save yang sama, bukan unique name.

## Save dan edit

Simpan setelah pengguna meninjau; tidak menyimpan preview. Request UUID idempotency tetap dipakai untuk retry payload sama. Payload berbeda dengan key sama ditolak. Update memakai expected_version, sehingga dua tab tidak saling menimpa. Setiap revisi menyimpan snapshot lengkap dan actor. Tidak ada nomor baru untuk revisi. Nomor dibuat server dari sequence, bukan count + 1. Tanggal disimpan UTC dan ditampilkan Asia/Jakarta sebagai default rancangan.

Jika koneksi gagal, jangan mengklaim sukses. Pertahankan input dan retry dengan key sama untuk kasus hasil commit belum diketahui. Setelah sukses, tombol ekspor memakai data yang dikembalikan database. Refresh setelah save harus membuka hasil yang sama.
