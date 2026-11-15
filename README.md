# uts-khalishaUlfaMarsha

UTS React Fundamental 2026 - aplikasi katalog menu Titik Temu.

## Cara menjalankan

```bash
pnpm install
pnpm dev
pnpm build
```

## Struktur

```
public/images/           18 foto menu (jpg/png, dari Wikimedia Commons)
src/components/          Header, Footer, MainContent, MenuCard, Modal,
                         CartDrawer, HistoryModal, NotificationsModal, StarRating
src/context/             CartContext, ToastContext, NotificationContext
src/hooks/               useLocalStorage
src/data/menu.js         18 menu (8 properti)
src/utils/pricing.js     promo, pajak, format Rupiah
```

## Fitur yang sudah jalan

- Bagian sambutan di bawah header: tagline "Dari Bumi Nusantara, Untuk Jeda Harianmu",
  jam buka, diskon, dan jumlah menu
- Pencarian menu di Header dan tab Semua / Kopi / Non-Kopi / Makanan / Snack / Favorit
  beserta jumlah item di tiap tab
- Urutkan nama, harga termurah, rating tertinggi, dan di tab Favorit ada
  favorit terbaru / terlama
- Popup Info: kategori, harga, stok, rating, deskripsi, daftar ulasan
- Popup Komentar: pilih bintang 1-5, komentar minimal 5 karakter, komentar baru
  langsung tampil paling atas tanpa menutup popup
- Tombol favorit: hati jadi merah, masuk tab Favorit, klik lagi untuk membatalkan
- Keranjang: tambah, kurangi, hapus, batas stok, kode promo, pajak 10%, struk
- Riwayat transaksi + reset stok dan riwayat (pakai popup konfirmasi, bukan confirm())
- Notifikasi: toast tiap aksi + lonceng dengan badge belum dibaca
- Semua data (favorit, komentar, keranjang, stok, riwayat, notifikasi) tersimpan
  di localStorage, tidak hilang saat dimuat ulang
- Tampilan responsif sampai lebar 390 px

## Palet warna

| Warna | Kode | Dipakai untuk |
|-------|------|---------------|
| Sage | `#8F9777` | aksen hijau |
| Krem | `#E6E2D7` | latar halaman |
| Gelap | `#3A3F33` | header, footer, teks utama |
| Sage tua | `#6C7458` | tombol utama, tombol bayar |
| Gold | `#E0A526` | bintang rating |
| Merah bata | `#A91B0D` | harga, garis atas header/footer, tab aktif, favorit, badge, total belanja |

Warna utama didefinisikan sebagai variabel di `src/index.css`, sisanya memakai
nilai langsung di className Tailwind.

## Kode promo (sementara)

| Kode | Diskon |
|------|--------|
| UTS25 | 25% |
| HEMAT10 | 10% |
| KOPI15 | 15% |

Pajak 10%. Angkanya ada di `src/utils/pricing.js`, tinggal diubah kalau dosen
memberi ketentuan lain.

## Catatan

- Nama toko: Titik Temu.
- Kategori Makanan: nasi goreng, mie goreng, roti bakar, ayam geprek.
- Kategori Snack: kentang, pisang goreng, donat, dan 2 es krim.
- Link Email, Instagram, dan GitHub diatur di daftar `KONTAK` pada
  `src/components/Footer.jsx`. Ganti `href` dengan link sendiri.
- Semua ikon memakai lucide-react.
- Tidak ada `alert()`, `prompt()`, atau `confirm()`.
- Data menu tidak diambil dari API, hanya dari `src/data/menu.js`.
