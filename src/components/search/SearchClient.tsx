'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search, X, Clock, Trash2, ArrowRight,
  TrendingUp, Sparkles, Filter, Package
} from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { ProductItem } from '@/services/products.service'
import { getSearchSuggestions } from '@/services/products.service'

const SEARCH_HISTORY_KEY = 'karisma_search_history'

interface SearchClientProps {
  initialQuery: string
  initialProducts: ProductItem[]
  totalCount: number
}

export default function SearchClient({
  initialQuery,
  initialProducts,
  totalCount,
}: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialQuery)
  const [history, setHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history pencarian dari localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch {
      setHistory([])
    }
  }, [])

  // Simpan query ke history saat search dilakukan
  const saveToHistory = (term: string) => {
    const trimmed = term.trim()
    if (!trimmed || trimmed.length < 2) return

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())
      const updated = [trimmed, ...filtered].slice(0, 10)
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save search history', e)
      }
      return updated
    })
  }

  // Hapus 1 item history
  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation()
    setHistory((prev) => {
      const updated = prev.filter((h) => h !== item)
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  // Hapus seluruh history
  const clearAllHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch {}
  }

  // Live Auto-Rekomendasi saat mengetik (debounced)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const list = await getSearchSuggestions(query)
        setSuggestions(list)
        setShowSuggestions(list.length > 0)
      } finally {
        setLoadingSuggestions(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  // Submit pencarian
  const executeSearch = (searchTerm: string) => {
    const term = searchTerm.trim()
    setShowSuggestions(false)
    if (term) {
      saveToHistory(term)
      router.push(`/search?q=${encodeURIComponent(term)}`)
    } else {
      router.push('/search')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(query)
  }

  // Rekomendasi pencarian populer
  const popularKeywords = [
    'Kopi ABC', 'Gula Pasir', 'Indomie Goreng', 'Morinaga', 'Popok MamyPoko',
    'Royale', 'Daia', 'Minyak Goreng', 'Teh Pucuk'
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">
      {/* ── HEADER SEARCH BOX ────────────────────────────── */}
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 text-center tracking-tight mb-2">
          Pencarian Produk Grosir
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 text-center mb-6">
          Cari dari ribuan produk kebutuhan toko dengan cepat. Mendukung pencarian kosakata bebas dan multi-varian.
        </p>

        {/* Input Bar */}
        <div className="relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true)
              }}
              placeholder="Ketik nama produk, varian, atau kode (misal: abc kopi, gula pasir 1kg)..."
              className="w-full rounded-2xl border-2 border-emerald-600/60 bg-white py-3.5 pl-12 pr-24 text-sm font-medium text-slate-900 shadow-lg shadow-emerald-600/5 transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSuggestions([])
                  setShowSuggestions(false)
                  inputRef.current?.focus()
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Submit Button */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-600 p-2 text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
              title="Cari"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* ── DROPDOWN AUTO REKOMENDASI ────────────────── */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl animate-fade-up">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Rekomendasi Produk
              </div>
              <div className="divide-y divide-gray-100">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(s)
                      executeSearch(s)
                    }}
                    className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{s}</span>
                    <Search className="h-3.5 w-3.5 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIWAYAT PENCARIAN (SEARCH HISTORY) ───────────── */}
        {history.length > 0 && (
          <div className="mt-4 rounded-2xl border border-gray-200/80 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Riwayat Pencarian Anda</span>
              </div>
              <button
                type="button"
                onClick={clearAllHistory}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                Hapus Semua
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setQuery(item)
                    executeSearch(item)
                  }}
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={(e) => removeHistoryItem(e, item)}
                    className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PENCARIAN POPULER ────────────────────────────── */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            Populer:
          </span>
          {popularKeywords.map((kw, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(kw)
                executeSearch(kw)
              }}
              className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* ── HASIL PENCARIAN ─────────────────────────────────── */}
      <div className="mt-10 border-t border-gray-200 pt-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {initialQuery ? `Hasil Pencarian untuk "${initialQuery}"` : 'Semua Katalog Produk'}
            </h2>
            <p className="text-xs text-slate-500">
              Ditemukan <span className="font-bold text-emerald-700">{totalCount}</span> produk yang cocok
            </p>
          </div>
          {initialQuery && (
            <Link
              href="/products"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Buka Katalog Lengkap <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {initialProducts.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center max-w-lg mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4 text-slate-400">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Produk Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Tidak ada produk yang cocok dengan kata kunci &quot;{initialQuery}&quot;. Coba periksa ejaan kata atau gunakan nama umum (seperti &quot;kopi&quot;, &quot;susu&quot;, &quot;gula&quot;, &quot;popok&quot;).
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  executeSearch('')
                }}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Reset Pencarian
              </button>
              <Link
                href="/products"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
            {initialProducts.map((product) => (
              <ProductCard key={product.kodeitem} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
