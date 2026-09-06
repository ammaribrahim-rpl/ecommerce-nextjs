import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Tag } from 'lucide-react'
import { getFeaturedProducts } from '@/services/products.service'
import ProductGrid from '@/components/products/ProductGrid'

export const metadata = {
  title: 'Karisma Store - Belanja Kebutuhan Keluarga Terlengkap & Terpercaya',
  description: 'Temukan ribuan produk pilihan kebutuhan ibu, bayi, makanan, minuman dan kebutuhan harian dengan harga terbaik di Karisma Store.',
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8)

  // Select top 6 categories for quick cards
  const topCategories = [
    { code: 'MNM', name: 'Susu & Minuman', icon: '🥛', color: 'from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200' },
    { code: 'POPOK', name: 'Popok & Bayi', icon: '👶', color: 'from-pink-500/10 to-pink-500/5 text-pink-700 border-pink-200' },
    { code: 'PLKPN', name: 'Perlengkapan Bayi', icon: '🍼', color: 'from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200' },
    { code: 'MKN', name: 'Makanan & Biskuit', icon: '🍪', color: 'from-orange-500/10 to-orange-500/5 text-orange-700 border-orange-200' },
    { code: 'HEALTH', name: 'Kesehatan & Obat', icon: '💊', color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200' },
    { code: 'SCINCARE', name: 'Perawatan Kulit', icon: '✨', color: 'from-purple-500/10 to-purple-500/5 text-purple-700 border-purple-200' },
  ]

  const featuredBrands = [
    'MORINAGA', 'RELLIABLE', 'WYETH', 'LACTACYD', 'SENSI', 'LUSTY BUNNY', 'CHERIS', 'YUPI'
  ]

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-teal-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Koleksi Lebih dari 5.700+ Produk Asli & Terlengkap
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Kebutuhan Keluarga <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Mudah, Cepat & Terpercaya
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl leading-relaxed">
                Belanja susu formula, popok bayi, perlengkapan anak, dan kebutuhan pokok keluarga dengan harga hemat langsung dari Karisma Store.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-gray-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all hover:scale-105"
                >
                  <span>Mulai Belanja Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/products?jenis=MNM"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md hover:bg-white/10 transition-all"
                >
                  <Tag className="h-4 w-4 text-emerald-300" />
                  Lihat Susu & Nutrisi
                </Link>
              </div>

              {/* Badges Counter */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-800/60 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">5.700+</p>
                  <p className="text-xs text-emerald-200/70">Pilihan Produk</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">100%</p>
                  <p className="text-xs text-emerald-200/70">Produk Asli</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">Cepat</p>
                  <p className="text-xs text-emerald-200/70">Proses Kirim</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl shadow-black/40">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-emerald-950/50">
                  <img
                    src="https://images.unsplash.com/photo-1550572017-edd951b55104?w=700&auto=format&fit=crop&q=80"
                    alt="Karisma Store Highlight"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 rounded-xl bg-gray-900/80 backdrop-blur-md px-3 py-1.5 text-xs text-white">
                    ⭐ Pilihan Utama Ibu & Anak
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Promo Hari Ini</span>
                  <h3 className="text-lg font-bold text-white">Hemat Kebutuhan Bayi & Balita</h3>
                  <p className="text-xs text-emerald-100/70 leading-relaxed">
                    Dapatkan penawaran terbaik untuk produk susu Morinaga, Wyeth, dan aneka botol perlengkapan Reliable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATEGORI POPULER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kategori Populer</h2>
            <p className="text-xs sm:text-sm text-gray-500">Pilih kategori produk kebutuhan Anda</p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {topCategories.map((cat) => (
            <Link
              key={cat.code}
              href={`/products?jenis=${cat.code}`}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border bg-gradient-to-b transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cat.color}`}
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-xs font-bold text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PRODUK UNGGULAN (Real Data from Supabase) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Zap className="h-3.5 w-3.5" />
              Produk Pilihan
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Paling Diminati Pelanggan</h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Katalog Lengkap <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 4. MEREK BRAND POPULER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Merek Ternama di Karisma Store</h3>
            <p className="text-xs text-gray-500">Hanya menjual produk berkualitas dari produsen terpercaya</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {featuredBrands.map((brand) => (
              <Link
                key={brand}
                href={`/products?merek=${encodeURIComponent(brand)}`}
                className="rounded-full border border-gray-200 bg-gray-50/80 px-5 py-2 text-xs font-bold text-gray-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
