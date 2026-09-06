# Uji Pengguna

Status awal: BELUM DIJALANKAN. Admin/owner menjalankan pada HP utama, lalu satu tablet/PC bila tersedia.

1. Login dengan username/password; tutup dan buka kembali browser. Harapan: sesi valid tetap masuk, logout menutup akses.
2. Tempel contoh data/order-example.json bagian raw_text, tanpa customer dan ongkir. Harapan: 11 model, 208 pcs, partai, Rp13.250.000 dan keterangan belum termasuk ongkir.
3. Isi ongkir Rp35.000 dibayar langsung. Harapan: Rp13.285.000. Ubah bayar di tempat: transfer Rp13.250.000 dan ongkir terpisah.
4. Simpan, reload, cari di Riwayat. Harapan: data sama dan satu nomor totalan, bukan duplikat.
5. Unduh gambar dan salin teks; tempel manual ke WhatsApp sendiri. Harapan: jelas, angka sama, seluruh baris terbaca.
6. Buat customer nomor 08…, ulang dengan +628…. Harapan: satu customer yang sama. Uji nama saja dan nama sama orang berbeda.
7. Input nama produk salah. Harapan: ditandai dan save tidak bisa sampai diperbaiki/dihapus secara eksplisit.
8. Ubah qty sampai tier berganti; pastikan seluruh harga menggunakan tier sesuai total pcs.
9. Edit totalan tersimpan: nomor tetap, revision bertambah, riwayat lama tetap dapat diperiksa.
10. Edit harga master, tambah produk dan alias. Harapan: totalan baru memakai harga baru, totalan lama tidak berubah.
11. Coba jaringan terputus saat save dan retry. Harapan: input tidak hilang, tidak ada klaim sukses palsu atau totalan ganda.
12. Gunakan di HP dengan keyboard terbuka. Harapan: tombol terlihat, tidak scroll horizontal, qty mudah diubah, gambar dapat disimpan.

## Catatan hasil

- Milestone/skenario:
- Perangkat/browser:
- Tanggal:
- Hasil: PASS / FAIL / PASS WITH FINDINGS
- Langkah:
- Expected:
- Actual:
- Screenshot jika ada:
- Findings:

Jangan isi PASS atas nama pengguna. Temuan angka salah, data hilang, akses tidak sah, atau output terpotong adalah MUST FIX sebelum penggunaan produksi.
