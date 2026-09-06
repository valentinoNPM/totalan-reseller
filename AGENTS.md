# Instruksi untuk Gemini melalui Antigravity

Proyek: Totalan Reseller. Baca README.md, PROJECT_CONTEXT.md, REQUIREMENTS.md, BUSINESS_RULES.md, ARCHITECTURE.md, DATA_MODEL.md, UI_UX.md, SECURITY.md dan TEST_PLAN.md sebelum implementasi. Gunakan MILESTONES.md untuk urutan dan DEVELOPMENT_STATUS.md untuk state aktual. MASTER_DEVELOPMENT_WORKFLOW.md tetap referensi; penyesuaian mandat terakhir tertulis di DECISIONS.md.

- Satu milestone aktif; selesaikan verifikasi teknis sebelum lanjut. Pengguna telah meminta pengerjaan menyeluruh, jadi jangan berhenti hanya memberi rencana atau meminta izin rutin.
- User test tidak boleh direkayasa. Catat pending sampai dijalankan pengguna, walau milestone teknis berikut dapat dilanjutkan.
- Inspect repo dahulu. Jangan menimpa perubahan pengguna atau menyentuh proyek lain. Jangan mengerjakan fitur di luar MVP.
- Pertahankan 83 produk dan koreksi harga dari data. Jangan menyalin harga screenshot lama.
- Prioritaskan HP, ringan, paste-first, tanpa AI/n8n/Google login.
- Business data PostgreSQL dengan RLS. Jangan mengganti backend dengan localStorage/demo untuk mengklaim selesai.
- Semua perhitungan final server-authoritative, transaksi atomic, snapshot immutable, idempotent save dan concurrency handling.
- Jangan simpan secret/password di code, logs, dokumen atau git. Akun nyata diprovisikan aman. Tidak membeli layanan.
- Jalankan checks relevan, lihat hasil UI/gambar sebenarnya, perbaiki MUST FIX, buat checkpoint bila Git tersedia.
- Deployment wajib Netlify sesuai mandat. Jika akses belum ada, selesaikan pekerjaan independen dan jelaskan blocker spesifik; tidak mengklaim live.
- Jika aturan tooling lokal bertentangan dengan hosting pilihan pengguna, jangan diam-diam mengganti target. Catat konflik dan cari jalur kompatibel yang menghormati permintaan Netlify.
- Update dokumentasi sesuai implementasi final, termasuk versi dependency, env, setup, login provisioning, migration, test dan deployment.
- Hindari dependency besar, dashboard dekoratif, auto-send WhatsApp, dan tambahan scope spekulatif.

## Aturan eksekusi terbaru

Baca dan terapkan EXECUTION_RULES.md sebelum menjalankan perintah. File tersebut memuat otorisasi tindakan rutin dan kewajiban timeout, cleanup serta verifikasi penghentian process tree untuk seluruh test run.
