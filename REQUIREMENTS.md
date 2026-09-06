# Requirements MVP

## R01 — Akses internal

Username/password, tombol tampilkan password, dukungan password manager, sesi bertahan saat reload/browser dibuka kembali jika masih valid. Logout jelas. Hanya akun yang diprovisikan dan aktif boleh membaca/menulis data. Tanpa registrasi publik atau login Google. Provisioning/reset password awal melalui prosedur operator, bukan fitur admin akun lengkap.

## R02 — Buat totalan

Kolom HP, nama, ongkir opsional; textarea rekap wajib. Tersedia cara bayar ongkir langsung/di tempat dan detail ekspedisi/layanan opsional dalam bagian yang bisa dibuka. Nama/HP tidak memblokir pengguna anonim customer. Totalan bukan bukti pembayaran.

Tombol Baca Pesanan menghasilkan preview, belum menyimpan ke database. Tombol Simpan Totalan melakukan penyimpanan final setelah validasi. Tidak ada autosave server sebelum tombol simpan. Input yang gagal disimpan tetap di layar dan dapat dicoba ulang.

## R03 — Parser dan koreksi

Nama produk + integer qty di ujung baris. Abaikan hanya judul yang dikenali dan baris kosong. Tampilkan baris tidak valid lengkap dengan alasannya. Alias eksplisit, abaikan awalan SET, kapitalisasi, dan spasi berlebih. Jangan menghapus PDPD/PDPJ/PJPD/PJPJ, STD/JUMBO, LD130, 7/8, CP atau ukuran.

Setiap baris preview bisa dipilih ulang produknya, diubah qty, atau dihapus secara eksplisit. Baris unknown tidak diam-diam hilang. Save dinonaktifkan selama ada baris bermasalah. Penambahan alias adalah tindakan eksplisit melalui master.

## R04 — Perhitungan

Jumlahkan qty semua produk valid; pilih satu tier untuk seluruh order; ambil harga masing-masing model pada tier itu. Qty integer positif; harga rupiah integer. Subtotal, total barang, ongkir, jumlah transfer ditampilkan terpisah. Aturan lengkap di BUSINESS_RULES.md.

## R05 — Customer

Lookup customer melalui HP yang dinormalisasi, atau pilihan pencarian nama. Customer baru dibuat dalam transaksi save totalan. Record lama tidak diduplikasi atau ditimpa diam-diam. Customer kosong menghasilkan customer_id null. Nama saja yang cocok menawarkan pilih lama/buat baru; nama bukan identitas unik.

## R06 — Simpan dan riwayat

Nomor totalan unik dari server, timestamp, teks asli, customer snapshot, item snapshot, tier, ongkir, total, penulis dan versi disimpan atomik. Save berulang akibat double tap/retry tidak menghasilkan duplikat. Riwayat paginasi dengan pencarian nomor/nama/HP dan filter tanggal. Buka detail, salin, unduh, edit dengan nomor tetap dan revisi terdokumentasi. Tidak ada hard delete totalan pada MVP.

## R07 — Master data

Daftar produk searchable. Tambah produk; edit nama, tiga harga dan alias; aktif/nonaktif. Nama/alias yang konflik ditolak. Produk lama tidak dihapus jika sudah direferensikan. Perubahan harga berlaku pada perhitungan baru; totalan tersimpan tetap utuh. Warnai peringatan jika urutan harga tidak menurun; konfirmasi eksplisit boleh menyimpan pengecualian bisnis, jangan ubah nilai otomatis.

## R08 — Keluaran

Unduh PNG dan salin teks dari revisi yang sudah tersimpan, bukan state form yang belum disimpan. Nama/HP kosong tidak dicetak sebagai null/undefined. Gambar mencantumkan nomor dan tanggal, customer jika ada, model, harga sesuai tier, qty, total item, total qty, total barang, ongkir dan transfer. Header tabel merah muda lembut mengikuti contoh, isi putih dan teks gelap. Tidak menampilkan status lunas atau rekening fiktif. PDF bukan MVP.

## R09 — Kualitas

Tidak ada scroll horizontal halaman pada 360 px. Responsif 360–1440 px. Input minimal 16 px, area sentuh minimal 44 px. UI Bahasa Indonesia dan rupiah id-ID. Database privat, tidak memakai localStorage sebagai database. Latensi/performa diukur, bukan sekadar diklaim ringan.

## Di luar MVP

Keep, reservasi/batal stok, pembayaran/verifikasi transfer, resi resmi, alamat/label pengiriman, PDF, AI chatbot, integrasi WhatsApp/Desty/ekspedisi, tarif ongkir otomatis, portal customer, laporan marketing, fitur offline dan aplikasi native. Branding lanjutan serta pengelolaan akun melalui UI juga di luar scope.
