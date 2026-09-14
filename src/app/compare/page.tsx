'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GitCompare, Trash2, ShoppingCart, Star, Check, X, ArrowRight } from 'lucide-react'
import { formatRupiah } from '@/lib/utils/format'
import { addToCart } from '@/services/cart.service'

interface CompareProduct {
  kodeitem: string
  namabarang: string
  hargajual: number
  hargacoret?: number
  gambar?: string
  satuan?: string
  stok?: number
  kategori?: string
  rating?: number
}

// Sample initial products to show rich comparison on first visit if none saved in localStorage
const DEFAULT_COMPARE_PRODUCTS: CompareProduct[] = [
  {
    kodeitem: 'MNM-001',
    namabarang: 'Morinaga Chil Kid Gold 800g Vanilla',
    hargajual: 185000,
    hargacoret: 210000,
    satuan: 'Kaleng',
    stok: 24,
    kategori: 'Susu & Minuman',
    rating: 4.9,
  },
  {
    kodeitem: 'MNM-002',
    namabarang: 'S-26 Procal Gold Tahap 3 900g',
    hargajual: 310000,
    hargacoret: 345000,
    satuan: 'Kaleng',
    stok: 12,
    kategori: 'Susu & Minuman',
    rating: 4.8,
  },
  {
    kodeitem: 'MNM-003',
    namabarang: 'Bebelac 3 Madu 800g Nutricia',
    hargajual: 145000,
    hargacoret: 160000,
    satuan: 'Box',
    stok: 35,
    kategori: 'Susu & Minuman',
    rating: 4.7,
  },
]

export default function ComparePage() {
  const [products, setProducts] = useState<CompareProduct[]>([])
  const [addedNotice, setAddedNotice] = useState<string | null>(null)

  useEffect(() => {
    // Load from localStorage if available
    try {
      const stored = localStorage.getItem('clicon_compare')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed)
          return
        }
      }
    } catch {
      // fallback
    }
    setProducts(DEFAULT_COMPARE_PRODUCTS)
  }, [])

  const handleRemove = (kodeitem: string) => {
    const updated = products.filter((p) => p.kodeitem !== kodeitem)
    setProducts(updated)
    try {
      localStorage.setItem('clicon_compare', JSON.stringify(updated))
    } catch {}
  }

  const handleAddToCart = async (item: CompareProduct) => {
    await addToCart(
      {
        kodeitem: item.kodeitem,
        namabarang: item.namabarang,
        hargajual1: item.hargajual,
        satuan: item.satuan || 'PCS',
        gambar: item.gambar,
        stok: item.stok || 10,
      } as any,
      1
    )
    setAddedNotice(`"${item.namabarang}" berhasil ditambahkan ke keranjang!`)
    setTimeout(() => setAddedNotice(null), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F2F4F5] pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#5F6C72]">
            <Link href="/" className="hover:text-[#FA8232] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#191C1F] font-semibold">Compare Products</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191C1F] tracking-tight">
              Bandingkan Produk (Compare)
            </h1>
            <p className="text-xs text-[#5F6C72] mt-1">
              Bandingkan fitur, harga, dan ketersediaan stok hingga 4 produk sekaligus.
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={() => {
                setProducts([])
                localStorage.removeItem('clicon_compare')
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="h-4 w-4" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {/* Notice toast */}
        {addedNotice && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 shadow-xs animate-fade-in">
            <span>{addedNotice}</span>
            <Link href="/cart" className="underline text-emerald-900 font-bold ml-4">
              Lihat Keranjang
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3EB] text-[#FA8232] mx-auto mb-4">
              <GitCompare className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#191C1F]">Daftar Perbandingan Kosong</h3>
            <p className="text-xs text-[#5F6C72] mt-1 max-w-md mx-auto mb-6 leading-relaxed">
              Anda belum menambahkan produk ke daftar perbandingan. Jelajahi katalog dan klik ikon compare pada produk untuk membandingkan.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-[#FA8232] px-6 py-3 text-xs font-bold text-white hover:bg-[#E07328] transition-colors"
            >
              <span>Jelajahi Produk</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-xs">
                <tbody>
                  {/* Row 1: Product Header / Image / Title */}
                  <tr className="border-b border-gray-200">
                    <td className="w-48 p-4 font-bold text-[#5F6C72] bg-gray-50/70">
                      Produk
                    </td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-6 text-center relative align-top">
                        <button
                          onClick={() => handleRemove(item.kodeitem)}
                          title="Hapus dari perbandingan"
                          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <div className="flex flex-col items-center space-y-3">
                          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gray-50 border border-gray-100 p-2">
                            {item.gambar ? (
                              <Image
                                src={item.gambar}
                                alt={item.namabarang}
                                width={120}
                                height={120}
                                className="object-contain max-h-full max-w-full"
                              />
                            ) : (
                              <span className="text-4xl">🍼</span>
                            )}
                          </div>
                          <Link
                            href={`/products/${item.kodeitem}`}
                            className="font-bold text-sm text-[#191C1F] hover:text-[#FA8232] line-clamp-2 max-w-[200px]"
                          >
                            {item.namabarang}
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 2: Price */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/70">
                      Harga
                    </td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center">
                        <div className="font-extrabold text-base text-[#2DA5F3]">
                          {formatRupiah(item.hargajual)}
                        </div>
                        {item.hargacoret && item.hargacoret > item.hargajual && (
                          <div className="text-xs text-[#929FA5] line-through">
                            {formatRupiah(item.hargacoret)}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Row 3: Rating */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/70">
                      Rating Ulasan
                    </td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[#FA8232]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-bold text-xs text-[#191C1F]">
                            {item.rating || 4.8}
                          </span>
                          <span className="text-[#929FA5] text-[11px]">(50+ ulasan)</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 4: Category */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/70">
                      Kategori
                    </td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center text-[#475156] font-medium">
                        {item.kategori || 'Susu Formula'}
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: Stock Status */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/70">
                      Status Stok
                    </td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[#2DB224] font-bold text-xs">
                          <Check className="h-3.5 w-3.5" />
                          <span>Tersedia ({item.stok || 20} unit)</span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 6: Kemasan / Satuan */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/70">
                      Kemasan / Satuan
                    </td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center text-[#5F6C72]">
                        {item.satuan || 'Pcs'}
                      </td>
                    ))}
                  </tr>

                  {/* Row 7: Action (Add to cart) */}
                  <tr>
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/70">
                      Aksi
                    </td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-6 text-center">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="inline-flex w-full max-w-[180px] items-center justify-center gap-2 rounded-md bg-[#FA8232] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#E07328] transition-colors shadow-sm"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>Tambah Keranjang</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
