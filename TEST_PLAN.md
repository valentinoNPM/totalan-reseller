# Test Plan

Test harus memverifikasi risiko bisnis nyata, bukan hanya meniru implementasi. Semua status awal NOT RUN. Catat command, environment, tanggal dan hasil aktual di DEVELOPMENT_STATUS.md.

## Unit/domain

- Fixture 11 baris → 208 pcs dan Rp13.250.000, harga partai dari data terbaru.
- Boundary qty 1, 11, 12, 49, 50: pilih tier benar, campur model tetap berdasarkan total.
- Qty 0, negatif, pecahan, angka terlalu besar, missing qty ditolak.
- SET di awal, kapital, spasi, ANAK XXL CP, 7/8 BUSUI, LD130 dan STD/JUMBO tidak salah dikenali.
- Alias tiga produk sesuai seed; nama fuzzy unknown memerlukan pilihan, tidak auto-accept.
- Header dikenal diabaikan; baris unknown tidak hilang; duplicate product digabung benar.
- Prepaid Rp35.000 → Rp13.285.000. Collect Rp35.000 → transfer Rp13.250.000. Null ongkir prepaid provisional; null collect keterangan tagihan ekspedisi; explicit 0 bukan null.
- Harga MOANA KOMBI 70000/68000/67000; ROK HANUM 96000/94000/93000; ANAK XXL partai 45000.
- Phone 0812… / +62812… / 62812… sama; nama sama boleh berbeda orang; nomor internasional tidak rusak.

## Database/integration

- Migrasi + seed database kosong menghasilkan 83 produk dan alias yang unik. Rerun seed tidak menggandakan/menimpa perubahan harga.
- Login staff valid, salah password, username unknown, throttle 429, logout dan expired session.
- anon dan authenticated non-staff tidak dapat select/write/RPC; staff inactive ditolak.
- Customer + order + revision atomik; inject failure dan pastikan tidak ada customer/order parsial.
- Double tap, retry setelah commit timeout dan concurrency key sama menghasilkan satu order. Key sama payload beda ditolak.
- Dua request nomor HP sama tidak menghasilkan customer ganda. Nama sama hanya gabung jika dipilih.
- Total dipalsukan client tidak diterima sebagai otoritas. Direct writes ke snapshot ditolak.
- Catalog berubah setelah preview menghasilkan conflict; harga lama tetap pada riwayat.
- Dua tab edit version sama: satu sukses, satu conflict tanpa lost update.
- Edit qty melintasi batas tier memakai snapshot tiga harga lama; item baru pakai harga master terbaru.
- Produk nonaktif tidak dapat ditambahkan, tetapi riwayat lama tetap terlihat.

## Browser end-to-end

Login → paste fixture → lihat semua item → isi ongkir → save → reload → buka riwayat → salin teks/PNG → edit → revision baru. Lakukan juga tanpa customer/ongkir, hanya nama, hanya HP, unknown product, network failure, denied clipboard dan long order.

Browser automation Chromium dan WebKit pada 390x844, 768x1024, 1440x900; tambahan 360 px untuk overflow. WebKit emulasi tidak menggantikan pengujian Safari di iPhone nyata. Uji keyboard terbuka, sticky footer, focus error, back navigation dan safe-area secara manual saat tersedia.

## Ekspor

Bandingkan angka PNG dan teks dengan snapshot database. Periksa semua 11 baris, qty 208, nilai Rp13.250.000 sebelum ongkir dan customer opsional. Uji nama panjang dan order 100 baris; output split bila perlu dengan total akhir jelas. Tidak ada clipping, null, tombol UI atau harga lama dari screenshot. Render dan lihat PNG sebenarnya.

## Build dan performa

Typecheck, lint, unit tests, database integration, production build, Playwright smoke. Ukur gzip bundle dan Lighthouse pada production build; catat kondisi. Verifikasi route reload Netlify serta endpoint function tidak ditimpa SPA fallback. Preview dan production dites terpisah. Jika kredensial belum ada, nyatakan DB/deploy tests blocked; mock success tidak dihitung sebagai backend lulus.
