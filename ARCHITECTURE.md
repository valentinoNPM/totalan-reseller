# Architecture dan Stack

Keputusan teknis: React + TypeScript + Vite, CSS biasa, Supabase PostgreSQL/Auth, Netlify Functions. npm dan Git; Vitest + Testing Library untuk unit/component, Playwright untuk browser. Pin versi stabil yang kompatibel saat bootstrap dan commit lockfile. Tidak perlu Next.js/SSR karena aplikasi internal tidak membutuhkan SEO atau rendering server.

## Komponen

1. Browser: SPA React di CDN Netlify. Parser dan preview deterministik, form, riwayat, master, generator PNG lazy-loaded. UI Bahasa Indonesia.
2. Supabase SDK: sesi, refresh token dan permintaan database yang dilindungi RLS.
3. Netlify Function POST /api/login: menerima username/password, memetakan username ke identity Supabase secara privat, memanggil Auth signInWithPassword, mengembalikan session ke SDK. Ini adapter username, bukan implementasi hashing password sendiri.
4. PostgreSQL: katalog, customer, totalan, revisi, membership. SQL RPC save_totalan menjamin harga, tier, deduplikasi dan atomicity. Browser tidak boleh langsung menulis subtotal atau snapshot final.

Supabase password auth secara native memakai email atau telepon; username UI membutuhkan adapter. Akun diprovisikan dengan email operator valid yang dipetakan ke username privat. Email tidak perlu diketik saat login dan tidak dikirim dalam respons error. Tidak memakai identitas/email customer sebagai akun staff. Tanpa registrasi publik.

## Aliran utama

Login → token SDK → fetch katalog → parse lokal → preview → RPC transaksi customer+order+items+revision → respons committed → ekspor dari snapshot. Riwayat membaca paginated query dengan RLS. Master update melalui RPC terotorisasi atau kebijakan yang setara.

Use Zod untuk validasi boundary jika dibutuhkan; hindari form/state/data-grid libraries besar. React state/hooks cukup untuk MVP. Router kecil atau React Router lazy route; pilih satu. Tidak perlu Redux, AI, n8n, WebSockets, atau server permanen.

## Struktur implementasi yang disarankan

- src/features/auth, orders, products, customers
- src/domain/parser.ts, pricing.ts, normalization.ts
- src/lib/supabase.ts
- src/export/ untuk PNG/text dari snapshot yang sama
- netlify/functions/login.ts
- supabase/migrations, supabase/tests
- scripts/ untuk seed/provision/check
- tests/fixtures, tests/e2e

Dokumen paket tetap di root atau dipindah ke docs dengan link dan prompt diperbarui. Jangan hilangkan dokumen sumber.

## Keputusan performa dan operasional

Static hosting untuk UI; functions hanya saat diperlukan. Semua data bisnis tetap PostgreSQL, bukan filesystem function atau localStorage. Region Supabase dekat pengguna Indonesia jika tersedia; verifikasi pilihan saat provisioning. Pisahkan staging dan production. Tidak mengandalkan function memory untuk rate limit atau state.

## Dasar kompatibilitas resmi (diperiksa 6 September 2026)

- [Vite on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/): build npm run build, output dist dan dukungan SPA rewrite.
- [Netlify Functions](https://docs.netlify.com/build/functions/get-started/): functions dapat dibangun dan dideploy bersama proyek.
- [Supabase password auth](https://supabase.com/docs/guides/auth/passwords): layanan password auth untuk identity email/phone.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): pembatasan akses database bersama identity Auth.

Pemilihan komponen adalah keputusan rancangan proyek berdasarkan kebutuhan ini. Verifikasi versi runtime dan pricing saat provisioning; tidak ada paket berbayar yang telah dipilih.
