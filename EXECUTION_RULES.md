# Instruksi Eksekusi Antigravity + Gemini

## Agen dan otorisasi

Agen implementasi proyek ini adalah Gemini melalui Antigravity. Penyebutan Codex pada workflow asli merupakan konteks historis; tanggung jawab implementer kini dijalankan Gemini. Requirement bisnis dan acceptance criteria tetap berlaku. Instruksi ini merupakan penyesuaian terbaru dari pengguna terhadap workflow, bukan instruksi untuk melewati kontrol keamanan platform.

Pengguna mengizinkan tindakan development rutin berikut dalam folder proyek yang dibuka, tanpa meminta konfirmasi ulang: membaca, membuat, menambah dan mengedit file/folder proyek; memasang dependency proyek yang diperlukan; membuat migrasi/seed; menjalankan project lokal, build, lint, typecheck dan test; membuat serta menghentikan proses pengujian milik tugas ini; memperbaiki error; memperbarui dokumen; membuat checkpoint Git lokal bila repository tersedia. Pilih keputusan implementasi rutin sendiri dan lanjutkan sampai scope selesai. Jangan bertanya “boleh buat file?”, “boleh run project?” atau “lanjut milestone berikut?” untuk tindakan tersebut.

Jangan melakukan penghapusan besar, mereset perubahan pengguna, membeli layanan, mengubah DNS, menjalankan migrasi destruktif pada database nyata atau menyentuh proyek lain atas dasar otorisasi rutin ini. Jangan install dependency global jika lokal cukup. Deployment mengikuti otorisasi dan prasyarat di DEPLOYMENT.md. Jika platform meminta persetujuan yang wajib, hormati batas tersebut; prompt ini tidak menonaktifkan permission UI/sandbox. Minta hanya akses/keputusan yang benar-benar menghalangi, dan lanjutkan pekerjaan independen.

## Semua test run harus berakhir

Jangan menjalankan dev server/watch mode di foreground lalu menunggu proses tersebut selesai. Server adalah proses berumur panjang: readiness bukan exit. Setiap pengujian otomatis harus memiliki lifecycle start → ready → test → cleanup → verify stopped.

1. Sebelum start, pilih port lokal yang tersedia dan cek port tersebut. Jika sudah dipakai, jangan membunuh proses pemilik port; pilih port lain atau laporkan konflik. Bind ke loopback dan gunakan strict-port agar URL tidak berubah tanpa diketahui.
2. Jalankan server dengan pengelola proses/tool background yang mengembalikan kendali segera. Simpan PID/process-tree identity atau session handle, command, cwd, port dan waktu start. Jangan membuat proses detached tanpa pengawasan dan jalur cleanup. Di Windows, helper background harus tersembunyi.
3. Alihkan stdout/stderr ke log proyek, batasi output yang ditampilkan. Poll health URL lokal dengan deadline startup default 60 detik. Jika belum ready, hentikan proses, baca log terakhir dan laporkan penyebab; jangan polling tanpa batas.
4. Unit tests wajib one-shot, misalnya vitest run, bukan watch. Browser tests headless dengan reporter non-interaktif; jangan menjalankan UI test runner atau report viewer yang menunggu input. Install/build/test memakai timeout yang sesuai.
5. Batas awal: unit/typecheck/lint/build masing-masing 180 detik, startup server 60 detik, browser test 30 detik per test, suite browser 180 detik, keseluruhan lifecycle smoke test 300 detik. Dependency install boleh hingga 600 detik dengan kemajuan terpantau. Sesuaikan hanya dengan alasan yang dicatat, jangan mengganti menjadi infinite timeout.
6. Bungkus server dan test dalam try/finally atau teardown runner yang setara. Timeout test, startup gagal, exception dan pembatalan juga harus memicu cleanup. Gunakan watchdog/deadline parent sebagai cadangan bila runner tidak kembali; timer tidak boleh menghentikan parent sebelum cleanup mendapat kesempatan.
7. Cleanup: kirim penghentian normal ke proses/server milik run ini, tunggu maksimal 5 detik, lalu paksa berhenti hanya process tree milik run tersebut jika masih hidup. Gunakan process group/session pada POSIX atau supervisor/process-tree mechanism yang sesuai di Windows. PID utama npm saja mungkin tidak cukup karena child node masih hidup. Verifikasi identitas proses sebelum force stop untuk menghindari PID yang dipakai ulang.
8. Jangan memakai taskkill /IM node.exe, killall node, atau membunuh semua terminal/server. Jangan membunuh proses berdasarkan port saja. Hanya proses yang tercatat dibuat oleh run ini boleh dihentikan.
9. Setelah cleanup, buktikan process tree berhenti dan port milik server run tersebut sudah dilepas. Catat hasil test, exit code, timeout bila ada, cleanup result dan durasi. Test belum selesai secara operasional jika server test masih tertinggal tanpa tujuan.
10. Retry terbatas: maksimal dua percobaan tambahan setelah diagnosis/perbaikan, selalu cleanup sebelum start ulang. Jangan menciptakan loop install/start/test tanpa batas.

Playwright webServer dapat dipakai untuk mengelola startup/teardown bila sesuai versi terpasang; verifikasi perilaku cleanup dan outer timeout nyata. Jangan mengasumsikan timeout satu test otomatis menghentikan server. Untuk mode otomatis terisolasi, jangan reuse server asing yang sudah berjalan. Bila Netlify Dev dibutuhkan untuk login function, supervisor harus mencakup proses Netlify dan child Vite, bukan Vite saja.

Uji supervisor dengan sengaja membuat test gagal/timeout, kemudian pastikan server dan child process tetap berhenti. Jangan hanya menguji happy path. Jika tools menyediakan session ID, gunakan handle itu dan cleanup terkait, bukan perintah shell blocking yang tidak dapat diinterupsi.

Bila pengguna secara eksplisit meminta preview dibiarkan hidup, jalankan sebagai sesi terpisah yang terdokumentasi dengan URL, PID/session dan cara stop; jangan tinggalkan server dari automated test. Default akhir automated run: tidak ada server test tersisa.

## Efisiensi dan laporan

Baca dokumen proyek sekali, simpan state ringkas di DEVELOPMENT_STATUS.md, dan baca ulang hanya bagian yang berubah. Jangan mengulang diskusi requirement, membuat ulang dokumen atau menjalankan seluruh suite setiap perubahan kecil tanpa alasan. Jalankan test terarah saat iterasi, suite relevan sebelum checkpoint dan integrasi akhir. Komunikasikan kemajuan singkat, bukan dump log panjang. Hemat token tanpa mengurangi ketelitian data, keamanan, atau menyembunyikan test yang belum dijalankan.

Pada laporan akhir, bedakan implementasi selesai, verifikasi teknis, deployment dan user test. Sertakan apakah server test sudah dihentikan. Jangan menyebut aplikasi selesai penuh jika database/deployment belum dapat diverifikasi.
