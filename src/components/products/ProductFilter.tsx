'use client'

import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Filter, RotateCcw } from 'lucide-react'
import type { CategoryItem, BrandItem } from '@/services/categories.service'

interface ProductFilterProps {
  categories: CategoryItem[]
  brands: BrandItem[]
}

export default function ProductFilter({ categories, brands }: ProductFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentJenis = searchParams.get('jenis') || ''
  const currentMerek = searchParams.get('merek') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const currentSearch = searchParams.get('search') || ''

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // Reset to page 1 on filter
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    router.push(pathname)
  }

  const hasActiveFilters = currentJenis || currentMerek || currentSearch || currentSort !== 'newest'

  return (
    <div className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
          <Filter className="h-4 w-4 text-emerald-600" />
          <span>Filter Produk</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {/* Sort */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Urutkan
          </label>
          <select
            value={currentSort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga: Terendah ke Tertinggi</option>
            <option value="price_desc">Harga: Tertinggi ke Terendah</option>
            <option value="name_asc">Nama Produk (A - Z)</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Kategori
          </label>
          <select
            value={currentJenis}
            onChange={(e) => handleFilterChange('jenis', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Merek Brand
          </label>
          <select
            value={currentMerek}
            onChange={(e) => handleFilterChange('merek', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            <option value="">Semua Merek</option>
            {brands.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
