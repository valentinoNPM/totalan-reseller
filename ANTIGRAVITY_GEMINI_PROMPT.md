# Prompt implementasi untuk Antigravity + Gemini

Kamu adalah Gemini yang bekerja sebagai agen coding melalui Antigravity. Mulai dengan membaca EXECUTION_RULES.md, AGENTS.md dan GEMINI.md secara eksplisit, lalu dokumen proyek lainnya. Jangan mengandalkan IDE memuat file aturan secara otomatis.

Saya sudah mengizinkan kamu membaca, membuat, menambah dan mengedit file/folder di proyek ini, memasang dependency lokal yang diperlukan, menjalankan project dan test, serta menghentikan proses milik test tersebut. Jangan meminta permission ulang untuk aktivitas rutin ini atau untuk lanjut ke milestone berikutnya. Hormati permission wajib platform dan batas tindakan destruktif/eksternal di EXECUTION_RULES.md.

WAJIB: Jangan menjalankan npm run dev lalu menunggu proses foreground selesai. Setiap test run harus start server secara terkelola, simpan PID/session dan port, tunggu ready dengan deadline, jalankan test one-shot/headless, kemudian hentikan seluruh process tree milik run itu dalam finally/teardown, termasuk saat test gagal atau timeout. Verifikasi port dilepas. Jangan kill seluruh node/terminal. Terapkan deadline total dan watchdog cleanup sehingga run tidak stuck. Uji juga jalur timeout untuk membuktikan terminasi. Ikuti batas waktu terperinci di EXECUTION_RULES.md.

Bangun dan uji implementasi; jangan menghabiskan giliran dengan membuat rencana baru yang mengulang dokumen. Gunakan keputusan yang sudah tersedia dan lanjutkan autonomously dalam scope. Laporkan ringkas, jangan menampilkan ulang dokumen atau log panjang.

Saya ingin kamu membangun aplikasi Totalan Reseller sampai berfungsi lengkap, terverifikasi, dan dideploy ke Netlify jika akses layanan tersedia. Kerjakan langsung di folder proyek ini. Paket ini berisi konteks dan keputusan; jangan mulai dengan meminta saya mengulang requirement.

## Mandat dan workflow

