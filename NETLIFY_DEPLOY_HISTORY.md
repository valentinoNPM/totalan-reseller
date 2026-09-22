# Riwayat Deploy dan Penggunaan Kredit Netlify

Terakhir diperbarui: 22 September 2026.

## Kondisi akun

- Paket: Free, credit-based.
- Siklus yang terlihat di dashboard: 2 September–1 Oktober 2026.
- Saldo terlihat: 30 kredit operasional.
- Status: saldo tersebut dapat menjaga situs published tetap online, tetapi tidak dapat digunakan untuk production deploy atau Agent Runners.
- Perkiraan pemulihan production deploy: awal siklus berikutnya, sekitar 2 Oktober 2026.

## Aktivitas repository yang berpotensi memicu deploy

| Tanggal | Commit | Ringkasan |
|---|---|---|
| 6 Sep | `6bc796d` | Initial commit |
| 6 Sep | `5158b23` | Perbaikan total pada ekspor PNG |
| 6 Sep | `3c2a647` | Perbaikan overlap badge Netlify |
| 6 Sep | `dafb905` | Form tambah produk |
| 6 Sep | `7fdf2a4` | Perbaikan JSX Master |
| 6 Sep | `391bf47` | Penyempurnaan gambar pre-invoice |
| 6 Sep | `9699924` | Pengiriman opsional |
| 6 Sep | `b8f4d7e` | Form pengiriman tampil sebelum preview |
| 7 Sep | `bac16b8` | Stabilisasi ekspor invoice pada HP |
| 7 Sep | `65705ab` | DP opsional |
| 7 Sep | `0e2f3f3` | Penyederhanaan judul invoice |

Branch `main` terhubung ke Netlify. Karena itu, setiap push terpisah pada periode tersebut berpotensi membuat production deploy baru. Selain deploy berbasis Git, `DEVELOPMENT_STATUS.md` mencatat dua deploy production manual pada 7 September:

- `6a9e014f80cd7cef5d79cab3`
- `6a9e03d5fe2df3f74dc2374b`

Daftar ini adalah riwayat yang dapat dibuktikan dari repository dan dokumen proyek, bukan ledger billing lengkap. Halaman **Usage & billing** Netlify tetap menjadi sumber final untuk jumlah kredit yang terpakai.

## Mengapa kredit habis

Pada paket credit-based, satu production deploy sukses memakai 15 kredit. Banyak perubahan kecil dikirim secara terpisah dalam waktu singkat, sehingga auto-deploy dapat memakai kredit berkali-kali. Kredit juga digunakan oleh operasional situs seperti web requests, compute, dan bandwidth.

Saldo 30 yang masih terlihat bukan jatah dua deploy: dashboard secara eksplisit membatasinya sebagai kredit operasional agar situs tetap online.

## Kebijakan hemat kredit selanjutnya

1. Gabungkan beberapa perubahan kode menjadi satu batch release.
2. Jalankan build, unit test, dan pemeriksaan tampilan secara lokal sebelum push.
3. Push ke `main` hanya ketika batch siap production.
4. Kelola produk, harga, alias, dan status aktif langsung melalui migrasi Supabase karena tidak memerlukan deploy Netlify.
5. Simpan setiap perubahan database sebagai migration versioned dan verifikasi `local = remote`.
6. Periksa Usage & billing sebelum production deploy.

Referensi resmi:

- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/
- https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/
