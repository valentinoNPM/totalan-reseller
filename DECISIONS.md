# Keputusan dan Default Rancangan

## Requirement eksplisit

Totalan saja; keep tetap WA. Input teks nama+qty. Nama/HP/ongkir opsional. Database menyimpan totalan dan customer. Tombol Simpan Totalan. Login username/password cepat tanpa Google. Unduh gambar dan salin teks. Master tambah produk dan edit harga. HP utama, PC/tablet responsif. Netlify. 83 produk dan koreksi harga pengguna. Gemini melalui Antigravity implementer; MASTER DEVELOPMENT WORKFLOW sebagai dasar.

## Default yang dipilih untuk melengkapi rancangan

Pengguna meminta penentuan stack dan paket implementasi lengkap. Default berikut dapat diubah dengan keputusan yang tercatat, bukan dianggap kutipan eksplisit pengguna:

- Nama kerja Totalan Reseller; UI Bahasa Indonesia; zona tampilan Asia/Jakarta.
- React/TypeScript/Vite + CSS + Supabase + Netlify Functions.
- Mendukung beberapa staff, akun individu disarankan; akses operasional setara pada MVP. Provisioning di luar UI.
- Sesi SDK persisten selama valid, password tidak disimpan aplikasi.
- Nama customer sama menawarkan pilih lama/buat baru; tidak unique name.
- Edit totalan mempertahankan nomor, membuat revisi dan memakai snapshot harga lama; no hard delete.
- Ekspedisi/layanan opsional; alamat, pembayaran, label resi dan PDF tidak termasuk MVP.
- Tidak autosave server; save setelah review. Ekspor hanya data tersimpan.
- Produk nonaktif menggantikan hard delete; seed ulang tidak overwrite data operasional.
- Header gambar merah muda lembut mengikuti contoh. Tidak ada logo/rekening fiktif.

## Informasi yang belum tersedia

Nama bisnis/logo/domain final; repo remote; akun layanan dan env secrets; username/password/email identity staff; budget layanan; perangkat nyata untuk UAT. Tidak menghalangi penulisan code lokal. Deployment/auth database nyata membutuhkan akses terkait. Harga ANAK XXL partai mengikuti sumber Excel 45000, bukan screenshot lama 44000.

## Perubahan mandat workflow

Instruksi awal jangan build berlaku pada fase diskusi. Deliverable saat ini tetap dokumen dan prompt, bukan menjalankan build sekarang. Prompt baru memberi mandat agen penerima untuk mengimplementasikan seluruh scope berurutan sampai siap/live bila akses tersedia. Verifikasi teknis tiap milestone wajib; UAT tetap jujur pending sampai pengguna menguji. Tidak perlu tanya persetujuan rutin tiap milestone.
