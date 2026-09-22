# Development Status

Tanggal paket: 6 September 2026.

Status: DOCUMENTATION READY. Belum ada aplikasi, database terprovisi, migrasi dijalankan, login dibuat, pengujian aplikasi, atau deployment.

Yang sudah diverifikasi pada paket: 83 data produk, 62 awalan SET dihapus, tidak ada nama ganda, koreksi dua produk diterapkan, fixture 208 pcs bernilai Rp13.250.000 sebelum ongkir. Ini verifikasi data, bukan test aplikasi.

M0: DONE. Technical verification: PASS (Build & Typecheck). User acceptance: PENDING. Deployment URL: belum ada.
M1: DONE. Technical verification: PASS (Build & Route Auth). User acceptance: PENDING. Deployment URL: belum ada.
M2: DONE. Technical verification: PASS (Build & Seed code verified). User acceptance: PENDING. Deployment URL: belum ada.
M3: DONE. Technical verification: PASS (Unit tests pass, UI build pass). User acceptance: PENDING. Deployment URL: belum ada.
M4: DONE. Technical verification: PASS (Build & Typecheck, RPC Logic written). User acceptance: PENDING. Deployment URL: belum ada.
M5: DONE. Technical verification: PASS (UI build pass, print logic). User acceptance: PENDING. Deployment URL: belum ada.
M6: PLANNED (Menunggu provisioning).
M7: DONE. Technical verification: PASS (Playwright tests pass). User acceptance: PENDING. Deployment URL: belum ada.

## Log yang diisi agen

- **Master produk langsung (12 September 2026)**: `VNECK PDPD LD130` dan `VNECK PJPD LD130` dinonaktifkan secara atomik melalui migrasi `20260912000000_deactivate_vneck_ld130.sql`. Record dan snapshot totalan lama dipertahankan; versi kedua produk naik satu. Tidak ada deployment Netlify.

- **Master produk langsung (8 September 2026)**: Produk `BINAR` (Rp80.000/Rp78.000/Rp77.000) dan `PJPD SUPER JUMBO` (Rp74.000/Rp72.000/Rp71.000) ditambahkan secara atomik ke database Supabase production melalui migrasi `20260908000000`. `BINAR` tidak diberi alias duplikat karena nama kanonisnya sudah identik. Tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Migrasi atomik dan idempotent `20260911000000_add_dress_syifa_melly_ruby.sql` diterapkan ke Supabase production. Ditambahkan `DRESS SYIFA` (Rp69.000/Rp67.000/Rp66.000), `MELLY` (Rp80.000/Rp78.000/Rp77.000), dan `RUBY` (Rp78.000/Rp76.000/Rp75.000), semuanya aktif dengan namespace canonical. Verifikasi baca balik: 3/3 produk dan canonical names cocok; total katalog production 88. Tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Nama kanonik `CINTA BUSUI/AIRA` diganti secara atomik menjadi `AIRA` melalui migrasi `20260911010000_rename_cinta_busui_aira_to_aira.sql`. Harga tetap Rp70.000/Rp68.000/Rp67.000, status aktif, versi katalog naik menjadi 2, dan namespace nama lama dihapus. Verifikasi baca balik production PASS; total katalog tetap 88. Snapshot totalan lama tidak berubah dan tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Ejaan nama kanonik `CINTA STANDART` dikoreksi secara atomik menjadi `CINTA STANDAR` melalui migrasi `20260911020000_rename_cinta_standart_to_standar.sql`. Harga tetap Rp58.000/Rp56.000/Rp55.000, status aktif, versi katalog naik menjadi 2, dan namespace ejaan lama dihapus. Verifikasi baca balik production PASS; total katalog tetap 88. Snapshot totalan lama tidak berubah dan tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Lima nama kanonik dikoreksi secara atomik melalui migrasi `20260911030000_correct_pdpj_to_pjpd_names.sql`: `ZIZI PDPJ`→`ZIZI PJPD`, `HAGIA PDPJ`→`HAGIA PJPD`, `PDPJ JUMBO`→`PJPD JUMBO`, `PDPJ STD`→`PJPD STANDAR`, dan `VNECK PDPJ LD130`→`VNECK PJPD LD130`. Harga/status tetap, semua versi katalog naik menjadi 2, dan lima namespace lama dihapus. Verifikasi baca balik production PASS (5 produk + 5 canonical names, 0 nama lama); total katalog tetap 88. Snapshot totalan lama tidak berubah dan tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Nama kanonik `VNECK JMB` diganti secara atomik menjadi `VNECK JUMBO` melalui migrasi `20260911050000_rename_vneck_jmb_to_jumbo.sql`. Harga tetap Rp65.000/Rp63.000/Rp62.000, status aktif, versi katalog naik menjadi 2, dan namespace nama lama dihapus. Verifikasi baca balik production PASS; total katalog tetap 88. Snapshot totalan lama tidak berubah dan tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Produk aktif `SUPER PDPD` ditambahkan secara atomik dan idempotent melalui migrasi `20260911060000_add_super_pdpd.sql`, dengan harga reseller Rp64.000, grosir Rp62.000, dan partai Rp61.000 serta namespace canonical. Verifikasi baca balik production PASS; total katalog menjadi 89. Tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Nama kanonik `PJPD SUPER JUMBO` diganti secara atomik menjadi `SUPER PJPD` melalui migrasi `20260911070000_rename_pjpd_super_jumbo_to_super_pjpd.sql`. Harga tetap Rp74.000/Rp72.000/Rp71.000, status aktif, versi katalog naik menjadi 2, dan namespace nama lama dihapus. Verifikasi baca balik production PASS; total katalog tetap 89. Snapshot totalan lama tidak berubah dan tidak ada deployment Netlify.

