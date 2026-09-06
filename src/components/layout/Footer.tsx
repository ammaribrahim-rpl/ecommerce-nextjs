import React from 'react'
import Link from 'next/link'
import { ShoppingBag, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50/50">
      {/* Value Proposition Highlights */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Pengiriman Cepat</h4>
                <p className="text-xs text-gray-500">Layanan antar langsung terpercaya</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">100% Produk Asli</h4>
                <p className="text-xs text-gray-500">Langsung dari distributor resmi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Garansi Kepuasan</h4>
                <p className="text-xs text-gray-500">Jaminan barang tiba dengan aman</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Bantuan Ramah</h4>
                <p className="text-xs text-gray-500">Siap melayani kebutuhan Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Karisma<span className="text-emerald-600">Store</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Platform e-commerce resmi Karisma Store menyediakan ribuan produk kebutuhan keluarga, perlengkapan bayi, makanan, minuman, dan kebutuhan harian dengan harga bersaing.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Navigasi Toko</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-600 transition-colors">Semua Produk</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-600 transition-colors">Keranjang Belanja</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-emerald-600 transition-colors">Cek Status Pesanan</Link>
              </li>
            </ul>
          </div>

          {/* Kategori Populer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Kategori Pilihan</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/products?jenis=MNM" className="hover:text-emerald-600 transition-colors">Susu & Minuman</Link>
              </li>
              <li>
                <Link href="/products?jenis=POPOK" className="hover:text-emerald-600 transition-colors">Popok & Bayi</Link>
              </li>
              <li>
                <Link href="/products?jenis=PLKPN" className="hover:text-emerald-600 transition-colors">Perlengkapan Anak</Link>
              </li>
              <li>
                <Link href="/products?jenis=MKN" className="hover:text-emerald-600 transition-colors">Makanan & Biskuit</Link>
              </li>
            </ul>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Metode Pembayaran</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">BCA Transfer</span>
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">Bank Mandiri</span>
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">BRI</span>
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">QRIS</span>
              <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">COD / Tunai</span>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Transaksi aman dan diverifikasi secara langsung oleh tim Karisma Store.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Karisma Store. Hak Cipta Dilindungi. Didukung oleh Next.js, Supabase & Tailwind CSS.
        </div>
      </div>
    </footer>
  )
}
