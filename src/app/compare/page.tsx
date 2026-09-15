'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  GitCompare, Trash2, ShoppingCart, Star, Check, X,
  ArrowRight, Search, Plus, Loader2, Trophy
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils/format'
import { addToCart } from '@/services/cart.service'
import { createClient } from '@/lib/supabase/client'

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

const MAX_COMPARE = 4

export default function ComparePage() {
  const [products, setProducts] = useState<CompareProduct[]>([])
  const [addedNotice, setAddedNotice] = useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CompareProduct[]>([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('clicon_compare')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Save to localStorage when products change
  useEffect(() => {
    try {
      localStorage.setItem('clicon_compare', JSON.stringify(products))
    } catch {}
  }, [products])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('tbl_item')
          .select('kodeitem, namaitem, hargajual1, stok, satuan, jenis')
          .ilike('namaitem', `%${searchQuery.trim()}%`)
          .eq('statusjual', 'Y')
          .limit(8)

        const mapped: CompareProduct[] = (data || []).map((item: any) => ({
          kodeitem: item.kodeitem,
          namabarang: item.namaitem,
          hargajual: item.hargajual1 || 0,
          satuan: item.satuan || 'PCS',
          stok: item.stok || 0,
          kategori: item.jenis || 'Umum',
        }))

        // Filter out already-added products
        const filtered = mapped.filter(
          (r) => !products.some((p) => p.kodeitem === r.kodeitem)
        )

        setSearchResults(filtered)
        setShowDropdown(true)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery, products])

  const handleAddFromSearch = (product: CompareProduct) => {
    if (products.length >= MAX_COMPARE) {
      alert(`Maksimal ${MAX_COMPARE} produk dapat dibandingkan sekaligus.`)
      return
    }
    setProducts((prev) => [...prev, product])
    setSearchQuery('')
    setShowDropdown(false)
    setSearchResults([])
  }

  const handleRemove = (kodeitem: string) => {
    setProducts((prev) => prev.filter((p) => p.kodeitem !== kodeitem))
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
    setAddedNotice(`"${item.namabarang}" ditambahkan ke keranjang!`)
    setTimeout(() => setAddedNotice(null), 3000)
  }

  // Find cheapest price index
  const cheapestIdx = products.length > 1
    ? products.reduce((minIdx, p, idx, arr) => p.hargajual < arr[minIdx].hargajual ? idx : minIdx, 0)
    : -1

  return (
    <div className="min-h-screen bg-[#F2F4F5] pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#5F6C72]">
            <Link href="/" className="hover:text-[#FA8232] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#191C1F] font-semibold">Bandingkan Produk</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191C1F] tracking-tight">
              Bandingkan Produk
            </h1>
            <p className="text-xs text-[#5F6C72] mt-1">
              Bandingkan harga, stok, dan spesifikasi hingga {MAX_COMPARE} produk sekaligus.
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={() => {
                setProducts([])
                localStorage.removeItem('clicon_compare')
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1.5 self-start shrink-0 mt-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {/* Search & Add Product */}
        <div className="mb-6">
          <div ref={searchRef} className="relative max-w-lg">
            <div className={`flex items-center gap-2 rounded-xl bg-white border shadow-sm px-4 py-3 transition-all ${
              products.length >= MAX_COMPARE ? 'opacity-50 pointer-events-none' : 'border-gray-200 focus-within:border-[#FA8232] focus-within:ring-2 focus-within:ring-[#FA8232]/10'
            }`}>
              {searching ? (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin shrink-0" />
              ) : (
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={products.length >= MAX_COMPARE
                  ? `Maksimal ${MAX_COMPARE} produk tercapai`
                  : `Cari produk untuk dibandingkan... (${products.length}/${MAX_COMPARE})`
                }
                disabled={products.length >= MAX_COMPARE}
                className="flex-1 text-sm text-[#191C1F] placeholder:text-gray-400 outline-none bg-transparent"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setShowDropdown(false) }} className="text-gray-300 hover:text-gray-500">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl bg-white border border-gray-200 shadow-xl max-h-72 overflow-y-auto">
                {searchResults.length === 0 && !searching && (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    Produk tidak ditemukan. Coba kata kunci lain.
                  </div>
                )}
                {searchResults.map((item) => (
                  <button
                    key={item.kodeitem}
                    onClick={() => handleAddFromSearch(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#191C1F] truncate">{item.namabarang}</p>
                      <p className="text-[11px] text-[#5F6C72]">{item.satuan} · Stok: {item.stok}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-[#2DA5F3]">{formatRupiah(item.hargajual)}</p>
                      <div className="flex items-center justify-end gap-1 text-[#FA8232] mt-0.5">
                        <Plus className="h-3 w-3" />
                        <span className="text-[10px] font-bold">Tambah</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-[11px] text-[#77878F] mt-2 ml-1">
            Ketik nama produk, lalu klik untuk menambahkan ke perbandingan.
          </p>
        </div>

        {/* Added to cart notice */}
        {addedNotice && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 shadow-sm">
            <span>✓ {addedNotice}</span>
            <Link href="/cart" className="underline text-emerald-900 font-bold ml-4">
              Lihat Keranjang
            </Link>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3EB] text-[#FA8232] mx-auto mb-4">
              <GitCompare className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#191C1F]">Daftar Perbandingan Kosong</h3>
            <p className="text-xs text-[#5F6C72] mt-1.5 max-w-md mx-auto mb-6 leading-relaxed">
              Gunakan kotak pencarian di atas untuk mencari produk dan menambahkannya ke perbandingan.
              Kamu juga bisa klik ikon compare ⊕ pada halaman produk.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-[#FA8232] px-6 py-3 text-xs font-bold text-white hover:bg-[#E07328] transition-colors"
            >
              <span>Jelajahi Produk</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Comparison Table */}
        {products.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-xs">
                <tbody>
                  {/* Row 1: Product Header */}
                  <tr className="border-b border-gray-100">
                    <td className="w-44 p-4 font-bold text-[#5F6C72] bg-gray-50/80 align-top">
                      <span>Produk</span>
                      <p className="text-[11px] text-gray-400 font-normal mt-0.5">
                        {products.length}/{MAX_COMPARE} produk
                      </p>
                    </td>
                    {products.map((item, idx) => (
                      <td key={item.kodeitem} className="p-5 text-center relative align-top">
                        <button
                          onClick={() => handleRemove(item.kodeitem)}
                          title="Hapus dari perbandingan"
                          className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        {/* Cheapest badge */}
                        {idx === cheapestIdx && products.length > 1 && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
                              <Trophy className="h-3 w-3" />
                              Terbaik
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col items-center space-y-3 pt-4">
                          <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2">
                            {item.gambar ? (
                              <Image
                                src={item.gambar}
                                alt={item.namabarang}
                                width={110}
                                height={110}
                                className="object-contain max-h-full max-w-full"
                              />
                            ) : (
                              <span className="text-4xl">📦</span>
                            )}
                          </div>
                          <Link
                            href={`/products/${item.kodeitem}`}
                            className="font-bold text-sm text-[#191C1F] hover:text-[#FA8232] line-clamp-2 max-w-[180px] leading-tight"
                          >
                            {item.namabarang}
                          </Link>
                          <span className="text-[11px] text-gray-400 font-mono">{item.kodeitem}</span>
                        </div>
                      </td>
                    ))}
                    {/* Add more slot */}
                    {products.length < MAX_COMPARE && (
                      <td className="p-5 text-center align-top">
                        <div className="flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#FA8232] hover:text-[#FA8232] transition-colors cursor-pointer gap-2"
                          onClick={() => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()}
                        >
                          <Plus className="h-8 w-8" />
                          <span className="text-xs font-semibold">Tambah Produk</span>
                        </div>
                      </td>
                    )}
                  </tr>

                  {/* Row 2: Price */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/80">Harga</td>
                    {products.map((item, idx) => (
                      <td key={item.kodeitem} className={`p-4 text-center ${idx === cheapestIdx && products.length > 1 ? 'bg-emerald-50/40' : ''}`}>
                        <div className={`font-extrabold text-base ${idx === cheapestIdx && products.length > 1 ? 'text-emerald-600' : 'text-[#2DA5F3]'}`}>
                          {formatRupiah(item.hargajual)}
                        </div>
                        {item.hargacoret && item.hargacoret > item.hargajual && (
                          <div className="text-xs text-gray-400 line-through mt-0.5">{formatRupiah(item.hargacoret)}</div>
                        )}
                        {idx === cheapestIdx && products.length > 1 && (
                          <div className="text-[10px] font-bold text-emerald-600 mt-1">✓ Harga Terendah</div>
                        )}
                      </td>
                    ))}
                    {products.length < MAX_COMPARE && <td />}
                  </tr>

                  {/* Row 3: Rating */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/80">Rating Ulasan</td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[#FA8232]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-bold text-xs text-[#191C1F]">{item.rating || 4.8}</span>
                          <span className="text-[#929FA5] text-[11px]">(50+)</span>
                        </div>
                      </td>
                    ))}
                    {products.length < MAX_COMPARE && <td />}
                  </tr>

                  {/* Row 4: Category */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/80">Kategori</td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center text-[#475156] font-medium">
                        {item.kategori || 'Umum'}
                      </td>
                    ))}
                    {products.length < MAX_COMPARE && <td />}
                  </tr>

                  {/* Row 5: Stock Status */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/80">Status Stok</td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center">
                        {(item.stok || 0) > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[#2DB224] font-bold text-xs">
                            <Check className="h-3.5 w-3.5" />
                            <span>Tersedia ({item.stok} unit)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 font-bold text-xs">
                            <X className="h-3.5 w-3.5" />
                            <span>Habis</span>
                          </span>
                        )}
                      </td>
                    ))}
                    {products.length < MAX_COMPARE && <td />}
                  </tr>

                  {/* Row 6: Satuan */}
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/80">Kemasan / Satuan</td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-4 text-center text-[#5F6C72]">
                        {item.satuan || 'Pcs'}
                      </td>
                    ))}
                    {products.length < MAX_COMPARE && <td />}
                  </tr>

                  {/* Row 7: Action */}
                  <tr>
                    <td className="p-4 font-bold text-[#5F6C72] bg-gray-50/80">Aksi</td>
                    {products.map((item) => (
                      <td key={item.kodeitem} className="p-5 text-center">
                        <div className="flex flex-col gap-2 items-center">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={(item.stok || 0) === 0}
                            className="inline-flex w-full max-w-[180px] items-center justify-center gap-2 rounded-md bg-[#FA8232] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#E07328] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Tambah Keranjang</span>
                          </button>
                          <Link
                            href={`/products/${item.kodeitem}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5F6C72] hover:text-[#FA8232] transition-colors"
                          >
                            <span>Lihat Detail</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    ))}
                    {products.length < MAX_COMPARE && <td />}
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