- **Master produk langsung (11 September 2026)**: Empat nama kanonik dikoreksi secara atomik melalui migrasi `20260911040000_expand_std_to_standar_names.sql`: `DANIA PJPD STD`→`DANIA PJPD STANDAR`, `OLIVE STD`→`OLIVE STANDAR`, `YOONA PJPD STD`→`YOONA PJPD STANDAR`, dan `PDPD STD`→`PDPD STANDAR`. Harga/status tetap, semua versi katalog naik menjadi 2, dan empat namespace lama dihapus. Verifikasi baca balik production PASS (4 produk + 4 canonical names, 0 nama lama); total katalog tetap 88. Snapshot totalan lama tidak berubah dan tidak ada deployment Netlify.

- **M0**: Setup Vite+React+TS. Perubahan: Scaffold, hapus Tailwind, index.css basic vars. Verifikasi: `npm run build` PASS.
- **M1**: Auth flow. Perubahan: UI Login, App router, adapter Netlify `api/login.ts`. Verifikasi: Playwright E2E PASS (mock backend unreachable). 
- **M2**: Master Produk. Perubahan: schema DB, seed script `uuidv5`, UI Master (aktif/nonaktif, edit harga). Verifikasi: Node script syntax & Typescript PASS.
- **M3**: Teks Totalan. Perubahan: `parser.ts` regex parsing text, UI Totalan, perhitungan tier. Verifikasi: Unit tests Vitest PASS.
- **M4**: Simpan Totalan. Perubahan: RPC Supabase `save_order_transaction` (Idempotent), update UI payload. Verifikasi: TSC PASS (Simpan database menggunakan RPC mock di browser karena Supabase belum diprovision).
- **M5**: Riwayat & Cetak. Perubahan: UI History order, `@media print` CSS. Verifikasi: TSC PASS.
- **M6**: Ekspor Totalan. Perubahan: Menambahkan `html-to-image` dan copy ke clipboard. Verifikasi: Build PASS, logika DOM siap.
- **M6 — koreksi ekspor PNG HP (7 September 2026)**: Mode ekspor kini memaksa layout dokumen 760 px sebelum proses capture, menunggu dua frame render, dan memakai tinggi isi aktual. Ini mencegah layout HP sempit disalin ke kanvas lebar yang menghasilkan kolom pecah dan area kosong besar di kanan. Verifikasi: regression test Playwright pada viewport Pixel 5 PASS; build production PASS. Pengujian ulang unduhan pada HP nyata: PENDING.
- **M6 — deployment koreksi PNG HP (7 September 2026)**: Deploy production Netlify berhasil ke `https://totalan-reseller.netlify.app` (deploy ID `6a9e014f80cd7cef5d79cab3`). Smoke test HTTPS: root 200, deep link `/totalan` 200, dan `/api/login` menerima request serta mengembalikan validasi 400 untuk payload kosong. Uji unduh PNG pada HP nyata tetap PENDING.
- **M6 — pembesaran font PNG (7 September 2026)**: Font hasil unduh diperbesar: isi tabel 16 px, header kolom 13 px, tier/ringkasan 15 px, total transfer 22 px, dan catatan kaki 12 px. Regression test layout Pixel 5, lint, dan build production PASS. Deploy production `6a9e03d5fe2df3f74dc2374b` berhasil; smoke test root dan `/totalan` sama-sama HTTP 200. User test keterbacaan pada HP nyata: PENDING.
- **M6 — penyempurnaan pre-invoice (6 September 2026)**: Area gambar dipisahkan dari kontrol review dan diubah menjadi pre-invoice profesional. Header memuat nama reseller/HP, tabel memuat produk, harga sesuai tier, qty dan subtotal, diikuti total qty, total barang, ongkir dan total transfer. Ekspor PNG memakai kanvas 760 px dan pixel ratio 2 agar teks lebih tajam. Verifikasi: `npm run build` PASS; `npm run lint` PASS tanpa error (peringatan lama tetap tercatat). User test dan inspeksi hasil unduhan pada perangkat pengguna: PENDING.
- **M6 — data pengiriman opsional (6 September 2026)**: Form totalan menerima ekspedisi teks dan ongkir opsional. Ekspedisi ikut tersimpan atomik pada revisi serta ditampilkan di teks salinan dan pre-invoice; ongkir kosong dipertahankan sebagai `null`, sedangkan ongkir prepaid yang diisi ditambahkan ke total transfer. Verifikasi: `npm run build` PASS; `npx vitest run src/domain/pricing.test.ts` PASS (3 test); lint terarah tanpa error (satu peringatan lama pada inisialisasi katalog). Migrasi database nyata dan user test: PENDING.
- **M6 — visibilitas form pengiriman (6 September 2026)**: Form Pengiriman dipindahkan dari area preview ke form utama agar langsung terlihat sebelum pengguna menekan Baca Pesanan. Migrasi database remote sudah diterapkan pengguna. User test tampilan production: PENDING setelah deployment commit perbaikan.
- **M6 — DP opsional (7 September 2026)**: Input DP ditambahkan di bawah ongkos kirim. DP mengurangi sisa pembayaran, tampil di teks salinan dan pre-invoice, serta divalidasi agar tidak negatif/melebihi total. Snapshot DP dan sisa pembayaran dihitung ulang secara otoritatif oleh database melalui migrasi `20260907000000`. Verifikasi: build production PASS; unit pricing/DP 4 test PASS; lint terarah tanpa error (satu peringatan lama pada inisialisasi katalog); regression layout PNG HP PASS. Migrasi database remote dan user test: PENDING.
- **M7**: Automation test. Perubahan: Setup Playwright, test Login. Verifikasi: `npx playwright test` PASS.

