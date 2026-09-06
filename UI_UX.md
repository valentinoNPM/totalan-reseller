# UI dan UX — HP sebagai perangkat utama

## Prinsip

Alur utama harus terasa seperti menempel chat lalu memeriksa total, tanpa navigasi berlapis. Bahasa Indonesia sederhana. Layout putih/abu muda, aksen merah muda lembut pada totalan, kontras teks kuat. Gunakan system font, ikon SVG kecil dengan label, tanpa hero, ilustrasi besar, grafik dashboard, animasi dekoratif, atau library UI berat.

## Navigasi

HP: tiga tab bawah Totalan, Riwayat, Master. Menu akun kecil untuk logout. PC/tablet: navigasi ringkas di atas/samping, tetap tiga tujuan yang sama. Tidak perlu halaman dashboard terpisah. Master customer muncul lewat pencarian/pemilihan di form, bukan modul CRM besar.

## Layar login

Judul aplikasi, username, password, toggle lihat password, tombol Masuk. autocomplete username/current-password, enter untuk submit, state loading dan error generik. Setelah login arahkan ke Totalan. Sesi persisten melalui auth SDK, tidak menyimpan password sendiri.

## Layar totalan baru

Urutan: customer opsional ringkas → textarea Tempel rekap WhatsApp → Baca Pesanan → daftar hasil → Ongkir opsional → ringkasan → Simpan Totalan.

Placeholder berisi 2–3 baris contoh; jangan prefill menjadi transaksi nyata. Label field selalu terlihat. Nomor HP input tel; qty/ongkir inputmode numeric. Textarea minimal 8 baris dan bisa diperbesar. Normal paste harus selalu bekerja; tombol baca clipboard bukan ketergantungan karena izin browser bisa ditolak.

HP: hasil berupa baris/kartu compact berisi nama, harga, qty editable, subtotal dan menu hapus. Tidak memaksa tabel lebar dengan geser kanan untuk mengedit. PC: tabel diperbolehkan. Pilih produk unknown melalui panel pencarian yang mudah ditutup, fokus dan keyboard terkelola.

Sticky footer menampilkan qty, tier, total transfer dan Simpan; beri padding konten serta safe-area agar tidak tertutup footer atau keyboard. Error dijelaskan dekat baris dan scroll/focus ke error pertama. Teks yang sudah diketik tidak hilang saat validation/network error.

Perubahan setelah preview menandai preview perlu diperbarui atau memproses ulang secara eksplisit; tidak mengekspor kalkulasi basi. Double tap save tidak menggandakan transaksi.

## Setelah simpan

Tampilkan nomor, ringkasan dan tombol Unduh Gambar / Salin Teks / Edit / Totalan Baru. Tidak reset input sebelum server mengonfirmasi. Edit memperlihatkan bahwa ini revisi. Keluar dengan perubahan belum disimpan memberikan konfirmasi kehilangan perubahan.

## Riwayat dan master

Riwayat menampilkan nomor, tanggal, nama/HP atau Tanpa customer, qty dan nilai. Search dengan debounce ringan, paginasi/load more, empty/loading/error state. Detail memuat revisi dan harga snapshot.

Master: cari produk, tambah, edit tiga harga dengan label tier dan batas qty, alias dan aktif/nonaktif. Field harga angka dengan format rupiah yang tidak mengganggu caret. Peringatan nama/alias ganda langsung jelas. Simpan perlu konfirmasi hasil sukses, dan daftar diperbarui tanpa reload penuh.

## Gambar dan salin teks

Bangun layout ekspor terpisah dari layar edit, sekitar 1080 px lebar dengan teks terbaca, tinggi mengikuti jumlah baris. Header tabel MODEL, HARGA [TIER], QTY, TOTAL HARGA. Bungkus nama panjang; jangan potong nilai. Untuk order panjang, pecah beberapa PNG bernomor jika batas canvas/memori tercapai; tidak boleh silent truncation. Gambar tidak perlu disimpan di cloud.

Utamakan PNG melalui browser canvas dengan ukuran/wrapping deterministik untuk menghindari dependency screenshot besar. Jika memilih library, lazy-load dan buktikan hasil di Safari. Sediakan fallback membuka gambar untuk simpan di browser yang tidak mengunduh langsung. Clipboard fallback berupa textarea selectable jika writeText ditolak. Tidak mengirim pesan ke WhatsApp secara otomatis.

## Anggaran performa dan aksesibilitas

Target initial JS ≤200 KB gzip, excluding source maps dan chunk ekspor yang lazy-loaded. CSS ≤30 KB gzip. Parsing 100 baris target <100 ms pada CPU desktop emulasi 4x slowdown; catat perangkat dan metode. Tidak memanggil server per keystroke untuk perhitungan. Ambil katalog sekali lalu revalidate saat master berubah dan sebelum save server.

Target Lighthouse mobile performance ≥90 dan accessibility ≥95 pada build production dengan kondisi uji dicatat; bukan jaminan jaringan aktual. LCP ≤2.5 s dan CLS ≤0.1 sebagai target. Kegagalan budget dianalisis dan dicatat, jangan mengarang skor.

Uji lebar 360, 390, 768, 1024, 1440 px; zoom 200%; fokus keyboard; reduced-motion. Target sentuh ≥44 px, input font ≥16 px, contrast WCAG AA. Transisi opsional 100–150 ms; jangan block interaksi dengan animasi.