Baca AGENTS.md dan semua dokumen proyek yang ditautkan README.md, termasuk data/*.json. Inspect isi repository sebelum mengubah apa pun. Ikuti MASTER DEVELOPMENT WORKFLOW dengan adaptasi permintaan saya: kerjakan satu milestone aktif pada satu waktu, lakukan verifikasi, perbaiki masalah, checkpoint, kemudian lanjut otomatis sampai seluruh MVP selesai secara teknis. Jangan berhenti setelah scaffolding, mockup, frontend demo, atau milestone pertama. Tidak perlu meminta persetujuan rutin antarmilestone. Jangan mengarang user test; tetap tandai pending sampai saya menguji. Jika terhalang akses layanan, lanjutkan semua pekerjaan yang tidak bergantung akses tersebut dan laporkan kebutuhan spesifik.

Untuk setiap milestone, catat MILESTONE ID, OBJECTIVE, CONTEXT, CURRENT BEHAVIOR, REQUIRED BEHAVIOR, ACCEPTANCE CRITERIA, CONSTRAINTS dan VERIFICATION REQUIREMENTS secara ringkas dalam status kerja sebelum implementasi. Gunakan roadmap yang sudah ditetapkan, bukan memperluas roadmap sendiri.

## Produk yang harus jadi

Website internal satu bisnis, prioritas penggunaan HP, juga tablet/PC. Login username/password dengan sesi persisten. Admin tempel teks WhatsApp berupa nama produk dan qty, misalnya fixture data/order-example.json. Nama customer, HP, ongkir opsional. Parser mengenali nama baku/alias, menandai baris ambigu, memungkinkan koreksi, dan menghitung tier dari seluruh qty campuran. 1–11 reseller, 12–49 grosir, ≥50 partai. Tiap model punya tiga harga sendiri.

Gunakan seluruh 83 produk data/products.json. Awalan SET sudah dihapus. MOANA KOMBI 70000/68000/67000, ROK HANUM 96000/94000/93000, ANAK XXL partai 45000. Fixture 208 pcs harus menghasilkan Rp13.250.000 sebelum ongkir. Jangan menyamakan pdk global; gunakan alias eksplisit yang tersedia.

Tombol Simpan Totalan menyimpan customer baru bila perlu dan totalan dalam satu transaksi. HP dinormalisasi agar 08 dan +628 sama; nama sama bukan otomatis orang yang sama. Jika customer kosong, order tetap tersimpan. Riwayat searchable, detail, edit nomor tetap dengan revisi dan harga snapshot. Save idempotent, server menghitung ulang, concurrent edit tidak menimpa diam-diam.

Ongkir langsung menambah tagihan; di tempat tidak menambah transfer ke bisnis. Ongkir null bukan gratis. Ekspor PNG dan salin teks dari snapshot tersimpan, mudah dipakai di WhatsApp. Master data mendukung tambah/edit/nonaktif produk, tiga harga, alias. Perubahan master tidak mengubah totalan lama. Tidak perlu PDF, chatbot, keep, stok, Desty, tarif otomatis, verifikasi pembayaran atau resi.

## Stack dan arsitektur

React + TypeScript + Vite, CSS ringan/system fonts, Supabase PostgreSQL/Auth, Netlify Functions sebagai adapter username ke Supabase Auth; npm, Git, Vitest, Playwright. Pilih versi stabil yang saat ini kompatibel dan pin runtime serta lockfile. Gunakan RLS active staff, no public signup, no hardcoded credentials. Email identity Auth boleh ada di belakang layar; form tetap username/password, tanpa Google. Supabase SDK mengelola session. Ikuti SECURITY.md untuk private mapping dan rate limit persisten. Jangan membangun password hashing sendiri.

Server final save melalui SQL RPC atomic: customer resolution, harga, tier, items, revision, idempotency. Frontend public key saja; service secret hanya server. Buat migration, seed repeatable insert-only, provisioning script aman, .env.example, netlify.toml dan runbook. Jangan gunakan localStorage sebagai database atau mock login untuk hasil akhir.

## UI paling penting

Buat alur paste → review → save → share yang sederhana dan cepat. HP 360/390 px tidak overflow; input font ≥16 px, target sentuh ≥44 px, sticky action tidak tertutup keyboard/safe-area. Gunakan kartu/baris produk compact di HP dan tabel pada layar besar. Navigasi Totalan, Riwayat, Master. Tanpa dashboard rumit, animasi berat, font eksternal atau library UI berlebihan. Initial JS target ≤200 KB gzip; lazy-load export. Ekspor berheader merah muda lembut seperti referensi, teks tajam dan tidak terpotong. Uji output PNG nyata dan fallback Safari/clipboard.

## Verifikasi dan penyelesaian

Jalankan typecheck, lint, unit/domain, database integration/RLS/idempotency/concurrency, build, browser responsive dan export checks sebagaimana TEST_PLAN.md. Lakukan pemeriksaan visual layar dan PNG. Ukur performa dan laporkan angka aktual, bukan klaim tanpa pengukuran. Perbaiki MUST FIX sebelum lanjut; catat temuan nonblocking.

Deploy dengan Netlify jika akun/credentials yang diperlukan sudah tersedia dan terotorisasi; gunakan Supabase environment yang sesuai. Jangan membeli layanan, mengubah DNS atau mengakses proyek lain tanpa otorisasi. Jika kredensial belum tersedia, tetap selesaikan code dan verifikasi lokal yang mungkin, lalu jelaskan apa yang belum diuji/deploy dan cara menyelesaikannya. Jangan klaim deployment berhasil tanpa URL dan smoke test nyata.

Di akhir, update DEVELOPMENT_STATUS.md, README dan DEPLOYMENT sesuai implementasi. Berikan ringkasan fitur, hasil checks nyata, URL bila ada, setup yang masih dibutuhkan, dan panduan user test singkat. Jangan memasukkan password/secret ke laporan. Status selesai teknis dan UAT pending harus dibedakan.

Mulai sekarang dari M0, kemudian lanjut berurutan hingga seluruh scope yang dapat dikerjakan selesai.
