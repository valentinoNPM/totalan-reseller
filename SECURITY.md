# Security dan Login Cepat

Quick login berarti form sederhana dan sesi persisten; bukan password hardcoded, login palsu, atau database publik.

## Provisioning dan login

Akun staff diprovisikan via script server/operator memakai Supabase Admin API dan secret dari environment, kemudian staff_profiles dan private.login_identities diisi. Username lowercase unik, 3–32 karakter alfanumerik, titik, underscore atau hyphen. Password kuat dikelola Supabase Auth; tidak disimpan pada tabel aplikasi atau dikirim ke log. Owner/admin default memiliki akses operasional sama; jumlah akun mengikuti kebutuhan saat provisioning.

POST login hanya menerima JSON ukuran kecil dan same-origin browser; validasi input. Username dipetakan server ke email account Auth. Respons gagal generik untuk username tidak ada/password salah; respons tidak cache, tidak menyertakan secret. Beri limit 5 percobaan per username/15 menit dan 30 per IP/15 menit sebagai default operasional, implementasikan atomik dengan penyimpanan persisten atau fasilitas platform yang terbukti. Jangan memakai Map in-memory pada serverless. IP harus berasal metadata platform terpercaya. Hash bucket identifiers dengan secret dan hapus bucket kedaluwarsa. Uji 429 dan reset window.

Set session memakai Supabase SDK sesudah login; auto refresh dan persistence SDK standar, tidak menyimpan password. Token browser adalah tradeoff SPA: lindungi XSS, jangan render HTML dari input, dan jangan log token. Logout menghapus sesi dan state data pada client. Akun staff nonaktif ditolak RLS walaupun token belum expired. Penolakan refresh mengarah login; bila draft ada di memori, jelaskan sebelum navigasi yang menghilangkannya.

Public signup dimatikan. Password reset dilakukan operator melalui prosedur aman, tidak bergantung email login UI atau OTP. Jangan membuat default admin/admin atau password di repository.

## Data dan secret

Frontend hanya memuat Supabase URL dan publishable key. Server Supabase secret/service_role key tidak pernah memakai prefix VITE_, masuk bundle, git, screenshot, test fixture, atau output alat. Function login memakai secret hanya untuk mapping/provisioning terbatas; query bisnis browser tetap token pengguna + RLS.

Uji anon dan user terautentikasi tanpa staff membership, bukan hanya staff happy path. Semua harga/qty divalidasi server. Query parameterized/SDK; cegah injection. Escape seluruh nama dan raw text pada HTML; PNG/text tidak mengeksekusi markup. Tetapkan CSP yang sesuai endpoint Supabase aktual, frame-ancestors none, nosniff, referrer policy, tanpa membolehkan script inline secara luas. Jangan cache response auth/private API publik di CDN.

## Batas operasional

Tidak mengirim invoice otomatis ke pihak lain. Tidak ada publik share link totalan atau analytics pihak ketiga di MVP. Database staging memakai customer sintetis. Backup mengandung data pribadi, simpan privat. Ekspor PNG hanya saat diminta pengguna. Dokumentasikan prosedur revoke akun, reset password, pemulihan backup dan kebocoran secret.
