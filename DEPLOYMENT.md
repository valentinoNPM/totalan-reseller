# Deployment dan Operasional

Target: Netlify untuk SPA + function; Supabase untuk PostgreSQL + Auth. Tidak ada deployment yang sudah dilakukan dalam paket dokumen ini.

## Prasyarat eksternal

Repo/folder proyek, akun dan project Netlify, Supabase staging/production, kredensial operator aman, username staff dan email identity internal, password yang diberikan secara aman. Domain khusus opsional; subdomain Netlify cukup. Budget plan belum dipilih: jangan membeli, meng-upgrade, atau mengubah DNS tanpa otorisasi yang sesuai.

## Lokal

Pilih versi Node LTS yang didukung Netlify dan Vite saat bootstrap; pin .nvmrc/.node-version dan engines. Gunakan npm dan package-lock. Buat .env.example tanpa nilai rahasia. Dokumentasikan npm ci, dev, typecheck, lint, test, build, test:e2e. Untuk login function gunakan Netlify Dev atau integrasi resmi Netlify Vite yang sesuai, bukan hanya Vite tanpa function.

Environment public: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY. Environment function: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY (atau service role sesuai versi SDK), LOGIN_RATE_LIMIT_SECRET. Secret key untuk provisioning lokal hanya environment operator, jangan otomatis diekspos pada build client.

Supabase lokal via CLI/Docker bila tersedia; jika tidak, staging terisolasi dengan migrations versioned. Jangan mengganti persistence dengan localStorage karena akses database belum ada.

## Supabase

1. Buat/pilih project yang tepat dan catat project ref tanpa secret.
2. Apply migrations, RLS, private schema, grants, transactional RPC.
3. Seed 83 produk dan tiga alias; validasi count, koreksi harga dan no duplicate.
4. Matikan public signup dan provision staff lewat script aman.
5. Uji anon/non-staff denial sebelum memasukkan data nyata.
6. Verifikasi kebijakan Auth site URL/origin dan sesi terhadap domain preview/production yang digunakan.

## Netlify

Hubungkan repository jika tersedia, atau deploy via CLI yang telah diautentikasi. Commit netlify.toml: build npm run build, publish dist, functions netlify/functions, runtime Node kompatibel yang dipin. /api/login rewrite ke login function ditempatkan sebelum /* → /index.html status 200. Assets/function paths tidak boleh tertangkap fallback secara salah.

Scope environment preview dan production terpisah. Isi secret di Netlify secure environment, bukan file checked-in. Set security headers dan cache policy: hashed assets immutable, index revalidate, auth responses no-store. Test deep link reload, login, refresh, save/reopen, PNG dan clipboard pada URL HTTPS sebenarnya.

## Backup, recovery, rollback

Dokumentasikan kemampuan backup sesuai plan Supabase yang benar-benar dipakai; jangan mengklaim backup otomatis jika belum tersedia. Siapkan prosedur dump terenkripsi/penyimpanan privat dan restore uji. Sebelum migrasi production lakukan backup, gunakan migrasi additive jika mungkin. Rollback deploy Netlify tidak me-rollback database: catat kompatibilitas schema dan aplikasi, jangan jalankan destructive down migration pada data nyata tanpa keputusan eksplisit.

Jika akses eksternal belum tersedia, selesaikan code, migrations, seed, test lokal dan runbook; laporkan provisioning/deployment blocked secara spesifik. Jangan klaim aplikasi live atau selesai penuh. Jika tersedia dan sudah terotorisasi, deploy dan buktikan smoke test. Catat URL nyata, commit, waktu, hasil dan keterbatasan di DEVELOPMENT_STATUS.md.
