# 🛒 Karisma Store (ecommerce-nextjs)

Website e-commerce siap produksi (*production-ready*) untuk **Karisma Store / Karisma Grosir**, terhubung langsung dengan database Supabase PostgreSQL perusahaan yang memuat lebih dari **5.700+ produk aktif**, manajemen kategori, merek, ketersediaan stok cabang/gudang, keranjang belanja, checkout transaksi, dan verifikasi bukti pembayaran transfer bank.

---

## 🚀 Teknologi Utama

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/) (Full Type-Safety dengan Supabase Generic Types)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase PostgreSQL & Supabase Auth](https://supabase.com/)
- **Storage**: Supabase Storage (`payment-proofs` bucket)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📦 Fitur-Fitur Aplikasi

1. **Katalog Produk Real-time**:
   - Menampilkan 5.700+ produk asli dari tabel `tbl_item`.
   - Filter dinamis berdasarkan kategori (`tbl_itemjenis`) dan merek (`tbl_itemmerek`).
   - Pencarian instan (*search by keyword/code*).
   - Pengurutan harga (terendah, tertinggi) dan nama A-Z.
   - Paginasi halaman (16 produk per halaman).
2. **Detail Produk & Stok Cabang**:
   - Informasi spesifikasi produk, harga satuan Rupiah (`Rp`), dan satuan barang (`PCS`, `BOX`, `BTL`).
   - Ketersediaan stok per cabang/gudang (`tbl_itemstok`).
   - Pemilih kuantitas dan tombol *Tambah ke Keranjang* / *Beli Sekarang*.
3. **Keranjang Belanja (`/cart`)**:
   - Sinkronisasi instan via `useSyncExternalStore` (React 19).
   - Dukungan pengunjung tamu (*guest*) via `localStorage` dan sinkronisasi otomatis ke `cart_items` saat login.
4. **Checkout Transaksi (`/checkout`)**:
   - Formulir data penerima dan alamat pengiriman lengkap.
   - Pilihan metode pembayaran: Transfer Bank (BCA & Mandiri), QRIS Instan, dan COD (Bayar di Tempat).
   - Nomor transaksi otomatis unik: `TRX-YYYYMMDD-XXXX`.
5. **Rincian Pesanan & Upload Bukti Bayar (`/orders/[id]`)**:
   - Rekening resmi transfer bank.
   - Komponen upload foto bukti transfer langsung ke Supabase Storage bucket `payment-proofs`.
   - Status pesanan dan status verifikasi pembayaran real-time.
6. **Autentikasi Pelanggan**:
   - Halaman login (`/auth/login`) dan pendaftaran akun (`/auth/register`) yang tersinkronisasi ke tabel `profiles`.

---

## 🛠️ Panduan Memulai Secara Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/ammaribrahim-rpl/ecommerce-nextjs.git
   cd ecommerce-nextjs
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Salin `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi konfigurasi Supabase Anda di `.env.local`.

4. **Jalankan server development**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

5. **Build produksi**:
   ```bash
   npm run build
   ```

---

## 📄 Lisensi
Hak Cipta © Karisma Store.