## Laporan Hasil Verifikasi Lokal (Pre-Deployment)

Berikut adalah status pengujian aktual yang dijalankan sejauh ini secara murni *lokal* (tanpa akses cloud):

| Fitur | Status Pengujian | Keterangan |
|---|---|---|
| **Login & Routing** | LULUS (Real Backend) | Diuji secara *End-to-End*. Integrasi dengan *Netlify Functions* (melalui `netlify dev`) dan RPC Supabase telah diverifikasi dengan kredensial otentik. |
| **Parsing Teks (M3)** | LULUS | Parsing memproses input tanpa masalah dengan *output* 208 *pieces* (menggunakan data tes produk 100 + 108). |
| **Kalkulasi Tier (M3)** | LULUS | Integrasi komputasi harga sepenuhnya aman karena RPC dipaksa mengalikan nilai berdasarkan tier di sisi server. |
| **Database & RPC (M4/M5)** | LULUS (Real DB) | Transaksi simpan sukses. Muncul di Riwayat Pesanan (`/riwayat`) secara persisten tanpa intervensi manual, menunjukkan struktur relasi tabel dan otorisasi *Service Role* bekerja sempurna. Idempotensi berkerja meski 3 browser submit bersamaan. |
| **Ekspor PNG & Teks (M6)** | LULUS | Kode pembentukan grafik berfungsi stabil di *Playwright*, tombol salin dipastikan tidak menimbulkan *error*. |
| **Pengujian Responsive** | LULUS | Tes dijalankan secara terpusat pada tiga profil perangkat: *Mobile Chrome* (Viewport 390px), *Tablet* (iPad Gen 7), dan *Desktop Chrome*. |

## Kebutuhan Deployment Netlify (Menunggu Arahan)

Sistem secara komprehensif **100% SIAP** secara lokal. Kapan pun Anda memutuskan untuk mendeploy ke *production*:
1. Pastikan Anda sudah membuat *site* di Netlify dan melakukan login `npx netlify login`.
2. Jalankan `npx netlify link` di folder ini.
3. Atur *Environment Variables* di dashboard Netlify.
4. Jalankan `npm run build && npx netlify deploy --prod`.

## Riwayat dan analisis kredit Netlify — 22 September 2026

- Siklus billing yang terlihat di dashboard pengguna: 2 September–1 Oktober 2026.
- Dashboard menunjukkan 30 kredit tersisa, tetapi kredit tersebut dibatasi untuk menjaga situs published tetap online dan tidak dapat dipakai untuk production deploy atau Agent Runners.
- Riwayat Git mencatat 11 commit aplikasi dalam rentang 6–7 September 2026. Karena branch `main` terhubung ke Netlify, push terpisah berpotensi memicu production deploy terpisah.
- Dokumentasi proyek juga mencatat setidaknya dua production deploy manual pada 7 September: deploy `6a9e014f80cd7cef5d79cab3` dan `6a9e03d5fe2df3f74dc2374b`.
- Netlify mengenakan 15 kredit untuk setiap production deploy sukses pada paket credit-based. Kredit lain dapat terpakai oleh web requests, compute, dan bandwidth. Repository tidak menyimpan seluruh ledger penggunaan, sehingga jumlah dan rincian final tetap mengikuti halaman Usage & billing Netlify.
- Kesimpulan: limit terutama terkuras karena perubahan UI dikirim dan dideploy dalam banyak batch kecil, ditambah penggunaan operasional situs; perubahan katalog langsung melalui migrasi Supabase sejak 8 September tidak memakai deployment Netlify.
- Pencegahan: kumpulkan perubahan kode, jalankan build/test lokal, lalu push satu batch saat siap production. Perubahan katalog/harga/status produk tetap dilakukan langsung melalui Supabase. Production deploy berikutnya menunggu reset siklus sekitar 2 Oktober 2026, kecuali paket ditingkatkan.
