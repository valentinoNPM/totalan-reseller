# Milestone Roadmap

Semua berstatus PLANNED. Satu milestone aktif pada satu waktu. Urutan berikut mengutamakan perilaku yang dapat diamati.

| ID | Tujuan tunggal | Acceptance dan verifikasi |
|---|---|---|
| M0 | Proyek dapat dijalankan | Inspeksi repo, bootstrap versi dipin, halaman dasar mobile, build/typecheck lulus, env example dan rencana tercatat |
| M1 | Staff bisa login | Username/password nyata, persist/refresh/logout, non-staff denial, rate limit, RLS foundation; uji integrasi |
| M2 | Master produk dapat dikelola | 83 produk seeded, search/tambah/edit harga/alias/nonaktif, constraint konflik; uji seed ulang dan master |
| M3 | Teks menjadi totalan akurat | Parser, unresolved correction, tier, ongkir dan preview responsive; fixture 208 pcs Rp13.250.000 dan boundaries lulus |
| M4 | Totalan/customer tersimpan | RPC atomik, dedupe customer, idempotency, nomor server; reload membuktikan persistence, uji rollback/race |
| M5 | Riwayat dapat dibuka dan direvisi | Search/pagination/detail/edit, immutable revisions, harga lama dan optimistic concurrency teruji |
| M6 | Totalan bisa dibagikan | PNG dan copy text snapshot, Safari/clipboard fallback, output panjang tanpa clipping, inspeksi gambar |
| M7 | Aplikasi siap dan tersedia di Netlify | Production build, security/performance/browser checks, deployment bila akses tersedia, smoke test dan runbook |

## Aturan pelaksanaan khusus permintaan terakhir

Pengguna meminta prompt implementasi sampai selesai. Ini memperluas cara eksekusi workflow asli: Gemini melalui Antigravity dapat melanjutkan milestone berikut setelah verifikasi teknis lulus tanpa meminta persetujuan rutin pada setiap tahap. Jangan menyamakan hal ini dengan user acceptance test yang telah lulus. Catat USER TEST: PENDING sampai admin/owner menguji. Milestone hanya DONE menurut workflow asli setelah syarat user test relevan terpenuhi; kemajuan teknis tetap dapat dilanjutkan berdasarkan mandat ini.

Setiap milestone mencatat objective, perubahan, acceptance, command/hasil verifikasi, findings MUST FIX/SHOULD FIX/NICE TO HAVE, checkpoint commit bila repo mendukung, dan status user test. MUST FIX yang memengaruhi milestone diselesaikan sebelum maju. Jangan membuat fake commit atau hasil test.

External blocker: minta hanya akses yang benar-benar diperlukan, lanjutkan bagian independen; jangan menunggu user untuk pilihan warna/jarak/struktur folder rutin. Jangan membeli layanan atau mengasumsikan credentials. Pilihan produk baru di luar scope memerlukan diskusi.
