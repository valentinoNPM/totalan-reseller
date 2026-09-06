# Master Data

Sumber: data harga.xlsx yang diberikan pengguna. Sheet1, baris 3–85, kolom A–D. 83 produk. Nilai berikut sudah memasukkan koreksi eksplisit pengguna untuk MOANA KOMBI dan ROK HANUM. 62 awalan SET dihapus, tidak ada duplicate setelah normalisasi. File sumber asli tidak diubah.

data/products.json merupakan seed portabel. ID product-001 dan seterusnya adalah ID sumber seed, bukan UUID database; migrasi/provision seed harus memakai pemetaan UUID stabil (misalnya UUIDv5 dari source ID) dan tidak membuat UUID baru pada tiap rerun. Jangan mengubah nama tanpa kebutuhan alias yang jelas. Harga rupiah integer.

Alias awal di data/aliases.json adalah DANIA PDK → DANIA PDPD, HAGIA PDK → HAGIA PDPD, YOONA PDK → YOONA PDPD, sesuai contoh chat. Jangan membuat alias global yang menyamakan varian.

| Produk | Reseller | Grosir | Partai |
|---|---:|---:|---:|
| PDPJ STD | 55000 | 53000 | 52000 |
| PDPD STD | 43000 | 41000 | 40000 |
| PDPJ JUMBO | 57000 | 55000 | 54000 |
| PDPD JUMBO | 47000 | 45000 | 44000 |
| PJPJ JUMBO | 74000 | 72000 | 71000 |
| PAJAMAS JUMBO | 80000 | 78000 | 77000 |
| PAJAMAS RENDA BESAR | 90000 | 88000 | 87000 |
| PJPJ RUFFLE | 74000 | 72000 | 71000 |
| DASTER HABEL | 47000 | 45000 | 44000 |
| DASTER SELUTUT | 39000 | 37000 | 36000 |
| 7/8 BUSUI | 62000 | 60000 | 59000 |
| VNECK JMB | 65000 | 63000 | 62000 |
| VNECK PDPD MOTIF | 52000 | 50000 | 49000 |
| VNECK PDPD POLOS | 45000 | 43000 | 42000 |
| VNECK PDPD LD130 | 64000 | 62000 | 61000 |
| VNECK PDPJ LD130 | 74000 | 72000 | 71000 |
| VNECK KOMBI | 68000 | 66000 | 65000 |
| KIMONO JUMBO | 71000 | 69000 | 68000 |
| KIMONO KOMBI | 82000 | 80000 | 79000 |
| KIMMY | 64000 | 62000 | 61000 |
| RUFFLE JUMBO | 66000 | 65000 | 64000 |
| RUFFLE JUMBO POLOS | 62000 | 60000 | 59000 |
| CINTA JUMBO | 60000 | 58000 | 57000 |
| CINTA BUSUI/AIRA | 70000 | 68000 | 67000 |
| CINTA STANDART | 58000 | 56000 | 55000 |
| CINTA PDPD | 50000 | 48000 | 47000 |
| MOANA | 65000 | 63000 | 62000 |
| MOANA KOMBI | 70000 | 68000 | 67000 |
| CROP | 53000 | 51000 | 50000 |
| CELANA KULOT | 30000 | 29000 | 28000 |
| DRESS NARRA | 60000 | 58000 | 57000 |
| DRESS NAOMI | 57000 | 55000 | 54000 |
| DRESS HAVVA | 60000 | 58000 | 57000 |
| DRESS YOONA | 58000 | 56000 | 55000 |
| DRESS JASMINE | 50000 | 48000 | 47000 |
| DRESS KIMORA | 60000 | 58000 | 57000 |
| YOONA PJPD JUMBO | 75000 | 73000 | 72000 |
| YOONA PJPD STD | 75000 | 73000 | 72000 |
| YOONA PDPD | 63000 | 61000 | 60000 |
| YOONA PJPJ | 85000 | 83000 | 82000 |
| DANIA PDPD | 62000 | 60000 | 59000 |
| DANIA PJPD JUMBO | 74000 | 72000 | 71000 |
| DANIA PJPD STD | 74000 | 72000 | 71000 |
| ADIVA | 53000 | 51000 | 50000 |
| LUCY PDPD | 60000 | 58000 | 57000 |
| LUCY PJPD | 73000 | 71000 | 70000 |
| POPPY | 74000 | 72000 | 71000 |
| OLIVE JUMBO | 78000 | 76000 | 75000 |
| OLIVE STD | 78000 | 76000 | 75000 |
| FEBBY | 82000 | 80000 | 79000 |
| KALUNA PJPD | 72000 | 70000 | 69000 |
| KALUNA PDPD | 62000 | 60000 | 59000 |
| SHELLA PDPD | 67000 | 65000 | 64000 |
| SHELLA PJPD | 82000 | 80000 | 79000 |
| SHELLA PJPJ | 90000 | 88000 | 87000 |
| ZIZI PDPD | 58000 | 56000 | 55000 |
| ZIZI PDPJ | 68000 | 66000 | 65000 |
| HAGIA PDPD | 57000 | 55000 | 54000 |
| HAGIA PDPJ | 70000 | 68000 | 67000 |
| ERIKA | 92000 | 90000 | 89000 |
| ROSY | 78000 | 76000 | 75000 |
| CANTIKA | 75000 | 73000 | 72000 |
| RIBBON | 78000 | 76000 | 75000 |
| SALSA | 80000 | 78000 | 77000 |
| TASYA | 75000 | 73000 | 72000 |
| AMANDA | 74000 | 72000 | 71000 |
| JELITA PJPD | 73000 | 71000 | 70000 |
| JELITA PDPD | 60000 | 58000 | 57000 |
| DRESS JELITA | 62000 | 60000 | 59000 |
| RUMI | 85000 | 83000 | 82000 |
| HANA | 82000 | 80000 | 79000 |
| ROK HANUM | 96000 | 94000 | 93000 |
| ANAK M | 38000 | 36000 | 35000 |
| ANAK M cp | 42000 | 40000 | 39000 |
| ANAK L | 38000 | 36000 | 35000 |
| ANAK L cp | 42000 | 40000 | 39000 |
| ANAK XL | 42000 | 40000 | 39000 |
| ANAK XL cp | 46000 | 44000 | 43000 |
| ANAK XXL | 48000 | 46000 | 45000 |
| ANAK XXL cp | 52000 | 50000 | 49000 |
| GAMIS ZAYA | 70000 | 68000 | 67000 |
| GAMIS SERAYA | 95000 | 93000 | 92000 |
| GAMIS SELINA | 86000 | 84000 | 83000 |

## Fixture penerimaan

Contoh pengguna: 208 pcs, tier partai, Rp13.250.000 sebelum ongkir. Perbedaan Rp12.000 dengan gambar lama berasal dari ANAK XXL 12 pcs × kenaikan Rp1.000. Harga file terbaru Rp45.000 digunakan.
