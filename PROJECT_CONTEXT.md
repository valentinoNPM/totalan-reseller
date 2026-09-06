# Project Context

## Project identity

- Project name: Totalan Reseller (nama kerja).
- Project type/status: greenfield, website internal.
- Primary purpose: membuat dan menyimpan totalan dari teks WhatsApp.
- Primary users: satu admin operasional dan owner; sekitar 10–30 customer keep per hari, berfluktuasi.
- Business problem: rekap Excel dan penyiapan totalan manual saat checkout.
- Expected outcome: tempel teks → periksa → simpan → unduh gambar/salin teks.

## Initial requirements

Input nama dan HP opsional, ongkir opsional, teks pesanan wajib. Harga mengikuti total qty campuran: reseller 1–11, grosir 12–49, partai ≥50. Semua totalan tersimpan di database; customer baru disimpan dan customer lama digunakan kembali. Username/password dengan sesi persisten. Master produk dapat ditambah dan harganya diperbarui. UI utama untuk HP, juga PC dan tablet. Deployment Netlify.

## Technology context

TypeScript; React + Vite; CSS biasa dengan token desain; Supabase PostgreSQL dan Auth; Netlify Functions untuk adapter username login; Supabase JavaScript SDK; SQL RPC transaksional untuk save/revisi; npm; Vitest dan Playwright. Node LTS yang masih didukung bersama oleh Vite dan Netlify dipilih serta dipin saat bootstrap. Tidak memakai AI API atau n8n.

## Development environment

AI coding agent: Gemini melalui Antigravity. Lingkungan pengguna: Windows. Editor: Gemini melalui Antigravity app atau editor pilihan pengguna. Version control: Git. Lokasi repo, remote Git, versi runtime final: ditetapkan saat bootstrap dan dicatat. Tidak membuat atau menimpa repo lain.

## Target environment

Development: lokal. Staging: Netlify Deploy Preview dengan database staging. Production: Netlify + Supabase production. HP utama, tablet dan PC sekunder. Target browser: Chrome Android, Safari iOS/iPadOS, Chrome/Edge desktop; versi stabil saat pengujian. Online required. Tidak menjanjikan offline sync.

## Existing system context

Shopee, TikTok, Lazada terintegrasi Desty. Keep dan follow-up tetap di WhatsApp. Admin memisahkan barang dan mengelola stok. Website mulai bekerja saat checkout. Tidak ada integrasi langsung ke WhatsApp, Desty, marketplace atau ekspedisi dalam MVP.

## Constraints

Ringan, cepat, mudah dengan satu tangan, tidak memakai dashboard analitik kompleks. Tidak ada Google login. Tidak menampilkan harga hasil tebakan. Hosting Netlify wajib. Budget, domain bisnis, akun layanan dan kredensial belum tersedia; jangan mengasumsikan biaya nol atau membeli layanan.

## References

MASTER_DEVELOPMENT_WORKFLOW.md; MASTER_DATA.md; tiga jenis referensi dalam diskusi: tabel harga, teks pesanan WhatsApp, tabel totalan berwarna merah muda. Data Excel sudah ditranskripsikan lengkap ke data/products.json dan diverifikasi. Referensi screenshot tidak diperlukan sebagai ketergantungan build.
